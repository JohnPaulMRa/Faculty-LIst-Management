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
        Schema::create('ref_major_discipline', function (Blueprint $table) {
            $table->string('code')->primary(); // 4-digit code e.g. 1401
            $table->string('discipline_group_code')->index(); // FK e.g. 14
            $table->string('description'); // e.g. "General Teacher Training"
            $table->string('slug')->nullable(); // e.g. "general_teacher_training"
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('discipline_group_code')->references('code')->on('ref_discipline_group')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('ref_major_discipline');
        Schema::enableForeignKeyConstraints();
    }
};
