<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IngresoSalidaTraspasoTipo extends Model
{
    use SoftDeletes;

    protected $table = 'ingresosalidatrastipo';
    protected $primaryKey = 'idingresosalidatrastipo';
    protected $fillable = [];

    public function salidaProductos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\SalidaProducto',
            'fkidingresosalidatrastipo',
            'idingresosalidatrastipo'
        );
    }

    public function ingresoProductos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\IngresoProducto',
            'fkidingresosalidatrastipo',
            'idingresosalidatrastipo'
        );
    }

    public function traspasoProductos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\TraspasoProducto',
            'fkidingresosalidatrastipo',
            'idingresosalidatrastipo'
        );
    }
}
