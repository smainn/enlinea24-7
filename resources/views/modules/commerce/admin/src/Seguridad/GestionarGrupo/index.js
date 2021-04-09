
import React, { Component } from 'react';
import { Link, Redirect,withRouter } from 'react-router-dom';
import Input from '../../../components/input';
import Confirmation from '../../../components/confirmation';
import { message } from 'antd';
import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';

class IndexGrupoUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            buscar: '',
            visible: false,
            loadModal: false,
            id: 0,

            data: [],
            noSesion: false
        }

        this.permisions = {
            btn_nuevo: readPermisions(keys.grupo_usuario_btn_nuevo),
            btn_editar: readPermisions(keys.grupo_usuario_btn_editar),
            btn_eliminar: readPermisions(keys.grupo_usuario_btn_eliminar),
            btn_ver: readPermisions(keys.grupo_usuario_btn_ver)
        }
    }

    onCreateData() {
        var url = "/commerce/admin/grupo-usuario/create";
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button 
                        title='Nuevo'
                        type='primary'
                        onClick={this.onCreateData.bind(this)}
                    />
                </div>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={"/commerce/admin/grupo-usuario/edit/" + id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar) {
            return (
                <a className="btns btns-sm btns-outline-danger"
                    onClick={this.onDeleteGrupo.bind(this, id)}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    btnVer() {
        if (this.permisions.btn_ver) {

        }
        return null;
    }

    componentDidMount() {
        this.getGrupoUsuario(1, '', 5);
    }

    getGrupoUsuario(page, buscar, nroPaginacion) {
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?'':key.idusuario;
        httpRequest('get', '/commerce/api/grupousuario?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion + '&iduser=' + id)
        .then(result => {
                if (result.response == 0) {
                    console.log('error en la conexion');
                } else if (result.response == 1) {
                    this.setState({
                        data: result.data.data,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
        })
        .catch(
            error => console.log(error)
        );
    }

    onchangeBuscar(event) {
        this.setState({
            buscar: event,
        });
    }
    
    onDeleteGrupo(id) {
        this.setState({
            visible: true,
            id: id,
        });
    }
    handleCancelar() {
        this.setState({
            visible: false,
            loadModal: false,
            id: 0,
        });
    }
    onDelete(event) {
        event.preventDefault();
        const formdata = {
            id: this.state.id,
        }
        this.setState({
            loadModal: true,
        });
        httpRequest('post', '/commerce/api/grupousuario/delete', formdata)
        .then(result => {
                if (result.response == 1) {
                    this.handleCancelar();
                    message.warning(result.message);
                }
                if (result.response == 2) {
                    this.handleCancelar();
                    this.getGrupoUsuario(1, '', 5);
                    message.success(result.message);
                }
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    componentShowDelete() {
        return (
            <Confirmation
                visible={this.state.visible}
                loading={this.state.loadModal}
                onCancel={this.handleCancelar.bind(this)}
                title='Eliminar Grupo Usuario'
                onClick={this.onDelete.bind(this)}
                content='¿Estas seguro de eliminar...?'
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const btnNuevo = this.btnNuevo();
        const componentShowDelete = this.componentShowDelete();
        return (
            <div className="rows">
                {componentShowDelete}
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Grupo Usuario</h1>
                    </div>
                    { btnNuevo }

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>

                                </select>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <Input 
                                value={this.state.buscar}
                                onChange={this.onchangeBuscar.bind(this)}
                                title='Search...'
                            />
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="tabless">

                            <table className="tables-respons">

                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.data.map(
                                        (resultado, key) => (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{resultado.nombre}</td>
                                                <td>{(resultado.estado == 'A')?'Habilitado':'Deshabilitado'}</td>
                                                <td>
                                                    { this.btnEditar(resultado.idgrupousuario) }
                                                    
                                                    { this.btnEliminar(resultado.idgrupousuario) }

                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(IndexGrupoUsuario);
