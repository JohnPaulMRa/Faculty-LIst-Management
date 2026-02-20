<?php

namespace Database\Seeders\Mathematics;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherMathematicsSeeder extends Seeder
{
    public function run(): void
    {
        // 4639: Other Mathematics
        $this->seedGroup('4639', 'Other Mathematics', [
            ['code' => '463901', 'description' => 'Applied Mathematics'],
            ['code' => '463902', 'description' => 'Mathematical Science'],
            ['code' => '463903', 'description' => 'Actuarial Mathematics'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '46',
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
