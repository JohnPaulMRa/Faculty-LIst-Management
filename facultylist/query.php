<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$specifics = \Illuminate\Support\Facades\DB::table('ref_specific_discipline')->get();
$groups = \Illuminate\Support\Facades\DB::table('ref_major_discipline')->get();

$matched = 0;
foreach ($specifics as $s) {
    $found = false;
    foreach ($groups as $g) {
        if (str_starts_with($s->code, (string) $g->code)) {
            $found = true;
            break;
        }
    }
    if ($found)
        $matched++;
}
echo "Matched $matched out of " . count($specifics) . "\n";
