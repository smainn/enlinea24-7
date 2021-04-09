
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select, DatePicker } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString } from '../../../tools/toolsDate';
const { Option } = Select;

const URL_GET_MONEDAS= '/commerce/api/moneda';
const URL_GET_LISTA_PRECIOS = '/commerce/api/listaprecio';
const URL_EDTI_LISTA_PRECIO = '/commerce/api/listaprecio/';
const URL_UPDATE_LISTA_PRECIO = '/commerce/api/listaprecio/';
const URL_GET_LISTA_PRODUCTOS = '/commerce/api/listaproductos/';
const URL_SEARCH_PRODUCTO = '/commerce/api/producto/search/';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;

var timeoutSearch;

let dateReference = new Date();
export default class EditListaPrecio extends Component{

    constructor(){
        super();
        this.state = {
            descripcion: '',
            fijoporcentaje: 'F',
            estado: 'A',
            fechaini: dateToString(dateReference),
            fechafin: dateToString(dateReference),
            idmoneda: 0,
            valor: 0,
            accion: 'D',
            notas: '',
            selectedListaPrecios: [],
            productosEliminados: [],
            dataPreciosProd: [],
            dataPreciosProd2: [],
            listaprecios: [],
            idsListaPrecios: [],
            monedas: [],
            productosSelected: [],
            resultProductos: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,
            redirect: false,
        }

        this.handleDescripcion = this.handleDescripcion.bind(this);
        this.handleFijoPorcentaje = this.handleFijoPorcentaje.bind(this);
        this.handleMoneda = this.handleMoneda.bind(this);
        this.handleValor = this.handleValor.bind(this);
        this.handleFechaInicio = this.handleFechaInicio.bind(this);
        this.handleFechaFin = this.handleFechaFin.bind(this);
        this.handleAccion = this.handleAccion.bind(this);
        this.handleSelectedLista = this.handleSelectedLista.bind(this);
        this.handleChangeListaPrecio = this.handleChangeListaPrecio.bind(this);
        this.handleBlurListaPrecio = this.handleBlurListaPrecio.bind(this);
        this.handleFocusListaPrecio = this.handleFocusListaPrecio.bind(this);
        this.handlePrecioProd = this.handlePrecioProd.bind(this);
        this.handleValProd = this.handleValProd.bind(this);
        this.handleNotas = this.handleNotas.bind(this);
        this.handleEstado = this.handleEstado.bind(this);

        this.searchProducto = this.searchProducto.bind(this);
        this.handleSearchProd = this.handleSearchProd.bind(this);
        this.updateListaPrecio = this.updateListaPrecio.bind(this);

    }

    handleDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }

    handleFijoPorcentaje(e) {
        this.setState({
            fijoporcentaje: e.target.value
        },
            () => this.actualizarPreciosProd()
        );
    }

    handleMoneda(e) {
        this.setState({
            idmoneda: e.target.value
        });
    }

    handleValor(e) {
        console.log('VALUE ',e.target.value);
       
        this.setState({
            valor: e.target.value
        },
            () => this.actualizarPreciosProd()
        );

    }

    handleFechaInicio(date, dateString) {
        this.setState({
            fechaini: dateString
        });
    }

    handleFechaFin(date, dateString) {
        this.setState({
            fechafin: dateString
        });
    }

    handleAccion(e) {
        this.setState({
            accion: e.target.value
        },
            () => this.actualizarPreciosProd()
        );
    }

    handleEstado(e) {
        this.setState({
            estado: e.target.value
        });
    }

    handleNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    handlePrecioProd(e) {
        this.state.dataPreciosProd2[e.target.id] = e.target.value;
        this.setState({
            dataPreciosProd2: this.state.dataPreciosProd2
        });
    }

    searchProducto(value) {
        if (value.length > 0) {
            axios.get(URL_SEARCH_PRODUCTO + value)
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
        } else {
            this.setState({
                resultProductos: []
            });
        }
        

    }

    handleSearchProd(value) {

        if (timeoutSearch) {
            clearTimeout(timeoutSearch);
            timeoutSearch = null;
        }
        timeoutSearch = setTimeout(this.searchProducto(value), 300);

    }

    actualizarPreciosProd() {
        let valor = this.state.valor;
        //console.log('VALOR enlo', valor);
        var val = parseInt(valor);
        console.log('VALOR ', val);
        console.log(typeof val);
        
        if (isNaN(val)) {
            valor = 0;
        }
        if (val < 0) {
            message.warning('Solo numeros mayores a cero');
            valor = 0;
        }
        //console.log('VALOR ',valor);
        const data = this.state.dataPreciosProd;
        let data2 = this.state.dataPreciosProd2;
        let length = data2.length;
        for (let i = 0; i < length; i++) {
            var precio = parseFloat(data[i]);
            if (this.state.accion == 'D') {
                let descuento = parseFloat(valor);
                if (this.state.fijoporcentaje == 'P') {
                    descuento = (precio * valor) / 100;
                }
                console.log('DESCUENTO ,', descuento);
                data2[i] = precio - descuento;
            } else {
                let aumento = parseFloat(valor);
                if (this.state.fijoporcentaje == 'P') {
                    aumento = (precio * valor) / 100;
                }
                console.log('AUMENTO ', aumento);
                data2[i] = precio + aumento;
            }
        }
        //console.log('VALOR ', valor);
        console.log('ORIGINAL ', this.state.dataPreciosProd);
        console.log('COPIA ', data2);
        this.setState({
            dataPreciosProd: data,
            dataPreciosProd2: data2
        });
    }

    handleValProd(value) {
        console.log('HANDLE VAL ', value);
        let productSelected = this.getProductoSelected(value);
        if (productSelected) {
            this.setState({
                valueSeacrhProd: value,
                productosSelected: [
                    ...this.state.productosSelected,
                    {
                        idlistaprodet: -1,
                        producto: productSelected
                    }
                ],
                dataPreciosProd: [
                    ...this.state.dataPreciosProd,
                    productSelected.precio
                ],
                dataPreciosProd2: [
                    ...this.state.dataPreciosProd2,
                    productSelected.precio
                ]
            },
                () => this.actualizarPreciosProd()
            );
        } else {
            this.setState({
                valueSeacrhProd: value
            },
                () => this.actualizarPreciosProd()
            );
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
            if (arraySeleted[i].producto.idproducto == id) {
                return false;
            }
        }

        length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idproducto == id) {
                return array[i];
            }
        }
        return false;
    }
    /** */

    handleSelectedLista(selected) {
        /*
        console.log("SELECT ",selected);
        let longitud = selected.length;
        for (let i = 0; i < longitud; i++) {
            let index = this.state.listaprecios.indexOf(selected[i]);
            if (index > 0) {

            }
        }*/
        this.setState({
            selectedListaPrecios: selected    
        });
    }

    getIds(actuales, nuevos, preciosNuevos) {
        
        let data = this.state.productosSelected;
        let length = data.length;
        let dataAux = [];
        for (let i = 0; i < length; i++) {

            console.log('DATA ', data[i]);
            if (data[i].idlistaprodet > 0) {
                actuales.push(data[i].idlistaprodet);
            } else {
                nuevos.push(data[i].producto.idproducto);
                preciosNuevos.push(this.state.dataPreciosProd2[i]);
                dataAux.push(i);
            }
        }
        length = dataAux.length;
        for (let i = 0; i < length; i++) {
            this.state.dataPreciosProd2.splice(dataAux[i], 1);
        }

        this.setState({
            dataPreciosProd2: this.state.dataPreciosProd2
        });
    }

    validarDatos() {
        
        if (this.state.descripcion.length === 0) {
            message.warning('El campo descripcion es obligatorio');
            return false;
        }
        if (this.state.fechaini === '') {
            message.warning('Debe elegir una fecha de inicio');
            return false;
        }
        if (this.state.fechafin === '') {
            message.warning('Debe elegir una fecha de finalizacion');
            return false;
        }
        
        if (this.state.productosSelected.length === 0) {
            message.warning('La lista de precio debe tener al menos un producto incluido');
            return false;
        }
        return true;
    }

    updateListaPrecio(e) {
        e.preventDefault();
        if (!this.validarDatos()) return;
        
        let productosNuevos = [];
        let actuales = [];
        let preciosNuevos = [];
        let idsProductos = this.getIds(actuales, productosNuevos, preciosNuevos);
        //let idsProductosNew =
        let body = {
            "descripcion": this.state.descripcion,
            "fijoporcentaje": this.state.fijoporcentaje,
            "accion": this.state.accion,
            "estado": this.state.estado,
            "valor": this.state.valor,
            "fechaini": this.state.fechaini,
            "fechafin": this.state.fechafin,
            "idmoneda": this.state.idmoneda,
            "notas": this.state.notas,
            "idsActuales": JSON.stringify(actuales),
            "idsProductosNuevos": JSON.stringify(productosNuevos),
            "preciosProd": JSON.stringify(this.state.dataPreciosProd2),
            "preciosProdNuevos": JSON.stringify(preciosNuevos),
            "productosEliminados": JSON.stringify(this.state.productosEliminados)
        };
        console.log("PRODUCTOS SELECTS ", this.state.productosSelected);
        console.log("BODY ",body);

        
        axios.put(URL_UPDATE_LISTA_PRECIO + this.props.match.params.id, body)
        .then((resp) => {
            let result = resp.data;
            console.log(result);
            
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

    getMonedas() {

        axios.get(URL_GET_MONEDAS)
        .then((resp) => {
            let result = resp.data;
            //console.log(result);
            if (result.response > 0) {
                this.setState({
                    monedas: result.data,
                });
            } else {
                message.error('Error al cargar los datos en M, por favor vuelva a intentarlo');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Error al cargar los datos en M, por favor vuelva a intentarlo');
        })
    }

    getListaPrecios() {
        axios.get(URL_GET_LISTA_PRECIOS)
        .then((resp) => {
            let result = resp.data;
            console.log("LISTA DE PRECIOS ", result);
            if (result.response > 0) {

                let array = [];
                let arrayIds = [];
                let data = result.data;
                let length = data.length;
                for (let i = 0; i < length; i++) {
                    console.log(data[i]);
                    console.log('ID ', this.props.match.params.id);
                    console.log('ID2 ', data[i].idlistaprecio);
                    if (data[i].idlistaprecio != this.props.match.params.id) {
                        array.push(data[i]);
                        arrayIds.push(data[i].idlistaprecio);
                    }
                }
                console.log("RESULT ",array);
                console.log("RESULT2 ",arrayIds);
                this.setState({
                    listaprecios: array,
                    idsListaPrecios: arrayIds
                });
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    removeProductSelected(index) {

        let idlistaprodet = this.state.productosSelected[index].idlistaprodet;
        if (idlistaprodet > 0) {
            this.state.productosEliminados.push(idlistaprodet);
        }
        this.state.productosSelected.splice(index, 1);
        this.state.dataPreciosProd.splice(index, 1);
        this.state.dataPreciosProd2.splice(index, 1);
        this.setState({
            productSelected: this.state.productosSelected,
            dataPreciosProd: this.state.dataPreciosProd,
            dataPreciosProd2: this.state.dataPreciosProd2,
            productosEliminados: this.state.productosEliminados
        });
    }

    insertarEliminados() {

        let data = this.state.productosSelected;
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            array.push(data[i].producto.idproducto);
        }

        this.setState({
            productosEliminados: array
        });
    }

    getListaProductos(idlistaprecio) {

        let URL_GET_LISTA_PROD  = URL_GET_LISTA_PRODUCTOS + idlistaprecio;
        axios.get(URL_GET_LISTA_PROD)
        .then((resp) => {
            let result = resp.data;
            console.log('LISTA PROD ', result);
            if (result.response > 0) {
                this.insertarEliminados();
                let data = result.data;
                let length = data.length;
                const array = [];
                let array2 = [];
                let arrayProduct = [];
                for (let i = 0; i < length; i++) {
                    array.push(data[i].precio);
                    array2.push(data[i].precio);
                    arrayProduct.push({
                        idlistaprodet: -1,
                        producto: data[i]
                    });
                }
                this.setState({
                    productosSelected: arrayProduct,
                    dataPreciosProd: array,
                    dataPreciosProd2: array2
                },
                    () => this.actualizarPreciosProd()
                );
            } else {

            }

        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    getListaPrecio() {

        const URL_EDIT_LISTA = URL_EDTI_LISTA_PRECIO + this.props.match.params.id + '/edit';
        axios.get(URL_EDIT_LISTA)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP ', result);
            if (result.response > 0) {
                let listaprecio = result.listaprecio;
                let data = result.listaproddet;
                let longitud = data.length;
                let productSelect = [];
                let preciosProd = [];
                const preciosProdOrig = [];
                for (let i = 0; i < longitud; i++) {
                    productSelect.push({
                        idlistaprodet: data[i].idlistapreproducdetalle,
                        producto: data[i].producto,
                    });
                    preciosProd.push(data[i].precio);
                    preciosProdOrig.push(data[i].producto.precio);
                }

                this.setState({
                    descripcion: listaprecio.descripcion,
                    fijoporcentaje: listaprecio.fijoporcentaje,
                    accion: listaprecio.accion,
                    estado: listaprecio.estado,
                    idmoneda: listaprecio.fkidmoneda,
                    valor: listaprecio.valor,
                    fechaini: listaprecio.fechainicio,
                    fechafin: listaprecio.fechafin,
                    notas: listaprecio.notas == null ? '' : listaprecio.notas,
                    dataPreciosProd: preciosProdOrig,
                    dataPreciosProd2: preciosProd,
                    productosSelected: productSelect,
                    
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.getListaPrecio();
        this.getMonedas();
        this.getListaPrecios();
    }

    handleChangeListaPrecio(value) {
        this.getListaProductos(value);
        console.log(`selected ${value}`);
    }
      
    handleBlurListaPrecio() {
        console.log('blur');
    }
      
    handleFocusListaPrecio() {
        console.log('focus');
    }

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/listaprecio/indexListaPrecio/"/>
            )
        }
        let selectedListaPrecios = this.state.selectedListaPrecios;
        //let dataListaPrecios = this.state.listaprecios.filter(o => !selectedListaPrecios.includes(o));
        return (
            <div>
                
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Editar Lista de Precio </h1>
                    </div>
                </div>

                

                <form 
                    id="form_register"
                    className="formulario-content" 
                    encType="multipart/form-data"
                    onSubmit={this.updateListaPrecio}>
        
                    <div className="form-group-content col-lg-12-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-9-content">
                                <input 
                                    id="descripcion" 
                                    type="text"
                                    value={this.state.descripcion}
                                    placeholder="Descripcion"
                                    className="form-control-content"
                                    onChange={this.handleDescripcion}
                                />
                                <label 
                                    htmlFor="descripcion" 
                                    className="label-content"> Descripcion
                                </label>

                            </div>

                            <div className="col-lg-3-content">
                                <select
                                    id="moneda"
                                    className="form-control-content"
                                    value={this.state.idmoneda}
                                    onChange={this.handleMoneda}
                                >
                                    {
                                        this.state.monedas.map((item, key) => (
                                            <option 
                                                key={key}
                                                value={item.idmoneda}>
                                                {item.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label 
                                    htmlFor="moneda" 
                                    className="label-content"> Moneda 
                                </label>

                            </div>
                            <div className="col-lg-3-content">
                                <input 
                                    id="valor" 
                                    type="number"
                                    value={this.state.valor}
                                    onChange={this.handleValor}
                                    className="form-control-content" 
                                />
                                <label 
                                    htmlFor="valor" 
                                    className="label-content">
                                    valor 
                                </label>
                            </div>

                            <div className="col-lg-3-content">

                                <select
                                    id="fijoporcentaje"
                                    className="form-control-content"
                                    value={this.state.fijoporcentaje}
                                    onChange={this.handleFijoPorcentaje}
                                >
                                    <option value="F"> Fijo </option>
                                    <option value="P"> Porcentaje </option>
                                </select>
                                <label 
                                    htmlFor="fijoporcentaje" 
                                    className="label-content"> Fijo/Porcentaje 
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select
                                    id="accion"
                                    className="form-control-content"
                                    value={this.state.accion}
                                    onChange={this.handleAccion}
                                >
                                    <option value="D"> Descuento </option>
                                    <option value="I"> Incremento </option>
                                </select>
                                <label 
                                    htmlFor="accion" 
                                    className="label-content"> Accion 
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select
                                    id="estado"
                                    className="form-control-content"
                                    value={this.state.estado}
                                    onChange={this.handleEstado}
                                >
                                    <option value="A"> Activo </option>
                                    <option value="D"> No Activo </option>
                                </select>
                                <label 
                                    htmlFor="estado" 
                                    className="label-content"> Estado 
                                </label>
                            </div>

                        </div>

                        <div className="col-lg-12-content">
                            <div 
                                className="col-lg-6-content"
                                style={{ marginTop: 50 }}
                            >
                                <div className="col-lg-6-content">
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        onChange={this.handleFechaInicio}
                                        value={moment(this.state.fechaini, 'YYYY-MM-DD')}
                                        style={{
                                            alignContent: 'center'
                                        }}
                                    />
                                    <label 
                                        htmlFor="fechaini" 
                                        className="label-content">
                                        Fecha Inicio 
                                    </label>
                                </div>

                                <div className="col-lg-6-content">
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        onChange={this.handleFechaFin}
                                        value={moment(this.state.fechafin, 'YYYY-MM-DD')}
                                        style={{
                                            alignContent: 'center'
                                        }}
                                    />
                                    <label 
                                        htmlFor="fechafin" 
                                        className="label-content">
                                        Fecha Fin 
                                    </label>
                                </div>
                            </div>

                            <div className="col-lg-6-content">
                                <div className="col-lg-12-content">
                                    <label 
                                        htmlFor="notas" 
                                        className="label-content">
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
                    </div>
                    
                    <div className="form-group-content col-lg-12-content">
                    
                        <div 
                            className="col-lg-9-content"
                            style={{ marginLeft: WIDTH_WINDOW * 0.1 }}
                        >

                            <div className="col-lg-6-content">
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={this.handleChangeListaPrecio}
                                    onFocus={this.handleFocusListaPrecio}
                                    onBlur={this.handleBlurListaPrecio}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.state.listaprecios.map((item, key) => (
                                        <Option 
                                            key={key} value={item.idlistaprecio}>
                                            {item.descripcion}
                                        </Option>
                                    ))}
                                </Select>
                                
                            </div>
                            
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
                            className="form-group-content col-lg-9-content"
                            style={{ marginLeft: WIDTH_WINDOW * 0.1 }}
                        >
                            <div className="col-lg-12-content">
                                
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
                                    <label style={{color: 'black'}}>Precio Orig</label>
                                </div>
                                <div className="col-lg-2-content">
                                    <label style={{color: 'black'}}>Precio Modif</label>
                                </div>
                                <div className="col-lg-1-content">
                                    <label style={{color: 'black'}}>Accion</label>
                                </div>
                            </div>

                            <div className="caja-content">
                                {
                                    this.state.productosSelected.map((item, key) => (
                                        <div key={key} className="col-lg-12-content border-table">
                                            <div className="col-lg-1-content">
                                                <label>{key + 1}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <label>{item.producto.idproducto}</label>
                                            </div>
                                            <div className="col-lg-4-content">
                                                <label>{item.producto.descripcion}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <label>{item.producto.precio}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <input 
                                                    id={key} 
                                                    type="number"
                                                    value={this.state.dataPreciosProd2[key]}
                                                    placeholder="Valor"
                                                    onChange={this.handlePrecioProd}
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


