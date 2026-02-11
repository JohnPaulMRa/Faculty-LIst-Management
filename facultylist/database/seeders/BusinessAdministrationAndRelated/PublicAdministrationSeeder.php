<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicAdministrationSeeder extends Seeder
{
    public function run(): void
    {
        // 3452: Public Administration
        $this->seedGroup('3452', 'Public Administration', [
            ['code' => '345201', 'description' => 'Public Administration/Management'],
            ['code' => '345202', 'description' => 'Fiscal Administration/Studies'],
            ['code' => '345203', 'description' => 'Local Government & Regional Development'],
            ['code' => '345204', 'description' => 'Public Policy and Program Administration'],
            ['code' => '345205', 'description' => 'Organization Analysis and Management'],
            ['code' => '345206', 'description' => 'Public Enterprise Management'],
            ['code' => '345207', 'description' => 'Public and Business Administration'],
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
