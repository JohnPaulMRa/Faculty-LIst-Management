<?php

namespace Database\Seeders\OtherDisciplines;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EnvironmentalStudiesSeeder extends Seeder
{
    public function run(): void
    {
        // 8952: Environmental Studies
        $this->seedGroup('8952', 'Environmental Studies', [
            ['code' => '895201', 'description' => 'Environment'],
            ['code' => '895202', 'description' => 'Ecology'],
            ['code' => '895203', 'description' => 'Environmental Planning/Management'],
            ['code' => '895204', 'description' => 'Environmental Science'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '89',
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
