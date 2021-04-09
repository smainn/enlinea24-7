<!DOCTYPE html>
<html lang="es">

<!-- Mirrored from demo.themeum.com/html/oxygen/ by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 20 Mar 2018 15:56:58 GMT -->

<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Empresa de Software, Santa Cruz Bolivia">
    <meta name="keywords" content="desarrollo de software, fabrica del software, software, web, sistemas, sistemas web, programas, informatica, sistemas bancarios, sistemas de gestion, desarrollo de aplicaciones moviles, desarrollo de app moviles, app moviles, diseño web, consultoria tic, tecnologia, software a medida">
    <meta name="author" content="Smainn">
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-74373948-3"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-74373948-3');
    </script>


    <title>Smainn</title>
    <!-- <script src='https://www.google.com/recaptcha/api.js'></script>-->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/animate.min.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/lightbox.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link id="css-preset" href="css/presets/preset1.css" rel="stylesheet">
    <link href="css/responsive.css" rel="stylesheet">

    <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
    <script src="js/respond.min.js"></script>
  <![endif]-->

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' rel='stylesheet' type='text/css'>
    <link rel="shortcut icon" href="images/icoo.png">
    <!--<script src="https://www.google.com/recaptcha/api.js?render=6LfI5fQUAAAAAJD7yIScdU12hDB28LV9UGvtBPNA"></script>-->
    <script src="https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoadCallback"></script>

    <link rel="icon" href="https://www.smainn.com/images/logo_smainn32.png" sizes="32x32" />
    <link rel="icon" href="https://www.smainn.com/images/logo_smainn192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="https://www.smainn.com/images/logo_smainn180.png" />
    <link rel="shortcut icon" href="https://www.smainn.com/images/logo_smainn3.ico">


    <style>
        .form-control.selectopcion option {
            background-color: white;
            background: white;
            color: black;
        }

        .title_form {
            color: white !important;
            border: 1px solid rgba(255, 255, 255, .8);
        }

        .title_form::placeholder {
            color: white !important;
        }

        .section_card {
            padding: 30px 0px;
        }

        .heading_section {
            padding-bottom: 40px;
        }



        /* Slider */

        .slick-slide {
            margin: 0px 10px;
        }

        .slick-slide img {
            width: 100%;
        }

        .slick-slider {
            position: relative;
            display: block;
            box-sizing: border-box;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -khtml-user-select: none;
            -ms-touch-action: pan-y;
            touch-action: pan-y;
            -webkit-tap-highlight-color: transparent;
        }

        .slick-list {
            position: relative;
            display: block;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        .slick-list:focus {
            outline: none;
        }

        .slick-list.dragging {
            cursor: pointer;
            cursor: hand;
        }

        .slick-slider .slick-track,
        .slick-slider .slick-list {
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            -ms-transform: translate3d(0, 0, 0);
            -o-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .slick-track {
            position: relative;
            top: 0;
            left: 0;
            display: block;
        }

        .slick-track:before,
        .slick-track:after {
            display: table;
            content: '';
        }

        .slick-track:after {
            clear: both;
        }

        .slick-loading .slick-track {
            visibility: hidden;
        }

        .slick-slide {
            display: none;
            float: left;
            height: 100%;
            min-height: 1px;
        }

        [dir='rtl'] .slick-slide {
            float: right;
        }

        .slick-slide img {
            display: block;
            height: 220px;
        }

        .slick-slide.slick-loading img {
            display: none;
        }

        .slick-slide.dragging img {
            pointer-events: none;
        }

        .slick-initialized .slick-slide {
            display: block;
        }

        .slick-loading .slick-slide {
            visibility: hidden;
        }

        .slick-vertical .slick-slide {
            display: block;
            height: auto;
            border: 1px solid transparent;
        }

        .slick-arrow.slick-hidden {
            display: none;
        }


        .thumb-info-title {
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            background: rgba(33, 37, 41, 0.8);
            color: #FFF;
            font-weight: 600;
            left: 0;
            letter-spacing: -.05em;
            position: absolute;
            z-index: 2;
            max-width: 90%;
            font-size: 14px;
            padding: 13px 21px 2px;
            bottom: 13%;
        }
        .thumb-info-inner {
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            display: block;
        }
        .thumb-info-type {
            background-color: #CCC;
            border-radius: 2px;
            display: inline-block;
            float: left;
            font-size: 0.8em;
            font-weight: 600;
            letter-spacing: 0;
            margin: 2px -2px -15px 0px;
            padding: 2px 12px;
            text-transform: uppercase;
            z-index: 2;
            line-height: 2.3;
        }

        @media screen and (max-width: 768px) {
            .slick-slide img {
                height: 200px;
            }
        }

        @media screen and (max-width: 520px) {
            .slick-slide img {
                height: 200px;
            }
        }

    </style>
</head>
<!--/head-->

<body>

    <!--.preloader-->
    <!-- <div class="preloader"> <i class="fa fa-circle-o-notch fa-spin"></i></div>-->
    <!--/.preloader-->

    <header id="home">
        <div id="home-slider" class="carousel slide carousel-fade" data-ride="carousel">
            <div class="carousel-inner">
                <div class="item active" style="background-image: url(images/slider/1.jpg)">
                    <div class="caption">
                        <h1 class="animated fadeInLeftBig">Bienvenido a <span>SMAINN</span></h1>
                        <p class="animated fadeInRightBig">Soluciones Magistrales e Innovadoras</p>
                        <a data-scroll class="btn btn-start animated fadeInUpBig" href="#services">Ver Más</a>
                    </div>
                </div>
                <div class="item" style="background-image: url(images/slider/2.jpg)">
                    <div class="caption">
                        <h1 class="animated fadeInLeftBig"><span>SMAINN</span> tiene la Tecnología</h1>
                        <p class="animated fadeInRightBig">Que requiere su organización para que alcance el éxito en sus negocios</p>
                        <a data-scroll class="btn btn-start animated fadeInUpBig" href="#about-us">Ver Más</a>
                    </div>
                </div>
                <div class="item" style="background-image: url(images/slider/3.jpg)">
                    <div class="caption">
                        <h1 class="animated fadeInLeftBig"> <span>SMAINN</span> es la solución</h1>
                        <p class="animated fadeInRightBig">“La pasión inspira, la imaginación crea y nuestro talento, lo hace realidad”</p>
                        <a data-scroll class="btn btn-start animated fadeInUpBig" href="#portfolio">Ver Más</a>
                    </div>
                </div>
            </div>
            <a class="left-control" href="#home-slider" data-slide="prev"><i class="fa fa-angle-left"></i></a>
            <a class="right-control" href="#home-slider" data-slide="next"><i class="fa fa-angle-right"></i></a>

            <a id="tohash" href="#services"><i class="fa fa-angle-down"></i></a>

        </div>
        <!--/#home-slider-->
        <div class="main-nav">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="index">
                        <h1><img class="img-responsive" src="images/logo.png" alt="logo"></h1>
                    </a>
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li class="scroll active"><a href="#home">Inicio</a></li>
                        <li class="scroll"><a href="#services">Servicios</a></li>
                        <li class="scroll"><a href="#about-us">Nosotros</a></li>
                        <li class="scroll"><a href="#portfolio">Productos</a></li>
                        <!--       <li class="scroll"><a href="#team">Team</a></li>
            <li class="scroll"><a href="#blog">Blog</a></li>  -->
                        <li class="scroll"><a href="#contact">Contacto</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <!--/#main-nav-->
    </header>
    <!--/#home-->
    <section id="services" class='section_card'>
        <div class="container">
            <div class="heading wow fadeInUp heading_section" data-wow-duration="1000ms" data-wow-delay="300ms">
                <div class="row">
                    <div class="text-center col-sm-8 col-sm-offset-2">
                        <h2>Nuestros Servicios</h2>
                        <p>Ponemos a su consideración nuestra especialidad y pasión por la tecnología reflejada a través de: </p>
                    </div>
                </div>
            </div>
            <div class="text-center our-services">
                <div class="row">
                    <div class="col-sm-4 wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="300ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv1.jpg" alt=""></a>
                        </div>
                        <!--	<div class="service-icon">
              <i class="fa fa-image"></i>
            </div> -->
                        <div class="service-info">
                            <h3>Desarrollo de Software a medida</h3>
                            <p style="text-align: justify;">El desarrollo de software a medida es la forma de como las empresas logran obtener soluciones exclusivas y 100% ajustado a sus requerimientos y contexto en cuanto a procesamiento de información se refiere</p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="450ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv2.jpg" alt=""></a>
                        </div>
                        <!--      <div class="service-icon">
              <i class="fa fa-code"></i>
            </div> -->
                        <div class="service-info">
                            <h3>Desarrollo y Diseño Web</h3>
                            <p style="text-align: justify;">La presencia y posicionamiento en la red mundial más la disponibilidad 24/7, es esencial en nuestros días, es por ello que nos especializamos en el desarrollo desde simples páginas Web hasta
                                sofisticados e innovadores portales Web basados en la Cloud Computing, modelos SaaS, Bots, e-commerce y otros, centrados en la seguridad y facilidad de uso </p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="550ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv3.jpg" alt=""></a>
                        </div>
                        <!--      <div class="service-icon">
              <i class="fa fa-mobile"></i>
            </div> -->
                        <div class="service-info">
                            <h3>Desarrollo de App Móvil</h3>
                            <p style="text-align: justify;">Hay más móviles conectados a Internet que personas en el mundo, un dato más que valioso para explotar la potencialidad evolutiva de los Smartphone, ponemos a su alcance todo nuestro talento on
                                énfasis en la innovación para el desarrollo de apps móviles efectivas con soluciones nativas Android e iOS, hibridas y para otros dispositivos Smart</p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="650ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv4.jpg" alt=""></a>
                        </div>
                        <!--       <div class="service-icon">
              <i class="fa fa-sellsy"></i>
            </div>  -->
                        <div class="service-info">
                            <h3>Consultoría TIC</h3>
                            <p style="text-align: justify;">Uno de los factores más determinantes para el éxito en la gestión empresarial es sin duda las “TICs”, para ello asesoramos en la planificación e implantación de la infraestructura requerida para que
                                logre una efectiva gestión en las tecnologías de la información y comunicación</p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="750ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv5.jpg" alt=""></a>
                        </div>
                        <!--       <div class="service-icon">
              <i class="fa fa-laptop"></i>
            </div>  -->
                        <div class="service-info">
                            <h3>Capacitación tecnológica</h3>
                            <p style="text-align: justify;">La tecnología evoluciona a ritmo acelerado y comprendiendo esta situación ofertamos capacitaciones específicas y personalizadas a sus requerimientos</p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="850ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/serv6.jpg" alt=""></a>
                        </div>
                        <!--       <div class="service-icon">
              <i class="fa fa-cogs"></i>
            </div> -->
                        <div class="service-info">
                            <h3>Computación cognitiva</h3>
                            <p style="text-align: justify;">Hay una inmensa cantidad de datos que se genera en todo momento que la computación tradicional no lo gestiona, ponemos a su alcance una autentica innovación de servicios basados en la inteligencia artificial</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--/#services-->



    <section id="about-us" class="parallax">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="about-info wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
                        <h2>Quienes somos</h2>
                        <p style="text-align: justify;">Soluciones Magistrales e innovadoras "SMAINN" es una empresa enmarcada en el ámbito de las ciencias de la computación con énfasis en la tecnología del desarrollo de software y la innovación.</p>
                        <p style="text-align: justify;">Contamos con productos que publicamos con alcance mundial, como así también tenemos productos con alcance específicos, además de construir soluciones a medida y exclusivas. </p>
                    </div>
                </div>
                <BR>
                <BR>
                <div class="about-info wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
                    <p style="text-align: justify;">El equipo “SMAINN” está constituida por ingenieros de software apasionados por su trabajo, con capacidad y talento para crear, diseñar, implementar, y poner en marcha soluciones de software efectivas. </p>
                    <p style="text-align: justify;">Cada nuevo proyecto es un desafío único para nosotros, la pasión por el software de nuestro equipo hace que cada día sea una realización total porque hacemos lo que más nos gusta, producir software de calidad.</p>
                </div>
            </div>
            <!--aqui	
        <div class="col-sm-6">
          <div class="our-skills wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="300ms">
            <div class="single-skill wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="300ms">
              <p class="lead">Diseño Web</p>
              <div class="progress">
                <div class="progress-bar progress-bar-primary six-sec-ease-in-out" role="progressbar"  aria-valuetransitiongoal="95">95%</div>
              </div>
    </div>
            <div class="single-skill wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="400ms">
              <p class="lead">Creatividad</p>
              <div class="progress">
                <div class="progress-bar progress-bar-primary six-sec-ease-in-out" role="progressbar"  aria-valuetransitiongoal="75">75%</div>
              </div>
            </div>
            <div class="single-skill wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="500ms">
              <p class="lead">Programación</p>
              <div class="progress">
                <div class="progress-bar progress-bar-primary six-sec-ease-in-out" role="progressbar"  aria-valuetransitiongoal="80">80%</div>
              </div>
            </div>
            <div class="single-skill wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="600ms">
              <p class="lead">Soporte</p>
              <div class="progress">
                <div class="progress-bar progress-bar-primary six-sec-ease-in-out" role="progressbar"  aria-valuetransitiongoal="85">85%</div>
              </div>
            </div>
          </div>
        </div>
	aqui -->
        </div>
        </div>
    </section>
    <!--/#about-us-->


    <section id="blog" class='section_card'>
        <div class="container">
            <div class="row">
                <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp heading_section" data-wow-duration="1200ms" data-wow-delay="300ms">
                    <h2>Que Hacemos</h2>
                    <p>Transformamos sus requerimientos en soluciones efectivas basadas en la tecnología y la innovación </p>
                </div>
            </div>

            <div class="blog-posts">
                <div class="row">
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="400ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/1.jpg" alt=""></a>
                        </div>
                        <div class="entry-header">
                            <h3><a>Entendemos la problemática</a></h3>
                        </div>
                        <div class="entry-content">
                            <p style="text-align: justify;">Es evidente que cada organización tiene procesos, problemática e ideas que son únicas, es por ello que, junto a ustedes nuestro equipo establecemos mecanismos de comunicación para logar una correcta interpretación de sus requerimientos e ideas</p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="600ms">
                        <div class="post-thumb">
                            <div id="post-carousel" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="item active">
                                        <a><img class="img-responsive" src="images/blog/2.jpg" alt=""></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="entry-header">
                            <h3><a>Presentamos propuestas</a></h3>
                        </div>
                        <div class="entry-content">
                            <p style="text-align: justify;">Tomando como fundamentos los requerimientos descritos, nuestro equipo trabaja intensamente en el diseño de diferentes alternativas con tecnología de punta agregando innovación para llegar a formular propuestas con soluciones efectivas para que junto a ustedes se tome la decisión final </p>
                        </div>
                    </div>
                    <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="800ms">
                        <div class="post-thumb">
                            <a><img class="img-responsive" src="images/blog/3.jpg" alt=""></a>
                        </div>
                        <div class="entry-header">
                            <h3><a>Entregamos soluciones efectivas </a></h3>
                        </div>
                        <div class="entry-content">
                            <p style="text-align: justify;">Nuestro equipo tiene la capacidad tecnológica basada en la ingeniería de software y el talento para plasmar en un producto de calidad las necesidades e innovaciones para entregarles soluciones efectivas a través de la implementación de requisitos funcionales como también requisitos no funcionales</p>
                        </div>
                    </div>
                </div>
                <div class="load-more wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="500ms">
                    <a href="#contact" class="btn-loadmore"><i class="fa fa-repeat"></i> Contáctanos</a>
                </div>
            </div>
        </div>
    </section>
    <!--/#blog-->

    <section id="twitter" class="parallax">
        <div>
            <a class="twitter-left-control" href="#twitter-carousel" role="button" data-slide="prev"><i class="fa fa-angle-left"></i></a>
            <a class="twitter-right-control" href="#twitter-carousel" role="button" data-slide="next"><i class="fa fa-angle-right"></i></a>
            <div class="container">
                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2">
                        <!--aqui    <div>
              <h4>Steve Jobs</h4>
            </div>  aqui -->
                        <div id="twitter-carousel" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">
                                <div class="item active wow fadeIn" data-wow-duration="1000ms" data-wow-delay="300ms">
                                    <h4><strong>Steve Jobs</strong></h4>
                                    <BR>
                                    <p>La innovación es lo que distingue a un líder de un seguidor.</p>
                                    <!-- <p>La innovación es lo que distingue a un líder de un seguidor.<a href="#"><span>#helixframework #joomla</span> http://bit.ly/1qlgwav</a></p>  -->
                                </div>
                                <div class="item">
                                    <h4><strong>John Lasseter</strong></h4>
                                    <BR>
                                    <p>El arte se opone a la tecnología, y la tecnología inspira al arte.</p>
                                </div>
                                <div class="item">
                                    <h4><strong>Albert Einstein</strong></h4>
                                    <BR>
                                    <p>La creatividad es inteligencia divirtiéndose.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--/#twitter-->

    <section id="portfolio" class='section_card'>
        <div class="container">
            <div class="row">
                <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp heading_section" data-wow-duration="1000ms" data-wow-delay="300ms">
                    <h2>Nuestros Productos</h2>
                    <p>Te presentamos nuestros productos de los que estamos orgullosos:</p>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row">

                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/7.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.enlinea24-7.com" target="_blank">
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>EnLinea24-7</h3>
                                            <p>Sistema de Gestión Comercial</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/4.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.miclases.com/" target="_blank">
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>Moodle</h3>
                                            <p>Plataforma Educativa Virtual</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="1000ms" data-wow-delay="500ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/10.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.smainn.com/" target="_blank">
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>eCommerce</h3>
                                            <p>LaFeriaEnLinea</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>


                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/6.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.facebook.com/appAcademica/" target="_blank">
                                <!-- <a href="#" data-toggle="modal" data-target="#myModal"> -->
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>App</h3>
                                            <p>Académica</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/3.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.spalhi.com/" target="_blank">
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>Spalhi</h3>
                                            <p>App Seguridad</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                            <img class="img-responsive" src="images/portfolio/1.jpg" alt="">
                        </div>
                        <div class="overlay">
                            <a href="https://www.sinapxys.com/" target="_blank">
                                <div class="overlay-content">
                                    <div class="overlay-text">
                                        <div class="folio-info">
                                            <h3>Sinapxys</h3>
                                            <p>Expedientes Electrónicos</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>



                <!--         <div class="col-sm-2">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="800ms" data-wow-delay="300ms">
                        <div class="folio-image">
                    <img class="img-responsive" src="images/portfolio/3.jpg" alt="">
                        </div>
                        <div class="overlay">
                        <a href="https://www.spalhi.com/" target="_blank">
                        <div class="overlay-content">
                            <div class="overlay-text">
                            <div class="folio-info">
                                <h3>Spalhi</h3>
                                <p>App Seguridad</p>
                            </div>
                            </div>
                        </div>
                        </a> 
                        </div>
                    </div>
                    </div> -->

            </div>
        </div>
        <!--	
		    <div class="container">
                <div class="row">
                    <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
                    <BR>
                    <BR>
                    <p>Te presentamos algunos de nuestros proyectos de los que estamos orgullosos:</p>
                    </div>		
                </div> 
                </div>
                
                <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                    <div class="folio-item wow fadeInRightBig" data-wow-duration="1000ms" data-wow-delay="300ms">
                        <div class="folio-image">
                        <img class="img-responsive" src="images/portfolio/5.png" alt="">
                        </div>
                        <div class="overlay">
                        <a href="http://automotrizreydereyes.com/" target="_blank">
                        <div class="overlay-content">
                            <div class="overlay-text">
                            <div class="folio-info">
                                <h3>Servicios Automotriz Rey de Reyes</h3>
                            </div>
                            </div>
                        </div>
                        </a> 
                        </div>
                    </div>
                    </div>
                    <div class="col-sm-4">
                    <div class="folio-item wow fadeInLeftBig" data-wow-duration="1000ms" data-wow-delay="400ms">
                        <div class="folio-image">
                        <img class="img-responsive" src="images/portfolio/4.png" alt="">
                        </div>
                        <div class="overlay">
                        <a href="http://www.uagrmbs.edu.bo/" target="_blank">
                        <div class="overlay-content">
                            <div class="overlay-text">
                            <div class="folio-info">
                                <h3>App Móvil UAGRMBS</h3>			  
                            </div>
                            </div>
                        </div>
                        </a> 
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            -->
        <div id="portfolio-single-wrap">
            <div id="portfolio-single">
            </div>
        </div><!-- /#portfolio-single-wrap -->
    </section>


    <div class="container text-center wow fadeInUp heading_section animated">
        <h2>Nuestro Clientes</h2>
        <section class="customer-logos slider">
            
            <div class="slide" style="position: relative;">
                <img src="https://image.freepik.com/free-vector/luxury-letter-e-logo-design_1017-8903.jpg">
                <span class="thumb-info-title">
                    <span class="thumb-info-inner text-center">Compras al contado y crédito</span>
                    <span class="thumb-info-type btn btn-primary">Ver</span>
                </span>
            </div>

            <div class="slide"><img src="http://www.webcoderskull.com/img/logo.png"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/3d-box-logo_1103-876.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/blue-tech-logo_1103-822.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/colors-curl-logo-template_23-2147536125.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/abstract-cross-logo_23-2147536124.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/football-logo-background_1195-244.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/background-of-spots-halftone_1035-3847.jpg"></div>
            <div class="slide"><img src="https://image.freepik.com/free-vector/retro-label-on-rustic-background_82147503374.jpg"></div>
        </section>
    </div>

    <!--/#portfolio-->

    <!--  aqui 
  <section id="team">
    <div class="container">
      <div class="row">
        <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp" data-wow-duration="1200ms" data-wow-delay="300ms">
          <h2>The Team</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
        </div>
      </div>
      <div class="team-members">
        <div class="row">
          <div class="col-sm-3">
            <div class="team-member wow flipInY" data-wow-duration="1000ms" data-wow-delay="300ms">
              <div class="member-image">
                <img class="img-responsive" src="images/team/1.jpg" alt="">
              </div>
              <div class="member-info">
                <h3>Marian Dixon</h3>
                <h4>CEO &amp; Founder</h4>
                <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt</p>
              </div>
              <div class="social-icons">
                <ul>
                  <li><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
                  <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                  <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                  <li><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
                  <li><a class="rss" href="#"><i class="fa fa-rss"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="team-member wow flipInY" data-wow-duration="1000ms" data-wow-delay="500ms">
              <div class="member-image">
                <img class="img-responsive" src="images/team/2.jpg" alt="">
              </div>
              <div class="member-info">
                <h3>Lawrence Lane</h3>
                <h4>UI/UX Designer</h4>
                <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt</p>
              </div>
              <div class="social-icons">
                <ul>
                  <li><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
                  <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                  <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                  <li><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
                  <li><a class="rss" href="#"><i class="fa fa-rss"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="team-member wow flipInY" data-wow-duration="1000ms" data-wow-delay="800ms">
              <div class="member-image">
                <img class="img-responsive" src="images/team/3.jpg" alt="">
              </div>
              <div class="member-info">
                <h3>Lois Clark</h3>
                <h4>Developer</h4>
                <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt</p>
              </div>
              <div class="social-icons">
                <ul>
                  <li><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
                  <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                  <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                  <li><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
                  <li><a class="rss" href="#"><i class="fa fa-rss"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="team-member wow flipInY" data-wow-duration="1000ms" data-wow-delay="1100ms">
              <div class="member-image">
                <img class="img-responsive" src="images/team/4.jpg" alt="">
              </div>
              <div class="member-info">
                <h3>Marian Dixon</h3>
                <h4>Support Manager</h4>
                <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt</p>
              </div>
              <div class="social-icons">
                <ul>
                  <li><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
                  <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                  <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                  <li><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
                  <li><a class="rss" href="#"><i class="fa fa-rss"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>            
    </div>
    aqui--  </section><!--/#team-->


    <!-- aqui
  <section id="features" class="parallax">
    <div class="container">
      <div class="row count">
        <div class="col-sm-3 col-xs-6 wow fadeInLeft" data-wow-duration="1000ms" data-wow-delay="300ms">
          <i class="fa fa-user"></i>
          <h3 class="timer">4000</h3>
          <p>Happy Clients</p>
        </div>
        <div class="col-sm-3 col-xs-6 wow fadeInLeft" data-wow-duration="1000ms" data-wow-delay="500ms">
          <i class="fa fa-desktop"></i>
          <h3 class="timer">200</h3>                    
          <p>Modern Websites</p>
        </div> 
        <div class="col-sm-3 col-xs-6 wow fadeInLeft" data-wow-duration="1000ms" data-wow-delay="700ms">
          <i class="fa fa-trophy"></i>
          <h3 class="timer">10</h3>                    
          <p>WINNING AWARDS</p>
        </div> 
        <div class="col-sm-3 col-xs-6 wow fadeInLeft" data-wow-duration="1000ms" data-wow-delay="900ms">
          <i class="fa fa-comment-o"></i>                    
          <h3>24/7</h3>
          <p>Fast Support</p>
        </div>                 
      </div>
    </div>
  aqui-- </section><!--/#features-->

    <!-- aqui 
  <section id="pricing">
    <div class="container">
      <div class="row">
        <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp" data-wow-duration="1200ms" data-wow-delay="300ms">
          <h2>Pricing Table</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
        </div>
      </div>
      <div class="pricing-table">
        <div class="row">
          <div class="col-sm-3">
            <div class="single-table wow flipInY" data-wow-duration="1000ms" data-wow-delay="300ms">
              <h3>Basic</h3>
              <div class="price">
                $9<span>/Month</span>                          
              </div>
              <ul>
                <li>Free Setup</li>
                <li>10GB Storage</li>
                <li>100GB Bandwith</li>
                <li>5 Products</li>
              </ul>
              <a href="#" class="btn btn-lg btn-primary">Sign up</a>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="single-table wow flipInY" data-wow-duration="1000ms" data-wow-delay="500ms">
              <h3>Standard</h3>
              <div class="price">
                $19<span>/Month</span>                                
              </div>
              <ul>
                <li>Free Setup</li>
                <li>10GB Storage</li>
                <li>100GB Bandwith</li>
                <li>5 Products</li>
              </ul>
              <a href="#" class="btn btn-lg btn-primary">Sign up</a>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="single-table featured wow flipInY" data-wow-duration="1000ms" data-wow-delay="800ms">
              <h3>Featured</h3>
              <div class="price">
                $29<span>/Month</span>                                
              </div>
              <ul>
                <li>Free Setup</li>
                <li>10GB Storage</li>
                <li>100GB Bandwith</li>
                <li>5 Products</li>
              </ul>
              <a href="#" class="btn btn-lg btn-primary">Sign up</a>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="single-table wow flipInY" data-wow-duration="1000ms" data-wow-delay="1100ms">
              <h3>Professional</h3>
              <div class="price">
                $49<span>/Month</span>                    
              </div>
              <ul>
                <li>Free Setup</li>
                <li>10GB Storage</li>
                <li>100GB Bandwith</li>
                <li>5 Products</li>
              </ul>
              <a href="#" class="btn btn-lg btn-primary">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
 aqui-- </section><!--/#pricing-->

    <!--  aqui
  <section id="blog">
    <div class="container">
      <div class="row">
        <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp" data-wow-duration="1200ms" data-wow-delay="300ms">
          <h2>Blog Posts</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
        </div>
      </div>
      <div class="blog-posts">
        <div class="row">
          <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="400ms">
            <div class="post-thumb">
              <a href="#"><img class="img-responsive" src="images/blog/1.jpg" alt=""></a> 
              <div class="post-meta">
                <span><i class="fa fa-comments-o"></i> 3 Comments</span>
                <span><i class="fa fa-heart"></i> 0 Likes</span> 
              </div>
              <div class="post-icon">
                <i class="fa fa-pencil"></i>
              </div>
            </div>
            <div class="entry-header">
              <h3><a href="#">Lorem ipsum dolor sit amet consectetur adipisicing elit</a></h3>
              <span class="date">June 26, 2014</span>
              <span class="cetagory">in <strong>Photography</strong></span>
            </div>
            <div class="entry-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </div>
          <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="600ms">
            <div class="post-thumb">
              <div id="post-carousel"  class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                  <li data-target="#post-carousel" data-slide-to="0" class="active"></li>
                  <li data-target="#post-carousel" data-slide-to="1"></li>
                  <li data-target="#post-carousel" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                  <div class="item active">
                    <a href="#"><img class="img-responsive" src="images/blog/2.jpg" alt=""></a>
                  </div>
                  <div class="item">
                    <a href="#"><img class="img-responsive" src="images/blog/1.jpg" alt=""></a>
                  </div>
                  <div class="item">
                    <a href="#"><img class="img-responsive" src="images/blog/3.jpg" alt=""></a>
                  </div>
                </div>                               
                <a class="blog-left-control" href="#post-carousel" role="button" data-slide="prev"><i class="fa fa-angle-left"></i></a>
                <a class="blog-right-control" href="#post-carousel" role="button" data-slide="next"><i class="fa fa-angle-right"></i></a>
              </div>                            
              <div class="post-meta">
                <span><i class="fa fa-comments-o"></i> 3 Comments</span>
                <span><i class="fa fa-heart"></i> 0 Likes</span> 
              </div>
              <div class="post-icon">
                <i class="fa fa-picture-o"></i>
              </div>
            </div>
            <div class="entry-header">
              <h3><a href="#">Lorem ipsum dolor sit amet consectetur adipisicing elit</a></h3>
              <span class="date">June 26, 2014</span>
              <span class="cetagory">in <strong>Photography</strong></span>
            </div>
            <div class="entry-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </div>
          <div class="col-sm-4 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="800ms">
            <div class="post-thumb">
              <a href="#"><img class="img-responsive" src="images/blog/3.jpg" alt=""></a>
              <div class="post-meta">
                <span><i class="fa fa-comments-o"></i> 3 Comments</span>
                <span><i class="fa fa-heart"></i> 0 Likes</span> 
              </div>
              <div class="post-icon">
                <i class="fa fa-video-camera"></i>
              </div>
            </div>
            <div class="entry-header">
              <h3><a href="#">Lorem ipsum dolor sit amet consectetur adipisicing elit</a></h3>
              <span class="date">June 26, 2014</span>
              <span class="cetagory">in <strong>Photography</strong></span>
            </div>
            <div class="entry-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </div>                    
        </div>
        <div class="load-more wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="500ms">
          <a href="#" class="btn-loadmore"><i class="fa fa-repeat"></i> Load More</a>
        </div>                
      </div>
    </div>
  aqui     </section><!--/#blog-->


    <section id="contact">
        <!--aqui   <div id="google-map" class="wow fadeIn" data-latitude="52.365629" data-longitude="4.871331" data-wow-duration="1000ms" data-wow-delay="400ms"></div>   aqui -->

        <!--ENVIO DE CORREO-->
        <!--            <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="row">
                                <h3>Contáctenos</h3>
                                <!--<p>Atenderemos su solicitud lo más pronto.</p>-->
        <!--                        </div>

                            <!--<p>Campos con <span class="error">*</span> son necesarios.</p>-->
        <!--                       <div class="row">
                                <!--  <a class="icon icon-envelop" href="mailto:info@spalhi.com" > info@spalhi.com</a>
                                    <p>Atenderemos su solicitud lo más pronto.</p> -->
        <!--                            <br> 

                                <!--To able send mail from form, uncomment this-->
        <!--                            <form class="form-horizontal" role="form" action="contact.php" method="post">
                                    <div class="col-sm-5">
                                        <div class="form-group">
                                            <div class="col-lg-10">
                                                <label for="name" class="control-label">Nombre</label>
                                                <input type="text" maxlength="50" class="form-control" id="name" name="name" placeholder="Nombre *" required="required">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-lg-10">
                                                <label for="email" class=" control-label">Correo</label>
                                                <input type="email" maxlength="70" class="form-control" id="email" name="email" placeholder="info@info*" required="required">
                                            </div>
                                        </div>
                                        <div class="form-group">

                                            <img id="captcha" src="library/vender/securimage/securimage_show.php" alt="CAPTCHA Image" />
                                            <a href="#" onclick="document.getElementById('captcha').src = 'library/vender/securimage/securimage_show.php?' + Math.random();
                                                    return false" class="btn btn-info btn-sm">Nueva imágen</a><br/>

                                        </div>
                                        <div class="form-group" >
                                            <div class="col-lg-10">
                                                <label class="control-label" for="captcha_code">Codigo *</label>
                                                <input type="text" maxlength="10" class="form-control" name="captcha_code" id="captcha_code" placeholder="Por seguridad, por favor ingrese el código mostrado en el cuadro." required="required" />
                                            </div>
                                            <span class="help-block" style="display: none;">Por favor ingrese el código mostrado en la imagen.</span>
                                        </div>

                                    </div>
                                    <div class="col-sm-7">
                                        <div class="form-group">
                                            <div class="col-lg-10">
                                                <label for="asunto" class="control-label">Asunto</label>
                                                <input type="text" maxlength="100" class="form-control" id="asunto" name="asunto" placeholder="Asunto *" required="required">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-lg-10">
                                                <label for="content" class=" control-label">Mensaje</label>
                                                <textarea placeholder="Mensaje *" maxlength="500" required="required" class="form-control" id="content" name="content" rows="5"></textarea>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-lg-10">
                                                <!-- <button type="submit" class="btn btn-success">Enviar</button>-->
        <!--                                        <button type="button" class="btn btn-success" id="enviar" name="enviar">Enviar</button>
                                            </div>
                                        </div>
                                    </div>
                                </form> 
                            </div>
                        </div><!--col-ms-12-->
        <!--            </div><!--row-->
        <!--fin        </div>  <!--container-->

        <!--END SEND EMAIL-->

        <div id="contact-us" class="parallax">
            <div class="container">
                <div class="row">
                    <div class="heading text-center col-sm-8 col-sm-offset-2 wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
                        <h2>Contáctanos</h2>
                        <p>ATENDEREMOS TU SOLICITUD LO MÁS PRONTO</p>
                    </div>
                </div>
                <div class="contact-form wow fadeIn" data-wow-duration="1000ms" data-wow-delay="600ms">
                    <div class="row">
                        <form id="main-contact-form" name="contact-form" method="post" action="contact.php">
                            <div class="col-sm-12">
                                <div class="row  wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="text" id="name" name="name" class="form-control title_form" placeholder="Nombre y Apellido *" required="required">
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="email" id="email" name="email" class="form-control title_form" placeholder="Email *" required="required">
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="text" id="phone" name="phone" class="form-control title_form" placeholder="Número Celular *" required="required">
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="text" id="city" name="city" class="form-control title_form" placeholder="Ciudad *" required="required">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <select id="asunto" name="asunto" class="form-control selectopcion title_form" required="required">
                                                <option value=''>Seleccionar producto/servicio a consultar: *</option>
                                                <option value='Plataforma educativa virtual'>Plataforma educativa virtual</option>
                                                <option value='Sistema de gestión empresarial, EnLinea24-7.com'>Sistema de gestión empresarial, EnLinea24-7.com</option>
                                                <option value='Expedientes judiciales electrónicos, Sinapxys.com'>Expedientes judiciales electrónicos, Sinapxys.com</option>
                                                <option value='Aplicación móvil para colegios, App Académica'>Aplicación móvil para colegios, App Académica</option>
                                                <option value='Desarrollo de software para Web, Móvil, otros'>Desarrollo de software para Web, Móvil, otros</option>
                                                <option value='Consulta de otro tipo'>Consulta de otro tipo</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="text" id="namebussines" name="namebussines" class="form-control title_form" placeholder="Nombre empresa">
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <input type="text" id="bussinesarea" name="bussinesarea" class="form-control title_form" placeholder="Rubro de la empresa">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <textarea id="message" name="message" class="form-control title_form" rows="4" placeholder="Escribe tu mensaje *" required="required"></textarea>
                                </div>

                                <div>
                                    <!--<div class="g-recaptcha" data-sitekey="6Ld5kcQUAAAAALb9fme18UPhuSw089arQv4Med0a"></div>-->
                                    <input type="hidden" name="recaptchaResponse" id="recaptchaResponse">
                                </div>
                                <div class="form-group">
                                    <!-- <button type="submit" class="btn-submit" id="enviar">Enviar</button>-->
                                    <button type="button" class="btn-submit" id="enviar" name="enviar">Enviar</button>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div id="inline-badge" style='margin-bottom: 20px; display: flex; justify-content: center;'></div>
                                <div class="contact-info wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms" style='display: flex; justify-content: center;'>
                                    <ul class="address">
                                        <li><i class="fa fa-map-marker"></i> <span> Dirección:</span> Av. Intermodal 3er anillo </li>
                                        <li><i class="fa fa-phone"></i> <span> Teléfono:</span> +591 3707072 </li>
                                        <li><i class="fa fa-tablet"></i> <span> WhatsApp:<a/span> +591 72112990 </li> <li><i class="fa fa-envelope"></i> <span> Email:</span><a href="mailto:info@smainn.com"> info@smainn.com</a></li>
                                        <li><i class="fa fa-globe"></i> <span> Sitio web:</span> <a href="https://www.smainn.com/">www.smainn.com</a></li>
                                        <li><span> Santa Cruz - Bolivia</span>
                                    </ul>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--/#contact-->

    <footer id="footer">
        <div class="footer-top wow fadeInUp" data-wow-duration="1000ms" data-wow-delay="300ms">
            <div class="container text-center">
                <div class="footer-logo">
                    <a href="index"><img class="img-responsive" src="images/logo.png" alt=""></a>
                </div>
                <div class="social-icons">
                    <ul>
                        <li><a class="envelope" href="mailto:info@smainn.com"><i class="fa fa-envelope"></i></a></li>
                        <!--  <li><a class="twitter" href="https://twitter.com/sinapxys" target="_blank"><i class="fa fa-twitter"></i></a></li> -->
                        <li><a class="facebook" href="https://www.facebook.com/solmainn/?ref=br_rs" target="_blank"><i class="fa fa-facebook"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <p>&copy; Copyright <label id="year"></label> Smainn</p>
                    </div>
                    <!--         <div class="col-sm-6">
            <p class="pull-right">Designed by <a href="http://www.themeum.com/">Themeum</a></p>
          </div>  -->
                </div>
            </div>
        </div>
    </footer>

    <!-- WhatsHelp.io widget -->
    <script type="text/javascript">
        (function() {
            var options = {
                facebook: "1806225906097336", // Facebook page ID
                whatsapp: "+59172112990", // WhatsApp number
                call_to_action: "Escríbenos", // Call to action
                button_color: "#129BF4", // Color of button
                position: "right", // Position may be 'right' or 'left'
                order: "facebook,whatsapp", // Order of buttons
            };
            var proto = document.location.protocol,
                host = "whatshelp.io",
                url = proto + "//static." + host;
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = url + '/widget-send-button/js/init.js';
            s.onload = function() {
                WhWidgetSendButton.init(host, proto, options);
            };
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        })();
    </script>

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <!-- <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>-->
    <script type="text/javascript" src="js/jquery.inview.min.js"></script>
    <script type="text/javascript" src="js/wow.min.js"></script>
    <script type="text/javascript" src="js/mousescroll.js"></script>
    <script type="text/javascript" src="js/smoothscroll.js"></script>
    <script type="text/javascript" src="js/jquery.countTo.js"></script>
    <script type="text/javascript" src="js/lightbox.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/jquery.confirm.js"></script>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js"></script>


    <script>
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-74373948-2', 'auto');
        ga('send', 'pageview');
        jQuery(document).ready(function($) {
            // body...
            $("#enviar").on("click", EnviarMensaje);
        });

        function Verificar_Input() {
            var name = $("#name").val();
            var asunto = $("#asunto").val().trim();
            var email = $("#email").val().trim();
            var content = $("#message").val().trim();
            var phone = $("#phone").val().trim();
            var city = $("#city").val().trim();

            //var captcha_code = $("#captcha_code").val();
            //let response = grecaptcha.getResponse();
            if (name == "") {
                mensaje_abvertencia("Nombre Requerido");
                return false;
            }
            if (email == "") {
                mensaje_abvertencia("Email Requerido");
                return false;
            }

            var emailverif = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailverif.test(email)) {
                mensaje_abvertencia("Email Incorrecto");
                return false;
            }
            if (phone == "") {
                mensaje_abvertencia("Numero de Celular Requerido");
                return false;
            }
            //var phoneverif = /^(\([0-9]{3}\)\s*?\+\d{2,3}\s*?\d{6,7,8,9}$/;
            //if (!phoneverif.test(phone)) {
            //mensaje_abvertencia("Número Incorrecto");
            //return false;
            //}
            if (city == "") {
                mensaje_abvertencia("Ciudad Requerido");
                return false;
            }

            if (asunto == "") {
                mensaje_abvertencia("Asunto Requerido");
                return false;
            }
            if (content == "") {
                mensaje_abvertencia("Mensaje Requerido");
                return false;
            }



            /*if (response.length == 0) {
                mensaje_abvertencia("Captcha Requerido");
                return false;
            }*/
            return true;
        }

        function mensaje_abvertencia(msg) {
            $.confirm({
                title: "Mensaje de Advertencia",
                text: msg,
                confirm: function(button) {
                    return true;
                },
                cancel: function(button) {
                    return false;
                },
                confirmButton: "<i class='fa fa-check'></i> Aceptar",
                cancelButtonClass: "<i class='fa fa-times'></i> hidden"
            });
        }

        function EnviarMensaje(e) {
            e.preventDefault();
            var name = $("#name").val();
            var asunto = $("#asunto").val();
            var email = $("#email").val();
            var content = $("#message").val();
            var phone = $("#phone").val();
            var city = $("#city").val();
            var namebussines = $("#namebussines").val();
            var bussinesarea = $("#bussinesarea").val();
            var captcha_code = $("#recaptchaResponse").val();
            if (Verificar_Input()) {
                var parametros = {
                    name: name,
                    asunto: asunto,
                    email: email,
                    message: content,
                    phone: phone,
                    city: city,
                    namebussines: namebussines,
                    bussinesarea: bussinesarea,
                    "recaptchaResponse": captcha_code,
                };
                $.ajax({
                    type: 'POST',
                    url: "./contact.php",
                    data: parametros,
                    success: function(resp) {
                        //console.log(resp);
                        var result = resp.trim();
                        switch (result) {
                            case "-1":
                                mensaje_abvertencia("Nombre Requerido");
                                break;

                            case "-2":
                                mensaje_abvertencia("Email Requerido");
                                break;

                            case "-3":
                                mensaje_abvertencia("Télefono Requerido");
                                break;

                            case "-4":
                                mensaje_abvertencia("Ciudad Requerido");
                                break;

                            case "-5":
                                mensaje_abvertencia("Asunto Requerido");
                                break;

                            case "-6":
                                mensaje_abvertencia("Mensaje Requerido");
                                break;

                            case "NoCod":
                                mensaje_abvertencia("CÓDIGO DE SEGURIDAD NO VÁLIDO !");
                                break;
                            case "ok":
                                $.confirm({
                                    title: "Mensaje de Confirmación",
                                    text: "SU MENSAJE FUE ENVIADO CORRECTAMENTE, PRONTO LO ATENDEREMOS",
                                    confirm: function(button) {
                                        document.location.href = "index.html";
                                    },
                                    //                                    						cancel: function (button) {
                                    //                                    						},
                                    confirmButton: "<i class='fa fa-check'></i> Aceptar",
                                    cancelButtonClass: "<i class='fa fa-times'></i> hidden",
                                });
                                break;
                            case "NoEmail":
                                $.confirm({
                                    title: "Mensaje de Advertencia",
                                    text: "MENSAJE NO ENVIADO, INTENTE NUEVAMENTE",
                                    confirm: function(button) {
                                        // document.location.href = "<?php echo $baseUrl ?>/site/index";
                                    },
                                    //                                    					    cancel: function (button) {
                                    //                                    					    },
                                    confirmButton: "<i class='fa fa-check'></i> Aceptar",
                                    cancelButtonClass: "<i class='fa fa-times'></i> hidden",
                                });
                                break;
                        }
                    }
                });
            }
        }
        /*
                                                $("#telefono").keypress(function (event) {
                                                    var numero = /[0-9]/g;
                                                    var key = String.fromCharCode(event.which);
                                                    if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || numero.test(key)) {
                                                    } else {
                                                        $("#" + this.id + "_em_").html("Introducir solo números por favor").show().fadeOut(900);
                                                        return false;
                                                    }
                                                });

                                                $("#email").keypress(function (event) {
                                                    var letra = /^[a-zA-ZñÑáéíóú@_.- ]+$/i;
                                                    var key = String.fromCharCode(event.which);
                                                    if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || letra.test(key)) {
                                                    } else {
                                                        $("#" + this.id + "_em_").html("Introducir solo Letras").show().fadeOut(900);
                                                        return false;
                                                    }
                                                });
						*/
    </script>

    <!--  botonsinapxyscuenta
aqui va   -->
    <script type="text/javascript">
        var fecha = new Date();
        var year = fecha.getFullYear();
        var lbl_year = document.getElementById('year');
        lbl_year.textContent = year;
    </script>

</body>

<script>
    function onRecaptchaLoadCallback() {
        var clientId = grecaptcha.render('inline-badge', {
            'sitekey': '6LfI5fQUAAAAAJD7yIScdU12hDB28LV9UGvtBPNA',
            'badge': 'inline',
            'size': 'invisible'
        });
        grecaptcha.ready(function() {
            grecaptcha.execute(clientId, {
                action: 'homepage'
            }).then(function(token) {
                var recaptchaResponse = document.getElementById('recaptchaResponse');
                recaptchaResponse.value = token;
            });
        });
    }


    $(document).ready(function() {
        $('.customer-logos').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1500,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1
                }
            }]
        });
    });
</script>
<!-- Mirrored from demo.themeum.com/html/oxygen/ by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 20 Mar 2018 15:59:42 GMT -->

</html>