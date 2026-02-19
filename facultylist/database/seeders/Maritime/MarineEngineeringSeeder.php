<?php

namespace Database\Seeders\Maritime;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarineEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // Maritime - Marine Engineering
        // Note: These codes start with 54 (Engineering) but user grouped them under Maritime
        $this->seedGroup('5499', 'Marine Engineering', [
            ['code' => '549922', 'description' => 'Marine Engineering/Technology'],
            ['code' => '549923', 'description' => 'Naval Architecture and Marine Engineering'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        // Seed Group
        $majorCode = '90'; // Hardcoded to 90 for MARITIME as requested

        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => $majorCode,
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Specifics
        foreach ($specifics as $specific) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => '90', // Hardcoded to 90 for MARITIME as requested
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
