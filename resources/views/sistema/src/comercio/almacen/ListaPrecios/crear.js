
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link } from 'react-router-dom';
import { message, Modal, Select, Divider, DatePicker,Button } from 'antd';
import querystring from 'querystring';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import moment from 'moment';
import CSelect from '../../../componentes/select2';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
let dateIni = new Date();
let dateFin = new Date();
dateFin.setMonth(dateFin.getMonth() + 1);


export default class CreateListaPrecio extends Component{

    constructor(props){
        super(props);
        this.state = {
            descripcion: '',
            fijoporcentaje: 'F',
            estado: 'A',
            fechaini: dateToString(dateIni, 'f2'),
            fechafin: dateToString(dateFin, 'f2'),
            idmoneda: 0,
            valor: 0,
            accion: 'I',
            notas: '',
            txtBtnTodos: 'Agregar Todos',
            selectedListaPrecios: [],
            dataPreciosProd: [],
            dataPreciosProd2: [],
            listaprecios: [],
            idsListaPrecios: [],
            monedas: [],
            productosSelected: [],
            valSearchLista: undefined,
            resultProductos: [],
            resultProductosDefault: [],
            valueSeacrhProd: undefined,
            timeoutSearch: null,
            redirect: false,
            noSesion: false,
            modalCancel: false,
            modalOk: false,
            loadingOk: false
        }

        this.permisions = {
            descripcion: readPermisions(keys.lista_precio_input_descripcion),
            valor: readPermisions(keys.lista_precio_input_valor),
            fijo_porc: readPermisions(keys.lista_precio_select_fijoPorcentaje),
            moneda: readPermisions(keys.lista_precio_select_moneda),
            accion: readPermisions(keys.lista_precio_select_accion),
            fecha_ini: readPermisions(keys.lista_precio_fechaInicio),
            Fecha_fin: readPermisions(keys.lista_precio_fechaFin),
            notas: readPermisions(keys.lista_precio_textarea_nota),
            add_all: readPermisions(keys.lista_precio_btn_agregarTodos),
            search_list: readPermisions(keys.lista_precio_input_search_listaPrecios),
            search_prod: readPermisions(keys.lista_precio_input_search_producto),
            column_pre_mod: readPermisions(keys.lista_precio_tabla_columna_precioModificar)
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
        this.agregarTodos = this.agregarTodos.bind(this);

        this.searchProducto = this.searchProducto.bind(this);
        this.handleSearchProd = this.handleSearchProd.bind(this);
        this.storeListaPrecio = this.storeListaPrecio.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMO = this.onOkMO.bind(this);

    }

    validarData() {
        if(!this.validarDatos()) return;
        this.setState({
            modalOk: true
        })
    }

    onOkMO() {
        this.storeListaPrecio();
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

    handleDescripcion(value) {
        this.setState({
            descripcion: value
        });
    }

    handleFijoPorcentaje(value) {
        this.setState({
            fijoporcentaje: value
        },
            () => this.actualizarPreciosProd()
        );
    }

    handleMoneda(value) {
        this.setState({
            idmoneda: value
        });
    }

    handleValor(value) {
        if (!isNaN(value)) {
            this.setState({
                valor: value
            },
                () => this.actualizarPreciosProd()
            );
       }

    }

    handleFechaInicio(dateString) {
        this.setState({
            fechaini: dateString
        });
    }

    handleFechaFin(dateString) {
        this.setState({
            fechafin: dateString
        });
    }

    handleAccion(value) {
        this.setState({
            accion: value
        },
            () => this.actualizarPreciosProd()
        );
    }

    handleNotas(value) {
        this.setState({
            notas: value
        });
    }

    handlePrecioProd(index, value) {
        if (value >= 0) {
            this.state.dataPreciosProd2[index] = value;
            this.setState({
                dataPreciosProd2: this.state.dataPreciosProd2
            });
        }
        
    }

    searchProducto(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchproducto + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultProductos: result.data
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
        } else {
            this.setState({
                resultProductos: this.state.resultProductosDefault
            });
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

    actualizarPreciosProd() {
        let valor = this.state.valor;
        var val = parseInt(valor);
        
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
                data2[i] = precio - descuento;
            } else {
                let aumento = parseFloat(valor);
                if (this.state.fijoporcentaje == 'P') {
                    aumento = (precio * valor) / 100;
                }
                data2[i] = precio + aumento;
            }
        }
        //console.log('VALOR ', valor);
        this.setState({
            dataPreciosProd: data,
            dataPreciosProd2: data2
        });
    }

    handleValProd(value) {
        //console.log('HANDLE VAL ', value);
        let productSelected = this.getProductoSelected(value);
        if (productSelected) {
            this.setState({
                valueSeacrhProd: value,
                productosSelected: [
                    ...this.state.productosSelected,
                    productSelected
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
        this.setState({ selectedListaPrecios: selected });
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
        
        let fechaInicio = stringToDate(this.state.fechaini, 'f2');
        let fechaFin = stringToDate(this.state.fechafin, 'f2');
        if (fechaFin < fechaInicio) {
            message.warning('La fecha fin no puede ser menor a la fehca inicio');
            return false;
        }
        if (this.state.descripcion.length <= 0) {
            message.warning('El campo descripcion es obligatorio');
            return false;
        }
        if (this.state.fechaini === '') {
            message.warning('Debe elegir una fecha de inicio');
            return false;
        }
        if (this.state.valor < 0) {
            message.warning('El valor no puede ser menor que cero');
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

        let array = this.state.dataPreciosProd2;
        let length = this.state.dataPreciosProd2.length;
        for (let i = 0; i < length; i++) {
            if (array[i] == "" || array[i] == 0 || parseFloat(array[i]) < 0) {
                message.warning('Los productos deben tener un precio mayor que cero');
                return false;
            }
        }
        return true;
    }

    storeListaPrecio() {

        let idsProductos = this.getIdsProductosSeleceted();
        let body = {
            descripcion: this.state.descripcion,
            fijoporcentaje: this.state.fijoporcentaje,
            accion: this.state.accion,
            valor: this.state.valor,
            fechaini: convertDmyToYmd(this.state.fechaini),
            fechafin: convertDmyToYmd(this.state.fechafin),
            idmoneda: this.state.idmoneda,
            notas: this.state.notas,
            idsProductos: JSON.stringify(idsProductos),
            preciosProd: JSON.stringify(this.state.dataPreciosProd2)
        };

        httpRequest('post', ws.wslistaprecio, body)
        .then((result) => {
            if (result.response > 0) {
                message.success(result.message);
                this.setState({redirect: true, modalOk: false, loadingOk: false });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, modalOk: false, loadingOk: false })
            } else {
                message.error(result.message);
                this.setState({ modalOk: false, loadingOk: false })
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(strings.message_error);
            this.setState({ modalOk: false, loadingOk: false })
        })
        
    }

    getMonedas() {

        httpRequest('get', ws.wsmoneda)
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                this.setState({
                    monedas: result.data,
                    idmoneda: result.data[0].idmoneda
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(strings.message_error);
        })
    }

    getListaPrecios() {
        httpRequest('get', ws.wslistaprecio)
        .then((result) => {
            if (result.response > 0) {

                let array = [];
                let arrayIds = [];
                let data = result.data;
                let length = data.length;
                for (let i = 0; i < length; i++) {
                    array.push(data[i].descripcion);
                    arrayIds.push(data[i].idlistaprecio);
                }
                this.setState({
                    listaprecios: result.data,
                    idsListaPrecios: arrayIds,
                    nro: result.data.length + 1,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(strings.message_error);
        })
    }

    removeProductSelected(index) {
        this.state.productosSelected.splice(index, 1);
        this.state.dataPreciosProd.splice(index, 1);
        this.state.dataPreciosProd2.splice(index, 1);
        this.setState({
            productSelected: this.state.productosSelected,
            dataPreciosProd: this.state.dataPreciosProd,
            dataPreciosProd2: this.state.dataPreciosProd2
        });
    }

    getListaProductos(idlistaprecio) {

        httpRequest('get', ws.wslistaproductoslp + '/' + idlistaprecio)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                const array = [];
                let array2 = [];
                for (let i = 0; i < length; i++) {
                    array.push(data[i].precio);
                    array2.push(data[i].precio);
                }
                this.setState({
                    productosSelected: result.data,
                    dataPreciosProd: array,
                    dataPreciosProd2: array2
                },
                    () => this.actualizarPreciosProd()
                );
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }

        })
        .catch((error) => {
            console.log(error);
            console.log(strings.message_error);
        })
    }

    //ultimos 30
    cargarProductos() {
        httpRequest('get', ws.wslistaprecio + '/create')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    resultProductos: result.productos,
                    resultProductosDefault: result.productos
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(strings.message_error);
        })
    }

    componentDidMount() {
        this.getMonedas();
        this.getListaPrecios();
        this.cargarProductos();
    }

    handleChangeListaPrecio(value) {
        this.getListaProductos(value);
        this.setState({
            valSearchLista: value
        });
    }
      
    handleBlurListaPrecio() {
        console.log('blur');
    }
      
    handleFocusListaPrecio() {
        console.log('focus');
    }

    showConfirmStore() {

        if(!this.validarDatos()) return;
        const storeListaPrecio = this.storeListaPrecio.bind(this);
        Modal.confirm({
          title: 'Registrar Lista de Precio',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            console.log('OK');
            storeListaPrecio();
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
            title: '¿Esta seguro de cancelar el registro de la nueva lista de precios?',
            content: 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?',
            okText: 'Si',
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

    agregarTodos() {
        if (this.state.txtBtnTodos == 'Agregar Todos') {
            httpRequest('get', ws.wsallproductos)
            .then((result) => {
                if (result.response == 1) {
                    let data = result.data;
                    let length = data.length;
                    const array = [];
                    let array2 = [];
                    for (let i = 0; i < length; i++) {
                        array.push(data[i].precio);
                        array2.push(data[i].precio);
                    }
                    this.setState({
                        productosSelected: result.data,
                        dataPreciosProd: array,
                        dataPreciosProd2: array2,
                        txtBtnTodos: 'Quitar Todos'
                    },
                        () => this.actualizarPreciosProd()
                    );
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({
                productosSelected: [],
                txtBtnTodos: 'Agregar Todos',
                dataPreciosProd: [],
                dataPreciosProd2: []
            });
        }
        
    }

    listaMonedas() {

        let data = this.state.monedas;
        let length = data.length;
        let arr = [<Option 
                    key={-1}
                    value={0}>
                    {"Seleccionar"}
                </Option>];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i}
                    value={data[i].idmoneda}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    componentFechaIni() {
        if (this.permisions.fecha_ini.visible == 'A') {
            let disabled = this.permisions.fecha_ini.editable == 'A' ? false : true;
            return (
                <C_DatePicker 
                    onChange={this.handleFechaInicio}
                    value={this.state.fechaini}
                    title='Fecha Inicio'
                    readOnly={disabled}
                />
            );
        }
        return null;
    }

    componentFechaFin() {
        if (this.permisions.Fecha_fin.visible == 'A') {
            let disabled = this.permisions.Fecha_fin.editable == 'A' ? false : true;
            return (
                <C_DatePicker 
                    onChange={this.handleFechaFin}
                    value={this.state.fechafin}
                    title='Fecha Fin'
                    readOnly={disabled}
                />
            );
        }
        return null;
    }

    btnAddAll() {
        if (this.permisions.add_all.visible == 'A') {
            return (
                <Button style={{'width': '100%', minWidth: '100%', 
                    'padding': '1px', 'fontSize': '12px'}}
                    onClick={this.agregarTodos}>
                    {this.state.txtBtnTodos}
                </Button>
            );
        }
        return null;
    }

    listaPrecios() {
        let data = this.state.listaprecios;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i}
                    value={data[i].idlistaprecio}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    listaProds() {
        let data = this.state.resultProductos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i}
                    value={data[i].idproducto}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.lista_precios_index}/>
            )
        }
        let selectedListaPrecios = this.state.selectedListaPrecios;
        const listaMonedas = this.listaMonedas();
        const componentFechaIni = this.componentFechaIni();
        const componentFechaFin = this.componentFechaFin();
        const btnAddAll = this.btnAddAll();
        const listaPrecios = this.listaPrecios();
        const listaProds = this.listaProds();

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Lista de Precio</h1>
                        </div>
                    </div>

                    <Confirmation
                        visible={this.state.modalOk}
                        title="Registrar Lista de Precio"
                        onCancel={this.onCancelMO}
                        loading={this.state.loadingOk}
                        onClick={this.onOkMO}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de registrar la lista de precio?
                                </label>
                            </div>
                        ]}
                    />

                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Cancelar Lista de Precio"
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de cancelar el registro de lista de precio?
                                    Se perderan los datos introducidos.
                                </label>
                            </div>
                        ]}
                    />

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Descripcion"
                                value={this.state.descripcion}
                                onChange={this.handleDescripcion}
                                permisions={this.permisions.descripcion}
                                className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Select 
                                title="Moneda"
                                value={this.state.idmoneda}
                                onChange={this.handleMoneda}
                                component={listaMonedas}
                                permisions={this.permisions.moneda}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-2 cols-md-2"></div>
                            <C_Input
                                title="Valor"
                                value={this.state.valor}
                                onChange={this.handleValor}
                                permisions={this.permisions.valor}
                                style={{ textAlign: 'right' }}
                            />
                            <C_Select 
                                title="Fijo/Porcentaje "
                                value={this.state.fijoporcentaje}
                                onChange={this.handleFijoPorcentaje}
                                permisions={this.permisions.fijo_porc}
                                component={[
                                    <Option key={0} value="F"> Fijo </Option>,
                                    <Option key={1} value="P"> Porcentaje </Option>
                                ]}
                            />
                            <C_Select
                                title="Accion"
                                value={this.state.accion}
                                onChange={this.handleAccion}
                                permisions={this.permisions.accion}
                                component={[
                                    <Option key={1} value="D"> Descuento </Option>,
                                    <Option key={0} value="I"> Incremento </Option>
                                ]}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            
                            { componentFechaIni }
                            
                            { componentFechaFin }
                            
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <TextArea 
                                    title="Notas"
                                    value={this.state.notas}
                                    onChange={this.handleNotas}
                                    permisions={this.permisions.notas}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Divider
                                orientation='left'>
                                Opciones de busqueda
                            </Divider>                
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    { btnAddAll }
                                </div>
                                <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                    <CSelect
                                        showSearch={true}
                                        style={{ width: '100%', minWidth: '100%' }}
                                        value={this.state.valSearchLista}
                                        placeholder="Seleccione una lista de precio"
                                        optionFilterProp="children"
                                        onChange={this.handleChangeListaPrecio}
                                        onFocus={this.handleFocusListaPrecio}
                                        onBlur={this.handleBlurListaPrecio}
                                        //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        component={listaPrecios}
                                        permisions={this.permisions.search_list}
                                    />
                                </div>
                            
                                <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                    <CSelect
                                        showSearch={true}
                                        value={this.state.valueSeacrhProd}
                                        placeholder={"Buscar producto por Id o descripcion"}
                                        style={{ width: '100%', minWidth: '100%' }}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearchProd}
                                        onChange={this.handleValProd}
                                        notFoundContent={null}
                                        allowDelete={true}      
                                        onDelete={() => this.setState({ valueSeacrhProd: undefined })}                                  
                                        component={listaProds}
                                        permisions={this.permisions.search_prod}
                                    />
                                </div>
                            </div>
                        
                            <div className="table-detalle" 
                                style={{ 
                                    width: '100%',
                                    overflow: 'auto',
                                    maxHeight: 400,
                                }}
                            >
                                <table className="table-response-detalle">
                                    <thead>
                                        <tr>
                                            <th>Nro</th>
                                            <th>Id Producto</th>
                                            <th>Descripcion</th>
                                            <th>Precio Orig</th>
                                            { this.permisions.column_pre_mod.visible == 'A' ? <th>Precio Modif</th> : null }
                                            <th>Accion</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.productosSelected.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>
                                                        <Input
                                                            value={item.idproducto}
                                                            readOnly={true}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            value={item.descripcion}
                                                            readOnly={true}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            value={item.precio}
                                                            readOnly={true}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            placeholder="Valor"
                                                            value={this.state.dataPreciosProd2[key]}
                                                            onChange={this.handlePrecioProd.bind(this, key)}
                                                            permisions={this.permisions.column_pre_mod}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <C_Button title={<i className='fa fa-remove'></i>}
                                                            type='danger' size='small'
                                                            onClick={() => this.removeProductSelected(key)}
                                                            style={{'padding': '3px'}}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button onClick={this.validarData.bind(this)}
                                    type='primary' title='Guardar'
                                />
                                <C_Button onClick={() => this.setState({ modalCancel: true })}
                                    type='danger' title='Cancelar'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


