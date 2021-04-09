<?php

namespace App\Http\Controllers\Comercio\Facturacion\compAntigua;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use BaconQrCode\Encoder\QrCode;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use ControlCode;
use DOMDocument;
use SimpleXMLElement;
use PharData;
use Phar;
use DirectoryIterator;
use Exception;
use Iterator;
use SimpleSoftwareIO\QrCode\Facades\QrCode as FacadesQrCode;
use stdClass;

use App\Models\Facturacion\PrincipalController as pc;

include 'ControlCode.php';


class PrincipalController extends Controller
{
    protected $controlCode;
    public function __construct()
    {
        $this->controlCode = new ControlCode();
        $this->pcc = new pc();
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
            'zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS'
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
                        $reg[5]
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
        $qrcode= $this->crearqr(7799123, 1, 1, '04/02/2020', 200, '2.4', 1, 0, 0, 0, 0, 0);
        //return $qrcode;
        
       
        //$qrcode2=$qrcode->getBase64Image();
        //$qrcodef="data:image/jpeg,png;base64," . $qrcode2;
        return view('pruebafact1')->with('name', $qrcode);
        
        
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
        $descuenBoniFiRebajas
    ) {
        $qr = FacadesQrCode::size(115)->generate(
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
                $descuenBoniFiRebajas
        );
        return $qr;
        $codificado = json_encode($qr);
        return json_decode($codificado);
    }
    public function mostrarFactura(){
        
    }
}
