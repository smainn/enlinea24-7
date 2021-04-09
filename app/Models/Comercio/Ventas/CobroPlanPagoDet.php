<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CobroPlanPagoDet extends Model
{
    use SoftDeletes;
    protected $table = 'cobroplanpagodetalle';
    protected $primaryKey = 'idcobroplanpagodetalle';
    protected $fillable = [];
}
