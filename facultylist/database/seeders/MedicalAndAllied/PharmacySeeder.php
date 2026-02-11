<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PharmacySeeder extends Seeder
{
    public function run(): void
    {
        // 5052: Pharmacy
        $this->seedGroup('5052', 'Pharmacy', [
            ['code' => '505201', 'description' => 'Industrial Pharmacy'],
            ['code' => '505202', 'description' => 'Pharmaceutical Chemistry'],
            ['code' => '505203', 'description' => 'Pharmacy'],
            ['code' => '505204', 'description' => 'Hospital Pharmacy'],
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
