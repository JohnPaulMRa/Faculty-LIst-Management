<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tables = [
            'e5_ref_full_time_part_time',
            'e5_ref_gender',
            'e5_ref_highest_degree',
            'e5_ref_professional_license',
            'e5_ref_tenure',
            'e5_ref_faculty_rank',
            'e5_ref_teaching_load',
            'e5_ref_annual_salary',
        ];

        foreach ($tables as $tableName) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique();
                $table->text('description');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('e5_ref_annual_salary');
        Schema::dropIfExists('e5_ref_teaching_load');
        Schema::dropIfExists('e5_ref_faculty_rank');
        Schema::dropIfExists('e5_ref_tenure');
        Schema::dropIfExists('e5_ref_professional_license');
        Schema::dropIfExists('e5_ref_highest_degree');
        Schema::dropIfExists('e5_ref_gender');
        Schema::dropIfExists('e5_ref_full_time_part_time');
    }
};
