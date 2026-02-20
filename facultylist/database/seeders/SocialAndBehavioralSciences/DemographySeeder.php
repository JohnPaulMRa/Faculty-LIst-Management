<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemographySeeder extends Seeder
{
    public function run(): void
    {
        // 3033: Demography
        $this->seedGroup('3033', 'Demography', [
            ['code' => '303301', 'description' => 'Demography'],
            ['code' => '303302', 'description' => 'Population Communication'],
            ['code' => '303303', 'description' => 'Population Studies'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '30',
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
