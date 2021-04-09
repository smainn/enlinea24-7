<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalidaProducto extends Model
{
    use SoftDeletes;
    
    protected $table = 'salidaproducto';
    protected $primaryKey = 'idsalidaproducto';
    protected $fillable = [];

    public function tipo() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\IngresoSalidaTraspasoTipo', 
            'fkidingresosalidatrastipo', 
            'idingresosalidatrastipo'
        );
    }

    public function salidadetalles() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\SalidaProdDetalle', 
            'fkidsalidaproducto', 
            'idsalidaproducto'
        );
    }
}
