<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        // 5499: Other Engineering
        $this->seedGroup('5499', 'Other Engineering', [
            ['code' => '549901', 'description' => 'Engineering Technology'],
            ['code' => '549903', 'description' => 'Plumbing Engineering'],
            ['code' => '549904', 'description' => 'Energy Engineering'],
            ['code' => '549907', 'description' => 'Food Engineering'],
            ['code' => '549908', 'description' => 'Water Resources Engineering'],
            ['code' => '549909', 'description' => 'Materials Science and Engineering'],
            ['code' => '549911', 'description' => 'Genetics Engineering'],
            ['code' => '549912', 'description' => 'Transport Engineering'],
            ['code' => '549913', 'description' => 'Nuclear Engineering'],
            ['code' => '549915', 'description' => 'Engineering Design'],
            ['code' => '549916', 'description' => 'Meteorological Engineering'],
            ['code' => '549919', 'description' => 'Technology/Engineering'],
            ['code' => '549921', 'description' => 'Petroleum Engineering'],
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
