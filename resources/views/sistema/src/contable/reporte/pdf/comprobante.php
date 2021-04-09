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
            ** Comprobante <?php echo $comprobante[0]->tipocomprobante ?> **
        </label>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 30px;">
       
    </div>
    
    <div style="width: 100%; padding: 5px; marginTop: 500px;">
        <table class="table-report">
            <tbody>
                <tr>
                    <th style="font-weight: bold;">
                        Tipo Comprobante
                    </th>
                    <th>
                        <?php echo $comprobante[0]->tipocomprobante ?>
                    </th>
                    <th style="font-weight: bold;">
                        Numero
                    </th>
                    <th style="text-align: right;">
                        <?= $comprobante[0]->numero ?>
                    </th>
                    <th style="font-weight: bold;">
                        Fecha
                    </th>
                    <th>
                        <?= date("d-m-Y", strtotime($comprobante[0]->fecha)) ?>
                    </th>
                    <th style="font-weight: bold;">
                        T.C.
                    </th>
                    <th style="text-align: right;">
                        <?= sprintf("%.2f", $comprobante[0]->tipocambio);  ?>
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
                        <?= $comprobante[0]->moneda ?>
                    </th>
                    <th style="font-weight: bold; width: 13.5%">
                        Referido a
                    </th>
                    <th>
                        <?= $comprobante[0]->referidoa ?>
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
                        <?= $comprobante[0]->glosa ?>
                    </th>
                </tr>
            </tbody>
        </table>
        <?php if ($comprobante[0]->fkidtipopago == 2) {?>
            <table class="table-report">
                <tbody>
                    <tr>
                        <th style="font-weight: bold;">
                            Banco
                        </th>
                        <th>
                            <?= $comprobante[0]->banco ?>
                        </th>
                        <th style="font-weight: bold;">
                            NroCheque
                        </th>
                        <th>
                            <?= $comprobante[0]->nrochequetarjeta ?>
                        </th>
                    </tr>
                </tbody>
            </table>
        <?php } ?>
    </div>

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
                $totaldebe = 0;
                $totalhaber = 0;
                foreach ($comprobante as $row) {
                    $totaldebe += $row->debe;
                    $totalhaber += $row->haber;
                ?>
                    <tr>
                        <th><?= $row->codigo ?></th>
                        <th><?= $row->cuenta ?></th>
                        <th><?= $row->glosamenor ?></th>
                        <th style="text-align: right;"><?= sprintf("%.2f", $row->debe);?></th>
                        <th style="text-align: right;"><?= sprintf("%.2f", $row->haber); ?></th>
                        <th><?= $row->centrocosto ?></th>
                    </tr>
                <?php
                }
            ?>
            <tr>
                <th colspan='3' style="text-align: right; padding-right: 5px;">
                    Total
                </th>
                <th style="text-align: right;"><?= sprintf("%.2f", $totaldebe); ?></div></th>
                <th style="text-align: right;"><?= sprintf("%.2f", $totalhaber); ?></th>
                <th></th>
            </tr>
            </tbody>
        </table>
    </div>

    <div style="width: 700px; height: 150px;">
        <?php if ($comprobante[0]->firmaa != null) { ?>
        <div style="width: 350px; height: 150px; border: 1px solid black; position: absolute;">
            <label style="position: absolute; margin-top: 80px; margin-left: 100px;">- - - - - - - - - - - - - - - - -</label>
            <label style="position: absolute; margin-top: 100px; margin-left: 150px; font-size: 12px;"><?php echo $comprobante[0]->firmaa  ?></label>
        </div>
        <?php } ?>
        <?php if ($comprobante[0]->firmab != null) { ?>
        <div style="width: 350px; height: 150px; border: 1px solid black; margin-left: 350px; position: absolute">
            <label style="position: absolute; margin-top: 80px; margin-left: 100px;">- - - - - - - - - - - - - - - - -</label>
            <label style="position: absolute; margin-top: 100px; margin-left: 150px; font-size: 12px;"><?php echo $comprobante[0]->firmab  ?></label>
        </div>
        <?php } ?>
    </div>
    <div style="width: 700px; height: 150px;">
        <?php if ($comprobante[0]->firmac != null) { ?>
        <div style="width: 350px; height: 150px; border: 1px solid black; position: absolute">
            <label style="position: absolute; margin-top: 80px; margin-left: 100px;">- - - - - - - - - - - - - - - - -</label>
            <label style="position: absolute; margin-top: 100px; margin-left: 150px; font-size: 12px;"><?php echo $comprobante[0]->firmac  ?></label>
        </div>
        <?php } ?>
        <?php if ($comprobante[0]->firmad != null) { ?>
        <div style="width: 350px; height: 150px; border: 1px solid black; margin-left: 350px; position: absolute">
            <label style="position: absolute; margin-top: 80px; margin-left: 100px;">- - - - - - - - - - - - - - - - -</label>
            <label style="position: absolute; margin-top: 100px; margin-left: 150px; font-size: 8px;"><?php echo $comprobante[0]->firmad  ?></label>
        </div>
        <?php } ?>
    </div>             
    <!--<div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>-->
    <!--<div style="width: 100%; border: 1px solid black; margin-top: 5px;"></div>-->

</body>
</html>