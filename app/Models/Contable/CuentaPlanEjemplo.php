<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Softdeletes;

class CuentaPlanEjemplo extends Model
{
    use SoftDeletes;
    protected $table = 'cuentaplanejemplo';
    protected $primaryKey = 'idcuentaplanejemplo';
    protected $fillable = [
        'codcuenta', 'nombre', 'estado', 'fkidcuentaplanejemplopadre', 
        'fkidcuentaplantipo',
    ];
}
