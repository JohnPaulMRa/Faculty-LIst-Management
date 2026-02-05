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
            $table->string('email')->unique();
            $table->string('department');
            $table->string('rank');
            $table->string('degree');
            $table->string('status')->default('No Submission');
            $table->string('employment');
            $table->string('avatar_initials');
            $table->string('joined_year');
            $table->string('form_type')->default('E1'); // Default to E1 or whatever is reasonable, probably 'E5' or handled by import
            $table->string('import_group')->nullable();

            // Form E5 Specific Fields (Nullable)
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
