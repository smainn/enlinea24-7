<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompraPlanPagar extends Model
{
    use SoftDeletes;

    protected $table = 'compraplanporpagar';
    protected $primaryKey = 'idcompraplanporpagar';
    protected $fillable = [];
}
