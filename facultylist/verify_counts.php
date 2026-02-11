<?php

use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$counts = DB::table('ref_discipline_group')
    ->select('major_discipline_code', DB::raw('count(*) as total'))
    ->groupBy('major_discipline_code')
    ->orderBy('major_discipline_code')
    ->get();

foreach ($counts as $count) {
    echo $count->major_discipline_code . ': ' . $count->total . PHP_EOL;
}
