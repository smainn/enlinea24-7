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

    <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px;">
        <label style="font-size: 23px; font-weight: bold;">
            ** REPORTE DE VENTAS DETALLADO **
        </label>
    </div>

    <?php 

        $id = 0; 
        $totalGeneral = 0;
        $subTotal = 0;
        $bandera = 0;

        $colcount = 0;

        if ($permisos->t_prod_cod->visible == 'A') {
            $colcount++;
        } 
        if ($permisos->t_prod_desc->visible == 'A') { 
            $colcount++;
        } 
        if ($permisos->t_prod_desc->visible == 'A') { 
            $colcount++;
        }
        if ($esabogado == 'false') { 
            $colcount++;
        }
        if ($permisos->t_cantidad->visible == 'A') {
            $colcount++;
        }
        if ($permisos->t_precio_unit->visible == 'A') {
            $colcount++;
        }
        if ($permisos->t_descuento->visible == 'A') {
            $colcount++;
        }
    ?>


    <div style="width: 100%; border: 1px solid #e8e8e8;">
            <table class="table-report">

                <?php foreach ($venta as $v) { ?>

                    <thead>
                        <?php if ($id != $v->idventa) { ?>

                            <?php if ($bandera == 1) { ?>
                                <tr>
                                    <td colspan="<?= $colcount ?>" style="text-align: right; padding-bottom: 20px;">
                                        <strong>
                                            Total Venta:
                                            <label style="font-weight: 400; 
                                                padding-left: 50px; padding-right: 8px;">
                                                    <?= $subTotal ?>
                                            </label>
                                        </strong>
                                    </td>
                                </tr>
                            <?php }
                                $bandera = 1;
                                $subTotal = 0;
                            ?>

                            <tr>
                                <td colspan="<?= $colcount ?>" style="padding: 0;">
                                    <table width="100%" style="border-collapse: collapse; border-spacing: 0;">
                                        <tr>
                                            <td style="text-align: right; border: 1px solid transparent;">
                                                <strong>ID Venta: &nbsp;</strong>
                                            </td>
                                            <td style="font-weight: normal; border: 1px solid transparent;">
                                                <?= $v->idventa ?>
                                            </td>
                                            <td style="text-align: right; border: 1px solid transparent;">
                                                <strong>Fecha: &nbsp;</strong>
                                            </td>
                                            <td style="font-weight: normal; border: 1px solid transparent;">
                                                <?= date("d/m/Y", strtotime($v->fecha)) ?>
                                            </td>

                                            <?php if($esabogado == 'false') { ?>
                                                <td style="text-align: right; border: 1px solid transparent;">
                                                    <strong>Tipo Venta: &nbsp;</strong>
                                                </td>
                                                <td style="font-weight: normal; border: 1px solid transparent;">
                                                    <?= $v->tipo?>
                                                </td>
                                            <?php } ?>

                                            <?php if ($permisos->almacen->visible == 'A') { ?>
                                                <td style="text-align: right; border: 1px solid transparent;">
                                                    <strong>Almacen: &nbsp;</strong>
                                                </td>
                                                <td style="font-weight: normal; border: 1px solid transparent;">
                                                    <?= $v->almacen ?>
                                                </td>
                                            <?php } ?>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="<?= $colcount ?>" style="padding: 0;">
                                    <table width="100%" style="border-collapse: collapse; border-spacing: 0;">
                                        <tr>
                                            <?php if (($taller == 0) && ($v->vehiculos != null)) { ?>
                                                <td style="text-align: right; border: 1px solid transparent;">
                                                    <strong>Placa: &nbsp;</strong>
                                                </td>
                                                <td style="font-weight: normal; border: 1px solid transparent;">
                                                    <?= $v->vehiculos ?>
                                                </td>
                                            <?php } ?>
                                            <td style="text-align: right; border: 1px solid transparent;">
                                                <strong>Cliente: &nbsp;</strong>
                                            </td>
                                            <td style="font-weight: normal; border: 1px solid transparent;">
                                                <?= ucwords($v->cliente)  ?>
                                            </td>
                                            <td style="text-align: right; border: 1px solid transparent;">
                                                <strong><?php echo $titleVendedor . ':' ?> &nbsp;</strong>
                                            </td>
                                            <td style="font-weight: normal; border: 1px solid transparent;">
                                                <?= ucwords($v->vendedor)  ?>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <?php if ($permisos->t_prod_cod->visible == 'A') { ?>
                                    <td style="text-align: center">
                                        <?= ($esabogado == 'false')?'ID Producto':'ID Servicio' ?>
                                    </td>
                                <?php } ?>

                                <?php if ($permisos->t_prod_desc->visible == 'A') { ?>
                                    <td style="text-align: center">
                                        <?= ($esabogado == 'false')?'Producto':'Servicio' ?>
                                    </td>
                                <?php } ?>

                                <?php if ($esabogado == 'false') { ?>
                                    <td style="text-align: center">U. Medida</td>
                                <?php } ?>

                                <?php if ($permisos->t_cantidad->visible == 'A') { ?>
                                    <td style="text-align: center">Cantidad</td>
                                <?php } ?>

                                <?php if ($permisos->t_precio_unit->visible == 'A') { ?>
                                    <td style="text-align: center">Precio Unitario</td>
                                <?php } ?>

                                <?php if ($permisos->t_descuento->visible == 'A') { ?>
                                    <td style="text-align: center">% Dcto.</td>
                                <?php } ?>

                                <td style="text-align: right; padding-right: 20px;">Precio Total</td>

                            </tr>
                        <?php } ?>
                        <tr>
                            
                            <?php if ($permisos->t_prod_cod->visible == 'A') { ?>
                                <td style="font: 300 14px Roboto; text-align: center">
                                    <?= $v->idproducto ?>
                                </td>
                            <?php } ?>
                            
                            <?php if ($permisos->t_prod_desc->visible == 'A') { ?>
                                <td style="font: 300 14px Roboto; text-align: center">
                                    <?= ucwords($v->producto) ?>
                                </td>
                            <?php } ?>

                            <?php if ($esabogado == 'false') { ?>
                                <td style="font: 300 14px Roboto; text-align: center;">
                                    <?= $v->medida ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_cantidad->visible == 'A') { ?>
                                <td style="font: 300 14px Roboto; text-align: center;">
                                    <?= $v->cantidad ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_precio_unit->visible == 'A') { ?>
                                <td style="font: 300 14px Roboto; text-align: center;">
                                    <?= $v->precio ?>
                                </td>
                            <?php } ?>

                            <?php if ($permisos->t_descuento->visible == 'A') { ?>
                                <td style="font: 300 14px Roboto; text-align: center;">
                                    <?= $v->descuento.'%' ?>
                                </td>
                            <?php } ?>

                            <td style="font: 300 14px Roboto; text-align: right; padding-right: 20px;">
                                <?= round(($v->cantidad * $v->precio) - (($v->cantidad * $v->precio)*($v->descuento/100)), 2) ?>
                                <?php $subTotal += round(($v->cantidad * $v->precio) - (($v->cantidad * $v->precio)*($v->descuento/100)), 2) ?>
                                <?php $totalGeneral += round(($v->cantidad * $v->precio) - (($v->cantidad * $v->precio)*($v->descuento/100)), 2) ?>
                            </td>
                            
                        </tr>
                        
                    </thead>
                    
                    <?php 
                        if ($id != $v->idventa) { 
                            $id = $v->idventa;
                        }
                    ?>

                <?php } ?>

                <thead>
                    <tr>
                        <td colspan="<?= $colcount ?>" style="text-align: right; padding-bottom: 10px;">
                            <strong>
                                Total Venta: 
                                <label style="font-weight: 400; 
                                    padding-left: 50px; padding-right: 8px;">
                                        <?= $subTotal ?>
                                </label>
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="<?= $colcount ?>" style="text-align: right">
                            <strong>
                                Total General de Ventas: 
                                <label style="font-weight: 400; 
                                    padding-left: 50px; padding-right: 8px;">
                                        <?= $totalGeneral ?>
                                </label>
                            </strong>
                        </td>
                    </tr>
                </thead>
            </table>

            
    </div>                       

    </div>
    
</body>
</html>