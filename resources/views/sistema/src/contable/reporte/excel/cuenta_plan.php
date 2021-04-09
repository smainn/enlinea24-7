
<html>

<table>
    
    <thead>

        <tr>
            <th colspan="3" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <strong>Cuenta Plan</strong>
            </th>
        </tr>
    
        <tr>
            
            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                text-align: center; font-size: 13px;"
            > 
                <strong> COD Cuenta </strong>
            </th>

            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                text-align: center; font-size: 13px;"
            >
                <strong> Nombre </strong> 
            </th>

            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                border-right: 1px solid #000000;
                text-align: center; font-size: 13px;"
            >
                <strong> Tipo </strong> 
            </th>
            
        </tr>
    </thead>

    <tbody>
        <?php foreach ($data as $p) { ?>
            <tr>

                <td style="height: 20px; text-align: center;"><?= $p->codcuenta ?></td>

                <td style="height: 20px; text-align: center;"><?= $p->nombre ?></td>

                <td style="height: 20px; text-align: center;"><?= $p->tipo ?></td>
                
            </tr>
            
        <?php } ?>

        <tr>
            <td colspan="4" style="width: 20px; height: 20px;"></td>
        </tr>
        
    </tbody>
        
</table>

</html>
