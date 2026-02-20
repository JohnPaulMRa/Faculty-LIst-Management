<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AeronauticalEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5404: Aeronautical Engineering
        $this->seedGroup('5404', 'Aeronautical Engineering', [
            ['code' => '540401', 'description' => 'Aeronautical Engineering'],
            ['code' => '540402', 'description' => 'Aerospace Engineering'],
            ['code' => '540403', 'description' => 'Aviation Electronics/Electrical Engineering'],
            ['code' => '540404', 'description' => 'Avionics Engineering/Technology/Civil Aviation'],
            ['code' => '540405', 'description' => 'Air Transportation'],
            ['code' => '540406', 'description' => 'Aircraft Maintenance Technology'],
            ['code' => '540407', 'description' => 'Aircraft/Avionics Technology'],
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
