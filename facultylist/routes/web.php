<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'role:Faculty'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('facultyprofile', [\App\Http\Controllers\FacultyController::class, 'index'])->name('facultyprofile');
    Route::get('faculty/{id}/edit', [\App\Http\Controllers\FacultyController::class, 'edit'])->name('faculty.edit');
    Route::post('faculty', [\App\Http\Controllers\FacultyController::class, 'store'])->name('faculty.store');
    Route::put('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'update'])->name('faculty.update');
    Route::delete('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'destroy'])->name('faculty.destroy');
    Route::post('faculty/import', [\App\Http\Controllers\FacultyController::class, 'bulkStore'])->name('faculty.import');
    Route::post('faculty/submit', [\App\Http\Controllers\FacultyController::class, 'submit'])->name('faculty.submit');
});

Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {
    Route::get('/admin', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/admin/dashboard', function () {
        $schools = \App\Models\School::withCount('faculties')
            ->orderBy('name')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'faculty' => $s->faculties_count,
                'status' => $s->is_active ? 'Active' : 'Inactive',
            ]);

        return \Inertia\Inertia::render('Admin/AdminDashboard', [
            'schools' => $schools,
        ]);
    })->name('admin.dashboard');

    Route::get('/admin/faculty-list', function () {
        return Inertia::render('Admin/FacultyList');
    })->name('admin.faculty-list');

    Route::get('/admin/disciplines', function () {
        return Inertia::render('Admin/Disciplines');
    })->name('admin.disciplines');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('userprofile', function () {
        return Inertia::render('userprofile');
    })->name('userprofile');
});

require __DIR__ . '/settings.php';
