
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
        ** Reporte de Productos **
    </h1>
</div>

<div style="width: 100%; padding-bottom: 8px; padding-top: -30px;">
<table class="table-report">
    
    <thead>

        <tr>
            <th colspan="3" 
                style="border-bottom: 1px solid #e8e8e8; 
                    border-top: 2px solid black; border-left: 2px solid black"
            ></th>
            <?php if($esabogado == false) { ?>
                <th style="border-bottom: 1px solid #e8e8e8; text-align: center;
                    border-top: 2px solid black; border-left: 2px solid black
                "> 
                    Unidad
                </th>
                <th colspan="3" 
                    style="border-bottom: 1px solid #e8e8e8; text-align: center;
                        border-top: 2px solid black; border-left: 2px solid black    
                "> 
                    Stock
                </th>
            <?php } ?>
            <th style="border-bottom: 1px solid #e8e8e8; text-align: center;
                    border-top: 2px solid black; border-left: 2px solid black; border-right: 2px solid black;
            ">
                Precio
            </th>
            
        </tr>
    
        <tr>
            <th style="text-align: center; border-left: 2px solid black;"> 
                Id
            </th>
            <th style="text-align: center;"> 
                Nombre
            </th>
            <th style="text-align: center;"> 
                Familia
            </th>
            <?php if($esabogado == false) { ?>
                <th style="text-align: center; border-left: 2px solid black;"> 
                    Medida
                </th>
                <th style="text-align: center; border-left: 2px solid black;"> 
                    Actual
                </th>
                <th style="text-align: center;"> 
                    Minimo
                </th>
                <th style="text-align: center;"> 
                    Máximo
                </th>
            <?php } ?>
            <th style="text-align: center; border-left: 2px solid black; border-right: 2px solid black;">
                Unitario
            </th>
            
        </tr>
    </thead>

    <tbody>
        <?php foreach ($producto as $p) { ?>
            <tr>

                <td style="border-left: 2px solid black;">
                    <?= $p->idproducto ?></td>
                <td>
                    <?= $p->producto ?>
                </td>
                <td>
                    <?= $p->familia ?>
                </td>

                <?php if($esabogado == false) { ?>

                    <td style="border-left: 2px solid black;">
                        <?= $p->medida ?>
                    </td>
                    <td style="text-align: right; padding-right: 10px; border-left: 2px solid black;">
                        <?= $p->stock ?>
                    </td>
                    <td style="text-align: right; padding-right: 10px;">
                        <?= $p->stockminimo ?>
                    </td>
                    <td style="text-align: right; padding-right: 10px;">
                        <?= $p->stockmaximo ?>
                    </td>

                <?php } ?>    

                <td style="text-align: right; padding-right: 10px; 
                    border-left: 2px solid black; border-right: 2px solid black;">
                    <?= number_format((float)round( $p->precio ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>
                
            </tr>
            
        <?php } ?>
        <tr>
            <?php if($esabogado == false) { ?>
                <td colspan="8" style="border: 1px solid transparent; border-top: 2px solid black;"></td>
            <?php }else { ?>
                <td colspan="4" style="border: 1px solid transparent; border-top: 2px solid black;"></td>
            <?php } ?>
        </tr>
        
    </tbody>
        
</table>
</div>

</html>