<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralBusinessAdministrationSeeder extends Seeder
{
    public function run(): void
    {
        // 3401: General Business Administration (Commerce)
        $this->seedGroup('3401', 'General Business Administration (Commerce)', [
            ['code' => '340101', 'description' => 'Business Administration'],
            ['code' => '340102', 'description' => 'Commercial Science/Arts'],
            ['code' => '340104', 'description' => 'Business Management'],
            ['code' => '340106', 'description' => 'Entrepreneurial Management'],
            ['code' => '340107', 'description' => 'Commerce'],
            ['code' => '340108', 'description' => 'Administration'],
            ['code' => '340113', 'description' => 'Management'],
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
