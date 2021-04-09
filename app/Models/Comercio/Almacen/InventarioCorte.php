<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventarioCorte extends Model
{
    use SoftDeletes;
    protected $table = 'inventariocorte';
    protected $primaryKey = 'idinventariocorte';
    protected $fillable = [];

    public function scopeSearchByIdCod($query, $value) {
        return $query->orWhere('idinventariocorte', 'LIKE', "%$value%")
                    ->orWhere('codinventario', 'ILIKE', "%$value%");
    }

    public function detalles()
    {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\InventarioCorteDetalle', 
            'fkidinventariocorte', 
            'idinventariocorte');
    }
}
