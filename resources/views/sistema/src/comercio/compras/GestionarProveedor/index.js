
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { message, Modal, Spin, Icon, Table, Select, Pagination } from 'antd';
import 'antd/dist/antd.css';
import ShowProveedor from './show';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';

import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import Confirmation from '../../../componentes/confirmation';
import strings from '../../../utils/strings';

const {Option} = Select;

class IndexProveedor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            proveedorSeleccionado: [],
            proveedorContacto: [],
            visibleDelete: false,
            visibleShow: false,
            loadModalDelete: false,
            idProveedor: 0,
            posicionProveedor: -1,
            proveedor: [],
            pagination: {},
            offset : 3,
            buscar: '',
            loadIndex: false,
            noSesion: false,
            configCodigo: false,
            timeoutSearch: undefined,
            pagina: 1,
            proveedorDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            modalCancel: false,
            loadingC: false,
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
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Nit',
                dataIndex: 'nit',
                key: 'nit',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nit - b.nit,
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
            btn_ver: readPermisions(keys.proveedor_btn_ver),
            btn_nuevo: readPermisions(keys.proveedor_btn_nuevo),
            btn_editar: readPermisions(keys.proveedor_btn_editar),
            btn_eliminar: readPermisions(keys.proveedor_btn_eliminar)
        }
        this.btnVer = this.btnVer.bind(this);
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.changePaginationProveedores = this.changePaginationProveedores.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idProveedor == 0) return;
        this.onSubmitDelete();
        this.setState({
            loadingC: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    componentDidMount() {
        this.getConfigsClient();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getProveedores();
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getProveedor(page, buscar, nroPaginacion) {
        var url = ws.wsproveedorindex + '?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;

        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    proveedor: result.proveedor.data,
                    pagination: result.pagination,
                });
            }

        }).catch( error => {
            console.log(error);
            message.error(strings.message_error);
        });

    }

    getProveedores(){
        httpRequest('get', ws.wsProveedores)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosProveedores = [];
                for (let i = 0; i < length; i++) {
                    let apellido;
                    if(data[i].apellido == null) {
                        apellido = data[i].nombre;
                    } else {
                        apellido = data[i].nombre + ' ' + data[i].apellido;
                    }
                    datosProveedores.push({
                        id: data[i].idproveedor,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idproveedor.toString() : data[i].codproveedor,
                        nombre: apellido,
                        nit: data[i].nit,
                    });
                }
                this.setState({
                    proveedor: datosProveedores,
                    proveedorDefaults: datosProveedores,
                    pagination: resp.pagination,
                    paginacionDefaults: resp.pagination,
                })
            } else if(resp.response == -2) {
                this.setState({ noSession: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    changePaginationProveedores(page){
        httpRequest('get', ws.wsProveedores + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosProveedores = [];
                for (let i = 0; i < length; i++) {
                    datosProveedores.push({
                        id: data[i].idproveedor,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idproveedor.toString() : data[i].codproveedor,
                        nombre: data[i].nombre + ' ' + data[i].apellido,
                        nit: data[i].nit,
                    });
                }
                this.setState({
                    proveedor: datosProveedores,
                    proveedorDefaults: datosProveedores,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    searchSizePaginateProveedor(value, sizePagination){
        httpRequest('get', ws.wsProveedores, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosProveedores = [];
                for (let i = 0; i < length; i++) {
                    datosProveedores.push({
                        id: data[i].idproveedor,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idproveedor.toString() : data[i].codproveedor,
                        nombre: data[i].nombre + ' ' + data[i].apellido,
                        nit: data[i].nit,
                    });
                }
                this.setState({
                    proveedor: datosProveedores,
                    pagination: result.pagination
                })
            } else if(result.response == -2) {
                this.setState({ noSession: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    handleSearchProveedor(value){
        this.searchSizePaginateProveedor(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateProveedor(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

    abrirModalShow(id) {
        var data = {
            'idProveedor': id
        }
        httpRequest('post', ws.wsproveedorshow, data)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    proveedorSeleccionado: result.proveedor,
                    proveedorContacto: result.contacto,
                    visibleShow: true
                });
            }

        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    handleCerrarModalShow() {
        this.setState({
            visibleShow: false,
            posicionProveedor: -1,
            proveedorSeleccionado: [],
            proveedorContacto: []
        });
    }

    getResultadoProveedorShow() {
        this.handleCerrarModalShow();
    }

    onChangeModalShow() {
        return (
            <Modal
                title='Datos de Proveedor'
                visible={this.state.visibleShow}
                onOk={this.handleCerrarModalShow.bind(this)}
                onCancel={this.handleCerrarModalShow.bind(this)}
                footer={null}
                width={900}
                style={{'top': '20px'}}
            >

                <ShowProveedor
                    callback={this.getResultadoProveedorShow.bind(this)}
                    proveedor={this.state.proveedorSeleccionado}
                    contacto={this.state.proveedorContacto}
                    bandera={1}
                />

            </Modal>

        )
    }

    abrirModalDelete(id, indice) {
        this.setState({
            idProveedor: id,
            visibleDelete: true,
            posicionProveedor: indice
        });
    }

    handleCerrarModalDelete() {
        this.setState({
            visibleDelete: false,
            loadModalDelete: false,
            posicionProveedor: -1
        });
    }

    onChangeModalDelete(){
        return (
            <Confirmation
                visible={this.state.visibleDelete}
                loading={this.state.loadModalDelete}
                onCancel={this.handleCerrarModalDelete.bind(this)}

                footer={null}
                width={400}

                title='Eliminar Proveedor'
                onClick={this.onSubmitDelete.bind(this)}
                content={
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{'marginTop': '-15px'}}>
                        <div className='txts-center'>
                            <label className='label-group-content'>
                                ¿Estas seguro de eliminar el proveedor?
                            </label>
                        </div>
                    </div>
                }
            />
        )
    }

    onSubmitDelete() {
        httpRequest('post', ws.wsproveedordel, {
            id: this.state.idProveedor
        })
        .then(result => {
            if (result.response === 1) {
                this.state.proveedor.splice(this.state.posicionProveedor, 1);
                this.getProveedores();
                this.setState({
                    proveedor: this.state.proveedor,
                    //loadModalDelete: false,
                    loadingC: false,
                    modalCancel: false
                });
                this.handleCerrarModalDelete();
                message.success('Exito en eliminar proveedor');
            } else if (result.response == -2) {
                this.setState({ 
                    noSesion: true,
                    loadingC: false,
                    modalCancel: false
                })
            } else {

                this.setState({
                    visibleDelete: false,
                    posicionProveedor: -1,
                    loadingC: false,
                    modalCancel: false
                })
                message.warning(result.message);
            }

        })
        .catch(error => {
                this.setState({
                    loadingC: false,
                    modalCancel: false
                });
                console.log(error);
                message.error(strings.message_error);
            }
        )
    }

    onCreateData() {
        var url = routes.proveedor_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A'){
            return(

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
            return(
                <a onClick={this.abrirModalShow.bind(this, id)}
                    className="btns btns-sm btns-outline-success"
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return(
                <Link to={routes.proveedor_edit + '/' + id}
                    className="btns btns-sm btns-outline-primary"
                    aria-label="editar" >
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if(this.permisions.btn_eliminar.visible == 'A'){
            return(
                <a onClick={ () => this.setState({ modalCancel: true, idProveedor: id }) }
                    className="btns btns-sm btns-outline-danger"
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
        const componentModalDelete = this.onChangeModalDelete();
        const componentModalShow = this.onChangeModalShow();
        const btnNuevo = this.btnNuevo();

        return (

            <div className="rows">

                {componentModalShow}
                {componentModalDelete}

                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Proveedor"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar al proveedor?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Proveedores</h1>
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
                                onChange={this.handleSearchProveedor.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.proveedor}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="pull-right py-3">
                            <Pagination
                                defaultCurrent = {this.state.pagina}
                                pageSize = {this.state.nroPaginacion}
                                onChange = {this.changePaginationProveedores}
                                total = {this.state.pagination.total}
                                showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexProveedor);

