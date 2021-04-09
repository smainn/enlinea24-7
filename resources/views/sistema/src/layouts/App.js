
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import Sidebar from './partials/Sidebar';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from '../Home';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import CrearVehiculo from "../comercio/taller/GestionarVehiculo/crear";
import IndexVehiculo from "../comercio/taller/GestionarVehiculo";
import EditVehiculo from "../comercio/taller/GestionarVehiculo/editar";
import ReporteVehiculo from '../comercio/taller/GestionarVehiculo/reporte';

import IndexFamilia from "../comercio/almacen/GestionarFamilia";

import IndexCliente from '../comercio/ventas/GestionarCliente/index';
import CrearCliente from '../comercio/ventas/GestionarCliente/crear';
import EditarCliente from '../comercio/ventas/GestionarCliente/editar';

import IndexProducto from "../comercio/almacen/GestionarProducto";
import CrearProducto from "../comercio/almacen/GestionarProducto/crear";
import EditarProducto from "../comercio/almacen/GestionarProducto/editar";

import IndexParteVehiculo from "../comercio/taller/GestionarParteVehiculo";

import IndexVehiculoHistoria from '../comercio/taller/GestionarVehiculoHistoria';
import CrearVehiculoHistoria from '../comercio/taller/GestionarVehiculoHistoria/crear';
import EditVehiculoHistoria from '../comercio/taller/GestionarVehiculoHistoria/editar';

import IndexVenta from "../comercio/ventas/GestionarVenta";
import CrearVenta from "../comercio/ventas/GestionarVenta/crear";
import EditarVenta from '../comercio/ventas/GestionarVenta/EditarVenta';
import ShowVenta from '../comercio/ventas/GestionarVenta/show';

import IndexVendedor from "../comercio/ventas/Vendedor";
import CreateVendedor from "../comercio/ventas/Vendedor/crear";
import EditVendedor from "../comercio/ventas/Vendedor/editar";

import IndexListaPrecio from "../comercio/almacen/ListaPrecios";
import CreateListaPrecio from "../comercio/almacen/ListaPrecios/crear";
import EditListaPrecio from "../comercio/almacen/ListaPrecios/editar";

import IndexIngresoProducto from '../comercio/almacen/GestionarIngresoPro';
import CreateIngresoProducto from '../comercio/almacen/GestionarIngresoPro/crear';
import EditIngresoProducto from '../comercio/almacen/GestionarIngresoPro/editar';

import IndexSalidaProducto from '../comercio/almacen/GestionarSalidaPro';
import CreateSalidaProducto from '../comercio/almacen/GestionarSalidaPro/crear';
import EditSalidaProducto from '../comercio/almacen/GestionarSalidaPro/editar';

import IndexProveedor from '../comercio/compras/GestionarProveedor';
import CrearProveedor from '../comercio/compras/GestionarProveedor/crear';
import EditarProveedor from '../comercio/compras/GestionarProveedor/editar';

import IndexCompra from '../comercio/compras/GestionarCompra';
import CreateCompra from '../comercio/compras/GestionarCompra/crear';
import EditCompra from '../comercio/compras/GestionarCompra/EditCompra';
import ShowCompra from '../comercio/compras/GestionarCompra/show';

import IndexCobranza from '../comercio/ventas/GestionarCobranza';
import CreateCobranza from '../comercio/ventas/GestionarCobranza/crear';
import EditCobranza from '../comercio/ventas/GestionarCobranza/EditCobranza';

import ReporteVenta from '../comercio/ventas/GestionarVenta/reporte';

import ShowCobranza from '../comercio/ventas/GestionarCobranza/show';

import IndexPagos from '../comercio/compras/GestionarPagos';
import CreatePagos from '../comercio/compras/GestionarPagos/crear';
import EditPagos from '../comercio/compras/GestionarPagos/EditPagos';
import ShowPagos from '../comercio/compras/GestionarPagos/show';

import IndexProforma from '../comercio/ventas/GestionarProforma';
import CreateProforma from '../comercio/ventas/GestionarProforma/crear';
import EditProforma from '../comercio/ventas/GestionarProforma/EditProforma';
import ShowProforma from '../comercio/ventas/GestionarProforma/show';

import IndexUsuario from '../seguridad/GestionarUsuario';
import CrearUsuario from '../seguridad/GestionarUsuario/crear';

import IndexGrupoUsuario from '../seguridad/GestionarGrupo';
import CrearGrupoUsuario from '../seguridad/GestionarGrupo/crear';

import AsignarPrivilegio from '../seguridad/AsignarPermiso/asignar';

/*import IndexInventarioCorte from '../Almacen/GestionarInventarioCorte';
import CreateInventarioCorte from '../Almacen/GestionarInventarioCorte/CreateInventarioCorte';
import EditInventarioCorte from '../Almacen/GestionarInventarioCorte/EditInventarioCorte';
import ShowInventarioCorte from '../Almacen/GestionarInventarioCorte/ShowInventarioCorte';
*/
import ReporteVentaPorCobrar from '../comercio/ventas/GestionarVenta/reporte/ventaPorCobrar';
import ReporteVentaPorCobrosRealizados from '../comercio/ventas/GestionarVenta/reporte/ventaPorCobros';
import IndexComision from '../comercio/ventas/GestionarComision';
import CrearComisionVenta from '../comercio/ventas/GestionarComision/crear';
import EditarComisionVenta from '../comercio/ventas/GestionarComision/editar';

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


