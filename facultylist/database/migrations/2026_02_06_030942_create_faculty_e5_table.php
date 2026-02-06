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
    Schema::create('faculty_e5', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        
        // Foreign keys matching the 'code' column in your reference tables
        $table->string('ft_pt_code');
        $table->string('gender_code');
        $table->string('highest_degree_code');
        $table->string('license_code');
        $table->string('tenure_code');
        $table->string('rank_code');
        $table->string('teaching_load_code');
        $table->string('salary_range_code');

        $table->timestamps();

        // Optional: Add foreign key constraints to ensure data integrity
        $table->foreign('ft_pt_code')->references('code')->on('e5_ref_full_time_part_time');
        // ... repeat for other codes
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_e5');
    }
};
