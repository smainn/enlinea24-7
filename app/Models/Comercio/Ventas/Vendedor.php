<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendedor extends Model
{
    use SoftDeletes;

    protected $table = 'vendedor';
    protected $primaryKey = 'idvendedor';
    protected $fillable = [];

    public function comisionventa() {
        return $this->belongsTo(
            'App\Models\Comercio\Ventas\ComisionVenta', 
            'fkidcomisionventa', 
            'idcomisionventa'
        );
    }

    public function contactarlo() {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\VendedorContactarlo', 
            'fkidvendedor', 
            'idvendedor'
        );
    }

    public function venta() {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\Venta',
            'fkidvendedor', 
            'idvendedor'
        );
    }

    public function scopeSearchByIdCod($query, $value) {
        return $query->where('idvendedor', 'LIKE', "%$value%")
                    ->orWhere('codvendedor', 'ILIKE', "%$value%");
    }

    public function scopeSearchByNombre($query, $value) {
        return $query->where('nombre', 'ILIKE', "%$value%")
                    ->orWhere('apellido', 'ILIKE', "%$value%");
    }

    public function scopeSearchFullName($query, $value) {
        return $query->where(DB::raw("CONCAT(nombre, ' ' , apellido)"), 'ILIKE', "%$value%");
    }
}
