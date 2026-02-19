<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefMajorDiscipline extends Model
{
    protected $table = 'ref_major_discipline';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['code', 'description'];

    public function specificDisciplines()
    {
        return $this->hasMany(RefSpecificDiscipline::class, 'major_discipline_code', 'code');
    }
}
