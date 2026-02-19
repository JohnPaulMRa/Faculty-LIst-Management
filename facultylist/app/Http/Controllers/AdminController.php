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
    public function dashboard(Request $request)
    {
        // 1. Schools List with Faculty Count
        $schoolsQuery = School::withCount('faculties')
            ->orderBy('name')
            ->get();

        $schools = $schoolsQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count,
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
                'count' => (int) $s->faculties_count,
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
    public function facultyList(Request $request)
    {
        $schools = $this->getSchools($request);

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
            'filters' => $request->only(['school_id', 'search']),
        ]);
    }
    public function disciplines(Request $request)
    {
        $majors = \App\Models\RefMajorDiscipline::orderBy('code')->get();
        $groups = \App\Models\RefDisciplineGroup::orderBy('code')->get();
        $specifics = \App\Models\RefSpecificDiscipline::orderBy('code')->get();

        $disciplines = $majors->map(function ($major) use ($groups, $specifics) {
            $majorGroups = $groups->filter(fn($g) => $g->major_discipline_code === $major->code)
                ->map(function ($group) use ($specifics) {
                    $groupSpecifics = $specifics->filter(fn($s) => str_starts_with($s->code, $group->code))
                        ->map(fn($s) => [
                            'code' => $s->code,
                            'description' => $s->description,
                        ])->values();

                    return [
                        'code' => $group->code,
                        'description' => $group->description,
                        'specifics' => $groupSpecifics,
                    ];
                })->values();

            return [
                'code' => $major->code,
                'description' => $major->description,
                'groups' => $majorGroups,
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
            'group' => 'required|string|min:2|max:4', // Major code or Group code
            'majorDiscipline' => 'required|string',
            'specificDiscipline' => 'nullable|string',
            'groupDescription' => 'nullable|string',
        ]);

        $codeLen = strlen($validated['code']);
        $majorCode = substr($validated['code'], 0, 2);

        // 1. Ensure Major exists
        \App\Models\RefMajorDiscipline::updateOrCreate(
            ['code' => $majorCode],
            ['description' => $validated['majorDiscipline']]
        );

        // 2. Ensure Group exists
        if ($codeLen >= 4) {
            $groupCode = substr($validated['code'], 0, 4);
            $groupDesc = $validated['groupDescription'] ?? ('Group for ' . $validated['majorDiscipline']);

            \App\Models\RefDisciplineGroup::updateOrCreate(
                ['code' => $groupCode],
                [
                    'major_discipline_code' => $majorCode,
                    'description' => $groupDesc
                ]
            );
        }

        // 3. Create/Update Specific Discipline (Only if code is full specific code)
        if ($codeLen === 6) {
            if (empty($validated['specificDiscipline'])) {
                return redirect()->back()->with('error', 'Specific Discipline description is required.');
            }

            $groupCode = substr($validated['code'], 0, 4);

            \App\Models\RefSpecificDiscipline::updateOrCreate(
                ['code' => $validated['code']],
                [
                    'major_discipline_code' => $majorCode,
                    'description' => $validated['specificDiscipline'],
                    'minor_group' => 'Group ' . $groupCode
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
        $schoolsQuery = School::withCount('faculties')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy('name')
            ->get();

        return $schoolsQuery->map(function ($s) {
            return [
                'id' => (int) $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count,
                'type' => 'public', // Hardcoded for now
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
                    'name' => $f->name,
                    'sex' => 'N/A',
                    'type' => $f->employment ?? 'Full-time',
                    'submissionStatus' => 'pending',
                    'schoolYear' => $f->joined_year ?? 'N/A',
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
                    'name' => $f->name,
                    'sex' => $f->gender_code === '1' ? 'Male' : ($f->gender_code === '2' ? 'Female' : 'N/A'),
                    'type' => $f->employment ?? 'Full-time',
                    'submissionStatus' => 'submitted',
                    'schoolYear' => $f->joined_year ?? 'N/A',
                ];
            });
    }
}
