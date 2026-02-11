<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Faculty
        $totalFaculty = Faculty::count();

        // 2. Licensed Faculty (Assuming licenseCode is used, or check logical rule)
        // Check if `licenseCode` is not null or empty/zero if that's the rule
        // Or check `professional_license` string if that's used.
        // Based on FacultyController reference data, `e5_ref_professional_license` exists.
        // We'll count where licenseCode is NOT null or empty.
        $licensedFaculty = Faculty::whereNotNull('licenseCode')
            ->where('licenseCode', '!=', '')
            ->count();

        // 3. Employment Status
        // Group by `fullTimeCode`.
        // Codes usually: 1=Full Time, 2=Part Time (Need to verify mapping)
        // E5FullTimePartTimeSeeder typically has codes.
        // We'll group by code and map to labels.
        $employmentStats = Faculty::select('fullTimeCode', DB::raw('count(*) as count'))
            ->groupBy('fullTimeCode')
            ->pluck('count', 'fullTimeCode');

        // Map codes to simplistic "Full Time" vs "Part Time" for the chart
        // Assuming '1' is Full Time, others are Part Time/Contractual
        // For accurate mapping, we should query the reference table, but for now:
        // 1: Full-time permanent? 
        // We'll fetch the reference map to be sure.
        $ftPtRef = DB::table('e5_ref_full_time_part_time')->pluck('description', 'code');
        
        $fullTimeCount = 0;
        $partTimeCount = 0;

        foreach ($employmentStats as $code => $count) {
            $desc = $ftPtRef[$code] ?? '';
            // Simple heuristic based on known seeding or description
            if (stripos($desc, 'full-time') !== false) {
                $fullTimeCount += $count;
            } else {
                $partTimeCount += $count;
            }
        }

        // 4. Qualifications (Highest Degree)
        // Group by `highestDegree` (or dictionary code `degreeCode`?)
        // Faculty model has `degree` (string) and maybe `degreeCode`? 
        // Step 990 showed `degree` and `bachelorsCode`, `mastersCode`, `doctorateCode`.
        // It didn't show `input_degree_code` unless `degree` IS the code?
        // Wait, `FacultyController` uses `highestDegree` ref table.
        // Let's check `e5_ref_highest_degree` usage.
        // Faculty model has `degree` field.
        
        // We will group by the `degree` text if it's stored as text, or try to map.
        // Let's use `degree` column from `faculties` table.
        $qualificationStats = Faculty::select('degree', DB::raw('count(*) as count'))
            ->whereNotNull('degree')
            ->where('degree', '!=', '')
            ->groupBy('degree')
            ->get();
            
        // Map to standard categories for the UI (Doctorate, Masters, Bachelors)
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
        // Group by `loadCode` or `teachingLoad` status?
        // Verify Faculty model fields: `loadCode`.
        // Mapping: 1=Regular, 2=Overload, 3=Underload (Hypothetical, need to check Seeder)
        // Let's fetch the reference map.
        $loadRef = DB::table('e5_ref_teaching_load')->pluck('description', 'code');
        $loadStats = Faculty::select('loadCode', DB::raw('count(*) as count'))
            ->groupBy('loadCode')
            ->pluck('count', 'loadCode');

        $regularLoad = 0;
        $overload = 0;
        $underload = 0;

        foreach ($loadStats as $code => $count) {
            $desc = $loadRef[$code] ?? ''; // e.g. "Full Load", "Overload"
            if (stripos($desc, 'overload') !== false) {
                $overload += $count;
            } elseif (stripos($desc, 'regular') !== false || stripos($desc, 'normal') !== false || stripos($desc, 'full') !== false) {
                $regularLoad += $count;
            } else {
                // Assume underload or checking description
                $underload += $count;
            }
        }

        // 6. Employment Trends (Line Graph)
        // Group by `joined_year` and `fullTimeCode`
        $trendData = Faculty::select('joined_year', 'fullTimeCode', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'fullTimeCode')
            ->orderBy('joined_year')
            ->get();

        $years = $trendData->pluck('joined_year')->unique()->values()->all();
        
        // Define Categories and Colors
        $categories = [
            1 => ['label' => 'full-time employee HEI.', 'color' => '#10b981'], // Emerald-500
            2 => ['label' => 'half-time employee HEI.', 'color' => '#3b82f6'], // Blue-500
            3 => ['label' => 'Student employee', 'color' => '#f59e0b'],       // Amber-500
            4 => ['label' => 'Teaching Fellow', 'color' => '#8b5cf6'],        // Violet-500
            5 => ['label' => 'part-time', 'color' => '#ef4444'],              // Red-500
            9 => ['label' => 'Not known', 'color' => '#6b7280'],              // Gray-500
        ];

        // Calculate Total Faculty per Year
        $totalSeriesData = [];
        foreach ($years as $year) {
            $count = $trendData->where('joined_year', $year)->sum('count');
            $totalSeriesData[] = $count;
        }

        // Add Total Faculty Series
        $series[] = [
            'name' => 'Total Faculty',
            'color' => '#000000', // Black for visibility
            'data' => $totalSeriesData
        ];

        foreach ($categories as $code => $meta) {
            $dataPoints = [];
            foreach ($years as $year) {
                // Find count for this year and code
                $record = $trendData->where('joined_year', $year)->where('fullTimeCode', $code)->first();
                $dataPoints[] = $record ? $record->count : 0;
            }
            $series[] = [
                'name' => $meta['label'],
                'color' => $meta['color'],
                'data' => $dataPoints
            ];
        }

        return Inertia::render('dashboard', [
            'overview' => [
                'totalFaculty' => $totalFaculty,
                'licensedFaculty' => $licensedFaculty,
                'employment' => [
                    'fullTime' => $fullTimeCount,
                    'partTime' => $partTimeCount,
                ],
                'qualifications' => array_values(array_filter($qualifications, fn($q) => $q['count'] > 0)), // Only show relevant
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
            // Pass raw 'dataSets' structure if we want to keep term switching logic, 
            // but normally we query by term. 
            // For now, we'll populate '1st Sem' with real data and '2nd Sem' with zeros/mock or same.
            // Responsive to user request "utilize all on the Faculty on make connection data base".
        ]);
    }
}
