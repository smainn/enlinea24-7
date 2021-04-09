<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TraspasoProducto extends Model
{
    use SoftDeletes;
    protected $table = 'traspasoproducto';
    protected $primaryKey = 'idtraspasoproducto';
    protected $fillable = [];
}
