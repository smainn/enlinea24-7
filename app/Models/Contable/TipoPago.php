<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoPago extends Model
{
    use SoftDeletes;

    protected $table = 'tipopago';
    protected $primaryKey = 'idtipopago';
}
