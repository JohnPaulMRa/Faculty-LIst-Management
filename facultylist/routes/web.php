<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::redirect('/', '/login');


Route::middleware(['auth', 'verified', 'role:Faculty'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('facultyprofile', [\App\Http\Controllers\FacultyController::class, 'index'])->name('facultyprofile');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('userprofile', [\App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('userprofile');

    // Faculty Management Routes (accessible to Faculty & Admin)
    Route::get('faculty/{id}/edit', [\App\Http\Controllers\FacultyController::class, 'edit'])->name('faculty.edit');
    Route::post('faculty', [\App\Http\Controllers\FacultyController::class, 'store'])->name('faculty.store');
    Route::put('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'update'])->name('faculty.update');
    Route::delete('faculty/{id}', [\App\Http\Controllers\FacultyController::class, 'destroy'])->name('faculty.destroy');
    Route::post('faculty/import', [\App\Http\Controllers\FacultyController::class, 'bulkStore'])->name('faculty.import');
    Route::post('faculty/import-e5', [\App\Http\Controllers\FacultyController::class, 'bulkStoreE5'])->name('faculty.importE5');
    Route::post('faculty/submit', [\App\Http\Controllers\FacultyController::class, 'submit'])->name('faculty.submit');
    Route::post('faculty/copy-data', [\App\Http\Controllers\FacultyController::class, 'copyData'])->name('faculty.copyData');
});

Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {
    Route::get('/admin', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/admin/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::get('/admin/faculty-list', [\App\Http\Controllers\AdminController::class, 'facultyList'])->name('admin.faculty-list');
    Route::get('/admin/heis-accounts', [\App\Http\Controllers\AdminController::class, 'heisAccounts'])->name('admin.heis-accounts');

    Route::get('/admin/faculty/{id}', [\App\Http\Controllers\AdminController::class, 'showFaculty'])->name('admin.faculty.show');

    Route::get('/admin/disciplines', [\App\Http\Controllers\AdminController::class, 'disciplines'])->name('admin.disciplines');
    Route::post('/admin/disciplines', [\App\Http\Controllers\AdminController::class, 'storeDiscipline'])->name('admin.disciplines.store');
    Route::put('/admin/disciplines/{code}', [\App\Http\Controllers\AdminController::class, 'updateDiscipline'])->name('admin.disciplines.update');
    Route::delete('/admin/disciplines/{code}', [\App\Http\Controllers\AdminController::class, 'destroyDiscipline'])->name('admin.disciplines.destroy');

    // HEI Management
    Route::post('/admin/heis', [\App\Http\Controllers\AdminController::class, 'storeHei'])->name('admin.heis.store');
    Route::put('/admin/heis/{id}', [\App\Http\Controllers\AdminController::class, 'updateHei'])->name('admin.heis.update');
    Route::delete('/admin/heis/{id}', [\App\Http\Controllers\AdminController::class, 'destroyHei'])->name('admin.heis.destroy');

    // User Management
    Route::post('/admin/faculty/create-account', [\App\Http\Controllers\AdminController::class, 'createFacultyAccount'])->name('admin.faculty.create-account');
    Route::put('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'updateUserAccount'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroyUserAccount'])->name('admin.users.destroy');
});

require __DIR__ . '/settings.php';
