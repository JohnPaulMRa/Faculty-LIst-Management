<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Rename table
        Schema::rename('faculties', 'faculty_e2');

        // Drop E5 specific columns that are no longer needed
        Schema::table('faculty_e2', function (Blueprint $table) {
            $table->dropColumn([
                'fullTimeCode',
                'genderCode',
                'disciplineCode',
                'bachelorsCode',
                'bachelors',
                'mastersCode',
                'masters',
                'doctorateCode',
                'doctorate',
                'licenseCode',
                'tenureCode',
                'rankCode',
                'salaryCode',
                'loadCode',
                'subjects',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add columns back
        Schema::table('faculty_e2', function (Blueprint $table) {
            $table->string('fullTimeCode')->nullable();
            $table->string('genderCode')->nullable();
            $table->string('disciplineCode')->nullable();
            $table->string('bachelorsCode')->nullable();
            $table->string('bachelors')->nullable();
            $table->string('mastersCode')->nullable();
            $table->string('masters')->nullable();
            $table->string('doctorateCode')->nullable();
            $table->string('doctorate')->nullable();
            $table->string('licenseCode')->nullable();
            $table->string('tenureCode')->nullable();
            $table->string('rankCode')->nullable();
            $table->string('salaryCode')->nullable();
            $table->string('loadCode')->nullable();
            $table->string('subjects')->nullable();
        });

        // Rename table back
        Schema::rename('faculty_e2', 'faculties');
    }
};
