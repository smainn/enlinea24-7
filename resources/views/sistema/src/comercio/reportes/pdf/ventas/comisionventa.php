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
            font: bold 14px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
            font: 300 13px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
            <label style="font-size: 12px;"><?= $fecha.' '.$hora ?></label>
        </div>
    </div>

    <div style="width: 100%; text-align: center; margin-top: 5px;">
        <label style="font-size: 23px; font-weight: bold;">
            ** REPORTE DE COMISIONES POR <?= $cliente_abogado ?> **
        </label>
    </div>

    <?php 
        $id = 0; 
        $totalGeneral = 0;
        $comisionGeneral = 0;

        $totalCobrado = 0;
        $comisionCobrado = 0;

        $totalPorCobrar = 0;
        $comisionPorCobrar = 0;

        $subTotal = 0;
        $comisionSubTotal = 0;

        $subTotalCobrado = 0;
        $comisionSubTotalCobrado = 0;

        $subTotalPorcobrar = 0;
        $comisionSubTotalPorCobrar = 0;

        $bandera = 0;

    ?>

    <div style="width: 100%; padding: 5px;">
        <table class="table-report">
            <?php foreach ($comision as $c) { ?>
                <thead>

                    <?php if ($id != $c->idvendedor) { ?>
                        <?php if ($bandera == 1) { ?>
                            <tr>
                                <td colspan="4" style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                                    <strong>Total: </strong>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $subTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $comisionSubTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $subTotalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $comisionSubTotalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $subTotalPorcobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="text-align: right; font-weight: normal; padding-right: 8px; border-top: 2px solid black;">
                                    <?= number_format((float)round( $comisionSubTotalPorCobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 5px; border-bottom: 4px double black;" colspan="10"></td>
                            </tr>
                        <?php } 
                            $bandera = 1;
                            $subTotal = 0;
                            $comisionSubTotal = 0;
                            $subTotalCobrado = 0;
                            $comisionSubTotalCobrado = 0;
                            $subTotalPorcobrar = 0;
                            $comisionSubTotalPorCobrar = 0;
                        ?>
                        <tr>
                            <th colspan="3" 
                                style="border: 1px solid transparent; border-bottom: 1px solid #e8e8e8;
                                    padding-bottom: 20px; padding-top: 20px;">
                                <strong style="font-size: 14px;">
                                    Id <?= $cliente_abogado ?>: 
                                </strong>
                                <label style="font-size: 13px; font-weight: normal">
                                    <?= $c->idvendedor ?>
                                </label>
                            </th>
                            <th colspan="7" 
                                style="border: 1px solid transparent; border-bottom: 1pxsolid #e8e8e8;
                                    padding-bottom: 20px; padding-top: 20px;">
                                <strong style="font-size: 14px;">
                                    Nombre <?= $cliente_abogado ?>: 
                                </strong>
                                <label style="font-size: 13px; font-weight: normal">
                                    <?= ucwords($c->vendedor) ?>
                                </label>
                            </th>
                        </tr>

                        <tr>
                            <th colspan="3" class="show" style="border: 2px solid black;">
                                Venta
                            </th>
                            <th class="show" style="border: 2px solid black;">
                                Comision
                            </th>
                            <th colspan="2" class="show" style="border: 2px solid black;">
                                Total
                            </th>
                            <th colspan="2" class="show" style="border: 2px solid black;">
                                Cobro Acumulados
                            </th>
                            <th colspan="2" class="show" style="border: 2px solid black;">
                                Por Cobrar
                            </th>
                        </tr>

                        <tr>
                            <th style="text-align: center; border-left: 2px solid black;">
                                Id
                            </th>
                            <th style="text-align: center;">
                                Fecha
                            </th>
                            <th style="text-align: center;">
                                Cliente
                            </th>
                            <th style="text-align: center; border-left: 2px solid black;">
                                Asignado
                            </th>
                            <th style="text-align: center; border-left: 2px solid black;" >
                                Monto
                            </th>
                            <th style="text-align: center;">
                                Comisión
                            </th>
                            <th style="text-align: center; border-left: 2px solid black;" s>
                                Monto
                            </th>
                            <th style="text-align: center;">
                                Comisión
                            </th>
                            <th style="text-align: center; border-left: 2px solid black;">
                                Saldo
                            </th>
                            <th style="text-align: center; border-right: 2px solid black;">
                                Comisión
                            </th>
                        </tr>
                    <?php }?>
                    <tr>
                        <td style="font: 300 14px Roboto; border-left: 2px solid black;">
                            <?= $c->idventa ?>
                        </td>
                        <td style="font: 300 14px Roboto">
                            <?= date("d/m/Y", strtotime($c->fecha)) ?>
                        </td>
                        <td style="font: 300 14px Roboto">
                            <?= ucwords($c->cliente) ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: center; border-left: 2px solid black;">
                            <?= $c->comision.'%' ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right; border-left: 2px solid black;">
                            <?= number_format((float)round( $c->total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            <?php $totalGeneral += $c->total; ?>
                            <?php $subTotal += $c->total; ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right;">
                            <?= number_format((float)round( round((($c->comision / 100)*($c->total)), 2) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            <?php $comisionGeneral += round((($c->comision / 100)*($c->total)), 2) ?>
                            <?php $comisionSubTotal += round((($c->comision / 100)*($c->total)), 2) ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right; border-left: 2px solid black;">
                            <?= number_format((float)round( $c->cobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            <?php $totalCobrado += $c->cobrado; ?>
                            <?php $subTotalCobrado += $c->cobrado; ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right;">
                            <?= number_format((float)round( round((($c->comision / 100)*($c->cobrado)), 2) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            <?php $comisionCobrado += round((($c->comision / 100)*($c->cobrado)), 2) ?>
                            <?php $comisionSubTotalCobrado += round((($c->comision / 100)*($c->cobrado)), 2) ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right; border-left: 2px solid black;">
                            
                            <?= ($c->tipo == 2)?
                                number_format((float)round( ($c->total - $c->cobrado) ,2, PHP_ROUND_HALF_DOWN),2,'.',','):
                                number_format((float)round( 0 ,2, PHP_ROUND_HALF_DOWN),2,'.',',')
                            ?>

                            <?php $totalPorCobrar += ($c->tipo == 2)?($c->total - $c->cobrado):0; ?>
                            <?php $subTotalPorcobrar += ($c->tipo == 2)?($c->total - $c->cobrado):0; ?>
                        </td>
                        <td style="font: 300 14px Roboto; text-align: right; border-right: 2px solid black;">

                            <?= ($c->tipo == 2)?
                                number_format((float)round( round((($c->comision / 100)*($c->total - $c->cobrado)), 2) ,2, PHP_ROUND_HALF_DOWN),2,'.',','):
                                number_format((float)round( 0 ,2, PHP_ROUND_HALF_DOWN),2,'.',',')
                            ?>

                            <?php $comisionPorCobrar += ($c->tipo == 2)?round((($c->comision / 100)*($c->total - $c->cobrado)), 2):0; ?>
                            <?php $comisionSubTotalPorCobrar += ($c->tipo == 2)?round((($c->comision / 100)*($c->total - $c->cobrado)), 2):0; ?>
                        </td>
                    </tr>
                    <?php 
                        if ($id != $c->idvendedor) { 
                            $id = $c->idvendedor;
                        }
                    ?>
                </thead>
            <?php } ?>
            <thead>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <strong>Total: </strong>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $subTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $comisionSubTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $subTotalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $comisionSubTotalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $subTotalPorcobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; font-weight: normal; border-top: 2px solid black;">
                        <?= number_format((float)round( $comisionSubTotalPorCobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                </tr>
                <?php if ($idgrupo == 1 || $idgrupo == 2) { ?>
                    <tr>
                        <td colspan="4" style="text-align: right; font-weight: normal">
                            <strong>Total General: </strong>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $totalGeneral ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $comisionGeneral ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $totalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $comisionCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $totalPorCobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                        <td style="text-align: right; font-weight: normal">
                            <?= number_format((float)round( $comisionPorCobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </td>
                    </tr>
                <?php } ?>
            </thead>
        </table>
    </div>

    
</body>
</html>