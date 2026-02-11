<?php

namespace Database\Seeders\MassCommunicationAndDocumentation;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralCommunicationArtsSeeder extends Seeder
{
    public function run(): void
    {
        // 8401: General Communication Arts
        $this->seedGroup('8401', 'General Communication Arts', [
            ['code' => '840101', 'description' => 'Communication'],
            ['code' => '840102', 'description' => 'Speech Communication'],
            ['code' => '840103', 'description' => 'Writing'],
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
