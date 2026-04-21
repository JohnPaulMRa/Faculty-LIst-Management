<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use an array of arrays to prevent PHP from auto-casting numeric-looking string keys to integers
        // Clear existing program data to ensure only current seeder examples remain
        DB::table('specific_discipline')->update(['program' => null]);

        $data = [
            ['code' => '140405', 'program' => 'Bachelor of Secondary Education major in Physics'],
        ];

        foreach ($data as $item) {
            DB::table('specific_discipline')
                ->where('code', (string)$item['code'])
                ->update(['program' => $item['program']]);
        }
        
        $count = DB::table('specific_discipline')->whereNotNull('program')->count();
        $this->command->info("Updated {$count} rows with program data.");
    }
}
