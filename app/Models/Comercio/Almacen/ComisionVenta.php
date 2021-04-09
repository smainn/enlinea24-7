<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComisionVenta extends Model
{
    use SoftDeletes;
    protected $table = 'comisionventa';
    protected $primaryKey = 'idcomisionventa';
    protected $fillable = [];
}
