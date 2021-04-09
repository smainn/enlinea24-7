<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
use DateTime;
use DateTimeZone;

class OperacionesGenerarCUF
{
    public function __construct()
    {
    }
    public function rellenarCerosIzquierda($numero, $longitud)
    {

        return str_pad($numero, $longitud, "0", STR_PAD_LEFT);
    }

    public function calculardigitoMod11V2($numeros)
    {
        $array = str_split($numeros);

        $reversa = array_reverse($array);
        $newArray = [];
        $mult = 1;
        foreach ($reversa as $num) {
            switch ($mult) {
                case 7:
                    $mult = 2;
                    break;
                default:
                    $mult++;
                    break;
            }
            array_push($newArray, $num * $mult);
        }
        $suma = 0;
        foreach ($newArray as $dato) {
            $suma = $dato + $suma;
        }

        $suma = $suma % 11;
        $suma = 11 - $suma;
        return $suma;
    }

    public function calculaDigitoMod11($numDado, $numDig, $limMult, $x10)
    {
        if (!$x10) {
            $numDig = 1;
        }
        $dado = $numDado;
        for ($n = 1; $n <= $numDig; $n++) {
            $soma = 0;
            $mult = 2;
            for ($i = strlen($dado) - 1; $i >= 0; $i--) {
                $soma += $mult * intval(substr($dado, $i, 1));
                if (++$mult > $limMult) {
                    $mult = 2;
                }
            }
            if ($x10) {
                $dig = fmod(fmod(($soma * 10), 11), 10);
            } else {
                $dig = fmod($soma, 11);
                if ($dig == 10) {
                    $dig = 1;
                }
                if($dig==11){
                    $dig=0;
                }
            }
            $dado .= strval($dig);
        }
        return substr($dado, strlen($dado) - $numDig);
    }

    public function getModulo11($cadena)
    {
        $mod11 = $this->calculaDigitoMod11($cadena, 1, 9, false);
        return $mod11;
    }

    public function dateToString()
    {
        $date = date("Y-m-d H:m:s:v");
        $date = str_replace(" ", "", $date);
        $date = str_replace("-", "", $date);
        $date = str_replace(":", "", $date);
        return $date;
    }
    public function dateToString2($date)
    {
        $date = str_replace(" ", "", $date);
        $date = str_replace("-", "", $date);
        $date = str_replace("T", "", $date);
        $date = str_replace(":", "", $date);
        $date = str_replace(".", "", $date);
        return $date;
    }
    public function dec2hex($number)
    {
        $hexvalues = array(
            '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
        );
        $hexval = '';
        while ($number != '0') {
            $hexval = $hexvalues[bcmod($number, '16')] . $hexval;
            $number = bcdiv($number, '16', 0);
        }
        return $hexval;
    }
    public function generarCuf(
        $nit,
        $fechahora,
        $sucursal,
        $modalidad,
        $tipoemision,
        $codigodocfiscal,
        $tipodocsector,
        $nrofactura,
        $pos
    ) {
        $nit = $this->rellenarCerosIzquierda($nit, 13);
        //$fechahora = $this->dateToString();
        $fechahora = $this->dateToString2($fechahora);
        $sucursal = $this->rellenarCerosIzquierda($sucursal, 4);
        $modalidad = $this->rellenarCerosIzquierda($modalidad, 1);
        $tipoemision = $this->rellenarCerosIzquierda($tipoemision, 1);
        $codigodocfiscal = $this->rellenarCerosIzquierda($codigodocfiscal, 1);
        $tipodocsector = $this->rellenarCerosIzquierda($tipodocsector, 2);
        $nrofactura = $this->rellenarCerosIzquierda($nrofactura, 8);
        $pos = $this->rellenarCerosIzquierda($pos, 4);
        $result = $nit . $fechahora . $sucursal . $modalidad . $tipoemision . $codigodocfiscal . $tipodocsector . $nrofactura . $pos;
        $result2 = $this->calculaDigitoMod11($result, 1, 9, false);
        $result3 = $result . $result2;
        return $this->dec2hex($result3);

    }
    public function probarcufmalo($nit,
    $fechahora,
    $sucursal,
    $modalidad,
    $tipoemision,
    $codigodocfiscal,
    $tipodocsector,
    $nrofactura,
    $pos){
        $nit = $this->rellenarCerosIzquierda($nit, 13);
        //$fechahora = $this->dateToString();
        $fechahora = $this->dateToString2($fechahora);
        $sucursal = $this->rellenarCerosIzquierda($sucursal, 4);
        $modalidad = $this->rellenarCerosIzquierda($modalidad, 1);
        $tipoemision = $this->rellenarCerosIzquierda($tipoemision, 1);
        $codigodocfiscal = $this->rellenarCerosIzquierda($codigodocfiscal, 1);
        $tipodocsector = $this->rellenarCerosIzquierda($tipodocsector, 2);
        $nrofactura = $this->rellenarCerosIzquierda($nrofactura, 8);
        $pos = $this->rellenarCerosIzquierda($pos, 4);
        $result = $nit . $fechahora . $sucursal . $modalidad . $tipoemision . $codigodocfiscal . $tipodocsector . $nrofactura . $pos;
        $result2 = $this->calculaDigitoMod11($result, 1, 9, false);
        return $result;
    }

    public function generarCufSinProblemas(
        $nit,
        $fechahora,
        $sucursal,
        $modalidad,
        $tipoemision,
        $codigodocfiscal,
        $tipodocsector,
        $nrofactura,
        $pos
    ) {
        do {
            $cuf = $this->generarCuf(
                $nit,
                $fechahora,
                $sucursal,
                $modalidad,
                $tipoemision,
                $codigodocfiscal,
                $tipodocsector,
                $nrofactura,
                $pos
            );
        } while ($cuf == 0);
        return $cuf;
    }
}
