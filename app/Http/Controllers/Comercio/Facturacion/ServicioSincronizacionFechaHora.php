<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DateTime;
use DOMDocument;

use DateTimeZone;
use SimpleXMLElement;

class ServicioSincronizacionFechaHora
{
    protected $soapWrapper;
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
    }
 
    public function sincronizarFechaHora(
        $codigoAmbiente,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit
    ) {
        try {
            $response = $this->soapWrapper->call(
                'sincronizar.sincronizarFechaHora',
                [
                    [
                        'SolicitudSincronizacion' => [
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
            $response = json_decode(json_encode($response), true);
            $response = $response['RespuestaFechaHora']['fechaHora'];

            $response = new DateTime($response);
            //$response->modify('+1 day');
            $response = $response->format("Y-m-d H:i:s.v");
            $response = str_replace(" ", "T", $response);
            return $response;
        } catch (\Throwable $th) {
            $now = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''));
            $now->setTimeZone(new DateTimeZone('America/La_Paz'));
            $response = $now->format('Y-m-d H:i:s.v');
            $response = str_replace(" ", "T", $response);
            return $response;
        }
    }
    public function sincronizarFechaHora1(
        $codigoAmbiente,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cuis,
        $nit
    ) {
        try {
            $response = $this->soapWrapper->call(
                'sincronizar.sincronizarFechaHora',
                [
                    [
                        'SolicitudSincronizacion' => [
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
            $response = json_decode(json_encode($response), true);
            $response = $response['RespuestaFechaHora']['fechaHora'];
            $response = new DateTime($response);
            $response->modify('-1 day');
            $response = $response->format("Y-m-d H:i:s.v");

            $response = str_replace(" ", "T", $response);
            return $response;
        } catch (\Throwable $th) {
            $now = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''));
            $now->setTimeZone(new DateTimeZone('America/La_Paz'));
            $response = $now->format('Y-m-d H:i:s.v');
            $response = str_replace(" ", "T", $response);
            return $response;
        }
    }
    public function verificarComunicacion1()
    {
        $response = $this->soapWrapper->call(
            'sincronizar.verificarComunicacion',
            []
        );
        return $response;
    }
}
