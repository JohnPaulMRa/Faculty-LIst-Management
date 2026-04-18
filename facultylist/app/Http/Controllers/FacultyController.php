<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class FacultyController extends Controller
{
    public function getReferenceData()
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
                ->select(DB::raw('SUBSTRING(code, 1, 2) as major_group_code'), 'code', 'description as desc')
                ->orderBy('code')
                ->get(),
            // All disciplines under Education Science and Teacher Training (group_code = 14)
            'educationDisciplines' => DB::table('specific_discipline')
                ->select('code', 'description as desc')
                ->where(function ($q) {
                    $q->where('group_code', '14')
                        ->orWhere('code', 'like', '14%');
                })
                ->orderBy('description')
                ->get(),
        ];
    }

    public function index(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $heiId = ($user && $user->hei_id) ? $user->hei_id : null;

        $search = $request->input('search');
        $year = $request->filled('year') ? trim($request->input('year')) : null;

        // Fetch paginated or filtered collection of faculty
        $facultyE2 = $this->getFacultyE2Data($heiId, $search, $year);
        $facultyE5 = $this->getFacultyE5Data($heiId, $search, $year);

        $facultyData = $facultyE2->concat($facultyE5);

        // Metadata and Reference Data
        $availableYears = $this->getAvailableYears($heiId);
        $referenceData = $this->getReferenceData();

        $hei = $heiId ? \App\Models\Hei::find($heiId) : null;

        return \Inertia\Inertia::render('Faculty/facultyprofile', [
            'initialFacultyData' => $facultyData,
            'filters' => $request->only(['search', 'year']),
            'referenceData' => $referenceData,
            'availableYears' => $availableYears,
            'schoolName' => $hei ? ($hei->name ?? 'HEI Name') : 'HEI Name',
            'schoolType' => $hei ? ($hei->type ?? 'private') : 'private',
        ]);
    }

    private function getFacultyE2Data($heiId, $search, $year)
    {
        $query = \App\Models\Faculty::query();

        if (!$heiId) {
            $query->whereRaw('1 = 0');
        } else {
            $query->where('hei_id', $heiId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('degree', 'like', "%{$search}%");
            });
        }

        if ($year) {
            $query->where('joined_year', $year);
        }

        return $query->get()->map(function (\App\Models\Faculty $item) {
            $data = $item->toArray();
            $data['status'] = $item->status ?? 'Not Updated';
            return (object) $data;
        });
    }

    private function getFacultyE5Data($heiId, $search, $year)
    {
        $query = \App\Models\FacultyE5::query();

        if (!$heiId) {
            $query->whereRaw('1 = 0');
        } else {
            $query->where('hei_id', $heiId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($year) {
            $query->where('joined_year', $year);
        }

        return $query->get()->map(function (\App\Models\FacultyE5 $item) {
            $data = $item->toArray();
            $data['original_id'] = $item->id;
            $data['id'] = 'e5_' . $item->id;
            $data['fullTimeCode'] = $item->ft_pt_code;
            $data['genderCode'] = $item->gender_code;
            $data['disciplineCode'] = $item->discipline_code;
            $data['status'] = $item->status ?? 'Not Updated';
            return (object) $data;
        });
    }


    private function getAvailableYears($heiId)
    {
        if (!$heiId)
            return [];

        $yearsE2 = \App\Models\Faculty::where('hei_id', $heiId)
            ->whereNotNull('joined_year')
            ->distinct()
            ->pluck('joined_year');

        $yearsE5 = \App\Models\FacultyE5::where('hei_id', $heiId)
            ->whereNotNull('joined_year')
            ->distinct()
            ->pluck('joined_year');

        return $yearsE2->concat($yearsE5)->unique()->sortDesc()->values()->toArray();
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
                $data['subjects'] = $faculty->subjects;
                $data['id'] = $id; // "e5_..."

                $faculty = (object) $data;
            } else {
                \Illuminate\Support\Facades\Log::warning("FacultyE5 not found for ID: {$realId}");
            }
        } else {
            $faculty = \App\Models\Faculty::find($realId);
            if ($faculty) {
                // Map E2 fields to consistent E5 keys for frontend normalization
                $data = $faculty->toArray();
                $data['fullTimeCode'] = $faculty->employment;
                $data['rankCode'] = $faculty->rank;
                $data['degree'] = $faculty->degree;
                $data['id'] = $id;

                $faculty = (object) $data;
            } else {
                \Illuminate\Support\Facades\Log::warning("Faculty (E2) not found for ID: {$realId}");
            }
        }

        if (!$faculty)
            abort(404);

        $referenceData = $this->getReferenceData();

        $component = $isE5 ? 'EditFaculty/EditPrivateFaculty' : 'EditFaculty/EditPublicFaculty';

        // Check if the record's academic year is already submitted
        $heiId = \Illuminate\Support\Facades\Auth::user()->hei_id;
        $isSubmitted = \App\Models\HeiSubmission::where('hei_id', $heiId)
            ->where('academic_year', $faculty->joined_year)
            ->where('status', 'Submitted')
            ->exists();

        return \Inertia\Inertia::render($component, [
            'faculty' => $faculty,
            'referenceData' => $referenceData,
            'isSubmitted' => $isSubmitted,
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
        if (!$user || !$user->hei_id) {
            return redirect()->back()->with('error', 'You must be associated with an HEI to add faculty.');
        }

        $data = $request->all();
        $data['hei_id'] = $user->hei_id;

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
        if (!$user || !$user->hei_id) {
            return redirect()->back()->with('error', 'You must be associated with an HEI to import faculty.');
        }

        $data = $request->input('faculty');

        foreach ($data as $record) {
            // Use updateOrCreate to avoid duplicates if name exists, or just create
            // For now, strict create or basic updateOrCreate on email/name
            \App\Models\Faculty::updateOrCreate(
                [
                    'name' => $record['name'],
                    'hei_id' => $user->hei_id, // Scope by school
                    'joined_year' => $record['joined_year'] ?? null // Scope by year
                ],
                array_merge($record, ['hei_id' => $user->hei_id])
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
        if (!$user || !$user->hei_id) {
            return redirect()->back()->with('error', 'You must be associated with an HEI to import faculty.');
        }

        $data = $request->input('faculty');

        foreach ($data as $record) {
            // Map the generic fields to the specific faculty_e5 columns
            // Frontend sends camelCase keys (e.g. genderCode), we match them to snake_case db columns
            \App\Models\FacultyE5::updateOrCreate(
                [
                    'name' => $record['name'],
                    'hei_id' => $user->hei_id,
                    'joined_year' => $record['joined_year'] ?? null
                ],
                [
                    'email' => $record['email'],
                    'avatar_initials' => $record['avatar_initials'],
                    'form_type' => 'E5',
                    'status' => $record['status'],
                    'employment' => $record['employment'],
                    'hei_id' => $user->hei_id,

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

            \Illuminate\Support\Facades\Log::info("Faculty Update Request - ID: {$id}, RealID: {$realId}, isE5: " . ($isE5 ? 'Yes' : 'No'), $request->all());

            if ($isE5) {
                $faculty = \App\Models\FacultyE5::findOrFail($realId);

                // Map incoming camelCase fields to snake_case only if they exist in the request
                $updateData = [];
                if ($request->has('name'))
                    $updateData['name'] = $request->name;
                if ($request->has('email'))
                    $updateData['email'] = $request->email;
                if ($request->has('status'))
                    $updateData['status'] = $request->status;
                if ($request->has('joined_year'))
                    $updateData['joined_year'] = $request->joined_year;
                if ($request->has('employment'))
                    $updateData['employment'] = $request->employment;
                if ($request->has('fullTimeCode'))
                    $updateData['ft_pt_code'] = $request->fullTimeCode;
                if ($request->has('genderCode'))
                    $updateData['gender_code'] = $request->genderCode;
                if ($request->has('disciplineCode'))
                    $updateData['discipline_code'] = $request->disciplineCode;
                if ($request->has('degree'))
                    $updateData['highest_degree_code'] = $request->degree;
                if ($request->has('rankCode'))
                    $updateData['rank_code'] = $request->rankCode;
                if ($request->has('tenureCode'))
                    $updateData['tenure_code'] = $request->tenureCode;
                if ($request->has('salaryCode'))
                    $updateData['salary_range_code'] = $request->salaryCode;
                if ($request->has('loadCode'))
                    $updateData['teaching_load_code'] = $request->loadCode;
                if ($request->has('licenseCode'))
                    $updateData['license_code'] = $request->licenseCode;
                if ($request->has('bachelorsCode'))
                    $updateData['bachelors_code'] = $request->bachelorsCode;
                if ($request->has('mastersCode'))
                    $updateData['masters_code'] = $request->mastersCode;
                if ($request->has('doctorateCode'))
                    $updateData['doctorate_code'] = $request->doctorateCode;
                if ($request->has('subjects'))
                    $updateData['subjects'] = $request->subjects;

                $faculty->fill($updateData);
                $faculty->save();
            } else {
                $faculty = \App\Models\Faculty::findOrFail($realId);
                // For E2, we can mostly update directly from request keys that match column names
                $faculty->fill($request->only([
                    'name',
                    'email',
                    'status',
                    'department',
                    'college',
                    'rank',
                    'degree',
                    'employment',
                    'gender',
                    'is_tenured',
                    'joined_year',
                    'salary_grade',
                    'annual_salary',
                    'on_leave',
                    'fte',
                    'pursuing_degree',
                    'discipline_load_1',
                    'discipline_load_2',
                    'discipline_bachelors',
                    'discipline_masters',
                    'discipline_doctorate',
                    'masters_thesis',
                    'doctorate_dissertation',
                    'ug_lab_units',
                    'ug_lec_units',
                    'ug_total_units',
                    'ug_lab_hours',
                    'ug_lec_hours',
                    'ug_total_hours',
                    'ug_lab_contact',
                    'ug_lec_contact',
                    'ug_total_contact',
                    'grad_lab_units',
                    'grad_lec_units',
                    'grad_total_units',
                    'grad_lab_contact',
                    'grad_lec_contact',
                    'grad_total_contact',
                    'load_research',
                    'load_extension',
                    'load_study',
                    'load_production',
                    'load_admin',
                    'load_others',
                    'load_total'
                ]));
                $faculty->save();
            }


            \Illuminate\Support\Facades\Log::info("Faculty Update Successful - ID: {$id}");
            return redirect()->back()->with('success', 'Status updated successfully.');
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

        $year = trim($request->input('year'));
        \Illuminate\Support\Facades\Log::info("FacultyController@submit called for year: {$year}");

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->hei_id) {
            return redirect()->back()->with('error', 'You must be associated with an HEI to submit.');
        }

        // 1. Update all 'Not Updated' or 'Updated' records to 'Submitted' for the given year
        \App\Models\Faculty::where('joined_year', $year)
            ->where('hei_id', $user->hei_id)
            ->where('status', '!=', 'Submitted') // Only update if not already submitted
            ->update(['status' => 'Submitted']);

        \App\Models\FacultyE5::where('joined_year', $year)
            ->where('hei_id', $user->hei_id)
            ->where('status', '!=', 'Submitted')
            ->update(['status' => 'Submitted']);

        // 2. Count ALL submitted records for this year to store in the submission record
        $totalE2 = \App\Models\Faculty::where('joined_year', $year)
            ->where('hei_id', $user->hei_id)
            ->where('status', 'Submitted')
            ->count();

        $totalE5 = \App\Models\FacultyE5::where('joined_year', $year)
            ->where('hei_id', $user->hei_id)
            ->where('status', 'Submitted')
            ->count();

        $totalSubmitted = $totalE2 + $totalE5;

        if ($totalSubmitted > 0) {
            $heiName = $user->hei ? $user->hei->name : (\App\Models\Hei::find($user->hei_id)->name ?? 'Unknown HEI');
            $submittedBy = $user->name ?? 'Unknown User';

            // Create or update submission record
            \App\Models\HeiSubmission::create([
                'hei_id' => $user->hei_id,
                'hei_name' => $heiName,
                'academic_year' => $year,
                'submitted_by' => $submittedBy,
                'total_faculty' => $totalSubmitted,
                'status' => 'Submitted',
            ]);

            return redirect()->back()->with('success', "Successfully submitted {$totalSubmitted} faculty records for {$year}.");
        }

        return redirect()->back()->with('error', "No records found to submit for {$year}. Please ensure faculty records are added for this year.");
    }


    public function copyData(Request $request)
    {
        $request->validate([
            'source_year' => 'required|string',
            'target_year' => 'required|string',
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->hei_id) {
            return redirect()->back()->with('error', 'You must be associated with an HEI to copy data.');
        }

        $sourceYear = $request->input('source_year');
        $targetYear = $request->input('target_year');

        if ($sourceYear === $targetYear) {
            return redirect()->back()->with('error', 'Source and target years cannot be the same.');
        }

        // Copy E2 Faculty
        $e2Faculty = \App\Models\Faculty::where('hei_id', $user->hei_id)
            ->where('joined_year', $sourceYear)
            ->get();

        $e2Count = 0;
        foreach ($e2Faculty as $faculty) {
            /** @var \App\Models\Faculty $faculty */
            $newFaculty = $faculty->replicate();
            $newFaculty->joined_year = $targetYear;
            $newFaculty->status = 'Not Updated';

            // Check if it already exists for target year to prevent duplicates
            $exists = \App\Models\Faculty::where('hei_id', $user->hei_id)
                ->where('joined_year', $targetYear)
                ->where('name', $faculty->name)
                ->exists();

            if (!$exists) {
                $newFaculty->save();
                $e2Count++;
            }
        }

        // Copy E5 Faculty
        $e5Faculty = \App\Models\FacultyE5::where('hei_id', $user->hei_id)
            ->where('joined_year', $sourceYear)
            ->get();

        $e5Count = 0;
        foreach ($e5Faculty as $faculty) {
            /** @var \App\Models\FacultyE5 $faculty */
            $newFaculty = $faculty->replicate();
            $newFaculty->joined_year = $targetYear;
            $newFaculty->status = 'Not Updated';

            // Check if it already exists for target year
            $exists = \App\Models\FacultyE5::where('hei_id', $user->hei_id)
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
