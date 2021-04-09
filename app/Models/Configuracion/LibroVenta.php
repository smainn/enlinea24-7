<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LibroVenta extends Model
{
    use SoftDeletes;

    protected $table = 'faclibroventa';

    protected $primaryKey = 'idfaclibroventa';

    protected $fillable = [];
}
