<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SociologySeeder extends Seeder
{
    public function run(): void
    {
        // 3032: Sociology
        $this->seedGroup('3032', 'Sociology', [
            ['code' => '303201', 'description' => 'Sociology'],
            ['code' => '303202', 'description' => 'Rural Sociology'],
            ['code' => '303203', 'description' => 'Sociology and Anthropology'],
            ['code' => '303204', 'description' => 'Pastoral Sociology'],
            ['code' => '303205', 'description' => 'Applied Sociology'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '30',
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
