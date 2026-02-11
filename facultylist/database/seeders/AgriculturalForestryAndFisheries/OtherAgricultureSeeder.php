<?php

namespace Database\Seeders\AgriculturalForestryAndFisheries;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherAgricultureSeeder extends Seeder
{
    public function run(): void
    {
        // 6249: Other Agriculture
        $this->seedGroup('6249', 'Other Agriculture', [
            ['code' => '624902', 'description' => 'Agricultural Chemistry'],
            ['code' => '624903', 'description' => 'Agricultural Development'],
            ['code' => '624904', 'description' => 'Agricultural Extension'],
            ['code' => '624905', 'description' => 'Agricultural Homemaking'],
            ['code' => '624906', 'description' => 'Agricultural Management'],
            ['code' => '624907', 'description' => 'Development Communication'],
            ['code' => '624908', 'description' => 'Agricultural Technology Management'],
            ['code' => '624909', 'description' => 'Agrometeorology'],
            ['code' => '624911', 'description' => 'Farming System'],
            ['code' => '624912', 'description' => 'Sugar Technology'],
            ['code' => '624913', 'description' => 'Rice Technology'],
            ['code' => '624915', 'description' => 'Agrarian Studies/Reform'],
            ['code' => '624918', 'description' => 'Agro-Industrial Technology Mgt.'],
            ['code' => '624919', 'description' => 'Sericulture'],
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
