

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

    <title> ERP </title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Bootstrap -->
    <link href="{{ asset('/vendors/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('/vendors/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">
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
        /*@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700'); */
        .row-content {
            margin-top: 57px;
            padding: 5px;
            width: 100%;
            max-width: 1220px;
            font-family: 'Times New Roman', sans-serif;
            transition: all 400ms ease;
        }

        .card-body-content {
            -webkit-box-shadow: 0 0 40px rgba(0,0,0,.05);
            box-shadow: 0 0 40px rgba(0,0,0,.05);
            background-color: #fff;
            border-radius: 3px;
            border: none;
            position: relative;
            margin-bottom: 20px;
            padding-top: 15px;
            padding-bottom: 15px;
            width: 100%;
            display: table;
        }

        .card-header-content {
            -webkit-box-shadow: 0 0 40px rgba(0,0,0,.05);
            box-shadow: 0 0 40px rgba(0,0,0,.05);
            background-color: #fff;
            border-radius: 3px;
            border: none;
            position: relative;
            margin-bottom: 10px;
            border-bottom-color: #f9f9f9;
            line-height: 30px;
            -ms-flex-item-align: center;
            -ms-grid-row-align: center;
            align-self: center;
            width: 100%;
            display: table;
            padding: 5px;
        }

        .card-primary-content {
            border-top: 2px solid #574B90;
        }

        .card-secondary-content {
            border-top: 2px solid #868e96;
        }

        .card-success-content {
            border-top: 2px solid #28a745;
        }

        .card-danger-content {
            border-radius: 5px;
            border-top: 2px solid #dc3545;
        }

        .card-warning-content {
            border-top: 2px solid #ffc107;
        }

        .card-info-content {
            border-top: 2px solid #17a2b8;
        }

        .card-dark-content {
            border-top: 2px solid #343a40;
        }

        .divModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .4);
            opacity: .80;
            -webkit-opacity: .8;
            -moz-opacity: .8;
            filter: alpha(opacity=80);
            z-index: 2040;
            transition: all .5s ease;
        }


        .divFormulario {
            background-color: #fff;
            box-shadow: 0 0 20px 0 #222;
            -webkit-box-shadow: 0 0 20px 0 #222;
            -moz-box-shadow: 0 0 20px 0 #222;
            height: auto;
            margin-left: 35%;
            margin-right: 35%;
            left: 0;
            right: 0;
            position: fixed;
            top: 11%;
            width: auto;
            min-height: 20%;
            z-index: 2050;
            border-radius: 5px;
            font-family: 'Times New Roman', sans-serif;
            transition: all 800ms ease;
        }

        .pull-right-content {
            float: right !important;
            margin-right: 10px;
        }

        .pull-left-content {
            float: left !important;
            margin-left: 10px;
        }

        .title-logo-content {
            color: #16181b;
            font-size: 20px;
            font-weight: 500; 
            cursor: default;
            margin: 15px;
        }

        .title-sublogo-content {
            color: #868686;
            font-size: 18px;
            font-weight: 500;
        }
   
        .title-md-content {
            color: #bebebe;
            font-size: 20px;
            cursor: default;
            margin-top: 10px;
        }

        .lbl-title-content {
            color: #225ccc;
            font-size: 14px;
            cursor: default;
        }

        .lbl-subtitle-content {
            color: #868686;
            font-size: 15px;
            cursor: default;
        }

        .btn-content {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 1px solid transparent;
            padding: .375rem .65rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            transition: all .3s ease;
            margin-top: 5px;
            margin-right: 2px;
            cursor: pointer;
        }

        .btn-xs {
            margin-top: 12px;
        }

        .btn-content:focus, .btn-content:hover {
            text-decoration: none;
        }

        .btn-sm-content {
            padding: .60rem 1.18rem;
            font-size: 1.4575rem;
            line-height: 1.5;
            border-radius: .3rem;
        }

        .btn-primary-content {
            color: #fff;
            background-color: #574B90;
            border-color: #574B90;
            transition: all 1200ms ease;
        }

        .btn-blue-content {
            color: #fff;
            background-color: #1890ff;
            font-size: 14px;
            border: 1px solid #1890ff;
            transition: all 1500ms ease;
        }

        .btn-cancel-content {
            color: #FD3C4E;
            background-color: #fff;
            font-size: 14px;
            border: 1px solid #FD3C4E;
            transition: all 1500ms ease;
        }

        .btn-cancel-content:hover {
            border: 1px solid #1890ff;
            color: #1890ff;
        }

        .btn-blue-content:hover {
            background-color: #0530DC;
        }

        .btn-primary-content:hover {
            color: #574B90;
            background-color: #fff;
            border-color: #574B90;
        }

        .btn-success-content {
            color: #fff;
            background-color: #3DC7BE;
            border-color: #3DC7BE;
            transition: all 1200ms ease;
        }

        .btn-success-content:hover {
            color: #3DC7BE;
            background-color: #fff;
            border-color: #3DC7BE
        }

        .btn-secondary-content {
            color: #fff;
            background-color: #868e96;
            border-color: #868e96;
            transition: all 1200ms ease;
        }

        .btn-secondary-content:hover {
            color: #868e96;
            background-color: #fff;
            border-color: #868e96
        }

        .btn-danger-content {
            color: #fff;
            background-color: #dc3545;
            border-color: #dc3545;
            transition: all 1200ms ease;
        }

        .btn-danger-content:hover {
            color: #dc3545;
            background-color: #fff;
            border-color: #dc3545
        }

        .btn-warning-content {
            color: #fff;
            background-color: #ffc107;
            border-color: #ffc107
        }

        .btn-warning-content:hover {
            color: #ffc107;
            background-color: #fff;
            border-color: #ffc107
        }

        .btn-info-content {
            color: #fff;
            background-color: #17a2b8;
            border-color: #17a2b8
        }

        .btn-info-content:hover {
            color: #17a2b8;
            background-color: #fff;
            border-color: #17a2b8
        }

        .table-content{
            width: 100%;
            margin-top: 10px;
            margin-right: 20px;
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

        .form-content {
            padding: 2px;
            width: 100%;
            max-width: 1220px;
        }

        .form-group-content{
            width: 100%;
            margin-bottom: 5px;
            max-width: 1220px;
            display: table;
            padding: 2px;
        }
        .borderTable{
            border-bottom: 1px solid #b6b7bd;
            height: 50px;
            line-height: 41px;
        }
        
        .borderRigth{
            border-right:1px solid #dde1df;
            height: 100%;
            padding: 50px;  
        }
        .form-planpagocabezera{
            background-color: #ebecee;
        }
        .input-group-content {
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            -webkit-box-align: stretch;
            -ms-flex-align: stretch;
            align-items: stretch;
            width: 100%;
        }

        [class*="col-"]{
            padding: 4px 10px 4px 10px;
            float: left;
        }

        @media (min-width: 1200px) {
            .col-lg-12-content{  width: 100%;  }
            .col-lg-11-content{  width: 91.6666666667%; }
            .col-lg-10-content{  width: 83.33333333%;  }
            .col-lg-9-content{  width: 75%;  }
            .col-lg-8-content{  width: 66.66666667%;  }
            .col-lg-7-content{  width: 58.33333333%;  }
            .col-lg-6-content{  width: 50%;  }
            .col-lg-5-content{  width: 41.66666667%;  }
            .col-lg-4-content{  width: 33.33333333%;  }
            .col-lg-3-content{  width: 25%;  }
            .col-lg-2-content{  width: 16.66666667%;  }
            .col-lg-1-content{  width: 8.33333333%;  }
        }

        @media (max-width: 1199px) and (min-width: 992px){
            .col-md-12-content{  width: 100%;  }
            .col-lg-11-content{  width: 91.6666666667%; }
            .col-md-10-content{  width: 83.33333333%;  }
            .col-md-9-content{  width: 75%;  }
            .col-md-8-content{  width: 66.66666667%;  }
            .col-md-7-content{  width: 58.33333333%;  }
            .col-md-6-content{  width: 50%;  }
            .col-md-5-content{  width: 41.66666667%;  }
            .col-md-4-content{  width: 33.33333333%;  }
            .col-md-3-content{  width: 25%;  }
            .col-md-2-content{  width: 16.66666667%;  }
            .col-md-1-content{  width: 8.33333333%;  }
        }

        @media (max-width: 991px) and (min-width: 768px){
            .col-sm-12-content{  width: 100%;  }
            .col-lg-11-content{  width: 91.6666666667%; }
            .col-sm-10-content{  width: 83.33333333%;  }
            .col-sm-9-content{  width: 75%;  }
            .col-sm-8-content{  width: 66.66666667%;  }
            .col-sm-7-content{  width: 58.33333333%;  }
            .col-sm-6-content{  width: 50%;  }
            .col-sm-5-content{  width: 41.66666667%;  }
            .col-sm-4-content{  width: 33.33333333%;  }
            .col-sm-3-content{  width: 25%;  }
            .col-sm-2-content{  width: 16.66666667%;  }
            .col-sm-1-content{  width: 8.33333333%;  }
        }

        @media (max-width: 767px){
            .col-xs-12-content{  width: 100%;  }
            .col-lg-11-content{  width: 91.6666666667%; }
            .col-xs-10-content{  width: 83.33333333%;  }
            .col-xs-9-content{  width: 75%;  }
            .col-xs-8-content{  width: 66.66666667%;  }
            .col-xs-7-content{  width: 58.33333333%;  }
            .col-xs-6-content{  width: 50%;  }
            .col-xs-5-content{  width: 41.66666667%;  }
            .col-xs-4-content{  width: 33.33333333%;  }
            .col-xs-3-content{  width: 25%;  }
            .col-xs-2-content{  width: 16.66666667%;  }
            .col-xs-1-content{  width: 8.33333333%;  }
        }

        .menu-content {
            width: 100%;
            position: absolute;
            flex-direction: column;
            background: #fff;
            border: 1px solid #868686;
            padding: 3px;
            left: -3px;
            top: 38px;
            border-radius: 4px;
            z-index: 1100;
        }

        .sub-menu-content {
            width: 100%;
            position: relative;
        }

        .fa-content {
            position: absolute;
            right: 0;
            top: 5px;
            font-size: 15px;
            padding: 5px;
            border: 1px solid transparent;
            border-top: 1px solid transparent;
            transition: border 3000ms;
            cursor: pointer;
        }

        .fa-content:hover {
            border: 1px solid #eeeeee;
            border-top: 1px solid #55A79A;
        }

        .fa-delete-content{
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 18px;
            width: 30px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            border: 1px solid transparent;
            border-top: 1px solid transparent;
            transition: border 3000ms;
            cursor: pointer;
        }

        .fa-delete-content:hover {
            border: 1px solid #eeeeee;
            border-top: 1px solid #55A79A;
        }

        .input-content{
            display: block;
            width: 100%;
            text-align: left;
            padding-left: 10px;
            height: 30px;
            line-height: 30px;
            border: 1px solid transparent;
            color: #495057;
            outline: none;
            background: none;
            cursor: pointer;
            font-size: 15px;
            background-color: #fff;
            transition: all 400ms ease;
        }

        .input-content.active {
            border: 1px solid #51c3eb;
            background: rgba(61, 141, 230, 0.2);
        }

        .input-content:hover,
        .input-content:focus {
            border: 1px solid #51c3eb;
            background: rgba(61, 141, 230, 0.2);
        }

        .form-textarea-content {
            width: 100%;
            min-height: 30px;
            max-height: 90px;
            cursor: default;
            margin-top: -10px;
            height: 90px;
            padding: 4px;
            border: 1px solid #e8e8e8;
            transition: all .6s ease;
            color: #868686;
            font-family: 'Times new Roman', sans-serif;
        }

        .textareaHeight-4 {
            min-height: 50px;
            max-height: 160px;
            cursor: default;
            margin-top: -10px;
            height: 140px;
        }

        .form-textarea-content:hover,
        .form-textarea-content:active,
        .form-textarea-content:focus {
            outline: none;
            border: 1px solid #55A79A;
        }

        .cursorAuto {
            cursor: auto;
        }

        .form-control-content {
            /*display: block; */
            width: 100%;
            border: none;
            outline: none;
            background: none;
            border-bottom: 2px solid #BBDEFB;
            padding: 0.375rem 25px 0.375rem 6px;
            height: 35px;
            line-height: 35px;
            font-size: 15px;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            transition: all .4s ease;
        }
        .reinicio-padding {
            padding: 0.375rem 5px 0.375rem 6px;
        }

        .form-control-outline-content {
            
            width: 100%;
            border: 1px solid #868686;
            outline: none;
            background: none;
            padding: 0.375rem 20px 0.375rem 10px;
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            margin-bottom: 4px;
            transition: all .4s ease;
        }

        .textarea-content {
            width: 100%;
            height: 85px;
            min-height: 60px;
            max-height: 130px;
            font-size: 15px;
            border: 1px solid #e8e8e8;
            outline: none;
            border-radius: 2px;
            transition: all .4s ease;
        }
        .textarea-content:hover,
        .textarea-content:focus,
        .textarea-content:active{
            outline-style: none;
            border: 1px solid #1ABB9C;
        }

        .form-outline-content {
            width: 100%;
            border: 1px solid #BBDEFB;
            outline: none;
            background: none;
            padding: 0.375rem 10px 0.375rem 6px;
            height: 35px;
            line-height: 35px;
            font-size: 18px;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            transition: all .4s ease;
        }

        .form-outline-content:hover, 
        .form-outline-content:focus {
            outline: none;
            background: #fff;
            border: 1px solid #303F9F;
        }

        .form-outline-content.error {
            border: 1px solid red;
        }
        

        .w-25-content {
            width: 90px;
            margin-right: 10px;
        }

        .w-75-content {
            width: 180px;
        }

        .form-control-outline-content:hover,
        .form-control-outline-content:focus {
            border: 1px solid #55A79A;
        }

        .form-control-content:hover,
        .form-control-content:focus{
            outline: none;
            background: #fff;
            border-bottom: 2px solid #303F9F;
        }

        .form-control-content.error {
            border-bottom: 2px solid #FA5858;
        }

        .form-control-content.error:hover,
        .form-control-content.error:focus {
            border-bottom: 2px solid red;
        }

        .form-control-content.warning {
            border-bottom: 2px solid orange;
        }

        .form-control-content.warning:hover,
        .form-control-content.warning:focus {
            border-bottom: 2px solid orange;
        }

        .tree-error {
            border-radius: 6px;
            border: 1px solid red;
        }
        .label-content-modal{
            color:#225ccc;
            font-size: 16px;
        }
        .label-group-content {
            font-size: 16px;
            margin-left: 16px;
            color: #868686;
            font-weight: 500;
        }
        .label-group-content-nwe{
            margin-left: -4px;
            font-size: 12px;
        }
        .label-group-margenRigth{
            margin-right: 15px;
        }
        .label-plan-pago{
            font-size: 14px;
            font-weight: bold;
            width: 100%;
        }
        .label-group-content.error {
            color: #FA5858;
        }

        .label-group-content.warning {
            color: orange;
        }

        .divModalImagen {
            position: fixed;
            display: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .88);
            opacity: .80;
            -webkit-opacity: .8;
            -moz-opacity: .8;
            filter: alpha(opacity=80);
            z-index: 3040;
            transition: all .5s ease;
        }

        .divFormularioImagen {
            display: none;
            background-color: transparent;
            box-shadow: 0 0 20px 0 #222;
            -webkit-box-shadow: 0 0 20px 0 #222;
            -moz-box-shadow: 0 0 20px 0 #222;
            height: auto;
            margin-left: 20%;
            margin-right: 13%;
            left: 0;
            right: 0;
            position: fixed;
            top: 11%;
            width: auto;
            min-height: 31%;
            z-index: 3050;
            border-radius: 5px;
            transition: all .7s ease;
        }

        .label-generation {
            line-height: 35px;
        }

        .input-generation {
            text-align: center;
            border: none;
        }

        .btn-generation {
            width: 100%;
            background: #684bff;
            color: #fff;
            display: inline-block;
            height: 35px;
            vertical-align: top;
            font-size: 16px;
            text-align: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all .3s ease;
        }

        .btn-generation:hover {
            background: #b4a5ff;
        }

        .btn-generation.false {
            background: #33257e;
        }

        .nroCaracteres div{
            width: 100%;
        }

        .nroCaracteres div:nth-child(1) button{
            border-radius: 4px 0 0 4px;
        }

        .nroCaracteres div:nth-child(2) input{
            height: 35px;
            width: 100%;
            cursor: default;
            background: #33257e;
            color: #fff;
        }

        .nroCaracteres div:nth-child(3) button{
            border-radius: 0 4px 4px 0;
        }

        .nroCaracteres {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .btn-generation-generar {
            width: 100%;
            height: 35px;
            font-size: 18px;
            padding: 0;
            line-height: 35px;
            position: relative;
        }

        .btn-generation-generar i {
            margin-left: 15px;
            position: relative;
            top: -1px;
            font-size: 14px;
        }

        .btn-generation-generar:after {
            content: "";
            display: inline-block;
            width: 14px;
            height: 14px;
            transform: rotate(45deg);
            position: absolute;
            top: 13px;
            right: -7px;
            background: #684bff;
            transition: all .3s ease; 
        }

        .fila-generation:nth-child(1):hover .btn-generation-generar:after {
            background: #b4a5ff;
        }

        .input-generar {
            width: 100%;
            background: none;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, .25);
            color: #fff;
            height: 35px;
            line-height: 35px;
            cursor: pointer;
            transition: all .3s ease;
        }

        .input-generar:hover {
            border: 1px solid rgba(255, 255, 255, .5);
        }

        .input-generar::selection { 
            background: #212139;
        }

        .input-generar::-moz-selection {
            background: #212139;
        }

        .text-center-content {
            text-align: center;
        }

        .card-caracteristica{
            width: 100%;
            border: 1px solid rgba(0, 0, 0, .25);
            border-radius: 2px;
            max-width: 1220px;
            display: table;
            position: relative;
        }

        .bd-null {
            border: 1px solid transparent;
            margin-top: -20px;
        }
        .caja-content{
            width: 100%;
            height: 190px;
            overflow: scroll;
            position: relative;
            padding: 5px;
            border-top: 1px solid rgba(0, 0, 0, .25);
        }
        .caja-content-altura{
            height: 190px;
        }
        .caja-content-alturaView{
            height:220px ;
            border: 1px solid #525353;
        }

        .caja-content-adl {
            height: 190px;
            border-color: #16181b
        }

        .caja-content::-webkit-scrollbar{
            width: 2px;
        }
        .color-label-modal{
            color: #5a6cdd;
        }
        .caja-content::-webkit-scrollbar-thumb{
            background: orange;
            border-radius: 10px;
        }

        .styleImg{
            font-size: 20px;
            width: 30px;
            height: 33px;
            line-height: 32px;
            text-align: center;
            margin: 0;
            position: relative;
            color: #fff;
            background: #5A5A5A;
            margin-top: 4px;
            border-radius: 4px;
            border: 1px solid #98FAB1;
            cursor: pointer;
            z-index: 1000;
            transition: all .5s ease;
        }

        .imgMod {
            width: 20px;
            height: 23px;
            line-height: 22px;
            margin-top: 1px;
            font-size: 15px;
            margin-left: -8px;
        }

        .img-izq {
            left: 95px;
        }

        .img-der {
            right: 100px;
        }

        .styleImg:hover {
            background: #fff;
            color: #5A5A5A;
        }

        .img-content{
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

        .caja-img {
            width: 100%;
            height: 235px;
            line-height: 255px;
            text-align: center;
            margin: 0;
            position: relative;
        }

        .small-image {
            width: 100%;
            height: 80px;
            margin: auto;
        }

        .caja-img-modal{
            width: 100%;
            height: 200px;
            line-height: 200px;
            text-align: center;
            margin: 0;
            position: relative;
        }

        .caja-img-xs {
            width: 100%;
            height: 160px;
            line-height: 160px;
            text-align: center;
            margin: 0;
            position: relative;
        }

        .caja-altura {
            height: 180px;
            line-height: 150px;
        }

        .content-img {
            width: 100%;
            height: 400px;
            line-height: 380px;
            text-align: center;
            margin: 0;
            position: relative;
        }

        .img-principal {
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            filter: brightness(80%);
        }

        .efecto-img {
            transition: all .5s ease;
        }
        .efecto-img:hover {
            transform: scale(1.3);
        }

        .img-model {
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 60%;
            height: 100%;
            margin: auto;
            position: absolute;
            object-fit: cover;
            filter: brightness(90%);
            transition: all .5s ease;
        }

        .fa-left-content{
            position: absolute;
            bottom: 5px;
            left: 0;
            width: 40px;
            height: 30px;
            line-height: 25px;
            text-align: center;
            font-size: 38px;
            background: transparent;
            color: #fff;
            cursor: pointer;
        }

        .faNroImagen {
            position: absolute;
            bottom: 5px;
            left: 45%;
            font-size: 25px;
            color: #fff;
        }

        .left-img {
            left: 103px;
        }

        .fa-right-content{
            position: absolute;
            bottom: 5px;
            right: 0;
            width: 40px;
            height: 30px;
            line-height: 25px;
            text-align: center;
            font-size: 38px;
            background: transparent;
            color: #fff;
            cursor: pointer;
        }

        .small-left {
            width: 30px;
            height: 30px;
            line-height: 25px;
            font-size: 28px;
            bottom: 0;
        }

        .small-right {
            width: 30px;
            height: 30px;
            line-height: 25px;
            font-size: 28px;
            bottom: 0;
        }

        .right-img {
            right: 103px;
        }

        .m2-content {
            margin-top: 4px;
        }

        .text-danger-content {
            color: red;
        }

        .fa-delete-image {
            color: #fff;
            font-size: 45px;
            position: fixed;
            z-index: 2060;
            right: 5px;
            top: 5px;
            width: 80px;
            height: 70px;
            line-height: 65px;
            cursor: pointer;
            transition: all .4s ease;
        }

        .fa-delete-image:hover {
            color: #868686;
        }

        @media  screen and (max-width: 800px) {
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

        /**Agragacion by Alex*/
        .caja-almacen-view-content{
            width: 100%;
            margin-top: 20px;
            height: 100%;
            overflow: scroll;
            position: relative;
        }

        .caja-caracteristica-view-content{
            width: 100%;
            /*margin-top: 10px;*/
            height: 170px;
            overflow: scroll;
            /*position: relative;*/
        }
        /**Agragacion by Alex*/

        ::-webkit-scrollbar {
            width: 5px;
            height: 7px;
        }
        ::-webkit-scrollbar-button {
            width: 0;
            height: 0;
        }
        ::-webkit-scrollbar-thumb {
            background: #525965;
            border: 0 none #ffffff;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #525965;
        }
        ::-webkit-scrollbar-thumb:active {
            background: #525965;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
            border: 0 none #ffffff;
            border-radius: 50px;
        }
        ::-webkit-scrollbar-track:hover {
            background: transparent;
        }
        ::-webkit-scrollbar-track:active {
            background: transparent;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        .multi-menu-content {
            /*width: 100%;*/
            background: #FDFEFE;
            border-radius: 3px;
            -webkit-transition: all 1500ms ease;
            -moz-transition: all 1500ms ease;
            -ms-transition: all 1500ms ease;
            -o-transition: all 1500ms ease;
            transition: all 1500ms ease;
        }

        .multi-menu-content .menu {
            /*width: 100%;*/
            top: 5px;
            display: inline-block;
            position: relative;
        }

        .multi-menu-content ul {
            list-style: none;
        }

        .multi-menu-content .menu li{
            margin-left: -25px;
            /*width: 180px; */
            position: relative;
            transition: all 1500ms ease;
        }

        .multi-menu-content .menu li ul, .multi-menu-content input[type="checkbox"] {
            display: none;
        }

        .multi-menu-content .menu li input[type="checkbox"]:checked ~ul {
            display: block;
        }

        .multi-menu-content .menu li label {
            
            color: #868686;
            display: block;
            background: #fff;
            padding: 2px 20px 5px 0;
            cursor: pointer;
            border: 1px solid #51c3eb;
            border-radius: 2px;
            font-size: 14px;
            letter-spacing: 1px;
            text-align: left;
            position: relative;
            transition: all 1700ms ease;
        }

        .multi-menu-content .menu li .icon-der {
            position: absolute;
            right: 0;
            top: 0;
            width: 15px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #868686;
            cursor: pointer;
            border-left: 1px solid #e8e8e8;
            transition: all 1500ms ease;
        }

        .multi-menu-content .menu li ul li .icon-der {
            border: 1px solid #e8e8e8;
        }

        .multi-menu-content .menu li .icon-der .sub-menu-hijo {
            position: absolute;
            flex-direction: column;
            left: 0;
            width: 150px;
            height: 100px;
            padding: 0;
            margin-top: 25px;
            background: #fff;
            display: none;
            border-radius: 4px;
            border-top: 1px solid #e8e8e8;
            z-index: 500;
            transition: all 1500ms ease;
        } 

        .multi-menu-content .menu li .icon-der .sub-menu-hijo .hijo-sub-menu {
            width: 100%;
            font-size: 15px;
            height: 35px;
            line-height: 30px;
            border-bottom: 1px solid #e8e8e8;
            background: #fff;
            transition: all 1200ms ease;
        }

        .multi-menu-content .menu li .icon-der:hover .sub-menu-hijo{
            background: rgba(240, 186, 255, .1);
            display: inline;
        }

        .multi-menu-content .menu li .icon-der .sub-menu-hijo .hijo-sub-menu:hover {
            border-bottom: 1px solid #51c3eb;
            background: #F5F3F5;
        }

        .multi-menu-content .menu li label span {
            margin-left: 30px;
        }

        .multi-menu-content .menu li label .icon-izq {
            position: absolute;
            left: 0;
            top: 0;
            width: 25px;
            height: 100%;
            text-align: center;
            border-right: 1px solid transparent;
            transition: all 1700ms ease;
        }

        .multi-menu-content .menu li label .icon-izq:hover {
            background: #fff;
            border-right: 1px solid #0378FA;
        }

        .multi-menu-content .menu li label .icon-izq img{
            width: 10px;
            height: 10px;
            margin-top: 2px;
        }

        .item-content input + label .icon-izq .arrow {
            transform: rotate(-90deg);
            transition: all 800ms ease;
        }

        .item-content input:checked + label .icon-izq .arrow {
            transform: rotate(0deg);
            transition: all 800ms ease;
        }

        .multi-menu-content > .menu > li > label:hover {
            background: rgba(61, 141, 230, 0.2);
            border: 1px solid #0378FA;
        }

        .multi-menu-content .menu li ul li label {
            border: 1px solid transparent;
            border-top: 1px solid transparent;
            transition: all 1500ms ease;
        }

        .multi-menu-content .menu li ul li label:hover {
            border: 1px solid #eeeeee;
            background: rgba(232, 232, 232, .1);
        }

        .margin-group-content {
            margin: 20px;
            border:#BBDEFB solid;
        }

        .cursor-not-allowed:hover {
            cursor: not-allowed;
            background: #E7EDEA;
        }

        .form-active {
            background: #E7EDEA;
        }

        .label-align-start {
            align: left;
           /* margin-left: 10px;*/
        }

        .border-table {
            border-bottom: 1px solid #b6b7bd;
            height: 50;
            line-height: 41px;
        }

        .body-scroll {
            overflow: scroll;
            height: 100%;
        }

        .border-buttom {
            border-bottom: 1px solid #b6b7bd;
        }

        .check-content { 
            display: none;
        }

        .lbl-checkbox-content {
            width: 100%;
            font-size: 16px;
            padding-left: 30px;
        }

        .lbl-checkbox-content:before {
            content: '';
            border: 1px solid #868686;
            border-radius: 3px;
            width: 1em;
            height: 1em;
            line-height: .8em;
            position: absolute;
            padding-left: .2em;
            padding-bottom: .3em;
            left: 5px;
            top: 6px;
            transition: all 800ms ease;
        }

        .check-content:checked + .lbl-checkbox-content:before {
            border-color: #00e676;
            color: #00e676;
            content: '\f00c';
            font-family: FontAwesome;
        }
        .check-content:checked + .lbl-checkbox-content:active:before{
            transform: scale(0);
        }
        
        .none-flechas-number {
            -webkit-appearance: none;
            margin: 0;
        }

    </style>

</head>
<body class="nav-md">

<div id="appInicio"></div>

<script src="{{ asset('/js/app.js') }}"></script>

<script src="{{ asset('/js/plantilla.js') }}"></script>

<script>
    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);

        if ($(this).parent().hasClass("active")) {

            $(".sidebar-dropdown").removeClass("active");

            $(this).parent().removeClass("active");

        } else {

            $(".sidebar-dropdown").removeClass("active");

            $(this).next(".sidebar-submenu").slideDown(200);

            $(this).parent().addClass("active");
        }
    });
    
</script>

</body>

</html>
