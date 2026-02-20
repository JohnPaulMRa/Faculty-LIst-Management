<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefDisciplineGroup extends Model
{
    protected $table = 'ref_discipline_group';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['code', 'description', 'slug'];

    public function majorDisciplines()
    {
        return $this->hasMany(RefMajorDiscipline::class, 'discipline_group_code', 'code');
    }
}
