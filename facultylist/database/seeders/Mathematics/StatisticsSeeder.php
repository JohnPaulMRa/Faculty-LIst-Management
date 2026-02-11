<?php

namespace Database\Seeders\Mathematics;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StatisticsSeeder extends Seeder
{
    public function run(): void
    {
        // 4611: Statistics
        $this->seedGroup('4611', 'Statistics', [
            ['code' => '461101', 'description' => 'Applied Statistics'],
            ['code' => '461102', 'description' => 'Experimental Statistics'],
            ['code' => '461103', 'description' => 'Statistics'],
            ['code' => '461104', 'description' => 'Operations Research'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '46',
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
                    'major_discipline_code' => '46',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
