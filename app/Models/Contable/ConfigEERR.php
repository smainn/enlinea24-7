<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigEERR extends Model
{
    use SoftDeletes;

    protected $table = 'configeerr';
    protected $primaryKey = 'idconfigeerr';

}
