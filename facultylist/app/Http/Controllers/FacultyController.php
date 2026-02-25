<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacultyController extends Controller
{
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
                ->select(\Illuminate\Support\Facades\DB::raw('SUBSTRING(code, 1, 2) as major_group_code'), 'code', 'description as desc')
                ->orderBy('code')
                ->get()
        ];
    }

    public function index(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            // Ideally redirect or show empty state if no school
            $schoolId = null;
        } else {
            $schoolId = $user->school_id;
        }

        // Auto-seed logic removed

        $query = \App\Models\Faculty::query();
        if ($schoolId) {
            $query->where('school_id', $schoolId);
        } else {
            // If no school, maybe show nothing? or all if super admin?
            // For safety, let's show nothing if not admin.
            // But for now, let's assume they must be scoped.
            $query->whereRaw('1 = 0'); // Show nothing
        }

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('degree', 'like', "%{$search}%");
            });
        }

        // Year Filter - only apply if a specific year is provided (not empty / "All Years")
        if ($request->filled('year')) {
            $year = trim($request->input('year'));
            $query->where('joined_year', '=', $year);
        }

        // Fetch Reference Data from Database
        $referenceData = $this->getReferenceData();

        $facultyE2 = $query->get();

        // Fetch E5 Data and map to match E2 structure for frontend consistency
        $queryE5 = \App\Models\FacultyE5::query();
        if ($schoolId) {
            $queryE5->where('school_id', $schoolId);
        } else {
            $queryE5->whereRaw('1 = 0');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $queryE5->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        if ($request->filled('year')) {
            $year = trim($request->input('year'));
            $queryE5->where('joined_year', '=', $year);
        }


        $facultyE5 = $queryE5->get()->map(function ($item) {
            // Convert to array to avoid Model serialization casting ID attribute back to int
            $data = $item->toArray();
            $data['original_id'] = $item->id;
            $data['id'] = 'e5_' . $item->id; // e.g. "e5_1"

            // Map fields manually since we are using array
            $data['fullTimeCode'] = $item->ft_pt_code;
            $data['genderCode'] = $item->gender_code;
            $data['disciplineCode'] = $item->discipline_code;
            $data['status'] = $item->status ?? 'Not Updated';

            return (object) $data;
        });

        $facultyData = $facultyE2->concat($facultyE5);

        // Get dynamic years from DB (union both tables)
        if ($schoolId) {
            $yearsE2 = \App\Models\Faculty::select('joined_year')->where('school_id', $schoolId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');
            $yearsE5 = \App\Models\FacultyE5::select('joined_year')->where('school_id', $schoolId)->whereNotNull('joined_year')->distinct()->pluck('joined_year');
        } else {
            $yearsE2 = collect([]);
            $yearsE5 = collect([]);
        }
        $availableYears = $yearsE2->concat($yearsE5)->unique()->sortDesc()->values();

        return \Inertia\Inertia::render('facultyprofile', [
            'initialFacultyData' => $facultyData,
            'filters' => $request->only(['search', 'year']),
            'referenceData' => $referenceData,
            'availableYears' => $availableYears,
            'schoolName' => $schoolId ? (\App\Models\School::find($schoolId)->name ?? 'School Name') : 'School Name',
        ]);
    }

    public function edit($id)
    {
        \Illuminate\Support\Facades\Log::info("FacultyController@edit called with ID: {$id}");

        $isE5 = str_starts_with($id, 'e5_');
        $realId = $isE5 ? substr($id, 3) : $id;

        \Illuminate\Support\Facades\Log::info("Parsed Real ID: {$realId}, IsE5: " . ($isE5 ? 'Yes' : 'No'));

        if ($isE5) {
            $faculty = \App\Models\FacultyE5::find($realId);
            if ($faculty) {
                // Convert to array to avoid casting 'id' to int (0) during serialization
                $data = $faculty->toArray();
                $data['fullTimeCode'] = $faculty->ft_pt_code;
                $data['genderCode'] = $faculty->gender_code;
                $data['disciplineCode'] = $faculty->discipline_code;
                $data['degree'] = $faculty->highest_degree_code;
                $data['rankCode'] = $faculty->rank_code;
                $data['bachelorsCode'] = $faculty->bachelors_code;
                $data['mastersCode'] = $faculty->masters_code;
                $data['doctorateCode'] = $faculty->doctorate_code;
                $data['licenseCode'] = $faculty->license_code;
                $data['tenureCode'] = $faculty->tenure_code;
                $data['salaryCode'] = $faculty->salary_range_code;
                $data['loadCode'] = $faculty->teaching_load_code;
                $data['id'] = $id; // "e5_..."

                $faculty = (object) $data;
            } else {
                \Illuminate\Support\Facades\Log::warning("FacultyE5 not found for ID: {$realId}");
            }
        } else {
            $faculty = \App\Models\Faculty::find($realId);
            if (!$faculty) {
                \Illuminate\Support\Facades\Log::warning("Faculty (E2) not found for ID: {$realId}");
            }
        }

        if (!$faculty)
            abort(404);

        $referenceData = $this->getReferenceData();

        return \Inertia\Inertia::render('Faculty/EditPrivateFaculty', [
            'faculty' => $faculty,
            'referenceData' => $referenceData,
        ]);
    }

    public function store(Request $request)
    {
        // Basic validation - can be expanded
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:faculty_e2,email',
            // Add other mandatory fields
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            return redirect()->back()->with('error', 'You must be associated with a school to add faculty.');
        }

        $data = $request->all();
        $data['school_id'] = $user->school_id;

        // For now allowing all fields from request for flexibility with imports
        \App\Models\Faculty::create($data);

        return redirect()->back()->with('success', 'Faculty created successfully.');
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'faculty' => 'required|array',
            'faculty.*.name' => 'required|string',
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            return redirect()->back()->with('error', 'You must be associated with a school to import faculty.');
        }

        $data = $request->input('faculty');

        foreach ($data as $record) {
            // Use updateOrCreate to avoid duplicates if name exists, or just create
            // For now, strict create or basic updateOrCreate on email/name
            \App\Models\Faculty::updateOrCreate(
                [
                    'name' => $record['name'],
                    'school_id' => $user->school_id, // Scope by school
                    'joined_year' => $record['joined_year'] ?? null // Scope by year
                ],
                array_merge($record, ['school_id' => $user->school_id])
            );
        }

        return redirect()->back()->with('success', 'Faculty imported successfully.');
    }

    public function bulkStoreE5(Request $request)
    {
        $request->validate([
            'faculty' => 'required|array',
            'faculty.*.name' => 'required|string',
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            return redirect()->back()->with('error', 'You must be associated with a school to import faculty.');
        }

        $data = $request->input('faculty');

        foreach ($data as $record) {
            // Map the generic fields to the specific faculty_e5 columns
            // Frontend sends camelCase keys (e.g. genderCode), we match them to snake_case db columns
            \App\Models\FacultyE5::updateOrCreate(
                [
                    'name' => $record['name'],
                    'school_id' => $user->school_id,
                    'joined_year' => $record['joined_year'] ?? null
                ],
                [
                    'email' => $record['email'],
                    'avatar_initials' => $record['avatar_initials'],
                    'form_type' => 'E5',
                    'status' => $record['status'],
                    'employment' => $record['employment'],
                    'school_id' => $user->school_id,

                    'ft_pt_code' => $record['fullTimeCode'] ?? null,
                    'gender_code' => $record['genderCode'] ?? null,
                    'discipline_code' => $record['disciplineCode'] ?? null,
                    'highest_degree_code' => $record['degree'] ?? null, // 'degree' in frontend maps to highest_degree_code
                    'rank_code' => $record['rankCode'] ?? null,
                    'bachelors_code' => $record['bachelorsCode'] ?? null,
                    'masters_code' => $record['mastersCode'] ?? null,
                    'doctorate_code' => $record['doctorateCode'] ?? null,
                    'license_code' => $record['licenseCode'] ?? null,
                    'tenure_code' => $record['tenureCode'] ?? null,
                    'salary_range_code' => $record['salaryCode'] ?? null,
                    'teaching_load_code' => $record['loadCode'] ?? null,
                    'subjects' => $record['subjects'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'E5 Faculty imported successfully.');
    }

    public function update(Request $request, $id)
    {
        try {
            $isE5 = str_starts_with($id, 'e5_');
            $realId = $isE5 ? substr($id, 3) : $id;

            if ($isE5) {
                $faculty = \App\Models\FacultyE5::findOrFail($realId);

                // Map frontend fields (camelCase) to DB columns (snake_case)
                $input = $request->all();
                $data = [
                    'name' => $input['name'] ?? $faculty->name,
                    'email' => $input['email'] ?? $faculty->email,
                    'joined_year' => $input['joined_year'] ?? $faculty->joined_year,
                    'status' => $input['status'] ?? $faculty->status,
                    'employment' => $input['employment'] ?? $faculty->employment,
                    'ft_pt_code' => $input['fullTimeCode'] ?? $faculty->ft_pt_code,
                    'gender_code' => $input['genderCode'] ?? $faculty->gender_code,
                    'discipline_code' => $input['disciplineCode'] ?? $faculty->discipline_code,
                    'highest_degree_code' => $input['degree'] ?? $faculty->highest_degree_code,
                    'rank_code' => $input['rankCode'] ?? $faculty->rank_code,
                    'bachelors_code' => $input['bachelorsCode'] ?? $faculty->bachelors_code,
                    'masters_code' => $input['mastersCode'] ?? $faculty->masters_code,
                    'doctorate_code' => $input['doctorateCode'] ?? $faculty->doctorate_code,
                    'license_code' => $input['licenseCode'] ?? $faculty->license_code,
                    'tenure_code' => $input['tenureCode'] ?? $faculty->tenure_code,
                    'salary_range_code' => $input['salaryCode'] ?? $faculty->salary_range_code,
                    'teaching_load_code' => $input['loadCode'] ?? $faculty->teaching_load_code,
                    'subjects' => $input['subjects'] ?? $faculty->subjects,
                ];

                $faculty->update($data);
            } else {
                $faculty = \App\Models\Faculty::findOrFail($realId);
                $faculty->update($request->all());
            }

            return redirect()->back()->with('success', 'Faculty updated successfully.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Faculty Update Error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['system' => 'Update failed: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $isE5 = str_starts_with($id, 'e5_');
        $realId = $isE5 ? substr($id, 3) : $id;

        if ($isE5) {
            $faculty = \App\Models\FacultyE5::find($realId);
        } else {
            $faculty = \App\Models\Faculty::find($realId);
        }

        if ($faculty) {
            $faculty->delete();
            return redirect()->back()->with('success', 'Faculty deleted successfully.');
        }

        return redirect()->back()->with('error', 'Faculty not found.');
    }
    public function submit(Request $request)
    {
        $request->validate([
            'year' => 'required|string',
        ]);

        \Illuminate\Support\Facades\Log::info("FacultyController@submit called with year: " . $request->input('year'));

        $year = $request->input('year');

        // Logic to updated statuses for the given year
        // Update both E2 and E5 tables, scoped to the user's school
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            return redirect()->back()->with('error', 'You must be associated with a school to submit.');
        }

        $updatedCountE2 = \App\Models\Faculty::where('joined_year', $year)
            ->where('school_id', $user->school_id)
            ->update(['status' => 'Completed']);

        $updatedCountE5 = \App\Models\FacultyE5::where('joined_year', $year)
            ->where('school_id', $user->school_id)
            ->update(['status' => 'Completed']);

        $totalUpdated = $updatedCountE2 + $updatedCountE5;

        if ($totalUpdated > 0) {
            // Create Submission Record
            // Correctly use the user's school name
            $schoolName = $user->school ? $user->school->name : (\App\Models\School::find($user->school_id)->name ?? 'Unknown School');
            $submittedBy = $user ? $user->name : 'Unknown User';
            $facultyCount = $totalUpdated;

            \App\Models\SchoolSubmission::create([
                'school_id' => $user->school_id, // Ensure SchoolSubmission has school_id if possible, or join it
                'school_name' => $schoolName,
                'academic_year' => $year,
                'submitted_by' => $submittedBy,
                'total_faculty' => $facultyCount,
                'status' => 'Completed',
            ]);

            return redirect()->back()->with('success', "Successfully submitted {$totalUpdated} faculty records for {$year}.");
        }

        return redirect()->back()->with('error', "No records found to submit for {$year}.");
    }

    public function copyData(Request $request)
    {
        $request->validate([
            'source_year' => 'required|string',
            'target_year' => 'required|string',
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->school_id) {
            return redirect()->back()->with('error', 'You must be associated with a school to copy data.');
        }

        $sourceYear = $request->input('source_year');
        $targetYear = $request->input('target_year');

        if ($sourceYear === $targetYear) {
            return redirect()->back()->with('error', 'Source and target years cannot be the same.');
        }

        // Copy E2 Faculty
        $e2Faculty = \App\Models\Faculty::where('school_id', $user->school_id)
            ->where('joined_year', $sourceYear)
            ->get();

        $e2Count = 0;
        foreach ($e2Faculty as $faculty) {
            /** @var \App\Models\Faculty $faculty */
            $newFaculty = $faculty->replicate();
            $newFaculty->joined_year = $targetYear;
            $newFaculty->status = 'Not Updated';

            // Check if it already exists for target year to prevent duplicates
            $exists = \App\Models\Faculty::where('school_id', $user->school_id)
                ->where('joined_year', $targetYear)
                ->where('name', $faculty->name)
                ->exists();

            if (!$exists) {
                $newFaculty->save();
                $e2Count++;
            }
        }

        // Copy E5 Faculty
        $e5Faculty = \App\Models\FacultyE5::where('school_id', $user->school_id)
            ->where('joined_year', $sourceYear)
            ->get();

        $e5Count = 0;
        foreach ($e5Faculty as $faculty) {
            /** @var \App\Models\FacultyE5 $faculty */
            $newFaculty = $faculty->replicate();
            $newFaculty->joined_year = $targetYear;
            $newFaculty->status = 'Not Updated';

            // Check if it already exists for target year
            $exists = \App\Models\FacultyE5::where('school_id', $user->school_id)
                ->where('joined_year', $targetYear)
                ->where('name', $faculty->name)
                ->exists();

            if (!$exists) {
                $newFaculty->save();
                $e5Count++;
            }
        }

        $totalCopied = $e2Count + $e5Count;

        if ($totalCopied > 0) {
            return redirect()->back()->with('success', "Successfully copied {$totalCopied} faculty records from {$sourceYear} to {$targetYear}.");
        }

        return redirect()->back()->with('info', "No new records were copied. They might already exist in {$targetYear} or the source year was empty.");
    }
}
