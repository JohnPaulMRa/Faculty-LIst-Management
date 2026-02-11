<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FisheryScienceAndTechnologySeeder extends Seeder
{
    public function run(): void
    {
        // 6272: Fishery Science and Technology
        $this->seedGroup('6272', 'Fishery Science and Technology', [
            ['code' => '627201', 'description' => 'Fisheries'],
            ['code' => '627202', 'description' => 'Fisheries Technology'],
            ['code' => '627204', 'description' => 'Fishery Farming Extension'],
            ['code' => '627205', 'description' => 'Fishing Technology'],
            ['code' => '627206', 'description' => 'Inland Fisheries'],
            ['code' => '627207', 'description' => 'Aquaculture'],
            ['code' => '627208', 'description' => 'Fish Processing Technology'],
            ['code' => '627209', 'description' => 'Fisheries Biology'],
            ['code' => '627210', 'description' => 'Aquaculture Technology'],
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
