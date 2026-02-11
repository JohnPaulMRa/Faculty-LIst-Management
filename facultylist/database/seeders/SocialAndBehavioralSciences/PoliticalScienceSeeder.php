<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PoliticalScienceSeeder extends Seeder
{
    public function run(): void
    {
        // 3022: Political Science
        $this->seedGroup('3022', 'Political Science', [
            ['code' => '302201', 'description' => 'Political Science'],
            ['code' => '302202', 'description' => 'Foreign Service'],
            ['code' => '302203', 'description' => 'International Relations'],
            ['code' => '302204', 'description' => 'Political Economy'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '30',
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
                    'major_discipline_code' => '30',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
