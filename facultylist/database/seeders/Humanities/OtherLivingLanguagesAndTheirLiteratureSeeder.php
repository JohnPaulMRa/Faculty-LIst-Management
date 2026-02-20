<?php

namespace Database\Seeders\Humanities;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtherLivingLanguagesAndTheirLiteratureSeeder extends Seeder
{
    public function run(): void
    {
        // 2215: Other Living Languages and their Literature
        $this->seedGroup('2215', 'Other Living Languages and their Literature', [
            ['code' => '221501', 'description' => 'European Languages'],
            ['code' => '221502', 'description' => 'Spanish'],
            ['code' => '221503', 'description' => 'Language and Literature'],
            ['code' => '221504', 'description' => 'Modern Languages'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '22',
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
