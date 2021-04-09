<?php

namespace App\Models\Comercio\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListaPrecio extends Model
{
    use SoftDeletes;

    protected $table = 'listaprecio';
    protected $primaryKey = 'idlistaprecio';
    protected $fillable = [];

    public function listaproddet() {
        return $this->hasMany(
            'App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle',
            'fkidlistaprecio',
            'idlistaprecio'
        );
    }

    public function moneda() {
        return $this->belongsTo(
            'App\Models\Comercio\Almacen\Moneda', 
            'fkidmoneda', 
            'idmoneda'
        );
    }

    public function scopeSearch($query, $value) {
        return $query->where('descripcion', 'ILIKE', "%$value%")
                    ->where('estado', '=', 'A');
    }
}
