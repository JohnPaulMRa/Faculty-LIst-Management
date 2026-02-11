<?php

namespace Database\Seeders\MedicalAndAllied;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RehabilitationMedicineSeeder extends Seeder
{
    public function run(): void
    {
        // 5008: Rehabilitation Medicine
        $this->seedGroup('5008', 'Rehabilitation Medicine', [
            ['code' => '500801', 'description' => 'Occupational Therapy/Health'],
            ['code' => '500802', 'description' => 'Physical Therapy'],
            ['code' => '500803', 'description' => 'Speech Pathology'],
            ['code' => '500804', 'description' => 'Respiratory/Pulmunary Therapy'],
            ['code' => '500805', 'description' => 'Human Kinetics'],
            ['code' => '500806', 'description' => 'Physio-Therapy'],
            ['code' => '500807', 'description' => 'Rehabilitation Science'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '50',
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
                    'major_discipline_code' => '50',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
