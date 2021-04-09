<?php

namespace App\Models\Facturacion;

use App\Models\Facturacion\AllegedRC4;
use App\Models\Facturacion\Base64SIN;

use Illuminate\Database\Eloquent\Model;
use App\Models\Facturacion\Verhoeff;

class CodigoControl extends Model
{
    public function generarCodigo($certificacion) {
        $array_codigo = [];
        foreach ($certificacion as $c) {
            if ($this->validar($c)) {
                $nroautorizacion = $c->nroautorizacion;
                $nrofactura = $c->nrofactura;
                $nit = $c->nit;

                $fecha = explode('/', $c->fecha);
                $fecha = $fecha[2].$fecha[1].$fecha[0];

                $monto = $c->monto;
                $llave = $c->llave;

                $controlCode = new ControlCode();

                $res = $controlCode->generate(
                    $nroautorizacion,
                    $nrofactura,
                    $nit,
                    $fecha,
                    $monto,
                    $llave
                );

                //return $res;

                array_push($array_codigo, $res);
                //return 1;
            }else {
                return [];
            }
        }
        return $array_codigo;
    }
    public function generate($nroautorizacion,$nrofactura,$nit,$fecha,$monto,$llave) {
        return $llave;
       

    }
    static function addVerhoeffDigit($value,$max){
        for($i=1;$i<=$max;$i++){     
            $value .= Verhoeff::calc($value);       
        }            
        return $value;
    }
    public function validar($certificacion) {
        
        $nroautorizacion = $certificacion->nroautorizacion;
        $nrofactura = $certificacion->nrofactura;
        $nit = $certificacion->nit;

        $fecha = explode('/', $certificacion->fecha);
        $fecha = $fecha[2].$fecha[1].$fecha[0];

        $monto = $certificacion->monto;
        $llave = str_replace('$', '\$', $certificacion->llave);

        if( empty($nroautorizacion) || empty($nrofactura) || empty($nit) || 
                empty($fecha) || empty($monto) || empty($llave)  ){            
            return false;
        } else{
            // if ( $this->validateNumber($nroautorizacion) && $this->validateNumber($nrofactura) &&
            //     $this->validateNumber($nit) && $this->validateNumber($fecha) &&
            //     $this->validateNumber($monto) && $this->validateDosageKey($llave)
            // ) {
            //     return true;
            // }
            // return false;
            return true;
        }

    }
    public function roundUp($value) {
        $value = str_replace(',', '.', $value); 
        return round($value, 0, PHP_ROUND_HALF_UP);
    }
    public function validateNumber($value) {
        if(!preg_match('/^[0-9,.]+$/', $value)) {
            return false;
        }
        return true;
    }
    public function validateDosageKey($value) {
        if(!preg_match('/^[A-Za-z0-9=#()*+-_\@\[\]{}%$]+$/', $value)) {
            return false;
        }
        return true;
    }
}
