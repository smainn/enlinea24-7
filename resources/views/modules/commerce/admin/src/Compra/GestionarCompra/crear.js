import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';
import { Modal, message, DatePicker, Select, Divider, Alert, Icon } from 'antd';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { dateToString, hourToString, fullHourToString, dateHourToString, stringToDate } from '../../../tools/toolsDate';

import CrearProveedor from '../GestionarProveedor/crear';
import ShowProveedor from '../GestionarProveedor/show';
import { EEXIST } from 'constants';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import CDatePicker from '../../../components/datepicker';

import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';

const { Option } = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
const CANTIDAD_PRODUCTOS_DEFAULT = 30;
const CANTIDAD_PROVEEDORES_DEFAULT = 30;

import moment from 'moment';
import CSelect from '../../../components/select2';
import SubMenu from 'antd/lib/menu/SubMenu';
import C_Button from '../../../components/data/button';
import C_Input from '../../../components/data/input';
import C_DatePicker from '../../../components/data/date';
import C_Select from '../../../components/data/select';

let now = new Date();
export default class CreateCompra extends Component {
    constructor(){
        super();
        this.state = {
            nro: 0,
            fechaActual: this.fechaActual(),

            codcompra: '',
            fecha: dateToString(now),
            hora: fullHourToString(now),
            idsucursal: '',
            idalmacen: '',
            notas: '',
            costoTotal: 0,
            idmoneda: 0,
            planpago: 'C',
            nit:'',
            anticipo: 0,
            saldo: 0,
            valSearchCod: undefined,
            valSearchNom: undefined,
            timeoutSearch: undefined,
            timeoutSearchCod: null,
            timeoutSearchNom: null,
            timeoutSearchProd1: null,
            timeoutSearchProd2: null,
            proveedor: {},

            productos: [],
            unidadMedidas: [],
            cantidades: [],
            costosUnitarios: [],
            costosTotales: [],
            productoAlmacenes: [],

            valuesSearchProd: [],
            resultProveedores: [],
            resultProveedoresDefault: [],
            sucursales: [],
            almacenesSucursal: [],
            almacenes: [],
            monedas: [],
            resultProductos: [],
            resultProductosDefault: [],
            listaCuotas: [],
            cantidadCuotas: 0,

            fechaInicioDePago: dateToString(now),
            periodo: '1',
            numeroCuota: 1,

            visibleShow: false,
            posicionProveedor: -1,
            proveedorSeleccionado: [],
            proveedorContacto: [],

            messageAlert: '',

            mostrarCreateProv: false,
            alertModal: false,
            visiblePlanPago: false,
            redirect: false,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,
            isabogado: true
        }
        
        this.permisions = {
            ver_nro: readPermisions(keys.compra_ver_nro),
            ver_fecha: readPermisions(keys.compra_ver_fecha),
            codigo: readPermisions(keys.compra_input_codigo),
            sucursal: readPermisions(keys.compra_select_sucursal),
            almacen: readPermisions(keys.compra_select_almacen),
            moneda: readPermisions(keys.compra_select_moneda),
            agregar_proveedor : readPermisions(keys.compra_btn_agregarProveedor),
            ver_proveedor: readPermisions(keys.compra_btn_verProveedor),
            codigo_proveedor: readPermisions(keys.compra_input_search_codigoProveedor),
            nombre_proveedor: readPermisions(keys.compra_input_search_nombreProveedor),
            nit_proveedor: readPermisions(keys.compra_input_nitProveedor),
            plan_pago: readPermisions(keys.compra_select_planPago),
            fecha: readPermisions(keys.compra_fecha),
            hora: readPermisions(keys.compra_hora),
            col_codigo_prod: readPermisions(keys.compra_tabla_columna_codigoProducto),
            col_producto: readPermisions(keys.compra_tabla_columna_producto),
            col_cantidad: readPermisions(keys.compra_tabla_columna_cantidad),
            col_costo_unit: readPermisions(keys.compra_tabla_columna_costoUnitario),
            notas: readPermisions(keys.compra_textarea_nota),
            total: readPermisions(keys.compra_input_total)
        }

        this.onChangeCodCompra = this.onChangeCodCompra.bind(this);
        this.onChangeSucursal = this.onChangeSucursal.bind(this);
        this.onChangeAlmacen = this.onChangeAlmacen.bind(this);
        this.onChangeNit = this.onChangeNit.bind(this);
        this.onChangeMoneda = this.onChangeMoneda.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeHora = this.onChangeHora.bind(this);
        this.onChangeFechaIni = this.onChangeFechaIni.bind(this);
        this.onChangeSearchProvNom = this.onChangeSearchProvNom.bind(this);
        this.onChangeSearchProvCod = this.onChangeSearchProvCod.bind(this);
        //this.onChangeCantidades = this.onChangeCantidades.bind(this);
        this.onChangeCostoT = this.onChangeCostoT.bind(this);
        this.onChangeCostoU = this.onChangeCostoU.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onChangePeriodo = this.onChangePeriodo.bind(this);
        this.onChangeAnticipo = this.onChangeAnticipo.bind(this);
        this.onChangeNumeroCuota = this.onChangeNumeroCuota.bind(this);
        this.onChangeFechaPlan = this.onChangeFechaPlan.bind(this);
        //this.onChangeMonto = this.onChangeMonto.bind(this);
        this.onSearchProvCod = this.onSearchProvCod.bind(this);
        this.onSearchProvNom = this.onSearchProvNom.bind(this);
        this.onSearchProdCod = this.onSearchProdCod.bind(this);
        this.onSearchProdNom = this.onSearchProdNom.bind(this);
        this.onChangePlanPago = this.onChangePlanPago.bind(this);
        this.addRowProducto = this.addRowProducto.bind(this);
        this.closeModalPlanPago = this.closeModalPlanPago.bind(this);
        this.openModalPlanPago = this.openModalPlanPago.bind(this);
        this.guardarCompra = this.guardarCompra.bind(this);
        this.createProveedor = this.createProveedor.bind(this);
        this.showConfirmStore = this.showConfirmStore.bind(this);
        this.onClickProveedor = this.onClickProveedor.bind(this);
        this.closePlanPago = this.closePlanPago.bind(this);
        this.confirmChangeAlmacen = this.confirmChangeAlmacen.bind(this);
        this.confirmChangeSucursal = this.confirmChangeSucursal.bind(this);
        this.storeCompra = this.storeCompra.bind(this);
        this.onDeleteCompra = this.onDeleteCompra.bind(this);
        this.onDeleteSearchVend = this.onDeleteSearchVend.bind(this);
        //this.onChangeSearchProdId = this.onChangeSearchProdId.bind(this);
        //this.onChangeSearchProdNom = this.onChangeSearchProdNom.bind(this);
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = dia + '/' + mes + '/' + year;

        return fechaFormato;   
    }

    onDeleteSearchVend() {
        this.setState({
            valSearchCod: undefined,
            valSearchNom: undefined,
            nit: ''
        })
    }

    onDeleteSearchProd(index) {

        this.state.valuesSearchProd[index].id = undefined;
        this.state.valuesSearchProd[index].descripcion = undefined;
        this.state.cantidades[index] = '';
        this.state.costosUnitarios[index] = '';
        this.state.costosTotales[index] = '';
        this.state.unidadMedidas[index] = '';
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            cantidades: this.state.cantidades,
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            unidadMedidas: this.state.unidadMedidas,
        })
    }

    onDeleteCompra() {
        this.setState({
            valSearchCod: undefined,
            valSearchNom: undefined,
            nit: '',
        })
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodcompravalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validarCodigo: 1 })
                    } else {
                        this.setState({ validarCodigo: 0 })
                    }
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
            this.setState({ validarCodigo: 1 })
        }
        
    }

    handleVerificCodigo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeCodCompra(value) {
        this.handleVerificCodigo(value);
        this.setState({ codcompra: value });
    }

    confirmChangeSucursal(value) {
        const onChangeSucursal = this.onChangeSucursal;
        Modal.confirm({
            title: 'Cambiar de Sucursal',
            content: 'Al cambiar de sucursal se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              onChangeSucursal(value);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    onChangeSucursal(value) {
        
        this.actualizarAlmacenesSucursal(value);
        this.setState({ idsucursal: value });
        this.clearListaProducts();
    }

    confirmChangeAlmacen(value) {

        const onChangeAlmacen = this.onChangeAlmacen;
        Modal.confirm({
            title: 'Cambiar de almacen',
            content: 'Al cambiar de almacen se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              onChangeAlmacen(value);
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    onChangeAlmacen(value) {
        this.getAlmacenProductos(value);
        this.setState({ idalmacen: value });
        this.clearListaProducts();
    }

    onChangeNit(value) {
        /*
        this.setState({
            nit: e.target.value
        });*/
    }

    clearListaProducts() {
        let aux = [
            {id: undefined, descripcion: undefined},
            {id: undefined, descripcion: undefined},
            {id: undefined, descripcion: undefined},
        ];
        this.setState({
            productos: [0,0,0],
            cantidad: ['','',''],
            costosUnitarios: ['','',''],
            costosTotales: ['','',''],
            valuesSearchProd: aux,
            costoTotal: 0,
            unidadMedidas: ['', '', '']
        });
    }

    onChangeMoneda(value) {
        this.setState({ idmoneda: value });
    }

    calcularCostoTotal() {
        let cantidades = this.state.cantidades;
        for (let i = 0; i < cantidades.length; i++) {
            if (cantidades[i] == "" && this.state.costosUnitarios[i] == "") {
                this.state.costosTotales[i] = 0;
            } else if(cantidades[i] == ""){
                this.state.costosTotales[i] = 0;
            } else if(this.state.costosUnitarios[i] == "") {
                this.state.costosTotales[i] = 0;
            } else {
                this.state.costosTotales[i] = (cantidades[i] * parseFloat(this.state.costosUnitarios[i])).toFixed(2);
            }
            
        }
        let array = this.state.costosTotales;
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                total = total + parseFloat(array[i]);
            } else {
                total = total + 0;
            }
        }
        
        this.setState({ 
            costoTotal: total.toFixed(2),
            costosTotales: this.state.costosTotales
        });
    }

    onChangeFecha(dateString) {
        this.setState({ fecha: dateString });
    }

    onChangeHora(hourString) {
        this.setState({ hora: hourString });
    }

    onChangeCantidades(index, value) {
        //let index = e.target.id;
        /*if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
            if (isNaN(value))
                return;
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }*/
        //console.log('CANTIDAD ==> ', value);
        if (isNaN(value)) return;
        let cantidad = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        if (this.state.valuesSearchProd[index].id == undefined) {
            message.warning('Debe elegir un producto primero');
            return;
        }
        let costo = this.state.costosUnitarios[index];
        if (costo < 0 || costo == '' || isNaN(costo)) {
            message.warning('Costo por defecto 0');
            this.state.costosUnitarios[index] = "";
            this.setState({
                costosUnitarios: this.state.costosUnitarios
            });
            return;
        }
        if (cantidad < 0) {
            message.warning('Costo por defecto 0');
            this.state.costosUnitarios[index] = "";
            this.setState({
                costosUnitarios: this.state.costosUnitarios
            });
            return;
        }
        this.state.costosUnitarios[index] = costo;
        this.state.costosTotales[index] = cantidad * costo;
        
        //this.state.cantidades[index] = parseInt(cantidad);
        this.state.cantidades[index] = value;
        this.setState({ 
            cantidades: this.state.cantidades ,
            costosTotales: this.state.costosTotales,
            costosUnitarios: this.state.costosUnitarios
        },
            () => this.calcularCostoTotal()
        );
    }

    onChangeCostoU(index, value) {
        //let index = e.target.id;
        /*if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
            if (isNaN(value))
                return;
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }*/
        if (isNaN(value)) return;
        if (this.state.valuesSearchProd[index].id == undefined) {
            message.warning('Debe elegir un producto primero');
            return;
        }
        let costo = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        if (costo < 0 || isNaN(costo)) {
            this.state.costosUnitarios[index] = "";
            this.setState({
                costosUnitarios: this.state.costosUnitarios
            });
            //message.warning('Costo por defecto 0');
            return;
        }
        
        let cantidad = this.state.cantidades[index];
        if (cantidad == 0 || cantidad == '' || isNaN(cantidad)) {
            message.error('Cantidad por defecto');
        }
        this.state.cantidades[index] = cantidad;
        this.state.costosTotales[index] = (costo * cantidad).toFixed(2);

        this.state.costosUnitarios[index] = value;
        this.setState({ 
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            cantidades: this.state.cantidades
        },
            () => this.calcularCostoTotal()
        );
    }

    onChangeCostoT(e) {
        //this.state.costosTotales[e.target.id] = parseInt(e.target.value);
        //this.setState({ costosTotales: this.state.costosTotales });
    }

    onChangeNotas(value) {
        this.setState({ notas: value });
    }

    onChangePeriodo(value) {
        this.setState({ periodo: value });
    }

    onChangeNumeroCuota(value) {
        this.setState({ numeroCuota: value });
    }
    
    onChangeAnticipo(value) {
        
        if (isNaN(value)) return;
        let anticipo = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        if (value < 0) {
            message.warning('El anticipo no puede ser negativo');
            return;
        }
        let total = (this.state.costoTotal - anticipo).toFixed(2);
        if (total < 0) {
            message.warning('El saldo no puede ser menor que cero');
            return;
        }
        this.setState({ 
            anticipo: value,
            saldo: total
        });
    }

    onChangeFechaIni(date, dateString) {
        this.setState({ 
            fechaInicioDePago: dateString,
            alertModal: false
        });
    }

    onChangePlanPago(value) {
        this.setState({ planpago: value });
    }

    onChangeFechaPlan(index, fecha, dateString) {
        //var fecha = e.target.value;
        //var index = e.target.id;
        var datos = this.state.listaCuotas[index];
        var fechaModi = stringToDate(dateString);
        //var fechaFormato = String(fechaModi[2]+"/"+fechaModi[1]+"/"+fechaModi[0])
        var fechaActual = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
        //var fechaVenta = this.state.fecha.split('-');
        //var fechaVentaFormato = String(fechaVenta[2]+"/"+fechaVenta[1]+"/"+fechaVenta[0])
        //var fechaVentaComparar =  new Date(parseInt(fechaVenta[0]),parseInt(fechaVenta[1])-1,parseInt(fechaVenta[2]));
        
        if(fechaModi.getTime() >= fechaActual.getTime()){
            this.state.listaCuotas[index].FechaApagar = dateString
            this.setState({
                listaCuotas: this.state.listaCuotas
            })
        }else{
            console.log("no es mayor")
        }
        // fechaActual.setDate(fechaActual.getDate()+(parseInt(this.state.tipoPeriodo) * i))
    }

    onChangeMonto(index, monto) {
        //let monto = value;
        if (monto == "") {
            monto = 0;
        } else if(isNaN(parseFloat(monto))) {
            return;
        }
        //let index = parseInt(e.target.id);
        let saldoAnterior = index == 0 ? this.state.saldo : this.state.listaCuotas[index-1].saldo;
        this.state.listaCuotas[index].montoPagar = monto == 0 ? '' : monto;
        let saldo = parseFloat(saldoAnterior) - parseFloat(monto);
        if (saldo < 0) {
            message.warning('Numero no valido, el saldo da negativo');
            return;
        }
        this.state.listaCuotas[index].saldo = saldo.toFixed(2);
        let valorDefault = index == 0 ? this.state.listaCuotas[index+1].montoPagar : this.state.listaCuotas[index-1].montoPagar;
        let porcion = (parseFloat(valorDefault) - parseFloat(monto)) / (this.state.listaCuotas.length - index - 1);
        let length = this.state.listaCuotas.length;
        for (let i = index + 1; i < length; i++) {
            let montoPagarActual = parseFloat(valorDefault) + porcion;
            let saldoAnterior = parseFloat(this.state.listaCuotas[i-1].saldo);
            if (montoPagarActual > saldoAnterior || montoPagarActual < 0) {
                montoPagarActual = saldoAnterior;
            }
            this.state.listaCuotas[i].montoPagar = montoPagarActual.toFixed(2);
            let saldoActual = saldoAnterior - montoPagarActual;
            this.state.listaCuotas[i].saldo = saldoActual.toFixed(2);
        }
        
        index = this.state.listaCuotas.length-1;
        var val = parseFloat(this.state.listaCuotas[index].montoPagar);
        saldo = parseFloat(this.state.listaCuotas[index].saldo);
        if (saldo != 0 && saldo > 0) {
            var result = val + saldo;
            this.state.listaCuotas[index].montoPagar = result.toFixed(2); 
            this.state.listaCuotas[index].saldo = 0; 
        }
        this.setState({
            listaCuotas: this.state.listaCuotas
        });
        
    }

    closeModalPlanPago() {
        this.setState({ visiblePlanPago: false });
    }

    openModalPlanPago() {
        this.setState({ visiblePlanPago: true });
    }

    actualizarAlmacenesSucursal(idsucursal) {

        let array = this.state.almacenes;
        let length = array.length
        let data = [];
        for (let i = 0; i < length; i++) {
            if (array[i].fkidsucursal == idsucursal) {
                data.push(array[i]);
            }
        }
        let idalmacen = 0;
        if (data.length > 0) {
            idalmacen = data[0].idalmacen
        }
        this.setState({
            almacenesSucursal: data,
            idalmacen: idalmacen
        },
            () => this.getAlmacenProductos(idalmacen)
        );
    }
    /**by henry */
    abrirModalShow(id) {
        
        var body = {'idProveedor': id};
        httpRequest('post', ws.wsshowproveedor, body)
        .then((result) => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.setState({
                proveedorSeleccionado: result.proveedor,
                proveedorContacto: result.contacto,
                visibleShow: true
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onClickProveedor() {
        if (this.state.valSearchCod == undefined) {
            this.setState({ mostrarCreateProv: true });
        } else {
           this.abrirModalShow(this.state.valSearchCod);
        }
    }

    createProveedor() {
        this.setState({ mostrarCreateProv: true });
    }

    getAlmacenProductos(idalmacen) {
        httpRequest('post', ws.wsalmacenproductos,{
            idalmacen: idalmacen, 
            cantidad: CANTIDAD_PRODUCTOS_DEFAULT
        })
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    resultProductos: result.data,
                    resultProductosDefault: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchProveedorByCodId(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchproveedorcod + '/' + value)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProveedores: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            /*
            this.setState({
                resultProveCod: []
            });
            */
        }
    }

    searchProveedorByNombre(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchproveedornom + '/' + value)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProveedores: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            /*this.setState({
                resultProveNom: []
            });*/
        }
    }

    onSearchProvCod(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(() => this.searchProveedorByCodId(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    onSearchProvNom(value) {

        if (this.state.timeoutSearchNom) {
            clearTimeout(this.state.timeoutSearchNom);
            this.setState({ timeoutSearchNom: null});
        }
        this.state.timeoutSearchNom = setTimeout(() => this.searchProveedorByNombre(value), 300);
        this.setState({ timeoutSearchNom: this.state.timeoutSearchNom});
    }

    onChangeSearchProvCod(value) {

        let array = this.state.resultProveedores;
        let nameFull ='No tiene';
        let nit = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproveedor == value) {
                let apellido = array[i].apellido == null ? '' : array[i].apellido;
                nameFull = array[i].nombre + ' ' + apellido;
                nit = array[i].nit;
                break;
            }
        }
        this.setState({
            valSearchCod: value,
            valSearchNom: nameFull,
            nit: nit
        });
    }

    onChangeSearchProvNom(value) {
        
        let array = this.state.resultProveedores;
        let nit = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproveedor == value) {
                nit = array[i].nit;
                break;
            }
        }
        this.setState({
            valSearchNom: value,
            valSearchCod: value,
            nit: nit
        });
    }

    addRowProducto() {

        this.state.productos.push(0);
        this.state.cantidades.push('');
        this.state.costosUnitarios.push('');
        this.state.costosTotales.push('');
        this.setState({
            productos: this.state.productos,
            cantidades: this.state.cantidades,
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            valuesSearchProd: [
                ...this.state.valuesSearchProd,{
                    id: undefined,
                    descripcion: undefined 
                }
            ]
        });
    }

    removeProductSelected(index) {
        this.state.productos.splice(index, 1);
        this.state.cantidades.splice(index, 1);
        this.state.costosUnitarios.splice(index, 1);
        this.state.costosTotales.splice(index, 1);
        this.state.valuesSearchProd.splice(index, 1);
        this.setState({
            productos: this.state.productos,
            cantidad: this.state.cantidades,
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            valuesSearchProd: this.state.valuesSearchProd,
        },
            () => this.calcularCostoTotal()
        );
    }

    /** -------BEGIN-------- */

    searchProductoByCodId(value) {
        if (value.length > 0) {
            httpRequest('post', ws.wssearchprodidalm, {idalmacen: this.state.idalmacen, value: value})
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            this.setState({
                resultProveCod: this.state.resultProductosDefault
            });
        }
    }

    searchProductoByDesc(value) {
        if (value.length > 0) {
            httpRequest('post', ws.wssearchproddescalm, {value: value, idalmacen: this.state.idalmacen})
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            this.setState({
                resultProveCod: this.state.resultProductosDefault
            });
        }
    }

    onSearchProdCod(value) {
        if (this.state.timeoutSearchProd1) {
            clearTimeout(this.state.timeoutSearchProd1);
            this.setState({ timeoutSearchProd1: null});
        }
        this.state.timeoutSearchProd1 = setTimeout(() => this.searchProductoByCodId(value), 300);
        this.setState({ timeoutSearchProd1: this.state.timeoutSearchProd1});
    }

    onSearchProdNom(value) {

        if (this.state.timeoutSearchProd2) {
            clearTimeout(this.state.timeoutSearchProd2);
            this.setState({ timeoutSearchProd2: null});
        }
        this.state.timeoutSearchProd2 = setTimeout(() => this.searchProductoByDesc(value), 300);
        this.setState({ timeoutSearchProd2: this.state.timeoutSearchProd2});
    }

    getAlmacenesProd(idproducto) {
        httpRequest('get', ws.wsgetalmacenprod + '/' + idproducto)
        .then((result) => {
            if (result.response > 0) {
                let array = [];
                for (let i = 0; i < result.data.length; i++) {
                    array.push(result.data[i].idalmacen);
                }
                this.state.productoAlmacenes.push({
                    idproducto: idproducto,
                    almacenes: array
                });
                this.setState({
                    productoAlmacenes: this.state.productoAlmacenes
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema');
        })
    }

    onChangeSearchProdId(index, value) {
        let array = this.state.valuesSearchProd;
        let esta = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == value) {
                esta = true;
                break;
            }
        }
        if (esta) {
            message.warning('El producto ya fue seleccionado');
            return;
        }

        array = this.state.resultProductos;
        var descripcion = '';
        let unidadmedida = '';
        let costo = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                unidadmedida = array[i].abreviacion;
                costo = array[i].costo;
                break;
            }
        }
        this.getAlmacenesProd(value);
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
        this.state.cantidades[index] = 1;
        this.state.unidadMedidas[index] = unidadmedida;
        this.state.costosUnitarios[index] = parseFloat(costo);
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            cantidades: this.state.cantidades,
            unidadMedidas: this.state.unidadMedidas,
            costosUnitarios: this.state.costosUnitarios
        },
            () => this.calcularCostoTotal()
        );
    }

    onChangeSearchProdNom(index, value) {
        let array = this.state.valuesSearchProd;
        let esta = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == value) {
                esta = true;
                break;
            }
        }
        if (esta) {
            message.warning('El producto ya fue seleccionado');
            return;
        }
        array = this.state.resultProductos;
        let unidadmedida = 'Ninguno';
        let costo = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                unidadmedida = array[i].abreviacion;
                costo = array[i].costo;
                break;
            }
        }
        this.getAlmacenesProd(value);
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = value;
        this.state.cantidades[index] = 1;
        this.state.unidadMedidas[index] = unidadmedida;
        this.state.costosUnitarios[index] = costo;
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            cantidades: this.state.cantidades,
            unidadMedidas: this.state.unidadMedidas,
            costosUnitarios: this.state.costosUnitarios
        },
            () => this.calcularCostoTotal()
        );
    }
    /** --------END-------- */

    obtenerDatos(idsProductos, cantidades, costos, costosTotales) {
        let array = this.state.valuesSearchProd;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id != undefined) {
                idsProductos.push(this.state.valuesSearchProd[i].id);
                cantidades.push(this.state.cantidades[i]);
                costos.push(this.state.costosUnitarios[i]);
                costosTotales.push(this.state.costosTotales[i]);
            }
            
        }
    }
    
    validarParametros() {

        let codcompra = this.state.codcompra.trim();
        if (codcompra.length === 0 && this.state.configCodigo) {
            message.warning('Codigo no valido');
            return false;
        }
        if (this.state.valSearchCod == undefined) {
            message.warning('La compra debe tener un proveedor');
            return false;
        }
        //let data = this.state.cos

        let array = this.state.listaCuotas;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].montoPagar == "" || parseFloat(array[i].montoPagar) == 0) {
                this.setState({
                    alertModal: true,
                    messageAlert: 'No deben quedar cuotas en cero'
                });
                return false;
            }
        }
        array = this.state.valuesSearchProd;
        if (array.length === 0) {
            message.warning('Debe haber por lo menos 1 producto en la compra');
            return false;
        }

        var i = 0;
        let b1 = false;
        let b2 = true;
        while (i < array.length && b2) {
            if (array[i].id != undefined) {
                b1 = true;
                if (this.state.cantidades[i] == '' || this.state.cantidades[i] == 0 || 
                    this.state.costosUnitarios[i] == '' || this.state.costosUnitarios[i] == 0) {
                    b2 = false;
                }
            }
            i++;
        }
        if (!b1) {
            message.warning('Debe haber por lo menos 1 producto en la compra');
            return false;
        }

        if (!b2) {
            message.warning('Los productos seleccionados deben tener una cantidad o precio validos');
            return false;
        }

        return true;
    }

    guardarCompra() {

        if (this.state.planpago == 'R') {
            this.setState({
                visiblePlanPago: true,
                saldo: this.state.costoTotal
            });
        } else {
            this.setState({visiblePlanPago: false});
            this.showConfirmStore();
        }
    }

    getDatosCuotas(montos, fechas, descripciones) {
        let array = this.state.listaCuotas;
        for (let i = 0; i < array.length; i++) {
            montos.push(array[i].montoPagar);
            fechas.push(array[i].FechaApagar);
            descripciones.push(array[i].descripcion);
        }
    }

    showConfirmStore() {

        this.setState({
            alertModal: false
        });
        if (!this.validarParametros()) return;
        let storeCompra = this.storeCompra;
        Modal.confirm({
          title: 'Guardar Compra',
          content: '¿Esta seguro de realizar la compra de los prodcutos?',
          onOk() {
            console.log('OK');
            storeCompra();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    storeCompra() {
        
        if (!this.validarParametros()) return;

        let idsProductos = [];
        let cantidades = [];
        let costos = [];
        let costosTotales = [];
        this.obtenerDatos(idsProductos, cantidades, costos, costosTotales);
        let montos = [];
        let fechas = [];
        let descripciones = [];
        if (this.state.planpago == 'R') {
            this.getDatosCuotas(montos, fechas, descripciones);
        }
        let body = {
            codcompra: this.state.codcompra,
            fecha: this.state.fecha,
            hora: this.state.hora,
            anticipopagado: this.state.anticipo,
            notas: this.state.notas,
            idproveedor: this.state.valSearchCod,
            tipo: this.state.planpago,
            idsproductos: JSON.stringify(idsProductos),
            cantidades: JSON.stringify(cantidades),
            costos: JSON.stringify(costos),
            costostotales: JSON.stringify(costosTotales),
            idmoneda: this.state.idmoneda,
            idalmacen: this.state.idalmacen,
            montos: JSON.stringify(montos),
            fechas: JSON.stringify(fechas),
            descripciones: JSON.stringify(descripciones),
            costoTotal: this.state.costoTotal
        };
        
        httpRequest('post', ws.wscompra, body)
        .then((result) => {
            if (result.response > 0) {
                message.success('Se guardo correctamente');
                this.setState({ redirect: true });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema al guardar, intentelo nuevmente');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema con la conexion, revise su conexion e intentlo nuevamente');
        })
    }

    componentDidMount() {
        this.preparaDatos();
        this.createCompra();
    }

    createCompra() {
        httpRequest('get', ws.wscreatecompra)
        .then((result) => {
            if (result.response == 1) {
                let configscliente = result.configscliente;

                this.setState({
                    configCodigo: configscliente.codigospropios,
                    isabogado: configscliente.clienteesabogado,

                    almacenes: result.almacenes,
                    idsucursal: result.sucursales[0].idsucursal,
                    sucursales: result.sucursales,
                    monedas: result.monedas,
                    idmoneda: result.monedas[0].idmoneda
                },
                    () => this.actualizarAlmacenesSucursal(result.sucursales[0].idsucursal)
                )
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    preparaDatos() {
        for (let i = 0; i < 3; i++) {
            this.state.productos.push(0);
            this.state.cantidades.push('');
            this.state.costosUnitarios.push('');
            this.state.costosTotales.push('');
            this.state.valuesSearchProd.push({
                id: undefined,
                descripcion: undefined
            });
        }
        this.setState({
            productos: this.state.productos,
            cantidades: this.state.cantidades,
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            valuesSearchProd: this.state.valuesSearchProd
        });
    }

    callbackProveedor(proveedor, bandera) {
        if (bandera == 1) {
            this.setState({
                mostrarCreateProv: false,
                //idproveedor: proveedor.idproveedor,
                valSearchNom: proveedor.nombre + ' ' + proveedor.apellido,
                valSearchCod: proveedor.idproveedor,
                nit: proveedor.nit
            });
        } else {
            this.setState({
                mostrarCreateProv: false
            })
        }
    }

    generarPlanPago() {
        if (this.state.fechaInicioDePago == '') {
            this.setState({
                alertModal: true,
                messageAlert: 'Debe seleccionar una fecha de inicio'
            });
            return;
        }

        this.state.listaCuotas = [];

        for (let i = 0 ; i < this.state.numeroCuota; i++){
            var fecha = stringToDate(this.state.fechaInicioDePago);
            //var arrayfecha = this.state.fechaInicioDePago.split('-');
            //var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0]);
            //var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]));
            fecha.setDate(fecha.getDate()+(parseInt(this.state.periodo) * i));
      
            var fechaAmostrar = dateToString(fecha);
            let saldo = this.state.saldo;
            var montoPagarPlan;
            if (i + 1 == this.state.numeroCuota) {
                montoPagarPlan = Math.round((saldo-((Math.round((saldo/this.state.numeroCuota)*100)/100)*(i)))*100)/100;
                var saldoPagarPlan = 0;
            } else {
                montoPagarPlan = Math.round((this.state.saldo/this.state.numeroCuota)*100)/100;
                var saldoredondeado = (Math.round((saldo/this.state.numeroCuota)*100)/100)*(i+1);
                var saldoPagarPlan = Math.round((saldo-saldoredondeado)*100)/100;
            }
            
            let cuotas = {
                Nro: i+1,
                descripcion: "Cuota Nro."+" "+(i+1),
                FechaApagar: fechaAmostrar,
                montoPagar: montoPagarPlan,
                saldo: saldoPagarPlan
            }
            this.state.listaCuotas.push(cuotas)

        }

        this.setState({
            listaCuotas: this.state.listaCuotas
        })
    }

    cabeceraPlan() {

        if(this.state.listaCuotas.length > 0){
            return (
                <div >
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera ">
                        <label 
                            className="label-group-content-nwe label-plan-pago">
                            Nro Cuotas
                        </label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label 
                            className="label-group-content-nwe label-plan-pago ">
                            Descripcion
                        </label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label 
                            className="label-group-content-nwe label-plan-pago">
                            Fecha a Pagar
                            </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label 
                            className="label-group-content-nwe label-plan-pago">
                            Monto a Pagar
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label 
                            className="label-group-content-nwe label-plan-pago">
                            Saldo
                        </label>
                    </div>
                </div>
            )
        }
    }

    PlandePago(){

        if(this.state.listaCuotas.length > 0 ){
            return (
                this.state.listaCuotas.map((item, key)=>(
                    <div key={key}>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{item.Nro}</label>
                        </div>
                        <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{item.descripcion}</label>
                        </div>
                        <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <input 
                                className='form-control-content reinicio-padding' 
                                id={key} type='date' 
                                value={item.FechaApagar} 
                                onChange={this.onChangeFechaPlan.bind(this)}
                            />
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <input 
                                className='form-control-content reinicio-padding' 
                                id={key} 
                                type='text' 
                                value={item.montoPagar} 
                                onChange={this.onChangeMonto.bind(this, key)}
                            />
                        </div>
                        <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{item.saldo}</label>
                        </div>
                    </div>
                ))
            )
        }else{
            return null
        }
    }

    componentAlertFechaI() {
        if (this.state.alertModal) {
            return (
                <div className="text-center-content col-lg-12-content">
                    <Alert 
                        message={this.state.messageAlert}
                        type="error" 
                    />
                </div>
            )
        }
        return null;
    }

    closePlanPago() {
        this.setState({ 
            visiblePlanPago: false,
             anticipo: 0,
             saldo: this.state.costoTotal,
             numeroCuota: 1,
             fechaInicioDePago: dateToString(now),
             periodo: '1',
             listaCuotas: []
        });
    }

    componentPlanPago() {
        const componentAlertFechaI = this.componentAlertFechaI();
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 col-sm-12 cols-xs-12">
                    <C_Input
                        value={this.state.costoTotal}
                        readOnly={true}
                        title="Monto a Pagar"
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                    />
                    <C_Input
                        title="Anticipo"
                        value={this.state.anticipo}
                        onChange={this.onChangeAnticipo}
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                    />
                    <C_Input
                        title="Saldo a Pagar"
                        value={this.state.saldo}
                        readOnly={true}
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                    />
                    <C_Input
                        title="Numero de Cuotas"
                        value={this.state.numeroCuota} 
                        onChange={this.onChangeNumeroCuota}
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                    />
                    <C_DatePicker
                        value={this.state.fechaInicioDePago}
                        onChange={this.onChangeFechaIni}
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                    />
                    <C_Select
                        onChange={this.onChangePeriodo}
                        value={this.state.periodo}
                        className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                        component={[
                            <Option key={0} value='1'>Diario</Option>,
                            <Option key={1} value='7'>Semanal</Option>,
                            <Option key={2} value='30'>Mensual</Option>
                        ]}
                    />
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            <C_Button
                                title='Generar Plan de Pago'
                                type='primary'
                                onClick={this.generarPlanPago.bind(this)}
                            />
                        </div>
                    </div>
                    { componentAlertFechaI }

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
                                    <th>Descripcion</th>
                                    <th>FechaApagar</th>
                                    <th>Monto a Pagar</th>
                                    <th>Saldo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.listaCuotas.map((item, key) => {
                                    let total = parseFloat(item.preciounit) - parseFloat(item.factor_desc_incre);
                                    return (
                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>
                                                <Input
                                                    value={item.descripcion}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <CDatePicker
                                                    //showTime={true}
                                                    format='YYYY-MM-DD'
                                                    placeholder="Select Time"
                                                    value={item.FechaApagar}
                                                    //defaultValue={this.state.fecha}
                                                    onChange={this.onChangeFechaPlan.bind(this, key)}
                                                    //title="Fecha"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    value={item.montoPagar}
                                                    onChange={this.onChangeMonto.bind(this, key)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    value={item.saldo}
                                                    readOnly={true}
                                                />
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            <C_Button
                                title='Grabar'
                                type='primary'
                                onClick={this.showConfirmStore}
                            />
                            <C_Button
                                title='Cancelar'
                                type='danger'
                                onClick={this.closePlanPago}
                            />
                            
                        </div>
                    </div>
                </div>
        
            </div>
        )
    }

    componentButtomProveedor() {
        if (this.state.valSearchCod == undefined) {
            return (
                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom">
                    <C_Button onClick={this.onClickProveedor}
                        type='primary' size='small'
                        title={<i className="fa fa-plus"></i>} style={{padding: 4}}
                    />
                </div>
            )
        } else {
            return (
                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom">
                    <C_Button onClick={this.onClickProveedor}
                        type='danger' size='small'
                        title={<i className="fa fa-eye"></i>} style={{padding: 4}}
                    />
                </div>
            )
        }
    }

    handleCerrarModalShow() {
        this.setState({
            visibleShow: false,
            posicionProveedor: -1,
            proveedorSeleccionado: [],
            proveedorContacto: []
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }
    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: 'Cancelar Compra',
            content: 'Los cambios realizados no se guardaran, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              redirect();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    listaSucursales() {
        let data = this.state.sucursales;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idsucursal}>{data[i].nombre}</Option>
            );
        }
        return arr;
    }

    listaAlmacenes() {
        let data = this.state.almacenes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    listaMonedas() {
        let data = this.state.monedas;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idmoneda}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    compResultProvCod() {
        let data = this.state.resultProveedores;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let codproveedor = this.state.configCodigo ? data[i].codproveedor : data[i].idproveedor;
            arr.push(
                <Option 
                    key={i} value={data[i].idproveedor}>
                    {codproveedor}
                </Option>
            );
        }
        return arr;
    }

    compResultProvNomb() {
        let data = this.state.resultProveedores;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option 
                    key={i} value={data[i].idproveedor}>
                    {data[i].nombre + ' ' + apellido}
                </Option>
            );
        }
        return arr;
    }

    resultProdsId() {
        let data = this.state.resultProductos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let codigo = (this.state.configCodigo && data[i].codproducto != null) ? data[i].codproducto : data[i].idproducto;
            arr.push(
                <Option 
                    key={i} value={data[i].idproducto}>
                    {codigo}
                </Option>
            );
        }
        return arr;
    }

    resultProdsDesc() {
        let data = this.state.resultProductos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} value={data[i].idproducto}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }


     render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/compra"/>
            )
        }

        const componentPlanPago = this.componentPlanPago();
        const componentButtomProveedor = this.componentButtomProveedor();
        const listaSucursales = this.listaSucursales();
        const listaAlmacenes = this.listaAlmacenes();
        const listaMonedas = this.listaMonedas();
        const compResultProvCod = this.compResultProvCod();
        const compResultProvNomb = this.compResultProvNomb();
        const resultProdsId = this.resultProdsId();
        const resultProdsDesc = this.resultProdsDesc();
        return (
            <div>
                <div className="rows" style={{'display': (this.state.mostrarCreateProv)?'none':'block'}}>

                    <Modal
                        title="Plan De Pago"
                        visible={this.state.visiblePlanPago}
                        onCancel={this.closeModalPlanPago.bind(this)}
                        footer={null}
                        width={950}
                    >
                        { componentPlanPago }
                    </Modal>

                    <Modal
                        title='Datos de Proveedor'
                        visible={this.state.visibleShow}
                        onOk={this.handleCerrarModalShow.bind(this)}
                        onCancel={this.handleCerrarModalShow.bind(this)}
                        footer={null}
                        width={850}
                        style={{'top': '40px'}}
                    >
                        <ShowProveedor
                            callback={this.handleCerrarModalShow.bind(this)}
                            proveedor={this.state.proveedorSeleccionado}
                            contacto={this.state.proveedorContacto}
                            bandera={1}
                        />
                    </Modal>

                    <div className="cards">
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title">Registrar Compra</h1>
                            </div>
                        </div>


                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    title="Codigo"
                                    value={this.state.codcompra}
                                    onChange={this.onChangeCodCompra}
                                    validar={this.state.validarCodigo}
                                    permisions = {this.permisions.codigo}
                                    configAllowed={this.state.configCodigo}
                                    mensaje='El codigo ya existe'
                                />

                                <C_Select
                                    value={(this.state.idsucursal == 0)?undefined:this.state.idsucursal}
                                    title={"Sucursal"}
                                    onChange={this.confirmChangeSucursal}
                                    component={listaSucursales}
                                    permisions = {this.permisions.sucursal}
                                    
                                />
                                <C_Select
                                    value={(this.state.idalmacen == 0)?undefined:this.state.idalmacen}
                                    title={"Almacen"}
                                    onChange={this.confirmChangeAlmacen}
                                    component={listaAlmacenes}
                                    permisions = {this.permisions.almacen}
                                    
                                />
                                <C_Select
                                    value={(this.state.idmoneda == 0)?undefined:this.state.idmoneda}
                                    title={"Moneda"}
                                    onChange={this.onChangeMoneda}
                                    component={listaMonedas}
                                    permisions = {this.permisions.moneda}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    { componentButtomProveedor }
                                        
                                    <C_Select
                                        showSearch={true}
                                        value={this.state.valSearchCod}
                                        placeholder={"Buscar proveedor por Id o Codigo"}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.onSearchProvCod}
                                        onChange={this.onChangeSearchProvCod}
                                        notFoundContent={null}
                                        component={compResultProvCod}
                                        onDelete={this.onDeleteSearchVend}
                                        allowDelete={true}
                                        title="Cod/Id"
                                        permisions = {this.permisions.codigo_proveedor}
                                        className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12 pt-bottom"
                                    />
                                </div>

                                <C_Select
                                    showSearch={true}
                                    value={this.state.valSearchNom}
                                    placeholder={"Buscar proveedor"}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchProvNom}
                                    onChange={this.onChangeSearchProvNom}
                                    notFoundContent={null}
                                    component={compResultProvNomb}
                                    onDelete={this.onDeleteSearchVend}
                                    allowDelete={true}
                                    title="Nombre"
                                    permisions = {this.permisions.nombre_proveedor}
                                />

                                <C_Input
                                    title="Nit"
                                    value={this.state.nit}
                                    //onChange={this.onChangeNit}
                                    readOnly={true}
                                    permisions = {this.permisions.nit_proveedor}
                                />

                                <C_Select
                                    value={this.state.planpago}
                                    title={"Plan Pago"}
                                    onChange={this.onChangePlanPago}
                                    component={[
                                        <Option key={0} value="C">Contado</Option>,
                                        <Option key={1} value="R">Credito</Option>
                                    ]}
                                    permisions = {this.permisions.plan_pago}
                                    
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>
                                
                                <C_DatePicker
                                    //showTime={true}
                                    format='YYYY-MM-DD'
                                    placeholder="Select Time"
                                    value={this.state.fecha}
                                    defaultValue={this.state.fecha}
                                    onChange={this.onChangeFecha}
                                    title="Fecha"
                                    permisions = {this.permisions.fecha}
                                />

                                <C_DatePicker
                                    showTime={true}
                                    mode='time'
                                    format='HH:mm:ss'
                                    placeholder="Select Time"
                                    value={this.state.hora}
                                    //defaultValue={this.state.hora}
                                    onChange={this.onChangeHora}
                                    title="Hora"
                                    permisions = {this.permisions.hora}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'border': '1px solid #e8e8e8'}}>
                                <div className="inputs-groups">
                                    <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                        style={{ width: '14%', textAlign: 'center' }}>
                                        <label className="label-group-content-nwe"> CodProd </label>
                                    </div>
                                    <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"
                                        style={{ textAlign: 'center' }}>
                                    <label className="label-group-content-nwe "> Producto </label>
                                    </div>
                                    { !this.state.isabogado ?
                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12" 
                                            style={{ textAlign: 'center' }}>
                                            <label className="label-group-content-nwe "> Unid. Med. </label>
                                        </div>
                                        :
                                        null
                                    }

                                    <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                        style={{ textAlign: 'center' }}>
                                        <label className="label-group-content-nwe "> Cantidad </label>
                                    </div>
                                    <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                        style={{ textAlign: 'center' }}>
                                        <label className="label-group-content-nwe "> Costo Unit </label>
                                    </div>
                                    <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                        style={{ textAlign: 'center' }}>
                                        <label className="label-group-content-nwe "> Costo Total </label>
                                    </div>
                                    <div style={{'position': 'absolute', 
                                            'top': '0', 'right': '0'
                                        }}>
                                        <C_Button
                                            title={<i className="fa fa-plus"></i>}
                                            type='primary' size='small' style={{'padding': '3px'}}
                                            onClick={this.addRowProducto}
                                        />
                                            
                                    </div>

                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                                style={{'borderBottom': '1px solid #e8e8e8', 
                                    'borderLeft': '1px solid #e8e8e8',
                                    'borderRight': '1px solid #e8e8e8'}}>
                                <div className="inputs-groups">
                                    {
                                        this.state.productos.map((item, key) => (
                                            <div key={key} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'position': 'relative'}}>
                                                <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                                    style={{ width: '14%' }}>
                                                    <CSelect
                                                        key={key}
                                                        showSearch={true}
                                                        value={this.state.valuesSearchProd[key].id}
                                                        style={{ width: '100%' }}
                                                        placeholder="Codigo"
                                                        defaultActiveFirstOption={false}
                                                        showArrow={false}
                                                        filterOption={false}
                                                        onSearch={this.onSearchProdCod}
                                                        onChange={this.onChangeSearchProdId.bind(this, key)}
                                                        notFoundContent={null}
                                                        component={resultProdsId}
                                                        allowDelete={true}
                                                        onDelete={this.onDeleteSearchProd.bind(this, key)}
                                                        //permisions={this.permisions.t_prod_cod}
                                                    />
                                                </div>

                                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                                    <CSelect
                                                        key={key}
                                                        showSearch={true}
                                                        value={this.state.valuesSearchProd[key].descripcion}
                                                        style={{ width: '100%' }}
                                                        placeholder="Descripcion"
                                                        defaultActiveFirstOption={false}
                                                        showArrow={false}
                                                        filterOption={false}
                                                        onSearch={this.onSearchProdNom}
                                                        onChange={this.onChangeSearchProdNom.bind(this, key)}
                                                        notFoundContent={null}
                                                        component={resultProdsDesc}
                                                        //title="Codigo Cliente"
                                                        allowDelete={true}
                                                        onDelete={this.onDeleteSearchProd.bind(this, key)}
                                                        //permisions={this.permisions.t_prod_cod}
                                                    />
                                                </div>
                                                { !this.state.isabogado ? 
                                                    <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12">
                                                        <Input
                                                            value={this.state.unidadMedidas[key]}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                  :
                                                    null
                                                }
                                                

                                                <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12">
                                                    <Input
                                                        value={this.state.cantidades[key]}
                                                        onChange = {this.onChangeCantidades.bind(this, key)}
                                                    />
                                                </div>

                                                <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12">
                                                    <Input
                                                        value={this.state.costosUnitarios[key]}
                                                        onChange = {this.onChangeCostoU.bind(this, key)}
                                                    />
                                                </div>
                                                
                                                <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12">
                                                    <Input
                                                        value={this.state.costosTotales[key]}
                                                        onChange = {this.onChangeCostoU.bind(this, key)}
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div style={{'position': 'absolute', 
                                                        'top': '4px', 'right': '0'
                                                    }}>

                                                    <C_Button
                                                        title={<i className="fa fa-remove"></i>}
                                                        type='danger' size='small' style={{'padding': '3px'}}
                                                        onClick={() => this.removeProductSelected(key)}
                                                    />
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12">
                                    <TextArea
                                        title="Notas"
                                        value={this.state.notas}
                                        onChange={this.onChangeNotas}
                                        permisions = {this.permisions.notas}
                                    />
                                </div>
                                <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <Input
                                        title="Total"
                                        value={this.state.costoTotal}
                                        readOnly={true}
                                        permisions = {this.permisions.total}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button
                                        title='Aceptar'
                                        type='primary'
                                        onClick={this.guardarCompra}
                                    />
                                    <C_Button
                                        title='Cancelar'
                                        type='danger'
                                        onClick={this.showConfirmCancel.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    className="forms-groups"
                    style={{'display': (this.state.mostrarCreateProv)?'block':'none'}}
                >
                </div>
            </div>
        )
    }
}