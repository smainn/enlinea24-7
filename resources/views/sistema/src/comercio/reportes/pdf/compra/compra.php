
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
                font: bold 10px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
            .table-report tbody tr .txt-right,
            .table-report thead tr .txt-right {
                text-align: right; 
                padding-right: 8px;
            }
            .table-report tbody tr .txt_tr {
                font: 300 8px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
                ** REPORTE DE COMPRAS **
            </label>
        </div>

        <?php
            $mtoTotal = 0; $mtoPagado = 0; $saldoPagar = 0;
        ?>

        <div style="width: 100%; min-width: 100%; max-width: 100%;">
            <table class="table-report" style="margin-bottom: 15px;">
                <tbody>
                    <tr>
                        <th> ID              </th>
                        <th> Fecha           </th>
                        <th> Proveedor       </th>
                        <th> Tipo            </th>
                        <th> Almacen         </th>
                        <th> Mto Total       </th>
                        <th> Mto Pagado      </th>
                        <th> Saldo por Pagar </th>
                        
                    </tr>
                </tbody>
                <tbody>
                    <?php foreach ( $compra as $comp ) { ?>
                        <tr>
                            <td class="txt_tr">
                                <?= $comp->idcompra ?>
                            </td>
                            <td class="txt_tr">
                                <?= date("d/m/Y", strtotime($comp->fecha)) ?>
                            </td>
                            <td class="txt_tr">
                                <?= ucwords($comp->proveedor) ?>
                            </td>
                            <td class="txt_tr">
                                <?= $comp->tipo == 'C' ? 'Contado' : 'Credito' ?>
                            </td>
                            <td class="txt_tr">
                                <?= ucwords($comp->almacen) ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?= number_format((float)round( $comp->mtototcompra ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                <?php 
                                    $mtoTotal += $comp->mtototcompra;
                                ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?= $comp->tipo == 'C' ? 
                                    number_format((float)round( $comp->mtototcompra ,2, PHP_ROUND_HALF_DOWN),2,'.',',') : 
                                    number_format((float)round( $comp->mtototpagado ,2, PHP_ROUND_HALF_DOWN),2,'.',',')
                                ?>
                                <?php 
                                    $mtoPagado += ( $comp->tipo == 'C' ? $comp->mtototcompra : $comp->mtototpagado );
                                ?>
                            </td>
                            <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                                <?= $comp->tipo == 'C' ? 
                                    number_format((float)round( 0 ,2, PHP_ROUND_HALF_DOWN),2,'.',',') : 
                                    number_format((float)round( $comp->mtototcompra - $comp->mtototpagado ,2, PHP_ROUND_HALF_DOWN),2,'.',',')
                                ?>
                                <?php 
                                    $saldoPagar += ( $comp->tipo == 'C' ? 0 : ($comp->mtototcompra - $comp->mtototpagado) );
                                ?>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
                <tbody>
                    <tr>
                        <td class="txt_tr" colspan="5" style="text-align: right; padding-right: 5px; font-weight: bold;">
                            Totales: 
                        </td>
                        <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                            <?= number_format((float)round( $mtoTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                            <?= number_format((float)round( $mtoPagado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td class="txt_tr" style="text-align: right; padding-right: 5px;">
                            <?= number_format((float)round( $saldoPagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </body>
</html>