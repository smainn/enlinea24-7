<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Config\ConfigCliente;

class Venta extends Model
{
    use SoftDeletes;

    protected $table = 'venta';
    protected $primaryKey = 'idventa';
    protected $fillable = [];
    
    public function scopeSearchByIdCod($query, $value, $vendedor) {

        $confc = new ConfigCliente();
        $confc->setConnection($this->connection);
        $configCli = $confc->first();
        $configCli->decrypt();

        $condicion = $configCli->ventaendospasos ? [] : ['fkidtipocontacredito' => '2']; //DEPENDE SI ES EN DOS PASOS credito

        if ($vendedor != null) {
            $condicion['fkidvendedor'] = $vendedor->idvendedor;
        }
        return $query->where( function($query) use ($value) {
                        return $query->where('idventa', 'LIKE', "%$value%")
                                    ->orWhere('codventa', 'ILIKE', "%$value%");
                    })
                    //->where('fkidtipocontacredito', '=', '2'); //credito
                    ->where($condicion); //credito
    }

    public function cliente()
    {
        return $this->belongsTo(
            'App\Models\Comercio\Ventas\Cliente', 
            'fkidcliente', 
            'idcliente'
        );
    }

    public function getCuotas()
    {
        $vet = new Venta();
        $vet->setConnection($this->connection);
        return $vet->leftJoin('ventaplandepago', 'ventaplandepago.fkidventa', '=', 'venta.idventa')
                    ->where([
                        'venta.idventa' => $this->idventa,
                        'ventaplandepago.estado' => 'I'
                    ])
                    ->orderBy('ventaplandepago.fechaapagar','asc')
                    ->select('ventaplandepago.*','venta.mtototventa','venta.mtototcobrado')
                    ->get();
    }

    public function vehiculofotos()
    {
        return $this->hasMany(
            'App\Models\Comercio\Taller\VehiculoFoto', 
            'fkidventa', 
            'idventa'
        );
    }

    public function ventadetalles()
    {
        return $this->hasMany(
            'App\Models\Comercio\Ventas\VentaDetalle', 
            'fkidventa', 
            'idventa'
        );
    }
}
