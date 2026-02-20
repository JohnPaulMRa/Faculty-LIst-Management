<?php

namespace Database\Seeders\FineAndAppliedArts;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MusicSeeder extends Seeder
{
    public function run(): void
    {
        // 1822: Music
        $this->seedGroup('1822', 'Music', [
            ['code' => '182201', 'description' => 'Music'],
            ['code' => '182203', 'description' => 'Music in Musical Sciences'],
            ['code' => '182204', 'description' => 'Music Liturgy'],
            ['code' => '182205', 'description' => 'Piano/Keyboard'],
            ['code' => '182206', 'description' => 'Strings'],
            ['code' => '182207', 'description' => 'Voice'],
            ['code' => '182208', 'description' => 'Winds and Percussion'],
            ['code' => '182209', 'description' => 'Creative and Performing Arts'],
            ['code' => '182210', 'description' => 'Choral/Orchestral Conducting'],
            ['code' => '182211', 'description' => 'Ethnomusicology'],
            ['code' => '182212', 'description' => 'Musicology'],
            ['code' => '182213', 'description' => 'Composition'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '18',
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
