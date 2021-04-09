<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompraDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'compradetalle';
    protected $primaryKey = 'idcompradetalle';
    protected $fillable = [];
}
