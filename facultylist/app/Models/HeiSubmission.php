<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeiSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'hei_id',
        'hei_name',
        'academic_year',
        'submitted_by',
        'total_faculty',
        'status',
    ];

    public function hei()
    {
        return $this->belongsTo(Hei::class);
    }
}
