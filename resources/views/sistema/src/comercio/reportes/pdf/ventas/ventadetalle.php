

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Enlinea24-7</title>
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
                ** REPORTE DE VENTAS DETALLADO **
            </label>
        </div>

        <?php $i = 0; $idprueba = 0; $subtotal = 0; $total= 0; ?>

        <div style="width: 100%; min-width: 100%; max-width: 100%;">
            <?php while ($i < sizeof($venta)) { 
                    $v = $venta[$i];
            ?>
                <div style="width: 100%; display: block; padding: 1px; padding-left: 10px; padding-right: 10px; 
                    border-top: 1px dashed black; border-left: 1px dashed black; border-right: 1px dashed black; margin-top: 20px"
                >
                    &nbsp;


                    <?= $v->idventa.'</br>' ?>
                    <?= date("d/m/Y", strtotime($v->fecha)).'</br>' ?>
                    <?= ucwords($v->almacen).'</br>' ?>
                    <?= ucwords($v->tipo).'</br>' ?>

                    <?php 
                        $index = $i;
                        $idprueba = $v->idventa;
                        $bandera = true;
                        while ($index < sizeof($venta) && $bandera) {

                            if ($idprueba == $venta[$index]->idventa) {
                    ?>
                        <?= $venta[$index]->producto.'</br>' ?>
                        <?php $index = $index + 1;
                            }else {
                                $bandera = false;
                            }
                    ?>
                    <?php } ?>
                </div>
            <?php 
                    $i = $index;
                } 
            ?>
        </div>                       
        </div>
    </body>
</html>

