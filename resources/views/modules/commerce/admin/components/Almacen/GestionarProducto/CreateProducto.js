import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import styles from './styles.css';
import { TreeSelect, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import { Redirect } from 'react-router-dom';

const URL_STORE_PRODUCTO = '/commerce/api/producto';
const URL_GET_PRODUCTOS = '/commerce/api/producto';
const URL_GET_MONEDAS = '/commerce/api/moneda';
const URL_GET_FAMILIAS = '/commerce/api/familia';
const URL_GET_ALMACEN_UBICACION = '/commerce/api/almacenubi';
const URL_GET_PRODC_CARACTERISTICA = '/commerce/api/pcaracteristica';
const URL_GET_UNIDAD_MEDIDAS = '/commerce/api/unidadmedida';
const URL_GET_ALMACENES = '/commerce/api/almacen';
const URL_GET_LISTA_PRECIOS = '/commerce/api/listaprecio';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
  
export default class CreateProducto extends Component {

    constructor(){
        super();
        this.state = {
            descripcion: '',
            codproducto: '',
            costo: '',
            precio: '',
            tipo: 'P',
            stock: 0,
            stockmin: 0,
            stockmax: 0,
            palclaves: '',
            notas: '',
            tipocomision: '',
            comision: 0,
            costox: '',
            costodos: 0,
            costotres: 0,
            costocuatro: 0,
            idMoneda: 0,
            idFamilia: undefined,
            idClasificacion: 0,
            idUnidad: 0,
            masCodigo: '',
            descripcionCodigo: '',
            arrayCostos: [],

            productosSelect: [],
            nameImages: [],
            images: [],
            indexImg: -1,

            monedas: [],
            productos: [],
            familias: [],
            clasificaciones: [],
            caracteristicas: [],
            unidadesMedidas: [],
            almacenes: [],
            almacenUbicaciones: [],
            arbolUbicaciones: [],
            listaPrecios: [],

            descDetalle: [],
            idsCaracteristicas: [],
            codigosProd: [],
            descCodigos: [],

            mostrarListaCaract: false,
            activeIndex: 0,
            animating: false,
            imagenNoValida: false,
            isProducto: true,
            displayModalCodProd: 'none',
            displayModalLPrecios: 'none',
            modalImage: 'none',

            idsAlmacen: [],
            dataStock: [],
            dataStockmin: [],
            dataStockmax: [],
            dataUbicacion: [],

            redirect: false,
            displayModalLP: false,
            visibleAddCosto: false,
            visibleAddCodigo: false,
            tecla: 0,
            cursorAllowed: ''
        }
        
    }
    
    obtenerMonedas() {
        axios.get(URL_GET_MONEDAS)
        .then((resp) => {
            let result = resp.data;
            if(result.response > 0 && result.data.length > 0){
                let idDefecto = result.data[0].idmoneda;
                this.setState({
                    monedas: result.data,
                    idMoneda: idDefecto
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    hijosProducto(idpadre) {
        
        var array =  this.state.productos;
        //console.log('DATA DE LOS PRODUCTOS');
        //console.log(array);
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            //console.log('ELEMENTO');
            //console.log(array[i]);
            if(array[i].producto_id == idpadre){
                var elemento = {
                    label: array[i].descripcion,
                    value: array[i].id
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    arbolProductos(data) {
        
        if (data.length === 0) {
            return;
        }

        for(var i = 0; i < data.length; i++){
            //console.log('id del producto ',data[i].value);
            var hijos = this.hijosProducto(data[i].value);
            //console.log('hijos');
            //console.log(hijos);
            if(hijos.length > 0){
                data[i].children = hijos;
            }

            //if(hijos.length > 0){
            this.arbolProductos(hijos);
            //}
        }
    }

    obtenerProductos() {
        axios.get(URL_GET_PRODUCTOS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    productos: result.data.data
                })
            }
            /*
            var array = resp.data.data.data;
            var array_aux = [];
            
            for(var i = 0; i < array.length; i++){
                if(array[i].fkidproducto == null){
                    var elem = {
                        label: array[i].descripcion,
                        value: array[i].id,
                    };
                    array_aux.push(elem);
                }
            }
            
            this.arbolProductos(array_aux);

            this.setState({
                productos: array_aux
            });
            */
        })
        .catch((error) => {
            console.log(error);
        })
    }

    hijosFamilia(idpadre, array) {
        
        //var array =  this.state.familias;
        
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

    arbolFamilias(data, array) {

        if (data.length > 0) {

            for (var i = 0; i < data.length; i++) {
                //console.log('id del producto ',data[i].value);
                //console.log('VALUE ',data[i].value);
                var hijos = this.hijosFamilia(data[i].value, array);
                //console.log('hijos');
                //console.log(hijos);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
    
                this.arbolFamilias(hijos, array);
            }
        }
        
    }

    obtenerFamilias() {
        axios.get(URL_GET_FAMILIAS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
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
                    idFamilia: idDefecto
                });
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

    obtenerCaracteristicas() {

        axios.get(URL_GET_PRODC_CARACTERISTICA)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                let array = result.data;
                const nElem = 3;
                let values = [];
                let caract = [];
                //var primero = array.length > 0 ? array[0].id : 0;
                for (let i = 0; i < nElem; i++) {
                    caract.push(0);
                    values.push("");
                }
                console.log('valores iniciales');
                console.log('ids',caract);
                console.log('desc',values);
                this.setState({
                    caracteristicas: result.data,
                    idsCaracteristicas: caract,
                    descDetalle: values
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
                let idDefecto = result.data[0].idunidadmedida;
                this.setState({
                    unidadesMedidas: result.data,
                    idUnidad: idDefecto
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerAlmacenes() {
        axios.get(URL_GET_ALMACENES)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.data.length > 0) {
                let array = result.data;
                const nElem = 3;
                //const pid = array.length > 0 ? array[0].id : 0;
                let idsAlmacen = [];
                let arrayStock = [];
                let arrayStockmin = [];
                let arrayStockmax = [];
                let arrayUbicacion = [];
                let arbolUbicacion = [];//new
                
                for (let i = 0; i < nElem; i++) {
                    idsAlmacen.push(0);
                    arrayStock.push('');
                    arrayStockmax.push('');
                    arrayStockmin.push('');
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
                console.log(arbolUbicacion);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerListaPrecios() {
        
        axios.get(URL_GET_LISTA_PRECIOS)
        .then((resp) => {
            const result = resp.data;
            if (result.response > 0) {
                this.setState({
                    listaPrecios: result.data
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onChangeProducto(currentNode, selectedNodes){
        console.log('onChange::', currentNode, selectedNodes);
        
        this.state.productosSelect = selectedNodes;
        console.log('IDS');
        console.log(this.state.productosSelect);

    }
    onActionProducto({ action, node }){
        console.log(`onAction:: [${action}]`, node)
    }
    onNodeToggleProducto(currentNode){
        console.log('onNodeToggle::', currentNode)
    }

    onChangeFamilia(currentNode, selectedNodes){
        console.log('onChange::', currentNode, selectedNodes);
    }
    onActionFamilia({ action, node }){
        console.log(`onAction:: [${action}]`, node)
    }
    onNodeToggleFamilia(currentNode){
        console.log('onNodeToggle::', currentNode)
    }
      
    componentDidMount() {
        this.obtenerAlmacenUbicaciones();
        this.obtenerCaracteristicas();
        this.obtenerFamilias();
        this.obtenerMonedas();
        this.obtenerProductos();
        this.obtenerUnidadesMedida();
        this.obtenerAlmacenes();
        this.obtenerListaPrecios();
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
        
    }

    getIndexSeleccionadosCaract() {
        let data = this.state.descDetalle;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] !== "") {
                array.push(i);
            }
        }
        return array;
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

        if (!this.state.isProducto) return true;
        let stock = this.state.stock;
        let stockmin = this.state.stockmin;
        let stockmax = this.state.stockmax;
        console.log('STOCK ', stock);
        console.log('STOCK MAX ', stockmax);
        console.log('STOCK MIN ', stockmin);
        if (stock == '' || stockmax == '' || stockmin == '') {
            message.warning('Los stocks de los almacenes no deben quedar vacios');
            return;
        }
        stock = parseFloat(stock);
        stockmin = parseFloat(stockmin);
        stockmax = parseFloat(stockmax);
        if (stock > stockmax) {
            message.warning('El Stock no de ser mayor al Stock Maximo');
            return false;
        }
        if (stock < stockmin) {
            message.warning('El Stock no debe ser menor al stock Minimo');
            return false;
        }
        return true;
       
    }

    validarDatosCaracteristicas() {

        let array_ids = this.state.idsCaracteristicas;
        let array_values = this.state.descDetalle;

        for (let i = 0; i < array_ids.length; i++) {
            let id = array_ids[i];
            let value = array_values[i];
            if ((id == 0 && value.length > 0) ||
                id !== 0 && value.length === 0) {

                return false;    
            }
        }
        return true;
    }
    
    validarDatos() {
        if (this.state.codproducto.length === 0) {
            message.warning('El campo Codigo Producto es obligatorio');
            return false;
        }
        if (this.state.descripcion.length === 0) {
            message.warning('El campo Descripcion es obligatorio');
            return false;
        }
        return true; 
    }
    guardarProducto(e) {
        e.preventDefault();

        if(!this.validarDatos()) return;
        if (!this.validarDatosAlmacen()) return;
        if (!this.validarDatosCaracteristicas()) return;

        var body = {
            descripcion: this.state.descripcion,
            codproducto: this.state.codproducto,
            costo: this.state.costo == '' ? 0 : this.state.costo,
            precio: this.state.precio == '' ? 0 : this.state.precio,
            tipo: this.state.tipo,
            stock: this.state.stock,
            stockmin: this.state.stockmin,
            stockmax: this.state.stockmax,
            palclaves: this.state.palclaves,
            notas: this.state.notas,
            idMoneda: this.state.idMoneda,
            idFamilia: this.state.idFamilia,
            idUnidad: this.state.idUnidad,
        };
       
        //body.append('tipocomision',this.state.tipocomision);
        //body.append('comision',this.state.comision);
        //body.append('ids_productos',JSON.stringify(this.state.ids_productos));
        
        //body.append('idClasificacion',this.state.idClasificacion);

        if (this.state.nameImages.length > 0) {
            body.nameImages = JSON.stringify(this.state.nameImages);
            body.images = JSON.stringify(this.state.images);
        }
        let arrayCostos = this.state.arrayCostos;
        if (arrayCostos.length > 0) {
            body.costodos = arrayCostos[0];
            if (arrayCostos.length > 1) {
                body.costotres = arrayCostos[1];
            }
            if (arrayCostos.length > 2) {
                body.costocuatro = arrayCostos[2];
            }
        }
        console.log("VALUES ",this.state.descDetalle);
        console.log(" CARACT DESCP",this.state.idsCaracteristicas);
        var array = this.getIndexSeleccionadosCaract();
        //console.log("valor devuelto ",array);
        if (array.length > 0) {
            var new_array_value = [];
            var new_array_ids = [];
            for (let i = 0; i < array.length; i++) {
                var elem_id = this.state.idsCaracteristicas[array[i]];
                var elem_value = this.state.descDetalle[array[i]];
                new_array_value.push(elem_value);
                new_array_ids.push(elem_id);
            }

            body.idsCaracteristicas = JSON.stringify(new_array_ids);
            body.valuesCaracteristicas = JSON.stringify(new_array_value);

        }
        
        if (this.state.codigosProd.length > 0) {
            body.codigosprod = JSON.stringify(this.state.codigosProd);
            body.descodigos = JSON.stringify(this.state.descCodigos);
        }

        var array = this.getIndexSeleccionadosAlmacen();
        console.log("ARRAY DE ALMACENES ", array);
        console.log("TIPO ", this.state.tipo);
        if (array.length > 0 && this.state.tipo == "P") {
            let arrayIdsAlmacen = [];
            let arrayStocks = [];
            let arrayStocksMin = [];
            let arrayStocksMax = [];
            let arrayUbicaciones = [];
            for (let i = 0; i < array.length ;i++) {
                let idAlmacen = this.state.idsAlmacen[array[i]];
                let stock = this.state.dataStock[array[i]] == '' ? 0 : parseFloat(this.state.dataStock[array[i]]);
                let stockmin = this.state.dataStockmin[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmin[array[i]]);
                let stockmax = this.state.dataStockmax[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmax[array[i]]);
                let ubicacion =  this.state.dataUbicacion[array[i]];

                arrayIdsAlmacen.push(idAlmacen);
                arrayStocks.push(stock);
                arrayStocksMax.push(stockmax);
                arrayStocksMin.push(stockmin);
                if (ubicacion == "Seleccione una opcion") {
                    arrayUbicaciones.push(0);
                } else {
                    arrayUbicaciones.push(ubicacion);
                }
                
            }
            
            body.dataIdsAlmacen = JSON.stringify(arrayIdsAlmacen);
            body.dataStocks = JSON.stringify(arrayStocks);
            body.dataStocksMax = JSON.stringify(arrayStocksMax);
            body.dataStocksmin = JSON.stringify(arrayStocksMin);
            body.dataUbicaciones = JSON.stringify(arrayUbicaciones);

            /*console.log("IDS Almacen ",arrayIdsAlmacen);
            console.log("Stocks ",arrayStocks);
            console.log("Stocks Max",arrayStocksMax);
            console.log("STOCK MIN ",arrayStocksMin);
            console.log("UBICACIONES ",arrayUbicaciones);
            */
        } else if (this.state.tipo == "P"){
            message.warning('El producto debe estar por lo menos en un almacen');
            return;
        } else { 
            var array = this.getIndexSeleccionadosAlmacen();
            let arrayIdsAlmacen = [];
            for (let i = 0; i < array.length; i++) {
                arrayIdsAlmacen.push(this.state.idsAlmacen[array[i]]);
            }
            body.dataIdsAlmacen = JSON.stringify(arrayIdsAlmacen);
        }
        
        console.log('BODY', body);
        
        axios.post(URL_STORE_PRODUCTO, body)
        .then((resp) => {
            console.log(resp);
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    redirect: true
                })
                message.success('Se guardo correctamente el producto');
            } else {
                message.error('No se guardo correctamente el producto');
            }

        })
        .catch((error) => {
            console.log(error);
            message.error('Ha ocurrido un problema con la conexion, por favor vuelva a cargar la pagina');
        })
    }

    cambioDescCodigo(e) {
        this.setState({
            descripcionCodigo: e.target.value
        });
    }

    cambioMasCodigo(e) {
        this.setState({
            masCodigo: e.target.value
        });
    }
    cambioDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }
    
    cambioCodProducto(e) {
        this.setState({
            codproducto: e.target.value
        });
    }

    cambioCodProductoOtro(e) {
        this.state.codigosProd[e.target.id] = e.target.value;
        this.setState({
            codigosProd: this.state.codigosProd
        });
    }

    cambioCosto(e) {
        this.setState({
            costo: e.target.value
        });
    }

    cambioPrecio(e) {
        this.setState({
            precio: e.target.value
        });
    }

    cambioTipo(e) {
        if (e.target.value == "P") {
            this.setState({
                isProducto: true,
                tipo: e.target.value,
                cursorAllowed: ''
            });
        } else {
            this.setState({
                isProducto: false,
                tipo: e.target.value,
                cursorAllowed: 'cursor-not-allowed'
            });
        }
    }

    cambioStock(e) {
        this.setState({
            stock: e.target.value
        });
    }

    cambioStockMin(e) {
        this.setState({
            stockmin: e.target.value
        });
    }

    cambioStockMax(e) {
        this.setState({
            stockmax: e.target.value
        });
    }

    cambioPalClaves(e) {
        this.setState({
            palclaves: e.target.value
        });
    }

    cambioNotas(e) {
        this.setState({
            notas: e.target.value
        });
    }

    cambioTipoComision(e) {
        this.setState({
            tipocomision: e.target.value
        });
    }

    cambioComision(e) {
        this.setState({
            comision: e.target.value
        });
    }

    cambioCostoDos(e) {
        this.setState({
            costodos: e.target.value
        });
    }

    cambioCosto2(e) {
        this.state.arrayCostos[0] = e.target.value
        this.setState({
            arrayCostos: this.state.arrayCostos
        });
    }

    cambioCostoX(e) {
        this.setState({
            costox: e.target.value
        });
    }

    cambioCostoTres(e) {
        this.setState({
            costotres: e.target.value
        });
    }

    cambioCostoCuatro(e) {
        this.setState({
            costocuatro: e.target.value
        });
    }

    cambioMoneda(e) {
        this.setState({
            idMoneda: e.target.value
        });
    }

    cambioProducto(e) {
        this.setState({
            id_producto: e.target.value
        });
    }

    cambioFamilia(value) {
        this.setState({
            idFamilia: value
        });
    }

    cambioClasificacion(e) {
        this.setState({
            idClasificacion: e.target.value
        });
    }

    cambioCaracteristica(e) {
        
        let index = e.target.id;
        let valor = e.target.value;
        console.log('index',index);
        console.log('valor',valor);
        if (valor == 0) {
            this.state.descDetalle[index] = "";
        }
        this.state.idsCaracteristicas[index] = parseInt(valor);
        console.log(this.state.idsCaracteristicas);
        console.log(this.state.caracteristicas);
        this.setState({
            idsCaracteristicas: this.state.idsCaracteristicas,
            descDetalle: this.state.descDetalle
        });
    }
    
    cambioInputC(e) {
        let index = e.target.id;
        let valor = e.target.value;

        if (this.state.idsCaracteristicas[index] == 0) return;
        this.state.descDetalle[index] = valor;
        console.log("array ",this.state.descDetalle);
        this.setState({
            descDetalle: this.state.descDetalle
        });
       
    }

    cambioAlmacen(e) {
        let index = e.target.id;
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
        if (this.state.idsAlmacen[index] == 0) return;
        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }        
        this.state.dataStock[index] = valor;
        let totalStock = this.sumar(this.state.dataStock);
        console.log("array Stock",this.state.dataStock);
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
        if (this.state.idsAlmacen[index] == 0) return;
        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        this .state.dataStockmin[index] = valor;
        let totalStockMin = this.sumar(this.state.dataStockmin);
        console.log("array StockMin",this.state.dataStockmin);
        this.setState({
            dataStockmin: this.state.dataStockmin,
            stockmin: totalStockMin
        })
       
    }

    cambioInputAStockMax(e) {
        let index = e.target.id;
        let valor = parseFloat(e.target.value);
        if (this.state.idsAlmacen[index] == 0) return;
        if (valor < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        this .state.dataStockmax[index] = valor;
        let totalStockMax = this.sumar(this.state.dataStockmax);
        console.log("array StockMax",this.state.dataStockmax);
        this.setState({
            dataStockmax: this.state.dataStockmax,
            stockmax: totalStockMax
        })
       
    }

    cambioInputAUbicacion(index, value) {
        if (!this.state.isProducto) return;
        console.log('INDEX ',index);
        console.log('VALUE ',value);
        if (this.state.idsAlmacen[index] == 0) return;
        this .state.dataUbicacion[index] = value;
        console.log("array Ubicacion", this.state.dataUbicacion);

        this.setState({
            dataUbicacion: this.state.dataUbicacion
        })
       
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
            const newIndex = this.state.nameImages.length;
            this.setState({
                nameImages: [
                    ...this.state.nameImages,
                    file.name
                ],
                images: [
                    ...this.state.images,
                    e.target.result
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

        if (this.state.nameImages.length > 1) {
            var index = this.state.indexImg;
            var ultimo = this.state.nameImages.length - 1;

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
        
        if (this.state.nameImages.length > 1) {
            var index = this.state.indexImg;
            let ultimo = this.state.nameImages.length - 1;
            console.log(this.state.nameImages);
    
            if (index === 0) {
                index = ultimo;
            } else {
                index--;
            }
            this.setState({
                indexImg: index
            })
            console.log(this.state.indexImg);
        }
        
    }

    addRowAlmacen() {

        this.state.idsAlmacen.push(0);
        this.state.dataStock.push(0);
        this.state.dataStockmax.push(0);
        this.state.dataStockmin.push(0);
        this.state.dataUbicacion.push("Seleccione una opcion");
        this.state.arbolUbicaciones.push([]);

        this.setState({
            idsAlmacen: this.state.idsAlmacen,
            dataStock: this.state.dataStock,
            dataStockmax: this.state.dataStockmax,
            dataStockmin: this.state.dataStockmin,
            dataUbicacion: this.state.dataUbicacion,
            arbolUbicaciones: this.state.arbolUbicaciones
        });

    }

    eliminarFilaAlmacen(index) {

        this.state.idsAlmacen.splice(index, 1);
        this.state.dataStock.splice(index, 1);
        this.state.dataStockmax.splice(index, 1);
        this.state.dataStockmin.splice(index, 1);
        this.state.dataUbicacion.splice(index, 1);
        this.state.arbolUbicaciones.splice(index, 1);
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
            stock: totalStock,
            stockmax: totalStockMax,
            stockmin: totalStockMin
        });
    }

    openCloseModalPC() {

        if (this.state.displayModalCodProd == 'none') {
            this.state.displayModalCodProd = 'block';
        } else {
            this.state.displayModalCodProd = 'none';
        }
        this.setState({
            displayModalCodProd: this.state.displayModalCodProd
        });
    }
    
    componentStockAlmacen() {
        
        //if (this.state.isProducto) {
            return (
                <div className="form-group-content col-lg-11-content margin-group-content">

                        <div className="pull-left-content">
                            <h2 className="title-logo-content"> Stock por Almacen </h2>
                        </div>

                        <div className="pull-right-content">
                            <i 
                                className="fa fa-plus btn-content btn-secondary-content"
                                onClick={() => this.addRowAlmacen() }
                                style={{
                                    marginRight: 42,
                                    marginTop: 15
                                }}
                            > 
                            </i>
                        </div>

                    <div className="row col-lg-12-content">

                        <div className="col-lg-2-content text-center-content">
                            <h4>Almacen</h4>
                        </div>

                        <div className="col-lg-2-content text-center-content">
                            <h4>Stock</h4>
                        </div>

                        <div className="col-lg-2-content text-center-content">
                            <h4>Stock Minimo</h4>
                        </div>

                        <div className="col-lg-2-content text-center-content">
                            <h4>Stock Maximo</h4>
                        </div>

                        <div className="col-lg-3-content text-center-content">
                            <h4>Ubicacion</h4>
                        </div>
                        <div className="col-lg-1-content text-center-content">
                            <h4>Accion</h4>
                        </div>

                    </div>

                    <div className="caja-content">

                        {
                            this.state.idsAlmacen.map((item,key) => (
                                <div 
                                    className="col-lg-12-content"
                                    style={{ marginTop: -5, marginBottom: -5 }}
                                    key={key}>
                                    <div className="col-lg-2-content col-md-3-content col-sm-2-content col-xs-2-content">
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
                                    <div className="col-lg-2-content col-md-2-content col-sm-1-content col-xs-1-content">
                                        <input 
                                            className={"form-control-content none-flechas-number" + " " + this.state.cursorAllowed}
                                            id={key} 
                                            type="number" 
                                            style={{ margin:10 }}
                                            key={key}
                                            value={this.state.dataStock[key]}
                                            onChange={this.cambioInputAStock.bind(this)}
                                            readOnly={!this.state.isProducto}
                                        />
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-1-content col-xs-1-content">
                                        <input 
                                            className={"form-control-content" + " " + this.state.cursorAllowed}
                                            id={key} 
                                            type="number" 
                                            style={{ margin:10 }}
                                            key={key}
                                            value={this.state.dataStockmin[key]}
                                            onChange={this.cambioInputAStockMin.bind(this)}
                                            readOnly={!this.state.isProducto}
                                        />
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-1-content col-xs-1-content">
                                        <input 
                                            className={"form-control-content" + " " + this.state.cursorAllowed}
                                            id={key} 
                                            type="number" 
                                            style={{ margin:10 }}
                                            key={key}
                                            value={this.state.dataStockmax[key]}
                                            onChange={this.cambioInputAStockMax.bind(this)}
                                            readOnly={!this.state.isProducto}
                                        />
                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-2-content col-xs-2-content">
                                        <TreeSelect
                                            key={key}
                                            style={{ width: 150, marginTop: 12, marginLeft: 30 }}
                                            value={this.state.dataUbicacion[key]}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.arbolUbicaciones[key]}
                                            placeholder="Ubicacion"
                                            //treeDefaultExpandAll
                                            onChange={this.cambioInputAUbicacion.bind(this,key)}
                                            readOnly={!this.state.isProducto}
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
                            ))
                        }
                        
                    </div>
                </div>

            );
        /*    
        } else {

            return null;

        }
        */
    }

    componentStock() {

        if (this.state.isProducto) {
            return (
                <div className="form-group-content col-lg-10-content margin-group-content">

                    <div className="pull-left-content">
                        <h2 className="title-logo-content">Totales Stock</h2>
                    </div>

                    <div className="col-lg-12-content">
                        <div className="input-group-content col-lg-4-content">
                            <input id="stock" type="number"
                                value={this.state.stock} 
                                className="form-control-content cursor-not-allowed"
                                readOnly
                            />
                            <label 
                                htmlFor="stock" 
                                className="label-group-content">
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
                                className="label-group-content">
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
                                className="label-group-content">
                                Stock Maximo
                            </label>
                        </div>

                    </div>
                </div>

            );

        } else {

            return null;

        }
    }

    agregarCodigo() {
        
        let codigo = this.state.masCodigo;
        let descrip = this.state.descripcionCodigo;
        
        if (codigo.length > 0 && descrip.length > 0) {

            this.state.codigosProd.push(codigo);
            this.state.descCodigos.push(descrip);
            
            this.setState({
                codigosProd: this.state.codigosProd,
                descCodigos: this.state.descCodigos,
                masCodigo: '',
                descripcionCodigo: ''
            })
            console.log(this.state.codigosProd);
            console.log(this.state.descCodigos);

        } else {
            message.error('No deben quedar campos vacios');
        }
        
    }

    modalAddCodProd() {

        const displayModalCodProd = this.state.displayModalCodProd;
        return (
            <div>
                <div 
                    id="capaModalCodigos" 
                    style={{'display': displayModalCodProd}} 
                    className="divModal"
                    onClick={this.openCloseModalPC.bind(this)}>
                </div>

                <div 
                    id="capaFormularioCod" 
                    style={{'display': displayModalCodProd}} 
                    className="divFormulario"
                >
                    <div className="center">

                        <h2>Agregar Codigos del Producto</h2>

                    </div>
                    
                    
                    <div className="input-group-content col-lg-4-content">

                        <input id="codigo_otro" type="text"
                                value={this.state.masCodigo}
                                //style={linkStyle}
                                placeholder="Ingresar Codigo ..."
                                onChange={this.cambioMasCodigo.bind(this)}
                                className="form-control-content" 
                                //onMouseEnter={this.toggleHover.bind(this)}
                                //onMouseLeave={this.toggleHover.bind(this)}
                                />
                        <label 
                            htmlFor="codigo_otro" 
                            //style={{'color': this.state.validacionLabel}}
                            className="label-content"> 
                            Codigo del Producto 
                        </label>

                    </div>

                    <div className="input-group-content col-lg-4-content">

                        <input id="descripcion" type="text"
                                value={this.state.descripcionCodigo}
                                //style={linkStyle}
                                placeholder="Descripcion"
                                onChange={this.cambioDescCodigo.bind(this)}
                                className="form-control-content" 
                                //onMouseEnter={this.toggleHover.bind(this)}
                                //onMouseLeave={this.toggleHover.bind(this)}
                        />
                        <label 
                            htmlFor="descripcion" 
                            //style={{'color': this.state.validacionLabel}}
                            className="label-content"> 
                            Descripcion
                        </label>

                    </div>

                    <div className="center col-lg-4-content">

                        <button
                            className="btn-content btn-success-content" 
                            type="submit"
                            onClick={() => this.agregarCodigo()}>
                            Agregar
                        </button>

                    </div>

                    <div className="card col-lg-12-content">
                        
                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>#</th>
                                    <th>Codigo  del Producto</th>
                                    <th>Descripcion</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.codigosProd.map((item,key) => {
                                    var descrip = this.state.descCodigos[key];
                                    return(
                                        <tr key={key}>
                                            <td><label className="col-show">#: </label>{key + 1}</td>
                                            <td><label className="col-show">Codigo: </label>{item}</td>
                                            <td><label className="col-show">Descripcion: </label>{descrip}</td>
                                            <td><label className="col-show">Opciones: </label>
                                                <a 
                                                    className="btn btn-sm btn-danger-content"
                                                    onClick={() => {
                                                        this.state.codigosProd.splice(key,1);
                                                        this.state.descCodigos.splice(key,1);
                                                        this.setState({
                                                            codigosProd: this.state.codigosProd,
                                                            descCodigos: this.state.descCodigos
                                                        })
                                                    }}>
                                                    <i className="fa fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                    
                                })}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div className="btn col-lg-12-content">
                        <button
                            className="btn-content btn-danger-content" 
                            type="button"
                            onClick={() => this.openCloseModalPC()}>
                            Agregar
                        </button>
                        <button
                            className="btn-content btn-danger-content" 
                            type="button"
                            onClick={() => {
                                this.openCloseModalPC();
                                this.setState({
                                    codigosProd: [],
                                    descCodigos: [],
                                    masCodigo: '',
                                    descripcionCodigo: ''
                                })
                            }}
                        >
                            Cancelar
                        </button>
                    </div>

                </div>

            </div>
                
        ) 
    }

    componentListaprecios() {
        return (
                <div className="table-content">
                    <table className="table-responsive-content">
                        <thead>
                        <tr className="row-header">
                            <th>#</th>
                            <th>Descripcion</th>
                            <th>Valor</th>
                            <th>Estado</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.listaPrecios.map((item,key) => {
                                const estado = item.estado === 'A' ? 'Activa' : 'Desactiva' ;
                                return(
                                    <tr key={key}>
                                        <td><label className="col-show">#: </label>{key + 1}</td>
                                        <td><label className="col-show">Descripcion: </label>{item.descripcion}</td>
                                        <td><label className="col-show">Factor: </label>{item.valor}</td>
                                        <td><label className="col-show">Estado: </label>{estado}</td>
                                        <td><label className="col-show">Fecha I: </label>{item.fechainicio}</td>
                                        <td><label className="col-show">Fecha F: </label>{item.fechafin}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        );
    }

    componentImg() {
        
        if (this.state.nameImages.length === 0) {
            return (
                <img 
                    src='/images/default.jpg' alt="none" 
                    className="img-principal" 
                />
            )
            
        } else {
            return (
                <img 
                    style={{'cursor': 'pointer'}}
                    onClick={this.abrirModalImage.bind(this)}
                    src={this.state.images[this.state.indexImg]}
                    alt="none" className="img-principal" 
                />
            )
        }
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

    componentImgModal() {
        return (
            <div className="content-img">
                <i className="fa fa-times fa-delete-image" onClick={this.cerrarModalImage.bind(this)}> </i>
                {(this.state.nameImages.length === 0)?'':
                    <img src={this.state.images[this.state.indexImg]}
                        alt="none" className="img-principal"
                        style={{'objectFit': 'fill', 'borderRadius': '8px'}} />
                }
                {(this.state.nameImages.length > 1)?
                <div className="pull-left-content">
                    <i onClick={this.siguienteImg.bind(this)}
                        className="fa-left-content fa fa-angle-double-left"> </i>
                </div>:''
                }
                {(this.state.nameImages.length > 1)?
                    <div className="pull-right-content">
                        <i onClick={this.anteriorImg.bind(this)}
                            className="fa-right-content fa fa-angle-double-right"> </i>
                    </div>:''
                }
            </div>
        )
    }

    eliminarFilaCaract(index) {
       
        this.state.idsCaracteristicas.splice(index,1);
        this.state.descDetalle.splice(index,1);
        console.log(this.state.idsCaracteristicas);
        console.log(this.state.descDetalle);
        console.log(this.state.caracteristicas);
        this.setState({
            idsCaracteristicas: this.state.idsCaracteristicas,
            descDetalle: this.state.descDetalle
        })
        
    }

    deleteImgIndex() {
        
        let nameImages = this.state.nameImages;
        let images = this.state.images;
        var index = this.state.indexImg;

        images.splice(index,1);
        nameImages.splice(index,1);

        if (index === nameImages.length) {
            index = 0;
        }

        this.setState({
            nameImages: nameImages,
            images: images,
            indexImg: index
        })

    }

    iconDelete() {
        
        if (this.state.nameImages.length > 0) {
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

    componentCodigo() {

        if (this.state.codigosProd.length > 0) {
            
            this.state.codigosProd.map((item, key) => (
                <div key={key} className="text-center-content col-lg-3-content">
                    <input 
                        id={key} type="text"
                        value={this.state.codigosProd[key]}
                        placeholder="Codigo Prod"
                        onChange={this.cambioCodProductoOtro.bind(this)}
                        className="form-control-content"
                    />
                    <label
                        htmlFor={key}
                        className="label-group-content">{this.state.descCodigos[key]}
                    </label>
                </div>
            ))
            
        } else 
            return null;
    }

    componentCosto() {
        let array =  this.state.arrayCostos;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i] !== 0) {
                return (
                    <div className="input-group-content col-lg-2-content">
                        <input id="costox" type="number"
                            value={this.state.arrayCostos[i]}
                            //style={{'border-bottom': '2px solid ' + this.state.validacionInput}}
                            placeholder="Costo"
                            onChange={this.cambioCosto2.bind(this)}
                            className="form-control-content"
                        />
                        <label
                            htmlFor="costox"
                            //style={{'color': this.state.validacionLabel}}
                            className="label-group-content">
                            Costo 2
                        </label>
                    </div>
                )
            }
        }
        return null;
    }

    addCosto() {
        if (this.state.costox != 0) {
            if (this.state.arrayCostos.length === 3) {
                message.warning('Ya no puede agregar costos');
                this.setState({
                    costox: ''
                });
            } else {
                this.state.arrayCostos.push(this.state.costox);
                this.setState({
                    arrayCostos: this.state.arrayCostos,
                    costox: ''
                });
            }
            
        } else {
            message.warning('El costo debe ser distinto de cero');
        }
        
    }

    removeCosto(index) {
        this.state.arrayCostos.splice(index, 1);
        this.setState({
            arrayCostos: this.state.arrayCostos
        });
    }

    componentAddCostos() {
        return (
            <div className="form-group-content col-lg-12-content">
                <div className="input-group-content col-lg-6-content">
                    <input id="costox" type="number"
                        value={this.state.costox}
                        //style={{'border-bottom': '2px solid ' + this.state.validacionInput}}
                        placeholder="Costo"
                        onChange={this.cambioCostoX.bind(this)}
                        className="form-control-content"
                    />
                    <label
                        htmlFor="costox"
                        //style={{'color': this.state.validacionLabel}}
                        className="label-group-content">
                        Costo
                    </label>
                </div>

                <div className="col-lg-6">
                    <button
                        className="btn-content btn-success-content" 
                        type="submit"
                        onClick={() => this.addCosto()}>
                        Agregar
                    </button>
                </div>    

                <div className="form-group-content col-lg-12-content">
                    {
                        this.state.arrayCostos.map((item, key) => {
                            let index = key + 2;
                            let label = "Costo " + index; 
                            return (
                                <div className="form-group-content col-lg-12-content">
                                    <div className="col-lg-5-content">
                                        <label>{label}</label>
                                    </div>
                                    <div className="col-lg-5-content">
                                        <label>{item}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <i
                                            className="fa fa-remove btn-content btn-danger-content"
                                            key={key}
                                            onClick={() => this.removeCosto(key)}>
                                        </i>
                                    </div>
                                </div>
                            )    
                        })
                    }
                </div>
            </div>
        )
    }

    componentAddCodigo() {
        return (
            <div className="form-group-content">
                <div className="form-group-content col-lg-12-content">

                    <div className="input-group-content col-lg-5-content">
                        <input id="codigo_otro" type="text"
                            value={this.state.masCodigo}
                            placeholder="Codigo"
                            onChange={this.cambioMasCodigo.bind(this)}
                            className="form-control-content" 
                        />
                        <label 
                            htmlFor="codigo_otro" 
                            className="label-content"
                        > 
                            Cod Producto 
                        </label>
                    </div>

                    <div className="input-group-content col-lg-5-content">

                        <input id="descripcion_cod" type="text"
                            value={this.state.descripcionCodigo}
                            placeholder="Descripcion"
                            onChange={this.cambioDescCodigo.bind(this)}
                            className="form-control-content" 
                        />
                        <label 
                            htmlFor="descripcion_cod" 
                            className="label-content"
                        > 
                            Descripcion
                        </label>

                    </div>
                    <div className="input-group-content col-lg-2-content">
                        <button
                            className="btn-content btn-success-content" 
                            type="submit"
                            onClick={() => this.agregarCodigo()}>
                            Agregar
                        </button>
                    </div>
                        
                </div>

                <div className="form-group-content col-lg-12-content">

                    <div className="form-group-content col-lg-12-content">

                        <div className="col-lg-2-content">
                            <label>Nro</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label>Codigo</label>
                        </div>
                        <div className="col-lg-4-content">
                            <label>Descripcion</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label>Eliminar</label>
                        </div>
                    </div>

                    <div className="form-group-content col-lg-12-content">
                        {
                            this.state.codigosProd.map((item, key) => (
                                <div className="col-lg-12-content">
                                    <div className="col-lg-2-content">
                                        <label>{key + 1}</label>
                                    </div>
                                    <div className="col-lg-4-content">
                                        <label>{item}</label>
                                    </div>
                                    <div className="col-lg-4-content">
                                        <label>{this.state.descCodigos[key]}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <i
                                            className="fa fa-remove btn-content btn-danger-content"
                                            onClick={() => {
                                                this.state.codigosProd.splice(key,1);
                                                this.state.descCodigos.splice(key,1);
                                                this.setState({
                                                    codigosProd: this.state.codigosProd,
                                                    descCodigos: this.state.descCodigos
                                                });
                                            }}>
                                        </i>
                                    </div>
                                </div>
                                
                            ))
                        }
                    </div>
                    
                </div>
            </div>
        )
    }

    openModalLPrecios() {
        this.setState({displayModalLP: true});
    }

    closeModalLPrecios() {
        this.setState({displayModalLP: false});
    }

    openModalAddCostos() {
        this.setState({visibleAddCosto: true});
    }

    closeModalAddCostos() {
        this.setState({visibleAddCosto: false});
    }

    openModalAddCodigo() {
        this.setState({visibleAddCodigo: true});
    }

    closeModalAddCodigo() {
        this.setState({visibleAddCodigo: false});
    }

    render() {

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/indexProducto/"/>
            )
        }
        let componentStockAlmacen = this.componentStockAlmacen();
        let componentStock = this.componentStock();
        let componentImg = this.componentImg();
        let modalAddCodProd = this.modalAddCodProd();
        let iconDelete = this.iconDelete();
        let iconZoom = this.iconZoom();
        let componentListaprecios = this.componentListaprecios();
        let componentCodigo = this.componentCodigo();
        let componentCosto = this.componentCosto();
        let componentAddCostos = this.componentAddCostos();
        let componentAddCodigo = this.componentAddCodigo();
        let componentImage = this.componentImgModal();

        return (

            <div>
                
                { modalAddCodProd }

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
                    title="Lista de Precios"
                    visible={this.state.displayModalLP}
                    onOk={this.closeModalLPrecios.bind(this)}
                    onCancel={this.closeModalLPrecios.bind(this)}
                    style={{
                        width: WIDTH_WINDOW * 0.7
                    }}
                    
                >
                    { componentListaprecios }

                </Modal>

                <Modal
                    title="Agregar Costos"
                    visible={this.state.visibleAddCosto}
                    onOk={this.closeModalAddCostos.bind(this)}
                    onCancel={this.closeModalAddCostos.bind(this)}
                    //style={{ width: WIDTH_WINDOW}}
                >
                    { componentAddCostos }

                </Modal>

                <Modal
                    title="Agregar Codigos"
                    visible={this.state.visibleAddCodigo}
                    onOk={this.closeModalAddCodigo.bind(this)}
                    onCancel={this.closeModalAddCodigo.bind(this)}
                    //style={{ width: WIDTH_WINDOW}}
                >
                    { componentAddCodigo }

                </Modal>

                <div className="row-content">
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Producto </h1>
                        </div>
                    </div>

                    <div className="card-body-content">
                        <form
                            className="form-content"
                            encType="multipart/form-data"
                            onSubmit={this.guardarProducto.bind(this)}>

                            <div className="form-group-content col-lg-12-content">
                                <div className="col-lg-9-content">
                                    <div className="col-lg-12-content">
                                        <div className="input-group-content col-lg-3-content">
                                            <input id="codigo" type="text"
                                                value={this.state.codproducto}
                                                placeholder="Codigo Prod"
                                                onChange={this.cambioCodProducto.bind(this)}
                                                className="form-control-content"
                                            />
                                            <label
                                                htmlFor="codigo"
                                                className="label-group-content"> Codigo Prod </label>
                                        </div>

                                        {
                                            this.state.codigosProd.map((item, key) => (
                                                <div key={key} className="text-center-content col-lg-3-content">
                                                    <input 
                                                        id={key} type="text"
                                                        value={this.state.codigosProd[key]}
                                                        placeholder="Codigo Prod"
                                                        onChange={this.cambioCodProductoOtro.bind(this)}
                                                        className="form-control-content"
                                                    />
                                                    <label
                                                        htmlFor={key}
                                                        className="label-group-content">{this.state.descCodigos[key]}
                                                    </label>
                                                </div>
                                            ))
                                        }

                                        <div className="col-lg-3-content">
                                            <div className="text-center-content">
                                                <button
                                                    type="button"
                                                    className="btn-content btn-primary-content"
                                                    onClick={this.openModalAddCodigo.bind(this)}>
                                                    Agregar Otros Codigos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-12-content">
                                        <div className="col-lg-4-content">
                                            <select
                                                className="form-control-content"
                                                onChange={this.cambioTipo.bind(this)}>
                                                <option value="P">Producto</option>
                                                <option value="S">Servicio</option>
                                            </select>
                                            <label
                                                htmlFor="placa"
                                                className="label-group-content">
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
                                                className="label-group-content">
                                                Descripcion
                                            </label>
                                        </div>
                                    </div>
       
                                    <div className="col-lg-4-content">
                                        <div className="col-lg-12-content">
                                            <TreeSelect
                                                style={{ width: 220 }}
                                                value={this.state.idFamilia}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={this.state.familias}
                                                placeholder="Porfavor Seleccione una opcion"
                                                //treeDefaultExpandAll
                                                onChange={this.cambioFamilia.bind(this)}
                                            />
                                            <label
                                                htmlFor="familia"
                                                className="label-group-content">
                                                Familia
                                            </label>
                                        </div>

                                        <div className="col-lg-12-content">
                                            <select
                                                id="idUnidad"
                                                name="idUnidad"
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
                                            <label
                                                htmlFor="placa"
                                                className="label-group-content">
                                                Unidad Medida
                                            </label>

                                        </div>

                                        <div className="col-lg-12-content">
                                            <select
                                                id="idMoneda"
                                                name="idMoneda"
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
                                            <label
                                                htmlFor="placa"
                                                className="label-group-content">
                                                Moneda
                                            </label>
                                        </div>

                                    </div>

                                    <div className="input-group-content col-lg-8-content">
                                        <div className="card-caracteristica">
                                            <div className="pull-left-content">
                                                <h1 className="title-logo-content"> Caracteristicas </h1>
                                            </div>
                                            <div className="pull-right-content">
                                                <i
                                                    className="fa fa-plus btn-content btn-secondary-content"
                                                    style={{ marginRight: 26, marginTop: 15}}
                                                    onClick={() => {
                                                        this.state.idsCaracteristicas.push(0);
                                                        this.state.descDetalle.push("");
                                                        this.setState({
                                                            idsCaracteristicas: this.state.idsCaracteristicas,
                                                            descDetalle: this.state.descDetalle
                                                        })
                                                    }}>
                                                </i>
                                            </div>

                                            <div className="caja-content caja-content-adl">
                                                {
                                                    this.state.idsCaracteristicas.map((item,key) => (
                                                        <div key={key}>
                                                            <div className="col-lg-4-content col-md-4-content col-sm-3-content col-xs-3-content">
                                                                <select
                                                                    id={key}
                                                                    key={key}
                                                                    value={this.state.idsCaracteristicas[key]}
                                                                    className="form-control-content"
                                                                    onChange={this.cambioCaracteristica.bind(this)}>

                                                                    <option value="0">Seleccionar</option>
                                                                    {
                                                                        this.state.caracteristicas.map((item,key)=>(
                                                                            <option
                                                                                value={item.idproduccaracteristica}
                                                                                key={key}>
                                                                                {item.caracteristica}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>

                                                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                                                <input
                                                                    id={key}
                                                                    type="text"
                                                                    placeholder="Ingresar Descripcion"
                                                                    value={this.state.descDetalle[key]}
                                                                    className="form-control-content"
                                                                    onChange={this.cambioInputC.bind(this)}/>
                                                            </div>

                                                            <div className="col-lg-2-content col-md-1-content text-center-content">
                                                                <i
                                                                    className="fa fa-remove btn-content btn-danger-content"
                                                                    key={key}
                                                                    onClick={() => this.eliminarFilaCaract(key)}>
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
                                                {componentImg}
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
                                        
                                        { componentCosto }

                                        <div className="input-group-content col-lg-2-content">
                                            <button
                                                type="button"
                                                className="btn-content btn-primary-content"
                                                onClick={this.openModalAddCostos.bind(this)}>
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
                                                onClick={() => this.openModalLPrecios()}>
                                                Agregar a Lista Precios
                                            </button>

                                        </div>

                                    </div>

                                </div>

                                { componentStockAlmacen }

                                { componentStock }

                                <div 
                                    className="col-lg-10-content"
                                    style={{ marginLeft: 20 }}
                                    >
                                    <div className="col-lg-6-content">
                                        <label
                                            htmlFor="palclaves"
                                            className="label-group-content"
                                        >
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

                                    <div className="input-group-content col-lg-6-content">
                                        <label
                                            htmlFor="notas"
                                            className="label-group-content"
                                        >
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
                                    <div className="col-lg-6-content col-md-6-content text-center-content">
                                        <button type="submit" className="btn-content btn-sm-content btn-success-content">
                                            Guardar
                                        </button>
                                    </div>
                                    <div className="col-lg-6-content col-md-6-content">
                                        <button
                                            className="btn-content btn-sm-content btn-danger-content"
                                            type="button"
                                            onClick={() => this.setState({redirect: true})}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                        </form>
                    </div>

                </div>

            </div>


        );
    }
}
