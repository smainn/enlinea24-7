<?php

namespace App\Models\Seguridad;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Log extends Model
{
    use SoftDeletes;
    protected $table = 'log';
    protected $primaryKey = 'idlog';
    protected $fillable = [];

    public function guardar(Request $request = null, $accion = null) {
        
        if ($request == null && $accion == null) {
            /*
            $this->fechacliente = Crypt::encrypt($this->fechacliente);
            $this->horacliente = Crypt::encrypt($this->horacliente);
            $this->idusr = Crypt::encrypt($this->idusr);
            $this->loginusr = Crypt::encrypt($this->loginusr);
            $this->accionhecha = Crypt::encrypt($this->accionhecha);
            $this->ipcliente = Crypt::encrypt($this->ipcliente);
            */
            $this->fechacliente = $this->fechacliente;
            $this->horacliente = $this->horacliente;
            $this->idusr = $this->idusr;
            $this->loginusr = $this->loginusr;
            $this->accionhecha = $this->accionhecha;
            $this->ipcliente = $this->ipcliente;
            return $this->save();
        } 
        /*
        $this->fechacliente = Crypt::encrypt($request->get('x_fecha'));
        $this->horacliente = Crypt::encrypt($request->get('x_hora'));
        $this->idusr = Crypt::encrypt($request->get('x_idusuario'));
        $this->loginusr = Crypt::encrypt($request->get('x_login'));
        $this->accionhecha = Crypt::encrypt($accion);
        $this->ipcliente = Crypt::encrypt($request->ip());
        */
        
        $this->fechacliente = $request->get('x_fecha');
        $this->horacliente = $request->get('x_hora');
        $this->idusr = $request->get('x_idusuario');
        $this->loginusr = $request->get('x_login');
        $this->accionhecha = $accion;
        $this->ipcliente = $request->ip();
        return $this->save();
        
    }
}
