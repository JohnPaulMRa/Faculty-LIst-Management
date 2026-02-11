<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HygieneSeeder extends Seeder
{
    public function run(): void
    {
        // 5002: Hygiene
        $this->seedGroup('5002', 'Hygiene', [
            ['code' => '500201', 'description' => 'Sanitary Science'],
            ['code' => '500202', 'description' => 'Community Health'],
            ['code' => '500203', 'description' => 'Public Health/Medical Health'],
            ['code' => '500205', 'description' => 'Health and Social Science'],
            ['code' => '500206', 'description' => 'Community Health Development and Management'],
            ['code' => '500207', 'description' => 'Cosmetic Science'],
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
