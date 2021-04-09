<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
	<head>
		<meta charset="ISO-8859-1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, shrink-to-fit=no" />
		<meta name="description" content="Sistema empresarial para la comercialización - ERP">
		<meta name="keywords" content="ERP, sistema de ventas, sistema de compras, sistema contable, sistema de contabilidad, software de venta, software  contable,  software  de compra, software de contabilidad, sistemas en Bolivia, sistemas en Santa Cruz, software en Bolivia, software en Santa Cruz">
		<meta name="author" content="Smainn">
		<meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Enlinea24-7</title>

		<link rel="shortcut icon" href="template/img/iconoweb.png" type="image/x-icon" />
		<link rel="apple-touch-icon" href="img/apple-touch-icon.png" />
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800%7CShadows+Into+Light%7CPlayfair+Display:400" rel="stylesheet" type="text/css" />
		
        <link href="{{ asset('template/plugins/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/fontawesome-free/css/all.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/animate/animate.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/simple-line-icons/css/simple-line-icons.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/owl.carousel/assets/owl.carousel.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/owl.carousel/assets/owl.theme.default.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/magnific-popup/magnific-popup.min.css') }}" rel="stylesheet" />

        <link href="{{ asset('template/css/theme.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/css/theme-elements.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/css/theme-blog.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/css/theme-shop.css') }}" rel="stylesheet" />

        <link href="{{ asset('template/plugins/rs-plugin/css/settings.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/rs-plugin/css/layers.css') }}" rel="stylesheet" />
        <link href="{{ asset('template/plugins/rs-plugin/css/navigation.css') }}" rel="stylesheet" />

		{{--  <link href="{{ asset('template/css/default.css') }}" rel="stylesheet" />  --}}
		<link href="{{ asset('template/css/red.css') }}" rel="stylesheet" />

        <!-- Theme Custom CSS -->
        <link href="{{ asset('template/css/custom.css') }}" rel="stylesheet" />

        <!-- Head Libs -->
		<script src="{{ asset('template/js/modernizr.min.js') }}"></script>
		<style>
			.habilitar {
				font-family: "Open Sans", Arial, sans-serif;
				font-size: 12.6px;
				line-height: 18px;
				text-align: left;
				letter-spacing: normal;
				color: #c10000;
				background: #ededed;
				display: none;
			}

			.validar {
				font-family: "Open Sans", Arial, sans-serif;
				font-size: 12.6px;
				line-height: 18px;
				text-align: left;
				letter-spacing: normal;
				color: #c10000;
				background: #ededed;
				display: none;
			}

            .error {
                font-family: "Open Sans", Arial, sans-serif;
				font-size: 12.6px;
				line-height: 18px;
				text-align: left;
				letter-spacing: normal;
				color: #c10000;
				background: #ededed;
				display: none;
			}
			
			

			@media (max-width: 500px) {
				.centrado {
					text-align: center;
				}
			}

			@media (min-width: 1000px) {
				.leftImg {
					float: left!important;
				}
			}
			

			.g-recaptcha {
				display: inline-block;
				transform: scale(0.84);
                        transform-origin: 0 0;
			}
			.centrar{
				display: inline-block;
			}
		</style>
	</head>
	{{-- <body class="loading-overlay-showing" data-plugin-page-transition data-loading-overlay data-plugin-options="{'hideDelay': 500}">
		<div class="loading-overlay">
			<div class="bounce-loader">
				<div class="bounce1"></div>
				<div class="bounce2"></div>
				<div class="bounce3"></div>
			</div>
		</div> --}}
	<body class="one-page" data-target="#header" data-spy="scroll" data-offset="100">

		<div class="body">

			<header id="header" class="header-transparent header-effect-shrink" data-plugin-options="{'stickyEnabled': true, 'stickyEffect': 'shrink', 'stickyEnableOnBoxed': true, 'stickyEnableOnMobile': true, 'stickyChangeLogo': true, 'stickyStartAt': 30, 'stickyHeaderContainerHeight': 70}">
				<div class="header-body border-top-0 bg-dark box-shadow-none">
					<div class="header-container container">
						<div class="header-row">
							<div class="header-column">
								<div class="header-row">
									<div class="header-logo">
										<a data-hash href="#home">
											<img alt="Porto" width="200" height="60" src="template/img/logolargo247ok.png">
										</a>
									</div>
								</div>
							</div>
							<div class="header-column justify-content-end">
								<div class="header-row">
									<div class="header-nav header-nav-links header-nav-dropdowns-dark header-nav-light-text order-2 order-lg-1">
										<div class="header-nav-main header-nav-main-mobile-dark header-nav-main-square header-nav-main-dropdown-no-borders header-nav-main-effect-2 header-nav-main-sub-effect-1">
											<nav class="collapse">
												<ul class="nav nav-pills" id="mainNav">
													<li class="dropdown">
														<a data-hash class="dropdown-item active text-capitalize" style="font-size: 100%" href="#home">Inicio</a>
														{{-- <ul class="dropdown-menu">
															<li><a class="dropdown-item" href="index-classic.html">Default Home</a></li>
															<li><a class="dropdown-item" href="index-one-page.html">One Page Website</a></li>
														</ul> --}}
													</li>
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#services">Presentación</a>
													</li>
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#projects">Funciones</a>
													</li>
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#clients">Aplicaciones</a>
													</li>
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#team">Características</a>
													</li>
													{{--  <li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#other">Other</a>
													</li>  --}}
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" data-hash data-hash-offset="68" href="#contact">Contacto</a>
													</li>
													<li>
														<a class="dropdown-item text-capitalize" style="font-size: 100%" href="/login">Mi cuenta</a>
													</li>
												</ul>
											</nav>
										</div>
										<button class="btn header-btn-collapse-nav" data-toggle="collapse" data-target=".header-nav-main nav">
											<i class="fas fa-bars"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div role="main" class="main" id="home">
				<div class="slider-container rev_slider_wrapper" style="height: 100vh;">
					<div id="revolutionSlider" class="slider rev_slider" data-version="5.4.8" data-plugin-revolution-slider data-plugin-options="{'sliderLayout': 'fullscreen', 'delay': 9000, 'gridwidth': 1140, 'gridheight': 800, 'responsiveLevels': [4096,1200,992,500]}">
						<ul>
							{{-- <li class="slide-overlay" data-transition="fade">
								<img src="img/slides/slide-one-page-1-1.jpg"
									alt=""
									data-bgposition="center center"
									data-bgfit="cover"
									data-bgrepeat="no-repeat"
									class="rev-slidebg">

								<div class="tp-caption tp-resizeme"
									data-frames='[{"delay":1500,"speed":2000,"frame":"0","from":"opacity:0;x:-100%;y:-100%;","to":"o:1;x:0;y:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
								    data-type="image"
									data-x="left" data-hoffset="['0','-150','-200','-200']"
									data-y="top" data-voffset="['-100','-150','-200','-200']"
								    data-width="['auto']"
								    data-height="['auto']"
								    data-basealign="slide"><img src="img/slides/slide-one-page-1-2.jpg" alt=""></div>

								<div class="tp-caption tp-resizeme"
									data-frames='[{"delay":1500,"speed":2000,"frame":"0","from":"opacity:0;x:100%;y:-100%;","to":"o:1;x:0;y:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
								    data-type="image"
									data-x="right" data-hoffset="['0','-150','-200','-200']"
									data-y="top" data-voffset="['-100','-150','-200','-200']"
								    data-width="['auto']"
								    data-height="['auto']"
								    data-basealign="slide"><img src="img/slides/slide-one-page-1-3.jpg" alt=""></div>

								<div class="tp-caption tp-resizeme"
									data-frames='[{"delay":1500,"speed":2000,"frame":"0","from":"opacity:0;x:-100%;y:100%;","to":"o:1;x:0;y:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
								    data-type="image"
									data-x="left" data-hoffset="['0','-150','-200','-200']"
									data-y="bottom" data-voffset="['-100','-150','-200','-200']"
								    data-width="['auto']"
								    data-height="['auto']"
								    data-basealign="slide"><img src="img/slides/slide-one-page-1-4.jpg" alt=""></div>

								<div class="tp-caption tp-resizeme"
									data-frames='[{"delay":1500,"speed":2000,"frame":"0","from":"opacity:0;x:100%;y:100%;","to":"o:1;x:0;y:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
								    data-type="image"
									data-x="right" data-hoffset="['0','-150','-200','-200']"
									data-y="bottom" data-voffset="['-100','-150','-200','-200']"
								    data-width="['auto']"
								    data-height="['auto']"
								    data-basealign="slide"><img src="img/slides/slide-one-page-1-5.jpg" alt=""></div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['-170','-170','-170','-365']"
									data-y="center" data-voffset="['-80','-80','-80','-105']"
									data-start="1000"
									data-transform_in="x:[-300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption text-color-light font-weight-normal"
									data-x="center"
									data-y="center" data-voffset="['-80','-80','-80','-105']"
									data-start="700"
									data-fontsize="['16','16','16','40']"
									data-lineheight="['25','25','25','45']"
									data-transform_in="y:[-50%];opacity:0;s:500;">WE WORK HARD AND PORTO HAS</div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['170','170','170','365']"
									data-y="center" data-voffset="['-80','-80','-80','-105']"
									data-start="1000"
									data-transform_in="x:[300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<h1 class="tp-caption font-weight-extra-bold text-color-light negative-ls-1"
									data-frames='[{"delay":1000,"speed":2000,"frame":"0","from":"sX:1.5;opacity:0;fb:20px;","to":"o:1;fb:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center"
									data-y="center" data-voffset="['-30','-30','-30','-30']"
									data-fontsize="['50','50','50','90']"
									data-lineheight="['55','55','55','95']">THE BEST DESIGN</h1>

								<div class="tp-caption"
									data-frames='[{"delay":2000,"speed":500,"frame":"0","from":"opacity:0;x:10%;","to":"opacity:1;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center" data-hoffset="['-40','-40','-40','-40']"
									data-y="center" data-voffset="['2','2','2','15']"><img src="img/slides/slide-blue-line-big.png" alt=""></div>

								<div class="tp-caption font-weight-light ws-normal text-center"
									data-frames='[{"from":"opacity:0;","speed":300,"to":"o:1;","delay":2000,"split":"chars","splitdelay":0.03,"ease":"Power2.easeInOut"},{"delay":"wait","speed":1000,"to":"y:[100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power2.easeInOut"}]'
									data-x="center"
									data-y="center" data-voffset="['53','53','53','105']"
									data-width="['530','530','530','1100']"
									data-fontsize="['18','18','18','40']"
									data-lineheight="['26','26','26','45']"
									style="color: #b5b5b5;">Trusted by over <strong class="text-color-light">30,000</strong> satisfied users, Porto is a huge success in the one of largest world's MarketPlace.</div>

								<a class="tp-caption btn btn-primary btn-rounded font-weight-semibold"
									data-frames='[{"delay":2500,"speed":2000,"frame":"0","from":"opacity:0;y:50%;","to":"o:1;y:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-hash
									data-hash-offset="85"
									href="#projects"
									data-x="center" data-hoffset="0"
									data-y="center" data-voffset="['133','133','133','255']"
									data-whitespace="nowrap"
									data-fontsize="['14','14','14','33']"
									data-paddingtop="['15','15','15','40']"
									data-paddingright="['45','45','45','110']"
									data-paddingbottom="['15','15','15','40']"
									data-paddingleft="['45','45','45','110']">GET STARTED NOW!</a>

							</li> --}}
							<li class="slide-overlay" data-transition="fade">
								<img src="template/img/home1.jpg"
									alt=""
									data-bgposition="center center"
									data-bgfit="cover"
									data-bgrepeat="no-repeat"
									class="rev-slidebg">

								{{--  <div class="tp-caption"
									data-x="center" data-hoffset="['-170','-170','-170','-350']"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="1000"
									data-transform_in="x:[-300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption text-color-light font-weight-normal"
									data-x="center"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="700"
									data-fontsize="['16','16','16','40']"
									data-lineheight="['25','25','25','45']"
									data-transform_in="y:[-50%];opacity:0;s:500;"></div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['170','170','170','350']"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="1000"
									data-transform_in="x:[300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>  --}}

									<div class="tp-caption ws-normal text-center text-color-light mt-1 py-5 mt-0"
									data-frames='[{"delay":1000,"speed":2000,"frame":"0","from":"sX:1.5;opacity:0;fb:20px;","to":"o:1;fb:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center"
									data-y="center"
									data-width="['1200','1200','1200','1250']"
									data-fontsize="['40','40','40','80']"
									data-lineheight="['50','50','50','80']">LA BASE DE LA TRANSFORMACIÓN DIGITAL DE SU NEGOCIO</div>

								<div class="tp-caption ws-normal text-center text-color-light mt-1 opacity-8"
									data-frames='[{"from":"opacity:0;","speed":50,"to":"o:1;","delay":2000,"split":"chars","splitdelay":0.03,"ease":"Power2.easeInOut"},{"delay":"wait","speed":1000,"to":"y:[100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power2.easeInOut"}]'
									data-x="center"
									data-y="center" data-voffset="['60','60','60','200']"
									data-width="['750','750','750','1100']"
									data-fontsize="['18','18','18','40']"
									data-lineheight="['26','26','26','45']"
									style="color: #b5b5b5;">EnLinea24-7 es el agente catalizador que precisa para revolucionar y potenciar el exíto de su negocio a traves de la gestión de la información efectiva de su empresa.</div>

							</li>
							{{-- <li class="slide-overlay slide-overlay-dark" data-transition="fade">
								<img src="img/slides/slide-bg-6.jpg"
									alt=""
									data-bgposition="center center"
									data-bgfit="cover"
									data-bgrepeat="no-repeat"
									class="rev-slidebg">

								<div class="tp-caption"
									data-x="center" data-hoffset="['-145','-145','-145','-320']"
									data-y="center" data-voffset="['-80','-80','-80','-130']"
									data-start="1000"
									data-transform_in="x:[-300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption text-color-light font-weight-normal"
									data-x="center"
									data-y="center" data-voffset="['-80','-80','-80','-130']"
									data-start="700"
									data-fontsize="['16','16','16','40']"
									data-lineheight="['25','25','25','45']"
									data-transform_in="y:[-50%];opacity:0;s:500;">WE CREATE DESIGNS, WE ARE</div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['145','145','145','320']"
									data-y="center" data-voffset="['-80','-80','-80','-130']"
									data-start="1000"
									data-transform_in="x:[300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption font-weight-extra-bold text-color-light"
									data-frames='[{"delay":1300,"speed":1000,"frame":"0","from":"opacity:0;x:-50%;","to":"opacity:0.7;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center" data-hoffset="['-155','-155','-155','-255']"
									data-y="center"
									data-fontsize="['145','145','145','250']"
									data-lineheight="['150','150','150','260']">P</div>

								<div class="tp-caption font-weight-extra-bold text-color-light"
									data-frames='[{"delay":1500,"speed":1000,"frame":"0","from":"opacity:0;x:-50%;","to":"opacity:0.7;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center" data-hoffset="['-80','-80','-80','-130']"
									data-y="center"
									data-fontsize="['145','145','145','250']"
									data-lineheight="['150','150','150','260']">O</div>

								<div class="tp-caption font-weight-extra-bold text-color-light"
									data-frames='[{"delay":1700,"speed":1000,"frame":"0","from":"opacity:0;x:-50%;","to":"opacity:0.7;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center"
									data-y="center"
									data-fontsize="['145','145','145','250']"
									data-lineheight="['150','150','150','260']">R</div>

								<div class="tp-caption font-weight-extra-bold text-color-light"
									data-frames='[{"delay":1900,"speed":1000,"frame":"0","from":"opacity:0;x:-50%;","to":"opacity:0.7;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center" data-hoffset="['65','65','65','115']"
									data-y="center"
									data-fontsize="['145','145','145','250']"
									data-lineheight="['150','150','150','260']">T</div>

								<div class="tp-caption font-weight-extra-bold text-color-light"
									data-frames='[{"delay":2100,"speed":1000,"frame":"0","from":"opacity:0;x:-50%;","to":"opacity:0.7;x:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center" data-hoffset="['139','139','139','240']"
									data-y="center"
									data-fontsize="['145','145','145','250']"
									data-lineheight="['150','150','150','260']">O</div>

								<div class="tp-caption font-weight-light text-color-light"
									data-frames='[{"from":"opacity:0;","speed":300,"to":"o:1;","delay":2300,"split":"chars","splitdelay":0.05,"ease":"Power2.easeInOut"},{"delay":"wait","speed":1000,"to":"y:[100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power2.easeInOut"}]'
									data-x="center"
									data-y="center" data-voffset="['85','85','85','140']"
									data-fontsize="['18','18','18','40']"
									data-lineheight="['26','26','26','45']">The best choice for your new website</div>

							</li> --}}
							{{-- <li class="slide-overlay" data-transition="fade">
								<img src="img/blank.gif"
									alt=""
									data-bgposition="center center"
									data-bgfit="cover"
									data-bgrepeat="no-repeat"
									class="rev-slidebg">

								<div class="rs-background-video-layer"
									data-forcerewind="on"
									data-volume="mute"
									data-videowidth="100%"
									data-videoheight="100%"
									data-videomp4="video/memory-of-a-woman.mp4"
									data-videopreload="preload"
									data-videoloop="loop"
									data-forceCover="1"
									data-aspectratio="16:9"
									data-autoplay="true"
									data-autoplayonlyfirsttime="false"
									data-nextslideatend="false">
								</div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['-170','-170','-170','-350']"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="1000"
									data-transform_in="x:[-300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;" style="z-index: 5;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption text-color-light font-weight-normal"
									data-x="center"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="700"
									data-fontsize="['16','16','16','40']"
									data-lineheight="['25','25','25','45']"
									data-transform_in="y:[-50%];opacity:0;s:500;" style="z-index: 5;">WE WORK HARD AND PORTO HAS</div>

								<div class="tp-caption"
									data-x="center" data-hoffset="['170','170','170','350']"
									data-y="center" data-voffset="['-50','-50','-50','-75']"
									data-start="1000"
									data-transform_in="x:[300%];opacity:0;s:500;"
									data-transform_idle="opacity:0.2;s:500;" style="z-index: 5;"><img src="img/slides/slide-title-border.png" alt=""></div>

								<div class="tp-caption font-weight-extra-bold text-color-light negative-ls-1"
									data-frames='[{"delay":1000,"speed":2000,"frame":"0","from":"sX:1.5;opacity:0;fb:20px;","to":"o:1;fb:0;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;fb:0;","ease":"Power3.easeInOut"}]'
									data-x="center"
									data-y="center"
									data-fontsize="['50','50','50','90']"
									data-lineheight="['55','55','55','95']" style="z-index: 5;">PERFECT VIDEOS</div>

								<div class="tp-caption font-weight-light ws-normal text-center"
									data-frames='[{"from":"opacity:0;","speed":300,"to":"o:1;","delay":2000,"split":"chars","splitdelay":0.05,"ease":"Power2.easeInOut"},{"delay":"wait","speed":1000,"to":"y:[100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power2.easeInOut"}]'
									data-x="center"
									data-y="center" data-voffset="['60','60','60','105']"
									data-width="['530','530','530','1100']"
									data-fontsize="['18','18','18','40']"
									data-lineheight="['26','26','26','45']"
									style="color: #b5b5b5; z-index: 5;">Trusted by over <strong class="text-color-light">30,000</strong> satisfied users, Porto is a huge success in the one of largest worlds MarketPlace.</div>

								<div class="tp-dottedoverlay tp-opacity-overlay"></div>
							</li> --}}
						</ul>
					</div>
				</div>
				<section id="services" class="section section-height-3 bg-primary border-0 m-0 appear-animation" data-appear-animation="fadeIn">
					<div class="container my-3">
						<div class="row mb-5">
							<div class="col text-center appear-animation" data-appear-animation="fadeInUpShorter" data-appear-animation-delay="200">
								<h2 class="font-weight-bold text-color-light mb-2">EnLinea24-7</h2>
								<p class="text-color-light opacity-9">Tecnología para la gestión de la información empresarial </p>
							</div>
						</div>
						<div class="row mb-lg-4">
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInLeftShorter" data-appear-animation-delay="300">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="icons icon-layers text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">EFECTIVIDAD</h4>
										<p class="text-color-light opacity-9 text-justify">EnLinea24-7 es una solución web que permite concentre su esfuerzo en las decisiones estratégicas para el crecimiento de su negocio, para lo cual aseguramos entregarle la información efectiva del estado de su negocio para lograr el éxito en sus decisiones.</p>
									</div>
								</div>
							</div>
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInUpShorter">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="icons icon-organization text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">PERSONALIZABLE</h4>
										<p class="text-color-light opacity-9 text-justify">EnLinea24-7 está diseñado para aplicar en negocios de diferentes rubros y tamaños como ser: Tiendas de comercio en general, Profesionales independientes, Talleres mecánicos, Buffet de Abogados y otros.</p>
									</div>
								</div>
							</div>
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInRightShorter" data-appear-animation-delay="300">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="fas fa-retweet text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">ESCALABLE</h4>
										<p class="text-color-light opacity-9 text-justify">Aplique EnLinea24-7 de forma inmediata gradual, conforme vaya creciendo su negocio, pague solo por lo que precisa  de un sistema y consiga tener a su alcance toda una infraestructura informática robusta  disponible las 24/7, desde donde se encuentre y disfrute de un sistema simple e intuitivo  y sobre todo efectivo para la toma de decisiones.</p>
									</div>
								</div>
							</div>
						</div>
						{{--  <div class="row">
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInLeftShorter" data-appear-animation-delay="300">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="icons icon-doc text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">HTML5 / CSS3 / JS</h4>
										<p class="text-color-light opacity-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum pellentesque imperdiet. Nulla lacinia iaculis nulla.</p>
									</div>
								</div>
							</div>
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInUpShorter">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="icons icon-user text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">ICONS</h4>
										<p class="text-color-light opacity-7">Lorem ipsum dolor sit amet, consectetur adipiscing <span class="alternative-font text-color-light">metus.</span> elit. Quisque rutrum pellentesque imperdiet.</p>
									</div>
								</div>
							</div>
							<div class="col-lg-4 appear-animation" data-appear-animation="fadeInRightShorter" data-appear-animation-delay="300">
								<div class="feature-box feature-box-style-2">
									<div class="feature-box-icon">
										<i class="icons icon-screen-desktop text-color-light"></i>
									</div>
									<div class="feature-box-info">
										<h4 class="font-weight-bold text-color-light text-4 mb-2">LIGHTBOX</h4>
										<p class="text-color-light opacity-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum pellentesque imperdiet. Nulla lacinia iaculis nulla.</p>
									</div>
								</div>
							</div>
						</div>  --}}
					</div>
				</section>

				<div id="projects" class="container">
					<div class="row justify-content-center pt-5 mt-5">
						<div class="col-lg-9 text-center">
							<div class="appear-animation" data-appear-animation="fadeInUpShorter">
								<h2 class="font-weight-bold mb-2 text-uppercase">Soluciones y Funcionalidades</h2>
								<p class="mb-4 text-color-dark">A su alcance un potente asistente para la toma decisiones efectiva para su empresa</p>
							</div>
							<p class="pb-3 mb-4 appear-animation text-color-dark" data-appear-animation="fadeInUpShorter" data-appear-animation-delay="200">Contamos con las funcionalidades necesarias, simples y fáciles de usar para la gestión de la información comercial de su empresa, las misma que permanente van evolucionando.</p>
						</div>
					</div>
					<div class="row pb-5 mb-5">
						<div class="col">

							<div class="appear-animation popup-gallery-ajax" data-appear-animation="fadeInUpShorter" data-appear-animation-delay="200">
								<div class="owl-carousel owl-theme mb-0" data-plugin-options="{'items': 4, 'margin': 35, 'loop': false}">

									<div class="portfolio-item">
										<a href="template/pages/ventas.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones1.png" class="img-fluid border-radius-0" alt="">

													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Ventas al contado y crédito</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/inventario.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones44.png" class="img-fluid border-radius-0" alt="">

													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">&nbsp; &nbsp; &nbsp; &nbsp; Control de &nbsp; &nbsp; &nbsp; &nbsp; inventario</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/compras.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones2.png" class="img-fluid border-radius-0" alt="">

													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Compras al contado y crédito</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/contabilidad.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/contabilidad.jpg" class="img-fluid border-radius-0" alt="">

													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Contabilidad General</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/listaprecio.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones5.png" class="img-fluid border-radius-0" alt="">
													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Gestiones de diversas listas de precios</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/multiusuario.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones4.png" class="img-fluid border-radius-0" alt="">
													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Control y monitoreo del sistema</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

									<div class="portfolio-item">
										<a href="template/pages/taller.html" data-ajax-on-modal>
											<span class="thumb-info thumb-info-lighten">
												<span class="thumb-info-wrapper">
													<img src="template/img/funciones7.jpg" class="img-fluid border-radius-0" alt="">
													<span class="thumb-info-title">
														<span class="thumb-info-inner text-center">Gestion de talleres mecánicos</span>
														<span class="thumb-info-type">Ver</span>
													</span>
													<span class="thumb-info-action">
														<span class="thumb-info-action-icon bg-dark opacity-8"><i class="fas fa-plus"></i></span>
													</span>
												</span>
											</span>
										</a>
									</div>

								</div>
							</div>

						</div>
					</div>
				</div>

				<section id="clients" class="section section-background section-height-4 overlay overlay-show overlay-op-9 border-0 m-0" style="background-image: url(template/img/home.png); background-size: cover; background-position: center;">
					<div class="container">
						<div class="row">
							<div class="col text-center">
								<h2 class="font-weight-bold text-color-light mb-2">Áreas de aplicación de EnLinea24-7</h2>
								<p class="text-color-light opacity-9">Diseñado para ser personalizado y tenerlo disponible de forma inmediata para todo tipo de comercio en general.</p>
							</div>
						</div>
						<div class="row text-center py-3 my-4">
							<div class="owl-carousel owl-theme carousel-center-active-item carousel-center-active-item-style-2 mb-0" data-plugin-options="{'responsive': {'0': {'items': 1}, '476': {'items': 1}, '768': {'items': 5}, '992': {'items': 7}, '1200': {'items': 7}}, 'autoplay': true, 'autoplayTimeout': 3000, 'dots': false}">
								<div>
									<img class="img-fluid" src="template/img/logos/cli1.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli2.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli3.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli5.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli6.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli7.png" alt="">
								</div>
								<div>
									<img class="img-fluid" src="template/img/logos/cli8.png" alt="">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col">

								<div class="owl-theme nav-bottom rounded-nav mb-0" data-plugin-options="{'items': 1, 'loop': true, 'autoHeight': true}">
									{{--  <div>
										<div class="testimonial testimonial-style-2 testimonial-light testimonial-with-quotes testimonial-quotes-primary mb-0">
											<blockquote>
												<p class="text-5 line-height-5 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget risus porta, tincidunt turpis at, interdum tortor. Suspendisse potenti.</p>
											</blockquote>
											<div class="testimonial-author">
												<p><strong class="font-weight-extra-bold text-2">- John Smith. Okler</strong></p>
											</div>
										</div>
									</div>  --}}
									{{--  <div>
										<div class="testimonial testimonial-style-2 testimonial-light testimonial-with-quotes testimonial-quotes-primary mb-0">
											<blockquote>
												<p class="text-5 line-height-5 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget risus porta, tincidunt turpis at, interdum tortor. Suspendisse potenti.</p>
											</blockquote>
											<div class="testimonial-author">
												<p><strong class="font-weight-extra-bold text-2">- John Smith. Okler</strong></p>
											</div>
										</div>
									</div>  --}}
								</div>

							</div>
						</div>
					</div>
				</section>

				<div id="team" class="container pb-4">
					<div class="row pt-5 mt-5 mb-4">
						<div class="col text-center appear-animation" data-appear-animation="fadeInUpShorter">
							<h2 class="font-weight-bold mb-1 text-uppercase">Características</h2>
							<p class="text-color-dark">Simple e intuitivo de usar que se transforma en una auténtica herramienta</p>
						</div>
					</div>
					<div class="row pb-5 mb-5 appear-animation" data-appear-animation="fadeInUpShorter" data-appear-animation-delay="200">
						<div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									{{--  <a href="#">  --}}
										<img src="template/img/caracteristicas1.png" class="img-fluid" alt="">
									{{--  </a>  --}}
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-bold text-color-dark text-2 line-height-2 mt-3 mb-0">Potente infraestructura informática a su alcance</h3>
									{{--  <span class="text-2 mb-0">CEO</span>  --}}
									<span class="thumb-info-caption-text pt-1 text-justify text-color-dark">Solución basada en “Cloud Computing” en modalidad “SaaS”, no precisa comprar licencia de software ni servidores, sin periodo mínimo de permanencia, acceda Ud. y su equipo los 365 días del año, 24 horas al día, desde cualquier equipo con conexión a Internet y pague solo por lo que usa.</span>
								</span>
							</span>
						</div>
						<div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									{{--  <a href="#">  --}}
										<img src="template/img/caracteristicas2.png" class="img-fluid" alt="">
									{{--  </a>  --}}
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-bold text-color-dark text-2 line-height-2 mt-3 mb-0">Solución con diversas opciones de puestas en marcha</h3>
									{{--  <span class="text-2 mb-0">CEO</span>  --}}
									<span class="thumb-info-caption-text pt-1 text-justify">
										<li class="text-color-dark">Cloud SaaS.</li>
										<li class="text-color-dark">Cloud Privada.</li>
										<li class="text-color-dark">Servidores propios de cliente, instalaciones “On Premises”.</li>
									</span>
								</span>
							</span>
						</div>
						<div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									{{--  <a href="#">  --}}
										<img src="template/img/caracteristicas3.png" class="img-fluid" alt="">
									{{--  </a>  --}}
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-bold text-color-dark text-2 line-height-2 mt-3 mb-0">Disponibilidad inmediata </h3>
									{{--  <span class="text-2 mb-0">CEO</span>  --}}
									<span class="thumb-info-caption-text pt-1 text-justify">
										<li class="text-color-dark">Empiece inmediatamente solo precisa un equipo con conexión a Internet.</li>
										<li class="text-color-dark">Mejora y ampliaciones continuas en las funcionalidades.</li>
										<li class="text-color-dark">Asesoría, entrenamiento cuando lo precise.</li>
										<li class="text-color-dark">Monitoreo permanente del correcto funcionamiento del sistema, mientras usted se enfoca en lo que mejor sabe hacer: “Hacer negocios...!!!”</li>
									</span>
								</span>
							</span>
						</div>
						<div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									{{--  <a href="#">  --}}
										<img src="template/img/caracteristicas4.png" class="img-fluid" alt="">
									{{--  </a>  --}}
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-bold text-color-dark text-2 line-height-2 mt-3 mb-0">Tecnología para la transformación digital de su negocio </h3>
									{{--  <span class="text-2 mb-0">CEO</span>  --}}
									<span class="thumb-info-caption-text pt-1 text-justify text-color-dark">EnLinea24-7, esta implementado con tecnología de última generación y con el “Know how” de un equipo de ingenieros de software con capacidad, innovación y amplia experiencia, lo que nos permite entregarle una solución efectiva y un elemento fundamental para la transformación digital de su negocio, permitiéndole entregue mayor valor a sus clientes.</span>
								</span>
							</span>
						</div>
						{{--  <div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									<a href="about-me.html">
										<img src="img/team/team-2.jpg" class="img-fluid" alt="">
									</a>
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-extra-bold text-color-dark text-4 line-height-1 mt-3 mb-0">Jessica Doe</h3>
									<span class="text-2 mb-0">DESIGNER</span>
									<span class="thumb-info-caption-text pt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac ligula mi, non suscipitaccumsan</span>
									<span class="thumb-info-social-icons">
										<a target="_blank" href="http://www.facebook.com"><i class="fab fa-facebook-f"></i><span>Facebook</span></a>
										<a href="http://www.twitter.com"><i class="fab fa-twitter"></i><span>Twitter</span></a>
										<a href="http://www.linkedin.com"><i class="fab fa-linkedin-in"></i><span>Linkedin</span></a>
									</span>
								</span>
							</span>
						</div>  --}}
						{{--  <div class="col-sm-6 col-lg-3 mb-4 mb-sm-0">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									<a href="about-me.html">
										<img src="img/team/team-3.jpg" class="img-fluid" alt="">
									</a>
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-extra-bold text-color-dark text-4 line-height-1 mt-3 mb-0">Ricki Doe</h3>
									<span class="text-2 mb-0">DEVELOPER</span>
									<span class="thumb-info-caption-text pt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac ligula mi, non suscipitaccumsan</span>
									<span class="thumb-info-social-icons">
										<a target="_blank" href="http://www.facebook.com"><i class="fab fa-facebook-f"></i><span>Facebook</span></a>
										<a href="http://www.twitter.com"><i class="fab fa-twitter"></i><span>Twitter</span></a>
										<a href="http://www.linkedin.com"><i class="fab fa-linkedin-in"></i><span>Linkedin</span></a>
									</span>
								</span>
							</span>
						</div>  --}}
						{{--  <div class="col-sm-6 col-lg-3">
							<span class="thumb-info thumb-info-hide-wrapper-bg thumb-info-no-zoom">
								<span class="thumb-info-wrapper">
									<a href="about-me.html">
										<img src="img/team/team-4.jpg" class="img-fluid" alt="">
									</a>
								</span>
								<span class="thumb-info-caption">
									<h3 class="font-weight-extra-bold text-color-dark text-4 line-height-1 mt-3 mb-0">Melinda Doe</h3>
									<span class="text-2 mb-0">SEO ANALYST</span>
									<span class="thumb-info-caption-text pt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac ligula mi, non suscipitaccumsan</span>
									<span class="thumb-info-social-icons">
										<a target="_blank" href="http://www.facebook.com"><i class="fab fa-facebook-f"></i><span>Facebook</span></a>
										<a href="http://www.twitter.com"><i class="fab fa-twitter"></i><span>Twitter</span></a>
										<a href="http://www.linkedin.com"><i class="fab fa-linkedin-in"></i><span>Linkedin</span></a>
									</span>
								</span>
							</span>
						</div>  --}}
					</div>
				</div>

				<div class="modal fade" id="capaGratuita" tabindex="-1" role="dialog" aria-labelledby="defaultModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h4 class="modal-title" id="defaultModalLabel">Solicitud de capa gratuita temporal EnLinea24-7</h4>
								{{-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> --}}
							</div>
							<div class="modal-body">
								<form id="demo-form" class="mb-4" action="">
									@csrf
									<div class="form-group">
										<div class="col-sm-12">
											<input type="text" id="name" name="name" class="form-control" placeholder="Nombre" required/>
                                            <span id="errorName" class="error">El nombre es obligatorio *</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="text" id="lastName" name="lastName" class="form-control" placeholder="Apellido" required/>

											<span id="errorLastName" class="error">El apellido es obligatorio *</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="text" id="company" name="company" class="form-control" placeholder="Nombre empresa" />
											<span id="errorCompany" class="error">El nombre de la empresa es oblogatorio *</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="number" id="phone" name="phone" class="form-control" placeholder="Teléfono móvil" />
											<span id="errorPhone" class="error">El número de teléfono es oblogatorio</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="email" id="email" name="email" class="form-control" placeholder="Email" />
											<span id="errorEmail" class="error">El correo es oblogatorio *</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="text" id="city" name="city" class="form-control" placeholder="Ciudad" />
											<span id="errorCity" class="error">La ciudad es oblogatorio *</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-12">
											<input type="text" id="country" name="country" class="form-control" placeholder="País" />
											<span id="errorCountry" class="error">El país es oblogatorio *</span>
										</div>
									</div>
								</form>
							</div>
							<!--<div class="modal-footer">
								<input id="btnCancelar" type="button" value="CANCELAR" class="btn btn-dark btn-rounded font-weight-semibold" onclick="btnClose()" >
								<input id="btnEnviar" type="button" value="ENVIAR" class="btn btn-primary btn-rounded font-weight-semibold px-5 btn-py-2 text-2" onclick="enviarSolicitud()" >
								-->
							<div class="modal-footer text-center centrar">
								{{-- <button id="btnCancelar" type="button" class="btn btn-dark font-weight-semibold btn-rounded" onclick="btnClose()">CANCELAR</button> --}}
								<input id="btnCancelar" type="button" value="CANCELAR" class="btn btn-dark btn-rounded font-weight-semibold" >
								{{-- <button type="submit" class="btn btn-primary btn-rounded">Enviar</button> --}}
								{{-- <input id="btnEnviar" type="button" value="ENVIAR" class="btn btn-primary btn-rounded font-weight-semibold" onclick="enviarSolicitud()" > --}}
								<input id="btnEnviar" type="button" value="ENVIAR" class="btn btn-primary btn-rounded font-weight-semibold px-4" onclick="enviarSolicitud()" >
							</div>
						</div>
					</div>
				</div>

				<section id="other" class="section section-background section-height-1 overlay overlay-show overlay-op-9 border-0 m-0" style="background-image: url(template/img/capaGratuita/negociosfree.jpg); background-size: cover; background-position: center;">
					<div class="container mt-4">
						<div class="row">
							<div class="col">
								<div class="mt-0 centrado">
									<img class="img-fluid leftImg mr-2 py-2" src="template/img/capaGratuita/freelogo.png" width="175" height="150">
								</div>
								<div class="text-center">
									<h2 class="font-weight-normal text-color-light mb-2">Solicite la capa gratuita de EnLinea24-7</h2>
									<p class="text-color-light opacity-9">Adquiera experiencia práctica y gratuita sobre EnLinea24-7.com, explore las diferentes funcionalidades y comience a utilizar EnLinea24-7.com de forma temporal e inmediata, sin compromiso y con todo el respaldo/soporte de nuestro equipo.</p>
								</div>
							</div>

						</div>
						<div class="text-center py-3 my-4">
							<div>
								{{--  <img class="img-fluid" src="template/img/capaGratuita/freelogo.png" width="300" height="175">  --}}
								<button class="btn btn-primary btn-rounded font-weight-semibold px-5 btn-py-2 text-2" data-toggle="modal" data-target="#capaGratuita" data-backdrop="static" data-keyboard="false">Solicitar Capa Gratuita</button>
							</div>
						</div>
					</div>
				</section>

				<section id="contact" class="section bg-color-grey-scale-1 border-0 py-0 m-0">
					<div class="container-fluid">
						<div class="row">
							{{-- <div class="col-md-6">

								<!-- Google Maps - Settings on footer -->
								<div id="googlemaps" class="google-ma h-100 mb-0" style="min-height: 400px;"></div>

							</div> --}}
							<div class="col-md-12 p-5 my-5">

								<div class="px-4">
									<h2 class="font-weight-bold line-height-1 mb-2 text-center text-uppercase">Contáctenos</h2>
									<p class="text-3 mb-4 text-center text-color-dark">Atenderemos su solicítud lo mas pronto</p>

									 <form id="contactForm" class="contact-form form-style-2 pr-xl-5" action="">
										@csrf
										<div class="form-row">
											<div class="form-group col-xl-4">
												<input type="text" value="" data-msg-required="Por favor ingrese su nombre" maxlength="100" class="form-control" name="name" id="names" placeholder="Nombre" required>
												<span id="errorNames" class="error">El nombre es oblogatorio *</span>
											</div>
											<div class="form-group col-xl-8">
												<input type="email" value="" data-msg-required="Por favor ingrese un correo electronico" data-msg-email="Por favor ingrese un correo valido" maxlength="100" class="form-control" style="display: block;" name="email" id="emails" placeholder="E-mail" required>
												<span id="errorEmails" class="error">El correo es obligatorio *</span>
											</div>
										</div>
										<div class="form-row">
											<div class="form-group col-xl-4">
												<input type="text" value="" data-msg-required="Por favor ingrese su ciudad" maxlength="100" class="form-control" name="city" id="citys" placeholder="Ciudad" required>
												<span id="errorCitys" class="error">La ciudad es obligatorio *</span>
											</div>
											<div class="form-group col-xl-8">
												<input type="number" value="" data-msg-required="Por favor ingrese un numero de teléfono" maxlength="100" class="form-control" name="phone" id="phones" placeholder="Teléfono" required>
												<span id="errorPhones" class="error">El teléfono es obligatorio *</span>
											</div>
										</div>
										<div class="form-row">
											<div class="form-group col">
												<input type="text" value="" data-msg-required="Por favor ingrese un asunto" maxlength="100" class="form-control" name="subject" id="subjects" placeholder="Asúnto" required>
												<span id="errorSubjects" class="error">El asúnto es obligatorio *</span>
											</div>
										</div>
										<div class="form-row">
											<div class="form-group col">
												<textarea maxlength="5000" data-msg-required="Debe escribir un mensaje" rows="4" class="form-control" name="message" id="messages" placeholder="Escriba un mensaje" required></textarea>
												<span id="errorMessages" class="error">El mensaje es obligatorio *</span>
											</div>
										</div>
										<div class="">
											<div class="form-group">
												<div class="g-recaptcha" data-sitekey="6LcMY7MUAAAAAGuBLPmO_nw2KfNXCPjoX2RVz8JL" data-msg-required="Debe escribir un mensaje"></div>
												<span id="errorCaptcha" class="error">Debe marcar el captcha *</span>
											</div>
										</div>

										<br>
										<div class="form-row">
											<div class="form-group col text-center">
												<input id="btnSave" type="button" value="ENVIAR" class="btn btn-primary btn-rounded font-weight-semibold px-5 btn-py-2 text-2" onclick="onSubmit()">
												{{--  <button type="submit" class="btn btn-primary btn-rounded font-weight-semibold px-5 btn-py-2 text-2" data-loading-text="Mensaje Enviado">ENVIAR</button>  --}}
											</div>
										</div>
									</form>
								</div>

							</div>
						</div>
					</div>
				</section>

				<section class="section bg-primary border-0 m-0">
					<div class="container">
						<div class="row justify-content-center text-center text-lg-left py-4">
							<div class="col-lg-auto appear-animation" data-appear-animation="fadeInRightShorter">
								<div class="feature-box feature-box-style-2 d-block d-lg-flex mb-4 mb-lg-0">
									<div class="feature-box-icon">
										<i class="icon-call-out icons text-color-light"></i>
									</div>
									<div class="feature-box-info pl-1">
										<h5 class="font-weight-light text-color-light opacity-9 mb-0">TELÉFONO</h5>
										<p class="text-color-light font-weight-semibold mb-0">+591 3 3707072</p>
									</div>
								</div>
							</div>
							<div class="col-lg-auto appear-animation" data-appear-animation="fadeInRightShorter" data-appear-animation-delay="200">
								<div class="feature-box feature-box-style-2 d-block d-lg-flex mb-4 mb-lg-0 px-xl-4 mx-lg-5">
									<div class="feature-box-icon">
										<i class="icon-envelope icons text-color-light"></i>
									</div>
									<div class="feature-box-info pl-1">
										<h5 class="font-weight-light text-color-light opacity-9 mb-0 text-uppercase">E-MAIL</h5>
										{{--  <a href="http://bit.ly/2H5DHp1" class="text-color-light font-weight-semibold text-decoration-none" target="_blank">info@smainn.com</a>  --}}
										<p class="text-color-light font-weight-semibold mb-0">info@smainn.com</p>
									</div>
								</div>
							</div>
							<div class="col-lg-auto appear-animation" data-appear-animation="fadeInRightShorter" data-appear-animation-delay="200">
								<div class="feature-box feature-box-style-2 d-block d-lg-flex mb-4 mb-lg-0 px-xl-4 mx-lg-5">
									<div class="feature-box-icon">
										<i class="fab fa-whatsapp text-color-light"></i>
									</div>
									<div class="feature-box-info pl-1">
										<h5 class="font-weight-light text-color-light opacity-9 mb-0 text-uppercase">WHATSAPP</h5>
										<a href="http://bit.ly/2H5DHp1" class="text-color-light font-weight-semibold text-decoration-none" target="_blank">+591 72112990</a>
									</div>
								</div>
							</div>
							<div class="col-lg-auto appear-animation" data-appear-animation="fadeInRightShorter" data-appear-animation-delay="400">
								<div class="feature-box feature-box-style-2 d-block d-lg-flex">
									<div class="feature-box-icon">
										<i class="icon-share icons text-color-light"></i>
									</div>
									<div class="feature-box-info pl-1">
										<h5 class="font-weight-light text-color-light opacity-9 mb-0 text-uppercase">siguenos en</h5>
										<p class="mb-0">
											<span class="social-icons-facebook"><a href="https://www.facebook.com/EnLinea247" target="_blank" class="text-color-light font-weight-semibold" title="Facebook"><i class="mr-1 fab fa-facebook-f"></i> FACEBOOK</a></span>
											{{--  <span class="social-icons-twitter pl-3"><a href="http://www.twitter.com/" target="_blank" class="text-color-light font-weight-semibold" title="Twitter"><i class="mr-1 fab fa-twitter"></i> TWITTER</a></span>
											<span class="social-icons-instagram pl-3"><a href="http://www.linkedin.com/" target="_blank" class="text-color-light font-weight-semibold" title="Linkedin"><i class="mr-1 fab fa-instagram"></i> INSTAGRAM</a></span>  --}}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			
			<footer id="footer" class="mt-0">
				<div class="footer-copyright">
					<div class="container py-2">
						<div class="row py-4">
							<div class="col d-flex align-items-center justify-content-center">
								<p><strong class="text-color-default">EnLinea24-7</strong> - © Copyright <label id="year"></label>. Powered by <a href="https://www.smainn.com/" target="_blank" class="text-color-light">Smainn</a>.</p>
							</div>
						</div>
					</div>
				</div>
				{{--  <label id="label">{{ $data }}</label>  --}}
			</footer>

			<!-- WhatsHelp.io widget -->
			<script type="text/javascript">
				(function () {
					var options = {
						facebook: "105921960762367", // Facebook page ID
						whatsapp: "+59172112990", // WhatsApp number
						call_to_action: "Contáctenos", // Call to action
						button_color: "#E74339", // Color of button
						position: "left", // Position may be 'right' or 'left'
						order: "facebook,whatsapp", // Order of buttons
					};
					var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
					var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
					s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
					var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
				})();
			</script>
			<!-- /WhatsHelp.io widget -->
		</div>

		<script src="{{ asset('template/plugins/jquery/jquery.js') }}"></script>
		<script src="{{ asset('template/plugins/jquery.validation/jquery.validate.min.js') }}"></script>
        <script src="{{ asset('template/plugins/jquery.appear/jquery.appear.min.js') }}"></script>
        <script src="{{ asset('template/plugins/jquery.easing/jquery.easing.min.js') }}"></script>
        <script src="{{ asset('template/plugins/jquery.cookie/jquery.cookie.min.js') }}"></script>
        <script src="{{ asset('template/plugins/popper/umd/popper.min.js') }}"></script>
        <script src="{{ asset('template/plugins/bootstrap/js/bootstrap.min.js') }}"></script>
		<script src="{{ asset('template/plugins/common/common.min.js') }}"></script>

		<script src='https://www.google.com/recaptcha/api.js?hl=es'></script>

        <script src="{{ asset('template/plugins/jquery.easy-pie-chart/jquery.easypiechart.min.js') }}"></script>
        <script src="{{ asset('template/plugins/jquery.lazyload/jquery.lazyload.min.js') }}"></script>
        <script src="{{ asset('template/plugins/isotope/jquery.isotope.min.js') }}"></script>
        <script src="{{ asset('template/plugins/owl.carousel/owl.carousel.min.js') }}"></script>
        <script src="{{ asset('template/plugins/magnific-popup/jquery.magnific-popup.min.js') }}"></script>
        <script src="{{ asset('template/plugins/vide/jquery.vide.min.js') }}"></script>
        <script src="{{ asset('template/plugins/vivus/vivus.min.js') }}"></script>

        <script src="{{ asset('template/js/theme.js') }}"></script>

        <script src="{{ asset('template/plugins/rs-plugin/js/jquery.themepunch.tools.min.js') }}"></script>
        <script src="{{ asset('template/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js') }}"></script>
        <script src="{{ asset('template/js/view.contact.js') }}"></script>

        <script src="{{ asset('template/js/custom.js') }}"></script>

        <script src="{{ asset('template/js/theme.init.js') }}"></script>

		<script src="{{ asset('template/js/examples.portfolio.js') }}"></script>
		<script type="text/javascript">
			$(document.getElementById('btnCancelar')).click(function(event){
				document.getElementById('name').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('company').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('email').value = '';
                document.getElementById('city').value = '';
                document.getElementById('country').value = '';
                document.getElementById('errorName').style.display = 'none';
                document.getElementById('errorLastName').style.display = 'none';
                document.getElementById('errorCompany').style.display = 'none';
                document.getElementById('errorPhone').style.display = 'none';
                document.getElementById('errorEmail').style.display = 'none';
                document.getElementById('errorCity').style.display = 'none';
                document.getElementById('errorCountry').style.display = 'none';
				$(document.getElementById('capaGratuita')).modal('toggle');
			});
			
			$(document).ready(function(){
				$(document.getElementById('name')).keypress(function(){
					document.getElementById('errorName').style.display = 'none';
				});
				$(document.getElementById('lastName')).keypress(function(){
					document.getElementById('errorLastName').style.display = 'none';
				});
				$(document.getElementById('company')).keypress(function(){
					document.getElementById('errorCompany').style.display = 'none';
				});
				$(document.getElementById('phone')).keypress(function(){
					document.getElementById('errorPhone').style.display = 'none';
				});
				$(document.getElementById('email')).keypress(function(){
					document.getElementById('errorEmail').style.display = 'none';
				});
				$(document.getElementById('city')).keypress(function(){
					document.getElementById('errorCity').style.display = 'none';
				});
				$(document.getElementById('country')).keypress(function(){
					document.getElementById('errorCountry').style.display = 'none';
				});
				
				$(document.getElementById('name')).change(function(){
					document.getElementById('errorName').style.display = 'none';
				});
				$(document.getElementById('lastName')).change(function(){
					document.getElementById('errorLastName').style.display = 'none';
				});
				$(document.getElementById('company')).change(function(){
					document.getElementById('errorCompany').style.display = 'none';
				});
				$(document.getElementById('phone')).change(function(){
					document.getElementById('errorPhone').style.display = 'none';
				});
				$(document.getElementById('email')).change(function(){
					document.getElementById('errorEmail').style.display = 'none';
				});
				$(document.getElementById('city')).change(function(){
					document.getElementById('errorCity').style.display = 'none';
				});
				$(document.getElementById('country')).change(function(){
					document.getElementById('errorCountry').style.display = 'none';
				});

				$(document.getElementById('names')).keypress(function(){
					document.getElementById('errorNames').style.display = 'none';
				});
				$(document.getElementById('emails')).keypress(function(){
					document.getElementById('errorEmails').style.display = 'none';
				});
				$(document.getElementById('citys')).keypress(function(){
					document.getElementById('errorCitys').style.display = 'none';
				});
				$(document.getElementById('phones')).keypress(function(){
					document.getElementById('errorPhones').style.display = 'none';
				});
				$(document.getElementById('subjects')).keypress(function(){
					document.getElementById('errorSubjects').style.display = 'none';
				});
				$(document.getElementById('messages')).keypress(function(){
					document.getElementById('errorMessages').style.display = 'none';
				});

				$(document.getElementById('names')).change(function(){
					document.getElementById('errorNames').style.display = 'none';
				});
				$(document.getElementById('emails')).change(function(){
					document.getElementById('errorEmails').style.display = 'none';
				});
				$(document.getElementById('citys')).change(function(){
					document.getElementById('errorCitys').style.display = 'none';
				});
				$(document.getElementById('phones')).change(function(){
					document.getElementById('errorPhones').style.display = 'none';
				});
				$(document.getElementById('subjects')).change(function(){
					document.getElementById('errorSubjects').style.display = 'none';
				});
				$(document.getElementById('messages')).change(function(){
					document.getElementById('errorMessages').style.display = 'none';
				});
			});

            function enviarSolicitud(){
                let name = document.getElementById('name').value;
                let lastName = document.getElementById('lastName').value;
                let company = document.getElementById('company').value;
                let phone = document.getElementById('phone').value;
                let email = document.getElementById('email').value;
                let city = document.getElementById('city').value;
                let country = document.getElementById('country').value;
                let body = {name, lastName, company, phone, email, city, country}
                if (name.length <= 0){
                    document.getElementById('errorName').style.display = 'block';
                }
                if (lastName.length <= 0){
                    document.getElementById('errorLastName').style.display = 'block';
                }
                if (company.length <= 0) {
                    document.getElementById('errorCompany').style.display = 'block';
                }
                if(phone.length <= 0) {
                    document.getElementById('errorPhone').style.display = 'block';
                }
                if (email.length <= 0) {
                    document.getElementById('errorEmail').style.display = 'block';
                }
                if (city.length <= 0) {
                    document.getElementById('errorCity').style.display = 'block';
                }
                if (country.length <= 0) {
                    document.getElementById('errorCountry').style.display = 'block';
                }
                $.ajax({
                    data: body,
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					url: '/api/solicitud',
					type: 'POST',
                    dataType: 'json',
                    success: function(data){
						//console.log(data);
						if(data.response == 1){
                            document.getElementById('name').value = '';
                            document.getElementById('lastName').value = '';
                            document.getElementById('company').value = '';
                            document.getElementById('phone').value = '';
                            document.getElementById('email').value = '';
                            document.getElementById('city').value = '';
							document.getElementById('country').value = '';
							document.getElementById('errorName').style.display = 'none';
							document.getElementById('errorLastName').style.display = 'none';
							document.getElementById('errorCompany').style.display = 'none';
							document.getElementById('errorPhone').style.display = 'none';
							document.getElementById('errorEmail').style.display = 'none';
							document.getElementById('errorCity').style.display = 'none';
							document.getElementById('errorCountry').style.display = 'none';
							$(document.getElementById('capaGratuita')).modal('toggle');
						}
                    },
                    error: function(data){
						console.log('Error: ', data);
						$('#btnEnviar').prop("disabled", true);
					}
                });
			}
			
			function onSubmit(){
				let name = document.getElementById('names').value;
				let email = document.getElementById('emails').value;
				let city = document.getElementById('citys').value;
				let phone = document.getElementById('phones').value;
				let subject = document.getElementById('subjects').value;
				let message = document.getElementById('messages').value;
				let body = {name, email, city, phone, subject, message}
				let response = grecaptcha.getResponse();
				if (name.length <= 0){
					document.getElementById('errorNames').style.display = 'block';
				}
				if (email.length <= 0){
					document.getElementById('errorEmails').style.display = 'block';
				}
				if (city.length <= 0){
					document.getElementById('errorCitys').style.display = 'block';
				}
				if (phone.length <= 0){
					document.getElementById('errorPhones').style.display = 'block';
				}
				if (subject.length <= 0){
					document.getElementById('errorSubjects').style.display = 'block';
				}
				if (message.length <= 0){
					document.getElementById('errorMessages').style.display = 'block';
				}
				if (response.length == 0){
					document.getElementById('errorCaptcha').style.display = 'block';
				}
				$.ajax({
					data: body,
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					url: '/api/contacto',
					type: 'POST',
					dataType: 'json',
					success: function(data){
						//console.log(data);
						if(data.response == 1){
							document.getElementById('names').value = '';
							document.getElementById('emails').value = '';
							document.getElementById('citys').value = '';
							document.getElementById('phones').value = '';
							document.getElementById('subjects').value = '';
							document.getElementById('messages').value = '';
							grecaptcha.reset();
						}
					},
					error: function(data){
						console.log('Error: ', data);
						$('#btnSave').prop("disabled", true);
					}
				});
			}

			/*
			function onSubmit(){
				let body = {
					name: $("#names").val(),
					email: $("#emails").val(),
					city: $("#citys").val(),
					phone: $("#phones").val(),
					subject: $("#subjects").val(),
					message: $("#messages").val()
				}
				var response = grecaptcha.getResponse();

				if (response.length == 0) {
					$('.habilitar').css("display", "block");
					$('#btnSave').prop("disabled", false);
					return;
				}

				$.ajax({
					data: body,
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					url: '/api/contacto',
					type: 'POST',
					dataType: 'json',
					success: function(data){
						if(data.response == 1){
							//location.reload(true);
							$("#names").val('');
							$("#emails").val('');
							$("#citys").val('');
							$("#phones").val('');
							$("#subjects").val('');
							$("#messages").val('');
							$('.habilitar').css("display", "none");
							$("#btnSave").prop("disabled", false);
							grecaptcha.reset();
						}
					},
					error: function(data){
						console.log('Error: ', data);
						$('#btnSave').prop("disabled", true);
					}
				});
			}*/
		</script>

		<script type="text/javascript">
			var fecha = new Date();
			var year = fecha.getFullYear();
			var lbl_year = document.getElementById('year');
			lbl_year.textContent = year;
		</script>
	</body>
</html>
