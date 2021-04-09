<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Compra extends Model
{
    use SoftDeletes;
    protected $table = 'compra';
    protected $primaryKey = 'idcompra';
    protected $fillable = [];

    public function proveedor() {
        return $this->belongsTo(
            'App\Models\Comercio\Compras\Proveedor', 
            'fkidproveedor', 
            'idproveedor'
        );
    }

    public function moneda() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Moneda', 
            'fkidmoneda', 
            'idmoneda'
        );
    }
    public function planpagos()
    {
        return $this->hasMany(
            'App\Models\Comercio\Compras\CompraPlanPagar',
            'fkidcompra',
            'idcompra'
        );
    }

    public function compradetalles()
    {
        return $this->hasMany(
            'App\Models\Comercio\Compras\CompraDetalle',
            'fkidcompra', 
            'idcompra'
        );
    }

    public function getProductos() {
        return DB::connection($this->connection)
                    ->table('compra')
                    ->join('compradetalle','fkidcompra','=','compra.idcompra')
                    ->join('almacenproddetalle','idalmacenproddetalle','=','compradetalle.fkidalmacenproddetalle')
                    ->join('producto','idproducto','=','almacenproddetalle.fkidproducto')
                    ->join('unidadmedida','idunidadmedida','=','producto.fkidunidadmedida')
                    ->join('almacen','idalmacen','=','almacenproddetalle.fkidalmacen')
                    ->join('sucursal','idsucursal','=','almacen.fkidsucursal')
                    ->where([
                        'compra.deleted_at' => null,
                        'compradetalle.deleted_at' => null,
                        'almacenproddetalle.deleted_at' => null,
                        'producto.deleted_at' => null,
                        'unidadmedida.deleted_at' => null,
                        'almacen.deleted_at' => null,
                        'sucursal.deleted_at' => null,
                        'compra.idcompra' => $this->idcompra
                    ])
                    ->select(
                        'producto.idproducto','producto.codproducto','producto.idproducto',
                        'producto.descripcion','compradetalle.cantidad','compradetalle.costounit',
                        'unidadmedida.descripcion as unidadmed', 'sucursal.nombre as sucursal',
                        'almacen.descripcion as almacen'
                        )
                    ->get();
    }

    public function getSucurcal() {
        $result =  DB::connection($this->connection)
                    ->table('compra')
                    ->join('compradetalle','fkidcompra','=','compra.idcompra')
                    ->join('almacenproddetalle','idalmacenproddetalle','=','compradetalle.fkidalmacenproddetalle')
                    ->join('almacen','idalmacen','=','almacenproddetalle.fkidalmacen')
                    ->join('sucursal','idsucursal','=','almacen.fkidsucursal')
                    ->where([
                        'compra.deleted_at' => null,
                        'compradetalle.deleted_at' => null,
                        'almacenproddetalle.deleted_at' => null,
                        'almacen.deleted_at' => null,
                        'sucursal.deleted_at' => null,
                        'compra.idcompra' => $this->idcompra
                    ])
                    ->select(
                        'sucursal.nombre'
                    )
                    ->get();
        foreach ($result as $row) {
            return $row;
        }
    }

    public function scopeSearchByIdCod($query, $value) {
            return $query->where(function ($query) use ($value) {
                        return $query->Where('idcompra', 'LIKE', "%$value%")
                                    ->orWhere('codcompra', 'ILIKE', "%$value%");
                    })
                    ->where('tipo', '=', 'R'); //credito
    }

    public function getCuotas() {
        $comp = new Compra();
        $comp->setConnection($this->connection);
        return $comp->leftJoin('compraplanporpagar', 'compraplanporpagar.fkidcompra', '=', 'compra.idcompra')
                    ->where([
                        'compra.idcompra' => $this->idcompra
                    ])
                    ->orderBy('compraplanporpagar.fechadepago','asc')
                    ->select('compraplanporpagar.*','compra.mtototcompra','compra.mtototpagado')
                    ->get();
    }

    public function getCuotasImp() {
        $comp = new Compra();
        $comp->setConnection($this->connection);
        return $comp->leftJoin('compraplanporpagar', 'compraplanporpagar.fkidcompra', '=', 'compra.idcompra')
                    ->where([
                        'compra.idcompra' => $this->idcompra,
                        'compraplanporpagar.estado' => 'I'
                    ])
                    ->orderBy('compraplanporpagar.fechadepago','asc')
                    ->select('compraplanporpagar.*','compra.mtototcompra','compra.mtototpagado')
                    ->get();
    }   
}
