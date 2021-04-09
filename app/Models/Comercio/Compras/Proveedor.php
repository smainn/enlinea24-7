<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proveedor extends Model
{
    use SoftDeletes;

    protected $table = 'proveedor';
    protected $primaryKey = 'idproveedor';

    protected $fillable = [
        'codproveedor',
        'nombre',
        'apellido',
        'nit',
        'foto',
        'notas',
        'contactos',
        'fkidciudad'
    ];

    public function scopeSearchCodId($query, $value) {
        return $query->where('idproveedor', 'LIKE', "%$value%")
                    ->orWhere('codproveedor', 'LIKE', "%$value%");
    }

    public function scopeSearchNombre($query, $value) {
        return $query->where('nombre', 'ILIKE', "%$value%")
                     ->orWhere('apellido', 'ILIKE', "%$value%");
    }
}
