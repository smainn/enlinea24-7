
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Pagination, Modal, Table, message,Select, notification } from 'antd';

import axios from 'axios';

import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import { httpRequest, removeAllData, readData, saveData, getConfigColor } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import CImage from '../../../componentes/image';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

const {Option} = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import keysStorage from '../../../utils/keysStorage';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

class IndexProducto extends Component {

    constructor(props){
        super(props);
        this.state = {

            visible_importar: false,
            loading_importar: false,
            namealmacen: '',
            filearchivo: '',
            linkarchivo: '',

            producto: {
                codproducto: '',
                descripcion: '',
                costo: '',
                precio: 0,
                stock: 0,
                stockminimo: 0,
                stockmaximo: 0,
                palabrasclaves: 0,
                notas: 0,
                comision: 0,
                costodos: 0,
                costotres: 0,
                costocuatro: 0,
                tipo: 'P',
                familia: '',
                moneda: 1,
                unidadmedida: 1,
            },
            productos: [],
            productosDefault: [],
            paginationDefault: {},
            visibleModalVer: false,
            visibleModalEli: false,
            almacenes: [],
            codigos: [],
            caracteristicas: [],
            fotos: [],
            indexImg: 0,
            modalImage: 'none',
            tecla: 0,
            noSession: false,
            configCodigo: false,
            cantPaginas: 10,
            nroPagina: 1,
            busqueda: '',
            modalCancel: false,
            clienteesabogado: true,
            idDelete: -1,

            array_data: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,
        }

        this.permisions = {
            btn_ver : readPermisions(keys.producto_btn_ver),
            btn_nuevo: readPermisions(keys.producto_btn_nuevo),
            btn_editar: readPermisions(keys.producto_btn_editar),
            btn_eliminar: readPermisions(keys.producto_btn_eliminar),
            btn_reporte: readPermisions(keys.producto_btn_reporte),
            codigo: readPermisions(keys.producto_input_codigo),
            add_cod: readPermisions(keys.producto_btn_agregarCodigos),
            tipo: readPermisions(keys.producto_select_tipo),
            moneda: readPermisions(keys.producto_select_moneda),
            unidad:readPermisions(keys.producto_select_unidadMedida),
            descripcion: readPermisions(keys.producto_input_descripcion),
            familia: readPermisions(keys.producto_select_familia),
            precio: readPermisions(keys.producto_input_precio),
            costo: readPermisions(keys.producto_input_costo),
            caract: readPermisions(keys.producto_caracteristicas),
            foto: readPermisions(keys.producto_imagenes),
            add_costo: readPermisions(keys.producto_btn_agregarCosto),
            add_lista: readPermisions(keys.producto_btn_agregarListaPrecio),
            stock_alm: readPermisions(keys.producto_stockAlmacen),
            stock_tot: readPermisions(keys.producto_totalStock),
            pal_clave: readPermisions(keys.producto_textarea_palabrasClaves),
            notas: readPermisions(keys.producto_textarea_nota),
        }

        this.onChangePage = this.onChangePage.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.deleteProducto = this.deleteProducto.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangeSizePag = this.onChangeSizePag.bind(this);
        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.setState({
            modalCancel: false
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    btnReporte() {
        if (this.permisions.btn_reporte.visible == 'A') {
            return (
                <Link to={routes.producto_reporte} className="btns btns-primary">
                    <i className="fa fa-file-text"></i>
                    &nbsp;Reporte
                </Link>
            );
        }
        return null;
    }

    btnImportar() {
        var user = JSON.parse(readData(keysStorage.user));
        var idusuario = (user == null)?null:user.idusuario;
        if (idusuario == 1) {
            return (
                <C_Button 
                    type='primary' title='Importar'
                    onClick={ () => this.setState({ visible_importar: true, }) }
                />
            );
        }
        return null;
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-success"
                    onClick={() => this.showProducto(data)}>
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={routes.producto_edit + '/' + data}
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
        var url = routes.producto_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button 
                    type='primary' title='Nuevo'
                    onClick={this.onCreateData.bind(this)}
                />
            );
        }
        return null;
    }

    loadDataCaracterisctic(data) {

        let array = [];
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                caracteristica: data[i].caracteristica,
                descripcion: data[i].descripcion
            });
        }
        this.setState({
            caracteristicas: array
        });
    }

    showProducto(producto) {
        let id = producto.id;
        httpRequest('get', ws.wsproducto + '/' + id)
        .then((result) => {
            console.log(result)
            if (result.response > 0) {
                let data = result.producto.foto;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push(data[i].foto);
                }
                this.loadDataCaracterisctic(result.caracteristicas);
                this.setState({
                   producto: result.producto,
                   visibleModalVer: true,
                   almacenes: result.almacenes,
                   codigos: result.producto.codigos,
                   //caracteristicas: result.caracteristicas,
                   fotos: arr
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    componentDidMount() {
        this.get_data(1, '', 10);
    }
    get_data(page, value, paginate) {
        httpRequest('get', ws.wsproducto + '/index?page=' + page, {
            value: value,
            paginate: paginate,
        })
        .then((resp) => {
            console.log(resp)
            if (resp.response == 1) {
                
                let array = resp.data;
                let length = array.length;
                let array_data = [];

                let codigospropios = resp.config.codigospropios;

                for (let i = 0; i < length; i++) {
                    array_data.push({
                        id: array[i].idproducto,
                        nro: (i + 1),
                        codigo: codigospropios ? 
                            array[i].codproducto == null ? array[i].idproducto.toString() : array[i].codproducto  : 
                                array[i].idproducto.toString(),
                        descripcion: array[i].descripcion,
                        precio: array[i].precio,
                        tipo: array[i].tipo == 'P' ? 'Producto' : 'Servicio',
                        familia: array[i].familia,
                        stock: array[i].stock,
                    });
                }

                this.setState({
                    array_data: array_data,
                    pagination: resp.pagination,
                    pagina: page,

                    clienteesabogado: resp.config.clienteesabogado,
                    configCodigo: codigospropios,

                });
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

    deleteProLista(id) {

        let data = this.state.productos;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto !== id) {
                array.push(data[i]);
            }
        }
        this.setState({
            productos: array
        });

    }

    deleteProducto(idproducto) {

        httpRequest('delete', ws.wsproducto + '/' + idproducto)
        .then((result) => {
            if (result.response == 1) {
                //this.deleteProLista(producto.idproducto);
                message.success(result.message);
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    nextPaginate() {

    }

    iconZoom() {
        if (this.state.fotos.length > 0) {
            return (
                <i
                    className="styleImg fa fa-search-plus"
                    onClick={() => console.log('hola mundo')/*this.abrirModal.bind(this, 1)*/}>
                </i>
            )
        } else {
            return null;
        }
    }

    iconDelete() {

        if (this.state.fotos.length > 0) {
            return (
                <i
                    className="styleImg fa fa-times"
                    onClick={() => this.deleteImgIndex() }>
                </i>
            )
        } else {
            return null;
        }
    }
    next() {
        this.setState({
            indexImg: (this.state.indexImg + 1) % this.state.fotos.length,
        })
    }

    prev() {
        this.setState({
            indexImg: (this.state.indexImg + this.state.fotos.length - 1) % this.state.fotos.length,
        })
    }

    componentCosto2() {
        if (this.state.producto.costodos > 0) {
            return (
                <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                    <Input
                        title="Costo Dos"
                        value={this.state.producto.costodos}
                        readOnly={true}
                        style={{ textAlign: 'right' }}
                    />
                </div>
            )
        } else
            return null;
    }

    componentCosto3() {
        if (this.state.producto.costotres > 0) {
            return (
                <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                    <Input
                        title="Costo Tres"
                        value={this.state.producto.costotres}
                        readOnly={true}
                        style={{ textAlign: 'right' }}
                    />
                </div>
            )
        } else
            return null;
    }

    componentCosto4() {
        if (this.state.producto.costocuatro > 0) {
            return (
                <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                    <Input
                        title="Costo Cuatro"
                        value={this.state.producto.costocuatro}
                        readOnly={true}
                        style={{ textAlign: 'right' }}
                    />
                </div>
            )
        } else
            return null;
    }

    componentAuxCod() {
        if (this.state.codigos.length > 0) {
            return (
                <div className="cols-lg-3 cols-md-4 cols-sm-6 cols-xs-12">
                    <Input
                        title={this.state.codigos[0].descripcion}
                        value={this.state.codigos[0].codproduadi}
                        readOnly={true}
                    />
                </div>
            );
        } else
            return null;
    }

    abrirModalImage() {
        this.setState({
            modalImage: 'block',
            tecla: 1
        });
    }

    cerrarModalImage() {
        this.setState({
            modalImage: 'none',
            tecla: 0
        })
    }

    componentStock() {
        if (this.state.producto.tipo == 'P' && this.permisions.stock_tot.visible == 'A') {
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginTop': 10, padding: 0}}>
                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                <td colSpan="5"
                                    style={{ 'textAlign': 'center', 'background': '#FFF', 'color': getConfigColor()}}>
                                    Stocks Totales
                                </td>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <td>Total Stock</td>
                                <td>Total Maximo</td>
                                <td>Total Minimo</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.producto.stock}</td>
                                <td>{this.state.producto.stockmaximo}</td>
                                <td>{this.state.producto.stockminimo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    }

    componentStockAlm() {
        if (this.state.producto.tipo == 'P' && this.permisions.stock_alm.visible == 'A') {
            return (
                <table className="table-response-detalle">
                    <thead>
                        <tr>
                            <td colSpan="5"
                                style={{'textAlign': 'center', 'background': '#FFF', 'color': getConfigColor()}}>
                                Stock por Almacen
                            </td>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <td>Almacen</td>
                            <td>Stock Actual</td>
                            <td>Stock Maximo</td>
                            <td>Stcok Minimo</td>
                            <td>Ubicacion</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.almacenes.map((item, key) => {
                            let ubicacion = item.ubicacion == null ? '' : item.ubicacion;
                            return (
                                <tr key={key}
                                    >
                                    <td>{item.almacen}</td>
                                    <td>{item.stock}</td>
                                    <td>{item.stockmaximo}</td>
                                    <td>{item.stockminimo}</td>
                                    <td>{ubicacion}</td>
                                </tr>
                            )})
                        }
                    </tbody>
                </table>
            );
        }
    }

    componentBodyModalVer() {

        const componentCosto2 = this.componentCosto2();
        const componentCosto3 = this.componentCosto3();
        const componentCosto4 = this.componentCosto4();
        const componentAuxCod = this.componentAuxCod();
        const componentStock = this.componentStock();
        const componentStockAlm = this.componentStockAlm();
        let codigo = this.state.configCodigo ? this.state.producto.codproducto : this.state.producto.idproducto;
        let tipo = this.state.producto.tipo == 'P' ? 'Producto' : 'Servicio';
        return (

            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 body-scroll">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Codigo"
                            value={codigo}
                            readOnly={true}
                            permisions={this.permisions.codigo}
                            //configAllowed={this.state.configCodigo}
                        />
                    </div>

                    { componentAuxCod }

                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Tipo"
                            value={tipo}
                            readOnly={true}
                            permisions={this.permisions.tipo}
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Moneda"
                            value={this.state.producto.moneda.descripcion}
                            readOnly={true}
                            permisions={this.permisions.moneda}
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Familia"
                            value={this.state.producto.familia.descripcion}
                            readOnly={true}
                            permisions={this.permisions.familia}
                        />
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-6 cols-md-6 cols-sm-9 cols-xs-12">
                        <Input
                            title ="Descripcion"
                            value={this.state.producto.descripcion}
                            readOnly={true}
                            permisions={this.permisions.descripcion}
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Unidad Medida"
                            value={this.state.producto.unidadmedida.descripcion}
                            readOnly={true}
                            permisions={this.permisions.unidad}
                        />
                    </div>

                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Precio"
                            value={this.state.producto.precio}
                            readOnly={true}
                            permisions={this.permisions.precio}
                            style={{ textAlign: 'right' }}
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Costo"
                            value={this.state.producto.costo}
                            readOnly={true}
                            permisions={this.permisions.costo}
                            style={{ textAlign: 'right' }}
                        />
                    </div>
                    { componentCosto2 }

                    { componentCosto3 }

                    { componentCosto4 }
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12">
                        <div className="card" style={{ 'height':'265px' }}>
                            <div className="card-header">
                                <label style={{'padding': '2px', 'position': 'relative',
                                    'color': '#5D6160', 'font': '500 18px Roboto', 'marginTop': '4px'}}>
                                    Caracteristicas del Producto
                                </label>
                            </div>
                            <div
                                className="card-body"
                                style={{
                                    maxHeight: '265px',
                                    overflowY: 'auto',
                                    padding: 10,
                                    paddingRight: 5,
                                }}>
                                {this.state.caracteristicas.map(
                                    (resultado, indice) => (
                                        <div key={indice} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                            style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                                            <div className="cols-lg-4 cols-md-4 cols-sm-4">
                                                <Input
                                                    value={resultado.caracteristica}
                                                    readOnly={true}
                                                    title='Caracteristica*'
                                                />
                                            </div>
                                            <div className="cols-lg-8 cols-md-8 cols-sm-8">
                                                <Input
                                                    value={resultado.descripcion}
                                                    readOnly={true}
                                                    title={resultado.caracteristica}
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12"
                        style={{'marginTop': '35px'}}>
                        <CImage
                            //onChange={this.selectImg.bind(this)}
                            //image={this.state.img}
                            images={this.state.fotos}
                            next={this.next}
                            prev={this.prev}
                            index={this.state.indexImg}
                            modeView={true}
                            permisions={this.permisions.foto}
                        />
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    { componentStockAlm }

                    { componentStock }

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{
                            marginTop: 32
                        }}>
                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                            <TextArea
                                title="Palabras Claves"
                                value={this.state.producto.palabrasclaves == null ? '' : this.state.producto.palabrasclaves }
                                readOnly={true}
                                permisions={this.permisions.pal_clave}
                            />
                        </div>
                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={this.state.producto.notas == null ? '' : this.state.producto.notas }
                                readOnly={true}
                                permisions={this.permisions.notas}
                            />
                        </div>
                    </div>

                </div>

            </div>
        );
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    openModalEli() {
        this.setState({ visibleModalEli: true });
    }

    showDeleteConfirm(thisContex, id) {
        Modal.confirm({
            title: 'Elimiar Producto',
            content: '¿Estas seguro de eliminar el Producto?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                thisContex.deleteProducto(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    closeModalEli() {
        this.setState({ visibleModalEli: false });
    }

    onChangePage(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }

    onChangeSearch(value) {
        this.setState({
            buscar: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.get_data(1, value, this.state.nroPaginacion), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSizePag(value) {
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }

    onSubmitImportar(event) {
        event.preventDefault();
        

        // httpRequest('post', ws.wsimportarproducto, { namealmacen: this.state.namealmacen, linkarchivo: this.state.linkarchivo })
        // .then((result) => {
        //     console.log(result)
        //     if (result.response == 1) {
        //         //this.deleteProLista(producto.idproducto);
                
        //         message.success(result.message);
        //         var img = document.getElementById('img-img');
        //         img.value = '';
        //         this.setState({ 
        //             visible_importar: false, loading_importar: false, 
        //             namealmacen: '', linkarchivo: '', filearchivo: '',
        //         });
        //         this.get_data(1, '', 10);
        //         return;
        //     } else if (result.response == -2) {
        //         this.setState({ noSession: true })
        //     } else {
        //         message.error(result.message);
        //     }
        //     this.setState({ visible_importar: false, loading_importar: false, })
        // })
        // .catch((error) => {
        //     console.log(error);
        //     message.error(strings.message_error);
        // })

        
        if (this.state.namealmacen.toString().trim().length == 0) {
            notification.error({
                description: 'EL CAMPO NOMBRE DE ALMACEN ES REQUERIDO.',
            });
            return;
        }
        if (this.state.filearchivo.toString().trim().length == 0) {
            notification.error({
                description: 'EL CAMPO ARCHIVO ES REQUERIDO.',
            });
            return;
        }

        this.setState({ loading_importar: true, })

        const connection = readData(keysStorage.connection);
        var formdata = new FormData();
        formdata.append('namealmacen', this.state.namealmacen);
        formdata.append('linkarchivo', this.state.linkarchivo);
        formdata.append('filearchivo', this.state.filearchivo);
        formdata.append('x_conexion', connection);

        axios(
            {
                method: 'post',
                url: '/api/producto/importararchivoproducto',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'enctype' : 'multipart/form-data',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
            }
        ).then(
            response => {
                this.setState({ loading_importar: false, });
                console.log(response.data)
                if (response.data.response == 1) {
                    message.success('Exito en importar el producto');
                    var img = document.getElementById('img-img');
                    img.value = '';
                    this.setState({ 
                        visible_importar: false,
                        namealmacen: '', linkarchivo: '', filearchivo: '',
                    });
                    this.get_data(1, '', 10);
                    return;
                }
                notification.error({
                    message: 'ERROR',
                    description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE INTENTAR.',
                });
            }
        ).catch( error => {
            this.setState({ loading_importar: false, });
            notification.error({
                message: 'ERROR',
                description: 'HUBO UN ERROR AL SOLICITAR SERVICIO FAVOR DE REVISAR CONEXION.',
            });
        } ); 



    }

    onChangeFoto(event) {
        let files = event.target.files;
        console.log(files[0])
        if ((files[0].type === 'application/vnd.ms-excel') ) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    // foto: e.target.result,
                    filearchivo: files[0],
                });
            };
            reader.readAsDataURL(event.target.files[0]);
            return;
        }
        setTimeout(() => {
            var img = document.getElementById('img-img');
            img.value = '';
            notification.warning({
                message: 'ADVERTENCIA',
                description: 'ARCHIVO INVALIDO',
            });
            this.setState({
                filearchivo: '',
            });
        }, 500);
        return;
    }
    componentImportar() {
        return (
            <Confirmation
                visible={this.state.visible_importar}
                title="Importar Producto"
                onCancel={ () => this.setState({ visible_importar: false, }) }
                onClick={ this.onSubmitImportar.bind(this) }
                width={500} loading={this.state.loading_importar}
                content = {
                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1"></div>
                            <C_Input
                                className="cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12 pt-bottom"
                                title='Almacen'
                                value={this.state.namealmacen}
                                onChange={ (value) => this.setState({ namealmacen: value, }) }
                            />
                        </div>

                        {/* <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1"></div>
                            <C_Input
                                className="cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12 pt-bottom"
                                title='Direccion de Archivo'
                                value={this.state.linkarchivo}
                                onChange={ (value) => this.setState({ linkarchivo: value, }) }
                            />
                        </div> */}
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className="cols-lg-1 cols-md-1"></div>
                            <div className={'cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12 pt-bottom'}>
                                <div className='inputs-groups'>
                                    <input type='file' id='img-img'
                                        style={{ textAlign: 'left', paddingLeft: 8, paddingTop: 2, paddingRight: 10, fontSize: 10, }}
                                        className={`forms-control`}
                                        onChange={this.onChangeFoto.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                }
            />
        );
    }

    render() {
        var columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Codigo',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Precio',
                dataIndex: 'precio',
                key: 'precio',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.precio - b.precio,
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.precio.localeCompare(b.precio)}
            },
            {
                title: 'Familia',
                dataIndex: 'familia',
                key: 'familia',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.familia.localeCompare(b.familia)}
            },
            (this.state.clienteesabogado)?{}:
            {
                title: 'Stock Total',
                dataIndex: 'stock',
                key: 'stock',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.stock.localeCompare(b.stock)}
            },

            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        if (this.state.noSession) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        const btnReporte = this.btnReporte();
        const btnImportar = this.btnImportar();
        return (
            <div className="rows">

                <Modal
                    title="Datos del Producto"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    style={{'top': '18px'}}
                    width={850}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,
                    }}
                    //cancelText={"Cancelar"}
                    //okText={"Aceptar"}
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
                    title="Eliminar Producto"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar el Producto?
                            </label>
                        </div>
                    ]}
                />

                {this.componentImportar()}

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Producto</h1>
                        </div>
                        <div className="pulls-right">
                            { /*btnReporte*/ }
                            { btnNuevo }
                            { btnImportar }
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value={this.state.nroPaginacion}
                                onChange={this.onChangeSizePag}
                                title='Mostrar'
                                className=''
                                style={{ width: 65 }}
                                component={[
                                    <Option key={0} value={10}>10</Option>,
                                    <Option key={1} value={25}>25</Option>,
                                    <Option key={2} value={50}>50</Option>,
                                    <Option key={3} value={100}>100</Option>
                                ]}
                            />
                        </div>

                        <div className="pulls-right">
                            <C_Input
                                value={this.state.buscar}
                                onChange={this.onChangeSearch}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={columns}
                                dataSource={this.state.array_data}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="nro"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent={this.state.pagina}
                            onChange={this.onChangePage}
                            total={this.state.pagination.total}
                            pageSize={this.state.nroPaginacion}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(IndexProducto);
