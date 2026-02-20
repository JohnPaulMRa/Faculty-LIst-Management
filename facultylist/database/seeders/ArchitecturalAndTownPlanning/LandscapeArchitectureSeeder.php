<?php

namespace Database\Seeders\ArchitecturalAndTownPlanning;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LandscapeArchitectureSeeder extends Seeder
{
    public function run(): void
    {
        // 5812: Landscape Architecture
        $this->seedGroup('5812', 'Landscape Architecture', [
            ['code' => '581201', 'description' => 'Landscape Architecture'],
            ['code' => '581202', 'description' => 'Tropical Landscape Architecture'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '58',
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
