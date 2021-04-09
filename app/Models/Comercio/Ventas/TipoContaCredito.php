<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoContaCredito extends Model
{
    use SoftDeletes;
    protected $table = 'tipocontacredito';
    protected $primaryKey = 'idtipocontacredito';
    protected $fillable = [];
}
