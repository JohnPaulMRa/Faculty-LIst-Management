<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        // Auto-seed logic removed

        $query = \App\Models\Faculty::query();

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%")
                  ->orWhere('degree', 'like', "%{$search}%");
            });
        }

        // Year Filter
        if ($request->filled('year') && $request->input('year') !== 'All Years') {
            $query->where('joined_year', $request->input('year'));
        }

        // Fetch Reference Data from Database
        $referenceData = [
            'gender' => \Illuminate\Support\Facades\DB::table('e5_ref_gender')->select('code', 'description as desc')->get(),
            'fullTimePartTime' => \Illuminate\Support\Facades\DB::table('e5_ref_full_time_part_time')->select('code', 'description as desc')->get(),
            'highestDegree' => \Illuminate\Support\Facades\DB::table('e5_ref_highest_degree')->select('code', 'description as desc')->get(),
            'professionalLicense' => \Illuminate\Support\Facades\DB::table('e5_ref_professional_license')->select('code', 'description as desc')->get(),
            'tenure' => \Illuminate\Support\Facades\DB::table('e5_ref_tenure')->select('code', 'description as desc')->get(),
            'facultyRank' => \Illuminate\Support\Facades\DB::table('e5_ref_faculty_rank')->select('code', 'description as desc')->get(),
            'teachingLoad' => \Illuminate\Support\Facades\DB::table('e5_ref_teaching_load')->select('code', 'description as desc')->get(),
            'annualSalary' => \Illuminate\Support\Facades\DB::table('e5_ref_annual_salary')->select('code', 'description as desc')->get(),
            
            // Simplified disciplines for direct controller injection (Static for now as no table exists yet)
            // Simplified disciplines for direct controller injection (Now Dynamic)
            'groupDiscipline' => \Illuminate\Support\Facades\DB::table('e5_ref_major_group')
                ->select('code', 'description as desc')
                ->orderBy('code')
                ->get(),

            'disciplines' => \Illuminate\Support\Facades\DB::table('e5_ref_discipline')
                ->select('major_group_code', 'code', 'description as desc')
                ->orderBy('code')
                ->get()
                ->groupBy('major_group_code')
        ];
        
        $facultyData = $query->get();

        return \Inertia\Inertia::render('facultyprofile', [
            'initialFacultyData' => $facultyData,
            'filters' => $request->only(['search', 'year']),
            'referenceData' => $referenceData
        ]);
    }

    public function store(Request $request)
    {
        // Basic validation - can be expanded
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:faculties,email',
            // Add other mandatory fields
        ]);
        
        // For now allowing all fields from request for flexibility with imports
        \App\Models\Faculty::create($request->all());

        return redirect()->back()->with('success', 'Faculty created successfully.');
    }

    public function bulkStore(Request $request)
    {
        $data = $request->validate([
            'faculty' => 'required|array',
            'faculty.*.name' => 'required|string',
        ]);

        foreach ($data['faculty'] as $record) {
            // Use updateOrCreate to avoid duplicates if name exists, or just create
            // For now, strict create or basic updateOrCreate on email/name
            \App\Models\Faculty::updateOrCreate(
                ['name' => $record['name']], // Unique key check
                $record
            );
        }

        return redirect()->back()->with('success', 'Faculty imported successfully.');
    }

    public function update(Request $request, $id)
    {
        $faculty = \App\Models\Faculty::findOrFail($id);
        
        $faculty->update($request->all());

        return redirect()->back()->with('success', 'Faculty updated successfully.');
    }

    public function destroy($id)
    {
        $faculty = \App\Models\Faculty::find($id);

        if ($faculty) {
            $faculty->delete();
            return redirect()->back()->with('success', 'Faculty deleted successfully.');
        }

        return redirect()->back()->with('error', 'Faculty not found.');
    }
}
