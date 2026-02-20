<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InstitutionalAdministrationManagementSeeder extends Seeder
{
    public function run(): void
    {
        // 3462: Institutional Administration/Management
        $this->seedGroup('3462', 'Institutional Administration/Management', [
            ['code' => '346201', 'description' => 'Hotel and Restaurant Management'],
            ['code' => '346202', 'description' => 'Airline Business Administration/Management'],
            ['code' => '346204', 'description' => 'Educational Administration and Supervision'],
            ['code' => '346205', 'description' => 'Food Service Administration'],
            ['code' => '346206', 'description' => 'Hospital Administration'],
            ['code' => '346209', 'description' => 'Industrial Cafeteria Management'],
            ['code' => '346210', 'description' => 'Institutional Food Administration'],
            ['code' => '346211', 'description' => 'Postal Administration'],
            ['code' => '346212', 'description' => 'Shipping Management and Accountancy'],
            ['code' => '346213', 'description' => 'Small Industry Management'],
            ['code' => '346214', 'description' => 'Media Management'],
            ['code' => '346215', 'description' => 'Police Management'],
            ['code' => '346216', 'description' => 'Vocational School Management'],
            ['code' => '346217', 'description' => 'School Administration/Management'],
            ['code' => '346218', 'description' => 'Agricultural School Administration'],
            ['code' => '346219', 'description' => 'Elementary School Management'],
            ['code' => '346220', 'description' => 'Institutional Development Management'],
            ['code' => '346221', 'description' => 'Nursing Administration/Management'],
            ['code' => '346222', 'description' => 'Customs Administration'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '34',
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
