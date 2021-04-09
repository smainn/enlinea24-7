<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Moneda extends Model
{
    use SoftDeletes;

    protected $table = 'moneda';
    protected $primaryKey = 'idmoneda';
    protected $fillable = [];

    public function productos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\Producto',
            'fkidmoneda',
            'idmoneda'
        );
    }

    public function listaPrecios(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\ListaPrecio',
            'fkidmoneda',
            'idmoneda'
        );
    }
}
