<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ElectricalElectronicsAndComputerEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5422: Electrical, Electronics and Computer Engineerin
        $this->seedGroup('5422', 'Electrical, Electronics and Computer Engineerin', [
            ['code' => '542201', 'description' => 'Radio and Electronics Engineering'],
            ['code' => '542202', 'description' => 'Computer Engineering'],
            ['code' => '542203', 'description' => 'Electrical Engineering'],
            ['code' => '542205', 'description' => 'Electrical Technology'],
            ['code' => '542206', 'description' => 'Electronics Engineering/Technology'],
            ['code' => '542207', 'description' => 'Electronics and Communications Engineering'],
            ['code' => '542209', 'description' => 'Radio Communication Technology'],
            ['code' => '542210', 'description' => 'Applied Electrical Science'],
            ['code' => '542211', 'description' => 'Software Engineering/Technology'],
            ['code' => '542212', 'description' => 'Instrumentation and Control Technology'],
            ['code' => '542213', 'description' => 'Remote Sensing'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '54',
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
