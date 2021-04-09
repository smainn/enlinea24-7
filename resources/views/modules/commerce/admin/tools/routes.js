const prefix = '/commerce/admin';
const routes = {
    home : prefix + '/home',
    login : prefix + '/login',
    inicio: prefix + '/login',
    producto_index: prefix + '/producto',
    producto_create: prefix + '/producto/create',
    producto_edit: prefix + '/producto/edit',
    root_access: prefix + '/entrada-secreta',
    inventario_index: prefix + '/inventario-corte',
    inventario_create: prefix + '/inventario-corte/create',
    inventario_edit: prefix + '/inventario-corte/edit',

    tipo_cliente: prefix + '/tipocliente/index',
    unidad_medida: prefix + '/unidad_medida/index',
    tipo_moneda: prefix + '/tipo_moneda/index',
    tipo_traspaso: prefix + '/tipo_traspaso/index',
    sucursal: prefix + '/sucursal/index',
    almacenes: prefix + '/almacenes/index',
    familia_vehiculo: prefix + '/familia_vehiculo/index',
    familia_ciudad: prefix + '/familia_ciudad/index',
    familia_almacen_ubicacion: prefix + '/almacen_ubicacion/index',

    usuarios_online: prefix + '/usuarios-conectados'
}

export default routes;
