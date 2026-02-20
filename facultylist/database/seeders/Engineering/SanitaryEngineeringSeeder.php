<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SanitaryEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5450: Sanitary Engineering
        $this->seedGroup('5450', 'Sanitary Engineering', [
            ['code' => '545001', 'description' => 'Environmental and Sanitary Engineering'],
            ['code' => '545002', 'description' => 'Sanitary Engineering'],
            ['code' => '545003', 'description' => 'Public Health Engineering'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '54',
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
                    'major_discipline_code' => $groupCode,
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
