<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HorticultureSeeder extends Seeder
{
    public function run(): void
    {
        // 6206: Horticulture
        $this->seedGroup('6206', 'Horticulture', [
            ['code' => '620601', 'description' => 'Horticulture'],
            ['code' => '620602', 'description' => 'Plant Pathology'],
            ['code' => '620603', 'description' => 'Plant Science'],
            ['code' => '620604', 'description' => 'Horticulture Management'],
            ['code' => '620605', 'description' => 'Plant Genetic Resources Conservation and Management'],
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
