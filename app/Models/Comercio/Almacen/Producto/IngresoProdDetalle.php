<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IngresoProdDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'ingresoproddetalle';
    protected $primaryKey = 'idingresoproddetalle';
    protected $fillable = [];

    public function almacenprod() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle', 
            'fkidalmacenproddetalle', 
            'idalmacenproddetalle'
        );
    }
}
