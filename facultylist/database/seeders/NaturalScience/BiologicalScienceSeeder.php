<?php

namespace Database\Seeders\NaturalScience;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BiologicalScienceSeeder extends Seeder
{
    public function run(): void
    {
        // 4202: Biological Science
        $this->seedGroup('4202', 'Biological Science', [
            ['code' => '420201', 'description' => 'Biological Science'],
            ['code' => '420202', 'description' => 'Biology'],
            ['code' => '420203', 'description' => 'Bio-Chemistry'],
            ['code' => '420204', 'description' => 'Botany'],
            ['code' => '420205', 'description' => 'Entomology'],
            ['code' => '420206', 'description' => 'Human Biology'],
            ['code' => '420207', 'description' => 'Marine Biology'],
            ['code' => '420208', 'description' => 'Microbiology'],
            ['code' => '420209', 'description' => 'Pharmacology'],
            ['code' => '420210', 'description' => 'Physiology'],
            ['code' => '420212', 'description' => 'Zoology'],
            ['code' => '420213', 'description' => 'Applied Biology'],
            ['code' => '420214', 'description' => 'Biotechnology'],
            ['code' => '420215', 'description' => 'Molecular Biology and Biotechnology'],
            ['code' => '420216', 'description' => 'Applied Zoology'],
            ['code' => '420217', 'description' => 'Genetics'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '42',
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
