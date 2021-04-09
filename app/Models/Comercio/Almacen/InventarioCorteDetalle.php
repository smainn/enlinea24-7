<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventarioCorteDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'inventariocortedetalle';
    protected $primaryKey = 'idinventariocortedetalle';
    protected $fillable = [];
}
