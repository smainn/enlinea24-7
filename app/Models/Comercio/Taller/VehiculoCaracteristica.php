<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoCaracteristica extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculocaracteristica';
    protected $primaryKey = 'idvehiculocaracteristica';
    protected $fillable = [
        'caracteristica'
    ];
}
