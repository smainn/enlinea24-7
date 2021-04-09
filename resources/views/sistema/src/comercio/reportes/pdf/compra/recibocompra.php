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
                                <label style="font-size: 18px; letter-spacing: 2px; display: block; margin-top: 5px; padding: 3px;">
                                    NOTA DE COMPRA
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
                                        <strong style="font-size: 13px;">CodCompra: </strong> 
                                        &nbsp; <?= $compra->idcompra ?> 
                                    </label>
                                </div>

                                    <div style="width: 20%; margin-left: 25%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 10px;">
                                            <strong style="font-size: 13px;">Fecha: </strong> 
                                            &nbsp; <?= date("d/m/Y", strtotime($compra->fecha)) ?> 
                                        </label>
                                    </div>

                                <?php if ($permisos->almacen->visible == 'A') { ?>
                                    <div style="width: 25%; margin-left: 45%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <strong style="font-size: 13px;">Almacen: </strong> 
                                            &nbsp; <?= $compra->almacen ?> 
                                        </label>
                                    </div>
                                <?php } ?>
                                <?php if ($permisos->sucursal->visible == 'A') { ?>
                                    <div style="width: 30%; margin-left: 70%; padding: 6px; margin-top: -50px;">
                                        <label style="font-size: 12px; padding-left: 5px;">
                                            <?php 
                                                $sucursal = '';
                                                if ($compra->tipoempresa == 'N') {
                                                    if ($compra->nombrecomercial == null) {
                                                        $sucursal = 'S/Empresa';
                                                    }else {
                                                        $sucursal = $compra->nombrecomercial;
                                                    }
                                                }else {
                                                    if ($compra->razonsocial == null) {
                                                        $sucursal = 'S/Empresa';
                                                    }else {
                                                        $sucursal = $compra->razonsocial;
                                                    }
                                                }
                                            ?>
                                            <strong style="font-size: 13px;">Sucursal: </strong> 
                                            &nbsp; <?= $sucursal ?> 
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
                                        <strong style="font-size: 13px;">Proveedor: </strong> 
                                        &nbsp; <?= $compra->proveedor ?> 
                                    </label>
                                </div>
                                <div style="width: 25%; margin-left: 45%; padding: 6px; margin-top: -50px">
                                    <label style="font-size: 12px; padding-left: 5px;">
                                        <strong style="font-size: 13px;">Nit: </strong> 
                                        &nbsp; <?= ($compra->nit == null)?'S/Nit':$compra->nit ?> 
                                    </label>
                                </div>
                                <div style="width: 30%; margin-left: 70%; padding: 6px; margin-top: -50px">
                                    <label style="font-size: 12px; padding-left: 5px;">
                                        <strong style="font-size: 13px;">Moneda: </strong> 
                                        &nbsp; <?= $compra->moneda ?> 
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width: 100%;">
                                <div style="width: 100%; padding: 6px; text-align: center;">
                                    <label style="font-size: 12px;">
                                        <strong style="font-size: 13px;">Tipo de Pago: </strong> 
                                        &nbsp; <?= $compra->tipo == 'C' ? 'Contado' : 'Credito' ?> 
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                
            </table>

            <table class="table-report" style="border-top: 1px dashed #000000; margin-top: 10px;">
                <thead>
                    <tr>
                        
                        <th style="padding: 8px; font-size: 13px;">Cod Producto</th>

                        <th style="padding: 8px; font-size: 13px;">Producto</th>

                        <th style="padding: 8px; font-size: 13px;">Unid Med.</th>

                        <th style="padding: 8px; font-size: 13px;">Cant.</th>

                        <th style="padding: 8px; font-size: 13px;">Costo Unit.</th>

                        <th style="padding: 8px; font-size: 13px;">Total</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($detalle as $d) { ?>
                        <tr>
                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->idproducto ?>
                                </td>

                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->descripcion ?>
                                </td>

                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center;">
                                    <?= $d->unidadmedida ?>
                                </td>

                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: center">
                                    <?= $d->cantidad ?>
                                </td>

                                <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: right; padding-right: 10px;">
                                    <?= number_format((float)round( $d->costounit ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>

                            <td style="border-top: 1px solid #e8e8e8; padding: 5px; text-align: right; padding-right: 10px;">
                                <?= number_format((float)round( $d->costounit*$d->cantidad ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                <?php $subtotal = $subtotal + (float)round( $d->costounit*$d->cantidad ,2, PHP_ROUND_HALF_DOWN); ?>
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
                                <div style="width: 70%; padding: 6px;"></div>
                                <div style="width: 25%; margin-left: 75%; padding: 10px; margin-top: -50px; display: block;">
                                    <div style="width: 100%; margin-bottom: 5px;">
                                        <div style="width: 90px; text-align: right">
                                            <strong style="font-size: 13px;">Total:</strong>
                                        </div>
                                        <div style="margin-left: 98px; margin-top: -17px;">
                                            <label style="font-size: 12px;">
                                                <?= number_format((float)round( $compra->mtototcompra ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <?php if ($compra->notas != null) { ?>
                        <tr>
                            <td>
                                <div style="width: 100%; padding: 6px; border-top: 1px dashed #000000;">
                                
                                        <label style="font-size: 12px; padding-left: 10px;">
                                            <strong style="font-size: 13px;">Notas: </strong> 
                                            &nbsp; <?= $compra->notas ?> 
                                        </label>
                                    
                                </div>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
            <?php if (sizeof($pago) > 0 && ($compra->tipo == 'R')) { ?>
                
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <label style="padding: 5px; font-size: 15px; font-weight: bold">
                        PLAN DE PAGO
                    </label>
                </div>

                <div style="width: 100%;">
                    <label style="padding: 5px; font-size: 12px;">
                        <strong style="font-size: 13px;">Anticipo: </strong> &nbsp; <?= $compra->anticipo ?>
                    </label>
                </div>

                <table class="table-report" style="border-top: 1px dashed #000000; margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; font-size: 14px;">Nro.</th>
                            <th style="padding: 8px; font-size: 14px;">Descripcion</th>
                            <th style="padding: 8px; font-size: 14px;">Fecha a pagar</th>
                            <th style="padding: 8px; font-size: 14px;">Monto a pagar</th>
                            <th style="padding: 8px; font-size: 14px;">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $nro = 0; $total = $compra->mtototcompra - $compra->anticipo; ?>
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
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; font-weight: normal;">
                                    <?= $nro ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; font-weight: normal;">
                                    <?= $p->descripcion ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; font-weight: normal;">
                                    <?= date("d/m/Y", strtotime($p->fechadepago)) ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; text-align: right; font-weight: normal;">
                                    <?= number_format((float)round( $p->montoapagar ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                                <td style="border-top: 1px solid #e8e8e8; padding: 8px; text-align: right; font-weight: normal;">
                                    <?= number_format((float)round( $total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                    <div style="width: 100%; border: 1px dashed #000000"></div>
                </table>
            <?php } ?>
        </div>


        <div style="position: absolute; bottom: 50px; left: 0; width: 100%; 
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
        <div style="position: absolute; bottom: 20px; right: 10px">
            <label style="font-size: 12px;">
                Impreso por: <?= $usuario ?>, <?= $fecha ?>, <?= $hora ?>
            </label>
        </div>
    </body>
</html>