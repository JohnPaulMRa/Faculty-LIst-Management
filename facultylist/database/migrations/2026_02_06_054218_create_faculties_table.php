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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('department')->nullable();
            $table->string('rank')->nullable();
            $table->string('degree')->nullable();
            $table->string('status')->nullable();
            $table->string('employment')->nullable();
            $table->string('avatar_initials')->nullable();
            $table->string('joined_year')->nullable();
            $table->string('form_type')->nullable();
            $table->string('import_group')->nullable();
            
            // E5 Codes
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
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
