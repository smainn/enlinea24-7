<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdCaractDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'prodcaracdetalle';
    protected $primaryKey = 'idprodcaracdetalle';
    protected $fillable = [];

    public function prodcaracteristicas() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Producto\ProductoCaracteristica', 
            'fkidproduccaracteristica', 
            'idproduccaracteristica'
        );
        /*
        return $this->belongsTo(
            'Modules\Commerce\Entities\Admin\Almacen\Familia', 
            'fkidfamilia', 
            'idfamilia');*/
    }
}
