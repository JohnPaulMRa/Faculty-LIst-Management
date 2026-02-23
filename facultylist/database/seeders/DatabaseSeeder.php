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

        \App\Models\School::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Test School',
                'code' => 'TS001',
                'is_active' => true,
                'type' => 'Private', // or Public
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'school_id' => 1,
                'password' => bcrypt('password'), // Ensure password is set if creating
                'role' => 'Faculty',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'school_id' => 1,
                'password' => bcrypt('password'),
                'role' => 'Admin',
            ]
        );

        $this->call([
            E5ReferenceDataSeeder::class, // Added to seed E5 reference tables
            AcademicYearSeeder::class,
            E5FullTimePartTimeSeeder::class, // Added specific seeder for full/part time
            MajorDisciplineSeeder::class,
            DisciplineGroupSeeder::class, // Still needed for other major disciplines
            SpecificDisciplineSeeder::class, // Still needed for other major disciplines
            MissingDisciplinesSeeder::class, // Injects missing Specific & Isolated Major disciplines
        ]);
    }
}
