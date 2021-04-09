
<html>

<head>
    <style>
        * {
            box-sizing: border-box;
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
        .table-report thead tr th,
        .table-report thead tr td {
            padding: 8px;
            padding-left: 12px;
            font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            cursor: pointer;
        }
        .table-report tbody {
            width: 100%;
        }
        .table-report tbody tr th,
        .table-report tbody tr td {
            padding-left: 15px;
            padding-top: 8px;
            padding-right: 3px;
            padding-bottom: 5px;
            font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        }
    </style>

</head>

<body style="border: 1px solid #000000">
    <div style="width: 100%; padding: 5px;">
        <table class="table-report">
            <thead>
                <tr>
                    <th style="border-bottom: 1px dashed #000000">
                        <div style="width: 100%; text-align: center;">
                            <img src=<?php echo '.' . $logo ?> alt='none'
                                style="width: 100px; height: 40px;
                                    position: absolute; left: 20px;" />
                            <label style="font-size: 15px; letter-spacing: 5px;
                                display: block; margin-top: 15px; padding: 3px;"> 
                                RECIBO 
                            </label>
                        </div>
                    </th>
                    
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div style="width: 100%; text-align: center; position: relative; 
                                height: 20px; padding-top: 5px;">
                            <label style="position: absolute; left: 30px; top: 5px; font-size: 12px;"> 
                                <strong>Nro.</strong> &nbsp;
                                <label style="font-size: 11px;">
                                    <?= $cobro->idcobro ?>
                                </label>
                            </label>
                            <label style="font-size: 12px;"> 
                                <strong>Fecha:</strong> &nbsp;
                                <label style="font-size: 11px;">
                                    <?= date("d/m/Y", strtotime($cobro->fecha)) ?>
                                </label>
                            </label>
                            <label style="position: absolute; right: 40px; top: 5px;"> 
                                <strong>Monto:</strong> &nbsp;
                                <label style="font-size: 11px;">
                                    <?= number_format((float)round( $cobro->pago ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </label>
                            </label>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding-top: 5px;">
                        <div style="width: 100%; height: 20px; padding-top: 5px; 
                                position: relative; display: flex;">
                            <div style="width: 130px; text-align: right; padding: 5px">
                                <label style="font-size: 12px; font-weight: bold;">
                                    Recibimos de: 
                                </label>
                            </div>
                            <div style="margin-left: 160px; padding: 5px;">
                                <label style="font-size: 11px;">
                                    <?= ucwords($cobro->cliente) ?>
                                </label>
                            </div>
                        </div>
                        <div style="width: 100%; height: 20px; padding-top: 5px; 
                                position: relative; display: flex;">
                            <div style="width: 130px; text-align: right; padding: 5px;">
                                <label style="font-size: 12px; font-weight: bold;">
                                    La suma de: 
                                </label>
                            </div>
                            <div style="margin-left: 160px; padding: 5px;">
                                <label style="font-size: 11px;">
                                    <?php $decimal = (number_format($cobro->pago, 2, '.', '') * 100) % 100 ?>
                                    <?= ucwords($monto) ?> &nbsp; <?= ($decimal < 10)?$decimal.'0':$decimal ?>/100 <?= $cobro->moneda ?>
                                </label>
                            </div>
                        </div>
                        <div style="width: 100%; height: auto; padding-top: 5px;">
                            <div style="width: 130px; text-align: right; padding: 5px;">
                                <label style="font-size: 12px; font-weight: bold;">
                                    Concepto de: 
                                </label>
                            </div>

                            <div style="margin-top: -50px; width: 100%; padding-bottom: 15px; border-bottom: 1px dashed #000000;">

                                <?php foreach ($concepto as $c) { ?>
                                    <div style="margin-left: 160px; padding: 5px;">
                                        <label style="font-size: 11px;">
                                            Pago por transacción de Venta Nro.- 
                                                &nbsp;<?= $c->fkidventa ?> &nbsp; <?= $c->descripcion ?>
                                        </label>
                                    </div>
                                <?php } ?>
                            </div>

                            <div style="width: 100%; height: 20px; line-height: 24px; margin-top: 10px;">
                                <strong>Información de la transacción: </strong>
                            </div>
                            <div style="width: 100%; height: 20px; line-height: 25px; display: flex;">
                                <div style="width: 32%; padding: 5px;">
                                    <label style="font-size: 12px;">
                                        <strong>Total a Pagar:</strong> &nbsp; 
                                        <?= number_format((float)round( $cobro->mtototventa ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </label>
                                </div>
                                <div style="margin-left: 34%; width: 32%; padding: 5px;">
                                    <label style="font-size: 12px;">
                                        <strong>Pago acumulado:</strong> &nbsp; 
                                        <?= number_format((float)round( $cobro->mtototcobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </label>
                                </div>
                                <div style="margin-left: 68%; width: 32%; padding: 5px;">
                                    <label style="font-size: 12px;">
                                        <strong>Saldo a pagar:</strong> &nbsp; 
                                        <?= number_format((float)round( ($cobro->mtototventa - $cobro->mtototcobrado) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                    </label>
                                </div>
                            </div>
                            <div style="width: 100%; border-top: 1px dashed #000000; margin-top: 10px;"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!--<div style="border: 1px dashed #6E6E6E; margin-top: 10px;" ></div>-->
    </div>
    
    <div style="position: absolute; bottom: 80px; left: 0; width: 100%; 
            padding: 5px;">
        <div style="width: 100%; display: flex;">
            <div style="width: 48%; padding: 5px; text-align: center; position: relative;">
                <div style="width: 150px; border-top: 1px dashed #000000; margin: auto; height: 5px;"></div>
                <label style="font-size: 14px;">
                    Recibí conforme
                </label>
            </div>
            <div style="width: 48%; margin-left: 50%; padding: 5px; text-align: center; position: relative">
                <div style="width: 150px; border-top: 1px dashed #000000; margin: auto; height: 5px;"></div>
                <label style="font-size: 14px;">
                    Entregue conforme
                </label>
            </div>
        </div>
    </div>
    <div style="position: absolute; bottom: 10px; right: 10px">
        <label style="font-size: 12px;">
            Impreso por: <?= $usuario ?>, <?= $fecha ?>, <?= $hora ?>
        </label>
    </div>
</body>

</html>