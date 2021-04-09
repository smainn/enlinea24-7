<!DOCTYPE html>
<html lang="en">

<!-- Mirrored from colorlib.com/polygon/gentelella/index.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 20 Dec 2018 02:27:27 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title> Proyecto </title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Bootstrap -->
    <link href="{{ asset('/vendors/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('/css/font-awesome.css') }}" rel="stylesheet">
    <!-- NProgress -->
    <link href="{{ asset('/vendors/nprogress/nprogress.css') }}" rel="stylesheet">
    <!-- iCheck -->
    <link href="{{ asset('/vendors/iCheck/skins/flat/green.css') }}" rel="stylesheet">

    <!-- bootstrap-progressbar -->
    <link href="{{ asset('/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css') }}" rel="stylesheet">
    <!-- JQVMap -->
    <link href="{{ asset('/vendors/jqvmap/dist/jqvmap.min.css') }}" rel="stylesheet"/>
    <!-- bootstrap-daterangepicker -->
    <link href="{{ asset('/vendors/bootstrap-daterangepicker/daterangepicker.css') }}" rel="stylesheet">

    <!-- Custom Theme Style -->

    <link href="{{ asset('/css/hint.css') }}" rel="stylesheet">

    <link href="{{ asset('/build/css/custom.min.css') }}" rel="stylesheet">

    <style>
        .table-content{
            width: 100%;
            padding: 10px;
            margin-top: 10px;
        }
        .table-content .table-responsive-content{
            width: 100%;
            border-radius: 5px;
            text-align: center;
            border-collapse: collapse;
            border-spacing: 0;
            color: #16181b;
            box-shadow: 0 8px 4px 5px rgba(0, 0, 0, .12);
            transition: all .4s ease;
        }
        .table-content .table-responsive-content tr{
            width: 100%;
            background: #fff;
        }
        .table-content .table-responsive-content tr:nth-child(2n){
            background: #f2f2f2;
        }
        .table-content .table-responsive-content .row-header{
            background: rgba(0, 0, 0, .08);
        }


        .table-content .table-responsive-content th,
        .table-content .table-responsive-content td{
            padding: .75rem;
            vertical-align: top;
            border: 1px solid #dee2e6;
        }
        .table-content .table-responsive-content .row-header th{
            padding: 15px;
            text-align: center;
            font-size: 16px;
            border: none;
        }

        .table-content .table-responsive-content .col-show{
            display: none;
        }

        /* body table */

        .card-body-content{
            width: 100%;
            padding: 15px;
            background: #fff;
            border-top: 2px solid #113049;
            border-radius: 5px;
            margin-bottom: 10px;
            max-width: 1220px;
            display: table;
        }

        .pull-right-content{
            float: right;
        }

        .pull-left-content{
            float: left;
        }

        .title-logo-content{
            display: inline-table;
            font-size: 25px;
            margin-left: 10px;
            margin-right: 10px;
        }
        .title-lg-content{
            display: inline-table;
            font-size: 15px;
            margin-left: 10px;
            margin-right: 10px;
        }

        .btn.btn-primary-content{
            padding: 0 20px;
            height: 35px;
            line-height: 35px;
            border: none;
            color: #fff;
            background: #2A3F54;
            border-radius: 5px;
            font-family: sans-serif;
            transition: .3s ease all;
            cursor: pointer;
            margin-top: 7px;
        }

        .btn.btn-primary-content:hover{
            background: #EDEDED;
            color: #2A3F54;
            border: 1px solid #2A3F54;
        }


        /* header table */

        .card-header-content{
            width: 100%;
            padding: 10px;
            background: #fff;
            border-top: 2px solid #1ABB9C;
            border-radius: 5px;
            margin-bottom: 10px;
            max-width: 1220px;
            display: table;
        }

        .form-control-sm-content{
            display: inline-table;
            width: 90px;
            height: 35px;
            line-height: 35px;
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: #303F9F;
            outline: none;
            background: none;
            border: none;
            border-bottom: 2px solid #BBDEFB;
            border-radius: 5px;
            transition: .4s ease all;
        }

        .form-control-sm-content option{
            background: rgba(0, 0, 0, .02);
        }

        .form-control-sm-content:focus{
            border-bottom: 2px solid #303F9F;
        }
        .form-control-sm-content:hover{
            border-bottom: 2px solid #1ABB9C;
        }
        .form-control-md-content{
            width: 200px;
            height: 35px;
            line-height: 35px;
            padding: 5px 21px 5px 5px;
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: #303F9F;
            outline: none;
            background: none;
            border: none;
            border-bottom: 2px solid #BBDEFB;
            border-radius: 5px;
            transition: .4s ease all;
        }

        .form-control-md-content:hover{
            border-bottom: 2px solid #1ABB9C;
        }
        .form-control-md-content:focus{
            border-bottom: 2px solid #303F9F;
        }

        .input-fa{
            position: relative;
            right: 18px;
        }

        /* ------------------------------------ */

        /* ----------- btn btn-sm button --------------------------- */


        .btn.btn-sm{
            outline: none;
            border: transparent;
            border-radius: 4px;
            width: 24px;
            height: 22px;
            line-height: 22px;
            display: inline-table;
            text-align: center;
            color: #fff;
            transition: all .4s ease;
        }
        .btn.btn-sm.btn-default-content{
            border: transparent;
            background: #113049;
        }
        .btn.btn-sm.btn-default-content:hover{
            background: rgba(0, 0, 0, .12);
            color: #113049;
        }
        .btn.btn-sm.btn-danger-content{
            background: red;
        }
        .btn.btn-sm.btn-danger-content:hover{
            background: rgba(0, 0, 0, .12);
            color: red;
        }
        .btn.btn-sm.btn-success-content{
            background: #1ABB9C;
        }
        .btn.btn-sm.btn-success-content:hover{
            background: rgba(0, 0, 0, .12);
            color: #1ABB9C;
        }


        /* ----------------------------------------------------------------------- */

        /*-------------------- Col y row -------------------- */

        .row-content{
            width: 100%;
            margin-top: 57px;
            padding: 1px;
        }

        .form-group-content{
            width: 100%;
            padding: 1px;
            margin-bottom: 5px;
            max-width: 1220px;
            display: table;
        }

        [class*="col-"]{
            border: 1px solid black;
            padding: 4px;
            float: left;
        }

        @media (min-width: 1200px) {
            .col-lg-12-content{  width: 100%;  }
            .col-lg-10-content{  width: 83.33333333%;  }
            .col-lg-9-content{  width: 75%;  }
            .col-lg-8-content{  width: 66.66666667%;  }
            .col-lg-6-content{  width: 50%;  }
            .col-lg-5-content{  width: 41.66666667%;  }
            .col-lg-4-content{  width: 33.33333333%;  }
            .col-lg-3-content{  width: 25%;  }
            .col-lg-2-content{  width: 16.66666667%;  }
        }

        @media (max-width: 1199px) and (min-width: 992px){
            .col-md-12-content{  width: 100%;  }
            .col-md-10-content{  width: 83.33333333%;  }
            .col-md-9-content{  width: 75%;  }
            .col-md-8-content{  width: 66.66666667%;  }
            .col-md-6-content{  width: 50%;  }
            .col-md-5-content{  width: 41.66666667%;  }
            .col-md-4-content{  width: 33.33333333%;  }
            .col-md-3-content{  width: 25%;  }
            .col-md-2-content{  width: 16.66666667%;  }
        }

        @media (max-width: 991px) and (min-width: 768px){
            .col-sm-12-content{  width: 100%;  }
            .col-sm-10-content{  width: 83.33333333%;  }
            .col-sm-9-content{  width: 75%;  }
            .col-sm-8-content{  width: 66.66666667%;  }
            .col-sm-6-content{  width: 50%;  }
            .col-sm-5-content{  width: 41.66666667%;  }
            .col-sm-4-content{  width: 33.33333333%;  }
            .col-sm-3-content{  width: 25%;  }
            .col-sm-2-content{  width: 16.66666667%;  }
        }

        @media (max-width: 767px){
            .col-xs-12-content{  width: 100%;  }
            .col-xs-10-content{  width: 83.33333333%;  }
            .col-xs-9-content{  width: 75%;  }
            .col-xs-8-content{  width: 66.66666667%;  }
            .col-xs-6-content{  width: 50%;  }
            .col-xs-5-content{  width: 41.66666667%;  }
            .col-xs-4-content{  width: 33.33333333%;  }
            .col-xs-3-content{  width: 25%;  }
            .col-xs-2-content{  width: 16.66666667%;  }
        }

        /* ------------------------ input general ----------------------------- */

        .input-group-content{
            position: relative;
        }

        .form-control-content{
            width: 100%;
            border: none;
            outline: none;
            background: none;
            border-bottom: 2px solid #BBDEFB;
            padding: 1px 21px 5px 15px;
            background: rgba(0, 0, 0, .01);
            border-radius: 5px;
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            color: rgba(0, 0, 0, .75);
            transition: all .4s ease;
        }

        .form-control-content:hover,
        .form-control-content:focus{
            outline: none;
            background: #fff;
            border-bottom: 2px solid #303F9F;
        }

        .form-control-content.error{
            border-bottom: 2px solid red;
            background: MistyRose;
        }

        .form-control-content.warning{
            border-bottom: 2px solid orange;
        }

        .form-control-content.error + .label-content{
            color: red;
        }

        .label-content{
            font-size: 17px;
            line-height: 17px;
            margin-left: 25px;
            margin-top: 8px;
            margin-bottom: 5px;
            transition: all .5s ease;
        }

        .label-content.active{
            top: -10px;
            font-size: 12px;
            line-height: 12px;
            color: #B6B6B6;
        }

        .formulario-content{
            width: 100%;
            background: #fff;
            border-radius: 5px;
            border-top: 2px solid #1ABB9C;
            padding: 2px;
            margin: auto;
        }

        .text-center-content{
            width: 100%;
            text-align: center;
            position: relative;
        }

        .btn-content.btn-success-content{
            width: 100px;
            height: 35px;
            line-height: 32px;
            outline: none;
            background: none;
            color: #FFF;
            background-color: #1ABB9C;
            border-radius: 5px;
            transition: all .4s ease;
            border: 1px solid transparent;
            margin-left: 10px;
        }

        .btn-content.btn-primary-content{
            width: 100px;
            height: 35px;
            line-height: 32px;
            outline: none;
            background: none;
            color: #FFF;
            background-color: #303F9F;
            border-radius: 5px;
            transition: all .4s ease;
            border: 1px solid transparent;
            margin-left: 10px;
        }

        .btn-content.btn-danger-content{
            width: 100px;
            height: 35px;
            line-height: 32px;
            outline: none;
            background: none;
            color: #FFF;
            background-color: red;
            border-radius: 5px;
            transition: all .4s ease;
            border: 1px solid transparent;
            margin-left: 10px;
        }

        .btn-content.btn-success-content:hover{
            color: #1ABB9C;
            background: #fff;
            border: 1px solid #1ABB9C;
        }
        .btn-content.btn-danger-content:hover{
            color: red;
            background: #FFF;
            border: 1px solid red;
        }
        .btn-content.btn-primary-content:hover{
            color: #303F9F;
            background: #FFF;
            border: 1px solid #303F9F;
        }

        /* ----------------------------- detalle  ----------------------------------------*/

        .title-content{
            font-size: 25px;
            color: rgba(0, 0, 0, .75);
            margin-left: 10px;
            cursor: default;
            font-weight: bold;
        }

        .fa-form-control{
            font-size: 25px;
            margin-right: 10px;
            margin-top: 10px;
            color: rgba(0, 0, 0, .45);
            transition: all .5s ease;
            cursor: pointer;
        }

        .fa-form-sd-control{
            position: absolute;
            margin-top: 15px;
            margin-left: 10px;
            font-size: 16px;
            transition: all .5s ease;
        }
        .fa-form-sd-control:hover{
            color: #303F9F;
        }

        .fa-form-control:hover{
            color: rgba(0, 0, 0, .85);
        }

        /* ------------------------- estilos del imaggen ---------------------- */

        .text-title-content{
            position: absolute;
            left: 0;
            top: 0;
            border-bottom: 0;
            right: 0;
            font-size: 20px;
            margin-top: 2px;
            color: black;
        }

        .styleImg{
            font-size: 25px;
            width: 25px;
            height: 27px;
            line-height: 28px;
            text-align: center;
            margin: 0;
            position: relative;
            color: rgba(0, 0, 0, .65);
            cursor: pointer;
            transition: all .5s ease;
        }
        .styleImg:hover{
            color: rgba(0, 0, 0, .85);
        }
        .content-principal{
            width: 100%;
            height: 200px;
            object-fit: cover;
            filter: brightness(96%);
            transition: all .5s ease;
        }

        .content-principal:hover{
            filter: brightness(100%);
        }
        /* contain */

        .card-caracteristica{
            width: 100%;
            border: 1px solid rgba(0, 0, 0, .25);
            border-radius: 2px;
            max-width: 1220px;
            display: table;
            position: relative;
        }

        .caja-content{
            width: 100%;
            margin-top: 20px;
            height: 252px;
            overflow: scroll;
            position: relative;
            border-top: 1px solid rgba(0, 0, 0, .25);
            border-bottom: 1px solid rgba(0, 0, 0, .25);
        }

        .caja-content::-webkit-scrollbar{
            width: 2px;
        }

        .caja-content::-webkit-scrollbar-thumb{
            background: orange;
            border-radius: 10px;
        }

        .title-text-content{
            font-size: 20px;
            font-family: Roboto;
            font-weight: 500;
            color: rgba(0, 0, 0, .85);
        }
        .title-min-text-content{
            font-size: 18px;
            font-family: sans-serif;
            font-weight: 400;
            color: #303F9F;
            margin-top: 2px;
        }

        .img-circle-content{
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        /* ------------------------------------------------------------------------------ */


        @media screen and (max-width: 800px) {
            .table-content .table-responsive-content thead{
                display: none;
            }
            .table-content .table-responsive-content tr{
                margin: 0 0 15px;
                display: block;
            }
            .table-content .table-responsive-content td{
                display: block;
                text-align: left;
                padding: 10px 15px 10px 150px;
                font-size: 14px;
                position: relative;
                border: none;
                border-bottom: 1px solid rgba(0, 0, 0, .05);
                margin-left: 5px;
            }
            .table-content .table-responsive-content .col-show{
                display: block;
                border: none;
                position: absolute;
                font-weight: bold;
                font-size: 16px;
                top: 7px;
                left: 10px;
            }

        }

        #img-content{
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }

        .divModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .3);
            opacity: .80;
            -webkit-opacity: .8;
            -moz-opacity: .8;
            filter: alpha(opacity=80);
            z-index: 1040;
            transition: all .5s ease;
        }


        .divFormulario {
            background-color: transparent;
            box-shadow: 0 0 20px 0 #222;
            -webkit-box-shadow: 0 0 20px 0 #222;
            -moz-box-shadow: 0 0 20px 0 #222;
            height: auto;
            margin-left: 18%;
            margin-right: 18%;
            left: 0;
            right: 0;
            position: fixed;
            top: 11%;
            width: auto;
            min-height: 31%;
            z-index: 1050;
            border-radius: 10px;
            transition: all .7s ease;
        }

        .wrappper-content{
            width: 100%;
            text-align: center;
            background: #f8f8f8;
            padding: 5px;
            border-radius: 8px;
            position: relative;
        }

        .img-show{
            width: 100%;
            height: 450px;
            border-radius: 10px;
            object-fit: contain;
        }
        .text-right-content{
            width: 100%;
            text-align: right;
            position: relative;
        }
        .text-left-content{
            width: 100%;
            text-align: left;
            position: relative;
        }

        /* icon de la imagen */

        .fa-left-content{
            position: absolute;
            left: 0;
            color: #fff;
            font-size: 35px;
            cursor: pointer;
            top: 50%;
            transition: all .5s ease;
        }
        .fa-left-content:hover{
            color: #1ABB9C;
        }
        .fa-right-content{
            position: absolute;
            right: 0;
            color: #fff;
            font-size: 35px;
            cursor: pointer;
            top: 50%;
            transition: all .5s ease;
        }
        .fa-right-content:hover{
            color: #1ABB9C;
        }
        .fa-close-content{
            position: absolute;
            top: 0;
            color: #fff;
            font-size: 35px;
            cursor: pointer;
            transition: all .5s ease;
        }
        .fa-close-content:hover{
            color: #1ABB9C;
        }

        .texto-content{
            width: 100%;
            min-height: 100px;
            max-height: 150px;
            border: 2px solid rgba(0, 0, 0, .55);
            outline: none;
            border-radius: 2px;
        }
        .texto-content:hover,
        .texto-content:focus{
            outline-style: none;
            border: 1px solid #1ABB9C;
        }


    </style>

</head>

<body class="nav-md">

<div id="appInicio"></div>

<script src="{{ asset('/js/app.js') }}"></script>

<script src="{{ asset('/js/plantilla.js') }}"></script>

</body>

</html>
