<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $table = 'faculty_e2';

    protected $fillable = [
        'hei_id',
        'name',
        'email',
        'department',
        'rank',
        'degree',
        'status',
        'employment',
        'avatar_initials',
        'joined_year',
        'form_type',
        'import_group',
        'gender',
        'is_tenured',
        'college',
        'salary_grade',
        'annual_salary',
        'pursuing_degree',
        'level_code',
        'on_leave',
        'fte',
        'discipline_load_1',
        'discipline_load_2',
        'discipline_bachelors',
        'discipline_masters',
        'discipline_doctorate',
        'masters_thesis',
        'doctorate_dissertation',
        'ug_lab_units',
        'ug_lec_units',
        'ug_total_units',
        'ug_lab_hours',
        'ug_lec_hours',
        'ug_total_hours',
        'ug_lab_contact',
        'ug_lec_contact',
        'ug_total_contact',
        'grad_lab_units',
        'grad_lec_units',
        'grad_total_units',
        'grad_lab_contact',
        'grad_lec_contact',
        'grad_total_contact',
        'load_research',
        'load_extension',
        'load_study',
        'load_production',
        'load_admin',
        'load_others',
        'load_total',
    ];

    /**
     * Get the HEI that the faculty belongs to.
     */
    public function hei()
    {
        return $this->belongsTo(Hei::class);
    }
}
