<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Drop the existing primary key on `code`
        // Then add a new auto-increment `id` as primary key
        // and make `code` just a regular indexed column (non-unique)
        DB::statement('ALTER TABLE specific_discipline DROP PRIMARY KEY');
        DB::statement('ALTER TABLE specific_discipline ADD COLUMN id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY FIRST');
        DB::statement('ALTER TABLE specific_discipline MODIFY code VARCHAR(50) NOT NULL');
        DB::statement('CREATE INDEX specific_discipline_code_index ON specific_discipline (code)');
    }

    public function down(): void
    {
        // Reverse: drop id, drop code index, restore code as primary key
        DB::statement('DROP INDEX specific_discipline_code_index ON specific_discipline');
        DB::statement('ALTER TABLE specific_discipline DROP COLUMN id');
        DB::statement('ALTER TABLE specific_discipline ADD PRIMARY KEY (code)');
    }
};
