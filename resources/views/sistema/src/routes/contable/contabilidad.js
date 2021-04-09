

import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import routes from '../../utils/routes';

import Plan_de_Cuenta from '../../contable/cuenta/plancuenta';

import IndexComprobante from '../../contable/comprobante';
import CreateComprobante from '../../contable/comprobante/create';
import EditComprobante from '../../contable/comprobante/edit';
import ShowComprobante from '../../contable/comprobante/show';

import IndexLibroDiario from '../../contable/librodiario';
import IndexLibroMayor from '../../contable/libro_mayor';

import IndexBalacenGeneral from '../../contable/balance_general';
import IndexEstadoResultado from '../../contable/estado_resultado';

import IndexCongifEERR from '../../contable/config_eerr';
import CreateCongifEERR from '../../contable/config_eerr/crear';
import EditarCongifEERR from '../../contable/config_eerr/editar';

import IndexBanco from '../../contable/banco';
import Index_centro_Costo from '../../contable/centro_costo';
import IndexTipoCentroCosto from '../../contable/tipo_costo';

import IndexTipoComprobante from '../../contable/tipocomprobante';
import CreateTipoComprobante from '../../contable/tipocomprobante/create';
import EditTipoComprobante from '../../contable/tipocomprobante/edit';

import IndexGestionPeriodo from '../../contable/gestion_periodo';
import CreateGestionPeriodo from '../../contable/gestion_periodo/crear';
import CreatePeriodo from '../../contable/gestion_periodo/periodo/crear';
import EditarGestionPeriodo from '../../contable/gestion_periodo/editar';
import EditarPeriodo from '../../contable/gestion_periodo/periodo/editar';

import PlantillaAsienAutom from '../../contable/plantilla_asien_autom';
import EditarPlantillaAsienAutom from '../../contable/plantilla_asien_autom/edit';

import CuentaAsienAutom from '../../contable/cuenta_asien_autom';

class Route_Contabilidad extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Switch>
                <Route exact path={routes.plan_de_cuenta_index} render={props => <Plan_de_Cuenta { ...props} /> } />

                <Route exact path={routes.comprobante_index}        render={props => <IndexComprobante { ...props} /> } />
                <Route exact path={routes.comprobante_create}       render={props => <CreateComprobante { ...props} /> } />
                <Route exact path={routes.comprobante_edit +'/:id'} render={props => <EditComprobante { ...props} /> } />
                <Route exact path={routes.comprobante_show +'/:id'} render={props => <ShowComprobante { ...props} /> } />

                <Route exact path={routes.libro_diario_index}     render={props => <IndexLibroDiario { ...props} /> } />
                <Route exact path={routes.libro_mayor_index}      render={props => <IndexLibroMayor { ...props} /> } />
                
                <Route exact path={routes.balance_general_index}  render={props => <IndexBalacenGeneral { ...props} /> } />
                <Route exact path={routes.estado_resultado_index} render={props => <IndexEstadoResultado { ...props} /> } />

                <Route exact path={routes.configeerr_index} render={props => <IndexCongifEERR { ...props} /> } />
                <Route exact path={routes.configeerr_create} render={props => <CreateCongifEERR { ...props} /> } />
                <Route exact path={routes.configeerr_edit + '/:id'} render={props => <EditarCongifEERR { ...props} /> } />

                <Route exact path={routes.banco_index} render={props => <IndexBanco { ...props} /> } />

                <Route exact path={routes.centrodecosto_index} render={props => <Index_centro_Costo { ...props} /> } />

                <Route exact path={routes.tipocentrocosto_index} render={props => <IndexTipoCentroCosto { ...props} /> } />

                <Route exact path={routes.comprobantetipo_index}         render={props => <IndexTipoComprobante { ...props} /> } />
                <Route exact path={routes.comprobantetipo_create}        render={props => <CreateTipoComprobante { ...props} /> } />
                <Route exact path={routes.comprobantetipo_edit + '/:id'} render={props => <EditTipoComprobante { ...props} /> } />

                <Route exact path={routes.gestion_periodo_index}                   render={props => <IndexGestionPeriodo { ...props} /> } />
                <Route exact path={routes.gestion_periodo_create}                  render={props => <CreateGestionPeriodo { ...props} /> } />
                <Route exact path={routes.gestion_periodo_create_periodo + '/:id'} render={props => <CreatePeriodo { ...props} /> } />
                <Route exact path={routes.gestion_periodo_editar + '/:id'}         render={props => <EditarGestionPeriodo { ...props} /> } />
                <Route exact path={routes.gestion_periodo_editar_periodo + '/:id'} render={props => <EditarPeriodo { ...props} /> } />

                <Route exact path={routes.plantilla_asien_autom + '/index'}    render={props => <PlantillaAsienAutom { ...props} /> } />
                <Route exact path={routes.plantilla_asien_autom + '/edit/:id'} render={props => <EditarPlantillaAsienAutom { ...props} /> } />

                <Route exact path={routes.cuenta_asien_autom + '/index'} render={props => <CuentaAsienAutom { ...props} /> } />
                
            </Switch>
        );
    }
}

export default withRouter(Route_Contabilidad);
