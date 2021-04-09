<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoHistorial extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculohistoria';
    protected $primaryKey = 'idvehiculohistoria';
    protected $fillable = [
        'fecha',
        'diagnosticoentrada',
        'trabajoshechos',
        'kmactual',
        'kmproximo',
        'fechaproxima',
        'fechahoratransaccion',
        'precio',
        'notas',
        'idusuario',
        'fkidventa',
        'fkidvehiculo'
    ];
}
