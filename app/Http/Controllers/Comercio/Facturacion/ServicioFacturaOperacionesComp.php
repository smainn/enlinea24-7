<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;

class ServicioFacturaOperacionesComp
{
    protected $soapWrapper;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }
    public function cierreOperacionesSistema(
        $codigoAmbiente,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit
    ) {
        $response = $this->soapWrapper->call(
            'operaciones.cierreOperacionesSistema',
            [
                [
                    'SolicitudOperaciones' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoModalidad' => $codigoModalidad,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function cierrePuntoVenta(
        $codigoAmbiente,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit
    ) {
        $response = $this->soapWrapper->call(
            'operaciones.cierrePuntoVenta',
            [
                [
                    'SolicitudCierrePuntoVenta' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    
    public function consultaPuntoVenta($codigoAmbiente, $codigoSistema, $codigoSucursal, $cuis, $nit)
    {

        $response = $this->soapWrapper->call(
            'operaciones.consultaPuntoVenta',
            [
                [
                    'SolicitudConsultaPuntoVenta' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function registroPuntoVenta(
        $codigoAmbiente,
        $codigoModalidad,
        $codigoSistema,
        $codigoSucursal,
        $codigoTipoPuntoVenta,
        $cuis,
        $descripcion,
        $nit,
        $nombrePuntoVenta
    ) {

        $response = $this->soapWrapper->call(
            'operaciones.registroPuntoVenta',
            [
                [
                    'SolicitudRegistroPuntoVenta' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoModalidad' => $codigoModalidad,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'codigoTipoPuntoVenta' => $codigoTipoPuntoVenta,
                        'cuis' => $cuis,
                        'descripcion' => $descripcion,
                        'nit' => $nit,
                        'nombrePuntoVenta' => $nombrePuntoVenta

                    ]
                ]
            ]
        );

        return $response;
    }
    
    
    public function solicitudCuis(
        $codigoAmbiente,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $login,
        $nit,
        $password
    ) {
        $response = $this->soapWrapper->call(
            'operaciones.SolicitudCuis',
            [
                [
                    'SolicitudOperacionesCuis' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoModalidad' => $codigoModalidad,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema' => $codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'login' => $login,
                        'nit' => $nit,
                        'password' => $password
                    ]
                ]
            ]
        );

        return $response;
    }
    public function solicitudCuisMasivo(
        $codigoAmbiente,
        $codigoModalidad,
        $codigoSistema,
        $codigoPuntoVenta,
        $codigoSucursal,
        $login,
        $nit,
        $password
    ) {
        $response = $this->soapWrapper->call(
            'operaciones.SolicitudCuisMasivo',
            [
                [
                    'SolicitudCuisMasivoSistemas' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoModalidad' => $codigoModalidad,
                        'codigoSistema' => $codigoSistema,
                        'DatosSolicitud' => [
                            'codigoPuntoVenta' => $codigoPuntoVenta,
                            'codigoSucursal' => $codigoSucursal,
                        ],
                        'login' => $login,
                        'nit' => $nit,
                        'password' => $password
                    ]
                ]
            ]
        );

        return $response;
    }
    public function verificarComunicacion(){
        $response=$this->soapWrapper->call('operaciones.verificarComunicacion',[]);
        return $response;
    }
}
