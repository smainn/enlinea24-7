<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentroCostoTipo extends Model
{
    use SoftDeletes;
    protected $table = 'centrocostotipo';
    protected $primaryKey = 'idcentrocostotipo';
}
