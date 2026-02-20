<?php

namespace Database\Seeders\BusinessAdministrationAndRelated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BusinessAdministrationOtherSpecializationSeeder extends Seeder
{
    public function run(): void
    {
        // 3439: Business Administration/Mgt. with Other Specialization
        $this->seedGroup('3439', 'Business Administration/Mgt. with Other Specialization', [
            ['code' => '343901', 'description' => 'Distributive Arts'],
            ['code' => '343902', 'description' => 'Agri-Business'],
            ['code' => '343903', 'description' => 'Agri-Business Management/Administration'],
            ['code' => '343904', 'description' => 'Labor-Management Relations'],
            ['code' => '343905', 'description' => 'Business Technology/Engineering'],
            ['code' => '343906', 'description' => 'Economics and Cooperatives'],
            ['code' => '343907', 'description' => 'Fishery Business Management'],
            ['code' => '343908', 'description' => 'Industrial Management'],
            ['code' => '343911', 'description' => 'International Trade Management'],
            ['code' => '343912', 'description' => 'Transportation Management'],
            ['code' => '343913', 'description' => 'Labor Policy and Administration'],
            ['code' => '343914', 'description' => 'Industrial Relations'],
            ['code' => '343915', 'description' => 'Construction Mangement'],
            ['code' => '343916', 'description' => 'Legal Management'],
            ['code' => '343917', 'description' => 'Livelihood Management'],
            ['code' => '343919', 'description' => 'Home Arts Entrepreneurship'],
            ['code' => '343920', 'description' => 'Computer Management'],
            ['code' => '343922', 'description' => 'Export Management'],
            ['code' => '343923', 'description' => 'Commerce in Taxation'],
            ['code' => '343924', 'description' => 'Business Entrepreneurship'],
            ['code' => '343926', 'description' => 'Technology Communications Management'],
            ['code' => '343927', 'description' => 'Technology Management'],
            ['code' => '343928', 'description' => 'Church Administration'],
            ['code' => '343929', 'description' => 'Agroforestry Entrepreneurship'],
            ['code' => '343930', 'description' => 'Communication Management'],
        ]);
    }

    private function seedGroup(string $groupCode, string $description, array $specifics): void
    {
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => $groupCode],
            [
                'discipline_group_code' => '34',
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
