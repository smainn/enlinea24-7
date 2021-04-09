<?php

namespace App\Models\Comercio\Taller;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehiculoFoto extends Model
{
    use SoftDeletes;
    protected $table = 'vehiculofoto';
    protected $primaryKey = 'idvehiculofoto';

    protected $fillable = [
        'foto',
        'fkidvehiculo',
        'fkidventa',
    ];
}
