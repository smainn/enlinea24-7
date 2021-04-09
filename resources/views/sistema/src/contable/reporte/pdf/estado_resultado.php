
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
            padding-top: 2px;
            padding-right: 3px;
            padding-bottom: 2px;
            padding-left: 10px;
            font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
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
    <?php 
        $name_mes_inicio = '';
        $meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        $years_inicio = date('Y', strtotime($fechainicio));
        $years_fin = date('Y', strtotime($fechafin));
        $bandera = ($years_inicio == $years_fin)?1:0;

        $dia_inicio = date("d", strtotime($fechainicio));
        $mes_inicio = $meses[date("n", strtotime($fechainicio)) - 1];
        $year_inicio = ($bandera == 1)?'':'de '.date('Y', strtotime($fechainicio));

        $dia_fin = date("d", strtotime($fechafin));
        $mes_fin = $meses[date("n", strtotime($fechafin)) - 1];
        $year_fin = date('Y', strtotime($fechafin));
        
    ?>
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
        <label style="font-size: 15px; font-weight: bold;">
            ** ESTADO DE RESULTADOS **
        </label>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px;">
        <label style="font-size: 12px;">
            <?= 'Del '.$dia_inicio.' de '.ucwords($mes_inicio).' '.
                $year_inicio.' al '.$dia_fin.' de '.ucwords($mes_fin).' de '.$year_fin.
                ' Expresado en '.$name_moneda
            ?> 
        </label>
    </div>
    
    <div style="width: 100%; padding: 15px; border-top: 1px solid black;">
        <?php $contador = 0; ?>
        <?php $bandera = 0; ?>
        <?php $sw = 0; ?>
        <?php foreach ($temporal_eerr as $eerr) { ?>
            <div style="width: 100%; padding: 5px; padding-top: 10px;">
                <table class="table-report">
                    <tbody>
                        <?php if ($contador == 0) { 
                            $contador = 1;
                        ?>
                            <tr>
                                <th colspan="2" style="border-top: 1px dashed black; padding: 2px;"></th>
                            </tr>
                            <tr>
                                <th colspan="2" style="border-top: 1px dashed black; padding: 0; padding-bottom: 5px;"></th>
                            </tr>
                        <?php } ?>
                        <?php if ($eerr->codcuenta == null && $sw == 0) { 
                            $contador = 0;
                            $sw = 1;
                        ?>
                            <tr>
                                <th colspan="2" style="border-top: 1px dashed black;"></th>
                            </tr>
                        <?php }else {
                            $sw = 0;
                        } ?>
                        <tr>
                            <th style="font-weight: normal;">
                                <?php if ($eerr->codcuenta != null && $bandera == 1) {?>
                                    <?= ($show_codigo)?$eerr->codcuenta.' '.$eerr->descripcion:$eerr->descripcion ?>
                                <?php }else { 
                                    $bandera = 1;
                                ?>
                                    <strong>
                                        <?= ($show_codigo)?$eerr->codcuenta.' '.$eerr->descripcion:$eerr->descripcion ?>
                                    </strong>
                                <?php } ?>
                            </th>
                            <th style="font-weight: normal; text-align: right; padding-right: 20px;">
                                <?= number_format((float)round( $eerr->valor ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        <?php } ?>
    </div>
    <div style="width: 100%; padding: 15px; border-top: 1px solid black;"></div>

</body>
</html>
