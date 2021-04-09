<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\softDeletes;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class ConfigFabrica extends Model
{
    use softDeletes;
    protected $table = 'configfabrica';
    protected $primaryKey = 'idconfigfabrica';
    protected $fillable = [];

    public function decrypt() {
        try {
            $this->comalmaceninventariocorte = $this->comalmaceninventariocorte == null ? null : Crypt::decrypt($this->comalmaceninventariocorte);
            $this->comalmaceningresoprod = $this->comalmaceningresoprod == null ? null : Crypt::decrypt($this->comalmaceningresoprod);
            $this->comalmacensalidaprod = $this->comalmacensalidaprod == null ? null : Crypt::decrypt($this->comalmacensalidaprod);
            $this->comalmacenlistadeprecios = $this->comalmacenlistadeprecios == null ? null : Crypt::decrypt($this->comalmacenlistadeprecios);
            $this->comventasventaalcredito = $this->comventasventaalcredito == null ? null : Crypt::decrypt($this->comventasventaalcredito);
            $this->comventasventaproforma = $this->comventasventaproforma == null ? null : Crypt::decrypt($this->comventasventaproforma);
            $this->comventascobranza = $this->comventascobranza == null ? null : Crypt::decrypt($this->comventascobranza);
            $this->comcompras = $this->comcompras == null ? null : Crypt::decrypt($this->comcompras);
            $this->comtaller = $this->comtaller == null ? null : Crypt::decrypt($this->comtaller);
            $this->comtallervehiculoparte = $this->comtallervehiculoparte == null ? null : Crypt::decrypt($this->comtallervehiculoparte);
            $this->comtallervehiculohistoria = $this->comtallervehiculohistoria == null ? null : Crypt::decrypt($this->comtallervehiculohistoria);
            $this->seguridad = $this->seguridad == null ? null : Crypt::decrypt($this->seguridad);
            return ['ok' => true];
        } catch (DecryptException $e) {
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }
}