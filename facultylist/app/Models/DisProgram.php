<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisProgram extends Model
{
    protected $table = 'dis_programs';

    protected $fillable = [
        'specific_discipline_code',
        'program_name',
    ];

    public function specificDiscipline()
    {
            return $this->belongsTo(RefSpecificDiscipline::class, 'specific_discipline_code', 'code');
    }
}
