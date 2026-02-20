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
        $years = [
            '2021-2022',
            '2022-2023',
            '2023-2024',
            '2024-2025',
            '2025-2026',
            '2026-2027',
            '2027-2028',
            '2028-2029',
            '2029-2030',
            '2030-2031',
            '2031-2032'
        ];

        foreach ($years as $year) {
            \App\Models\AcademicYear::firstOrCreate(
                ['name' => $year],
                ['is_active' => true]
            );
        }
    }
}
