<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendedorContactarlo extends Model
{
    use SoftDeletes;

    protected $table = 'vendedorcontactarlo';
    protected $primaryKey = 'idvendedorcontactarlo';
    protected $fillable = [];

    public function referenciacontacto() {
        return $this->belongsTo(
            'App\Models\Comercio\Ventas\ReferenciaDeContacto', 
            'fkidreferenciadecontacto', 
            'idreferenciadecontacto'
        );
    }
    /*
    public function moneda() {
        return $this->belongsTo('Modules\Commerce\Entities\Admin\Almacen\Moneda', 'fkidmoneda', 'idmoneda');
    }*/
}
