<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefDisciplineGroup extends Model
{
    protected $table = 'ref_discipline_group';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['code', 'major_discipline_code', 'description', 'slug'];

    public function majorDiscipline()
    {
        return $this->belongsTo(RefMajorDiscipline::class, 'major_discipline_code', 'code');
    }
}
