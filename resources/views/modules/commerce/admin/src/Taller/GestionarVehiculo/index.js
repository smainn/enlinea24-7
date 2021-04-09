import React, { Component, useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { message, Modal, Spin, Icon, Table, Pagination, Select } from 'antd';
import 'antd/dist/antd.css';

import ShowVehiculo from './show';
import Confirmation from '../../../components/confirmation';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

class IndexVehiculo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            focus: [0],
            vehiculos: [],
            idVehiculo: 0,
            pagination: {},
            offset : 3,
            buscar: '',
            showVisible: false,
            vehiculoDetalle: [],
            vehiculoFoto: [],
            vehiculoCaracteristica: [],
            indiceVehiculo: 0,
            deleteVisible: false,
            loadModal: true,
            noSesion: false,
            configCodigo: false,
            paginacionDefaults: {},
            vehiculosDefaults: [],
            pagina: 1,
            nroPaginacion: 10,
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
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Cliente',
                dataIndex: 'cliente',
                key: 'cliente',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.cliente.localeCompare(b.cliente)}
            },
            {
                title: 'Placa',
                dataIndex: 'placa',
                key: 'placa',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.placa.localeCompare(b.placa)}
            },
            {
                title: 'Tipo de Uso',
                dataIndex: 'tipouso',
                key: 'tipouso',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipouso.localeCompare(b.tipouso)}
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
            btn_ver: readPermisions(keys.vehiculo_btn_ver),
            btn_editar: readPermisions(keys.vehiculo_btn_editar),
            btn_eliminar: readPermisions(keys.vehiculo_btn_eliminar),
            btn_nuevo: readPermisions(keys.vehiculo_btn_nuevo),
            btn_reporte: readPermisions(keys.vehiculo_btn_reporte)
        }
        this.btnVer = this.btnVer.bind(this);
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.changePaginationVehiculo = this.changePaginationVehiculo.bind(this);
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getVehiculos();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getVehiculos(){
        httpRequest('get', ws.wsGetVehiculos)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosVehiculos = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipopartpublic === 'R') {
                        tipo = 'Privado'
                    }else{
                        tipo = 'Publico'
                    }
                    let apellido = data[i].apellido == null ? '' : data[i].apellido;
                    datosVehiculos.push({
                        id: data[i].idvehiculo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        codigo: this.state.configCodigo ? data[i].codvehiculo : data[i].idvehiculo,
                        cliente: data[i].nombre + ' ' + apellido,
                        placa: data[i].placa,
                        tipouso: tipo,
                    });
                }
                this.setState({
                    vehiculos: datosVehiculos,
                    vehiculosDefaults: datosVehiculos,
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

    changePaginationVehiculo(page){
        httpRequest('get', ws.wsGetVehiculos + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosVehiculos = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipopartpublic === 'R') {
                        tipo = 'Privado'
                    }else{
                        tipo = 'Publico'
                    }
                    let apellido = data[i].apellido == null ? '' : data[i].apellido;
                    datosVehiculos.push({
                        id: data[i].idvehiculo,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo ? data[i].codvehiculo : data[i].idvehiculo,
                        cliente: data[i].nombre + ' ' + apellido,
                        placa: data[i].placa,
                        tipouso: tipo,
                    });
                }
                this.setState({
                    vehiculos: datosVehiculos,
                    vehiculosDefaults: datosVehiculos,
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

    searchVehiculo(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsGetVehiculoBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosVehiculos = [];
                    let tipo;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].tipopartpublic === 'R') {
                            tipo = 'Privado'
                        } else {
                            tipo = 'Publico'
                        }
                        let apellido = data[i].apellido == null ? '' : data[i].apellido;
                        datosVehiculos.push({
                            id: data[i].idvehiculo,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            codigo: this.state.configCodigo ? data[i].codvehiculo : data[i].idvehiculo,
                            cliente: data[i].nombre + ' ' + apellido,
                            placa: data[i].placa,
                            tipouso: tipo,
                        });
                    }
                    this.setState({
                        vehiculos: datosVehiculos,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                vehiculos: this.state.vehiculosDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    handleSearchVehiculo(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchVehiculo(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    sizePaginationVehiculo(cantidad){
        httpRequest('get', ws.wsGetVehiculosPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosVehiculos = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipopartpublic === 'R') {
                        tipo = 'Privado'
                    }else{
                        tipo = 'Publico'
                    }
                    let apellido = data[i].apellido == null ? '' : data[i].apellido;
                    datosVehiculos.push({
                        id: data[i].idvehiculo,
                        nro: i + 1,
                        codigo: this.state.configCodigo ? data[i].codvehiculo : data[i].idvehiculo,
                        cliente: data[i].nombre + ' ' + apellido,
                        placa: data[i].placa,
                        tipouso: tipo,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    vehiculos: datosVehiculos,
                    vehiculosDefaults: datosVehiculos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    onChangeSizePaginationVehiculo(value){
        this.sizePaginationVehiculo(value);
    }

    showVehiculo(id) {
        this.getDetalleVehiculo(id);
        this.setState({
            showVisible: true,
            idVehiculo: id,
        });
    }

    getDetalleVehiculo(id) {
        httpRequest('get', '/commerce/api/vehiculo/show/' + id + '')
        .then( result => {
            if (result.response === 1){
                this.setState({
                    vehiculoDetalle: result.data,
                    vehiculoFoto: result.foto,
                    vehiculoCaracteristica: result.caracteristica
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch( error => {console.log(error)});
    }

    handleCerrarModal() {
        this.setState({
            showVisible: false,
            idVehiculo: 0,
            deleteVisible: false,
            indiceVehiculo: 0,
            loadModal: true,
        });
    }

    getResultadoDetalleVehiculo() {
        this.setState({
            showVisible: false,
            idVehiculo: 0,
        });
    }

    componentModalShow() {
        return (
            <Modal
                title='Datos del Vehiculo'
                visible={this.state.showVisible}
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                width={850}
                style={{'top': '40px'}}
            >
                <ShowVehiculo
                    vehiculo={this.state.vehiculoDetalle}
                    imagen={this.state.vehiculoFoto}
                    caracteristica={this.state.vehiculoCaracteristica}
                    callback={this.getResultadoDetalleVehiculo.bind(this)}
                />
            </Modal>
        );
    }

    deleteVehiculo(id, indice) {
        this.setState({
            idVehiculo: id,
            indiceVehiculo: indice,
            deleteVisible: true,
        });
    }

    anularVehiculo() {
        const vehiculoSeleccionado = {
            id: this.state.idVehiculo
        };
        this.setState({
            loadModal: false,
        });
        httpRequest('post', '/commerce/api/vehiculo/anular', vehiculoSeleccionado)
        .then( result => {
            if (result.response === 1){
                this.state.vehiculos.splice(this.state.indiceVehiculo, 1);
                this.setState({
                    vehiculos: this.state.vehiculos
                });
                this.handleCerrarModal();
                message.success('Se elimino correctamente');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.handleCerrarModal();
                message.warning(result.message);
            }
        }).catch( error => {console.log(error)});
    }

    componentModalDelete() {
        return (
            <Confirmation
                visible={this.state.deleteVisible}
                loading={!this.state.loadModal}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Eliminar Vehiculo'
                onClick={this.anularVehiculo.bind(this)}
                content='¿Estas seguro de eliminar...?'
            />
        );
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    aria-label="detalles" onClick={this.showVehiculo.bind(this, id)}>
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={`/commerce/admin/vehiculo/edit/${id}`}
                        className="btns btns-sm btns-outline-primary hint--bottom" aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id, key) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar" onClick={this.deleteVehiculo.bind(this, id, key)}>
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = "/commerce/admin/vehiculo/create";
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

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const componentShowVehiculo = this.componentModalShow();
        const componentDeleteVehiculo = this.componentModalDelete();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                {componentShowVehiculo}
                {componentDeleteVehiculo}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Vehiculos</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationVehiculo.bind(this)}
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
                                dataSource={this.state.vehiculos}
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
                            onChange = {this.changePaginationVehiculo}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexVehiculo);
