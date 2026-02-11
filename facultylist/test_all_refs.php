<?php

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- All Reference Tables Verification ---\n";

$tables = [
    'e5_ref_gender',
    'e5_ref_full_time_part_time',
    'e5_ref_highest_degree',
    'e5_ref_professional_license',
    'e5_ref_tenure',
    'e5_ref_faculty_rank',
    'e5_ref_teaching_load',
    'e5_ref_annual_salary',
    'ref_major_discipline',
    'ref_specific_discipline'
];

foreach ($tables as $table) {
    try {
        $count = DB::table($table)->count();
        echo "Table '{$table}': {$count} rows\n";
        if ($count === 0) {
            echo "  -> WARNING: TABLE IS EMPTY!\n";
        }
    } catch (\Exception $e) {
        echo "Error checking '{$table}': " . $e->getMessage() . "\n";
    }
}

echo "--- End Verification ---\n";
