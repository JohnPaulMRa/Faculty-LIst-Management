<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class E5DisciplineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Major Groups
        $majorGroups = [
            ['code' => "22", 'description' => "Humanities"],
            ['code' => "46", 'description' => "Mathematics"],
            ['code' => "47", 'description' => "IT-Related"],
            ['code' => "54", 'description' => "Engineering"],
            ['code' => "14", 'description' => "Education Science"],
            // Note: "00" General not explicitly in static array list but implied by disciplines? Adding it if needed or derived.
            // Actually "00" was in the disciplinas keys ("001001", "001002") for Pre-School/Secondary.
            // Let's add it to major groups to be safe.
            ['code' => "00", 'description' => "General"],
        ];

        foreach ($majorGroups as $group) {
            \Illuminate\Support\Facades\DB::table('e5_ref_major_group')->updateOrInsert(
                ['code' => $group['code']],
                ['description' => $group['description'], 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 2. Seed Disciplines
        $disciplines = [
             "47" => [['code' => "464101", 'desc' => "Computer Science"], ['code' => "464108", 'desc' => "Information Technology"]],
             "46" => [['code' => "460100", 'desc' => "General Mathematics"]],
             "14" => [['code' => "140101", 'desc' => "Elementary Education"], ['code' => "140102", 'desc' => "Secondary Education"]],
             "00" => [['code' => "001001", 'desc' => "Pre-School/Elementary"], ['code' => "001002", 'desc' => "Secondary"]],
             "54" => [
                ['code' => "540200", 'desc' => "Chemical Engineering"],
                ['code' => "540300", 'desc' => "Civil Engineering"],
                ['code' => "540400", 'desc' => "Electrical Engineering"],
                ['code' => "540401", 'desc' => "Electronics Engineering"],
                ['code' => "540500", 'desc' => "Industrial Engineering"],
                ['code' => "540600", 'desc' => "Mechanical Engineering"],
                ['code' => "540800", 'desc' => "Aeronautical Engineering"],
                ['code' => "540802", 'desc' => "Computer Engineering"],
             ],
             "22" => [ // Humanities
                ['code' => "220100", 'desc' => "Literature"],
                ['code' => "220200", 'desc' => "Philosophy"],
                ['code' => "220300", 'desc' => "Arts"],
             ]
        ];

        foreach ($disciplines as $groupCode => $items) {
            foreach ($items as $item) {
                \Illuminate\Support\Facades\DB::table('e5_ref_discipline')->updateOrInsert(
                    ['code' => $item['code']],
                    [
                        'major_group_code' => $groupCode, 
                        'description' => $item['desc'],
                        'created_at' => now(), 
                        'updated_at' => now()
                    ]
                );
            }
        }
    }
}
