<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoLibroVenta extends Model
{
    use SoftDeletes;

    protected $table = 'factipolibroventa';

    protected $primaryKey = 'idfactipolibroventa';

    protected $fillable = [];
}
