<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoPartes extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculopartes';
    protected $primaryKey = 'idvehiculopartes';
    protected $fillable = ['nombre', 'estado'];
}
