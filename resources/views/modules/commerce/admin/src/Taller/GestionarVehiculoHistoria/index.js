import React, { Component, Fragment } from 'react';
import { message, Modal, Spin, Icon, Tooltip, Table, Select, Pagination } from 'antd';
import 'antd/dist/antd.css';
import ShowVehiculoHistoria from './ShowVehiculoHistoria';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {cambiarFormato} from '../../../tools/toolsDate'
import Confirmation from '../../../components/confirmation';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const {Option} = Select;

class IndexVehiculoHistoria extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loadModal: false,
            visible: false,
            bandera: 0,
            offset : 3,
            vehiculoHistoriaSeleccionado: [],
            noSesion: false,
            idVehiculoHistoria: 0,
            buscar: '',
            vehiculoHistoria: [],
            nroPaginacion: 10,
            pagination: {},
            paginacionDefaults: {},
            vehiculoHistoriaDefaults: [],
            pagina: 1,
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
                title: 'Fecha Recibida',
                dataIndex: 'fecharecibida',
                key: 'fecharecibida',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fecharecibida.localeCompare(b.fecharecibida)}
            },
            {
                title: 'Cliente',
                dataIndex: 'cliente',
                key: 'cliente',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.cliente.localeCompare(b.cliente)}
            },
            {
                title: 'Vehiculo',
                dataIndex: 'vehiculo',
                key: 'vehiculo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.vehiculo.localeCompare(b.vehiculo)}
            },
            {
                title: 'Proxima Fecha',
                dataIndex: 'proximafecha',
                key: 'proximafecha',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.proximafecha.localeCompare(b.proximafecha)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEditar(record)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_ver: readPermisions(keys.vehiculo_historia_btn_ver),
            btn_nuevo: readPermisions(keys.vehiculo_historia_btn_nuevo),
            btn_eliminar: readPermisions(keys.vehiculo_historia_btn_eliminar)
        }
        this.btnVer = this.btnVer.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.btnEditar = this.btnEditar.bind(this);
        this.changePaginationHistoriaVehiculo = this.changePaginationHistoriaVehiculo.bind(this);
    }

    componentDidMount() {
        this.getHistoriaVehiculos();
    }

    getHistoriaVehiculos(){
        httpRequest('get', ws.wsGetHistoriaVehiculos)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosHistoriaVehiculos = [];
                for (let i = 0; i < data.length; i++) {
                    let apellido = data[i].apellido == null ? '' : data[i].apellido;
                    datosHistoriaVehiculos.push({
                        id: data[i].idvehiculohistoria,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        fecharecibida: cambiarFormato(data[i].fecha),
                        cliente: data[i].nombre + ' ' + apellido,
                        vehiculo: data[i].descripcion + ' ' + data[i].placa,
                        fkidventa: data[i].fkidventa,
                        proximafecha: cambiarFormato(data[i].fechaproxima),
                    });
                }
                this.setState({
                    vehiculoHistoria: datosHistoriaVehiculos,
                    vehiculoHistoriaDefaults: datosHistoriaVehiculos,
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

    changePaginationHistoriaVehiculo(page){
        httpRequest('get', ws.wsGetHistoriaVehiculos + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosHistoriaVehiculos = [];
                for (let i = 0; i < data.length; i++) {
                    let apellido = data[i].apellido;
                    datosHistoriaVehiculos.push({
                        id: data[i].idvehiculohistoria,
                        nro: 10 * (page - 1) + i + 1,
                        fecharecibida: cambiarFormato(data[i].fecha),
                        cliente: data[i].nombre + ' ' + apellido,
                        vehiculo: data[i].descripcion + ' ' + data[i].placa,
                        fkidventa: data[i].fkidventa,
                        proximafecha: cambiarFormato(data[i].fechaproxima),
                    });
                }
                this.setState({
                    vehiculoHistoria: datosHistoriaVehiculos,
                    vehiculoHistoriaDefaults: datosHistoriaVehiculos,
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
        });
    }

    searchHistoriaVehiculo(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsGetHistoriaVehiculosBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosHistoriaVehiculos = [];
                    for (let i = 0; i < data.length; i++) {
                        let apellido = data[i].apellido == null ? '' : data[i].apellido;
                        datosHistoriaVehiculos.push({
                            id: data[i].idvehiculohistoria,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            fecharecibida: cambiarFormato(data[i].fecha),
                            cliente: data[i].nombre + ' ' + apellido,
                            vehiculo: data[i].descripcion + ' ' + data[i].placa,
                            fkidventa: data[i].fkidventa,
                            proximafecha: cambiarFormato(data[i].fechaproxima),
                        });
                    }
                    this.setState({
                        vehiculoHistoria: datosHistoriaVehiculos,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                vehiculoHistoria: this.state.vehiculoHistoriaDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    handleSearchHistoriaVehiculo(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchHistoriaVehiculo(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    sizePaginationHistoriaVehiculo(cantidad){
        httpRequest('get', ws.wsGetHistoriaVehiculosPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosHistoriaVehiculos = [];
                for (let i = 0; i < data.length; i++) {
                    let apellido = data[i].apellido == null ? '' : data[i].apellido;
                    datosHistoriaVehiculos.push({
                        id: data[i].idvehiculohistoria,
                        nro: i + 1,
                        fecharecibida: cambiarFormato(data[i].fecha),
                        cliente: data[i].nombre + ' ' + apellido,
                        vehiculo: data[i].descripcion + ' ' + data[i].placa,
                        fkidventa: data[i].fkidventa,
                        proximafecha: cambiarFormato(data[i].fechaproxima),
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    vehiculoHistoria: datosHistoriaVehiculos,
                    vehiculosDefaults: datosHistoriaVehiculos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    onChangeSizePaginationHistoriaVehiculo(value){
        this.sizePaginationHistoriaVehiculo(value);
    }

    showVehiculoHistoria(id) {
        var data = {
            'idVehiculoHistoria': id
        }
        httpRequest('post', '/commerce/admin/showVehiculoHistoria', data)
        .then(result =>{
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculoHistoriaSeleccionado: result.data,
                    visible: true,
                    bandera: 1,
                });
            }
        })
        .catch(
            error => {
                console.log(error);
            }
        )
    }

    handleCerrar() {
        this.setState({
            visible: false,
            bandera: 0,
            loadModal: false,
            idVehiculoHistoria: 0,
        });
    }

    getResultadoVehiculoHistoriaShow() {
        this.handleCerrar();
    }

    onChangeModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Modal
                    title='Datos de Vehiculo Historia'
                    visible={this.state.visible}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={800}
                    style={{'top': '20px'}}
                >
                    <ShowVehiculoHistoria
                        callback={this.getResultadoVehiculoHistoriaShow.bind(this)}
                        vehiculoHistoria={this.state.vehiculoHistoriaSeleccionado}
                    />
                </Modal>
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    title='Eliminar Vehiculo Historia'
                    onClick={this.onSubmitEliminar.bind(this)}
                    content='¿Estas seguro de eliminar...?'
                />
            );
        }
    }

    deleteVehiculoHistoria(id) {
        this.setState({
            visible: true,
            bandera: 2,
            idVehiculoHistoria: id,
        });
    }

    onSubmitEliminar(e) {
        e.preventDefault();
        this.setState({
            loadModal: true
        });
        httpRequest('post', '/commerce/api/vehiculo-historia/anular', {
            id: this.state.idVehiculoHistoria
        })
        .then(result => {
            this.handleCerrar();
            if (result.response === 1) {
                // this.getVehiculoHistoria(1, '', 10);
                this.getHistoriaVehiculos();
                message.success('eliminado exitosamente');
            } else if (result.response === 0) {
                message.warning('No se puede eliminar por que esta en una transaccion');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch(
            error => {
                this.handleCerrar();
                console.log(error);
            }
        );
    }

    btnEditar(item) {
        if (item.fkidventa == null) {
            return (
                <Link to={`/commerce/admin/vehiculo-historia/edit/${item.id}`}
                    className="btns btns-sm btns-outline-primary hint--bottom hint--bottom"
                    aria-label="editar" >
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.showVehiculoHistoria.bind(this, id)}
                    className="btns btns-sm btns-outline-success hint--bottom hint--success"
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = "/commerce/admin/vehiculo-historia/create";
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

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a onClick={this.deleteVehiculoHistoria.bind(this, id)}
                    className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar" >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalShow = this.onChangeModalShow();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                {componentModalShow}
                {/* {componentDeleteVehiculo} */}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Historial de Vehiculos</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationHistoriaVehiculo.bind(this)}
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
                                onChange={this.handleSearchHistoriaVehiculo.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.vehiculoHistoria}
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
                            onChange = {this.changePaginationHistoriaVehiculo}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexVehiculoHistoria);

