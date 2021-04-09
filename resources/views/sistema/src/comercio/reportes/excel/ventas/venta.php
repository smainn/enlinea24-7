

<?php $totalVenta = 0; ?>

<?php $totalCobrado = 0; ?>

<?php $totalPorCobrar = 0; ?>

    <table>
        
        <thead>

        <tr>
            <th colspan="8" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <strong>Reporte Venta</strong>
            </th>
        </tr>
        
            <tr>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Id Venta</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>Fecha</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>Cliente</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>Tipo Venta</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>Vendedor</strong>
                </th>

                <th style="width: 20px; height: 25px; 
                        border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                        text-align: center; font-size: 13px;"
                >
                    <strong>Monto Total</strong>
                </th>

                <?php if ($comventasventaalcredito == 'A') { ?>
                    <th style="width: 20px; height: 25px; 
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                            text-align: center; font-size: 13px;"
                    >
                        <strong>Monto Cobrado</strong>
                    </th>

                    <th style="width: 20px; height: 25px;
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                            border-right: 1px solid #000000;
                            text-align: center; font-size: 13px;" 
                    >
                        <strong>Monto Por Cobrar</strong>
                    </th>
                <?php } ?>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($venta as $v) { ?>
                <tr>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->idventa ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= date("d/m/Y", strtotime($v->fecha)) ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->cliente ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= ($v->estadoproceso ==='E')?'Contado':'Credito' ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $v->vendedor ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= $v->total ?><?php $totalVenta = $totalVenta + $v->total; ?>
                    </td>

                    <?php if ($comventasventaalcredito == 'A') { ?>
                        <td style="height: 20px; text-align: right;">
                            <?= ($v->estadoproceso =='E')?($v->total - $v->mtototcobrado):$v->mtototcobrado ?>
                            <?php $totalCobrado = $totalCobrado + (($v->estadoproceso =='E')?($v->total - $v->mtototcobrado):$v->mtototcobrado) ?>
                        </td>

                        <td style="height: 20px; text-align: right;">
                            <?= ($v->estadoproceso =='E')?$v->mtototcobrado:($v->total - $v->mtototcobrado) ?>
                            <?php $totalPorCobrar = $totalPorCobrar + (($v->estadoproceso =='E')?$v->mtototcobrado:($v->total - $v->mtototcobrado)) ?>
                        </td>
                    <?php } ?>
                    
                </tr>
                
            <?php } ?>
            
        </tbody>
            
        <tbody>
            <tr>
                <td colspan="8" style="height: 15px;"></td>
            </tr>
            <tr>

                <td style="height: 20px; text-align: left; font-size: 13px;" colspan="5">
                    <strong>Totales: </strong>
                </td>

                <td style="height: 20px; text-align: right;">
                    <?= $totalVenta ?>
                </td>

                <?php if ($comventasventaalcredito == 'A') { ?>

                    <td style="height: 20px; text-align: right;">
                        <?= $totalCobrado ?>
                    </td>

                    <td style="height: 20px; text-align: right;">
                        <?= $totalPorCobrar ?>
                    </td>
                <?php } ?>

            </tr>
            <tr>
                <td colspan="8" style="height: 15px;"></td>
            </tr>
        </tbody>
    </table>