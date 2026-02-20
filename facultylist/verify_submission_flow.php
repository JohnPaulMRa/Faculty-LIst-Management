<?php

use App\Models\User;
use App\Models\School;
use App\Models\Faculty;
use App\Models\SchoolSubmission;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Verifying Submission Flow ---\n";

// 1. Login as testNdmu (ID 9)
$user = User::find(9);
if (!$user) {
    die("User ID 9 not found.\n");
}
Auth::login($user);
echo "Logged in as: {$user->name} (School ID: {$user->school_id})\n";

if ($user->school_id !== 1) {
    die("Error: User school_id is not 1. Run fix_user_schools.php first.\n");
}

// 2. Create a Mock Faculty
echo "Creating mock faculty...\n";
$faculty = Faculty::create([
    'school_id' => $user->school_id,
    'name' => 'Test Faculty Member ' . time(),
    'email' => 'testfaculty' . time() . '@example.com',
    'department' => 'Science',
    'rank' => 'Professor',
    'degree' => 'PhD',
    'status' => 'Pending', // Initial status
    'employment' => 'Full-time',
    'joined_year' => '2025',
    'form_type' => 'E2'
]);
echo "Created Faculty ID: {$faculty->id}\n";

// 3. Simulate Submission Logic (based on FacultyController::submit)
$year = '2025';
echo "Simulating submission for Year: {$year}...\n";

// Update Status
$updatedCount = Faculty::where('joined_year', $year)
    ->where('school_id', $user->school_id)
    ->update(['status' => 'Completed']);

echo "Updated {$updatedCount} faculty records to 'Completed'.\n";

if ($updatedCount === 0) {
    die("Error: No faculty updated. Submission failed logic check.\n");
}

// Create Submission Record
$schoolName = $user->school ? $user->school->name : 'Unknown';
echo "School Name resolved to: {$schoolName}\n";

$submission = SchoolSubmission::create([
    'school_id' => $user->school_id,
    'school_name' => $schoolName,
    'academic_year' => $year,
    'submitted_by' => $user->name,
    'total_faculty' => $updatedCount,
    'status' => 'Completed',
]);

echo "Created SchoolSubmission ID: {$submission->id}\n";

// 4. Verify Final State
$finalCheck = SchoolSubmission::find($submission->id);
if ($finalCheck && $finalCheck->school_id == 1 && $finalCheck->school_name == 'Notre Dame of Marbel University') {
    echo "SUCCESS: Submission verification passed!\n";
} else {
    echo "FAILURE: Submission verification failed.\n";
    print_r($finalCheck);
}
