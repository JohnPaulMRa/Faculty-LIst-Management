<?php

namespace Database\Seeders\NaturalScience;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherNaturalAppliedScienceSeeder extends Seeder
{
    public function run(): void
    {
        // 4299: Other Natural/Applied Science
        $this->seedGroup('4299', 'Other Natural/Applied Science', [
            ['code' => '429901', 'description' => 'General Science'],
            ['code' => '429902', 'description' => 'Natural Science'],
            ['code' => '429904', 'description' => 'Applied Science'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '42',
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
                    'major_discipline_code' => '42',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
