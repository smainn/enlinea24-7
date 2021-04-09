<table>
    <thead>
    <tr>
        <th>Id</th>
        <th>Placa</th>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Tipo Uso</th>
    </tr>
    </thead>
    <tbody>
    @foreach($vehiculo as $v)
        <tr>
            <td>{{ $v->idvehiculo }}</td>
            <td>{{ $v->placa }}</td>
            <td>{{ $v->nombre }}</td>
            <td>{{ $v->descripcion }}</td>
            <td>{{ ($v->tipopartpublic == 'R'?'Privado':'Publico') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>