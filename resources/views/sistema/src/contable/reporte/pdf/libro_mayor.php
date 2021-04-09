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
        <label style="font-size: 18px; font-weight: bold;">
            ** LIBRO MAYOR **
        </label>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px;">
        <label style="font-size: 14px;">
            <?= 'Del '.$dia_inicio.' de '.ucwords($mes_inicio).' '.
                $year_inicio.' al '.$dia_fin.' de '.ucwords($mes_fin).' de '.$year_fin.
                ' Expresado en '.$name_moneda
            ?> 
        </label>
        
    </div>

    <?php $posicion = 0; ?>

    <?php $debe = 0; //del 1 de enero de año al 5 de diciembre de año Expresado en $ ?>
    <?php $haber = 0; ?>
    <?php $saldo = 0; ?>


    <?php while ($posicion < sizeof($libro_mayor)) { ?>

        <?php $libro = $libro_mayor[$posicion]; ?>

        <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>

            <div style="width: 100%; padding: 5px; padding-top: 15px;">
                <table class="table-report">
                    <tbody>
                        <tr>
                            <th>
                                <strong>Cod Cuenta: </strong> <?= $libro->codcuenta ?>
                            </th>
                            <th>
                                <strong>Cuenta: </strong> <?= $libro->nombre ?>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="width: 100%; padding: 5px;">
                <table class="table-report">
                    <tbody>
                        <tr>
                            <th style="text-align: right; padding-right: 5px;">
                                <strong>Saldo anterior:</strong> <?= number_format((float)round( $libro->saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
           
        <?php } ?>

        <?php $posicion = $posicion + 1; ?>

        <?php if ($posicion < sizeof($libro_mayor)) { ?>
            
            <?php $libro = $libro_mayor[$posicion]; ?>
            <?php $bandera = true; ?>

            <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>

                <div style="width: 100%; border-top: 2px double black; margin-top: 5px;"></div>

            <?php } else { ?>
                
                <div style="width: 100%; padding: 5px;">
                    <table class="table-report">
                        <thead>
                            <tr>
                                <td>Fecha</td>
                                <td>Tipo</td>
                                <td>Numero</td>
                                <td>Glosa</td>
                                <td>Concepto</td>
                                <td>Cheque</td>
                                <td>Debe</td>
                                <td>Haber</td>
                                <td>Saldo</td>
                            </tr>
                        </thead>
                        <tbody>

                            <?php while (($posicion < sizeof($libro_mayor)) && ($bandera)) { ?>

                                <?php $libro = $libro_mayor[$posicion]; ?>

                                <?php if (($libro->debe == 0) && ($libro->haber == 0)) { ?>

                                    <?php $bandera = false; ?>

                                <?php }else { ?>

                                    <tr>
                                        <th style="text-align: left; padding-left: 5px;"><?= date("d/m/Y", strtotime($libro->fecha)) ?></th>
                                        <th style="text-align: left; padding-left: 5px;"><?= $libro->tipo ?></th>
                                        <th style="text-align: right; padding-right: 10px;"><?= $libro->numero ?></th>
                                        <th style="text-align: left; padding-left: 5px;"><?= $libro->glosa ?></th>
                                        <th style="text-align: left; padding-left: 5px;"><?= $libro->concepto ?></th>
                                        <th style="text-align: right; padding-right: 10px;"><?= $libro->cheque ?></th>
                                        <th style="text-align: right; padding-right: 5px;">
                                            <?= number_format((float)round( $libro->debe ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                        </th>
                                        <th style="text-align: right; padding-right: 10px;">
                                            <?= number_format((float)round( $libro->haber ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                        </th>
                                        <th style="text-align: right; padding-right: 10px;">
                                            <?= number_format((float)round( $libro->saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                        </th>
                                    </tr>

                                    <?php $posicion = $posicion + 1; ?>

                                    <?php $debe = $debe + $libro->debe; ?>
                                    <?php $haber = $haber + $libro->haber; ?>
                                    <?php $saldo = $libro->saldo; ?>

                                <?php }?>

                            <?php }?>

                            <tr>
                                <th colspan='6' style="text-align: right; padding-right: 5px;">
                                    <strong>Total</strong>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= number_format((float)round( $debe ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= number_format((float)round( $haber ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= '-' ?>
                                </th>
                            </tr>

                            <tr>
                                <th colspan='6' style="text-align: right; padding-right: 5px;">
                                    <strong>Saldo <?= ($saldo > 0)?'Acreedor':'Deudor' ?></strong>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= ($saldo < 0)?
                                        number_format((float)round( $saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',','):
                                        '-' 
                                    ?>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= ($saldo > 0)?
                                        number_format((float)round( $saldo ,2, PHP_ROUND_HALF_DOWN),2,'.',','):'-' 
                                    ?>
                                </th>
                                <th style="text-align: right; padding-right: 5px;">
                                    <?= '-' ?>
                                </th>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

                <div style="width: 100%; border-top: 2px double black; margin-top: 5px;"></div>

            <?php } ?>

        <?php } ?>

        <?php $debe = 0; ?>
        <?php $haber = 0; ?>
        <?php $saldo = 0; ?>

    <?php }?>

</body>
</html>