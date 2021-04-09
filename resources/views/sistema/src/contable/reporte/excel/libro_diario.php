
<html>
<table class="table-report" style="borderTop: 1px solid black;">
            <thead>
                <tr>
                    <th colspan="9" style="text-align: center; 
                        width: 20px; height: 27px; font-size: 16px;">
                        <strong>Libro Diario</strong>
                    </th>
                </tr>
                <tr>
                    <th colspan="3" style="text-align: center; 
                        width: 20px; height: 27px; font-size: 16px;">
                        <strong>Criterios</strong>
                    </th>
                    <th colspan="6" style="text-align: center; 
                        width: 20px; height: 27px; font-size: 16px;">
                        <? echo $criterios ?>
                    </th>
                </tr>
            </thead>
</table>
<?php 
$i = 0;
$size = sizeof($reporte);
while ($i < $size) {
?>
    <div style="width: 100%; padding: 5px;">
        <table class="table-report" style="borderTop: 1px solid black;">
            <tbody>
                <tr>
                    <th style="font-weight: bold;">
                        Tipo Comprobante
                    </th>
                    <th>
                        <?php echo $reporte[$i]->tipocomprobante ?>
                    </th>
                    <th style="font-weight: bold;">
                        Numero
                    </th>
                    <th>
                        <?php echo $reporte[$i]->numero ?>
                    </th>
                    <th style="font-weight: bold;">
                        Fecha
                    </th>
                    <th>
                        <?php echo $reporte[$i]->fecha ?>
                    </th>
                    <th style="font-weight: bold;">
                        T.C.
                    </th>
                    <th>
                        <?php echo $reporte[$i]->tipocambio ?>
                    </th>
                </tr>
            </tbody>
        </table>
        <table class="table-report">
            <tbody>
                <tr>
                    <th style="font-weight: bold;">
                        Moneda
                    </th>
                    <th>
                        <?php echo $reporte[$i]->moneda ?>
                    </th>
                    <th style="font-weight: bold;">
                        Referidoa
                    </th>
                    <th>
                        <?php echo $reporte[$i]->referidoa ?>
                    </th>
                </tr>
            </tbody>
        </table>
        <table class="table-report">
            <tbody>
                <tr>
                    <th style="font-weight: bold;">
                        Glosa
                    </th>
                    <th>
                        <?php echo $reporte[$i]->glosa ?>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>

    <div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>
        <div style="width: 100%; padding: 5px; margin-top: 5px;">
            <table class="table-report">
                <thead>
                    <tr>
                        <td>Codigo</td>
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
                            <th><?= $reporte[$i]->glosa ?></th>
                            <th><?= $reporte[$i]->debe?></th>
                            <th><?= $reporte[$i]->haber ?></th>
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
                    <th><? echo $totaldebe ?></th>
                    <th><? echo $totalhaber ?></th>
                    <th></th>
                </tr>
                </tbody>
            </table>
        </div>
    
    <!--<div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>-->
    <div style="width: 100%; border: 1px solid black; margin-top: 5px;"></div>
   
<?php 
$i++;
}
?>

</html>
