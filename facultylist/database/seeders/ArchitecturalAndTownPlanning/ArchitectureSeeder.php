<?php

namespace Database\Seeders\ArchitecturalAndTownPlanning;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ArchitectureSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => '5801'],
            [
                'major_discipline_code' => '58',
                'description' => 'Architecture',
                'slug' => Str::slug('Architecture', '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
