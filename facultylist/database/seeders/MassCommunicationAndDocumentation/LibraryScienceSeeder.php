<?php

namespace Database\Seeders\MassCommunicationAndDocumentation;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LibraryScienceSeeder extends Seeder
{
    public function run(): void
    {
        // 8422: Library Science
        $this->seedGroup('8422', 'Library Science', [
            ['code' => '842201', 'description' => 'Library and Information Science'],
            ['code' => '842202', 'description' => 'Library Science'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '84',
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
                    'major_discipline_code' => '84',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
