<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_name',
        'academic_year',
        'submitted_by',
        'total_faculty',
        'status',
    ];
}
