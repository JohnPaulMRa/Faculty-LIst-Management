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

    // Relationships to major and specific disciplines have been removed because the 'discipline_group_code' column was dropped.

}
