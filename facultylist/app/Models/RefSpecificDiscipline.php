<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefSpecificDiscipline extends Model
{
    protected $table = 'specific_discipline';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    // major_discipline_code and minor_group columns were dropped via migration.
    // Grouping is now done via group_code and major_code relations
    protected $fillable = ['code', 'description', 'slug', 'group_code', 'major_code'];
}
