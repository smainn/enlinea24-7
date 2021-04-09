
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
        padding-left: 5px;
        border-right: 5px;
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
        padding-left: 5px;
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
            style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
    </div>
    <div style="float: right;">
        <label style="font-size: 12px;"><?= $fecha.' '.$hora ?></label>
    </div>
</div>

<div style="width: 100%; display: flex; justify-content: center; 
    align-items: center;">
    <h1 style="font-weight: bold; font-size: 18px; text-align: center;">
        ** Reporte Cobros Realizados **
    </h1>
</div>

<?php $totalPorCobrar = 0; ?>
<?php $totalCobrado = 0; ?>
<?php $id = 0 ?>

<div style="width: 100%; padding-bottom: 8px;">
    <table class="table-report">
        
        <thead>
        
            <tr>
                <th> IdCobro</th>

                <th> Fecha Cobro</th>

                <th> Cliente</th>

                <th> <?php echo $titleVendedor ?></th>

                <th> IdVenta</th>

                <th> Fecha a Cobrar</th>

                <th> Nro Cuota</th>

                <th> Monto Cobrado</th>

                <th>Monto a Cobrar</th>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($venta as $v) { ?>
                <?php if ($id == 0) { 
                    $id = $v->idventa;
                    $totalCobro = 0;
                }?>
                <tr>

                    <td><?= $v->idcobro ?></td>

                    <td><?= date("d/m/Y", strtotime($v->fechacobro)) ?></td>

                    <td><?= $v->cliente ?></td>

                    <td><?= $v->vendedor ?></td>

                    <td><?= $v->idventa ?></td>

                    <td><?= date("d/m/Y", strtotime($v->fechaapagar)) ?></td>

                    <td><?= $v->descripcion ?></td>

                    <td class="txt-right">
                        <?= number_format((float)round( $v->montoapagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        <?php $totalCobrado = $totalCobrado + $v->montoapagar ?>
                    </td>

                    <td class="txt-right">
                        <?= number_format((float)round( $v->montocobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        <?php $totalPorCobrar = $totalPorCobrar + $v->montoapagar ?>
                    </td>
                    
                </tr>
                
            <?php } ?>
            
        </tbody>
            
        <tbody>
            <tr>

                <td colspan="7" class="txt-right" style="font-weight: bold"> 
                    Total Por Cobrar:
                </td>

                <td class="txt-right">
                    <?= number_format((float)round( $totalCobrado ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>

                <td class="txt-right">
                    <?= number_format((float)round( $totalPorCobrar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>

            </tr>
        </tbody>
    </table>
</div>
</html>