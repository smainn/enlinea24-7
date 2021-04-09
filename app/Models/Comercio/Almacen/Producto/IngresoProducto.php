<?php

namespace App\Models\Comercio\Almacen\Producto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IngresoProducto extends Model
{
    use SoftDeletes;
    
    protected $table = 'ingresoproducto';
    protected $primaryKey = 'idingresoproducto';
    protected $fillable = [];

    public function tipo() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\IngresoSalidaTraspasoTipo', 
            'fkidingresosalidatrastipo', 
            'idingresosalidatrastipo'
        );
    }

    public function ingresodetalles() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\IngresoProdDetalle', 
            'fkidingresoproducto', 
            'idingresoproducto'
        );
    }
}
