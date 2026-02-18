<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get years that actually have faculty data
        $availableYears = Faculty::select('joined_year')
            ->whereNotNull('joined_year')
            ->where('joined_year', '!=', '')
            ->distinct()
            ->orderBy('joined_year', 'desc')
            ->pluck('joined_year');

        // Default to the most recent year with actual faculty data
        $defaultYear = $availableYears->first() ?? 'All Years';
        $selectedYear = $request->input('year', $defaultYear);

        // Base Query Scope
        $filter = function ($query) use ($selectedYear) {
            if ($selectedYear && $selectedYear !== 'All Years') {
                $query->where('joined_year', $selectedYear);
            }
        };

        // 1. Total Faculty
        $totalFaculty = Faculty::where($filter)->count();

        // 2. Licensed Faculty
        $licensedFaculty = Faculty::where($filter)
            ->whereNotNull('licenseCode')
            ->where('licenseCode', '!=', '')
            ->count();

        // 3. Employment Status
        $employmentStats = Faculty::where($filter)
            ->select('fullTimeCode', DB::raw('count(*) as count'))
            ->groupBy('fullTimeCode')
            ->pluck('count', 'fullTimeCode');

        // Map codes
        $ftPtRef = DB::table('e5_ref_full_time_part_time')->pluck('description', 'code');
        $fullTimeCount = 0;
        $partTimeCount = 0;

        foreach ($employmentStats as $code => $count) {
            $desc = $ftPtRef[$code] ?? '';
            if (stripos($desc, 'full-time') !== false) {
                $fullTimeCount += $count;
            } else {
                $partTimeCount += $count;
            }
        }

        // 4. Qualifications
        $qualificationStats = Faculty::where($filter)
            ->select('degree', DB::raw('count(*) as count'))
            ->whereNotNull('degree')
            ->where('degree', '!=', '')
            ->groupBy('degree')
            ->get();

        $qualifications = [
            ['label' => 'Doctorate', 'count' => 0, 'color' => 'bg-purple-500', 'text' => 'text-purple-600'],
            ['label' => 'Masters', 'count' => 0, 'color' => 'bg-blue-500', 'text' => 'text-blue-600'],
            ['label' => 'Bachelors', 'count' => 0, 'color' => 'bg-emerald-500', 'text' => 'text-emerald-600'],
            ['label' => 'Others', 'count' => 0, 'color' => 'bg-gray-500', 'text' => 'text-gray-600'],
        ];

        foreach ($qualificationStats as $stat) {
            $desc = strtolower($stat->degree);
            if (str_contains($desc, 'doctor') || str_contains($desc, 'phd')) {
                $qualifications[0]['count'] += $stat->count;
            } elseif (str_contains($desc, 'master') || str_contains($desc, 'ma') || str_contains($desc, 'ms')) {
                $qualifications[1]['count'] += $stat->count;
            } elseif (str_contains($desc, 'bachelor') || str_contains($desc, 'bs') || str_contains($desc, 'ba')) {
                $qualifications[2]['count'] += $stat->count;
            } else {
                $qualifications[3]['count'] += $stat->count;
            }
        }

        // 5. Teaching Load
        $loadRef = DB::table('e5_ref_teaching_load')->pluck('description', 'code');
        $loadStats = Faculty::where($filter)
            ->select('loadCode', DB::raw('count(*) as count'))
            ->groupBy('loadCode')
            ->pluck('count', 'loadCode');

        $regularLoad = 0;
        $overload = 0;
        $underload = 0;

        foreach ($loadStats as $code => $count) {
            $desc = $loadRef[$code] ?? '';
            if (stripos($desc, 'overload') !== false) {
                $overload += $count;
            } elseif (stripos($desc, 'regular') !== false || stripos($desc, 'normal') !== false || stripos($desc, 'full') !== false) {
                $regularLoad += $count;
            } else {
                $underload += $count;
            }
        }

        // 6. Employment Trends (Line Graph)
        // Trends are usually historical, but if we filter by a specific year, a trend line might be boring (single point).
        // However, usually dashboards show trends *up to* the selected year or for the selected year's context.
        // User request: "fix function on academicYear... get real data".
        // If I filter trends by ONE year, line graph becomes a dot.
        // Maybe trends should ignore the filter OR filter *up to* the year?
        // Or maybe display filtering is only for the "Cards" and "Donuts".
        // Let's filter the MAIN stats by year.
        // For trends, let's keep it ALL years to show context, OR maybe filter if requested.
        // Usually dashboards show "Current Status" (Filtered) vs "Trends" (Historical).
        // I will keep trends UNFILTERED for now as it makes more sense for a "Trend" graph,
        // unless filtered by a range.

        $trendData = Faculty::select('joined_year', 'fullTimeCode', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'fullTimeCode')
            ->orderBy('joined_year')
            ->get();

        $years = $trendData->pluck('joined_year')->unique()->values()->all();

        $categories = [
            1 => ['label' => 'full-time employee HEI.', 'color' => '#10b981'],
            2 => ['label' => 'half-time employee HEI.', 'color' => '#3b82f6'],
            3 => ['label' => 'Student employee', 'color' => '#f59e0b'],
            4 => ['label' => 'Teaching Fellow', 'color' => '#8b5cf6'],
            5 => ['label' => 'part-time', 'color' => '#ef4444'],
            9 => ['label' => 'Not known', 'color' => '#6b7280'],
        ];

        $totalSeriesData = [];
        foreach ($years as $year) {
            $count = $trendData->where('joined_year', $year)->sum('count');
            $totalSeriesData[] = $count;
        }

        $series = [];
        $series[] = [
            'name' => 'Total Faculty',
            'color' => '#000000',
            'data' => $totalSeriesData
        ];

        foreach ($categories as $code => $meta) {
            $dataPoints = [];
            foreach ($years as $year) {
                $record = $trendData->where('joined_year', $year)->where('fullTimeCode', $code)->first();
                $dataPoints[] = $record ? $record->count : 0;
            }
            $series[] = [
                'name' => $meta['label'],
                'color' => $meta['color'],
                'data' => $dataPoints
            ];
        }

        // 7. Gender Stats
        $genderCounts = Faculty::where($filter)
            ->select('genderCode', DB::raw('count(*) as count'))
            ->whereIn('genderCode', ['1', '2'])
            ->groupBy('genderCode')
            ->pluck('count', 'genderCode');

        $genderStats = [
            'male' => $genderCounts['1'] ?? 0,
            'female' => $genderCounts['2'] ?? 0,
        ];

        // 8. Status Stats
        $statusCounts = Faculty::where($filter)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $statusStats = [
            'updated' => $statusCounts['Updated'] ?? 0,
            'notUpdated' => $statusCounts['Not Updated'] ?? 0,
        ];

        return Inertia::render('dashboard', [
            'overview' => [
                'totalFaculty' => $totalFaculty,
                'licensedFaculty' => $licensedFaculty,
                'employment' => [
                    'fullTime' => $fullTimeCount,
                    'partTime' => $partTimeCount,
                ],
                'gender' => $genderStats,
                'status' => $statusStats,
                'qualifications' => array_values(array_filter($qualifications, fn($q) => $q['count'] > 0)),
                'teachingLoad' => [
                    'regular' => $regularLoad,
                    'overload' => $overload,
                    'underload' => $underload,
                ],
                'employmentTrends' => [
                    'years' => $years,
                    'series' => $series
                ]
            ],
            'selectedYear' => $selectedYear, // Pass back to UI
            'availableYears' => $availableYears,
        ]);
    }
}
