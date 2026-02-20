<?php

namespace Database\Seeders\FineAndAppliedArts;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherFineAndAppliedArtsSeeder extends Seeder
{
    public function run(): void
    {
        // 1899: Other Fine and Applied Arts
        $this->seedGroup('1899', 'Other Fine and Applied Arts', [
            ['code' => '189902', 'description' => 'Fashion Design and Merchandising'],
            ['code' => '189904', 'description' => 'Visual Communication'],
            ['code' => '189905', 'description' => 'Dance'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '18',
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
