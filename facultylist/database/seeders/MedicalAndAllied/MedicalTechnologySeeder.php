<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MedicalTechnologySeeder extends Seeder
{
    public function run(): void
    {
        // 5030: Medical Technology
        $this->seedGroup('5030', 'Medical Technology', [
            ['code' => '503001', 'description' => 'Medical Technology'],
            ['code' => '503002', 'description' => 'Medical Microbiology'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '50',
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
