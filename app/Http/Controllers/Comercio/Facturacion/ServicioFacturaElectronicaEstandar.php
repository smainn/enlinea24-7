<?php
namespace App\Http\Controllers\Comercio\Facturacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
class ServicioFacturaElectronicaEstandar{
    protected $soapWrapper;

    public function __construct($soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }
    public function recepcionFacturaElectronicaEstandar(
        $archivo,
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
        $fechaEnvio,
        $hashArchivo,
        $nit
    ) {

        $response = $this->soapWrapper->call(
            'electronicaEstandar.recepcionFacturaElectronicaEstandar',
            [
                [
                    'SolicitudServicioRecepcion' => [
                        'archivo' => $archivo,
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoDocumentoFiscal' => $codigoDocumentoFiscal,
                        'codigoDocumentoSector' => $codigoDocumentoSector,
                        'codigoEmision' => $codigoEmision,
                        'codigoModalidad' => $codigoModalidad,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cufd' => $cufd,
                        'cuis' => $cuis,
                        'fechaEnvio' => $fechaEnvio,
                        'hashArchivo' => $hashArchivo,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
}