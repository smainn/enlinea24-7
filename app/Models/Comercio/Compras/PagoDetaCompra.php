<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PagoDetaCompra extends Model
{
    use SoftDeletes;
    protected $table = 'pagodetacompra';
    protected $primaryKey = 'idpagodetacompra';
    protected $fillable = [];
}
