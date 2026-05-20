<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use App\Models\HeiSubmission;
use App\Models\Faculty;
use App\Models\FacultyE5;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\RefDisciplineGroup;
use App\Models\RefMajorDiscipline;
use App\Models\RefSpecificDiscipline;
use App\Models\DisProgram;
use Illuminate\Database\QueryException;
use function redirect;
use function collect;
use function response;
use function now;

class AdminController extends Controller
{
    public function storeHei(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hei_code' => 'nullable|string|max:50|unique:heis,hei_code',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'type' => 'required|in:Public,Private',
        ]);

        $data = $validated;
        $data['hei_code'] = $data['hei_code'] ?: null;
        $data['address'] = $data['address'] ?: null;
        $data['contact_number'] = $data['contact_number'] ?: null;
        $data['email'] = $data['email'] ?: null;

        Hei::create($data);

        return redirect()->back()->with('success', 'HEI created successfully.');
    }

    public function updateHei(Request $request, int $id)
    {
        $hei = Hei::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hei_code' => 'nullable|string|max:50|unique:heis,hei_code,' . $hei->id,
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'type' => 'required|in:Public,Private',
        ]);

        $data = $validated;
        $data['hei_code'] = $data['hei_code'] ?: null;
        $data['address'] = $data['address'] ?: null;
        $data['contact_number'] = $data['contact_number'] ?: null;
        $data['email'] = $data['email'] ?: null;

        $hei->update($data);

        return redirect()->back()->with('success', 'HEI updated successfully.');
    }

    public function destroyHei(int $id)
    {
        $hei = Hei::findOrFail($id);
        $hei->delete();

        return redirect()->back()->with('success', 'HEI deleted successfully.');
    }

    public function dashboard(Request $request)
    {
        $academicYears = HeiSubmission::select('academic_year')
            ->distinct()
            ->orderByDesc('academic_year')
            ->pluck('academic_year');
            
        $defaultYear = $academicYears->first();
        
        $yearDiscipline = $request->input('year_discipline', $defaultYear);
        $yearHei = $request->input('year_hei', $defaultYear);

        $distributionData = $this->getDashboardDistributionData($yearDiscipline);

        return Inertia::render('Admin/AdminDashboard', [
            'heis' => $this->getDashboardHeis(),
            'recentActivities' => $this->getDashboardRecentActivities(),
            'recentSubmissions' => $this->getRecentSubmissions(),
            'distributionData' => $distributionData['all'],
            'totals' => $distributionData['totals'],
            'statusData' => $distributionData['statusData'],
            'heiDistributionData' => $this->getHeiDistributionData($yearHei),
            'disciplineUpdates' => $this->getDashboardDisciplineUpdates(),
            'academicYears' => $academicYears,
            'selectedYearDiscipline' => $yearDiscipline,
            'selectedYearHei' => $yearHei
        ]);
    }

    private function getDashboardHeis()
    {
        $heisQuery = Hei::withCount(['faculties', 'facultiesE5'])
            ->orderBy('name')
            ->get();

        return $heisQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count + $s->faculties_e5_count,
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ];
        });
    }


    private function getRecentSubmissions()
    {
        // Get only the latest submission ID for each HEI that has submitted
        $latestSubmissionIds = HeiSubmission::where('status', 'submitted')
            ->select(DB::raw('MAX(id) as id'))
            ->groupBy('hei_id')
            ->pluck('id');

        return HeiSubmission::with('hei')
            ->whereIn('id', $latestSubmissionIds)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'hei_id' => $submission->hei_id,
                    'hei_name' => $submission->hei_name ?: ($submission->hei ? $submission->hei->name : 'Unknown HEI'),
                    'academic_year' => $submission->academic_year,
                    'total_faculty' => $submission->total_faculty,
                    'type' => $submission->hei ? $submission->hei->type : 'Private',
                    'submitted_by' => $submission->submitted_by,
                    'time' => $submission->created_at->diffForHumans(),
                    'date' => $submission->created_at->format('M d, Y h:i A'),
                ];
            });
    }

    private function getDashboardRecentActivities()
    {
        return HeiSubmission::latest()
            ->take(5)
            ->get()
            ->map(function ($submission) {
                return [
                    'user' => $submission->submitted_by,
                    'action' => 'Submitted faculty list for ' . $submission->academic_year,
                    'time' => $submission->created_at->diffForHumans(),
                ];
            });
    }

    private function getDashboardDistributionData(?string $academicYear = null)
    {
        $distribution = [];
        $totals = [
            'baccalaureate' => 0,
            'master' => 0,
            'doctorate' => 0,
            'preBaccalaureate' => 0,
            'unclassified' => 0,
            'overall' => 0
        ];

        $disciplineMap = DB::table('specific_discipline')
            ->join('discipline_group', 'specific_discipline.group_code', '=', 'discipline_group.code')
            ->select(['specific_discipline.code as spec_code', 'discipline_group.description as group_name'])
            ->get()
            ->keyBy('spec_code')
            ->toArray();

        $getLevel = function ($code) {
            if (!$code || $code == '999' || $code == '000') return 'unclassified';
            $codeStr = (string)$code;
            if (str_starts_with($codeStr, '1') || str_starts_with($codeStr, '2') || str_starts_with($codeStr, '3') || str_starts_with($codeStr, '4')) return 'preBaccalaureate';
            if (str_starts_with($codeStr, '5') || str_starts_with($codeStr, '6')) return 'baccalaureate';
            if (str_starts_with($codeStr, '8')) return 'master';
            if (str_starts_with($codeStr, '7') || str_starts_with($codeStr, '9')) return 'doctorate';
            return 'unclassified';
        };

        $getDisciplineCodeE2 = function ($faculty, $level) {
            if ($level === 'baccalaureate' && !empty($faculty->discipline_bachelors)) return $faculty->discipline_bachelors;
            if ($level === 'master' && !empty($faculty->discipline_masters)) return $faculty->discipline_masters;
            if ($level === 'doctorate' && !empty($faculty->discipline_doctorate)) return $faculty->discipline_doctorate;
            return $faculty->discipline_load_1 ?? null;
        };

        $getDisciplineCodeE5 = function ($faculty, $level) {
            if ($level === 'baccalaureate' && !empty($faculty->bachelors_code)) return $faculty->bachelors_code;
            if ($level === 'master' && !empty($faculty->masters_code)) return $faculty->masters_code;
            if ($level === 'doctorate' && !empty($faculty->doctorate_code)) return $faculty->doctorate_code;
            return $faculty->discipline_code ?? null;
        };

        $processFaculty = function ($facultyList, $isE5) use (&$distribution, &$totals, $disciplineMap, $getLevel, $getDisciplineCodeE2, $getDisciplineCodeE5) {
            foreach ($facultyList as $f) {
                $degreeCode = $isE5 ? ($f->highest_degree_code ?? null) : ($f->degree ?? null);
                $level = $getLevel($degreeCode);
                
                // Group unclassified/others into a generic 'unclassified' category for the chart
                // but ensure they are included in the overall totals.
                $chartLevel = ($level === 'preBaccalaureate') ? 'preBaccalaureate' : $level;

                $specCode = $isE5 ? $getDisciplineCodeE5($f, $level) : $getDisciplineCodeE2($f, $level);
                
                $groupName = '#N/A';
                if ($specCode && isset($disciplineMap[$specCode])) {
                    $groupName = trim($disciplineMap[$specCode]->group_name);
                }

                $groupKey = strtolower($groupName);
                if (!isset($distribution[$groupKey])) {
                    $distribution[$groupKey] = [
                        'name' => $groupName,
                        'baccalaureate' => 0,
                        'master' => 0,
                        'doctorate' => 0,
                        'preBaccalaureate' => 0,
                        'unclassified' => 0,
                        'count' => 0,
                    ];
                }

                $distribution[$groupKey][$level]++;
                $distribution[$groupKey]['count']++;
                $totals[$level]++;
                $totals['overall']++;
            }
        };

        $submissionsQuery = DB::table('hei_submissions')
            ->select('hei_id')
            ->whereRaw('LOWER(status) = ?', ['submitted']);
            
        if ($academicYear) {
            $submissionsQuery->where('academic_year', $academicYear);
        }
        
        $validHeiIds = $submissionsQuery->distinct()->pluck('hei_id')->toArray();

        // Fetch faculty belonging to submitted HEIs for the selected academic year
        $facultyE2 = DB::table('faculty_e2')->whereIn('hei_id', $validHeiIds)->get();
        $facultyE5 = DB::table('faculty_e5')->whereIn('hei_id', $validHeiIds)->get();

        $processFaculty($facultyE2, false);
        $processFaculty($facultyE5, true);

        // Always show ALL discipline groups, even those with 0 faculty
        $allGroups = DB::table('discipline_group')->orderBy('description')->pluck('description');
        foreach ($allGroups as $groupName) {
            $groupKey = strtolower(trim($groupName));
            if (!isset($distribution[$groupKey])) {
                $distribution[$groupKey] = [
                    'name' => trim($groupName),
                    'baccalaureate' => 0,
                    'master' => 0,
                    'doctorate' => 0,
                    'preBaccalaureate' => 0,
                    'unclassified' => 0,
                    'count' => 0,
                ];
            }
        }

        $distributionArray = array_values($distribution);
        usort($distributionArray, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        return [
            'all' => $distributionArray,
            'totals' => $totals,
            'statusData' => [
                ['name' => 'Active', 'value' => Hei::where('is_active', true)->count(), 'color' => '#16a34a'],
                ['name' => 'Inactive', 'value' => Hei::where('is_active', false)->count(), 'color' => '#dc2626'],
            ]
        ];
    }

    private function getHeiDistributionData(?string $academicYear = null)
    {
        $heiData = [];
        
        $submissionsQuery = DB::table('hei_submissions')
            ->select('hei_id')
            ->whereRaw('LOWER(status) = ?', ['submitted']);
            
        if ($academicYear) {
            $submissionsQuery->where('academic_year', $academicYear);
        }
        
        $validHeiIds = $submissionsQuery->distinct()->pluck('hei_id')->toArray();
        
        $heis = DB::table('heis')->whereIn('id', $validHeiIds)->get()->keyBy('id');
        
        $facultyE2 = DB::table('faculty_e2')->whereIn('hei_id', $validHeiIds)->get();
        $facultyE5 = DB::table('faculty_e5')->whereIn('hei_id', $validHeiIds)->get();

        $getLevel = function ($code) {
             if (!$code || $code == '999' || $code == '000') return 'Unclassified';
             $codeStr = (string)$code;
             if (str_starts_with($codeStr, '1') || str_starts_with($codeStr, '2') || str_starts_with($codeStr, '3') || str_starts_with($codeStr, '4')) return 'Pre-Baccalaureate';
             if (str_starts_with($codeStr, '5') || str_starts_with($codeStr, '6')) return 'Baccalaureate';
             if (str_starts_with($codeStr, '8')) return 'Master';
             if (str_starts_with($codeStr, '7') || str_starts_with($codeStr, '9')) return 'Doctorate';
             return 'Unclassified';
        };

        $process = function($list, $isE5) use (&$heiData, $heis, $getLevel) {
            foreach($list as $f) {
                $hei = $heis[$f->hei_id] ?? null;
                if (!$hei) continue;
                
                $heiCode = $hei->hei_code ?? 'N/A';
                $degreeCode = $isE5 ? ($f->highest_degree_code ?? null) : ($f->degree ?? null);
                $level = $getLevel($degreeCode);
                
                // Gender mapping
                $genderVal = $isE5 ? ($f->gender_code ?? null) : ($f->gender ?? null);
                $gender = 'MALE'; // Default
                if ($genderVal == '2' || strtolower($genderVal) == 'female' || $genderVal == 'F') {
                    $gender = 'FEMALE';
                } else if ($genderVal == '1' || strtolower($genderVal) == 'male' || $genderVal == 'M') {
                    $gender = 'MALE';
                } else {
                    // Based on previous tinker, e2_genders was ["1","2"] and e5_genders was ["2","1"]
                    // If it's 1 or 2, we can assume 1=Male, 2=Female
                    if ($genderVal == '1') $gender = 'MALE';
                    else if ($genderVal == '2') $gender = 'FEMALE';
                }

                if (!isset($heiData[$heiCode])) {
                    $heiData[$heiCode] = [
                        'code' => $heiCode,
                        'name' => $hei->name,
                        'degrees' => []
                    ];
                }

                if (!isset($heiData[$heiCode]['degrees'][$level])) {
                    $heiData[$heiCode]['degrees'][$level] = [
                        'FEMALE' => 0,
                        'MALE' => 0,
                        'total' => 0
                    ];
                }

                $heiData[$heiCode]['degrees'][$level][$gender]++;
                $heiData[$heiCode]['degrees'][$level]['total']++;
            }
        };

        $process($facultyE2, false);
        $process($facultyE5, true);

        // Sort by hei code
        ksort($heiData);

        return array_values($heiData);
    }

    private function getDashboardDisciplineUpdates()
    {
        return RefSpecificDiscipline::latest()
            ->take(5)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->code,
                    'user' => 'System Admin',
                    'action' => 'Added/Updated ' . $d->description,
                    'type' => 'discipline',
                    'time' => $d->updated_at->diffForHumans(),
                ];
            });
    }

    private function normalizeProgramName($name)
    {
        if (!$name) return "";
        $name = trim($name);

        $mappings = [
            'BS' => 'Bachelor of Science',
            'AB' => 'Bachelor of Arts',
            'MS' => 'Master of Science',
            'MA' => 'Master of Arts',
            'B.S.' => 'Bachelor of Science',
            'A.B.' => 'Bachelor of Arts',
            'M.S.' => 'Master of Science',
            'M.A.' => 'Master of Arts',
        ];
        
        $upperName = strtoupper($name);
        foreach ($mappings as $abbr => $full) {
            $upperAbbr = strtoupper($abbr);
            if (str_starts_with($upperName, $upperAbbr)) {
                $len = strlen($abbr);
                if (strlen($name) == $len || in_array($name[$len], [' ', '.', ',', '-'])) {
                    $name = $full . substr($name, $len);
                    break;
                }
            }
        }

        return $name;
    }

    private function getReferenceData()
    {
        return [
            'gender' => DB::table('e5_ref_gender')->select(['code', 'description as desc'])->get(),
            'fullTimePartTime' => DB::table('e5_ref_full_time_part_time')->select(['code', 'description as desc'])->get(),
            'highestDegree' => DB::table('e5_ref_highest_degree')->select(['code', 'description as desc'])->get(),
            'professionalLicense' => DB::table('e5_ref_professional_license')->select(['code', 'description as desc'])->get(),
            'tenure' => DB::table('e5_ref_tenure')->select(['code', 'description as desc'])->get(),
            'tenureE2' => DB::table('e2_ref_tenure')->select(['code', 'description as desc'])->get(),
            'facultyRank' => DB::table('e5_ref_faculty_rank')->select(['code', 'description as desc'])->get(),
            'teachingLoad' => DB::table('e5_ref_teaching_load')->select(['code', 'description as desc'])->get(),
            'annualSalary' => DB::table('e5_ref_annual_salary')->select(['code', 'description as desc'])->get(),
            'groupDiscipline' => DB::table('major_discipline')
                ->select(['code', 'description as desc'])
                ->orderBy('code')
                ->get(),
            'disciplines' => DB::table('specific_discipline')
                ->leftJoin('dis_programs', 'specific_discipline.code', '=', 'dis_programs.specific_discipline_code')
                ->select([
                    'specific_discipline.code',
                    DB::raw('COALESCE(dis_programs.program_name, specific_discipline.description) as `desc`'),
                    'specific_discipline.major_code',
                    'specific_discipline.group_code'
                ])
                ->orderBy('specific_discipline.code')
                ->get(),
            // All disciplines under Education Science and Teacher Training (group_code = 14)
            'educationDisciplines' => DB::table('specific_discipline')
                ->leftJoin('dis_programs', 'specific_discipline.code', '=', 'dis_programs.specific_discipline_code')
                ->select([
                    'specific_discipline.code',
                    DB::raw('COALESCE(dis_programs.program_name, specific_discipline.description) as `desc`')
                ])
                ->where(function ($q) {
                    $q->where('specific_discipline.group_code', '14')
                        ->orWhere('specific_discipline.code', 'like', '14%');
                })
                ->orderBy('desc')
                ->get(),
        ];
    }

    public function facultyList(Request $request)
    {
        $schools = $this->getSchools($request);
        $referenceData = $this->getReferenceData();

        $faculty = [];
        $submittedYears = [];
        if ($request->has('hei_id') && $request->hei_id) {
            $heiId = $request->hei_id;
            $search = $request->input('search');
            $facultyE2 = $this->getFacultyE2($heiId, $search);
            $facultyE5 = $this->getFacultyE5($heiId, $search);

            $faculty = collect($facultyE2)->concat($facultyE5)->sortBy('name')->values();

            // Get all academic years that have been officially submitted for this HEI
            $submittedYears = HeiSubmission::where('hei_id', $heiId)
                ->where('status', 'submitted')
                ->pluck('academic_year')
                ->unique()
                ->values()
                ->toArray();
        }

        return Inertia::render('Admin/FacultyList', [
            'heis' => $schools,
            'faculty' => $faculty,
            'submittedYears' => $submittedYears,
            'referenceData' => $referenceData,
            'filters' => $request->only(['hei_id', 'search', 'type']),
        ]);
    }

    public function disciplines(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'code');
        $direction = $request->input('direction', 'asc');
        $perPage = $request->input('entries') ?? $request->input('per_page') ?? 50;

        if ($perPage === 'all') $perPage = 9999;

        // 1. Specifics & Programs
        $specifics = DB::table('specific_discipline')
            ->leftJoin('dis_programs', 'specific_discipline.code', '=', 'dis_programs.specific_discipline_code')
            ->select([
                'specific_discipline.code',
                'specific_discipline.description as specific_name',
                'specific_discipline.group_code',
                'specific_discipline.major_code',
                'dis_programs.program_name as program',
                DB::raw("COALESCE(CONCAT('p', dis_programs.id), CONCAT('s', specific_discipline.id)) as combined_id"),
                DB::raw("'specific' as level")
            ]);

        // 2. Majors
        $majors = DB::table('major_discipline')
            ->select([
                'code',
                'description as specific_name',
                DB::raw('SUBSTRING(code, 1, 2) as group_code'),
                'code as major_code',
                DB::raw('NULL as program'),
                DB::raw("CONCAT('m', code) as combined_id"),
                DB::raw("'major' as level")
            ]);

        // UNION ALL - Removed majors to ensure count accuracy matches Excel (Program-level)
        $combined = $specifics; // Only show specifics (which include their programs)

        $query = DB::table(DB::raw("({$combined->toSql()}) as combined"))
            ->mergeBindings($combined)
            ->leftJoin('discipline_group', 'combined.group_code', '=', 'discipline_group.code')
            ->leftJoin('major_discipline', 'combined.major_code', '=', 'major_discipline.code')
            ->select([
                'combined.code',
                'combined.specific_name',
                'combined.group_code',
                'combined.major_code',
                'combined.program',
                'combined.combined_id as id',
                'combined.level',
                'discipline_group.description as group_name',
                'major_discipline.description as major_name',
            ]);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('combined.code', 'like', "%{$search}%")
                  ->orWhere('combined.specific_name', 'like', "%{$search}%")
                  ->orWhere('combined.program', 'like', "%{$search}%")
                  ->orWhere('discipline_group.description', 'like', "%{$search}%")
                  ->orWhere('major_discipline.description', 'like', "%{$search}%");
            });
        }

        $programs = $query->orderBy($sort === 'id' ? 'combined.code' : $sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $programs->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'code' => $item->code,
                'group_code' => $item->group_code,
                'major_code' => $item->major_code,
                'disciplineGroup' => $item->group_name ?? '',
                'specificMajor' => $item->major_name ?? '',
                'specificDiscipline' => $item->level === 'specific' ? $item->specific_name : '',
                'program' => $item->program ?? '',
                'level' => $item->level,
                'name' => $item->level === 'specific' ? $item->specific_name : '',
                // Restore originalData for Edit Modal
                'originalData' => [
                    'id' => $item->id,
                    'code' => $item->code,
                    'groupCode' => $item->group_code,
                    'groupName' => $item->group_name,
                    'majorCode' => $item->major_code,
                    'majorName' => $item->major_name,
                    'specificCode' => $item->code,
                    'specificDiscipline' => $item->specific_name,
                    'program' => $item->program,
                    'type' => $item->level,
                ]
            ];
        });

        // Reference data for Add/Edit forms (majors/groups)
        // Deduplicate by description to prevent multiple entries for the same name in dropdowns
        $referenceMajors = DB::table('major_discipline')->orderBy('description')->get()->unique('description');
        $referenceGroups = DB::table('discipline_group')->orderBy('description')->get()->unique('description');
        $referenceSpecifics = DB::table('specific_discipline')
            ->leftJoin('dis_programs', 'specific_discipline.code', '=', 'dis_programs.specific_discipline_code')
            ->select([
                'specific_discipline.code',
                DB::raw('COALESCE(dis_programs.program_name, specific_discipline.description) as `description`'),
                'specific_discipline.major_code',
                'dis_programs.program_name as program'
            ])
            ->orderBy('description')
            ->get();

        $formMajors = $referenceGroups->map(function ($group) use ($referenceMajors, $referenceSpecifics) {
            return [
                'code' => $group->code,
                'description' => $group->description,
                'groups' => $referenceMajors->filter(fn($m) => str_starts_with($m->code, $group->code))
                    ->map(fn($m) => [
                        'code' => $m->code,
                        'description' => $m->description,
                        'specifics' => $referenceSpecifics->filter(fn($s) => $s->major_code === $m->code)
                            ->map(fn($s) => [
                                'code' => $s->code,
                                'description' => $s->description,
                                'program' => $s->program
                            ])
                            ->values()
                    ])
                    ->values()
            ];
        });

        return Inertia::render('Admin/Disciplines', [
            'programs' => $programs,
            'disciplines' => $formMajors->values(), // Full structure for dropdowns
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page', 'entries']),
        ]);
    }
    public function storeDiscipline(Request $request)
    {
        \Log::info('storeDiscipline reached', $request->all());
        $validated = $request->validate([
            'code' => 'required|string|min:3|max:10',
            'groupName' => 'nullable|string|max:255',
            'majorName' => 'nullable|string|max:255',
            'specificDiscipline' => 'nullable|string|max:255',
            'program' => 'nullable|string|max:255',
        ]);

        \Log::info('Discipline Store Attempt:', $validated);

        $code = $validated['code'];
        $normalizedProgram = !empty($validated['program']) ? $this->normalizeProgramName($validated['program']) : null;

        // Validation check to avoid duplicate entries
        if ($normalizedProgram) {
            $exists = DisProgram::where('specific_discipline_code', $code)
                ->where('program_name', $normalizedProgram)
                ->exists();
            if ($exists) {
                // If it's an import (request likely comes from the modal), we can just skip or return success 
                // to avoid blocking the whole process, but here we keep the error to inform the user.
                // However, let's make the message more informative.
                return redirect()->back()->with('error', "Duplicate entry: The program '{$normalizedProgram}' is already registered under code {$code}. This row was skipped.");
            }
        }
        $groupName = $validated['groupName'] ?? null;
        $majorName = $validated['majorName'] ?? null;
        $specificName = $validated['specificDiscipline'] ?? null;

        try {
            $saved = false;
            if (!empty($specificName)) {
                $groupCode = substr($code, 0, 2);
                $majorPrefix6 = substr($code, 0, 6);
                $majorPrefix4 = substr($code, 0, 4);

                if (!empty($groupName)) {
                    RefDisciplineGroup::firstOrCreate(
                        ['code' => $groupCode],
                        ['description' => $groupName]
                    );
                }

                // If majorName is provided, we create it. If not, we just check if it exists in DB.
                if (!empty($majorName)) {
                    $majorCode = strlen($code) >= 6 ? $majorPrefix6 : $majorPrefix4;
                } else {
                    $majorExists6 = RefMajorDiscipline::where('code', $majorPrefix6)->exists();
                    if ($majorExists6 && strlen($code) >= 6) {
                        $majorCode = $majorPrefix6;
                    } else {
                        $majorExists4 = RefMajorDiscipline::where('code', $majorPrefix4)->exists();
                        $majorCode = $majorExists4 ? $majorPrefix4 : null;
                    }
                }

                // Update or create the specific discipline
                // If it exists but the description is just the code (placeholder), we update it.
                $specific = RefSpecificDiscipline::where('code', $code)->first();
                if ($specific) {
                    // Update if current description is empty, is just the code, or if a new description is provided
                    if (empty($specific->description) || $specific->description === $code || !empty($specificName)) {
                        $specific->update([
                            'description' => $specificName ?: ($specific->description ?: $code),
                            'slug' => Str::slug($specificName ?: $code, '_'),
                            'group_code' => $groupCode,
                            'major_code' => $majorCode ?: $specific->major_code,
                        ]);
                    }
                } else {
                    RefSpecificDiscipline::create([
                        'code' => $code,
                        'description' => $specificName ?: $code,
                        'slug' => Str::slug($specificName ?: $code, '_'),
                        'group_code' => $groupCode,
                        'major_code' => $majorCode,
                    ]);
                }

                if (!empty($validated['program'])) {
                    DisProgram::firstOrCreate([
                        'specific_discipline_code' => $code,
                        'program_name' => $this->normalizeProgramName($validated['program']),
                    ]);
                }

                $saved = true;

                // Also ensure the major discipline exists and has a proper description
                if (!empty($majorName) && strlen($code) >= 4) {
                    RefMajorDiscipline::updateOrCreate(
                        ['code' => $majorCode],
                        [
                            'description' => $majorName,
                            'slug' => Str::slug($majorName, '_'),
                        ]
                    );
                }
            } elseif (!empty($majorName)) {
                $groupCode = substr($code, 0, 2);
                if (!empty($groupName)) {
                    RefDisciplineGroup::firstOrCreate(
                        ['code' => $groupCode],
                        ['description' => $groupName]
                    );
                }

                // Save only the major discipline
                RefMajorDiscipline::firstOrCreate(
                    ['code' => $code],
                    [
                        'description' => $majorName,
                        'slug' => Str::slug($majorName, '_'),
                    ]
                );
                $saved = true;
            } elseif (!empty($validated['program'])) {
                // Code+Program only import: create specific discipline if missing, then link program
                $groupCode = substr($code, 0, 2);
                $majorCode = strlen($code) >= 4 ? substr($code, 0, 4) : null;
                
                RefSpecificDiscipline::firstOrCreate(
                    ['code' => $code],
                    [
                        'description' => $code, // Placeholder if description is missing
                        'slug' => Str::slug($code, '_'),
                        'group_code' => $groupCode,
                        'major_code' => $majorCode,
                    ]
                );
                
                DisProgram::firstOrCreate([
                    'specific_discipline_code' => $code,
                    'program_name' => $this->normalizeProgramName($validated['program']),
                ]);
                $saved = true;
            }

            if (!$saved) {
                return redirect()->back()->with('error', 'Please fill in at least the Major Discipline name, Specific Discipline name, or a Program linked to an existing code.');
            }

        } catch (QueryException $e) {
            \Log::error('Discipline Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Database error: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Discipline saved successfully.');
    }
    /**
     * Bulk store disciplines for high-performance import with strict data integrity
     */
    public function bulkStoreDiscipline(Request $request)
    {
        $rows = $request->input('rows', []);
        $report = [
            'total_excel' => count($rows),
            'total_inserted' => 0,
            'total_duplicates' => 0,
            'total_invalid' => 0,
            'errors' => [],
            'final_total' => 0
        ];

        if (empty($rows)) {
            $report['final_total'] = DB::table('dis_programs')->count();
            return response()->json(['success' => true, 'report' => $report]);
        }

        $chunks = array_chunk($rows, 500);
        $globalRowOffset = 2; // Data starts at row 2 (1-indexed + header)
        // 5. Batch Processing (Performance Rule) - Process in chunks of 500
        $chunks = array_chunk($rows, 500);
        $globalIndexOffset = 0;

        foreach ($chunks as $chunk) {
            $groups = [];
            $majors = [];
            $specifics = [];
            $programs = [];
            $chunkErrors = [];
            $chunkInvalid = 0;

            foreach ($chunk as $index => $row) {
                $currentRow = $globalRowOffset + $index;

            foreach ($chunk as $index => $row) {
                // 1. Trim and Normalize
                $code = trim($row['code'] ?? '');
                $groupName = trim($row['groupName'] ?? '');
                $majorName = trim($row['majorName'] ?? '');
                $specificName = trim($row['specificDiscipline'] ?? '');
                $programName = trim($row['program'] ?? '');

                // 2. Data Validation (Per Row)
                // Rule: Program and Discipline Group are NOT null. Code is also required for our mapping.
                if (empty($programName) || empty($groupName) || empty($code)) {
                    $chunkInvalid++;
                    $chunkErrors[] = [
                        'row' => $currentRow,
                    $report['total_invalid']++;
                    $report['errors'][] = [
                        'row' => $globalIndexOffset + $index + 2, // 1-indexed + header
                        'reason' => 'Missing required field (Code, Group, or Program)'
                    ];
                    continue;
                }

                // Normalization
                $normalizedProgram = $this->normalizeProgramName($programName);
                
                // Codes
                $groupCode = substr($code, 0, 2);
                $majorCode = (strlen($code) >= 4) ? substr($code, 0, 4) : null;

                // Collect Groups
                if ($groupName) {
                    $groups[$groupCode] = [
                        'code' => $groupCode,
                        'description' => $groupName,
                        'slug' => Str::slug($groupName, '_'),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ];
                }

                // Collect Majors
                if ($majorName && $majorCode) {
                    $majors[$majorCode] = [
                        'code' => $majorCode,
                        'description' => $majorName,
                        'slug' => Str::slug($majorName, '_'),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ];
                }

                // Collect Specifics
                $specifics[$code] = [
                    'code' => $code,
                    'description' => $specificName ?: $code,
                    'slug' => Str::slug($specificName ?: $code, '_'),
                    'group_code' => $groupCode,
                    'major_code' => $majorCode,
                    'updated_at' => now(),
                    'created_at' => now(),
                ];

                // Collect Programs
                // Note: programs array index doesn't need to be keyed by code because we insert raw rows
                $programs[] = [
                    'specific_discipline_code' => $code,
                    'program_name' => $normalizedProgram,
                    'updated_at' => now(),
                    'created_at' => now(),
                ];
            }

            // 3. Batch Processing & Transaction Safety
            if (!empty($programs) || !empty($groups) || !empty($majors) || !empty($specifics)) {
                DB::beginTransaction();
                try {
            // 6. Transaction Safety: Wrap each batch in a transaction
            try {
                DB::transaction(function () use ($groups, $majors, $specifics, $programs, &$report) {
                    // Strict Duplicate Rule: Insert if new, Ignore if duplicate
                    if (!empty($groups)) {
                        DB::table('discipline_group')->insertOrIgnore(array_values($groups));
                    }
                    if (!empty($majors)) {
                        DB::table('major_discipline')->insertOrIgnore(array_values($majors));
                    }
                    if (!empty($specifics)) {
                        DB::table('specific_discipline')->insertOrIgnore(array_values($specifics));
                    }
                    if (!empty($programs)) {
                        // insertOrIgnore handles the unique index on [specific_discipline_code, program_name]
                        $inserted = DB::table('dis_programs')->insertOrIgnore(array_values($programs));
                        $report['total_inserted'] += $inserted;
                        $report['total_duplicates'] += (count($programs) - $inserted);
                    }
                    
                    $report['total_invalid'] += $chunkInvalid;
                    $report['errors'] = array_merge($report['errors'], $chunkErrors);
                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Illuminate\Support\Facades\Log::error('Discipline bulk insert chunk failed', ['error' => $e->getMessage()]);
                    $report['total_invalid'] += count($chunk);
                    $report['errors'][] = [
                        'row' => "Batch {$globalRowOffset}-" . ($globalRowOffset + count($chunk) - 1),
                        'reason' => 'Database error during batch insert. Chunk skipped.'
                    ];
                }
            } else {
                $report['total_invalid'] += $chunkInvalid;
                $report['errors'] = array_merge($report['errors'], $chunkErrors);
            }

            $globalRowOffset += count($chunk);
                        // Unique Programs by filtering out PHP array duplicates just in case before inserting
                        // Though insertOrIgnore handles DB duplicates, PHP duplicates in same batch would be ignored by DB anyway
                        $uniquePrograms = collect($programs)->unique(function ($item) {
                            return $item['specific_discipline_code'] . '-' . $item['program_name'];
                        })->values()->all();

                        $inserted = DB::table('dis_programs')->insertOrIgnore($uniquePrograms);
                        $report['total_inserted'] += $inserted;
                        
                        // Deducting duplicates from the raw attempted count in this chunk
                        $report['total_duplicates'] += count($programs) - $inserted;
                    }
                });
            } catch (\Exception $e) {
                // If batch fails: Rollback that batch only, continue next batch
                \Log::error('Discipline Import Batch Error: ' . $e->getMessage());
                $report['errors'][] = [
                    'row' => 'Batch starting at ' . ($globalIndexOffset + 2),
                    'reason' => 'Batch failed and rolled back. DB Error: ' . $e->getMessage()
                ];
                $report['total_invalid'] += count($chunk); // Consider whole batch failed/invalid if it rolled back
            }

            $globalIndexOffset += count($chunk);
        }

        // 4. Post-Import Reconciliation
        $report['final_total'] = DB::table('dis_programs')->count();

        return response()->json([
            'success' => true, 
            'report' => $report,
            'message' => 'Successfully processed ' . count($rows) . ' records.'
        ]);
    }


    public function updateDiscipline(Request $request, string $id)
    {
        $validated = $request->validate([
            'type' => 'nullable|string|in:major,specific',
            'code' => 'nullable|string|max:10',
            'groupName' => 'nullable|string|max:255',
            'majorName' => 'nullable|string|max:255',
            'specificDiscipline' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'program' => 'nullable|string|max:255',
        ]);

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            $updated = false;

            $newCode = $validated['code'] ?? null;
            $groupName = $validated['groupName'] ?? null;
            $majorName = $validated['majorName'] ?? null;
            $specificName = $validated['specificDiscipline'] ?? $validated['description'] ?? null;
            $programName = $validated['program'] ?? null;

            // Parse ID prefix
            $prefix = substr($id, 0, 1);
            $realId = substr($id, 1);

            if ($prefix === 'p') {
                // UPDATE PROGRAM SPECIFICALLY
                $prog = DisProgram::find($realId);
                if ($prog) {
                    $prog->program_name = $this->normalizeProgramName($programName);
                    $prog->save();

                    // Also update the parent specific discipline description if provided
                    $specific = RefSpecificDiscipline::where('code', $prog->specific_discipline_code)->first();
                    if ($specific && !empty($specificName)) {
                        $specific->description = $specificName;
                        $specific->save();
                    }
                    $updated = true;
                }
            } elseif ($prefix === 's') {
                // UPDATE SPECIFIC DISCIPLINE
                $specific = RefSpecificDiscipline::find($realId);
                if ($specific) {
                    $specific->description = $specificName;
                    if ($newCode && $newCode !== $specific->code) {
                        $specific->code = $newCode;
                        $specific->group_code = substr($newCode, 0, 2);
                    }
                    $specific->save();
                    $updated = true;
                }
            } elseif ($prefix === 'm') {
                // UPDATE MAJOR DISCIPLINE
                $major = RefMajorDiscipline::where('code', $realId)->first();
                if ($major) {
                    $major->description = $majorName ?: $specificName;
                    if ($newCode && $newCode !== $major->code) {
                        $major->code = $newCode;
                    }
                    $major->save();
                    $updated = true;
                }
            }

            // Sync Groups/Majors names if they changed
            if (!empty($majorName)) {
                $mCode = $newCode ? substr($newCode, 0, 4) : (strlen($id) >= 5 && $prefix !== 'm' ? substr($realId, 0, 4) : null);
                if ($mCode) {
                    RefMajorDiscipline::updateOrCreate(
                        ['code' => $mCode],
                        ['description' => $majorName, 'slug' => Str::slug($majorName, '_')]
                    );
                }
            }

            if (!empty($groupName)) {
                $gCode = $newCode ? substr($newCode, 0, 2) : (strlen($id) >= 3 ? substr($realId, 0, 2) : null);
                if ($gCode) {
                    RefDisciplineGroup::updateOrCreate(
                        ['code' => $gCode],
                        ['description' => $groupName]
                    );
                }
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            if ($updated) {
                return redirect()->back()->with('success', 'Discipline updated successfully.');
            }
            return redirect()->back()->with('error', 'Record not found for update.');
        } catch (\Exception $e) {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            return redirect()->back()->with('error', 'Update failed: ' . $e->getMessage());
        }
    }

    public function destroyDiscipline(string $id)
    {
        try {
            // Handle new prefixed IDs (p for program, s for specific, m for major)
            if (str_starts_with($id, 'p')) {
                $numericId = substr($id, 1);
                DisProgram::where('id', $numericId)->delete();
                return redirect()->back()->with('success', 'Program deleted successfully.');
            }
            
            if (str_starts_with($id, 's')) {
                $numericId = substr($id, 1);
                RefSpecificDiscipline::where('id', $numericId)->delete();
                return redirect()->back()->with('success', 'Specific Discipline deleted successfully.');
            }

            if (str_starts_with($id, 'm')) {
                $code = substr($id, 1);
                RefMajorDiscipline::where('code', $code)->delete();
                return redirect()->back()->with('success', 'Major Discipline deleted successfully.');
            }

            // Fallback for legacy support
            $code = str_replace(['db-', 'code-'], '', $id);
            $specific = RefSpecificDiscipline::where('code', $code)->orWhere('id', $code)->first();
            if ($specific) {
                $specific->delete();
                return redirect()->back()->with('success', 'Specific Discipline deleted successfully.');
            }

            return redirect()->back()->with('error', 'Record not found.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Database error: ' . $e->getMessage());
        }
    }


    private function getSchools(Request $request)
    {
        $search = $request->input('search');

        // Get the latest submission record per HEI (true latest academic year)
        // We use a subquery to find the MAX academic_year for each HEI, then join back to get the count
        $latestSubmissions = HeiSubmission::where('status', 'submitted')
            ->whereIn(DB::raw('(hei_id, academic_year)'), function ($query) {
                $query->select('hei_id', DB::raw('MAX(academic_year)'))
                    ->from('hei_submissions')
                    ->where('status', 'submitted')
                    ->groupBy('hei_id');
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->unique('hei_id')
            ->keyBy('hei_id');


        $heisQuery = Hei::when($search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%');
        })
            ->orderBy('name')
            ->get();

        return $heisQuery->map(function ($s) use ($latestSubmissions) {
            $latestSub = $latestSubmissions[$s->id] ?? null;

            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'hei_code' => $s->hei_code,
                'faculty' => $latestSub ? (int) $latestSub->total_faculty : 0,
                'type' => $s->type,
                'academic_year' => $latestSub ? $latestSub->academic_year : 'N/A',
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ];
        });
    }




    public function heisAccounts(Request $request)
    {
        $heis = Hei::orderBy('name')->get();

        $accounts = \App\Models\User::orderBy('name')->get()->map(function ($u) {
            return [
                'id' => (int) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'hei_id' => $u->hei_id,
            ];
        });

        return Inertia::render('Admin/HeisAccounts', [
            'heis' => $heis,
            'accounts' => $accounts,
        ]);
    }

    private function getFacultyE2(int $heiId, ?string $search)
    {
        return Faculty::where('hei_id', $heiId)
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->get()
            ->map(function ($f) {
                return [
                    'id' => (string) $f->id,
                    'original_id' => $f->id,
                    'name' => $f->name,
                    'email' => $f->email,
                    'gender' => $f->gender ?? $f->sex ?? 'N/A',
                    'genderCode' => $f->gender ?? $f->sex,
                    'type' => $f->employment ?? 'Full-time',
                    'employment' => $f->employment ?? 'Full-time',
                    'submissionStatus' => (isset($f->status) && strtolower($f->status) === 'submitted') ? 'submitted' : 'pending',
                    'status' => $f->status ?? 'Not Updated', // Use actual status from DB
                    'schoolYear' => $f->joined_year ?? 'N/A',
                    'joined_year' => $f->joined_year,
                    'form_type' => 'E2',
                    'department' => $f->department ?? '',
                    'degree' => $f->degree ?? '',
                    'rank' => $f->rank ?? '',
                    'group' => $f->import_group ?? '',
                    'is_tenured' => $f->is_tenured ?? '',
                    'avatar_initials' => $f->avatar_initials ?? '?',
                ];
            });
    }

    private function getFacultyE5(int $heiId, ?string $search)
    {
        return FacultyE5::where('hei_id', $heiId)
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->get()
            ->map(function ($f) {
                return [
                    'id' => 'e5_' . $f->id,
                    'original_id' => $f->id,
                    'name' => $f->name,
                    'email' => $f->email,
                    'gender' => $f->gender_code, // Pass code for frontend lookup
                    'genderCode' => $f->gender_code,
                    'fullTimeCode' => $f->ft_pt_code,
                    'disciplineCode' => $f->discipline_code,
                    'type' => $f->employment ?? 'Full-time',
                    'employment' => $f->employment ?? 'Full-time',
                    'submissionStatus' => (isset($f->status) && strtolower($f->status) === 'submitted') ? 'submitted' : 'pending',
                    'status' => $f->status ?? 'Not Updated',
                    'schoolYear' => $f->joined_year ?? 'N/A',
                    'joined_year' => $f->joined_year,
                    'form_type' => 'E5',
                    'department' => '', // E5 might not have dept column readily available or mapped
                    'degree' => $f->highest_degree_code ?? '', // use code or lookup if needed
                    'rank' => $f->rank_code ?? '',
                    'group' => $f->import_group ?? '',
                    'is_tenured' => $f->tenure_code ?? '',
                    'avatar_initials' => $f->avatar_initials ?? '?',
                ];
            });
    }

    public function createFacultyAccount(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'hei_id' => 'required|exists:heis,id',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['username'],
            'email' => $validated['username'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            // 'role' => 'faculty', // Default is Faculty per migration or handle here if needed
            'role' => 'Faculty',
            'hei_id' => $validated['hei_id'],
        ]);

        return redirect()->back()->with('success', 'Faculty account created successfully.');
    }

    public function updateUserAccount(Request $request, int $id)
    {
        $user = \App\Models\User::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|confirmed|min:8',
            'hei_id' => 'required|exists:heis,id',
        ]);

        $data = [
            'name' => $validated['username'],
            'email' => $validated['username'],
            'hei_id' => $validated['hei_id'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'User account updated successfully.');
    }

    public function destroyUserAccount(int $id)
    {
        $user = \App\Models\User::findOrFail($id);

        // Prevent deleting self
        if ($user->id === \Illuminate\Support\Facades\Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User account deleted successfully.');
    }

    public function showFaculty(string $id)
    {
        $isE5 = str_starts_with($id, 'e5_') || str_starts_with($id, 'e5-');
        $realId = str_replace(['e5_', 'e5-', 'e2-', 'e2_'], '', $id);

        if ($isE5) {
            $faculty = FacultyE5::find($realId);
            if ($faculty) {
                // Map to formData expected by the frontend
                return response()->json([
                    'id' => $id,
                    'name' => $faculty->name,
                    'email' => $faculty->email,
                    'status' => $faculty->status ?? 'Not Updated',
                    'employment' => $faculty->employment,
                    'joined_year' => $faculty->joined_year,
                    'fullTimeCode' => $faculty->ft_pt_code,
                    'genderCode' => $faculty->gender_code,
                    'disciplineCode' => $faculty->discipline_code,
                    'degree' => $faculty->highest_degree_code,
                    'rankCode' => $faculty->rank_code,
                    'bachelorsCode' => $faculty->bachelors_code,
                    'mastersCode' => $faculty->masters_code,
                    'doctorateCode' => $faculty->doctorate_code,
                    'licenseCode' => $faculty->license_code,
                    'tenureCode' => $faculty->tenure_code,
                    'salaryCode' => $faculty->salary_range_code,
                    'loadCode' => $faculty->teaching_load_code,
                    'subjects' => $faculty->subjects,
                    'form_type' => 'E5',
                ]);
            }
        } else {
            $faculty = Faculty::find($realId);
            if ($faculty) {
                return response()->json([
                    'id' => $id,
                    'name' => $faculty->name,
                    'email' => $faculty->email,
                    'status' => $faculty->status ?? 'Not Updated',
                    'import_group' => $faculty->import_group,
                    'employment' => $faculty->employment,
                    'joined_year' => $faculty->joined_year,
                    'college' => $faculty->college,
                    'department' => $faculty->department,
                    'salary_grade' => $faculty->salary_grade,
                    'annual_salary' => $faculty->annual_salary,
                    'on_leave' => $faculty->on_leave,
                    'fte' => $faculty->fte,
                    'gender' => $faculty->gender,
                    'degree' => $faculty->degree,
                    'rank' => $faculty->rank,
                    'is_tenured' => $faculty->is_tenured,
                    'pursuing_degree' => $faculty->pursuing_degree,
                    'discipline_load_1' => $faculty->discipline_load_1,
                    'discipline_load_2' => $faculty->discipline_load_2,
                    'discipline_bachelors' => $faculty->discipline_bachelors,
                    'discipline_masters' => $faculty->discipline_masters,
                    'discipline_doctorate' => $faculty->discipline_doctorate,
                    'masters_thesis' => $faculty->masters_thesis,
                    'doctorate_dissertation' => $faculty->doctorate_dissertation,
                    'ug_lab_units' => $faculty->ug_lab_units,
                    'ug_lec_units' => $faculty->ug_lec_units,
                    'ug_total_units' => $faculty->ug_total_units,
                    'ug_lab_hours' => $faculty->ug_lab_hours,
                    'ug_lec_hours' => $faculty->ug_lec_hours,
                    'ug_total_hours' => $faculty->ug_total_hours,
                    'ug_lab_contact' => $faculty->ug_lab_contact,
                    'ug_lec_contact' => $faculty->ug_lec_contact,
                    'ug_total_contact' => $faculty->ug_total_contact,
                    'grad_lab_units' => $faculty->grad_lab_units,
                    'grad_lec_units' => $faculty->grad_lec_units,
                    'grad_total_units' => $faculty->grad_total_units,
                    'grad_lab_contact' => $faculty->grad_lab_contact,
                    'grad_lec_contact' => $faculty->grad_lec_contact,
                    'grad_total_contact' => $faculty->grad_total_contact,
                    'load_research' => $faculty->load_research,
                    'load_extension' => $faculty->load_extension,
                    'load_study' => $faculty->load_study,
                    'load_production' => $faculty->load_production,
                    'load_admin' => $faculty->load_admin,
                    'load_others' => $faculty->load_others,
                    'load_total' => $faculty->load_total,
                    'form_type' => 'E2',
                ]);
            }
        }

        return response()->json(['error' => 'Faculty not found.'], 404);
    }
}
