<?php

namespace App\Models\Contable\Ajuste;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtbDefiCtasAsientAutom extends Model
{
    use SoftDeletes;

    protected $table = 'ctbdefictasasientautom';
    protected $primaryKey = 'idctbdefictasasientautom';
    protected $fillable = [
        'clave', 'descripcion', 'codcuenta', 'valor',
    ];
}
