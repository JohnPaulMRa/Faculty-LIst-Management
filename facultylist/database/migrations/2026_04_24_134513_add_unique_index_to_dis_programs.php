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
        // Deduplicate dis_programs before adding unique index
        $duplicates = DB::table('dis_programs')
            ->select('specific_discipline_code', 'program_name', DB::raw('MIN(id) as min_id'))
            ->groupBy('specific_discipline_code', 'program_name')
            ->having(DB::raw('COUNT(*)'), '>', 1)
            ->get();

        foreach ($duplicates as $duplicate) {
            DB::table('dis_programs')
                ->where('specific_discipline_code', $duplicate->specific_discipline_code)
                ->where('program_name', $duplicate->program_name)
                ->where('id', '>', $duplicate->min_id)
                ->delete();
        }

        Schema::table('dis_programs', function (Blueprint $table) {
            $table->unique(['specific_discipline_code', 'program_name'], 'dis_prog_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dis_programs', function (Blueprint $table) {
            $table->dropUnique('dis_prog_unique');
        });
    }
};
