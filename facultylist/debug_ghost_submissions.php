<?php

use App\Models\User;
use App\Models\School;
use App\Models\Faculty;
use App\Models\FacultyE5;
use App\Models\SchoolSubmission;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Debugging Ghost Submissions ---\n";

// 1. Check Schools
echo "\n1. Schools:\n";
$schools = School::all();
foreach ($schools as $school) {
    echo "ID: {$school->id} | Name: {$school->name} | Active: " . ($school->is_active ? 'Yes' : 'No') . "\n";
}

// 2. Check Users and their School Associations
echo "\n2. Users:\n";
$users = User::all();
foreach ($users as $user) {
    echo "ID: {$user->id} | Name: {$user->name} | Email: {$user->email} | School ID: " . ($user->school_id ?? 'NULL') . "\n";
}

// 3. Faculty Counts per School
echo "\n3. Faculty Counts (E2):\n";
foreach ($schools as $school) {
    $count = Faculty::where('school_id', $school->id)->count();
    echo "School '{$school->name}' (ID {$school->id}): {$count} E2 records\n";
}
$nullSchoolCount = Faculty::whereNull('school_id')->count();
echo "Faculty with NULL school_id: {$nullSchoolCount}\n";

echo "\n3b. Faculty Counts (E5):\n";
foreach ($schools as $school) {
    $count = FacultyE5::where('school_id', $school->id)->count();
    echo "School '{$school->name}' (ID {$school->id}): {$count} E5 records\n";
}
$nullSchoolE5Count = FacultyE5::whereNull('school_id')->count();
echo "Faculty (E5) with NULL school_id: {$nullSchoolE5Count}\n";

// 4. Recent Submissions
echo "\n4. Recent School Submissions:\n";
$submissions = SchoolSubmission::orderBy('created_at', 'desc')->take(5)->get();
foreach ($submissions as $sub) {
    echo "ID: {$sub->id} | School Name: {$sub->school_name} | Submitted By: {$sub->submitted_by} | Status: {$sub->status}\n";
}
