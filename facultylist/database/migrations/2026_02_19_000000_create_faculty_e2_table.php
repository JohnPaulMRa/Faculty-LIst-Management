<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('faculty_e2', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('department')->nullable();
            $table->string('rank')->nullable();
            $table->string('degree')->nullable();
            $table->string('status')->nullable();
            $table->string('employment')->nullable();
            $table->string('avatar_initials')->nullable();
            $table->string('joined_year')->nullable();
            $table->string('form_type')->nullable();
            $table->string('import_group')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty_e2');
    }
};
