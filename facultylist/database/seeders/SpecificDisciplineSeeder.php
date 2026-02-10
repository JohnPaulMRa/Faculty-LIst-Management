<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecificDisciplineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate generic specific disciplines to ensure clean state
        \Illuminate\Support\Facades\DB::table('ref_specific_discipline')->truncate();

        $disciplines = [
            // 14: EDUCATION SCIENCE AND TEACHER TRAINING
            // General Teacher Training
            ['code' => '140101', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Elementary Education'],
            ['code' => '140102', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Secondary Education with no specialization'],
            ['code' => '140104', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Elementary and Secondary Education w/ no specialization'],
            ['code' => '140106', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Pedagogy'],
            ['code' => '140108', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Education'],
            ['code' => '140109', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Teaching'],
            ['code' => '140110', 'major_discipline_code' => '14', 'minor_group' => 'General Teacher Training', 'description' => 'Educational Foundation'],

            // Teacher Training with Specialization in a Non-Vocational Subject
            ['code' => '140401', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Chemistry Education'],
            ['code' => '140402', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Christian Education'],
            ['code' => '140403', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'English Education'],
            ['code' => '140404', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Mathematics Teaching'],
            ['code' => '140405', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Physics Teaching'],
            ['code' => '140406', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Religious Education (Character/Value Education)'],
            ['code' => '140407', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Arabic Education (teaching Arabic)'],
            ['code' => '140408', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Physical Education'],
            ['code' => '140409', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Biology Education'],
            ['code' => '140410', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'College Teaching'],
            ['code' => '140411', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Sports Science (Sports Officiating/Coaching)'],
            ['code' => '140412', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Economics Education'],
            ['code' => '140413', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Bilingual Education'],
            ['code' => '140414', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Filipino Education'],
            ['code' => '140415', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'General Science Education'],
            ['code' => '140416', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Health Education'],
            ['code' => '140417', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Home Economics Education'],
            ['code' => '140418', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Language Education/Language Teaching'],
            ['code' => '140419', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Music Education'],
            ['code' => '140420', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Art Education'],
            ['code' => '140421', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Reading Education'],
            ['code' => '140422', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Computer Education (teaching Computer Science)'],
            ['code' => '140423', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Science Education (teaching Science)'],
            ['code' => '140424', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Social Studies Education'],
            ['code' => '140425', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Spanish Education (teaching Spanish)'],
            ['code' => '140426', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Teaching Behavioral Science'],
            ['code' => '140427', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Communication Arts (Pilipino, English)'],
            ['code' => '140429', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Science and Health Education'],
            ['code' => '140431', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Physical Science Education'],
            ['code' => '140432', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training with Specialization in a Non-Vocational Subject', 'description' => 'Social Science Education'],

            // Teacher Training for Teaching Practical or Vocational Subjects
            ['code' => '140801', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Industrial Education'],
            ['code' => '140802', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Industrial Arts'],
            ['code' => '140804', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Practical Arts Education'],
            ['code' => '140805', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Vocational/Technical Education'],
            ['code' => '140806', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Technician Teacher Education'],
            ['code' => '140807', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Teaching Elementary Agriculture'],
            ['code' => '140808', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Practical or Vocational Subjects', 'description' => 'Non-Formal Education'],

            // Teacher Training for Teaching Pre-school or Kindergarten
            ['code' => '141201', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Pre-school or Kindergarten', 'description' => 'Childhood Education'],
            ['code' => '141202', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Pre-school or Kindergarten', 'description' => 'Early Childhood Education'],
            ['code' => '141203', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teaching Pre-school or Kindergarten', 'description' => 'Kindergarten Education'],

            // Teacher Training for Adult Education
            ['code' => '141601', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Adult Education', 'description' => 'Adult Education'],

            // Teacher Training for Teachers in Special Education
            ['code' => '142201', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teachers in Special Education', 'description' => 'Special Education'],
            ['code' => '142202', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teachers in Special Education', 'description' => 'Teaching Handicapped Children'],
            ['code' => '142203', 'major_discipline_code' => '14', 'minor_group' => 'Teacher Training for Teachers in Special Education', 'description' => 'Applied Deaf Studies'],

            // Educational Administration and Supervision
            ['code' => '145001', 'major_discipline_code' => '14', 'minor_group' => 'Educational Administration and Supervision', 'description' => 'Educational Administration/Management'],
            ['code' => '145002', 'major_discipline_code' => '14', 'minor_group' => 'Educational Administration and Supervision', 'description' => 'Vocational School Administration/Management'],
            ['code' => '145003', 'major_discipline_code' => '14', 'minor_group' => 'Educational Administration and Supervision', 'description' => 'Educational Programs Management'],
            ['code' => '145004', 'major_discipline_code' => '14', 'minor_group' => 'Educational Administration and Supervision', 'description' => 'School Principalship'],
            ['code' => '145005', 'major_discipline_code' => '14', 'minor_group' => 'Educational Administration and Supervision', 'description' => 'Human Resource Administration'],

            // Education Science in Support of Teaching
            ['code' => '147201', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Guidance and Counselling'],
            ['code' => '147202', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Measurement and Evaluation'],
            ['code' => '147203', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Research and Evaluation'],
            ['code' => '147204', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Curriculum and Instruction'],
            ['code' => '147205', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Educational Guidance and Family Education'],
            ['code' => '147206', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Educational Psychology'],
            ['code' => '147207', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Educational Technology'],
            ['code' => '147208', 'major_discipline_code' => '14', 'minor_group' => 'Education Science in Support of Teaching', 'description' => 'Library Science Education'],

            // Other Education Science and Teacher Training
            ['code' => '149901', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Agricultural Development Education'],
            ['code' => '149902', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Agricultural Education'],
            ['code' => '149903', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Agricultural Extension Education'],
            ['code' => '149904', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Agricultural Homemaking Education'],
            ['code' => '149905', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Business Education'],
            ['code' => '149906', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Commercial Education'],
            ['code' => '149907', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Extension Education'],
            ['code' => '149908', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Fisheries Education'],
            ['code' => '149909', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Nursing Education'],
            ['code' => '149910', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Secretarial Education'],
            ['code' => '149911', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Basic Agricultural Education/Elementary Agriculture'],
            ['code' => '149912', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Health Professional Education'],
            ['code' => '149913', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Development Education'],
            ['code' => '149914', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Engineering Education'],
            ['code' => '149915', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Occupational Education'],
            ['code' => '149916', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Human Ecology Education'],
            ['code' => '149917', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Agricultural Technology Education'],
            ['code' => '149918', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Environmental Education'],
            ['code' => '149919', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Maritime Education'],
            ['code' => '149920', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Population Education'],
            ['code' => '149921', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Nutrition and Dietetics Teaching'],
            ['code' => '149922', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'History Education'],
            ['code' => '149999', 'major_discipline_code' => '14', 'minor_group' => 'Other Education Science and Teacher Training', 'description' => 'Other Education Science and Teacher Training'],
        ];

        foreach ($disciplines as $discipline) {
            \Illuminate\Support\Facades\DB::table('ref_specific_discipline')->insert(
                [
                    'code' => $discipline['code'],
                    'major_discipline_code' => $discipline['major_discipline_code'],
                    // 'discipline_group_code' removed as per request
                    'minor_group' => $discipline['minor_group'],
                    'description' => $discipline['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
