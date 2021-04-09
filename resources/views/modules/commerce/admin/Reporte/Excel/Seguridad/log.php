
<table>

<thead>

    <tr>
        <th colspan="7" style="text-align: center; 
            width: 20px; height: 27px; font-size: 16px;">
            <strong>LOG DEL SISTEMA</strong>
        </th>
    </tr>

    <tr>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000;
            border-left: 1px solid #000000;
            text-align: center; font-size: 13px;"
        > 
            <strong>ID Log</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>Fecha Cliente</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>Hora Cliente</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            text-align: center; font-size: 13px;"
        >
            <strong>ID User</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            border-right: 1px solid #000000;
            text-align: center; font-size: 13px;"
        >
            <strong>Login User</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            border-right: 1px solid #000000;
            text-align: center; font-size: 13px;"
        >
            <strong>Accion Hecha</strong>
        </th>
        <th style="width: 20px; height: 27px; 
            border-top: 1px solid #000000; border-bottom: 1px solid #000000; 
            border-right: 1px solid #000000;
            text-align: center; font-size: 13px;"
        >
            <strong>IP Cliente</strong>
        </th>
    </tr>
</thead>
<tbody>
    <?php foreach($log as $l) { ?>
        <tr>
            <td style="height: 20px; text-align: center;">
                <?= $l->idlog ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= date("d/m/Y", strtotime($l->fechacliente)) ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $l->horacliente ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $l->idusr ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $l->loginusr ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $l->accionhecha ?>
            </td>
            <td style="height: 20px; text-align: center;">
                <?= $l->ipcliente ?>
            </td>
        </tr>
    <?php } ?>
</tbody>
</table>