<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'contact_number',
        'email',
        'is_active',
        'type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the faculties for the school.
     */
    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }

    public function facultiesE5()
    {
        return $this->hasMany(FacultyE5::class);
    }
}
