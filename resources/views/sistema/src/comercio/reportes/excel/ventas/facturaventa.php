

<?php
    $mtoTotal = 0; 
?>

    <table>
        
        <thead>

            <tr>
                <th colspan="10" style="text-align: center; 
                    width: 20px; height: 27px; font-size: 16px;">
                    <strong>Reporte Factura Venta</strong>
                </th>
            </tr>
        
            <tr>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong> Nro Autorización </strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong> Código Control </strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong> Nro. Factura </strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong> Fecha </strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>ID Venta</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong> Cliente </strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong> Nit </strong>
                </th>

                <th style="width: 20px; height: 25px;
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        border-right: 1px solid #000000;
                        text-align: center; font-size: 13px;" 
                >
                    <strong> Mto. Total </strong>
                </th>

                <th style="width: 20px; height: 25px;
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        border-right: 1px solid #000000;
                        text-align: center; font-size: 13px;" 
                >
                    <strong> Estado </strong>
                </th>

                <th style="width: 20px; height: 25px;
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        border-right: 1px solid #000000;
                        text-align: center; font-size: 13px;" 
                >
                    <strong> Cont. Imp. </strong>
                </th>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($factura as $v) { ?>
                <tr>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->nroautorizacion ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->codigodecontrol ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->numero ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= date("d/m/Y", strtotime($v->fecha)) ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->idventa ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= ucwords($v->nombre) ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= $v->nit == 0 ? 'S/N' : $v->nit ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= number_format((float)round( $v->mtototalventa ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        <?php 
                            $mtoTotal += $v->mtototalventa;
                        ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= $v->estado == 'V' ? 'Activo' : 'Anulado' ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= $v->contadordelimpresion ?>
                    </td>
                    
                </tr>
                
            <?php } ?>
            
        </tbody>

        <tbody>
            <tr>
                <td colspan="10" style="height: 15px;"></td>
            </tr>
            <tr>

                <td style="height: 20px; text-align: left; font-size: 13px;" colspan="7">
                    <strong>Total: </strong>
                </td>

                <td style="height: 20px; text-align: right;">
                    <?= number_format((float)round( $mtoTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>

                <td colspan="2" style="text-align: right; padding-right: 5px;">
                            
                </td>

            </tr>
            <tr>
                <td colspan="10" style="height: 15px;"></td>
            </tr>
        </tbody>
    </table>
    