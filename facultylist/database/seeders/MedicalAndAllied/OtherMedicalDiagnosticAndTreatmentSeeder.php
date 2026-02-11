<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherMedicalDiagnosticAndTreatmentSeeder extends Seeder
{
    public function run(): void
    {
        // 5099: Other Medical Diagnostic and Treatment
        $this->seedGroup('5099', 'Other Medical Diagnostic and Treatment', [
            ['code' => '509901', 'description' => 'Rural Medicine'],
            ['code' => '509902', 'description' => 'Paramedics'],
            ['code' => '509903', 'description' => 'Health Science Education'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '50',
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        foreach ($specifics as $specific) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => '50',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
