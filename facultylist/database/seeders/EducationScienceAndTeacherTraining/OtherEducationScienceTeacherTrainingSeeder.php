<?php

namespace Database\Seeders\EducationScienceAndTeacherTraining;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherEducationScienceTeacherTrainingSeeder extends Seeder
{
    public function run(): void
    {
        // 1499: Other Education Science and Teacher Training
        $this->seedGroup('1499', 'Other Education Science and Teacher Training', [
            ['code' => '149901', 'description' => 'Agricultural Development Education'],
            ['code' => '149902', 'description' => 'Agricultural Education'],
            ['code' => '149903', 'description' => 'Agricultural Extension Education'],
            ['code' => '149904', 'description' => 'Agricultural Homemaking Education'],
            ['code' => '149905', 'description' => 'Business Education'],
            ['code' => '149906', 'description' => 'Commercial Education'],
            ['code' => '149907', 'description' => 'Extension Education'],
            ['code' => '149908', 'description' => 'Fisheries Education'],
            ['code' => '149909', 'description' => 'Nursing Education'],
            ['code' => '149910', 'description' => 'Secretarial Education'],
            ['code' => '149911', 'description' => 'Basic Agricultural Education/Elementary Agriculture'],
            ['code' => '149912', 'description' => 'Health Professional Education'],
            ['code' => '149913', 'description' => 'Development Education'],
            ['code' => '149914', 'description' => 'Engineering Education'],
            ['code' => '149915', 'description' => 'Occupational Education'],
            ['code' => '149916', 'description' => 'Human Ecology Education'],
            ['code' => '149917', 'description' => 'Agricultural Technology Education'],
            ['code' => '149918', 'description' => 'Environmental Education'],
            ['code' => '149919', 'description' => 'Maritime Education'],
            ['code' => '149920', 'description' => 'Population Education'],
            ['code' => '149921', 'description' => 'Nutrition and Dietetics Teaching'],
            ['code' => '149922', 'description' => 'History Education'],
            ['code' => '149999', 'description' => 'Other Education Science and Teacher Training'],
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
