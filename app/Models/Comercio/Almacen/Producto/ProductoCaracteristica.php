<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoCaracteristica extends Model
{
    use SoftDeletes;

    protected $table = 'produccaracteristica';
    protected $primaryKey = 'idproduccaracteristica';
    protected $fillable = [];
}
