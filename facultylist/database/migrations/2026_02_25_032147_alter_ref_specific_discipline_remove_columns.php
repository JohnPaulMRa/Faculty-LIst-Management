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
        Schema::table('ref_specific_discipline', function (Blueprint $table) {
            // Drop foreign key first if it exists
            if (Schema::hasColumn('ref_specific_discipline', 'major_discipline_code')) {
                try {
                    $table->dropForeign(['major_discipline_code']);
                } catch (\Exception $e) {
                    // Ignore if foreign key doesn't exist
                }
                $table->dropColumn('major_discipline_code');
            }

            if (Schema::hasColumn('ref_specific_discipline', 'minor_group')) {
                $table->dropColumn('minor_group');
            }

            if (!Schema::hasColumn('ref_specific_discipline', 'slug')) {
                $table->string('slug')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ref_specific_discipline', function (Blueprint $table) {
            $table->string('major_discipline_code')->nullable()->index();
            $table->string('minor_group')->nullable();
            $table->dropColumn('slug');
        });
    }
};
