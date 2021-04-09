<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sucursal extends Model
{
    use SoftDeletes;

    protected $table = 'sucursal';
    protected $primaryKey = 'idsucursal';
    protected $fillable = [];

    public function almacenes(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Almacen',
            'fkidsucursal',
            'idsucursal'
        );
    }

    public function ventas(){
        return $this->hasMany(
            'App\Models\Comercio\Ventas\Venta',
            'fkidsucursal',
            'idsucursal'
        );
    }
}
