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
    Schema::create('e5_ref_full_time_part_time', function (Blueprint $table) {
        $table->id();
        // The CHED code (e.g., "1", "2", "9")
        $table->string('code')->unique(); 
        // The full description of the employment status
        $table->text('description'); 
        $table->timestamps();
    });
    }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('e5_ref_full_time_part_time');
        }
    };
