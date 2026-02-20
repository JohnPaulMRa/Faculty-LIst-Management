<?php

namespace Database\Seeders\SocialAndBehavioralSciences;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudiesOfRegionalCulturesSeeder extends Seeder
{
    public function run(): void
    {
        // 3072: Studies of Regional Cultures
        $this->seedGroup('3072', 'Studies of Regional Cultures', [
            ['code' => '307201', 'description' => 'Islamic Studies'],
            ['code' => '307202', 'description' => 'Philippine Studies/Arts'],
            ['code' => '307203', 'description' => 'Asian Studies/Asian Culture'],
            ['code' => '307204', 'description' => 'International Studies'],
            ['code' => '307205', 'description' => 'Interdisciplinary Studies'],
            ['code' => '307207', 'description' => 'Oriental Religion and Culture'],
            ['code' => '307208', 'description' => 'Regional Studies'],
            ['code' => '307209', 'description' => 'Philippine Muslim Personal Laws'],
            ['code' => '307210', 'description' => 'Folklore'],
            ['code' => '307211', 'description' => 'Southeast Asian Studies'],
            ['code' => '307212', 'description' => 'Culture Heritage Studies'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '30',
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
