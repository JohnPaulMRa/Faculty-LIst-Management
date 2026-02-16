<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Normalizing User Roles...\n";

// Update 'faculty' to 'Faculty'
$updatedFaculty = User::where(DB::raw('LOWER(role)'), 'faculty')
    ->update(['role' => 'Faculty']);

echo "Updated $updatedFaculty users to role 'Faculty'.\n";

// Update 'admin' to 'Admin'
$updatedAdmin = User::where(DB::raw('LOWER(role)'), 'admin')
    ->update(['role' => 'Admin']);

echo "Updated $updatedAdmin users to role 'Admin'.\n";

echo "Final User Roles:\n";
$users = User::all();
foreach ($users as $user) {
    echo "ID: {$user->id} | Name: {$user->name} | Expected Role: " . ($user->isAdmin() ? 'Admin' : ($user->isFaculty() ? 'Faculty' : 'Unknown')) . " | Actual Role: '{$user->role}'\n";
}
