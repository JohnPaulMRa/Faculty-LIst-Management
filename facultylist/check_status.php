<?php
use App\Models\Faculty;
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Faculty Status Check ---\n";
$statuses = Faculty::select('status', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
    ->groupBy('status')
    ->get();

foreach ($statuses as $s) {
    echo "Status: '{$s->status}' - Count: {$s->count}\n";
}

echo "--- Gender Check ---\n";
$genders = Faculty::select('genderCode', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
    ->groupBy('genderCode')
    ->get();

foreach ($genders as $g) {
    echo "Gender Code: '{$g->genderCode}' - Count: {$g->count}\n";
}
