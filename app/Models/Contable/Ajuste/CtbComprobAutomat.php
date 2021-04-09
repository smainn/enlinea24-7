<?php

namespace App\Models\Contable\Ajuste;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtbComprobAutomat extends Model
{
    use SoftDeletes;

    protected $table = 'ctbcomprobautomat';
    protected $primaryKey = 'idctbcomprobautomat';
    protected $fillable = [
        'codcomprobante', 'referidoa', 'fecha', 'nrodoc', 'nrochequetarjeta', 
        'glosa', 'tipocambio', 'idusuario', 'contabilizar', 'estado', 'esasientoautomatico', 
        'fkidcomprobantetipo', 'fkidbanco', 'fkidtipopago', 'fkidmoneda', 'fkidctbtransacautomaticas', 
    ];

}
