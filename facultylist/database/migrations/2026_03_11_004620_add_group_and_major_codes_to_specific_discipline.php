<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('specific_discipline', function (Blueprint $table) {
            $table->string('group_code', 50)->nullable();
            $table->string('major_code', 50)->nullable();
        });

        // Populate the new columns
        DB::statement("
            UPDATE specific_discipline
            SET group_code = SUBSTRING(code, 1, 2)
        ");

        DB::statement("
            UPDATE specific_discipline sd
            JOIN major_discipline md ON SUBSTRING(sd.code, 1, 4) = md.code
            SET sd.major_code = md.code
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('specific_discipline', function (Blueprint $table) {
            $table->dropColumn(['group_code', 'major_code']);
        });
    }
};
