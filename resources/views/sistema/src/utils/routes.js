
const comercioprefix = '/commerce1';
const contableprefix = '/contable';
const restaurantprefix = '/restaurant';


const routes = {
    home : comercioprefix + '/home',
    login : '/login',
    inicio: '/login',

    pruebafact:'/pruebafact',

    config_inicial: '/configuraciones',

    producto_index: comercioprefix + '/producto',
    producto_create: comercioprefix + '/producto/create',
    producto_edit: comercioprefix + '/producto/edit',
    producto_reporte: comercioprefix + '/producto/reporte',
    producto_reporte_generar: comercioprefix + '/producto/generar',
    
    root_access: comercioprefix + '/entrada-secreta',
    inventario_index: comercioprefix + '/inventario-corte/index',
    inventario_create: comercioprefix + '/inventario-corte/create',
    inventario_edit: comercioprefix + '/inventario-corte/edit',

    tipo_cliente: comercioprefix + '/tipocliente/index',
    unidad_medida: comercioprefix + '/unidad_medida/index',
    tipo_moneda: comercioprefix + '/tipo_moneda/index',
    tipo_traspaso: comercioprefix + '/tipo_traspaso/index',
    tipo_cambio: comercioprefix + '/tipo_cambio',


    sucursal_index: comercioprefix + '/sucursal/index',
    sucursal_create: comercioprefix + '/sucursal/create',
    sucursal_show: comercioprefix + '/sucursal/show',
    sucursal_edit: comercioprefix + '/sucursal/edit',

    almacenes: comercioprefix + '/almacenes/index',
    familia_vehiculo: comercioprefix + '/familia_vehiculo/index',
    familia_ciudad: comercioprefix + '/familia_ciudad/index',
    familia_almacen_ubicacion: comercioprefix + '/almacen_ubicacion/index',

    usuario_index: comercioprefix + '/usuario/index',
    usuario_create: comercioprefix + '/usuario/create',
    usuario_edit: comercioprefix + '/usuario/edit',
    usuario_show: comercioprefix + '/usuario/show',

    grupo_usuario_index: comercioprefix + '/grupo-usuario/index',
    grupo_usuario_create: comercioprefix + '/grupo-usuario/create',
    grupo_usuario_edit: comercioprefix + '/grupo-usuario/edit',
    grupo_usuario_show: comercioprefix + '/grupo-usuario/show',

    usuarios_online: comercioprefix + '/usuarios-conectados',
    usuario_perfil: comercioprefix + '/perfil',

    asignar_privilegio: comercioprefix + '/asignar-privilegio',
    asignar_permiso: comercioprefix + '/asignar_permiso',
    activar_permiso: comercioprefix + '/activar_permiso',

    log_sistema: comercioprefix + '/log_del_sistema',

    vehiculo_index: comercioprefix + '/vehiculo/index',
    vehiculo_create: comercioprefix + '/vehiculo/create',
    vehiculo_edit: comercioprefix + '/vehiculo/edit',
    vehiculo_reporte: comercioprefix + '/vehiculo/reporte',
    vehiculo_reporte_generar: comercioprefix + '/vehiculo/generar',

    vehiculo_parte: comercioprefix + '/vehiculo-parte/index',
    vehiculo_historia: comercioprefix + '/vehiculo-historia/index',
    vehiculo_historia_create: comercioprefix + '/vehiculo-historia/create',
    vehiculo_historia_edit: comercioprefix + '/vehiculo-historia/edit',

    vehiculo_caracteristica: comercioprefix + '/vehiculo-caracteristica/index',

    ingreso_producto_index: comercioprefix + '/ingreso-producto/index',
    ingreso_producto_create: comercioprefix + '/ingreso-producto/create',
    ingreso_producto_edit: comercioprefix + '/ingreso-producto/edit',

    salida_producto_index: comercioprefix + '/salida-producto/index',
    salida_producto_create: comercioprefix + '/salida-producto/create',
    salida_producto_edit: comercioprefix + '/salida-producto/edit',

    lista_precios_index: comercioprefix + '/lista-precios/index',
    lista_precios_create: comercioprefix + '/lista-precios/create',
    lista_precios_edit: comercioprefix + '/lista-precios/edit',

    familia_producto: comercioprefix + '/familia-producto',

    producto_caracteristica: comercioprefix + '/producto-caracteristica/index',

    traspaso_producto_index: comercioprefix + '/traspaso-producto/index',
    traspaso_producto_create: comercioprefix + '/traspaso-producto/create',
    traspaso_producto_show: comercioprefix + '/traspaso-producto/show',

    proveedor_index: comercioprefix + '/proveedor/index',
    proveedor_create: comercioprefix + '/proveedor/create',
    proveedor_edit: comercioprefix + '/proveedor/edit',

    compra_index: comercioprefix + '/compra/index',
    compra_create: comercioprefix + '/compra/create',
    compra_show: comercioprefix + '/compra/show',

    pago_index: comercioprefix + '/pago/index',
    pago_create: comercioprefix + '/pago/create',
    pago_show: comercioprefix + '/pago/show',

    cliente_index: comercioprefix + '/cliente/index',
    cliente_create: comercioprefix + '/cliente/create',
    cliente_edit: comercioprefix + '/cliente/edit',
    cliente_reporte: comercioprefix + '/cliente/reporte',
    cliente_reporte_generar: comercioprefix + '/cliente/generar',

    vendedor_index: comercioprefix + '/vendedor/index',
    vendedor_create: comercioprefix + '/vendedor/create',
    vendedor_edit: comercioprefix + '/vendedor/edit',

    venta_index: comercioprefix + '/venta/index',
    venta_create: comercioprefix + '/venta/create',
    venta_show: comercioprefix + '/venta/show',

    entregaproducto: comercioprefix + '/entrega_producto',

    venta_vehiculoparte: comercioprefix + '/venta/vehiculo_parte/create',
    venta_vehiculohistoria: comercioprefix + '/venta/vehiculo_historia/create',
    venta_proforma: comercioprefix + '/venta/proforma',

    compra_reporte: comercioprefix + '/compra/reporte',
    compra_detalle_reporte: comercioprefix + '/compra_detalle/reporte',
    compra_cuentaporpagar_reporte: comercioprefix + '/compra_cuentaporpagar/reporte',
    compra_pagorealizado_reporte: comercioprefix + '/compra_pagorealizado/reporte',
    compra_proveedor_reporte: comercioprefix + '/compra_proveedor/reporte',

    venta_reporte: comercioprefix + '/venta/reporte',
    venta_reporte_por_cobrar: comercioprefix + '/reporte-por-cobrar',
    venta_reporte_por_cobros: comercioprefix + '/reporte-de-cobros',
    venta_reporte_detallado: comercioprefix + '/reporte-detallado',
    venta_reporte_historico_vehiculo: comercioprefix + '/reporte-historico-vehiculo',

    proforma_index: comercioprefix + '/proforma/index',
    proforma_create: comercioprefix + '/proforma/create',
    proforma_show: comercioprefix + '/proforma/show',

    cobranza_index: comercioprefix + '/cobranza/index',
    cobranza_create: comercioprefix + '/cobranza/create',
    cobranza_show: comercioprefix + '/cobranza/show',
    cobranza_recibo: comercioprefix + '/cobranza/recibo',

    comision_index: comercioprefix + '/comision/index',
    comision_create: comercioprefix + '/comision/create',
    comision_edit: comercioprefix + '/comision/edit',

    actividad_economica: comercioprefix + '/actividad_economica' ,
    dosificacion: comercioprefix + '/dosificacion' ,
    certificacion_sin: comercioprefix + '/certificacion_sin' ,

    reporte_vehiculo: comercioprefix + '/reporte/vehiculo',
    reporte_producto: comercioprefix + '/reporte/producto',
    reporte_kardexproducto: comercioprefix + '/reporte/kardexproducto',

    reporte_venta: comercioprefix + '/reporte/venta',
    reporte_compra: comercioprefix + '/reporte/compra',

    reporte_venta_detalle: comercioprefix + '/reporte/venta-detalle',
    reporte_venta_por_cobrar: comercioprefix + '/reporte/venta-por-cobrar',
    reporte_venta_cobro: comercioprefix + '/reporte/venta-cobro',
    reporte_venta_historico_vehiculo: comercioprefix + '/reporte/venta-historico-vehiculo',
    reporte_cliente: comercioprefix + '/reporte/cliente',
    reporte_comision_vendedor: comercioprefix + '/reporte/comision-vendedor',

    reporte_venta_factura_all: comercioprefix + '/reporte/venta_factura',
    reporte_librodeventa: comercioprefix + '/reporte/libroventa',

    reporte_log_sistema: comercioprefix + '/log_del_sistema/generar',

    reporte_venta_recibo: comercioprefix + '/venta/recibo',
    reporte_venta_factura: comercioprefix + '/venta/factura',

    reporte_compra_recibo: comercioprefix + '/compra/recibo',

    reporte_compra_generar: comercioprefix + '/compra/generar',
    reporte_compra_detalle_generar: comercioprefix + '/compra_detalle/generar',
    reporte_cuentaporpagar_generar: comercioprefix + '/cuentaporpagar/generar',
    reporte_pagorealizado_generar: comercioprefix + '/pagorealizado/generar',
    reporte_proveedor_generar: comercioprefix + '/proveedor/generar',
    
    reporte_proforma_recibo: comercioprefix + '/proforma/recibo',

    reporte_venta_generar: comercioprefix + '/venta/generar',
    reporte_venta_detallado: comercioprefix + '/venta_detalle/generar',
    reporte_venta_historico_generar: comercioprefix + '/venta_historico_vehiculo/generar',
    reporte_venta_por_cobrar_generar: comercioprefix + '/generar-reporte-por-cobrar',
    reporte_venta_por_cobros_generar: comercioprefix + '/generar-reporte-por-cobros',
    reporte_comision_vendedor_generar: comercioprefix + '/comision_por_vendedor/generar',
    reporte_venta_por_producto: comercioprefix + '/reporte/venta_por_producto',
    reporte_venta_por_producto_generar: comercioprefix + '/venta_por_producto/generar',
    reporte_venta_factura_generar: comercioprefix + '/venta_factura/generar',


    /* Modulo Restaurant */

    restaurant_venta_index: restaurantprefix + '/gestion_venta/index',
    restaurant_venta_create: restaurantprefix + '/gestion_venta/create',

    /* Fin modulo Restaurant */ 
    /* Modulo Contable */
    cuentaplan: contableprefix + '/plan_de_cuenta',
    gestion_periodo: contableprefix + '/gestion_periodo',
    libro_mayor: contableprefix + '/libro_mayor',
    estado_resultado: contableprefix + '/estado_resultado',

    
    gestion_periodo_create_periodo: contableprefix + '/gestion_periodo/periodo/create',
    gestion_periodo_editar_periodo: contableprefix + '/gestion_periodo/periodo/editar',
    gestion_periodo_index: contableprefix + '/gestion_periodo/index',
    gestion_periodo_create: contableprefix + '/gestion_periodo/gestion/create',
    gestion_periodo_editar: contableprefix + '/gestion_periodo/gestion/editar',

    cuenta_asien_autom: contableprefix + '/cuenta_asien_autom',
    plantilla_asien_autom: contableprefix + '/plantilla_asien_autom',

    plan_de_cuenta_index: contableprefix + '/plan_de_cuenta/index',
    comprobante_index: contableprefix + '/comprobante/index',
    comprobante_create: contableprefix + '/comprobante/create',
    comprobante_edit: contableprefix + '/comprobante/edit',
    comprobante_show: contableprefix + '/comprobante/show',
    comprobante_imprimir: contableprefix + '/comprobante/imprimir',

    comprobantetipo_index: contableprefix + '/comprobantetipo/index',
    comprobantetipo_create: contableprefix + '/comprobantetipo/create',
    comprobantetipo_edit: contableprefix + '/comprobantetipo/edit',
    comprobantetipo_show: contableprefix + '/comprobantetipo/show',

    libro_mayor_index: contableprefix + '/libro_mayor/index',
    libro_diario_index: contableprefix + '/libro-diario/index',
    balance_general_index: contableprefix + '/balance-general/index',

    estado_resultado_index: contableprefix + '/estado_resultado/index',

    banco_index: contableprefix + '/banco/index',
    tipocentrocosto_index: contableprefix + '/tipo_costo/index',
    centrodecosto_index: contableprefix + '/centro_de_costo/index',
    
    configeerr_index: contableprefix + '/config_eerr/index',
    configeerr_create: contableprefix + '/config_eerr/create',
    configeerr_edit: contableprefix + '/config_eerr/edit',

    reporte_libro_diario_generar: contableprefix + '/libro-diario/reporte',
    reporte_balance_general_generar: contableprefix + '/balance-general/reporte'
    
    /* Fin Modulo Contable */
}

export default routes;
