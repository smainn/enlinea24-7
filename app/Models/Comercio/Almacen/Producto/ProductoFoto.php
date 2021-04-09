<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoFoto extends Model
{
    use SoftDeletes;

    protected $table = 'productofoto';
    protected $primaryKey = 'idproductofoto';
    protected $fillable = [];
}
