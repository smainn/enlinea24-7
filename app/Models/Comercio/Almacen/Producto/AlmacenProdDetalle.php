<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AlmacenProdDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'almacenproddetalle';
    protected $primaryKey = 'idalmacenproddetalle';
    protected $fillable = [];

    public function almacen() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Almacen', 
            'fkidalmacen', 
            'idalmacen'
        );
    }

    public function ubicacion() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\AlmacenUbicacion', 
            'fkidalmacenubicacion', 
            'idalmacenubicacion'
        );
    }

    public function salidaproddetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\SalidaProdDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function ingresoproddetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\IngresoProdDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function traspasoproddetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\TraspasoProdDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function invetariocortedetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\InventarioCorteDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function ventadetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\VentaDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function compradetalle() {
        return $this->hasMany(
            'App\Models\Comercio\Compras\CompraDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }

    public function producto() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\Producto', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function inventarioscortedet() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\InventarioCorteDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }
}
