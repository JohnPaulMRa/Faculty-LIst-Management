<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DentalMedicineSeeder extends Seeder
{
    public function run(): void
    {
        // 5042: Dental Medicine
        $this->seedGroup('5042', 'Dental Medicine', [
            ['code' => '504201', 'description' => 'Dental Medicine'],
            ['code' => '504202', 'description' => 'Dental Public Work'],
            ['code' => '504203', 'description' => 'Orthondontics'],
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
