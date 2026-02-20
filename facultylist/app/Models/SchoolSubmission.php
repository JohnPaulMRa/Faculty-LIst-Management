<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'school_name',
        'academic_year',
        'submitted_by',
        'total_faculty',
        'status',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
