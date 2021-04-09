
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Input from '../../componentes/input';
import Confirmation from '../../componentes/confirmation';
import { message, Table, Select, Pagination } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';
import keysStorage from '../../utils/keysStorage';
import C_Button from '../../componentes/data/button';
import ws from '../../utils/webservices';
import { convertYmdToDmyWithHour } from '../../utils/toolsDate';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';

const { Option } = Select;

class IndexUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            buscar: '',

            data: [],
            pagina: 1,
            nroPaginacion: 10,
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            timeoutSearch: undefined,
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

        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.email.localeCompare(b.email)}
            },
            {
                title: 'Usuario',
                dataIndex: 'usuario',
                key: 'usuario',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.usuario.localeCompare(b.usuario)}
            },
            {
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.estado.localeCompare(b.estado)}
            },
            {
                title: 'Ultimo Inicio',
                dataIndex: 'ultimoinicio',
                key: 'ultimoinicio',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.ultimoinicio.localeCompare(b.ultimoinicio)}
            },
            {
                title: 'Ultimo Cierre',
                dataIndex: 'ultimocierre',
                key: 'ultimocierre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.ultimocierre.localeCompare(b.ultimocierre)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
    }

    onCreateData() {
        var url = routes.usuario_create;
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
                <Link to={routes.usuario_show + '/' + id}
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
                <Link  to={routes.usuario_edit + '/' + id}
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
        this.getUsuario(1, '', 10);
    }

    getUsuario(page, buscar, nroPaginacion) {
        
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        httpRequest('get', ws.wsusuario + '?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion + '&iduser=' + id)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                var data = result.data.data;
                
                var array = [];
                for (let i = 0; i < data.length; i++) {
                    array.push({
                        id: data[i].idusuario,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].nombre,
                        email: data[i].email == null ? '' : data[i].email,
                        usuario: data[i].login,
                        estado: data[i].estado == 'A' ? 'Activo' : 'Desactivo',
                        ultimoinicio: convertYmdToDmyWithHour(data[i].lastlogin),
                        ultimocierre: convertYmdToDmyWithHour(data[i].lastlogout),
                    });
                }

                this.setState({
                    data: array,
                    pagination: result.pagination,
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
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.getUsuario(1, event, this.state.nroPaginacion), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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
        httpRequest('post', ws.wsusuariodelete, formdata)
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

    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
        });
        this.getUsuario(1, this.state.buscar, value);
    }
    onChangePaginate(page) {
        this.getUsuario(page, this.state.buscar, this.state.nroPaginacion);
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
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePagination.bind(this)}
                                title = 'Mostrar'
                                className = ''
                                style = {{ width: 65 }}
                                component = {[
                                    <Option key = {0} value = {10}>10</Option>,
                                    <Option key = {1} value = {25}>25</Option>,
                                    <Option key = {2} value = {50}>50</Option>,
                                    <Option key = {3} value = {100}>100</Option>,
                                ]}
                            />
                        </div>

                        <div className="pulls-right">
                            <C_Input
                                value={this.state.buscar}
                                onChange={this.onchangeBuscar.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.data}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {this.state.pagina}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.onChangePaginate.bind(this)}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexUsuario);
