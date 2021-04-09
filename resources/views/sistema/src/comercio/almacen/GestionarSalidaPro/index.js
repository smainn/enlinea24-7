import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Redirect } from 'react-router-dom';
import { Pagination, Modal,Card, message, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import { timingSafeEqual } from 'crypto';
import TextArea from '../../../componentes/textarea';
import Input from '../../../componentes/input';
import { columns } from '../../../utils/columnsTable';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import { convertYmdToDmyWithHour } from '../../../utils/toolsDate';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

class IndexSalidaPro extends Component {
    constructor(props){
        super(props);
        this.state = {
            salidaproductos: [],
            listaproductos: [],
            salidaproducto: {},
            visibleModalVer: false,
            noSesion: false,
            configCodigo: false,
            buscar: '',
            timeoutSearch: undefined,
            pagination: {},
            pagina: 1,
            salidaproductosDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            modalCancel: false,
            loadingC: false,
            idDelete: -1
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
                title: 'Código de Salida',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Fecha Hora',
                dataIndex: 'fechaHora',
                key: 'fechaHora',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fechaHora.localeCompare(b.fechaHora)}
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipo.localeCompare(b.tipo)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnShow(record.id)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.salida_producto_btn_nuevo),
            btn_show: readPermisions(keys.salida_producto_btn_ver),
            btn_edit: readPermisions(keys.salida_producto_btn_editar),
            btn_delete: readPermisions(keys.salida_producto_btn_eliminar),
            codigo: readPermisions(keys.salida_producto_input_codigo),
            tipo: readPermisions(keys.salida_producto_select_tipo),
            almacen: readPermisions(keys.salida_producto_select_almacen),
            fecha: readPermisions(keys.salida_producto_fechaHora),
            searchprod: readPermisions(keys.salida_producto_input_search_producto),
            t_almacen: readPermisions(keys.salida_producto_tabla_columna_almacen),
            t_cantidad: readPermisions(keys.salida_producto_tabla_columna_cantidad),
            notas: readPermisions(keys.salida_producto_textarea_nota)
        }
        this.changePaginationSalidaProductos = this.changePaginationSalidaProductos.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteSalidaProducto(this.state.idDelete);
        this.setState({
            loadingC: true,
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    onCreateData() {
        var url = routes.salida_producto_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        type='primary' title='Nuevo'
                        onClick={this.onCreateData.bind(this)}
                    />
                </div>
            );
        }
        return null;
    }

    btnShow(id) {
        if (this.permisions.btn_show.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    onClick={() => this.showSalidaProd(id) }
                    >
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_edit.visible == 'A') {
            return (
                <Link  
                    to={routes.salida_producto_edit + '/' + id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }
    
    btnEliminar(id) {
        if (this.permisions.btn_delete.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ modalCancel: true, idDelete: id })}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
    }
    
    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getSalidaProductos();
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

    getSalidaProductos(){
        httpRequest('get', ws.wssalidaproducto)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosSalidaProductos = [];
                for (let i = 0; i < length; i++) {
                    datosSalidaProductos.push({
                        id: data[i].idsalidaproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idsalidaproducto.toString() : 
                            data[i].codsalidaprod == null ? data[i].idsalidaproducto.toString() : data[i].codsalidaprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    salidaproductos: datosSalidaProductos,
                    salidaproductosDefaults: datosSalidaProductos,
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

    changePaginationSalidaProductos(page){
        httpRequest('get', ws.wssalidaproducto + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosSalidaProductos = [];
                for (let i = 0; i < length; i++) {
                    datosSalidaProductos.push({
                        id: data[i].idsalidaproducto,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idsalidaproducto.toString() : 
                            data[i].codsalidaprod == null ? data[i].idsalidaproducto.toString() : data[i].codsalidaprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    salidaproductos: datosSalidaProductos,
                    salidaproductosDefaults: datosSalidaProductos,
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

    searchSizePaginateSalidaProductos(value, sizePagination){
        httpRequest('get', ws.wssalidaproducto, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosSalidaProductos = [];
                for (let i = 0; i < length; i++) {
                    datosSalidaProductos.push({
                        id: data[i].idsalidaproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idsalidaproducto.toString() : 
                            data[i].codsalidaprod == null ? data[i].idsalidaproducto.toString() : data[i].codsalidaprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    salidaproductos: datosSalidaProductos,
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

    handleSearchSalidaProducto(value){
        this.searchSizePaginateSalidaProductos(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateSalidaProductos(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    deleteSalidaProducto(id) {
        httpRequest('delete', ws.wssalidaproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                message.success(result.message);
                let data = result.data;
                let length = data.length;
                let datosSalidaProductos = [];
                for (let i = 0; i < length; i++) {
                    datosSalidaProductos.push({
                        id: data[i].idsalidaproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idsalidaproducto.toString() : 
                            data[i].codsalidaprod == null ? data[i].idsalidaproducto.toString() : data[i].codsalidaprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    salidaproductos: datosSalidaProductos,
                    salidaproductosDefaults: datosSalidaProductos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
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

    showDeleteConfirm(thisContex, id) {
        Modal.confirm({
            title: 'Elimiar Salida Producto',
            content: '¿Estas seguro de eliminar la salida de prodcuto?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                thisContex.deleteSalidaProducto(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showSalidaProd(id) {
        httpRequest('get', ws.wssalidaproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    salidaproducto: result.salidaprod,
                    visibleModalVer: true,
                    listaproductos: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
    }

    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }

    listaproductos() {
        var array = [];
        this.state.listaproductos.map(
            (item, key) => {
                array.push({
                    key: key,
                    Nro: key + 1,
                    Id: item.idproducto,
                    Descripcion: item.descripcion,
                    Almacen: item.almacen,
                    Cantidad: item.cantidad,
                });
            }
        );
        return array;
    }

    componentBodyModalVer() {
        let tipo = this.state.salidaproducto.tipo == undefined ? '' : this.state.salidaproducto.tipo.descripcion;
        let notas = this.state.salidaproducto.notas == undefined ? '' : this.state.salidaproducto.notas;
        let codigoSalida = this.state.salidaproducto.idsalidaproducto;
        if (this.state.configCodigo) {
            codigoSalida = this.state.salidaproducto.codsalidaprod == null ? codigoSalida : this.state.salidaproducto.codsalidaprod;
        }
        return (
            <div className="col-lg-12-content">
                <div className="forms-groups cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <Input
                                title="Codigo"
                                value={codigoSalida}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                                //configAllowed={this.state.configCodigo}
                            />
                        </div>
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <Input
                                title="tipo"
                                value={tipo}
                                readOnly={true}
                                permisions={this.permisions.tipo}
                            />
                        </div>
                        <div className="cols-lg-4 cols-md4 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha-Hora"
                                value={convertYmdToDmyWithHour(this.state.salidaproducto.fechahora)}
                                readOnly={true}
                                permisions={this.permisions.fecha}
                            />
                        </div>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 col-sm-12 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={notas}
                                permisions={this.permisions.notas}
                            />
                        </div>
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-2 cols-md-2"></div>
                    <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                        <Table
                            bordered
                            dataSource={this.listaproductos()}
                            columns={columns.salidaProducto}
                            pagination={false}
                            style={{
                                width: '100%',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
            <Modal
                    title="Detalle Salida Producto"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    style={{'top': '10px'}}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,  
                    }}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <C_Button 
                                title="Aceptar"
                                onClick={this.closeModalVer.bind(this)}
                            />
                        </div>
                    }
                >
                    { componentBodyModalVer }
                </Modal>
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Salida Producto"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la salida de producto?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Salida de Productos</h1>
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
                                onChange={this.handleSearchSalidaProducto.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.salidaproductos}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {this.state.pagina}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.changePaginationSalidaProductos}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexSalidaPro);

