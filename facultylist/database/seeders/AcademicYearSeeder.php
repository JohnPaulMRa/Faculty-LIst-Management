<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = date('Y');
        $years = [];

        // Generate 5 years back and 5 years forward
        for ($i = -5; $i <= 5; $i++) {
            $startYear = $currentYear + $i;
            $name = $startYear . '-' . ($startYear + 1);
            $years[] = [
                'name' => $name,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        \App\Models\AcademicYear::insert($years);
    }
}
