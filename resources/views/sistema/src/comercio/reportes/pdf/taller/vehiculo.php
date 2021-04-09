
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
        font: bold 12px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        cursor: pointer;
    }
    .table-report tbody {
        width: 100%;
    }
    .table-report tbody tr th,
    .table-report tbody tr td {
        border: 1px solid #D2D2D2;
        padding-left: 15px;
        padding-top: 8px;
        padding-right: 3px;
        padding-bottom: 5px;
        font: 300 11px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    }
    .table-report tbody tr .txt-right,
    .table-report thead tr .txt-right {
        text-align: right; 
        padding-right: 8px;
    }
</style>

<div style="width: 100%; height: 30px;">
    <div style="float: left; position: relative;">
        <img src=<?php echo '.' . $logo ?> alt='none' 
            style="width: 90px; height: 40px; display: block; margin-top: -15px;" />
    </div>
    <div style="float: right;">
        <label style="font-size: 12px;"><?= $fecha ?></label>
    </div>
</div>

<div style="width: 100%; display: flex; justify-content: center; 
        align-items: center;">
    <h1 style="font-weight: bold; font-size: 15px; text-align: center;">
        ** Reporte de Vehiculos ** 
    </h1>
</div>

<?php
    if ((sizeof($objeto) > 0) and (sizeof($vehiculo) > 0)) {
?>

    <table class="table-report" style="margin-bottom: 15px; margin-top: -20px;">
        <tbody>
            <tr>
                <td style="border: 1px solid transparent; text-align: center">
                    
                    <label style="font-weight: bold; font-size: 15px;">
                        <?= $objeto[0]->title ?>
                    </label>
                        &nbsp;&nbsp;
                    <?= $objeto[0]->value ?>
                    
                    <?php if (sizeof($objeto) >= 2) { ?>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label style="font-weight: bold; font-size: 15px;">
                            <?= $objeto[1]->title ?>
                        </label>
                            &nbsp;&nbsp;
                        <?= $objeto[1]->value ?>
                
                    <?php } ?> 

                    <?php if (sizeof($objeto) >= 3) { ?>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label style="font-weight: bold; font-size: 15px;">
                            <?= $objeto[2]->title ?>
                        </label>
                            &nbsp;&nbsp;
                        <?= $objeto[2]->value ?>
                
                    <?php } ?> 

                    <?php if (sizeof($objeto) >= 4) { ?>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label style="font-weight: bold; font-size: 15px;">
                            <?= $objeto[3]->title ?>
                        </label>
                            &nbsp;&nbsp;
                        <?= $objeto[3]->value ?>

                    <?php } ?>
                </td>
            </tr>
        </tbody>
    </table>
    
<?php } ?> 

<div style="width: 100%; padding-bottom: 8px;">
<table class="table-report">
    <thead>
        <tr>
            <th> Id</th>
            <th> Placa</th>
            <th> Cliente</th>
            <th> Tipo Vehiculo</th>
            <th> Tipo Uso</th>
            
        </tr>
    </thead>

    <tbody>
        <?php foreach ($vehiculo as $v) { ?>
            <tr>

                <td><?= $v->idvehiculo ?></td>

                <td><?= $v->placa ?></td>

                <td><?= $v->nombre ?></td>

                <td><?= $v->descripcion ?></td>

                <td><?= ($v->tipopartpublic == 'R')?'Privado':'Publico' ?></td>

                
            </tr>
            
        <?php } ?>
        
    </tbody>
</table>
</div>

</html>