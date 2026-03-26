<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class E2ReferenceDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Gender
        $this->seedTable('e2_ref_gender', [
            ['code' => '1', 'desc' => 'Male'],
            ['code' => '2', 'desc' => 'Female'],
        ]);

        // 2. Tenure
        $this->seedTable('e2_ref_tenure', [
            ['code' => '1', 'desc' => 'Faculty member is tenured'],
            ['code' => '2', 'desc' => 'Faculty member has his own plantilla item but is NOT TENURED'],
            ['code' => '3', 'desc' => 'Faculty member has no plantilla item'],
            ['code' => '4', 'desc' => 'No information on the matter.'],
        ]);

        // 3. Faculty Rank
        $this->seedTable('e2_ref_faculty_rank', [
            ['code' => '20', 'desc' => 'INSTRUCTOR'],
            ['code' => '30', 'desc' => 'ASSISTANT PROFESSOR'],
            ['code' => '40', 'desc' => 'ASSOCIATE PROFESSOR'],
            ['code' => '50', 'desc' => 'FULL PROFESSOR ( including UNIVERSITY PROFESSOR).'],
            ['code' => '09', 'desc' => 'TEACHING FELLOW OR TEACHING ASSOCIATE.'],
            ['code' => '11', 'desc' => 'LECTURER, SENIOR LECTURER, PROFESSORIAL LECTURER'],
            ['code' => '12', 'desc' => 'PROFESSOR EMERITUS'],
            ['code' => '13', 'desc' => 'VISITING PROFESSOR (WHATEVER THE ACTUAL RANK)'],
            ['code' => '14', 'desc' => 'ADJUNCT OR AFFILIATE FACULTY (REGARDLESS OF WHETHER ADJUNCT ASST PROF OR ADJUNCT ASSOCIATE PROF OR ADJUNT PROFESSOR, etc.).'],
            ['code' => '90', 'desc' => 'OTHERS'],
        ]);

        // 4. Annual Salary
        $this->seedTable('e2_ref_annual_salary', [
            ['code' => '1', 'desc' => '60,000 below'],
            ['code' => '2', 'desc' => '60,000 - 69,999'],
            ['code' => '3', 'desc' => '70,000 - 79,999'],
            ['code' => '4', 'desc' => '80,000 - 89,999'],
            ['code' => '5', 'desc' => '90,000 - 99,999'],
            ['code' => '6', 'desc' => '100,000 - 149,999'],
            ['code' => '7', 'desc' => '150,000 - 249,999'],
            ['code' => '8', 'desc' => '250,000 - 499,999'],
            ['code' => '9', 'desc' => '500,000 - UP'],
        ]);

        // 5. Highest Degree
        $this->seedTable('e2_ref_highest_degree', [
            ['code' => '000', 'desc' => 'No formal education at all'],
            ['code' => '101', 'desc' => 'Partial elementary schooling but did not complete Grade 4'],
            ['code' => '102', 'desc' => 'Completed Grade 4 but did not graduate from elementary school'],
            ['code' => '103', 'desc' => 'Completed Elementary School'],
            ['code' => '201', 'desc' => 'Partial completion of High School'],
            ['code' => '202', 'desc' => 'Secondary school graduate or equivalent'],
            ['code' => '301', 'desc' => 'Partial completion of pre-baccalaureate certificate, diploma or associateship'],
            ['code' => '302', 'desc' => 'Completed Tech/Voc'],
            ['code' => '401', 'desc' => 'Partial completion of pre-bac certificate, diploma or associateship'],
            ['code' => '402', 'desc' => 'Completed pre-bacc certificate, diploma or associateship'],
            ['code' => '501', 'desc' => 'Completed Year 1 of baccalaureate level or equivalent'],
            ['code' => '502', 'desc' => 'Completed Year 2 of baccalaureate level or equivalent'],
            ['code' => '503', 'desc' => 'Completed Year 3 of baccalaureate level or equivalent'],
            ['code' => '504', 'desc' => 'Completed Year 4 of baccalaureate level or equivalent'],
            ['code' => '505', 'desc' => 'Completed Year 5 of baccalaureate level or equivalent'],
            ['code' => '506', 'desc' => 'Completed Year 6 of baccalaureate level or equivalent'],
            ['code' => '507', 'desc' => 'Completed a baccalaureate degree (including DVM, DDM, D Opt)'],
            ['code' => '601', 'desc' => 'Partial completion of post-baccalaureate certificate, diploma or associateship'],
            ['code' => '602', 'desc' => 'Completed post-baccalaureate certificate, diploma or associateship'],
            ['code' => '701', 'desc' => 'Completed Year 1 of MD or LLB (or equivalent)'],
            ['code' => '702', 'desc' => 'Completed Year 2 of MD or LLB (or equivalent)'],
            ['code' => '703', 'desc' => 'Completed Year 3 of MD or LLB (or equivalent)'],
            ['code' => '704', 'desc' => 'Completed Year 4 of MD or LLB (or equivalent)'],
            ['code' => '705', 'desc' => 'Completed MD or LLB (or equivalent)'],
            ['code' => '801', 'desc' => 'Partial completion of doctorate degree'],
            ['code' => '802', 'desc' => 'Completed all masters requirements except masters thesis (or equivalent)'],
            ['code' => '901', 'desc' => 'Partial completion of doctorate degree (or equivalent)'],
            ['code' => '902', 'desc' => 'Completed all doctorate requirements except dissertation (or equivalent)'],
            ['code' => '903', 'desc' => 'Completed doctoratedegree (or equivalent)'],
            ['code' => '999', 'desc' => 'No record'],
        ]);

        // 6. Salary Grade
        $this->seedTable('e2_ref_salary_grade', [
            ['code' => '1-33', 'desc' => 'Salary Grade 1 - 33'],
            ['code' => '90',   'desc' => 'No salary grade to speak of, e.g. faculty member is part-time (lecturer, professor emeritus, adjunct or affiliate faculty)'],
            ['code' => '99',   'desc' => 'No information on the matter'],
        ]);

        // 7. On Leave Pay
        $this->seedTable('e2_ref_on_leave_pay', [
            ['code' => '1', 'desc' => 'The faculty member is on OFFICIAL LEAVE WITHOUT PAY'],
            ['code' => '2', 'desc' => 'The faculty member is in ACTIVE DUTY OR ON OFFICIAL LEAVE WITH PAY.'],
            ['code' => '3', 'desc' => 'No information on the matter.'],
        ]);

        // 8. FTE
        $this->seedTable('e2_ref_fte', [
            ['code' => '1', 'desc' => 'FTEF = 1.00'],
            ['code' => '2', 'desc' => 'FTEF= 0.50'],
            ['code' => '3', 'desc' => 'FTEF = 0.250'],
        ]);

        // 9. Pursuing Degree
        $this->seedTable('e2_ref_pursuing_degree', [
            ['code' => '1', 'desc' => 'Faculty has already completed doctorate degree in the field where he is teaching.'],
            ['code' => '2', 'desc' => 'Masters degree holder with some PhD units actively pursuing doctorate degree in the discipline where he is teaching.'],
            ['code' => '3', 'desc' => 'Masters degree holder with some PhD units in the discipline where he is teaching but no longer actively pursuing a PhD.'],
            ['code' => '4', 'desc' => 'Masters degree holder with no PhD units in the discipline where he is teaching.'],
            ['code' => '5', 'desc' => 'Bachelors degree holder with some masters units in the discipline where he is teaching actively pursuing masters degree.'],
            ['code' => '6', 'desc' => 'Bachelors degree holder with some masters units in the discipline whre he is teaching but no longer in active pursuit of masters degree.'],
            ['code' => '7', 'desc' => 'Bachelors degree holder with no masters units in the discipline where he is teaching.'],
            ['code' => '8', 'desc' => 'Not a faculty member.'],
            ['code' => '9', 'desc' => 'No information on the matter.'],
        ]);

        // 10. Thesis
        $this->seedTable('e2_ref_thesis', [
            ['code' => '1', 'desc' => 'YES. IN OBTAINING MASTERS DEGREE, THE FACULTY MEMBER WROTE A THESIS.'],
            ['code' => '2', 'desc' => 'NO. IN OBTAINING HIS MASTERS, FACULTY MEMBER DID NOT WRITE A THESIS.'],
            ['code' => '3', 'desc' => 'NO INFORMATION ON THE MATTER.'],
        ]);

        // 11. Dissertation
        $this->seedTable('e2_ref_dissertation', [
            ['code' => '1', 'desc' => 'YES. IN OBTAINING DOCTORATE, THE FACULTY MEMBER WROTE A DISSERTATION.'],
            ['code' => '2', 'desc' => 'NO. IN OBTAINING DOCTORATE, FACULTY MEMBER DID NOT WRITE DISSERTATION.'],
            ['code' => '3', 'desc' => 'NO INFORMATION ON THE MATTER.'],
        ]);
    }

    private function seedTable(string $table, array $data): void
    {
        foreach ($data as $item) {
            DB::table($table)->updateOrInsert(
                ['code' => $item['code']],
                [
                    'description' => $item['desc'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }
    }
}
