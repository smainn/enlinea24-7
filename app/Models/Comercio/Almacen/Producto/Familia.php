<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Familia extends Model
{
    use SoftDeletes;
    protected $table = 'familia';
    protected $primaryKey = 'idfamilia';
    protected $fillable = [
        'descripcion',
        'idpadrefamilia',
        'estado'
    ];
}
