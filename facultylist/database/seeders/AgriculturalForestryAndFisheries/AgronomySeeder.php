<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgronomySeeder extends Seeder
{
    public function run(): void
    {
        // 6208: Agronomy
        $this->seedGroup('6208', 'Agronomy', [
            ['code' => '620801', 'description' => 'Agronomy'],
            ['code' => '620802', 'description' => 'Plant Breeding'],
            ['code' => '620803', 'description' => 'Seed Science'],
            ['code' => '620804', 'description' => 'Weed Science'],
            ['code' => '620805', 'description' => 'Grain Science'],
            ['code' => '620806', 'description' => 'Crop Science'],
            ['code' => '620807', 'description' => 'Crop Protection'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '62',
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
