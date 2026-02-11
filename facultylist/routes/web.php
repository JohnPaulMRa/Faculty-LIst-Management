
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('facultyprofile', [\App\Http\Controllers\FacultyController::class, 'index'])->name('facultyprofile');
    Route::post('faculty', [\App\Http\Controllers\FacultyController::class, 'store'])->name('faculty.store');
    Route::put('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'update'])->name('faculty.update');
    Route::delete('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'destroy'])->name('faculty.destroy');
    Route::post('faculty/import', [\App\Http\Controllers\FacultyController::class, 'bulkStore'])->name('faculty.import');
    Route::post('faculty/submit', [\App\Http\Controllers\FacultyController::class, 'submit'])->name('faculty.submit');
    
    // Admin Routes
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('userprofile', function () {
        return Inertia::render('userprofile');
    })->name('userprofile');
});

require __DIR__.'/settings.php';
