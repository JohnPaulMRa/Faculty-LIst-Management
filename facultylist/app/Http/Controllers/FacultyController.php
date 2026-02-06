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

        // Hardcoded Reference Data (formerly in Service/Mock files)
        $referenceData = [
            'gender' => [
                ['code' => "1", 'desc' => "Male"],
                ['code' => "2", 'desc' => "Female"]
            ],
            'fullTimePartTime' => [
                ['code' => "1", 'desc' => "The person is a full-time employee of the HEI."],
                ['code' => "2", 'desc' => "The person is a half-time employee of the HEI."],
                ['code' => "3", 'desc' => "Student employee such as Student Assistant or Graduate Assistant."],
                ['code' => "4", 'desc' => "Teaching Fellow, Associate or Assistant."],
                ['code' => "5", 'desc' => "None of the above and therefore part-time."],
                ['code' => "9", 'desc' => "Not known or not indicated."]
            ],
            'tenure' => [
                ['code' => "1", 'desc' => "Permanent"],
                ['code' => "2", 'desc' => "Probationary"],
                ['code' => "3", 'desc' => "Casual"],
                ['code' => "4", 'desc' => "Contractual"]
            ],
            'facultyRank' => [
                ['code' => "09", 'desc' => "Teaching Fellow or Teaching Associate"],
                ['code' => "10", 'desc' => "Teacher, Master Teacher"],
                ['code' => "11", 'desc' => "Lecturer, Senior Lecturer, Professorial Lecturer"],
                ['code' => "12", 'desc' => "Professor Emeritus"],
                ['code' => "13", 'desc' => "Visiting Professor"],
                ['code' => "14", 'desc' => "Adjunct or affiliate faculty"],
                ['code' => "20", 'desc' => "Instructor"],
                ['code' => "30", 'desc' => "Assistant Professor"],
                ['code' => "40", 'desc' => "Associate Professor"],
                ['code' => "50", 'desc' => "Full Professor"],
                ['code' => "90", 'desc' => "Others"]
            ],
            'teachingLoad' => [
                ['code' => "00", 'desc' => "No teaching load"],
                ['code' => "10", 'desc' => "1.0 - 6.0 units per semester"],
                ['code' => "20", 'desc' => "7.0 - 12.0 units per semester"],
                ['code' => "30", 'desc' => "13.0 - 18.0 units per semester"],
                ['code' => "40", 'desc' => "19.0 - 24.0 units per semester"],
                ['code' => "50", 'desc' => "more than 24 units per semester"],
                ['code' => "90", 'desc' => "Not known"]
            ],
            'annualSalary' => [
                ['code' => "1", 'desc' => "60,000 below"],
                ['code' => "2", 'desc' => "60,000 - 69,999"],
                ['code' => "3", 'desc' => "70,000 - 79,999"],
                ['code' => "4", 'desc' => "80,000 - 89,999"],
                ['code' => "5", 'desc' => "90,000 - 99,999"],
                ['code' => "6", 'desc' => "100,000 - 149,999"],
                ['code' => "7", 'desc' => "150,000 - 249,999"],
                ['code' => "8", 'desc' => "250,000 - 499,999"],
                ['code' => "9", 'desc' => "500,000 - UP"]
            ],
            'highestDegree' => [
                 ['code' => "000", 'desc' => "No formal education at all"],
                 ['code' => "103", 'desc' => "Completed Elementary School"],
                 ['code' => "202", 'desc' => "Secondary school graduate"],
                 ['code' => "507", 'desc' => "Completed a baccalaureate degree"],
                 ['code' => "602", 'desc' => "Completed post-grad certificate"],
                 ['code' => "803", 'desc' => "Completed masters degree"],
                 ['code' => "903", 'desc' => "Completed doctorate degree"]
            ],
             'professionalLicense' => [
                ['code' => "1", 'desc' => "PRC in Accountancy"],
                ['code' => "7", 'desc' => "PRC in Chemistry"],
                ['code' => "8", 'desc' => "PRC in Civil Engineering"],
                ['code' => "23", 'desc' => "PRC in LET-Elementary"],
                ['code' => "24", 'desc' => "PRC in LET-Secondary"],
                ['code' => "30", 'desc' => "PRC in Physician"],
                ['code' => "35", 'desc' => "PRC in Nursing"],
                ['code' => "90", 'desc' => "No licensure earned."]
            ],
            // Simplified disciplines for direct controller injection (full list is too large for this snippet, assuming key ones)
            'groupDiscipline' => [
                ['code' => "22", 'desc' => "Humanities"],
                ['code' => "46", 'desc' => "Mathematics"],
                ['code' => "47", 'desc' => "IT-Related"],
                ['code' => "54", 'desc' => "Engineering"],
                ['code' => "14", 'desc' => "Education Science"],
                ['code' => "00", 'desc' => "General"]
            ],
            'disciplines' => [
                 "47" => [['code' => "464101", 'desc' => "Computer Science"], ['code' => "464108", 'desc' => "Information Technology"]],
                 "46" => [['code' => "460100", 'desc' => "General Mathematics"]],
                 "14" => [['code' => "140101", 'desc' => "Elementary Education"], ['code' => "140102", 'desc' => "Secondary Education"]],
                 "00" => [['code' => "001001", 'desc' => "Pre-School/Elementary"], ['code' => "001002", 'desc' => "Secondary"]]
            ]
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
