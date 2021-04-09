
<html>
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
            font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        }
        .table-report tbody tr .txt-right,
        .table-report thead tr .txt-right {
            text-align: right; 
            padding-right: 8px;
        }
    </style>
    <div style="width: 100%; height: 30px;">
        <div style="float: left;">
            <img src=<?php echo '.' . $logo ?> alt='none'
                style="width: 90px; height: 40px; display: block; margin-top: -15px;" 
            />
        </div>
        <div style="float: right;">
            <label style="font-size: 12px;"><?= $fecha.' '.$hora; ?></label>
        </div>
    </div>

    <div style="width: 100%; display: flex; justify-content: center; 
            align-items: center;">
        <h1 style="font-weight: bold; font-size: 15px; text-align: center;">
            **  REPORTE DE VENTAS POR PRODUCTO **
        </h1>
    </div>

    <?php 
        $cantidadTotal = 0;
        $precioTotal = 0;
    ?>

    <div style="width: 100%; padding-bottom: 10px; text-align: center">
        <strong>Producto: </strong>
        <label>
            <?= ($producto != '')?$producto->descripcion:'' ?>
        </label>
    </div>

    <div style="width: 100%; padding-bottom: 8px;">
        <table class="table-report">
            <thead>
                <tr>
                    <th> Id Venta</th>
                    <th> Fecha</th>
                    <th> Tipo Venta</th>
                    <th> Cantidad</th>
                    <th> Precio Unitario</th>
                    <th> Precio Total</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($venta as $v) { ?>
                    <tr>
                        <td><?= $v->idventa ?></td>
                        <td><?= date("d/m/Y", strtotime($v->fecha)) ?></td>
                        <td><?= $v->tipo ?></td>
                        <td style="text-align: right; padding-right: 10px;">
                            <?= $v->cantidad ?>
                            <?php $cantidadTotal += $v->cantidad; ?>
                            <?php $precioTotal += ($v->cantidad*$v->precio); ?>
                        </td>
                        <td style="text-align: right; padding-right: 10px;">
                        <?= number_format((float)round( $v->precio ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                        <td style="text-align: right; padding-right: 10px;">
                        <?= number_format((float)round( $v->cantidad*$v->precio ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    </tr>
                <?php } ?>
                <tr>
                    <td colspan="3" style="text-align: right">
                        <strong>
                            Total Cantidad Vendida: 
                        </strong>
                    </td>
                    <td style="text-align: right; padding-right: 10px;">
                        <?= number_format((float)round( $cantidadTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td style="text-align: right; padding-right: 10px;">
                        <strong>
                            Total Precio Vendido: 
                        </strong>
                    </td>
                    <td style="text-align: right; padding-right: 10px;">
                        <?= number_format((float)round( $precioTotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</html>