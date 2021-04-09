<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class Cobro extends Model
{
    use SoftDeletes;
    protected $table = 'cobro';
    protected $primaryKey = 'idcobro';
    protected $fillable = [];

    public function cobroplanpagodets()
    {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\CobroPlanPagoDet', 
            'fkidcobro', 
            'idcobro'
        );
    }
    
    public function getCuotas() {
        $cob = new Cobro();
        $cob->setConnection($this->connection);
        return $cob->leftJoin('cobroplanpagodetalle','cobroplanpagodetalle.fkidcobro', '=', 'idcobro')
                    ->leftJoin('ventaplandepago', 'ventaplandepago.idventaplandepago', '=', 'cobroplanpagodetalle.fkidventaplandepago')
                    ->select('ventaplandepago.*', 'cobroplanpagodetalle.montocobrado')
                    ->where([
                        'idcobro' => $this->idcobro
                    ])
                    ->orderBy('idcobro', 'ASC')
                    ->get();
    }
}
