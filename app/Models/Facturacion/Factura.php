<?php

namespace App\Models\Facturacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Factura extends Model
{
    use SoftDeletes;

    protected $table = 'factura';

    protected $primaryKey = 'idfactura';

    protected $fillable = [
        'numero', 'nombre', 'nit', 'fecha', 'estado', 'notas', 
        'idusuario', 'fechahoratransac', 'codigoqr', 'codigodecontrol', 'mtototalventa',
        'mtodescuento', 'mtoincremento', 'mtototnetoventa', 'contadordelimpresion', 'fkidventa',
    ];
}
