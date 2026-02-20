<?php

namespace Database\Seeders\OtherDisciplines;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HumanResourceDevelopmentSeeder extends Seeder
{
    public function run(): void
    {
        // 8982: Human Resource Development
        $this->seedGroup('8982', 'Human Resource Development', [
            ['code' => '898201', 'description' => 'Human Resource Development and Planning'],
            ['code' => '898202', 'description' => 'Personnel and Human Resources Management'],
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
