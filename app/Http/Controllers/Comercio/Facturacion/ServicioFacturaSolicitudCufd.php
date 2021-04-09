<?php
namespace App\Http\Controllers\Comercio\Facturacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
class ServicioFacturaSolicitudCufd{
    protected $soapWrapper;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }
    public function solicitarCufd(
        $codigoAmbiente,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit
    ) {

        $response = $this->soapWrapper->call('solicitar.solicitudCufd', [[

            'SolicitudOperaciones' => [
                'codigoAmbiente' => $codigoAmbiente,
                'codigoModalidad' => $codigoModalidad,
                'codigoPuntoVenta' => $codigoPuntoVenta,
                'codigoSistema' => $codigoSistema,
                'codigoSucursal' => $codigoSucursal,
                'cuis' => $cuis,
                'nit' => $nit
            ]
        ]]);

        return $response;
    }
    public function verificarComunicacion(){
        $response=$this->soapWrapper->call('solicitar.verificarComunicacion',[]);
        return $response;
    }
}