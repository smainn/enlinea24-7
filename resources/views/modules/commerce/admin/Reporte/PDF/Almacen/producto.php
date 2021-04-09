
<html>

    <style>
        .table-report {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding-top: 5px;
        }
        .table-report thead {
            width: 100%;
            background: #fff;
            border: 1px solid #D2D2D2;
        }
        .table-report thead tr th,
        .table-report thead tr td {
            padding: 8px;
            padding-left: 12px;
            border-right: 1px solid #D2D2D2;
            font: bold 16px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            cursor: pointer;
        }
        .table-report tbody {
            width: 100%;
            border: 1px solid #D2D2D2;
        }
        .table-report tbody tr th,
        .table-report tbody tr td {
            border: 1px solid #D2D2D2;
            padding-left: 15px;
            padding-top: 8px;
            padding-right: 3px;
            padding-bottom: 5px;
            font: 300 14px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        }
    </style>

    <div style="width: 100%; height: 30px;">
        <div style="float: left;">
            <img src=<?php echo '.' . $logo ?> alt='none' 
                style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
        </div>
        <div style="float: right;">
            <label style="font-size: 12px;"><?= $fecha.' '.$hora ?></label>
        </div>
    </div>

    <div style="width: 100%; display: flex; justify-content: center; 
            align-items: center;">
        <h1 style="font-weight: 100; font-size: 30px; text-align: center;">
            ** Reporte de Productos **
        </h1>
    </div>

<div style="width: 100%; padding-bottom: 8px;">
    <table class="table-report">
        
        <thead>
        
            <tr>
                <th> Id</th>
                <th> Nombre</th>
                <th> Familia</th>
                <?php if($esabogado == 'false') { ?>
                    <th> Unid. Medida</th>
                    <th> Stock Actual</th>
                    <th> Stock Minimo</th>
                    <th>Stock Máximo</th>
                <?php } ?>
                <th>Precio Unitario</th>
                
            </tr>
        </thead>

        <tbody>
            <?php foreach ($producto as $p) { ?>
                <tr>

                    <td><?= $p->idproducto ?></td>
                    <td><?= $p->producto ?></td>
                    <td><?= $p->familia ?></td>

                    <?php if($esabogado == 'false') { ?>

                        <td><?= $p->medida ?></td>
                        <td><?= $p->stock ?></td>
                        <td><?= $p->stockminimo ?></td>
                        <td><?= $p->stockmaximo ?></td>

                    <?php } ?>    

                    <td><?= $p->precio ?></td>
                    
                </tr>
                
            <?php } ?>
            
        </tbody>
            
    </table>
</div>

</html>