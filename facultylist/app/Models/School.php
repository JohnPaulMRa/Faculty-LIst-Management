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
}
