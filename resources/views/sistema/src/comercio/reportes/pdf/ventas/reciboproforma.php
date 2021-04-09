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
                font: bold 13px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
                font: 300 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
        </style>

    </head>

    <body style="border: 1px solid #000000">

        <?php $subtotal = 0; ?>

        <div style="width: 100%; padding: 5px;">
            <table class="table-report">
                <thead>
                    <tr>
                        <th style="border-bottom: 1px dashed #000000;">
                            <div style="width: 100%; text-align: center;">
                                <img src=<?php echo '.' . $logo ?> alt='none'
                                    style="width: 100px; height: 40px;
                                        position: absolute; left: 20px;" />
                                <label style="font-size: 20px; letter-spacing: 2px;
                                    display: block; margin-top: 5px; padding: 3px;">
                                    PROFORMA
                                </label>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <div style="width: 100%;">
                                <div style="width: 25%; padding: 6px;">
                                    <label style="font-size: 12px; padding-left: 5px;">
                                        <strong style="font-size: 13px;">CodProforma: </strong> 
                                        &nbsp; <?= $venta->idventa ?>
                                    </label>
                                </div>
                                <?php if ($permisos->fecha->visible == 'A') { ?>
                                    <div style="width: 20%; margin-left: 25%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 10px;">
                                            <strong style="font-size: 13px;">Fecha: </strong> 
                                            &nbsp; <?= date("d/m/Y", strtotime($venta->fecha)) ?> 
                                        </label>
                                    </div>
                                <?php } ?>
                                <?php if ($permisos->almacen->visible == 'A') { ?>
                                    <div style="width: 25%; margin-left: 45%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <strong style="font-size: 13px;">Almacen: </strong> 
                                            &nbsp; <?= $venta->almacen ?> 
                                        </label>
                                    </div>
                                <?php } ?>
                                <?php if ($permisos->sucursal->visible == 'A') { ?>
                                    <div style="width: 30%; margin-left: 70%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <strong style="font-size: 13px;">Sucursal: </strong> 
                                            &nbsp; <?= $venta->sucursal ?> 
                                        </label>
                                    </div>
                                <?php } ?>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width: 100%;">
                                <div style="width: 45%; padding: 6px;">
                                    <label style="font-size: 12px; padding-left: 10px;">
                                        <strong style="font-size: 13px;">Cliente: </strong> 
                                        &nbsp; <?= ucwords($venta->cliente) ?>
                                    </label>
                                </div>
                                <div style="width: 25%; margin-left: 45%; padding: 6px; margin-top: -50px">
                                    <label style="font-size: 12px; padding-left: 5px;">
                                        <strong style="font-size: 13px;">Nit: </strong> 
                                        &nbsp; <?= ($venta->nit == null)?'S/N':$venta->nit ?> 
                                    </label>
                                </div>
                                <div style="width: 30%; margin-left: 70%; padding: 6px; margin-top: -50px">
                                    <label style="font-size: 12px; padding-left: 5px;">
                                        <strong style="font-size: 13px;">Moneda: </strong> 
                                        &nbsp; <?= $venta->moneda ?> 
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <?php if ($venta->idvehiculo != null) { ?>
                        <tr>
                            <td>
                                <div style="width: 100%;">
                                    <div style="width: 33%; padding: 6px;">
                                        <label style="font-size: 12px; padding-left: 10px;">
                                            <strong style="font-size: 13px;">Id Vehiculo: </strong> 
                                            &nbsp; <?= $venta->idvehiculo ?> 
                                        </label>
                                    </div>
                                    <div style="width: 33%; margin-left: 33%; padding: 6px; margin-top: -50px">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <strong style="font-size: 13px;">Placa: </strong> 
                                            &nbsp; <?= $venta->placa ?> 
                                        </label>
                                    </div>
                                    <div style="width: 33%; margin-left: 66%; padding: 6px; margin-top: -50px">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <strong style="font-size: 13px;">Descripción: </strong> 
                                            &nbsp; <?= $venta->vehiculo ?> 
                                        </label>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    <?php } ?>
                    
                </tbody>
                
            </table>

            <table class="table-report" style="border-top: 1px dashed #000000; margin-top: 10px;">
                <thead>
                    <tr>
                        
                        <?php if ($permisos->t_prod_cod->visible == 'A') { ?>
                            <th style="padding: 8px; font-size: 13px;">Cod Producto</th>
                        <?php } ?>

                        <?php if ($permisos->t_prod_desc->visible == 'A') { ?>
                            <th style="padding: 8px; font-size: 13px;">Producto</th>
                        <?php } ?>

                        <?php if ($clienteesabogado == 'V') { ?>
                            <th style="padding: 8px; font-size: 13px;">Unid Med.</th>
                        <?php } ?>

                        <?php if ($permisos->t_cantidad->visible == 'A') { ?>
                            <th style="padding: 8px; font-size: 13px;">Cant.</th>
                        <?php } ?>

                        <?php if ($permisos->t_precio_unitario->visible == 'A') { ?>
                            <th style="padding: 8px; font-size: 13px;">Precio Unit.</th>
                        <?php } ?>

                        <?php if ($permisos->t_descuento->visible == 'A') { ?>
                            <th style="padding: 8px; font-size: 13px;">Dcto.</th>
                        <?php } ?>

                        <th style="padding: 8px; font-size: 13px;">Total</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($detalle as $d) { ?>
                        <tr>
                            <?php if ($permisos->t_prod_cod->visible == 'A') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->codigo ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_prod_desc->visible == 'A') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->producto ?>
                                </td>
                            <?php } ?>

                            <?php if ($clienteesabogado == 'V') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->medida ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_cantidad->visible == 'A') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center">
                                    <?= $d->cantidad ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_precio_unitario->visible == 'A') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: right; padding-right: 10px;">
                                    <?= number_format((float)round( $d->precio ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_descuento->visible == 'A') { ?>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: right; padding-right: 10px;">
                                    <?= $d->descuento.'%' ?>
                                </td>
                            <?php } ?>

                            <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: right; padding-right: 10px;">
                                <?= number_format((float)round( ($d->precio*$d->cantidad) - (($d->precio*$d->cantidad)*($d->descuento/100)) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                <?php $subtotal = $subtotal + (float)round( ($d->precio*$d->cantidad) - (($d->precio*$d->cantidad)*($d->descuento/100)) ,2, PHP_ROUND_HALF_DOWN); ?>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>

            <table class="table-report">
                <tbody>
                    <tr>
                        <td>
                            <div style="width: 100%; border-top: 1px dashed #000000; margin-top: 10px;">
                                <div style="width: 70%; padding: 6px;">
                                    
                                </div>
                                <div style="width: 25%; margin-left: 75%; padding: 10px; margin-top: -50px; display: block;">

                                    <?php if ($permisos->sub_total->visible == 'A') { ?>
                                        <div style="width: 100%; margin-bottom: 5px;">
                                            <div style="width: 90px; text-align: right;">
                                                <strong style="font-size: 13px;">Sub Total:</strong>
                                            </div>
                                            <div style="margin-left: 98px; margin-top: -17px;">
                                                <label style="font-size: 12px;">
                                                    <?= number_format((float)round( $subtotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                                </label>
                                            </div>
                                        </div>
                                    <?php } ?>

                                    <?php if ($permisos->descuento->visible == 'A') { ?>                                    
                                        <div style="width: 100%; margin-bottom: 5px;">
                                            <div style="width: 90px; text-align: right">
                                                <strong style="font-size: 13px;">Descuento:</strong>
                                            </div>
                                            <div style="margin-left: 98px; margin-top: -17px;">
                                                <label style="font-size: 12px;">
                                                    <?= $venta->descuento.'%' ?>
                                                </label>
                                            </div>
                                        </div>
                                    <?php } ?>

                                    <?php if ($permisos->recargo->visible == 'A') { ?>
                                        <div style="width: 100%; margin-bottom: 5px;">
                                            <div style="width: 90px; text-align: right">
                                                <strong style="font-size: 13px;">Recargo:</strong>
                                            </div>
                                            <div style="margin-left: 98px; margin-top: -17px;">
                                                <label style="font-size: 12px;">
                                                    <?= $venta->recargo.'%' ?>
                                                </label>
                                            </div>
                                        </div>
                                    <?php } ?>

                                    <div style="width: 100%; margin-bottom: 5px;">
                                        <div style="width: 90px; text-align: right">
                                            <strong style="font-size: 13px;">Total:</strong>
                                        </div>
                                        <div style="margin-left: 98px; margin-top: -17px;">
                                            <label style="font-size: 12px;">
                                                <?= number_format((float)round( $venta->total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width: 100%; padding: 6px; border-top: 1px dashed #000000;">
                                <?php if ($permisos->observaciones->visible == 'A') { ?>
                                    <label style="font-size: 12px; padding-left: 10px;">
                                        <strong style="font-size: 13px;">Notas: </strong> 
                                        &nbsp; <?= $venta->notas ?> 
                                    </label>
                                <?php } ?>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <?php if (sizeof($pago) > 0 && ($venta->fkidtipocontacredito == 2)) { ?>
                
                <div style="width: 100%; text-align: center">
                    <label style="padding: 5px; font-size: 16px; font-weight: bold">
                        Plan de Pagos
                    </label>
                </div>

                <?php if ($permisos->anticipo->visible == 'A') { ?>
                    <div style="width: 100%;">
                        <label style="padding: 5px; font-size: 13px;">
                            <strong style="font-size: 14px;">Anticipo: </strong> &nbsp; <?= $venta->anticipo ?>
                        </label>
                    </div>
                <?php } ?>

                <table class="table-report" style="border-top: 1px dashed #000000; margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; font-size: 15px;">Nro.</th>
                            <th style="padding: 8px; font-size: 15px;">Descripcion</th>
                            <th style="padding: 8px; font-size: 15px;">Fecha a pagar</th>
                            <th style="padding: 8px; font-size: 15px;">Monto a pagar</th>
                            <th style="padding: 8px; font-size: 15px;">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $nro = 0; $total = $venta->total - $venta->anticipo; ?>
                        <?php foreach ($pago as $p) { ?>
                            <?php 
                                $nro = $nro + 1; 
                                if ($nro == sizeof($pago)) {
                                    $total = round((($total - $p->montoapagar)*100)/100); 
                                }else {
                                    $total = $total - $p->montoapagar; 
                                }
                                
                            ?>
                            <tr>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px;">
                                    <?= $nro ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px;">
                                    <?= $p->descripcion ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px;">
                                    <?= date("d/m/Y", strtotime($p->fechaapagar)) ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; text-align: right">
                                    <?= number_format((float)round( $p->montoapagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; text-align: right">
                                    <?= number_format((float)round( $total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                    <div style="width: 100%; border: 1px dashed #000000"></div>
                </table>
            <?php } ?>
        </div>


        <div style="position: absolute; bottom: 30px; left: 0; width: 100%; 
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