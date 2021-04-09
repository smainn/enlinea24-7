<?php

namespace App\Models\Comercio\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProveedorContactarlo extends Model
{
    use SoftDeletes;
    protected $table = 'proveedorcontactarlo';
    protected $primaryKey = 'idproveedorcontactarlo';
    protected $fillable = [
        'valor',
        'fkidproveedor',
        'fkidreferenciadecontacto',
    ];
}
