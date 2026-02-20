<?php

namespace Database\Seeders\OtherDisciplines;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommunityDevelopmentSeeder extends Seeder
{
    public function run(): void
    {
        // 8933: Community Development
        $this->seedGroup('8933', 'Community Development', [
            ['code' => '893301', 'description' => 'Community Development'],
            ['code' => '893302', 'description' => 'Livelihood Management'],
            ['code' => '893303', 'description' => 'Community Organizing'],
            ['code' => '893304', 'description' => 'Extension Service Management'],
            ['code' => '893305', 'description' => 'Rural Development'],
            ['code' => '893306', 'description' => 'Multicultural Community Development'],
            ['code' => '893307', 'description' => 'Participatory Development'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '89',
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
