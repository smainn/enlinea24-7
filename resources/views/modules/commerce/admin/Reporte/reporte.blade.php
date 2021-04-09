
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
        ** Listado de Vehiculos **
    </h1>
</div>

<div style="width: 100%; padding-bottom: 8px;">
    <table style="width: 100%; border-color: #666666; border-style: dashed; border-width: 1px; padding-top: 5px;">
        <thead>
            <tr>
                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> id</th>
                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Placa</th>
                <th style="padding-bottom: 5px; padding: 2px">Nombre Cliente</th>
                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Tipo</th>
                <th style="padding-bottom: 5px; border-color:#666666; border-right-style: dashed; border-width: 1px; padding: 2px"> Tipo Uso</th>
                
            </tr>
        </thead>

        <tbody>
            @foreach ($vehiculo as $v)
                <tr>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 5px">{{$v->idvehiculo}}</td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 5px">{{$v->placa}}</td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 5px">{{$v->nombre}}</td>

                    <td style="border-color:#666666; border-top-style: dashed; border-right-style: dashed; border-width: 1px; padding: 5px">{{$v->descripcion}}</td>

                    <td style="border-color:#666666; border-top-style: dashed; border-width: 1px; padding: 5px">{{($v->tipopartpublic == 'R'?'Privado':'Publico')}}</td>

                    
                </tr>
                
            @endforeach
            
        </tbody>
    </table>
</div>

<script type="text/php"> 
    if ( isset($pdf) ) {   
        $font = Font_Metrics::get_font("helvetica", "bold"); 
        $pdf->page_text(72, 18, "Header: {PAGE_NUM} of {PAGE_COUNT}", $font, 6, array(0,0,0)); 
    } 
</script>

</html>