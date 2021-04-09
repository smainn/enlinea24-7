<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CuentaPlanTipo extends Model
{
    use SoftDeletes;
    protected $table = 'cuentaplantipo';
    protected $primaryKey = 'idcuentaplantipo';
    protected $fillable = [
        'nombreinterno', 'descripcion',
    ];
}
