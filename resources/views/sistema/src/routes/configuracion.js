

import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import routes from '../utils/routes';

import IndexTipoMoneda from '../configuracion/GestionarTipoMoneda';

import IndexTipoCambio from '../configuracion/tipocambio';
import CrearTipoCambio from '../configuracion/tipocambio/crear';
import EditarTipoCambio from '../configuracion/tipocambio/editar';

import IndexSucursal from '../configuracion/sucursal';
import Crear_Sucursal from '../configuracion/sucursal/crear';
import Editar_Sucursal from '../configuracion/sucursal/editar';
import Show_Sucursal from '../configuracion/sucursal/show';

import IndexActividadEconomica from '../configuracion/actividadeconomica';

import IndexDosificacion from '../configuracion/dosificacion';
import Crear_Dosificacion from '../configuracion/dosificacion/crear';
import Editar_Dosificacion from '../configuracion/dosificacion/editar';

import IndexCertificacionSIN from '../configuracion/certificacion_sin';

class Route_Configuracion extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Switch>
                <Route exact path = {routes.tipo_moneda} render={ props => <IndexTipoMoneda {...props} />} />

                <Route exact path={routes.tipo_cambio + '/index'}    render={props => <IndexTipoCambio { ...props} /> } />
                <Route exact path={routes.tipo_cambio + '/create'}   render={props => <CrearTipoCambio { ...props} /> } />
                <Route exact path={routes.tipo_cambio + '/edit/:id'} render={props => <EditarTipoCambio { ...props} /> } />

                <Route exact path = {routes.sucursal_index}         render={props => <IndexSucursal {...props} />} />
                <Route exact path = {routes.sucursal_create}        render={props => <Crear_Sucursal {...props} />} />
                <Route exact path = {routes.sucursal_edit + '/:id'} render={props => <Editar_Sucursal {...props} />} />
                <Route exact path = {routes.sucursal_show + '/:id'} render={props => <Show_Sucursal {...props} />} />

                <Route exact path={routes.actividad_economica + '/index'} render={props => <IndexActividadEconomica {...props}/>} />

                <Route exact path={routes.dosificacion + '/index'}    render={props => <IndexDosificacion {...props}/>} />
                <Route exact path={routes.dosificacion + '/create'}   render={props => <Crear_Dosificacion {...props}/>} />
                <Route exact path={routes.dosificacion + '/edit/:id'} render={props => <Editar_Dosificacion {...props}/>} />

                <Route exact path={routes.certificacion_sin + '/index'} render={props => <IndexCertificacionSIN {...props}/>} />
            </Switch>
        );
    }
}

export default withRouter(Route_Configuracion);
