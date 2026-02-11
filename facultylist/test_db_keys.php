<?php

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Key Verification ---\n";

// Get valid major codes
$majorCodes = DB::table('ref_major_discipline')->pluck('code')->toArray();
echo "Sample Major Codes: " . implode(', ', array_slice($majorCodes, 0, 5)) . "\n";

// Get sample specific discipline and its foreign key
$sampleSpecific = DB::table('ref_specific_discipline')
    ->select('code', 'major_discipline_code')
    ->first();

if ($sampleSpecific) {
    echo "Sample Specific Discipline: Code={$sampleSpecific->code}, FK_Major={$sampleSpecific->major_discipline_code}\n";

    if (in_array($sampleSpecific->major_discipline_code, $majorCodes)) {
        echo "MATCH: Specific discipline FK exists in Major codes.\n";
    } else {
        echo "MISMATCH: Specific discipline FK '{$sampleSpecific->major_discipline_code}' NOT FOUND in Major codes.\n";
    }
} else {
    echo "No specific disciplines found.\n";
}

// Simulate Controller Structure again with JSON encode to see structure
$disciplines = DB::table('ref_specific_discipline')
    ->select('major_discipline_code as major_group_code', 'code', 'description as desc')
    ->orderBy('code')
    ->limit(2)
    ->get()
    ->groupBy('major_group_code');

echo "Controller Structure Sample: " . json_encode($disciplines) . "\n";
