<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MissingDisciplinesSeeder extends Seeder
{
    public function run()
    {
        // ---------------------------------------------------
        // CASE 1: NO -MAJOR DISCIPLINE (Group-GENERAL)
        // Group: GENERAL (00) -> Major: GENERAL (0000) -> Specifics
        // ---------------------------------------------------
        DB::table('ref_major_discipline')->updateOrInsert(
            ['code' => '0000'],
            ['discipline_group_code' => '00', 'description' => 'GENERAL', 'created_at' => now(), 'updated_at' => now()]
        );

        $generalSpecifics = [
            ['code' => '001001', 'desc' => 'Pre-School/Elementary'],
            ['code' => '001002', 'desc' => 'Secondary'],
            ['code' => '001003', 'desc' => 'Arts'],
            ['code' => '001004', 'desc' => 'Science'],
            ['code' => '001005', 'desc' => 'Liberal Arts-Liacom'],
            ['code' => '001006', 'desc' => 'Pre-Dental'],
            ['code' => '001007', 'desc' => 'Letters'],
            ['code' => '001008', 'desc' => 'Professional Studies'],
        ];

        foreach ($generalSpecifics as $item) {
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $item['code']],
                [
                    'major_discipline_code' => '0000',
                    'description' => $item['desc'],
                    'minor_group' => null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }

        // ---------------------------------------------------
        // CASE 2: NO-Specific Discipline
        // These are items that act as Major Disciplines but have NO Specific Disciplines.
        // We will insert them into ref_major_discipline so the UI's fallback logic takes over.
        // We will also ensure they do NOT exist in ref_specific_discipline to avoid duplications.
        // ---------------------------------------------------
        $isolatedMajors = [

            // Group-OTHER DISCIPLINES (89)
            ['c' => '891900', 'gc' => '89', 'd' => 'Other Civil Security and Military'],
            ['c' => '899900', 'gc' => '89', 'd' => 'Women Development'],
            ['c' => '899999', 'gc' => '89', 'd' => 'Other Education not elsewhere coded (NEC)'],

            // Group-MASS COMMUNICATION AND DOCUMENTATION (84)
            ['c' => '840700', 'gc' => '84', 'd' => 'Public Relations and Media Management'],

            // Group-HOME ECONOMICS (66)
            ['c' => '663200', 'gc' => '66', 'd' => 'Home Economics with Emphasis on Household Arts'],

            // Group-AGRICULTURAL, FORESTRY, AND FISHERIES (62)
            ['c' => '621200', 'gc' => '62', 'd' => 'Agricultural Economics'],

            // Group-ARCHITECTURAL AND TOWN-PLANNING (58)
            ['c' => '580200', 'gc' => '58', 'd' => 'Architectural Design'],

            // Group-ENGINEERING (54)
            ['c' => '540301', 'gc' => '54', 'd' => 'Engineering'],
            ['c' => '543200', 'gc' => '54', 'd' => 'Metallurgical Engineering'],
            ['c' => '545300', 'gc' => '54', 'd' => 'Agricultural Engineering'],

            // Group- MEDICAL AND ALLIED (50)
            ['c' => '501200', 'gc' => '50', 'd' => 'Nursing'],
            ['c' => '501500', 'gc' => '50', 'd' => 'Midwifery'],
            ['c' => '507200', 'gc' => '50', 'd' => 'Nutrition and Dietetics'],

            // Group- MATHEMATICS (46)
            ['c' => '460100', 'gc' => '46', 'd' => 'General Mathematics'],
            ['c' => '462100', 'gc' => '46', 'd' => 'Actuarial Science'],

            // Group-NATURAL SCIENCE (42)
            ['c' => '424200', 'gc' => '42', 'd' => 'Astronomy'],
            ['c' => '425200', 'gc' => '42', 'd' => 'Meteorology'],

            // Group-LAW AND JURISPRUDENCE (38)
            ['c' => '380400', 'gc' => '38', 'd' => 'International Law'],
            ['c' => '380600', 'gc' => '38', 'd' => 'Labor Law'],
            ['c' => '380800', 'gc' => '38', 'd' => 'Maritime Law'],

            // Group-SOCIAL AND BEHAVIORAL SCIENCES (30)
            ['c' => '304200', 'gc' => '30', 'd' => 'Anthropology'],
            ['c' => '301', 'gc' => '30', 'd' => 'Economics'],
            ['c' => '309900', 'gc' => '30', 'd' => 'Other Social and Behavioral Science'],

            // Group-HUMANITIES (22)
            ['c' => '220100', 'gc' => '22', 'd' => 'General Humanities'],
            ['c' => '222100', 'gc' => '22', 'd' => '"Dead" Languages and their Literature'],
            ['c' => '226100', 'gc' => '22', 'd' => 'Archeology'],
            ['c' => '227100', 'gc' => '22', 'd' => 'Philosophy'],
            ['c' => '229900', 'gc' => '22', 'd' => 'Other Humanities'],

            // Group- FINE AND APPLIED ARTS (18)
            ['c' => '180400', 'gc' => '18', 'd' => 'Drawing and Painting'],
            ['c' => '180800', 'gc' => '18', 'd' => 'Sculpturing'],
            ['c' => '185200', 'gc' => '18', 'd' => 'Interior Design'],
        ];

        foreach ($isolatedMajors as $item) {
            $majorCode = strlen($item['c']) === 6 ? substr($item['c'], 0, 4) : $item['c'];

            // Ensure the Major Discipline exists (4-digit code)
            DB::table('ref_major_discipline')->updateOrInsert(
                ['code' => $majorCode],
                [
                    'discipline_group_code' => $item['gc'],
                    'description' => $item['d'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            // Ensure the Specific Discipline exists (6-digit code) under that Major Discipline
            DB::table('ref_specific_discipline')->updateOrInsert(
                ['code' => $item['c']],
                [
                    'major_discipline_code' => $majorCode,
                    'description' => $item['d'],
                    'minor_group' => null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }
}
