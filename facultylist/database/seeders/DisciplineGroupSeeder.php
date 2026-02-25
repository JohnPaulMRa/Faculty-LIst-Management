<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DisciplineGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate the table to ensure a clean state
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('ref_discipline_group')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $disciplines = [
            ['code' => '14', 'description' => 'EDUCATION SCIENCE AND TEACHER TRAINING'],
            ['code' => '18', 'description' => 'FINE AND APPLIED ARTS'],
            ['code' => '22', 'description' => 'HUMANITIES'],
            ['code' => '26', 'description' => 'RELIGION AND THEOLOGY'],
            ['code' => '30', 'description' => 'SOCIAL AND BEHAVIORAL SCIENCES'],
            ['code' => '34', 'description' => 'BUSINESS ADMINISTRATION AND RELATED'],
            ['code' => '38', 'description' => 'LAW AND JURISPRUDENCE'],
            ['code' => '42', 'description' => 'NATURAL SCIENCE'],
            ['code' => '46', 'description' => 'MATHEMATICS'],
            ['code' => '47', 'description' => 'IT-RELATED'],
            ['code' => '50', 'description' => 'MEDICAL AND ALLIED'],
            ['code' => '52', 'description' => 'TRADE, CRAFT AND INDUSTRIAL'],
            ['code' => '54', 'description' => 'ENGINEERING'],
            ['code' => '58', 'description' => 'ARCHITECTURAL AND TOWN-PLANNING'],
            ['code' => '62', 'description' => 'AGRICULTURAL, FORESTRY, AND FISHERIES'],
            ['code' => '66', 'description' => 'HOME ECONOMICS'],
            ['code' => '78', 'description' => 'SERVICE TRADES'],
            ['code' => '84', 'description' => 'MASS COMMUNICATION AND DOCUMENTATION'],
            ['code' => '89', 'description' => 'OTHER DISCIPLINES'],
            ['code' => '90', 'description' => 'MARITIME'],
            ['code' => '00', 'description' => 'GENERAL'],
        ];

        foreach ($disciplines as $discipline) {
            \Illuminate\Support\Facades\DB::table('ref_discipline_group')->insert(
                [
                    'code' => $discipline['code'],
                    'description' => $discipline['description'],
                    'slug' => \Illuminate\Support\Str::slug($discipline['description'], '_'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
