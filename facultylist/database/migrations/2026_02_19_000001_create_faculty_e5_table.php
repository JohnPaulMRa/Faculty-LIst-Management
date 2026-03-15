<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('faculty_e5', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('avatar_initials', 10)->nullable();
            $table->string('joined_year', 20)->nullable();
            $table->string('form_type', 10)->default('E5');
            $table->string('status')->default('Not Updated');
            $table->string('employment')->nullable();
            $table->unsignedBigInteger('hei_id')->nullable();
            $table->string('import_group')->nullable();

            $table->string('discipline_code')->nullable();
            $table->string('bachelors_code')->nullable();
            $table->string('masters_code')->nullable();
            $table->string('doctorate_code')->nullable();

            // Foreign keys matching the 'code' column in reference tables
            $table->string('ft_pt_code')->nullable();
            $table->string('gender_code')->nullable();
            $table->string('highest_degree_code')->nullable();
            $table->string('license_code')->nullable();
            $table->string('tenure_code')->nullable();
            $table->string('rank_code')->nullable();
            $table->string('teaching_load_code')->nullable();
            $table->string('salary_range_code')->nullable();

            $table->text('subjects')->nullable();
            $table->timestamps();

            // Setup proper relations to reference tables if needed
            // $table->foreign('ft_pt_code')->references('code')->on('e5_ref_full_time_part_time');
            // ... repeat for others ...
            $table->foreign('hei_id')->references('id')->on('heis')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty_e5');
    }
};
