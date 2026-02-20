<?php

namespace Database\Seeders\TradeCraftAndIndustrial;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClothingAndRelatedTradesSeeder extends Seeder
{
    public function run(): void
    {
        // 5200: Clothing and Related Trades
        // User list mixed 5200 and 5276. Using 5276 as per previous logic or maybe 5200 is better?
        // Let's use 5276 for the group code to match the majority of items if possible, or 5200 if that's the group head.
        // User text: 520000----Technical/Vocational is the first item.
        // But the group header doesn't have a specific code in the user text, just "GROUP---Clothing and Related Trades".
        // The items are 520000, 527601, 527602, 527603.
        // I will use '5276' as the group code for now as it seems more specific to 'Clothing/Garment'.
        
        $this->seedGroup('5276', 'Clothing and Related Trades', [
            ['code' => '520000', 'description' => 'Technical/Vocational'],
            ['code' => '527601', 'description' => 'Garment Technology'],
            ['code' => '527602', 'description' => 'Clothing Technology'],
            ['code' => '527603', 'description' => 'Trade Technology'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '52',
                'description' => $description,
                'slug' => Str::slug($description, '_'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        foreach ($specifics as $specific) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $specific['code']],
                [
                    'major_discipline_code' => $groupCode,
                    'minor_group' => $description,
                    'description' => $specific['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
