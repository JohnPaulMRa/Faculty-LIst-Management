<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ForestrySeeder extends Seeder
{
    public function run(): void
    {
        // 6262: Forestry
        $this->seedGroup('6262', 'Forestry', [
            ['code' => '626201', 'description' => 'Forestry'],
            ['code' => '626202', 'description' => 'Agro-Forestry'],
            ['code' => '626204', 'description' => 'Forest Ranger'],
            ['code' => '626205', 'description' => 'Forest Biological Science'],
            ['code' => '626206', 'description' => 'Forest Entomology'],
            ['code' => '626207', 'description' => 'Forest Resource Management'],
            ['code' => '626208', 'description' => 'Wild Life Studies'],
            ['code' => '626209', 'description' => 'Wood Science and Technology'],
            ['code' => '626210', 'description' => 'Forest Technology'],
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
