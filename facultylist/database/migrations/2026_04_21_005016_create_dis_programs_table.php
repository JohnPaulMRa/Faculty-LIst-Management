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
        // 1. Create the new dis_programs table
        Schema::create('dis_programs', function (Blueprint $table) {
            $table->id();
            $table->string('specific_discipline_code', 50);
            $table->string('program_name');
            $table->timestamps();

            $table->foreign('specific_discipline_code')->references('code')->on('specific_discipline')->onDelete('cascade');
        });

        // 2. Migrate existing data
        $records = DB::table('specific_discipline')->whereNotNull('program')->where('program', '!=', '')->get();
        foreach ($records as $record) {
            DB::table('dis_programs')->insert([
                'specific_discipline_code' => $record->code,
                'program_name' => $record->program,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Drop the column from specific_discipline
        Schema::table('specific_discipline', function (Blueprint $table) {
            $table->dropColumn('program');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Add back the column
        Schema::table('specific_discipline', function (Blueprint $table) {
            $table->string('program')->nullable()->after('description');
        });

        // 2. Migrate data back (Warning: If multiple programs exist, only one will be preserved)
        $programs = DB::table('dis_programs')->get();
        foreach ($programs as $program) {
            DB::table('specific_discipline')
                ->where('code', $program->specific_discipline_code)
                ->update(['program' => $program->program_name]);
        }

        // 3. Drop the new table
        Schema::dropIfExists('dis_programs');
    }
};
