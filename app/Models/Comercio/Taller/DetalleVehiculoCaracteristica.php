<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetalleVehiculoCaracteristica extends Model
{
    use SoftDeletes;

    protected $table = 'vehiculocaracdetalle';
    protected $primaryKey = 'idvehiculocaracdetalle';

    protected $fillable = [
        'descripcion',
        'fkidvehiculo',
        'fkidvehiculocaracteristica'
    ];
}
