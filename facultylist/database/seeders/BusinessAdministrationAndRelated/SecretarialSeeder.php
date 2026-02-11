<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SecretarialSeeder extends Seeder
{
    public function run(): void
    {
        // 3404: Secretarial
        $this->seedGroup('3404', 'Secretarial', [
            ['code' => '340401', 'description' => 'Secretarial/Medical Secretarial/Clerical'],
            ['code' => '340402', 'description' => 'Office Administration/Management'],
            ['code' => '340404', 'description' => 'Secretarial Administration/Management'],
            ['code' => '340406', 'description' => 'Secretarial Science'],
            ['code' => '340407', 'description' => 'Computer Secretarial'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '34',
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
                    'major_discipline_code' => '34',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
