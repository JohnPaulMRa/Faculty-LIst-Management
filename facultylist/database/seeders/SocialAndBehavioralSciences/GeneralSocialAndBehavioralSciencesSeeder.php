<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralSocialAndBehavioralSciencesSeeder extends Seeder
{
    public function run(): void
    {
        // 3001: General Social and Behavioral Sciences
        $this->seedGroup('3001', 'General Social and Behavioral Sciences', [
            ['code' => '300101', 'description' => 'Social Science'],
            ['code' => '300102', 'description' => 'Behavioral Science'],
            ['code' => '300103', 'description' => 'Human Behavior Technology'],
            ['code' => '300104', 'description' => 'Social Studies'],
            ['code' => '300105', 'description' => 'Applied Social Research'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '30',
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
                    'major_discipline_code' => '30',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
