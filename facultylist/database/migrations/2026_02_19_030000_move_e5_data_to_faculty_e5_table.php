<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Move existing E5 data from `faculties` to `faculty_e5`
        $e5_records = DB::table('faculties')->where('form_type', 'E5')->get();

        foreach ($e5_records as $record) {
            DB::table('faculty_e5')->insert([
                'name' => $record->name,
                'email' => $record->email,
                'avatar_initials' => $record->avatar_initials,
                'joined_year' => $record->joined_year,
                'form_type' => 'E5',
                'status' => $record->status ?? 'Not Updated',
                'employment' => $record->employment,
                'import_group' => $record->import_group,
                'school_id' => $record->school_id, // assuming column exists in faculties (from school mgmt PR)

                // Map Code Columns
                'ft_pt_code' => $record->fullTimeCode,
                'gender_code' => $record->genderCode,
                'discipline_code' => $record->disciplineCode,
                'highest_degree_code' => $record->degree, // logic used in bulkStoreE5: degree maps to highest_degree_code
                'rank_code' => $record->rankCode,
                'bachelors_code' => $record->bachelorsCode,
                'masters_code' => $record->mastersCode,
                'doctorate_code' => $record->doctorateCode,
                'license_code' => $record->licenseCode,
                'tenure_code' => $record->tenureCode,
                'salary_range_code' => $record->salaryCode,
                'teaching_load_code' => $record->loadCode,
                'subjects' => $record->subjects,

                'created_at' => $record->created_at,
                'updated_at' => $record->updated_at,
            ]);
        }

        // Delete from faculties after successful copy
        if ($e5_records->isNotEmpty()) {
            DB::table('faculties')->where('form_type', 'E5')->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Move data back to faculties if needed
        $e5_records = DB::table('faculty_e5')->where('form_type', 'E5')->get();

        foreach ($e5_records as $record) {
            DB::table('faculties')->insert([
                'name' => $record->name,
                'email' => $record->email,
                'avatar_initials' => $record->avatar_initials,
                'joined_year' => $record->joined_year,
                'form_type' => 'E5',
                'status' => $record->status,
                'employment' => $record->employment,
                'import_group' => $record->import_group,
                'school_id' => $record->school_id,

                'fullTimeCode' => $record->ft_pt_code,
                'genderCode' => $record->gender_code,
                'disciplineCode' => $record->discipline_code,
                'degree' => $record->highest_degree_code,
                'rankCode' => $record->rank_code,
                'bachelorsCode' => $record->bachelors_code,
                'mastersCode' => $record->masters_code,
                'doctorateCode' => $record->doctorate_code,
                'licenseCode' => $record->license_code,
                'tenureCode' => $record->tenure_code,
                'salaryCode' => $record->salary_range_code,
                'loadCode' => $record->teaching_load_code,
                'subjects' => $record->subjects,

                'created_at' => $record->created_at,
                'updated_at' => $record->updated_at,
            ]);
        }

        if ($e5_records->isNotEmpty()) {
            DB::table('faculty_e5')->where('form_type', 'E5')->delete();
        }
    }
};
