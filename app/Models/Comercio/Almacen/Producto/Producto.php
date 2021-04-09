<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use DB;

class Producto extends Model
{
    use SoftDeletes;

    protected $table = 'producto';
    protected $primaryKey = 'idproducto';
    protected $fillable = [];

    public function foto() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\ProductoFoto', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function familia() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\Familia', 
            'fkidfamilia', 
            'idfamilia'
        );
    }

    public function unidadmedida() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\UnidadMedida', 
            'fkidunidadmedida', 
            'idunidadmedida'
        );
    }

    public function moneda() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Moneda', 
            'fkidmoneda', 
            'idmoneda'
        );
    }
    
    public function detalleprodcaract() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\ProdCaractDetalle', 
            'fkidproducto', 
            'idproducto'
        );
    }
    
    public function detallealamcenprod() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function codigos() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\ProducCodigoAdicional', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function listaprod() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle', 
            'fkidproducto', 
            'idproducto'
        );
    }

    public function scopeSearch($query, $value) {
        return $query->orWhere('descripcion', 'ILIKE', "%$value%")
                    ->orWhere('idproducto', 'ILIKE', "%$value%");
    }

    public function scopeSearchId($query, $value) {
        return $query->Where('idproducto', 'ILIKE', "%$value%");
    }

    public function scopeSearchDesc($query, $value) {
        return $query->where('descripcion', 'ILIKE', "%$value%");
    }
    
    public function scopeSearchIdAlmacen($query, $value, $idalmacen) {
        return $query->join('almacenproddetalle', 'almacenproddetalle.fkidproducto', '=', 'producto.idproducto')
                    ->join('almacen','almacen.idalmacen', '=', 'almacenproddetalle.fkidalmacen')
                    ->join('unidadmedida', 'unidadmedida.idunidadmedida', '=', 'producto.fkidunidadmedida')
                    ->where(function ($query) use ($value) {
                        return $query->where('idproducto', 'LIKE', "%$value%")
                                    ->orWhere('codproducto', 'ILIKE', "%$value%");
                    })
                    ->where('almacen.idalmacen', '=', $idalmacen)
                    ->select('producto.*', 'unidadmedida.descripcion as descripcionUnidad')
                    ->groupBy('producto.idproducto', 'unidadmedida.descripcion');
    }

    public function scopeSearchDescAlmacen($query, $value, $idalmacen) {
        return $query->join('almacenproddetalle', 'almacenproddetalle.fkidproducto', '=', 'producto.idproducto')
                    ->join('almacen','almacen.idalmacen', '=', 'almacenproddetalle.fkidalmacen')
                    ->join('unidadmedida', 'unidadmedida.idunidadmedida', '=', 'producto.fkidunidadmedida')
                    ->where('producto.descripcion', 'ILIKE', "%$value%")
                    ->where('almacen.idalmacen', '=', $idalmacen)
                    ->select('producto.*', 'unidadmedida.descripcion as descripcionUnidad')
                    ->groupBy('producto.idproducto', 'unidadmedida.descripcion');
    }

    public function getAlmacenes() {
        return  DB::connection($this->connection)
                    ->table('producto')
                    ->join('almacenproddetalle','fkidproducto','=','producto.idproducto')
                    ->join('almacen','idalmacen','=','almacenproddetalle.fkidalmacen')
                    ->where([
                        'producto.idproducto' => $this->idproducto, 
                        'producto.deleted_at' => null,
                        'almacenproddetalle.deleted_at' => null,
                        'almacen.deleted_at' => null
                        ])
                    ->select(
                        'almacen.*','almacenproddetalle.idalmacenproddetalle',
                        'almacenproddetalle.stock'
                        )
                    ->orderBy('almacen.idalmacen', 'ASC')
                    ->get();

    }

    public function estaEnAlmacen($idalmacen) {
        $resp = DB::connection($this->connection)
                    ->table('producto')
                    ->join('almacenproddetalle','fkidproducto','=','producto.idproducto')
                    ->where([
                        'producto.idproducto' => $this->idproducto,
                        'almacenproddetalle.fkidalmacen' => $idalmacen,
                        'producto.deleted_at' => null,
                        'almacenproddetalle.deleted_at' => null
                        ])
                    ->select('almacenproddetalle.idalmacenproddetalle as idalmacenprod')
                    ->get();
        $idalmacenprod = null;
        foreach ($resp as $row) {
            $idalmacenprod = $row->idalmacenprod;
        }
        return $idalmacenprod;
    }

    public function getProductosByAlmacenesM($almacenes) {
        $size = sizeof($almacenes);
        $condicion = '';
        $or = '';
        for ($i = 0; $i < $size; $i++) {
            $condicion = $condicion . $or . 'a.idalmacen = ' . $almacenes[$i];
            $or = ' or ';
        }
        
        $sql = "select a.idalmacen, a.descripcion, p.idproducto, p.codproducto,p.descripcion, 
                    p.stock as stocktotal, apd.stock as stockalmacen, apd.idalmacenproddetalle
                from producto as p, almacenproddetalle apd, almacen a
                where p.idproducto = apd.fkidproducto and apd.fkidalmacen = a.idalmacen and p.tipo = 'P' and
                    (" . $condicion . ") and a.deleted_at is null and p.deleted_at is null and
                apd.deleted_at is null
                order by a.idalmacen, p.idproducto";
        return DB::connection($this->connection)->select($sql);
    }

    public function getAlmacenesStocks($idproducto, $almacenes) {
        /*
        $size = sizeof($almacenes);
        $condicion = '';
        $or = '';
        for ($i = 0; $i < $size; $i++) {
            $condicion = $condicion . $or . 'a.idalmacen = ' . $almacenes[$i];
            $or = ' or ';
        }
        */
        $sql = "select apd.idalmacenproddetalle as idapd, apd.stock, a.idalmacen, a.descripcion
                from almacenproddetalle apd, almacen a
                where apd.fkidalmacen = a.idalmacen and a.deleted_at is null and apd.deleted_at is null and
                    apd.fkidproducto =" . $idproducto . "
                order by idalmacen";

        return DB::connection($this->connection)->select($sql);
    }

    public function searchProducto($value, $almacenes) {
        
        $size = sizeof($almacenes);
        $condicion = '';
        $or = '';
        for ($i = 0; $i < $size; $i++) {
            $condicion = $condicion . $or . 'a.idalmacen = ' . $almacenes[$i];
            $or = ' or ';
        }
        $sql = "select distinct p.idproducto, p.codproducto, p.descripcion, p.stock
                from producto p, almacen a, almacenproddetalle apd
                where apd.fkidalmacen = a.idalmacen and apd.fkidproducto = p.idproducto and p.tipo = 'P' and
                (" . $condicion . ") and (p.descripcion ILIKE '%$value%' or CAST(p.idproducto AS VARCHAR) LIKE '%$value%')
                order by p.idproducto";
        return DB::connection($this->connection)->select($sql);
    }

    public function scopeSearchOnlyProduct($query, $value) {
        return $query->where('tipo', '=', 'P')
                    ->where( function($query) use ($value) {
                        return $query->orWhere('descripcion', 'ILIKE', "%$value%")
                                    ->orWhere('idproducto', 'LIKE', "%$value%");
                    });
                    
    }

    public function scopeSearchByCodigo($query, $value) {
        return $query->where('codproducto', 'ILIKE', "%$value%");
                    //->orWhere('idproducto', 'LIKE', "%$value%");
    }
}
