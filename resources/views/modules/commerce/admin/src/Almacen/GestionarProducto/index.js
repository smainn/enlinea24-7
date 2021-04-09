
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Pagination, Modal, Table, message,Select } from 'antd';
import ws from '../../../tools/webservices';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import { httpRequest, removeAllData, readData, saveData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import CImage from '../../../components/image';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';

const {Option} = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';

class IndexProducto extends Component {

    constructor(props){
        super(props);
        this.state = {
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
            pagination: {},
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
            timeoutSearch: undefined,
            busqueda: ''
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
            {
                title: 'Unidad Medida',
                dataIndex: 'unidadmedida',
                key: 'unidadmedida',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.unidadmedida.localeCompare(b.unidadmedida)}
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
    }

    btnReporte() {
        if (this.permisions.btn_reporte.visible == 'A') {
            return (
                <Link to="/commerce/admin/producto/reporte" className="btns btns-primary">
                    <i className="fa fa-file-text"></i>
                    &nbsp;Reporte
                </Link>
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
                    onClick={() => this.showDeleteConfirm(this, id)}>
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = "/commerce/admin/producto/create";
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

    obtenerProductos() {
        httpRequest('get', ws.wsproducto)
        .then((resp) => {
            if (resp.response == 1) {
                let array = resp.data;
                let length = array.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: array[i].idproducto,
                        nro: (i + 1),
                        codigo: this.state.configCodigo ? array[i].codproducto : array[i].idproducto.toString(),
                        descripcion: array[i].descripcion,
                        precio: array[i].precio,
                        tipo: array[i].tipo == 'P' ? 'Producto' : 'Sercvicio',
                        familia: array[i].familia,
                        unidadmedida: array[i].unidadmedida
                    });
                }
                
                this.setState({
                    productos: arr,
                    productosDefault: arr,
                    pagination: resp.pagination,
                    paginationDefault: resp.pagination,
                });
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
        })

    }

    componentDidMount() {
        this.getConfigsClient();
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            this.obtenerProductos();
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

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
                this.cerrarModalImage();
            }
            if (e.key === 'ArrowRight') {
                this.siguienteImg();
            }
            if(e.key === 'ArrowLeft') {
                this.anteriorImg();
            }
        }
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
                console.log('Se elimino correctamente');
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
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
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
        if (this.state.producto.tipo == 'P') {
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginTop': 10, padding: 0}}>
                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                <td colSpan="5"
                                    style={{ 'textAlign': 'center', 'background': '#FFF', 'color': '#225ccc'}}>
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

    componentBodyModalVer() {

        const componentCosto2 = this.componentCosto2();
        const componentCosto3 = this.componentCosto3();
        const componentCosto4 = this.componentCosto4();
        const componentAuxCod = this.componentAuxCod();
        const componentStock = this.componentStock();
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
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                        <Input
                            title ="Costo"
                            value={this.state.producto.costo}
                            readOnly={true}
                            permisions={this.permisions.costo}
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

                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                <td colSpan="5"
                                    style={{'textAlign': 'center', 'background': '#FFF', 'color': '#225ccc'}}>
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
                                let ubicacion = item.ubicacion == null ? '' : item.ubicacion.descripcion;
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

    onChangePage(page, pageSize) {
        httpRequest('get', ws.wsproducto + '?page=' + page, {
            busqueda: this.state.busqueda,
            paginate: this.state.cantPaginas
        })
        .then((result) => {
            if (result.response > 0) {
                let array = result.data;
                let length = array.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: array[i].idproducto,
                        nro: this.state.cantPaginas * (page - 1) + i + 1,
                        codigo: this.state.configCodigo ? array[i].codproducto : array[i].idproducto.toString(),
                        descripcion: array[i].descripcion,
                        precio: array[i].precio,
                        tipo: array[i].tipo == 'P' ? 'Producto' : 'Servicio',
                        familia: array[i].familia,
                        unidadmedida: array[i].unidadmedida
                    });
                }
                saveData(keysStorage.paginate_producto, JSON.stringify({
                    nro: page,
                    cant: this.state.cantPaginas
                }));
                this.setState({
                    productos: arr,
                    productosDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchProducto2(value, cantPaginas) {
        httpRequest('get', ws.wsproducto, {
            busqueda: value,
            paginate: cantPaginas
        })
        .then((resp) => {
            if (resp.response == 1) {
                let array = resp.data;
                let length = array.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: array[i].idproducto,
                        nro: this.state.cantPaginas * (this.state.nroPagina - 1) + i + 1,
                        codigo: this.state.configCodigo ? array[i].codproducto : array[i].idproducto.toString(),
                        descripcion: array[i].descripcion,
                        precio: array[i].precio,
                        tipo: array[i].tipo == 'P' ? 'Producto' : 'Sercvicio',
                        familia: array[i].familia,
                        unidadmedida: array[i].unidadmedida
                    });
                }
                this.setState({
                    productos: arr,
                    pagination: resp.pagination
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

    searchProducto(value) {
        if (value.length > 0) {
            if (this.state.timeoutSearch) {
                clearTimeout(this.state.timeoutSearch);
                this.setState({ timeoutSearch: undefined })
            }
            this.state.timeoutSearch = setTimeout(() => this.searchProducto2(value, this.state.cantPaginas), 300);
            this.setState({
                timeoutSearch: this.state.timeoutSearch
            })
        } else {
            clearTimeout(this.state.timeoutSearch);
            this.setState({
                productos: this.state.productosDefault,
                pagination: this.state.paginationDefault,
                timeoutSearch: undefined
            })
        }
    }

    onChangeSearch(value) {
        this.searchProducto(value);
        this.setState({
            busqueda: value
        })
    }

    onChangeSizePag(value) {
        this.searchProducto2(null, value);
        this.setState({
            cantPaginas: value,
            nroPagina: 1,
        })
    }

    render() {
        if (this.state.noSession) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        const btnReporte = this.btnReporte();
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
                    cancelText={"Cancelar"}
                    okText={"Aceptar"}
                >

                    { componentBodyModalVer }

                </Modal>
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Producto</h1>
                        </div>
                        <div className="pulls-right">
                            { /*btnReporte*/ }
                            { btnNuevo }
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value={this.state.cantPaginas}
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
                                value={this.state.busqueda}
                                onChange={this.onChangeSearch}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.productos}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="nro"
                            />
                        </div>
                    </div>
                    {/*}
                    <div className="forms-groups">

                        <div className="tabless">

                            <table className="tables-respons">

                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Codigo</th>
                                        <th>Descripcion</th>
                                        <th>Precio</th>
                                        <th>Tipo</th>
                                        <th>Familia</th>
                                        <th>Unidad Medida</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.state.productos.map((item, key) => {
                                            let codigo = item.idproducto;
                                            if (this.state.configCodigo) {
                                                codigo = item.codproducto == null ? '' : item.codproducto;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo}</td>
                                                    <td>{item.descripcion}</td>
                                                    <td>{item.precio}</td>
                                                    <td>{(item.tipo == 'P') ? 'Producto' : 'Servicio'}</td>
                                                    <td>{item.familia}</td>
                                                    <td>{item.unidadmedida}</td>
                                                    <td>

                                                        { this.btnVer(item) }

                                                        { this.btnEditar(item.idproducto) }

                                                        { this.btnEliminar(item) }

                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                                */}
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent={this.state.nroPagina}
                            onChange={this.onChangePage}
                            total={this.state.pagination.total}
                            pageSize={this.state.cantPaginas}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(IndexProducto);
