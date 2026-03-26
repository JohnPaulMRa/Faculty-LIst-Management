<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tables = [
            'e2_ref_gender',
            'e2_ref_tenure',
            'e2_ref_faculty_rank',
            'e2_ref_annual_salary',
            'e2_ref_highest_degree',
            'e2_ref_salary_grade',
            'e2_ref_on_leave_pay',
            'e2_ref_fte',
            'e2_ref_pursuing_degree',
            'e2_ref_thesis',
            'e2_ref_dissertation',
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
        Schema::dropIfExists('e2_ref_dissertation');
        Schema::dropIfExists('e2_ref_thesis');
        Schema::dropIfExists('e2_ref_pursuing_degree');
        Schema::dropIfExists('e2_ref_fte');
        Schema::dropIfExists('e2_ref_on_leave_pay');
        Schema::dropIfExists('e2_ref_salary_grade');
        Schema::dropIfExists('e2_ref_highest_degree');
        Schema::dropIfExists('e2_ref_annual_salary');
        Schema::dropIfExists('e2_ref_faculty_rank');
        Schema::dropIfExists('e2_ref_tenure');
        Schema::dropIfExists('e2_ref_gender');
    }
};
