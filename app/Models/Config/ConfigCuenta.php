<?php

namespace App\Models\Config;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;

class ConfigCuenta extends Model
{
    use SoftDeletes;
    protected $table = 'cuentaconfig';
    protected $primaryKey = 'idcuentaconfig';
    protected $fillable = [];
}
