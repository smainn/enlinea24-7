import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect, BrowserRouter as  Link } from 'react-router-dom';
import { Modal, message, DatePicker, Select, Divider, Alert, Icon } from 'antd';
import { wscompra, wssucursal, wsalmacen, wsunidadmedida,
        wssearchproveedorcod, wssearchproveedornom,
        wssearchproductoid, wssearchproductodesc, wsmoneda,
        wsgetalmacenprod, wsshowproveedor } from '../../../WS/webservices';
import { dateToString, hourToString } from '../../../tools/toolsDate';

import CrearProveedor from '../GestionarProveedor/CrearProveedor';
import ShowProveedor from '../GestionarProveedor/ShowProveedor';

const { Option } = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

let now = new Date();
export default class CreateCompra extends Component {
    constructor(){
        super();
        this.state = {
            codcompra: '',
            fecha: dateToString(now),
            hora: hourToString(now),
            idsucursal: 0,
            idalmacen: 0,
            notas: '',
            costoTotal: 0,
            idmoneda: 0,
            planpago: 'C',
            anticipo: 0,
            saldo: 0,
            valSearchCod: undefined,
            valSearchNom: undefined,
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
            sucursales: [],
            almacenesSucursal: [],
            almacenes: [],
            monedas: [],
            resultProductos: [],
            listaCuotas: [],
            cantidadCuotas: 0,

            fechaInicioDePago: dateToString(now),
            periodo: '1',
            numeroCuota: 1,

            visibleShow: false,
            posicionProveedor: -1,
            proveedorSeleccionado: [],
            proveedorContacto: [],

            mostrarCreateProv: false,
            alertfechai: false,
            visiblePlanPago: false,
            redirect: false,
            
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
        this.onChangeCantidades = this.onChangeCantidades.bind(this);
        this.onChangeCostoT = this.onChangeCostoT.bind(this);
        this.onChangeCostoU = this.onChangeCostoU.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onChangePeriodo = this.onChangePeriodo.bind(this);
        this.onChangeAnticipo = this.onChangeAnticipo.bind(this);
        this.onChangeNumeroCuota = this.onChangeNumeroCuota.bind(this);
        this.onChangeFechaPlan = this.onChangeFechaPlan.bind(this);
        this.onChangeMonto = this.onChangeMonto.bind(this);
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
        this.storeCompra = this.storeCompra.bind(this);
        //this.onChangeSearchProdId = this.onChangeSearchProdId.bind(this);
        //this.onChangeSearchProdNom = this.onChangeSearchProdNom.bind(this);
    }

    onChangeCodCompra(e) {
        this.setState({ codcompra: e.target.value });
    }

    onChangeSucursal(e) {
        this.actualizarAlmacenesSucursal(e.target.value);
        this.setState({ idsucursal: e.target.value });
    }

    onChangeAlmacen(e) {
        this.setState({ idalmacen: e.target.value });
    }

    onChangeNit(e) {
        /*
        this.setState({
            nit: e.target.value
        });*/
    }

    onChangeMoneda(e) {
        this.setState({ idmoneda: e.target.value });
    }

    calcularCostoTotal() {
        let cantidades = this.state.cantidades;
        for (let i = 0; i < cantidades.length; i++) {
            this.state.costosTotales[i] = cantidades[i] * parseFloat(this.state.costosUnitarios[i]);
        }
        let array = this.state.costosTotales;
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                total = total + array[i];
            }
        }
        this.setState({ 
            costoTotal: total,
            costosTotales: this.state.costosTotales
        });
    }

    onChangeFecha(date, dateString) {
        this.setState({ fecha: dateString });
    }

    onChangeHora(date, hourString) {
        this.setState({ hora: hourString });
    }

    onChangeCantidades(e) {
        let index = e.target.id;
        let cantidad = parseFloat(e.target.value);
        if (this.state.valuesSearchProd[index].id == "Id") {
            message.warning('Debe elegir un producto primero');
            return;
        }
        let costo = this.state.costosUnitarios[index];
        if (costo < 0 || costo == '' || isNaN(costo)) {
            message.warning('Costo por defecto 0');
        }
        if (cantidad < 0) {
            message.error('No se permite menor a 0');
            return;
        }
        this.state.costosUnitarios[index] = costo;
        this.state.costosTotales[index] = cantidad * costo;
        
        this.state.cantidades[index] = parseInt(cantidad);
        this.setState({ 
            cantidades: this.state.cantidades ,
            costosTotales: this.state.costosTotales,
            costosUnitarios: this.state.costosUnitarios
        },
            () => this.calcularCostoTotal()
        );
    }

    onChangeCostoU(e) {
        let index = e.target.id;
        if (this.state.valuesSearchProd[index].id == "Id") {
            message.warning('Debe elegir un producto primero');
            return;
        }
        let costo = parseFloat(e.target.value);
        if (costo < 0 || isNaN(costo)) {
            message.warning('Costo por defecto 0');
            return;
        }
        
        let cantidad = this.state.cantidades[index];
        if (cantidad == 0 || cantidad == '' || isNaN(cantidad)) {
            message.error('Cantidad por defecto');
        }
        this.state.cantidades[index] = cantidad;
        this.state.costosTotales[index] = costo * cantidad;

        this.state.costosUnitarios[e.target.id] = parseInt(e.target.value);
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

    onChangeNotas(e) {
        this.setState({ notas: e.target.value });
    }

    onChangePeriodo(e) {
        this.setState({ periodo: e.target.value });
    }

    onChangeNumeroCuota(e) {
        this.setState({ numeroCuota: e.target.value });
    }
    onChangeAnticipo(e) {
        if (e.target.value < 0) {
            message.error('El anticipo no puede ser negativo');
            return;
        }
        let total = this.state.costoTotal - e.target.value;
        this.setState({ 
            anticipo: e.target.value,
            saldo: total
        });
    }

    onChangeFechaIni(e) {
        this.setState({ 
            fechaInicioDePago: e.target.value,
            alertfechai: false
        });
    }

    onChangePlanPago(e) {
        this.setState({ planpago: e.target.value });
    }

    onChangeFechaPlan(e) {
        console.log(e.target.value);
        var fecha = e.target.value;
        var index = e.target.id;
        console.log(e.target.id);
        console.log(this.state.listaCuotas);
        var datos = this.state.listaCuotas[index];
        console.log(datos);
        var fechaModi = fecha.split('-');
        //var fechaFormato = String(fechaModi[2]+"/"+fechaModi[1]+"/"+fechaModi[0])
        var fechaActual = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]));
        var fechaVenta = this.state.fecha.split('-');
        //var fechaVentaFormato = String(fechaVenta[2]+"/"+fechaVenta[1]+"/"+fechaVenta[0])
        var fechaVentaComparar =  new Date(parseInt(fechaVenta[0]),parseInt(fechaVenta[1])-1,parseInt(fechaVenta[2]));
        console.log(fechaActual);
        console.log(fechaVentaComparar)
        if(fechaActual.getTime() >= fechaVentaComparar.getTime()){
            console.log("es mayor la fecha")
            this.state.listaCuotas[index].FechaApagar = fecha
            this.setState({
                listaCuotas: this.state.listaCuotas
            })
            console.log(this.state.listaCuotas)
        }else{
            console.log("no es mayor")
        }
        // fechaActual.setDate(fechaActual.getDate()+(parseInt(this.state.tipoPeriodo) * i))
    }

    onChangeMonto(e) {
        console.log(e.target.value)
        var monto = e.target.value
        var index = parseInt(e.target.id)
        var saldoAnterior = this.state.listaCuotas[index-1].saldo
        this.state.listaCuotas[index].montoPagar = monto
        this.state.listaCuotas[index].saldo = saldoAnterior - monto
        console.log("index ",index)
        console.log("longitud",this.state.listaCuotas.length )
        for (let i = index+1; i < this.state.listaCuotas.length ; i++){
            this.state.listaCuotas[i].saldo = parseFloat(this.state.listaCuotas[i-1].saldo) - parseFloat(this.state.listaCuotas[i].montoPagar)
            console.log("123",this.state.listaCuotas[i].saldo)
        }
        this.setState({
            listaCuotas: this.state.listaCuotas
        })
        console.log(this.state.listaCuotas)
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
        });
    }
    /**by henry */
    abrirModalShow(id) {
        
        var body = {'idProveedor': id};
        axios.post(wsshowproveedor, body)
        .then((resp) => {
            this.setState({
                proveedorSeleccionado: resp.data.proveedor,
                proveedorContacto: resp.data.contacto,
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

    searchProveedorByCodId(value) {
        if (value.length > 0) {
            axios.get(wssearchproveedorcod + '/' + value)
            .then((resp) => {
                let result = resp.data;
                console.log('RESULT SEARCH COD ', result.data);
                if (result.response > 0) {
                    this.setState({
                        resultProveedores: result.data
                    });
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
            axios.get(wssearchproveedornom + '/' + value)
            .then((resp) => {
                let result = resp.data;
                if (result.response > 0) {
                    console.log('RESULT SEARCH NOM ', result.data);
                    this.setState({
                        resultProveedores: result.data
                    });
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
        this.state.timeoutSearchCod = setTimeout(this.searchProveedorByCodId(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    onSearchProvNom(value) {

        if (this.state.timeoutSearchNom) {
            clearTimeout(this.state.timeoutSearchNom);
            this.setState({ timeoutSearchNom: null});
        }
        this.state.timeoutSearchNom = setTimeout(this.searchProveedorByNombre(value), 300);
        this.setState({ timeoutSearchNom: this.state.timeoutSearchNom});
    }

    onChangeSearchProvCod(value) {

        let array = this.state.resultProveedores;
        console.log('VALUE ', value);
        console.log('ARRAY ', array);
        let nameFull ='No tiene';
        let nit = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproveedor == value) {
                nameFull = array[i].nombre + ' ' + array[i].apellido;
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
        this.state.valuesSearchProd.push({
                id: 'Id',
                descripcion: 'Descripcion' 
            });
        this.setState({
            productos: this.state.productos,
            cantidades: this.state.cantidades,
            costosUnitarios: this.state.costosUnitarios,
            costosTotales: this.state.costosTotales,
            valuesSearchProd: [
                ...this.state.valuesSearchProd,{
                    id: 'Id',
                    descripcion: 'Descripcion' 
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
            valuesSearchProd: this.state.valuesSearchProd
        });
    }

    /** -------BEGIN-------- */

    searchProductoByCodId(value) {
        if (value.length > 0) {
            axios.get(wssearchproductoid + '/' + value)
            .then((resp) => {
                let result = resp.data;
                console.log('RESULT SEARCH ID ', result.data);
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
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

    searchProductoByDesc(value) {
        if (value.length > 0) {
            axios.get(wssearchproductodesc + '/' + value)
            .then((resp) => {
                let result = resp.data;
                //console.log('RESUL ',result);
                if (result.response > 0) {
                    console.log('RESULT SEARCH DESC ', result.data);
                    this.setState({
                        resultProductos: result.data
                    });
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

    onSearchProdCod(value) {
        if (this.state.timeoutSearchProd1) {
            clearTimeout(this.state.timeoutSearchProd1);
            this.setState({ timeoutSearchProd1: null});
        }
        this.state.timeoutSearchProd1 = setTimeout(this.searchProductoByCodId(value), 300);
        this.setState({ timeoutSearchProd1: this.state.timeoutSearchProd1});
    }

    onSearchProdNom(value) {

        if (this.state.timeoutSearchProd2) {
            clearTimeout(this.state.timeoutSearchProd2);
            this.setState({ timeoutSearchProd2: null});
        }
        this.state.timeoutSearchProd2 = setTimeout(this.searchProductoByDesc(value), 300);
        this.setState({ timeoutSearchProd2: this.state.timeoutSearchProd2});
    }

    getAlmacenesProd(idproducto) {
        axios.get(wsgetalmacenprod + '/' + idproducto)
        .then((resp) => {
            let result = resp.data;
            console.log('resp ALMACNPRO ', result);
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
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema');
        })
    }

    onChangeSearchProdId(index, value) {
        console.log('INDEX ', index);
        console.log('VALUE ', value);
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
        var descripcion = 'No hay';
        let unidadmedida = 'Ninguno';
        let costo = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                unidadmedida = array[i].unidadmedida.descripcion;
                costo = array[i].costo;
                break;
            }
        }
        this.getAlmacenesProd(value);
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
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
                unidadmedida = array[i].unidadmedida.descripcion;
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
            if (array[i].id != 'Id') {
                idsProductos.push(this.state.valuesSearchProd[i].id);
                cantidades.push(this.state.cantidades[i]);
                costos.push(this.state.costosUnitarios[i]);
                costosTotales.push(this.state.costosTotales[i]);
            }
            
        }
    }
    getMessageNewProd() {
        
        let array = this.state.productoAlmacenes;
        let arrayNew = [];
        for (let i = 0; i < array.length; i++) {
            let almacenes = array[i].almacenes;
            for (let j = 0; j < almacenes.length; j++) {
                if (almacenes[i] != this.state.idalmacen) {
                    arrayNew.push(array[i].idproducto);
                }
            }
        }
        let message = 'Los productos ';
        let productos = this.state.valuesSearchProd;
        console.log('LOS PRODUCTOS ', productos);
        for (let i = 0; i < arrayNew.length; i++) {
            for (let j = 0; j < productos.length; j++) {
                if (arrayNew[i] == productos[j].id) {
                    console.log('PRODSSS ',productos);
                    message = message + productos[j].descripcion + ', ';
                    break;
                }
            }
        }
        return message + 'seran registrados en el almacen seleccionado, ¿desea continuar?';
    }

    validarParametros() {
        let codcompra = this.state.codcompra.trim();
        if (codcompra.length === 0) {
            message.error('Codigo no valido');
            return false;
        }
        if (this.state.valSearchCod == undefined) {
            message.error('La compra debe tener un proveedor');
            return false;
        }
        let array = this.state.valuesSearchProd
        if (array.length === 0) {
            message.error('Debe haber por lo menos 1 producto en la compra');
            return false;
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i].id != 'Id') {
                return true;
            }
        }
        message.error('Debe haber por lo menos 1 producto en la compra');
        return false;
    }

    guardarCompra() {
        if (!this.validarParametros()) return;
        console.log('longitud ', this.state.valuesSearchProd);
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
        
        let message = this.getMessageNewProd();
        let storeCompra = this.storeCompra;
        Modal.confirm({
          title: 'Guardar Compra',
          content: message,
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
            idalmacen: this.state.idalmacen,
            montos: JSON.stringify(montos),
            fechas: JSON.stringify(fechas),
            descripciones: JSON.stringify(descripciones)
        };
        console.log('BODY ', body);
        axios.post(wscompra, body)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP STORE ', result);
            if (result.response > 0) {
                message.success('Se guardo correctamente');
                this.setState({ redirect: true });
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
        this.getAlmacenes();
        this.getSucursales();
        this.preparaDatos();
        this.getMonedas();
    }

    preparaDatos() {
        for (let i = 0; i < 3; i++) {
            this.state.productos.push(0);
            this.state.cantidades.push('');
            this.state.costosUnitarios.push('');
            this.state.costosTotales.push('');
            this.state.valuesSearchProd.push({
                id: 'Id',
                descripcion: 'Descripcion' 
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

    getSucursales() {
        axios.get(wssucursal)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                this.actualizarAlmacenesSucursal(result.data[0].idsucursal);
                this.setState({
                    idsucursal: result.data[0].idsucursal,
                    sucursales: result.data
                });
            } else {
                message.error('Ocurrio un problema al obtener los datos');
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getAlmacenes() {
        axios.get(wsalmacen)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                this.setState({
                    almacenes: result.data
                });
            } else {
                message.error('Ocurrio un problema al obtener los datos');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, porfavor vuelva a recargar la pagina');
        })
    }

    getMonedas() {
        axios.get(wsmoneda)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                this.setState({
                    idmoneda: result.data[0].idmoneda,
                    monedas: result.data
                });              
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Hubo un problema al intentar conectarse con el servidor, intentelo nuevamente');
        })
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

    generarPlanPago(){
        if (this.state.fechaInicioDePago == '') {
            this.setState({
                alertfechai: true
            });
            return;
        }
        this.state.listaCuotas = [];
        for (let i = 0 ; i < this.state.numeroCuota ; i++){
            console.log(this.state.fechaInicioDePago);
            var arrayfecha = this.state.fechaInicioDePago.split('-');
            var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0]);
            console.log("fecha da te",fechaFormato);
            var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]));
            console.log("fe ant ",fecha);
            fecha.setDate(fecha.getDate()+(parseInt(this.state.periodo) * i));
            console.log('fecha a pagar inicio ',fecha);
            console.log('mes   ',fecha.getMonth() );
            var mes = fecha.getMonth()+1 > 9 ? "" : "0";
            var dia = fecha.getDate() > 9 ? "" : "0";
            var fechaAmostrar = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate();

            console.log("mostrador fecha ",fechaAmostrar);
            console.log('tamaño de lista',this.state.numeroCuota.length);
            console.log('index',i+1);
            if (i + 1 == this.state.numeroCuota) {
                var saldo = this.state.saldo;
                var montoPagarPlan = Math.round((saldo-((Math.round((saldo/this.state.numeroCuota)*100)/100)*(i)))*100)/100;
                var saldoPagarPlan = 0;
                console.log('saldo ',saldo);
                console.log('pagar monto',(Math.round((saldo/this.state.numeroCuota)*100)/100)*(i));
            } else {
                var montoPagarPlan = Math.round((this.state.saldo/this.state.numeroCuota)*100)/100;
                var saldo = this.state.saldo;
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
            listaCuotas:this.state.listaCuotas
        })
        console.log(this.state.listaCuotas)
    }

    cabeceraPlan(){
        if(this.state.listaCuotas.length > 0){
            return (
                <div >
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera ">
                        <label className="label-group-content-nwe label-plan-pago">Nro Cuotas</label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago ">Descripcion</label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago">Fecha a Pagar</label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago">Monto a Pagar</label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago">Saldo</label>
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
                                onChange={this.onChangeMonto.bind(this)}
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
        if (this.state.alertfechai) {
            return (
                <div className="text-center-content col-lg-12-content">
                    <Alert 
                        message="Debe seleccionar una fecha de inicio" 
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
                <div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe">Total Monto a Pagar</label>
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <input  
                                className='form-control-content reinicio-padding' 
                                type='text' 
                                value={this.state.costoTotal} 
                            />
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe " >Anticipo</label>
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <input 
                                className='form-control-content reinicio-padding'  
                                type='text' 
                                value={this.state.anticipo} 
                                onChange={this.onChangeAnticipo}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe " >Saldo a Pagar</label>
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content ">
                        <div className="borderTable ">
                            <input  
                                className='form-control-content reinicio-padding' 
                                type='number'
                                value={this.state.saldo}
                                //onChange={this.onChangeSaldo}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe">Numero de Cuotas</label>
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <input  
                                className='form-control-content reinicio-padding' 
                                type='text' 
                                value={this.state.numeroCuota} 
                                onChange={this.onChangeNumeroCuota}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe " >Fecha Inicio Pago</label>
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <input 
                                className='form-control-content reinicio-padding'  
                                type='date' 
                                value={this.state.fechaInicioDePago} 
                                onChange={this.onChangeFechaIni}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                        <div className="borderTable ">
                            <label className="label-group-content-nwe ">Tipo Periodo</label>
                        </div>
                    </div>

                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                        <div className="borderTable ">
                            <select  
                                className='form-control-content reinicio-padding' 
                                onChange={this.onChangePeriodo}
                                value={this.state.periodo}
                            >
                                <option value='1'>Diario</option>
                                <option value='7'>Semanal</option>
                                <option value='30'>Mensual</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-center-content">
                        <div className="col-lg-12-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <button 
                                type="button" 
                                className="btn-content btn-success-content" 
                                onClick={this.generarPlanPago.bind(this)}
                            >
                                Generar Plan Pago
                            </button>
                        </div>
                    </div>
                    { componentAlertFechaI }
                    { this.cabeceraPlan() }

                    <div className='caja-content'>
                        { this.PlandePago() }
                    </div>
                    <div className="form-group-content text-center-content col-lg-12-content">
                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <button 
                                type="button" 
                                className="btn-content btn-sm-content btn-success-content" 
                                onClick={this.showConfirmStore}>
                                Grabar
                            </button>
                        </div>
                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <button 
                                type="button" 
                                className="btn-content btn-sm-content btn-danger-content"
                                onClick={this.closePlanPago}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
        )
    }

    componentButtomProveedor() {
        if (this.state.valSearchCod == null) {
            return (
                <div className="col-lg-3-content">
                    <a 
                        onClick={this.onClickProveedor}
                        className="btn-content btn-sm-content btn-success-content" >
                        {/*<i className="fa fa-plus"></i>*/}
                        <i className="fa fa-plus"></i>
                    </a>
                </div>
            )
        } else {
            return (
                <div className="col-lg-3-content">
                    <a 
                        onClick={this.onClickProveedor}
                        className="btn-content btn-sm-content btn-primary-content" >
                        <i className="fa fa-eye"></i>
                    </a>
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
            title: 'Gur',
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

     render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/compra/index/"/>
            )
        }

        const componentPlanPago = this.componentPlanPago();
        const componentButtomProveedor = this.componentButtomProveedor();
        return (
            <div>
                <div 
                    className="form-group-content"
                    style={{'display': (this.state.mostrarCreateProv)?'none':'block'}}
                >

                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Compra </h1>
                        </div>
                    </div>
                    <Modal
                        title="Plan De Pago"
                        visible={this.state.visiblePlanPago}
                        onCancel={this.closeModalPlanPago.bind(this)}
                        footer={null}
                        width={950}
                        bodyStyle={{
                            height : window.innerHeight * 0.8
                        }}
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
                    <div className="form-group-content col-lg-12-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <input 
                                    id="codigo" 
                                    type="text"
                                    value={this.state.codcompra}
                                    placeholder="Codigo"
                                    onChange={this.onChangeCodCompra}
                                    className="form-control-content" 
                                />
                                <label 
                                    htmlFor="codigo" 
                                    className="label-content"> Codigo
                                </label>
                            </div>
                            
                            <div className="col-lg-3-content">
                                <select 
                                    id="sucursal" 
                                    name="sucursal"
                                    className="form-control-content"
                                    value={this.state.idsucursal}
                                    onChange={this.onChangeSucursal}
                                >
                                        {
                                            this.state.sucursales.map((item,key) => (
                                                <option 
                                                    key={key} 
                                                    id={item.idsucursal} 
                                                    value={item.idsucursal}
                                                >
                                                    {item.nombre}
                                                </option>
                                            ))
                                        }
                                </select>
                                <label 
                                    htmlFor="sucursal" 
                                    className="label-content"
                                >
                                    Sucursal
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select 
                                    id="almacen" 
                                    name="almacen"
                                    className="form-control-content"
                                    value={this.state.idalmacen}
                                    onChange={this.onChangeAlmacen}
                                >
                                        {
                                            this.state.almacenesSucursal.map((item,key) => (
                                                <option 
                                                    key={key} 
                                                    id={item.idalmacen} 
                                                    value={item.idalmacen}
                                                >
                                                    {item.descripcion}
                                                </option>
                                            ))
                                        }
                                </select>
                                <label 
                                    htmlFor="almacen" 
                                    className="label-content"
                                >
                                    Almacen
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select 
                                    id="idmoneda" 
                                    name="idmoneda"
                                    className="form-control-content"
                                    value={this.state.idmoneda}
                                    onChange={this.onChangeMoneda}
                                >
                                        {
                                            this.state.monedas.map((item,key) => (
                                                <option 
                                                    key={key} 
                                                    id={item.idmoneda} 
                                                    value={item.idmoneda}
                                                >
                                                    {item.descripcion}
                                                </option>
                                            ))
                                        }
                                </select>
                                <label 
                                    htmlFor="idmoneda" 
                                    className="label-content"
                                >
                                    Moneda
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                { componentButtomProveedor }
                                <div className="col-lg-9-content">
                                    <Select
                                        showSearch
                                        value={this.state.valSearchCod}
                                        placeholder={"Buscar proveedor por Id o Codigo"}
                                        style={{ width: '100%' }}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.onSearchProvCod}
                                        onChange={this.onChangeSearchProvCod}
                                        notFoundContent={null}
                                        allowClear={true}
                                    >
                                        {this.state.resultProveedores.map((item, key) => (
                                            <Option 
                                                key={key} value={item.idproveedor}>
                                                {item.idproveedor}
                                            </Option>
                                        ))}
                                    </Select>
                                    <label 
                                        htmlFor="fecha" 
                                        className="label-content">
                                        Cod/Id
                                    </label>
                                </div>
                            </div>

                            <div className="col-lg-3-content">
                                <Select
                                    showSearch
                                    value={this.state.valSearchNom}
                                    placeholder={"Buscar proveedor por nombre o apellido"}
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchProvNom}
                                    onChange={this.onChangeSearchProvNom}
                                    notFoundContent={null}
                                    allowClear={true}
                                >
                                    {this.state.resultProveedores.map((item, key) => (
                                        <Option 
                                            key={key} value={item.idproveedor}>
                                            {item.nombre + ' ' + item.apellido}
                                        </Option>
                                    ))}
                                </Select>
                                <label 
                                    htmlFor="fecha" 
                                    className="label-content">
                                    Nombre/apellido
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <input 
                                    id="nit" 
                                    type="text"
                                    value={this.state.nit}
                                    placeholder="Nit"
                                    onChange={this.onChangeNit}
                                    className="form-control-content" 
                                />
                                <label 
                                    htmlFor="nit" 
                                    className="label-content"> Nit
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <select 
                                    id="planpago" 
                                    name="almacen"
                                    className="form-control-content"
                                    onChange={this.onChangePlanPago}
                                    value={this.state.planpago}
                                >
                                        <option value="C">Contado</option>
                                        <option value="R">Credito</option>
                                </select>
                                <label 
                                    htmlFor="planpago" 
                                    className="label-content"
                                >
                                    Plan de Pago
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <DatePicker
                                    //showTime
                                    format='YYYY-MM-DD'
                                    placeholder="Select Time"
                                    defaultValue={moment(this.state.fecha, 'YYYY-MM-DD')}
                                    //value={moment(this.state.fecha,'YYYY-MM-DD')}
                                    onChange={this.onChangeFecha}
                                    onOk={this.onOk}
                                    style={{ width: '100%' }}
                                />
                                <label 
                                    htmlFor="fecha" 
                                    className="label-content">
                                    Fecha
                                </label>
                            </div>

                            <div className="col-lg-3-content">
                                <DatePicker
                                    showTime
                                    mode='time'
                                    format='HH:mm:ss'
                                    placeholder="Select Time"
                                    value={moment(this.state.hora,'HH:mm:ss')}
                                    onChange={this.onChangeHora}
                                    onOk={this.onOk}
                                    style={{ width: '100%' }}
                                />
                                <label 
                                    htmlFor="hora" 
                                    className="label-content">
                                    Hora
                                </label>
                            </div>
                        </div>

                        <Divider />
                        <div className="col-lg-12-content">
                            <div className="col-lg-12-content">
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe "> CodProd </label>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe"> Producto </label>
                                </div>
                                <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe"> Unid. Med </label>
                                </div>
                                <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe"> Cantidad </label>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe"> Costo Unit </label>
                                </div>
                                <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <label htmlFor="lista" className="label-group-content-nwe "> Costo Total </label>
                                </div>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content" >
                                    <div className="input-group-content" style={{ marginLeft:13}}>
                                        <a className="btn btn-sm btn-default-content hint--bottom " aria-label="Mas">
                                            <i 
                                                className="fa fa-plus btn-content btn-secondary-content" 
                                                onClick={this.addRowProducto}
                                            > 
                                            </i>
                                        </a>
                                    </div>
                                </div>
                                <Divider/>
                            </div>

                            <div className="caja-content">
                                {
                                    this.state.productos.map((item, key) => (
                                        <div key={key} className="col-lg-12-content">
                                            <div className="col-lg-1-content">
                                                <Select
                                                    showSearch
                                                    value={this.state.valuesSearchProd[key].id}
                                                    placeholder={"Id"}
                                                    style={{ width: '100%' }}
                                                    defaultActiveFirstOption={false}
                                                    showArrow={false}
                                                    filterOption={false}
                                                    onSearch={this.onSearchProdCod}
                                                    onChange={this.onChangeSearchProdId.bind(this, key)}
                                                    notFoundContent={null}
                                                >
                                                    {this.state.resultProductos.map((item, key) => (
                                                        <Option 
                                                            key={key} value={item.idproducto}>
                                                            {item.idproducto}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>

                                            <div className="col-lg-2-content">
                                                <Select
                                                    showSearch
                                                    value={this.state.valuesSearchProd[key].descripcion}
                                                    placeholder={"Buscar producto por descripcion"}
                                                    style={{ width: '100%' }}
                                                    defaultActiveFirstOption={false}
                                                    showArrow={false}
                                                    filterOption={false}
                                                    onSearch={this.onSearchProdNom}
                                                    onChange={this.onChangeSearchProdNom.bind(this, key)}
                                                    notFoundContent={null}
                                                >
                                                    {this.state.resultProductos.map((item, key) => (
                                                        <Option 
                                                            key={key} value={item.idproducto}>
                                                            {item.descripcion}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                            
                                            <div className="col-lg-2-content">
                                                <label>{this.state.unidadMedidas[key]}</label>
                                            </div>

                                            <div className="col-lg-2-content">
                                                <input  
                                                    id={key} type="number"
                                                    value={this.state.cantidades[key]}
                                                    onChange = {this.onChangeCantidades}
                                                    placeholder="cantidad"
                                                    className="form-control-content reinicio-padding"
                                                />
                                            </div>

                                            <div className="col-lg-2-content">
                                                <input  
                                                    id={key} type="number"
                                                    value={this.state.costosUnitarios[key]}
                                                    onChange = {this.onChangeCostoU}
                                                    placeholder="Costo Unitario"
                                                    className="form-control-content reinicio-padding"
                                                />
                                            </div>
                                            
                                            <div className="col-lg-2-content">
                                                <input  
                                                    id={key} type="number"
                                                    value={this.state.costosTotales[key]}
                                                    //onChange = {this.onChangeCostoT}
                                                    placeholder="Costo Total"
                                                    className="form-control-content reinicio-padding"
                                                />
                                            </div>

                                            <div className="col-lg-1-content">
                                                <i
                                                    className="fa fa-remove btn-content btn-danger-content"
                                                    key={key}
                                                    onClick={() => this.removeProductSelected(key)}
                                                >
                                                </i>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                            <Divider />
                            <div className="form-group-content">
                                <div className="col-lg-8-content">
                                    <div className="input-group-content">
                                        <textarea 
                                            className="textarea-content" 
                                            placeholder="Notas" 
                                            style={{ height:200 }} 
                                            value={this.state.notas} 
                                            onChange={this.onChangeNotas}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4-content">
                                    <div className="col-lg-3-content">
                                        <label>Total</label>
                                    </div>
                                    <div className="col-lg-9-content">
                                        <input  
                                            type="number"
                                            value={this.state.costoTotal}
                                            //onChange = {this.onChangeCostoT}
                                            placeholder="Total"
                                            className="form-control-content"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group-content col-lg-12-content">
                        <div className="text-center-content col-lg-12-content">
                            <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <button 
                                    type="button" 
                                    className="btn-content btn-sm-content btn-success-content" 
                                    onClick={this.guardarCompra}>
                                    Aceptar
                                </button>
                            </div>
                            <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <button 
                                    type="button" 
                                    className="btn-content btn-sm-content btn-danger-content"
                                    onClick={this.showConfirmCancel.bind(this)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    className="form-group-content"
                    style={{'display': (this.state.mostrarCreateProv)?'block':'none'}}
                >
                    <CrearProveedor
                        aviso={1}
                        callback={this.callbackProveedor.bind(this)}
                    />
                </div>
            </div>
        )
    }
}