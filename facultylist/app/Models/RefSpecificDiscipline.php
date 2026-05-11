<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DisProgram;

class RefSpecificDiscipline extends Model
{
    protected $table = 'specific_discipline';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    // Grouping is done via group_code and major_code relations
    protected $fillable = ['code', 'description', 'slug', 'group_code', 'major_code'];

    public function programs()
    {
        return $this->hasMany(DisProgram::class, 'specific_discipline_code', 'code');
    }
}
