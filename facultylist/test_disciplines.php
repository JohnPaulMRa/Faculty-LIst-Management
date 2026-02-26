<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\RefDisciplineGroup;
use App\Models\RefMajorDiscipline;
use App\Models\RefSpecificDiscipline;

$groups = RefDisciplineGroup::orderBy('code')->get();
$majors = RefMajorDiscipline::orderBy('code')->get();
$specifics = RefSpecificDiscipline::orderBy('code')->get();

$disciplines = $groups->map(function ($group) use ($majors, $specifics) {
    $groupMajors = $majors
        ->filter(fn($m) => str_starts_with($m->code, $group->code) && $m->code !== '0000')
        ->map(function ($major) use ($specifics) {
            $majorSpecifics = $specifics
                ->filter(fn($s) => str_starts_with($s->code, $major->code)
                    && strtoupper(trim($s->description)) !== strtoupper(trim($major->description)))
                ->map(fn($s) => [
                    'code' => $s->code,
                    'description' => $s->description,
                ])->values();

            return [
                'code' => $major->code,
                'description' => $major->description,
                'specifics' => $majorSpecifics,
            ];
        })->values()->toArray();

    $groupMajorCodes = $majors
        ->filter(fn($m) => str_starts_with($m->code, $group->code) && $m->code !== '0000')
        ->pluck('code')
        ->toArray();

    $orphanSpecifics = $specifics
        ->filter(function ($s) use ($group, $groupMajorCodes) {
            if (!str_starts_with($s->code, $group->code))
                return false;
            foreach ($groupMajorCodes as $mc) {
                if (str_starts_with($s->code, $mc))
                    return false;
            }
            return true;
        })
        ->map(fn($s) => [
            'code' => $s->code,
            'description' => $s->description,
        ])->values();

    if ($orphanSpecifics->isNotEmpty()) {
        $groupMajors[] = [
            'code' => $group->code . '_orphan',
            'description' => '(No Major Discipline)',
            'specifics' => $orphanSpecifics->toArray(),
        ];
    }

    return [
        'code' => $group->code,
        'description' => $group->description,
        'groups' => collect($groupMajors)->values(),
    ];
})->values();

echo "Codes in order:\n";
foreach ($disciplines as $d) {
    echo $d['code'] . " - " . $d['description'] . "\n";
}
