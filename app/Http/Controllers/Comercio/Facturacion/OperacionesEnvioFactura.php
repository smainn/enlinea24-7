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

class OperacionesEnvioFactura
{
    protected $servicioFacturaCompEstandar;
    protected $soapWrapper;
    protected $tiposFactura;
    protected $operacionesEnvioPaquete;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
        $this->servicioFacturaCompEstandar = new ServicioFacturaCompEstandar($soapWrapper);
        $this->operacionesEnvioPaquete = new OperacionesEnvioPaquete($soapWrapper);
        $this->tiposFactura = new TiposFactura();
        $this->operacionesEnvioPaquete = new OperacionesEnvioPaquete($soapWrapper);
    }
    public function crearFacturaEstandaryEnviar(
        $listaProductos,
        $codigoAmbiente,
        $codigoDocumentoFiscal,
        $codigoEmision,
        $codigoModalidad,
        $codigoSistema,
        $cuis,
        $horaFechaSinc,
        $nitEmisor,
        $numeroFactura,
        $cuf,
        $cufd,
        $codigoSucursal,
        $direccion,
        $codigoPuntoVenta,
        $fechaEmision,
        $nombreRazonSocial,
        $codigoTipoDocumentoIdentidad,
        $numeroDocumento,
        $codigoCliente,
        $codigoMetodoPago,
        $montoTotal,
        $codigoMoneda,
        $tipoCambio,
        $montoTotalMoneda,
        $leyenda,
        $usuario,
        $codigoDocumentoSector,
        $actividadEconomica,
        $codigoProductoSin,
        $codigoProducto,
        $descripcion,
        $cantidad,
        $unidadMedida,
        $precioUnitario,
        $subTotal
    ) {
        $xmlfinal = $this->tiposFactura->facturaEstandar(
            $listaProductos,
            $nitEmisor,
            $numeroFactura,
            $cuf,
            $cufd,
            $codigoSucursal,
            $direccion,
            $codigoPuntoVenta,
            $fechaEmision,
            $nombreRazonSocial,
            $codigoTipoDocumentoIdentidad,
            $numeroDocumento,
            $codigoCliente,
            $codigoMetodoPago,
            $montoTotal,
            $codigoMoneda,
            $tipoCambio,
            $montoTotalMoneda,
            $leyenda,
            $usuario,
            $codigoDocumentoSector,
            $actividadEconomica,
            $codigoProductoSin,
            $codigoProducto,
            $descripcion,
            $cantidad,
            $unidadMedida,
            $precioUnitario,
            $subTotal
        );
        //dd($xmlfinal);
        $codificado = base64_encode($xmlfinal);
        $gzdata = gzencode($codificado);
        $archivofinal = base64_encode($gzdata);
        $hashArchivo = hash('sha256', $archivofinal);
       try {
        $recepcionFactura = $this->servicioFacturaCompEstandar->recepcionFacturaComputarizadaEstandar(
         
            $archivofinal,
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
            $hashArchivo,
            $nitEmisor
        );

        //dd($recepcionFactura);
        $codigoRecepcionFactura = json_decode(json_encode($recepcionFactura), true);
        $codigoRecepcionFactura1 = $codigoRecepcionFactura['RespuestaServicioFacturacion']['codigoRecepcion'];
        $codigoTransaccion = $codigoRecepcionFactura['RespuestaServicioFacturacion']['transaccion'];
        $codigoEstado = $codigoRecepcionFactura['RespuestaServicioFacturacion']['codigoEstado'];

        //dd($codigoRecepcionFactura);
        sleep(1);
        if ($codigoEstado == 901) {
            $validarFactura = $this->servicioFacturaCompEstandar->validacionRecepcionFacturaComputarizadaEstandar(
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                $codigoPuntoVenta,
                $codigoRecepcionFactura1,
                $codigoSistema,
                $codigoSucursal,
                $cufd,
                $cuis,
                $nitEmisor
            );
            $codigovalidarFactura = json_decode(json_encode($validarFactura), true);
            $codigoRecepcionValidar = $codigovalidarFactura['RespuestaServicioFacturacion']['codigoRecepcion'];
            $codigoTransaccion = $codigovalidarFactura['RespuestaServicioFacturacion']['transaccion'];
            $codigoEstado = $codigovalidarFactura['RespuestaServicioFacturacion']['codigoEstado'];
            if ($codigoEstado == 908) {
                //return $codigovalidarFactura;
                return true;
            } else {
                $listaCodigosRespuestas = $codigovalidarFactura['RespuestaServicioFacturacion']['listaCodigosRespuestas'];
                if (is_array($listaCodigosRespuestas)) {
                    return $listaCodigosRespuestas;
                } else {
                    return $listaCodigosRespuestas;
                }
            }
        } else {
            $listaCodigosRespuestas = $codigoRecepcionFactura['RespuestaServicioFacturacion']['listaCodigosRespuestas'];
            if (is_array($listaCodigosRespuestas)) {
                return $listaCodigosRespuestas;
            } else {
                return $listaCodigosRespuestas;
            }
        }
       } catch (\Throwable $th) {
           //return false;
           $this->operacionesEnvioPaquete->creacionFacturaOffline($codificado);
           return false;
       }
        
    }
}
