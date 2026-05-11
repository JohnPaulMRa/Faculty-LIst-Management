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
        $mappings = [
            'BS' => 'Bachelor of Science',
            'AB' => 'Bachelor of Arts',
            'MS' => 'Master of Science',
            'MA' => 'Master of Arts',
            'B.S.' => 'Bachelor of Science',
            'A.B.' => 'Bachelor of Arts',
            'M.S.' => 'Master of Science',
            'M.A.' => 'Master of Arts',
        ];

        $programs = DB::table('dis_programs')->get();

        foreach ($programs as $program) {
            $name = $program->program_name;
            $newName = $name;
            $upperName = strtoupper($name);

            foreach ($mappings as $abbr => $full) {
                $upperAbbr = strtoupper($abbr);
                if (str_starts_with($upperName, $upperAbbr)) {
                    $len = strlen($abbr);
                    if (strlen($name) == $len || in_array($name[$len], [' ', '.', ',', '-'])) {
                        $newName = $full . substr($name, $len);
                        break;
                    }
                }
            }

            if ($newName !== $name) {
                DB::table('dis_programs')
                    ->where('id', $program->id)
                    ->update(['program_name' => $newName]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
