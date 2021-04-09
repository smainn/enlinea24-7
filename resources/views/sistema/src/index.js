
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
//import store from '../redux/store';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
import Landing from './layouts/landing';
import Login from './auth/login';
import { LocaleProvider } from 'antd';
import esES from 'antd/es/locale-provider/es_ES';

import moment from 'moment';
moment.locale('esES');

import AppMain from './main/App';
import Home from './main/home';

import Configuracion from './config/configuraciones';


import IndexVehiculo from './comercio/taller/GestionarVehiculo';
import CrearVehiculo from './comercio/taller/GestionarVehiculo/crear';
import EditVehiculo from './comercio/taller/GestionarVehiculo/editar';
import ReporteVehiculo from './comercio/taller/GestionarVehiculo/reporte';

import IndexParteVehiculo from './comercio/taller/GestionarParteVehiculo';

import IndexVehiculoHistoria from './comercio/taller/GestionarVehiculoHistoria';
import CrearVehiculoHistoria from './comercio/taller/GestionarVehiculoHistoria/crear';
import EditVehiculoHistoria from './comercio/taller/GestionarVehiculoHistoria/editar';

import IndexIngresoPro from './comercio/almacen/GestionarIngresoPro';

import IndexProducto from './comercio/almacen/GestionarProducto/index';
import CreateProducto from './comercio/almacen/GestionarProducto/crear';
import EditProducto from './comercio/almacen/GestionarProducto/editar';

import IndexSalidaPro from './comercio/almacen/GestionarSalidaPro';

import IndexInventarioCorte from './comercio/almacen/GestionarInventarioCorte/index';
import CreateInventarioCorte from './comercio/almacen/GestionarInventarioCorte/crear';
import EditInventarioCorte from './comercio/almacen/GestionarInventarioCorte/editar';

import IndexListaPrecio from './comercio/almacen/ListaPrecios';

import IndexProveedor from './comercio/compras/GestionarProveedor';
import CrearProveedor from './comercio/compras/GestionarProveedor/crear';
import EditarProveedor from './comercio/compras/GestionarProveedor/editar';

import IndexCliente from './comercio/ventas/GestionarCliente';
import CrearCliente from './comercio/ventas/GestionarCliente/crear';
import EditarCliente from './comercio/ventas/GestionarCliente/editar';

import routes from './utils/routes';
import IndexVendedor from './comercio/ventas/Vendedor';
import CreateVendedor from './comercio/ventas/Vendedor/crear';

import IndexVenta from './comercio/ventas/GestionarVenta';

import IndexProforma from './comercio/ventas/GestionarProforma';
import CreateProforma from './comercio/ventas/GestionarProforma/crear';
import ShowProforma from './comercio/ventas/GestionarProforma/show';

import IndexCobranza from './comercio/ventas/GestionarCobranza';
import IndexComision from './comercio/ventas/comision_venta';
import IndexFamilia from './comercio/almacen/GestionarFamilia';
import IndexCompra from './comercio/compras/GestionarCompra';
import IndexPago from './comercio/compras/GestionarPagos';
import CrearVenta from './comercio/ventas/GestionarVenta/crear';
import EditVendedor from './comercio/ventas/Vendedor/editar';
import ReporteGeneralVenta from './comercio/ventas/GestionarVenta/reporte';
import ReporteVentaPorCobrar from './comercio/ventas/GestionarVenta/reporte/ventaPorCobrar';
import ReporteVentaPorCobrosRealizados from './comercio/ventas/GestionarVenta/reporte/ventaPorCobros';
import CreateCompra from './comercio/compras/GestionarCompra/crear';
import ShowCompra from './comercio/compras/GestionarCompra/show';
import CreatePago from './comercio/compras/GestionarPagos/crear';
import ShowPago from './comercio/compras/GestionarPagos/show';
import CrearComisionVenta from './comercio/ventas/comision_venta/crear';
import EditarComisionVenta from './comercio/ventas/comision_venta/editar';
import CreateCobranza from './comercio/ventas/GestionarCobranza/crear';
import CreateIngresoPro from './comercio/almacen/GestionarIngresoPro/crear';
import CreateSalidaPro from './comercio/almacen/GestionarSalidaPro/crear';
import ShowCobranza from './comercio/ventas/GestionarCobranza/show';
import CreateListaPrecio from './comercio/almacen/ListaPrecios/crear';
import EditListaPrecio from './comercio/almacen/ListaPrecios/editar';
import EditIngresoPro from './comercio/almacen/GestionarIngresoPro/editar';
import EditSalidaPro from './comercio/almacen/GestionarSalidaPro/editar';
import ShowVenta from './comercio/ventas/GestionarVenta/show';
import ReporteCliente from './comercio/ventas/GestionarCliente/reporte';
import ReporteProducto from './comercio/almacen/GestionarProducto/reporte';
import ReporteVentaDetallado from './comercio/ventas/GestionarVenta/reporte/ventaDetallado';

import IndexVehiculoCaracteristica from './comercio/taller/GestionarCaracteristicas';
import IndexProductoCaracteristica from './comercio/almacen/GestionarProdCaracteristica';
import IndexTraspasos from './comercio/almacen/GestionarTraspaso';

import IndexTipoCliente from './comercio/ventas/cliente_tipo';
import IndexUnidadMedida from './comercio/almacen/GestionarUnidadMedida';

import IndexTipoTraspaso from './comercio/almacen/GestionarTipoTraspaso';

import IndexAlmacen from './comercio/almacen/GestionarAlmacen';
import IndexFamiliaVehiculo from './comercio/taller/GestionarFamiliaVehiculo';
import IndexFamiliaCiudad from './comercio/ventas/ciudad';
import IndexFamiliaAlmacenUbicacion from './comercio/almacen/GestionarAlmacenUbicacion';

import PerfilUsuario from './main/perfil';
import ReporteVentaHistoricoVehiculo from './comercio/ventas/GestionarVenta/reporte/ventaHistoricoVehiculo';

import Reporte_Venta from './comercio/ventas/Reporte/venta';
import Reporte_Venta_Detalle from './comercio/ventas/Reporte/ventadetalle';
import Reporte_Por_Cobrar from './comercio/ventas/Reporte/ventaporcobrar';
import Reporte_Venta_Cobro from './comercio/ventas/Reporte/ventacobro';
import Reporte_Venta_Historico_Vehiculo from './comercio/ventas/Reporte/ventahistoricovehiculo';
import Reporte_Cliente from './comercio/ventas/Reporte/cliente';
import Reporte_Producto from './comercio/almacen/Reporte/producto';
import Reporte_kardexProducto from './comercio/almacen/Reporte/kardexproducto';
import Reporte_Vehiculo from './comercio/taller/Reporte/vehiculo';
import Reporte_Comision_Por_Vendedor from './comercio/ventas/Reporte/comisionporvendedor';
import Reporte_Venta_Por_Producto from './comercio/ventas/Reporte/ventaporproducto';
import Reporte_Venta_Factura from './comercio/ventas/Reporte/factura';

import Reporte_LibroVenta from './comercio/ventas/Reporte/libroventa';

import CrearTraspasoProducto from './comercio/almacen/GestionarTraspaso/crear';
import ShowTraspasoProducto from './comercio/almacen/GestionarTraspaso/show';

import Restaurant_Venta_Index from './restaurant/venta';
import Restaurant_Venta_Create from './restaurant/venta/crear';
import CrearParteVehiculo from './comercio/taller/GestionarVentaDetalleVehiculo/CrearParteVehiculo';
import CrearHistorialVehiculo from './comercio/taller/GestionarVentaDetalleVehiculo/CrearHistorialVehiculo';
import Venta_Proforma from './comercio/ventas/GestionarVenta/proforma';


import IndexEntregaProducto from './comercio/ventas/entrega_producto';
import NuevaEntregaProducto from './comercio/ventas/entrega_producto/nuevo';

import Reporte_Compra from './comercio/compras/Reporte/compra';
import Reporte_CompraDetalle from './comercio/compras/Reporte/compradetalle';
import Reporte_CompraCuentaPorPagar from './comercio/compras/Reporte/cuentaporpagar';
import Reporte_CompraPagoRealizado from './comercio/compras/Reporte/pagorealizado';
import Reporte_Proveedor from './comercio/compras/Reporte/proveedor';

import Route_Seguridad from './routes/seguridad';
import Route_Configuracion from './routes/configuracion';
import Route_Contabilidad from './routes/contable/contabilidad';

export default class Index extends Component{

    constructor(props) {
        super(props);
        this.state = {
            color: '',
            cliente_index: {
                array: [],
            },
            array_notificacion: [],
            ventaendospasos: false,
            idalmacen: null,
        }
    }
    getventaendospasos(value){
        this.setState({
            ventaendospasos: value,
        })
    }
    get_cliente(data) {
        var objecto = { array: data, };
        this.setState({
            cliente_index: objecto,
        });
    }
    onChangeIDAlmacen(value) {
        console.log(value)
        this.setState({
            idalmacen: value,
        });
    }
    render(){
        return (
                <BrowserRouter>
                    <Switch>

                        <Route exact path={routes.login} component={Login} />

                        {/* reporte seguridad */}

                        <Route exact path={routes.reporte_log_sistema} render={props => <Reporte_Log { ...props} /> } />

                        <Route history={history}>
                            <LocaleProvider locale={esES}>
                            <AppMain notification={this.state.array_notificacion} ventaendospasos={this.state.ventaendospasos} 
                                getventaendospasos={this.getventaendospasos.bind(this)}
                            >

                                <Route_Contabilidad />

                                <Route_Seguridad />

                                <Route_Configuracion />

                                <Switch>
                                    <Route exact path={routes.home} component={Home} />

                                    <Route exact path={routes.usuario_perfil} render={props => <PerfilUsuario {...props}/>} />


                                    <Route exact path={routes.config_inicial} render={props => 
                                        <Configuracion getventaendospasos={this.getventaendospasos.bind(this)} {...props}/>} 
                                    />


                                    <Route exact path={routes.vehiculo_index} component={IndexVehiculo} />
                                    <Route exact path={routes.vehiculo_create} render={
                                        props => <CrearVehiculo {...props}/>
                                    } />
                                    <Route exact path={routes.vehiculo_edit + '/:id'} render={props => <EditVehiculo {...props}/>}/>
                                    <Route exact path={routes.vehiculo_reporte} render={props => <ReporteVehiculo {...props}/>}/>

                                    <Route exact path={routes.vehiculo_parte} render={props => <IndexParteVehiculo { ...props} /> } />

                                    <Route exact path={routes.vehiculo_historia} render={props => <IndexVehiculoHistoria { ...props} /> } />
                                    <Route exact path={routes.vehiculo_historia_create} render={props => <CrearVehiculoHistoria { ...props} /> } />
                                    <Route exact path={routes.vehiculo_historia_edit + '/:id'} render={props => <EditVehiculoHistoria { ...props} /> } />

                                    <Route exact path={routes.vehiculo_caracteristica} render={props => <IndexVehiculoCaracteristica { ...props} /> } />

                                    <Route exact path={routes.ingreso_producto_index} render={props => <IndexIngresoPro { ...props} /> } />
                                    <Route exact path={routes.ingreso_producto_create} render={props => <CreateIngresoPro { ...props} /> } />
                                    <Route exact path={routes.ingreso_producto_edit + '/:id'} render={props => <EditIngresoPro { ...props} /> } />

                                    <Route exact path={routes.salida_producto_index} render={props => <IndexSalidaPro { ...props} /> } />
                                    <Route exact path={routes.salida_producto_create} render={props => <CreateSalidaPro { ...props} /> } />
                                    <Route exact path={routes.salida_producto_edit + '/:id'} render={props => <EditSalidaPro { ...props} /> } />

                                    <Route exact path={routes.inventario_index} render={props => <IndexInventarioCorte { ...props} /> } />
                                    <Route exact path={routes.inventario_create} render={props => <CreateInventarioCorte { ...props} /> } />
                                    <Route exact path={routes.inventario_edit + '/:id'} render={props => <EditInventarioCorte { ...props} /> } />

                                    <Route exact path={routes.lista_precios_index} render={props => <IndexListaPrecio { ...props} /> } />
                                    <Route exact path={routes.lista_precios_create} render={props => <CreateListaPrecio { ...props} /> } />
                                    <Route exact path={routes.lista_precios_edit + '/:id'} render={props => <EditListaPrecio { ...props} /> } />

                                    <Route exact path={routes.familia_producto} render={props => <IndexFamilia { ...props} /> } />

                                    <Route exact path={routes.producto_caracteristica} render={props => <IndexProductoCaracteristica { ...props} /> } />

                                    <Route exact path={routes.traspaso_producto_index} render={props => <IndexTraspasos { ...props} /> } />
                                    <Route exact path={routes.traspaso_producto_create} render={props => <CrearTraspasoProducto { ...props} /> } />
                                    <Route exact path={routes.traspaso_producto_show + '/:id'} render={props => <ShowTraspasoProducto { ...props} /> } />

                                    <Route exact path={routes.proveedor_index} render={props => <IndexProveedor { ...props} /> } />
                                    <Route exact path={routes.proveedor_create} render={props => <CrearProveedor { ...props} /> } />
                                    <Route exact path={routes.proveedor_edit + '/:id'} render={props => <EditarProveedor { ...props} /> } />

                                    <Route exact path={routes.compra_index} render={props => <IndexCompra { ...props} /> } />
                                    <Route exact path={routes.compra_create} render={props => 
                                        <CreateCompra onChangeIDAlmacen={this.onChangeIDAlmacen.bind(this)} { ...props} /> } 
                                    />
                                    <Route exact path={routes.compra_show + '/:id'} render={props => <ShowCompra { ...props} /> } />

                                    <Route exact path={routes.pago_index} render={props => <IndexPago { ...props} /> } />
                                    <Route exact path={routes.pago_create} render={props => <CreatePago { ...props} /> } />
                                    <Route exact path={routes.pago_show + '/:id'} render={props => <ShowPago { ...props} /> } />


                                    <Route exact path={routes.cliente_index} render={ 
                                        props => <IndexCliente array_cliente={this.state.cliente_index.array} get_cliente={this.get_cliente.bind(this)} { ...props} /> 
                                    }/>
                                    <Route exact path={routes.cliente_create} render={props => <CrearCliente { ...props} /> } />
                                    <Route exact path={routes.cliente_edit + '/:id'} render={props => <EditarCliente { ...props} /> } />
                                    <Route exact path={routes.cliente_reporte} render={props => <ReporteCliente { ...props} /> } />
                                    <Route exact path = {routes.tipo_cliente} component = {IndexTipoCliente} render = {props => <IndexTipoCliente {...props} />} />

                                    <Route exact path={routes.vendedor_index} render={props => <IndexVendedor { ...props} /> } />
                                    <Route exact path={routes.vendedor_create} render={props => <CreateVendedor { ...props} /> } />
                                    <Route exact path={routes.vendedor_edit + '/:id'} render={props => <EditVendedor { ...props} /> } />

                                    <Route exact path={routes.producto_index} component={IndexProducto} />
                                    <Route exact path={routes.producto_create} render={props => 
                                        <CreateProducto idalmacen={this.state.idalmacen} { ...props} /> } 
                                    />
                                    <Route exact path={routes.producto_edit + '/:id'} component={EditProducto} />
                                    <Route exact path = {routes.unidad_medida} component = {IndexUnidadMedida} render = {props => <IndexUnidadMedida {...props} />} />
                                    
                                    <Route exact path = {routes.tipo_traspaso} component = {IndexTipoTraspaso} render = {props => <IndexTipoTraspaso {...props} />} />

                                    

                                    <Route exact path = {routes.almacenes} component = {IndexAlmacen} render = {props => <IndexAlmacen {...props} />} />
                                    <Route exact path = {routes.familia_vehiculo} component = {IndexFamiliaVehiculo} render = {props => <IndexFamiliaVehiculo {...props} />} />
                                    <Route exact path = {routes.familia_ciudad} component = {IndexFamiliaCiudad} render = {props => <IndexFamiliaCiudad {...props} />} />
                                    <Route exact path = {routes.familia_almacen_ubicacion} component = {IndexFamiliaAlmacenUbicacion} render = {props => <IndexFamiliaAlmacenUbicacion {...props} />} />

                                    <Route exact path={routes.producto_reporte} render={props => <ReporteProducto { ...props} /> } />

                                    <Route exact path={routes.venta_index} render={props => <IndexVenta { ...props} /> } />
                                    <Route exact path={routes.venta_create} render={props => <CrearVenta { ...props} /> } />
                                    <Route exact path={routes.venta_vehiculoparte} render={props => <CrearParteVehiculo { ...props} /> } />
                                    <Route exact path={routes.venta_vehiculohistoria} render={props => <CrearHistorialVehiculo { ...props} /> } />
                                    <Route exact path={routes.venta_proforma} render={props => <Venta_Proforma { ...props} /> } />
                                    <Route exact path={routes.venta_show + '/:id'} render={props => <ShowVenta { ...props} /> } />

                                    <Route exact path={routes.entregaproducto + '/index'} render={props => <IndexEntregaProducto { ...props} /> } />
                                    <Route exact path={routes.entregaproducto + '/nuevo/:id'} render={props => <NuevaEntregaProducto { ...props} /> } />


                                    {/**--------------------------REPORTES ------------------------------------------------*/}
                                    <Route exact path={routes.venta_reporte} render={props => <ReporteGeneralVenta { ...props} /> } />
                                    <Route exact path={routes.venta_reporte_por_cobrar} render={props => <ReporteVentaPorCobrar { ...props} /> } />
                                    <Route exact path={routes.venta_reporte_por_cobros} render={props => <ReporteVentaPorCobrosRealizados { ...props} /> } />
                                    <Route exact path={routes.venta_reporte_detallado} render={props => <ReporteVentaDetallado { ...props} /> } />
                                    <Route exact path={routes.venta_reporte_historico_vehiculo} render={props => <ReporteVentaHistoricoVehiculo { ...props} /> } />



                                    <Route exact path={routes.compra_reporte} render={props => <Reporte_Compra { ...props} /> } />
                                    <Route exact path={routes.compra_detalle_reporte} render={props => <Reporte_CompraDetalle { ...props} /> } />
                                    <Route exact path={routes.compra_cuentaporpagar_reporte} render={props => <Reporte_CompraCuentaPorPagar { ...props} /> } />
                                    <Route exact path={routes.compra_pagorealizado_reporte} render={props => <Reporte_CompraPagoRealizado { ...props} /> } />
                                    <Route exact path={routes.compra_proveedor_reporte} render={props => <Reporte_Proveedor { ...props} /> } />


                                    <Route exact path={routes.proforma_index} render={props => <IndexProforma { ...props} /> } />
                                    <Route exact path={routes.proforma_create} render={props => <CreateProforma { ...props} /> } />
                                    <Route exact path={routes.proforma_show + '/:id'} render={props => <ShowProforma { ...props} /> } />

                                    <Route exact path={routes.cobranza_index} render={props => <IndexCobranza { ...props} /> } />
                                    <Route exact path={routes.cobranza_create} render={props => <CreateCobranza { ...props} /> } />
                                    <Route exact path={routes.cobranza_show + '/:id'} render={props => <ShowCobranza { ...props} /> } />

                                    <Route exact path={routes.comision_index} render={props => <IndexComision { ...props} /> } />
                                    <Route exact path={routes.comision_create} render={props => <CrearComisionVenta { ...props} /> } />
                                    <Route exact path={routes.comision_edit + '/:id'} render={props => <EditarComisionVenta { ...props} /> } />


                                    <Route exact path={routes.reporte_vehiculo} render={props => <Reporte_Vehiculo { ...props} /> } />

                                    <Route exact path={routes.reporte_producto} render={props => <Reporte_Producto { ...props} /> } />
                                    <Route exact path={routes.reporte_kardexproducto} render={props => <Reporte_kardexProducto { ...props} /> } />

                                    <Route exact path={routes.reporte_venta} render={props => <Reporte_Venta { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_detalle} render={props => <Reporte_Venta_Detalle { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_por_cobrar} render={props => <Reporte_Por_Cobrar { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_cobro} render={props => <Reporte_Venta_Cobro { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_historico_vehiculo} render={props => <Reporte_Venta_Historico_Vehiculo { ...props} /> } />
                                    <Route exact path={routes.reporte_cliente} render={props => <Reporte_Cliente { ...props} /> } />
                                    <Route exact path={routes.reporte_comision_vendedor} render={props => <Reporte_Comision_Por_Vendedor { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_por_producto} render={props => <Reporte_Venta_Por_Producto { ...props} /> } />
                                    <Route exact path={routes.reporte_venta_factura_all} render={props => <Reporte_Venta_Factura { ...props} /> } />

                                    <Route exact path={routes.reporte_librodeventa} render={props => <Reporte_LibroVenta { ...props} /> } />

                                    {/* Modulo Restaurant */}

                                    <Route exact path={routes.restaurant_venta_index} render={props => <Restaurant_Venta_Index { ...props} /> } />
                                    <Route exact path={routes.restaurant_venta_create} render={props => <Restaurant_Venta_Create { ...props} /> } />


                                </Switch>
                            </AppMain>
                            </LocaleProvider>
                        </Route>
                    </Switch>
                </BrowserRouter>
        );
    }
}

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}


