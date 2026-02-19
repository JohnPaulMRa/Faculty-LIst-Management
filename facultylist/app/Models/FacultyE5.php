<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacultyE5 extends Model
{
    protected $table = 'faculty_e5';

    protected $fillable = [
        'school_id',
        'name',
        'email',
        'avatar_initials',
        'joined_year',
        'form_type',
        'status',
        'employment',
        'import_group',

        // E5 Code columns
        'ft_pt_code',
        'gender_code',
        'discipline_code',
        'bachelors_code',
        'masters_code',
        'doctorate_code',
        'highest_degree_code',
        'license_code',
        'tenure_code',
        'rank_code',
        'salary_range_code',
        'teaching_load_code',
        'subjects',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
