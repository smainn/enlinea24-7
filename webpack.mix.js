const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.styles([
   'resources/plantilla/css/bootstrap.min.css',
    'resources/plantilla/css/font-awesome.min.css',
    'resources/plantilla/css/nprogress.css',
    'resources/plantilla/css/green.css',
    'resources/plantilla/css/bootstrap-progressbar-3.3.4.min.css',
    'resources/plantilla/css/jqvmap.min.css',
    'resources/plantilla/css/daterangepicker.css',
    'resources/plantilla/css/custom.min.css'
], 'public/css/plantilla.css')
.react('resources/js/app.js', 'public/js/module.js')
.react('resources/js/report.js', 'public/js/report.js')
.sass('resources/sass/app.scss', 'public/css/module.css');
