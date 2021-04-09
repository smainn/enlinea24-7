
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
        padding: 5px;
        padding-left: 8px;
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
        padding-left: 10px;
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
        <label style="font-size: 12px;"><?= $fecha ?></label>
    </div>
</div>

<div style="width: 100%; display: flex; justify-content: center; 
        align-items: center;">
    <h1 style="font-weight: bold; font-size: 18px; text-align: center;">
        ** Reporte Histórico de Ventas Vehiculo  **
    </h1>
</div>

<div style="width: 100%; padding: 5px; text-align: center; margin-bottom: 10px;">
    <label style="font-weight: bold; font-size: 16px;">
        Placa: &nbsp;&nbsp;
    </label>
    <label style="font-size: 15px;"><?= $placa ?></label>
    &nbsp;&nbsp;&nbsp;
    <label style="font-weight: bold; font-size: 16px;">
        Cliente: &nbsp;&nbsp;
    </label>
    <label style="font-size: 15px;"><?= $cliente ?></label>
</div>

<?php $totalventa = 0; ?>

<div style="width: 100%; padding-bottom: 8px;">
    <table class="table-report">
        
        <thead>
            <tr>
                <th> Fecha </th>
                <th> Id Venta </th>
                <th> Id Prod/Serv </th>
                <th> Producto/Servicio </th>
                <th> Cantidad </th>
                <th> Precio Unit. </th>
                <th> Precio Total </th>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($data as $d) { ?>
                <tr>
                    <td>
                        <?= date("d/m/Y", strtotime($d->fecha)) ?>
                    </td>
                    <td>
                        <?= $d->idventa ?>
                    </td>
                    <td>
                        <?= $d->idproducto ?>
                    </td>
                    <td>
                        <?= $d->producto ?>
                    </td>
                    <td class="txt-right">
                        <?= $d->cantidad ?>
                    </td>
                    <td class="txt-right">
                        <?= number_format((float)round( $d->precio ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                    </td>
                    <td class="txt-right">
                        <?= number_format((float)round( ($d->cantidad * $d->precio) - (($d->cantidad * $d->precio)*($d->descuento/100)) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        <?php $totalventa = $totalventa +  
                            (($d->cantidad * $d->precio) - (($d->cantidad * $d->precio)*($d->descuento/100))) ?>
                    </td>
                </tr>
            <?php } ?>
            <tr>
                <td colspan="6" style="text-align: right; padding-right: 5px;">
                    <strong>Total: </strong>
                </td>
                <td style="text-align: right; padding-right: 5px;">
                    <?= number_format((float)round( $totalventa ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>
            </tr>
        </tbody>
            
    </table>    
</div>

</html>