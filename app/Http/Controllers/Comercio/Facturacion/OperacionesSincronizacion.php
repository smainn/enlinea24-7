<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;

class OperacionesSincronizacion
{
    protected $soapWrapper;
    protected $sincc;

    public function __construct($soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
        $this->sincc = new ServicioFacturaSincronizacion($soapWrapper);
    }
    public function recepcionSolicitudNuevoValorProducto(
        $codigoAmbiente,
        $codigoSistema,
        $codigoSucursal,
        $descripcion,
        $cuis,
        $nit
    ) {
        return $this->sincc->recepcionSolicitudNuevoValorProducto(
            $codigoAmbiente,
            $codigoSistema,
            $codigoSucursal,
            $descripcion,
            $cuis,
            $nit
        );
    }
    public function validacionSolicitudNuevoValorProducto(
        $codigoAmbiente,
        $codigoSistema,
        $codigoSolicitud,
        $codigoSucursal,
        $cuis,
        $nit
    ) {
        return $this->sincc->validacionSolicitudNuevoValorProducto(
            $codigoAmbiente,
            $codigoSistema,
            $codigoSolicitud,
            $codigoSucursal,
            $cuis,
            $nit
        );
    }
    public function seleccionar(
        $codigoAmbiente,
        $codigoAutorizacion,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit,
        $nombreSincronizacion
    ) {
        switch ($nombreSincronizacion) {
            case 'sincronizarActividades':
                return $this->sincc->sincronizarActividades(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarListaLeyendas':
                return $this->sincc->sincronizarListaLeyendasFactura(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case  'sincronizarListaMensajesServicios':
                return $this->sincc->sincronizarListaMensajesServicios(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarListaProductosServicios':
                return $this->sincc->sincronizarListaProductosServicios(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaEventosSignificativos':
                return $this->sincc->sincronizarParametricaEventosSignificativos(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaMotivoAnulacion':
                return $this->sincc->sincronizarParametricaMotivoAnulacion(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaPaisOrigen':
                return $this->sincc->sincronizarParametricaPaisOrigen(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoAmbiente':
                return $this->sincc->sincronizarParametricaTipoAmbiente(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoComponente':
                return $this->sincc->sincronizarParametricaTipoComponente(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoDepartamento':
                return $this->sincc->sincronizarParametricaTipoDepartamento(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoDocumentoFiscal':
                return $this->sincc->sincronizarParametricaTipoDocumentoFiscal(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParamatricaTipoDocumentoIdentidad':
                return $this->sincc->sincronizarParamatricaTipoDocumentoIdentidad(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoDocumentoSector':
                return $this->sincc->sincronizarParametricaTipoDocumentoSector(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoEmision':
                return $this->sincc->sincronizarParametricaTipoEmision(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoMetodoPago':
                return $this->sincc->sincronizarParametricaTipoMetodoPago(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoModalidad':
                return $this->sincc->sincronizarParametricaTipoModalidad(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoMoneda':
                return $this->sincc->sincronizarParametricaTipoMoneda(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaTipoPuntoVenta':
                return $this->sincc->sincronizarParametricaTipoPuntoVenta(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;
            case 'sincronizarParametricaUnidadMedida':
                return $this->sincc->sincronizarParametricaUnidadMedida(
                    $codigoAmbiente,
                    $codigoAutorizacion,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cuis,
                    $nit
                );
                break;

            default:
                return 'error';
                break;
        }
    }
}
