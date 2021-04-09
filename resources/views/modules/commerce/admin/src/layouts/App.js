
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import Sidebar from './partials/Sidebar';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from '../Home';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import CrearVehiculo from "../Taller/GestionarVehiculo/crear";
import IndexVehiculo from "../Taller/GestionarVehiculo";
import EditVehiculo from "../Taller/GestionarVehiculo/editar";
import ReporteVehiculo from '../Taller/GestionarVehiculo/reporte';

import IndexFamilia from "../Almacen/GestionarFamilia";

import IndexCliente from '../Venta/GestionarCliente/index';
import CrearCliente from '../Venta/GestionarCliente/crear';
import EditarCliente from '../Venta/GestionarCliente/editar';

import IndexProducto from "../Almacen/GestionarProducto";
import CrearProducto from "../Almacen/GestionarProducto/crear";
import EditarProducto from "../Almacen/GestionarProducto/editar";

import IndexParteVehiculo from "../Taller/GestionarParteVehiculo";

import IndexVehiculoHistoria from '../Taller/GestionarVehiculoHistoria';
import CrearVehiculoHistoria from '../Taller/GestionarVehiculoHistoria/crear';
import EditVehiculoHistoria from '../Taller/GestionarVehiculoHistoria/editar';

import IndexVenta from "../Venta/GestionarVenta";
import CrearVenta from "../Venta/GestionarVenta/crear";
import EditarVenta from '../Venta/GestionarVenta/EditarVenta';
import ShowVenta from '../Venta/GestionarVenta/show';

import IndexVendedor from "../Venta/Vendedor";
import CreateVendedor from "../Venta/Vendedor/crear";
import EditVendedor from "../Venta/Vendedor/editar";

import IndexListaPrecio from "../Almacen/ListaPrecios";
import CreateListaPrecio from "../Almacen/ListaPrecios/crear";
import EditListaPrecio from "../Almacen/ListaPrecios/editar";

import IndexIngresoProducto from '../Almacen/GestionarIngresoPro';
import CreateIngresoProducto from '../Almacen/GestionarIngresoPro/crear';
import EditIngresoProducto from '../Almacen/GestionarIngresoPro/editar';

import IndexSalidaProducto from '../Almacen/GestionarSalidaPro';
import CreateSalidaProducto from '../Almacen/GestionarSalidaPro/crear';
import EditSalidaProducto from '../Almacen/GestionarSalidaPro/editar';

import IndexProveedor from '../Compra/GestionarProveedor';
import CrearProveedor from '../Compra/GestionarProveedor/crear';
import EditarProveedor from '../Compra/GestionarProveedor/editar';

import IndexCompra from '../Compra/GestionarCompra';
import CreateCompra from '../Compra/GestionarCompra/crear';
import EditCompra from '../Compra/GestionarCompra/EditCompra';
import ShowCompra from '../Compra/GestionarCompra/show';

import IndexCobranza from '../Venta/GestionarCobranza';
import CreateCobranza from '../Venta/GestionarCobranza/crear';
import EditCobranza from '../Venta/GestionarCobranza/EditCobranza';

import ReporteVenta from '../Venta/GestionarVenta/reporte';

import ShowCobranza from '../Venta/GestionarCobranza/show';

import IndexPagos from '../Compra/GestionarPagos';
import CreatePagos from '../Compra/GestionarPagos/crear';
import EditPagos from '../Compra/GestionarPagos/EditPagos';
import ShowPagos from '../Compra/GestionarPagos/show';

import IndexProforma from '../Venta/GestionarProforma';
import CreateProforma from '../Venta/GestionarProforma/crear';
import EditProforma from '../Venta/GestionarProforma/EditProforma';
import ShowProforma from '../Venta/GestionarProforma/show';

import IndexUsuario from '../Seguridad/GestionarUsuario';
import CrearUsuario from '../Seguridad/GestionarUsuario/crear';

import IndexGrupoUsuario from '../Seguridad/GestionarGrupo';
import CrearGrupoUsuario from '../Seguridad/GestionarGrupo/crear';

import AsignarPrivilegio from '../Seguridad/AsignarPermiso/asignar';

/*import IndexInventarioCorte from '../Almacen/GestionarInventarioCorte';
import CreateInventarioCorte from '../Almacen/GestionarInventarioCorte/CreateInventarioCorte';
import EditInventarioCorte from '../Almacen/GestionarInventarioCorte/EditInventarioCorte';
import ShowInventarioCorte from '../Almacen/GestionarInventarioCorte/ShowInventarioCorte';
*/
import ReporteVentaPorCobrar from '../Venta/GestionarVenta/reporte/ventaPorCobrar';
import ReporteVentaPorCobrosRealizados from '../Venta/GestionarVenta/reporte/ventaPorCobros';
import IndexComision from '../Venta/GestionarComision';
import CrearComisionVenta from '../Venta/GestionarComision/crear';
import EditarComisionVenta from '../Venta/GestionarComision/editar';

export default class App extends Component{
    render(){
        return (
            
            <Router>
                <div>
                        <div className="container body">
                            <div className="main_container">
                                
                                <Sidebar />

                                <Header />

                                <div className="right_col" role="main">

                                    <Route exact path="/commerce/admin/indexUsuario/" render={ () => <IndexUsuario /> } />
                                    <Route exact path="/commerce/admin/indexUsuario/nuevo" render={ () => <CrearUsuario /> } />

                                    <Route exact path="/commerce/admin/indexGrupo/" render={ () => <IndexGrupoUsuario /> } />
                                    <Route exact path="/commerce/admin/indexGrupo/nuevo" render={ () => <CrearGrupoUsuario /> } />

                                    <Route exact path="/commerce/admin/asignar/" render={ () => <AsignarPrivilegio /> } />
                                
                                    <Route exact path="/commerce/admin/indexVehiculo" render={() => <IndexVehiculo />} />

                                    <Route exact path="/commerce/admin/indexParteVehiculo/" render={() => <IndexParteVehiculo /> } />

                                    
                                    <Route exact path="/commerce/admin/index" render={() => <IndexProveedor /> } />
                                    <Route exact path="/commerce/admin/indexProveedor/nuevo/crearProveedor" render={() => <CrearProveedor />} />
                                    <Route exact path="/commerce/admin/indexProveedor/actualizar/:id" component={EditarProveedor} />

                                    <Route exact path="/commerce/admin/comision/" render={() => <IndexComision /> } />
                                    <Route exact path="/commerce/admin/comision/nuevo" render={() => <CrearComisionVenta /> } />
                                    <Route exact path="/commerce/admin/comision/editar/:id" render={ props => <EditarComisionVenta {...props} />} />

                                    <Route exact path="/commerce/admin/indexVehiculoHistoria/" render={() => <IndexVehiculoHistoria /> } />
                                    <Route exact path="/commerce/admin/indexVehiculoHistoria/nuevo" render={() => <CrearVehiculoHistoria />} />
                                    <Route exact path="/commerce/admin/indexVehiculoHistoria/actualizar/:id" render={ props => <EditVehiculoHistoria {...props} />} />

                                    <Route exact path="/commerce/admin/indexCliente/" component={IndexCliente} />


                                    <Route exact path="/commerce/admin/indexVenta/" component={IndexVenta}/>
                                    <Route exact path="/commerce/admin/indexVenta/nuevo/crearVenta" component={CrearVenta}/>
                                    <Route path="/commerce/admin/indexVenta/editar/:id" exact render={props => <EditarVenta {...props}/>}/>
                                    <Route exact path="/commerce/admin/indexVenta/show/:id"  render={props => <ShowVenta {...props}/>}/>
                                    
                                    <Route exact path="/commerce/admin/indexVenta/reporte" component={ReporteVenta} />
                                    <Route exact path="/commerce/admin/indexVenta/reporte-por-cobrar" component={ReporteVentaPorCobrar} />
                                    <Route exact path="/commerce/admin/indexVenta/reporte-de-cobros" component={ReporteVentaPorCobrosRealizados} />

                                    <Route exact path="/commerce/admin/" component={Home} />

                                    <Route exact path="/commerce/admin/indexVehiculo/nuevo/crearVehiculo" component={CrearVehiculo} />
                                    <Route exact path="/commerce/admin/indexCliente/nuevo/crearCliente" component={CrearCliente} />

                                    <Route exact path="/commerce/admin/indexVehiculo/actualizar/:id" component={EditVehiculo} />
                                    <Route path="/commerce/admin/indexCliente/editar/:datos" exact render={props => <EditarCliente {...props}/>}/>
                                  

                                    <Route exact path="/commerce/admin/indexFamilia/" component={IndexFamilia} />

                                    <Route exact path="/commerce/admin/indexProducto/" component={IndexProducto} />
                                    <Route exact path="/commerce/admin/indexProducto/nuevo/crearProducto" component={CrearProducto} />
                                    <Route exact path="/commerce/admin/indexVehiculo/reporte" component={ReporteVehiculo} />
                                    <Route exact path="/commerce/admin/indexProducto/editProducto/:id" component={EditarProducto} />

                                    <Route exact path="/commerce/admin/vendedor/indexVendedor/" component={IndexVendedor} />
                                    <Route exact path="/commerce/admin/vendedor/createVendedor" component={CreateVendedor} />
                                    <Route exact path="/commerce/admin/vendedor/editVendedor/:id" component={EditVendedor} />

                                    <Route exact path="/commerce/admin/listaprecio/indexListaPrecio/" component={IndexListaPrecio} />
                                    <Route exact path="/commerce/admin/listaprecio/createListaPrecio/" component={CreateListaPrecio} />
                                    <Route exact path="/commerce/admin/listaprecio/editListaPrecio/:id" component={EditListaPrecio} />

                                    <Route exact path="/commerce/admin/ingresoproducto/index" component={IndexIngresoProducto} />
                                    <Route exact path="/commerce/admin/ingresoproducto/create" component={CreateIngresoProducto} />
                                    <Route exact path="/commerce/admin/ingresoproducto/edit/:id" component={EditIngresoProducto} />

                                    <Route exact path="/commerce/admin/salidaprod/index" component={IndexSalidaProducto} />
                                    <Route exact path="/commerce/admin/salidaprod/create" component={CreateSalidaProducto} />
                                    <Route exact path="/commerce/admin/salidaprod/edit/:id" component={EditSalidaProducto} />
                                    
                                    <Route exact path="/commerce/admin/compra/index" component={IndexCompra} />
                                    <Route exact path="/commerce/admin/compra/create" component={CreateCompra} />
                                    <Route exact path="/commerce/admin/compra/edit/:id" component={EditCompra} />
                                    <Route exact path="/commerce/admin/compra/show/:id" component={ShowCompra} />

                                    <Route exact path="/commerce/admin/cobranza/index" component={IndexCobranza} />
                                    <Route exact path="/commerce/admin/cobranza/create" component={CreateCobranza} />
                                    <Route exact path="/commerce/admin/cobranza/edit/:id" component={EditCobranza} />
                                    <Route exact path="/commerce/admin/cobranza/show/:id" component={ShowCobranza} />

                                    <Route exact path="/commerce/admin/pagos/index" component={IndexPagos} />
                                    <Route exact path="/commerce/admin/pagos/create" component={CreatePagos} />
                                    <Route exact path="/commerce/admin/pagos/edit/:id" component={EditPagos} />
                                    <Route exact path="/commerce/admin/pagos/show/:id" component={ShowPagos} />

                                    <Route exact path="/commerce/admin/proforma/index" component={IndexProforma} />
                                    <Route exact path="/commerce/admin/proforma/create" component={CreateProforma} />
                                    <Route exact path="/commerce/admin/proforma/edit/:id" component={EditProforma} />
                                    <Route exact path="/commerce/admin/proforma/show/:id" component={ShowProforma} />

                                    {/*<Route exact path="/commerce/admin/inventariocorte/index" component={IndexInventarioCorte} />
                                    <Route exact path="/commerce/admin/inventariocorte/create" component={CreateInventarioCorte} />
                                    <Route exact path="/commerce/admin/inventariocorte/edit/:id" component={EditInventarioCorte} />
        <Route exact path="/commerce/admin/inventariocorte/show/:id" component={ShowInventarioCorte} />*/}
                               

                                </div>

                                

                            </div>
                        </div>
                </div>
            </Router>
        );
    }
}

if (document.getElementById('appInicio')) {
    ReactDOM.render(<App />, document.getElementById('appInicio'));
}


