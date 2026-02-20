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
        Schema::create('ref_specific_discipline', function (Blueprint $table) {
            $table->string('code')->primary(); // 6-digit code e.g. 140101
            $table->string('major_discipline_code')->index(); // FK e.g. 14
            $table->string('minor_group')->nullable(); // e.g. "General Teacher Training"
            $table->string('description'); // e.g. "Elementary Education"
            $table->timestamps();

            // Foreign key constraint (optional but good practice)
            $table->foreign('major_discipline_code')->references('code')->on('ref_major_discipline')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ref_specific_discipline');
    }
};
