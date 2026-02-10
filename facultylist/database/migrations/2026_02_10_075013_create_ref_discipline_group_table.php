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
        Schema::create('ref_discipline_group', function (Blueprint $table) {
            $table->string('code')->primary(); // 4-digit code e.g. 1401
            $table->string('major_discipline_code')->index(); // FK e.g. 14
            $table->string('description'); // e.g. "General Teacher Training"
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('major_discipline_code')->references('code')->on('ref_major_discipline')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ref_discipline_group');
    }
};
