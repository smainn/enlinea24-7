
import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Input from '../../../components/input';
import Table from '../../../components/table';
import Confirmation from '../../../components/confirmation';
import { message } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';

class IndexUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            buscar: '',

            data: [],
            visible: false,
            loadModal: false,
            id: 0,
            noSesion: false
        }

        this.permisions = {
            btn_nuevo: readPermisions(keys.usuario_btn_nuevo),
            btn_ver: readPermisions(keys.usuario_btn_ver),
            btn_editar: readPermisions(keys.usuario_btn_editar),
            btn_eliminar: readPermisions(keys.usuario_btn_eliminar)
        }
    }

    onCreateData() {
        var url = "/commerce/admin/usuario/create";
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

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link to={'/commerce/admin/usuario/show/' + id}
                    className="btns btns-sm btns-outline-success"
                    >
                    <i className="fa fa-eye"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={"/commerce/admin/usuario/edit/" + id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger"
                    onClick={this.onDeleteUsuario.bind(this, id)}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getUsuario(1, '', 5);
    }

    getUsuario(page, buscar, nroPaginacion) {
        
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        httpRequest('get', '/commerce/api/usuario?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion + '&iduser=' + id)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                this.setState({
                    data: result.data.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
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

    onDeleteUsuario(id) {
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
        httpRequest('post', '/commerce/api/usuario/delete', formdata)
        .then(result => {
                if (result.response == 1) {
                    this.getUsuario(1, '', 5);
                    message.success('exito en eliminar');
                } else if (result.response == 2) {
                    message.warning('El usuario pertenece a un grupo y no puede eliminar');
                }  else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
                this.handleCancelar();
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
                title='Eliminar Usuario'
                onClick={this.onDelete.bind(this)}
                content='¿Estas seguro de eliminar...?'
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const btnNuevo = this.btnNuevo();
        const componentShowDelete = this.componentShowDelete();
        return (
            <div className="rows">
                {componentShowDelete}
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Usuario</h1>
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
                                        <th>Email</th>
                                        <th>Usuario</th>
                                        <th>Estado</th>
                                        <th>Ultimo Inicio</th>
                                        <th>Ultimo Cierre</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.data.map(
                                        (resultado, key) => (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{resultado.nombre}</td>
                                                <td>{resultado.email}</td>
                                                <td>{resultado.login}</td>
                                                <td>
                                                    {(resultado.estado == 'A')?
                                                        <label>Activo</label>:
                                                        <label>No activo</label>
                                                    }
                                                </td>
                                                <td>{resultado.lastlogin}</td>
                                                <td>{resultado.lastlogout}</td>
                                                <td>
                                                    
                                                    { this.btnVer(resultado.idusuario) }
                                                    
                                                    { this.btnEditar(resultado.idusuario) }
                                                    
                                                    { this.btnEliminar(resultado.idusuario) }

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

export default withRouter(IndexUsuario);
