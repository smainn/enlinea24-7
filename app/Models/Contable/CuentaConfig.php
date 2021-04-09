<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

class CuentaConfig extends Model
{
    use SoftDeletes;
    protected $table = 'cuentaconfig';
    protected $primaryKey = 'idcuentaconfig';
    protected $fillable = [
        'fecha', 'numniveles', 'formato', 'estado',
    ];

    public function decrypt() {
        try {
            $this->fecha = $this->fecha == null ? null : Crypt::decrypt($this->fecha);
            $this->numniveles = $this->numniveles == null ? null : Crypt::decrypt($this->numniveles);
            $this->formato = $this->formato == null ? null : Crypt::decrypt($this->formato);
            $this->estado = $this->estado == null ? null : Crypt::decrypt($this->estado);
            $this->impuestoanualieerr = $this->impuestoanualieerr == null ? null : Crypt::decrypt($this->impuestoanualieerr);
            return true;
        } catch (DecryptException $e) {
            return false;
        }
    }
}
