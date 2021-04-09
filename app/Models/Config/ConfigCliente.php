<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class ConfigCliente extends Model
{
    use SoftDeletes;
    protected $table = 'configcliente';
    protected $primaryKey = 'idconfigcliente';
    protected $fillable = [
        'codigospropios',
        'otroscodigos',
        'monedapordefecto',
        'editprecunitenventa',
        'editcostoproducto',
        'masdeuncosto',
        'masdeunalmacen',
        'editarstockproducto',
        'clienteesabogado',
        'logo',
        'logonombre',
        'logoreporte',
        'colors',
        'asientoautomaticosiempre',
        'asientoautomdecomprob',
    ];

    public function decrypt() {
        try {
            $this->codigospropios = $this->codigospropios == null ? null : Crypt::decrypt($this->codigospropios);
            $this->otroscodigos = $this->otroscodigos == null ? null : Crypt::decrypt($this->otroscodigos);
            $this->monedapordefecto = $this->monedapordefecto == null ? null : Crypt::decrypt($this->monedapordefecto);
            $this->editprecunitenventa = $this->editprecunitenventa == null ? null : Crypt::decrypt($this->editprecunitenventa);
            $this->editcostoproducto = $this->editcostoproducto == null ? null : Crypt::decrypt($this->editcostoproducto);
            $this->masdeuncosto = $this->masdeuncosto == null ? null : Crypt::decrypt($this->masdeuncosto);
            $this->masdeunalmacen = $this->masdeunalmacen == null ? null : Crypt::decrypt($this->masdeunalmacen);
            $this->editarstockproducto = $this->editarstockproducto == null ? null : Crypt::decrypt($this->editarstockproducto);
            $this->clienteesabogado = $this->clienteesabogado == null ? null : Crypt::decrypt($this->clienteesabogado);
            $this->facturarsiempre = $this->facturarsiempre == null ? null : Crypt::decrypt($this->facturarsiempre);
            $this->ventaendospasos = $this->ventaendospasos == null ? null : Crypt::decrypt($this->ventaendospasos);
            $this->logo = $this->logo == null ? null : Crypt::decrypt($this->logo);
            $this->logonombre = $this->logonombre == null ? null : Crypt::decrypt($this->logonombre);
            $this->logoreporte = $this->logoreporte == null ? null : Crypt::decrypt($this->logoreporte);
            $this->colors = $this->colors == null ? null : Crypt::decrypt($this->colors);
            $this->asientoautomaticosiempre = $this->asientoautomaticosiempre;
            $this->asientoautomdecomprob = $this->asientoautomdecomprob;
            
            return true;
        } catch (DecryptException $e) {
            return false;
        } 
    }
}
