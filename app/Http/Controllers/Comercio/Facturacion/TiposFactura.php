<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use DOMDocument;
use SimpleXMLElement;

class TiposFactura
{


  public function __construct()
  {
  }

  public function facturaEstandar(
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
  ) {

    $xml1 = new DOMDocument('1.0', 'UTF-8');

    $facturaComp = $xml1->createElement("facturaComputarizadaEstandar");
    $facturaComp->setAttributeNS(
      // namespace
      'http://www.w3.org/2001/XMLSchema-instance',
      // attribute name including namespace prefix
      'xsi:noNamespaceSchemaLocation',
      // attribute value
      'facturaComputarizadaEstandar.xsd'
    );
    $cabezera = $xml1->createElement("cabecera");

    $nitEmisor1 = $xml1->createElement("nitEmisor");
    $nitEmisor1->nodeValue = $nitEmisor;
    $cabezera->appendChild($nitEmisor1);

    $numeroFactura1 = $xml1->createElement("numeroFactura");
    $numeroFactura1->nodeValue = $numeroFactura;
    $cabezera->appendChild($numeroFactura1);

    $cuf1 = $xml1->createElement("cuf");
    $cuf1->nodeValue = $cuf;
    $cabezera->appendChild($cuf1);

    $cufd1 = $xml1->createElement("cufd");
    $cufd1->nodeValue = $cufd;
    $cabezera->appendChild($cufd1);

    $codigosucursalElemento = $xml1->createElement("codigoSucursal");
    $codigosucursalElemento->nodeValue = $codigoSucursal;
    $cabezera->appendChild($codigosucursalElemento);

    $direccionElem = $xml1->createElement("direccion");
    $direccionElem->nodeValue = $direccion;
    $cabezera->appendChild($direccionElem);

    $codigoPuntoVentaElem = $xml1->createElement("codigoPuntoVenta");
    $codigoPuntoVentaElem->setAttribute("xsi:nil", "true");

    //$codigoPuntoVenta->setAttribute('nillable', 'true');
    //$codigoPuntoVenta->nodeValue =0;
    $cabezera->appendChild($codigoPuntoVentaElem);

    $fechaEmisionElem = $xml1->createElement("fechaEmision");
    $fechaEmisionElem->nodeValue = $fechaEmision;
    $cabezera->appendChild($fechaEmisionElem);

    $nombreRazonSocialElem = $xml1->createElement("nombreRazonSocial");
    $nombreRazonSocialElem->nodeValue = $nombreRazonSocial;
    $cabezera->appendChild($nombreRazonSocialElem);

    $codigoTipoDocumentoIdentidadElem = $xml1->createElement("codigoTipoDocumentoIdentidad");
    $codigoTipoDocumentoIdentidadElem->nodeValue = $codigoTipoDocumentoIdentidad;
    $cabezera->appendChild($codigoTipoDocumentoIdentidadElem);

    $numeroDocumentoElem = $xml1->createElement("numeroDocumento");
    $numeroDocumentoElem->nodeValue = $numeroDocumento;
    $cabezera->appendChild($numeroDocumentoElem);

    $complementoElem = $xml1->createElement("complemento");
    $complementoElem->setAttribute("xsi:nil", "true");
    $cabezera->appendChild($complementoElem);

    $codigoClienteElem = $xml1->createElement("codigoCliente");
    $codigoClienteElem->nodeValue = $codigoCliente;
    $cabezera->appendChild($codigoClienteElem);

    $codigoMetodoPagoElem = $xml1->createElement("codigoMetodoPago");
    $codigoMetodoPagoElem->nodeValue = $codigoMetodoPago;
    $cabezera->appendChild($codigoMetodoPagoElem);

    $numeroTarjetaElem = $xml1->createElement("numeroTarjeta");
    $numeroTarjetaElem->setAttribute("xsi:nil", "true");
    $cabezera->appendChild($numeroTarjetaElem);

    $montoTotalElem = $xml1->createElement("montoTotal");
    $montoTotalElem->nodeValue = $montoTotal;
    $cabezera->appendChild($montoTotalElem);

    $montoDescuentoElem = $xml1->createElement("montoDescuento");
    $montoDescuentoElem->setAttribute("xsi:nil", "true");
    $cabezera->appendChild($montoDescuentoElem);

    $codigoMonedaElem = $xml1->createElement("codigoMoneda");
    $codigoMonedaElem->nodeValue = $codigoMoneda;
    $cabezera->appendChild($codigoMonedaElem);

    $tipoCambioElem = $xml1->createElement("tipoCambio");
    $tipoCambioElem->nodeValue = $tipoCambio;
    $cabezera->appendChild($tipoCambioElem);

    $montoTotalMonedaElem = $xml1->createElement("montoTotalMoneda");
    $montoTotalMonedaElem->nodeValue = $montoTotalMoneda;
    $cabezera->appendChild($montoTotalMonedaElem);

    $leyendaElem = $xml1->createElement("leyenda");
    $leyendaElem->nodeValue = $leyenda;
    $cabezera->appendChild($leyendaElem);

    $usuarioElem = $xml1->createElement("usuario");
    $usuarioElem->nodeValue = $usuario;
    $cabezera->appendChild($usuarioElem);

    $codigoDocumentoSectorElem = $xml1->createElement("codigoDocumentoSector");
    $codigoDocumentoSectorElem->nodeValue = $codigoDocumentoSector;
    $cabezera->appendChild($codigoDocumentoSectorElem);

    $codigoExcepcionDocumentoElem = $xml1->createElement("codigoExcepcionDocumento");
    $codigoExcepcionDocumentoElem->setAttribute("xsi:nil", "true");
    $cabezera->appendChild($codigoExcepcionDocumentoElem);

    $facturaComp->appendChild($cabezera);

    


    for ($i = 0; $i < count($listaProductos); $i++) {
      $detalle = $xml1->createElement("detalle");
      $actividadEconomicaElem = $xml1->createElement("actividadEconomica");
      $actividadEconomicaElem->nodeValue = $actividadEconomica;
      $detalle->appendChild($actividadEconomicaElem);

      $codigoProductoSinElem = $xml1->createElement("codigoProductoSin");
      $codigoProductoSinElem->nodeValue = $listaProductos[$i]->codigoProductoSin;
      $detalle->appendChild($codigoProductoSinElem);

      $codigoProductoElem = $xml1->createElement("codigoProducto");
      $codigoProductoElem->nodeValue = $listaProductos[$i]->codigoProducto;
      $detalle->appendChild($codigoProductoElem);

      $descripcionElem = $xml1->createElement("descripcion");
      $descripcionElem->nodeValue = $listaProductos[$i]->descripcion;
      $detalle->appendChild($descripcionElem);

      $cantidadElem = $xml1->createElement("cantidad");
      $cantidadElem->nodeValue = $listaProductos[$i]->cantidad;
      $detalle->appendChild($cantidadElem);

      $unidadMedidaElem = $xml1->createElement("unidadMedida");
      $unidadMedidaElem->nodeValue = $listaProductos[$i]->unidadMedida;
      $detalle->appendChild($unidadMedidaElem);

      $precioUnitarioElem = $xml1->createElement("precioUnitario");
      $precioUnitarioElem->nodeValue = $listaProductos[$i]->precioUnitario;
      $detalle->appendChild($precioUnitarioElem);
      $montoDescuentoElem = $xml1->createElement("montoDescuento");
      $montoDescuentoElem->setAttribute("xsi:nil", "true");
      $detalle->appendChild($montoDescuentoElem);

      $subTotalElem = $xml1->createElement("subTotal");
      $subTotalElem->nodeValue = $listaProductos[$i]->subTotal;
      $detalle->appendChild($subTotalElem);

      $numeroSerieElem = $xml1->createElement("numeroSerie");
      $numeroSerieElem->setAttribute("xsi:nil", "true");
      $detalle->appendChild($numeroSerieElem);

      $numeroImeiElem = $xml1->createElement("numeroImei");
      $numeroImeiElem->setAttribute("xsi:nil", "true");
      $detalle->appendChild($numeroImeiElem);

      $facturaComp->appendChild($detalle);
    }
    
    $xml1->appendChild($facturaComp);

    $xml1->formatOutput = TRUE;
    //$xml1->schemaValidate('facturaComputarizadaEstandar.xsd');
    $xmlfinal = $xml1->saveXML();
    return $xmlfinal;


    $d = new DOMDocument('1.0', 'UTF-8');
    $d->loadXML('<?xml version="1.0" encoding="utf-8"?>
        <facturaComputarizadaEstandar xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="facturaComputarizadaEstandar.xsd">       
          <cabecera>       
            <nitEmisor></nitEmisor>       
            <numeroFactura>100</numeroFactura>       
            <cuf>B2AFA11610013351564D658EE50D2D2A4AA6B685</cuf>       
            <cufd>F00F840D939A5512913A06FC88ADEA84</cufd>       
            <codigoSucursal>0</codigoSucursal>       
            <direccion>Calle Juan Pablo II #54</direccion>       
            <codigoPuntoVenta xsi:nil="true" />       
            <fechaEmision>2019-07-26T11:00:12.208</fechaEmision>       
            <nombreRazonSocial>Pablo Mamani</nombreRazonSocial>       
            <codigoTipoDocumentoIdentidad>1</codigoTipoDocumentoIdentidad>        
            <numeroDocumento>1548971</numeroDocumento>       
            <complemento xsi:nil="true" />        
            <codigoCliente>PMamani</codigoCliente>       
            <codigoMetodoPago>2</codigoMetodoPago>      
           <numeroTarjeta xsi:nil="true"></numeroTarjeta>         
            <montoTotal>25</montoTotal>       
            <montoDescuento xsi:nil="true" />        
            <codigoMoneda>688</codigoMoneda>       
            <tipoCambio>1</tipoCambio>       
            <montoTotalMoneda>25</montoTotalMoneda>        
            <leyenda>Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.</leyenda>       
            <usuario>pperez</usuario>       
            <codigoDocumentoSector>1</codigoDocumentoSector>       
               <codigoExcepcionDocumento xsi:nil ="true"></codigoExcepcionDocumento>        
          </cabecera>        
          <detalle>        
            <actividadEconomica>620100</actividadEconomica>        
            <codigoProductoSin>83141</codigoProductoSin>       
            <codigoProducto>JN-131231</codigoProducto>        
            <descripcion>JUGO DE NARANJA EN VASO</descripcion>       
            <cantidad>10</cantidad>        
            <unidadMedida>58</unidadMedida>       
            <precioUnitario>2.5</precioUnitario>       
            <montoDescuento xsi:nil="true"/>  
            <subTotal>25</subTotal>       
            <numeroSerie xsi:nil="true"/>       
            <numeroImei xsi:nil="true"/>       
          </detalle>        
        </facturaComputarizadaEstandar>');

    $d->formatOutput = TRUE;
    $xmlfinal2 = $d->saveXML();
    return $xmlfinal2;
  }
}
