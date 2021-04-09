

<?php $totalventa = 0; ?>

    <table>
        
        <thead>
            <tr>
                <th colspan="7" style="text-align: center; 
                    width: 20px; height: 27px; font-size: 16px;">
                    <strong>Listado Venta Historico Vehiculo</strong>
                </th>
            </tr>
            <tr>
                <th colspan="7" style="text-align: center; 
                    width: 20px; height: 26px; font-size: 14px;">
                    <strong>Placa: </strong> &nbsp;

                    <label style="font-size: 13px;"><?= $placa ?></label>

                        &nbsp;&nbsp;&nbsp;

                    <strong>Cliente: </strong>&nbsp;

                    <label style="font-size: 13px;"><?= $cliente ?></label>
                    
                </th>
            </tr>
            <tr>
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
                    <strong>Id Venta</strong>
                </th>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Id Prod/Serv</strong>
                </th>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Producto/Servicio</strong>
                </th>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Cantidad</strong>
                </th>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Precio Unitario</strong>
                </th>
                <th style="width: 20px; height: 25px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    border-right: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong>Precio Total</strong>
                </th>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($data as $d) { ?>
                <tr>
                    <td style="height: 20px; text-align: center;">
                        <?= date("d/m/Y", strtotime($d->fecha)) ?>
                    </td>
                    <td style="height: 20px; text-align: center;">
                        <?= $d->idventa ?>
                    </td>
                    <td style="height: 20px; text-align: center;">
                        <?= $d->idproducto ?>
                    </td>
                    <td style="height: 20px; text-align: center;">
                        <?= $d->producto ?>
                    </td>
                    <td style="height: 20px; text-align: right;">
                        <?= $d->cantidad ?>
                    </td>
                    <td style="height: 20px; text-align: right;">
                        <?= $d->precio ?>
                    </td>
                    <td style="height: 20px; text-align: right;">
                        <?= ($d->cantidad * $d->precio) - (($d->cantidad * $d->precio)*($d->descuento/100)) ?>
                        <?php $totalventa = $totalventa +  
                            (($d->cantidad * $d->precio) - (($d->cantidad * $d->precio)*($d->descuento/100))) ?>
                    </td>
                </tr>
            <?php } ?>
            <tr>
                <td colspan="6" style="height: 20px; text-align: right;">
                    <strong>Total: </strong>&nbsp;&nbsp;&nbsp;
                </td>
                <td style="height: 20px; text-align: right;">
                    <?= $totalventa ?>
                </td>
            </tr>
        </tbody>
            
    </table>    

