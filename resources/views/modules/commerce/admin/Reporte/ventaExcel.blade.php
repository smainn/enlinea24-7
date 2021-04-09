<?php $totalVenta = 0; ?>
<?php $totalCobrado = 0; ?>
<?php $totalPorCobrar = 0; ?>
<table>
    <thead>
    <tr>
        <th>Id</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Tipo Venta</th>
        <th>Vendedor</th>
        <th>Monto Total</th>
        <th>Monto Cobrado</th>
        <th>Monto Por Cobrar</th>
    </tr>
    </thead>
    <tbody>
    @foreach($venta as $v)
        <tr>
            <td>{{ $v->idventa }}</td>
            <td><?= date("d/m/Y", strtotime($v->fecha)) ?></td>
            <td><?= $v->cliente ?></td>
            <td><?= ($v->estadoproceso == 'E')?'Contado':'Credito' ?></td>
            <td><?= $v->vendedor ?></td>
            <td><?= $v->total ?><?php $totalVenta = $totalVenta + $v->total; ?></td>
            <td><?= $v->mtototcobrado ?><?php $totalCobrado = $totalCobrado + $v->mtototcobrado; ?></td>
            <td><?= ($v->total - $v->mtototcobrado) ?><?php $totalPorCobrar = $totalPorCobrar + ($v->total - $v->mtototcobrado); ?></td>
        </tr>
    @endforeach
    </tbody>

    <tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Totales: </td>
            <td><?= $totalVenta ?></td>
            <td><?= $totalCobrado ?></td>
            <td><?= $totalPorCobrar ?></td>
        </tr>
    </tbody>
</table>