<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Cliente extends Model
{
    use SoftDeletes;
    protected $table = 'cliente';
    protected $primaryKey = 'idcliente';
    protected $fillable = [];
    
    public function scopeSearchByIdCod($query, $value) {
        return $query->where('idcliente', 'ILIKE', "%$value%")
                    ->orWhere('codcliente', 'ILIKE', "%$value%");
    }

    public function scopeSearchByNombre($query, $value) {
        return $query->where(DB::raw("CONCAT(nombre, ' ' , apellido)"), 'ILIKE', "%$value%");
                    //->orWhere('apellido', 'ILIKE', "%$value%");
    }
}
