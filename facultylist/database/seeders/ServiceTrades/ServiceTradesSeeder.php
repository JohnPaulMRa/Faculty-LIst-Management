<?php

namespace Database\Seeders\ServiceTrades;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceTradesSeeder extends Seeder
{
    public function run(): void
    {
        // 7872: Tourist Trade
        $this->seedGroup('7872', 'Tourist Trade', [
            ['code' => '787201', 'description' => 'Tourism'],
            ['code' => '787203', 'description' => 'Tourism and Travel Management'],
            ['code' => '787204', 'description' => 'Tourism and Hotel & Restaurant Mgt.'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        // Seed Group
        DB::table('ref_discipline_group')->updateOrInsert(
            ['code' => $groupCode],
            [
                'major_discipline_code' => '78',
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Specifics
        foreach ($specifics as $specific) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => '78',
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
