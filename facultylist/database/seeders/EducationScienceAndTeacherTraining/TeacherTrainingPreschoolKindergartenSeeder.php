<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeacherTrainingPreschoolKindergartenSeeder extends Seeder
{
    public function run(): void
    {
        // 1412: Teacher Training for Teaching Pre-school or Kindergarten
        $this->seedGroup('1412', 'Teacher Training for Teaching Pre-school or Kindergarten', [
            ['code' => '141201', 'description' => 'Childhood Education'],
            ['code' => '141202', 'description' => 'Early Childhood Education'],
            ['code' => '141203', 'description' => 'Kindergarten Education'],
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
