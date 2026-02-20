<?php

namespace Database\Seeders\FineAndAppliedArts;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DramaSeeder extends Seeder
{
    public function run(): void
    {
        // 1832: Drama
        $this->seedGroup('1832', 'Drama', [
            ['code' => '183201', 'description' => 'Speech and Drama'],
            ['code' => '183202', 'description' => 'Speech and Theater Arts'],
            ['code' => '183204', 'description' => 'Theater Arts (Performance; Malikhaing Pagsulat; Technical Theater Mgt.)'],
            ['code' => '183205', 'description' => 'Production Design'],
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
