<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehiculo extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculo';
    protected $primaryKey = 'idvehiculo';
    protected $fillable = [
        'codvehiculo',
        'placa',
        'tipopartpublic',
        'chasis',
        'descripcion',
        'notas',
        'fkidcliente',
        'fkidvehiculotipo'
    ];

    public function scopeSearchByIdCod($query, $value) {
        return $query->orWhere('codvehiculo', 'ILIKE', "%$value%")
                    ->orWhere('idvehiculo', 'LIKE', "%$value%");
    }

    public function scopeSearchByPlaca($query, $value) {
        return $query->join('cliente as c', 'c.idcliente', '=', 'vehiculo.fkidcliente')
                    ->where('placa', 'ILIKE', "%$value%")
                    ->select('vehiculo.*', 'c.idcliente', 'c.nombre', 'c.apellido', 'c.codcliente');
    }

    public function scopeSearchByIdCodCli($query, $value, $idcliente) {
        return $query->join('cliente as c', 'c.idcliente', '=', 'vehiculo.fkidcliente')
                    ->where('c.idcliente', $idcliente)
                    ->where(function($query) use ($value) {
                        return $query->orWhere('vehiculo.codvehiculo', 'ILIKE', "%$value%")
                                    ->orWhere('vehiculo.idvehiculo', 'LIKE', "%$value%");
                    });
    }

    public function scopeSearchByPlacaCli($query, $value, $idcliente) {
        return $query->join('cliente as c', 'c.idcliente', '=', 'vehiculo.fkidcliente')
                    ->join('vehiculotipo as vt', 'vt.idvehiculotipo', '=', 'vehiculo.fkidvehiculotipo')
                    ->select('vehiculo.*', 'vt.descripcion as tipovehiculo', 'vt.idvehiculotipo',
                            'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido')
                    ->where('idcliente', $idcliente)
                    ->Where('vehiculo.placa', 'ILIKE', "%$value%");
    }
}
