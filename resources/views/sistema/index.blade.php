
<!DOCTYPE html>
<html lang="es">

<meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title> Enlinea24-7 </title>
    <link rel="shortcut icon" href="{{ asset('/template/img/iconoweb.png') }}" type="image/x-icon" />

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href="{{ asset('/vendors/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">

    <!-- <link rel="stylesheet" href="{{ asset('/css/font-awesome.css') }}"> -->

<!--
    <link href="{{ asset('/plantilla/estilo.css') }}" rel="stylesheet" >

    <link href="{{ asset('/plantilla/componente.css') }}" rel="stylesheet" >
-->

    <link rel="stylesheet" href="{{ asset('/css/module.css') }}">
    
</head>
<body>

    <div id="index"></div>

    <script src="{{ asset('/js/module.js') }}"></script>

    <script >
        var txt="Esta es la primera linea de texto que se desplaza "
        + " y esta es la segunda, puedes poner todas las"
        + " que quieras !                                ";

        function scroll()
        {
            document.letras.w.value = txt;
            txt = txt.substring(1, txt.length) + txt.charAt(0);
            window.setTimeout("scroll()",150);
            console.log(6546)
        }
    </script>

</body>

</html>
