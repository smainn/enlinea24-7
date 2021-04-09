
<?php $totalPorCobrar = 0; ?>
<?php $totalCobro = 0; ?>
<table>
    <thead>
    <tr>
        <th>Id Venta</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Vendedor</th>
        <th>Cuota</th>
        <th>Fecha Vencimiento</th>
        <th>Monto Por Cobrar</th>
    </tr>
    </thead>
    <tbody>
    @foreach($venta as $v)
        <tr>
            <td><?= $v->idventa ?></td>
            <td><?= date("d/m/Y", strtotime($v->fecha)) ?></td>
            <td><?= $v->cliente ?></td>
            <td><?= $v->vendedor ?></td>
            <td><?= $v->descripcion ?></td>
            <td><?= date("d/m/Y", strtotime($v->fechaapagar))?></td>
            <td><?= $v->montopagado ?><?php $totalPorCobrar = $totalPorCobrar + $v->montopagado; $totalCobro = $totalCobro + $v->montopagado; ?></td>
        </tr>
    @endforeach
    </tbody>

    <tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total por Cobrar: </td>
            <td><?= $totalPorCobrar ?></td>
        </tr>
    </tbody>
</table>