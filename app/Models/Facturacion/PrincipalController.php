<?php

namespace App\Models\Facturacion;

use Exception;
use Illuminate\Database\Eloquent\Model;
use QrCode;

class PrincipalController extends Model
{
    protected $controlCode;
    public function __construct()
    {
        $this->controlCode = new ControlCode();
    }
    public function index2()
    {

        $Re = '$f';

        $res = $this->controlCode->generate(
            "7904006306693",
            "876814",
            "1665979",
            "20080519",
            "35958,60",
            'zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS',
            'connection'
        );
        dd($res);
    }
    public function index()
    {

        try {
            $filename = "5000casos.txt";
            $handle = fopen($filename, "r");
            if ($handle) {
                $controlCode = new ControlCode();
                $count = 0;
                while (($line = fgets($handle)) !== false) {
                    $reg = explode("|", $line);
                    $code = $controlCode->generate(
                        $reg[0],
                        $reg[1],
                        $reg[2],
                        str_replace('/', '', $reg[3]),
                        $reg[4],
                        $reg[5],
                        'connection'
                    );
                    if ($code === $reg[10]) {
                        $count += 1;
                        //echo json_encode($reg);
                    }
                }
                dd($count);
                fclose($handle);
            } else {
                throw new Exception("<b>Could not open the file!</b>");
            }
        } catch (Exception $e) {
            echo "Error (File: " . $e->getFile() . ", line " .
                $e->getLine() . "): " . $e->getMessage();
        }
    }
    public function generarqr()
    {
        return $this->crearqr(123, 1, 1, '01/02/2020', 200, '2.4', 1, 0, 0, 0, 0, 0, 'connetion');
    }
    public function crearqr(
        $nitEmisor,
        $numeroFactura,
        $numeroAutorizacion,
        $fechaEmision,
        $total,
        $impBase,
        $codigoControl,
        $nitComprador,
        $importeMontoiCEiEHDtaSas,
        $impVentasGravOnoGrav,
        $impNoSujetoFiscal,
        $descuenBoniFiRebajas,
        $connection
    ) {

        $dir =  public_path() . '/' . 'img/' . $connection;
        if (!file_exists($dir)) {
            mkdir($dir);
        }

        $dir =  public_path() . '/' . 'img/' . $connection . '/facturaqr';
        if (!file_exists($dir)) {
            mkdir($dir);
        }

        $registro = '/' . 'img/' . $connection . '/facturaqr'. '/' .date('d').date('m').date('Y').date('H').date('i').date('s').'.png';
        
        $qr = QrCode::size(500)
            ->format('png')
            ->generate(
                $nitEmisor .
                    '|' .
                $numeroFactura .
                    '|' .
                $numeroAutorizacion .
                    '|' .
                $fechaEmision .
                    '|' .
                $total .
                    '|' .
                $impBase .
                    '|' .
                $codigoControl .
                    '|' .
                $nitComprador .
                    '|' .
                $importeMontoiCEiEHDtaSas .
                    '|' .
                $impVentasGravOnoGrav .
                    '|' .
                $impNoSujetoFiscal .
                    '|' .
                $descuenBoniFiRebajas,
                public_path($registro)
            );
        //$codificado = base64_encode($qr);
        return $registro;
    }
    public function mostrarFactura(){
        
    }
}
