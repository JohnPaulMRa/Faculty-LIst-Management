<?php

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Database Verification ---\n";

// Check Major Disciplines
try {
    $majorCount = DB::table('ref_major_discipline')->count();
    echo "Major Disciplines Count: " . $majorCount . "\n";
    if ($majorCount > 0) {
        $firstMajor = DB::table('ref_major_discipline')->first();
        echo "First Major Discipline: " . json_encode($firstMajor) . "\n";
    }
} catch (\Exception $e) {
    echo "Error checking ref_major_discipline: " . $e->getMessage() . "\n";
}

// Check Specific Disciplines
try {
    $specificCount = DB::table('ref_specific_discipline')->count();
    echo "Specific Disciplines Count: " . $specificCount . "\n";
    if ($specificCount > 0) {
        $firstSpecific = DB::table('ref_specific_discipline')->first();
        echo "First Specific Discipline: " . json_encode($firstSpecific) . "\n";
    }
} catch (\Exception $e) {
    echo "Error checking ref_specific_discipline: " . $e->getMessage() . "\n";
}

// Simulate Controller Query for 'groupDiscipline'
try {
    $groupDiscipline = DB::table('ref_major_discipline')
        ->select('code', 'description as desc')
        ->orderBy('code')
        ->get();
    echo "Controller 'groupDiscipline' sample (first item): " . json_encode($groupDiscipline->first()) . "\n";
} catch (\Exception $e) {
    echo "Error simulating groupDiscipline query: " . $e->getMessage() . "\n";
}

// Simulate Controller Query for 'disciplines'
try {
    $disciplines = DB::table('ref_specific_discipline')
        ->select('major_discipline_code as major_group_code', 'code', 'description as desc')
        ->orderBy('code')
        ->get()
        ->groupBy('major_group_code');

    echo "Controller 'disciplines' structure check:\n";
    if ($disciplines->isNotEmpty()) {
        $firstGroupKey = $disciplines->keys()->first();
        echo "First Group Key: " . $firstGroupKey . "\n";
        echo "First Item in Group: " . json_encode($disciplines->first()->first()) . "\n";
    } else {
        echo "Disciplines collection is empty.\n";
    }

} catch (\Exception $e) {
    echo "Error simulating disciplines query: " . $e->getMessage() . "\n";
}

echo "--- End Verification ---\n";
