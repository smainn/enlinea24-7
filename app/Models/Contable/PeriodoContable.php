<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PeriodoContable extends Model
{
    use SoftDeletes;

    protected $table = 'periodocontable';
    protected $primaryKey = 'idperiodocontable';
    protected $fillable = [
        'descripcion', 'fechaini', 'fechafin', 'estado', 'fkidgestioncontable',
    ];
}
