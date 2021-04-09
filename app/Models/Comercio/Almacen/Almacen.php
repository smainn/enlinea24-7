<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class Almacen extends Model
{
    use SoftDeletes;

    protected $table = 'almacen';
    protected $primaryKey = 'idalmacen';
    protected $fillable = [];

    public function productos() {

        return DB::connection($this->connection)
                    ->table('almacenproddetalle')
                    ->join('producto', 'producto.idproducto', '=', 'almacenproddetalle.fkidproducto')
                    ->join('almacen', 'almacen.idalmacen', '=', 'almacenproddetalle.fkidalmacen')
                    ->join('unidadmedida', 'unidadmedida.idunidadmedida', '=', 'producto.idproducto')
                    ->where([
                        'almacenproddetalle.deleted_at' => null,
                        'producto.deleted_at' => null,
                        'unidadmedida.deleted_at' => null,
                        'almacenproddetalle.fkidalmacen' => $this->idalmacen
                    ])
                    ->select('producto.*', 'unidadmedida.abreviacion')
                    ->groupBy('producto.idproducto', 'unidadmedida.abreviacion');
    }

    public function traspasoEntradaProductos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\TraspasoProducto',
            'fkidalmacen_entra',
            'idalmacen'
        );
    }

    public function traspasoSalidaProductos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\TraspasoProducto',
            'fkidalmacen_sale',
            'idalmacen'
        );
    }

    public function almacenUbicaciones(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\AlmacenUbicacion',
            'fkidalmacen',
            'idalmacen'
        );
    }

    public function almacenProductoDetalles(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle',
            'fkidalmacen',
            'idalmacen'
        );
    }
}
