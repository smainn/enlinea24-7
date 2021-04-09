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
    <p>Recibiste un mensaje de: {{ $msg['name'] }}</p>
    <p><strong>Correo: </strong>{{ $msg['email'] }}</p>
    <p><strong>Ciudad: </strong>{{ $msg['city'] }}</p>
    <p><strong>Teléfono: </strong>{{ $msg['phone'] }}</p>
    <p><strong>Asúnto: </strong>{{ $msg['subject'] }}</p>
    <p><strong>Mensaje: </strong>{{ $msg['message'] }}</p>
</body>
</html>