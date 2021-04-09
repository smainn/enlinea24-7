<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProducCodigoAdicional extends Model
{
    use SoftDeletes;

    protected $table = 'produccodigoadicional';
    protected $primaryKey = 'idproduccodigoadicional';
    protected $fillable = [];
}
