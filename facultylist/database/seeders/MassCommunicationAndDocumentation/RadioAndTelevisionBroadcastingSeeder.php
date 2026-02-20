<?php

namespace Database\Seeders\MassCommunicationAndDocumentation;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RadioAndTelevisionBroadcastingSeeder extends Seeder
{
    public function run(): void
    {
        // 8404: Radio and Television Broadcasting
        $this->seedGroup('8404', 'Radio and Television Broadcasting', [
            ['code' => '840401', 'description' => 'Broadcast Communication'],
            ['code' => '840402', 'description' => 'Broadcast'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '84',
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
