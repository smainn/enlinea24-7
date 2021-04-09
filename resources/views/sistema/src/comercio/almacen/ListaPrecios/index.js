import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Redirect,} from 'react-router-dom';
import { Pagination, Modal, Card, message, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import { convertYmdToDmy } from '../../../utils/toolsDate';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

const CANTIDAD_LISTA_PRECIOS = 10;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

class IndexListaPrecio extends Component {
    constructor(props){
        super(props);
        this.state = {
            listaPrecios: [],
            listaPrecio: {},
            listaProductos: [],
            visibleModalVer: false,
            noSesion: false,
            buscar: '',
            timeoutSearch: undefined,
            pagination: {},
            pagina: 1,
            listaPreciosDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            modalCancel: false,
            loadingC: false,
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
                title: 'Valor',
                dataIndex: 'valor',
                key: 'valor',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.valor - b.valor,
            },
            {
                title: 'Fijo/Porcentaje',
                dataIndex: 'fijoporcentaje',
                key: 'fijoporcentaje',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fijoporcentaje.localeCompare(b.fijoporcentaje)}
            },
            {
                title: 'Incremento/Descuento',
                dataIndex: 'accion',
                key: 'accion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.accion.localeCompare(b.accion)}
            },
            {
                title: 'Fecha Inicio',
                dataIndex: 'fechainicio',
                key: 'fechainicio',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fechainicio.localeCompare(b.fechainicio)}
            },
            {
                title: 'Fecha Fin',
                dataIndex: 'fechafin',
                key: 'fechafin',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fechafin.localeCompare(b.fechafin)}
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
            btn_ver: readPermisions(keys.lista_precio_btn_ver),
            btn_nuevo: readPermisions(keys.lista_precio_btn_nuevo),
            btn_editar: readPermisions(keys.lista_precio_btn_editar),
            btn_eliminar: readPermisions(keys.lista_precio_btn_eliminar),
            column_pre_mod: readPermisions(keys.lista_precio_tabla_columna_precioModificar)
        }
        this.changePaginationListaPrecios = this.changePaginationListaPrecios.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteListaPrecio(this.state.idDelete);
        this.setState({
            loadingC: true,
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-success"
                    onClick={() => this.showListaPrecio(id) }
                    >
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  
                    to={routes.lista_precios_edit + '/' + id}
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
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ modalCancel: true, idDelete: id }) }//this.showDeleteConfirm(this, id)}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = routes.lista_precios_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button onClick={this.onCreateData.bind(this)}
                        type='primary' title='Nuevo'
                    />
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getListaPrecios();
    }

    getListaPrecios(){
        httpRequest('get', ws.wslistaprecio)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosListaPrecios = [];
                let accion;
                let fijoporcentaje;
                for (let i = 0; i < length; i++) {
                    if (data[i].fijoporcentaje == 'F') {
                        fijoporcentaje = 'Fijo';
                    } else {
                        fijoporcentaje = 'Porcentaje';
                    }
                    if (data[i].accion == 'D') {
                        accion = 'Descuento';
                    } else {
                        accion = 'Incremento';
                    }
                    datosListaPrecios.push({
                        id: data[i].idlistaprecio,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        fijoporcentaje: fijoporcentaje,
                        accion: accion,
                        fechainicio: convertYmdToDmy(data[i].fechainicio),
                        fechafin: convertYmdToDmy(data[i].fechafin),
                    });
                }
                this.setState({
                    listaPrecios: datosListaPrecios,
                    listaPreciosDefaults: datosListaPrecios,
                    pagination: resp.pagination,
                    paginacionDefaults: resp.pagination,
                })
            } else if(resp.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    changePaginationListaPrecios(page){
        httpRequest('get', ws.wslistaprecio + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosListaPrecios = [];
                let accion;
                let fijoporcentaje;
                for (let i = 0; i < length; i++) {
                    if (data[i].fijoporcentaje == 'F') {
                        fijoporcentaje = 'Fijo';
                    } else {
                        fijoporcentaje = 'Porcentaje';
                    }
                    if (data[i].accion == 'D') {
                        accion = 'Descuento';
                    } else {
                        accion = 'Incremento';
                    }
                    datosListaPrecios.push({
                        id: data[i].idlistaprecio,
                        nro: 10 * (page - 1) + i + 1,
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        fijoporcentaje: fijoporcentaje,
                        accion: accion,
                        fechainicio: convertYmdToDmy(data[i].fechainicio),
                        fechafin: convertYmdToDmy(data[i].fechafin),
                    });
                }
                this.setState({
                    listaPrecios: datosListaPrecios,
                    listaPreciosDefaults: datosListaPrecios,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    searchSizePaginateListaPrecios(value, sizePagination){
        httpRequest('get', ws.wslistaprecio, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosListaPrecios = [];
                let accion;
                let fijoporcentaje;
                for (let i = 0; i < length; i++) {
                    if (data[i].fijoporcentaje == 'F') {
                        fijoporcentaje = 'Fijo';
                    } else {
                        fijoporcentaje = 'Porcentaje';
                    }
                    if (data[i].accion == 'D') {
                        accion = 'Descuento';
                    } else {
                        accion = 'Incremento';
                    }
                    datosListaPrecios.push({
                        id: data[i].idlistaprecio,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        fijoporcentaje: fijoporcentaje,
                        accion: accion,
                        fechainicio: convertYmdToDmy(data[i].fechainicio),
                        fechafin: convertYmdToDmy(data[i].fechafin),
                    });
                }
                this.setState({
                    listaPrecios: datosListaPrecios,
                    pagination: result.pagination
                })
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    handleSearchListaPrecio(value){
        this.searchSizePaginateListaPrecios(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateListaPrecios(null, value);
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

    deleteLista(idlista) {
        let data = this.state.listaPrecios;
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            if (data[i].idlistaprecio !== idlista) {
                array.push(data[i]);
            }
        }
        this.setState({
            listaPrecios: array
        });
    }

    deleteListaPrecio(idlistaprecio) {
        httpRequest('delete', ws.wslistaprecio + '/' + idlistaprecio)
        .then((result) => {
            if (result.response == 1) {
                this.deleteLista(idlistaprecio);
                message.success(result.message);
                this.setState({
                    loadingC: false,
                    modalCancel: false
                })
            } else if (result.response == -2) {
                this.setState({ 
                    noSesion: true, 
                    loadingC: false,
                    modalCancel: false
                })
            } else {
                message.error(result.message);
                this.setState({
                    loadingC: false,
                    modalCancel: false
                })
            }
            
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({ loadingC: false, modalCancel: false })
        })
    }

    showDeleteConfirm(thisContex,item) {
        Modal.confirm({
            title: 'Elimiar Lista de Precio',
            content: '¿Estas seguro de eliminar la lista Precio?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                thisContex.deleteListaPrecio(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showListaPrecio(id) {
        httpRequest('get', ws.wslistaprecio + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    listaPrecio: result.listaprecio,
                    listaProductos: result.listaproductos,
                    visibleModalVer: true
                });
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

    componentBodyModalVer() {
        let moneda = this.state.listaPrecio.moneda == undefined ? 'sin moneda' : this.state.listaPrecio.moneda;
        let accion = this.state.listaPrecio.accion == 'D' ? 'Decremento' : 'Incremento';
        let estado = this.state.listaPrecio.estado == 'A' ? 'Activo' : 'No Activo';
        let fijoporcentaje = this.state.listaPrecio.fijoporcentaje == 'F' ? 'Fijo' : 'Porcentaje';
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                            <Input
                                title="Descripcion"
                                value={this.state.listaPrecio.descripcion}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Moneda"
                                value={moneda.descripcion}
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Valor"
                                value={this.state.listaPrecio.valor}
                                readOnly={true}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fijo/Porcent"
                                value={fijoporcentaje}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Accion"
                                value={accion}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Estado"
                                value={estado}
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3"></div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha Inicio"
                                value={this.state.listaPrecio.fechainicio}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha Fin"
                                value={this.state.listaPrecio.fechafin}
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={this.state.listaPrecio.notas == null ? '' : this.state.listaPrecio.notas}
                            />
                        </div>
                    </div>
                </div>
                <div  className="forms-groups cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div 
                        className="table-detalle" 
                        style={{ 
                            width: '80%',
                            marginLeft: '10%',
                            overflow: 'auto'
                        }}>
                        <table className="table-response-detalle">
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th>Id Producto</th>
                                    <th>Descripcion</th>
                                    <th>Precio Orig</th>
                                    { this.permisions.column_pre_mod.visible == 'A' ? <th>Precio Modif</th> : null }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.listaProductos.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{item.idproducto}</td>
                                                <td>{item.descripcion}</td>
                                                <td>{item.precio}</td>
                                                { this.permisions.column_pre_mod.visible == 'A' ? <td>{item.preciomod}</td> : null }
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>
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
                    title="Detalle de la Lista de Precio"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    style={{'top': '10px'}}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,
                        overflow: 'auto'  
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
                    title="Eliminar Lista de Precio"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la lista de precio?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Lista de Precios</h1>
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
                                onChange={this.handleSearchListaPrecio.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.listaPrecios}
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
                            onChange = {this.changePaginationListaPrecios}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexListaPrecio);
