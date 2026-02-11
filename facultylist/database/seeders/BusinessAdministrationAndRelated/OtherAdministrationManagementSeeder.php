<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherAdministrationManagementSeeder extends Seeder
{
    public function run(): void
    {
        // 3472: Other Administration/Management and Related
        $this->seedGroup('3472', 'Other Administration/Management and Related', [
            ['code' => '347201', 'description' => 'Cooperative Management'],
            ['code' => '347203', 'description' => 'Recreation and Parks Administration'],
            ['code' => '347204', 'description' => 'Supply Administration/Management'],
            ['code' => '347206', 'description' => 'Extension Administration'],
            ['code' => '347207', 'description' => 'Resource Management'],
            ['code' => '347208', 'description' => 'Development Management/Administration'],
            ['code' => '347209', 'description' => 'Administration and Supervision'],
            ['code' => '347210', 'description' => 'Organizational Development and Planning'],
            ['code' => '347212', 'description' => 'Maritime Management'],
            ['code' => '347213', 'description' => 'Developmental Administration/Management'],
            ['code' => '347214', 'description' => 'Livelihood Management'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '34',
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
                    'major_discipline_code' => '34',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
