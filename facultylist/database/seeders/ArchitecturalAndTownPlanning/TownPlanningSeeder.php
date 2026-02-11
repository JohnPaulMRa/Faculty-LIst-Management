<?php

namespace Database\Seeders\ArchitecturalAndTownPlanning;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TownPlanningSeeder extends Seeder
{
    public function run(): void
    {
        // 5822: Town Planning
        $this->seedGroup('5822', 'Town Planning', [
            ['code' => '582201', 'description' => 'Town and Country Planning'],
            ['code' => '582202', 'description' => 'Urban and Regional Planning'],
            ['code' => '582203', 'description' => 'Community Architecture'],
            ['code' => '582204', 'description' => 'Land Use Planning'],
            ['code' => '582205', 'description' => 'Transportation Planning'],
            ['code' => '582206', 'description' => 'Estate Planning Development'],
            ['code' => '582207', 'description' => 'Public Works Planning and Development'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '58',
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
                    'major_discipline_code' => '58',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
