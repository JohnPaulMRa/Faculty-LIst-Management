<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefSpecificDiscipline extends Model
{
    protected $table = 'ref_specific_discipline';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['code', 'major_discipline_code', 'minor_group', 'description'];

    public function majorDiscipline()
    {
        return $this->belongsTo(RefMajorDiscipline::class, 'major_discipline_code', 'code');
    }
}
