
<!DOCTYPE html>

<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Enlinea24-7</title>
    </head>
    <body>

        <div style="width: 100%; height: 30px;">
            <div style="float: left;">
                <img src=<?php echo '.' . $logo ?> alt='none'  style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
            </div>
            <div style="float: right; display: block; width: 40px; margin-top: -15px; text-align: center;">
                <div style="font-size: 10px;"><?= $fecha ?></div>
                <div style="font-size: 10px;"><?= $hora ?></div>
            </div>
        </div>

        <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px; border-bottom: 1px dashed black;">
            <label style="font-size: 15px; font-weight: bold;">
                ** REPORTE DE COMPRAS DETALLADA **
            </label>
        </div>

        <div style="width: 100%; min-width: 100%; max-width: 100%;">
                     
            <?php 

                $i = 0;
                $idprueba = 0;
                $subtotal = 0;
                $total= 0;

                while ($i < sizeof($compra)) { 
                    $c = $compra[$i];
                    $idcompra = $c->idcompra;
                    $txtCompraCodID = 'ID Compra';
                    if ($codigospropios) {
                        if ($c->codcompra != null) {
                            $idcompra = $c->codcompra;
                            $txtCompraCodID = 'COD Compra';
                        }
                    }
                    $tipocompra = 'Contado';
                    if ($c->tipo == 'R') {
                        $tipocompra = 'Credito';
                    }
                    
                    $idproducto = $c->idproducto;
                    $txtProductoCodID = 'ID Producto';
                    if ($codigospropios) {
                        if ($c->codproducto != null) {
                            $idproducto = $c->codproducto;
                            $txtProductoCodID = 'COD Producto';
                        }
                    }
            ?>                   

                <div style="width: 100%; display: block; padding: 1px; padding-left: 10px; padding-right: 10px; 
                    border-top: 1px dashed black; border-left: 1px dashed black; border-right: 1px dashed black; margin-top: 20px"
                >
                    &nbsp;
                    <div style="width: 100%; margin-top: -10px; border-top: 1px dashed black;">&nbsp;</div>
                    <div style="width: 100%; margin-top: -10px; position: relative; top: -7px; border-top: 1px dashed black;">&nbsp;</div>
                    <div style="width: 100%; margin-top: -10px; position: relative; top: -7px; border: 1px dashed black;">
                        <div style="width: 100%; display: flex">
                            <div style="width: 25%; position: relative;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black; border-bottom: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= $txtCompraCodID.': ' ?>
                                    </strong>
                                    <label style="font-size: 12px; font-family: Roboto;">
                                        <?= $idcompra ?>
                                    </label>
                                </div>
                            </div>
                            <div style="width: 20%; margin-left: 25%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black; border-bottom: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Fecha: ' ?>
                                    </strong>
                                    <label style="font-size: 12px; font-family: Roboto;">
                                        <?= date("d/m/Y", strtotime($c->fecha)) ?>
                                    </label>
                                </div>
                            </div>
                            <div style="width: 20%; margin-left: 45%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black; border-bottom: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Tipo: ' ?>
                                    </strong>
                                    <label style="font-size: 12px; font-family: Roboto;">
                                        <?= $tipocompra ?>
                                    </label>
                                </div>
                            </div>
                            <div style="width: 35%; margin-left: 65%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-bottom: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Almacen: ' ?>
                                    </strong>
                                    <label style="font-size: 12px; font-family: Roboto;">
                                        <?= ucwords($c->almacen) ?>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div style="width: 100%; display: flex">
                            <div style="width: 100%; position: relative;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Proveedor: ' ?>
                                    </strong>
                                    <label style="font-size: 12px; font-family: Roboto;">
                                        <?= ucwords($c->proveedor) ?>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 100%; border: 1px dashed black;">
                        <div style="width: 100%; display: flex">
                            <div style="width: 15%; position: relative;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= $txtProductoCodID.' ' ?>
                                    </strong>
                                </div>
                            </div>
                            <div style="width: 30%; margin-left: 15%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Producto ' ?>
                                    </strong>
                                </div>
                            </div>
                            <div style="width: 15%; margin-left: 45%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Unid. Med. ' ?>
                                    </strong>
                                </div>
                            </div>
                            <div style="width: 10%; margin-left: 60%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Cantidad ' ?>
                                    </strong>
                                </div>
                            </div>
                            <div style="width: 15%; margin-left: 70%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Costo Unit. ' ?>
                                    </strong>
                                </div>
                            </div>
                            <div style="width: 15%; margin-left: 85%; position: absolute;">
                                <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;">
                                    <strong style="font-size: 12px; font-family: Roboto;">
                                        <?= 'Costo Total ' ?>
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <?php
                        $index = $i;
                        $idprueba = $c->idcompra;
                        $bandera = true;
                        $nota = '';
                        while ($index < sizeof($compra) && $bandera) {

                            if ($idprueba == $compra[$index]->idcompra) {
                            
                                $idproducto = $compra[$index]->idproducto;
                                if ($codigospropios) {
                                    if ($compra[$index]->codproducto != null) {
                                        $idproducto = $compra[$index]->codproducto;
                                    }
                                }
                                $subtotal = $subtotal + $compra[$index]->cantidad * $compra[$index]->costounit;
                                $nota = $compra[$index]->notas;
                    ?>
                                <div style="width: 100%; display: flex"> 
                                    <div style="width: 15%; position: relative;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= $idproducto ?>
                                            </label>
                                        </div>
                                    </div>
                                    <div style="width: 30%; margin-left: 15%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black; border-bottom: 1px dashed black;">
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= ucwords($compra[$index]->producto) ?>
                                            </label>
                                        </div>
                                    </div>
                                    <div style="width: 15%; margin-left: 45%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; border-right: 1px dashed black; border-bottom: 1px dashed black;">
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= ucwords($compra[$index]->unidadmedida) ?>
                                            </label>
                                        </div>
                                    </div>
                                    <div style="width: 10%; margin-left: 60%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= number_format((float)round( $compra[$index]->cantidad ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                    <div style="width: 15%; margin-left: 70%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= number_format((float)round( $compra[$index]->costounit ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                    <div style="width: 15%; margin-left: 85%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= number_format((float)round( $compra[$index]->cantidad * $compra[$index]->costounit ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                    <?php
                                $index = $index + 1;
                            }else {
                                $bandera = false;
                    ?>
                                <div style="width: 100%; display: flex">
                                    <div style="width: 85%; position: relative;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: right;"
                                        >
                                            <strong style="font-size: 12px; font-family: Roboto;">
                                                TOTAL COMPRA: 
                                            </strong>
                                        </div>
                                    </div>
                                    <div style="width: 15%; margin-left: 85%; position: absolute;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= number_format((float)round( $subtotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div style="width: 100%; display: flex;">
                                    <div style="width: 100%; position: relative;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: left;"
                                        >
                                            <strong style="font-size: 12px; font-family: Roboto;">
                                                Notas: 
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 100%; display: flex;">
                                    <div style="width: 100%; position: relative;">
                                        <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                                            border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: left;"
                                        >
                                            <label style="font-size: 12px; font-family: Roboto;">
                                                <?= $nota; ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div style="width: 100%; border-bottom: 1px dashed black;">&nbsp;</div>
                    <?php
                                $total = $total + $subtotal;
                                $subtotal = 0;
                            }
                        }
                        $i = $index;
                    ?>
                    
                </div>
                
            <?php 
                }
            ?>

            <div style="width: 100%; display: flex; padding-left: 11px; padding-right: 11px;">
                <div style="width: 85%; position: relative;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                        border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: right;"
                    >
                        <strong style="font-size: 12px; font-family: Roboto;">
                            TOTAL COMPRA: 
                        </strong>
                    </div>
                </div>
                <div style="width: 15%; margin-left: 85%; position: absolute;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                        border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                    >
                        <label style="font-size: 12px; font-family: Roboto;">
                            <?= number_format((float)round( $subtotal ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </label>
                    </div>
                </div>
            </div>

            <div style="width: 100%; display: flex; padding-left: 11px; padding-right: 11px;">
                <div style="width: 100%; position: relative;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                        border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: left;"
                    >
                        <strong style="font-size: 12px; font-family: Roboto;">
                            Notas: 
                        </strong>
                    </div>
                </div>
            </div>
            <div style="width: 100%; display: flex; padding-left: 11px; padding-right: 11px;">
                <div style="width: 100%; position: relative;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                        border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: left;"
                    >
                        <label style="font-size: 12px; font-family: Roboto;">
                            <?= $compra[$i - 1]->notas; ?>
                        </label>
                    </div>
                </div>
            </div>

            <?php
                $total = $total + $subtotal;
            ?>

            <div style="width: 100%; display: flex; padding-left: 11px; padding-right: 11px; margin-top: 5px;">
                <div style="width: 85%; position: relative;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px;  padding-right: 10px;
                        border-right: 1px dashed black; border-bottom: 1px dashed black; border-left: 1px dashed black; text-align: right;"
                    >
                        <strong style="font-size: 12px; font-family: Roboto;">
                            TOTAL GENERAL DE COMPRAS: 
                        </strong>
                    </div>
                </div>
                <div style="width: 15%; margin-left: 85%; position: absolute;">
                    <div style="width: 100%; padding-top: 5px; padding-bottom: 5px; padding-left: 4px; 
                        border-right: 1px dashed black; border-bottom: 1px dashed black; text-align: right; padding-right: 7px;"
                    >
                        <label style="font-size: 12px; font-family: Roboto;">
                            <?= number_format((float)round( $total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                        </label>
                    </div>
                </div>
            </div>

        </div>
        
    </body>
</html>