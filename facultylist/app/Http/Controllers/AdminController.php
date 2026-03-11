<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolSubmission;
use App\Models\Faculty;
use App\Models\FacultyE5;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\RefDisciplineGroup;
use App\Models\RefMajorDiscipline;
use App\Models\RefSpecificDiscipline;
use Illuminate\Database\QueryException;

class AdminController extends Controller
{
    public function storeSchool(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hei_code' => 'nullable|string|max:50|unique:schools,hei_code',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'type' => 'required|in:Public,Private',
        ]);

        // Convert empty strings to null to avoid unique constraint violations on 'hei_code'
        $data = $validated;
        $data['hei_code'] = $data['hei_code'] ?: null;
        $data['address'] = $data['address'] ?: null;
        $data['contact_number'] = $data['contact_number'] ?: null;
        $data['email'] = $data['email'] ?: null;

        School::create($data);

        return redirect()->back()->with('success', 'School created successfully.');
    }

    public function dashboard(Request $request)
    {
        $distributionAndStatus = $this->getDashboardDistributionData();

        return Inertia::render('Admin/AdminDashboard', [
            'schools' => $this->getDashboardSchools(),
            'stats' => $this->getDashboardStats(),
            'recentActivities' => $this->getDashboardRecentActivities(),
            'distributionData' => $distributionAndStatus['distributionData'],
            'statusData' => $distributionAndStatus['statusData'],
            'disciplineUpdates' => $this->getDashboardDisciplineUpdates()
        ]);
    }

    private function getDashboardSchools()
    {
        $schoolsQuery = School::withCount(['faculties', 'facultiesE5'])
            ->orderBy('name')
            ->get();

        return $schoolsQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count + $s->faculties_e5_count,
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ];
        });
    }

    private function getDashboardStats()
    {
        $totalFaculty = Faculty::count() + FacultyE5::count();
        $totalSchools = School::count();
        $privateSchools = School::where('type', 'Private')->count();
        $publicSchools = School::where('type', 'Public')->count();

        return [
            ['title' => "Total Faculty", 'value' => (string) $totalFaculty, 'trend' => "+0%"],
            [
                'title' => "TOTAL SUBMITTED HEIs",
                'value' => (string) $totalSchools,
                'subtext' => "{$privateSchools} Private HEIs, {$publicSchools} Public HEIs"
            ],
        ];
    }

    private function getDashboardRecentActivities()
    {
        return SchoolSubmission::latest()
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
        $majors = DB::table('major_discipline')->orderBy('code')->get();
        $specifics = DB::table('specific_discipline')->orderBy('code')->get();

        $distributionData = [];

        foreach ($groups as $group) {
            $groupMajors = $majors->filter(function ($m) use ($group) {
                return str_starts_with($m->code, $group->code);
            });

            $children = [];
            $groupCount = 0;

            foreach ($groupMajors as $major) {
                $specCount = $specifics->filter(function ($s) use ($major) {
                    return str_starts_with($s->code, $major->code);
                })->count();

                if ($specCount > 0) {
                    $children[] = [
                        'name' => $major->description,
                        'count' => $specCount,
                    ];
                    $groupCount += $specCount;
                }
            }

            if ($groupCount > 0) {
                usort($children, function ($a, $b) {
                    return $b['count'] <=> $a['count'];
                });

                $distributionData[] = [
                    'name' => $group->description,
                    'count' => $groupCount,
                    'children' => $children,
                ];
            }
        }

        usort($distributionData, function ($a, $b) {
            return $b['count'] <=> $a['count'];
        });

        return [
            'distributionData' => $distributionData,
            'statusData' => [
                ['name' => 'Active', 'value' => School::where('is_active', true)->count(), 'color' => '#16a34a'],
                ['name' => 'Inactive', 'value' => School::where('is_active', false)->count(), 'color' => '#9ca3af'],
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
            'facultyRank' => DB::table('e5_ref_faculty_rank')->select('code', 'description as desc')->get(),
            'teachingLoad' => DB::table('e5_ref_teaching_load')->select('code', 'description as desc')->get(),
            'annualSalary' => DB::table('e5_ref_annual_salary')->select('code', 'description as desc')->get(),
            'groupDiscipline' => DB::table('major_discipline')
                ->select('code', 'description as desc')
                ->orderBy('code')
                ->get(),
            'disciplines' => DB::table('specific_discipline')
                ->select('code', 'description as desc')
                ->orderBy('code')
                ->get()
        ];
    }

    public function facultyList(Request $request)
    {
        $schools = $this->getSchools($request);
        $referenceData = $this->getReferenceData();

        $faculty = [];
        if ($request->has('school_id') && $request->school_id) {
            $search = $request->input('search');
            $facultyE2 = $this->getFacultyE2($request->school_id, $search);
            $facultyE5 = $this->getFacultyE5($request->school_id, $search);

            $faculty = collect($facultyE2)->concat($facultyE5)->sortBy('name')->values();
        }

        return Inertia::render('Admin/FacultyList', [
            'schools' => $schools,
            'faculty' => $faculty,
            'referenceData' => $referenceData,
            'filters' => $request->only(['school_id', 'search', 'type']),
        ]);
    }

    public function disciplines(Request $request)
    {
        $groups = RefDisciplineGroup::orderBy('code')->get();
        $majors = RefMajorDiscipline::orderBy('code')->get();
        $specifics = RefSpecificDiscipline::orderBy('code')->get();

        $disciplines = $groups->map(function ($group) use ($majors, $specifics) {
            // Get all specific disciplines directly under this group (no major)
            $groupSpecifics = $specifics
                ->filter(fn($s) => $s->group_code === $group->code && empty($s->major_code))
                ->map(fn($s) => [
                    'code' => $s->code,
                    'description' => $s->description,
                ])->values()->toArray();

            // Get all majors under this group
            $groupMajors = $majors
                ->filter(fn($m) => str_starts_with($m->code, $group->code) && $m->code !== '0000')
                ->map(function ($major) use ($specifics) {
                    // Specifics whose major_code matches this major
                    $majorSpecifics = $specifics
                        ->filter(fn($s) => $s->major_code === $major->code
                            && strtoupper(trim($s->description)) !== strtoupper(trim($major->description)))
                        ->map(fn($s) => [
                            'code' => $s->code,
                            'description' => $s->description,
                        ])->values();

                    return [
                        'code' => $major->code,
                        'description' => $major->description,
                        'specifics' => $majorSpecifics->toArray(),
                    ];
                })->values()->toArray();

            return [
                'code' => $group->code,
                'description' => $group->description,
                'groups' => collect($groupMajors)->values(),
                'specifics' => $groupSpecifics,
            ];
        })->values();

        return Inertia::render('Admin/Disciplines', [
            'disciplines' => $disciplines,
        ]);
    }
    public function storeDiscipline(Request $request)
    {
        \Log::info('storeDiscipline reached', $request->all());
        $validated = $request->validate([
            'code' => 'required|string|min:3|max:10',
            'majorName' => 'nullable|string|max:255',
            'specificDiscipline' => 'nullable|string|max:255',
        ]);

        \Log::info('Discipline Store Attempt:', $validated);

        $code = $validated['code'];
        $majorName = $validated['majorName'] ?? null;
        $specificName = $validated['specificDiscipline'] ?? null;

        try {
            $saved = false;
            if (!empty($specificName)) {
                $groupCode = substr($code, 0, 2);
                $majorPrefix = substr($code, 0, 4);
                
                // If majorName is provided, we create it. If not, we just check if it exists in DB.
                if (!empty($majorName) && strlen($code) >= 4) {
                    $majorCode = $majorPrefix;
                } else {
                    $majorExists = RefMajorDiscipline::where('code', $majorPrefix)->exists();
                    $majorCode = $majorExists ? $majorPrefix : null;
                }

                // Save the specific discipline
                RefSpecificDiscipline::updateOrCreate(
                    ['code' => $code],
                    [
                        'description' => $specificName,
                        'slug' => Str::slug($specificName, '_'),
                        'group_code' => $groupCode,
                        'major_code' => $majorCode,
                    ]
                );

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
                // Save only the major discipline
                RefMajorDiscipline::updateOrCreate(
                    ['code' => $code],
                    [
                        'description' => $majorName,
                        'slug' => Str::slug($majorName, '_'),
                    ]
                );
                $saved = true;
            }

            if (!$saved) {
                return redirect()->back()->with('error', 'Please fill in at least the Major Discipline name or a Specific Discipline name.');
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
            'description' => 'required|string|max:255',
        ]);

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $type = $validated['type'] ?? 'specific';
            $newCode = $validated['newCode'] ?? $code;
            $description = $validated['description'];
            $slug = Str::slug($description, '_');
            $updated = false;

            if ($type === 'major') {
                $major = RefMajorDiscipline::where('code', $code)->first();
                if ($major) {
                    $major->description = $description;
                    $major->slug = $slug;
                    if ($newCode && $newCode !== $code) {
                        $major->code = $newCode;
                    }
                    $major->save();
                    $updated = true;
                }
            } else {
                $specific = RefSpecificDiscipline::where('code', $code)->first();
                if ($specific) {
                    $specific->description = $description;
                    $specific->slug = $slug;
                    if ($newCode && $newCode !== $code) {
                        $specific->code = $newCode;
                        $specific->group_code = substr($newCode, 0, 2);
                        $majorPrefix = substr($newCode, 0, 4);
                        $majorExists = RefMajorDiscipline::where('code', $majorPrefix)->exists();
                        $specific->major_code = $majorExists ? $majorPrefix : null;
                    }
                    $specific->save();
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
        // Try specific discipline first
        $specific = RefSpecificDiscipline::where('code', $code)->first();
        if ($specific) {
            $specific->delete();
            return redirect()->back()->with('success', 'Discipline deleted successfully.');
        }

        // Then try major discipline
        $major = RefMajorDiscipline::where('code', $code)->first();
        if ($major) {
            $major->delete();
            return redirect()->back()->with('success', 'Discipline deleted successfully.');
        }

        return redirect()->back()->with('error', 'Discipline not found.');
    }
    private function getSchools(Request $request)
    {
        $search = $request->input('search');
        $schoolsQuery = School::withCount(['faculties', 'facultiesE5'])
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy('name')
            ->get();

        return $schoolsQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'hei_code' => $s->hei_code,
                'faculty' => $s->faculties_count + $s->faculties_e5_count,
                'type' => $s->type,
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ];
        });
    }

    private function getFacultyE2($schoolId, $search)
    {
        return Faculty::where('school_id', $schoolId)
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
                    'sex' => 'N/A', // For display compatibility
                    'genderCode' => null,
                    'type' => $f->employment ?? 'Full-time',
                    'employment' => $f->employment ?? 'Full-time',
                    'submissionStatus' => 'pending',
                    'status' => 'Not Updated', // Default
                    'schoolYear' => $f->joined_year ?? 'N/A',
                    'joined_year' => $f->joined_year,
                    'form_type' => 'E2',
                    'department' => $f->department ?? '',
                    'degree' => $f->degree ?? '',
                    'rank' => $f->rank ?? '',
                    'avatar_initials' => $f->avatar_initials ?? '?',
                ];
            });
    }

    private function getFacultyE5($schoolId, $search)
    {
        return FacultyE5::where('school_id', $schoolId)
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
                    'sex' => $f->gender_code === '1' ? 'Male' : ($f->gender_code === '2' ? 'Female' : 'N/A'),
                    'genderCode' => $f->gender_code,
                    'fullTimeCode' => $f->ft_pt_code,
                    'disciplineCode' => $f->discipline_code,
                    'type' => $f->employment ?? 'Full-time',
                    'employment' => $f->employment ?? 'Full-time',
                    'submissionStatus' => 'submitted',
                    'status' => $f->status ?? 'Not Updated',
                    'schoolYear' => $f->joined_year ?? 'N/A',
                    'joined_year' => $f->joined_year,
                    'form_type' => 'E5',
                    'department' => '', // E5 might not have dept column readily available or mapped
                    'degree' => $f->highest_degree_code ?? '', // use code or lookup if needed
                    'rank' => $f->rank_code ?? '',
                    'avatar_initials' => $f->avatar_initials ?? '?',
                ];
            });
    }

    public function createFacultyAccount(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'school_id' => 'required|exists:schools,id',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['username'],
            'email' => $validated['username'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            // 'role' => 'faculty', // Default is Faculty per migration or handle here if needed
            'role' => 'Faculty',
            'school_id' => $validated['school_id'],
        ]);

        return redirect()->back()->with('success', 'Faculty account created successfully.');
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
                    'employment' => $faculty->employment,
                    'joined_year' => $faculty->joined_year,
                    'department' => $faculty->department,
                    'degree' => $faculty->degree,
                    'rank' => $faculty->rank,
                    'form_type' => 'E2',
                ]);
            }
        }

        return response()->json(['error' => 'Faculty not found.'], 404);
    }
}
