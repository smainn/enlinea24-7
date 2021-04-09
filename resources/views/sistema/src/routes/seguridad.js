

import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import routes from '../utils/routes';

import IndexUsuario from '../seguridad/GestionarUsuario/index';
import CrearUsuario from '../seguridad/GestionarUsuario/crear';
import EditarUsuario from '../seguridad/GestionarUsuario/editar';
import ShowUsuario from '../seguridad/GestionarUsuario/show';

import IndexGrupoUsuario from '../seguridad/GestionarGrupo/index';
import CrearGrupoUsuario from '../seguridad/GestionarGrupo/crear';
import EditarGrupoUsuario from '../seguridad/GestionarGrupo/editar';

import AsignarPrivilegio from '../seguridad/AsignarPermiso/asignar';
import ActivarPrivilegio from '../seguridad/AsignarPermiso/activar';

import UsuariosConectados from '../seguridad/UsuariosConectados/index';

import Log_Del_Sistema from '../seguridad/GestionarUsuario/log_sistema';

class Route_Seguridad extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Switch>

                <Route exact path={routes.usuario_index}         render={props => <IndexUsuario {...props}/>} />
                <Route exact path={routes.usuario_create}        render={props => <CrearUsuario {...props}/>} />
                <Route exact path={routes.usuario_edit + '/:id'} render={props => <EditarUsuario {...props}/>} />
                <Route exact path={routes.usuario_show + '/:id'} render={props => <ShowUsuario {...props}/>} />

                <Route exact path={routes.grupo_usuario_index}         render={props => <IndexGrupoUsuario {...props}/>} />
                <Route exact path={routes.grupo_usuario_create}        render={props => <CrearGrupoUsuario {...props}/>} />
                <Route exact path={routes.grupo_usuario_edit + '/:id'} render={props => <EditarGrupoUsuario {...props}/>} />

                <Route exact path={routes.asignar_permiso} render={props => <AsignarPrivilegio {...props}/>} />
                <Route exact path={routes.activar_permiso} render={props => <ActivarPrivilegio {...props}/>} />

                <Route exact path={routes.usuarios_online} render={props => <UsuariosConectados {...props}/>} />

                <Route exact path={routes.log_sistema} render={props => <Log_Del_Sistema {...props}/>} />

            </Switch>
        );
    }
}

export default withRouter(Route_Seguridad);
