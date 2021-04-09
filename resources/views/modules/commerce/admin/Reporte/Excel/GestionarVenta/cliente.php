

    <table>
        <thead>
            <tr>
                <th colspan="8" style="text-align: center; 
                    width: 20px; height: 27px; font-size: 16px;">
                    <strong>Reporte de Cliente</strong>
                </th>
            </tr>
            <tr>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000;
                    border-left: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong>Id Cliente</strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Nombre</strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Tipo Personeria</strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Tipo Cliente</strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>Nit</strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>
                        <?= (sizeof($contactos[0]) >= 1)?$contactos[0][0]->descripcion:'Contacto 1' ?>
                    </strong>
                </th>
                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    text-align: center; font-size: 13px;"
                >
                    <strong>
                        <?= (sizeof($contactos[0]) >= 2)?$contactos[0][1]->descripcion:'Contacto 2' ?>
                    </strong>
                </th>

                <th style="width: 20px; height: 27px; 
                    border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
                    border-right: 1px solid #000000;
                    text-align: center; font-size: 13px;"
                >
                    <strong>
                        <?= (sizeof($contactos[0]) >= 3)?$contactos[0][2]->descripcion:'Contacto 3' ?>
                    </strong>
                </th>
                
            </tr>
        </thead>

        <tbody>
            <?php $contador = 0; ?>
            <?php foreach($cliente as $c) { ?>
                <tr>

                    <td style="height: 20px; text-align: center;">
                        <?= $c->idcliente ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $c->nombre ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= ($c->tipopersoneria == 'N')?'Natural':'Juridico' ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $c->tipocliente?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= $c->nit?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= (sizeof($contactos[$contador]) >= 1)?$contactos[$contador][0]->detalle:'' ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= (sizeof($contactos[$contador]) >= 2)?$contactos[$contador][1]->detalle:'' ?>
                    </td>

                    <td style="height: 20px; text-align: center;">
                        <?= (sizeof($contactos[$contador]) >= 3)?$contactos[$contador][2]->detalle:'' ?>
                    </td>
                    
                </tr>

                <?php $contador = $contador + 1; ?>
                
            <?php } ?>
            
        </tbody>
    </table>
