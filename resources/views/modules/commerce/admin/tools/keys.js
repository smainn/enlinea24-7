const keys = {
    home: 1,
    seguridad: 2,

    usuario: 3,

    /* usuario index */
    usuario_btn_nuevo: 4,
    usuario_btn_editar: 14,
    usuario_btn_ver: 15,    
    usuario_btn_eliminar: 16,

    /* usuario crear, ver, editar */
    //usuario_ver_nro: 10,
    //usuario_ver_fecha: 10,

    usuario_input_nombre: 5,
    usuario_input_apellido: 6,
    usuario_select_genero: 7,
    usuario_image: 8,
    usuario_input_correo: 9,
    usuario_input_telefono: 10,
    usuario_input_usuario: 11,
    usuario_input_password: 12,
    usuario_textarea_nota: 13,

    grupo_usuario: 17,

    /* grupo-usuario index */
    grupo_usuario_btn_nuevo: 18,
    grupo_usuario_input_nombre: 19,
    grupo_usuario_textarea_nota: 20,
    //grupo_usuario_btn_ver: 10,
    grupo_usuario_btn_editar: 21,
    grupo_usuario_btn_eliminar: 22,

    /* grupo-usuario crear, ver editar */
    //grupo_usuario_ver_nro: 10,
    //grupo_usuario_ver_fecha: 10,

    activar_permiso: 23,
    asignar_privilegio: 24,

    /* asignar_privilegio */
    //asignar_privilegio_input_idGrupo: 10,
    //asignar_privilegio_input_grupoNombre: 10


    sistema_comercial: 25,

    taller: 26,

    vehiculo: 27,

    /* vehiculo index */
    vehiculo_btn_reporte: 28,
    vehiculo_btn_nuevo: 29,
    vehiculo_btn_ver: 43,
    vehiculo_btn_editar: 44,
    vehiculo_btn_eliminar: 45,

    /* vehiculo crear, ver, editar */
    //vehiculo_ver_nro: 10,
    //vehiculo_ver_fecha: 11,

    vehiculo_input_codigo: 30,
    vehiculo_input_placa: 31,
    vehiculo_input_chasis: 32,
    vehiculo_select_tipo: 33,
    vehiculo_btn_agregarCliente: 34,
    vehiculo_btn_verCliente: 35,
    vehiculo_select_search_codigoCliente: 36,
    vehiculo_select_search_nombreCliente: 37,
    vehiculo_select_vehiculo: 38,
    vehiculo_caracteristicas: 39,
    vehiculo_imagenes: 40,
    vehiculo_textarea_descripcion: 41,
    vehiculo_textarea_nota: 42,

    vehiculo_historia: 46,

    /* vehiculo historia index */
    vehiculo_historia_btn_nuevo: 47,
    vehiculo_historia_btn_ver: 59,
    vehiculo_historia_btn_editar: 60,
    vehiculo_historia_btn_eliminar: 61,

    /* vehiculo historia crear, ver, editar */
    //vehiculo_historia_ver_nro: 10,
    //vehiculo_historia_ver_fecha: 11,

    vehiculo_historia_select_search_codigoCliente: 48,
    vehiculo_historia_select_search_nombreCliente: 49,
    vehiculo_historia_select_placa: 50,
    vehiculo_historia_input_descripcion: 51,
    //falta el precio q aparece en venta 52
    vehiculo_historia_input_kmActual: 53,
    vehiculo_historia_input_kmProximo: 54,
    vehiculo_historia_fechaProxima: 55,
    vehiculo_historia_textarea_diagnostico: 56,
    vehiculo_historia_textarea_trabajo: 57,
    vehiculo_historia_textarea_nota: 58,

    vehiculo_parte: 62,

    /* vehiculo parte index*/
    vehiculo_parte_btn_nuevo: 63,
    vehiculo_parte_btn_editar: 66,
    vehiculo_parte_btn_eliminar: 67,

    /* vehiculo parte crear, editar */
    vehiculo_parte_input_descripcion: 64,
    vehiculo_parte_checkbox_editar: 65,

    /* PERMISOS vehiculo caracteristicas */
    vehcaracteristicas: 68,

    vehcaracteristicas_btn_nuevo: 69,
    vehcaracteristicas_input_nombre: 70,
    vehcaracteristicas_btn_editar: 71,
    vehcaracteristicas_btn_eliminar: 72,

    /* PERMISOS tipo vehiculo 73 74 --75 76 */
    tipovehiculo: 73,
    tipovehiculo_btn_nuevo: 74,

    taller_reportes: 75,
    taller_reportes_vehiculo: 76,

    almacen: 77,

    producto: 78,

    /* producto index */
    producto_btn_reporte: 79,
    producto_btn_nuevo: 80,
    producto_btn_ver: 98,
    producto_btn_editar: 99,
    producto_btn_eliminar: 100,

    /* producto crear, ver, editar */
    producto_input_codigo: 81,
    producto_btn_agregarCodigos: 82,
    producto_select_tipo: 83,
    producto_select_moneda: 84,
    producto_input_descripcion: 85,
    producto_select_familia: 86,
    producto_select_unidadMedida: 87,
    producto_caracteristicas: 88,
    producto_imagenes: 89,
    producto_input_costo: 90,
    producto_btn_agregarCosto: 91,
    producto_input_precio: 92,
    producto_btn_agregarListaPrecio: 93,
    producto_stockAlmacen: 94,
    producto_totalStock: 95,
    producto_textarea_palabrasClaves: 96,
    producto_textarea_nota: 97,

    
    ingreso_producto: 101,

    /* ingreso producto index */
    
    ingreso_producto_btn_nuevo: 102,
    ingreso_producto_btn_ver: 110,
    ingreso_producto_btn_editar: 111,
    ingreso_producto_btn_eliminar: 112,

    /* ingreso producto crear, ver, editar */
    
    ingreso_producto_input_codigo: 103,
    ingreso_producto_select_tipo: 104,
    ingreso_producto_select_almacen: 105,
    ingreso_producto_fechaHora: 106,
    ingreso_producto_input_search_producto: 107,
    ingreso_producto_tabla_columna_almacen: 108,
    ingreso_producto_tabla_columna_cantidad: 109,
    ingreso_producto_textarea_nota: 423,
    

    salida_producto: 113,

    /* salida producto index */
    
    salida_producto_btn_nuevo: 114,
    salida_producto_btn_ver: 122,
    salida_producto_btn_editar: 123,
    salida_producto_btn_eliminar: 124,

    /* salida producto crear, ver, editar */
    
    salida_producto_input_codigo: 115,
    salida_producto_select_tipo: 116,
    salida_producto_select_almacen: 117,
    salida_producto_fechaHora: 118,
    salida_producto_input_search_producto: 119,
    salida_producto_tabla_columna_almacen: 120,
    salida_producto_tabla_columna_cantidad: 121,
    salida_producto_textarea_nota: 424,

    /* INVENTARIO CORTE */

    inventario_corte: 125,
    inventario_corte_btn_nuevo: 126,
    inventario_corte_btn_ver: 134,
    inventario_corte_btn_editar: 135,
    inventario_corte_btn_eliminar: 136,

    inventario_corte_fecha: 127,
    inventario_corte_select_almacen: 128,
    inventario_corte_textarea_descripcion: 129,
    inventario_corte_textarea_notas: 130,
    inventario_corte_btn_add_all: 131,
    inventario_corte_treselect_familia: 132,
    inventario_corte_search_producto: 133,

    lista_precio: 137,

    /* lista de precios index */
    lista_precio_btn_nuevo: 138,
    lista_precio_btn_ver: 152,
    lista_precio_btn_editar: 153,
    lista_precio_btn_eliminar: 154,

    /* lista de precios crear, ver, editar */
    //lista_precio_ver_nro: 14,
    //lista_precio_ver_fecha: 15,

    lista_precio_input_descripcion: 139,
    lista_precio_select_moneda: 140,
    lista_precio_input_valor: 141,
    lista_precio_select_fijoPorcentaje: 142,
    lista_precio_select_accion: 143,
    lista_precio_select_estado: 144,
    lista_precio_fechaInicio: 145,
    lista_precio_fechaFin: 146,
    lista_precio_btn_agregarTodos: 147,
    lista_precio_input_search_listaPrecios: 148,
    lista_precio_input_search_producto: 149,
    lista_precio_tabla_columna_precioModificar: 150,
    lista_precio_textarea_nota: 151,

    familia: 155,

    /* familia index */
    familia_btn_nuevo: 156,
   /* familia_btn_ver: 12,
    familia_btn_editar: 13,
    familia_btn_eliminar: 14,*/

    /* prod caracteristicas index 157 158 159 160 161 */
    prodcaracteristicas: 157,
    prodcaracteristicas_btn_nuevo: 158,
    prodcaracteristicas_btn_editar: 160,
    prodcaracteristicas_btn_eliminar: 161,
    prodcaracteristicas_input_descripcion: 159,
    
    /* traspasos index  162 al  173 */
    traspaso: 162,
    traspaso_btn_nuevo: 163,
    traspaso_btn_ver: 171,
    traspaso_btn_editar: 172,
    traspaso_btn_eliminar: 173,
    traspaso_input_codigo: 164,
    traspaso_select_tipo: 165,
    traspaso_fecha: 166,
    traspaso_sale_almacen: 167,
    traspaso_entra_almacen: 168,
    traspaso_textarea_notas: 169,
    traspaso_column_cantidad: 170,
    /* unidad de medida  index  174  al  179  */
    unidadmedida: 174,
    unidadmedida_btn_nuevo: 175,
    unidadmedida_btn_editar: 178,
    unidadmedida_btn_eliminar: 179,
    unidadmedida_input_nombre: 176,
    unidadmedida_input_abreviacion: 177,
   
    /* tipo moneda index  180  al  185  */
    tipomoneda: 180,
    tipomoneda_btn_nuevo: 181,
    tipomoneda_btn_editar: 184,
    tipomoneda_btn_eliminar: 185,
    tipomoneda_input_nombre: 182,
    tipomoneda_input_tipocambio: 183,

    /* tipo traspaso index   186  al  190  */
    tipotraspaso: 186,
    
    /* sucursales  index  191 al 196 */
    sucursales: 191,
    sucursales_btn_nuevo: 192,
    sucursales_btn_editar: 195,
    sucursales_btn_eliminar: 196,
    sucursales_input_nombre: 193,
    sucursales_input_direccion: 194,

    /** almacenes */
    almacenes: 197,  //index  197 al 204 
    almacenes_btn_nuevo: 198,
    almacenes_btn_editar: 203,
    almacenes_btn_eliminar: 203,
    almacenes_input_nombre: 199,
    almacenes_select_sucursal: 200,
    almacenes_input_direccion: 201,
    almacenes_textarea_notas: 202,

    /* ubicaciones  index  205 al 210 */
    ubicaciones: 205,
    ubicaciones_btn_nuevo: 206, 
    ubicaciones_select_almacen: 207, 
    ubicaciones_input_descripcion: 208, 
    ubicaciones_input_capacidad: 209, 
    ubicaciones_textarea_notas: 210, 

    /* reporte menu 211 rep prod 212 */
    almacen_reportes: 211,
    almacen_reportes_productos: 212,
    
    ventas: 213,

    cliente: 214,

    /* cliente index */
    cliente_btn_reporte: 215,
    cliente_btn_nuevo: 216,
    cliente_btn_ver: 230,
    cliente_btn_editar: 231,
    cliente_btn_eliminar: 232,

    /* cliente crear, ver, editar */
    //cliente_ver_nro: 12,
    //cliente_ver_fecha: 13,

    cliente_input_codigo: 217,
    cliente_select_tipoCliente: 218,
    cliente_select_tipoPersoneria: 219,
    cliente_fechaNacimiento: 220,
    cliente_input_nombre: 221,
    cliente_input_apellido: 222,
    cliente_input_nit: 223,
    cliente_select_genero: 224,
    cliente_select_ciudad: 225,
    cliente_caracteristicas: 226,
    cliente_imagenes: 227,
    cliente_textarea_contactos: 228,
    cliente_textarea_observaciones: 229,

    vendedor: 233,

    /* vendedor index */
    vendedor_btn_nuevo: 234,
    vendedor_btn_ver: 246,
    vendedor_btn_editar: 247,
    vendedor_btn_eliminar: 248,

    /* vendedor crear, ver, editar */
    //vendedor_ver_nro: 13,
    //vendedor_ver_fecha: 14,

    vendedor_input_codigo: 235,
    vendedor_select_comision: 236,
    vendedor_input_nit: 237,
    vendedor_fechaNacimiento: 238,
    vendedor_input_nombre: 239,
    vendedor_input_apellido: 240,
    vendedor_select_genero: 241,
    vendedor_select_estado: 242,
    vendedor_caracteristicas: 243,
    vendedor_imagenes: 244,
    vendedor_textarea_nota: 245,

    venta: 249,

    /* venta index */
    venta_btn_reporte: 250,
    venta_btn_nuevo: 251,
    venta_btn_cargar_proforma: 425,
    venta_btn_reporte_ventas: 291,
    venta_btn_reporte_ventas_cobrar: 292,
    venta_btn_reporte_ventas_cobros: 293,
    venta_btn_reporte_ventas_detalles: 294,
    /* falta reportehistoricovehiculo 295 */
    venta_btn_ver: 289,
    venta_btn_eliminar: 290,

    venta_input_codigo: 252,
    venta_fecha: 253,
    venta_select_sucursal: 254,
    venta_select_almacen: 255,
    venta_btn_agragarCliente: 256,
    venta_btn_verCliente: 257,
    venta_input_search_codigoCliente: 258,
    venta_input_search_nombreCliente: 259,
    venta_input_search_nitCliente: 260,
    venta_select_search_codigoVehiculo: 261,
    venta_select_search_placaVehiculo: 262,
    venta_input_descripcionVehiculo: 263,
    venta_btn_agragarVendedor: 264,
    venta_btn_verVendedor: 265,
    venta_input_search_codigoVendedor: 266,
    venta_input_search_nombreVendedor: 267,
    venta_input_comisionVendedor: 268,
    venta_select_search_listaPrecios: 269,
    venta_select_moneda: 270,
    venta_tabla_columna_codigoProducto: 271,
    venta_tabla_columna_producto: 272,
    venta_tabla_columna_cantidad: 273,
    venta_tabla_columna_listaPrecio: 274,
    venta_tabla_columna_precioUnitario: 275,
    venta_tabla_columna_descuento: 276,
    venta_input_subTotal: 277,
    venta_input_descuento: 278,
    venta_input_recargo: 279,
    venta_input_total: 280,
    venta_textarea_observaciones: 281,
    venta_btn_historialVehiculo: 282,
    venta_btn_partesVehiculo: 283,
    venta_input_anticipo: 284,
    venta_btn_VerPago: 285,
    venta_input_tipoPago: 286,
    venta_btn_contado: 287,
    venta_btn_credito: 288,    

    proforma: 296,

    /* proforma index */
    proforma_btn_nuevo: 297,
    proforma_btn_ver: 330,
    proforma_btn_eliminar: 331,

    proforma_input_codigo: 298,
    proforma_fecha: 299,
    proforma_select_sucursal: 300,
    proforma_select_almacen: 301,
    proforma_btn_agregarCliente: 302,
    proforma_btn_verCliente: 303,
    proforma_input_search_codigoCliente: 304,
    proforma_input_search_nombreCliente: 305,
    proforma_input_nitCliente: 306,
    proforma_select_search_codigoVehiculo: 307,
    proforma_select_search_placaVehiculo: 308,
    proforma_input_descripcionVehiculo: 309,
    proforma_btn_agragarVendedor: 310,
    proforma_btn_verVendedor: 311,
    proforma_input_search_codigoVendedor: 312,
    proforma_input_search_nombreVendedor: 313,
    proforma_input_comisionVendedor: 314,
    proforma_select_search_listaPrecios: 315,
    proforma_select_moneda: 316,
    proforma_tabla_columna_codigoProducto: 317,
    proforma_tabla_columna_producto: 318,
    proforma_tabla_columna_cantidad: 319,
    proforma_tabla_columna_listaPrecio: 320,
    proforma_tabla_columna_precioUnitario: 321,
    proforma_tabla_columna_descuento: 322,
    proforma_input_subTotal: 323,
    proforma_input_descuento: 324,
    proforma_input_recargo: 325,
    proforma_input_total: 326,
    proforma_textarea_observaciones: 327,
    proforma_btn_historialVehiculo: 328,
    proforma_btn_partesVehiculo: 329,    

    cobranza: 332,

    /* cobranza index */
    cobranza_btn_nuevo: 333,
    cobranza_btn_ver: 345,
    cobranza_btn_eliminar: 346,
    cobranza_search_cliente: 426,


    /* cobranza crear, ver, editar */
    //cobranza_ver_nro: 16,
    cobranza_input_codigo: 334,
    cobranza_input_search_codigoVenta: 335,
    cobranza_fecha: 336,
    cobranza_input_codigoCliente: 337,
    cobranza_input_nombreCliente: 338,
    cobranza_textarea_nota: 339,
    cobranza_input_totalVenta: 340,
    cobranza_input_pagosAcumulados: 341,
    cobranza_input_saldo: 342,
    cobranza_input_cuotasPagar: 343,
    cobranza_input_totalPagar: 344,
    //cobranza_tabla_columna_saldo: 28,

    comision: 347,

    /* comision index */
    comision_btn_nuevo: 348,
    comision_btn_editar: 352,
    comision_btn_eliminar: 353,

    /* comision crear, editar */
    //comision_ver_nro: 16,
    //comision_ver_fecha: 17,

    comision_input_descripcion: 349,
    comision_input_porcentaje: 350,
    cobranza_select_tipo: 351,

    /* tipo cliente 354 al 358 */
    tipocliente: 354,
    tipocliente_btn_nuevo: 355,
    tipocliente_input_descripcion: 356,
    tipocliente_btn_editar: 357,
    tipocliente_btn_eliminar: 358,

    /* flia ciudad 359 360 */
    famciudad: 359,
    famciudad_btn_nuevo: 360,
    /* FALTA reportes 361 al 367 */
    
    compras: 368,

    proveedor: 369,

    /* proveedor index */
    proveedor_btn_nuevo: 370,
    proveedor_btn_ver: 381,
    proveedor_btn_editar: 382,
    proveedor_btn_eliminar: 383,

    /* proveedor crear, ver, editar */
    //proveedor_ver_nro: 13,
    //proveedor_ver_fecha: 14,

    proveedor_input_codigo: 371,
    proveedor_input_nombre: 372,
    proveedor_input_apellido: 373,
    proveedor_input_nit: 374,
    proveedor_select_ciudad: 375,
    proveedor_select_estado: 376,
    proveedor_caracteristicas: 377,
    proveedor_imagenes: 378,
    proveedor_textarea_descripcion: 379,
    proveedor_textarea_nota: 380,

    ventas_reportes: 361,
    ventas_reportes_ventas: 362,
    ventas_reportes_ventas_detallado: 363,
    ventas_reportes_cuentas_por_cobrar: 364,
    ventas_reportes_cobros_realizados: 365,
    ventas_reportes_ventas_historico_veh: 366,
    ventas_reportes_clientes: 367,
    ventas_reportes_comision_vend: 428,
    ventas_reportes_ventas_producto: 429,

    compra: 384,

    /* compra index */
    compra_btn_nuevo: 385,
    compra_btn_ver: 406,
    compra_btn_eliminar: 407,

    /* compra crear, ver, editar */
    //compra_ver_nro: 14,
    //compra_ver_fecha: 15,
    compra_input_codigo: 386,
    compra_select_sucursal: 387,
    compra_select_almacen: 388,
    compra_select_moneda: 389,
    compra_btn_agregarProveedor: 390,
    compra_btn_verProveedor: 391,
    compra_input_search_codigoProveedor: 392,
    compra_input_search_nombreProveedor: 393,
    compra_input_nitProveedor: 394,
    compra_select_planPago: 395,
    compra_fecha: 396,
    compra_hora: 397,
    compra_tabla_columna_codigoProducto: 398,
    compra_tabla_columna_producto: 399,
    compra_tabla_columna_cantidad: 400,
    compra_tabla_columna_costoUnitario: 401,
    compra_input_total: 402,
    compra_textarea_nota: 403,  
    compra_input_anticipo: 404,
    compra_btn_VerPago: 405, 

    pago: 408,

    /* pago index */
    pago_btn_nuevo: 409,
    pago_btn_ver: 421,
    pago_btn_eliminar: 422,

    pago_input_codigo: 410,
    pago_input_search_codigoCompra: 411,
    pago_fecha: 412,
    pago_input_codigoProveedor: 413,
    pago_input_nombreProveedor: 414,
    pago_input_totalCompra: 415,
    pago_input_acumulados: 416,
    pago_input_saldo: 417,
    pago_textarea_nota: 418,
    pago_input_cuotasPagar: 419,
    pago_input_totalPagar: 420,
    pago_search_proveedor: 427
}

export default keys;
