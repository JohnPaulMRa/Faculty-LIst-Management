<?php

namespace Database\Seeders\Maritime;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NauticalScienceSeeder extends Seeder
{
    public function run(): void
    {
        // Maritime - Nautical Science
        // Code 89 (Other Disciplines) prefix 8972
        $this->seedGroup('8972', 'Nautical Science', [
            ['code' => '897201', 'description' => 'Marine Transportation'],
            ['code' => '897202', 'description' => 'Nautical Science'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        // Seed Group
        $majorCode = substr($groupCode, 0, 2);

        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => $majorCode,
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Specifics
        foreach ($specifics as $specific) {
            $specificMajorCode = substr($specific['code'], 0, 2);
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => $specificMajorCode,
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
