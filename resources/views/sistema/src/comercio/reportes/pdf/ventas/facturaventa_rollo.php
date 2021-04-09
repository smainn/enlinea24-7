
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura</title>

        <style>

            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            body {
                font-size: 12px;
                border: 0px solid black;
                height: auto;
                font-family: 'Roboto', sans-serif;
            }

            .datos-cabezera {
                font-size: 7px;
                border: 0px solid black;
                margin-top: 4px;
                padding-top: 2px;
                padding-bottom: 2px;
            }

            .linea {
                border-bottom: 1px solid black;
                margin-top: 4px;
            }

            .leyenda {
                font-size: 6px;
                text-align: center;
                padding-top: 5px;
                padding-bottom: 5px;
            }

            .body-1 {
                font-size: 7px;
                padding: 5px;
                position: relative;
                top: -2px;
            }

            .leyenda2 {
                font-size: 7px;
                padding-top: 3px;
                padding-left: 5px;
            }

            .leyenda3 {
                font-size: 7px;
                padding-bottom: 2px;
                padding-left: 5px;
                font-style: oblique;
            }

            .qr {
                width: 60px;
                height: 60px;
                margin-left: 50%;
                transform: translateX(-50%);
                margin-top: 0px;
                margin-bottom: 2px;

            }

            .footer {
                font-size: 6px;
                font-weight: bold;
                padding-left: 5px;
                padding-top: 3px;
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

            $years_inicio = date('Y', strtotime($factura->fecha));
            $dia_inicio = date("d", strtotime($factura->fecha));
            $mes_inicio = $meses[date("n", strtotime($factura->fecha)) - 1];
            
        ?>

        <div style="width: 100%; position: relative; top: 20px; padding-left: 8px; padding-right: 5px;">
            <div style="text-align: center; font-weight: bold;">
                <?= ($dosificacion->nombrecomercial == null ? $dosificacion->razonsocial : $dosificacion->nombrecomercial) ?> 
            </div>
            <div style="margin-top: 4px; text-align: center; font-size: 8px; margin-bottom: 4px;">
                <?= ($dosificacion->tiposucursal == 'M' ? 'Casa Matriz' : 'Sucursal') ?> <br />
                <?= ucwords($dosificacion->direccion) ?> <br />
                <?= ucwords($dosificacion->zona) ?> <br />
                <?= $dosificacion->telefono == null ? 'Telf.: '.'S/Telf.': 'Telf.: '.$dosificacion->telefono ?> <br />
                <?= $dosificacion->ciudad.' - '.$dosificacion->pais ?> 
            </div>
            <div style="font-weight: bold;text-align: center;">
                FACTURA
            </div>
            <div class="linea"></div>
            <div class="datos-cabezera">
                <label style="margin-right: 50px;">NIT:</label> <label style="font-size: 7px;"><?= $dosificacion->nit ?></label> <br />
                <label style="margin-right: 20px;">Nº FACTURA:</label> <label style="font-size: 7px;"><?= $factura->numero ?></label> <br />
                <label style="padding-right: 1px;">Nº AUTORIZACION:</label> <label style="font-size: 7px;"><?= $dosificacion->numeroautorizacion ?></label>
            </div>
            <div class="linea"></div>
            <?php if ($venta->notas != null) { ?>
                <div class="leyenda">
                    <?= $venta->notas ?>
                </div>
            <?php } ?>
            <?php $fechas = explode('-', $factura->fecha);?>
            <div class="body-1">
                <label style="margin-right: 13px;">Fecha:</label> <?= $fecha ?> &nbsp;&nbsp; Hora: <?= $hora ?><br />
                <label style="margin-right: 13px;">NIT/CI:</label> <?php echo ($factura->nit == 0 || $factura->nit == null) ? 'S/N' : $factura->nit ?> <br />
                <label style="margin-right: 3px;">Señor(es):</label> <?= ucwords($factura->nombre) ?> <br />
                <!-- Placa: 12000GVD &nbsp;&nbsp; Pais: Bolivia<br /> -->
            </div>

            <div style="font-size: 8px;">
                <table style="width: 100%;">
                    <tr>
                        <th style="font-size: 7px;">CANT.</th>
                        <th style="font-size: 7px;">DETALLE</th>
                        <th style="font-size: 7px;">P.UNIT.</th>
                        <th style="font-size: 7px;">SUBTOTAL</th>
                    </tr>
                    <?php foreach ($detalle as $key => $value) { ?>
                        <tr style="text-align: center;">
                            <td style="text-align: right; padding-right: 4px; font-size: 6px;">
                                <?= number_format($value->cantidad, 2, '.', '') ?>
                            </td>
                            <td style="font-size: 6px;">
                                <?= ucwords($value->producto) ?>
                            </td>
                            <td style="text-align: right; padding-right: 4px; font-size: 6px;">
                                <?= number_format($value->precio, 2, '.', '') ?>
                            </td>
                            <td style="text-align: right; padding-right: 4px; font-size: 6px;">
                                <?php $subtotal = $value->cantidad*$value->precio*($value->descuento/100); ?>
                                <?= number_format((float)round( $value->cantidad*$value->precio -  $value->cantidad*$value->precio*($value->descuento/100) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                            </td>
                        </tr>
                    <?php } ?>
                </table>
                <div style="text-align: right; font-weight: bold; padding-top: 2px;">
                    TOTAL Bs <label style="font-weight: normal;"><?= number_format($venta->total, 2, '.', '') ?></label>
                </div>
            </div>


            <div class="linea"></div>
            <?php $decimal = (number_format($venta->total, 2, '.', '') * 100) % 100 ?>
            <div class="leyenda2">
                SON: <?= ucwords($monto) ?> &nbsp; <?= ($decimal < 10)?'0'.$decimal:$decimal ?>/100 Bolivianos.
            </div>
            <div class="leyenda3" style="margin-top: 5px;"> 
                "<?= $dosificacion->leyenda2piefactura ?>"
            </div>
            <div class="linea"></div>
            <div class="body-1">
                <label style="margin-right: 26px;">CODIGO CONTROL:</label> <?= $factura->codigodecontrol ?> <br />
                <?php $date = explode('-', $dosificacion->fechalimiteemision);?>
                <label style="margin-right: 3px;">FECHA LIMITE DE EMISION:</label> <?= $date[2].'/'.$date[1].'/'.$date[0] ?>
            </div>
            <div class="qr">
                <img src=<?= '.'.$factura->codigoqr ?> style='width: 100%; height: 100%' alt="Sin QR">
            </div>
            <div class="footer">
                "<?= $dosificacion->leyenda1piefactura ?>"
            </div>
        </div>
    </body>
</html>
