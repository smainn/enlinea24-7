<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalidaProdDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'salidaproddetalle';
    protected $primaryKey = 'idsalidaproddetalle';
    protected $fillable = [];
}
