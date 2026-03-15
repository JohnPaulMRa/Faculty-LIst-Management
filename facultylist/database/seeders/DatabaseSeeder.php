<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\Hei::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Test HEI',
                'hei_code' => 'TS001',
                'is_active' => true,
                'type' => 'Private', // or Public
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'hei_id' => 1,
                'password' => bcrypt('password'), // Ensure password is set if creating
                'role' => 'Faculty',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'hei_id' => 1,
                'password' => bcrypt('password'),
                'role' => 'Admin',
            ]
        );

        $this->call([
            E5ReferenceDataSeeder::class,       // E5 reference tables (gender, degree, etc.)
            AcademicYearSeeder::class,
            E5FullTimePartTimeSeeder::class,
            DisciplineGroupSeeder::class,       // 1. Populate discipline_group
            SpecificDisciplineSeeder::class,    // 2. Truncate specific_discipline (clean slate)
            MajorDisciplineSeeder::class,       // 3. Truncate major_discipline + insert GENERAL & isolated majors into both tables
        ]);
    }
}
