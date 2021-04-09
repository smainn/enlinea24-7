<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TraspasoProdDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'traspasoproddetalle';
    protected $primaryKey = 'idtraspasoproddetalle';
    protected $fillable = [];
}
