<?php

namespace Database\Seeders\NaturalScience;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PhysicsSeeder extends Seeder
{
    public function run(): void
    {
        // 4232: Physics
        $this->seedGroup('4232', 'Physics', [
            ['code' => '423201', 'description' => 'Applied Physics'],
            ['code' => '423203', 'description' => 'Physics'],
            ['code' => '423204', 'description' => 'Physics-Mathematics'],
            ['code' => '423202', 'description' => 'Metallurgy'],
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
