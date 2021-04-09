
<html>

<div style="width: 100%; border-bottom: 1px solid #e8e8e8; height: 30px;">
    <div style="float: left;">
        <label style="font-size: 18px;">Nombre de la Empresa</label>
    </div>
    <div style="float: right;">
        <label style="font-size: 18px;">{{$fecha}}</label>
    </div>
</div>

<div style="width: 100%; display: flex; justify-content: center; 
        align-items: center;">
    <h1 style="font-weight: 100; font-size: 30px; text-align: center;">
        ** Listado de Ventas **
    </h1>
</div>

<?php $totalVenta = 0; ?>

<?php $totalCobrado = 0; ?>

<?php $totalPorCobrar = 0; ?>

<div style="width: 100%; padding-bottom: 8px;">
    <table style="width: 100%; border-color: #666666; border-style: dashed; border-width: 1px; padding-top: 5px;">
        
        <thead>
        
            <tr>
                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> id</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Fecha</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Cliente</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Tipo</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Vendedor</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px">Monto Total</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px">Monto Cobrado</th>

                <th style="padding-bottom: 5px; border-color:#666666; border-width: 1px; padding: 2px">Monto Por Cobrar</th>
                
            </tr>
        </thead>

        <tbody>
            @foreach ($venta as $v)
                <tr>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px">{{$v->idventa}}</td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= date("d/m/Y", strtotime($v->fecha)) ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $v->cliente ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= ($v->estadoproceso ==='E')?'Contado':'Credito' ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $v->vendedor ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $v->total ?><?php $totalVenta = $totalVenta + $v->total; ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $v->mtototcobrado ?><?php $totalCobrado = $totalCobrado + $v->mtototcobrado ?></td>

                    <td style="border-color:#666666; border-top-style: dashed; border-width: 1px; padding: 2px"><?= ($v->total - $v->mtototcobrado) ?><?php $totalPorCobrar = $totalPorCobrar + ($v->total - $v->mtototcobrado) ?></td>
                    
                </tr>
                
            @endforeach
            
        </tbody>
            
        <tbody>
            <tr>

                <td style="border-color:#666666; border-top-style: dashed; border-width: 1px;"></td>

                <td style="border-color:#666666; border-top-style: dashed; border-width: 1px;"></td>

                <td style="border-color:#666666; border-top-style: dashed; border-width: 1px;"></td>

                <td style="border-color:#666666; border-top-style: dashed; border-width: 1px;"></td>

                <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"> Totales:</td>

                <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $totalVenta ?></td>

                <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 2px"><?= $totalCobrado ?></td>

                <td style="border-color:#666666; border-top-style: dashed; border-width: 1px; padding: 2px"><?= $totalPorCobrar ?></td>

            </tr>
        </tbody>
    </table>
</div>



</html>