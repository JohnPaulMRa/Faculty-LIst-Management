<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CivilEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5416: Civil Engineering
        $this->seedGroup('5416', 'Civil Engineering', [
            ['code' => '541601', 'description' => 'Civil Engineering'],
            ['code' => '541602', 'description' => 'Construction Technology'],
            ['code' => '541603', 'description' => 'Building Technology'],
            ['code' => '541604', 'description' => 'Structural Engineering'],
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
