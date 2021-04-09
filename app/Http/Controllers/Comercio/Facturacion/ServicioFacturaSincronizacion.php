<?php

namespace App\Http\Controllers\Comercio\Facturacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
class ServicioFacturaSincronizacion 
{
    protected $soapWrapper;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }


    public function recepcionSolicitudNuevoValorProducto($codigoAmbiente,$codigoSistema,
    $codigoSucursal,$descripcion,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.recepcionSolicitudNuevoValorProducto',
            [
                [
                    'SolicitudValorNuevo' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'descripcion'=>$descripcion,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
  
    public function sincronizarActividades($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,
    $codigoSistema,$codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarActividades',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarListaLeyendasFactura($codigoAmbiente,$codigoAutorizacion,
    $codigoPuntoVenta,$codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarListaLeyendasFactura',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function sincronizarListaMensajesServicios($codigoAmbiente,$codigoAutorizacion,
    $codigoPuntoVenta,$codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarListaMensajesServicios',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function sincronizarListaProductosServicios($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarListaProductosServicios',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaEventosSignificativos($codigoAmbiente,$codigoAutorizacion,
    $codigoPuntoVenta,$codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaEventosSignificativos',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function sincronizarParametricaMotivoAnulacion($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaMotivoAnulacion',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaPaisOrigen($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaPaisOrigen',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoAmbiente($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoAmbiente',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoComponente($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoComponente',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoDepartamento($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoDepartamento',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoDocumentoFiscal($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoDocumentoFiscal',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParamatricaTipoDocumentoIdentidad($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoDocumentoIdentidad',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoDocumentoSector($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoDocumentoSector',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoEmision($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoEmision',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoMetodoPago($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoMetodoPago',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoModalidad($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,$codigoSistema,
    $codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoModalidad',
            [
                [
                    'SolicitudSincronizacion' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoAutorizacion' => $codigoAutorizacion,
                        'codigoPuntoVenta' => $codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function sincronizarParametricaTipoMoneda($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,
    $codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoMoneda',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function sincronizarParametricaTipoPuntoVenta($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,
    $codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaTipoPuntoVenta',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function sincronizarParametricaUnidadMedida($codigoAmbiente,$codigoAutorizacion,$codigoPuntoVenta,
    $codigoSistema,$codigoSucursal,$cuis,$nit){
        $response=$this->soapWrapper->call(
            'sincronizacion.sincronizarParametricaUnidadMedida',
            [
                [
                    'SolicitudSincronizacion'=>[
                        'codigoAmbiente'=>$codigoAmbiente,
                        'codigoAutorizacion'=>$codigoAutorizacion,
                        'codigoPuntoVenta'=>$codigoPuntoVenta,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSucursal'=>$codigoSucursal,
                        'cuis'=>$cuis,
                        'nit'=>$nit
                    ]
                ]
            ]
        );
        return $response;
    }
    public function validacionSolicitudNuevoValorProducto($codigoAmbiente,$codigoSistema,
    $codigoSolicitud,$codigoSucursal,$cuis,$nit){
        $response = $this->soapWrapper->call(
            'sincronizacion.validacionSolicitudNuevoValorProducto',
            [
                [
                    'SolicitudValidacionValor' => [
                        'codigoAmbiente' => $codigoAmbiente,
                        'codigoSistema'=>$codigoSistema,
                        'codigoSolicitud' => $codigoSolicitud,
                        'codigoSucursal' => $codigoSucursal,
                        'cuis' => $cuis,
                        'nit' => $nit
                    ]
                ]
            ]
        );

        return $response;
    }
    public function verificarComunicacion(){
        $response=$this->soapWrapper->call('sincronizacion.verificarComunicacion',[]);
        return $response;
    }
    
}