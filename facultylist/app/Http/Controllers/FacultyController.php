<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        // Auto-seed one mock record if DB is empty
        if (\App\Models\Faculty::count() === 0) {
            \App\Models\Faculty::create([
                'name' => 'Juan Cruz',
                'email' => 'juan.cruz@example.com',
                'department' => 'College of Science',
                'rank' => 'Professor I',
                'degree' => 'PhD',
                'status' => 'Completed',
                'employment' => 'Permanent',
                'avatar_initials' => 'JC',
                'joined_year' => '2024-2025',
                'form_type' => 'E5',
            ]);
        }

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

        $facultyData = $query->get();
        
        return \Inertia\Inertia::render('facultyprofile', [
            'initialFacultyData' => $facultyData,
            'filters' => $request->only(['search', 'year']) // Pass back filters to persist state
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

    public function update(Request $request, $id)
    {
        $faculty = \App\Models\Faculty::findOrFail($id);
        
        $faculty->update($request->all());

        return redirect()->back()->with('success', 'Faculty updated successfully.');
    }

    public function destroy($id)
    {
        $faculty = \App\Models\Faculty::findOrFail($id);
        $faculty->delete();

        return redirect()->back()->with('success', 'Faculty deleted successfully.');
    }
}
