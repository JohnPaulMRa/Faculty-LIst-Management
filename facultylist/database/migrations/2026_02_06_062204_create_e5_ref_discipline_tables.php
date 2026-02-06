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
        Schema::create('e5_ref_major_group', function (Blueprint $table) {
            $table->string('code')->primary(); // e.g. "47", "54"
            $table->string('description');
            $table->timestamps();
        });

        Schema::create('e5_ref_discipline', function (Blueprint $table) {
            $table->id();
            $table->string('major_group_code');
            $table->string('code'); // e.g. "464101"
            $table->string('description');
            $table->timestamps();

            $table->foreign('major_group_code')->references('code')->on('e5_ref_major_group')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e5_ref_discipline');
        Schema::dropIfExists('e5_ref_major_group');
    }
};
