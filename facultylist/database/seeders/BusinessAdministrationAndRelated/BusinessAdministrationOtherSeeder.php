<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BusinessAdministrationOtherSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => '3406'],
            [
                'major_discipline_code' => '34',
                'description' => 'Business Administration/Mgt. with Other Specialization',
                'slug' => Str::slug('Business Administration/Mgt. with Other Specialization', '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
