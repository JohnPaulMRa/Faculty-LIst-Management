<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('discipline_group', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('description');
            $table->string('slug')->nullable(); // Merged
            $table->timestamps();
        });

        Schema::create('major_discipline', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('description');
            $table->string('slug')->nullable();
            $table->timestamps();
        });

        Schema::create('specific_discipline', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('description');
            $table->string('slug')->nullable(); // Merged
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specific_discipline');
        Schema::dropIfExists('major_discipline');
        Schema::dropIfExists('discipline_group');
    }
};
