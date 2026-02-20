<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeacherTrainingNonVocationalSubjectSeeder extends Seeder
{
    public function run(): void
    {
        // 1404: Teacher Training with Specialization in a Non-Vocational Subject
        $this->seedGroup('1404', 'Teacher Training with Specialization in a Non-Vocational Subject', [
            ['code' => '140401', 'description' => 'Chemistry Education'],
            ['code' => '140402', 'description' => 'Christian Education'],
            ['code' => '140403', 'description' => 'English Education'],
            ['code' => '140404', 'description' => 'Mathematics Teaching'],
            ['code' => '140405', 'description' => 'Physics Teaching'],
            ['code' => '140406', 'description' => 'Religious Education (Character/Value Education)'],
            ['code' => '140407', 'description' => 'Arabic Education (teaching Arabic)'],
            ['code' => '140408', 'description' => 'Physical Education'],
            ['code' => '140409', 'description' => 'Biology Education'],
            ['code' => '140410', 'description' => 'College Teaching'],
            ['code' => '140411', 'description' => 'Sports Science (Sports Officiating/Coaching)'],
            ['code' => '140412', 'description' => 'Economics Education'],
            ['code' => '140413', 'description' => 'Bilingual Education'],
            ['code' => '140414', 'description' => 'Filipino Education'],
            ['code' => '140415', 'description' => 'General Science Education'],
            ['code' => '140416', 'description' => 'Health Education'],
            ['code' => '140417', 'description' => 'Home Economics Education'],
            ['code' => '140418', 'description' => 'Language Education/Language Teaching'],
            ['code' => '140419', 'description' => 'Music Education'],
            ['code' => '140420', 'description' => 'Art Education'],
            ['code' => '140421', 'description' => 'Reading Education'],
            ['code' => '140422', 'description' => 'Computer Education (teaching Computer Science)'],
            ['code' => '140423', 'description' => 'Science Education (teaching Science)'],
            ['code' => '140424', 'description' => 'Social Studies Education'],
            ['code' => '140425', 'description' => 'Spanish Education (teaching Spanish)'],
            ['code' => '140426', 'description' => 'Teaching Behavioral Science'],
            ['code' => '140427', 'description' => 'Communication Arts (Pilipino, English)'],
            ['code' => '140429', 'description' => 'Science and Health Education'],
            ['code' => '140431', 'description' => 'Physical Science Education'],
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
