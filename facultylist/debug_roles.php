<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking Users and Roles:\n";
$users = User::all();

foreach ($users as $user) {
    echo "ID: {$user->id} | Name: {$user->name} | Email: {$user->email} | Role: '{$user->role}'\n";
}
