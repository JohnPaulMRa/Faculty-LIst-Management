<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $table = 'faculty_e2';

    protected $fillable = [
        'school_id',
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
    ];

    /**
     * Get the school that the faculty belongs to.
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
