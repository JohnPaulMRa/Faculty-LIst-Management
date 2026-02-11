<?php

namespace Database\Seeders\ITRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ComputerScienceInformationTechnologySeeder extends Seeder
{
    public function run(): void
    {
        // 4641: Computer Science/Information Technology
        $this->seedGroup('4641', 'Computer Science/Information Technology', [
            ['code' => '464101', 'description' => 'Computer Science'],
            ['code' => '464102', 'description' => 'Computer Data Processing Management'],
            ['code' => '464104', 'description' => 'Computer Technology'],
            ['code' => '464105', 'description' => 'Information and Computer Science'],
            ['code' => '464106', 'description' => 'Computer Applications'],
            ['code' => '464107', 'description' => 'Information Management'],
            ['code' => '464108', 'description' => 'Information Technology'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '46', // Assuming 46 based on previous seeder logic for IT
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
                    'major_discipline_code' => '46',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
