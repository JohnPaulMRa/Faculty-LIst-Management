<?php

namespace Database\Seeders\ArchitecturalAndTownPlanning;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ArchitecturalDesignSeeder extends Seeder
{
    public function run(): void
    {
        // 5802: Architectural Design
        $this->seedGroup('5802', 'Architectural Design', [
            ['code' => '580200', 'description' => 'Architectural Design'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '58',
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
                    'major_discipline_code' => '58',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
