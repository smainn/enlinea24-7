<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VentaDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'ventadetalle';
    protected $primaryKey = 'idventadetalle';
    protected $fillable = [];
}
