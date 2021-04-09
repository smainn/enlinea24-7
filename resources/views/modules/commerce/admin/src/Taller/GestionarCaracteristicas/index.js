
import React, { Component, Fragment }  from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Select } from 'antd';
import ws from '../../../tools/webservices';
import Input from '../../../components/input';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes'
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import ReactDatatable from '@ashvin27/react-datatable';
import C_Input from '../../../components/data/input';
import Confirmation from '../../../components/confirmation';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

class IndexVehiculoCaracteristica extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehiculoCarateristica: {
                idVehiculoCaracteristica: 0,
                caracteristica: ''
            },
            idEditar: 0,
            caracteristica: '',
            vehiculoCaracteristicas: [],
            modal: false,
            modalEditar: false,
            noSesion: false,
            visibleDelete: false,
            idEliminar: 0,
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            caracteristicasDefaults: [],
            paginacionDefaults: {},
            buscar: '',
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
            btn_nuevo: readPermisions(keys.vehcaracteristicas_btn_nuevo),
            btn_editar: readPermisions(keys.vehcaracteristicas_btn_editar),
            btn_eliminar: readPermisions(keys.vehcaracteristicas_btn_eliminar),
            nombre: readPermisions(keys.vehcaracteristicas_input_nombre)
        }
        this.handleCaracteristica = this.handleCaracteristica.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount(){
        this.getCharacteristics();
    }

    getCharacteristics(){
        httpRequest('get', ws.wsListCharacteristics)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    vehiculoCaracteristicas: datosCaracteristicas,
                    pagination: result.pagination,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={() => this.setState({modal: true})}
                    />
                </div>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a onClick={() => this.getCaracteristica(id)}
                    className="btns btns-sm btns-outline-primary"
                    >
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a onClick={() => this.showDeleteConfirm(this, data)}
                    className="btns btns-sm btns-outline-danger">
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    openModalCreate(){
        this.state.vehiculoCarateristica.caracteristica = ''
        this.setState({modal: true});
    }

    closeModalCreate(){
        this.state.vehiculoCarateristica.caracteristica = ''
        this.setState({
            modal: false,
            modalEditar: false
        });
    }

    handleCaracteristica(value){
        this.state.vehiculoCarateristica.caracteristica = value
        this.setState({vehiculoCarateristica: this.state.vehiculoCarateristica});
    }

    validarDatos(){
        if(this.state.vehiculoCarateristica.caracteristica.length === 0){
            message.warning('El campo nombre es hobligatorio');
            return false;
        }
        return true;
    }

    onChangePage(page){
        httpRequest('get', ws.wsListCharacteristics + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    vehiculoCaracteristicas: datosCaracteristicas,
                    caracteristicasDefaults: datosCaracteristicas,
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

    searchCaracteristica(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsBuscarCaracteristica + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosCaracteristicas = [];
                    for (let i = 0; i < data.length; i++) {
                        datosCaracteristicas.push({
                            id: data[i].idvehiculocaracteristica,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].caracteristica,
                        });
                    }
                    this.setState({
                        vehiculoCaracteristicas: datosCaracteristicas,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                vehiculoCaracteristicas: this.state.caracteristicasDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    handleSearchCaracteristica(value){
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchCaracteristica(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    sizePagination(cantidadPaginacion){
        httpRequest('get', ws.wsPaginacionVehiculoCaracteristica + '/' + cantidadPaginacion)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    nroPaginacion: cantidadPaginacion,
                    vehiculoCaracteristicas: datosCaracteristicas,
                    caracteristicasDefaults: datosCaracteristicas,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        });
    }

    onChangeSizePagination(value){
        this.sizePagination(value);
    }

    guardarCaracteristica(valor){
        if(!this.validarDatos()) return;
        let atributos = {
            caracteristica: this.state.vehiculoCarateristica.caracteristica,
        };
        httpRequest('post', ws.wsListCharacteristics, atributos)
        .then((result) => {
            if (result.response > 0) {
                this.state.vehiculoCarateristica.caracteristica = ''
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    modal: false,
                    vehiculoCaracteristicas: datosCaracteristicas,
                    pagination: result.pagination,
                    vehiculoCarateristica: this.state.vehiculoCarateristica
                })
                message.success('Se guardo correctamente el producto');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
    }

    getCaracteristica(id){
        this.setState({
            idEditar: id
        })
        httpRequest('get', ws.wsListCharacteristics + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                let objeto = {
                    idVehiculoCaracteristica: id,
                    caracteristica: result.data.caracteristica
                }
                this.setState({
                    modalEditar: true,
                    vehiculoCarateristica: objeto
                })
            }
        })
    }

    actualizarCaracteristica(valor){
        if(!this.validarDatos()) return;
        let atributos = {
            caracteristica: this.state.vehiculoCarateristica.caracteristica,
        };
        httpRequest('put', ws.wsListCharacteristics + '/' + this.state.idEditar, atributos)
        .then((result) => {
            if (result.response == 1) {
                this.state.vehiculoCarateristica.caracteristica = ''
                message.success('Se actualizo correctamente el producto');
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    modalEditar: false,
                    vehiculoCaracteristicas: datosCaracteristicas,
                    pagination: result.pagination,
                    vehiculoCarateristica: this.state.vehiculoCarateristica
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

    showDeleteConfirm(thisContex,item) {
        console.log(item);
        Modal.confirm({
            title: 'Elimiar caracteristica',
            content: '¿Estas seguro de eliminar la caracteristica?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                thisContex.eliminarCaracteristica(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    eliminarCaracteristica(id){
        httpRequest('delete', ws.wsListCharacteristics + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente');
                let data = result.data;
                let datosCaracteristicas = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicas.push({
                        id: data[i].idvehiculocaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].caracteristica,
                    });
                }
                this.setState({
                    vehiculoCaracteristicas: datosCaracteristicas,
                    pagination: result.pagination,
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
        })
    }

    modal(){
        return(
            <Confirmation
                visible={this.state.modal}
                title="Nueva Caracteristica"
                loading={false}
                onCancel={this.closeModalCreate.bind(this)}
                onClick={this.guardarCaracteristica.bind(this)}
                content = {[
                    <C_Input
                        key = {0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.vehiculoCarateristica.caracteristica}
                        onChange={this.handleCaracteristica}
                        permisions={this.permisions.nombre}
                    />
                ]}
            />
        );
    }

    modalEditar(){
        return(
            <Confirmation
                visible={this.state.modalEditar}
                title="Actualizar Caracteristica"
                loading={false}
                onCancel={this.closeModalCreate.bind(this)}
                onClick={this.actualizarCaracteristica.bind(this)}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.vehiculoCarateristica.caracteristica}
                        onChange={this.handleCaracteristica}
                        permisions={this.permisions.nombre}
                    />
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modal = this.modal();
        const modalEditar = this.modalEditar();
        return (
            <div className="rows">
                { modal }
                { modalEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Caracteristicas de Vehiculo</h1>
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
                                onChange={this.handleSearchCaracteristica.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.vehiculoCaracteristicas}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {1}
                            current = {this.state.pagina}
                            defaultPageSize = {this.state.nroPaginacion}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.onChangePage}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
         );
    }
}

export default IndexVehiculoCaracteristica;
