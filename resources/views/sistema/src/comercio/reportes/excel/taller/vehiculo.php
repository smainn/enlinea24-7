
<table>

<thead>

    <tr>
        <th colspan="5" style="text-align: center; 
            width: 20px; height: 27px; font-size: 16px;">
            <strong>Reporte de Vehiculo</strong>
        </th>
    </tr>

    <tr>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000;
            border-left: 1px solid #000000;
            text-align: center; font-size: 13px;"
        > 
            <strong>Id Vehiculo</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>Placa</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>Cliente</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>Tipo</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            border-right: 1px solid #000000;
            text-align: center; font-size: 13px;"
        >
            <strong>Tipo Uso</strong>
        </th>
    </tr>
</thead>
<tbody>
    <?php foreach($vehiculo as $v) { ?>
        <tr>
            <td style="height: 20px; text-align: center;">
                <?= $v->idvehiculo ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $v->placa ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $v->nombre ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $v->descripcion ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= ($v->tipopartpublic == 'R'?'Privado':'Publico') ?>
            </td>
        </tr>
    <?php } ?>
</tbody>
</table>