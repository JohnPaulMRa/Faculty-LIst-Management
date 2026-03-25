<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\FacultyE5;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->hei_id) {
            return Inertia::render('dashboard', [
                'overview' => [
                    'totalFaculty' => 0,
                    'licensedFaculty' => 0,
                    'employment' => ['fullTime' => 0, 'partTime' => 0],
                    'gender' => ['male' => 0, 'female' => 0, 'unknown' => 0],
                    'status' => ['updated' => 0, 'notUpdated' => 0],
                    'qualifications' => [],
                    'teachingLoad' => ['regular' => 0, 'overload' => 0, 'underload' => 0],
                    'employmentTrends' => ['years' => [], 'series' => []]
                ],
                'selectedYear' => 'All Years',
                'availableYears' => collect([]),
            ]);
        }
        $heiId = $user->hei_id;

        // Get years that actually have faculty data from both tables
        $yearsE2 = Faculty::select('joined_year')->where('hei_id', $heiId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');
        $yearsE5 = FacultyE5::select('joined_year')->where('hei_id', $heiId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');

        $availableYears = $yearsE2->concat($yearsE5)
            ->unique()
            ->sortDesc()
            ->values();

        // Default to the most recent year with actual faculty data
        $defaultYear = $availableYears->first() ?? 'All Years';
        $selectedYear = $request->input('year', $defaultYear);

        // Base Query Scopes
        $filterE2 = function ($query) use ($selectedYear, $heiId) {
            $query->where('hei_id', $heiId);
            if ($selectedYear && $selectedYear !== 'All Years') {
                $query->where('joined_year', $selectedYear);
            }
        };

        $filterE5 = function ($query) use ($selectedYear, $heiId) {
            $query->where('hei_id', $heiId);
            if ($selectedYear && $selectedYear !== 'All Years') {
                $query->where('joined_year', $selectedYear);
            }
        };

        // 1. Total Faculty
        $totalE2 = Faculty::where($filterE2)->count();
        $totalE5 = FacultyE5::where($filterE5)->count();
        $totalFaculty = $totalE2 + $totalE5;

        // 2. Licensed Faculty (Only E5 reliably has license_code)
        // E2 doesn't have license column anymore. Assume 0 or check if 'degree' implies license? No.
        $licensedFaculty = FacultyE5::where($filterE5)
            ->whereNotNull('license_code')
            ->where('license_code', '!=', '')
            ->count();

        // 3. Employment Status
        // E2: 'employment' (Part-time, Full-time string)
        // E5: 'ft_pt_code' (Code) -> Map to Full/Part

        $fullTimeCount = 0;
        $partTimeCount = 0;

        // E2 Stats
        $e2Employment = Faculty::where($filterE2)
            ->select('employment', DB::raw('count(*) as count'))
            ->groupBy('employment')
            ->pluck('count', 'employment');

        foreach ($e2Employment as $type => $count) {
            if (stripos($type ?? '', 'full') !== false)
                $fullTimeCount += $count;
            else
                $partTimeCount += $count; // Catches all others including null
        }

        // E5 Stats
        $e5Employment = FacultyE5::where($filterE5)
            ->select('ft_pt_code', DB::raw('count(*) as count'))
            ->groupBy('ft_pt_code')
            ->pluck('count', 'ft_pt_code');

        $ftPtRef = DB::table('e5_ref_full_time_part_time')->pluck('description', 'code');

        foreach ($e5Employment as $code => $count) {
            $desc = $ftPtRef[$code] ?? '';
            if (stripos($desc, 'full-time') !== false) {
                $fullTimeCount += $count;
            } else {
                $partTimeCount += $count; // Catches unknowns
            }
        }

        // 4. Qualifications
        // E2: degree (string)
        // E5: highest_degree_code (code)
        $qualifications = [
            ['label' => 'Doctorate', 'count' => 0, 'color' => 'bg-purple-500', 'text' => 'text-purple-600'],
            ['label' => 'Masters', 'count' => 0, 'color' => 'bg-blue-500', 'text' => 'text-blue-600'],
            ['label' => 'Bachelors', 'count' => 0, 'color' => 'bg-emerald-500', 'text' => 'text-emerald-600'],
            ['label' => 'Others', 'count' => 0, 'color' => 'bg-gray-500', 'text' => 'text-gray-600'],
        ];

        // E2 - Include NULLs
        $e2Quals = Faculty::where($filterE2)
            ->select('degree', DB::raw('count(*) as count'))
            ->groupBy('degree')
            ->get();

        foreach ($e2Quals as $stat) {
            $desc = strtolower($stat->degree ?? '');
            if (str_contains($desc, 'doctor') || str_contains($desc, 'phd'))
                $qualifications[0]['count'] += $stat->count;
            elseif (str_contains($desc, 'master') || str_contains($desc, 'ma') || str_contains($desc, 'ms'))
                $qualifications[1]['count'] += $stat->count;
            elseif (str_contains($desc, 'bachelor') || str_contains($desc, 'bs') || str_contains($desc, 'ba'))
                $qualifications[2]['count'] += $stat->count;
            else
                $qualifications[3]['count'] += $stat->count;
        }

        // E5 - Include NULLs
        $e5Quals = FacultyE5::where($filterE5)
            ->select('highest_degree_code', DB::raw('count(*) as count'))
            ->groupBy('highest_degree_code')
            ->get();

        $degreeRef = DB::table('e5_ref_highest_degree')->pluck('description', 'code');

        foreach ($e5Quals as $stat) {
            $desc = strtolower($degreeRef[$stat->highest_degree_code] ?? '');
            if (str_contains($desc, 'doctor') || str_contains($desc, 'phd'))
                $qualifications[0]['count'] += $stat->count;
            elseif (str_contains($desc, 'master') || str_contains($desc, 'ma') || str_contains($desc, 'ms'))
                $qualifications[1]['count'] += $stat->count;
            elseif (str_contains($desc, 'bachelor') || str_contains($desc, 'bs') || str_contains($desc, 'ba'))
                $qualifications[2]['count'] += $stat->count;
            else
                $qualifications[3]['count'] += $stat->count;
        }

        // 5. Teaching Load (E5 Only mostly)
        // E2 doesn't have load info distinctively mapped to overload/regular easily unless in 'employment' which is vague
        // So rely on E5 for now, or just 0 for E2.
        $loadRef = DB::table('e5_ref_teaching_load')->pluck('description', 'code');
        $loadStats = FacultyE5::where($filterE5)
            ->select('teaching_load_code', DB::raw('count(*) as count'))
            ->groupBy('teaching_load_code')
            ->pluck('count', 'teaching_load_code');

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

        // 6. Employment Trends
        // Aggregate E2 + E5 by year and full-time/part-time status

        $trendDataE2 = Faculty::where('hei_id', $heiId)
            ->select('joined_year', 'employment', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'employment')
            ->get();

        $trendDataE5 = FacultyE5::where('hei_id', $heiId)
            ->select('joined_year', 'ft_pt_code', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'ft_pt_code')
            ->get();

        $years = $trendDataE2->pluck('joined_year')->merge($trendDataE5->pluck('joined_year'))->unique()->sort()->values()->all();

        // Prepare Data Structure
        $schoolType = $user->hei->type ?? 'private';
        $isPublic = strtolower($schoolType) === 'public';

        if ($isPublic) {
            $categories = [
                'GROUP A1' => ['label' => 'GROUP A1', 'color' => '#10b981'],
                'GROUP A2' => ['label' => 'GROUP A2', 'color' => '#3b82f6'],
                'GROUP A3' => ['label' => 'GROUP A3', 'color' => '#f59e0b'],
                'GROUP B'  => ['label' => 'GROUP B', 'color' => '#ef4444'],
                'GROUP C1' => ['label' => 'GROUP C1', 'color' => '#8b5cf6'],
                'GROUP C2' => ['label' => 'GROUP C2', 'color' => '#ec4899'],
                'GROUP C3' => ['label' => 'GROUP C3', 'color' => '#06b6d4'],
                'GROUP D'  => ['label' => 'GROUP D', 'color' => '#f97316'],
                'GROUP E'  => ['label' => 'GROUP E', 'color' => '#6b7280'],
            ];
        } else {
            $categories = [
                1 => ['label' => 'full-time employee HEI.', 'color' => '#10b981'],
                2 => ['label' => 'half-time employee HEI.', 'color' => '#3b82f6'],
                3 => ['label' => 'Student employee', 'color' => '#f59e0b'],
                4 => ['label' => 'Teaching Fellow', 'color' => '#8b5cf6'],
                5 => ['label' => 'part-time', 'color' => '#ef4444'],
                9 => ['label' => 'Not known', 'color' => '#6b7280'],
            ];
        }

        $totalSeriesData = [];
        foreach ($years as $year) {
            $countE2 = $trendDataE2->where('joined_year', $year)->sum('count');
            $countE5 = $trendDataE5->where('joined_year', $year)->sum('count');
            $totalSeriesData[] = $countE2 + $countE5;
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
                if ($isPublic) {
                    // For Public, we only care about Faculty (E2) import_group
                    // But FacultyE5 also has import_group, so we can combine if needed
                    $e2Count = $trendDataE2->where('joined_year', $year)
                        ->where('import_group', $code)
                        ->sum('count');
                    $e5Count = $trendDataE5->where('joined_year', $year)
                        ->where('import_group', $code)
                        ->sum('count');
                    $dataPoints[] = $e2Count + $e5Count;
                } else {
                    // E5 Count by ft_pt_code
                    $e5Count = $trendDataE5->where('joined_year', $year)->where('ft_pt_code', $code)->sum('count');

                    // E2 Count (Map strings to code for backward compatibility or if mixed)
                    $e2Count = 0;
                    $e2Records = $trendDataE2->where('joined_year', $year);
                    foreach ($e2Records as $rec) {
                        $emp = strtolower($rec->employment);
                        $mappedCode = 9;
                        if (str_contains($emp, 'full'))
                            $mappedCode = 1;
                        elseif (str_contains($emp, 'part'))
                            $mappedCode = 5;

                        if ($mappedCode === $code) {
                            $e2Count += $rec->count;
                        }
                    }
                    $dataPoints[] = $e5Count + $e2Count;
                }
            }
            $series[] = [
                'name' => $meta['label'],
                'color' => $meta['color'],
                'data' => $dataPoints
            ];
        }

        // 7. Gender Stats (E5 Only for now as E2 has no gender column)
        $genderCounts = FacultyE5::where($filterE5)
            ->select('gender_code', DB::raw('count(*) as count'))
            ->groupBy('gender_code')
            ->pluck('count', 'gender_code');

        $male = $genderCounts['1'] ?? 0;
        $female = $genderCounts['2'] ?? 0;
        $unknownGender = $totalFaculty - ($male + $female); // Calculate unknown by subtracting known genders from Total

        $genderStats = [
            'male' => $male,
            'female' => $female,
            'unknown' => max(0, $unknownGender),
        ];

        // 8. Status Stats
        // Calculate Completed/Updated explicitly
        // Count 'Updated' status. Treat EVERYTHING else (including NULL) as Not Updated.

        $completedE2 = Faculty::where($filterE2)->where('status', 'Updated')->count();
        $completedE5 = FacultyE5::where($filterE5)->where('status', 'Updated')->count();

        $completed = $completedE2 + $completedE5;

        // Not Updated is simply Total - Completed
        $notUpdated = $totalFaculty - $completed;

        $statusStats = [
            'updated' => $completed,
            'notUpdated' => max(0, $notUpdated),
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
            'schoolType' => $schoolType,
        ]);
    }
}
