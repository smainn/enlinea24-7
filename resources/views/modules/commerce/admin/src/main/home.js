
import React, { Component, Fragment } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
const {Option} = Select;
import axios from 'axios';
import ws from '../../tools/webservices';
import { httpRequest, removeAllData, readData } from '../../tools/toolsStorage';
import routes from '../../tools/routes';
import keysStorage from '../../tools/keysStorage';
import { Pagination, Modal, Table, message, Result } from 'antd';
import Input from '../../components/input';
import keys from '../../tools/keys';
import { readPermisions } from '../../tools/toolsPermisions';


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noSesion: false,
            value: '',
            valuedate: '',
            valueselect: '',
            tipoClientes: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            tipoClientesDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            modalNuevo: false,
            modalEditar: false,
            idTipoCliente: 0,
            descripcion: '',
            timeoutSearch: undefined,
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
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.tipocliente_btn_nuevo),
            btn_editar: readPermisions(keys.tipocliente_btn_editar),
            btn_eliminar: readPermisions(keys.tipocliente_btn_eliminar),
            descripcion: readPermisions(keys.tipocliente_input_descripcion)
        }
        this.modalTipoClienteNuevo = this.modalTipoClienteNuevo.bind(this);
        this.modalTipoClienteEditar = this.modalTipoClienteEditar.bind(this);
        this.changePaginationTipoCliente = this.changePaginationTipoCliente.bind(this);
    }


    componentDidMount() {
        this.inSession();
        this.getTipoClientes();
    }

    getTipoClientes(){
        httpRequest('get', ws.wsGetTipoClientes)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    storeTipoCliente(nombre){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        }
        httpRequest('post', ws.wsTipoClientes, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    tipoClientes: datosTipoClientes,
                    pagination: result.pagination,
                    descripcion: '',
                    pagina: 1,
                })
                message.success('Se guardo correctamente el tipo de cliente');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTipoCliente(id){
        this.setState({
            idTipoCliente: id,
        });
        httpRequest('get', ws.wsTipoClientes + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idTipoCliente: id,
                    descripcion: result.data.descripcion,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateTipoCliente(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        };
        httpRequest('put', ws.wsTipoClientes + '/' + this.state.idTipoCliente, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente el tipo de cliente');
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    modalEditar: false,
                    tipoClientes: datosTipoClientes,
                    pagination: result.pagination,
                    descripcion : '',
                    pagina: 1,
                })

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteTipoCliente(id){
        httpRequest('delete', ws.wsTipoClientes + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente el tipo de cliente');
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: 1,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.warning('No se puede eliminar porque ya esta en uso')
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        });
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Tipo de Cliente',
            content: '¿Estas seguro de eliminar el tipo de cliente?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteTipoCliente(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    changePaginationTipoCliente(page){
        httpRequest('get', ws.wsGetTipoClientes + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: page,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    searchTipoCliente(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsBusquedaTipoCliente + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosTipoClientes = [];
                    for (let i = 0; i < data.length; i++) {
                        datosTipoClientes.push({
                            id: data[i].idclientetipo,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                        });
                    }
                    this.setState({
                        tipoClientes: datosTipoClientes,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                tipoClientes: this.state.tipoClientesDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationTipoCliente(cantidad){
        httpRequest('get', ws.wsCantidadPaginacionTipoCliente + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    validarDatos(){
        if(this.state.descripcion.length === 0){
            message.warning('El campo nombre es hobligatorio');
            return false;
        }
        return true;
    }

    closeModalNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
        });
    }

    closeModalEditar(){
        this.setState({
            modalEditar: false,
            descripcion: '',
        });
    }

    onChangeDescripcion(event){
        this.setState({
            descripcion: event,
        })
    }

    handleSearchTipoCliente(event){
        let value = event.target.value;
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchTipoCliente(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePaginationTipoCliente(event){
        let value = parseInt(event.target.value);
        this.sizePaginationTipoCliente(value);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <a
                        onClick={() => this.setState({modalNuevo: true})}
                        className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </a>
                </div>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a
                    onClick={() => this.getTipoCliente(id)}
                    className="btns btns-sm btns-outline-primary"
                    >
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(data){
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a
                    onClick={() => this.showDeleteConfirm(this, data)}
                    className="btns btns-sm btns-outline-danger">
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    modalTipoClienteNuevo(){
        return(
            <Modal
                title="Nuevo Tipo de Cliente"
                visible={this.state.modalNuevo}
                onCancel={this.closeModalNuevo.bind(this)}
                closable={false}
                okText='Guardar'
                cancelText='Cancelar'
                onOk={this.storeTipoCliente.bind(this)}
            >
                <Input
                    title='Nombre'
                    value={this.state.descripcion}
                    onChange={this.onChangeDescripcion.bind(this)}
                />
            </Modal>
        );
    }

    modalTipoClienteEditar(){
        return(
            <Modal
                title="Actualizar Tipo de Cliente"
                visible={this.state.modalEditar}
                onCancel={this.closeModalEditar.bind(this)}
                closable={false}
                okText='Actualizar'
                cancelText='Cancelar'
                onOk={this.updateTipoCliente.bind(this)}
            >
                <Input
                    title='Nombre'
                    value={this.state.descripcion}
                    onChange={this.onChangeDescripcion.bind(this)}
                />
            </Modal>
        );
    }

    inSession() {
        let token = readData(keysStorage.token);
        let user = JSON.parse(readData(keysStorage.user));
        if ((token == null) || (typeof token == 'undefined') ||
            (user == null) || (typeof user == 'undefined')) {
            this.setState({ noSesion: true });

        } else {
            httpRequest('post', ws.wsverificarsesion, {
                id: user.idusuario,
                token: token,
            })
            .then((resp) => {
                if (resp.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
            .catch((error) => {
                console.log('ERROR ', error);
            })
        }

    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }
        const btnNuevo = this.btnNuevo();
        const modalTipoClienteNuevo = this.modalTipoClienteNuevo();
        const modalTipoClienteEditar = this.modalTipoClienteEditar();
        return (
            <div></div>
        );
    }
}

Home.propTypes = {
    title: PropTypes.string,
}

Home.defaultProps = {
    title: 'Caso Uso',
}


