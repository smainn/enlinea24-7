
<!DOCTYPE html>

<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Enlinea24-7</title>

        <style>
            .table-report {
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                padding-top: 5px;
            }
            .table-report thead {
                width: 100%;
                background: #fff;
                border: 1px solid #D2D2D2;
            }
            .table-report thead tr th,
            .table-report thead tr td {
                padding: 8px;
                padding-left: 12px;
                border-right: 1px solid #D2D2D2;
                font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                cursor: pointer;
            }
            .table-report tbody {
                width: 100%;
            }
            .table-report tbody tr th,
            .table-report tbody tr td {
                border: 1px solid #D2D2D2;
                padding-left: 15px;
                padding-top: 8px;
                padding-right: 3px;
                padding-bottom: 5px;
                font: bold 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
            .table-report tbody tr .txt-right,
            .table-report thead tr .txt-right {
                text-align: right; 
                padding-right: 8px;
            }
            .table-report tbody tr .txt_tr {
                font: 300 10px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
        </style>

    </head>
    <body>

        <div style="width: 100%; height: 30px;">
            <div style="float: left;">
                <img src=<?php echo '.' . $logo ?> alt='none'  style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
            </div>
            <div style="float: right; display: block; width: 40px; margin-top: -15px; text-align: center;">
                <div style="font-size: 10px;"><?= $fecha ?></div>
                <div style="font-size: 10px;"><?= $hora ?></div>
            </div>
        </div>

        <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px;">
            <label style="font-size: 13px; font-weight: bold;">
                ** REPORTE PAGOS REALIZADOS **
            </label>
        </div>

        <?php
            $mtoTotalPago = 0; $mtoTotalPagar = 0; 
        ?>

        <div style="width: 100%; min-width: 100%; max-width: 100%;">
            <table class="table-report" style="margin-bottom: 15px;">
                <tbody>
                    <tr>
                        <th> IDPAGO         </th>
                        <th> FECHA PAGO     </th>
                        <th> PROVEEDOR      </th>
                        <th> IDCOMPRA       </th>
                        <th> FECHA A PAGAR  </th>
                        <th> CUOTA          </th>
                        <th> MTO PAGADO     </th>
                        <th> MTO A PAGAR    </th>
                        
                    </tr>
                </tbody>
                <tbody>
                    <?php foreach ( $pago as $pag ) { ?>
                        <tr>
                            <td class="txt_tr">
                                <?= $pag->idpagos ?>
                            </td>
                            <td class="txt_tr">
                                <?= date("d/m/Y", strtotime($pag->fechapago)) ?>
                            </td>
                            <td class="txt_tr">
                                <?= ucwords($pag->proveedor) ?>
                            </td>
                            <td class="txt_tr">
                                <?= $pag->idcompra ?>
                            </td>
                            <td class="txt_tr">
                                <?= date("d/m/Y", strtotime($pag->fechadepago)) ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?= ucwords($pag->descripcion) ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?=  number_format((float)round( $pag->montopagado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                <?php 
                                    $mtoTotalPago += $pag->montopagado;
                                ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?=  number_format((float)round( $pag->montoapagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                <?php 
                                    $mtoTotalPagar += $pag->montoapagar;
                                ?>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
                <tbody>
                    <tr>
                        <td class="txt_tr" colspan="6" style="text-align: right; padding-right: 5px; font-weight: bold;">
                            TOTALES: 
                        </td>
                        <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                            <?= number_format((float)round( $mtoTotalPago ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                            <?= number_format((float)round( $mtoTotalPagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </body>
</html>