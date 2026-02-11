<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralTeacherTrainingSeeder extends Seeder
{
    public function run(): void
    {
        // 1401: General Teacher Training
        $this->seedGroup('1401', 'General Teacher Training', [
            ['code' => '140101', 'description' => 'Elementary Education'],
            ['code' => '140102', 'description' => 'Secondary Education with no specialization'],
            ['code' => '140104', 'description' => 'Elementary and Secondary Education w/ no specialization'],
            ['code' => '140106', 'description' => 'Pedagogy'],
            ['code' => '140108', 'description' => 'Education'],
            ['code' => '140109', 'description' => 'Teaching'],
            ['code' => '140110', 'description' => 'Educational Foundation'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '14',
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
                    'major_discipline_code' => '14',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
