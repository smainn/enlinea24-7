<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoParteDetalleFoto extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculopartedetafoto';
    protected $primaryKey = 'idvehiculopartedetafoto';
    protected $fillable = [
        'foto',
        'fkidvehicpartesventadetalle'
    ];
}
