<?php

namespace Database\Seeders\HomeEconomics;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherHomeEconomicsSeeder extends Seeder
{
    public function run(): void
    {
        // 6699: Other Home Economics
        $this->seedGroup('6699', 'Other Home Economics', [
            ['code' => '669901', 'description' => 'Home Extension'],
            ['code' => '669902', 'description' => 'Home Technology'],
            ['code' => '669903', 'description' => 'Homemaking'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '66',
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
                    'major_discipline_code' => '66',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
