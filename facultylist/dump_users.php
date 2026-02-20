<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(6);
if ($user) {
    $user->school_id = 1;
    $user->save();
    echo "Fixed user 6 school_id to 1\n";
} else {
    echo "User 6 not found\n";
}
