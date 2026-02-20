<?php

namespace Database\Seeders\NaturalScience;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OceanographySeeder extends Seeder
{
    public function run(): void
    {
        // 4262: Oceanography
        $this->seedGroup('4262', 'Oceanography', [
            ['code' => '426201', 'description' => 'Marine Science'],
            ['code' => '426202', 'description' => 'Oceanography'],
            ['code' => '426203', 'description' => 'Marine Physical Science'],
            ['code' => '426204', 'description' => 'Marine Bio-Diversity'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '42',
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
