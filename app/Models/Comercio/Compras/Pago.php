<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pago extends Model
{
    use SoftDeletes;
    protected $table = 'pagos';
    protected $primaryKey = 'idpagos';
    protected $fillable = [];

    public function pagodetacompra()
    {
        return $this->hasMany(
            'App\Models\Comercio\Compras\PagoDetaCompra', 
            'fkidpagos', 
            'idpagos'
        );
    }

    public function getCuotas() {
        return Pago::leftJoin('pagodetacompra','pagodetacompra.fkidpagos', '=', 'idpagos')
                    ->leftJoin('compraplanporpagar', 'compraplanporpagar.idcompraplanporpagar', '=', 'pagodetacompra.fkidcompraplanporpagar')
                    ->select('compraplanporpagar.*', 'pagodetacompra.montopagado as mtopagado')
                    ->where([
                        'idpagos' => $this->idpagos
                    ])
                    ->get();
    }
}
