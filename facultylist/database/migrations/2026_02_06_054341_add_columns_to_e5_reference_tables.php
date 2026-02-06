<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'e5_ref_gender',
            'e5_ref_highest_degree',
            'e5_ref_professional_license',
            'e5_ref_tenure',
            'e5_ref_faculty_rank',
            'e5_ref_teaching_load',
            'e5_ref_annual_salary',
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                if (!Schema::hasColumn($table->getTable(), 'code')) {
                    $table->string('code')->unique();
                }
                if (!Schema::hasColumn($table->getTable(), 'description')) {
                    $table->text('description');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'e5_ref_gender',
            'e5_ref_highest_degree',
            'e5_ref_professional_license',
            'e5_ref_tenure',
            'e5_ref_faculty_rank',
            'e5_ref_teaching_load',
            'e5_ref_annual_salary',
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn(['code', 'description']);
            });
        }
    }
};
