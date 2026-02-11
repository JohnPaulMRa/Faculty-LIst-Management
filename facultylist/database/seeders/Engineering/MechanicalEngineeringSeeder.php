<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MechanicalEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5442: Mechanical Engineering
        $this->seedGroup('5442', 'Mechanical Engineering', [
            ['code' => '544205', 'description' => 'Mechanical Engineering'],
            ['code' => '544206', 'description' => 'Mechanical Technology'],
            ['code' => '544208', 'description' => 'Automotive Technology'],
            ['code' => '544209', 'description' => 'Geothermal Engineering'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '54',
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
                    'major_discipline_code' => '54',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
