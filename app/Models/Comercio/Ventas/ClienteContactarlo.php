<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClienteContactarlo extends Model
{
    use SoftDeletes;
    protected $table = 'clientecontactarlo';
    protected $primaryKey = 'idclientecontactarlo';
    protected $fillable = [];
}
