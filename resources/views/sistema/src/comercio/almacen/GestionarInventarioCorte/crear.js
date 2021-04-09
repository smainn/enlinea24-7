
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select, Divider, DatePicker,Button, TreeSelect } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import TextArea from '../../../componentes/textarea';
import moment from 'moment';
import CTreeSelect from '../../../componentes/treeselect';
import CSelect from '../../../componentes/select2';
import Input from '../../../componentes/input';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
import C_DatePicker from '../../../componentes/data/date';
import C_TextArea from '../../../componentes/data/textarea';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;
let date = new Date();
export default class CreateInventarioCorte extends Component{

    constructor(props){
        super(props);
        this.state = {
            codinventario: '',
            descripcion: '',
            fecha: dateToString(date, 'f2'),
            idalmacen: 0,
            notas: '',
            isInicio: true,
            almacenes: [],
            familias: [],
            idfamilia: [],

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
            configCodigo: false,
            modalOk: false,
            modalCancel: false,
            loadingOk: false,
            type: 'N'
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
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this); 
        this.onChangeFamilia = this.onChangeFamilia.bind(this); 
        this.onDeselectAlmacen = this.onDeselectAlmacen.bind(this);
        //this.confirmChangeAlmacen = this.confirmChangeAlmacen.bind(this);
        this.onSearchProd = this.onSearchProd.bind(this);
        this.onChangeValProd = this.onChangeValProd.bind(this);
        this.onChangeCodigo = this.onChangeCodigo.bind(this);
        this.onSearchInvetario = this.onSearchInvetario.bind(this);
        this.searchInventario = this.searchInventario.bind(this);
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
        this.storeInvetario(this.state.type);
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

    onDeleteSearchProd() {
        this.setState({
            valueSeacrhProd: undefined
        })
    }

    onChangeCodigo(e) {
        this.setState({
            codinventario: e.target.value
        });
    }

    searchInventario(value) {
        if (value.length > 0) {

            httpRequest('get', ws.wssearchinventarioidcod + '/' + value)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultInventarios: result.data
                    });
                } else if(result.response == -2) {
                    this.setState({ noSesion })
                }
            })
            .catch((error) => {
                message.error(strings.message_error);
            })

        } else {
            this.setState({
                resultInventarios: this.state.resultInventariosDefault
            });
        }
        
    }

    onSearchInvetario(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(this.searchInventario(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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

    onChangeFecha(dateString) {
        this.setState({
            fecha: dateString
        });
    }

    onDeselectAlmacen(value) {
        //let posicion = this.inArrayAlmacen(array[i], this.state.arrayAlmacenes[index]);
        
        let array = this.state.arrayAlmacenes;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            let posicion = this.inArrayAlmacen(value, array[i]);
            if (posicion >= 0) {
                this.state.arrayStockNuevos[i][posicion] = 0;
            }
        }
        
        this.setState({
            arrayStockNuevos: this.state.arrayStockNuevos
        },
            () => this.calcularTotaleStocks()
        );
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
        if (isNaN(value)) return;
        this.state.arrayStockNuevos[index][posicion] = value;
        this.setState({
            arrayStockNuevos: this.state.arrayStockNuevos
        },
            () => this.calcularStocksNuevosTotal(index)
        );
    } 

    calcularStocksNuevosTotal(index) {

        let array = this.state.arrayStockNuevos[index];
        let length = array.length;
        let total = 0;
        for (let i = 0; i < length; i++) {
            let ind = this.state.selectAlmacenes.indexOf(this.state.arrayAlmacenes[index][i].idalmacen);
            //if (array[i] == 0 || isNaN(array[i])) {
            if (ind < 0) {
                total = total + parseFloat(this.state.arrayAlmacenes[index][i].stock);
            } else {
                let stock = parseFloat(array[i]);
                total = total + (isNaN(stock) ? 0 : stock);
            }
            
        }
        this.state.arrayStocksTotales[index].nuevo = total.toFixed(2);
        this.setState({
            arrayStocksTotales: this.state.arrayStocksTotales
        });
    }

    calcularTotaleStocks() {
        let array = this.state.arrayStockNuevos;
        let length = array.length;
        //console.log('STOCKS ', this.state.arrayStockNuevos);
        for (let i = 0; i < length; i++) {
            let array2 = array[i];
            let length2 = array2.length;
            let sum = 0;
            for (let j = 0; j < length2; j++) {
                if (isNaN(array2[j])) {
                    sum = 0;
                    break;
                }
                let ind = this.state.selectAlmacenes.indexOf(this.state.arrayAlmacenes[i][j].idalmacen);
                if (ind < 0) {
                    sum = sum + parseFloat(this.state.arrayAlmacenes[i][j].stock);
                } else {
                    sum = sum + parseFloat(array2[j]);
                }
            }

            this.state.arrayStocksTotales[i].nuevo = sum;
            
        }
        
        this.setState({
            arrayStocksTotales: this.state.arrayStocksTotales
        });
    }


    onChangeNotas(value) {
        this.setState({
            notas: value
        });
    }

    removeProductSelected(index) {
        
        if (this.state.txtBtnTodos == 'Quitar Todos') {
            this.state.txtBtnTodos = 'Agregar Todos';
        }
        this.state.productosSelected.splice(index, 1);
        this.state.arrayStocksTotales.splice(index, 1);
        this.state.arrayStockNuevos.splice(index, 1);
        this.state.arrayAlmacenes.splice(index, 1);
        this.setState({
            productosSelected: this.state.productosSelected,
            arrayStocksTotales: this.state.arrayStocksTotales,
            arrayStockNuevos: this.state.arrayStockNuevos,
            arrayAlmacenes: this.state.arrayAlmacenes,
            txtBtnTodos: this.state.txtBtnTodos
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

    agregarTodos() {
        if (this.state.txtBtnTodos == 'Agregar Todos') {

            httpRequest('post', ws.wsproductosalmacenes, {
                almacenes: JSON.stringify(this.state.selectAlmacenes)
            })
            .then((result) => {
                if (result.response == 1 && result.productos.length > 0) {
                    let arrayStockNuevos = [];
                    let arrayStocksTotales = [];
                    this.cargarStocks(result.productos, result.almacenes, arrayStockNuevos, arrayStocksTotales);
                    this.setState({
                        productosSelected: result.productos,
                        arrayAlmacenes: result.almacenes,
                        txtBtnTodos: 'Quitar Todos',
                        arrayStockNuevos: arrayStockNuevos,
                        arrayStocksTotales: arrayStocksTotales
                    });
                }
            })
            .catch((error) => {
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
                        this.cargarStocks(result.productos, result.almacenes, arrayStockNuevos, arrayStocksTotales);
                        this.setState({
                            productosSelected: result.productos,
                            arrayAlmacenes: result.almacenes,
                            arrayStockNuevos: arrayStockNuevos,
                            arrayStocksTotales: arrayStocksTotales
                        });
                        return true;
                    } else if (result.response == 0) {
                        message.warning('No existen productos en la familia seleccionada');
                        return false;
                    } else if(result.response == -2) {
                        message.error(result.message);
                        this.setState({ noSesion: true })
                        return false;
                    } else {
                        return false;
                    }
                })
                .catch((error) => {
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
                }
            })
            .catch((error) => {
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
            message.warning('No puede agregar mas productos');
            return;
        }
        let producto = this.inArrayProducto(value, this.state.productosSelected);
        if (!producto) {

            let almacenes = await this.getProdsAlmacenes(value);
            let producto = this.getProductResult(value);     
            let length = almacenes.length;
            let arr = [];
            for (let i = 0; i < length; i++) {
                arr.push(0);
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
                arrayStockNuevos: [
                    ...this.state.arrayStockNuevos,
                    arr
                ],
                arrayStocksTotales: [
                    ...this.state.arrayStocksTotales,
                    {
                        'anterior' : producto.stock,
                        'nuevo': producto.stock
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
                    message.error(strings.message_error);
                    return [];
                })
       
    }

    storeInvetario(estado) {
 
        let body = {
            codinventario: this.state.codinventario,
            descripcion: this.state.descripcion,
            fecha: convertDmyToYmd(this.state.fecha),
            notas: this.state.notas,
            arrayStockNuevos: JSON.stringify(this.state.arrayStockNuevos),
            arrayStocksTotales: JSON.stringify(this.state.arrayStocksTotales),
            arrayAlmacenes: JSON.stringify(this.state.arrayAlmacenes),
            productos: JSON.stringify(this.state.productosSelected),
            estado: estado,
            selectAlmacenes: JSON.stringify(this.state.selectAlmacenes)
        };
        httpRequest('post', ws.wsinventariocorte, body)
        .then((result) => {
            if (result.response > 0) {
                message.success(result.message);
                this.setState({redirect: true});
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
        
    }

    cargarStocks(productos, almacenes, arrayStockNuevos, arrayStocksTotales) {
        
        let length = productos.length;
        for (let i = 0; i < length; i++) {
            let arr = [];
            let alm = almacenes[i];
            let length = alm.length;
            for (let j = 0; j < length; j++) {
                arr.push(0);
            }
            arrayStockNuevos.push(arr);
            arrayStocksTotales.push({
                'anterior': productos[i].stock,
                'nuevo': productos[i].stock,
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
            //console.log(result);
            if (result.response == 1) {
                let array = result.data;
                let length = array.length;
                const almcenStatic = [];
                for (let i = 0; i < length; i++) {
                    almcenStatic.push(array[i].idalmacen);
                }
                this.setState({
                    almacenes: result.data,
                    //selectAlmacenes: data,
                    staticAlmacenes: almcenStatic
                });
            } 
        })
        .catch((error) => {
            message.error(strings.message_error);
        })

    }

    prepararDatos() {
        this.setState({ isInicio: false});
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getAlmacenes();
        this.prepararDatos();
        this.getFamilias();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
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

    getFamilias() {

        httpRequest('get', ws.wsfamilia)
        .then((result) => {
            if (result.ok && result.data.length > 0) {
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
        
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrefamilia == idpadre){
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
        const storeInvetario = this.storeInvetario.bind(this);
        Modal.confirm({
          title: 'Registrar Inventario',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            console.log('OK');
            storeInvetario(estado);
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
                            padding: 5, 
                            flexDirection: 'column',
                            paddingLeft: 15,
                            //backgroundColor: 'red'
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

    /**
     * 
     *  index 
     revisar la seleccion de almacenes
     */

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
                            style={{ width: 65, height: 50, /*padding: 2,*/ display: 'flex'}}>
                            <Input 
                                value={this.state.arrayAlmacenes[index][posicion].stock}
                                placeholder="Valor"
                                readOnly={true}
                            />
                           
                        </div>
                        <div className="input-group-content"
                            style={{ width: 65, height: 50, /*padding: 2,*/ display: 'flex'}}>
                            <Input
                                //type="number"
                                value={this.state.arrayStockNuevos[index][posicion]}
                                placeholder="Valor"
                                onChange={this.onChangeStocksNuevos.bind(this, index, posicion)}
                            />
                        </div>    
                    </div>
                );
            } else {
                component.push(
                    <div style={{ width: 130, height: 50, display: 'flex' }}>
                        <div 
                            className="input-group-content"
                            style={{ width: 65, height: 50, /*padding: 2,*/ display: 'flex'}}>
                            <Input 
                                id={index} 
                                type="text"
                                value="0"
                                placeholder="Valor"
                                className="form-control-content"
                                readOnly={true}
                            />
                        </div>    
                        <div
                            className="input-group-content"
                            style={{ width: 65, height: 50, /*padding: 2,*/ display: 'flex'}}
                        >
                            <Input 
                                id={index} 
                                type="text"
                                value="0"
                                placeholder="Valor"
                                className="form-control-content"
                                readOnly={true}
                            />
                        </div>
                    </div>
                )
            }
        }
        return component;
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

    componentFechaHora() {
        if (this.permisions.fecha.visible == 'A') {
            return (
                <C_DatePicker
                    allowClear={true}
                    value={this.state.fecha}
                    onChange={this.onChangeFecha}
                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom'
                />
            );
        }
        return null;
    }

    btnAddAll() {
        if (this.permisions.btn_add_all.visible == 'A') {
            return(
                <Button
                    onClick={this.agregarTodos}>
                    {this.state.txtBtnTodos}
                </Button>
            );
        }
        return null;
    }

    componentSelectAlmacenes() {
        if (this.permisions.almacenes.visible == 'A') {
            let disabled = this.permisions.almacenes.editable == 'A' ? false : true;
            return (
                <Select
                    mode="multiple"
                    style={{ width: '100%', margin: 'auto' }}
                    placeholder="Seleccione un Almacen"
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
            );
        }
        return null;
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.inventario_index}/>
            )
        }
        
        let componentTitleAlmacen = this.componentTitleAlmacen();
        const resultProducts = this.resultProducts();
        const componentFechaHora = this.componentFechaHora();
        const btnAddAll = this.btnAddAll();
        const componentSelectAlmacenes = this.componentSelectAlmacenes();

        return (
            <div className="cards">
                <div className="forms-groups">
                    <div className="pulls-left">
                        <h1 className="lbls-title"> Registrar Inventario </h1>
                    </div>
                </div>
                <Confirmation
                    visible={this.state.modalOk}
                    title="Registrar Inventario Fisico"
                    onCancel={this.onCancelMO}
                    loading={this.state.loadingOk}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de registrar el inventario fisico?
                            </label>
                        </div>
                    ]}
                />

                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registro Inventario Fisico"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de inventario fisico?
                                Se perderan los datos introducidos.
                            </label>
                        </div>
                    ]}
                />
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    { componentFechaHora }
                    
                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom">
                        { componentSelectAlmacenes }
                    </div> 
                    
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <C_TextArea 
                            title="Descripcion"
                            value={this.state.descripcion}
                            onChange={this.onChangeDescipcion.bind(this)}
                            permisions={this.permisions.descripcion}
                            className='cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12'
                        />
                        <C_TextArea 
                            title="Notas"
                            value={this.state.notas}
                            onChange={this.onChangeNotas.bind(this)}
                            permisions={this.permisions.notas}
                            className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12"
                        />
                    </div>
                </div>
                    
                <div className="cols-lg-12  cols-md-12 cols-sm-12 cols-xs-12 pt-bottom">
                    
                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
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
                    </div>
                
                </div>
                
                <div className="caja-content cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    style={{ 
                        height: 600, 
                        overflow: 'auto' 
                        }}>
                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12"
                        style={{ height: '100%'}}>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                            style={{ height: 100 }}>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-6">
                                <label style={{color: 'black'}}>Nro</label>
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-6">
                                <label style={{color: 'black'}}>Codigo</label>
                            </div>
                            <div className="cols-lg-6 cols-md-3 cols-sm-4 cols-xs-6">
                                <label style={{color: 'black'}}>Descripcion</label>
                            </div>
                        </div>
                        <div 
                            className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ 
                                    //marginTop: 10
                                }}>

                            {
                                this.state.productosSelected.map((item, key) => {
                                    let paddingTop = key == 0 ? '0%' : 13;
                                    return (
                                    <div key={key} 
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ paddingTop: paddingTop}}
                                        >
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
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>    
                                    )
                                })        
                            }            
                        </div>
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-6"
                        style={{ overflowX: 'scroll'/*backgroundColor: 'green'*/ }}>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{  
                                width: '100%',
                                //paddingLeft: 20, 
                                display: 'flex',
                                //backgroundColor: 'red'
                                height: 100
                            }}>
                            { componentTitleAlmacen }
                        </div>
                        <div 
                            className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ /*paddingTop: '5%',*/ /*height: '100%'*/ }}
                            >
                            {
                                this.state.productosSelected.map((item, key) => (
                                    <div key={key}
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ /*paddingTop: 5,*/ display: 'flex' }}
                                    >
                                        { this.componentBodyAlmacen(key) }
                                    </div>
                                ))
                            }
                        </div>
                        
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12"
                        style={{ height: '100%', }}>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ height: 100 }}>
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
                                    }}>Anterior
                                </label>
                                <label 
                                    style={{
                                        color: 'black', 
                                        //padding: 3 ,
                                        marginLeft: 4
                                    }}>Nuevo
                                </label>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                            style={{ paddingTop: -50, }}>
                        {
                            this.state.productosSelected.map((item, key) => {
                                let paddingTop = key == 0 ? '0%' : 5;
                                return (
                                    <div key={key}
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{ 
                                            paddingTop: paddingTop,
                                            display: 'flex'
                                        }}>

                                        <div className="cols-lg-10 cols-md-10 cols-sm-10 cols-xs-12"
                                            style={{ width: 160, display: 'flex' }}>

                                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12"
                                                style={{ width: 200, marginRight: -25 }}>   
                                                <Input
                                                    value={this.state.arrayStocksTotales[key] == undefined ? '' : this.state.arrayStocksTotales[key].anterior}
                                                    placeholder="Valor"
                                                    //onChange={this.handlePrecioProd}
                                                    className="form-control-content"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12"
                                                style={{ width: 200, marginRight: -25 }}
                                                >
                                                <Input 
                                                    value={this.state.arrayStocksTotales[key] == undefined ? '' : this.state.arrayStocksTotales[key].nuevo}
                                                    placeholder="Valor"
                                                    className="form-control-content"
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-6">
                                            <C_Button
                                                title={<i className="fa fa-remove"></i>}
                                                type='danger' size='small' style={{ padding: 4, marginTop: 5 }}
                                                onClick={() => this.removeProductSelected(key)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>        
                
                <div className="forms-groups">
                    <div className="txts-center">
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


