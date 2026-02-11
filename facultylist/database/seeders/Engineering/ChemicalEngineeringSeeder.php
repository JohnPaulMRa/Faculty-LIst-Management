<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChemicalEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5412: Chemical Engineering
        $this->seedGroup('5412', 'Chemical Engineering', [
            ['code' => '541201', 'description' => 'Ceramics Engineering'],
            ['code' => '541202', 'description' => 'Chemical Engineering'],
            ['code' => '541203', 'description' => 'Chemical Engineering Technology'],
            ['code' => '541204', 'description' => 'Textile Engineering'],
            ['code' => '541205', 'description' => 'Biochemical Engineering'],
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
