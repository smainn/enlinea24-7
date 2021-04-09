
<html>

<table>
    
    <thead>

        <tr>
            <th colspan="8" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <strong>Reporte de Producto</strong>
            </th>
        </tr>
    
        <tr>
            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                border-left: 1px solid #000000;
                text-align: center; font-size: 13px;"
            > 
                <strong>Id Producto</strong> 
            </th>
            
            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                text-align: center; font-size: 13px;"
            > 
                <strong> Descripcion </strong>
            </th>

            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                text-align: center; font-size: 13px;"
            >
                <strong> Familia </strong> 
            </th>
            <?php if($esabogado == 'false') { ?>
                
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong> Unidad Medida </strong> 
                </th>

                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong> Stock Actual </strong> 
                </th>

                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong> Stcok Minimo </strong> 
                </th>

                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong> Stock Maximo </strong> 
                </th>
            <?php } ?>

            <th style="width: 20px; height: 27px; 
                border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                border-right: 1px solid #000000;
                text-align: center; font-size: 13px;"
            >
                <strong> Precio Unitario </strong> 
            </th>
            
        </tr>
    </thead>

    <tbody>
        <?php foreach ($producto as $p) { ?>
            <tr>

                <td style="height: 20px; text-align: center;"><?= $p->idproducto ?></td>

                <td style="height: 20px; text-align: center;"><?= $p->producto ?></td>

                <td style="height: 20px; text-align: center;"><?= $p->familia ?></td>

                <?php if($esabogado == 'false') { ?>

                    <td style="height: 20px; text-align: center;"><?= $p->medida ?></td>
                    <td style="height: 20px; text-align: right;"><?= $p->stock ?></td>
                    <td style="height: 20px; text-align: right;"><?= $p->stockminimo ?></td>
                    <td style="height: 20px; text-align: right;"><?= $p->stockmaximo ?></td>
                    
                <?php } ?>

                <td style="height: 20px; text-align: right;"><?= $p->precio ?></td>
                
            </tr>
            
        <?php } ?>

        <tr>
            <td colspan="8" style="width: 20px; height: 20px;"></td>
        </tr>
        
    </tbody>
        
</table>

</html>
