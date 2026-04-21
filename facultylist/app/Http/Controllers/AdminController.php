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

    public function updateHei(Request $request, $id)
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

    public function destroyHei($id)
    {
        $hei = Hei::findOrFail($id);
        $hei->delete();

        return redirect()->back()->with('success', 'HEI deleted successfully.');
    }

    public function dashboard(Request $request)
    {
        $distributionData = $this->getDashboardDistributionData();

        return Inertia::render('Admin/AdminDashboard', [
            'heis' => $this->getDashboardHeis(),
            'recentActivities' => $this->getDashboardRecentActivities(),
            'recentSubmissions' => $this->getRecentSubmissions(),
            'distributionData' => $distributionData['all'],
            'statusData' => $distributionData['statusData'],
            'disciplineUpdates' => $this->getDashboardDisciplineUpdates(),
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

    private function getDashboardDistributionData()
    {
        $groups = DB::table('discipline_group')->orderBy('code')->get();
        $specifics = DB::table('specific_discipline')->orderBy('code')->get();

        // Count specific disciplines per group (not faculty members)
        $formatDistribution = function () use ($groups, $specifics) {
            $distribution = [];

            foreach ($groups as $group) {
                // Count all specific disciplines that belong to this group
                $groupSpecifics = $specifics->filter(function ($s) use ($group) {
                    return str_starts_with($s->code, $group->code);
                });

                $groupCount = $groupSpecifics->count();

                if ($groupCount > 0) {
                    $distribution[] = [
                        'name' => $group->description,
                        'count' => $groupCount,
                    ];
                }
            }

            // Merge duplicates with the same name (e.g. two 'General' groups in the table)
            $merged = [];
            foreach ($distribution as $item) {
                $key = strtolower(trim($item['name']));
                if (isset($merged[$key])) {
                    $merged[$key]['count'] += $item['count'];
                } else {
                    $merged[$key] = $item;
                }
            }
            $distribution = array_values($merged);

            // Sort descending by count
            usort($distribution, function ($a, $b) {
                return $b['count'] <=> $a['count'];
            });

            return $distribution;
        };

        $data = $formatDistribution();

        return [
            'all' => $data,
            'private' => $data,
            'public' => $data,
            'statusData' => [
                ['name' => 'Active', 'value' => Hei::where('is_active', true)->count(), 'color' => '#16a34a'],
                ['name' => 'Inactive', 'value' => Hei::where('is_active', false)->count(), 'color' => '#9ca3af'],
            ],
        ];
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
    private function getReferenceData()
    {
        return [
            'gender' => DB::table('e5_ref_gender')->select('code', 'description as desc')->get(),
            'fullTimePartTime' => DB::table('e5_ref_full_time_part_time')->select('code', 'description as desc')->get(),
            'highestDegree' => DB::table('e5_ref_highest_degree')->select('code', 'description as desc')->get(),
            'professionalLicense' => DB::table('e5_ref_professional_license')->select('code', 'description as desc')->get(),
            'tenure' => DB::table('e5_ref_tenure')->select('code', 'description as desc')->get(),
            'tenureE2' => DB::table('e2_ref_tenure')->select('code', 'description as desc')->get(),
            'facultyRank' => DB::table('e5_ref_faculty_rank')->select('code', 'description as desc')->get(),
            'teachingLoad' => DB::table('e5_ref_teaching_load')->select('code', 'description as desc')->get(),
            'annualSalary' => DB::table('e5_ref_annual_salary')->select('code', 'description as desc')->get(),
            'groupDiscipline' => DB::table('major_discipline')
                ->select('code', 'description as desc')
                ->orderBy('code')
                ->get(),
            'disciplines' => DB::table('specific_discipline')
                ->select('code', 'description as desc', 'major_code', 'group_code')
                ->orderBy('code')
                ->get(),
            // All disciplines under Education Science and Teacher Training (group_code = 14)
            'educationDisciplines' => DB::table('specific_discipline')
                ->select('code', 'description as desc')
                ->where(function($q) {
                    $q->where('group_code', '14')
                      ->orWhere('code', 'like', '14%');
                })
                ->orderBy('description')
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
        $sort = $request->input('sort', 'code'); // Default sort by code
        $direction = $request->input('direction', 'asc');
        $perPage = $request->input('per_page', 25);
        if ($perPage === 'all') {
            $perPage = 9999;
        }

        // Fetch all codes from all three levels to ensure everything imported appears in the table
        $specifics = DB::table('specific_discipline')
            ->leftJoin('dis_programs', 'specific_discipline.code', '=', 'dis_programs.specific_discipline_code')
            ->select([
                'specific_discipline.code',
                'specific_discipline.description as name',
                'specific_discipline.group_code',
                'specific_discipline.major_code',
                DB::raw("GROUP_CONCAT(dis_programs.program_name SEPARATOR ', ') as program"),
                'specific_discipline.id',
                DB::raw("'specific' as discipline_level")
            ])
            ->groupBy(
                'specific_discipline.code',
                'specific_discipline.description',
                'specific_discipline.group_code',
                'specific_discipline.major_code',
                'specific_discipline.id'
            );

        $majors = DB::table('major_discipline')
            ->select([
                'code',
                'description as name',
                DB::raw('SUBSTRING(code, 1, 2) as group_code'),
                'code as major_code',
                DB::raw('NULL as program'),
                'code as id',
                DB::raw("'major' as discipline_level")
            ])
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('specific_discipline')
                    ->whereRaw('specific_discipline.major_code = major_discipline.code');
            });

        $groups = DB::table('discipline_group')
            ->select([
                'code',
                'description as name',
                'code as group_code',
                DB::raw('NULL as major_code'),
                DB::raw('NULL as program'),
                'code as id',
                DB::raw("'group' as discipline_level")
            ])
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('specific_discipline')
                    ->whereRaw('specific_discipline.group_code = discipline_group.code');
            })
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('major_discipline')
                    ->whereRaw('SUBSTRING(major_discipline.code, 1, 2) = discipline_group.code');
            });

        $baseQuery = $specifics->union($majors)->union($groups);

        $programs = DB::table(DB::raw("({$baseQuery->toSql()}) as combined"))
            ->mergeBindings($baseQuery)
            ->leftJoin('major_discipline', 'combined.major_code', '=', 'major_discipline.code')
            ->leftJoin('discipline_group', 'combined.group_code', '=', 'discipline_group.code')
            ->select([
                'combined.code',
                'combined.name',
                'discipline_group.description as disciplineGroup',
                'major_discipline.description as specificMajor',
                'combined.group_code',
                'combined.major_code',
                'combined.program',
                'combined.id',
                'combined.discipline_level'
            ])
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('combined.name', 'like', '%' . $search . '%')
                        ->orWhere('combined.code', 'like', '%' . $search . '%')
                        ->orWhere('major_discipline.description', 'like', '%' . $search . '%')
                        ->orWhere('discipline_group.description', 'like', '%' . $search . '%')
                        ->orWhere('combined.program', 'like', '%' . $search . '%');
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        // Transform paginated items to the format expected by the frontend
        $programs->getCollection()->transform(function ($item) {
            $groupName = $item->disciplineGroup ?? ($item->discipline_level === 'group' ? $item->name : '');
            $majorName = $item->specificMajor ?? ($item->discipline_level === 'major' ? $item->name : '');
            $specificName = $item->discipline_level === 'specific' ? $item->name : '';

            return [
                'id' => is_numeric($item->id) ? "db-{$item->id}" : "code-{$item->id}",
                'code' => $item->code,
                'name' => $specificName,
                'disciplineGroup' => $groupName,
                'specificMajor' => $majorName,
                'program' => $item->program ?? '',
                'originalData' => [
                    'code' => $item->code,
                    'specificDiscipline' => $specificName,
                    'majorName' => $majorName,
                    'groupName' => $groupName,
                    'majorCode' => $item->major_code,
                    'groupCode' => $item->group_code,
                    'program' => $item->program,
                    'type' => $item->discipline_level
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
                'specific_discipline.description',
                'specific_discipline.major_code',
                DB::raw("GROUP_CONCAT(dis_programs.program_name SEPARATOR ', ') as program")
            ])
            ->groupBy('specific_discipline.code', 'specific_discipline.description', 'specific_discipline.major_code')
            ->orderBy('specific_discipline.description')
            ->get()
            ->unique('description');

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
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
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
                    RefDisciplineGroup::updateOrCreate(
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

                // Save the specific discipline as a new row always
                RefSpecificDiscipline::create([
                    'code' => $code,
                    'description' => $specificName,
                    'slug' => Str::slug($specificName, '_'),
                    'group_code' => $groupCode,
                    'major_code' => $majorCode,
                ]);

                if (!empty($validated['program'])) {
                    DisProgram::create([
                        'specific_discipline_code' => $code,
                        'program_name' => $validated['program'],
                    ]);
                }

                $saved = true;

                // Also ensure the major discipline exists if a name was provided
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
                    RefDisciplineGroup::updateOrCreate(
                        ['code' => $groupCode],
                        ['description' => $groupName]
                    );
                }

                // Save only the major discipline
                RefMajorDiscipline::updateOrCreate(
                    ['code' => $code],
                    [
                        'description' => $majorName,
                        'slug' => Str::slug($majorName, '_'),
                    ]
                );
                $saved = true;
            } elseif (!empty($validated['program'])) {
                // Code+Program only import: create specific discipline if missing, then link program
                $existingSpecific = RefSpecificDiscipline::where('code', $code)->first();
                if (!$existingSpecific) {
                    $groupCode = substr($code, 0, 2);
                    $majorCode = strlen($code) >= 4 ? substr($code, 0, 4) : null;
                    RefSpecificDiscipline::create([
                        'code'        => $code,
                        'description' => $code,
                        'slug'        => Str::slug($code, '_'),
                        'group_code'  => $groupCode,
                        'major_code'  => $majorCode,
                    ]);
                }
                DisProgram::where('specific_discipline_code', $code)->delete();
                DisProgram::create([
                    'specific_discipline_code' => $code,
                    'program_name'             => $validated['program'],
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

    public function updateDiscipline(Request $request, $code)
    {
        $validated = $request->validate([
            'type' => 'nullable|string|in:major,specific',
            'newCode' => 'nullable|string|max:10',
            'groupName' => 'nullable|string|max:255',
            'majorName' => 'nullable|string|max:255',
            'specificDiscipline' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'program' => 'nullable|string|max:255',
        ]);

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $type = $validated['type'] ?? 'specific';
            $newCode = $validated['newCode'] ?? $code;
            $groupName = $validated['groupName'] ?? null;
            $majorName = $validated['majorName'] ?? null;
            $specificName = $validated['specificDiscipline'] ?? $validated['description'] ?? null;
            $updated = false;

            if ($type === 'major') {
                $major = RefMajorDiscipline::where('code', $code)->first();
                if ($major) {
                    $major->description = $majorName ?: $specificName;
                    $major->slug = Str::slug($major->description, '_');
                    if ($newCode && $newCode !== $code) {
                        $major->code = $newCode;
                    }
                    $major->save();
                    $updated = true;
                }

                if (!empty($groupName)) {
                    $groupCode = substr($newCode, 0, 2);
                    RefDisciplineGroup::updateOrCreate(
                        ['code' => $groupCode],
                        ['description' => $groupName]
                    );
                    $updated = true;
                }
            } else {
                $specific = RefSpecificDiscipline::where('code', $code)->first();
                if ($specific) {
                    $specific->description = $specificName;
                    $specific->slug = Str::slug($specificName, '_');
                    if ($newCode && $newCode !== $code) {
                        $specific->code = $newCode;
                        $specific->group_code = substr($newCode, 0, 2);

                        $mPrefix6 = substr($newCode, 0, 6);
                        $mPrefix4 = substr($newCode, 0, 4);

                        $majorExists6 = RefMajorDiscipline::where('code', $mPrefix6)->exists();
                        if ($majorExists6 && strlen($newCode) >= 6) {
                            $specific->major_code = $mPrefix6;
                        } else {
                            $majorExists4 = RefMajorDiscipline::where('code', $mPrefix4)->exists();
                            $specific->major_code = $majorExists4 ? $mPrefix4 : null;
                        }
                    }
                    $specific->save();

                    // Update program in dis_programs table
                    $programName = $request->program ?? null;
                    DisProgram::where('specific_discipline_code', $specific->code)->delete();
                    if (!empty($programName)) {
                        DisProgram::create([
                            'specific_discipline_code' => $specific->code,
                            'program_name' => $programName,
                        ]);
                    }

                    $updated = true;
                }

                if (!empty($majorName)) {
                    $majorCode = substr($newCode, 0, 4);
                    
                    if ($specific && $specific->major_code !== $majorCode) {
                        $specific->major_code = $majorCode;
                        $specific->save();
                    }

                    if ($majorCode) {
                        RefMajorDiscipline::updateOrCreate(
                            ['code' => $majorCode],
                            ['description' => $majorName, 'slug' => Str::slug($majorName, '_')]
                        );
                        $updated = true;
                    }
                }

                if (!empty($groupName)) {
                    $groupCode = substr($newCode, 0, 2);
                    RefDisciplineGroup::updateOrCreate(
                        ['code' => $groupCode],
                        ['description' => $groupName]
                    );
                    $updated = true;
                }
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            if ($updated) {
                return redirect()->back()->with('success', 'Discipline updated successfully.');
            }
            return redirect()->back()->with('error', 'Record not found. Check the code and try again.');
        } catch (\Exception $e) {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            return redirect()->back()->with('error', 'Database error: ' . $e->getMessage());
        }
    }

    public function destroyDiscipline($code)
    {
        try {
            // Try specific discipline first
            $specific = RefSpecificDiscipline::where('code', $code)->first();
            if ($specific) {
                $specific->delete();
                return redirect()->back()->with('success', 'Specific Discipline deleted successfully.');
            }

            // Then try major discipline
            $major = RefMajorDiscipline::where('code', $code)->first();
            if ($major) {
                $major->delete();
                return redirect()->back()->with('success', 'Major Discipline deleted successfully.');
            }

            // Finally try discipline group
            $group = RefDisciplineGroup::where('code', $code)->first();
            if ($group) {
                $group->delete();
                return redirect()->back()->with('success', 'Discipline Group deleted successfully.');
            }

            return redirect()->back()->with('error', 'Discipline not found.');
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? 0;
            // 1451 is MySQL code for foreign key constraint violation
            if ($errorCode == 1451 || $errorCode == 19) { // 19 for sqlite
                return redirect()->back()->with('error', 'Cannot delete this discipline because it is associated with existing records (e.g. faculty profiles or sub-disciplines).');
            }
            return redirect()->back()->with('error', 'Database error: ' . $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
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

    private function getFacultyE2($heiId, $search)
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

    private function getFacultyE5($heiId, $search)
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

    public function updateUserAccount(Request $request, $id)
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

    public function destroyUserAccount($id)
    {
        $user = \App\Models\User::findOrFail($id);

        // Prevent deleting self
        if ($user->id === \Illuminate\Support\Facades\Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User account deleted successfully.');
    }

    public function showFaculty($id)
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
