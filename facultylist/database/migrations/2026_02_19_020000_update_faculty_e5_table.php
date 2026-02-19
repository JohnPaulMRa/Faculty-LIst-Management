<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('faculty_e5', function (Blueprint $table) {
            // Drop the strict foreign key constraints so partial data can be imported
            $table->dropForeign(['ft_pt_code']);

            // Make existing code columns nullable
            $table->string('ft_pt_code')->nullable()->change();
            $table->string('gender_code')->nullable()->change();
            $table->string('highest_degree_code')->nullable()->change();
            $table->string('license_code')->nullable()->change();
            $table->string('tenure_code')->nullable()->change();
            $table->string('rank_code')->nullable()->change();
            $table->string('teaching_load_code')->nullable()->change();
            $table->string('salary_range_code')->nullable()->change();

            // Rename full_name → name for consistency
            $table->renameColumn('full_name', 'name');

            // Add missing fields needed for the Faculty Profile page and dashboard
            $table->string('email')->nullable()->after('name');
            $table->string('avatar_initials', 10)->nullable()->after('email');
            $table->string('joined_year', 20)->nullable()->after('avatar_initials');
            $table->string('form_type', 10)->default('E5')->after('joined_year');
            $table->string('status')->default('Not Updated')->after('form_type');
            $table->string('employment')->nullable()->after('status');
            $table->unsignedBigInteger('school_id')->nullable()->after('employment');
            $table->string('import_group')->nullable()->after('school_id');

            // E5-specific extra columns not in original migration
            $table->string('discipline_code')->nullable()->after('import_group');
            $table->string('bachelors_code')->nullable()->after('discipline_code');
            $table->string('masters_code')->nullable()->after('bachelors_code');
            $table->string('doctorate_code')->nullable()->after('masters_code');
            $table->text('subjects')->nullable()->after('doctorate_code');
        });
    }

    public function down(): void
    {
        Schema::table('faculty_e5', function (Blueprint $table) {
            $table->renameColumn('name', 'full_name');
            $table->dropColumn([
                'email',
                'avatar_initials',
                'joined_year',
                'form_type',
                'status',
                'employment',
                'school_id',
                'import_group',
                'discipline_code',
                'bachelors_code',
                'masters_code',
                'doctorate_code',
                'subjects',
            ]);
        });
    }
};
