<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CuentaPlan extends Model
{
    use SoftDeletes;
    protected $table = 'cuentaplan';
    protected $primaryKey = 'idcuentaplan';
    protected $fillable = [
        'codcuenta', 'nombre', 'estado', 'fkidcuentaplanpadre', 
        'fkidcuentaplantipo', 'fkidcuentasautomconfigasignacion', 'esctadetalle',
    ];
}
