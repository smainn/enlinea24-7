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
            font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
            padding-left: 10px;
            font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
            <label style="font-size: 11px;"><?= $fecha.' '.$hora ?></label>
        </div>
    </div>

    <div style="width: 100%; text-align: center; margin-top: 5px;">
        <label style="font-size: 18px; font-weight: bold;">
            ** Balance General **
        </label>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 30px;">
       <label><?php echo $subtitulo ?></label>
    </div>

    <div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>
    <div style="width: 100%; margin-bottom: 20px; padding-top: 20px;">
        <?php 
            $count = count($data);
            $i = 0;
            $espacioRight = 40;
            $espacioLeft = 20;
            $b1 = $b2 = true;
            $sw1 = $sw2 = $sw3 = true;
            $indexC = 0;
            $indexP = -1;
            while ($i < $count) {
                $pxLeft = ($data[$i]->nivelcod - 1) * $espacioLeft;
                $pxRight = ($data[$i]->nivelcod - 1) * $espacioRight;

                if ($data[$i]->tipocuenta == 'A' && $sw1) {
                    $indexA = $i;
                    $sw1 = false;
                } else if ($data[$i]->tipocuenta == 'P' && $sw2) {
                    $indexP = $i;
                    $sw2 = false;
                } else if ($data[$i]->tipocuenta == 'C' && $sw3) {
                    $indexC = $i;
                    $sw3 = false;
                }
        ?>
            
            <?php 
                if ($data[$i]->tipocuenta == 'P' && $b1) {
                    $b1 = false;
            ?>
                <div style="width: 900px; height: 30px;">
                    <div style="width: 300px; display: inline-block;">
                        <label style="font-weight: bold; font-size: 10;">TOTAL ACTIVO</label>
                    </div>
                    <div style="margin-left:50px; width: 300px; display: inline-block; text-align: right;">
                        <label style="font-size: 10;"><?= sprintf("%.2f", round($data[$indexA]->valor, 2)); ?></label>
                    </div>
                </div>
            <?php       
                } else if ($data[$i]->tipocuenta == 'C' && $b2) {
                    $b2 = false;
            ?>  
                <div style="width: 900px; height: 30px;">
                    <div style="width: 300px; display: inline-block;">
                        <label style="font-weight: bold; font-size: 10;">TOTAL PASIVO</label>
                    </div>
                    <div style="margin-left:50px; width: 300px; display: inline-block; text-align: right;">
                        <label style="font-size: 10;"><?= $indexP == -1 ? 0 : sprintf("%.2f", round($data[$indexP]->valor, 2)) ?></label>
                    </div>
                </div>
            <?php   
                }
                if ($data[$i]->nivelcod <= $nivelmax) {
            ?>
            <div style="width: 900px; height: 30px;">
                <div style="width: 300px; display: inline-block; margin-left: <?= $pxLeft ?>px;">
                    <label style="font-weight: bold; font-size: 10;"><?php $codigo = ($showcod == "true" ? $data[$i]->codcuenta : ''); echo $codigo . ' ' . $data[$i]->descripcion ?></label>
                </div>
                <div style="margin-left:50px; width: 300px; display: inline-block; text-align: right;">
                    <label style="font-size: 10; margin-right: <?= $pxRight ?>px;"><?= $data[$i]->nivelcod == 1 ?  '' : sprintf("%.2f", round($data[$i]->valor, 2)); ?></label>
                </div>
            </div>
            <?php
                }
                $i++;
                }
            ?>
        <div style="width: 900px; height: 30px;">
            <div style="width: 300px; display: inline-block;">
                <label style="font-weight: bold; font-size: 10;">TOTAL PATRIMONIO</label>
            </div>
            <div style="margin-left:50px; width: 300px; display: inline-block; text-align: right;">
                <label style="font-size: 10;"><?= $count > 0 ? sprintf("%.2f", round($data[$indexC]->valor, 2)) : 0.00 ?></label>
            </div>
        </div>
        <div style="width: 900px; height: 30px;">
            <div style="width: 300px; display: inline-block;">
                <label style="font-weight: bold; font-size: 10;">TOTAL PASIVO + PATRIMONIO</label>
            </div>
            <div style="margin-left:50px; width: 300px; display: inline-block; text-align: right;">
                <label style="font-size: 10;">
                <?= $count > 0 ? sprintf("%.2f", $indexP == -1 ? round($data[$indexC]->valor, 2) : round($data[$indexP]->valor + $data[$indexC]->valor, 2)) : 0.00 ?>
            </label>
            </div>
        </div>
    </div>
    <div style="width: 700px; height: 150px;"></div>             
    <!--<div style="width: 100%; border: 1px solid #e8e8e8; margin-top: 5px;"></div>-->
    <!--<div style="width: 100%; border: 1px solid black; margin-top: 5px;"></div>-->

</body>
</html>