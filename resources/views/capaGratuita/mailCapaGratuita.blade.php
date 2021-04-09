<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        .btn {
            background: red;
        }
    </style>
</head>
<body>
    <p>Recibiste un mensaje de: {{ $solicitud['name'] }}</p>
    <p><strong>Apellido: </strong>{{ $solicitud['lastName'] }}</p>
    <p><strong>Empresa: </strong>{{ $solicitud['company'] }}</p>
    <p><strong>Teléfono: </strong>{{ $solicitud['phone'] }}</p>
    <p><strong>Correo: </strong>{{ $solicitud['email'] }}</p>
    <p><strong>Ciudad: </strong>{{ $solicitud['city'] }}</p>
    <p><strong>País: </strong>{{ $solicitud['country'] }}</p>
</body>
</html>