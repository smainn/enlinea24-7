import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { message, Modal, Spin, Icon, Pagination, Select, Table } from 'antd';
import 'antd/dist/antd.css';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import keys from '../../../tools/keys';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

class IndexInventarioCorte extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inventarios: [],
            pagination: {},
            visibleModalVer: false,
            descripcion: '',
            fecha: '',
            notas: '',
            almacenes: [],
            arrayAlmacenes: [],
            selectAlmacenes: [],
            productos: [],
            almacenes: [],
            stockTotales: [],
            noSesion: false,
            buscar: '',
            timeoutSearch: undefined,
            pagination: {},
            pagina: 1,
            inventariosDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
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
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fecha.localeCompare(b.fecha)}
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
            btn_nuevo: readPermisions(keys.inventario_corte_btn_nuevo),
            btn_ver: readPermisions(keys.inventario_corte_btn_ver),
            btn_editar: readPermisions(keys.inventario_corte_btn_editar),
            btn_eliminar: readPermisions(keys.inventario_corte_btn_eliminar),
            fecha: readPermisions(keys.inventario_corte_fecha),
            almacenes: readPermisions(keys.inventario_corte_select_almacen),
            descripcion: readPermisions(keys.inventario_corte_textarea_descripcion),
            notas: readPermisions(keys.inventario_corte_textarea_notas),
            btn_add_all: readPermisions(keys.inventario_corte_btn_add_all),
            familias: readPermisions(keys.inventario_corte_treselect_familia),
            search_prod: readPermisions(keys.inventario_corte_search_producto)
        }

        this.componentBodyAlmacen = this.componentBodyAlmacen.bind(this);
        this.componentBodyModalVer = this.componentBodyModalVer.bind(this);
        this.changePaginationInventarios = this.changePaginationInventarios.bind(this);
    }

    onCreateData() {
        var url = routes.inventario_create;
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

    btnEditar(item) {
        if (item.estado == 'Pendiente' && this.permisions.btn_editar.visible == 'A') {
            return (
                <Link 
                    to={routes.inventario_edit + '/' + item.id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        } 
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a 
                    onClick={this.abrirModalShow.bind(this, id)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    onClick={this.showConfirmDelete.bind(this, id)}
                    className="btns btns-sm btns-outline-danger"
                    aria-label="eliminar" >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
    }

    componentDidMount() {
        this.getInventarios();
    }

    getInventarios(){
        httpRequest('get', ws.wsinventariocorte)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosInventarios = [];
                let estado;
                for (let i = 0; i < length; i++) {
                    if (data[i].estado == 'P') {
                        estado = 'Pendiente';
                    } else {
                        estado = 'Finalizado';
                    }
                    datosInventarios.push({
                        id: data[i].idinventariocorte,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        estado: estado,
                        fecha: data[i].fecha,
                    });
                }
                this.setState({
                    inventarios: datosInventarios,
                    inventariosDefaults: datosInventarios,
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
        })
    }

    changePaginationInventarios(page){
        httpRequest('get', ws.wsinventariocorte + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosInventarios = [];
                let estado;
                for (let i = 0; i < length; i++) {
                    if (data[i].estado == 'P') {
                        estado = 'Pendiente';
                    } else {
                        estado = 'Finalizado';
                    }
                    datosInventarios.push({
                        id: data[i].idinventariocorte,
                        nro: 10 * (page - 1) + i + 1,
                        descripcion: data[i].descripcion,
                        estado: estado,
                        fecha: data[i].fecha,
                    });
                }
                this.setState({
                    inventarios: datosInventarios,
                    inventariosDefaults: datosInventarios,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchSizePaginateInventarios(value, sizePagination){
        httpRequest('get', ws.wsinventariocorte, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosInventarios = [];
                let estado;
                for (let i = 0; i < length; i++) {
                    if (data[i].estado == 'P') {
                        estado = 'Pendiente';
                    } else {
                        estado = 'Finalizado';
                    }
                    datosInventarios.push({
                        id: data[i].idinventariocorte,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        estado: estado,
                        fecha: data[i].fecha,
                    });
                }
                this.setState({
                    inventarios: datosInventarios,
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
        });
    }

    handleSearchInventario(value){
        this.searchSizePaginateInventarios(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateInventarios(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

    calcularTotalesStocks(almacenes) {
        let result = [];
        let length = almacenes.length;
        for (let i = 0; i < length; i++) {
            let array = almacenes[i];
            let size = array.length;
            let sum1 = 0;
            let sum2 = 0;
            for (let j = 0; j < size; j++) {
                sum1 = sum1 + parseInt(array[j].stockanterior);
                sum2 = sum2 + parseInt(array[j].stocknuevo);
            }
            result.push({
                anterior: sum1,
                nuevo : sum2
            });
        }
        return result;
    }

    getInventarioCorte(id) {
        httpRequest('get', ws.wsinventariocorte + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    visibleModalVer: true,
                    productos: result.productos,
                    arrayAlmacenes: result.almacenes,
                    descripcion: result.descripcion,
                    fecha: result.fecha,
                    estado: result.estado,
                    notas: result.notas,
                    almacenes: result.almacenesAll,
                    selectAlmacenes: result.selectAlmacenes,
                    stockTotales: this.calcularTotalesStocks(result.almacenes)
                });
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

    deleteInventarioCorte(id) {
        httpRequest('delete', ws.wsinventariocorte + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                let data = result.data;
                let length = data.length;
                let datosInventarios = [];
                let estado;
                for (let i = 0; i < length; i++) {
                    if (data[i].estado == 'P') {
                        estado = 'Pendiente';
                    } else {
                        estado = 'Finalizado';
                    }
                    datosInventarios.push({
                        id: data[i].idinventariocorte,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        estado: estado,
                        fecha: data[i].fecha,
                    });
                }
                this.setState({
                    inventarios: datosInventarios,
                    inventariosDefaults: datosInventarios,
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
            message.error('Ocurrio un problea con al conexion');
        })
    }

    showConfirmDelete(id) {
        console.log(id);
        const deleteInventarioCorte = this.deleteInventarioCorte.bind(this);
        Modal.confirm({
            title: 'Elimiar Corte Inventario',
            content: '¿Estas seguro de eliminar el corte de invetario?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deleteInventarioCorte(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentEdit(item) {
        if (item.estado == 'P') {
            return (
                <Link 
                    to={routes.inventario_edit + '/' + item.idinventariocorte}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        } 
        return null;
    }

    getAlmacen(id) {
        let array = this.state.almacenes;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (id == array[i].idalmacen)
                return array[i];
        }
    }

    componentTitleAlmacen() {
        let array = this.state.selectAlmacenes;
        let length = array.length;
        let component = [];
        for (let i = 0; i < length; i++) {
            if (array[i] != 0) {
                let almacen = this.getAlmacen(array[i]);
                component.push(
                    <div 
                        style={{ 
                            padding: 5, 
                            flexDirection: 'column',
                            paddingLeft: 15
                        }}
                    >       
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <label 
                                style={{ color: 'blue'}}>
                                {almacen.descripcion}
                            </label>
                        </div>
                        <div style={{ display: 'flex'}}>
                            <label style={{color: 'blue', padding: 2}}>Anterior</label>
                            <label style={{color: 'blue', padding: 2 }}>Nuevo</label>
                        </div>
                    </div>
                );
            }
        }
        return component;
    }

    inArrayAlmacen(idalmacen, array) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idalmacen == idalmacen) 
                return i;
        }
        return -1;
    }

    componentBodyAlmacen(index) {
        let array = this.state.selectAlmacenes;
        //console.log('SELECT ALMACENES ', array);
        let length = array.length;
        let component = [];
        for (let i = 0; i < length; i++) {
            //console.log('ELEM A BUSCAR ', array[i]);
            //console.log('LUGAR A BUSCAR ', this.state.arrayAlmacenes[index]);
            let posicion = this.inArrayAlmacen(array[i], this.state.arrayAlmacenes[index]);
            if (posicion >= 0) {
                component.push(
                    <div style={{ width: 130, padding: 9, display: 'flex' }}>
                        <div 
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>{this.state.arrayAlmacenes[index][posicion].stockanterior}</label>
                        </div>
                        <div
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>{this.state.arrayAlmacenes[index][posicion].stocknuevo}</label>
                        </div>    
                    </div>
                );
            } else {
                component.push(
                    <div style={{ width: 130, padding: 9, display: 'flex' }}>
                        <div 
                            className="input-group-content"
                            style={{ width: 65,  display: 'flex'}}>
                            <label>0</label>
                        </div>    
                        <div
                            className="input-group-content"
                            style={{ width: 65, display: 'flex'}}
                        >
                            <label>0</label>
                        </div>
                    </div>
                )
            }
        }
        return component;
    }

    closeModalVer() {
        this.setState({ visibleModalVer: false});
    }

    abrirModalShow(id) {
        this.getInventarioCorte(id);
    }

    componentBodyModalVer() {
        const componentTitleAlmacen = this.componentTitleAlmacen();
        return(
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                        <Input 
                            title="Fecha"
                            value={this.state.fecha}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 col-sm-12 cols-xs-12">
                    <div className="cols-lg-7 cols-md-7 cols-sm-7 cols-xs-12">
                        <TextArea
                            title="Descripcion"
                            value={this.state.descripcion}
                            readOnly={true}
                        />
                    </div>
                    <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12">
                        <TextArea
                            title="Notas"
                            value={this.state.notas}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div 
                    className="cols-lg-12 cols-md-12 col-sm-12 cols-xs-12"
                    style={{ overflow: 'scroll', height: 400 }}
                    >
                    <div className="cols-lg-5 cols-md-4 cols-sm-4 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                <label style={{color: 'blue'}}>Nro</label>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                <label style={{color: 'blue'}}>Id</label>
                            </div>
                            <div className="col-lg-6-content col-md-6-content col-sd-6-content">
                                <label style={{color: 'blue'}}>Descripcion</label>
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ paddingTop: 45 }}
                        >
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ paddingTop: 15 }}
                                    >
                                        <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                            <label>{key + 1}</label>
                                        </div>
                                        <div className="col-lg-3-content col-md-3-content col-sd-3-content">
                                            <label>{item.idproducto}</label>
                                        </div>
                                        <div className="col-lg-6-content col-md-6-content col-sd-6-content">
                                            <label>{item.descripcion}</label>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div 
                        className="col-lg-4-content col-md-4-content col-sd-4-content"
                        style={{ overflowX: 'scroll', }}
                    >
                        <div 
                            className="col-lg-12-content"
                            style={{  
                                width: '100%',
                                paddingLeft: 20, 
                                display: 'flex'
                            }}
                        >
                            { componentTitleAlmacen }
                        </div>

                        <div 
                            className="col-lg-12-content"
                            style={{ paddingTop: '5%' }}
                            >
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="col-lg-12-content"
                                        style={{ paddingTop: 5, display: 'flex' }}
                                    >
                                        { this.componentBodyAlmacen(key) }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-lg-3-content col-md-4-content col-sd-4-content">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <label 
                                    className="col-lg-12-content" 
                                    style={{
                                        color: 'blue', 
                                        marginLeft: 25 
                                    }}>
                                    Stock Total</label>
                            </div>
                            <div className="col-lg-12-content">
                                <label style={{
                                    color: 'blue', 
                                    padding: 3,
                                    marginLeft: 25
                                    }}>Anterior</label>
                                <label 
                                    style={{
                                        color: 'blue', 
                                        //padding: 2,
                                        //marginLeft: 25
                                    }}>Nuevo</label>
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            {
                                this.state.productos.map((item, key) => (
                                    <div 
                                        className="col-lg-12-content col-md-12-content col-sd-12-content"
                                        style={{ 
                                            marginTop: 2
                                        }}
                                    >
                                        <div 
                                            className="col-lg-12-content col-md-10-content"
                                            style={{ width: 160, display: 'flex' }}
                                        >
                                            <div 
                                                className="col-lg-6-content col-md-6-content"
                                                style={{ width: 60 }}
                                            >
                                                <label>{this.state.stockTotales[key].anterior}</label>
                                            </div> 
                                            <div 
                                                className="col-lg-6-content col-md-6-content"
                                                style={{ width: 60 }}
                                            >
                                                <label>{this.state.stockTotales[key].nuevo}</label>
                                            
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
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
                    title="Detalle Inventario Corte"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,
                        overflow: 'auto'  
                    }}
                >
                    { componentBodyModalVer }
                </Modal>
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Corte de Inventario</h1>
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
                                onChange={this.handleSearchInventario.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.inventarios}
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
                            onChange = {this.changePaginationInventarios}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexInventarioCorte);
