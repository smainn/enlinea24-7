<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComprobanteTipo extends Model
{
    use SoftDeletes;

    protected $table = 'comprobantetipo';
    protected $primaryKey = 'idcomprobantetipo';
}
