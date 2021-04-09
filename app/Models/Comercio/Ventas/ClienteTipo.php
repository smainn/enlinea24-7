<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClienteTipo extends Model
{
    use SoftDeletes;
    protected $table = 'clientetipo';
    protected $primaryKey = 'idclientetipo';
    protected $fillable = [];

    public function clientes() {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\Cliente',
            'fkidclientetipo',
            'idclientetipo'
        );
    }
}
