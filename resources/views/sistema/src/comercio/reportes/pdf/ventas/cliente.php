
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
        border: 1px solid #D2D2D2;
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
    <h1 style="font-weight: bold; font-size: 18px; text-align: center;">
        ** Listado de Clientes **
    </h1>
</div>

<?php
    if ((sizeof($objeto) > 0) and (sizeof($cliente) > 0)) {
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
            <th> Nombre</th>
            <th> Tipo Personeria</th>
            <th> Tipo Cliente</th>
            <th> Nit</th>
            <th> 
                <?= (sizeof($referencia) >= 1)?$referencia[0]->descripcion:'Contacto 1' ?>
            </th>
            <th> 
                <?= (sizeof($referencia) >= 2)?$referencia[1]->descripcion:'Contacto 2' ?>
            </th>

            <th>
                <?= (sizeof($referencia) >= 3)?$referencia[2]->descripcion:'Contacto 3' ?>
            </th>
            
        </tr>
    </thead>

    <tbody>
        <?php $contador = 0; ?>
        <?php foreach($cliente as $c) { ?>
            <tr>

                <td>
                    <?= $c->idcliente ?>
                </td>

                <td>
                    <?= $c->nombre ?>
                </td>

                <td>
                    <?= ($c->tipopersoneria == 'N')?'Natural':'Juridico' ?>
                </td>

                <td>
                    <?= $c->tipocliente?>
                </td>

                <td>
                    <?= $c->nit?>
                </td>

                <td>
                    <?= (sizeof($contactos[$contador]) >= 1)?$contactos[$contador][0]->detalle:'' ?>
                </td>

                <td>
                    <?= (sizeof($contactos[$contador]) >= 2)?$contactos[$contador][1]->detalle:'' ?>
                </td>

                <td>
                    <?= (sizeof($contactos[$contador]) >= 3)?$contactos[$contador][2]->detalle:'' ?>
                </td>

                
            </tr>

            <?php $contador = $contador + 1; ?>
            
        <?php } ?>
        
    </tbody>
</table>
</div>

</html>