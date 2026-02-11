<?php

namespace Database\Seeders\General;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralDisciplinesSeeder extends Seeder
{
    public function run(): void
    {
        // 0010: General
        // User list uses 0010xx. Group 0010.
        $this->seedGroup('0010', 'General', [
            ['code' => '001001', 'description' => 'Pre-School/Elementary'],
            ['code' => '001002', 'description' => 'Secondary'],
            ['code' => '001003', 'description' => 'Arts'],
            ['code' => '001004', 'description' => 'Science'],
            ['code' => '001005', 'description' => 'Liberal Arts-Liacom'],
            ['code' => '001006', 'description' => 'Pre-Dental'],
            ['code' => '001007', 'description' => 'Letters'],
            ['code' => '001008', 'description' => 'Professional Studies'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        // Seed Group
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '00', // Assuming 00 for General
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Specifics
        foreach ($specifics as $specific) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => '00',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
