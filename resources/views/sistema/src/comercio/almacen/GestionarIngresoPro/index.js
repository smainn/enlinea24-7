import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal,Card, message, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
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

class IndexIngresoPro extends Component {
    constructor(props){
        super(props);
        this.state = {
            ingresoproductos: [],
            listaproductos: [],
            ingresoproducto: {},
            visibleModalVer: false,
            noSesion: false,
            configCodigo: false,
            buscar: '',
            timeoutSearch: undefined,
            pagination: {},
            pagina: 1,
            ingresoproductosDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            modalCancel: false,
            idDelete: -1,
            loadingC: false
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
                title: 'Código de Ingreso',
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
            btn_nuevo: readPermisions(keys.ingreso_producto_btn_nuevo),
            btn_show: readPermisions(keys.ingreso_producto_btn_ver),
            btn_edit: readPermisions(keys.ingreso_producto_btn_editar),
            btn_delete: readPermisions(keys.ingreso_producto_btn_eliminar),
            codigo: readPermisions(keys.ingreso_producto_input_codigo),
            tipo: readPermisions(keys.ingreso_producto_select_tipo),
            almacen: readPermisions(keys.ingreso_producto_select_almacen),
            fecha: readPermisions(keys.ingreso_producto_fechaHora),
            searchprod: readPermisions(keys.ingreso_producto_input_search_producto),
            t_almacen: readPermisions(keys.ingreso_producto_tabla_columna_almacen),
            t_cantidad: readPermisions(keys.ingreso_producto_tabla_columna_cantidad),
            notas: readPermisions(keys.ingreso_producto_textarea_nota)
        }
        this.changePaginationIngresoProductos = this.changePaginationIngresoProductos.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteIngresoProducto(this.state.idDelete);
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
        var url = routes.ingreso_producto_create;
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

    btnShow(id) {
        if (this.permisions.btn_show.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    onClick={() => this.showIngresoProd(id) }
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
                    to={routes.ingreso_producto_edit + '/' + id}
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
                    onClick={() => this.setState({ modalCancel: true, idDelete: id })}//this.showDeleteConfirm(this, id)}
                >
                    <i className="fa fa-trash"></i>
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
                this.getIngresoProductos();
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
    }

    getIngresoProductos(){
        httpRequest('get', ws.wsingresoproducto)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosIngresoProductos = [];
                
                for (let i = 0; i < length; i++) {
                    let f =  convertYmdToDmyWithHour(data[i].fechahora);
                    datosIngresoProductos.push({
                        id: data[i].idingresoproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idingresoproducto.toString() : 
                            data[i].codingresoprod == null ? data[i].idingresoproducto.toString(): data[i].codingresoprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    ingresoproductos: datosIngresoProductos,
                    ingresoproductosDefaults: datosIngresoProductos,
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
            message.error(strings.message_error);
        })
    }

    changePaginationIngresoProductos(page){
        httpRequest('get', ws.wsingresoproducto + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosIngresoProductos = [];
                for (let i = 0; i < length; i++) {
                    datosIngresoProductos.push({
                        id: data[i].idingresoproducto,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idingresoproducto.toString() : 
                            data[i].codingresoprod == null ? data[i].idingresoproducto.toString(): data[i].codingresoprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    ingresoproductos: datosIngresoProductos,
                    ingresoproductosDefaults: datosIngresoProductos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
    }

    searchSizePaginateIngresoProductos(value, sizePagination){
        httpRequest('get', ws.wsingresoproducto, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosIngresoProductos = [];
                for (let i = 0; i < length; i++) {
                    datosIngresoProductos.push({
                        id: data[i].idingresoproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idingresoproducto.toString() : 
                            data[i].codingresoprod == null ? data[i].idingresoproducto.toString(): data[i].codingresoprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    ingresoproductos: datosIngresoProductos,
                    pagination: result.pagination
                })
            } else if(result.response == -2) {
                this.setState({ noSession: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        });
    }

    handleSearchIngresoProducto(value){
        this.searchSizePaginateIngresoProductos(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateIngresoProductos(null, value);
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

    deleteIngresoProducto(id) {
        httpRequest('delete', ws.wsingresoproducto + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                let data = result.data;
                let length = data.length;
                let datosIngresoProductos = [];
                for (let i = 0; i < length; i++) {
                    datosIngresoProductos.push({
                        id: data[i].idingresoproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idingresoproducto.toString() : 
                            data[i].codingresoprod == null ? data[i].idingresoproducto.toString(): data[i].codingresoprod,
                        fechaHora: convertYmdToDmyWithHour(data[i].fechahora),
                        tipo: data[i].ingsaltrastipo,
                    });
                }
                this.setState({
                    ingresoproductos: datosIngresoProductos,
                    ingresoproductosDefaults: datosIngresoProductos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    loadingC: false,
                    modalCancel: false
                })
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

    showDeleteConfirm(thisContex, item) {
        //console.log(item);
        Modal.confirm({
            title: 'Elimiar Ingreso Producto',
            content: '¿Estas seguro de eliminar el ingreso de productos?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                thisContex.deleteIngresoProducto(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showIngresoProd(id) {
        httpRequest('get', ws.wsingresoproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    ingresoproducto: result.ingresoprod,
                    visibleModalVer: true,
                    listaproductos: result.data
                });
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
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
        let tipo = this.state.ingresoproducto.tipo == undefined ? '' : this.state.ingresoproducto.tipo.descripcion;
        let codigoIngreso = this.state.ingresoproducto.idingresoproducto;
        if (this.state.configCodigo) {
            codigoIngreso = this.state.ingresoproducto.codingresoprod;
        }
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                        <Input
                            title="Codigo"
                            value={codigoIngreso}
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
                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                        <Input
                            title="Fecha-Hora:"
                            value={convertYmdToDmyWithHour(this.state.ingresoproducto.fechahora)}
                            readOnly={true}
                            permisions={this.permisions.fecha}
                        />
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <TextArea
                            title="Notas"
                            value={this.state.ingresoproducto.notas}
                            readOnly={true}
                            permisions={this.permisions.notas}
                        />
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-2 cols-md-2"></div>
                    <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                        <Table
                            bordered
                            dataSource={this.listaproductos()}
                            columns={columns.ingresoProducto}
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
            )
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                <Modal
                    title="Detalle Ingreso Producto"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    style={{'top': '10px'}}
                    width={WIDTH_WINDOW * 0.7}
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
                    title="Eliminar Ingreso Producto"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar el Ingreso de Producto?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Ingreso de Productos</h1>
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
                                onChange={this.handleSearchIngresoProducto.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.ingresoproductos}
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
                            onChange = {this.changePaginationIngresoProductos}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexIngresoPro);
