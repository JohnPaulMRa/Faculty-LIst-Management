<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefSpecificDiscipline extends Model
{
    protected $table = 'ref_specific_discipline';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    // major_discipline_code and minor_group columns were dropped via migration.
    // Grouping is now done via code-prefix matching in the controller.
    protected $fillable = ['code', 'description', 'slug'];
}
