<?php
namespace App\Http\Controllers\Comercio\Facturacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
class ServicioFacturaCompEstandar{
    protected $soapWrapper;

    public function __construct($soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }
    public function anulacionFacturaCompEstandar($codigoAmbiente,$codigoDocumentoFiscal,$codigoDocumentoSector,
    $codigoEmision,$codigoModalidad,$codigoMotivo,$codigoPuntoVenta,$codigoSistema,$codigoSucursal,
    $cuf,$cufd,$cuis,$nit,$numeroDocumentoFiscal){
        $response=$this->soapWrapper->call('computarizadaEstandar.anulacionFacturaComputarizadaEstandar',
        [
            [
                'SolicitudServicioAnulacion'=>[
                    'codigoAmbiente'=>$codigoAmbiente,
                    'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                    'codigoDocumentoSector'=>$codigoDocumentoSector,
                    'codigoEmision'=>$codigoEmision,
                    'codigoModalidad'=>$codigoModalidad,
                    'codigoMotivo'=>$codigoMotivo,
                    'codigoPuntoVenta'=>$codigoPuntoVenta,
                    'codigoSistema'=>$codigoSistema,
                    'codigoSucursal'=>$codigoSucursal,
                    'cuf'=>$cuf,
                    'cufd'=>$cufd,
                    'cuis'=>$cuis,
                    'nit'=>$nit,
                    'numeroDocumentoFiscal'=>$numeroDocumentoFiscal
                ]
            ]
        ]);
        return $response;
    }
    public function obtenerRecepcionFacturaComputarizadaEstandar($codigoAmbiente,$codigoDocumentoFiscal,
    $codigoDocumentoSector,$codigoModalidad,$codigoPuntoVenta,$codigoSistema,$codigoSucursal,$cuf,$cufd,
    $cuis,$nit){
        $response = $this->soapWrapper->call(
            'computarizadaEstandar.obtenerRecepcionAnulacionFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioRecepcionAnulacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector'=>$codigoDocumentoSector,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuf'=>$cuf,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }

    public function recepcionFacturaComputarizadaEstandar(
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
            'computarizadaEstandar.recepcionFacturaComputarizadaEstandar',
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
    public function recepcionMasivaFacturaComputarizadaEstandar($archivo,$codigoAmbiente,
    $codigoDocumentoFiscal,$codigoDocumentoSector,$codigoEmision,$codigoModalidad,$codigoPuntoVenta,
    $codigoSistema,$codigoSucursal,$cufd,$cuis,$fechaEnvio,$hashArchivo,$nit){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.recepcionMasivaFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioRecepcion'=>[
                        'archivo'=>$archivo,
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector'=>$codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'fechaEnvio'=>$fechaEnvio,
                        'hashArchivo'=>$hashArchivo,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }

    public function recepcionPaqueteFacturaComputarizadaEstandar( 
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
    $nit){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.recepcionPaqueteFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioRecepcion'=>[
                        'archivo'=>$archivo,
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector'=>$codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'fechaEnvio'=>$fechaEnvio,
                        'hashArchivo'=>$hashArchivo,
                        'nit'=>$nit,
                    ]
                ]
            ]
        );
        return $response;
    }
    public function validacionAnulacionFacturaComputarizadaEstandar($codigoAmbiente,$codigoDocumentoFiscal,
    $codigoDocumentoSector,$codigoEmision,$codigoModalidad,$codigoMotivo,$codigoPuntoVenta,$codigoRecepcion,
    $codigoSistema,$codigoSucursal,$cuf,$cufd,$cuis,$nit,$numeroDocumentoFiscal){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.validacionAnulacionFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioValidacionAnulacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector' => $codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoMotivo'=>$codigoMotivo,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoRecepcion'=>$codigoRecepcion,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuf'=>$cuf,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'nit'=>$nit,
                        'numeroDocumentoFiscal'=>$numeroDocumentoFiscal
                    ]
                ]
            ]
        );
        return $response;
    }
    public function validacionRecepcionFacturaComputarizadaEstandar($codigoAmbiente,$codigoDocumentoFiscal,
    $codigoDocumentoSector,$codigoEmision,$codigoModalidad,$codigoPuntoVenta,$codigoRecepcion,
    $codigoSistema,$codigoSucursal,$cufd,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.validacionRecepcionFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioValidacionRecepcion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector' => $codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoRecepcion'=>$codigoRecepcion,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function validacionRecepcionMasivaFacturaComputarizadaEstandar($codigoAmbiente,$codigoDocumentoFiscal,
    $codigoDocumentoSector,$codigoEmision,$codigoModalidad,$codigoPuntoVenta,$codigoRecepcion,
    $codigoSistema,$codigoSucursal,$cufd,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.validacionRecepcionMasivaFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioValidacionRecepcion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector' => $codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoRecepcion'=>$codigoRecepcion,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function validacionRecepcionPaqueteFacturaComputarizadaEstandar($codigoAmbiente,$codigoDocumentoFiscal,
    $codigoDocumentoSector,$codigoEmision,$codigoModalidad,$codigoPuntoVenta,$codigoRecepcion,
    $codigoSistema,$codigoSucursal,$cufd,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'computarizadaEstandar.validacionRecepcionPaqueteFacturaComputarizadaEstandar',
            [
                [
                    'SolicitudServicioValidacionRecepcion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoDocumentoFiscal'=>$codigoDocumentoFiscal,
                        'codigoDocumentoSector' => $codigoDocumentoSector,
                        'codigoEmision'=>$codigoEmision,
                        'codigoModalidad'=>$codigoModalidad,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoRecepcion'=>$codigoRecepcion,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cufd'=>$cufd,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    
}