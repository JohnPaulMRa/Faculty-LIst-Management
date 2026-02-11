<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PsychologySeeder extends Seeder
{
    public function run(): void
    {
        // 3052: Psychology
        $this->seedGroup('3052', 'Psychology', [
            ['code' => '305201', 'description' => 'Psychology'],
            ['code' => '305202', 'description' => 'Industrial Psychology'],
            ['code' => '305204', 'description' => 'Counseling Psychology'],
            ['code' => '305205', 'description' => 'Applied Psychology'],
            ['code' => '305206', 'description' => 'Clinical Psychology'],
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
