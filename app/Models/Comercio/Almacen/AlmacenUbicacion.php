<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AlmacenUbicacion extends Model
{
    use SoftDeletes;

    protected $table = 'almacenubicacion';
    protected $primaryKey = 'idalmacenubicacion';
    protected $fillable = [];
}
