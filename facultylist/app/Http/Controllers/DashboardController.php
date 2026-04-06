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
            return $this->renderEmptyDashboard();
        }

        $heiId = $user->hei_id;
        $availableYears = $this->getAvailableYears($heiId);

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

        $totalE2 = Faculty::where($filterE2)->count();
        $totalE5 = FacultyE5::where($filterE5)->count();
        $totalFaculty = $totalE2 + $totalE5;

        $schoolType = $user->hei->type ?? 'private';
        $isPublic = strtolower($schoolType) === 'public';

        return Inertia::render('Faculty/dashboard', [
            'overview' => [
                'totalFaculty' => $totalFaculty,
                'licensedFaculty' => $this->getLicensedFaculty($filterE5),
                'employment' => $this->getEmploymentStats($filterE2, $filterE5),
                'gender' => $this->getGenderStats($totalFaculty, $filterE2, $filterE5),
                'status' => $this->getStatusStats($totalFaculty, $totalE2, $totalE5, $filterE2, $filterE5),
                'qualifications' => $this->getQualificationStats($filterE2, $filterE5),
                'teachingLoad' => $this->getTeachingLoadStats($filterE5),
                'employmentTrends' => $this->getEmploymentTrends($heiId, $isPublic)
            ],
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears,
            'schoolType' => $schoolType,
        ]);
    }

    private function renderEmptyDashboard()
    {
        return Inertia::render('Faculty/dashboard', [
            'overview' => [
                'totalFaculty' => 0,
                'licensedFaculty' => 0,
                'employment' => ['fullTime' => 0, 'partTime' => 0],
                'gender' => ['male' => 0, 'female' => 0, 'unknown' => 0],
                'status' => ['completed' => 0, 'noSubmission' => 0, 'notYetCompleted' => 0],
                'qualifications' => [],
                'teachingLoad' => ['regular' => 0, 'overload' => 0, 'underload' => 0],
                'employmentTrends' => ['years' => [], 'series' => []]
            ],
            'selectedYear' => 'All Years',
            'availableYears' => collect([]),
        ]);
    }

    private function getAvailableYears($heiId)
    {
        $yearsE2 = Faculty::select('joined_year')->where('hei_id', $heiId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');
        $yearsE5 = FacultyE5::select('joined_year')->where('hei_id', $heiId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');

        return $yearsE2->concat($yearsE5)->unique()->sortDesc()->values();
    }

    private function getLicensedFaculty($filterE5)
    {
        return FacultyE5::where($filterE5)
            ->whereNotNull('license_code')
            ->where('license_code', '!=', '')
            ->count();
    }

    private function getEmploymentStats($filterE2, $filterE5)
    {
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
                $partTimeCount += $count;
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
                $partTimeCount += $count;
            }
        }

        return ['fullTime' => $fullTimeCount, 'partTime' => $partTimeCount];
    }

    private function getQualificationStats($filterE2, $filterE5)
    {
        $qualifications = [
            ['label' => 'Doctorate', 'count' => 0, 'color' => 'bg-purple-500', 'text' => 'text-purple-600'],
            ['label' => 'Masters', 'count' => 0, 'color' => 'bg-blue-500', 'text' => 'text-blue-600'],
            ['label' => 'Bachelors', 'count' => 0, 'color' => 'bg-emerald-500', 'text' => 'text-emerald-600'],
            ['label' => 'Others', 'count' => 0, 'color' => 'bg-gray-500', 'text' => 'text-gray-600'],
        ];

        // E2
        $e2Quals = Faculty::where($filterE2)->select('degree', DB::raw('count(*) as count'))->groupBy('degree')->get();
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

        // E5
        $e5Quals = FacultyE5::where($filterE5)->select('highest_degree_code', DB::raw('count(*) as count'))->groupBy('highest_degree_code')->get();
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

        return array_values(array_filter($qualifications, fn($q) => $q['count'] > 0));
    }

    private function getTeachingLoadStats($filterE5)
    {
        $loadRef = DB::table('e5_ref_teaching_load')->pluck('description', 'code');
        $loadStats = FacultyE5::where($filterE5)
            ->select('teaching_load_code', DB::raw('count(*) as count'))
            ->groupBy('teaching_load_code')
            ->pluck('count', 'teaching_load_code');

        $regularLoad = 0; $overload = 0; $underload = 0;
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
        return ['regular' => $regularLoad, 'overload' => $overload, 'underload' => $underload];
    }

    private function getEmploymentTrends($heiId, $isPublic)
    {
        $trendDataE2 = Faculty::where('hei_id', $heiId)
            ->select('joined_year', 'employment', 'import_group', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'employment', 'import_group')
            ->get();

        $trendDataE5 = FacultyE5::where('hei_id', $heiId)
            ->select('joined_year', 'ft_pt_code', 'import_group', DB::raw('count(*) as count'))
            ->whereNotNull('joined_year')
            ->groupBy('joined_year', 'ft_pt_code', 'import_group')
            ->get();

        $years = $trendDataE2->pluck('joined_year')->merge($trendDataE5->pluck('joined_year'))->unique()->sort()->values()->all();

        $categories = $isPublic ? [
            'GROUP A1' => ['label' => 'GROUP A1', 'color' => '#10b981'],
            'GROUP A2' => ['label' => 'GROUP A2', 'color' => '#3b82f6'],
            'GROUP A3' => ['label' => 'GROUP A3', 'color' => '#f59e0b'],
            'GROUP B'  => ['label' => 'GROUP B', 'color' => '#ef4444'],
            'GROUP C1' => ['label' => 'GROUP C1', 'color' => '#8b5cf6'],
            'GROUP C2' => ['label' => 'GROUP C2', 'color' => '#ec4899'],
            'GROUP C3' => ['label' => 'GROUP C3', 'color' => '#06b6d4'],
            'GROUP D'  => ['label' => 'GROUP D', 'color' => '#f97316'],
            'GROUP E'  => ['label' => 'GROUP E', 'color' => '#6b7280'],
        ] : [
            1 => ['label' => 'full-time employee HEI.', 'color' => '#10b981'],
            2 => ['label' => 'half-time employee HEI.', 'color' => '#3b82f6'],
            3 => ['label' => 'Student employee', 'color' => '#f59e0b'],
            4 => ['label' => 'Teaching Fellow', 'color' => '#8b5cf6'],
            5 => ['label' => 'part-time', 'color' => '#ef4444'],
            9 => ['label' => 'Not known', 'color' => '#6b7280'],
        ];

        $series = [];
        foreach ($categories as $code => $meta) {
            $dataPoints = [];
            foreach ($years as $year) {
                if ($isPublic) {
                    $dataPoints[] = $trendDataE2->where('joined_year', $year)->where('import_group', $code)->sum('count') +
                                 $trendDataE5->where('joined_year', $year)->where('import_group', $code)->sum('count');
                } else {
                    $e5Count = $trendDataE5->where('joined_year', $year)->where('ft_pt_code', $code)->sum('count');
                    $e2Count = 0;
                    foreach ($trendDataE2->where('joined_year', $year) as $rec) {
                        $emp = strtolower($rec->employment);
                        $mappedCode = (str_contains($emp, 'full')) ? 1 : ((str_contains($emp, 'part')) ? 5 : 9);
                        if ($mappedCode === $code) $e2Count += $rec->count;
                    }
                    $dataPoints[] = $e5Count + $e2Count;
                }
            }
            $series[] = ['name' => $meta['label'], 'color' => $meta['color'], 'data' => $dataPoints];
        }

        return ['years' => $years, 'series' => $series];
    }

    private function getGenderStats($totalFaculty, $filterE2, $filterE5)
    {
        $genderCountsE5 = FacultyE5::where($filterE5)->select('gender_code', DB::raw('count(*) as count'))->groupBy('gender_code')->pluck('count', 'gender_code');
        $genderCountsE2 = Faculty::where($filterE2)->select('gender', DB::raw('count(*) as count'))->groupBy('gender')->pluck('count', 'gender');

        $male = ($genderCountsE5['1'] ?? 0) + ($genderCountsE2['1'] ?? 0);
        $female = ($genderCountsE5['2'] ?? 0) + ($genderCountsE2['2'] ?? 0);
        $unknownGender = $totalFaculty - ($male + $female);

        return ['male' => $male, 'female' => $female, 'unknown' => max(0, $unknownGender)];
    }

    private function getStatusStats($totalFaculty, $totalE2, $totalE5, $filterE2, $filterE5)
    {
        $completedE2 = Faculty::where($filterE2)->where('status', 'Completed')->count();
        $noSubmissionE2 = Faculty::where($filterE2)->where('status', 'No Submission')->count();
        $completedE5 = FacultyE5::where($filterE5)->where('status', 'Completed')->count();
        $noSubmissionE5 = FacultyE5::where($filterE5)->where('status', 'No Submission')->count();

        return [
            'completed' => $completedE2 + $completedE5,
            'noSubmission' => $noSubmissionE2 + $noSubmissionE5,
            'notYetCompleted' => max(0, $totalFaculty - ($completedE2 + $noSubmissionE2 + $completedE5 + $noSubmissionE5)),
        ];
    }
}
