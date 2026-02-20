<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeacherTrainingPracticalVocationalSeeder extends Seeder
{
    public function run(): void
    {
        // 1408: Teacher Training for Teaching Practical or Vocational Subjects
        $this->seedGroup('1408', 'Teacher Training for Teaching Practical or Vocational Subjects', [
            ['code' => '140801', 'description' => 'Industrial Education'],
            ['code' => '140802', 'description' => 'Industrial Arts'],
            ['code' => '140804', 'description' => 'Practical Arts Education'],
            ['code' => '140805', 'description' => 'Vocational/Technical Education'],
            ['code' => '140806', 'description' => 'Technician Teacher Education'],
            ['code' => '140807', 'description' => 'Teaching Elementary Agriculture'],
            ['code' => '140808', 'description' => 'Non-Formal Education'],
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
