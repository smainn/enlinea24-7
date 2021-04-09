
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString, dateHourToString } from '../../../tools/toolsDate';
import { 
    wsingresoproducto, 
    wstiposalingresotrans,
    wssearchproducto,
    wsalmacen,
    wsgetalmacenprod
} from '../../../WS/webservices';

const { Option } = Select;


const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
let dateReference = new Date();
export default class EditIngresoPro extends Component{

    constructor(){
        super();
        this.state = {
            codingresoprod: '',
            fechahora: dateHourToString(dateReference),
            notas: '',
            idtipo: 0,
            idalmacen: 0,
            resultProductos: [],
            productosSelected: [],
            idsAlmacenProd: [],
            idsEliminados: [],
            almacenesProd: [],
            tipos: [],
            almacenes: [],
            cantidades: [],
            cantidadesStac: [],
            stocksAlm: [],
            stocksProd: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,
            redirect: false,
        }

        this.handleCodIngresoPro = this.handleCodIngresoPro.bind(this);
        this.handleFechaHora = this.handleFechaHora.bind(this);
        this.handleNotas = this.handleNotas.bind(this);
        this.handleTipo = this.handleTipo.bind(this);
        this.handleValProd = this.handleValProd.bind(this);
        this.searchProducto = this.searchProducto.bind(this);
        this.handleSearchProd = this.handleSearchProd.bind(this);
        this.handleCantidad = this.handleCantidad.bind(this);
        this.handleAlmacen = this.handleAlmacen.bind(this);
        this.handleAlmacenProd = this.handleAlmacenProd.bind(this);
        this.updateIngresoProducto = this.updateIngresoProducto.bind(this);
    }

    handleCodIngresoPro(e) {
        this.setState({
            codingresoprod: e.target.value
        });
    }

    handleFechaHora(date, dateString) {
        this.setState({
            fechahora: dateString
        });
    }

    handleTipo(e) {
        this.setState({
            idtipo: e.target.value
        });
    }

    handleNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    handleCantidad(e) {
        this.state.cantidades[e.target.id] = parseInt(e.target.value);
        this.setState({
            cantidades: this.state.cantidades
        });
        //console.log(this.state.cantidades);
    }

    handleAlmacen(e) {
        this.setState({
            idalmacen: e.target.value
        },
            () => this.actualizarSelectsAlmacen()
        );
    }

    handleAlmacenProd(e) {
        console.log('INDEX ', e.target.id);
        console.log('ALMACENS ', this.state.almacenesProd);
        let array = this.state.almacenesProd[e.target.id];
        let idalmacenprod = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idalmacen == e.target.value) {
                idalmacenprod = array[i].idalmacenproddetalle;
                break;
            }
        }
        this.state.idsAlmacenProd[e.target.id].idalmacen = parseInt(e.target.value);
        this.state.idsAlmacenProd[e.target.id].idalmacenprod = idalmacenprod;

        this.setState({
            idsAlmacenProd: this.state.idsAlmacenProd
        });
    }

    searchProducto(value) {
        if (value.length > 0) {
            axios.get(wssearchproducto + '/' + value)
            .then((resp) => {
                let result = resp.data;
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else {
    
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    handleSearchProd(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchProducto(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    actualizarSelectsAlmacen() {
        let array = this.state.almacenesProd;
        for (let i = 0; i < array.length; i++) {
            let arr = array[i];
            let idalmacen = 0;
            let idalmacenprod = 0;
            for(let j = 0; j < arr.length; j++) {
                if (arr[j].idalmacen == this.state.idalmacen) {
                    idalmacen = arr[j].idalmacen;
                    idalmacenprod = arr[j].idalmacenprod;
                    break;
                }
            }
            this.state.idsAlmacenProd[i].idalmacen = idalmacen;
            this.state.idsAlmacenProd[i].idalmacenprod = idalmacenprod;
        }
        this.setState({
            idsAlmacenProd: this.state.idsAlmacenProd
        });
    }

    async handleValProd(value) {
        console.log('HANDLE VAL ', value);
        let productSelected = this.getProductoSelected(value);
        
        console.log('PRODUCTO SELECT ', productSelected);
        if (productSelected) {
            let almacenes = await this.getAlmacemProducto(productSelected);
            console.log('ALMACENES ', almacenes);
            var option = 0;
            var idalmacenprod = 0;
            for (let i = 0; i < almacenes.length; i++) {
                //console.log('ELEMTN ', almacenes[i]);
                if (almacenes[i].idalmacen == this.state.idalmacen) {
                    option = this.state.idalmacen;
                    idalmacenprod = almacenes[i].idalmacenprod
                    break;
                }
            }
            let obj = {
                idalmacen: option,
                idalmacenprod: idalmacenprod,
                idingresodetalle: -1
            };
            //console.log('ENTRO SI');
            /*
            productosSelected: this.state.productosSelected,
            cantidades: this.state.cantidades,
            cantidadesStac: this.state.cantidadesStac,
            almacenesProd: this.state.almacenesProd,
            idsAlmacenProd: this.state.idsAlmacenProd,
            valueSeacrhProd: undefined,
            idsEliminados: this.state.idsEliminados,
            idsAlmacenProd: this.state.idsAlmacenProd,
            stocksAlm: this.state.stocksAlm,
            stocksProd: this.state.stocksProd
            */
            this.setState({
                valueSeacrhProd: value,
                productosSelected: [
                    ...this.state.productosSelected,
                    productSelected
                ],
                cantidades: [
                    ...this.state.cantidades,
                    ''
                ],
                almacenesProd: [
                    ...this.state.almacenesProd,
                    almacenes
                ],
                idsAlmacenProd: [
                    ...this.state.idsAlmacenProd,
                    obj
                ]
            });
        } else {
            //console.log('ENTRO NO');
            this.setState({
                valueSeacrhProd: value
            });
        }
        
    }

    /** Metedos Auxiliar */
    //Metodo devuelve null si el producto no existe
    //o si ya fue seleccionado
    getProductoSelected(id) {
        let array = this.state.resultProductos;
        let arraySeleted = this.state.productosSelected;
        let length = arraySeleted.length;
        for (let i = 0; i < length; i++) {
            if (arraySeleted[i].idproducto == id) {
                console.log('YA ESTA SELECCIONADO');
                return false;
            }
        }

        length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idproducto == id) {
                console.log('SELECCIONADO');
                return array[i];
            }
        }
        console.log('SE FUE');
        return false;
    }
    /** */

    getAlmacenes() {
        axios.get(wsalmacen)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                this.setState({
                    almacenes: result.data,
                    idalmacen: result.data[0].idalmacen
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getIdsProductosSeleceted() {
        
        let data = this.state.productosSelected;
        let array = [];
        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push(data[i].idproducto);
        }
        return array;
    }

    validarDatos() {
        
        if (this.state.codingresoprod.length === 0) {
            message.error('El codigo es obligatorio');
            return false;
        }
        for (let i = 0; i < this.state.idsAlmacenProd.length; i++) {
            if (this.state.idsAlmacenProd[i].idalmacen == 0) {
                message.error('Debe seleccionar un almacen para ' + this.state.productosSelected[i].descripcion);
                return;
            }
        }

        let data = [];
        let array = this.state.cantidades;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i] == '' || array[i] <= 0) {
                message.warning('La cantidad del producto debe ser mayor que cero');
                return false;
            }
        }
        return true;
    }

    getIngresosNuevos(cantidades, almacenesprod, productos) {
        
        let array = this.state.idsAlmacenProd;
        let del = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].idingresodetalle == -1) {
                cantidades.push(this.state.cantidades[i]);
                almacenesprod.push(array[i].idalmacenprod);
                productos.push(this.state.productosSelected[i].idproducto);
                del.push(i);
            }
        }
        console.log('IDS ALMC PROD 0', this.state.idsAlmacenProd);
        for (let i = 0; i < del.length; i++) {
            this.state.cantidades.splice(del[i], 1);
            this.state.productosSelected.splice(del[i], 1);
            this.state.cantidades.splice(del[i], 1);
            this.state.productosSelected.splice(del[i], 1);
            this.state.idsAlmacenProd.splice(del[i], 1);
        }
        console.log('IDS ALMC PROD', this.state.idsAlmacenProd);
    }

    getIdsAlmacenProd() {
        console.log('IDS ALMC PROD2', this.state.idsAlmacenProd);
        let array = this.state.idsAlmacenProd;
        let data = [];
        for (let i = 0; i < array.length; i++) {
            data.push(array[i].idalmacenprod);
        }
        return data;
    }

    getIdsIngresoDetalle() {
        
        let array = this.state.idsAlmacenProd;
        let data = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].idalmacenprod != -1) {
                data.push(array[i].idingresodetalle);
            }
        }
        return data;
    }

    updateIngresoProducto(e) {
        e.preventDefault();
        if (!this.validarDatos()) return;
        
        let cantidadesNew = [];
        let idsAlmacenProdNew = [];
        let idsProductosNew = [];
        this.getIngresosNuevos(cantidadesNew, idsAlmacenProdNew, idsProductosNew);
        let idsProductos = this.getIdsProductosSeleceted();
        let idsIngresoDet = this.getIdsIngresoDetalle();
        let idsAlmacenProd = this.getIdsAlmacenProd();
        let body = {
            codingresoprod: this.state.codingresoprod,
            idtipo: this.state.idtipo,
            fechahora: this.state.fechahora,
            notas: this.state.notas,
            cantidades: JSON.stringify(this.state.cantidades),
            idsProductos: JSON.stringify(idsProductos),
            idsAlmacenProd: JSON.stringify(idsAlmacenProd),
            cantidadesNew: JSON.stringify(cantidadesNew),
            idsProductosNew: JSON.stringify(idsProductosNew),
            idsAlmacenProdNew: JSON.stringify(idsAlmacenProdNew),
            idsEliminados: JSON.stringify(this.state.idsEliminados),
            idsIngresoDet: JSON.stringify(idsIngresoDet)
        };

        console.log("BODY ",body);
        
        axios.put(wsingresoproducto + '/' + this.props.match.params.id, body)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP SERVE STORE ',result);
            if (result.response > 0) {
                message.success(result.message);
                this.setState({redirect: true});
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    diferencia(a, b) {
        if (a > b) 
            return a - b;
        return b - a;
    }

    removeProductSelected(index) {
 
        if (this.state.idsAlmacenProd[index].idingresodetalle > 0) {
            /*
            let cantidad = this.state.cantidadesStac[index];
            let dif1 = this.state.stocksAlm[index] - cantidad;
            let dif2 = this.state.stocksProd[index] - cantidad;
            if (dif1 <= 0 || dif2 <= 0) {
                message.error('No se puede eliminar el registro');
                return;
            }
            */
            this.state.idsEliminados.push(this.state.idsAlmacenProd[index].idingresodetalle);
        }
        this.state.productosSelected.splice(index, 1);
        this.state.cantidades.splice(index, 1);
        this.state.almacenesProd.splice(index, 1);
        this.state.stocksAlm.splice(index, 1);
        this.state.stocksProd.splice(index, 1);
        this.state.cantidadesStac.splice(index, 1);
        this.state.idsAlmacenProd.splice(index, 1);
        this.setState({
            productosSelected: this.state.productosSelected,
            cantidades: this.state.cantidades,
            cantidadesStac: this.state.cantidadesStac,
            almacenesProd: this.state.almacenesProd,
            idsAlmacenProd: this.state.idsAlmacenProd,
            valueSeacrhProd: undefined,
            idsEliminados: this.state.idsEliminados,
            stocksAlm: this.state.stocksAlm,
            stocksProd: this.state.stocksProd
        });
        console.log('PRODUCT SELECT ', this.state.productosSelected)
    }


    componentDidMount() {
        this.getTiposSalIngreTransp();
        this.getAlmacenes();
        this.getIngresoProducto();
    }

    async getIngresoProducto() {
        axios.get(wsingresoproducto + '/' + this.props.match.params.id + '/edit')
        .then((resp) => {
            let result = resp.data;
            console.log('RESP INGRE', result);
            if (result.response > 0) {
                let data = result.data;
                let productos = [];
                let almacenesProd = [];
                let idsAlmacenProd = [];
                let cantidades = [];
                for (let i = 0; i < data.length; i++) {
                    this.state.stocksAlm.push(data[i].almacenprod.stock);
                    this.state.stocksProd.push(data[i].producto.stock);
                    productos.push(data[i].producto);
                    //let almacenes = await this.getAlmacemProducto(data[i].almacen.producto);
                    idsAlmacenProd.push({
                        idalmacen: data[i].almacenprod.almacen.idalmacen,
                        idalmacenprod: data[i].idalmacenprod,
                        idingresodetalle: data[i].idingresodetalle
                    });
                    almacenesProd.push(data[i].almacenes);
                    cantidades.push(data[i].cantidad);
                }
                console.log('IDS ALMAC' ,idsAlmacenProd);
                let ingresoprod = result.ingresoprod
                this.setState({
                    codingresoprod: ingresoprod.codingresoprod,
                    fechahora: ingresoprod.fechahora,
                    notas: ingresoprod.notas == null ? '' : ingresoprod.notas,
                    idtipo: ingresoprod.fkidingresosalidatrastipo,
                    almacenesProd: almacenesProd,
                    productosSelected: productos,
                    idsAlmacenProd: idsAlmacenProd,
                    cantidades: cantidades,
                    cantidadesStac: cantidades,
                    stocksAlm: this.state.stocksAlm,
                    stocksProd: this.state.stocksProd
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getTiposSalIngreTransp() {
        axios.get(wstiposalingresotrans)
        .then((resp) => {
            let result = resp.data;
            //console.log('RESP TIPO', resp);
            if (result.response > 0 && result.data.length > 0) {
                this.setState({
                    tipos: result.data,
                    //idtipo: result.data[0].idingresosalidatrastipo
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleChangeListaPrecio(value) {
        this.getListaProductos(value);
        console.log(`selected ${value}`);
    }
    
    onOk(value) {
        console.log('VALUE ', value);
    }

    async getAlmacemProducto(producto) {
        return await axios.get(wsgetalmacenprod + '/' + producto.idproducto)
        .then((resp) => {
            let result = resp.data;
            //console.log('RESP SERV GETALM ', result);
            if (result.response > 0) {
                return result.data;
            }
            return [];
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
    }

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/ingresoproducto/index"/>
            )
        }
        //let dataListaPrecios = this.state.listaprecios.filter(o => !selectedListaPrecios.includes(o));
        return (
            <div>
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Editar Ingreso de Producto </h1>
                    </div>
                </div>

                <form 
                    id="form_register"
                    className="formulario-content" 
                    encType="multipart/form-data"
                    onSubmit={this.updateIngresoProducto}
                >
        
                    <div className="form-group-content col-lg-12-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <input 
                                    id="descripcion" 
                                    type="text"
                                    value={this.state.codingresoprod}
                                    placeholder="Codigo"
                                    onChange={this.handleCodIngresoPro}
                                    className="form-control-content"
                                />
                                <label 
                                    htmlFor="descripcion" 
                                    className="label-content"
                                > 
                                    Codigo
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select
                                    id="tipo"
                                    className="form-control-content"
                                    onChange={this.handleTipo}
                                    value={this.state.idtipo}
                                >
                                    {
                                        this.state.tipos.map((item, key) => (
                                            <option 
                                                key={key}
                                                value={item.idingresosalidatrastipo}>
                                                {item.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label 
                                    htmlFor="tipo" 
                                    className="label-content"> Tipo ingreso 
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select
                                    id="almacen"
                                    className="form-control-content"
                                    onChange={this.handleAlmacen}
                                >
                                    {
                                        this.state.almacenes.map((item, key) => (
                                            <option 
                                                key={key}
                                                value={item.idalmacen}>
                                                {item.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label 
                                    htmlFor="almacen" 
                                    className="label-content"> Almacen
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                {/*}
                                <input 
                                    id="fechahora" 
                                    type="date"
                                    value={this.state.fechahora}
                                    //placeholder="Valor"
                                    onChange={this.handleFechaHora}
                                    className="form-control-content" 
                                    />
                                */}    
                                <DatePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm'
                                    placeholder="Select Time"
                                    value={moment(this.state.fechahora,'YYYY-MM-DD HH:mm')}
                                    onChange={this.handleFechaHora}
                                    onOk={this.onOk}
                                />
                                <label 
                                    htmlFor="fechahora" 
                                    className="label-content"
                                >
                                    Fecha-Hora 
                                </label>

                            </div>

                            <div className="input-group-content col-lg-6-content">
                                <label
                                    htmlFor="notas"
                                    className="label-group-content">
                                    Notas
                                </label>
                                <textarea
                                    id="notas"
                                    type="text"
                                    className="textarea-content"
                                    value={this.state.notas}
                                    onChange={this.handleNotas}
                                />
                            </div>

                        </div>

                    </div>
                    
                    <div className="form-group-content col-lg-12-content">
                    
                        <div 
                            className="col-lg-9-content"
                            style={{marginLeft: WIDTH_WINDOW * 0.1}}
                        >
                            <div className="col-lg-6-content">
                                <Select
                                    showSearch
                                    value={this.state.valueSeacrhProd}
                                    placeholder={"Buscar producto por Id o descripcion"}
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchProd}
                                    onChange={this.handleValProd}
                                    notFoundContent={null}
                                >
                                    {this.state.resultProductos.map((item, key) => (
                                        <Option 
                                            key={key} value={item.idproducto}>
                                            {item.idproducto + " " + item.descripcion}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    
                        <div 
                            className="form-group-content col-lg-10-content"
                            style={{ marginLeft: WIDTH_WINDOW * 0.06 }}
                        >
                            <div className="col-lg-12-content">
                                {/*}
                                <Table 
                                    columns={columnsProducts} 
                                    dataSource={dataProducts} 
                                />
        
                                */}
                                <div className="col-lg-1-content">
                                    <label style={{color: 'black'}}>Nro</label>
                                </div>
                                <div className="col-lg-2-content">
                                    <label style={{color: 'black'}}>Id Producto</label>
                                </div>
                                <div className="col-lg-4-content">
                                    <label style={{color: 'black'}}>Descripcion</label>
                                </div>
                                <div className="col-lg-2-content">
                                    <label style={{color: 'black'}}>Almacen</label>
                                </div>
                                <div className="col-lg-2-content">
                                    <label style={{color: 'black'}}>Cantidad</label>
                                </div>
                                <div className="col-lg-1-content">
                                    <label style={{color: 'black'}}>Accion</label>
                                </div>
                            </div>

                            <div className="caja-content">
                                {
                                    this.state.productosSelected.map((item, key) => (
                                        <div
                                            className="col-lg-12-content border-table"
                                            key={key}
                                            /*
                                            style={{ 
                                                marginTop: -10, 
                                                marginBottom: -10,
                                                borderBottom: 1,
                                                borderBottomColor: 'black',
                                                bottom
                                            }}*/
                                            >
                                            <div className="col-lg-1-content">
                                                <label>{key + 1}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <label>{item.idproducto}</label>
                                            </div>
                                            <div className="col-lg-4-content">
                                                <label>{item.descripcion}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <select
                                                    id={key}
                                                    className="form-control-content"
                                                    onChange={this.handleAlmacenProd}
                                                    value={this.state.idsAlmacenProd[key].idalmacen}
                                                >
                                                    <option value={0}>
                                                        Seleccionar
                                                    </option>
                                                    {
                                                        this.state.almacenesProd[key].map((item, key) => (
                                                            <option 
                                                                key={key}
                                                                value={item.idalmacen}>
                                                                {item.descripcion}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <input 
                                                    id={key} 
                                                    type="number"
                                                    value={this.state.cantidades[key]}
                                                    placeholder="Cantidad"
                                                    onChange={this.handleCantidad}
                                                    className="form-control-content" 
                                                />
                                            </div>
                                            <div className="col-lg-1-content">
                                                <i
                                                    className="fa fa-remove btn-content btn-danger-content"
                                                    key={key}
                                                    onClick={() => this.removeProductSelected(key)}>
                                                </i>
                                            </div>
                                        </div>    
                                        
                                    ))
                                }
                            </div>

                        </div>
         
                    </div>
                    
                    <div className="form-group-content">

                        <div className="text-center-content">
                            <button type="submit" className="btn-content btn-success-content">
                                Guardar
                            </button>
                            <button
                                className="btn-content btn-danger-content" 
                                type="button" 
                                onClick={() => this.setState({redirect: true})}>
                                Cancelar
                            </button>
                        </div>

                    </div>

                </form>

                
            </div>
        );
    }
}


