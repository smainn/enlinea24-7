<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;

Route::resource('facturacomputarizada', 'Comercio\Facturacion\SoapController');
Route::get('facturacomp', 'Comercio\Facturacion\SoapController@index');
Route::get('crearfactura', 'Comercio\Facturacion\SoapController@crearFactura');

Route::get('factcomp2', 'Comercio\Facturacion\compAntigua\PrincipalController@index');
Route::get('generarqr', 'Comercio\Facturacion\compAntigua\PrincipalController@generarQr');
Route::get('/', function () {
    $data = 'nada';
    return view('welcome', compact('data'));
})->name('home');


// Route::get('api/login', function () {
//     return view('sistema.index');
// });



Route::get('/pruebafact1',function(){
    return view('pruebafact1');
});

Route::get('/login', function () {
    return view('sistema.index');
});


Route::get('/configuraciones', function () {
    return view('sistema.index');
});

Route::prefix('/commerce1')->group(function() {

    Route::get('/', function () {
        return view('sistema.index');
    });

    Route::get('home', function () {
        return view('sistema.index');
    });



    Route::get('perfil', function () {
        return view('sistema.index');
    });

    Route::get('usuario/index', function () {
        return view('sistema.index');
    });
    Route::get('usuario/create', function () {
        return view('sistema.index');
    });
    Route::get('usuario/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('usuario/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('grupo-usuario/index', function () {
        return view('sistema.index');
    });
    Route::get('grupo-usuario/create', function () {
        return view('sistema.index');
    });
    Route::get('grupo-usuario/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('asignar-privilegio', function () {
        return view('sistema.index');
    });
    Route::get('asignar_permiso', function () {
        return view('sistema.index');
    });
    Route::get('activar_permiso', function () {
        return view('sistema.index');
    });
    Route::get('usuarios-conectados', function () {
        return view('sistema.index');
    });
    Route::get('log_del_sistema', function () {
        return view('sistema.index');
    });

    Route::get('actividad_economica/index', function () {
        return view('sistema.index');
    });

    Route::get('dosificacion/index', function () {
        return view('sistema.index');
    });
    Route::get('dosificacion/create', function () {
        return view('sistema.index');
    });
    Route::get('dosificacion/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('certificacion_sin/index', function () {
        return view('sistema.index');
    });

    Route::get('vehiculo/index', function () {
        return view('sistema.index');
    });
    Route::get('vehiculo/create', function () {
        return view('sistema.index');
    });
    Route::get('vehiculo/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('vehiculo/reporte', function () {
        return view('sistema.index');
    });

    Route::get('vehiculo-parte/index', function () {
        return view('sistema.index');
    });

    Route::get('vehiculo-historia/index', function () {
        return view('sistema.index');
    });
    Route::get('vehiculo-historia/create', function () {
        return view('sistema.index');
    });
    Route::get('vehiculo-historia/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('tipo_cambio/index', function () {
        return view('sistema.index');
    });
    Route::get('tipo_cambio/create', function () {
        return view('sistema.index');
    });
    Route::get('tipo_cambio/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('vehiculo-caracteristica/index', function () {
        return view('sistema.index');
    });
    Route::get('tipocliente/index', function () {
        return view('sistema.index');
    });
    Route::get('unidad_medida/index', function () {
        return view('sistema.index');
    });
    Route::get('tipo_moneda/index', function () {
        return view('sistema.index');
    });
    Route::get('tipo_traspaso/index', function () {
        return view('sistema.index');
    });
    Route::get('sucursal/index', function () {
        return view('sistema.index');
    });
    Route::get('sucursal/create', function () {
        return view('sistema.index');
    });
    Route::get('sucursal/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('sucursal/show/{id}', function () {
        return view('sistema.index');
    });
    Route::get('almacenes/index', function () {
        return view('sistema.index');
    });
    Route::get('familia_vehiculo/index', function () {
        return view('sistema.index');
    });
    Route::get('familia_ciudad/index', function () {
        return view('sistema.index');
    });
    Route::get('almacen_ubicacion/index', function () {
        return view('sistema.index');
    });

    Route::get('cliente/index', function () {
        return view('sistema.index');
    });
    Route::get('cliente/create', function () {
        return view('sistema.index');
    });
    Route::get('cliente/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('cliente/reporte', function () {
        return view('sistema.index');
    });

    Route::get('vendedor/index', function () {
        return view('sistema.index');
    });
    Route::get('vendedor/create', function () {
        return view('sistema.index');
    });
    Route::get('vendedor/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('entrega_producto/index', function () {
        return view('sistema.index');
    });
    Route::get('entrega_producto/nuevo/{id}', function () {
        return view('sistema.index');
    });

    Route::get('venta/index', function () {
        return view('sistema.index');
    });
    Route::get('venta/create', function () {
        return view('sistema.index');
    });
    Route::get('venta/vehiculo_parte/create', function () {
        return view('sistema.index');
    });
    Route::get('venta/vehiculo_historia/create', function () {
        return view('sistema.index');
    });
    Route::get('venta/proforma', function () {
        return view('sistema.index');
    });
    Route::get('venta/show/{id}', function () {
        return view('sistema.index');
    });



    Route::get('compra_detalle/reporte', function () {
        return view('sistema.index');
    });
    Route::get('compra/reporte', function () {
        return view('sistema.index');
    });
    Route::get('compra_cuentaporpagar/reporte', function () {
        return view('sistema.index');
    });
    Route::get('compra_pagorealizado/reporte', function () {
        return view('sistema.index');
    });
    Route::get('compra_proveedor/reporte', function () {
        return view('sistema.index');
    });



    Route::get('venta/reporte', function () {
        return view('sistema.index');
    });
    Route::get('venta/reporte-por-cobrar', function () {
        return view('sistema.index');
    });
    Route::get('venta/reporte-detallado', function () {
        return view('sistema.index');
    });
    Route::get('venta/reporte-de-cobros', function () {
        return view('sistema.index');
    });

    Route::get('proforma/index', function () {
        return view('sistema.index');
    });
    Route::get('proforma/create', function () {
        return view('sistema.index');
    });
    Route::get('proforma/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('cobranza/index', function () {
        return view('sistema.index');
    });
    Route::get('cobranza/create', function () {
        return view('sistema.index');
    });
    Route::get('cobranza/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('comision/index', function () {
        return view('sistema.index');
    });
    Route::get('comision/create', function () {
        return view('sistema.index');
    });
    Route::get('comision/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('producto', function () {
        return view('sistema.index');
    });
    Route::get('producto/create', function () {
        return view('sistema.index');
    });
    Route::get('producto/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('producto/reporte', function () {
        return view('sistema.index');
    });

    Route::get('ingreso-producto/index', function () {
        return view('sistema.index');
    });
    Route::get('ingreso-producto/create', function () {
        return view('sistema.index');
    });
    Route::get('ingreso-producto/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('salida-producto/index', function () {
        return view('sistema.index');
    });
    Route::get('salida-producto/create', function () {
        return view('sistema.index');
    });
    Route::get('salida-producto/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('inventario-corte/index', function () {
        return view('sistema.index');
    });
    Route::get('inventario-corte/create', function () {
        return view('sistema.index');
    });
    Route::get('inventario-corte/edit/{value}', function () {
        return view('sistema.index');
    });

    Route::get('lista-precios/index', function () {
        return view('sistema.index');
    });
    Route::get('lista-precios/create', function () {
        return view('sistema.index');
    });
    Route::get('lista-precios/edit/{id}', function () {
        return view('sistema.index');
    });

    Route::get('familia-producto', function () {
        return view('sistema.index');
    });

    Route::get('traspaso-producto/index', function () {
        return view('sistema.index');
    });
    Route::get('traspaso-producto/create', function () {
        return view('sistema.index');
    });
    Route::get('traspaso-producto/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('producto-caracteristica/index', function () {
        return view('sistema.index');
    });

    Route::get('compra/index', function () {
        return view('sistema.index');
    });
    Route::get('compra/create', function () {
        return view('sistema.index');
    });
    Route::get('compra/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('pago/index', function () {
        return view('sistema.index');
    });
    Route::get('pago/create', function () {
        return view('sistema.index');
    });
    Route::get('pago/show/{id}', function () {
        return view('sistema.index');
    });

    Route::get('proveedor/index', function () {
        return view('sistema.index');
    });
    Route::get('proveedor/create', function () {
        return view('sistema.index');
    });
    Route::get('proveedor/edit/{id}', function () {
        return view('sistema.index');
    });

    /*Route::get('/getVehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoController@getVehiculo');

    Route::get('/getCliente', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoController@getCliente');

    Route::get('/showCliente', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoController@showCliente');

    Route::get('/mostraCliente', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoHistorialController@mostrarCliente');
    Route::get('/mostrarCodigoCliente', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoHistorialController@mostrarCodigoCliente');

    Route::get('indexVenta/nuevo/crearVenta', '\Modules\Commerce\Http\Controllers\Admin\Ventas\VentaController@refresh');

    Route::get('/getCaracteristicaVehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoCaracteristicaController@getCaracteristica');

    Route::get('/getTipoVehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoTipoController@getTipo');

    Route::get('/getDetalleCaracteristica/{id}', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoController@getDetalle');
    

    //Route::get('indexFamilia', '\Modules\Commerce\Http\Controllers\Admin\Almacen\Categoria\FamiliaController@index');

    Route::post('/postFamilia', '\Modules\Commerce\Http\Controllers\Admin\Almacen\Categoria\FamiliaController@store');

    Route::post('/anularFamilia', '\Modules\Commerce\Http\Controllers\Admin\Almacen\Categoria\FamiliaController@destroy');

    Route::get('/getParteVehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoPartesController@show');

    Route::post('/tipovehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoTipoController@store');
    Route::post('/eliminartipovehiculo', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoTipoController@destroy');

    Route::post('/familiaciudad', '\Modules\Commerce\Http\Controllers\Admin\Ventas\Cliente\CiudadController@store');
    Route::post('/eliminarciudad', '\Modules\Commerce\Http\Controllers\Admin\Ventas\Cliente\CiudadController@destroy');

    Route::post('/familiaubicacion', '\Modules\Commerce\Http\Controllers\Admin\Almacen\AlmacenUbicacionController@store');
    Route::post('/eliminacionubicacion', '\Modules\Commerce\Http\Controllers\Admin\Almacen\AlmacenUbicacionController@destroy');
//refresh


    Route::get('indexProveedor/actualizar/{id}', '\Modules\Commerce\Http\Controllers\Admin\Compra\ProveedorController@refresh');
    Route::post('/updateProveedor', '\Modules\Commerce\Http\Controllers\Admin\Compra\ProveedorController@update');
    Route::post('/anularProveedor', '\Modules\Commerce\Http\Controllers\Admin\Compra\ProveedorController@destroy');

    Route::post('/showVehiculoHistoria', '\Modules\Commerce\Http\Controllers\Admin\Taller\VehiculoHistorialController@show');


    Route::get('indexCliente/nuevo/crearCliente', '\Modules\Commerce\Http\Controllers\Admin\Ventas\Cliente\ClientesController@create');
    */
    /* modulo de reportes*/

    Route::get('reporte/vehiculo', function () {
        return view('sistema.index');
    });

    Route::get('reporte/producto', function () {
        return view('sistema.index');
    });

    Route::get('reporte/kardexproducto', function () {
        return view('sistema.index');
    });

    Route::get('reporte/compra', function () {
        return view('sistema.index');
    });

    Route::get('reporte/venta', function () {
        return view('sistema.index');
    });
    Route::get('reporte/venta-detalle', function () {
        return view('sistema.index');
    });
    Route::get('reporte/venta-por-cobrar', function () {
        return view('sistema.index');
    });
    Route::get('reporte/venta-cobro', function () {
        return view('sistema.index');
    });
    Route::get('reporte/venta-historico-vehiculo', function () {
        return view('sistema.index');
    });
    Route::get('reporte/cliente', function () {
        return view('sistema.index');
    });
    Route::get('reporte/comision-vendedor', function () {
        return view('sistema.index');
    });

    Route::get('reporte/venta_por_producto', function () {
        return view('sistema.index');
    });
    Route::get('reporte/venta_factura', function () {
        return view('sistema.index');
    });
    Route::get('reporte/libroventa', function () {
        return view('sistema.index');
    });



    /* fin del modulo de reporte  66998866 */
});

//Route::middleware('verificar_sesion_web')->prefix('commerce/admin')->group(function() {
Route::middleware('verificar_sesion_web')->prefix('/commerce1')->group(function () {

    Route::post('venta/generar', 'Comercio\Ventas\ReporteVentaController@generar');
    Route::post('venta_detalle/generar', 'Comercio\Reportes\Ventas\VentaDetalleController@generar');

    Route::post('generar-reporte-por-cobrar', 'Comercio\Reportes\Ventas\VentaPorCobrarController@generar');
    Route::post('generar-reporte-por-cobros', 'Comercio\Reportes\Ventas\VentaPorCobrosController@generar');
    Route::post('venta_historico_vehiculo/generar', 'Comercio\Reportes\Ventas\VentaHistoricoVehiculoController@generar');

    Route::post('producto/generar', 'Comercio\Reportes\Almacen\ProductoController@generar');
    Route::post('cliente/generar', 'Comercio\Reportes\Ventas\ClienteController@generar');
    Route::post('vehiculo/generar', 'Comercio\Reportes\Taller\VehiculoController@generar');

    Route::post('cobranza/recibo', 'Comercio\Reportes\Ventas\VentaPorCobrosController@recibo');
    Route::post('venta/recibo', 'Comercio\Reportes\Ventas\VentaController@recibo');
    Route::post('venta/factura', 'Comercio\Reportes\Ventas\VentaController@factura');

    Route::post('proforma/recibo', 'Comercio\Reportes\Ventas\ProformaController@recibo');

    Route::post('/compra/generar', 'Comercio\Reportes\Compra\CompraController@generar_compra');
    Route::post('/compra_detalle/generar', 'Comercio\Reportes\Compra\CompraController@generar');
    Route::post('/cuentaporpagar/generar', 'Comercio\Reportes\Compra\CompraController@generar_cuentaporpagar');
    Route::post('/pagorealizado/generar', 'Comercio\Reportes\Compra\CompraController@generar_pagorealizado');
    Route::post('/proveedor/generar', 'Comercio\Reportes\Compra\CompraController@generar_proveedor');

    Route::post('comision_por_vendedor/generar', 'Comercio\Reportes\Ventas\VentaController@comision');
    Route::post('log_del_sistema/generar', 'Comercio\Reportes\Seguridad\LogController@generar_reporte');

    Route::post('venta_por_producto/generar', 'Comercio\Reportes\Ventas\VentaController@venta_por_producto');

    Route::post('/venta_factura/generar', 'Comercio\Reportes\Ventas\FacturaController@generar');

    Route::post('compra/recibo', 'Comercio\Reportes\Compra\CompraController@recibo');

});

Route::middleware('verificar_sesion_web')->prefix('/contable')->group(function () {
    Route::post('plan_de_cuenta/reporte', 'Contable\CuentaPlanController@reporte');
    Route::post('gestion_periodo/reporte', 'Contable\GestionContableController@reporte');
    Route::post('estado_resultado/imprimir', 'Contable\EstadoResultadoController@generar');
    Route::post('libro_mayor/reporte', 'Contable\LibroMayorController@generar');
    Route::post('libro-diario/reporte', 'Contable\LibroDiarioController@generar');
    Route::post('comprobante/imprimir', 'Contable\ComprobanteController@imprimir');
    Route::post('balance-general/reporte', 'Contable\BalanceGeneralController@generar');
});

Route::prefix('/contable')->group(function () {
    /* Modulo Contable */
    Route::get('plan_de_cuenta/index', function () {
        return view('sistema.index');
    });
    Route::get('gestion_periodo/index', function () {
        return view('sistema.index');
    });
    Route::get('gestion_periodo/gestion/create', function () {
        return view('sistema.index');
    });
    Route::get('gestion_periodo/gestion/editar/{id}', function () {
        return view('sistema.index');
    });
    Route::get('gestion_periodo/periodo/create/{id}', function () {
        return view('sistema.index');
    });
    Route::get('gestion_periodo/periodo/editar/{id}', function () {
        return view('sistema.index');
    });
    Route::get('comprobante/index', function () {
        return view('sistema.index');
    });
    Route::get('comprobante/show/{id}', function () {
        return view('sistema.index');
    });
    Route::get('comprobante/create', function () {
        return view('sistema.index');
    });
    Route::get('comprobante/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('libro_mayor/index', function () {
        return view('sistema.index');
    });
    Route::get('libro-diario/index', function () {
        return view('sistema.index');
    });
    Route::get('balance-general/index', function () {
        return view('sistema.index');
    });
    Route::get('estado_resultado/index', function () {
        return view('sistema.index');
    });
    Route::get('banco/index', function () {
        return view('sistema.index');
    });
    Route::get('cuenta_asien_autom/index', function () {
        return view('sistema.index');
    });
    Route::get('plantilla_asien_autom/index', function () {
        return view('sistema.index');
    });
    Route::get('plantilla_asien_autom/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('config_eerr/index', function () {
        return view('sistema.index');
    });
    Route::get('config_eerr/create', function () {
        return view('sistema.index');
    });
    Route::get('config_eerr/edit/{id}', function () {
        return view('sistema.index');
    });
    Route::get('tipo_costo/index', function () {
        return view('sistema.index');
    });
    Route::get('centro_de_costo/index', function () {
        return view('sistema.index');
    });
    Route::get('comprobantetipo/index', function () {
        return view('sistema.index');
    });
    Route::get('comprobantetipo/create', function () {
        return view('sistema.index');
    });
    Route::get('comprobantetipo/edit/{id}', function () {
        return view('sistema.index');
    });
    /* Fin Modulo Contable */
});

Route::prefix('/restaurant')->group(function () {
    Route::get('gestion_venta/index', function () {
        return view('sistema.index');
    });
    Route::get('gestion_venta/create', function () {
        return view('sistema.index');
    });
});

Route::get('test', function () {
    return view('sistema.balance');
});
