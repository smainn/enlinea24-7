<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListaPreProducDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'listapreproducdetalle';
    protected $primaryKey = 'idlistapreproducdetalle';
    protected $fillable = [];

    public function producto() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\Producto', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function ventadetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\VentaDetalle',
            'fkidlistapreproducdetalle',
            'idlistapreproducdetalle'
        );
    }
}
