<?php

namespace Database\Seeders\ReligionAndTheology;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReligionAndTheologySeeder extends Seeder
{
    public function run(): void
    {
        // 2600: Religion and Theology
        $this->seedGroup('2600', 'Religion and Theology', [
            ['code' => '260001', 'description' => 'Arts (Classical/Philosophy)'],
            ['code' => '260002', 'description' => 'Divinity'],
            ['code' => '260004', 'description' => 'Religion/Spiritual Life'],
            ['code' => '260005', 'description' => 'Theology/Theological Studies'],
            ['code' => '260006', 'description' => 'Evangelical Ministry'],
            ['code' => '260009', 'description' => 'Pastoral Ministry'],
            ['code' => '260010', 'description' => 'Comparative Religions'],
            ['code' => '260011', 'description' => 'Religious Formation'],
            ['code' => '260012', 'description' => 'Biblical Studies'],
            ['code' => '260013', 'description' => 'Christian Leadership'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        // Seed Group
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '26',
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Specifics
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
