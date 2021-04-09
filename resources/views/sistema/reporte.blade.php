
<!DOCTYPE html>
<html lang="es">

<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title> Enlinea24-7 </title>

    <link rel="shortcut icon" href="{{ asset('/template/img/iconoweb.png') }}" type="image/x-icon" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="{{ asset('/vendors/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('/css/module.css') }}">
    
</head>
<body>

    <input type="hidden" id="reporte_data" value='<?=  isset($data) ? $data : '[]' ?>' />
    <input type="hidden" id="reporte_fecha" value='<?=  isset($fecha) ? $fecha : '' ?>' />
    <input type="hidden" id="reporte_hora" value='<?=  isset($hora) ? $hora : '' ?>' />
    <input type="hidden" id="reporte_usuario" value='<?=  isset($usuario) ? $usuario : '' ?>' />
    <input type="hidden" id="reporte_title" value='<?=  isset($title) ? $title : '' ?>' />
    <input type="hidden" id="reporte_logo" value='<?=  isset($logo) ? $logo : '' ?>' />

    <div id="report"></div>

    <script src="{{ asset('/js/report.js') }}"></script>

</body>

</html>
