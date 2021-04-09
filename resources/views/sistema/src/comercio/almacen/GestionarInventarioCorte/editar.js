
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select, Button } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, convertDmyToYmd, convertYmdToDmy } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import TextArea from '../../../componentes/textarea';
import moment from 'moment';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import CTreeSelect from '../../../componentes/treeselect';
import CSelect from '../../../componentes/select2';
import Input from '../../../componentes/input';
import strings from '../../../utils/strings';
import C_DatePicker from '../../../componentes/data/date';
import C_Button from '../../../componentes/data/button';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;
let date = new Date();
export default class EditInventarioCorte extends Component{

    constructor(props){
        super(props);
        this.state = {
            descripcion: '',
            fecha: '',
            idalmacen: 0,
            notas: '',
            isInicio: true,
            almacenes: [],
            familias: [],
            idfamilia: [],

            arrayEliminados: [],
            productosSelected: [],
            resultProductos: [],
            resultProductosDefault: [],
            resultInventarios: [],
            resultInventariosDefault: [],
            listaProductos: [],
            arrayProductos: [],
            arrayAlmacenes: [],
            arrayStockNuevos: [],
            arrayStocksTotales: [],
            selectAlmacenes: [],
            staticAlmacenes: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,

            txtBtnTodos: 'Agregar Todos',
            InputFocusBlur: [],
            labelFocusBlur: ['fecha'],
            redirect: false,
            noSesion: false,
            modalOk: false,
            modalCancel: false,
            loadingOk: false,
        }

        this.permisions = {
            fecha: readPermisions(keys.inventario_corte_fecha),
            almacenes: readPermisions(keys.inventario_corte_select_almacen),
            descripcion: readPermisions(keys.inventario_corte_textarea_descripcion),
            notas: readPermisions(keys.inventario_corte_textarea_notas),
            btn_add_all: readPermisions(keys.inventario_corte_btn_add_all),
            familias: readPermisions(keys.inventario_corte_treselect_familia),
            search_prod: readPermisions(keys.inventario_corte_search_producto)
        }

        this.onChangeDescipcion = this.onChangeDescipcion.bind(this);
        this.onChangeAlmacen = this.onChangeAlmacen.bind(this);
        this.componentBodyAlmacen = this.componentBodyAlmacen.bind(this);
        this.componentBodyAlmacen = this.componentBodyAlmacen.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this); 
        this.onChangeFamilia = this.onChangeFamilia.bind(this);
        this.onDeselectAlmacen = this.onDeselectAlmacen.bind(this);
        //this.confirmChangeAlmacen = this.confirmChangeAlmacen.bind(this);
        this.onSearchProd = this.onSearchProd.bind(this);
        this.onChangeValProd = this.onChangeValProd.bind(this);
        //this.onChangeStocksNuevos = this.onChangeStocksNuevos.bind(this);
        this.agregarTodos = this.agregarTodos.bind(this);
        this.onDeleteSearchProd = this.onDeleteSearchProd.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    validarData(type) {
        if(!this.validarDatos()) return;
        this.setState({
            modalOk: true,
            type: type
        })
    }

    onOkMO() {
        if (this.state.type == 'N') return;
        this.updateInvetario(this.state.type);
        this.setState({
            //modalCancel: false,
            loadingOk: true
        })
    }

    onCancelMO() {
        this.setState({
            modalOk: false
        })
    }

    onOkMC() {
        this.setState({
            modalCancel: false,
            redirect: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    focusInicio(e) {
        if (e != null) {
            if (this.state.isInicio) {
                e.focus();
            }
        }
    }

    onChangeDescipcion(value) {
        this.setState({
            descripcion: value
        });
    }

    onChangeFecha(date, dateString) {
        this.setState({
            fecha: dateString
        });
    }

    onDeleteSearchProd() {
        this.setState({
            valueSeacrhProd: undefined
        })
    }
    /*
    confirmChangeAlmacen(elem) {

        let index = this.state.selectAlmacenes.indexOf(elem);
        if (index >= 0) 
            this.state.selectAlmacenes.splice(index, 1);
        const data = this.state.selectAlmacenes;
        const setState = this.setState.bind(this);
        Modal.confirm({
            title: 'Cambiar de Almacenes',
            content: 'Al modificar los almacenes seleccionados se perdera la seleccion de productos, ¿desea continuar?',
            onOk() {
              console.log('OK');
              setState({
                selectAlmacenes: data,
                productosSelected: [],
                txtBtnTodos: 'Agregar Todos',
                arrayAlmacenes: [],
                resultProductos: []
              })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    */

    addEliminados(idalmacen) {

        let array = this.state.arrayAlmacenes;
        //console.log('ARRAY ALMACENES 1 ', this.state.arrayAlmacenes);
        let elim = [];
        let length = array.length;
        let index = -1;
        for (let i = 0; i < length; i++) {
            let arr = array[i];
            if (index == -1) {
                let length2 = arr.length;
                for (let j = 0; j < length2; j++) {
                    if (arr[j].idalmacen == idalmacen && arr[j].idicd != -1) {
                        elim.push(arr[j].idicd);
                        arr[j].idicd = -1;
                        arr[j].stocknuevo = 0;
                        index = j;
                        break;
                    }
                }
            } else {
                if (arr[index].idicd != -1) {
                    elim.push(arr[index].idicd);
                    arr[index].idicd = -1;
                    arr[index].stocknuevo = 0;
                }
            }
        }
        //console.log('ARRAY ALMACENES 2 ', this.state.arrayAlmacenes);
        //console.log('Eliminados ', elim);
        this.setState({
            arrayAlmacenes: this.state.arrayAlmacenes,
            arrayEliminados: this.state.arrayEliminados.concat(elim)
        })
    }

    onDeselectAlmacen(value) {
        //console.log('VALUE ', value);
        //let posicion = this.inArrayAlmacen(array[i], this.state.arrayAlmacenes[index]);
        let array = this.state.arrayAlmacenes;
        //console.log('ALMACENES 1 ', this.state.arrayAlmacenes);
        let length = array.length;
        for (let i = 0; i < length; i++) {
            //console.log('ARRAY 1 ', array[i]);
            let posicion = this.inArrayAlmacen(value, array[i]);
            //console.log('ARRAY ', this.state.arrayStockNuevos[i]);
            //console.log('POS ', posicion);
            //console.log('ELEM ', this.state.arrayStockNuevos[i][posicion]);
            //console.log('ELEM ===> ', array[i]);
            if (posicion >= 0) {
                //console.log('STOCKS NUEVOS ==> ', this.state.arrayStockNuevos);
                //this.state.arrayStockNuevos[i][posicion] = 0;
                this.state.arrayAlmacenes[i][posicion].stocknuevo = 0;
            }
        }
        this.addEliminados(value);
        //console.log('ALMACENES 2 ', this.state.arrayAlmacenes);
        this.setState({
            //arrayStockNuevos: this.state.arrayStockNuevos,
            arrayAlmacenes: this.state.arrayAlmacenes
        });
    }

    onChangeAlmacen(data) {
        if (this.state.selectAlmacenes.length > data.length) {
            this.setState({
                selectAlmacenes: data
            },
                () => this.calcularTotaleStocks()
            );
        } else {
            if (data[data.length-1] == 0) {
                this.setState({
                    selectAlmacenes: this.state.staticAlmacenes
                },
                    () => this.calcularTotaleStocks()
                );
            } else {
                this.setState({
                    selectAlmacenes: data
                },
                    () => this.calcularTotaleStocks()
                );
            }
        }
    }

    onChangeStocksNuevos(index, posicion, value) {
    
        //value = parseInt(value);
        //if (isNaN(value) || value < 0) return;
        this.state.arrayAlmacenes[index][posicion].stocknuevo = value;
        this.setState({
            arrayAlmacenes: this.state.arrayAlmacenes
        },
            () => this.calcularStocksNuevosTotal(index)
        );
    } 

    /*
    calcularStocksNuevosAll() {
        
        let array1 = this.state.arrayAlmacenes;
        let length1 = array1.length;
        for (let i = 0; i < length1; i++) {

            let array2 = array1[i];
            console.log('ARRAY XD ', array2);
            let length2 = array2.length;
            let sum1 = 0;
            let sum2 = 0;
            for (let j = 0; j < length2; j++) {
                sum1 = sum1 + parseInt(array2[j].stockanterior);
                sum2 = sum2 + parseInt(array2[j].stocknuevo);
            }
            this.state.arrayStocksTotales.push({
                'anterior': sum1,
                'nuevo': sum2
            });
        }
        this.setState({
            arrayStocksTotales: this.state.arrayStocksTotales
        });
    }
    */

    calcularTotaleStocks() {
        //let array = this.state.arrayStockNuevos;
        let array = this.state.arrayAlmacenes;
        //console.log('ARRAY STOCKS NUEVOS ', array);
        //console.log('ARRAY STOCKS TOTALES ', this.state.arrayStocksTotales)
        let length = array.length;
        for (let i = 0; i < length; i++) {
            let array2 = array[i];
            let length2 = array2.length;
            let sum = 0;
            for (let j = 0; j < length2; j++) {
                let ind = this.state.selectAlmacenes.indexOf(array2[j].idalmacen);
                if (ind >= 0) {
                    if (isNaN(array2[j].stocknuevo)) {
                        sum = 0;
                        break;
                    }
                    sum += parseInt(array2[j].stocknuevo);
                } else {
                    if (isNaN(array2[j].stock)) {
                        sum = 0;
                        break;
                    }
                    sum += parseInt(array2[j].stock);
                }
            }
            //console.log('TOTALES ===> ', this.state.arrayStocksTotales[i]);
            this.state.arrayStocksTotales[i].nuevo = sum;
        }
        
        this.setState({
            arrayStocksTotales: this.state.arrayStocksTotales
        });
    }

    calcularStocksNuevosTotal(index) {

        let array = this.state.arrayAlmacenes[index];
        let length = array.length;
        let total = 0;
        for (let i = 0; i < length; i++) {
            let ind = this.state.selectAlmacenes.indexOf(array[i].idalmacen);
            if (ind >= 0) {
                let stockn = parseFloat(array[i].stocknuevo);
                total += isNaN(stockn) ? 0 : stockn;
            } else {
                //total += parseFloat(array[i].stockanterior);
                total += parseFloat(array[i].stock);
            }
        }
        this.state.arrayStocksTotales[index].nuevo = total;
        this.setState({
            arrayStocksTotales: this.state.arrayStocksTotales
        });
    }

    onChangeNotas(value) {
        this.setState({
            notas: value
        });
    }

    async onChangeFamilia(value) {
        if (this.state.txtBtnTodos == 'Quitar Todos') {
            message.warning('No puede agregar mas prductos');
            return;
        }

        if (await this.getProductosByFamilia(value)) {
            this.setState({
                idfamilia: value
            });
        }
        
    }
    /*
    prepararArrayAlm(array) {

        
        let length = array.length;
        for (let i = 0; i < length; i++) {
            let array1 = array[i];
            let length2 = array1.length;
            let arr = [];
            for (let j = 0; j < length2; j++) {
                arr.push({

                });
            }
        }

    }*/

    removeProductSelected(index) {
        let array = this.state.arrayAlmacenes[index];
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idicd != undefined && array[i].idicd != -1) {
                array[index].idicd = -1;
                array[index].stocknuevo = 0;
                this.state.arrayEliminados.push(array[i].idicd);
            }
        }
        this.state.productosSelected.splice(index, 1);
        this.state.arrayStocksTotales.splice(index, 1);
        //this.state.arrayAlmacenes.splice(index, 1);
        
        this.setState({
            productosSelected: this.state.productosSelected,
            arrayStocksTotales: this.state.arrayStocksTotales,
            arrayAlmacenes: this.state.arrayAlmacenes,
            arrayEliminados: this.state.arrayEliminados
        });
    }

    guardarElimiandos(array, eliminados) {

        let length = array.length;
        for (let i = 0; i < length; i++) {
            let arr = array[i];
            let len = arr.length;
            for (let j = 0; j < len; j++) {
                if (arr[j].idicd != undefined && arr[j].idicd != -1) {
                    eliminados.push(arr[j].idicd);
                }
            }
        }
    }

    agregarTodos() {
        if (this.state.txtBtnTodos == 'Agregar Todos') {

            httpRequest('post', ws.wsproductosalmacenes, {
                almacenes: JSON.stringify(this.state.selectAlmacenes)
            })
            .then((result) => {
                if (result.response > 0 && result.productos.length > 0) {
                    let arrayStockNuevos = [];
                    let arrayStocksTotales = [];
                    let eliminados = [];                    
                    this.guardarElimiandos(this.state.arrayAlmacenes, eliminados);
                    this.cargarStocks(result.productos, result.almacenes, arrayStockNuevos, arrayStocksTotales);
                    this.setState({
                        productosSelected: result.productos,
                        arrayAlmacenes: result.almacenes,
                        txtBtnTodos: 'Quitar Todos',
                        arrayStockNuevos: arrayStockNuevos,
                        arrayStocksTotales: arrayStocksTotales,
                        arrayEliminados: this.state.arrayEliminados.concat(eliminados)
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })

        } else {
            this.setState({
                productosSelected: [],
                txtBtnTodos: 'Agregar Todos',
                arrayAlmacenes: []
            });
        }
        
    }

    getProductosByFamilia(idfamilia) {

        return httpRequest('post', ws.wsproductosxfamilia, {
                    idfamilia: idfamilia,
                    almacenes: JSON.stringify(this.state.selectAlmacenes)
                })
                .then((result) => {
                    if (result.response == 1 && result.productos.length > 0 && result.almacenes.length > 0) {
                        let arrayStockNuevos = [];
                        let arrayStocksTotales = [];
                        let eliminados = [];
                        this.guardarElimiandos(this.state.arrayAlmacenes, eliminados);
                        this.cargarStocks(result.productos, result.almacenes, arrayStockNuevos, arrayStocksTotales);
                        this.setState({
                            productosSelected: result.productos,
                            arrayAlmacenes: result.almacenes,
                            arrayStockNuevos: arrayStockNuevos,
                            arrayStocksTotales: arrayStocksTotales,
                            arrayEliminados: this.state.arrayEliminados.concat(eliminados)
                        });
                        return true;
                    } else if (result.response == 1){
                        message.warning('No existen productos en la familia seleccionada');
                        return false;
                    } else if (result.response == -2) {
                        this.setState({ noSesion: true })
                        return false;
                    } else {
                        return false;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    message.error(strings.message_error);
                    return false;
                })

    }

    searchProducto(value) {
        if (value.length > 0) {
            
            httpRequest('post', ws.wssearchprodbytipo, {
                value: value,
                almacenes: JSON.stringify(this.state.selectAlmacenes)
            })
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Errot ', result.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultProductos: this.state.resultProductosDefault
            });
        }
        
    }

    onSearchProd(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProducto(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    async onChangeValProd(value) {

        if (this.state.txtBtnTodos == 'Quitar Todos') {
            message.warning('No puede agregar mas prductos');
            return;
        }
        let producto = this.inArrayProducto(value, this.state.productosSelected);
        if (!producto) {

            let almacenes = await this.getProdsAlmacenes(value);
            let producto = this.getProductResult(value);
            
            let length = almacenes.length;
            for (let i = 0; i < length; i++) {
                almacenes[i].stockanterior = almacenes[i].stock;
                almacenes[i].stocknuevo = 0;
                almacenes[i].idicd = -1;
            }
            this.setState({
                productosSelected: [
                    ...this.state.productosSelected,
                    producto
                ],
                arrayAlmacenes: [
                    ...this.state.arrayAlmacenes,
                    almacenes
                ],
                arrayStocksTotales: [
                    ...this.state.arrayStocksTotales,
                    {
                        'anterior' : producto.stock,
                        'nuevo': 0
                    }
                ],
                valueSeacrhProd: value
            });

        } else {
            message.warning('El producto ya fue seleccionado');
        }
    }

    getProdsAlmacenes(idproducto) {

        return httpRequest('post', ws.wsprodalmacenes, {
                    idproducto: idproducto,
                    almacenes: JSON.stringify(this.state.selectAlmacenes)
                })
                .then((result) => {
                    if (result.response == 1) {
                        return result.almacenes;
                    } else if (result.response == -2) {
                        this.setState({ noSesion: true })
                        return [];
                    } else {
                        return [];
                    }
                })
                .catch((error) => {
                    console.log(error);
                    message.error(strings.message_error);
                    return [];
                })
    }

    updateInvetario(estado) {
 
        let body = {
            codinventario: this.state.codinventario,
            descripcion: this.state.descripcion,
            fecha: convertDmyToYmd(this.state.fecha),
            notas: this.state.notas,
            arrayStocksTotales: JSON.stringify(this.state.arrayStocksTotales),
            arrayAlmacenes: JSON.stringify(this.state.arrayAlmacenes),
            productos: JSON.stringify(this.state.productosSelected),
            arrayEliminados: JSON.stringify(this.state.arrayEliminados),
            estado: estado,
            selectAlmacenes: JSON.stringify(this.state.selectAlmacenes)
        };

        httpRequest('put', ws.wsinventariocorte + '/' + this.props.match.params.id, body)
        .then((result) => {
            if (result.response > 0) {
                message.success(result.message);
                this.setState({
                    redirect: true,
                    loadingOk: false,
                    modalOk: false
                });
            } else if(result.response == -2) {
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

    cargarStocks(productos, almacenes, arrayStockNuevos, arrayStocksTotales) {
        let length = productos.length;
        for (let i = 0; i < length; i++) {
            let arr = [];
            let alm = almacenes[i];
            let length = alm.length;
            let sum1 = 0;
            let sum2 = 0;
            for (let j = 0; j < length; j++) {
                arr.push(0);
                if (alm[j].stockanterior != undefined) {
                    sum1 = sum1 + parseInt(alm[j].stockanterior);
                }
                if (alm[j].stocknuevo != undefined) {
                    sum2 = sum2 + parseInt(alm[j].stocknuevo);
                }
                alm[j].stockanterior = alm[j].stock;
                alm[j].stocknuevo = 0;
                alm[j].idicd = -1;
            }
            
            arrayStockNuevos.push(arr);
            arrayStocksTotales.push({
                'anterior': sum1 === 0 ? productos[i].stock : sum1,
                'nuevo': sum2,
            });
        }
        /*
        this.setState({
            arrayStockNuevos: array1,
            arrayStocksTotales: array2
        });
        */
    }

    getAlmacenes() {
        
        httpRequest('get', ws.wsalmacen)
        .then((result) => {
            if (result.response == 1) {
                let array = result.data;
                let length = array.length;
                const staticAlmacenes = [];
                for (let i = 0; i < length; i++) {
                    staticAlmacenes.push(array[i].idalmacen);
                }
                this.setState({
                    almacenes: result.data,
                    staticAlmacenes: staticAlmacenes
                    //selectAlmacenes: data
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

    prepararDatos() {
        this.setState({ isInicio: false});
    }

    componentDidMount() {
        this.getAlmacenes();
        this.prepararDatos();
        this.getFamilias();
        this.getInventarioCorte();
    }

    getInventarioCorte() {

        httpRequest('get', ws.wsinventariocorte + '/' + this.props.match.params.id + '/edit')
        .then((result) => {
            if (result.response == 1) {
                let productos = result.productos;
                let almacenes = result.almacenes;
                let arrayStockNuevos = [];
                let arrayStocksTotales = [];

                let length1 = productos.length;
                for (let i = 0; i < length1; i++) {
                    //let arr = [];
                    let alm = almacenes[i];
                    let length = alm.length;
                    let sum1 = 0;
                    let sum2 = 0;
                    //let dif = 0;
                    for (let j = 0; j < length; j++) {
                        //arr.push(0);
                        
                        if (alm[j].idicd == -1) {
                            sum1 += parseInt(alm[j].stock);
                            sum2 += parseInt(alm[j].stock);
                        } else {
                            if (alm[j].stockanterior != undefined) {
                                sum1 = sum1 + parseInt(alm[j].stockanterior);
                            }
                            if (alm[j].stocknuevo != undefined) {
                                sum2 = sum2 + parseInt(alm[j].stocknuevo);
                            }
                        }
                        /*
                        if (alm[i].idicd != -1) {
                            dif = parseInt(alm[j].stockanterior) - parseInt(alm[j].stocknuevo);
                            dif = dif < 0 ? dif * -1 : dif
                        }
                        */
                    }
                    //console.log('DIF ', dif);
                    //console.log('STOCK ', productos[i].stock);
                    //arrayStockNuevos.push(arr);
                    arrayStocksTotales.push({
                        'anterior': sum1 === 0 ? productos[i].stock : sum1,
                        //'anterior': parseInt(productos[i].stock) - dif,
                        'nuevo': sum2,
                        //'nuevo': parseInt(productos[i].stock) + dif,
                    });
                }
                //this.cargarStocks(result.productos, result.almacenes, arrayStockNuevos, arrayStocksTotales);
                //console.log('ARRAY ALMACENES ', result.almacenes);
                this.setState({
                    productosSelected: result.productos,
                    arrayAlmacenes: result.almacenes,
                    descripcion: result.descripcion,
                    fecha: convertYmdToDmy(result.fecha),
                    estado: result.estado,
                    notas: result.notas == null ? '' : result.notas,
                    //arrayStockNuevos: arrayStockNuevos,
                    arrayStocksTotales: arrayStocksTotales,
                    selectAlmacenes: result.selectAlmacenes
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    getFamilias() {

        httpRequest('get', ws.wsfamilia)
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                let idDefecto = result.data[0].idfamilia;
                var array = result.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrefamilia == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idfamilia,
                            key: array[i].idfamilia
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolFamilias(array_aux, array);
                this.setState({
                    familias: array_aux,
                    idfamilia: idDefecto
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    arbolFamilias(data, array) {

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosFamilia(data[i].value, array);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
                this.arbolFamilias(hijos, array);
            }
        }
        
    }

    hijosFamilia(idpadre, array) {
        let hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].idpadrefamilia == idpadre) {
                const elemento = {
                    title: array[i].descripcion,
                    value: array[i].idfamilia,
                    key: array[i].idfamilia
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    validarDatos() {

        let descripcion = this.state.descripcion.trim();
        if (descripcion.length === 0) {
            message.warning('Debe poner una descripcion que no solo contenga espacios');
            return false;
        }

        if (this.state.productosSelected.length === 0) {
            message.warning('Debe seleccionar un producto por lo menos');
            return false;
        }

        if (this.state.selectAlmacenes.length === 0) {
            message.warning('Debe seleccionar un almacen por lo menos');
            return false;
        }

        return true;
    }


    showConfirmStore(estado) {
        if(!this.validarDatos()) return;
        const updateInvetario = this.updateInvetario.bind(this);
        Modal.confirm({
          title: 'Registrar Inventario',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            console.log('OK');
            updateInvetario(estado);
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }

    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: 'Registrar Lista de Precio',
            content: 'Los cambios realizados no se guardaran, ¿Desea continuar?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              console.log('OK');
              redirect();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
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
                    <div key={i} 
                        style={{ 
                            //padding: 5,
                            flexDirection: 'column',
                            paddingLeft: 15
                            }}>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <label style={{ color: 'black'}}>
                                {almacen.descripcion}
                            </label>
                        </div>
                        <div style={{ display: 'flex'}}>
                            <label style={{color: 'black', padding: 2}}>Anterior</label>
                            <label style={{color: 'black', padding: 2 }}>Nuevo</label>
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

    getProductResult(idproducto) {
        let array = this.state.resultProductos;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idproducto == idproducto) {
                return array[i];
            }
        }
        return null;
    }

    inArrayProducto(idproducto, array) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idproducto == idproducto) 
                return array[i];
        }
        return false;
    }

    componentBodyAlmacen(index) {
        let array = this.state.selectAlmacenes;
        let length = array.length;
        let component = [];

        for (let i = 0; i < length; i++) {
            let posicion = this.inArrayAlmacen(array[i], this.state.arrayAlmacenes[index]);
            if (posicion >= 0) {
                component.push(
                    <div key={i} style={{ width: 130, height: 50, display: 'flex' }}>
                        <div className="input-group-content"
                            style={{ width: 65, height: 50, padding: 2, display: 'flex'}}>
                            <Input 
                                value={this.state.arrayAlmacenes[index][posicion].stock}
                                placeholder="Valor"
                                readOnly={true}
                            />
                        </div>
                        <div className="input-group-content"
                            style={{ width: 65, height: 50, padding: 2, display: 'flex'}}>
                            <Input
                                type="number"
                                value={this.state.arrayAlmacenes[index][posicion].stocknuevo}
                                placeholder="Valor"
                                onChange={this.onChangeStocksNuevos.bind(this, index, posicion)}
                            />
                        </div>
                    </div>
                );
            } else {
                component.push(
                    <div style={{ width: 130, height: 50, display: 'flex' }}>
                        <div className="input-group-content"
                            style={{ width: 65, height: 50, padding: 2, display: 'flex'}}>
                            <Input 
                                value="0"
                                placeholder="Valor"
                                readOnly={true}
                            />
                        </div>
                        <div className="input-group-content"
                            style={{ width: 65, height: 50, padding: 2, display: 'flex'}}>
                            <Input
                                value="0"
                                placeholder="Valor"
                                readOnly={true}
                            />
                        </div>
                    </div>
                )
            }
        }
        return component;
    }

    componentFechaHora() {
        if (this.permisions.fecha.visible == 'A') {
            let disabled = this.permisions.fecha.editable == 'A' ? false : true;
            return (
                <C_DatePicker
                    allowClear={true}
                    value={this.state.fecha}
                    onChange={this.onChangeFecha}
                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom'
                />
                /*
                <div className="inputs-groups">
                    <DatePicker
                        allowClear={false}
                        //defaultValue={moment('2000-01-01', 'YYYY-MM-DD')}
                        format={'DD-MM-YYYY'}
                        onChange={this.onChangeFecha}
                        value={moment(this.state.fecha, 'DD-MM-YYYY')}
                        disabled={disabled}
                        style={{
                            alignContent: 'center',
                            width: '100%',
                            minWidth: '100%',
                        }}
                    />
                    <label className="lbls-input active">
                        Fecha
                    </label>
                </div>
                */
            );
        }
        return null;
    }

    componentSelectAlmacenes() {
        if (this.permisions.almacenes.visible == 'A') {
            let disabled = this.permisions.almacenes.editable == 'A' ? false : true;
            return (
                <>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={this.state.selectAlmacenes}
                        //defaultValue={this.state.defaultAlmacenes}
                        onChange={this.onChangeAlmacen}
                        onDeselect={this.onDeselectAlmacen}
                        disabled={disabled}
                    >
                        <Option
                            key={-1}
                            value={0}>
                            {"Todos"}
                        </Option>
                        {this.state.almacenes.map((item, key) => (
                            <Option
                                key={key}
                                value={item.idalmacen}>
                                {item.descripcion}
                            </Option>
                        ))}
                    </Select>
                    <label 
                        htmlFor="almacen" 
                        className="label-content"> 
                        Almacen 
                    </label>
                </>
            );
        }
        return null;
    }

    btnAddAll() {
        if (this.permisions.btn_add_all.visible == 'A') {
            return (
                <Button
                    onClick={this.agregarTodos}>
                    {this.state.txtBtnTodos}
                </Button>
            );
        }
        return null;
    }

    resultProducts() {
        let data = this.state.resultProductos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i}
                    value={data[i].idproducto}>
                    {data[i].idproducto + ' ' + data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.inventario_index}/>
            );
        }

        const componentTitleAlmacen = this.componentTitleAlmacen();
        const componentFechaHora = this.componentFechaHora();
        const componentSelectAlmacenes = this.componentSelectAlmacenes();
        const btnAddAll = this.btnAddAll();
        const resultProducts = this.resultProducts();
        return (
            <div>
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Registrar Invetario </h1>
                    </div>
                </div>
                <Confirmation
                    visible={this.state.modalOk}
                    title="Editar Inventario Fisico"
                    onCancel={this.onCancelMO}
                    loading={this.state.loadingOk}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de editar el inventario fisico?
                            </label>
                        </div>
                    ]}
                />

                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Editar Inventario Fisico"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar la actualizacion de inventario fisico?
                                Se perderan los datos modificados.
                            </label>
                        </div>
                    ]}
                />

                <div className="form-group-content col-lg-12-content">
     
                    { componentFechaHora }

                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                        { componentSelectAlmacenes }
                    </div>   
                    
                </div>
                    
                <div className="col-lg-12-content col-md-12-content  col-sm-12-content col-xs-12-content">
                    <div className="col-lg-7-content col-md-7-content  col-sm-7-content col-xs-12-content">
                        <TextArea 
                            title="Descripcion"
                            value={this.state.descripcion}
                            onChange={this.onChangeDescipcion}
                            permisions={this.permisions.descripcion}
                        />
                    </div>
                    <div className="col-lg-5-content col-md-5-content  col-sm-5-content col-xs-12-content">
                        <TextArea 
                            title="Notas"
                            value={this.state.notas}
                            onChange={this.onChangeNotas}
                            permisions={this.permisions.notas}
                        />
                    </div>
                </div>

                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-12-content">
                        <div className="col-lg-4-content">
                            { btnAddAll }
                        </div>
                        <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                            <CTreeSelect
                                title="Por Familia"
                                //style={{ width: 220 }}
                                value={this.state.idfamilia}
                                //dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.familias}
                                placeholder="Porfavor Seleccione una opcion"
                                //treeDefaultExpandAll
                                onChange={this.onChangeFamilia.bind(this)}
                                permisions={this.permisions.familias}
                            />
                            {/*}
                            <TreeSelect
                                value={this.state.idfamilia}
                                //dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.familias}
                                placeholder="Porfavor Seleccione una opcion"
                                //treeDefaultExpandAll
                                onChange={this.onChangeFamilia.bind(this)}
                            />
                            */}
                        </div>
                        <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                            <CSelect
                                title="Por producto"
                                showSearch={true}
                                value={this.state.valueSeacrhProd}
                                placeholder={"Buscar producto por Id o descripcion"}
                                style={{ width: '100%' }}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchProd}
                                onChange={this.onChangeValProd}
                                onDelete={this.onDeleteSearchProd}
                                allowDelete={true}
                                notFoundContent={null}
                                component={resultProducts}
                                permisions={this.permisions.search_prod}
                            />
                            {/*}
                            <Select
                                showSearch
                                value={this.state.valueSeacrhProd}
                                placeholder={"Buscar producto por Id o descripcion"}
                                style={{ width: '100%' }}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchProd}
                                onChange={this.onChangeValProd}
                                notFoundContent={null}
                            >
                                {this.state.resultProductos.map((item, key) => (
                                    <Option 
                                        key={key} value={item.idproducto}>
                                        {item.idproducto + " " + item.descripcion}
                                    </Option>
                                ))}
                            </Select>
                            */}
                        </div>
                    </div>
                </div>

                <div className="caja-content cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    style={{ 
                        height: 400, 
                        overflow: 'auto' 
                    }}>
                    <div className="cols-lg-4 cols-md-6 cols-sm-12 cols-xs-12"
                        style={{ height: '100%' }}>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-6 cols-sm-6 cols-xs-12">
                                <label style={{color: 'black'}}>Nro</label>
                            </div>
                            <div className="cols-lg-3 cols-md-6 cols-sm-6 cols-xs-12">
                                <label style={{color: 'black'}}>Codigo</label>
                            </div>
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <label style={{color: 'black'}}>Descripcion</label>
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ paddingTop: '14%' }}>

                            {
                                this.state.productosSelected.map((item, key) => {
                                    let paddingTop = key == 0 ? '0%' : '4%';
                                    return (
                                        <div key={key} 
                                            className="cols-lg-12 cols-md-12 cols-sm-12"
                                            style={{ paddingTop: paddingTop }}>
                                            <div className="cols-lg-2 cols-md-6 cols-sm-12 cols-xs-12">
                                                <label>{key + 1}</label>
                                            </div>
                                            <div className="cols-lg-4 cols-md-6 cols-sm-12 cols-xs-12">
                                                <Input
                                                    value={this.state.configCodigo ? item.codproducto : item.idproducto}
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="cols-lg-6 cols-md-12 cols-sm-12 cols-xs-12">
                                                <Input
                                                    value={item.descripcion}
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>    
                                    )
                                })        
                            }            
                        </div>
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-6"
                        style={{ overflowX: 'scroll', height: '100%' }}>
                        <div 
                            className="col-lg-12-content"
                            style={{  
                                //paddingLeft: 20, 
                                width: '100%',
                                display: 'flex'
                            }}
                        >
                            { componentTitleAlmacen }
                        </div>
                        <div 
                            className="col-lg-12-content"
                            style={{ paddingTop: '5%' }}>
                            {
                                this.state.productosSelected.map((item, key) => (
                                    <div key={key}
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ paddingTop: 5, display: 'flex' }}>
                                        { this.componentBodyAlmacen(key) }
                                    </div>
                                ))
                            }
                        </div>
                        
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12"
                        style={{ height: '100%' }}>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{
                                    marginTop: -4,
                                }}>
                                <label style={{
                                        color: 'black',
                                        marginLeft: 25 
                                    }}>
                                    Stock Total
                                </label>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{
                                    marginTop: -4,
                                }}>
                                <label style={{
                                    color: 'black', 
                                    //padding: 3,
                                    marginLeft: 20,
                                    fontSize: 16
                                    }}>
                                    Anterior
                                </label>
                                <label 
                                    style={{
                                        color: 'black', 
                                        //padding: 3 ,
                                        marginLeft: 4
                                    }}>
                                    Nuevo
                                </label>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ 
                                //marginTop: '1%' 
                            }}>
                        {
                            this.state.productosSelected.map((item, key) => {
                                let paddingTop = key == 0 ? '0%' : '3%';
                                return (
                                    <div key={key} 
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ 
                                            paddingTop: paddingTop
                                        }}>
                                        <div className="cols-lg-10 cols-md-12 cols-sm-12 cols-xs-12"
                                            style={{ width: 160, display: 'flex' }}>
                                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12"
                                                style={{ width: 75, marginRight: -10 }}>
                                                <Input
                                                    value={this.state.arrayStocksTotales[key] == undefined ? '' : this.state.arrayStocksTotales[key].anterior}
                                                    placeholder="Valor"
                                                    //onChange={this.handlePrecioProd}
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12"
                                                style={{ width: 75, marginRight: -10 }}>
                                                <Input
                                                    value={this.state.arrayStocksTotales[key] == undefined ? '' : this.state.arrayStocksTotales[key].nuevo}
                                                    placeholder="Valor"
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="cols-lg-2 cols-md-4 cols-sm-12 cols-xs-12">
                                            <i
                                                className="fa fa-remove btns btns-sm btns-danger"
                                                key={key}
                                                style={{ marginTop: 12 }}
                                                onClick={() => this.removeProductSelected(key)}
                                                >
                                            </i>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                        
                    </div>
                    
                </div>        
                    
                <div className="form-group-content">
                    <div className="text-center-content">
                        <C_Button
                            title='Guardar y quedar abierto'
                            type='primary'
                            onClick={this.validarData.bind(this, 'P')}
                        />
                        <C_Button
                            title='Guardar y finalizar'
                            type='primary'
                            onClick={this.validarData.bind(this, 'F')}
                        />
                        <C_Button
                            title='Cancelar'
                            type='danger'
                            onClick={() => this.setState({ modalCancel: true })}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


