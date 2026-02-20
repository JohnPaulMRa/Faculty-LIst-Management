<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ElectronicDataProcessingSeeder extends Seeder
{
    public function run(): void
    {
        // 3426: Electronic Data Processing
        $this->seedGroup('3426', 'Electronic Data Processing', [
            ['code' => '342601', 'description' => 'Business Data Processing'],
            ['code' => '342602', 'description' => 'Data Processing'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '34',
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
