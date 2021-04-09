<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comprobante extends Model
{
    use SoftDeletes;

    protected $table = 'comprobante';
    protected $primaryKey = 'idcomprobante';
}
