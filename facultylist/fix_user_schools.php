<?php

use App\Models\User;
use App\Models\School;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Fixing User School Associations ---\n";

// Ensure School 1 exists
$school = School::find(1);
if (!$school) {
    echo "Error: School with ID 1 not found. Creating it...\n";
    $school = School::create([
        'id' => 1,
        'name' => 'Notre Dame of Marbel University',
        'code' => 'NDMU', // Assumption
        'is_active' => true,
        'type' => 'University' // Assumption
    ]);
    echo "Created School 1: {$school->name}\n";
} else {
    echo "Found School 1: {$school->name}\n";
}

// Update all users to belong to School 1
// Update all users to belong to School 1
$count = User::whereNull('school_id')->update(['school_id' => 1]);
echo "Updated {$count} users to School ID 1\n";

echo "\nTotal users updated: {$count}\n";
