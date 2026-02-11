<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountancySeeder extends Seeder
{
    public function run(): void
    {
        // 3432: Accountancy
        $this->seedGroup('3432', 'Accountancy', [
            ['code' => '343201', 'description' => 'Accountancy'],
            ['code' => '343205', 'description' => 'Accountancy and Bookkeeping'],
            ['code' => '343206', 'description' => 'Government Accounting and Auditing'],
            ['code' => '343207', 'description' => 'Business Administration/Management & Accountancy'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '34',
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
                    'major_discipline_code' => '34',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
