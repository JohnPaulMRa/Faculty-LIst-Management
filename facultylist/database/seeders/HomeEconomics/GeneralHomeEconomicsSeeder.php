<?php

namespace Database\Seeders\HomeEconomics;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralHomeEconomicsSeeder extends Seeder
{
    public function run(): void
    {
        // 6601: General Home Economics
        $this->seedGroup('6601', 'General Home Economics', [
            ['code' => '660101', 'description' => 'Family Life and Child Development'],
            ['code' => '660102', 'description' => 'Home Economics'],
            ['code' => '660103', 'description' => 'Human Ecology'],
            ['code' => '660104', 'description' => 'Family Life'],
            ['code' => '660105', 'description' => 'Family Resource Management'],
            ['code' => '660106', 'description' => 'Early Childhood Development'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '66',
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
