<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('download_archivo', 'ImportarController@download');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('contacto', 'ContactoMailController@store');
Route::post('solicitud', 'CapaGratuitaController@store');

/**------------------------------------------------------------------------------------------------------- */
//LGOIN
Route::post('/login', ['as' => 'login', 'uses' => 'Seguridad\LoginController@login']);

Route::post('usuario/logout','Seguridad\LoginController@logout');


Route::post('/producto/importararchivoproducto', 'ImportarController@importarProducto');


//Route::prefix('/commerce1')->group(function() {
Route::middleware('verificar_sesion_api')->prefix('/commerce1')->group(function() {
///Route::middleware('auth:api')->prefix('commerce/api')->group(function() {
    Route::get('/', function (Request $request){
        return "Commerce Api";
    });

    Route::post('/producto/importararchivo', 'ImportarController@importarProducto');

    Route::get('/cliente/create', 'Comercio\Ventas\ClienteController@create');
    Route::get('cliente/validarcodigo/{value}', 'Comercio\Ventas\ClienteController@validarCodigo');


    Route::get('usuario', 'Seguridad\UsuarioController@index');
    Route::get('usuario/nuevo', 'Seguridad\UsuarioController@create');
    Route::post('usuario/post', 'Seguridad\UsuarioController@store');
    Route::get('usuario/edit/{id}', 'Seguridad\UsuarioController@edit');
    Route::post('usuario/update', 'Seguridad\UsuarioController@update');
    Route::post('usuario/delete', 'Seguridad\UsuarioController@destroy');
    Route::get('usuario/conectados','Seguridad\UsuarioController@getOnline');

    Route::post('usuario/perfil', 'Seguridad\UsuarioController@perfil');
    Route::post('usuario/update_password', 'Seguridad\UsuarioController@update_password');
    Route::post('usuario/generar_password', 'Seguridad\UsuarioController@generar_password');

    Route::get('grupousuario', 'Seguridad\GrupoUsuarioController@index');
    Route::get('grupousuario/nuevo', 'Seguridad\GrupoUsuarioController@create');
    Route::post('grupousuario/post', 'Seguridad\GrupoUsuarioController@store');
    Route::get('grupousuario/edit/{id}', 'Seguridad\GrupoUsuarioController@edit');
    Route::post('grupousuario/update', 'Seguridad\GrupoUsuarioController@update');
    Route::post('grupousuario/delete', 'Seguridad\GrupoUsuarioController@destroy');


    Route::get('permiso/index', 'Seguridad\ComponenteController@index');
    Route::get('permiso/show/{id}', 'Seguridad\ComponenteController@show');

    Route::post('getPermisos', 'Seguridad\ComponenteController@getPermisos');
    Route::post('postPermisos', 'Seguridad\ComponenteController@store');
    Route::post('permiso/activar', 'Seguridad\ComponenteController@activar');

    Route::get('vehiculo/index', 'Comercio\Taller\VehiculoController@index');
    Route::get('vehiculo/nuevo', 'Comercio\Taller\VehiculoController@create');
    Route::post('vehiculo/post', 'Comercio\Taller\VehiculoController@store');
    Route::get('vehiculo/edit/{id}', 'Comercio\Taller\VehiculoController@edit');
    Route::post('vehiculo/update', 'Comercio\Taller\VehiculoController@update');
    Route::get('vehiculo/show/{id}', 'Comercio\Taller\VehiculoController@show');
    Route::post('vehiculo/anular', 'Comercio\Taller\VehiculoController@destroy');
    Route::get('vehiculo/reporte', 'Comercio\Taller\VehiculoController@reporte');
    Route::get('vehiculo/codigovalido/{value}', 'Comercio\Taller\VehiculoController@codigoValido');
    Route::get('get_vehiculos', 'Comercio\Taller\VehiculoController@getVehiculos');
    Route::get('get_vehiculo_busqueda/{value}', 'Comercio\Taller\VehiculoController@searchData');
    Route::get('get_vehiculos_paginacion/{value}', 'Comercio\Taller\VehiculoController@changeSizePagination');


    Route::resource('partes_vehiculos', 'Comercio\Taller\VehiculoPartesController');
    Route::get('get_vehiculo_partes', 'Comercio\Taller\VehiculoPartesController@getVehiculoPartes');
    Route::get('get_vehiculo_partes_busqueda/{value}', 'Comercio\Taller\VehiculoPartesController@searchData');
    Route::get('get_vehiculo_partes_paginacion/{value}', 'Comercio\Taller\VehiculoPartesController@changeSizePagination');

    Route::resource('listacaracteristica', 'Comercio\Taller\VehiculoCaracteristicaController');
    Route::get('buscarcaracteristica/{value}', 'Comercio\Taller\VehiculoCaracteristicaController@getBusqueda');
    Route::get('paginacion-vehiculo-caracteristica/{value}', 'Comercio\Taller\VehiculoCaracteristicaController@changeSizePagination');

    Route::get('vehiculo-historia/index', 'Comercio\Taller\VehiculoHistorialController@index');
    Route::get('vehiculo-historia/create', 'Comercio\Taller\VehiculoHistorialController@create');
    Route::post('vehiculo-historia/post', 'Comercio\Taller\VehiculoHistorialController@store');
    Route::get('vehiculo-historia/edit/{id}', 'Comercio\Taller\VehiculoHistorialController@edit');
    Route::post('vehiculo-historia/update', 'Comercio\Taller\VehiculoHistorialController@update');
    Route::post('vehiculo-historia/anular', 'Comercio\Taller\VehiculoHistorialController@destroy');
    Route::get('get_historia_vehiculos', 'Comercio\Taller\VehiculoHistorialController@getHistoriaVehiculos');
    Route::get('get_historia_vehiculos_busqueda/{value}', 'Comercio\Taller\VehiculoHistorialController@searchData');
    Route::get('get_historia_vehiculos_paginacion/{value}', 'Comercio\Taller\VehiculoHistorialController@changeSizePagination');

    Route::get('producto_caracteristica/index', 'Comercio\Almacen\Producto\ProducCaracteristicaController@get_data');
    Route::post('producto_caracteristica/post', 'Comercio\Almacen\Producto\ProducCaracteristicaController@store');
    Route::post('producto_caracteristica/update', 'Comercio\Almacen\Producto\ProducCaracteristicaController@update');
    Route::post('producto_caracteristica/anular', 'Comercio\Almacen\Producto\ProducCaracteristicaController@destroy');

    Route::get('traspaso_producto/index', 'Comercio\Almacen\Producto\TraspasoProductoController@index');
    Route::get('traspaso_producto/validar_codigo/{value}', 'Comercio\Almacen\Producto\TraspasoProductoController@validar_codigo');
    Route::get('traspaso_producto/get_tipo_traspaso', 'Comercio\Almacen\Producto\TraspasoProductoController@get_tipo_traspaso');
    Route::get('traspaso_producto/get_almacen', 'Comercio\Almacen\Producto\TraspasoProductoController@get_almacen');
    Route::post('traspaso_producto/get_productos_almacenes', 'Comercio\Almacen\Producto\TraspasoProductoController@get_productos_almacenes');
    Route::post('traspaso_producto/get_stock_almacen', 'Comercio\Almacen\Producto\TraspasoProductoController@get_stock_almacen');
    Route::post('traspaso_producto/store', 'Comercio\Almacen\Producto\TraspasoProductoController@store');
    Route::post('traspaso_producto/destroy', 'Comercio\Almacen\Producto\TraspasoProductoController@destroy');
    Route::get('traspaso_producto/show/{id}', 'Comercio\Almacen\Producto\TraspasoProductoController@show');

    Route::get('indexComision', 'Comercio\Ventas\ComisionVentaController@lista');
    Route::get('comision/nuevo', 'Comercio\Ventas\ComisionVentaController@create');
    Route::post('comision/post', 'Comercio\Ventas\ComisionVentaController@store');
    Route::get('comision/actualizar/{id}', 'Comercio\Ventas\ComisionVentaController@edit');
    Route::post('comision/update', 'Comercio\Ventas\ComisionVentaController@update');
    Route::post('comision/delete', 'Comercio\Ventas\ComisionVentaController@destroy');

    Route::resource('proveedores', 'Comercio\Compras\ProveedorController');

    Route::get('proveedor/index', 'Comercio\Compras\ProveedorController@index');
    Route::get('proveedor/nuevo', 'Comercio\Compras\ProveedorController@create');
    Route::post('proveedor/post', 'Comercio\Compras\ProveedorController@store');
    Route::get('proveedor/edit/{id}', 'Comercio\Compras\ProveedorController@edit');
    Route::post('proveedor/show', 'Comercio\Compras\ProveedorController@show');
    Route::post('proveedor/update', 'Comercio\Compras\ProveedorController@update');
    Route::get('proveedor/create', 'Comercio\Compras\ProveedorController@create');

    Route::get('/proveedor/reporte', 'Comercio\Compras\ProveedorController@reporte');

    Route::post('anularProveedor', 'Comercio\Compras\ProveedorController@destroy');

    Route::get('venta/reporte', 'Comercio\Ventas\VentaController@reporte');
    Route::get('reporte/venta-por-cobrar', 'Comercio\Reportes\Ventas\VentaPorCobrarController@index');

    Route::post('libroventa/generar_reporte', 'Comercio\Reportes\Ventas\VentaController@libroventagenerar');

    Route::get('venta/reporte_historico_vehiculo', 'Comercio\Reportes\Ventas\VentaHistoricoVehiculoController@reporte');

    Route::resource('tipocliente', 'Comercio\Ventas\ClienteTipoController');
    Route::get('get_tipo_clientes', 'Comercio\Ventas\ClienteTipoController@getTipoClientes');
    Route::get('busqueda_tipo_cliente/{value}', 'Comercio\Ventas\ClienteTipoController@searchData');
    Route::get('cantidad_paginacion_tipo_cliente/{value}', 'Comercio\Ventas\ClienteTipoController@changeSizePagination');

    Route::resource('referenciacontacto', 'Comercio\Ventas\ReferenciaDeContactoController');

    Route::get('cliente/reporte', 'Comercio\Ventas\ClienteController@reporte');

    Route::get('producto/reporte', 'Comercio\Almacen\Producto\ProductoController@reporte');
    
    Route::get('kardexproducto/reporte', 'Comercio\Almacen\Producto\ProductoController@reportekardexproducto');
    Route::post('kardexproducto/generar_reporte', 'Comercio\Reportes\Almacen\ProductoController@generarkardexproducto');
    
    Route::post('/producto/generar_reporte', 'Comercio\Reportes\Almacen\ProductoController@generarproducto');


    Route::resource('cliente', 'Comercio\Ventas\ClienteController');
    Route::get('busquedacliente/{value}', 'Comercio\Ventas\ClienteController@getBusqueda');
    Route::get('cambiarpaginacion/{value}', 'Comercio\Ventas\ClienteController@changeSizePagination');

    Route::post('showCliente','Comercio\Ventas\ClienteController@showCliente');

    Route::post('obtenerlistas', 'Comercio\Almacen\ListaPrecioController@getListasActivas');

    Route::get('indexFamilia', 'Comercio\Almacen\Producto\FamiliaController@index');
    Route::post('postFamilia', 'Comercio\Almacen\Producto\FamiliaController@store');
    Route::post('anularFamilia', 'Comercio\Almacen\Producto\FamiliaController@destroy');


    Route::get('producto/index', 'Comercio\Almacen\Producto\ProductoController@index');
    Route::get('producto/existenciaalmacen', 'Comercio\Almacen\Producto\ProductoController@existenciaalmacen');

    Route::post('/producto/searchByIdCod', 'Comercio\Almacen\Producto\ProductoController@searchByIdCod');
    Route::post('/producto/searchByDescripcion', 'Comercio\Almacen\Producto\ProductoController@searchByDescripcion');

    Route::resource('producto', 'Comercio\Almacen\Producto\ProductoController');

    Route::resource('moneda', 'Comercio\Almacen\MonedaController');
    Route::resource('familia', 'Comercio\Almacen\Producto\FamiliaController');
    Route::resource('pcaracteristica', 'Comercio\Almacen\Producto\ProducCaracteristicaController');
    Route::resource('unidadmedida', 'Comercio\Almacen\UnidadMedidaController');

    Route::get('get_unidades_medida', 'Comercio\Almacen\UnidadMedidaController@getUnidadesMedida');
    Route::get('get_unidad_medida_busqueda/{value}', 'Comercio\Almacen\UnidadMedidaController@searchData');
    Route::get('get_unidad_medida_paginacion/{value}', 'Comercio\Almacen\UnidadMedidaController@changeSizePagination');

    Route::get('get_tipo_traspasos', 'Comercio\Almacen\IngrSalTrasTipoController@getTipoTraspasos');
    Route::get('get_tipo_traspaso_busqueda/{value}', 'Comercio\Almacen\IngrSalTrasTipoController@searchData');
    Route::get('get_tipo_traspasos_paginacion/{value}', 'Comercio\Almacen\IngrSalTrasTipoController@changeSizePagination');

    Route::get('get_tipo_monedas', 'Comercio\Almacen\MonedaController@getTipoMonedas');
    Route::get('get_tipo_moneda_busqueda/{value}', 'Comercio\Almacen\MonedaController@searchData');
    Route::get('get_tipo_monedas_paginacion/{value}', 'Comercio\Almacen\MonedaController@changeSizePagination');

    Route::resource('almacen', 'Comercio\Almacen\AlmacenController');
    Route::resource('listaprecio', 'Comercio\Almacen\ListaPrecioController');
    Route::resource('almacenubi', 'Comercio\Almacen\AlmacenUbicacionController');

    Route::get('get_ubicaciones/{value}', 'Comercio\Almacen\AlmacenUbicacionController@getUbicaciones');

    Route::get('get_almacenes', 'Comercio\Almacen\AlmacenController@getAlmacenes');
    Route::get('get_almacen_busqueda/{value}', 'Comercio\Almacen\AlmacenController@searchData');
    Route::get('get_almacenes_paginacion/{value}', 'Comercio\Almacen\AlmacenController@changeSizePagination');

    Route::get('get_tipo_vehiculos', 'Comercio\Taller\VehiculoTipoController@getTipoVehiculos');
    Route::get('get_ubicacion_almacenes', 'Comercio\Almacen\AlmacenUbicacionController@getUbicacionAlmacenes');

    Route::post('sucursal/get_almacen', 'Comercio\Almacen\SucursalController@get_almacen');

    Route::get('sucursal/index', 'Comercio\Almacen\SucursalController@index');
    Route::post('sucursal/store', 'Comercio\Almacen\SucursalController@store');
    Route::get('sucursal/edit/{id}', 'Comercio\Almacen\SucursalController@edit');
    Route::post('sucursal/update', 'Comercio\Almacen\SucursalController@update');

    Route::resource('sucursal', 'Comercio\Almacen\SucursalController');
    Route::get('get_sucursales', 'Comercio\Almacen\SucursalController@getSucursales');
    Route::get('get_sucursal_busqueda/{value}', 'Comercio\Almacen\SucursalController@searchData');
    Route::get('get_sucursales_paginacion/{value}', 'Comercio\Almacen\SucursalController@changeSizePagination');

    Route::post('getPrecio','Comercio\Ventas\VentaController@traerProductoPrecio');

    Route::post('venta/get_productoprecio','Comercio\Ventas\VentaController@traerPrecioProducto');
    Route::post('venta/search_producto','Comercio\Ventas\VentaController@searchProducto');
    Route::post('venta/get_listaprecio','Comercio\Ventas\VentaController@get_listaprecio');
    Route::post('venta/get_almacen','Comercio\Ventas\VentaController@get_almacen');
    Route::post('venta/get_sucursal','Comercio\Ventas\VentaController@get_sucursal');
    Route::post('venta/get_moneda','Comercio\Ventas\VentaController@get_moneda');
    Route::post('venta/get_moneda','Comercio\Ventas\VentaController@get_moneda');
    Route::post('venta/get_vehiculo','Comercio\Ventas\VentaController@get_vehiculo');

    Route::get('venta/proforma/index','Comercio\Ventas\VentaController@proforma');
    Route::post('venta/proforma/search_cliente','Comercio\Ventas\VentaController@proforma_searchcliente');
    
    Route::post('venta/recibo_venta','Comercio\Ventas\VentaController@recibo_venta');
    Route::post('venta_show/recibo_venta','Comercio\Ventas\VentaController@recibo_venta_show');

    Route::resource('venta', 'Comercio\Ventas\VentaController');

    Route::post('showVenta','Comercio\Ventas\VentaController@showVentaRegisto');

    Route::post('verifistock','Comercio\Ventas\VentaController@verificarStock');
    Route::post('getproducto','Comercio\Ventas\VentaController@getProductos');

    //Route::resource('tipocontacredito','Comercio\Ventas\TipoContaCreditoController');
    Route::post('traercomisionvendedor','Comercio\Ventas\VentaController@traeComisionVendedor');
    Route::post('traerunidad','Comercio\Ventas\VentaController@traerUnidadMedida');

    Route::get('getCompras', 'Comercio\Compras\CompraController@getCompras');

    Route::get('vendedor/get_usuario', 'Comercio\Ventas\VendedorController@get_usuario');
    Route::resource('vendedor', 'Comercio\Ventas\VendedorController');
    Route::get('vendedor/create', 'Comercio\Ventas\VendedorController@create');

    Route::post('cobro/factura', 'Comercio\Ventas\CobroController@factura');
    Route::get('cobro/create', 'Comercio\Ventas\CobroController@create');
    Route::post('cobro/searchByIdCod', 'Comercio\Ventas\CobroController@searchByIdCod');
    Route::post('cobro/show_data_factura', 'Comercio\Ventas\CobroController@show_data_factura');

    Route::resource('comisionventa', 'Comercio\Ventas\ComisionVentaController');
    //Route::post('listaproductos','Comercio\Almacen\ListaPrecioController@getProductos');
    Route::get('listaproductos/{id}','Comercio\Almacen\ListaPrecioController@getProductos');
    Route::get('producto/search/{value}','Comercio\Almacen\Producto\ProductoController@search');
    Route::get('producto/almacenprod/{id}','Comercio\Almacen\Producto\ProductoController@getAlmacenProd');
    Route::resource('ingresoproducto', 'Comercio\Almacen\Producto\IngresoProductoController');
    Route::resource('ingrsaltratipo', 'Comercio\Almacen\IngrSalTrasTipoController');
    Route::resource('salidaproducto', 'Comercio\Almacen\Producto\SalidaProductoController');

    Route::get('compra/index', 'Comercio\Compras\CompraController@index');
    Route::get('compra/reporte', 'Comercio\Compras\CompraController@reporte');

    Route::post('compra/searchProveedorByNom', 'Comercio\Compras\CompraController@searchProveedorByNom');
    Route::post('compra/searchProveedorByCodId', 'Comercio\Compras\CompraController@searchProveedorByCodId');
    Route::post('compra/get_producto', 'Comercio\Compras\CompraController@get_producto');
    Route::post('compra/get_sucursal', 'Comercio\Compras\CompraController@get_sucursal');
    Route::post('compra/get_almacen', 'Comercio\Compras\CompraController@get_almacen');
    Route::post('compra/search_prodCodID', 'Comercio\Compras\CompraController@search_prodCodID');
    Route::post('compra/search_prodDesc', 'Comercio\Compras\CompraController@search_prodDesc');

    Route::post('compra/generar_recibo', 'Comercio\Compras\CompraController@generar_recibo');
    Route::post('compra/storeFactura', 'Comercio\Compras\CompraController@store_factura');

    Route::resource('compra', 'Comercio\Compras\CompraController');

    Route::resource('cobro', 'Comercio\Ventas\CobroController');

    Route::get('pago/reporte_cuentaporpagar', 'Comercio\Compras\PagoController@reporte_cuentaporpagar');
    Route::get('pago/reporte_pagorealizado', 'Comercio\Compras\PagoController@reporte_pagorealizado');
    Route::resource('pago', 'Comercio\Compras\PagoController');

    Route::resource('proforma', 'Comercio\Ventas\ProformaController');
    Route::resource('inventariocorte', 'Comercio\Almacen\InventarioCorteController');
    Route::resource('tipovehiculo', 'Comercio\Taller\VehiculoTipoController');
    Route::get('compra/{id}/productos', 'Comercio\Compras\CompraController@getProductos');
    Route::get('proveedor/searchcod/{value}', 'Comercio\Compras\ProveedorController@searchCodId');
    Route::get('proveedor/searchnombre/{value}', 'Comercio\Compras\ProveedorController@searchNombre');
    Route::get('producto/searchid/{value}', 'Comercio\Almacen\Producto\ProductoController@searchId');
    Route::get('producto/searchdesc/{value}', 'Comercio\Almacen\Producto\ProductoController@searchDesc');
    Route::get('inventariocorte/searchidcod/{value}', 'Comercio\Almacen\InventarioCorteController@SearchByIdCod');
    Route::get('venta/searchidcod/{value}', 'Comercio\Ventas\VentaController@searchByIdCod');
    Route::get('compra/searchidcod/{value}', 'Comercio\Compras\CompraController@searchByIdCod');
    Route::get('productosall', 'Comercio\Almacen\ListaPrecioController@getproductosall');
    Route::get('venta/getcuotas/{value}', 'Comercio\Ventas\VentaController@getCuotas');
    Route::get('compra/getcuotas/{value}', 'Comercio\Compras\CompraController@getCuotas');
    
    Route::get('vehiculo/searchidcod/{value}', 'Comercio\Taller\VehiculoController@SearchByIdCod');
    Route::get('vehiculo/searchplaca/{value}', 'Comercio\Taller\VehiculoController@SearchByPlaca');

    Route::post('cliente/searchnombre', 'Comercio\Ventas\ClienteController@SearchByNombre');
    Route::post('cliente/searchidcod', 'Comercio\Ventas\ClienteController@SearchByIdCod');
    Route::post('cliente/searchnit', 'Comercio\Ventas\ClienteController@SearchByNit');

    Route::post('cliente/searchvehiculoidcod', 'Comercio\Taller\VehiculoController@SearchByIdCodCli');
    Route::post('cliente/searchvehiculoplaca', 'Comercio\Taller\VehiculoController@SearchByPlacaCli');
    
    Route::post('vendedor/searchidcod', 'Comercio\Ventas\VendedorController@SearchByIdCod');
    Route::post('vendedor/searchfullname', 'Comercio\Ventas\VendedorController@searchByFullName');

    Route::get('vendedor/searchnombre/{value}', 'Comercio\Ventas\VendedorController@SearchByNombre');

    Route::post('listaprecio/search', 'Comercio\Almacen\ListaPrecioController@Search');

    Route::get('listaprecios/{value}', 'Comercio\Almacen\ListaPrecioController@getListaPrecios');
    Route::get('productos/{value}', 'Comercio\Almacen\Producto\ProductoController@getProductos');
    Route::get('clientes/{value}', 'Comercio\Ventas\ClienteController@getClientes');
    Route::get('vendedores/{value}', 'Comercio\Ventas\VendedorController@getVendedores');
    Route::get('nroventa', 'Comercio\Ventas\VentaController@getNroVenta');
    Route::get('nroproforma', 'Comercio\Ventas\VentaController@getNroProforma');
    Route::get('gethistorialvehiculo/{id}', 'Comercio\Ventas\VentaController@getHistorialVehiculo');
    Route::get('getpartesvehiculo/{id}', 'Comercio\Ventas\VentaController@getPartesVehiculo');
    Route::get('nrohistorico', 'Comercio\Taller\VehiculoHistorialController@getNroHistorico');
    Route::post('getproductosalmacenes', 'Comercio\Almacen\Producto\ProductoController@getProductosByAlmacenes');
    Route::post('getproductosfamilia', 'Comercio\Almacen\Producto\ProductoController@getProductosByFamilia');
    Route::post('producto/searchidalmacen', 'Comercio\Almacen\Producto\ProductoController@SearchIdAlmacen');
    Route::post('producto/searchdescalmacen', 'Comercio\Almacen\Producto\ProductoController@SearchDescAlmacen');

    Route::post('almacen/productos', 'Comercio\Almacen\AlmacenController@getProductos');
    
    Route::post('prodalmacenes', 'Comercio\Almacen\Producto\ProductoController@getAlmacenesProds');
    Route::post('producto/searchproducto', 'Comercio\Almacen\Producto\ProductoController@searchProducto');
    Route::get('onlyproducto/search/{value}','Comercio\Almacen\Producto\ProductoController@searchOnlyProduct');

    Route::get('usuario/permisions/{value}','Seguridad\UsuarioController@getPermisions');
    Route::post('verifsesion','Seguridad\LoginController@inSesion');
    Route::get('config/configcliente','Config\ConfigClienteController@index');

    Route::post('config/configcliente','Config\ConfigClienteController@store');

    Route::get('config/configfabrica','Config\ConfigFabricaController@index');
    Route::post('config/configfabrica','Config\ConfigFabricaController@store');
    
    Route::get('producto/validarcodigo/{value}', 'Comercio\Almacen\Producto\ProductoController@validarCodigo');

    Route::get('ingresoprod/validarcodigo/{value}', 'Comercio\Almacen\Producto\IngresoProductoController@validarCodigo');
    Route::get('salidaprod/validarcodigo/{value}', 'Comercio\Almacen\Producto\SalidaProductoController@validarCodigo');
    Route::get('vendedor/validarcodigo/{value}', 'Comercio\Ventas\VendedorController@validarCodigo');
    Route::get('venta/validarcodigo/{value}', 'Comercio\Ventas\VentaController@validarCodigoVenta');
    Route::get('proforma/validarcodigo/{value}', 'Comercio\Ventas\VentaController@validarCodigoProforma');
    Route::get('cobranza/validarcodigo/{value}', 'Comercio\Ventas\CobroController@validarCodigo');
    Route::get('proveedor/validarcodigo/{value}', 'Comercio\Compras\ProveedorController@validarCodigo');
    Route::get('compra/validarcodigo/{value}', 'Comercio\Compras\CompraController@validarCodigo');
    Route::get('pago/validarcodigo/{value}', 'Comercio\Compras\PagoController@validarCodigo');
    Route::get('usuario/searchid/{value}', 'Seguridad\UsuarioController@searchUserId');
    Route::get('usuario/searchnom/{value}', 'Seguridad\UsuarioController@searchUserNom');

    Route::post('proforma/get_sucursal', 'Comercio\Ventas\ProformaController@get_sucursal');
    Route::post('proforma/get_almacen', 'Comercio\Ventas\ProformaController@get_almacen');
    Route::post('proforma/recibo_proforma', 'Comercio\Ventas\ProformaController@recibo_proforma');

    Route::get('clienteventas/search/{value}', 'Comercio\Ventas\ClienteController@searchClienteVentas');
    Route::get('clientes/getVentasCliente/{value}', 'Comercio\Ventas\ClienteController@getVentasCliente');

    Route::get('clienteproformas/search/{value}', 'Comercio\Ventas\ClienteController@searchClienteProformas');
    Route::get('clientes/getProformasCliente/{value}', 'Comercio\Ventas\ClienteController@getProformasCliente');

    Route::get('provcompras/search/{value}', 'Comercio\Compras\ProveedorController@searchProvCompras');
    Route::get('proveedores/getCompras/{value}', 'Comercio\Compras\ProveedorController@getComprasProveedor');
    Route::get('proformacompleta/{value}', 'Comercio\Ventas\ProformaController@getPorformaCompleta');

    Route::post('config/configcliente/colors','Config\ConfigClienteController@colors');

    Route::post('familiaubicacion', 'Comercio\Almacen\AlmacenUbicacionController@store');
    Route::post('eliminacionubicacion', 'Comercio\Almacen\AlmacenUbicacionController@destroy');

    Route::get('familiaciudad/index', 'Comercio\Ventas\CiudadController@index');
    Route::post('familiaciudad/store', 'Comercio\Ventas\CiudadController@store');
    Route::post('familiaciudad/update', 'Comercio\Ventas\CiudadController@update');
    Route::post('familiaciudad/delete', 'Comercio\Ventas\CiudadController@destroy');

    Route::get('getVehiculo', 'Comercio\Taller\VehiculoController@getVehiculo');

    Route::get('getCliente', 'Comercio\Taller\VehiculoController@getCliente');
    Route::get('mostraCliente', 'Comercio\Taller\VehiculoHistorialController@mostrarCliente');

    Route::get('mostrarCodigoCliente', 'Comercio\Taller\VehiculoHistorialController@mostrarCodigoCliente');
    Route::get('getCaracteristicaVehiculo', 'Comercio\Taller\VehiculoCaracteristicaController@getCaracteristica');
    Route::get('getTipoVehiculo', 'Comercio\Taller\VehiculoTipoController@getTipo');
    Route::get('getDetalleCaracteristica/{id}', 'Comercio\Taller\VehiculoController@getDetalle');

    Route::get('getParteVehiculo', 'Comercio\Taller\VehiculoPartesController@show');
    Route::get('vehiculo_parte/get_data', 'Comercio\Taller\VehiculoPartesController@get_data');
    
    Route::post('eliminartipovehiculo', 'Comercio\Taller\VehiculoTipoController@destroy');

    Route::post('updateProveedor', 'Comercio\Compras\ProveedorController@update');
    Route::post('showVehiculoHistoria', 'Comercio\Taller\VehiculoHistorialController@show');
    Route::get('indexCliente/nuevo/crearCliente', 'Comercio\Ventas\ClienteController@create');

    Route::get('/venta/reporte_por_producto/create', 'Comercio\Reportes\Ventas\VentaController@get_producto');
    Route::post('venta/get_codigo_producto', 'Comercio\Reportes\Ventas\VentaController@get_codigo_producto');
    Route::post('venta/get_descripcion_producto', 'Comercio\Reportes\Ventas\VentaController@get_descripcion_producto');

    Route::get('/venta/reporte_factura/create', 'Comercio\Reportes\Ventas\FacturaController@create');


    Route::get('actividad_economica/index', 'Configuracion\ActividadEconomicaController@index');
    Route::post('actividad_economica/store', 'Configuracion\ActividadEconomicaController@store');
    Route::get('actividad_economica/edit/{id}', 'Configuracion\ActividadEconomicaController@edit');
    Route::post('actividad_economica/update', 'Configuracion\ActividadEconomicaController@update');
    Route::post('actividad_economica/destroy', 'Configuracion\ActividadEconomicaController@destroy');

    Route::post('certificacion/generar_codigo', 'Configuracion\CertificacionController@generar');

    Route::get('dosificacion/index', 'Configuracion\DosificacionController@index');
    Route::get('dosificacion/create', 'Configuracion\DosificacionController@create');
    Route::post('dosificacion/store', 'Configuracion\DosificacionController@store');
    Route::get('dosificacion/edit/{id}', 'Configuracion\DosificacionController@edit');
    Route::post('dosificacion/update', 'Configuracion\DosificacionController@update');

    Route::get('tipocambio/index', 'Configuracion\TipoCambioController@index');
    Route::get('tipocambio/create', 'Configuracion\TipoCambioController@create');
    Route::post('tipocambio/store', 'Configuracion\TipoCambioController@store');
    Route::get('tipocambio/edit/{id}', 'Configuracion\TipoCambioController@edit');
    Route::post('tipocambio/update', 'Configuracion\TipoCambioController@update');
    Route::post('tipocambio/destroy', 'Configuracion\TipoCambioController@destroy');

    Route::get('entrega_producto/index', 'Comercio\Ventas\EntregaProductoController@index');
    Route::post('entrega_producto/store', 'Comercio\Ventas\EntregaProductoController@store');



    /* reporte */
    /* https://www.npmjs.com/package/react-to-print */

    Route::get('log_reporte/create', 'Comercio\Reportes\Seguridad\LogController@create');
    Route::post('log_reporte/searchUserByLogin', 'Comercio\Reportes\Seguridad\LogController@searchUserByLogin');
    Route::post('log_reporte/searchUserByUsuario', 'Comercio\Reportes\Seguridad\LogController@searchUserByUsuario');
    Route::post('log_reporte/searchUserByUsuario', 'Comercio\Reportes\Seguridad\LogController@searchUserByUsuario');
    Route::post('log_reporte/generar_data', 'Comercio\Reportes\Seguridad\LogController@generar_data');

    /* Fin reporte */

});

Route::middleware('verificar_sesion_api')->prefix('/contable')->group(function() {
    
    Route::get('cuenta_plan/index', 'Contable\CuentaPlanController@index');
    Route::post('cuenta_plan/por_defecto', 'Contable\CuentaPlanController@por_defecto');
    Route::post('cuenta_plan/vaciar', 'Contable\CuentaPlanController@vaciar');
    Route::get('cuenta_plan/get_tipo_cuenta', 'Contable\CuentaPlanController@get_tipo_cuenta');
    Route::post('cuenta_plan/store', 'Contable\CuentaPlanController@store');
    Route::post('cuenta_plan/update', 'Contable\CuentaPlanController@update');
    Route::post('cuenta_plan/delete', 'Contable\CuentaPlanController@destroy');

    Route::get('banco/index', 'Contable\BancoController@index');
    Route::post('banco/store', 'Contable\BancoController@store');
    Route::get('banco/edit/{id}', 'Contable\BancoController@edit');
    Route::post('banco/update', 'Contable\BancoController@update');
    Route::post('banco/delete', 'Contable\BancoController@destroy');

    Route::get('config_eerr/index', 'Contable\ConfigEERRController@index');
    Route::get('config_eerr/create', 'Contable\ConfigEERRController@create');
    Route::post('config_eerr/store', 'Contable\ConfigEERRController@store');
    Route::get('config_eerr/editar/{id}', 'Contable\ConfigEERRController@edit');
    Route::post('config_eerr/update', 'Contable\ConfigEERRController@update');
    Route::post('config_eerr/delete', 'Contable\ConfigEERRController@destroy');

    Route::get('tipo_costo/index', 'Contable\TipoCentroCostoController@index');
    Route::post('tipo_costo/store', 'Contable\TipoCentroCostoController@store');
    Route::get('tipo_costo/edit/{id}', 'Contable\TipoCentroCostoController@edit');
    Route::post('tipo_costo/delete', 'Contable\TipoCentroCostoController@destroy');

    Route::get('centro_de_costo/index', 'Contable\CentroDeCostoController@index');
    Route::get('centro_de_costo/get_tipo_costo', 'Contable\CentroDeCostoController@get_tipo_costo');
    Route::post('centro_de_costo/store', 'Contable\CentroDeCostoController@store');
    Route::post('centro_de_costo/update', 'Contable\CentroDeCostoController@update');
    Route::post('centro_de_costo/delete', 'Contable\CentroDeCostoController@destroy');

    Route::post('cuenta_plan/get_codigo', 'Contable\CuentaPlanController@get_codigo');
    Route::post('cuenta_plan/get_cuenta', 'Contable\CuentaPlanController@get_cuenta');

    Route::get('gestion_periodo/index', 'Contable\GestionContableController@index');
    Route::post('gestion_periodo/store', 'Contable\GestionContableController@store');

    Route::post('gestion_periodo/update', 'Contable\GestionContableController@update');
    Route::post('gestion_periodo/update_periodo', 'Contable\GestionContableController@update_periodo');

    Route::post('gestion_periodo/store_periodo', 'Contable\GestionContableController@store_periodo');
    Route::get('gestion_periodo/show_gestion/{id}', 'Contable\GestionContableController@show');

    Route::get('gestion_periodo/editar_gestion/{id}', 'Contable\GestionContableController@edit');
    Route::get('gestion_periodo/editar_periodo/{id}', 'Contable\GestionContableController@editar_periodo');

    Route::post('gestion_periodo/delete_gestion', 'Contable\GestionContableController@delete_gestion');
    Route::post('gestion_periodo/delete_periodo', 'Contable\GestionContableController@delete_periodo');

    Route::get('libro_mayor/create', 'Contable\LibroMayorController@create');
    Route::get('libro_mayor/get_gestion/{id}', 'Contable\LibroMayorController@get_gestion');

    Route::get('estado_resultado/create', 'Contable\EstadoResultadoController@create');

    Route::post('comprobante/get_sistemacomercial', 'Contable\ComprobanteController@get_sistemacomercial');
    Route::post('comprobante/searchsistemacomercialByIdCod', 'Contable\ComprobanteController@searchsistemacomercialByIdCod');
    Route::post('comprobante/generar_comprobante', 'Contable\ComprobanteController@generar_comprobante');
    Route::resource('comprobante', 'Contable\ComprobanteController');

    Route::get('/soap', 'Comercio\Facturacion\SoapController@index');

    Route::resource('comprobantetipo', 'Contable\ComprobanteTipoController');
    Route::get('libro-diario/create', 'Contable\LibroDiarioController@create');
    Route::get('balance-general/create', 'Contable\BalanceGeneralController@create');
    Route::post('config', 'Contable\CuentaConfigController@store');


    Route::get('cuenta_asien_autom/index', 'Contable\Ajuste\CtbDefiCtasAsientAutomController@index');
    Route::post('cuenta_asien_autom/edit', 'Contable\Ajuste\CtbDefiCtasAsientAutomController@edit');
    Route::post('cuenta_asien_autom/update', 'Contable\Ajuste\CtbDefiCtasAsientAutomController@update');


    Route::get('plantilla_asien_autom/get_data', 'Contable\Ajuste\CtbTransacAutomaticasController@get_data');
    Route::post('plantilla_asien_autom/edit', 'Contable\Ajuste\CtbTransacAutomaticasController@edit');
    Route::post('plantilla_asien_autom/update', 'Contable\Ajuste\CtbTransacAutomaticasController@update');


});

Route::middleware('verificar_sesion_api')->prefix('/restaurant')->group(function() {
    Route::get('venta/create', 'Comercio\Restaurant\VentaController@create');
    Route::post('venta/search_producto', 'Comercio\Restaurant\VentaController@search_producto');
    Route::post('venta/categoria_getproducto', 'Comercio\Restaurant\VentaController@categoria_getproducto');
    Route::post('venta/store', 'Comercio\Restaurant\VentaController@store');
});