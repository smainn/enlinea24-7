
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
                font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
                ** REPORTE DE PROVEEDOR **
            </label>
        </div>

        <?php
            $mtoTotalPagar = 0;
        ?>

        <div style="width: 100%; min-width: 100%; max-width: 100%;">
            <table class="table-report" style="margin-bottom: 15px;">
                <tbody>
                    <tr>
                        <th> ID     </th>
                        <th> NOMBRE   </th>
                        <th> NIT       </th>
                        <th> CIUDAD </th>

                        <?php if (sizeof($referenciacontacto) > 0) { ?>
                            <th>
                                <?=$referenciacontacto[0]->descripcion ?>
                            </th>
                        <?php } ?>

                        <?php if (sizeof($referenciacontacto) > 1) { ?>
                            <th>
                                <?=$referenciacontacto[1]->descripcion ?>
                            </th>
                        <?php } ?>

                        <?php if (sizeof($referenciacontacto) > 2) { ?>
                            <th>
                                <?=$referenciacontacto[2]->descripcion ?>
                            </th>
                        <?php } ?>
                        
                    </tr>
                </tbody>
                <tbody>
                    <?php foreach ( $proveedor as $prov ) { ?>
                        <tr>
                            <td class="txt_tr">
                                <?= $prov->idproveedor ?>
                            </td>
                            <td class="txt_tr">
                                <?= ucwords($prov->proveedor) ?>
                            </td>
                            <td class="txt_tr">
                                <?= $prov->nit == null ? '' : $prov->nit ?>
                            </td>
                            <td class="txt_tr">
                                <?= $prov->ciudad == null ? '' : $prov->ciudad ?>
                            </td>

                            <?php if (sizeof($referenciacontacto) > 0) { ?>
                                <td class="txt_tr">
                                    <?= $prov->valor1 == null ? '' : $prov->valor1 ?>
                                </td>
                            <?php } ?>

                            <?php if (sizeof($referenciacontacto) > 1) { ?>
                                <td class="txt_tr">
                                    <?= $prov->valor2 == null ? '' : $prov->valor2 ?>
                                </td>
                            <?php } ?>

                            <?php if (sizeof($referenciacontacto) > 2) { ?>
                                <td class="txt_tr">
                                    <?= $prov->valor3 == null ? '' : $prov->valor3 ?>
                                </td>
                            <?php } ?>

                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
        
    </body>
</html>