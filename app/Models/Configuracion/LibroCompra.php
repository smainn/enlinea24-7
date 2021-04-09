<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LibroCompra extends Model
{
    use SoftDeletes;

    protected $table = 'faclibrocompra';

    protected $primaryKey = 'idfaclibrocompra';

    protected $fillable = [];
}
