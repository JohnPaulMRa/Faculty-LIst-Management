<?php

namespace Database\Seeders\Humanities;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CurrentOrVernacularLanguageAndItsLiteratureSeeder extends Seeder
{
    public function run(): void
    {
        // 2211: Current or Vernacular Language and its Literature
        $this->seedGroup('2211', 'Current or Vernacular Language and its Literature', [
            ['code' => '221101', 'description' => 'Pilipino/Filipino'],
            ['code' => '221102', 'description' => 'English'],
            ['code' => '221103', 'description' => 'Philippine Literature'],
            ['code' => '221107', 'description' => 'English Literature'],
            ['code' => '221108', 'description' => 'Pilipino Literature'],
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
