<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EducationalAdministrationSupervisionSeeder extends Seeder
{
    public function run(): void
    {
        // 1472: Educational Administration and Supervision
        $this->seedGroup('1472', 'Educational Administration and Supervision', [
            ['code' => '147201', 'description' => 'Guidance and Counselling'],
            ['code' => '147202', 'description' => 'Measurement and Evaluation'],
            ['code' => '147203', 'description' => 'Research and Evaluation'],
            ['code' => '147204', 'description' => 'Curriculum and Instruction'],
            ['code' => '147205', 'description' => 'Educational Guidance and Family Education'],
            ['code' => '147206', 'description' => 'Educational Psychology'],
            ['code' => '147207', 'description' => 'Educational Technology'],
            ['code' => '147208', 'description' => 'Library Science Education'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '14',
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
