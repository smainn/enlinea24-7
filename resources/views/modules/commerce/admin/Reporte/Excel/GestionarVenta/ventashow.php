
<?php 
    $id = 0; 
    $pos = 0;
    $total = 0;
    $totalGeneral = 0;
?>
<table>
    <tr>
        <th colspan="8" style="text-align: center; 
            width: 20px; height: 27px; font-size: 16px;">
            <strong>Reporte Venta Detalle</strong>
        </th>
    </tr>
    
    <?php foreach($venta as $v) { ?>

        <?php if ($id != $v->idventa) {
            $id = $v->idventa;
        ?>
            <thead>
                <?php if ($pos > 0) { ?>

                    <tr>
                        <td colspan="7"
                            style="width: 20px; height: 27px; 
                                border-left: 1px solid #000000;
                                text-align: left; font-size: 13px;"    
                        >
                            <strong>Total Venta</strong>
                        </td>
                        <td style="width: 20px; height: 27px; font-size: 12px;">
                            <?= $total ?>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="8"></td>
                    </tr>
                <?php } ?>

                <?php 
                    $totalGeneral = $totalGeneral + $total;
                    $pos = $pos + 1; 
                    $total = 0;
                ?>

                <tr>
                    <td style="width: 20px; height: 27px; 
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                            text-align: center; font-size: 13px;"
                    >
                        <strong>Id Venta: </strong>
                    </td>

                    <td style="width: 20px; height: 27px; font-size: 12px; text-align: left;
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000;"
                    >
                        <?= $v->idventa ?>
                    </td>

                    <td style="width: 20px; height: 27px; 
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                            text-align: center; font-size: 13px;"
                    >
                        <strong>Fecha: </strong>
                    </td>

                    <td style="width: 20px; height: 27px; font-size: 12px;
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000;"
                    >
                        <?= date("d/m/Y", strtotime($v->fecha)) ?>
                    </td>

                    <td style="width: 20px; height: 27px; 
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                            text-align: center; font-size: 13px;"
                    > 
                        <strong>Tipo Venta: </strong>
                    </td>

                    <td style="width: 20px; height: 27px; font-size: 12px;
                            border-top: 1px solid #000000; border-bottom: 1px solid #000000;">
                        <?= $v->tipo ?>
                    </td>
                    <?php if($esabogado == 'false') { ?>
                        <td style="width: 20px; height: 27px; 
                                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                                text-align: center; font-size: 13px;"
                        >
                            <strong>Almacen: </strong>
                        </td>

                        <td style="width: 20px; height: 27px; font-size: 12px;
                                border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                                border-right: 1px solid #000000;"
                        >
                            <?= $v->almacen ?>
                        </td>
                    <?php } ?>
                </tr>

                <tr>
                    <td style="height: 20px; text-align: left; font-size: 12px;">
                        <strong>Cliente: </strong>
                    </td>
                    <td colspan="3" style="height: 20px; text-align: left;">
                        <?= $v->cliente ?>
                    </td>
                    <td style="height: 20px; text-align: left; font-size: 12px;">
                        <strong>Vendedor:</strong> 
                    </td>
                    <td colspan="3" style="height: 20px; text-align: left;">
                        <?= $v->vendedor ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="height: 15px;">

                    </td>
                </tr>
                <tr>
                    <td style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>Id Producto</strong>
                    </td>
                    <td colspan="2" style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>Producto</strong>
                    </td>
                    <?php if($esabogado == 'false') { ?>
                        <td style="height: 22px; text-align: center; font-size: 13px;">
                            <strong>U. Medida</strong>
                        </td>
                    <?php } ?>
                    <td style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>Cantidad</strong>
                    </td>
                    <td style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>Precio Unitario</strong>
                    </td>
                    <td style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>% Dcto.</strong>
                    </td>
                    <td style="height: 22px; text-align: center; font-size: 13px;">
                        <strong>Precio Total</strong>
                    </td>
                </tr>
            </thead>

        <?php }?>

        <tr>
            <td style="height: 20px; text-align: center; font-size: 12px;">
                <?= $v->idproducto ?>
            </td>
            <td colspan="2" style="height: 20px; text-align: center; font-size: 12px;">
                <?= $v->producto ?>
            </td>
            <?php if($esabogado == 'false') { ?>
                <td style="height: 20px; text-align: center; font-size: 12px;">
                    <?= $v->medida ?>
                </td>
            <?php } ?>
            <td style="height: 20px; text-align: right; font-size: 12px;">
                <?= $v->cantidad ?>
            </td>
            <td style="height: 20px; text-align: right; font-size: 12px;">
                <?= $v->precio ?>
            </td>
            <td style="height: 20px; text-align: right; font-size: 12px;">
                <?= $v->descuento.'%' ?>
            </td>
            <td style="height: 20px; text-align: right; font-size: 12px;">
                <?= ($v->cantidad * $v->precio) - (($v->cantidad * $v->precio)*($v->descuento/100)) ?>
                <?php $total = $total +  (($v->cantidad * $v->precio) - (($v->cantidad * $v->precio)*($v->descuento/100))) ?>
            </td>
        </tr>

    <?php } ?>

    <tr>
        <td colspan="7"
            style="width: 20px; height: 27px; 
                border-left: 1px solid #000000;
                text-align: left; font-size: 13px;"    
        >
            <strong>Total Venta</strong>
        </td>
        <td style="width: 20px; height: 27px; font-size: 12px;">
            <?= $total ?>
        </td>
    </tr>

    <tr>
        <td colspan="8" style="height: 15px;"></td>
    </tr>

    <?php $totalGeneral = $totalGeneral + $total; ?>
    
    <tr>
        <td colspan="7"
            style="width: 20px; height: 27px; 
                border-left: 1px solid #000000;
                text-align: left; font-size: 13px;"    
        >
            <strong>Total General de Ventas</strong>
        </td>
        <td style="width: 20px; height: 27px; font-size: 12px;">
            <?= $totalGeneral ?>
        </td>
    </tr>

    <tr>
        <td colspan="8" style="height: 15px;"></td>
    </tr>

</table>