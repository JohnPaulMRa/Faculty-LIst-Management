<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FoodSciencesAndTechnologySeeder extends Seeder
{
    public function run(): void
    {
        // 6222: Food Sciences and Technology
        $this->seedGroup('6222', 'Food Sciences and Technology', [
            ['code' => '622201', 'description' => 'Food Technology'],
            ['code' => '622203', 'description' => 'Food Science'],
            ['code' => '622204', 'description' => 'Food Science and Technology'],
            ['code' => '622205', 'description' => 'Food Processing'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '62',
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
                    'major_discipline_code' => '62',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
