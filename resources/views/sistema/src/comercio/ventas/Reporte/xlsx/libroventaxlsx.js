

import React from 'react';

import * as XLSX from 'xlsx';
import { cambiarFormato } from '../../../../utils/toolsDate';

const ImportarLibroVentaXLSX = ( { data = [], } ) => {

    function generateXLSX( ) {

        const wb = XLSX.utils.table_to_book( 
                document.getElementById('libroventa_xlsx'), 
                    {sheet:"Libro Venta", raw : true, cellStyles: true, } );
        
        return XLSX.writeFile(wb, 'libroventa.xlsx', );       
    }

    let importetotalventa = 0;
    let importeice_ie_otronoiva = 0;
    let exportoperacionextensas = 0;
    let ventagrabadatasacero = 0;
    let subtotal = 0;
    let descuentosbonificarebajasujetaiva = 0;
    let importebasecreditofiscal = 0;
    let debitofiscal = 0;


    return (
        <>
            <div style={{ display: 'none', }}>
                <table id="libroventa_xlsx" border="1">
                    <tbody>
                        <tr>
                            <th colSpan ={17} style={{textAlign: 'center', fontWeight: 'bold', }}>
                                LIBRO VENTA
                            </th>
                        </tr>
                        <tr>
                            <th>ESP</th>
                            <th>N°</th>
                            <th>FECHA DE LA FACTURA</th>
                            <th>N° DE FACTURA</th>
                            <th>N° DE AUTORIZACIÓN</th>
                            <th>ESTADO</th>
                            <th>NIT/CI CLIENTE</th>
                            <th>NOMBRE O RAZON SOCIAL</th>
                            <th>IMPORTE TOTAL DE VENTA</th>
                            <th>IMPORTE ICE / IEHD / IPJ / TASAS / OTROS NO SUJETOS AL IVA</th>
                            <th>EXPORTACIONES Y OPERACIONES EXTENSAS</th>
                            <th>VENTAS GRABADAS A TASA CERO</th>
                            <th>SUBTOTAL</th>
                            <th>DESCUENTOS, BONIFICACIONES Y REBAJAS SUJETAS A IVA</th>
                            <th>IMPORTE BASE PARA DEBITO FISCAL</th>
                            <th>DEBITO FISCAL</th>
                            <th>CÓDIGO CONTROL</th>
                        </tr>
                    </tbody>
                    <tbody>
                        { data.libroventa.map(
                            ( obj, key ) => {
                                importetotalventa += obj.importetotalventa * 1;
                                importeice_ie_otronoiva += obj.importeice_ie_otronoiva * 1;
                                exportoperacionextensas += obj.exportoperacionextensas * 1;
                                ventagrabadatasacero += obj.ventagrabadatasacero * 1;
                                subtotal += obj.subtotal * 1;
                                descuentosbonificarebajasujetaiva += obj.descuentosbonificarebajasujetaiva * 1;
                                importebasecreditofiscal += obj.importebasecreditofiscal * 1;
                                debitofiscal += obj.debitofiscal * 1;
                                return (
                                    <tr key={key}>
                                        <td> { obj.especificacion } </td>
                                        <td> { obj.nro } </td>
                                        <td> { cambiarFormato(obj.fechafactura) } </td>
                                        <td> { obj.nrofactura } </td>
                                        <td> { obj.nroautorizacion } </td>
                                        <td> { obj.estado } </td>
                                        <td> { obj.nitcliente == "0" ? "S/NIT" : obj.nitcliente } </td>
                                        <td> { obj.nombrerazonsocial } </td>
                                        <td> { parseFloat(obj.importetotalventa).toFixed(2) } </td>
                                        <td> { parseFloat(obj.importeice_ie_otronoiva).toFixed(2) } </td>
                                        <td> { parseFloat(obj.exportoperacionextensas).toFixed(2) } </td>
                                        <td> { parseFloat(obj.ventagrabadatasacero).toFixed(2) } </td>
                                        <td> { parseFloat(obj.subtotal).toFixed(2) } </td>
                                        <td> { parseFloat(obj.descuentosbonificarebajasujetaiva).toFixed(2) } </td>
                                        <td> { parseFloat(obj.importebasecreditofiscal).toFixed(2) } </td>
                                        <td> { parseFloat(obj.debitofiscal).toFixed(2) } </td>
                                        <td> { obj.codigocontrol } </td>
                                    </tr>
                                );
                            }
                        ) }
                        <tr>
                            <td colSpan={8}>Total:</td>
                            <td> { parseFloat(importetotalventa).toFixed(2) } </td>
                            <td> { parseFloat(importeice_ie_otronoiva).toFixed(2) } </td>
                            <td> { parseFloat(exportoperacionextensas).toFixed(2) } </td>
                            <td> { parseFloat(ventagrabadatasacero).toFixed(2) } </td>
                            <td> { parseFloat(subtotal).toFixed(2) } </td>
                            <td> { parseFloat(descuentosbonificarebajasujetaiva).toFixed(2) } </td>
                            <td> { parseFloat(importebasecreditofiscal).toFixed(2) } </td>
                            <td> { parseFloat(debitofiscal).toFixed(2) } </td>
                            <td> {  } </td>
                        </tr>
                    </tbody>
                </table>
                <button id="buttonlibroventa_xlsx"  onClick={(e) => generateXLSX() }>
                    Export
                </button>
            </div>
        </>
    );

};

export default ImportarLibroVentaXLSX;