const keys = {
    home: 1,
    sistema_comercial: 2,

    taller: 3,

    vehiculo: 4,

    /* vehiculo index */
    vehiculo_btn_nuevo: 5,
    vehiculo_btn_ver: 19,
    vehiculo_btn_editar: 20,
    vehiculo_btn_eliminar: 21,

    /* vehiculo crear, ver, editar */
    //vehiculo_ver_nro: 10,
    //vehiculo_ver_fecha: 11,

    vehiculo_input_codigo: 6,
    vehiculo_input_placa: 7,
    vehiculo_input_chasis: 8,
    vehiculo_select_tipo: 9,
    vehiculo_btn_agregarCliente: 10,
    vehiculo_btn_verCliente: 11,
    vehiculo_select_search_codigoCliente: 12,
    vehiculo_select_search_nombreCliente: 13,
    vehiculo_select_vehiculo: 14,
    vehiculo_caracteristicas: 15,
    vehiculo_imagenes: 16,
    vehiculo_textarea_descripcion: 17,
    vehiculo_textarea_nota: 18,

    vehiculo_historia: 22,

    /* vehiculo historia index */
    vehiculo_historia_btn_nuevo: 23,
    vehiculo_historia_btn_ver: 35,
    vehiculo_historia_btn_editar: 36,
    vehiculo_historia_btn_eliminar: 37,

    /* vehiculo historia crear, ver, editar */
    //vehiculo_historia_ver_nro: 10,
    //vehiculo_historia_ver_fecha: 11,

    vehiculo_historia_select_search_codigoCliente: 24,
    vehiculo_historia_select_search_nombreCliente: 25,
    vehiculo_historia_select_placa: 26,
    vehiculo_historia_input_descripcion: 27,
    //falta el precio q aparece en venta 28
    vehiculo_historia_input_kmActual: 29,
    vehiculo_historia_input_kmProximo: 30,
    vehiculo_historia_fechaProxima: 31,
    vehiculo_historia_textarea_diagnostico: 32,
    vehiculo_historia_textarea_trabajo: 33,
    vehiculo_historia_textarea_nota: 34,

    vehiculo_parte: 38,

    /* vehiculo parte index*/
    vehiculo_parte_btn_nuevo: 39,
    vehiculo_parte_btn_editar: 42,
    vehiculo_parte_btn_eliminar: 43,

    /* vehiculo parte crear, editar */
    vehiculo_parte_input_descripcion: 40,
    vehiculo_parte_checkbox_editar: 41,

    /* PERMISOS vehiculo caracteristicas */
    vehcaracteristicas: 44,

    vehcaracteristicas_btn_nuevo: 45,
    vehcaracteristicas_input_nombre: 46,
    vehcaracteristicas_btn_editar: 47,
    vehcaracteristicas_btn_eliminar: 48,

    /* PERMISOS tipo vehiculo 73 74 --75 76 */
    tipovehiculo: 49,
    tipovehiculo_btn_nuevo: 50,

    taller_reportes: 51,
    taller_reportes_vehiculo: 52,

    almacen: 53,

    producto: 54,

    /* producto index */
    producto_btn_nuevo: 55,
    producto_btn_ver: 73,
    producto_btn_editar: 74,
    producto_btn_eliminar: 75,

    /* producto crear, ver, editar */
    producto_input_codigo: 56,
    producto_btn_agregarCodigos: 57,
    producto_select_tipo: 58,
    producto_select_moneda: 59,
    producto_input_descripcion: 60,
    producto_select_familia: 61,
    producto_select_unidadMedida: 62,
    producto_caracteristicas: 63,
    producto_imagenes: 64,
    producto_input_costo: 65,
    producto_btn_agregarCosto: 66,
    producto_input_precio: 67,
    producto_btn_agregarListaPrecio: 68,
    producto_stockAlmacen: 69,
    producto_totalStock: 70,
    producto_textarea_palabrasClaves: 71,
    producto_textarea_nota: 72,

    
    ingreso_producto: 76,

    /* ingreso producto index */
    
    ingreso_producto_btn_nuevo: 77,
    ingreso_producto_btn_ver: 86,
    ingreso_producto_btn_editar: 87,
    ingreso_producto_btn_eliminar: 88,

    /* ingreso producto crear, ver, editar */
    
    ingreso_producto_input_codigo: 78,
    ingreso_producto_select_tipo: 79,
    ingreso_producto_select_almacen: 80,
    ingreso_producto_fechaHora: 81,
    ingreso_producto_input_search_producto: 82,
    ingreso_producto_tabla_columna_almacen: 83,
    ingreso_producto_tabla_columna_cantidad: 84,
    ingreso_producto_textarea_nota: 85,
    

    salida_producto: 89,

    /* salida producto index */
    
    salida_producto_btn_nuevo: 90,
    salida_producto_btn_ver: 99,
    salida_producto_btn_editar: 100,
    salida_producto_btn_eliminar: 101,

    /* salida producto crear, ver, editar */
    
    salida_producto_input_codigo: 91,
    salida_producto_select_tipo: 92,
    salida_producto_select_almacen: 93,
    salida_producto_fechaHora: 94,
    salida_producto_input_search_producto: 95,
    salida_producto_tabla_columna_almacen: 96,
    salida_producto_tabla_columna_cantidad: 97,
    salida_producto_textarea_nota: 98,

    /* INVENTARIO CORTE */

    inventario_corte: 102,
    inventario_corte_btn_nuevo: 103,
    inventario_corte_btn_ver: 111,
    inventario_corte_btn_editar: 112,
    inventario_corte_btn_eliminar: 113,

    inventario_corte_fecha: 104,
    inventario_corte_select_almacen: 105,
    inventario_corte_textarea_descripcion: 106,
    inventario_corte_textarea_notas: 107,
    inventario_corte_btn_add_all: 108,
    inventario_corte_treselect_familia: 109,
    inventario_corte_search_producto: 110,

    lista_precio: 114,

    /* lista de precios index */
    lista_precio_btn_nuevo: 115,
    lista_precio_btn_ver: 129,
    lista_precio_btn_editar: 130,
    lista_precio_btn_eliminar: 131,

    /* lista de precios crear, ver, editar */
    //lista_precio_ver_nro: 14,
    //lista_precio_ver_fecha: 15,

    lista_precio_input_descripcion: 116,
    lista_precio_select_moneda: 117,
    lista_precio_input_valor: 118,
    lista_precio_select_fijoPorcentaje: 119,
    lista_precio_select_accion: 120,
    lista_precio_select_estado: 121,
    lista_precio_fechaInicio: 122,
    lista_precio_fechaFin: 123,
    lista_precio_btn_agregarTodos: 124,
    lista_precio_input_search_listaPrecios: 125,
    lista_precio_input_search_producto: 126,
    lista_precio_tabla_columna_precioModificar: 127,
    lista_precio_textarea_nota: 128,

    familia: 132,

    /* familia index */
    familia_btn_nuevo: 133,
   /* familia_btn_ver: 12,
    familia_btn_editar: 13,
    familia_btn_eliminar: 14,*/

    /* prod caracteristicas index 157 158 159 160 161 */
    prodcaracteristicas: 134,
    prodcaracteristicas_btn_nuevo: 135,
    prodcaracteristicas_btn_editar: 137,
    prodcaracteristicas_btn_eliminar: 138,
    prodcaracteristicas_input_descripcion: 136,
    
    /* traspasos index  162 al  173 */
    traspaso: 139,
    traspaso_btn_nuevo: 140,
    traspaso_btn_ver: 148,
    traspaso_btn_editar: 149,
    traspaso_btn_eliminar: 150,
    traspaso_input_codigo: 141,
    traspaso_select_tipo: 142,
    traspaso_fecha: 143,
    traspaso_sale_almacen: 144,
    traspaso_entra_almacen: 145,
    traspaso_textarea_notas: 146,
    traspaso_column_cantidad: 147,
    /* unidad de medida  index  174  al  179  */
    unidadmedida: 151,
    unidadmedida_btn_nuevo: 152,
    unidadmedida_btn_editar: 155,
    unidadmedida_btn_eliminar: 156,
    unidadmedida_input_nombre: 153,
    unidadmedida_input_abreviacion: 154,

    /* FALTAAA   tipo traspaso index   157  al  162  */
    tipotraspaso: 157,

    /** almacenes */
    almacenes: 163,  //index  197 al 204 
    almacenes_btn_nuevo: 164,
    almacenes_btn_editar: 169,
    almacenes_btn_eliminar: 170,
    almacenes_input_nombre: 165,
    almacenes_select_sucursal: 166,
    almacenes_input_direccion: 167,
    almacenes_textarea_notas: 168,

    /* ubicaciones  index  205 al 210 */
    ubicaciones: 171,
    ubicaciones_btn_nuevo: 172, 
    ubicaciones_select_almacen: 173, 
    ubicaciones_input_descripcion: 174, 
    ubicaciones_input_capacidad: 175, 
    ubicaciones_textarea_notas: 176, 

    /* reporte menu */
    almacen_reportes: 177,
    almacen_reportes_productos: 178,
    
    ventas: 179,

    cliente: 180,

    /* cliente index */
    cliente_btn_nuevo: 181,
    cliente_btn_ver: 195,
    cliente_btn_editar: 196,
    cliente_btn_eliminar: 197,

    /* cliente crear, ver, editar */
    //cliente_ver_nro: 12,
    //cliente_ver_fecha: 13,

    cliente_input_codigo: 182,
    cliente_select_tipoCliente: 183,
    cliente_select_tipoPersoneria: 184,
    cliente_fechaNacimiento: 185,
    cliente_input_nombre: 186,
    cliente_input_apellido: 187,
    cliente_input_nit: 188,
    cliente_select_genero: 189,
    cliente_select_ciudad: 190,
    cliente_caracteristicas: 191,
    cliente_imagenes: 192,
    cliente_textarea_contactos: 193,
    cliente_textarea_observaciones: 194,

    vendedor: 198,

    /* vendedor index */
    vendedor_btn_nuevo: 199,
    vendedor_btn_ver: 211,
    vendedor_btn_editar: 212,
    vendedor_btn_eliminar: 213,

    /* vendedor crear, ver, editar */
    //vendedor_ver_nro: 13,
    //vendedor_ver_fecha: 14,

    vendedor_input_codigo: 200,
    vendedor_select_comision: 201,
    vendedor_input_nit: 202,
    vendedor_fechaNacimiento: 203,
    vendedor_input_nombre: 204,
    vendedor_input_apellido: 205,
    vendedor_select_genero: 206,
    vendedor_select_estado: 207,
    vendedor_caracteristicas: 208,
    vendedor_imagenes: 209,
    vendedor_textarea_nota: 210,

    venta: 214,

    /* venta index */
    venta_btn_nuevo: 215,
    venta_btn_cargar_proforma: 253,
    /* falta reportehistoricovehiculo 295 */
    venta_btn_ver: 254,
    venta_btn_eliminar: 255,

    venta_input_codigo: 216,
    venta_fecha: 217,
    venta_select_sucursal: 218,
    venta_select_almacen: 219,
    venta_btn_agragarCliente: 220,
    venta_btn_verCliente: 221,
    venta_input_search_codigoCliente: 222,
    venta_input_search_nombreCliente: 223,
    venta_input_search_nitCliente: 224,
    venta_select_search_codigoVehiculo: 225,
    venta_select_search_placaVehiculo: 226,
    venta_input_descripcionVehiculo: 227,
    venta_btn_agragarVendedor: 228,
    venta_btn_verVendedor: 229,
    venta_input_search_codigoVendedor: 230,
    venta_input_search_nombreVendedor: 231,
    venta_input_comisionVendedor: 232,
    venta_select_search_listaPrecios: 233,
    venta_select_moneda: 234,
    venta_tabla_columna_codigoProducto: 235,
    venta_tabla_columna_producto: 236,
    venta_tabla_columna_cantidad: 237,
    venta_tabla_columna_listaPrecio: 238,
    venta_tabla_columna_precioUnitario: 239,
    venta_tabla_columna_descuento: 240,
    venta_input_subTotal: 241,
    venta_input_descuento: 242,
    venta_input_recargo: 243,
    venta_input_total: 244,
    venta_textarea_observaciones: 245,
    venta_btn_historialVehiculo: 246,
    venta_btn_partesVehiculo: 247,
    venta_input_anticipo: 248,
    venta_btn_VerPago: 249,
    venta_input_tipoPago: 250,
    venta_btn_contado: 251,
    venta_btn_credito: 252,    

    proforma: 256,

    /* proforma index */
    proforma_btn_nuevo: 257,
    proforma_btn_ver: 288,
    proforma_btn_eliminar: 289,

    proforma_input_codigo: 258,
    proforma_fecha: 259,
    proforma_select_sucursal: 260,
    proforma_select_almacen: 261,
    proforma_btn_agregarCliente: 262,
    proforma_btn_verCliente: 263,
    proforma_input_search_codigoCliente: 264,
    proforma_input_search_nombreCliente: 265,
    proforma_input_nitCliente: 266,
    proforma_select_search_codigoVehiculo: 267,
    proforma_select_search_placaVehiculo: 268,
    proforma_input_descripcionVehiculo: 269,
    proforma_btn_agragarVendedor: 270,
    proforma_btn_verVendedor: 271,
    proforma_input_search_codigoVendedor: 272,
    proforma_input_search_nombreVendedor: 273,
    proforma_input_comisionVendedor: 274,
    proforma_select_search_listaPrecios: 275,
    proforma_select_moneda: 276,
    proforma_tabla_columna_codigoProducto: 277,
    proforma_tabla_columna_producto: 278,
    proforma_tabla_columna_cantidad: 279,
    proforma_tabla_columna_listaPrecio: 280,
    proforma_tabla_columna_precioUnitario: 281,
    proforma_tabla_columna_descuento: 282,
    proforma_input_subTotal: 283,
    proforma_input_descuento: 284,
    proforma_input_recargo: 285,
    proforma_input_total: 286,
    proforma_textarea_observaciones: 287,    

    cobranza: 290,

    /* cobranza index */
    cobranza_btn_nuevo: 291,
	cobranza_search_cliente: 303,
    cobranza_btn_ver: 304,
    cobranza_btn_eliminar: 305,

    /* cobranza crear, ver, editar */
    //cobranza_ver_nro: 16,
    cobranza_input_codigo: 292,
    cobranza_input_search_codigoVenta: 293,
    cobranza_fecha: 294,
    cobranza_input_codigoCliente: 295,
    cobranza_input_nombreCliente: 296,
    cobranza_textarea_nota: 297,
    cobranza_input_totalVenta: 298,
    cobranza_input_pagosAcumulados: 299,
    cobranza_input_saldo: 300,
    cobranza_input_cuotasPagar: 301,
    cobranza_input_totalPagar: 302,
    //cobranza_tabla_columna_saldo: 28,

    comision: 306,

    /* comision index */
    comision_btn_nuevo: 307,
    comision_btn_editar: 311,
    comision_btn_eliminar: 312,

    comision_input_descripcion: 308,
    comision_input_porcentaje: 309,
    cobranza_select_tipo: 310,

    /* tipo cliente 354 al 358 */
    tipocliente: 313,
    tipocliente_btn_nuevo: 314,
    tipocliente_input_descripcion: 315,
    tipocliente_btn_editar: 316,
    tipocliente_btn_eliminar: 317,

    /* flia ciudad  */
    famciudad: 318,
    famciudad_btn_nuevo: 319,
	
	
    /* VENTA REPORTES 320 al 328 */
	ventas_reportes: 320,
    ventas_reportes_ventas: 321,
    ventas_reportes_ventas_detallado: 322,
    ventas_reportes_cuentas_por_cobrar: 323,
    ventas_reportes_cobros_realizados: 324,
    ventas_reportes_ventas_historico_veh: 325,
    ventas_reportes_clientes: 326,
    ventas_reportes_comision_vend: 327,
    ventas_reportes_ventas_producto: 328,
    
    compras: 329,

    proveedor: 330,

    /* proveedor index */
    proveedor_btn_nuevo: 331,
    proveedor_btn_ver: 342,
    proveedor_btn_editar: 343,
    proveedor_btn_eliminar: 344,

    /* proveedor crear, ver, editar */
    //proveedor_ver_nro: 13,
    //proveedor_ver_fecha: 14,

    proveedor_input_codigo: 332,
    proveedor_input_nombre: 333,
    proveedor_input_apellido: 334,
    proveedor_input_nit: 335,
    proveedor_select_ciudad: 336,
    proveedor_select_estado: 337,
    proveedor_caracteristicas: 338,
    proveedor_imagenes: 339,
    proveedor_textarea_descripcion: 340,
    proveedor_textarea_nota: 341,

    compra: 345,  

    /* compra index */
    compra_btn_nuevo: 346,
    compra_btn_ver: 367,
    compra_btn_eliminar: 368,

    /* compra crear, ver, editar */
    //compra_ver_nro: 14,
    //compra_ver_fecha: 15,
    compra_input_codigo: 347,
    compra_select_sucursal: 348,
    compra_select_almacen: 349,
    compra_select_moneda: 350,
    compra_btn_agregarProveedor: 351,
    compra_btn_verProveedor: 352,
    compra_input_search_codigoProveedor: 353,
    compra_input_search_nombreProveedor: 354,
    compra_input_nitProveedor: 355,
    compra_select_planPago: 356,
    compra_fecha: 357,
    compra_hora: 358,
    compra_tabla_columna_codigoProducto: 359,
    compra_tabla_columna_producto: 360,
    compra_tabla_columna_cantidad: 361,
    compra_tabla_columna_costoUnitario: 362,
    compra_input_total: 363,
    compra_textarea_nota: 364,  
    compra_input_anticipo: 365,
    compra_btn_VerPago: 366, 

    pago: 369,

    /* pago index */
    pago_btn_nuevo: 370,
    pago_btn_ver: 383,
    pago_btn_eliminar: 384,

    pago_input_codigo: 371,
    pago_input_search_codigoCompra: 372,
    pago_fecha: 373,
    pago_input_codigoProveedor: 374,
    pago_input_nombreProveedor: 375,
    pago_input_totalCompra: 376,
    pago_input_acumulados: 377,
    pago_input_saldo: 378,
    pago_textarea_nota: 379,
    pago_input_cuotasPagar: 380,
    pago_input_totalPagar: 381,
    pago_search_proveedor: 382,

    /**  Contabilidad  */
    sistema_contabilidad: 385,
    
    plan_cuentas: 386,
    plan_cuentas_btn_imprimir_pdf: 387,
    plan_cuentas_btn_export_excel: 388,
    plan_cuentas_btn_importar: 389,
    plan_cuentas_btn_por_defecto: 390,
    plan_cuentas_btn_vaciar: 391,

    comprobante: 392,
    comprobante_btn_nuevo: 393,
    comprobante_btn_ver: 394,
    comprobante_btn_editar: 395,
    comprobante_btn_eliminar: 396,

    libro_diario: 397,

    libro_mayor: 398,

    estado_resultados: 399,

    balance_general: 400,

    configuraciones_contab: 401,

    tipo_comprobante: 402,
    tipo_comprobante_btn_nuevo: 403,
    tipo_comprobante_btn_ver: 404,
    tipo_comprobante_btn_editar: 405,
    tipo_comprobante_btn_eliminar: 406,

    tipo_centro_costo: 407,
    tipo_centro_costo_bnt_nuevo: 408,
    tipo_centro_costo_bnt_ver: 409,
    tipo_centro_costo_bnt_editar: 410,
    tipo_centro_costo_bnt_eliminar: 411,

    centro_costo: 412,
    centro_costo_btn_nuevo: 413,

    banco: 414,
    banco_btn_nuevo: 415,

    gestion_periodo: 416,
    gestion_periodo_btn_add_gestion: 417,
    gestion_periodo_btn_add_periodo: 418,
    gestion_periodo_btn_editar_gestion: 419,
    gestion_periodo_btn_editar_periodo: 420,
    gestion_periodo_btn_eliminar_gestion: 421,
    gestion_periodo_btn_eliminar_periodo: 422,
    gestion_periodo_btn_imprimir: 423,

	 /* NUEVO MENU CONFIGURACION : 424,  */
    menu_configuracion: 424,
	    /* tipo moneda index   */
    tipomoneda: 425,
    tipomoneda_btn_nuevo: 426,
    tipomoneda_btn_editar: 427,
    tipomoneda_btn_eliminar: 428,
	
	    /* sucursales  index   */
    sucursales: 429,
    sucursales_btn_nuevo: 430,
	 /* HABILITAR  sucursales_btn_ver: 431, */
    sucursales_btn_editar: 432,
    sucursales_btn_eliminar: 433,
	
	/* HABILITAR estos seed/key nuevos */
    facturacion: 434,
    facturacion_actividad_economica: 435,
    facturacion_actividad_economica_btn_nuevo: 436,
    facturacion_actividad_economica_btn_editar: 437,
    facturacion_actividad_economica_btn_eliminar: 438,

    facturacion_certificacion_sin: 439,
    facturacion_certificacion_sin_bnt_nuevo: 440,

    facturacion_dosificacion: 442,
    facturacion_dosificacion_sin_bnt_nuevo: 443,
    facturacion_dosificacion_sin_bnt_ver: 444,
    facturacion_dosificacion_sin_bnt_editar: 445,

    /*
	actividad economica: 435,
	nuevo: 436,
	editar: 437,
	eliminar: 438,
	certificacion sin: 439,
	nuevo: 440,
	generar codigo: 441,
	dosificacion: 442,
	nuevo: 443,
	ver: 444,
	editar: 445,
	*/
	
	seguridad: 446,

    usuario: 447,

    /* usuario index */
    usuario_btn_nuevo: 448,
	usuario_btn_ver: 458,
    usuario_btn_editar: 459,    
    usuario_btn_eliminar: 460,

    /* usuario crear, ver, editar */
    //usuario_ver_nro: 10,
    //usuario_ver_fecha: 10,

    usuario_input_nombre: 449,
    usuario_input_apellido: 450,
    usuario_select_genero: 451,
    usuario_image: 452,
    usuario_input_correo: 453,
    usuario_input_telefono: 454,
    usuario_input_usuario: 455,
    usuario_input_password: 456,
    usuario_textarea_nota: 457,

    grupo_usuario: 461,

    /* grupo-usuario index */
    grupo_usuario_btn_nuevo: 462,
    grupo_usuario_input_nombre: 463,
    grupo_usuario_textarea_nota: 464,
    //grupo_usuario_btn_ver: 10,
    grupo_usuario_btn_editar: 465,
    grupo_usuario_btn_eliminar: 466,

    /* grupo-usuario crear, ver editar */
    //grupo_usuario_ver_nro: 10,
    //grupo_usuario_ver_fecha: 10,

    activar_permiso: 467,
    asignar_privilegio: 468,
     /* AGREGAR LO SGTE
	  usuarios conectado: 469;
	  log: 470;
	 */

    restaurante: 471,

    config_eerr: 472,
    config_eerr_btn_nuevo: 473,
    config_eerr_btn_editar: 474,
    config_eerr_btn_eliminar: 475,

    config_eerr_input_codigoaccion: 476,
    config_eerr_input_operacion: 477,
    config_eerr_input_formula: 478,
    config_eerr_input_valorporcentual: 479,
    config_eerr_input_descripcion: 480,
    config_eerr_input_plandecuenta: 481,

    /* asignar_privilegio */
    //asignar_privilegio_input_idGrupo: 10,
    //asignar_privilegio_input_grupoNombre: 10



	
}

export default keys;
