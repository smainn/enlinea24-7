<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoTipo extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculotipo';
    protected $primaryKey = 'idvehiculotipo';
    protected $fillable = [
        'descripcion',
        'idpadrevehiculo',
        'estado'
    ];

    public function getValor($id){
        return 2;
    }

}
