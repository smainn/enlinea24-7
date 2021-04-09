<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActividadEconomica extends Model
{
    use SoftDeletes;

    protected $table = 'facactividadeconomica';

    protected $primaryKey = 'idfacactividadeconomica';

    protected $fillable = [
        'descripcion',
    ];
}
