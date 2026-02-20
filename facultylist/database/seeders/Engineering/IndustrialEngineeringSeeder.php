<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class IndustrialEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5426: Industrial Engineering
        $this->seedGroup('5426', 'Industrial Engineering', [
            ['code' => '542601', 'description' => 'Industrial Design'],
            ['code' => '542602', 'description' => 'Industrial and Management Engineering'],
            ['code' => '542604', 'description' => 'Industrial Engineering'],
            ['code' => '542605', 'description' => 'Industrial Technology'],
            ['code' => '542606', 'description' => 'Management Engineering'],
            ['code' => '542607', 'description' => 'Manufacturing/Production Engineering'],
            ['code' => '542608', 'description' => 'Industrial Development and Technology'],
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
