<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class E5FullTimePartTimeSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['code' => '1', 'description' => 'The person is a full-time employee of the HEI.'],
            ['code' => '2', 'description' => 'The person is a half-time employee of the HEI.'],
            ['code' => '3', 'description' => 'Student employee such as Student Assistant or Graduate Assistant.'],
            ['code' => '4', 'description' => 'Teaching Fellow, Associate or Assistant.'],
            ['code' => '5', 'description' => 'None of the above and therefore part-time. This includes: lecturers (all ranks), adjunct or affiliate faculty, visiting professors, professors emeriti, Physicians on call, lawyers or accountants on retainer basis, etc.'],
            ['code' => '9', 'description' => 'Not known or not indicated.'],
        ];

        foreach ($data as $item) {
            DB::table('e5_ref_full_time_part_time')->updateOrInsert(
                ['code' => $item['code']], // Check if this code already exists
                [
                    'description' => $item['description'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }
}