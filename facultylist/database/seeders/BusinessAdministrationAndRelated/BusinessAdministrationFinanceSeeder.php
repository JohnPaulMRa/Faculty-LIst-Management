<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BusinessAdministrationFinanceSeeder extends Seeder
{
    public function run(): void
    {
        // 3436: Business Administration/Mgt. w/ Specialization in Finance & Investment
        $this->seedGroup('3436', 'Business Administration/Mgt. w/ Specialization in Finance & Investment', [
            ['code' => '343601', 'description' => 'Banking and Finance'],
            ['code' => '343602', 'description' => 'Real Estate'],
            ['code' => '343603', 'description' => 'Computational Finance'],
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
