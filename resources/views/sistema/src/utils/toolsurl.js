
const geturl = (data) => {
    var url = '/commerce/admin';
    switch(data) {
        case 'home':
            return url + '/home';

        /* paquete seguridad */
        case 'usuario':
            return url + '/usuario/index';

        case 'grupousuario':
            return url + '/grupo-usuario/index';

        case 'asignarprivilegio':
            return url + '/asignar-privilegio';

        case 'asignarpermiso':
            return url + '/asignar_permiso';

        case 'activarpermiso':
            return url + '/activar_permiso';

        /* fin paquete seguridad */

        /* paquete taller */

        case 'vehiculo':
            return url + '/vehiculo/index';

        case 'vehiculohistoria':
            return url + '/vehiculo-historia/index';

        case 'vehiculoparte':
            return url + '/vehiculo-parte/index';

        case 'vehiculocaracteristica':
            return url + '/vehiculo-caracteristica/index';
        case 'familiavehiculo':
            return url + '/familia_vehiculo/index';

        /* fin paquete taller */

        /* paquete almacen */

        case 'producto':
            return url + '/producto';

        case 'ingresoproducto':
            return url + '/ingreso-producto';

        case 'salidaproducto':
            return url + '/salida-producto';

        case 'inventariocorte':
            return url + '/inventario-corte';

        case 'listaprecio':
            return url + '/lista-precios';

        case 'familia':
            return url + '/familia';

        case 'productocaracteristica':
            return url + '/producto-caracteristica/index';

        case 'traspasoproducto':
            return url + '/traspaso_producto/index';
        case 'unidadmedida':
            return url + '/unidad_medida/index';
        case 'tipomoneda':
            return url + '/tipo_moneda/index';
        case 'tipotraspaso':
            return url + '/tipo_traspaso/index';
        case 'sucursal':
            return url + '/sucursal/index';
        case 'almacenes':
            return url + '/almacenes/index';
        case 'almacenubicacion':
            return url + '/almacen_ubicacion/index';

        /* fin paquete almacen */

        /* paquete compra */

        case 'proveedor':
            return url + '/proveedor/index';

        case 'compra':
            return url + '/compra';

        case 'pago':
            return url + '/pago';

        /* fin paquete compra */

        /* paquete venta */

        case 'cliente':
            return url + '/cliente/index';

        case 'vendedor':
            return url + '/vendedor/index';

        case 'venta':
            return url + '/venta/index';

        case 'proforma':
            return url + '/proforma/index';

        case 'cobranza':
            return url + '/cobranza/index';

        case 'comision':
            return url + '/comision/index';
        case 'tipocliente':
            return url +  '/tipocliente/index';
        case 'familiaciudad':
            return url + '/familia_ciudad/index';

        /* fin paquete venta */

        /* reporte modulo taller */

        case 'reportevehiculo':
            return url + '/reporte/vehiculo';

        /* fin reporte modulo taller */

        /* reporte modulo almacen */

        case 'reporteproducto':
            return url + '/reporte/producto';

        /* fin reporte modulo almacen */

        /* reporte modulo venta */

        case 'reporteventa':
            return url + '/reporte/venta';

        case 'reporteventadetalle':
            return url + '/reporte/venta_detalle';

        case 'reporteventaporcobrar':
            return url + '/reporte/venta_por_cobrar';

        case 'reporteventacobro':
            return url + '/reporte/venta_cobro';

        case 'reporteventahistoricovehiculo':
            return url + '/reporte/venta_historico_vehiculo';

        case 'reportecliente':
            return url + '/reporte/cliente';

        case 'reportecomisionvendedor':
        return url + '/reporte/comision_por_vendedor';

        /* fin reporte venta */
        
        case 'users_online' :
            return url + '/usuarios-conectados' 

        case 'log_del_sistema' :
            return url + '/log_del_sistema' 

    }

    return null;
}

export {
    geturl,
}

