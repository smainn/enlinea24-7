<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoPartesVentaDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'vehicpartesventadetalle';
    protected $primaryKey = 'idvehicpartesventadetalle';
    protected $fillable = [
        'cantidad',
        'estado',
        'observaciones',
        'fkidventa',
        'fkidvehiculopartes'
    ];
}
