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
        Schema::table('ref_major_discipline', function (Blueprint $table) {
            if (Schema::hasColumn('ref_major_discipline', 'discipline_group_code')) {
                try {
                    $table->dropForeign(['discipline_group_code']);
                } catch (\Exception $e) {
                    // Ignore if FK doesn't exist
                }
                $table->dropColumn('discipline_group_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ref_major_discipline', function (Blueprint $table) {
            $table->string('discipline_group_code')->nullable()->index();
        });
    }
};
