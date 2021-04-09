

<html>

<table>
    
    <thead>
        <tr>
            <th colspan="2" style="text-align: center; 
                width: 70px; height: 27px; font-size: 16px;">
                <strong>Estado Resultado</strong>
            </th>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($data as $p) { ?>
            <tr>
                <td style="height: 20px; width: 40px;">
                    <?= ($show_codigo)?$p->codcuenta.' '.$p->descripcion:$p->descripcion ?>
                </td>
                <td style="height: 20px; text-align: right; width: 20px;">
                    <?= number_format((float)round( $p->valor ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
                </td>
            </tr>s
            
        <?php } ?>

        <tr>
            <td colspan="2" style="width: 70px; height: 20px;"></td>
        </tr>
        
    </tbody>
        
</table>

</html>

