
<html>

    <table>
        
        <thead>

            <tr>
                <th colspan="9" style="text-align: center; 
                    width: 20px; height: 27px; font-size: 16px;">
                    <strong>Libro Mayor</strong>
                </th>
            </tr>
        
        </thead>
            
    </table>

    
    <?php $posicion = 0; ?>

    <?php $debe = 0; ?>
    <?php $haber = 0; ?>
    <?php $saldo = 0; ?>

    <?php while ($posicion < sizeof($libro_mayor)) { ?>

        <?php $libro = $libro_mayor[$posicion]; ?>

        <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>

            <table>
        
                <thead>

                    <tr>
                        <th colspan="2" style="text-align: center; 
                            width: 20px; height: 27px; font-size: 14px;">
                            <strong>Cod Cuenta</strong>
                        </th>

                        <th colspan="2" style="text-align: center; 
                            width: 20px; height: 27px; font-size: 12px;">
                            <?= $libro->codcuenta ?>
                        </th>

                        <th colspan="2" style="text-align: center; 
                            width: 20px; height: 27px; font-size: 14px;">
                            <strong>Cuenta</strong>
                        </th>

                        <th colspan="2" style="text-align: center; 
                            width: 20px; height: 27px; font-size: 12px;">
                            <?= $libro->nombre ?>
                        </th>

                        <th style="text-align: center; 
                            width: 20px; height: 27px; font-size: 12px;">
                        </th>

                    </tr>
                
                </thead>
                    
            </table>

            <table>
        
                <thead>

                    <tr>
                        <th colspan="8" style="text-align: right; 
                            width: 20px; height: 27px; font-size: 15px;">
                            <strong>Saldo anterior: </strong>
                        </th>

                        <th colspan="1" style="text-align: right; 
                            width: 20px; height: 27px; font-size: 14px;">
                            <?= number_format((float)round( $libro->saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </th>
                    </tr>
                
                </thead>
                    
            </table>

        <?php } ?>

        <?php $posicion = $posicion + 1; ?>

        <?php if ($posicion < sizeof($libro_mayor)) { ?>
            
            <?php $libro = $libro_mayor[$posicion]; ?>
            <?php $bandera = true; ?>

            <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>
            <?php } else { ?>

                <table>
        
                    <thead>

                        <tr>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Fecha </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Tipo </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Numero </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Glosa </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Concepto </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Cheque </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Debe </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Haber </strong>
                            </th>

                            <th style="text-align: center; 
                                width: 20px; height: 27px; font-size: 14px;">
                                <strong>Saldo </strong>
                            </th>

                        </tr>
                    
                    </thead>

                    <tbody>

                        <?php while (($posicion < sizeof($libro_mayor)) && ($bandera)) { ?>

                            <?php $libro = $libro_mayor[$posicion]; ?>

                            <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>

                                <?php $bandera = false; ?>

                            <?php }else { ?>
                                <tr>

                                    <td style="height: 20px; text-align: center;">
                                        <?= date("d/m/Y", strtotime($libro->fecha)) ?>
                                    </td>

                                    <td style="height: 20px; text-align: center;">
                                        <?= $libro->tipo ?>
                                    </td>

                                    <td style="height: 20px; text-align: center;">
                                        <?= $libro->numero ?>
                                    </td>

                                    <td style="height: 20px; text-align: center;">
                                        <?= $libro->glosa ?>
                                    </td>

                                    <td style="height: 20px; text-align: center;">
                                        <?= $libro->concepto ?>
                                    </td>

                                    <td style="height: 20px; text-align: center;">
                                        <?= $libro->cheque ?>
                                    </td>

                                    <td style="height: 20px; text-align: right;">
                                        <?= number_format((float)round( $libro->debe ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </td>

                                    <td style="height: 20px; text-align: right;">
                                        <?= number_format((float)round( $libro->haber ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </td>

                                    <td style="height: 20px; text-align: right;">
                                        <?= number_format((float)round( $libro->saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </td>

                                </tr>

                                <?php $posicion = $posicion + 1; ?>

                                <?php $debe = $debe + $libro->debe; ?>
                                <?php $haber = $haber + $libro->haber; ?>
                                <?php $saldo = $libro->saldo; ?>

                            <?php }?>

                        <?php }?>

                        <tr>

                            <td colspan="6" style="height: 20px; text-align: right;">
                                Total
                            </td>

                            <td style="height: 20px; text-align: right;">
                                <?= number_format((float)round( $debe ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            </td>

                            <td style="height: 20px; text-align: right;">
                                <?= number_format((float)round( $haber ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            </td>

                            <td style="height: 20px; text-align: right;">
                                -
                            </td>
                            
                        </tr>

                        <tr>

                            <td colspan="6" style="height: 20px; text-align: right;">
                                Saldo <?= ($saldo > 0)?'Acreedor':'Deudor' ?>
                            </td>

                            <td style="height: 20px; text-align: right;">
                                <?= ($saldo < 0)?
                                    number_format((float)round( $saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',','):
                                    '-' 
                                ?>
                            </td>

                            <td style="height: 20px; text-align: right;">
                                <?= ($saldo > 0)?
                                    number_format((float)round( $saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',','):'-' 
                                ?>
                            </td>

                            <td style="height: 20px; text-align: right;">
                                -
                            </td>
                            
                        </tr>

                    </tbody>
                        
                </table>

                <?php } ?>

        <?php } ?>

        <?php $debe = 0; ?>
        <?php $haber = 0; ?>
        <?php $saldo = 0; ?>

    <?php }?>

</html>
