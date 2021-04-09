<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComprobanteCuentaDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'comprobantecuentadetalle';
    protected $primaryKey = 'idcomprobantecuentadetalle';
}
