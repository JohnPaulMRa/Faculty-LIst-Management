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
        Schema::create('school_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('academic_year');
            $table->string('submitted_by'); // user name or email
            $table->integer('total_faculty');
            $table->string('status')->default('Completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_submissions');
    }
};
