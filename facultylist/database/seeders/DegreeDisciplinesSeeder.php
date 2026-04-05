<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DegreeDisciplinesSeeder extends Seeder
{
    public function run()
    {
        $disciplines = [
            ['code' => '507-CS', 'description' => 'Bachelors Degree in Computer Science'],
            ['code' => '507-IT', 'description' => 'Bachelors Degree in Information Technology'],
            ['code' => '507-EE', 'description' => 'Bachelors Degree in Electrical Engineering'],
            
            ['code' => '803-MBA', 'description' => 'Masters Degree in Business Administration'],
            ['code' => '803-MSCS', 'description' => 'Masters Degree in Computer Science'],
            
            ['code' => '903-PHD', 'description' => 'Doctorate Degree in Philosophy'],
            ['code' => '903-DCS', 'description' => 'Doctorate Degree in Computer Science'],
        ];

        foreach ($disciplines as $d) {
            DB::table('specific_discipline')->updateOrInsert(
                ['code' => $d['code']],
                [
                    'description' => $d['description'],
                    'slug' => Str::slug($d['description'], '_'),
                    'group_code' => substr($d['code'], 0, 2),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
