
const comercioprefix = '/api/commerce1';
const contableprefix = '/api/contable';
const restaurantprefix = '/api/restaurant';

const ws = {

    wsimportarproducto: comercioprefix + '/producto/importararchivo',

    wslogin: '/api/login',
    wslogout: '/api/usuario/logout',
    wsupdatepassword: comercioprefix + '/usuario/update_password',
    wsusuarioperfil: comercioprefix + '/usuario/perfil',
    wsconfifcolors: comercioprefix + '/config/configcliente/colors',
    wsingresoproducto: comercioprefix + '/ingresoproducto',
    wssalidaproducto: comercioprefix + '/salidaproducto',
    wsmoneda: comercioprefix + '/moneda',
    wssearchproducto: comercioprefix + '/producto/search',
    wstiposalingresotrans: comercioprefix + '/ingrsaltratipo',
    wsalmacen: comercioprefix + '/almacen',
    wsgetalmacenprod: comercioprefix + '/producto/almacenprod',
    wscompra: comercioprefix + '/compra',

    wssucursal: comercioprefix + '/sucursal',
    wssucursal_getalmacen: comercioprefix + '/sucursal/get_almacen',

    wssearchproveedorcod: comercioprefix + '/proveedor/searchcod',
    wssearchproveedornom: comercioprefix + '/proveedor/searchnombre',
    wssearchproductoid: comercioprefix + '/producto/searchid',
    wssearchproductodesc: comercioprefix + '/producto/searchdesc',
    wsunidadmedida: comercioprefix + '/unidadmedida',
    //wsshowproveedor: '/commerce/admin/showProveedor',
    wsshowproveedor: comercioprefix + '/proveedor/show',

    wsproducto: comercioprefix + '/producto',
    wsproductoexistalm: comercioprefix + '/producto/existenciaalmacen',

    wslistaprecio: comercioprefix + '/listaprecio',
    wsallproductos: comercioprefix + '/productosall',
    wslistaproductoslp: comercioprefix + '/listaproductos',
    wsvendedor: comercioprefix + '/vendedor',
    wssearchventaidcod : comercioprefix + '/venta/searchidcod',
    wssearchcompraidcod : comercioprefix + '/compra/searchidcod',

    wscobranza: comercioprefix + '/cobro',
    wscobranza_factura: comercioprefix + '/cobro/factura',

    wsgetcuotasventa: comercioprefix + '/venta/getcuotas',
    wsgetcuotascompra: comercioprefix + '/compra/getcuotas',
    wspagos: comercioprefix + '/pago',
    wsventa: comercioprefix + '/venta',
    wsproforma: comercioprefix + '/proforma',

    wsentregaproducto: comercioprefix + '/entrega_producto',

    wsactividadeconomica: comercioprefix + '/actividad_economica' ,
    wsdosificacion: comercioprefix + '/dosificacion' ,
    wstipocambio: comercioprefix + '/tipocambio' ,
    wscertificacion: comercioprefix + '/certificacion' ,

    wssearchclienteidcod: comercioprefix + '/cliente/searchidcod',
    wssearchclientenombre: comercioprefix + '/cliente/searchnombre',
    wssearchclientenit: comercioprefix + '/cliente/searchnit',
    wssearchvehiculoidcod: comercioprefix + '/vehiculo/searchidcod',
    wssearchvehiculoplaca: comercioprefix + '/vehiculo/searchplaca',
    wssearchvendedoridcod: comercioprefix + '/vendedor/searchidcod',
    wssearchvendedornombre: comercioprefix + '/vendedor/searchnombre',
    wssearchvendedorfullname: comercioprefix + '/vendedor/searchfullname',

    wsverificarstock: comercioprefix + '/verifistock',
    wsgetprecioprod: comercioprefix + '/getPrecio',
    wsinventariocorte: comercioprefix + '/inventariocorte',
    wsgetvehiculo: comercioprefix + '/getVehiculo',
    wssearchlistaprecio: comercioprefix + '/listaprecio/search',
    wslistaprecios: comercioprefix + '/listaprecios',
    wsproductos: comercioprefix + '/productos',
    wsclientes: comercioprefix + '/clientes',
    wsvendedores: comercioprefix + '/vendedores',
    wssearchprodidalm: comercioprefix + '/producto/searchidalmacen',
    wssearchproddescalm: comercioprefix + '/producto/searchdescalmacen',
    wsalmacenproductos: comercioprefix + '/almacen/productos',
    wsindexproveedor: '/commerce/admin/indexProveedor',
    wsgetnroventa: comercioprefix + '/nroventa',
    wsgetnroproforma: comercioprefix + '/nroproforma',
    wsgetnrohistorico: comercioprefix + '/nrohistorico',
    wsgethistorialvehiculo: comercioprefix + '/gethistorialvehiculo',
    wsgetpartesvehiculo: comercioprefix + '/getpartesvehiculo',
    wsproductosall: comercioprefix + '/getallproductos',
    wsproductosalmacenes: comercioprefix + '/getproductosalmacenes',
    wsfamilia: comercioprefix + '/familia',
    wsproductosxfamilia: comercioprefix + '/getproductosfamilia',
    wsprodalmacenes: comercioprefix + '/prodalmacenes',
    wssearchprodbytipo: comercioprefix + '/producto/searchproducto',
    wssearchinventarioidcod: comercioprefix + '/inventariocorte/searchidcod',
    wssearchonlyproduct: comercioprefix + '/onlyproducto/search',

    wsgetpartesvehiculoall: comercioprefix + '/getParteVehiculo',
    wsvehiculoparte: comercioprefix +  '/vehiculo_parte',
    
    wsalmacenubicacion: comercioprefix + '/almacenubi',
    wspcaracteristica: comercioprefix + '/pcaracteristica',
    wscliente: comercioprefix + '/cliente',
    wstipocontacredito: comercioprefix + '/tipocontacredito',
    wstraercomisionvend: comercioprefix + '/traercomisionvendedor',
    wstraerunidadmed: comercioprefix + '/traerunidad',
    wsshowcliente: comercioprefix + '/showCliente',
    wscomisionventa: comercioprefix + '/comisionventa',
    wsreferenciascont: comercioprefix + '/referenciacontacto',
    wspermisions: comercioprefix + '/usuario/permisions',
    wsgetlistasactivas: comercioprefix + '/obtenerlistas',
    wsindexfamilia: comercioprefix + '/indexFamilia',

    wsconfigfabrica: comercioprefix + '/config/configfabrica',
    wsconfigcliente: comercioprefix + '/config/configcliente',
    wsverificarsesion: comercioprefix + '/verifsesion',
    apiCaptcha: 'https://www.google.com/recaptcha/api/siteverify',

    wsListCharacteristics: comercioprefix + '/listacaracteristica',
    wsBuscarCaracteristica: comercioprefix + '/buscarcaracteristica',
    wsPaginacionVehiculoCaracteristica: comercioprefix + '/paginacion-vehiculo-caracteristica',
    wsBusquedaCliente: comercioprefix + '/busquedacliente',
    wsTipoClientes: comercioprefix + '/tipocliente',
    wsBusquedaTipoCliente: comercioprefix + '/busqueda_tipo_cliente',
    wsCantidadPaginacionTipoCliente: comercioprefix + '/cantidad_paginacion_tipo_cliente',
    wsGetTipoClientes: comercioprefix + '/get_tipo_clientes',

    wsGetUnidadesMedida: comercioprefix + '/get_unidades_medida',
    wsGetUnidadMedidaBusqueda: comercioprefix + '/get_unidad_medida_busqueda',
    wsGetUnidadesMedidaPaginacion: comercioprefix + '/get_unidad_medida_paginacion',

    wsGetTipoMonedas: comercioprefix + '/get_tipo_monedas',
    wsGetTipoMonedaBusqueda: comercioprefix + '/get_tipo_moneda_busqueda',
    wsGetTipoMonedasPaginacion: comercioprefix + '/get_tipo_monedas_paginacion',

    wsGetTipoTraspasos: comercioprefix + '/get_tipo_traspasos',
    wsGetTipoTraspaso: comercioprefix + '/get_tipo_traspaso_busqueda',
    wsGetTipoTraspasosPaginacion: comercioprefix + '/get_tipo_traspasos_paginacion',

    wsGetSucursales: comercioprefix + '/get_sucursales',
    wsGetSucursalBusqueda: comercioprefix + '/get_sucursal_busqueda',
    wsGetSucursalesPaginacion: comercioprefix + '/get_sucursales_paginacion',

    wsGetAlmacenes: comercioprefix + '/get_almacenes',
    wsGetAlmacenBusqueda: comercioprefix + '/get_almacen_busqueda',
    wsGetAlmacenesPaginacion: comercioprefix + '/get_almacenes_paginacion',

    wsGetTipoVehiculos: comercioprefix + '/get_tipo_vehiculos',
    wsGetCiudades: comercioprefix + '/get_ciudades',
    wsGetUbicacionAlmacenes: comercioprefix + '/get_ubicacion_almacenes',
    wsGetUbicaciones: comercioprefix + '/get_ubicaciones',

    wsGetVehiculos: comercioprefix + '/get_vehiculos',
    wsGetVehiculoBusqueda: comercioprefix + '/get_vehiculo_busqueda',
    wsGetVehiculosPaginacion: comercioprefix + '/get_vehiculos_paginacion',

    wsGetHistoriaVehiculos: comercioprefix + '/get_historia_vehiculos',
    wsGetHistoriaVehiculosBusqueda: comercioprefix + '/get_historia_vehiculos_busqueda',
    wsGetHistoriaVehiculosPaginacion: comercioprefix + '/get_historia_vehiculos_paginacion',

    wsPartesVehiculos: comercioprefix + '/partes_vehiculos',
    wsGetVehiculoPartes: comercioprefix + '/get_vehiculo_partes',
    wsGetVehiculoParteBusqueda: comercioprefix + '/get_vehiculo_partes_busqueda',
    wsGetVehiculoPartePaginacion: comercioprefix + '/get_vehiculo_partes_paginacion',

    wstipovehiculo: comercioprefix + '/tipovehiculo',
    wsclivehiculosidcod: comercioprefix + '/cliente/searchvehiculoidcod',
    wsclivehiculosplaca: comercioprefix + '/cliente/searchvehiculoplaca',
    wsCambiarPaginacion: comercioprefix + '/cambiarpaginacion',
    wscodvehiculovalido: comercioprefix + '/vehiculo/codigovalido',
    wscodproductovalido: comercioprefix + '/producto/validarcodigo',
    wscodingresoprodvalido: comercioprefix + '/ingresoprod/validarcodigo',
    wscodsalidaprodvalido: comercioprefix + '/salidaprod/validarcodigo',
    wscodclientevalido: comercioprefix + '/cliente/validarcodigo',
    wscodvendedorvalido: comercioprefix + '/vendedor/validarcodigo',
    wscodventavalido: comercioprefix + '/venta/validarcodigo',
    wscodproformavalido: comercioprefix + '/proforma/validarcodigo',
    wscodcobrovalido: comercioprefix + '/cobranza/validarcodigo',
    wscodproveedorvalido: comercioprefix + '/proveedor/validarcodigo',
    wscodcompravalido: comercioprefix + '/compra/validarcodigo',
    wscodpagovalido: comercioprefix + '/pago/validarcodigo',
    wssearchusuarioid: comercioprefix + '/usuario/searchid',
    wssearchusuarionom: comercioprefix + '/usuario/searchnom',
    wsusuariosconectados: comercioprefix + '/usuario/conectados',
    wssearchcliventas: comercioprefix + '/clienteventas/search',
    wsgetventasclientes: comercioprefix + '/clientes/getVentasCliente',
    wssearchprovecompras: comercioprefix + '/provcompras/search',
    wsgetcomprasproveedor: comercioprefix + '/proveedores/getCompras',
    wssearchcliproformas: comercioprefix + '/clienteproformas/search',
    wsgetproformascliente: comercioprefix + '/clientes/getProformasCliente',
    wsproformacompleta: comercioprefix + '/proformacompleta',

    wscreateventa: comercioprefix + '/venta/create',
    wsdetalleventa_recibo: comercioprefix + '/venta/recibo_venta',
    wsdetalleventashow_recibo: comercioprefix + '/venta_show/recibo_venta',
    wsproformaventa: comercioprefix + '/venta/proforma/index',
    wsproformaventasearchcliente: comercioprefix + '/venta/proforma/search_cliente',

    wsProveedores: comercioprefix + '/proveedores',

    wsProveedor: comercioprefix + '/proveedor',
    
    wsGetCompras: comercioprefix + '/getCompras',

    wscreateproforma: comercioprefix + '/proforma/create',
    wsproformasucursal: comercioprefix + '/proforma/get_sucursal',
    wsproformaalmacen: comercioprefix + '/proforma/get_almacen',
    wsproforma_recibo: comercioprefix + '/proforma/recibo_proforma',

    wscreatecompra: comercioprefix + '/compra/create',

    wsusuario: comercioprefix + '/usuario',
    wsusuariodelete: comercioprefix + '/usuario/delete',
    wsusuariostore: comercioprefix + '/usuario/post',
    wsusuarioedit: comercioprefix + '/usuario/edit',
    wsusuarioupdate: comercioprefix + '/usuario/update',
    wsusuariogenerarpw: comercioprefix + '/usuario/generar_password',

    wsgrupousuario: comercioprefix + '/grupousuario',
    wsgrupousuariodel: comercioprefix + '/grupousuario/delete',
    wsgrupousuariocreate: comercioprefix + '/grupousuario/nuevo',
    wsgrupousuariostore: comercioprefix + '/grupousuario/post',
    wsgrupousuarioedit: comercioprefix + '/grupousuario/edit',
    wsgrupousuarioupdate: comercioprefix + '/grupousuario/update',

    wspermisioindex: comercioprefix + '/permiso/index',
    wspermisionshow: comercioprefix + '/permiso/show',
    wspermisionstore: comercioprefix + '/postPermisos',
    wspermisionactivar: comercioprefix + '/permiso/activar',
    wsgetpermisos: comercioprefix + '/getPermisos',

    wsfamiliaubicacion: comercioprefix +  '/familiaubicacion',
    wsfamiliaubicaciondel: comercioprefix + '/eliminacionubicacion',
    wsfamiliastore: comercioprefix + '/postFamilia',
    wsfamiliaanular: comercioprefix + '/anularFamilia',

    wsprodcaracteupdate: comercioprefix + '/producto_caracteristica/update',
    wsprodcaractestore: comercioprefix + '/producto_caracteristica/post',

    wsproductoreporte: comercioprefix + '/producto/reporte',

    wskardexproductoreporte: comercioprefix + '/kardexproducto/reporte',
    wskardexproducto_generar: comercioprefix + '/kardexproducto/generar_reporte',

    wsproductoreporte_generar: comercioprefix + '/producto/generar_reporte',
    wslibroventa_generar: comercioprefix + '/libroventa/generar_reporte',



    wstraspasoproducto: comercioprefix + '/traspaso_producto/index',
    wstraspasotipoget: comercioprefix + '/traspaso_producto/get_tipo_traspaso',
    wstraspasogetalmacen: comercioprefix + '/traspaso_producto/get_almacen',
    wstraspasovalidarcod: comercioprefix + '/traspaso_producto/validar_codigo',
    wstraspasogetalacemprod: comercioprefix + '/traspaso_producto/get_productos_almacenes',
    wstraspasogetstockalm: comercioprefix + '/traspaso_producto/get_stock_almacen',
    wstraspasostore: comercioprefix + '/traspaso_producto/store',
    wstraspasodestroy: comercioprefix + '/traspaso_producto/destroy',
    wstraspasoshow: comercioprefix + '/traspaso_producto/show',

    wsproveedorindex: comercioprefix + '/proveedor/index',
    wsproveedorcreate: comercioprefix + '/proveedor/create',
    wsproveedorstore: comercioprefix + '/proveedor/post',
    wsproveedorshow: comercioprefix + '/proveedor/show',
    wsproveedoredit: comercioprefix + '/proveedor/edit',
    wsproveedorupdate: comercioprefix + '/proveedor/update',
    wsproveedordel: comercioprefix + '/anularProveedor',

    wsciudad: comercioprefix + '/ciudad',
    
    wstipovehiculodel: comercioprefix + '/eliminartipovehiculo',
    wsvehiculocreate: comercioprefix + '/vehiculo/nuevo',
    wsvehiculostore: comercioprefix + '/vehiculo/post',
    wsvehiculoedit: comercioprefix + '/vehiculo/edit',
    wsvehiculoupdate: comercioprefix + '/vehiculo/update',
    wsvehiculoshow: comercioprefix + '/vehiculo/show',
    wsvehiculoanular: comercioprefix + '/vehiculo/anular',
    wsvehiculoreporte: comercioprefix + '/vehiculo/reporte',
    wsvehiculorepor: comercioprefix + '/vehiculoReporte',

    wsgettipovehiculo: comercioprefix + '/getTipoVehiculo',

    wsvehiculohistoriacreate: comercioprefix + '/vehiculo-historia/create',
    wsvehiculohistoriastore: comercioprefix + '/vehiculo-historia/post',
    wsvehiculohistoriaedit: comercioprefix + '/vehiculo-historia/edit',
    wsvehiculohistoriaupdate: comercioprefix + '/vehiculo-historia/update',
    wsvehiculohistoriaanular: comercioprefix + '/vehiculo-historia/anular',

    wsshowvehiculohistoria: comercioprefix + '/showVehiculoHistoria',

    wsmostrarcliente: comercioprefix + 'mostraCliente',

    wsclientereporte: comercioprefix + '/cliente/reporte',
    
    wscobrocreate: comercioprefix + '/cobro/create',

    wscomisionstore: comercioprefix + '/comision/post',
    wscomisionupdate: comercioprefix + '/comision/update',
    wscomisionactualizar: comercioprefix + '/comision/actualizar',

    wsfamiliaciudad: comercioprefix + '/familiaciudad',
    wseliminarciudad: comercioprefix + '/eliminarciudad',

    wsventareporte: comercioprefix + '/venta/reporte',
    wsventafactura: comercioprefix + '/venta/reporte_factura/create',

    wscomisionventadel: comercioprefix + '/comision/delete',

    wsventareporhistorico: comercioprefix + '/venta/reporte_historico_vehiculo',
    wsreporteporproducto: comercioprefix + '/venta/reporte_por_producto/create',
    wsgetcodigoproducto: comercioprefix + '/venta/get_codigo_producto',
    wsgetdescripcionproducto: comercioprefix + '/venta/get_descripcion_producto',

    wslog_reporte: comercioprefix + '/log_reporte',
    
    /*  Modulo Contable */

    wscuentaplan: contableprefix + '/cuenta_plan',
    wsbanco: contableprefix + '/banco',
    wsconfigeerr: contableprefix + '/config_eerr',
    wstipocentrocosto: contableprefix + '/tipo_costo',
    wscentrocosto: contableprefix + '/centro_de_costo',
    wsgestionperiodo: contableprefix + '/gestion_periodo',
    wslibromayor: contableprefix + '/libro_mayor',
    wsestadoresultado: contableprefix + '/estado_resultado',
    wscomprobante: contableprefix + '/comprobante',
    wscomprobantetipo: contableprefix + '/comprobantetipo',
    wslibrodiario: contableprefix + '/libro-diario/create',
    wsbalancegeneral: contableprefix + '/balance-general/create',
    wsconfigcontab: contableprefix + '/config',

    wscuenta_asien_autom: contableprefix + '/cuenta_asien_autom',
    wsplantilla_asien_autom: contableprefix + '/plantilla_asien_autom',

    /* Modulo Restaurant  */

    wsrestaurantventa: restaurantprefix + '/venta',

    Captcha: {
        skip_enable: false,
        site_key: '6LcBiK0UAAAAACwSPmJuGV02GLFwUltNiyJC8o3Y',
        secret_key: '6LcBiK0UAAAAACnv_zcsaYml8YlFscVeKFINv7Zf'
    }
};

export default ws;
