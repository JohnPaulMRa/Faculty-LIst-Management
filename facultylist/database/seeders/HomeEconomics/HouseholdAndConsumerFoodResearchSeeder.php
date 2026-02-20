<?php

namespace Database\Seeders\HomeEconomics;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HouseholdAndConsumerFoodResearchSeeder extends Seeder
{
    public function run(): void
    {
        // 6612: HE w/ Emphasis on Household & Consumer Food Research; Nutrition
        $this->seedGroup('6612', 'HE w/ Emphasis on Household & Consumer Food Research; Nutrition', [
            ['code' => '661201', 'description' => 'Foods and Nutrition'],
            ['code' => '661202', 'description' => 'Community Nutrition'],
            ['code' => '661204', 'description' => 'Nutrition'],
            ['code' => '661206', 'description' => 'Applied Nutrition'],
            ['code' => '661207', 'description' => 'Nutrition and Food Planning'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '66',
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
