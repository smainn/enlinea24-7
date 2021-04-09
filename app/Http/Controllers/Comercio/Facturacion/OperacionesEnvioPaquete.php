<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
use PharData;
use Phar;
use DirectoryIterator;
use Iterator;

class OperacionesEnvioPaquete
{
    protected $servicioFacturaCompEstandar;
    protected $soapWrapper;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
        $this->servicioFacturaCompEstandar = new ServicioFacturaCompEstandar($soapWrapper);
    }
    public function crearFacturaOffline($numero, $codificado)
    {
        $archtemp = fopen("./facturas/" . $numero . ".xml", "w");
        fwrite($archtemp, $codificado);
        fclose($archtemp);
    }
    public function agregarFacturasTAR($numeroPaquete)
    {
        if (!file_exists("facturas/" . $numeroPaquete . ".tar")) {
            $paquete = new PharData(("facturas/" . $numeroPaquete . ".tar"));
            $files1 = glob('facturas/*.xml');
            foreach ($files1 as $file) {
                if (is_file($file))
                    $paquete->addFile($file);
            }
            $this->eliminarTodasFacturas();
            $paquete->compress(Phar::GZ);
            $this->eliminarPaqueteTAR($numeroPaquete);
            return $numeroPaquete;
            //$this->eliminarPaqueteTAR();
        }
        /*$iterator=new DirectoryIterator("facturas");
            while($iterator->valid()){
                if($iterator->isFile()){
                    if ($iterator->getExtension() ==  "xml") {
                    $palabra=$iterator->getFilename();
                    $paquete->addFile("./facturas/$palabra");
                    }
                }
                $iterator->next();
            }
        }*/
    }

    public function numeroPaquete()
    {
        $inicial = 0;
        $mayor = 0;
        $iterator = new DirectoryIterator("facturas");
        while ($iterator->valid()) {

            if ($iterator->isFile()) {
                if ($iterator->getExtension() ==  "gz") {

                    $palabra = $iterator->getFilename();
                    $numero = filter_var($palabra, FILTER_SANITIZE_NUMBER_INT);

                    $mayor = $numero;
                    $inicial >= $mayor ? $mayor = $inicial
                        : $mayor = $mayor;
                }
            }
            $iterator->next();
        }

        return $mayor + 1;
    }
    public function numeroFactura()
    {
        $anterior = 0;
        $mayor = 0;
        $iterator = new DirectoryIterator("facturas");
        while ($iterator->valid()) {

            if ($iterator->isFile()) {
                if ($iterator->getExtension() ==  "xml") {
                    $palabra = $iterator->getFilename();
                    $numero = filter_var($palabra, FILTER_SANITIZE_NUMBER_INT);

                    $actual = $numero;
                    if ($actual >= $mayor)
                        $mayor = $actual;

                }
            }
            $iterator->next();
        }

        return $mayor+1;
    }
    public function numeroFactura2()
    {
        $var1 = "";
        foreach (new DirectoryIterator('./facturas') as $fileInfo) {
            if ($fileInfo->isDot()) continue;
            $var1 = $fileInfo->getFilename();
        }
        $files1 = glob('facturas/*.xml');
        foreach ($files1 as $file) {
            if (is_file($file))
                $var1=$file;
        }

        return $var1;
    }


    public function eliminarTodasFacturas()
    {
        $files1 = glob('facturas/*.xml');
        foreach ($files1 as $file) {
            if (is_file($file))
                unlink($file);
        }
    }
    public function eliminarPaqueteTAR($numeroPaquete)
    {
        if (file_exists("facturas/" . $numeroPaquete . ".tar")) {
            unlink("facturas/" . $numeroPaquete . ".tar");
        }
    }

    public function sendGZtoSIN(
        $codigoAmbiente,
        $codigoDocumentoFiscal,
        $codigoDocumentoSector,
        $codigoEmision,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cufd,
        $cuis,
        $horaFechaSinc,
        $nit
    ) {

        $lista = array();
        $files = glob("facturas/*.tar.gz");
        foreach ($files as $file) {
            if (is_file($file)) {
                $codificadoPaquete = base64_encode(file_get_contents($file));
                $hashPaquete = hash('sha256', $codificadoPaquete);
                $recepcionPaquete = $this->servicioFacturaCompEstandar->recepcionPaqueteFacturaComputarizadaEstandar(
                    $codificadoPaquete,
                    $codigoAmbiente,
                    $codigoDocumentoFiscal,
                    $codigoDocumentoSector,
                    $codigoEmision,
                    $codigoModalidad,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cufd,
                    $cuis,
                    $horaFechaSinc,
                    $hashPaquete,
                    $nit
                );

                $recepcionPaquete = json_decode(json_encode($recepcionPaquete), true);
                $codigorecepcionPaquete = $recepcionPaquete['RespuestaServicioFacturacion']['codigoRecepcion'];
                $codigoEstado = $recepcionPaquete['RespuestaServicioFacturacion']['codigoEstado'];
                $estado = $recepcionPaquete['RespuestaServicioFacturacion']['transaccion'];
                //return $recepcionPaquete;
                if ($estado == true) {
                    sleep(30);
                    $validacionRecepcionPaquete = $this->servicioFacturaCompEstandar->validacionRecepcionPaqueteFacturaComputarizadaEstandar(
                        $codigoAmbiente,
                        $codigoDocumentoFiscal,
                        $codigoDocumentoSector,
                        $codigoEmision,
                        $codigoModalidad,
                        $codigoPuntoVenta,
                        $codigorecepcionPaquete,
                        $codigoSistema,
                        $codigoSucursal,
                        $cufd,
                        $cuis,
                        $nit
                    );
                    $validacionPaquete = json_decode(json_encode($validacionRecepcionPaquete), true);
                    $codigoRecepcionValidacion = $validacionPaquete['RespuestaServicioFacturacion']['codigoRecepcion'];
                    $estado = $validacionPaquete['RespuestaServicioFacturacion']['transaccion'];
                    $codigoEstado = $validacionPaquete['RespuestaServicioFacturacion']['codigoEstado'];
                    if ($estado == true) {
                        array_push($lista, $codigoRecepcionValidacion);
                    } else {
                        return $validacionPaquete;
                    }
                } else {
                    return $recepcionPaquete;
                }
            }
        }
        return $lista;
    }
    public function eliminarFacturas($dir1)
    {
        if (is_dir($dir1)) {
            if ($dh = opendir($dir1)) {
                while (($file = readdir($dh)) !== false) {

                    $extension = pathinfo($file, PATHINFO_EXTENSION);
                    if ($extension == "xml") {
                        if (file_exists($file))
                            unlink($file);
                    }
                }
                closedir($dh);
            }
        }
    }


    public function creacionFacturaOffline($codificado)
    {
        $this->crearFacturaOffline($this->numeroFactura(), $codificado);
    }
    public function envioPaquetes(
        $codigoAmbiente,
        $codigoDocumentoFiscal,
        $codigoDocumentoSector,
        $codigoEmision,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cufd,
        $cuis,
        $horaFechaSinc,
        $nit
    ) {
        //$this->operacionesEnvioPaquete->crearFacturaOffline($this->operacionesEnvioPaquete->numeroFactura(), $codificado);
        $numeroPaquete = $this->agregarFacturasTAR($this->numeroPaquete());
        return $this->sendGZtoSIN(
            $codigoAmbiente,
            $codigoDocumentoFiscal,
            $codigoDocumentoSector,
            $codigoEmision,
            $codigoModalidad,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cufd,
            $cuis,
            $horaFechaSinc,
            $nit
        );
    }
}
