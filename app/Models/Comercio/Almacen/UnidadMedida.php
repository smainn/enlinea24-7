<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnidadMedida extends Model
{
    use SoftDeletes;
    protected $table = 'unidadmedida';
    protected $primaryKey = 'idunidadmedida';
    protected $fillable = [];

    /*public function productos(){
        return $this->hasMany(
            'App\Models\Comercio\Almacen\UnidadMedida',
            'fkidunidadmedida',
            'idunidadmedida'
        );
    }*/
}
