<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoTransacVenta extends Model
{
    use SoftDeletes;
    protected $table = 'tipotransacventa';
    protected $primaryKey = 'idtipotransacventa';
    protected $fillable = ['nombre'];
}
