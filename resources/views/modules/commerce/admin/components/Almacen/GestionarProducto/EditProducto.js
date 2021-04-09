import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import styles from './styles.css';
import { TreeSelect, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import { Redirect } from 'react-router-dom';

import { wsalmacen } from '../../../WS/webservices';

const URL_GET_MONEDAS = '/commerce/api/moneda';//
const URL_GET_FAMILIAS = '/commerce/api/familia';//
const URL_GET_PRODC_CARACTERISTICA = '/commerce/api/pcaracteristica';//
const URL_GET_UNIDAD_MEDIDAS = '/commerce/api/unidadmedida';//
const URL_EDIT_PRODUCTO = '/commerce/api/producto/';
const URL_UPDATE_PRODUCTO = '/commerce/api/producto/';
const URL_GET_ALMACENES = '/commerce/api/almacen';
const URL_GET_ALMACEN_UBICACION = '/commerce/api/almacenubi';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
  
export default class EditProducto extends Component {

    constructor(){
        super();
        this.state = {
            descripcion: '', 
            tipo: 'P',      
            palclaves: '',
            notas: '',
            idMoneda: 0,
            idFamilia: undefined,
            idUnidad: 0,
            producto: {},

            stock: 0,
            stockmin: 0,
            stockmax: 0,

            nameImages: [],
            images: [],
            fotos: [],
            fotosElim: [],
            indexImg: 0,
            indexInicio: 0,
            verAlmacenes: [],

            almacenes: [],
            idsAlmacen: [],
            dataStock: [],
            dataStockmin: [],
            dataStockmax: [],
            dataUbicacion: [],

            idsAlmaprodEli: [],
            almacenUbicaciones: [],
            arbolUbicaciones: [],
            auxiliar: [],

            monedas: [],
            familias: [],
            caracteristicas: [],
            unidadesMedidas: [],
            codigos: [],

            dataCaracteristicas: [],
            idsCaracActuales: [],
            idsCaracteristicasDel: [],

            mostrarListaCaract: false,
            activeIndex: 0,
            animating: false,
            imagenNoValida: false,
            isProducto: false,
            isProducto2: false,

            redirect: false,
            displayModalPrueba: false,
            mostrarTipo: true,
            modalImage: 'none',
            tecla: 0,
            eliminarAlmProd: [],
            cursorAllowed: ''
        }
        
    }
    
    obtenerMonedas() {
        axios.get(URL_GET_MONEDAS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                this.setState({
                    monedas: result.data
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    hijosFamilia(idpadre) {
        
        var array =  this.state.familias;
        
        var hijos = [];
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

    arbolFamilias(data) {

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                //console.log('id del producto ',data[i].value);
                //console.log('VALUE ',data[i].value);
                var hijos = this.hijosFamilia(data[i].value);
                //console.log('hijos');
                //console.log(hijos);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
    
                this.arbolFamilias(hijos);
            }
        }
        
    }

    obtenerFamilias() {

        axios.get(URL_GET_FAMILIAS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {

                this.setState({
                    familias: result.data,
                })

                var array = result.data;
                var array_aux = [];
                for(var i = 0; i < array.length; i++){
                    if(array[i].idpadrefamilia == null){
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idfamilia,
                            key: array[i].idfamilia
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolFamilias(array_aux);
                
                this.setState({
                    familias: array_aux,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerCaracteristicas() {

        axios.get(URL_GET_PRODC_CARACTERISTICA)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
               
                this.setState({
                    caracteristicas: result.data,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerUnidadesMedida() {
        axios.get(URL_GET_UNIDAD_MEDIDAS)
        .then((resp) => {
            let result = resp.data;
            if(result.response > 0 && result.data.length > 0){
                this.setState({
                    unidadesMedidas: result.data,
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerAlmacenes() {
        axios.get(wsalmacen)
        .then((resp) => {
            let result = resp.data;
            if(result.response > 0 && result.data.length > 0){
                let array = result.data;
                const nElem = 3;
                //const pid = array.length > 0 ? array[0].id : 0;
                let idsAlmacen = [];
                let arrayStock = [];
                let arrayStockmin = [];
                let arrayStockmax = [];
                let arrayUbicacion = [];
                let arbolUbicacion = [];
                
                for (let i = 0; i < nElem; i++) {
                    idsAlmacen.push(0);
                    arrayStock.push(0);
                    arrayStockmax.push(0);
                    arrayStockmin.push(0);
                    arrayUbicacion.push("Seleccione una opcion");
                    let arrayN = [];
                    arbolUbicacion.push(arrayN);
                }
                
                this.setState({
                    almacenes: array,
                    idsAlmacen: idsAlmacen,
                    dataStock: arrayStock,
                    dataStockmax: arrayStockmax,
                    dataStockmin: arrayStockmin,
                    dataUbicacion: arrayUbicacion,
                    arbolUbicaciones: arbolUbicacion
                });
                console.log("ARRAYS");
                console.log(this.state.idsAlmacen);
                console.log(this.state.dataStock);
                console.log(this.state.dataStockmin);
                console.log(this.state.dataStockmax);
                console.log(this.state.dataUbicacion);
                
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerAlmacenUbicaciones() {
        axios.get(URL_GET_ALMACEN_UBICACION)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                console.log('DATA UBI',result.data);
                this.setState({
                    almacenUbicaciones: result.data
                });

            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    hijosUbicaciones(idpadre, array) {
        
        //var array =  this.state.familias;
        
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            
            if (array[i].fkidalmacenubicacion == idpadre) {
                const elemento = {
                    title: array[i].descripcion,
                    value: array[i].idalmacenubicacion,
                    key: array[i].idalmacenubicacion
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    arbolUbicaciones(data, array) {

        if (data.length > 0) {

            for (var i = 0; i < data.length; i++) {
                //console.log('id del producto ',data[i].value);
                //console.log('VALUE ',data[i].value);
                var hijos = this.hijosUbicaciones(data[i].value, array);
                //console.log('hijos');
                //console.log(hijos);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
    
                this.arbolUbicaciones(hijos, array);
            }
        }
        
    }

    generarArbolAlmacen(idalmacen, index) {

        let data = this.state.almacenUbicaciones;
        let array = [];
        for (let i = 0; i < data.length; i++) {

            if (data[i].fkidalmacen == idalmacen) {
                array.push(data[i]);
            }
        }

        let newArray = [];
        for (let i = 0; i < array.length; i++) {

            if (array[i].fkidalmacenubicacion == null) {
                let elemento = {
                    title: array[i].descripcion,
                    value: array[i].idalmacenubicacion,
                    key: array[i].idalmacenubicacion
                };
                newArray.push(elemento);
            }
        }

        this.arbolUbicaciones(newArray, data);
        console.log('Arbol de Ubicaciones',newArray);
        this.state.arbolUbicaciones[index] = newArray;

        this.setState({
            arbolUbicaciones: this.state.arbolUbicaciones
        });

    }

    cargarCaracteristicas(data) {
        
        let idsActuales = [];
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let elem = {
                idpc: data[i].idprodcaracteristica,
                descripcion: data[i].descripcion,
                idpcd: data[i].iddetallecaract
            };
            array.push(elem);
            idsActuales.push(data[i].iddetallecaract);
        }
        
        console.log('LOS Ids orgi',idsActuales);
        console.log('DATA ',array);
        this.setState({
            dataCaracteristicas: array,
            idsCaracActuales: idsActuales
        });
    }
    
    obtenerProducto() {

        const URL = URL_EDIT_PRODUCTO + this.props.match.params.id + "/edit";
        axios.get(URL)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP SERVER ',result);
            if (result.response > 0) {

                this.cargarCaracteristicas(result.caracteristicas);
                console.log(result.producto.tipo);
                let isPro = false;
                let classCursorAllowed = 'cursor-not-allowed';
                if (result.producto.tipo == 'P') {
                    isPro = true;
                    classCursorAllowed = '';
                }

                let idsAlmacen = [];
                let arrayStock = [];
                let arrayStockmin = [];
                let arrayStockmax = [];
                let arrayUbicacion = [];
                let arbolUbicacion = [];
                let arrayAuxiliar = [];
                let eliminarAlmProd = [];
                let array = result.almacenes;
                for (let i = 0; i < array.length; i++) {
                    idsAlmacen.push(parseFloat(array[i].idalmacen));
                    arrayStock.push(parseFloat(array[i].stock));
                    arrayStockmax.push(parseFloat(array[i].stockmaximo));
                    arrayStockmin.push(parseFloat(array[i].stockminimo));
                    let ubicacion = array[i].ubicacion == null ? 'Selecione una opcion' : array[i].ubicacion.idalmacenubicacion;
                    arrayUbicacion.push(ubicacion);
                    arbolUbicacion.push([]);
                    this.generarArbolAlmacen(array[i].idalmacen, i);
                    arrayAuxiliar.push(array[i].idalmacenprod);
                    eliminarAlmProd.push(array[i].eliminar);
                }

                let indexInicio = result.producto.foto.length;
                this.setState({
                    stock: result.producto.stock,
                    stockmin: result.producto.stockminimo,
                    stockmax: result.producto.stockmaximo,
                    producto: result.producto,
                    idUnidad: result.producto.fkidunidadmedida,
                    idMoneda: result.producto.fkidmoneda,
                    idFamilia: result.producto.fkidfamilia,
                    descripcion: result.producto.descripcion,
                    notas: result.producto.notas == null ? '' : result.producto.notas,
                    palclaves: result.producto.palabrasclaves == null ? '' : result.producto.palabrasclaves,
                    tipo: result.producto.tipo,
                    fotos: result.producto.foto,
                    indexInicio: indexInicio,
                    codigos: result.producto.codigos,
                    isProducto: isPro,
                    isProducto2: isPro,
                    verAlmacenes: result.almacenes,
                    costo: result.producto.costo,
                    precio: result.producto.precio,
                    idsAlmacen: idsAlmacen,
                    dataStock: arrayStock,
                    dataStockmax: arrayStockmax,
                    dataStockmin: arrayStockmin,
                    dataUbicacion: arrayUbicacion,
                    auxiliar: arrayAuxiliar,
                    eliminarAlmProd: eliminarAlmProd,
                    cursorAllowed: classCursorAllowed
                    //arbolUbicaciones: arbolUbicacion
                });

            } else {
                
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.obtenerAlmacenUbicaciones();
        this.obtenerAlmacenes();
        this.obtenerProducto();
        this.obtenerCaracteristicas();
        this.obtenerFamilias();
        this.obtenerMonedas();
        this.obtenerUnidadesMedida();
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
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

    componentWillMount() {
        //console.log('PROPS ',this.props);
    }

    getIndexSeleccionadosAlmacen() {
        let data = this.state.idsAlmacen;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] != 0) {
                array.push(i);
            }
        }
        return array;
    }

    validarDatosAlmacen() {
        let array_ids = this.state.idsAlmacen;
        let array_stock = this.state.dataStock;
        let array_stockmin = this.state.dataStockmin;
        let array_stockmax = this.state.dataStockmax;
        let array_ubicacion = this.state.dataUbicacion;
        
        for (let i = 0; i < array_stock.length; i++) {

            let string_id = array_ids[i];
            let string_stock = array_stock[i];
            let string_stockmin = array_stockmin[i];
            let string_stockmax = array_stockmax[i];
            let string_ubicacion = array_ubicacion[i];
            
            if (string_id == 0 && (string_stock.length > 0 || string_stockmax.length > 0 
                || string_stockmin.length > 0 || string_ubicacion.length > 0)) {

                message.error("Error al guardar, debe seleccionar una opcion si escribe en algun campo");
                return false;    

            } else if (string_id !== 0 && (string_stock.length === 0 || string_stockmax.length === 0 
                || string_stockmin.length === 0 || string_ubicacion.length === 0)) {

                message.error("Error al guardar, debe completar los campos vacios");
                return false;

            }

            return true;

        }
    }
    
    validarDatos() {
        let codproducto = this.state.codproducto;
        let descripcion = this.state.descripcion;
        if (descripcion.length === 0) {
            message.error('El campo Descripcion no debe quedar vacio');
            return false;
        }
        return true; 
    }

    getNewCaracteristicas(dataIds, dataValues, dataIdsNew, dataValuesNew) {
        
        let i = 0;
        let array = this.state.dataCaracteristicas;
        let length = array.length
        while (i < length && array[i].idpcd >= 0) {
            if (array[i].descripcion !== "") {
                dataIds.push(array[i].idpc);
                dataValues.push(array[i].descripcion);
            }
            i++;
        }

        while (i < length) {
            if (array[i].descripcion !== "") {
                dataIdsNew.push(array[i].idpc);
                dataValuesNew.push(array[i].descripcion);
            }
            i++;
        }
       
        console.log('Nuevos elementos insertados');
        console.log('IDS CARACT ',dataIds);
        console.log('Values ', dataValues);
        console.log('IDS CARACT NEW ',dataIdsNew);
        console.log('Values NEW ', dataValuesNew);
    }

    editarProducto(e) {

        e.preventDefault();

        if(!this.validarDatos()) return;
        
        var body = {
            descripcion: this.state.descripcion,
            costo: this.state.costo,
            precio: this.state.precio,
            tipo: this.state.tipo,
            palclaves: this.state.palclaves,
            notas: this.state.notas,
            idMoneda: this.state.idMoneda,
            idFamilia: this.state.idFamilia,
            idUnidad: this.state.idUnidad,
            stock: this.state.stock,
            stockmax: this.state.stockmax,
            stockmin: this.state.stockmin
        };
            
        body.nameImages = JSON.stringify(this.state.nameImages);
        body.images = JSON.stringify(this.state.images);
        body.fotosEliminados = JSON.stringify(this.state.fotosElim);

        //console.log("valor devuelto ",array);
        let dataIds = [];
        let dataValues = [];
        let dataIdsNew = [];
        let dataValuesNew = [];
        this.getNewCaracteristicas(dataIds, dataValues, dataIdsNew, dataValuesNew);
        body.idsCaracteristicas = JSON.stringify(dataIds);
        body.valuesCaracteristicas = JSON.stringify(dataValues);
        body.idsCaracteristicasNew = JSON.stringify(dataIdsNew);
        body.valuesCaracteristicasNew = JSON.stringify(dataValuesNew);
        body.idsEliminarDet = JSON.stringify(this.state.idsCaracteristicasDel);
        body.idsCaracteristicasAct = JSON.stringify(this.state.idsCaracActuales);

        var array = this.getIndexSeleccionadosAlmacen();
        if (array.length === 0) {
            message.error('El producto o servicion debe estar por lo menos en un almacen');
            return;
        }
        if (this.state.tipo == 'P') {
            let arrayIdsAlmacen = [];
            let arrayStocks = [];
            let arrayStocksMin = [];
            let arrayStocksMax = [];
            let arrayUbicaciones = [];
            let auxiliar = [];
            console.log('AUXILIAR', this.state.auxiliar);
            for (let i = 0; i < array.length ;i++) {
                let stock = this.state.dataStock[array[i]] == '' ? 0 : parseFloat(this.state.dataStock[array[i]]);
                let stockmin = this.state.dataStockmin[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmin[array[i]]);
                let stockmax =  this.state.dataStockmax[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmax[array[i]]);

                arrayIdsAlmacen.push(this.state.idsAlmacen[array[i]]);
                arrayStocks.push(stock);
                arrayStocksMax.push(stockmax);
                arrayStocksMin.push(stockmin);
                arrayUbicaciones.push(this.state.dataUbicacion[array[i]]);
                console.log('PUSH ', this.state.auxiliar[array[i]]);
                auxiliar.push(this.state.auxiliar[array[i]]);
            }
            
            body.dataIdsAlmacen = JSON.stringify(arrayIdsAlmacen);
            body.dataStocks = JSON.stringify(arrayStocks);
            body.dataStocksMax = JSON.stringify(arrayStocksMax);
            body.dataStocksMin = JSON.stringify(arrayStocksMin);
            body.dataUbicaciones = JSON.stringify(arrayUbicaciones);
            body.auxiliar = JSON.stringify(auxiliar);
            body.idsAlmaprodEli = JSON.stringify(this.state.idsAlmaprodEli);

        } else {
            var array = this.getIndexSeleccionadosAlmacen();
            let arrayIdsAlmacen = [];
            let auxiliar = [];
            for (let i = 0; i < array.length; i++) {
                arrayIdsAlmacen.push(this.state.idsAlmacen[array[i]]);
                auxiliar.push(this.state.auxiliar[array[i]]);
            }
            body.dataIdsAlmacen = JSON.stringify(arrayIdsAlmacen);
            body.auxiliar = JSON.stringify(auxiliar);
            body.idsAlmaprodEli = JSON.stringify(this.state.idsAlmaprodEli);
        }
        console.log('BODY');
        console.log(body);
        //return;
        let URL = URL_UPDATE_PRODUCTO + this.state.producto.idproducto;
        //console.log(URL);
        
        axios.put(URL,body)
        .then((resp) => {
            console.log('RESP SERVER EDIT');
            console.log(resp.data);
            let result = resp.data;
            
            if (result.response > 0) {
                this.setState({
                    redirect: true
                });
                message.success(result.message);
            } else {
                message.error(result.message);
            }

        })
        .catch((error) => {
            console.log(error);
            message.error('Ha ocurrido un problema con la conexion, por favor vuelva a cargar la pagina');
        })
        
    }

    cambioAlmacen(e) {
        /*
        let index = e.target.id;
        let valor = parseInt(e.target.value);
        this.state.idsAlmacen[index] = valor;
        console.log(this.state.idsAlmacen);
        
        this.generarArbolAlmacen(valor, index);
        */
        let index = e.target.id;
        if (index >= this.state.verAlmacenes.length) {
            let valor = parseInt(e.target.value);
            let position = this.state.idsAlmacen.indexOf(valor);
            if (position >= 0 && valor != 0) {
                message.warning('El almacen ya fue seleccionado');
                return;
            }
            if (valor == 0) {
                this.state.dataStock[index] = '';
                this.state.dataStockmin[index] = '';
                this.state.dataStockmax[index] = '';
                this.state.dataUbicacion[index] = "Seleccione una opcion";
                this.state.arbolUbicaciones[index] = [];
            }
            this.state.idsAlmacen[index] = valor;
            console.log(this.state.idsAlmacen);
            this.generarArbolAlmacen(valor, index);
        }
        
    }

    sumar(data) {
        
        let sumaTotal = 0;
        for (let i = 0; i < data.length; i++) {

            if (!isNaN(data[i])) {
                sumaTotal = sumaTotal + data[i];
            }
        }

        return sumaTotal;
    }

    cambioInputAStock(e) {
        let index = e.target.id;
        let valor = parseFloat(e.target.value);
        
        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }        
        this.state.dataStock[index] = valor;
        let totalStock = this.sumar(this.state.dataStock);
        this.setState({
            dataStock: this.state.dataStock,
            stock: totalStock
        })
        console.log(this.state.stock);
       
    }

    cambioInputAStockMin(e) {
        console.log(e.target.value);
        let index = e.target.id;
        let valor = parseFloat(e.target.value);
        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        this .state.dataStockmin[index] = valor;
        let totalStockMin = this.sumar(this.state.dataStockmin);
        this.setState({
            dataStockmin: this.state.dataStockmin,
            stockmin: totalStockMin
        })
       
    }

    cambioInputAStockMax(e) {
        let index = e.target.id;
        let valor = parseFloat(e.target.value);

        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        this .state.dataStockmax[index] = valor;
        let totalStockMax = this.sumar(this.state.dataStockmax);
        this.setState({
            dataStockmax: this.state.dataStockmax,
            stockmax: totalStockMax
        })
       
    }

    cambioInputAUbicacion(index, value) {
        if(!this.state.isProducto) return;
        console.log('INDEX ',index);
        console.log('VALUE ',value);
        this .state.dataUbicacion[index] = value;

        console.log("array Ubicacion",this.state.dataUbicacion);

        this.setState({
            dataUbicacion: this.state.dataUbicacion
        })
       
    }

    cambioDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        })
    }

    cambioTipo(e) {
        if (e.target.value == "P") {
            this.setState({
                isProducto: true,
                tipo: e.target.value,
                cursorAllowed: ''
            })
        } else {
            this.setState({
                tipo: e.target.value,
                isProducto: false,
                cursorAllowed: 'cursor-not-allowed'
            })
        }
    }

    cambioPrecio(e) {
        this.setState({
            precio: e.target.value
        });
    }

    cambioCosto(e) {
        this.setState({
            costo: e.target.value
        });
    }

    cambioPalClaves(e) {
        this.setState({
            palclaves: e.target.value
        })
    }

    cambioNotas(e) {
        this.setState({
            notas: e.target.value
        })
    }

    cambioMoneda(e) {
        console.log(e.target.value);
        this.setState({
            idMoneda: e.target.value
        })
    }

    cambioFamilia(value) {
        this.setState({
            idFamilia: value
        })
    }

    cambioCaracteristica(e) {
        
        let index = e.target.id;
        let valor = e.target.value;
        console.log('index',index);
        console.log('valor',valor);
        this.state.dataCaracteristicas[index].idpc = parseInt(valor);
        console.log(this.state.dataCaracteristicas);
        this.setState({
            dataCaracteristicas: this.state.dataCaracteristicas
        })
    }
    
    cambioInputC(e) {
        let index = e.target.id;
        let valor = e.target.value;
        this.state.dataCaracteristicas[index].descripcion = valor;

        console.log("array ",this.state.dataCaracteristicas);
        this.setState({
            dataCaracteristicas: this.state.dataCaracteristicas
        });
    }


    sumar(data) {
        
        let sumaTotal = 0;
        for (let i = 0; i < data.length; i++) {

            if (!isNaN(data[i])) {
                sumaTotal = sumaTotal + data[i];
            }
        }

        return sumaTotal;
    }

    cambioUnidad(e) {
        this.setState({
            idUnidad: e.target.value
        });
    }

    selectImg(e) {
        console.log(e.target.files[0]);
        let type = e.target.files[0].type;
        if (type !== "image/jpeg" && type !== "image/png") {
            this.setState({
                imagenNoValida: true
            })
        } else {
            this.setState({
                imagenNoValida: false
            })
            let name = e.target.files[0].name;
            this.createImage(e.target.files[0],name);
        }
    }

    createImage(file,name) {

        let reader = new FileReader();

        reader.onload = (e) => {

            console.log("result ",e.target);
            const item = {
                src: e.target.result,
                altText: name,
                caption: name
            };
            const newIndex = this.state.fotos.length;
            let object = {
                foto: e.target.result
            };
            this.setState({
                nameImages: [
                    ...this.state.nameImages,
                    file.name
                ],
                images: [
                    ...this.state.images,
                    e.target.result
                ],
                fotos: [
                    ...this.state.fotos,
                    object
                ],
                indexImg: newIndex
            });
        
            //console.log("array de las imagenes");
            //console.log(this.state.images);
            //console.log("nombres de las imagenes");
            //console.log(this.state.nameImages);
            //console.log('Index ',this.state.indexImg);
        };
        reader.readAsDataURL(file);
    }

    siguienteImg() {

        if (this.state.fotos.length > 1) {
            var index = this.state.indexImg;
            var ultimo = this.state.fotos.length - 1;

            if (index === ultimo) {
                index = 0;
            } else {
                index++;
            }
            this.setState({
                indexImg: index
            })
            console.log(this.state.indexImg);
        }
        
    }

    anteriorImg() {
        
        if (this.state.fotos.length > 1) {
            var index = this.state.indexImg;
            let ultimo = this.state.fotos.length - 1;
    
            if (index === 0) {
                index = ultimo;
            } else {
                index--;
            }
            this.setState({
                indexImg: index
            });
        }
        
    }


    componentImg() {
        //console.log(this.state.fotos);
        if (this.state.fotos.length === 0) {
            return (
                <img 
                    src='/images/default.jpg'
                    alt="none" className="img-principal" />
            )
            
        } else {
            return (
                <img 
                    style={{'cursor': 'pointer'}}
                    src={this.state.fotos[this.state.indexImg].foto}
                    onClick={this.abrirModalImage.bind(this)}
                    alt="none" className="img-principal" />
            )
        }
    }

    componentImgModal() {
        return (
            <div className="content-img">
                <i className="fa fa-times fa-delete-image" onClick={this.cerrarModalImage.bind(this)}> </i>
                {(this.state.fotos.length === 0)?'':
                    <img src={this.state.fotos[this.state.indexImg].foto}
                        alt="none" className="img-principal"
                        style={{'objectFit': 'fill', 'borderRadius': '8px'}} />
                }
                {(this.state.fotos.length > 1)?
                <div className="pull-left-content">
                    <i onClick={this.siguienteImg.bind(this)}
                        className="fa-left-content fa fa-angle-double-left"> </i>
                </div>:''
                }
                {(this.state.fotos.length > 1)?
                    <div className="pull-right-content">
                        <i onClick={this.anteriorImg.bind(this)}
                            className="fa-right-content fa fa-angle-double-right"> </i>
                    </div>:''
                }
            </div>
        )
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

    eliminarFilaCaract(index) {
        console.log('INDEX', index);
        let array = this.state.dataCaracteristicas;
        console.log('IDPCD ', array[index].idpcd);
        if (array[index].idpcd > 0) {
            this.state.idsCaracteristicasDel.push(array[index].idpcd);
            let position = this.state.idsCaracActuales.indexOf(array[index].idpcd);
            if (position >= 0) {
                this.state.idsCaracActuales.splice(position, 1);
            }
        }
        this.state.dataCaracteristicas.splice(index,1);
        console.log('DATA ',this.state.dataCaracteristicas);
        console.log('ACTUALES ', this.state.idsCaracActuales);

        this.setState({
            idsCaracteristicasDel: this.state.idsCaracteristicasDel,
            dataCaracteristicas: this.state.dataCaracteristicas,
            idsCaracActuales: this.state.idsCaracActuales
        });
        
    }

    deleteImgIndex() {
        
        var index = this.state.indexImg;
        //console.log('IDPRODUCTO FOTO ',this.state.fotos[index].idproductofoto);
        if (this.state.fotos[index].idproductofoto == undefined) {

            console.log('ES UNA NUEVA FOTO');
            let indexElim = index - this.state.indexInicio;
            this.state.nameImages.splice(indexElim, 1);
            this.state.images.splice(indexElim, 1);

        } else {
            this.state.fotosElim.push(this.state.fotos[index].idproductofoto);
        }

        this.state.fotos.splice(index,1);

        if (index === this.state.fotos.length) {
            index = 0;
        }

        this.setState({
            fotos: this.state.fotos,
            nameImages: this.state.nameImages,
            images: this.state.images,
            indexImg: index,
            fotosElim: this.state.fotosElim
        });
        console.log('FOTOS ',this.state.fotos);
        console.log('NAMES IMAGES ', this.state.nameImages);
        console.log('IMAGES ',this.state.images);

    }

    showConfirmEdit() {
        confirm({
          title: 'Editar Producto',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
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

    iconZoom() {
        if (this.state.nameImages.length > 0) {
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

    openModalPrueba() {
        this.setState({displayModalPrueba: true})
    }

    closeModalPrueba() {
        this.setState({displayModalLPrecios: false})
    }

    addRowAlmacen() {

        this.state.idsAlmacen.push('');
        this.state.dataStock.push('');
        this.state.dataStockmax.push('');
        this.state.dataStockmin.push('');
        this.state.dataUbicacion.push("Seleccione una opcion");
        this.state.arbolUbicaciones.push([]);
        this.state.auxiliar.push('');

        this.setState({
            idsAlmacen: this.state.idsAlmacen,
            dataStock: this.state.dataStock,
            dataStockmax: this.state.dataStockmax,
            dataStockmin: this.state.dataStockmin,
            dataUbicacion: this.state.dataUbicacion,
            arbolUbicaciones: this.state.arbolUbicaciones,
            auxiliar: this.state.auxiliar
        });

    }

    eliminarFilaAlmacen(index) {

        if (this.state.eliminarAlmProd[index] == 0) {
            message.error('No se puede eliminar el registro, este ya esta siendo usado');
            return;
        }
        if (this.state.auxiliar[index] != 0) {
            this.state.idsAlmaprodEli.push(this.state.auxiliar[index]);
            this.state.verAlmacenes.splice(index, 1);
            this.state.eliminarAlmProd.splice(index, 1);
        }

        this.state.idsAlmacen.splice(index, 1);
        this.state.dataStock.splice(index, 1);
        this.state.dataStockmax.splice(index, 1);
        this.state.dataStockmin.splice(index, 1);
        this.state.dataUbicacion.splice(index, 1);
        this.state.arbolUbicaciones.splice(index, 1);
        this.state.auxiliar.splice(index, 1);
        let totalStock = this.sumar(this.state.dataStock);
        let totalStockMax = this.sumar(this.state.dataStockmax);
        let totalStockMin = this.sumar(this.state.dataStockmin);
        this.setState({
            idsAlmacen: this.state.idsAlmacen,
            dataStock: this.state.dataStock,
            dataStockmax: this.state.dataStockmax,
            dataStockmin: this.state.dataStockmin,
            dataUbicacion: this.state.dataUbicacion,
            arbolUbicaciones: this.state.arbolUbicaciones,
            auxiliar: this.state.auxiliar,
            verAlmacenes: this.state.verAlmacenes,
            stock: totalStock,
            stockmax: totalStockMax,
            stockmin: totalStockMin
        });
    }

    componentStockAlmacen() {
        
        //if (this.state.isProducto) {
            //if (this.state.isProducto2) {
                return (
                    <div className="form-group-content col-lg-11-content margin-group-content">
    
                        <div className="pull-left-content">
                            <h2 className="title-logo-content"> Stock por Almacen</h2>
                        </div>
                        <div className="pull-right-content">
                            <i 
                                className="fa fa-plus btn-content btn-secondary-content"
                                onClick={() => this.addRowAlmacen()}
                                style={{
                                    marginRight: 42,
                                    marginTop: 15
                                }}
                            > 
                            </i>
                        </div>
    
                        <div className="row col-lg-12-content">
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Almacen</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock Minimo</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock Maximo</h4>
                            </div>
    
                            <div className="col col-lg-3-content text-center-content">
                                <h4>Ubicacion</h4>
                            </div>

                            <div className="col col-lg-1-content text-center-content">
                                <h4>Accion</h4>
                            </div>
                        </div>
    
                        <div className="caja-content">
    
                            {
                                this.state.idsAlmacen.map((item, key) => {
                                    let ubicacion = item.ubicacion == undefined ? '' : item.ubicacion.descripcion;
                                    return (
                                        <div 
                                            key={key} 
                                            className="col-lg-12-content"
                                            style={{ marginTop: -5, marginBottom: -5 }}
                                        >
                                            <div className="col-lg-2-content">
                                                <select
                                                    id={key}
                                                    style={{margin:10, height:30}}
                                                    className="form-control-content"
                                                    value={this.state.idsAlmacen[key]}
                                                    onChange={this.cambioAlmacen.bind(this)}
                                                >
                                                    <option value="0">Seleccionar</option>
                                                    {this.state.almacenes.map((item,key)=>(
                                                        <option 
                                                            value={item.idalmacen}
                                                            key={key}>{item.descripcion}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
        
                                            <div className="col-lg-2-content">
                                                <input
                                                    id={key}
                                                    type="number" 
                                                    style={{ margin:10 }}
                                                    className={"form-control-content" + " " + this.state.cursorAllowed}
                                                    value={this.state.dataStock[key]}
                                                    onChange={this.cambioInputAStock.bind(this)}
                                                    readOnly={!this.state.isProducto}
                                                />
                                            </div>
        
                                            <div className="col-lg-2-content">
                                                <input
                                                    id={key}
                                                    type="number" 
                                                    style={{ margin:10 }}
                                                    className={"form-control-content" + " " + this.state.cursorAllowed}
                                                    value={this.state.dataStockmin[key]}
                                                    onChange={this.cambioInputAStockMin.bind(this)}
                                                    readOnly={!this.state.isProducto}
                                                />
                                            </div>
        
                                            <div className="col-lg-2-content">
                                                <input
                                                    id={key}
                                                    type="number" 
                                                    style={{ margin:10 }}
                                                    className={"form-control-content" + " " + this.state.cursorAllowed}
                                                    value={this.state.dataStockmax[key]}
                                                    onChange={this.cambioInputAStockMax.bind(this)}
                                                    readOnly={!this.state.isProducto}
                                                />
                                            </div>
        
                                            <div className="col-lg-3-content">
                                                <TreeSelect
                                                    key={key}
                                                    style={{ width: 150, marginTop: 12, marginLeft: 30 }}
                                                    value={this.state.dataUbicacion[key]}
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    treeData={this.state.arbolUbicaciones[key]}
                                                    placeholder="Ubicacion"
                                                    //treeDefaultExpandAll
                                                    onChange={this.cambioInputAUbicacion.bind(this,key)}
                                                />
                                            </div>
                                            <div className="col-lg-1-content col-md-3-content col-sm-2-content col-xs-2-content">
                                                <i
                                                    className="fa fa-remove btn-content btn-danger-content"
                                                    style={{ marginTop: 15 }}
                                                    onClick={() => this.eliminarFilaAlmacen(key)}
                                                >
                                                </i>
                                            </div>
                                        </div>
                                    )
                                })
                            }
    
                        </div>
                    </div>
    
                );
            /*    
            } else {
                return (
                    <div className="form-group-content col-lg-10-content margin-group-content">
    
                        <div className="form-group-content col-lg-12-content">
    
                            <div className="pull-left-content">
                                <h2 className="title-logo-content"> Stock por Almacen </h2>
                            </div>
    
                            <div className="pull-right-content">
                                <i 
                                    className="fa fa-plus btn-content btn-secondary-content" 
                                    onClick={() => this.addRowAlmacen() }> 
                                </i>
                            </div>
                        </div>
                        
    
                        <div className="row col-lg-12-content">
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Almacen</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock Minimo</h4>
                            </div>
    
                            <div className="col col-lg-2-content text-center-content">
                                <h4>Stock Maximo</h4>
                            </div>
    
                            <div className="col col-lg-3-content text-center-content">
                                <h4>Ubicacion</h4>
                            </div>

                            <div className="col col-lg-1-content text-center-content">
                                <h4>Accion</h4>
                            </div>
                        </div>
    
                        <div className="caja-content">
    
                            {
                                this.state.idsAlmacen.map((item, key) => (
                                    <div key={key} className="col-lg-12-content">
                                        <div className="col-lg-2-content">
                                            <select 
                                                style={{margin:10, height:30}}
                                                key={key}
                                                id={key}
                                                className="form-control-content"
                                                value={this.state.idsAlmacen[key]}
                                                onChange={this.cambioAlmacen.bind(this)}>
    
                                                <option value="0">Seleccionar</option>
                                                {this.state.almacenes.map((item,key)=>(
                                                    <option 
                                                        value={item.idalmacen}
                                                        key={key}>{item.descripcion}
                                                    </option>
                                                ))}
                                                
                                            </select>
                                        </div>
    
                                        <div className="col-lg-2-content">
                                            <input
                                                id={key} 
                                                type="number" 
                                                style={{ margin:10 }}
                                                key={key}
                                                value={this.state.dataStock[key]}
                                                className="form-control-content"
                                                onChange={this.cambioInputAStock.bind(this)} 
                                            />
                                        </div>
    
                                        <div className="col-lg-2-content">
                                            <input
                                                id={key} 
                                                type="number" 
                                                style={{ margin:10 }}
                                                key={key}
                                                value={this.state.dataStockmin[key]}
                                                className="form-control-content"
                                                onChange={this.cambioInputAStockMin.bind(this)} 
                                            />
                                        </div>
    
                                        <div className="col-lg-2-content">
                                            <input
                                                id={key} 
                                                type="number" 
                                                style={{ margin:10 }}
                                                key={key}
                                                value={this.state.dataStockmax[key]}
                                                className="form-control-content"
                                                onChange={this.cambioInputAStockMax.bind(this)} 
                                            />
                                        </div>
    
                                        <div className="col-lg-3-content">
                                            <TreeSelect
                                                style={{ width: 150,marginTop: 12 }}
                                                value={this.state.dataUbicacion[key]}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={this.state.arbolUbicaciones[key]}
                                                placeholder="Porfavor Seleccione una opcion"
                                                //treeDefaultExpandAll
                                                onChange={this.cambioInputAUbicacion.bind(this,key)}
                                            />
                                        </div>
                                        <div className="col-lg-1-content">
                                            <i
                                                className="fa fa-remove btn-content btn-danger-content"
                                                onClick={() => this.eliminarFilaAlmacen(key)}
                                            ></i>
                                        </div>
    
                                    </div>
                                ))
                            }
    
                        </div>
                    </div>
    
                );
            }*/
        /*    
        } else {

            return null;

        }
        */
    }

    componentStock() {

        if (this.state.isProducto) {
            if (this.state.isProducto2) {
                return (
                    <div className="form-group-content col-lg-10-content margin-group-content">
    
                        <div className="pull-left-content">
                            <h2 className="title-logo-content">Totales Stock</h2>
                        </div>
    
                        <div className="row col-lg-12-content">
                            <div className="input-group-content col-lg-4-content">
                                <input id="stock" type="number"
                                    value={this.state.stock} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stock" 
                                    className="label-content">
                                    Stock Total
                                </label>
                            </div>
    
                            <div className="input-group-content col-lg-4-content">
                                <input id="stockmin" type="number"
                                    value={this.state.stockmin} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stockmin" 
                                    className="label-content">
                                    Stock Minimo
                                </label>
                            </div>
    
                            <div className="input-group-content col-lg-4-content">
                                <input id="stockmax" type="number"
                                    value={this.state.stockmax} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stockmax" 
                                    className="label-content">
                                    Stock Maximo
                                </label>
                            </div>
                        </div>
                    </div>
    
                );
            } else {
                return (
                    <div className="form-group-content col-lg-10-content margin-group-content">
    
                        <div className="pull-left-content">
                            <h2 className="title-logo-content">Totales Stock</h2>
                        </div>
    
                        <div className="row col-lg-12-content">
    
                            <div className="input-group-content col-lg-4-content">
    
                                <input id="stock" type="number"
                                    value={this.state.stock} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stock" 
                                    className="label-content">
                                    Stock Total
                                </label>
    
                            </div>
    
                            <div className="input-group-content col-lg-4-content">
    
                                <input id="stockmin" type="number"
                                    value={this.state.stockmin} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stockmin" 
                                    className="label-content">
                                    Stock Minimo
                                </label>
    
                            </div>
    
                            <div className="input-group-content col-lg-4-content">
    
                                <input id="stockmax" type="number"
                                    value={this.state.stockmax} 
                                    className="form-control-content cursor-not-allowed"
                                    readOnly
                                />
                                <label 
                                    htmlFor="stockmax" 
                                    className="label-content">
                                    Stock Maximo
                                </label>
    
                            </div>
    
    
                        </div>
                    </div>
    
                );
            }
            

        } else {

            return null;

        }
    }
    
    render() {

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/indexProducto/"/>
            );
        }
        const componentImg = this.componentImg();
        const iconDelete = this.iconDelete();
        const iconZoom = this.iconZoom();
        const componentStockAlmacen = this.componentStockAlmacen();
        const componentStock = this.componentStock();
        const componentImage = this.componentImgModal();
        return (

            <div>
                
                <div 
                    className="divFormularioImagen" 
                    style={{'display': this.state.modalImage}}
                >
                     {componentImage}
                </div>

                <div 
                    className="divModalImagen" 
                    onClick={this.cerrarModalImage.bind(this)}
                    style={{'display': this.state.modalImage}}
                >  
                </div>

                <Modal
                    title="Basic Modal"
                    visible={this.state.displayModalPrueba}
                    onOk={this.closeModalPrueba}
                    onCancel={this.closeModalPrueba}
                >
                    <p>hola mundo</p>
                </Modal>


                <div className="row-content">

                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Editar Producto </h1>
                        </div>
                    </div>
                    
                    <form 
                        id="form_register"
                        className="formulario-content" 
                        encType="multipart/form-data"
                        onSubmit={this.editarProducto.bind(this)}
                    >
    
                        <div className="form-group-content col-lg-12-content">
                            <div className="col-lg-9-content">

                                <div className="col-lg-12-content">
                                    <div className="input-group-content col-lg-3-content">
                                        <input id="codigo" type="text"
                                            value={this.state.producto.codproducto}
                                            className="form-control-content cursor-not-allowed"
                                            readOnly
                                        />
                                        <label
                                            htmlFor="codigo"
                                            className="label-group-content"> Codigo Prod 
                                        </label>
                                    </div>

                                    {
                                        this.state.codigos.map((item, key) => (
                                            <div key={key} className="text-center-content col-lg-3-content">
                                                <input 
                                                    type="text"
                                                    value={item.codproduadi}
                                                    placeholder="Codigo Prod"
                                                    onChange={()=>console.log('hola')}
                                                    className="form-control-content cursor-not-allowed"
                                                    readOnly
                                                />
                                                <label
                                                    htmlFor={key}
                                                    className="label-group-content"
                                                >
                                                    {item.descripcion}
                                                </label>
                                            </div>
                                        ))
                                    }

                                </div>

                                <div className="col-lg-12-content">
                                    <div className="col-lg-4-content">
                                        <select
                                            id="tipo"
                                            value={this.state.tipo}
                                            className="form-control-content cursor-not-allowed"
                                            onChange={this.cambioTipo.bind(this)}
                                            disabled={this.state.isProducto2}
                                            disabled
                                        >
                                            <option value="P">Producto</option>
                                            <option value="S">Servicio</option>
                                        </select>
                                        <label 
                                            htmlFor="tipo" 
                                            className="label-content">
                                            Tipo 
                                        </label>
                                    </div>

                                    <div className="col-lg-8-content">
                                        <input id="placa" type="text"
                                            value={this.state.descripcion} 
                                            placeholder="Descripcion de Producto" 
                                            onChange={this.cambioDescripcion.bind(this)}
                                            className="form-control-content"
                                        />
                                        <label 
                                            htmlFor="placa" 
                                            className="label-content">
                                            Descripcion 
                                        </label>
                                    </div>
                                </div>
                                

                                <div className="col-lg-4-content">
                                    <div className="col-lg-4-content">
                                        <TreeSelect
                                            style={{ width: 220 }}
                                            value={this.state.idFamilia}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.familias}
                                            placeholder="Seleccione una opcion"
                                            //treeDefaultExpandAll
                                            onChange={this.cambioFamilia.bind(this)}
                                        />
                                        <label 
                                            htmlFor="familia" 
                                            className="label-content"> 
                                            Familia
                                        </label>
                                    </div>

                                    <div className="col-lg-12-content">
                                        <label 
                                            htmlFor="placa" 
                                            className="label-content">
                                            Unidad Medida 
                                        </label>
                                        <select 
                                            id="idUnidad" 
                                            name="idUnidad"
                                            value={this.state.idUnidad}
                                            className="form-control-content"
                                            onChange={this.cambioUnidad.bind(this)}>
                                                {
                                                    this.state.unidadesMedidas.map((item,key) => (
                                                        <option 
                                                            key={key} 
                                                            id={item.id} 
                                                            value={item.idunidadmedida}>
                                                        {item.descripcion}
                                                        </option>
                                                    ))
                                                }
                                        </select>
                                    </div>

                                    <div className="col-lg-12-content">
                                        <label 
                                            htmlFor="placa" 
                                            className="label-content">
                                            Moneda 
                                        </label>
                                        <select 
                                            id="idMoneda" 
                                            name="idMoneda"
                                            value={this.state.idMoneda}
                                            className="form-control-content"
                                            onChange={this.cambioMoneda.bind(this)}>
                                                {
                                                    this.state.monedas.map((item,key) => (
                                                        <option 
                                                            key={key} 
                                                            id={item.idmoneda} 
                                                            value={item.idmoneda}>
                                                        {item.descripcion}
                                                        </option>
                                                    ))
                                                }
                                        </select>
                                    </div>

                                </div>

                                <div className="input-group-content col-lg-8-content">

                                    <div className="card-caracteristica">
                                        <div className="pull-left-content">
                                            <h1 className="title-logo-content"> Caracteristica </h1>
                                        </div>
                                        <div className="pull-right-content">
                                            <i className="fa fa-plus btn-content btn-secondary-content"
                                                style={{
                                                    marginRight: 20,
                                                    marginTop: 15
                                                }}
                                                onClick={() => {
                                                    let elem = {
                                                        idpc: 0,
                                                        descripcion: '',
                                                        idpcd: -1
                                                    };
                                                    this.setState({
                                                        dataCaracteristicas: [
                                                            ...this.state.dataCaracteristicas,
                                                            elem
                                                        ]
                                                    });
                                                }}> 
                                            </i>
                                        </div>
                                        <div className="caja-content caja-content-adl">
                                            {
                                                this.state.dataCaracteristicas.map((item,key) => (
                                                    <div key={key}>
                                                        <div className="col-lg-4-content col-md-3-content col-sm-3-content col-xs-3-content">
                                                            <select  
                                                                id={key} 
                                                                key={key}
                                                                value={this.state.dataCaracteristicas[key].idpc == null ? 0 :
                                                                        this.state.dataCaracteristicas[key].idpc}
                                                                className="form-control-content"
                                                                onChange={this.cambioCaracteristica.bind(this)}>

                                                                <option value="0">Seleccione</option>
                                                                {this.state.caracteristicas.map((item,key) => (
                                                                    <option 
                                                                        value={item.idproduccaracteristica}
                                                                        key={key}>
                                                                        {item.caracteristica}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="col-lg-6-content col-md-3-content col-sm-6-content col-xs-6-content">
                                                            <input 
                                                                id={key}
                                                                type="text"
                                                                value={this.state.dataCaracteristicas[key].descripcion == 
                                                                    null ? '' :
                                                                        this.state.dataCaracteristicas[key].descripcion} 
                                                                placeholder="Ingresar Descripcion" 
                                                                className="form-control-content"
                                                                onChange={this.cambioInputC.bind(this)}/>
                                                        </div>

                                                        <div className="col-lg-2-content col-md-1-content text-center-content">
                                                            <i 
                                                                className="fa fa-remove btn-content btn-danger-content"
                                                                key={key}
                                                                onClick={() => this.eliminarFilaCaract(key) }> 
                                                            </i>
                                                        </div>
                                                    </div>    
                                                ))
                                            }

                                        </div>
                                    </div>

                                </div>
            
                            </div>

                            <div className="form-group-content col-lg-3-content">

                                <div className="card-caracteristica">
                                    <div className="pull-left-content">
                                        <i className="styleImg fa fa-upload">
                                            <input type="file" className="img-content"
                                                onChange={this.selectImg.bind(this)}/>
                                        </i>
                                    </div>

                                    <div className="pull-right-content">
                                        {iconDelete}
                                    </div>

                                    <div className="caja-img caja-altura">
                                        { componentImg }
                                    </div>

                                    <div className="pull-left-content">
                                        <i className="fa-left-content fa fa-angle-double-left"
                                            onClick={() => this.anteriorImg() }> </i>
                                    </div>
                                    <div className="pull-right-content">
                                        <i className="fa-right-content fa fa-angle-double-right"
                                            onClick={() => this.siguienteImg()}> </i>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="form-group-content">
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content col-lg-2-content">
                                    <input id="costo" type="number"
                                            value={this.state.costo}
                                        //style={{'border-bottom': '2px solid ' + this.state.validacionInput}}
                                            placeholder="Costo"
                                            onChange={this.cambioCosto.bind(this)}
                                            className="form-control-content"
                                        />
                                    <label
                                        htmlFor="costo"
                                        //style={{'color': this.state.validacionLabel}}
                                        className="label-group-content">
                                        Costo
                                    </label>
                                </div>
                                
                                { /*componentCosto */}

                                <div className="input-group-content col-lg-2-content">
                                    <button
                                        type="button"
                                        className="btn-content btn-primary-content"
                                        //onClick={this.openModalAddCostos.bind(this)}
                                    >
                                        Agregar otro costo
                                    </button>
                                </div>

                                <div className="input-group-content col-lg-2-content">
                                    <input id="precio" type="number"
                                            value={this.state.precio}
                                        //style={{'border-bottom': '2px solid ' + this.state.validacionInput}}
                                            placeholder="Precio"
                                            onChange={this.cambioPrecio.bind(this)}
                                            className="form-control-content"
                                        />

                                    <label
                                        htmlFor="precio"
                                        className="label-group-content">
                                        Precio
                                    </label>

                                </div>

                                

                                <div className="input-group-content col-lg-2-content text-center-content">
                                    <button className="btn-content btn-primary-content"
                                        type="button"
                                        //onClick={() => this.openModalLPrecios()}
                                    >
                                        Agregar a Lista Precios
                                    </button>
                                </div>

                            </div>

                        </div>

                        <div className="form-group-content col-lg-12-content">
                            { componentStockAlmacen }
                        </div>

                        <div className="form-group-content col-lg-12-content">
                            { componentStock }
                        </div>

                        <div 
                            className="col-lg-10-content"
                            style={{ marginLeft: 20 }}
                        >

                            <div className="col-lg-6-content">
                                <label 
                                    htmlFor="palclaves" 
                                    className="label-content"> 
                                    Palabras Claves
                                </label>
                                <textarea
                                    id="palclaves"
                                    type="text"
                                    className="textarea-content"
                                    value={this.state.palclaves}
                                    onChange={this.cambioPalClaves.bind(this)}
                                />
                            </div>

                            <div className="col-lg-6-content">
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
                                    onChange={this.cambioNotas.bind(this)}
                                />
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
            </div>

            
        );
    }
}
