<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GestionContable extends Model
{
    use SoftDeletes;

    protected $table = 'gestioncontable';
    protected $primaryKey = 'idgestioncontable';
    protected $fillable = [
        'descripcion', 'fechaini', 'fechafin', 'estado'
    ];
}
