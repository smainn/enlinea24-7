<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Enlinea24-7</title>
    <style>
        * {
            box-sizing: border-box;
            padding: 0;
        }
        .table-report {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
        }
        .table-report thead {
            width: 100%;
            background: #fff;
        }
        .table-report thead tr {
            width: 100%;
        }
        .table-report thead tr th,
        .table-report thead tr td {
            padding: 8px;
            padding-left: 5px;
            padding-right: 5px;
            font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            border: 1px solid #e8e8e8;
            cursor: pointer;
        }
        .table-report tbody {
            width: 100%;
        }
        .table-report tbody tr th,
        .table-report tbody tr td {
            padding-top: 5px;
            padding-right: 3px;
            padding-bottom: 5px;
            padding-left: 10px;
            font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            border: 1px solid #e8e8e8;
        }
        .table-report thead tr .show {
            border: 1px solid transparent;
            border-bottom: 1px solid #e8e8e8;
            border-top: 1px solid #e8e8e8;
            text-align: center;
        }
    </style>
</head>
<body>
    <div style="width: 100%; height: 30px;">
        <div style="float: left;">
            <img src=<?php echo '.' . $logo ?> alt='none' 
                style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
        </div>
        <div style="float: right;">
            <label style="font-size: 11px;"><?= $fecha.' '.$hora ?></label>
        </div>
    </div>

    <div style="width: 100%; text-align: center; margin-top: 5px;">
        <label style="font-size: 18px; font-weight: bold;">
            ** LIBRO DIARIO **
        </label>
    </div>
    <div style="width: 100%; text-align: left; margin-top: 16px; margin-bottom: 10px;">
        <?= $criterios ?>
    </div>
    <?php 
    $i = 0;
    $size = sizeof($reporte);
    while ($i < $size) {
    ?>
        <div style="width: 100%; padding: 5px;">
            <table class="table-report">
                <tbody>
                    <tr>
                        <th style="font-weight: bold;">
                            Tipo Comprobante
                        </th>
                        <th>
                            <?= $reporte[$i]->tipocomprobante ?>
                        </th>
                        <th style="font-weight: bold;">
                            Numero
                        </th>
                        <th style="text-align: right;">
                            <?= $reporte[$i]->numero ?>
                        </th>
                        <th style="font-weight: bold;">
                            Fecha
                        </th>
                        <th>
                            <?= date("d-m-Y", strtotime($reporte[$i]->fecha)) ?>
                        </th>
                        <th style="font-weight: bold;">
                            T.C.
                        </th>
                        <th style="text-align: right;">
                            <?= $reporte[$i]->tipocambio ?>
                        </th>
                    </tr>
                </tbody>
            </table>
            <table class="table-report">
                <tbody>
                    <tr>
                        <th style="font-weight: bold; width: 22%">
                            Moneda
                        </th>
                        <th style="width: 13%">
                            <?= $reporte[$i]->moneda ?>
                        </th>
                        <th style="font-weight: bold; width: 13.5%">
                            Referido a
                        </th>
                        <th>
                            <?= $reporte[$i]->referidoa ?>
                        </th>
                    </tr>
                </tbody>
            </table>
            <table class="table-report">
                <tbody>
                    <tr>
                        <th style="font-weight: bold; width: 22%">
                            Glosa
                        </th>
                        <th>
                            <?= $reporte[$i]->glosa ?>
                        </th>
                    </tr>
                </tbody>
            </table>
            <?php if ($reporte[$i]->fkidtipopago == 2) {?>
            <table class="table-report">
                <tbody>
                    <tr>
                        <th style="font-weight: bold;">
                            Banco
                        </th>
                        <th>
                            <?= $reporte[$i]->banco ?>
                        </th>
                        <th style="font-weight: bold;">
                            NroCheque
                        </th>
                        <th>
                            <?= $reporte[$i]->nrochequetarjeta ?>
                        </th>
                    </tr>
                </tbody>
            </table>
        <?php } ?>
        </div>

        <div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>

        <div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>
            <div style="width: 100%; padding: 5px; margin-top: 5px;">
                <table class="table-report">
                    <thead>
                        <tr>
                            <td style="width: 12%">Codigo</td>
                            <td>Cuenta</td>
                            <td>Glosa</td>
                            <td>Debe</td>
                            <td>Haber</td>
                            <td>Centro Costo</td>
                        </tr>
                    </thead>
                    <tbody>
                    <?php 
                    $idpiv = $reporte[$i]->idcomprobante;
                    $totaldebe = 0;
                    $totalhaber = 0;
                    while ($i < $size && $idpiv == $reporte[$i]->idcomprobante) {
                        $totaldebe += $reporte[$i]->debe;
                        $totalhaber += $reporte[$i]->haber;
                    ?>
                            <tr>
                                <th><?= $reporte[$i]->codigo ?></th>
                                <th><?= $reporte[$i]->cuenta ?></th>
                                <th><?= $reporte[$i]->glosamenor ?></th>
                                <th style="text-align: right;"><?= sprintf("%.2f", $reporte[$i]->debe); ?></th>
                                <th style="text-align: right;"><?= sprintf("%.2f", $reporte[$i]->haber); ?></th>
                                <th><?= $reporte[$i]->centrocosto ?></th>
                            </tr>
                    <?php
                    $i++;
                    }
                    ?>
                    <tr>
                        <th colspan='3' style="text-align: right; padding-right: 5px;">
                            Total
                        </th>
                        <th style="text-align: right;"><?= sprintf("%.2f", $totaldebe); ?></th>
                        <th style="text-align: right;"><?= sprintf("%.2f", $totalhaber); ?></th>
                        <th></th>
                    </tr>
                    </tbody>
                </table>
            </div>
        
        <!--<div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>-->
        <div style="width: 100%; border: 1px solid black; margin-top: 5px;"></div>
    <?php 
    }
    ?>
</body>
</html>