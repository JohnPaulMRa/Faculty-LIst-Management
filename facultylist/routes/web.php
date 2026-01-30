
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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('facultyprofile', function () {
        return Inertia::render('facultyprofile');
    })->name('facultyprofile');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('userprofile', function () {
        return Inertia::render('userprofile');
    })->name('userprofile');
});

require __DIR__.'/settings.php';
