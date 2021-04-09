<!--<h1>Hello World</h1>
<p>
    This view is loaded from module Frontend: {!! config('commerce.name') !!}
</p>-->

<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel React application</title>
    <link href="{{mix('css/commerce.css')}}" rel="stylesheet" type="text/css">
</head>
<body>
<h2 style="text-align: center"> Laravel and React application </h2>
<div id="Commerce"></div>
<script src="{{mix('js/commerce.js')}}" ></script>
</body>
</html>
