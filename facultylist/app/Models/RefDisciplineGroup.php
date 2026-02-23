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

    public function specificDisciplines()
    {
        return $this->hasManyThrough(
            RefSpecificDiscipline::class,
            RefMajorDiscipline::class,
            'discipline_group_code', // Foreign key on RefMajorDiscipline table
            'major_discipline_code', // Foreign key on RefSpecificDiscipline table
            'code', // Local key on RefDisciplineGroup table
            'code' // Local key on RefMajorDiscipline table
        );
    }
}
