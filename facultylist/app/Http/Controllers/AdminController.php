<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolSubmission;
use App\Models\Faculty;
use App\Models\FacultyE5;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function storeSchool(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:schools,code',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'type' => 'required|in:Public,Private',
        ]);

        // Convert empty strings to null to avoid unique constraint violations on 'code'
        $data = $validated;
        $data['code'] = $data['code'] ?: null;
        $data['address'] = $data['address'] ?: null;
        $data['contact_number'] = $data['contact_number'] ?: null;
        $data['email'] = $data['email'] ?: null;

        School::create($data);

        return redirect()->back()->with('success', 'School created successfully.');
    }

    public function dashboard(Request $request)
    {
        // 1. Schools List with Faculty Count
        $schoolsQuery = School::withCount(['faculties', 'facultiesE5'])
            ->orderBy('name')
            ->get();

        $schools = $schoolsQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count + $s->faculties_e5_count,
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ];
        });

        // 2. Stats
        $totalFacultyE2 = Faculty::count();
        $totalFacultyE5 = FacultyE5::count();
        $totalFaculty = $totalFacultyE2 + $totalFacultyE5;

        $totalSchools = School::count();

        // 3. Recent Activities (from SchoolSubmission)
        $recentActivities = SchoolSubmission::latest()
            ->take(5)
            ->get()
            ->map(function ($submission) {
                return [
                    'user' => $submission->submitted_by,
                    'action' => 'Submitted faculty list for ' . $submission->academic_year,
                    'time' => $submission->created_at->diffForHumans(),
                ];
            });

        // 4. Analytics Data
        $distributionData = $schoolsQuery->map(function ($s) {
            return [
                'name' => $s->name,
                'count' => (int) ($s->faculties_count + $s->faculties_e5_count),
            ];
        })->values();

        $activeSchools = School::where('is_active', true)->count();
        $inactiveSchools = School::where('is_active', false)->count();

        $statusData = [
            ['name' => 'Active', 'value' => $activeSchools, 'color' => '#16a34a'],
            ['name' => 'Inactive', 'value' => $inactiveSchools, 'color' => '#9ca3af'],
        ];

        // 5. Discipline Updates (from RefSpecificDiscipline)
        $disciplineUpdates = \App\Models\RefSpecificDiscipline::latest()
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

        return Inertia::render('Admin/AdminDashboard', [
            'schools' => $schools,
            'stats' => [
                ['title' => "Total Faculty", 'value' => (string) $totalFaculty, 'trend' => "+0%"],
                ['title' => "Total School", 'value' => (string) $totalSchools, 'trend' => "+0%"],
            ],
            'recentActivities' => $recentActivities,
            'distributionData' => $distributionData,
            'statusData' => $statusData,
            'disciplineUpdates' => $disciplineUpdates
        ]);
    }
    private function getReferenceData()
    {
        return [
            'gender' => \Illuminate\Support\Facades\DB::table('e5_ref_gender')->select('code', 'description as desc')->get(),
            'fullTimePartTime' => \Illuminate\Support\Facades\DB::table('e5_ref_full_time_part_time')->select('code', 'description as desc')->get(),
            'highestDegree' => \Illuminate\Support\Facades\DB::table('e5_ref_highest_degree')->select('code', 'description as desc')->get(),
            'professionalLicense' => \Illuminate\Support\Facades\DB::table('e5_ref_professional_license')->select('code', 'description as desc')->get(),
            'tenure' => \Illuminate\Support\Facades\DB::table('e5_ref_tenure')->select('code', 'description as desc')->get(),
            'facultyRank' => \Illuminate\Support\Facades\DB::table('e5_ref_faculty_rank')->select('code', 'description as desc')->get(),
            'teachingLoad' => \Illuminate\Support\Facades\DB::table('e5_ref_teaching_load')->select('code', 'description as desc')->get(),
            'annualSalary' => \Illuminate\Support\Facades\DB::table('e5_ref_annual_salary')->select('code', 'description as desc')->get(),
            'groupDiscipline' => \Illuminate\Support\Facades\DB::table('ref_major_discipline')
                ->select('code', 'description as desc')
                ->orderBy('code')
                ->get(),
            'disciplines' => \Illuminate\Support\Facades\DB::table('ref_specific_discipline')
                ->select('major_discipline_code as major_group_code', 'code', 'description as desc')
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
            'filters' => $request->only(['school_id', 'search']),
        ]);
    }

    public function disciplines(Request $request)
    {
        $groups = \App\Models\RefDisciplineGroup::orderBy('code')->get();
        $majors = \App\Models\RefMajorDiscipline::orderBy('code')->get();
        $specifics = \App\Models\RefSpecificDiscipline::orderBy('code')->get();

        $disciplines = $groups->map(function ($group) use ($majors, $specifics) {
            $groupMajors = $majors->filter(fn($m) => $m->discipline_group_code === $group->code)
                ->map(function ($major) use ($specifics) {
                    $majorSpecifics = $specifics->filter(fn($s) => str_starts_with($s->code, $major->code))
                        ->map(fn($s) => [
                            'code' => $s->code,
                            'description' => $s->description,
                        ])->values();

                    return [
                        'code' => $major->code,
                        'description' => $major->description,
                        'specifics' => $majorSpecifics,
                    ];
                })->values();

            return [
                'code' => $group->code,
                'description' => $group->description,
                'groups' => $groupMajors,
            ];
        })->values();

        return Inertia::render('Admin/Disciplines', [
            'disciplines' => $disciplines,
        ]);
    }
    public function storeDiscipline(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|min:4|max:6',
            'group' => 'nullable|string',
            'majorDiscipline' => 'nullable|string',
            'specificDiscipline' => 'nullable|string',
            'groupDescription' => 'nullable|string',
        ]);

        $code = $validated['code'];
        $len = strlen($code);

        // Case A: Major Discipline (4 digits) - "Group" mode in frontend
        if ($len === 4) {
            $parentGroupCode = substr($code, 0, 2);
            // In 'group' mode (Major), the name is sent as groupDescription
            $description = $validated['groupDescription'];

            if (!$description) {
                return redirect()->back()->with('error', 'Major Discipline description is required.');
            }

            \App\Models\RefMajorDiscipline::updateOrCreate(
                ['code' => $code],
                [
                    'discipline_group_code' => $parentGroupCode,
                    'description' => $description,
                    'slug' => \Illuminate\Support\Str::slug($description, '_')
                ]
            );
        }
        // Case B: Specific Discipline (6 digits) - "Specific" mode in frontend
        elseif ($len === 6) {
            $parentMajorCode = substr($code, 0, 4);
            $description = $validated['specificDiscipline'];

            if (!$description) {
                return redirect()->back()->with('error', 'Specific Discipline description is required.');
            }

            \App\Models\RefSpecificDiscipline::updateOrCreate(
                ['code' => $code],
                [
                    'major_discipline_code' => $parentMajorCode,
                    'description' => $description,
                    'minor_group' => $validated['groupDescription'] ?? '' // Fallback/Legacy
                ]
            );
        }

        return redirect()->back()->with('success', 'Discipline saved successfully.');
    }

    public function destroyDiscipline($code)
    {
        // Try to delete from specifics first
        $specific = \App\Models\RefSpecificDiscipline::where('code', $code)->first();
        if ($specific) {
            $specific->delete();
            return redirect()->back()->with('success', 'Discipline deleted successfully.');
        }

        // Also check groups if needed, or major? 
        // For now, only specific disciplines are deletable via this ID
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
                'code' => $s->code,
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
                    'id' => 'e2-' . $f->id,
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
                    'id' => 'e5-' . $f->id,
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
            'school_id' => 'required|exists:schools,id',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            // 'role' => 'faculty', // Default is Faculty per migration or handle here if needed
            'role' => 'Faculty',
            'school_id' => $validated['school_id'],
        ]);

        return redirect()->back()->with('success', 'Faculty account created successfully.');
    }
}
