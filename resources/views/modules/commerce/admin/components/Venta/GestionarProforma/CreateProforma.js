

import React, { Component } from 'react';
import axios from 'axios';
import { Link,Redirect } from 'react-router-dom';

import { Modal,TreeSelect,message,
    notification ,Icon,Divider, Alert
} from 'antd';



const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
import "antd/dist/antd.css";
import CrearParteVehiculo from "../../Taller/GestionarVentaDetalleVehiculo/CrearParteVehiculo";
import ShowCliente from '../GestionarCliente/ShowCliente';
import CrearCliente from '../GestionarCliente/CrearCliente';
import CrearHistorialVehiculo from '../../Taller/GestionarVentaDetalleVehiculo/CrearHistorialVehiculo';
import { dateToString } from '../../../tools/toolsDate';
import { ConfigConsumer } from 'antd/lib/config-provider';
import { wsproforma } from '../../../WS/webservices';

let dateNow = new Date();
export default class CrearProforma extends Component{

    constructor(props){
        super(props)
        this.state = {

            mostrarCrearCliente: false,
            aviso: 1,

            clienteSeleccionado: [],
            clienteContactarloSeleccionado: [],

            visibleModalCliente: false,

            vehiculosDelcliente: [],
            vehiculoSeleccionado: [],

            idVehiculoDelCliente: '0',

            tituloPrincipal: 'Registrar Proforma',
            mostrarOpcionParteVehiculo: 0,
            mostrarOpcionRegistrarVenta: 1,

            vehiculoParte: [],
            cantidadParteVehiculo: [],
            estadoParteVehiculo: [],
            observacionParteVehiculo: [],
            imagenParteVehiculo: [],
            indiceParteVehiculo: [],

            mostrarOpcionHistorialVehiculo: 0,
            fechaActual: '',

            historialVehiculo: {
                diagnosticoEntrada: '',
                trabajoHechos: '',
                precio: 0,
                kmActual: '',
                kmProximo: '',
                fechaProxima: ''
            },

            codigoVenta: "",
            fechaVenta: "",

            sucursalVenta: [],
            sucursalVentaId: '',

            almacenVenta: [],
            almacenVentaId: '',
            almacenVentaSucursal: [],

            clienteVenta: [],
            clienteDataVenta1: undefined,
            clienteDataVenta2: undefined,

            vendedorVenta: [],
            vendedorDataVentaId: undefined,
            vendedorDataNombre: undefined,

            nitVenta: '',
            monedaVenta: [],
            monedaVentaId: "",
            listaVenta: [],
            listaMonedaVenta: [],
            listaVentaId: '',

            productoVenta: [],
            productoCodVenta: undefined,
            productoNombreVenta: undefined,
            unidadMedVenta: '',

            arrayCodProVenta: [],
            arrayProductoVenta: [],
            arrayUnidadVenta: [],
            arrayTipoPoS: [],
            arrayUnidadVentaAbrev: [],
            arrayCantidadVenta: [],
            arrayListaVenta: [],
            arrayPrecioUnit: [],
            arrayDescuento: [],
            arrayPrecioTotal: [],
            arrayIdAlmacenProdDetalle: [],
            arrayListaPreProdDetalle: [],
            subTotalVenta: 0,
            descuentoVenta: 0,
            recargoVenta: 0,
            totalVenta: 0,
            arrayItems: [1,2,3],
            observacionVenta: "",
            visible: false,

            fkidcomisionventa: '',
            comisionvendedor: '',
            idusuario: "1",
            fkidtipocontacredito: 1,
            fkidtipotransacventa: 1,
            estado: "V",
            estadoProceso: 'E',
            redirect: false,
            tipoContaCredito: [],
            visibleCredito: false,

            anticipo: 0,
            saldoApagar: 0,
            NumeroCuota: 1,
            fechaInicioDePago: dateToString(dateNow),
            tipoPeriodo: 1,
            listaDeCuotas: [],
            alertModal: false,
        }

    }
    getSucursal(){
        axios.get('/commerce/api/sucursal')
        .then(response => {

            if(response.data.response === 1) {
                this.setState({
                    sucursalVenta:response.data.data,
                    sucursalVentaId:response.data.data[0].idsucursal
                });
                this.actualizarAlmacen(response.data.data[0].idsucursal)
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getAlmacen(){
        axios.get('/commerce/api/almacen').then(response => {
            if(response.data.response === 1) {
                this.setState({
                    almacenVenta:response.data.data,
                })

            }
        }).catch(error => {
            console.log(error);
        })
    }
    getCliente(){
        axios.get('/commerce/api/cliente').then(response => {
            this.setState({
                clienteVenta:response.data,
            })

        }).catch(error => {
            console.log(error);
        })
    }
    getMoneda(){
        axios.get('/commerce/api/moneda').then(response => {
            if(response.data.response === 1) {
                this.setState({
                    monedaVenta:response.data.data,
                    monedaVentaId:response.data.data[0].idmoneda
                })
                this.actualizarListaPrecio(response.data.data[0].idmoneda)
            }
        }).catch(error => {
            console.log(error);
        })
    }
    actualizarListaPrecio(idmoneda){
        for(let i = 0; i < this.state.listaVenta.length ; i++){
            if(this.state.listaVenta[i].fkidmoneda == idmoneda){
                this.state.listaMonedaVenta.push(this.state.listaVenta[i]);
                var listaventaidV = this.state.listaMonedaVenta[0].idlistaprecio
                this.setState({
                    listaMonedaVenta:this.state.listaMonedaVenta,
                    listaVentaId:this.state.listaMonedaVenta[0].idlistaprecio
                })
            }
        }
        for(let i = 0;i < this.state.arrayItems.length ; i++){
            this.state.arrayListaVenta[i] = listaventaidV
        }
        this.setState({
            arrayListaVenta:this.state.arrayListaVenta
        })

    }
    getListaPrecio(){
        axios.get('/commerce/api/listaprecio').then(response => {
            if(response.data.response === 1) {
                this.setState({
                    listaVenta:response.data.data,
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getVendedor(){
        axios.get('/commerce/api/vendedor').then(response => {
            if(response.data.response == 1) {
                this.setState({
                    vendedorVenta:response.data.data,
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getProducto(idalmacen){
        var body = {
            "idalmacen":idalmacen
        }
        axios.post('/commerce/api/getproducto',body).then(response => {
            if(response.data.response == 1) {
                this.ClearDetalle()

                this.setState({
                    productoVenta:response.data.data,

                });
            }
        }).catch(error => {
            console.log(error)
        })
    }
    ClearDetalle(){
        for(let i = 0; i < this.state.arrayUnidadVentaAbrev.length; i++){
            this.state.arrayPrecioUnit[i] = ""
            this.state.arrayPrecioTotal[i] = ""
            this.state.arrayCantidadVenta[i] = 1
            this.state.arrayTipoPoS[i] = ""
            this.state.arrayUnidadVentaAbrev[i] = ""
            this.state.arrayDescuento[i] = 0
            this.state.arrayUnidadVenta[i] = ""
            this.state.arrayIdAlmacenProdDetalle[i] = ""
        }
        this.setState({
            arrayProductoVenta:[],
            arrayCodProVenta:[],
            subTotalVenta:'',
            descuentoVenta:0,
            recargoVenta:0,
            totalVenta:''
        })
    }
    getTipoContCredito(){
        axios.get('/commerce/api/tipocontacredito').then(response => {
            if(response.data.response == 1) {
                this.setState({
                    tipoContaCredito:response.data.data,
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }
    getComision(fkidcomision){
        var body = {
            "fkidcomisionventa":fkidcomision
        }
        axios.post('/commerce/api/traercomisionvendedor',body).then(response => {
            if(response.data.response == 1) {
                this.setState({
                    comisionvendedor:response.data.data[0].valor,
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }
    componentWillMount(){

        axios.get('').then(resultado => {
           

        }).catch(error => {
            console.log(error)
        });

        var fecha = new Date();
        var mes = fecha.getMonth() > 9 ? "" :"0"
        var dia = fecha.getDate() > 9 ? "" :"0"
        var fechaFormato = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate()

        this.setState({
            fechaVenta:fechaFormato
        });

        axios.get('/commerce/api/venta').then(response => {

        }).catch(error => {
            console.log(error);
        });

        this.getAlmacen();
        this.getSucursal();
        this.getCliente();

        this.getListaPrecio();
        this.getMoneda();
        this.getVendedor();
        this.getProducto();

        this.inicializarCantidad();
        this.inicializarDescuento();
        this.getTipoContCredito();

    }
    inicializarCantidad(){
        for(let i=0 ; i < this.state.arrayItems.length ; i++){
            this.state.arrayCantidadVenta[i] = 1;
            this.setState({
                arrayCantidadVenta:this.state.arrayCantidadVenta
            })
        }
    }
    inicializarDescuento(){
        for(let i=0 ; i < this.state.arrayItems.length ; i++){
            this.state.arrayDescuento[i] = 0;
            this.setState({
                arrayDescuento:this.state.arrayDescuento
            })
        }
    }
    guardarDatos(e){

        e.preventDefault();

    }
    ventaCodigo(e){
        this.setState({
            codigoVenta:e.target.value
        })
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    alertModal() {
        if (this.state.alertModal) {
            return (
                <Alert 
                    message="Debe seleccionar la fecha de inicio" 
                    type="error" 
                />
            )
        }
        return null;
    }

    ventaFecha(e){
        var fechaActual = new Date();

        var fechaModi = e.target.value.split('-')
        var fechaLlegada = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]))
        
        if(fechaLlegada.getTime() < fechaActual.getTime()){
            message.error("Fecha Invalida")
        }else{
            this.setState({
                fechaVenta:e.target.value
            })
        }

    }
    ventaMoneda(e){
        this.state.listaMonedaVenta.splice(0,this.state.listaMonedaVenta.length)
        this.setState({
            monedaVentaId:e.target.value
        })
        this.ClearDetalle()
        this.actualizarListaPrecio(e.target.value)

    }
    ventaSucursal(e){
        this.state.almacenVentaSucursal.splice(0,this.state.almacenVentaSucursal.length)
        this.setState({
            sucursalVentaId:e.target.value
        })
        this.actualizarAlmacen(e.target.value)
    }
    actualizarAlmacen(idsucursal){
        for(let i = 0; i < this.state.almacenVenta.length ; i++){
            if(this.state.almacenVenta[i].fkidsucursal == idsucursal){
                this.state.almacenVentaSucursal.push(this.state.almacenVenta[i]);
                var idalmacenA = this.state.almacenVentaSucursal[0].idalmacen
                this.setState({
                    almacenVentaSucursal:this.state.almacenVentaSucursal,
                    almacenVentaId:this.state.almacenVentaSucursal[0].idalmacen
                })
            }
        }

        this.getProducto(idalmacenA)

    }
    ventaAlmacen(e){
        this.setState({
            almacenVentaId:e.target.value
        })
        this.getProducto(e.target.value)
    }

    ventaCliente(value){
        if (typeof value != 'undefined') {
            var array =  value.split(" ")
            this.setState({
                clienteDataVenta1:array[0]
            });
            for(let i = 0; i < this.state.clienteVenta.length; i++){
                if(this.state.clienteVenta[i].idcliente == array[0]){
                    this.setState({
                        clienteDataVenta2:this.state.clienteVenta[i].nombre + " " + this.state.clienteVenta[i].apellido,
                        nitVenta:this.state.clienteVenta[i].nit === null ? "no tiene" : this.state.clienteVenta[i].nit
                    })
                }
            }
            this.getVehiculoDelCliente(array[0]);
        }else {
            this.setState({
                clienteDataVenta2: undefined,
                clienteDataVenta1: undefined,
                nitVenta: '',
                vehiculosDelcliente: [],
                idVehiculoDelCliente: '0'
            });
        }
    }

    getVehiculoDelCliente(idCliente) {
        axios.get('/commerce/admin/getVehiculo?id=' + idCliente + '').then(
            resultado => {
                if (resultado.data.ok) {
                    this.setState({
                        vehiculosDelcliente: resultado.data.data
                    });
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        );

    }

    ventaVendedor(value){
        var array = String(value).split(" ")
        this.setState({
            vendedorDataVentaId:array[0]
        })

        for(let i = 0; i < this.state.vendedorVenta.length; i++){
            if(this.state.vendedorVenta[i].idvendedor == array[0]){
                let apellido = this.state.vendedorVenta[i].apellido == null ? '' : this.state.vendedorVenta[i].apellido;
                this.setState({
                    vendedorDataNombre:this.state.vendedorVenta[i].nombre + " " + apellido,
                    fkidcomisionventa:this.state.vendedorVenta[i].fkidcomisionventa
                })
                this.getComision(this.state.vendedorVenta[i].fkidcomisionventa)
            }
        }
    }

    getNombreUnidadMedida(idunidadmedida,index){
        var body = {
            "fkidunidadmedida":idunidadmedida
        }
        axios.post('/commerce/api/traerunidad',body)
        .then(response => {

            if(response.data.response == 1) {

                this.state.arrayUnidadVentaAbrev[index] = response.data.data[0].abreviacion
                this.setState({
                    arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }
    ventaProducto(value){


        var array = String(value).split(" ");
        var indexArray = array.length-1;
        var index = parseInt(array[indexArray]);
        this.state.arrayCodProVenta[index] = array[0];
        this.setState({
            arrayCodProVenta:this.state.arrayCodProVenta
        })
        for(let i = 0; i < this.state.productoVenta.length; i++){
            if(this.state.productoVenta[i].idproducto == array[0]){
                this.state.arrayProductoVenta[index] = this.state.productoVenta[i].descripcion
                this.state.arrayUnidadVenta[index] = this.state.productoVenta[i].fkidunidadmedida
                this.state.arrayIdAlmacenProdDetalle[index] = this.state.productoVenta[i].idalmacenproddetalle
                this.getNombreUnidadMedida(this.state.productoVenta[i].fkidunidadmedida,index)
                this.state.arrayTipoPoS[index] = this.state.productoVenta[i].tipo
                this.setState({
                    arrayIdAlmacenProdDetalle:this.state.arrayIdAlmacenProdDetalle,
                    arrayProductoVenta:this.state.arrayProductoVenta,
                    arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                    arrayTipoPoS:this.state.arrayTipoPoS
                })
            }
        }
        if(this.state.arrayTipoPoS[index] == "P"){
            this.validarStock(this.state.almacenVentaId,this.state.arrayCodProVenta[index],this.state.arrayCantidadVenta[index])
        }
        this.getTraerPrecio(this.state.arrayCodProVenta[index],this.state.arrayListaVenta[index],index)

    }

    ventaCantidad(e){
        let index = e.target.id;
        let valor = e.target.value;
        if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
            if(valor > 0){
                if(this.state.arrayTipoPoS[index] == "P"){
                    this.validarStock(this.state.almacenVentaId,this.state.arrayCodProVenta[index],valor,index)
                }
            }else{
                message.error("Cantidad Igual o Mayor a 1 Por favor")
            }
        }else{
            message.error("Por Favor Seleccion un Producto")
        }
    }
    validarStock(idalmacen,idproducto,valor,index){
        var  body =  {
            "idalmacen":idalmacen,
            "idproducto":idproducto
        }
        axios.post('/commerce/api/verifistock',body).then(response => {
            if(response.data.response == 1) {
                if(response.data.data.length > 0){
                    let stockSuma = 0
                    for(let i = 0; i < response.data.data.length ; i++){
                        stockSuma = stockSuma + response.data.data[i].stock
                    }
                    if(parseInt(stockSuma) >= parseInt(valor)){
                        this.state.arrayCantidadVenta[index] = valor

                        this.setState({
                            arrayCantidadVenta:this.state.arrayCantidadVenta
                        })
                    }else{
                        message.error("Stock Agotado")
                    }
                }else{
                    message.error("No existe Producto en un almacen")
                }

            }else{
                message.error("Error Del Servidor")
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        }).catch(error => {
            console.log(error);
        })

    }
    getTraerPrecio(idProducto,idListaPrecio,posicion){
        var body = {
            "idproducto" : parseInt(idProducto),
            "idlistaprecio" : idListaPrecio
        }
        axios.post('/commerce/api/getPrecio',body).then(response => {
            if(response.data.response == 1){
                if(response.data.data.length != 0){
                    this.state.arrayPrecioUnit [posicion] = response.data.data[0].precio
                    this.state.arrayListaPreProdDetalle[posicion] = response.data.data[0].idlistapreproducdetalle
                    this.setState({
                        arrayPrecioUnit:this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
                    });
                }else{
                    this.state.arrayPrecioUnit [posicion] = 0
                    this.state.arrayListaPreProdDetalle [posicion] = 0
                    this.setState({
                        arrayPrecioUnit:this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
                    })
                    message.error("No tiene Precio Definido")
                }
                this.CalculoPrecioTotal(posicion)
                this.calculoSubTotal()
            }
        }).catch (error => {
            console.log(error)
        })
    }
    ventaLista(e){
        let index = e.target.id;
        let valor = e.target.value;
        this.state.arrayListaVenta[index] = parseInt(valor)
        this.setState({
            arrayListaVenta:this.state.arrayListaVenta
        });

        this.getTraerPrecio(this.state.arrayCodProVenta[index],this.state.arrayListaVenta[index],index)

    }
    ventaListaPrincipal(e){


        for(let i = 0; i < this.state.arrayItems.length ; i++){
            this.state.arrayListaVenta[i] = e.target.value
        }
        this.setState({
            listaVentaId:e.target.value,
            arrayListaVenta:this.state.arrayListaVenta
        })
        this.ClearDetalle()
    }
    ventaPrecioUnit(e){
        let index = e.target.id
        let valor = parseInt(e.target.value)
        if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
            if(valor >= 0){
                this.state.arrayPrecioUnit[index] = valor
                this.setState({
                    arrayPrecioUnit: this.state.arrayPrecioUnit
                })
            }else{
                this.state.arrayPrecioUnit[index] = 0;
                this.setState({
                    arrayPrecioUnit: this.state.arrayPrecioUnit
                })
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        }else{
            message.error("Por favor seleccione un Producto");
        }
    }
    ventaDescuento(e){
        let index = e.target.id
        let valor = parseFloat(e.target.value)
        if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
            if( valor >= 0){
                this.state.arrayDescuento[index] = valor;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                });
            }else{
                this.state.arrayDescuento[index] = 0;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                })
                message.error("Descuento tiene que ser Mayor e Igual a 0");
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        }else{
            message.error("Por Favor Seleccione unProducto");
        }


    }
    CalculoPrecioTotal(posicion){
        let PrecioUnidad = parseInt(this.state.arrayPrecioUnit[posicion]);
        let Descuento = parseInt( this.state.arrayDescuento[posicion] );
        let cantidad = parseInt(this.state.arrayCantidadVenta[posicion]);
        let precioTotal = ((PrecioUnidad - (PrecioUnidad * Descuento) / 100) * cantidad)
        this.state.arrayPrecioTotal[posicion] = precioTotal
        this.setState({
            arrayPrecioTotal: this.state.arrayPrecioTotal
        });
    }
    calculoSubTotal(){
        let subTotal = 0
        for(let i = 0; i < this.state.arrayPrecioTotal.length ; i++){
            if(typeof this.state.arrayPrecioTotal[i] !== 'undefined')
                subTotal = subTotal + parseFloat(this.state.arrayPrecioTotal[i])
        }
        this.setState({
            subTotalVenta: subTotal
        })
        this.CalculoTotal(1,subTotal)
    }
    ventaDescuentoTotal(e){
        let valor = parseFloat(e.target.value);
        if(valor >= 0 ){
            this.setState({
                descuentoVenta:e.target.value
            })

            this.CalculoTotal(0,valor);
        }else{
            this.setState({
                descuentoVenta:0
            })

            this.CalculoTotal(0,0);
        }
    }
    
    ventaRecargoTotal(e){
        let valor = parseInt(e.target.value);
        if(valor >= 0){
            this.setState({
                recargoVenta:e.target.value
            });

            this.CalculoTotal(2,valor);
        }else{
            this.setState({
                recargoVenta:0
            });

            this.CalculoTotal(2,0);
        }
    }
    CalculoTotal(index,valor){
        if(index == 0){
            let subTotal = this.state.subTotalVenta;
            let descuentoGeneral = this.state.descuentoVenta;
            let recargo = this.state.recargoVenta;
            var total = subTotal - ((subTotal * valor) / 100) + ((subTotal * recargo) / 100)

        }else if(index == 1){
            let subTotal = this.state.subTotalVenta;
            let descuentoGeneral = this.state.descuentoVenta;
            let recargo = this.state.recargoVenta;
            var total = valor - ((valor * descuentoGeneral) / 100) + ((valor * recargo) / 100)

        }else if(index == 2){
            let subTotal = this.state.subTotalVenta;
            let descuentoGeneral = this.state.descuentoVenta;
            let recargo = this.state.recargoVenta;

            var total = subTotal - ((subTotal * descuentoGeneral) / 100) + ((subTotal * valor) / 100)

        }
        this.setState({
            totalVenta:total,
            saldoApagar:total
        })
    }
    ventaObservacion(e){
        this.setState({
            observacionVenta:e.target.value
        })
    }

    validarDatos() {

        if (this.state.codigoVenta.length === 0) {
            message.error('Debe introducit un codigo');
            return false;
        } 
        if (this.state.clienteDataVenta1 == undefined) {
            message.error('Debe seleccionar un cliente');
            return false;
        }
        if (this.state.vendedorDataVentaId == undefined || this.state.vendedorDataNombre == undefined) {
            message.error('Debe seleccionar un vendedor');
            return false;
        }
        if (this.state.arrayCodProVenta.length === 0) {
            message.error('Debe seleccionar un Producto por lo menos');
            return false;
        }
        
        for (let i = 0; i < this.state.arrayCodProVenta.length; i++) {
            if (typeof this.state.arrayCodProVenta[i] != undefined && this.state.arrayPrecioUnit[i] <= 0) {
                message.error('No puede comprar un producto con stock cero');
                return;
            }
            if (this.state.arrayCantidadVenta[i] == 0) {
                message.error('No puede comprar un producto con stock cero');
                return;
            }
        }

        return true;
    }
    pagar(){
        if (!this.validarDatos()) return;
        this.setState({
            visible: !this.state.visible
        })
    }
    handleCancel(){
        this.setState({
            visible:!this.state.visible
        })
    }
    handleCancelcredito(){
        this.setState({
            visibleCredito:!this.state.visibleCredito
        })
    }
    guardarVenta(condicion){

        if(String(this.state.codigoVenta).length > 0 && String(this.state.fechaVenta).length > 0  && String(this.state.comisionvendedor).length > 0
            && String(this.state.idusuario).length > 0 && String(this.state.estado).length > 0 && String(this.state.estadoProceso).length > 0
            && String(this.state.sucursalVentaId).length > 0 && String(this.state.clienteDataVenta1).length > 0 && String(this.state.vendedorDataVentaId).length > 0
            && String(this.state.fkidtipocontacredito).length > 0 && String(this.state.fkidtipotransacventa).length > 0){
            var hora = new Date()
            var arrayCantidad = []
            var arrayPrecio = []
            var arrayDescuento = []
            var ventadetalle = []
            for (let i = 0; i < this.state.arrayCodProVenta.length ; i++) {
                if(parseInt(this.state.arrayPrecioUnit[i]) !== 0 && !isNaN(this.state.arrayPrecioUnit[i])){
                    var detalle = {
                        cantidad:parseInt(this.state.arrayCantidadVenta[i]),
                        precioUnit:parseFloat(this.state.arrayPrecioUnit[i]),
                        factor:parseFloat(this.state.arrayDescuento[i]),
                        tipo:this.state.arrayTipoPoS[i],
                        fkidalmacenprodetalle:parseInt(this.state.arrayIdAlmacenProdDetalle[i]),
                        fkidlistaproddetalle:parseInt(this.state.arrayListaPreProdDetalle[i]),
                        idProducto:parseInt(this.state.arrayCodProVenta)
                    }
                    ventadetalle.push(detalle)
                }
            }
            var body = {
                codigoventa: this.state.codigoVenta,
                fechaventa: this.state.fechaVenta,
                estado: 'V',
                recargoVenta: isNaN(this.state.recargoVenta) ? 0 : parseFloat(this.state.recargoVenta),
                descuentoVenta: isNaN(this.state.descuentoVenta) ? 0 : parseFloat(this.state.descuentoVenta),
                nota: this.state.observacionVenta,
                estadoProceso: 'E',
                fechaHoraFin: null,
                idusuario: 1,
                fkidsucursal: this.state.sucursalVentaId,
                fkidcliente: this.state.clienteDataVenta1,
                fkidvendedor: this.state.vendedorDataVentaId,
                fkidvehiculo: null,
                fkidtipocontacredito: 1,
                fkidtipotransacventa: 1,
                hora: hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
                comision: parseInt(this.state.comisionvendedor),
                arrayidproducto: JSON.stringify(this.state.arrayCodProVenta),
                arraycantidad: JSON.stringify(this.state.arrayCantidadVenta),
                arraypreciounit: JSON.stringify(this.state.arrayPrecioUnit),
                arraydescuento: JSON.stringify(this.state.arrayDescuento) ,
                arrayventadetalle: JSON.stringify(ventadetalle),
                condicion:condicion,
                anticipo: null,
                totalventa: this.state.totalVenta,
                montocobrado: this.state.anticipo
            }
            /*
            var body2 ={}
            if(condicion == "credito"){
                var sumaPlan = 0
                for(let i = 0; i < this.state.listaDeCuotas.length; i++){
                    sumaPlan = sumaPlan + parseFloat(this.state.listaDeCuotas[i].montoPagar)
                }
                if(sumaPlan == this.state.saldoApagar){
                    body2 = {
                        planPago:JSON.stringify(this.state.listaDeCuotas),
                        anticipo:parseFloat(this.state.anticipo),
                        estadoProceso:"F",
                        estadoPlan:'I',
                        montoPagado:0,
                        fkidtipocontacredito: 2,
                    }

                    message.error("Plan de Pago Correcto")
                }else{
                    message.error("plan de Pago Incorrecto")
                }
            }
            */
            console.log('BODY---------------');
            console.log(body);
            //console.log(body2);
            //var bodyActual = Object.assign(body, body2)
            axios.post(wsproforma, body).
            then(response => {
                console.log('RESP SERVE ', response.data);
                if(response.data.response == 1) {
                    this.setState({
                        redirect: !this.state.redirect
                    })
                    message.success("se inserto correctamente");
                }
            }).catch(error => {
                console.log(error)
            })
        }else{
            console.log('FALTA DATOS');
            message.error("datos tienen que estar llenos")
        }
    }

    pagarCredito(){

        this.setState({
            visible:false,
            visibleCredito:!this.state.visibleCredito
        })
    }

    modificarFechaPlan(e){
        console.log(e.target.value)
        var fecha = e.target.value
        var index = e.target.id
        console.log(e.target.id)
        console.log(this.state.listaDeCuotas)
        var datos = this.state.listaDeCuotas[index]
        console.log(datos)
        var fechaModi = fecha.split('-')
        //var fechaFormato = String(fechaModi[2]+"/"+fechaModi[1]+"/"+fechaModi[0])
        var fechaActual = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]))
        var fechaVenta = this.state.fechaVenta.split('-')
        //var fechaVentaFormato = String(fechaVenta[2]+"/"+fechaVenta[1]+"/"+fechaVenta[0])
        var fechaVentaComparar =  new Date(parseInt(fechaVenta[0]),parseInt(fechaVenta[1])-1,parseInt(fechaVenta[2]))
        console.log(fechaActual)
        console.log(fechaVentaComparar)
        if(fechaActual.getTime() >= fechaVentaComparar.getTime()){
            console.log("es mayor la fecha")
            this.state.listaDeCuotas[index].FechaApagar = fecha
            this.setState({
                listaDeCuotas:this.state.listaDeCuotas
            })
            console.log(this.state.listaDeCuotas);
        }else{
            console.log("no es mayor")
        }
        // fechaActual.setDate(fechaActual.getDate()+(parseInt(this.state.tipoPeriodo) * i))

    }

    modificarMonto(e){
        var monto = e.target.value
        console.log('MONTO ', monto);
        var index = parseInt(e.target.id);
        var saldoAnterior = this.state.listaDeCuotas[index-1].saldo
        this.state.listaDeCuotas[index].montoPagar = monto;
        let montoAnterior = this.state.listaDeCuotas[index-1].montoPagar;
        let auxSaldo = saldoAnterior - monto;
        this.state.listaDeCuotas[index].saldo = auxSaldo.toFixed(2);
        let difMonto = montoAnterior - monto;
        let porcion = difMonto / (this.state.listaDeCuotas.length - index - 1);
        for (let i = index+1; i < this.state.listaDeCuotas.length ; i++){
            let auxMontoPagar = montoAnterior + porcion;
            this.state.listaDeCuotas[i].montoPagar = auxMontoPagar.toFixed(2);
            console.log('DESPUES DE LA SUMA ', this.state.listaDeCuotas);
            let saldo = parseFloat(this.state.listaDeCuotas[i-1].saldo) - parseFloat(this.state.listaDeCuotas[i].montoPagar);
            this.state.listaDeCuotas[i].saldo = saldo.toFixed(2);
            console.log('DESPUES DE PONER EL SALDO ', this.state.listaDeCuotas);
            console.log("123",this.state.listaDeCuotas[i].saldo)
        }
        this.setState({
            listaDeCuotas: this.state.listaDeCuotas
        })
        console.log(this.state.listaDeCuotas)
    }

    PlandePago(){
        console.log("lista de cuotas ",this.state.listaDeCuotas)
        if(this.state.listaDeCuotas.length > 0 ){
            return (

                this.state.listaDeCuotas.map((l,i)=>(
                    <div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{l.Nro}</label>
                        </div>
                        <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{l.descripcion}</label>
                        </div>
                        <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <input 
                                className='form-control-content reinicio-padding' 
                                id={i} type='date' 
                                value={l.FechaApagar} onChange={this.modificarFechaPlan.bind(this)}>
                            </input>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <input className='form-control-content reinicio-padding' id={i} type='text' value={l.montoPagar} onChange={this.modificarMonto.bind(this)} ></input>
                        </div>
                        <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content borderTable">
                            <label>{l.saldo}</label>

                        </div>
                    </div>
                ))
            )
        }else{
            return null
        }
    }
    saldoPagar(anticipo){
        if(anticipo == ''){

            var saldo = this.state.totalVenta - 0
        }else if(anticipo < 0){
            var saldo = this.state.totalVenta - 0
        }else if(anticipo == '-'){

            var saldo = this.state.totalVenta - 0
        }else{
            var saldo = this.state.totalVenta - parseInt(anticipo)
        }
        this.setState({
            saldoApagar:saldo
        })
    }
    anticipoPago(e){
        var valor = e.target.value
        if(valor == ''){
            this.setState({
                anticipo:e.target.value
            })
        }else if(valor < 0){

            message.error("No Puede Ingresar Numeros Negativos")
            this.setState({
                anticipo:0
            })
        }else{
            this.setState({
                anticipo:e.target.value
            })
        }

        this.saldoPagar(e.target.value)
    }
    numeroCuotaPlan(e){
        this.setState({
            NumeroCuota:e.target.value,

        })

    }
    /*generarPlanPago(){
      this.calculoDePlanPago()
    }
    calculoDePlanPago(){
        this.state.listaDeCuotas.splice(0,this.state.listaDeCuotas.length)
        for (let i=0 ; i < this.state.NumeroCuota ; i++){
            var arrayfecha = this.state.fechaInicioDePago.split('-')
            var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0])

            var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]))

            fecha.setDate(fecha.getDate()+(parseInt(this.state.tipoPeriodo) * i))

            var mes = fecha.getMonth() > 9 ? "" : "0"
            var dia = fecha.getDate() > 9 ? "" : "0"
            var fechaAmostrar = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate()



            let cuotas = {
                "Nro":i+1,
                "descripcion":"Cuota Nro."+" "+(i+1),
                "FechaApagar": fechaAmostrar,
                "montoPagar":Math.round((this.state.saldoApagar/this.state.NumeroCuota)),
                "saldo":(this.state.saldoApagar-((this.state.saldoApagar/this.state.NumeroCuota)*(i+1)))
            }
            this.state.listaDeCuotas.push(cuotas)
        }
        this.setState({
            listaDeCuotas:this.state.listaDeCuotas
        })
    }*/
    generarPlanPago(){
        if (this.state.fechaInicioDePago == '') {
            this.setState({ alertModal: true });
            return;
        } else {
            this.setState({ alertModal: false });
            this.calculoDePlanPago();
        }
        
    }
    calculoDePlanPago(){
        this.state.listaDeCuotas.splice(0,this.state.listaDeCuotas.length)
        for (let i=0 ; i < this.state.NumeroCuota ; i++){
            console.log(this.state.fechaInicioDePago)
            var arrayfecha = this.state.fechaInicioDePago.split('-')
            var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0])
            console.log("fecha da te",fechaFormato)
            var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]))
            console.log("fe ant ",fecha)
            fecha.setDate(fecha.getDate()+(parseInt(this.state.tipoPeriodo) * i))
            console.log('fecha a pagar inicio ',fecha)
            console.log('mes   ',fecha.getMonth() )
            var mes = fecha.getMonth()+1 > 9 ? "" : "0"
            var dia = fecha.getDate() > 9 ? "" : "0"
            var fechaAmostrar = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate()

            console.log("mostrador fecha ",fechaAmostrar)
            console.log('tamaño de lista',this.state.NumeroCuota.length)
            console.log('index',i+1)
            if(i+1 == this.state.NumeroCuota){
                var saldo = this.state.saldoApagar
                var montoPagarPlan = Math.round((saldo-((Math.round((saldo/this.state.NumeroCuota)*100)/100)*(i)))*100)/100
                var saldoPagarPlan = 0
                console.log('saldo ',saldo)
                console.log('pagar monto',(Math.round((saldo/this.state.NumeroCuota)*100)/100)*(i))
            }else{
                var montoPagarPlan = Math.round((this.state.saldoApagar/this.state.NumeroCuota)*100)/100
                var saldo = this.state.saldoApagar
                var saldoredondeado = (Math.round((saldo/this.state.NumeroCuota)*100)/100)*(i+1)
                var saldoPagarPlan = Math.round((saldo-saldoredondeado)*100)/100
            }
            let cuotas = {
                Nro: i+1,
                descripcion: "Cuota Nro."+" "+(i+1),
                FechaApagar: fechaAmostrar,
                montoPagar: montoPagarPlan,
                saldo: saldoPagarPlan
            }
            this.state.listaDeCuotas.push(cuotas)

        }
        this.setState({
            listaDeCuotas:this.state.listaDeCuotas
        })
        console.log(this.state.listaDeCuotas)


    }
    fechaPagoInicio(e){
        console.log(e.target)

        this.setState({
            fechaInicioDePago :e.target.value
        })
    }
    tipoPeriodo(e){
        this.setState({
            tipoPeriodo:e.target.value
        })
    }
    cabeceraPlan(){
        if(this.state.listaDeCuotas.length > 0){
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
    guardarPlanCredito(){
        var sumaPlan = 0
        for(let i = 0; i < this.state.listaDeCuotas.length; i++){
            sumaPlan = sumaPlan + parseFloat(this.state.listaDeCuotas[i].montoPagar)
        }
        if(sumaPlan == this.state.saldoApagar){

            message.error("Plan de Pago Correcto")
        }else{
            message.error("plan de Pago Incorrecto")
        }

    }

    showConfirmCancelarPlanCredito() {
        const cancelarPlanCredito = this.cancelarPlanCredito.bind(this);
        Modal.confirm({
          title: 'Cancelar el plan de pago',
          content: '¿Dese cancelar el plan de pago?, se borraran los datos ya escritos',
          onOk() {
            console.log('OK');
            cancelarPlanCredito();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    cancelarPlanCredito(){

        message.error("Cancelo de Plan");
        this.setState({
            listaDeCuotas: [],
            NumeroCuota: 1,
            tipoPeriodo: 1,
            fechaInicioDePago: dateToString(dateNow),
            saldoApagar: this.state.totalVenta,
            anticipo: 0,
            visibleCredito: false
        });
    }

    footerPlanPago(){
        if(this.state.listaDeCuotas.length > 0){
            return(
                <div className="form-group-content">
                    <div className="text-center-content">
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                        </div>
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <button 
                                type="button" 
                                className="btn-content btn-danger-content" 
                                onClick={this.showConfirmStore.bind(this, 'credito')}>
                                {/*onClick={this.guardarVenta.bind(this,"credito")}>*/}
                                Guardar
                            </button>
                        </div>
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <button 
                                type="button" 
                                className="btn-content btn-success-content" 
                                onClick={this.showConfirmCancelarPlanCredito.bind(this)}>
                                Cancelar
                            </button>
                        </div>
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                        </div>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }
    addRowDetalle() {
        var newRow = this.state.arrayItems.concat(this.state.arrayItems.length + 1);
        this.state.arrayCantidadVenta.push(1);
        this.state.arrayDescuento.push(0)
        this.state.arrayListaVenta.push(this.state.listaVentaId)
        this.setState({
            arrayItems: newRow,
            arrayCantidadVenta:this.state.arrayCantidadVenta,
            arrayDescuento:this.state.arrayDescuento,
            arrayListaVenta:this.state.arrayListaVenta
        });
    }
    removeRowDetalle(i){
        var newItem = this.state.arrayItems;
        newItem.splice(i, 1);
        this.state.arrayPrecioUnit.splice(i,1)
        this.state.arrayPrecioTotal.splice(i,1)
        this.state.arrayCantidadVenta.splice(i,1)
        this.state.arrayTipoPoS.splice(i,1)
        this.state.arrayUnidadVentaAbrev.splice(i,1)
        this.state.arrayDescuento.splice(i,1)
        this.state.arrayUnidadVenta.splice(i,1)
        this.state.arrayIdAlmacenProdDetalle.splice(i,1)
        this.state.arrayCodProVenta.splice(i,1);
        this.state.arrayListaPreProdDetalle.splice(i,1)
        this.state.arrayProductoVenta.splice(i,1)
        this.state.arrayListaVenta.splice(i,1)
        this.setState({
            arrayItems:newItem,
            arrayPrecioUnit:this.state.arrayPrecioUnit,
            arrayPrecioTotal:this.state.arrayPrecioTotal,
            arrayCantidadVenta:this.state.arrayCantidadVenta,
            arrayTipoPoS:this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
            arrayDescuento:this.state.arrayDescuento,
            arrayUnidadVenta:this.state.arrayUnidadVenta,
            arrayIdAlmacenProdDetalle:this.state.arrayIdAlmacenProdDetalle,
            arrayCodProVenta:this.state.arrayCodProVenta,
            arrayProductoVenta:this.state.arrayProductoVenta,
            arrayListaVenta:this.state.arrayListaVenta,
            arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
        });
    }

    onChangeIdVehiculoDelCliente(e) {
        var array = e.target.value.split(' ');

        if (array.length > 1) {
            array = this.state.vehiculosDelcliente[array[1]];
        }else {
            array = []
        }
        
        var fechaActual = new Date();

        var dia = fechaActual.getDate();
        var mes = fechaActual.getMonth() + 1;
        var year = fechaActual.getFullYear();

        dia = this.addZero(dia);
        mes = this.addZero(mes);

        this.state.fechaActual = dia + '/' + mes + '/' + year;

        this.setState({
            idVehiculoDelCliente: e.target.value,
            vehiculoSeleccionado: array,
            fechaActual: this.state.fechaActual
        });
    }

    cambiarRegistroParteVehiculo() {
        this.state.mostrarOpcionParteVehiculo = 1;
        this.state.mostrarOpcionRegistrarVenta = 0;
        this.state.tituloPrincipal = 'Registrar Partes de Vehiculo';

        this.setState({
            mostrarOpcionParteVehiculo: this.state.mostrarOpcionParteVehiculo,
            mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
            tituloPrincipal: this.state.tituloPrincipal
        });

    }
    /*
    cambiarRegistroHistorialVehiculo() {
        this.state.mostrarOpcionHistorialVehiculo = 1;
        this.state.mostrarOpcionRegistrarVenta = 0;
        this.state.tituloPrincipal = 'Registrar Historial del Vehiculo';

        this.setState({
            mostrarOpcionHistorialVehiculo: this.state.mostrarOpcionHistorialVehiculo,
            mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
            tituloPrincipal: this.state.tituloPrincipal
        });
    }
    */
    getResultadoParteVehiculo(resultado) {
                
        console.log(resultado);
        
        this.state.mostrarOpcionParteVehiculo = 0;
        this.state.mostrarOpcionRegistrarVenta = 1;
        this.state.tituloPrincipal = 'Registrar Venta';

        this.state.vehiculoParte = resultado.vehiculoParte;

        this.state.cantidadParteVehiculo = resultado.cantidadParteVehiculo;
        this.state.estadoParteVehiculo = resultado.estadoParteVehiculo;
        this.state.observacionParteVehiculo = resultado.observacionParteVehiculo;
        this.state.imagenParteVehiculo = resultado.imagenParteVehiculo;
        this.state.indiceParteVehiculo = resultado.indiceParteVehiculo;

        this.setState({
            mostrarOpcionParteVehiculo: this.state.mostrarOpcionParteVehiculo,
            mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
            tituloPrincipal: this.state.tituloPrincipal,

            vehiculoParte: this.state.vehiculoParte,
            cantidadParteVehiculo: this.state.cantidadParteVehiculo,
            estadoParteVehiculo: this.state.estadoParteVehiculo,
            observacionParteVehiculo: this.state.observacionParteVehiculo,
            imagenParteVehiculo: this.state.imagenParteVehiculo,
            indiceParteVehiculo: this.state.indiceParteVehiculo
        });
           
    }

    getResultadoHistorialVehiculo(resultado) {

        this.state.mostrarOpcionHistorialVehiculo = 0;
        this.state.mostrarOpcionRegistrarVenta = 1;
        this.state.tituloPrincipal = 'Registrar Venta';

        console.log(resultado);

        this.state.historialVehiculo = resultado;

        console.log(this.state.historialVehiculo);

        this.setState({

            mostrarOpcionHistorialVehiculo: this.state.mostrarOpcionHistorialVehiculo,
            mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
            tituloPrincipal: this.state.tituloPrincipal,
            historialVehiculo: this.state.historialVehiculo

        });
    }


    verDatosCliente(id) {
        var data = {
            'idCliente': id
        }
        axios.post('/commerce/api/showCliente', data).then(
            response =>{
                if (response.data.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(response.data.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: response.data.clienteContactarlo,
                        visibleModalCliente: !this.state.visibleModalCliente
                    });
                }
            }
        )
    }

    handleCerrar() {
        this.setState({
            visibleModalCliente: !this.state.visibleModalCliente
        })
    }

    getResultadoCrearCliente(cliente, bandera) {
        this.getCliente();
        if (bandera != 0) {
            this.setState({
                mostrarCrearCliente: !this.state.mostrarCrearCliente,
                clienteDataVenta1: cliente.idcliente,
                clienteDataVenta2: cliente.nombre + ' ' + cliente.apellido,
                nitVenta: cliente.nit
                
            });
        }else {
            this.setState({
                mostrarCrearCliente: !this.state.mostrarCrearCliente
            })
        }
    }

    crearNuevoCliente() {
        this.setState({
            mostrarCrearCliente: !this.state.mostrarCrearCliente
        })
    }
    
    showConfirmStore(tipo) {
        
        if(!this.validarDatos()) return;
        const guardarVenta = this.guardarVenta.bind(this);
        Modal.confirm({
          title: 'Guardar Proforma',
          content: '¿Estas seguro de guardar la proforma?',
          onOk() {
            console.log('OK');
            guardarVenta(tipo);
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
            title: 'Guardar Venta',
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


    optionPlanPago(key) {
        switch (key) {
            case 0 :
                this.showConfirmStore('contado');
                //this.guardarVenta('Contado');
                break;
            case 1 :
                this.pagarCredito('credito');
                break;
        }
    }

    componentOptionPlanPago() {
        
        return (
            <div className="form-group-content">
                {
                    this.state.tipoContaCredito.map((item, key) => {
                        return (
                            <div key={key} className="text-center-content">
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <button 
                                        id={key}
                                        type="button" 
                                        className="btn-content btn-danger-content" 
                                        onClick={this.optionPlanPago.bind(this, key)}>
                                        {item.descripcion}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        )
        
    }

    render() {
        if(this.state.redirect === true){
            return (<Redirect to="/commerce/admin/proforma/index" />)
        }
        let componentOptionPlanPago = this.componentOptionPlanPago();
        return (
            <div>
                <Modal
                    title="Datos de Cliente"
                    visible={this.state.visibleModalCliente}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    okText="Aceptar"
                    cancelText='Cancelar'
                    width={900}
                    style={{'top': '40px'}}
                    bodyStyle={{  
                        height : window.innerHeight * 0.8
                    }}
                >
                    <ShowCliente contactoCliente={this.state.clienteContactarloSeleccionado} 
                        cliente={this.state.clienteSeleccionado}>
                    </ShowCliente>

                </Modal>
                <Modal
                    title="Tipo de Pago"
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    { componentOptionPlanPago }
                {/*
                    <div className="form-group-content">
                        <div className="text-center-content">
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <button 
                                        type="button" 
                                        className="btn-content btn-danger-content" 
                                        onClick={this.guardarVenta.bind(this, 'Contado')}>
                                            Contado
                                        </button>
                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <button 
                                            type="button" 
                                            className="btn-content btn-success-content" 
                                            onClick={this.pagarCredito.bind(this)}>
                                            Credito
                                        </button>
                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                                    </div>
                            </div>
                    </div>*/
                }
                    
                    
                </Modal>
                <Modal
                    title="Plan De Pago"
                    visible={this.state.visibleCredito}
                    onCancel={this.handleCancelcredito.bind(this)}
                    footer={null}
                    width={950}
                    bodyStyle={{
                        height : window.innerHeight * 0.8
                    }}>
                    <div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe">Total Monto a Pagar</label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <input  className='form-control-content reinicio-padding' type='text' value={this.state.totalVenta}></input>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe " >Anticipo</label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <input className='form-control-content reinicio-padding'  type='text' value={this.state.anticipo} onChange={this.anticipoPago.bind(this)}></input>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe " >Saldo a Pagar</label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content ">
                            <div className="borderTable ">
                                <input  className='form-control-content reinicio-padding' type='text' value={this.state.saldoApagar}></input>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe">Numero de Cuotas</label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <input  className='form-control-content reinicio-padding' type='text' value={this.state.NumeroCuota} onChange={this.numeroCuotaPlan.bind(this)}></input>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe " >Fecha Inicio Pago</label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <input className='form-control-content reinicio-padding'  type='date' value={this.state.fechaInicioDePago} onChange={this.fechaPagoInicio.bind(this)}></input>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                            <div className="borderTable ">
                                <label className="label-group-content-nwe ">Tipo Periodo</label>
                            </div>
                        </div>

                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <div className="borderTable ">
                                <select  className='form-control-content reinicio-padding' onChange={this.tipoPeriodo.bind(this)}>
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
                                    onClick={this.generarPlanPago.bind(this)}>
                                    Generar Plan Pago
                                </button>
                            </div>
                            <div className="col-lg-12-content">
                                { this.alertModal() }
                            </div>
                        </div>
                        
                       
                        {this.cabeceraPlan()}

                        <div className='caja-content'>
                            {this.PlandePago()}
                        </div>
                        {this.footerPlanPago()}
                    </div>
                </Modal>
                <div style={{'display': (this.state.mostrarCrearCliente)?'none':'block'}}>

                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> {this.state.tituloPrincipal} </h1>
                    </div>
                </div>
                <div className="card-body-content" style={{'display': (this.state.mostrarOpcionRegistrarVenta === 1)?'block':'none'}}>
                    <form onSubmit={this.guardarDatos.bind(this)} className="formulario-content" encType="multipart/form-data" id="form_register">
                        <div>
                            <div className="form-group-content">
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="codigoVenta" type="text"
                                               value={this.state.codigoVenta}
                                               placeholder="Ingresar Codigo ..."
                                               onChange={this.ventaCodigo.bind(this)}
                                               className='form-control-content'
                                        />
                                        <label htmlFor="codigoVenta"
                                               className="label-group-content"> Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="fechaVenta" type="date"
                                               value={this.state.fechaVenta}
                                               placeholder="Ingresar Fecha ..."
                                               onChange={this.ventaFecha.bind(this)}
                                               className='form-control-content'
                                        />
                                        <label htmlFor="fechaVenta"
                                               className="label-group-content"> Fecha </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select name="sucursal" id="sucursal" className="form-control-content" onChange={this.ventaSucursal.bind(this)}>
                                            {this.state.sucursalVenta.map((l, i)=>(
                                                <option key={i} value={l.idsucursal}>{l.nombre}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="sucursal"
                                               className="label-group-content"> Sucursal </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                                    <div className="input-group-content">
                                        <select name="almacen" id="almacen" className="form-control-content" onChange={this.ventaAlmacen.bind(this)}>
                                            {this.state.almacenVentaSucursal.map((l,i)=>(
                                                <option key={i} value={l.idalmacen}>{l.descripcion}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="almacen"
                                               className="label-group-content"> Almacen </label>
                                    </div>
                                </div>
                            </div>
                            <Divider/>
                            <div className='form-group-content'>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    {(typeof this.state.clienteDataVenta1 != 'undefined')?
                                        <div className="input-group-content">
                                            <a  onClick={this.verDatosCliente.bind(this, this.state.clienteDataVenta1)}
                                                className="btn-content btn-sm-content btn-primary-content" >
                                                <i className="fa fa-eye"></i>
                                            </a>
                                        </div>:
                                        <div className="input-group-content">
                                            <a onClick={this.crearNuevoCliente.bind(this)}
                                                className="btn-content btn-sm-content btn-success-content" >
                                                <i className="fa fa-plus"></i>
                                            </a>
                                        </div>
                                    }
                                </div>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label htmlFor="cliente"
                                               className="label-group-content label-group-content-nwe">Cliente : </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 180 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="Seleccionar Cod"
                                            allowClear
                                            value={this.state.clienteDataVenta1}
                                            treeDefaultExpandAll
                                            onChange={this.ventaCliente.bind(this)}
                                        >
                                            {
                                                this.state.clienteVenta.map((l,i) => (
                                                    <TreeNode 
                                                        value={l.idcliente+" "+l.codcliente} 
                                                        title={l.idcliente} 
                                                        key={i}/>
                                                ))
                                            }
                                        </TreeSelect>
                                        <label htmlFor="clienteVenta"
                                               className="label-group-content "> Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 180 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="Seleccionar Nombre"
                                            allowClear
                                            value={this.state.clienteDataVenta2}
                                            treeDefaultExpandAll
                                            onChange={this.ventaCliente.bind(this)}
                                        >
                                            {   this.state.clienteVenta.map((l,i)=> { 
                                                    let apellido = l.apellido == null ? '' : l.apellido;
                                                    let fullname = l.nombre + ' ' + apellido;
                                                    return (
                                                        <TreeNode 
                                                            value={l.idcliente + " "+ l.nombre + " " + l.apellido+" "+l.nit} 
                                                            title={fullname} 
                                                            key={i}
                                                        />
                                                    )
                                                })
                                            }
                                        </TreeSelect>
                                        <label 
                                            htmlFor="clienteVenta"
                                            className="label-group-content"> 
                                            Nombre
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="nitCliente" type="text"
                                               className='form-control-content'
                                               value={(this.state.nitVenta === null)?'':this.state.nitVenta}
                                        />
                                        <label 
                                            htmlFor="nitCliente"
                                            className="label-group-content"> 
                                            Nit 
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select name="moneda" id="moneda" className="form-control-content" onChange={this.ventaMoneda.bind(this)}>
                                            {this.state.monedaVenta.map((l,i)=>(
                                                <option key={i} value={l.idmoneda}>{l.descripcion}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="moneda"
                                               className="label-group-content"> Moneda 
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group-content">
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <a className="btn-content btn-sm-content btn-success-content" aria-label="Agregar Cliente"><i className="fa fa-plus"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label htmlFor="vehiculo"
                                               className="label-group-content label-group-content-nwe">Vehiculo : </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                                value={this.state.idVehiculoDelCliente}
                                                onChange={this.onChangeIdVehiculoDelCliente.bind(this)}>
                                            <option value={'0'}>Seleccionar</option>
                                            {(this.state.vehiculosDelcliente.map(
                                                (resultado, indice) => (
                                                    <option key={indice} value={resultado.idvehiculo + ' ' + indice }>{resultado.codvehiculo}</option>
                                                )
                                            ))}
                                        </select>
                                        <label htmlFor="clienteVenta"
                                               className="label-group-content "> Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                                value={this.state.idVehiculoDelCliente}
                                                onChange={this.onChangeIdVehiculoDelCliente.bind(this)}>
                                            <option value={'0'}>Seleccionar</option>
                                            {(this.state.vehiculosDelcliente.map(
                                                (resultado, indice) => (
                                                    <option key={indice} value={resultado.idvehiculo + ' ' + indice}>{resultado.placa}</option>
                                                )
                                            ))}
                                        </select>
                                        <label htmlFor="clienteVenta"
                                               className="label-group-content "> Placa </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                                value={this.state.idVehiculoDelCliente}
                                                onChange={this.onChangeIdVehiculoDelCliente.bind(this)}>
                                            <option value={'0'}>Seleccionar</option>
                                            {(this.state.vehiculosDelcliente.map(
                                                (resultado, indice) => (
                                                    <option key={indice} value={resultado.idvehiculo + ' ' + indice}>{resultado.descripcion}</option>
                                                )
                                            ))}
                                        </select>
                                        <label htmlFor="clienteVenta"
                                               className="label-group-content "> Descripcion </label>
                                    </div>
                                </div>
                            </div>

                            <div className='form-group-content'>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">

                                </div>
                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label htmlFor="cliente"
                                               className="label-group-content label-group-content-nwe">Vendedor : </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 180 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="Seleccionar Cod"
                                            allowClear
                                            value={this.state.vendedorDataVentaId}
                                            treeDefaultExpandAll
                                            onChange={this.ventaVendedor.bind(this)}
                                        >
                                            {
                                                this.state.vendedorVenta.map((l,i)=>(
                                                    <TreeNode value={l.idvendedor} title={l.idvendedor} key={i}/>
                                                ))
                                            }
                                        </TreeSelect>
                                        <label htmlFor="vendedorVenta"
                                               className="label-group-content">Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content" >
                                    <div className="input-group-content">
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 180 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="Seleccionar Vendedor"
                                            allowClear
                                            value={this.state.vendedorDataNombre}
                                            treeDefaultExpandAll
                                            onChange={this.ventaVendedor.bind(this)}>
                                            {
                                                this.state.vendedorVenta.map((l,i)=> {
                                                    let apellido = l.apellido == null ? '' : l.apellido;
                                                    let fullname = l.nombre + ' ' + apellido;
                                                    return (
                                                        <TreeNode 
                                                            value={l.idvendedor  + " "+ l.nombre + " " + l.apellido} 
                                                            title={fullname} key={i}
                                                        />
                                                    )
                                                })
                                            }
                                        </TreeSelect>
                                        <label htmlFor="vendedorVenta"
                                            className="label-group-content"> 
                                            Nombre 
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select name="lista" id="lista" className="form-control-content" onChange={this.ventaListaPrincipal.bind(this)} value={this.state.listaVentaId}>
                                            {this.state.listaMonedaVenta.map((l,i)=>(
                                                <option key={i} value={l.idlistaprecio}>{l.descripcion}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="moneda"
                                               className="label-group-content"> Lista Precios </label>
                                    </div>
                                </div>
                            </div>
                            <Divider/>
                            <div className="card-caracteristica">
                                <div className='form-group-content'>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe "> CodProd </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> Producto </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> Unid. Med </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> Cantidad </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> Lista </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe "> Precio Unit </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> % Dcto. </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                                        <label htmlFor="lista" className="label-group-content-nwe"> Precio Total </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content" >
                                        <div className="input-group-content" style={{ marginLeft:13}}>
                                            <a className="btn btn-sm btn-default-content hint--bottom " aria-label="Mas"><i className="fa fa-plus btn-content btn-secondary-content" onClick={this.addRowDetalle.bind(this)}> </i></a>
                                        </div>
                                    </div>
                                    <Divider/>
                                </div>
                                <div className='form-group-content'>
                                    <div className="caja-content" >
                                        {this.state.arrayItems.map((l,i)=>(
                                            <div key={i}>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <TreeSelect
                                                            showSearch
                                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                            placeholder="Codigo"
                                                            value={this.state.arrayCodProVenta[i]}
                                                            treeDefaultExpandAll
                                                            onChange={this.ventaProducto.bind(this)}
                                                        >
                                                            {
                                                                this.state.productoVenta.map((m,k)=>(
                                                                    <TreeNode 
                                                                        key={k} 
                                                                        value={m.idproducto+ " " + i} 
                                                                        title={m.idproducto}
                                                                    />
                                                                ))
                                                            }
                                                        </TreeSelect>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <TreeSelect
                                                            showSearch
                                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                            placeholder="Producto"
                                                            value={this.state.arrayProductoVenta[i]}
                                                            treeDefaultExpandAll
                                                            onChange={this.ventaProducto.bind(this)}
                                                        >
                                                            {
                                                                this.state.productoVenta.map((m,j)=>(
                                                                    <TreeNode key={j} value={m.idproducto+" "+m.descripcion + " " + i} title={m.descripcion} />
                                                                ))
                                                            }
                                                        </TreeSelect>
                                                    </div>
                                                </div>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <input id={i} type="text"
                                                               value = {typeof this.state.arrayUnidadVentaAbrev[i] == 'undefined' ? "" :this.state.arrayUnidadVentaAbrev[i] }
                                                               placeholder="Unidad"
                                                               className='form-control-content reinicio-padding'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <input  
                                                            id={i} type="number"
                                                            value={this.state.arrayCantidadVenta[i]}
                                                            onChange = {this.ventaCantidad.bind(this)}
                                                            placeholder="cantidad"
                                                            className='form-control-content reinicio-padding'
                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <select name="lista" id={i} className="form-control-content" value={this.state.arrayListaVenta[i]} onChange={this.ventaLista.bind(this)} >
                                                            {this.state.listaMonedaVenta.map((l,i)=>(
                                                                <option key={i} value={l.idlistaprecio}>{l.descripcion}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <input 
                                                            id={i} type="text"
                                                            placeholder="Precio Uni."
                                                            className='form-control-content reinicio-padding'
                                                            value={typeof this.state.arrayPrecioUnit[i] == 'undefined' ? "" :this.state.arrayPrecioUnit[i]}
                                                            onChange={this.ventaPrecioUnit.bind(this)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <input id={i} type="text"
                                                               placeholder="% Desc"
                                                               className='form-control-content reinicio-padding'
                                                               value={this.state.arrayDescuento[i]}
                                                               onChange={this.ventaDescuento.bind(this)}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <input id="preciototal" type="text"
                                                               placeholder="Precio Total"
                                                               className='form-control-content'
                                                               value={ typeof this.state.arrayPrecioTotal[i] == 'undefined' ? "" : this.state.arrayPrecioTotal[i]}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                                    <div className="input-group-content">
                                                        <a className="btn-content btn-danger-content hint--bottom "
                                                           aria-label="Eliminar" 
                                                           onClick={this.removeRowDetalle.bind(this,i)}
                                                           style={{ marginLeft:30}}>
                                                            <i className="fa fa-remove"> </i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <Divider/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-group-content col-lg-8-content">
                                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <textarea className="textarea-content" placeholder="Observaciones" style={{ height:200 }} value={this.state.observacionVenta} onChange={this.ventaObservacion.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group-content col-lg-3-content">
                                        <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{ }}>
                                            <div className="input-group-content">
                                                <label htmlFor="subtotal"  className="label-group-content"> Sub Total   </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input id="subtotal" type="text"
                                                       placeholder="Sub Total"
                                                       className='form-control-content'
                                                       value={this.state.subTotalVenta}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                            <div className="input-group-content">
                                                <label htmlFor="descuento"  className="label-group-content">% Desc   </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input id="descuento" type="text"
                                                       placeholder="descuento "
                                                       className='form-control-content'
                                                       value={this.state.descuentoVenta}
                                                       onChange={this.ventaDescuentoTotal.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                            <div className="input-group-content">
                                                <label htmlFor="descargo"  className="label-group-content">% Descargo   </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input id="descargo" type="text"
                                                       placeholder="descargo  ..."
                                                       className='form-control-content'
                                                       value={this.state.recargoVenta}
                                                       onChange={this.ventaRecargoTotal.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                            <div className="input-group-content">
                                                <label htmlFor="total"  className="label-group-content">Total   </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input 
                                                    id="total" 
                                                    type="text"
                                                    placeholder="total  ..."
                                                    className='form-control-content'
                                                    value={this.state.totalVenta}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-content">
                                <div className="text-center-content">
                                    
                                    <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <button 
                                            type="button" 
                                            className="btn-content btn-sm-content btn-danger-content"
                                            onClick={this.cambiarRegistroParteVehiculo.bind(this)}>
                                            Partes Vehiculo
                                        </button>
                                    </div>
                                    <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <button 
                                            type="submit" 
                                            className="btn-content btn-sm-content btn-success-content" 
                                            onClick={this.showConfirmStore.bind(this)}>
                                            Pagar
                                        </button>
                                    </div>
                                    <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <button 
                                            type="button" 
                                            className="btn-content btn-sm-content btn-danger-content"
                                            onClick={this.showConfirmCancel.bind(this)}>
                                            Cancelar
                                        </button>
                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>    
                
                <div className="card-body-content"
                     style={{'marginBottom': '5px',
                         'display': (this.state.mostrarOpcionParteVehiculo === 0)?'none':'block'}}>
                    
                    <CrearParteVehiculo
                        vehiculoParte={this.state.vehiculoParte}
                        cantidad={this.state.cantidadParteVehiculo}
                        estado={this.state.estadoParteVehiculo}
                        observacion={this.state.observacionParteVehiculo}
                        imagen={this.state.imagenParteVehiculo}
                        indice={this.state.indiceParteVehiculo}
                        vehiculoDelcliente={this.state.vehiculoSeleccionado}
                        cliente={this.state.clienteDataVenta2}
                        callback={this.getResultadoParteVehiculo.bind(this)}
                    />
                </div>
                </div>

                <div style={{
                        'display': (!this.state.mostrarCrearCliente)?'none':'block',
                        'marginTop': '-57px'
                    }}>
                    <CrearCliente
                        aviso={this.state.aviso}
                        callback={this.getResultadoCrearCliente.bind(this)}
                    />
                </div>

            </div>
        
        )
    }

}