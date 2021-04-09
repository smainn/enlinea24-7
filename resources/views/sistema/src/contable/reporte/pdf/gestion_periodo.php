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
            ** GESTION Y PERIODO **
        </label>
    </div>
    <div style="width: 100%; padding: 5px;">
        <table class="table-report">
            <thead>
                <tr>
                    <td>Gestion</td>
                    <td>Periodo</td>
                    <td>Fecha Inicial</td>
                    <td>Fecha Final</td>
                    <td>Estado</td>
                </tr>
            </thead>
            <tbody>
                <?php foreach($gestion as $g) { ?>
                    <tr>
                        <th><?= $g->descripcion ?></th>
                        <th><?= '-' ?></th>
                        <th><?= date("d/m/Y", strtotime($g->fechaini)) ?></th>
                        <th><?= date("d/m/Y", strtotime($g->fechafin)) ?></th>
                        <th><?= ($g->estado == 'A')?'Activo':'Cerrado' ?></th>
                    </tr>

                    <?php foreach($periodo as $p) { ?>
                        <?php if ($g->idgestioncontable == $p->fkidgestioncontable) { ?>
                            <tr>
                                <th><?= '-' ?></th>
                                <th><?= $p->descripcion ?></th>
                                <th><?= date("d/m/Y", strtotime($p->fechaini)) ?></th>
                                <th><?= date("d/m/Y", strtotime($p->fechafin)) ?></th>
                                <th><?= ($p->estado == 'A')?'Activo':'Cerrado' ?></th>
                            </tr>
                        <?php } ?>
                    <?php } ?>

                <?php } ?>
                
            </tbody>
        </table>
    </div>
</body>
</html>