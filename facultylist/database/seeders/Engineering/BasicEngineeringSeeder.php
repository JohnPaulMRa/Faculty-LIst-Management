<?php

namespace Database\Seeders\Engineering;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BasicEngineeringSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => '5401'],
            [
                'major_discipline_code' => '54',
                'description' => 'Basic Engineering',
                'slug' => Str::slug('Basic Engineering', '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
