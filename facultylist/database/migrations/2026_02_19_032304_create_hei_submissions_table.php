<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hei_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hei_id')->nullable()->constrained('heis')->onDelete('cascade');
            $table->string('hei_name');
            $table->string('academic_year');
            $table->string('submitted_by');
            $table->integer('total_faculty');
            $table->string('status')->default('Completed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hei_submissions');
    }
};
