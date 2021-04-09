import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import styles from './styles.css';
import { Select, message, Modal, Result } from 'antd';
import 'antd/dist/antd.css';
import { Redirect } from 'react-router-dom';
import Input from '../../../componentes/input';
import ws from '../../../utils/webservices';
import CSelect from '../../../componentes/select2';
import CImage from '../../../componentes/image';
import CTreeSelect from '../../../componentes/treeselect';
import { readPermisions } from '../../../utils/toolsPermisions';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
import C_TextArea from '../../../componentes/data/textarea';
import C_Input from '../../../componentes/data/input';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Select from '../../../componentes/data/select';
import C_TreeSelect from '../../../componentes/data/treeselect';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
const {Option} = Select;
  
export default class EditProducto extends Component {

    constructor(props){
        super(props);
        this.state = {
            descripcion: '', 
            tipo: 'P',      
            palclaves: '',
            notas: '',
            idMoneda: '',
            idFamilia: undefined,
            idUnidad: '',
            producto: {},
            costox: '',

            stock: 0,
            stockmin: 0,
            stockmax: 0,

            nameImages: [],
            images: [],
            fotos: [],
            idsFotos: [],
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
            arrayFamilia: [],
            caracteristicas: [],
            unidadesMedidas: [],
            codigos: [],
            codigosElim: [],
            masCodigo: '',
            descripcionCodigo: '',
            arrayCostos: [],

            dataCaracteristicas: [],
            valuesSelectCar: [],
            valuesCaract: [],
            idsCaracActuales: [],
            idsCaracteristicasDel: [],

            mostrarListaCaract: false,
            activeIndex: 0,
            animating: false,
            imagenNoValida: false,
            isProducto: false,
            isProducto2: false,
            visibleAddCodigo: false,
            visibleAddCosto: false,

            redirect: false,
            displayModalPrueba: false,
            mostrarTipo: true,
            modalImage: 'none',
            tecla: 0,
            eliminarAlmProd: [],
            cursorAllowed: '',
            noSesion: false,
            configListaPrecio: false, //fabrica
            configCodigo: false, //cliente - codigos propios
            configOtrosCodigos: false,
            configMasCostos: false,
            configMasUnAlmacen: false,
            configEditCostoProd: false,
            configEditStock: false,

            modalCancel: false,
            modalOk: false,
            loadingOk: false,
        }

        this.permisions = {
            codigo: readPermisions(keys.producto_input_codigo),
            add_cod: readPermisions(keys.producto_btn_agregarCodigos),
            tipo: readPermisions(keys.producto_select_tipo),
            moneda: readPermisions(keys.producto_select_moneda),
            unidad:readPermisions(keys.producto_select_unidadMedida),
            descripcion: readPermisions(keys.producto_input_descripcion),
            familia: readPermisions(keys.producto_select_familia),
            precio: readPermisions(keys.producto_input_precio),
            costo: readPermisions(keys.producto_input_costo),
            caract: readPermisions(keys.producto_caracteristicas),
            foto: readPermisions(keys.producto_imagenes),
            add_costo: readPermisions(keys.producto_btn_agregarCosto),
            add_lista: readPermisions(keys.producto_btn_agregarListaPrecio),
            stock_alm: readPermisions(keys.producto_stockAlmacen),
            stock_tot: readPermisions(keys.producto_totalStock),
            pal_clave: readPermisions(keys.producto_textarea_palabrasClaves),
            notas: readPermisions(keys.producto_textarea_nota),
        }

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.addCaracteristica = this.addCaracteristica.bind(this);
        this.eliminarFilaCaract = this.eliminarFilaCaract.bind(this);
        this.cambioInputC = this.cambioInputC.bind(this);
        this.cambioCaracteristica = this.cambioCaracteristica.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    validarData() {
        if (!this.validarDatos()) return;
        this.setState({
            modalOk: true
        })
    }

    onOkMO() {
        this.editarProducto();
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

    hijosFamilia(idpadre, array) {
        
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            
            if (array[i].idpadrefamilia == idpadre) {
                const elemento = {
                    title: array[i].descripcion,
                    value: array[i].idfamilia,
                    key: idpadre + '-' + array[i].idfamilia
                };
                hijos.push(elemento);
            }
        }
        return hijos;
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

    cargarFamilias(familias) {
        let idDefecto = familias[0].idfamilia;
        var array_aux = [];
        for (var i = 0; i < familias.length; i++) {
            if (familias[i].idpadrefamilia == null) {
                var elem = {
                    title: familias[i].descripcion,
                    value: familias[i].idfamilia,
                    key: familias[i].idfamilia
                };
                array_aux.push(elem);
            }
        }
        this.arbolFamilias(array_aux, familias);
        
        this.setState({
            familias: array_aux,
            idFamilia: idDefecto
        });
    }

    hijosUbicaciones(idpadre, array) {
        
        //var array =  this.state.familias;
        
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidalmacenubicacion == idpadre) {
                const elemento = {
                    title: array[i].descripcion,
                    value: array[i].idalmacenubicacion,
                    key: idpadre + '-' + array[i].idalmacenubicacion
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    arbolUbicaciones(data, array) {

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosUbicaciones(data[i].value, array);
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
        this.state.arbolUbicaciones[index] = newArray;

        this.setState({
            arbolUbicaciones: this.state.arbolUbicaciones
        });

    }

    cargarCaracteristicas(data) {
        let idsActuales = [];
        let array = [];
        let arr = [];
        let arr2 = [];
        for (let i = 0; i < data.length; i++) {
            let elem = {
                idpc: data[i].idprodcaracteristica,
                descripcion: data[i].descripcion,
                idpcd: data[i].iddetallecaract
            };
            array.push(elem);
            idsActuales.push(data[i].iddetallecaract);
            arr.push(data[i].descripcion);
            arr2.push(data[i].idprodcaracteristica);
        }
        this.setState({
            dataCaracteristicas: array,
            valuesSelectCar: arr2,
            valuesCaract: arr,
            idsCaracActuales: idsActuales
        });
    }
    
    obtenerProducto() {

        httpRequest('get', ws.wsproducto + '/' + this.props.match.params.id + '/edit')
        .then((result) => {
            if (result.response == 1) {
                let configcli = result.configcli;
                let configfab = result.configfab;

                this.cargarCaracteristicas(result.caracteristicas);
                this.cargarFamilias(result.familias);

                let carc = result.caracteristicas2;
                let length = carc.length;
                let dataCaract = [];
                for (let i = 0; i < length; i++) {
                    dataCaract.push({
                        id: carc[i].idproduccaracteristica,
                        title: carc[i].caracteristica
                    });
                }

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
                if (result.producto.costodos != 0) {
                    this.state.arrayCostos.push(result.producto.costodos);
                }
                if (result.producto.costotres != 0) {
                    this.state.arrayCostos.push(result.producto.costotres);
                }
                if (result.producto.costocuatro != 0) {
                    this.state.arrayCostos.push(result.producto.costocuatro);
                }
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
                    fotos: result.images,
                    idsFotos: result.idsImages,
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
                    cursorAllowed: classCursorAllowed,
                    arrayCostos: this.state.arrayCostos,
                    nro: result.producto.idproducto,
                    //------------------------------------------------------
                    configCodigo: configcli.codigospropios,
                    configOtrosCodigos: configcli.otroscodigos,
                    idMoneda: configcli.monedapordefecto,
                    configMasCostos: configcli.masdeuncosto,
                    configMasUnAlmacen: configcli.masdeunalmacen,
                    configEditCostoProd: configcli.editcostoproducto,
                    configEditStock: configcli.editarstockproducto,
                    //tipo: configcli.clienteesabogado ? 'S' : 'P',
                    isProducto: configcli.clienteesabogado ? false : true,

                    configListaPrecio: configfab.comalmacenlistadeprecios,
                    almacenes: result.almacenes2,
                    almacenUbicaciones: result.ubicaciones,

                    caracteristicas: dataCaract,
                    //idsCaracteristicas: idsCaracteristicas,
                    //descDetalle: descDetalle,

                    monedas: result.monedas,

                    unidadesMedidas: result.unidades,

                    listaPrecios: result.listaprecios
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

    componentDidMount() {
        
        this.obtenerProducto();
        
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

        let data = this.state.idsAlmacen;
        let length = data.length;
        for (let i = 0; i < length; i ++) {
            if (data[i] != 0)
                return true;
        }
        message.warning('Debe seleccionar como minimo un almacen');
        return false;
        /*
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
        */
    }
    
    validarDatos() {
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
        
    }

    getCodigos(idsCodigos, codigos, descripciones, newsCodigos, newsDesc) {

        for (let i = 0; i < this.state.codigos.length; i++) {
            if (this.state.codigos[i].idproduccodigoadicional == undefined) {
                newsCodigos.push(this.state.codigos[i].codproduadi);
                newsDesc.push(this.state.codigos[i].descripcion);
            } else {
                idsCodigos.push(this.state.codigos[i].idproduccodigoadicional);
                codigos.push(this.state.codigos[i].codproduadi);
                descripciones.push(this.state.codigos[i].descripcion);
            }
        }
    }

    editarProducto(e) {
        
        let stock = this.state.stock;
        let stockmin = this.state.stockmax;
        let stockmax = this.state.stockmin;
        if (stock == '') {
            stock = 0;
        }
        if (stockmax == '') {
            stockmax = 0;
        }
        if (stockmin == '') {
            stockmin = 0;
        }
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
            stock: stock,
            stockmax: stockmax,
            stockmin: stockmin
        };
            
        body.nameImages = JSON.stringify(this.state.nameImages);
        body.images = JSON.stringify(this.state.images);
        body.fotosEliminados = JSON.stringify(this.state.fotosElim);

        let arrayCostos = this.state.arrayCostos;
        if (arrayCostos.length > 0) {
            body.costodos = arrayCostos[0];
            if (arrayCostos.length > 1) {
                body.costotres = arrayCostos[1];
            } else {
                body.costotres = 0;
                body.costocuatro = 0;
            }
            if (arrayCostos.length > 2) {
                body.costocuatro = arrayCostos[2];
            } else {
                body.costocuatro = 0;
            }
        } else {
            body.costodos = 0;
            body.costotres = 0;
            body.costocuatro = 0;
        }

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
            for (let i = 0; i < array.length ;i++) {
                let stock = this.state.dataStock[array[i]] == '' ? 0 : parseFloat(this.state.dataStock[array[i]]);
                let stockmin = this.state.dataStockmin[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmin[array[i]]);
                let stockmax =  this.state.dataStockmax[array[i]] == '' ? 0 : parseFloat(this.state.dataStockmax[array[i]]);

                arrayIdsAlmacen.push(this.state.idsAlmacen[array[i]]);
                arrayStocks.push(stock);
                arrayStocksMax.push(stockmax);
                arrayStocksMin.push(stockmin);
                arrayUbicaciones.push(this.state.dataUbicacion[array[i]]);
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

        let idsCodigos = [];
        let codigos = [];
        let descripciones = [];
        let newsCodigos = [];
        let newsDesc = [];
        this.getCodigos(idsCodigos, codigos, descripciones, newsCodigos, newsDesc);
        body.idscodigos = JSON.stringify(idsCodigos);
        body.newscodigos = JSON.stringify(newsCodigos);
        body.newsdesc = JSON.stringify(newsDesc);
        body.codigos = JSON.stringify(codigos);
        body.descripciones = JSON.stringify(descripciones);
        body.codeliminados = JSON.stringify(this.state.codigosElim);
        
        httpRequest('put', ws.wsproducto + '/' + this.state.producto.idproducto, body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    redirect: true
                });
                message.success(result.message);
            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            } else {
                message.error(result.message);
            }

        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
        
    }

    cambioAlmacen(index, value) {
        
        if (index >= this.state.verAlmacenes.length) {
            let valor = parseInt(value);
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
            this.generarArbolAlmacen(valor, index);
        }
        
    }

    sumar(data) {
        let sumaTotal = 0;
        for (let i = 0; i < data.length; i++) {
            if (!isNaN(data[i])) {
                sumaTotal = sumaTotal + parseFloat(data[i]);
            }
        }
        return isNaN(sumaTotal) ? 0 : sumaTotal;
    }
    cambioInputAStock(index, value) {
        
        if (this.state.idsAlmacen[index] == 0 || isNaN(value)) return;
        if (value < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        this.state.dataStock[index] = value;
        let totalStock = this.sumar(this.state.dataStock);
        this.setState({
            dataStock: this.state.dataStock,
            stock: totalStock
        });
       
    }

    cambioInputAStockMin(index, value) {
        
        if (this.state.idsAlmacen[index] == 0 || isNaN(value)) return;
        if (value < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        if (isNaN(value)) {
            value = 0;
        }  
        this .state.dataStockmin[index] = value;
        let totalStockMin = this.sumar(this.state.dataStockmin);
        this.setState({
            dataStockmin: this.state.dataStockmin,
            stockmin: totalStockMin
        });
       
    }

    cambioInputAStockMax(index, value) {
        //let index = e.target.id;
        /*
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }
        let valor = parseFloat(value);
        */
        if (this.state.idsAlmacen[index] == 0 || isNaN(value)) return;
        if (value < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        if (isNaN(value)) {
            value = 0;
        }  
        this .state.dataStockmax[index] = value;
        let totalStockMax = this.sumar(this.state.dataStockmax);
        this.setState({
            dataStockmax: this.state.dataStockmax,
            stockmax: totalStockMax
        });
       
    }

    cambioInputAUbicacion(index, value) {
        if(!this.state.isProducto) return;
        this .state.dataUbicacion[index] = value;

        this.setState({
            dataUbicacion: this.state.dataUbicacion
        });
       
    }

    cambioDescripcion(value) {
        this.setState({
            descripcion: value
        })
    }

    cambioTipo(value) {
        if (value == "P") {
            this.setState({
                isProducto: true,
                tipo: value,
                cursorAllowed: ''
            })
        } else {
            this.setState({
                tipo: value,
                isProducto: false,
                cursorAllowed: 'cursor-not-allowed'
            })
        }
    }

    openModalAddCodigo() {
        this.setState({visibleAddCodigo: true});
    }

    closeModalAddCodigo() {
        this.setState({visibleAddCodigo: false});
    }

    cambioPrecio(value) {
        /*
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }
        */
        this.setState({
            precio: value
        });
        
    }

    cambioCosto(value) {
        /*
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }
        */
       if (value < 0) return;
        this.setState({
            costo: value
        });
        
    }

    cambioPalClaves(value) {
        this.setState({
            palclaves: value
        });
    }

    cambioNotas(value) {
        this.setState({
            notas: value
        })
    }

    cambioMoneda(e) {
        this.setState({
            idMoneda: e
        })
    }

    cambioCostoX(value) {
        /*
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }
        */
       if (value < 0) return;
        this.setState({
            costox: value
        });
        
    }

    cambioCosto2(value) {
        /*
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            return;
        }
        */
        if (value < 0 ) return;
        this.state.arrayCostos[0] = value;
        this.setState({
            arrayCostos: this.state.arrayCostos
        });
        
    }

    cambioDescCodigo(value) {
        this.setState({
            descripcionCodigo: value
        });
    }
    
    cambioMasCodigo(value) {
        this.setState({
            masCodigo: value
        });
    }

    cambioCodProductoOtro(index, value) {
        this.state.codigos[index].codproduadi = value;
        this.setState({
            codigos: this.state.codigos
        });
    }

    cambioFamilia(value) {
        this.setState({
            idFamilia: value
        })
    }

    openModalAddCostos() {
        this.setState({visibleAddCosto: true});
    }

    closeModalAddCostos() {
        this.setState({visibleAddCosto: false});
    }

    cambioCaracteristica(event) {
        
        let index = event.id;
        let value = event.value;
        this.state.dataCaracteristicas[index].idpc = value;
        this.state.valuesSelectCar[index] = value;
        this.setState({
            dataCaracteristicas: this.state.dataCaracteristicas,
            valuesSelectCar: this.state.valuesSelectCar
        })
    }
    
    cambioInputC(event) {
        let index = event.id;
        let valor = event.value;
        this.state.dataCaracteristicas[index].descripcion = valor;
        this.state.valuesCaract[index] = valor;

        this.setState({
            dataCaracteristicas: this.state.dataCaracteristicas,
            valuesCaract: this.state.valuesCaract
        });
    }

    cambioUnidad(value) {
        this.setState({
            idUnidad: value
        });
    }

    selectImg(e) {

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

            const item = {
                src: e.target.result,
                altText: name,
                caption: name
            };
            const newIndex = this.state.fotos.length;
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
                    e.target.result
                ],
                idsFotos: [
                    ...this.state.idsFotos,
                    -1
                ],
                indexImg: newIndex
            });
        
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

    next() {
        this.setState({
            indexImg: (this.state.indexImg + 1) % this.state.fotos.length,
        })
    }

    prev() {
        this.setState({
            indexImg: (this.state.indexImg + this.state.fotos.length - 1) % this.state.fotos.length,
        })
    }


    componentImg() {
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
                    src={this.state.fotos[this.state.indexImg]}
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
                    <img src={this.state.fotos[this.state.indexImg]}
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
        let array = this.state.dataCaracteristicas;
        if (array[index].idpcd > 0) {
            this.state.idsCaracteristicasDel.push(array[index].idpcd);
            let position = this.state.idsCaracActuales.indexOf(array[index].idpcd);
            if (position >= 0) {
                this.state.idsCaracActuales.splice(position, 1);
            }
        }
        this.state.dataCaracteristicas.splice(index,1);
        this.state.valuesCaract.splice(index,1);
        this.state.valuesSelectCar.splice(index,1);

        this.setState({
            idsCaracteristicasDel: this.state.idsCaracteristicasDel,
            dataCaracteristicas: this.state.dataCaracteristicas,
            idsCaracActuales: this.state.idsCaracActuales,
            valuesCaract: this.state.valuesCaract,
            valuesSelectCar: this.state.valuesSelectCar,
        });
        
    }

    deleteImgIndex() {
        
        var index = this.state.indexImg;
        if (this.state.idsFotos[index] == -1) {

            let indexElim = index - this.state.indexInicio;
            this.state.nameImages.splice(indexElim, 1);
            this.state.images.splice(indexElim, 1);

        } else {
            this.state.fotosElim.push(this.state.idsFotos[index]);
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

    }

    showConfirmEdit() {

        if(!this.validarDatos()) return;
        const editarProducto = this.editarProducto.bind(this);
        Modal.confirm({
          title: 'Editar Producto',
          content: '¿Estas seguro de guardar los cambios?',
          onOk() {
            editarProducto();
          },
          onCancel() {
          },
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }

    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: 'Cancelar Editar Producto',
            content: 'Los cambios realizados no se guardaran, ¿Desea continuar?',
            onOk() {
              redirect();
            },
            onCancel() {
            },
          });
    }

    openModalLPrecios() {
        this.setState({ displayModalLP: true });
    }

    closeModalLPrecios() {
        this.setState({ displayModalLP: false });
    }

    openModalPrueba() {
        this.setState({displayModalPrueba: true})
    }

    closeModalPrueba() {
        this.setState({displayModalLPrecios: false})
    }

    addRowAlmacen() {
        if (!this.state.configMasUnAlmacen && this.state.idsAlmacen.length > 0) {
            message.warning('No se puede agregar mas almacenes');
            return;
        }
        this.state.idsAlmacen.push(0);
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
        let totalStock = this.state.stock - parseFloat(this.state.dataStock[index]);
        let totalStockMax = this.state.stockmax - parseFloat(this.state.dataStockmax[index]);
        let totalStockMin = this.state.stockmin - parseFloat(this.state.dataStockmin[index]);
        this.state.idsAlmacen.splice(index, 1);
        this.state.dataStock.splice(index, 1);
        this.state.dataStockmax.splice(index, 1);
        this.state.dataStockmin.splice(index, 1);
        this.state.dataUbicacion.splice(index, 1);
        this.state.arbolUbicaciones.splice(index, 1);
        this.state.auxiliar.splice(index, 1);
        //let totalStock = this.sumar(this.state.dataStock);
        //let totalStockMax = this.sumar(this.state.dataStockmax);
        //let totalStockMin = this.sumar(this.state.dataStockmin);
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

    agregarCodigo() {
        
        let codigo = this.state.masCodigo;
        let descrip = this.state.descripcionCodigo;
        
        if (codigo.length > 0 && descrip.length > 0) {
            this.state.codigos.push({
                codproduadi: codigo,
                descripcion: descrip
            });
            this.setState({
                codigos: this.state.codigos,
                masCodigo: '',
                descripcionCodigo: ''
            });
            

        } else {
            message.error('No deben quedar campos vacios');
        }
        
    }

    deleteCodigo(index) {
        if (this.state.codigos[index].idproduccodigoadicional != undefined) {
            this.state.codigosElim.push(this.state.codigos[index].idproduccodigoadicional);
            message.success('UN NUEVO A ELIMINAR');
        }
        this.state.codigos.splice(index, 1);
        this.setState({
            codigos: this.state.codigos,
            codigosElim: this.state.codigosElim
        });
    }

    removeCosto(index) {
        this.state.arrayCostos.splice(index, 1);
        this.setState({
            arrayCostos: this.state.arrayCostos
        });
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

    componentAddCostos() {
        return (
            <div className="forms-groups">
                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                    <div className='cols-lg-2 cols-md-2'></div>
                    <C_Input 
                        type="number" 
                        title="Costo"
                        value={this.state.costox}
                        onChange={this.cambioCostoX.bind(this)}
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                    />

                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                        <C_Button onClick={() => this.addCosto()}
                            type='primary' title='Agregar'
                        />
                    </div>    

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead style={{background: '#fafafa'}}>
                                    <tr>
                                        <th>Descripcion</th>
                                        <th>Costo</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.arrayCostos.map((item, key) => {
                                        let index = key + 2;
                                        let label = "Costo " + index; 
                                        return (
                                            <tr key={key}>
                                                <td>{label}</td>
                                                <td>{item}</td>
                                                <td style={{textAlign: 'center'}}>
                                                    <C_Button title={<i className="fa fa-remove"></i>}
                                                        type='danger' onClick={() => this.removeCosto(key)}
                                                        size='small'
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentCosto() {
        let array =  this.state.arrayCostos;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i] !== 0) {
                return (
                    <C_Input 
                        type="number" 
                        title="Costo 2"
                        value={this.state.arrayCostos[i]}
                        className='cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12'
                        onChange={this.cambioCosto2.bind(this)}
                    />
                )
            }
        }
        return null;
    }

    componentAddCodigo() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        title="Codidgo"
                        value={this.state.masCodigo}
                        onChange={this.cambioMasCodigo.bind(this)}
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                    />
                    <C_Input 
                        title="Descripcion"
                        value={this.state.descripcionCodigo}
                        onChange={this.cambioDescCodigo.bind(this)}
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                    />
                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                        <C_Button onClick={() => this.agregarCodigo()} 
                            type='primary' title='Agregar'
                        />
                    </div>
                        
                </div>

                <div className="cols-lg-12 cols-md-12 cols-md-12 cols-xs-12">
                <div className="tabless">
                        <table className="tables-respons">
                            <thead style={{background: '#fafafa'}}>
                                <tr>
                                    <th>Nro</th>
                                    <th>Codigo</th>
                                    <th>Descripcion</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.codigos.map((item, key) => (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{item.codproduadi}</td>
                                        <td>{item.descripcion}</td>
                                        <td style={{textAlign: 'center',}}>
                                            <C_Button title={<i className="fa fa-remove"></i>}
                                                type="danger" size="small"
                                                onClick={this.deleteCodigo.bind(this, key)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        )
    }

    listaAlmacenes() {

        let data = this.state.almacenes;
        let length = data.length;
        let arr = [<Option key={-1} value={0}>Seleccionar</Option>];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    verificarPermisosStockAlm() {
        if (this.permisions.stock_alm == undefined) {
            return this.componentStockAlmacen();
        } else if(this.permisions.stock_alm.visible == 'A') {
            return this.componentStockAlmacen();
        }
        return null;
    }

    addAlmacen() {
        //if (this.state.configMasUnAlmacen) {
            return (
                <C_Button onClick={() => this.addRowAlmacen() }
                    type='primary' size='small'
                    title={<i className="fa fa-plus"></i>}
                    style={{marginRight: 30,marginTop: 15,
                        padding: 3}}
                />
            );
        //}
        //return null;
    }

    removeAlmacen(id) {
        if (this.state.configMasUnAlmacen) {
            return (
                <div style={{paddingTop: 10, width: 60, minWidth: 60, height: 30, textAlign: 'center' }}>
                    <C_Button title={<i className='fa fa-remove'></i>}
                        type='danger' size='small'
                        onClick={() => this.eliminarFilaAlmacen(id)}
                    />
                </div>
            );
        }
        return null;
    }

    componentStockAlmacen() {
        
        const listaAlmacenes = this.listaAlmacenes();
        //if (this.state.isProducto) {
            //if (this.state.isProducto2) {
        const addAlmacen = this.addAlmacen();

        return (
            <div className="table_index_comerce" style={{width: '100%', padding: 5, border: '#e8e8e8 solid', 
                paddingBottom: 20, marginBottom: 10, maxHeight: 400,
            }}
        >
            <div
                style={{ padding: 0, display: 'flex', marginBottom: 5,}}
            >
                <C_Input className=''
                    readOnly={true}
                    style={{width: 930, minWidth: 930, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 18, textAlign: 'left', paddingLeft: 10, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', 
                    }}
                    value={'Stock por Almacen'}
                />
                { addAlmacen }
            </div>
            <div className="cabecera_comerce">
                
                <C_Input className=''
                    readOnly={true}
                    style={{width: 250, minWidth: 250, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Almacen'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 120, minWidth: 120, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Stock'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 120, minWidth: 120, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Stock Minimo'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 120, minWidth: 120, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Stock Maximo'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 250, minWidth: 250, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Ubicacion'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 50, minWidth: 50, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={'Accion'}
                />
                <C_Input className=''
                    readOnly={true}
                    style={{width: 10, minWidth: 10, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                        fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                        border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                    }}
                    value={''}
                />
            </div>
            <div className="body_commerce" 
                    style={{border: '1px solid #e8e8e8', marginTop: 10 /*maxHeight: 250, overflowY: 'auto',*/ }}
            >
                {
                    this.state.idsAlmacen.map((item, key) => (
                        <div style={{ display: 'flex', paddingTop: 8, paddingBottom: 8, position: 'relative'
                            }} key={key} 
                        >
                            <C_Select
                                value={this.state.idsAlmacen[key]}
                                onChange={this.cambioAlmacen.bind(this, key)}
                                component={listaAlmacenes}
                                style={{width: 240, minWidth: 240, margin: 10, }}
                                className=''
                            />
                            <C_Input className=''
                                value={this.state.dataStock[key]}
                                onChange={this.cambioInputAStock.bind(this, key)}
                                style={{width: 110, minWidth: 110, textAlign: 'right', 
                                    paddingRight: ((this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P'))? 18 : 5, margin: 10, 
                                }}
                                readOnly={(this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P') ? false : true}
                                number={true}
                            />
                            <C_Input className=''
                                value={this.state.dataStockmin[key]}
                                onChange={this.cambioInputAStockMin.bind(this, key)}
                                style={{width: 110, minWidth: 110, textAlign: 'right', 
                                    paddingRight: ((this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P'))? 18 : 5, margin: 10, 
                                }}
                                readOnly={(this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P') ? false : true}
                                number={true}
                            />
                            <C_Input className=''
                                value={this.state.dataStockmax[key]}
                                onChange={this.cambioInputAStockMax.bind(this, key)}
                                style={{width: 110, minWidth: 110, textAlign: 'right', 
                                    paddingRight: ((this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P'))? 18 : 5, margin: 10, 
                                }}
                                readOnly={(this.state.isProducto && this.state.configEditStock && this.state.tipo == 'P') ? false : true}
                                number={true}
                            />
                            <C_TreeSelect className=''
                                value={this.state.dataUbicacion[key]}
                                treeData={this.state.arbolUbicaciones[key]}
                                onChange={this.cambioInputAUbicacion.bind(this, key)}
                                readOnly={!this.state.isProducto}
                                style={{width: 240, minWidth: 240, margin: 10, }}
                            />
                            { this.removeAlmacen(key) }
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 10, minWidth: 10, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={''}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
        );
            
    }

    verificarPermisosStock() {
        if (this.permisions.stock_tot == undefined) {
            return this.componentStock();
        } else if (this.permisions.stock_tot.visible == 'A') {
            return this.componentStock(); 
        }
        return null;
    }

    componentStock() {

        if (this.state.isProducto) {
            if (this.state.isProducto2) {
                return (
                    <div className="forms-groups margin-group-content">
    
                        <div className="pull-left-content">
                            <h2 className="title-logo-content">Totales Stock</h2>
                        </div>
    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Total Stock"
                                    value={this.state.stock}
                                    readOnly={true}
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Total Minimo"
                                    value={this.state.stockmin}
                                    readOnly={true}
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Total Maximo"
                                    value={this.state.stockmax}
                                    readOnly={true}
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                        </div>
                    </div>
    
                );
            } else {
                return (
                    <div className="forms-groups margin-group-content">
    
                        <div className="pull-left-content">
                            <h2 className="title-logo-content">Totales Stock</h2>
                        </div>
    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Stock"
                                    value={this.state.stock}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Stock Minimo"
                                    value={this.state.stockmin}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 inputs-groups">
                                <Input 
                                    title="Stock Maximo"
                                    value={this.state.stockmax}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>
    
                );
            }
            

        } else {

            return null;

        }
    }

    addCaracteristica() {
        let elem = {
            idpc: 0,
            descripcion: '',
            idpcd: -1
        };
        this.setState({
            dataCaracteristicas: [
                ...this.state.dataCaracteristicas,
                elem
            ],
            valuesCaract: [
                ...this.state.valuesCaract,
                ""
            ],
            valuesSelectCar: [
                ...this.state.valuesSelectCar,
                ''
            ]
        });
    }

    listaUnidades() {
        let unidades = this.state.unidadesMedidas;
        let length = unidades.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} 
                    id={unidades[i].idunidadmedida} 
                    value={unidades[i].idunidadmedida}>
                {unidades[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    listaMonedas() {
        let monedas = this.state.monedas;
        let length = monedas.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} 
                    id={monedas[i].idmoneda} 
                    value={monedas[i].idmoneda}>
                {monedas[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.producto_index}/>
            );
        }
        const componentImg = this.componentImg();
        const verificarPermisosStockAlm = this.verificarPermisosStockAlm();
        //const componentStockAlmacen = this.componentStockAlmacen();
        //const componentStock = this.componentStock();
        const verificarPermisosStock = this.verificarPermisosStock();
        const componentImage = this.componentImgModal();
        const componentAddCodigo = this.componentAddCodigo();
        const componentAddCostos = this.componentAddCostos();
        const componentCosto = this.componentCosto();
        const listaUnidades = this.listaUnidades();
        const listaAlmacenes = this.listaAlmacenes();
        const listaMonedas = this.listaMonedas();
        
        let codigoProd = this.state.producto.idproducto;
        if (this.state.configCodigo) {
            codigoProd = this.state.producto.codproducto;
        }
        return (

            <div>
                
                <div 
                    className="divFormularioImagen" 
                    style={{'display': this.state.modalImage}}
                >
                     { componentImage }
                </div>

                <div 
                    className="divModalImagen" 
                    onClick={this.cerrarModalImage.bind(this)}
                    style={{'display': this.state.modalImage}}
                >  
                </div>

                <Confirmation
                    visible={this.state.modalOk}
                    title="Editar Registro de Producto"
                    onCancel={this.onCancelMO}
                    loading={this.state.loadingOk}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de editar el producto?
                            </label>
                        </div>
                    ]}
                />

                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Edicion de Producto"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar la edicion del producto?,
                                Los cambios realizados no se guardaran.
                            </label>
                        </div>
                    ]}
                />

                <Modal
                    title="Agregar Codigos"
                    visible={this.state.visibleAddCodigo}
                    onOk={this.closeModalAddCodigo.bind(this)}
                    onCancel={this.closeModalAddCodigo.bind(this)}
                    //style={{ width: WIDTH_WINDOW}}
                    footer={
                        <C_Button
                            title="Aceptar"
                            onClick={this.closeModalAddCodigo.bind(this)}
                        />
                    }
                >
                    { componentAddCodigo }

                </Modal>

                <Modal
                    title="Agregar Costos"
                    visible={this.state.visibleAddCosto}
                    onOk={this.closeModalAddCostos.bind(this)}
                    onCancel={this.closeModalAddCostos.bind(this)}
                    //style={{ width: WIDTH_WINDOW}}
                    footer={
                        <C_Button
                            title="Aceptar"
                            onClick={this.closeModalAddCostos.bind(this)}
                        />
                    }
                >
                    { componentAddCostos }

                </Modal>

                <div className="rows">

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="title-logo-content"> Editar Producto </h1>
                        </div>
                    </div>
    
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Codigo Prod"
                                value={codigoProd}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                                //configAllowed={this.state.configCodigo}
                            />
                            
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Button type='primary'
                                    onClick={this.openModalAddCodigo.bind(this)}
                                    title="Agregar Otros Codigos"
                                    permisions={this.permisions.add_cod}
                                    configAllowed={this.state.configOtrosCodigos}
                                    style={{marginLeft: '-5px'}}
                                />
                            </div>
                            <C_Select 
                                value={this.state.tipo}
                                title={"Tipo"}
                                onChange={this.cambioTipo.bind(this)}
                                readOnly={this.state.isProducto2}
                                permisions={this.permisions.tipo}
                                component={[
                                    <Option key={0} value="P">Producto</Option>,
                                    <Option key={1} value="S">Servicio</Option>
                                ]}
                            />
                            <C_Select 
                                value={this.state.idMoneda}
                                title="Moneda"
                                onChange={this.cambioMoneda.bind(this)}
                                component={listaMonedas}
                                permisions={this.permisions.moneda}
                            />
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-xs-12'>
                            {
                                this.state.codigos.map((item, key) => (
                                    <C_Input key={key}
                                        title={item.descripcion}
                                        value={item.codproduadi}
                                        onChange={this.cambioCodProductoOtro.bind(this, key)}
                                        permisions={this.permisions.descripcion}
                                    />
                                ))
                            }
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Descripcion"
                                value={this.state.descripcion}
                                onChange={this.cambioDescripcion.bind(this)}
                                permisions={this.permisions.descripcion}
                                className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                            />
                            <C_TreeSelect 
                                title="Familia"
                                value={this.state.idFamilia}
                                treeData={this.state.familias}
                                placeholder="Seleccione una opcion"
                                onChange={this.cambioFamilia.bind(this)}
                                permisions={this.permisions.familia}
                            />
                            <C_Select
                                value={this.state.idUnidad}
                                title={"Unidad Medida"}
                                onChange={this.cambioUnidad.bind(this)}
                                component={listaUnidades}
                                permisions={this.permisions.unidad} 
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Caracteristica 
                                title="Caracteristicas"
                                data={this.state.caracteristicas}
                                onAddRow={this.addCaracteristica}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.valuesSelectCar}
                                onChangeSelect={this.cambioCaracteristica}
                                valuesInput={this.state.valuesCaract}
                                onChangeInput={this.cambioInputC}
                                onDeleteRow={this.eliminarFilaCaract}
                                permisions={this.permisions.caract}
                            />
                            <div className="cols-lg-4 cols-md-6 cols-sm-6 cols-xs-12">
                                <CImage
                                    onChange={this.selectImg.bind(this)}
                                    //image={this.state.img}
                                    images={this.state.fotos}
                                    next={this.next}
                                    prev={this.prev}
                                    index={this.state.indexImg}
                                    delete={this.deleteImg}
                                    permisions={this.permisions.foto}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Costo"
                                type="number"
                                value={this.state.costo}
                                onChange={this.cambioCosto.bind(this)}
                                permisions={this.permisions.costo}
                                readOnly={!this.state.configEditCostoProd}
                                className='cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12'
                                style={{ textAlign: 'right' }}
                            />
                            
                            { componentCosto }

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12" style={{paddingTop: 0}}>
                                <C_Button tupe='primary'
                                    title="Agregar otro costo"
                                    onClick={this.openModalAddCostos.bind(this)}
                                    permisions={this.permisions.add_costo}
                                    configAllowed={this.state.configMasCostos}
                                />
                            </div>

                            <C_Input 
                                type="number" 
                                title="Precio"
                                style={{ '-webkit-appearance': 'none' }}
                                className='cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12'
                                value={this.state.precio}
                                onChange={this.cambioPrecio.bind(this)}
                                permisions={this.permisions.precio}
                                //readOnly={!this.state.configEditCostoProd}
                                style={{ textAlign: 'right' }}
                            />

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12 txts-center">
                                <C_Button type='primary'
                                    title="Agregar a Lista Precios"
                                    onClick={this.openModalLPrecios.bind(this)}
                                    permisions={this.permisions.add_lista}
                                    configAllowed={this.state.configListaPrecio}
                                />
                            </div>
                        </div>

                    </div>

                    
                    { verificarPermisosStockAlm }

                    { verificarPermisosStock }

                    <div className="forms-groups"
                        style={{ marginLeft: 20 }}
                    >
                        <C_TextArea 
                            title="Palabras Claves"
                            value={this.state.palclaves}
                            onChange={this.cambioPalClaves.bind(this)}
                            permisions={this.permisions.pal_clave}
                        />
                        <C_TextArea 
                            title="Notas"
                            value={this.state.notas}
                            onChange={this.cambioNotas.bind(this)}
                            permisions={this.permisions.notas}
                        />

                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            <C_Button onClick={this.validarData.bind(this)}// this.showConfirmEdit.bind(this)}
                                type='primary'
                                title='Guardar'
                            />
                            <C_Button onClick={() => this.setState({ modalCancel: true })}
                                type='danger'
                                title='Cancelar'
                            />
                        </div>
                    </div>
                </div>
            </div>

            
        );
    }
}
