
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '../redux/store';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Landing from './layouts/landing';
import Login from './auth/login';
import Profile from './auth/profile';
import { LocaleProvider } from 'antd';
import esES from 'antd/es/locale-provider/es_ES';

import AppMain from './main/App';
import Home from './main/home';

import IndexUsuario from './Seguridad/GestionarUsuario';
import CrearUsuario from './Seguridad/GestionarUsuario/crear';
import EditarUsuario from './Seguridad/GestionarUsuario/editar';
import ShowUsuario from './Seguridad/GestionarUsuario/show';

import IndexGrupoUsuario from './Seguridad/GestionarGrupo';
import CrearGrupoUsuario from './Seguridad/GestionarGrupo/crear';
import EditarGrupoUsuario from './Seguridad/GestionarGrupo/editar';

import AsignarPrivilegio from './Seguridad/AsignarPermiso/asignar';
import UsuariosConectados from './Seguridad/UsuariosConectados/index';

import IndexVehiculo from './Taller/GestionarVehiculo';
import CrearVehiculo from './Taller/GestionarVehiculo/crear';
import EditVehiculo from './Taller/GestionarVehiculo/editar';
import ReporteVehiculo from './Taller/GestionarVehiculo/reporte';

import IndexParteVehiculo from './Taller/GestionarParteVehiculo';

import IndexVehiculoHistoria from './Taller/GestionarVehiculoHistoria';
import CrearVehiculoHistoria from './Taller/GestionarVehiculoHistoria/crear';
import EditVehiculoHistoria from './Taller/GestionarVehiculoHistoria/editar';

import IndexIngresoPro from './Almacen/GestionarIngresoPro';

import IndexProducto from './Almacen/GestionarProducto/index';
import CreateProducto from './Almacen/GestionarProducto/crear';
import EditProducto from './Almacen/GestionarProducto/editar';

import IndexSalidaPro from './Almacen/GestionarSalidaPro';

import IndexInventarioCorte from './Almacen/GestionarInventarioCorte/index';
import CreateInventarioCorte from './Almacen/GestionarInventarioCorte/crear';
import EditInventarioCorte from './Almacen/GestionarInventarioCorte/editar';

import IndexListaPrecio from './Almacen/ListaPrecios';

import IndexProveedor from './Compra/GestionarProveedor';
import CrearProveedor from './Compra/GestionarProveedor/crear';
import EditarProveedor from './Compra/GestionarProveedor/editar';

import IndexCliente from './Venta/GestionarCliente';
import CrearCliente from './Venta/GestionarCliente/crear';
import EditarCliente from './Venta/GestionarCliente/editar';

import routes from '../tools/routes';
import IndexVendedor from './Venta/Vendedor';
import CreateVendedor from './Venta/Vendedor/crear';

import IndexVenta from './Venta/GestionarVenta';

import IndexProforma from './Venta/GestionarProforma';
import CreateProforma from './Venta/GestionarProforma/crear';
import ShowProforma from './Venta/GestionarProforma/show';

import IndexCobranza from './Venta/GestionarCobranza';
import IndexComision from './Venta/GestionarComision';
import IndexFamilia from './Almacen/GestionarFamilia';
import IndexCompra from './Compra/GestionarCompra';
import IndexPago from './Compra/GestionarPagos';
import CrearVenta from './Venta/GestionarVenta/crear';
import EditVendedor from './Venta/Vendedor/editar';
import ReporteGeneralVenta from './Venta/GestionarVenta/reporte';
import ReporteVentaPorCobrar from './Venta/GestionarVenta/reporte/ventaPorCobrar';
import ReporteVentaPorCobrosRealizados from './Venta/GestionarVenta/reporte/ventaPorCobros';
import CreateCompra from './Compra/GestionarCompra/crear';
import ShowCompra from './Compra/GestionarCompra/show';
import CreatePago from './Compra/GestionarPagos/crear';
import ShowPago from './Compra/GestionarPagos/show';
import CrearComisionVenta from './Venta/GestionarComision/crear';
import EditarComisionVenta from './Venta/GestionarComision/editar';
import CreateCobranza from './Venta/GestionarCobranza/crear';
import CreateIngresoPro from './Almacen/GestionarIngresoPro/crear';
import CreateSalidaPro from './Almacen/GestionarSalidaPro/crear';
import ShowCobranza from './Venta/GestionarCobranza/show';
import CreateListaPrecio from './Almacen/ListaPrecios/crear';
import EditListaPrecio from './Almacen/ListaPrecios/editar';
import EditIngresoPro from './Almacen/GestionarIngresoPro/editar';
import EditSalidaPro from './Almacen/GestionarSalidaPro/editar';
import ShowVenta from './Venta/GestionarVenta/show';
import ReporteCliente from './Venta/GestionarCliente/reporte';
import ReporteProducto from './Almacen/GestionarProducto/reporte';
import ReporteVentaDetallado from './Venta/GestionarVenta/reporte/ventaDetallado';

import IndexVehiculoCaracteristica from './Taller/GestionarCaracteristicas';
import IndexProductoCaracteristica from './Almacen/GestionarProdCaracteristica';
import IndexTraspasos from './Almacen/GestionarTraspaso';

import IndexTipoCliente from './Venta/GestionarTipoCliente';
import IndexUnidadMedida from './Almacen/GestionarUnidadMedida';
import IndexTipoMoneda from './Almacen/GestionarTipoMoneda';
import IndexTipoTraspaso from './Almacen/GestionarTipoTraspaso';
import IndexSucursal from './Almacen/GestionarSurcursal';
import IndexAlmacen from './Almacen/GestionarAlmacen';
import IndexFamiliaVehiculo from './Taller/GestionarFamiliaVehiculo';
import IndexFamiliaCiudad from './Venta/GestionarFamiliaCiudad';
import IndexFamiliaAlmacenUbicacion from './Almacen/GestionarAlmacenUbicacion';

import PerfilUsuario from './main/perfil';
import ReporteVentaHistoricoVehiculo from './Venta/GestionarVenta/reporte/ventaHistoricoVehiculo';
import ActivarPrivilegio from './Seguridad/AsignarPermiso/activar';
import Reporte_Venta from './Venta/Reporte/venta';
import Reporte_Venta_Detalle from './Venta/Reporte/ventadetalle';
import Reporte_Por_Cobrar from './Venta/Reporte/ventaporcobrar';
import Reporte_Venta_Cobro from './Venta/Reporte/ventacobro';
import Reporte_Venta_Historico_Vehiculo from './Venta/Reporte/ventahistoricovehiculo';
import Reporte_Cliente from './Venta/Reporte/cliente';
import Reporte_Producto from './Almacen/Reporte/producto';
import Reporte_Vehiculo from './Taller/Reporte/vehiculo';
import Reporte_Comision_Por_Vendedor from './Venta/Reporte/comisionporvendedor';
import Log_Del_Sistema from './Seguridad/GestionarUsuario/log_sistema';
import CrearTraspasoProducto from './Almacen/GestionarTraspaso/crear';
import ShowTraspasoProducto from './Almacen/GestionarTraspaso/show';
import Reporte_Venta_Por_Producto from './Venta/Reporte/ventaporproducto';
import Plan_de_Cuenta from './contable/plancuenta';


export default class Index extends Component{

    componentDidMount() {

    }
    render(){
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/commerce/admin" component={Landing} />

                        <Route exact path="/commerce/admin/login" component={Login} />

                        <Route exact path="/commerce/admin/profile" component={Profile} />

                        <Route history={history}>
                            <LocaleProvider locale={esES}>
                            <AppMain>
                                <Switch>
                                    <Route exact path="/commerce/admin/home" component={Home} />

                                    <Route exact path="/commerce/admin/perfil" render={props => <PerfilUsuario {...props}/>} />

                                    <Route exact path="/commerce/admin/usuario/index" render={props => <IndexUsuario {...props}/>} />
                                    <Route exact path="/commerce/admin/usuario/create" render={props => <CrearUsuario {...props}/>} />
                                    <Route exact path="/commerce/admin/usuario/edit/:id" render={props => <EditarUsuario {...props}/>} />
                                    <Route exact path="/commerce/admin/usuario/show/:id" render={props => <ShowUsuario {...props}/>} />

                                    <Route exact path="/commerce/admin/grupo-usuario/index" render={props => <IndexGrupoUsuario {...props}/>} />
                                    <Route exact path="/commerce/admin/grupo-usuario/create" render={props => <CrearGrupoUsuario {...props}/>} />
                                    <Route exact path="/commerce/admin/grupo-usuario/edit/:id" render={props => <EditarGrupoUsuario {...props}/>} />

                                    <Route exact path="/commerce/admin/asignar-privilegio" component={AsignarPrivilegio} />

                                    <Route exact path="/commerce/admin/asignar_permiso" component={AsignarPrivilegio} />
                                    <Route exact path="/commerce/admin/activar_permiso" component={ActivarPrivilegio} />

                                    <Route exact path="/commerce/admin/log_del_sistema" component={Log_Del_Sistema} />

                                    <Route exact path={routes.usuarios_online} component={UsuariosConectados} />

                                    <Route exact path="/commerce/admin/vehiculo/index" component={IndexVehiculo} />
                                    <Route exact path="/commerce/admin/vehiculo/create" component={CrearVehiculo} />
                                    <Route exact path="/commerce/admin/vehiculo/edit/:id" render={props => <EditVehiculo {...props}/>}/>
                                    <Route exact path="/commerce/admin/vehiculo/reporte" render={props => <ReporteVehiculo {...props}/>}/>

                                    <Route exact path="/commerce/admin/vehiculo-parte/index" render={props => <IndexParteVehiculo { ...props} /> } />

                                    <Route exact path="/commerce/admin/vehiculo-historia/index" render={props => <IndexVehiculoHistoria { ...props} /> } />
                                    <Route exact path="/commerce/admin/vehiculo-historia/create" render={props => <CrearVehiculoHistoria { ...props} /> } />
                                    <Route exact path="/commerce/admin/vehiculo-historia/edit/:id" render={props => <EditVehiculoHistoria { ...props} /> } />

                                    <Route exact path="/commerce/admin/vehiculo-caracteristica/index" render={props => <IndexVehiculoCaracteristica { ...props} /> } />

                                    <Route exact path="/commerce/admin/producto/index" render={props => <IndexProducto { ...props} /> } />

                                    <Route exact path="/commerce/admin/ingreso-producto" render={props => <IndexIngresoPro { ...props} /> } />
                                    <Route exact path="/commerce/admin/ingreso-producto/create" render={props => <CreateIngresoPro { ...props} /> } />
                                    <Route exact path="/commerce/admin/ingreso-producto/edit/:id" render={props => <EditIngresoPro { ...props} /> } />

                                    <Route exact path="/commerce/admin/salida-producto" render={props => <IndexSalidaPro { ...props} /> } />
                                    <Route exact path="/commerce/admin/salida-producto/create" render={props => <CreateSalidaPro { ...props} /> } />
                                    <Route exact path="/commerce/admin/salida-producto/edit/:id" render={props => <EditSalidaPro { ...props} /> } />

                                    <Route exact path={routes.inventario_index} render={props => <IndexInventarioCorte { ...props} /> } />
                                    <Route exact path={routes.inventario_create} render={props => <CreateInventarioCorte { ...props} /> } />
                                    <Route exact path={routes.inventario_edit + '/:id'} render={props => <EditInventarioCorte { ...props} /> } />

                                    <Route exact path="/commerce/admin/lista-precios" render={props => <IndexListaPrecio { ...props} /> } />
                                    <Route exact path="/commerce/admin/lista-precios/create" render={props => <CreateListaPrecio { ...props} /> } />
                                    <Route exact path="/commerce/admin/lista-precios/edit/:id" render={props => <EditListaPrecio { ...props} /> } />

                                    <Route exact path="/commerce/admin/familia" render={props => <IndexFamilia { ...props} /> } />

                                    <Route exact path="/commerce/admin/producto-caracteristica/index" render={props => <IndexProductoCaracteristica { ...props} /> } />

                                    <Route exact path="/commerce/admin/traspaso_producto/index" render={props => <IndexTraspasos { ...props} /> } />
                                    <Route exact path="/commerce/admin/traspaso_producto/create" render={props => <CrearTraspasoProducto { ...props} /> } />
                                    <Route exact path="/commerce/admin/traspaso_producto/show/:id" render={props => <ShowTraspasoProducto { ...props} /> } />

                                    <Route exact path="/commerce/admin/proveedor/index" render={props => <IndexProveedor { ...props} /> } />
                                    <Route exact path="/commerce/admin/proveedor/create" render={props => <CrearProveedor { ...props} /> } />
                                    <Route exact path="/commerce/admin/proveedor/edit/:id" render={props => <EditarProveedor { ...props} /> } />

                                    <Route exact path="/commerce/admin/compra" render={props => <IndexCompra { ...props} /> } />
                                    <Route exact path="/commerce/admin/compra/create" render={props => <CreateCompra { ...props} /> } />
                                    <Route exact path="/commerce/admin/compra/show/:id" render={props => <ShowCompra { ...props} /> } />

                                    <Route exact path="/commerce/admin/pago" render={props => <IndexPago { ...props} /> } />
                                    <Route exact path="/commerce/admin/pago/create" render={props => <CreatePago { ...props} /> } />
                                    <Route exact path="/commerce/admin/pago/show/:id" render={props => <ShowPago { ...props} /> } />


                                    <Route exact path="/commerce/admin/cliente/index" render={props => <IndexCliente { ...props} /> } />
                                    <Route exact path="/commerce/admin/cliente/create" render={props => <CrearCliente { ...props} /> } />
                                    <Route exact path="/commerce/admin/cliente/edit/:id" render={props => <EditarCliente { ...props} /> } />
                                    <Route exact path="/commerce/admin/cliente/reporte" render={props => <ReporteCliente { ...props} /> } />
                                    <Route exact path = {routes.tipo_cliente} component = {IndexTipoCliente} render = {props => <IndexTipoCliente {...props} />} />

                                    <Route exact path="/commerce/admin/vendedor/index" render={props => <IndexVendedor { ...props} /> } />
                                    <Route exact path="/commerce/admin/vendedor/create" render={props => <CreateVendedor { ...props} /> } />
                                    <Route exact path="/commerce/admin/vendedor/edit/:id" render={props => <EditVendedor { ...props} /> } />

                                    <Route exact path={routes.producto_index} component={IndexProducto} />
                                    <Route exact path={routes.producto_create} component={CreateProducto} />
                                    <Route exact path={routes.producto_edit + '/:id'} component={EditProducto} />
                                    <Route exact path = {routes.unidad_medida} component = {IndexUnidadMedida} render = {props => <IndexUnidadMedida {...props} />} />
                                    <Route exact path = {routes.tipo_moneda} component = {IndexTipoMoneda} render = {props => <IndexTipoMoneda {...props} />} />
                                    <Route exact path = {routes.tipo_traspaso} component = {IndexTipoTraspaso} render = {props => <IndexTipoTraspaso {...props} />} />
                                    <Route exact path = {routes.sucursal} component = {IndexSucursal} render = {props => <IndexSucursal {...props} />} />
                                    <Route exact path = {routes.almacenes} component = {IndexAlmacen} render = {props => <IndexAlmacen {...props} />} />
                                    <Route exact path = {routes.familia_vehiculo} component = {IndexFamiliaVehiculo} render = {props => <IndexFamiliaVehiculo {...props} />} />
                                    <Route exact path = {routes.familia_ciudad} component = {IndexFamiliaCiudad} render = {props => <IndexFamiliaCiudad {...props} />} />
                                    <Route exact path = {routes.familia_almacen_ubicacion} component = {IndexFamiliaAlmacenUbicacion} render = {props => <IndexFamiliaAlmacenUbicacion {...props} />} />

                                    <Route exact path="/commerce/admin/producto/reporte" render={props => <ReporteProducto { ...props} /> } />

                                    <Route exact path="/commerce/admin/venta/index" render={props => <IndexVenta { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/create" render={props => <CrearVenta { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/show/:id" render={props => <ShowVenta { ...props} /> } />


                                    <Route exact path="/commerce/admin/venta/reporte" render={props => <ReporteGeneralVenta { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/reporte-por-cobrar" render={props => <ReporteVentaPorCobrar { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/reporte-de-cobros" render={props => <ReporteVentaPorCobrosRealizados { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/reporte-detallado" render={props => <ReporteVentaDetallado { ...props} /> } />
                                    <Route exact path="/commerce/admin/venta/reporte_historico_vehiculo" render={props => <ReporteVentaHistoricoVehiculo { ...props} /> } />

                                    <Route exact path="/commerce/admin/proforma/index" render={props => <IndexProforma { ...props} /> } />
                                    <Route exact path="/commerce/admin/proforma/create" render={props => <CreateProforma { ...props} /> } />
                                    <Route exact path="/commerce/admin/proforma/show/:id" render={props => <ShowProforma { ...props} /> } />

                                    <Route exact path="/commerce/admin/cobranza/index" render={props => <IndexCobranza { ...props} /> } />
                                    <Route exact path="/commerce/admin/cobranza/create" render={props => <CreateCobranza { ...props} /> } />
                                    <Route exact path="/commerce/admin/cobranza/show/:id" render={props => <ShowCobranza { ...props} /> } />

                                    <Route exact path="/commerce/admin/comision/index" render={props => <IndexComision { ...props} /> } />
                                    <Route exact path="/commerce/admin/comision/create" render={props => <CrearComisionVenta { ...props} /> } />
                                    <Route exact path="/commerce/admin/comision/edit/:id" render={props => <EditarComisionVenta { ...props} /> } />


                                    <Route exact path="/commerce/admin/reporte/vehiculo" render={props => <Reporte_Vehiculo { ...props} /> } />

                                    <Route exact path="/commerce/admin/reporte/producto" render={props => <Reporte_Producto { ...props} /> } />

                                    <Route exact path="/commerce/admin/reporte/venta" render={props => <Reporte_Venta { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/venta_detalle" render={props => <Reporte_Venta_Detalle { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/venta_por_cobrar" render={props => <Reporte_Por_Cobrar { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/venta_cobro" render={props => <Reporte_Venta_Cobro { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/venta_historico_vehiculo" render={props => <Reporte_Venta_Historico_Vehiculo { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/cliente" render={props => <Reporte_Cliente { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/comision_por_vendedor" render={props => <Reporte_Comision_Por_Vendedor { ...props} /> } />
                                    <Route exact path="/commerce/admin/reporte/venta_por_producto" render={props => <Reporte_Venta_Por_Producto { ...props} /> } />


                                    <Route exact path="/commerce/admin/plan_de_cuenta/index" render={props => <Plan_de_Cuenta { ...props} /> } />


                                </Switch>
                            </AppMain>
                            </LocaleProvider>
                        </Route>

                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}


