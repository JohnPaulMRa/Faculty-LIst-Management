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
        // Truncate generic discipline groups to ensure clean state
        \Illuminate\Support\Facades\DB::table('ref_discipline_group')->truncate();

        $groups = [
            // 14: EDUCATION SCIENCE AND TEACHER TRAINING
            ['code' => '1401', 'major_discipline_code' => '14', 'description' => 'General Teacher Training'],
            ['code' => '1404', 'major_discipline_code' => '14', 'description' => 'Teacher Training with Specialization in a Non-Vocational Subject'],
            ['code' => '1408', 'major_discipline_code' => '14', 'description' => 'Teacher Training for Teaching Practical or Vocational Subjects'],
            ['code' => '1412', 'major_discipline_code' => '14', 'description' => 'Teacher Training for Teaching Pre-school or Kindergarten'],
            ['code' => '1416', 'major_discipline_code' => '14', 'description' => 'Teacher Training for Adult Education'],
            ['code' => '1422', 'major_discipline_code' => '14', 'description' => 'Teacher Training for Teachers in Special Education'],
            ['code' => '1450', 'major_discipline_code' => '14', 'description' => 'Educational Administration and Supervision'],
            ['code' => '1499', 'major_discipline_code' => '14', 'description' => 'Other Education Science and Teacher Training'],

            // 18: FINE AND APPLIED ARTS
            ['code' => '1801', 'major_discipline_code' => '18', 'description' => 'General Art Studies'],
            ['code' => '1802', 'major_discipline_code' => '18', 'description' => 'Music'],
            ['code' => '1803', 'major_discipline_code' => '18', 'description' => 'Drama'],
            ['code' => '1899', 'major_discipline_code' => '18', 'description' => 'Other Fine and Applied Arts'],

            // 22: HUMANITIES
            ['code' => '2201', 'major_discipline_code' => '22', 'description' => 'General Humanities'],
            ['code' => '2202', 'major_discipline_code' => '22', 'description' => 'Current or Vernacular Language and its Literature'],
            ['code' => '2203', 'major_discipline_code' => '22', 'description' => 'Other Living Languages and their Literature'],
            ['code' => '2204', 'major_discipline_code' => '22', 'description' => '"Dead" Languages and their Literature'],
            ['code' => '2205', 'major_discipline_code' => '22', 'description' => 'Linguistics'],
            ['code' => '2206', 'major_discipline_code' => '22', 'description' => 'Comparative Literature'],
            ['code' => '2207', 'major_discipline_code' => '22', 'description' => 'History'],
            ['code' => '2208', 'major_discipline_code' => '22', 'description' => 'Archeology'],
            ['code' => '2209', 'major_discipline_code' => '22', 'description' => 'Philosophy'],
            ['code' => '2299', 'major_discipline_code' => '22', 'description' => 'Other Humanities'],

            // 26: RELIGION AND THEOLOGY
            ['code' => '2601', 'major_discipline_code' => '26', 'description' => 'Religion and Theology'],

            // 30: SOCIAL AND BEHAVIORAL SCIENCES
            ['code' => '3001', 'major_discipline_code' => '30', 'description' => 'General Social and Behavioral Sciences'],
            ['code' => '3002', 'major_discipline_code' => '30', 'description' => 'Economics'],
            ['code' => '3003', 'major_discipline_code' => '30', 'description' => 'Political Science'],
            ['code' => '3004', 'major_discipline_code' => '30', 'description' => 'Sociology'],
            ['code' => '3005', 'major_discipline_code' => '30', 'description' => 'Demography'],
            ['code' => '3006', 'major_discipline_code' => '30', 'description' => 'Anthropology'],
            ['code' => '3007', 'major_discipline_code' => '30', 'description' => 'Psychology'],
            ['code' => '3008', 'major_discipline_code' => '30', 'description' => 'Geography'],
            ['code' => '3009', 'major_discipline_code' => '30', 'description' => 'Studies of Regional Cultures'],
            ['code' => '3099', 'major_discipline_code' => '30', 'description' => 'Other Social and Behavioral Science'],

            // 34: BUSINESS ADMINISTRATION AND RELATED
            ['code' => '3401', 'major_discipline_code' => '34', 'description' => 'General Business Administration (Commerce)'],
            ['code' => '3402', 'major_discipline_code' => '34', 'description' => 'Secretarial'],
            ['code' => '3403', 'major_discipline_code' => '34', 'description' => 'Electronic Data Processing'],
            ['code' => '3404', 'major_discipline_code' => '34', 'description' => 'Accountancy'],
            ['code' => '3405', 'major_discipline_code' => '34', 'description' => 'Business Administration w/ Specialization in Marketing'],
            ['code' => '3406', 'major_discipline_code' => '34', 'description' => 'Business Administration/Mgt. with Other Specialization'],
            ['code' => '3407', 'major_discipline_code' => '34', 'description' => 'Public Administration'],
            ['code' => '3408', 'major_discipline_code' => '34', 'description' => 'Institutional Administration/Management'],
            ['code' => '3499', 'major_discipline_code' => '34', 'description' => 'Other Administration/Management and Related'],

            // 38: LAW AND JURISPRUDENCE
            ['code' => '3801', 'major_discipline_code' => '38', 'description' => 'General Law'],
            ['code' => '3802', 'major_discipline_code' => '38', 'description' => 'Jurisprudence and History of Law'],
            ['code' => '3803', 'major_discipline_code' => '38', 'description' => 'International Law'],
            ['code' => '3804', 'major_discipline_code' => '38', 'description' => 'Labor Law'],
            ['code' => '3805', 'major_discipline_code' => '38', 'description' => 'Maritime Law'],
            ['code' => '3899', 'major_discipline_code' => '38', 'description' => 'Other Law and Jurisprudence'],

            // 42: NATURAL SCIENCE
            ['code' => '4201', 'major_discipline_code' => '42', 'description' => 'Biological Science'],
            ['code' => '4202', 'major_discipline_code' => '42', 'description' => 'Chemistry'],
            ['code' => '4203', 'major_discipline_code' => '42', 'description' => 'Geological Science'],
            ['code' => '4204', 'major_discipline_code' => '42', 'description' => 'Physics'],
            ['code' => '4205', 'major_discipline_code' => '42', 'description' => 'Astronomy'],
            ['code' => '4206', 'major_discipline_code' => '42', 'description' => 'Meteorology'],
            ['code' => '4207', 'major_discipline_code' => '42', 'description' => 'Oceanography'],
            ['code' => '4299', 'major_discipline_code' => '42', 'description' => 'Other Natural/Applied Science'],

            // 46: MATHEMATICS
            ['code' => '4601', 'major_discipline_code' => '46', 'description' => 'General Mathematics'],
            ['code' => '4602', 'major_discipline_code' => '46', 'description' => 'Statistics'],
            ['code' => '4603', 'major_discipline_code' => '46', 'description' => 'Actuarial Science'],
            ['code' => '4699', 'major_discipline_code' => '46', 'description' => 'Other Mathematics'],

            // 47: IT-RELATED
            ['code' => '4701', 'major_discipline_code' => '47', 'description' => 'Computer Science/Information Technology'],

            // 50: MEDICAL AND ALLIED
            ['code' => '5001', 'major_discipline_code' => '50', 'description' => 'Hygiene'],
            ['code' => '5002', 'major_discipline_code' => '50', 'description' => 'Medicine'],
            ['code' => '5003', 'major_discipline_code' => '50', 'description' => 'Rehabilitation Medicine'],
            ['code' => '5004', 'major_discipline_code' => '50', 'description' => 'Nursing'],
            ['code' => '5005', 'major_discipline_code' => '50', 'description' => 'Midwifery'],
            ['code' => '5006', 'major_discipline_code' => '50', 'description' => 'Medical X-ray Techniques'],
            ['code' => '5007', 'major_discipline_code' => '50', 'description' => 'Medical Technology'],
            ['code' => '5008', 'major_discipline_code' => '50', 'description' => 'Dental Medicine'],
            ['code' => '5009', 'major_discipline_code' => '50', 'description' => 'Pharmacy'],
            ['code' => '5010', 'major_discipline_code' => '50', 'description' => 'Optometry'],
            ['code' => '5011', 'major_discipline_code' => '50', 'description' => 'Nutrition and Dietetics'],
            ['code' => '5099', 'major_discipline_code' => '50', 'description' => 'Other Medical Diagnostic and Treatment'],

            // 52: TRADE, CRAFT AND INDUSTRIAL
            ['code' => '5201', 'major_discipline_code' => '52', 'description' => 'Clothing and Related Trades'],

            // 54: ENGINEERING
            ['code' => '5401', 'major_discipline_code' => '54', 'description' => 'Basic Engineering'],
            ['code' => '5402', 'major_discipline_code' => '54', 'description' => 'Aeronautical Engineering'],
            ['code' => '5403', 'major_discipline_code' => '54', 'description' => 'Chemical Engineering'],
            ['code' => '5404', 'major_discipline_code' => '54', 'description' => 'Civil Engineering'],
            ['code' => '5405', 'major_discipline_code' => '54', 'description' => 'Geodetic Engineering'],
            ['code' => '5406', 'major_discipline_code' => '54', 'description' => 'Electrical, Electronics and Computer Engineering'],
            ['code' => '5407', 'major_discipline_code' => '54', 'description' => 'Industrial Engineering'],
            ['code' => '5408', 'major_discipline_code' => '54', 'description' => 'Metallurgical Engineering'],
            ['code' => '5409', 'major_discipline_code' => '54', 'description' => 'Mining Engineering'],
            ['code' => '5410', 'major_discipline_code' => '54', 'description' => 'Mechanical Engineering'],
            ['code' => '5411', 'major_discipline_code' => '54', 'description' => 'Sanitary Engineering'],
            ['code' => '5412', 'major_discipline_code' => '54', 'description' => 'Agricultural Engineering'],
            ['code' => '5413', 'major_discipline_code' => '54', 'description' => 'Forestry Engineering'],
            ['code' => '5499', 'major_discipline_code' => '54', 'description' => 'Other Engineering'],

            // 58: ARCHITECTURAL AND TOWN-PLANNING
            ['code' => '5801', 'major_discipline_code' => '58', 'description' => 'Architecture'],
            ['code' => '5802', 'major_discipline_code' => '58', 'description' => 'Architectural Design'],
            ['code' => '5803', 'major_discipline_code' => '58', 'description' => 'Landscape Architecture'],
            ['code' => '5804', 'major_discipline_code' => '58', 'description' => 'Town Planning'],

            // 62: AGRICULTURAL, FORESTRY, AND FISHERIES
            ['code' => '6201', 'major_discipline_code' => '62', 'description' => 'General Agriculture'],
            ['code' => '6202', 'major_discipline_code' => '62', 'description' => 'Animal Husbandry'],
            ['code' => '6203', 'major_discipline_code' => '62', 'description' => 'Horticulture'],
            ['code' => '6204', 'major_discipline_code' => '62', 'description' => 'Agronomy'],
            ['code' => '6205', 'major_discipline_code' => '62', 'description' => 'Agricultural Economics'],
            ['code' => '6206', 'major_discipline_code' => '62', 'description' => 'Food Sciences and Technology'],
            ['code' => '6207', 'major_discipline_code' => '62', 'description' => 'Soil and Water Sciences'],
            ['code' => '6208', 'major_discipline_code' => '62', 'description' => 'Veterinary Medicine'],
            ['code' => '6299', 'major_discipline_code' => '62', 'description' => 'Other Agriculture'],
            ['code' => '6210', 'major_discipline_code' => '62', 'description' => 'Forestry'],
            ['code' => '6211', 'major_discipline_code' => '62', 'description' => 'Fishery Science and Technology'],

            // 66: HOME ECONOMICS
            ['code' => '6601', 'major_discipline_code' => '66', 'description' => 'General Home Economics'],
            ['code' => '6602', 'major_discipline_code' => '66', 'description' => 'HE w/ Emphasis on Household & Consumer Food Research; Nutrition'],
            ['code' => '6603', 'major_discipline_code' => '66', 'description' => 'Home Economics with Emphasis on Household Arts'],
            ['code' => '6699', 'major_discipline_code' => '66', 'description' => 'Other Home Economics'],

            // 78: SERVICE TRADES
            ['code' => '7801', 'major_discipline_code' => '78', 'description' => 'Tourist Trade'],

            // 84: MASS COMMUNICATION AND DOCUMENTATION
            ['code' => '8401', 'major_discipline_code' => '84', 'description' => 'General Communication Arts'],
            ['code' => '8402', 'major_discipline_code' => '84', 'description' => 'Journalism'],
            ['code' => '8403', 'major_discipline_code' => '84', 'description' => 'Radio and Television Broadcasting'],
            ['code' => '8404', 'major_discipline_code' => '84', 'description' => 'Public Relations and Media Management'],
            ['code' => '8499', 'major_discipline_code' => '84', 'description' => 'Other Communications Arts'],
            ['code' => '8406', 'major_discipline_code' => '84', 'description' => 'Library Science'],

            // 89: OTHER DISCIPLINES (User said 84, but specific code was 84 in major list. In group list it listed 84 twice. Assigning to 89 to avoid collision)
            ['code' => '8901', 'major_discipline_code' => '89', 'description' => 'Criminology'],
            ['code' => '8902', 'major_discipline_code' => '89', 'description' => 'Other Civil Security and Military'],
            ['code' => '8903', 'major_discipline_code' => '89', 'description' => 'Social Welfare'],
            ['code' => '8904', 'major_discipline_code' => '89', 'description' => 'Community Development'],
            ['code' => '8905', 'major_discipline_code' => '89', 'description' => 'Environmental Studies'],
            ['code' => '8906', 'major_discipline_code' => '89', 'description' => 'Human Resource Development'],
            ['code' => '8907', 'major_discipline_code' => '89', 'description' => 'Women Development'],
            ['code' => '8999', 'major_discipline_code' => '89', 'description' => 'Other Education not elsewhere coded (NEC)'],

            // 90: MARITIME
            ['code' => '9001', 'major_discipline_code' => '90', 'description' => 'Marine Engineering'],
            ['code' => '9002', 'major_discipline_code' => '90', 'description' => 'Nautical Science'],

            // 00: GENERAL
            ['code' => '0001', 'major_discipline_code' => '00', 'description' => 'GENERAL'],
        ];

        foreach ($groups as $group) {
            \Illuminate\Support\Facades\DB::table('ref_discipline_group')->insert(
                [
                    'code' => $group['code'],
                    'major_discipline_code' => $group['major_discipline_code'],
                    'description' => $group['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
