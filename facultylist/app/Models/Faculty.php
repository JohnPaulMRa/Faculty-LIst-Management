<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
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
        'fullTimeCode',
        'genderCode',
        'disciplineCode',
        'bachelorsCode',
        'bachelors',
        'mastersCode',
        'masters',
        'doctorateCode',
        'doctorate',
        'licenseCode',
        'tenureCode',
        'rankCode',
        'salaryCode',
        'loadCode',
        'subjects',
    ];
}
