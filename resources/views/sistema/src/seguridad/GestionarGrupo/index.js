
import React, { Component, Fragment } from 'react';
import { Link, Redirect,withRouter } from 'react-router-dom';
import Input from '../../componentes/input';
import Confirmation from '../../componentes/confirmation';
import { message, Table, Pagination, Select } from 'antd';
import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';
import keysStorage from '../../utils/keysStorage';
import C_Button from '../../componentes/data/button';
import ws from '../../utils/webservices';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';

const { Option } = Select;

class IndexGrupoUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            buscar: '',
            visible: false,
            loadModal: false,
            id: 0,

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
            noSesion: false
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
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.estado.localeCompare(b.estado)}
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

        this.permisions = {
            btn_nuevo: readPermisions(keys.grupo_usuario_btn_nuevo),
            btn_editar: readPermisions(keys.grupo_usuario_btn_editar),
            btn_eliminar: readPermisions(keys.grupo_usuario_btn_eliminar),
            btn_ver: readPermisions(keys.grupo_usuario_btn_ver)
        }
    }

    onCreateData() {
        var url = routes.grupo_usuario_create;
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
                <Link  to={routes.grupo_usuario_edit + '/' + id}
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
        httpRequest('get', ws.wsgrupousuario + '?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion + '&iduser=' + id)
        .then(result => {
                if (result.response == 0) {
                    console.log('error en la conexion');
                } else if (result.response == 1) {
                    console.log(result)
                    var data = result.data.data;
                
                    var array = [];
                    for (let i = 0; i < data.length; i++) {
                        array.push({
                            id: data[i].idgrupousuario,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].nombre,
                            estado: data[i].estado == 'A' ? 'Activo' : 'Desactivo',
                        });
                    }

                    this.setState({
                        data: array,
                        pagination: result.pagination,
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
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.getGrupoUsuario(1, event, this.state.nroPaginacion), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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
        httpRequest('post', ws.wsgrupousuariodel, formdata)
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
    onChangePaginate(page) {
        this.getGrupoUsuario(page, this.state.buscar, this.state.nroPaginacion);
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
        });
        this.getGrupoUsuario(1, this.state.buscar, value);
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

export default withRouter(IndexGrupoUsuario);
