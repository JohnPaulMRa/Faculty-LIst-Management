<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecificDisciplineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate generic specific disciplines to ensure clean state
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('ref_specific_discipline')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $disciplines = [
            // 14: EDUCATION SCIENCE AND TEACHER TRAINING - Moved to EducationScience/* seeders

        ];

        foreach ($disciplines as $discipline) {
            \Illuminate\Support\Facades\DB::table('ref_specific_discipline')->insert(
                [
                    'code' => $discipline['code'],
                    'major_discipline_code' => $discipline['major_discipline_code'],
                    // 'discipline_group_code' removed as per request
                    'minor_group' => $discipline['minor_group'],
                    'description' => $discipline['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
