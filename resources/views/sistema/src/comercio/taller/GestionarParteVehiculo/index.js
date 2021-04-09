import React, { Component, Fragment } from 'react';
import { message, Modal, Spin, Icon, Table, Select, Pagination, Checkbox } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import Confirmation from '../../../componentes/confirmation';
import C_Button from '../../../componentes/data/button';
import C_CheckBox from '../../../componentes/data/checkbox';
import strings from '../../../utils/strings';
const {Option} = Select;

export default class IndexParteVehiculo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            vehiculoPartes: [],
            nroPagination: 10,
            noSesion: false,
            nroPaginacion: 10,
            pagination: {},
            paginacionDefaults: {},
            vehiculoPartesDefaults: [],
            pagina: 1,
            timeoutSearch: undefined,
            buscar: '',
            idVehiculoParte: 0,
            descripcion: '',
            modalNuevo: false,
            modalEditar: false,
            estado: false,
            modalCancel: false,
            idDelete: -1,
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
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
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
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.vehiculo_parte_btn_nuevo),
            btn_editar: readPermisions(keys.vehiculo_parte_btn_editar),
            btn_eliminar: readPermisions(keys.vehiculo_parte_btn_eliminar),
            input_descripcion: readPermisions(keys.vehiculo_parte_input_descripcion),
            checkbox_estado: readPermisions(keys.vehiculo_parte_checkbox_editar),
        }
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.changePaginationVehiculoParte = this.changePaginationVehiculoParte.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteVehiculoParte(this.state.idDelete);
        this.setState({
            modalCancel: false,
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false,
        })
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-primary hint--bottom hint--bottom"
                    aria-label="editar"
                    onClick={() => this.getVehiculoParte(id)}
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
                <a className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar"
                    onClick={() => this.setState({ modalCancel: true, idDelete: data }) }//this.showDeleteConfirm(this, data)}
                    >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={() => this.setState({modalNuevo: true})}
                    />
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getVehiculoPartes();
    }

    getVehiculoPartes(){
        httpRequest('get', ws.wsGetVehiculoPartes)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosVehiculoPartes = [];
                let estado;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosVehiculoPartes.push({
                        id: data[i].idvehiculopartes,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        descripcion: data[i].nombre,
                        estado: estado,
                    });
                }
                this.setState({
                    vehiculoPartes: datosVehiculoPartes,
                    vehiculoPartesDefaults: datosVehiculoPartes,
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
            message.error(strings.message_error);
        });
    }

    storeVehiculoParte(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        }
        httpRequest('post', ws.wsPartesVehiculos, atributos)
        .then((result) => {
            if (result.response == 1) {
                this.getVehiculoPartes();
                this.setState({
                    modalNuevo: false,
                    descripcion: '',
                    pagina: 1,
                })
                message.success('Se creo una parte nueva de vehiculo');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    getVehiculoParte(id){
        this.setState({
            idVehiculoParte: id,
        });
        httpRequest('get', ws.wsPartesVehiculos + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                let estado;
                if (result.data.estado === 'A') {
                    estado = true;
                }else{
                    estado = false;
                }
                this.setState({
                    modalEditar: true,
                    idVehiculoParte: id,
                    descripcion: result.data.nombre,
                    estado: estado,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    updateVehiculoParte(){
        if(!this.validarDatos()) return;
        let estado;
        if (this.state.estado == true) {
            estado = 'A';
        }else{
            estado = 'N';
        }
        let atributos = {
            descripcion: this.state.descripcion,
            estado: estado,
        };
        httpRequest('put', ws.wsPartesVehiculos + '/' + this.state.idVehiculoParte, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente la parte del vehiculo');
                this.getVehiculoPartes();
                this.setState({
                    modalEditar: false,
                    pagination: result.pagination,
                    descripcion: '',
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
            message.error(strings.message_error);
        })
    }

    deleteVehiculoParte(id){
        httpRequest('delete', ws.wsPartesVehiculos + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se ha eliminado la parte del vehiculo');
                this.getVehiculoPartes();
                this.setState({
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
            message.error(strings.message_error);
        });
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Parte de Vehículo',
            content: '¿Estas seguro de eliminar la parte del vehículo?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteVehiculoParte(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    changePaginationVehiculoParte(page){
        httpRequest('get', ws.wsGetVehiculoPartes + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let estado;
                let datosVehiculoPartes = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosVehiculoPartes.push({
                        id: data[i].idvehiculopartes,
                        nro: 10 * (page - 1) + i + 1,
                        descripcion: data[i].nombre,
                        estado: estado,
                    });
                }
                this.setState({
                    vehiculoPartes: datosVehiculoPartes,
                    vehiculoPartesDefaults: datosVehiculoPartes,
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
            message.error(strings.message_error);
        })
    }

    searchVehiculoParte(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsGetVehiculoParteBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosVehiculoPartes = [];
                    let estado;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].estado === 'A') {
                            estado = 'Activado';
                        }else{
                            estado = 'Desactivado';
                        }
                        datosVehiculoPartes.push({
                            id: data[i].idvehiculopartes,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            descripcion: data[i].nombre,
                            estado: estado,
                        });
                    }
                    this.setState({
                        vehiculoPartes: datosVehiculoPartes,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                vehiculoPartes: this.state.vehiculoPartesDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    handleSearchVehiculo(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchVehiculoParte(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    sizePaginationVehiculoParte(cantidad){
        httpRequest('get', ws.wsGetVehiculoPartePaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosVehiculoPartes = [];
                let estado;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosVehiculoPartes.push({
                        id: data[i].idvehiculopartes,
                        nro: i + 1,
                        descripcion: data[i].nombre,
                        estado: estado,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    vehiculoPartes: datosVehiculoPartes,
                    vehiculoPartesDefaults: datosVehiculoPartes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onChangeSizePaginationVehiculoParte(value){
        this.sizePaginationVehiculoParte(value);
    }

    validarDatos(){
        if(this.state.descripcion.length === 0){
            message.warning('El campo nombre es obligatorio');
            return false;
        }
        return true;
    }

    closeModalVehiculoParteNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
        });
    }

    closeModalVehiculoParteEditar(){
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

    onChangeEstado(event){
        this.setState({
            estado: event.target.checked,
        })
    }

    modalVehiculoParteNuevo(){
        return(
            <Confirmation
                visible={this.state.modalNuevo}
                title = "Nueva Parte de Vehículo"
                loading={false}
                onCancel={this.closeModalVehiculoParteNuevo.bind(this)}
                onClick={this.storeVehiculoParte.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.input_descripcion}
                    />
                ]}
            />
        );
    }

    modalVehiculoParteEditar(){
        return(
            <Confirmation
                visible={this.state.modalEditar}
                title = "Actualizar Parte de Vehículo"
                loading={false}
                onCancel={this.closeModalVehiculoParteEditar.bind(this)}
                onClick={this.updateVehiculoParte.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.input_descripcion}
                    />,
                    <div key = {1} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <C_CheckBox
                            onChange={this.onChangeEstado.bind(this)}
                            checked={this.state.estado} title='Estado'
                        />
                    </div>
                ]}
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
        const modalVehiculoParteNuevo = this.modalVehiculoParteNuevo();
        const modalVehiculoParteEditar = this.modalVehiculoParteEditar();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                { modalVehiculoParteNuevo }
                { modalVehiculoParteEditar }
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Parte de Vehiculo"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la Parte de Vehiculo?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Partes de Vehiculos</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationVehiculoParte.bind(this)}
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
                                onChange={this.handleSearchVehiculo.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.vehiculoPartes}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {1}
                            current = {this.state.pagina}
                            defaultPageSize = {this.state.nroPaginacion}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.changePaginationVehiculoParte}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
