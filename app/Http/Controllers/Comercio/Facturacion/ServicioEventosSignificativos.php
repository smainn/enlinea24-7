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

class EventosSignificativos{
    public function __construct(SoapWrapper $soapWrapper)
    {
        $this->soapWrapper = $soapWrapper;
        $this->servicioFacturaCompEstandar = new ServicioFacturaCompEstandar($soapWrapper);
    }
}