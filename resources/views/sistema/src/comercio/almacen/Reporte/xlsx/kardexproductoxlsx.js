

import React from 'react';

import * as XLSX from 'xlsx';
import { cambiarFormato, convertYmdToDmy } from '../../../../utils/toolsDate';

const ImportarKardexProductoXLSX = ( { data = [], } ) => {

    function generateXLSX( ) {

        const wb = XLSX.utils.table_to_book( document.getElementById('kardexproducto_xlsx'),  {sheet:"Kardex Producto", raw : true, cellStyles: true, } );
        
        return XLSX.writeFile(wb, 'kardexproducto.xlsx', );       
    }
    let saldoStcok = 0;
    return (
        <>
            <div style={{ display: 'none', }}>
                <table id="kardexproducto_xlsx" border="1">
                    <tbody>
                        <tr>
                            <th colSpan ={8} style={{textAlign: 'center', fontWeight: 'bold', }}>
                                KARDEX PRODUCTO
                            </th>
                        </tr>
                        <tr>
                            <th>FECHA</th>
                            <th>TIPO TRANSACCIÓN</th>
                            <th>ID TRANSACCIÓN</th>
                            <th>ALMACÉN</th>
                            <th>COSTO UNITARIO</th>
                            <th>PRECIO UNITARIO</th>
                            <th>CANTIDAD</th>
                            <th>SALDO STOCK</th>
                        </tr>
                    </tbody>
                    <tbody>
                        { data.detalle.map(
                            ( obj, key ) => {
                                if ( obj.tipotransac == 'Venta' || obj.tipotransac == 'Salida' ) {
                                    saldoStcok = saldoStcok - obj.cantidad*1;
                                }
                                if ( obj.tipotransac == 'Compra' || obj.tipotransac == 'Ingreso' ) {
                                    saldoStcok = saldoStcok + obj.cantidad*1;
                                }
                                if ( obj.tipotransac == 'Traspaso' ) {
                                    if ( obj.idalmacen == obj.fkidalmacen_sale ) {
                                        saldoStcok = saldoStcok - obj.cantidad*1;
                                    } else {
                                        if ( obj.idalmacen == obj.fkidalmacen_entra ) {
                                            saldoStcok = saldoStcok + obj.cantidad*1;
                                        }
                                    }
                                }
                                return (
                                    <tr key={key}>
                                        <td> { obj.fechatransac } </td>
                                        <td> { obj.tipotransac } </td>
                                        <td> { obj.idtransac } </td>
                                        <td> { obj.almacen } </td>
                                        <td> { parseFloat(obj.costounit).toFixed(2) } </td>
                                        <td> { parseFloat(obj.preciounit).toFixed(2) } </td>
                                        <td> { obj.cantidad } </td>
                                        <td> { saldoStcok } </td>
                                    </tr>
                                );
                            }
                        ) }
                    </tbody>
                </table>
                <button id="buttonkardexproducto_xlsx"  onClick={(e) => generateXLSX() }>
                    Export
                </button>
            </div>
        </>
    );

};

export default ImportarKardexProductoXLSX;