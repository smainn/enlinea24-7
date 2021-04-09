
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { message, Modal, Select } from 'antd';

import 'antd/dist/antd.css';
import { Redirect, withRouter } from 'react-router-dom';
import Input from '../../../componentes/input';

import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import CImage from '../../../componentes/image';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_TextArea from '../../../componentes/data/textarea';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import keysStorage from '../../../utils/keysStorage';


const { Option } = Select;

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;

class CreateProducto extends Component {

    constructor(props){
        super(props);
        this.state = {
            nro: 0,
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
            idMoneda: '',
            idFamilia: undefined,
            idClasificacion: 0,
            idUnidad: '',
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
            cursorAllowed: '',
            titleTipo: 'Producto',
            noSesion: false,
            configListaPrecio: false, //fabrica
            configCodigo: false, //cliente - codigos propios
            configOtrosCodigos: false, //cliente - otros codigos
            configMasCostos: false, //cliente - mas de un costo
            configMasUnAlmacen: false, //cliente - mas de un almacen
            configEditCostoProd: false,
            configEditStock: false,

            timeoutSearch: undefined,
            validarCodigo: 1,
            isabogado: false,
            modalCancel: false,
            modalOk: false,
            loadingOk: false
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
        
        this.redirect = this.redirect.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.addCaracteristica = this.addCaracteristica.bind(this);
        this.cambioCaracteristica = this.cambioCaracteristica.bind(this);
        this.cambioInputC = this.cambioInputC.bind(this);
        this.eliminarFilaCaract = this.eliminarFilaCaract.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        this.validarData = this.validarData.bind(this);
    }

    validarData() {
        if(!this.validarDatos()) return;
        if (!this.validarDatosAlmacen()) return;
        if (!this.validarDatosCaracteristicas()) return;
        this.setState({
            modalOk: true
        })
    }

    onOkMO() {
        this.guardarProducto();
        this.setState({
            loadingOk: true
        })
    }

    onCancelMO() {
        this.setState({
            modalOk: false
        })
    }

    onOkMC() {
        this.props.history.goBack();
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    handlePrecioProd(index, value) {
        if (value >= 0) {
            this.state.dataPreciosProd2[index] = value;
            this.setState({
                dataPreciosProd2: this.state.dataPreciosProd2
            });
        }
    }

    hijosProducto(idpadre) {
        
        var array =  this.state.productos;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
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
            var hijos = this.hijosProducto(data[i].value);
            if(hijos.length > 0){
                data[i].children = hijos;
            }

            this.arbolProductos(hijos);
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

    cargarCaracteristicas(array, caracteristicas, idsCaracteristicas, descDetalle) {

        let length = array.length;
        for (let i = 0; i < length; i++) {
            caracteristicas.push({
                id: array[i].idproduccaracteristica,
                title: array[i].caracteristica
            });
            if (i <= 2) {
                idsCaracteristicas.push('');
                descDetalle.push("");
            }
        }
    }
    validar_keyStorage(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    cargarAlmacenes(almacenes, ubicaciones) {

        let nElem = 1;
        let idalmacenDefecto = almacenes[0].idalmacen;
        if (this.state.configMasUnAlmacen) {
            nElem = 3;
            idalmacenDefecto = 0;
        }
        let idsAlmacen = [];
        let arrayStock = [];
        let arrayStockmin = [];
        let arrayStockmax = [];
        let arrayUbicacion = [];
        let arbolUbicacion = [];//new


        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                if (on_data.on_create == 'compra_create') {
                    bandera = true;
                }
            }
        }
        if (bandera) {
            for (let i = 0; i < 1; i++) {
                var idalmacen = this.validar_keyStorage(on_data.data_actual.idalmacen) ? 
                    isNaN(on_data.data_actual.idalmacen) ? idalmacenDefecto : on_data.data_actual.idalmacen : idalmacenDefecto;
                idsAlmacen.push(idalmacen);
                arrayStock.push('');
                arrayStockmax.push('');
                arrayStockmin.push('');
                arrayUbicacion.push("Seleccione una opcion");
                arbolUbicacion.push([]);
            }
        }else {
            for (let i = 0; i < nElem; i++) {
                idsAlmacen.push(idalmacenDefecto);
                arrayStock.push('');
                arrayStockmax.push('');
                arrayStockmin.push('');
                arrayUbicacion.push("Seleccione una opcion");
                arbolUbicacion.push([]);
            }
        }

        this.setState({
            almacenes: almacenes,
            idsAlmacen: idsAlmacen,
            dataStock: arrayStock,
            dataStockmax: arrayStockmax,
            dataStockmin: arrayStockmin,
            dataUbicacion: arrayUbicacion,
            arbolUbicaciones: arbolUbicacion,
            almacenUbicaciones: ubicaciones
        },
            () => {
                if (!this.state.configMasUnAlmacen) {
                    this.generarArbolAlmacen(idalmacenDefecto, 0);
                }
            }
        );
    }
      
    componentDidMount() {
        this.createProducto();
    }

    createProducto() {
        httpRequest('get', ws.wsproducto + '/create')
        .then((result) => {
            if (result.response == 1) {
                //console.log(result)
                let configcli = result.configcli;
                let configfab = result.configfab;

                let caracteristicas = [];
                let idsCaracteristicas = [];
                let descDetalle = [];
                this.cargarCaracteristicas(result.caracteristicas, caracteristicas, idsCaracteristicas, descDetalle);
                this.cargarFamilias(result.familias);
                this.cargarAlmacenes(result.almacenes, result.ubicaciones,);

                this.setState({
                    configCodigo: configcli.codigospropios,
                    configOtrosCodigos: configcli.otroscodigos,
                    idMoneda: configcli.monedapordefecto,
                    configMasCostos: configcli.masdeuncosto,
                    configMasUnAlmacen: configcli.masdeunalmacen,
                    configEditCostoProd: configcli.editcostoproducto,
                    configEditStock: configcli.editarstockproducto,
                    tipo: configcli.clienteesabogado ? 'S' : 'P',
                    isProducto: configcli.clienteesabogado ? false : true,
                    configListaPrecio: configfab.comalmacenlistadeprecios,
                    caracteristicas: caracteristicas,
                    idsCaracteristicas: idsCaracteristicas,
                    descDetalle: descDetalle,
                    monedas: result.monedas,
                    idMoneda: result.monedas[0].idmoneda,
                    unidadesMedidas: result.unidades,
                    idUnidad: result.unidades[0].idunidadmedida,
                    listaPrecios: result.listaprecios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
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

       let data = this.state.idsAlmacen;
       let length = data.length;
       for (let i = 0; i < length; i ++) {
           if (data[i] != 0)
            return true;
       }
       message.warning('Debe seleccionar como minimo un almacen');
       return false;
    }

    validarDatosCaracteristicas() {

        let array_ids = this.state.idsCaracteristicas;
        let array_values = this.state.descDetalle;

        for (let i = 0; i < array_ids.length; i++) {
            let id = array_ids[i];
            let value = array_values[i];
            if ((id == '' && value.length > 0) ||
                id !== '' && value.length === 0) {
                return false;    
            }
        }
        return true;
    }
    
    validarDatos() {
        
        if ((this.state.codproducto.length === 0 && this.state.configCodigo) || this.state.validarCodigo == 0) {
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
        if(!this.validarDatos()) return;
        if (!this.validarDatosAlmacen()) return;

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
        var array = this.getIndexSeleccionadosCaract();
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

        } else if (this.state.tipo == "P") {
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
        
        
        httpRequest('post', ws.wsproducto, body)
        .then((result) => {
            if (result.response == 1) {
                
                var on_data = JSON.parse( readData(keysStorage.on_data) );
                if (this.validar_keyStorage(on_data)) {
                    var bandera = this.validar_keyStorage(on_data.data_actual)?true:false;
                    var data_actual = this.validar_keyStorage(on_data.data_actual)?on_data.data_actual:null;
                    if (bandera) {

                        data_actual.array_producto.push(result.producto);

                        var objeto = { idproducto: result.producto.idproducto, unidadmedida: 'n',
                            cantidad: 1, costo: result.producto.costo, tipo: result.producto.tipo,
                            costototal: result.producto.costo, array_producto: data_actual.array_producto,
                            alert: 1, stock: result.producto.stock,
                        };

                        var sw = false;

                        for (let i = 0; i < data_actual.productos_index.length; i++) {
                            if (data_actual.productos_index[i].idproducto == '') {
                                data_actual.productos_index[i] = objeto;
                                sw = true;
                                break;
                            }
                        }

                        if (!sw) {
                            data_actual.productos_index.push(objeto);
                        }

                    }
                    var objecto_data = {
                        on_create: this.validar_keyStorage(on_data.on_create)?on_data.on_create:null,
                        data_actual: (bandera)?data_actual:null,
                        validacion: true,
                    };
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                }

                setTimeout(() => {
                    this.props.history.goBack();
                    message.success('Se guardo correctamente el producto');
                }, 500);

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

    cambioDescripcion(value) {
        this.setState({
            descripcion: value
        });
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodproductovalido + '/' + value)
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
                message.error(strings.message_error);
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
    
    cambioCodProducto(value) {
        this.handleVerificCodigo(value);
        this.setState({
            codproducto: value
        });
    }

    cambioCodProductoOtro(index, value) {
        this.state.codigosProd[index] = value;
        this.setState({
            codigosProd: this.state.codigosProd
        });
    }

    cambioCosto(value) {
        if (value < 0) return;
        this.setState({
            costo: value
        });
    }

    cambioPrecio(value) {
       if (value < 0) return;
        this.setState({
            precio: value
        });
    }

    cambioTipo(value) {
        let titleTipo = value == 'P' ? 'Producto' : 'Servicio';
        if (value == "P") {
            this.setState({
                isProducto: true,
                tipo: value,
                cursorAllowed: '',
                titleTipo: titleTipo
            });
        } else {
            this.setState({
                isProducto: false,
                tipo: value,
                cursorAllowed: 'cursor-not-allowed',
                titleTipo: titleTipo
            });
        }
    }

    cambioPalClaves(value) {
        this.setState({
            palclaves: value
        });
    }

    cambioNotas(value) {
        this.setState({
            notas: value
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


    cambioCosto2(value) {
       if (value < 0) return;
        this.state.arrayCostos[0] = value
        this.setState({
            arrayCostos: this.state.arrayCostos
        });
    }

    cambioCostoX(value) {
       if (value < 0) return;
        this.setState({
            costox: value
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

    cambioMoneda(value) {
        this.setState({
            idMoneda: value
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

    cambioCaracteristica(event) {
        let index = event.id;
        let valor = event.value;
        if (valor == "") {
            this.state.descDetalle[index] = "";
        }
        this.state.idsCaracteristicas[index] = valor;
        this.setState({
            idsCaracteristicas: this.state.idsCaracteristicas,
            descDetalle: this.state.descDetalle
        });
    }
    
    cambioInputC(event) {
        let index = event.id;
        let valor = event.value;

        if (this.state.idsCaracteristicas[index] == "") return;
        this.state.descDetalle[index] = valor;
        this.setState({
            descDetalle: this.state.descDetalle
        });
    }

    cambioAlmacen(index, value) {
        
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
            this.state.dataUbicacion[index] = 'Seleccione una opcion';
            this.state.arbolUbicaciones[index] = [];
        }
        this.state.idsAlmacen[index] = valor;
        this.generarArbolAlmacen(valor, index);
    }

    sumar(data) {
        let sumaTotal = 0;
        for (let i = 0; i < data.length; i++) {

            if (!isNaN(data[i]) && data[i] != "") {
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
        if (isNaN(value)) {
            value = 0;
        }      
        this.state.dataStock[index] = value;
        let totalStock = this.sumar(this.state.dataStock);
        this.setState({
            dataStock: this.state.dataStock,
            stock: totalStock
        })
       
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
        })
       
    }

    cambioInputAStockMax(index, value) {
        if (this.state.idsAlmacen[index] == 0 || isNaN(value)) return;
        if (value < 0) {
            message.error('No se pueden introducir numeros negativos');
            return;
        }
        if (isNaN(value)) {
            value = 0;
        }

        this.state.dataStockmax[index] = value;
        let totalStockMax = this.sumar(this.state.dataStockmax);
        this.setState({
            dataStockmax: this.state.dataStockmax,
            stockmax: totalStockMax
        })
       
    }

    cambioInputAUbicacion(index, value) {
        if (!this.state.isProducto) return;
        if (this.state.idsAlmacen[index] == 0) return;
        this .state.dataUbicacion[index] = value;

        this.setState({
            dataUbicacion: this.state.dataUbicacion
        })
       
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
        };
        reader.readAsDataURL(file);
    }

    next() {
        this.setState({
            indexImg: (this.state.indexImg + 1) % this.state.nameImages.length,
        })
    }

    prev() {
        this.setState({
            indexImg: (this.state.indexImg + this.state.nameImages.length - 1) % this.state.nameImages.length,
        })
    }

    addRowAlmacen() {

        this.state.idsAlmacen.push(0);
        this.state.dataStock.push('');
        this.state.dataStockmax.push('');
        this.state.dataStockmin.push('');
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

        let totalStock = parseFloat(this.state.stock) - parseFloat(this.state.dataStock[index]);
        let totalStockMax = parseFloat(this.state.stockmax) - parseFloat(this.state.dataStockmax[index]);
        let totalStockMin = parseFloat(this.state.stockmin) - parseFloat(this.state.dataStockmin[index]);

        this.state.idsAlmacen.splice(index, 1);
        this.state.dataStock.splice(index, 1);
        this.state.dataStockmax.splice(index, 1);
        this.state.dataStockmin.splice(index, 1);
        this.state.dataUbicacion.splice(index, 1);
        this.state.arbolUbicaciones.splice(index, 1);
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
        if (this.state.configMasUnAlmacen) {
            return (
                <div style={{paddingTop: 5, }}>
                    <C_Button title={<i className='fa fa-plus'></i>}
                        type="primary" size='small'
                        style={{padding: 2, }}
                        onClick={() => this.addRowAlmacen() }
                    />
                </div>
            );
        }
        return null;
    }

    removeAlmacen(id) {
        if (this.state.configMasUnAlmacen) {
            return (
                <div style={{paddingTop: 10, width: 60, minWidth: 60, height: 30, textAlign: 'center' }}>
                    <C_Button type='danger' size='small'
                        title={<i className='fa fa-remove'></i>}
                        onClick={() => this.eliminarFilaAlmacen(id)}
                    />
                </div>
            );
        }
        return null;
    }
    
    componentStockAlmacen() {
        const addAlmacen = this.addAlmacen();
        const listaAlmacenes = this.listaAlmacenes();

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                if (on_data.on_create == 'compra_create') {
                    bandera = this.validar_keyStorage(on_data.data_actual.idalmacen) ? 
                        isNaN(on_data.data_actual.idalmacen) ? false : true : false;
                }
            }
        }
        if (bandera) return null;
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
                                        paddingRight: ((this.state.isProducto && this.state.configEditStock))? 18 : 5, margin: 10, 
                                    }}
                                    readOnly={(this.state.isProducto && this.state.configEditStock) ? false : true}
                                    number={true}
                                />
                                <C_Input className=''
                                    value={this.state.dataStockmin[key]}
                                    onChange={this.cambioInputAStockMin.bind(this, key)}
                                    style={{width: 110, minWidth: 110, textAlign: 'right', 
                                        paddingRight: ((this.state.isProducto && this.state.configEditStock))? 18 : 5, margin: 10, 
                                    }}
                                    readOnly={(this.state.isProducto && this.state.configEditStock) ? false : true}
                                    number={true}
                                />
                                <C_Input className=''
                                    value={this.state.dataStockmax[key]}
                                    onChange={this.cambioInputAStockMax.bind(this, key)}
                                    style={{width: 110, minWidth: 110, textAlign: 'right', 
                                        paddingRight: ((this.state.isProducto && this.state.configEditStock))? 18 : 5, margin: 10, 
                                    }}
                                    readOnly={(this.state.isProducto && this.state.configEditStock) ? false : true}
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

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                if (on_data.on_create == 'compra_create') {
                    bandera = this.validar_keyStorage(on_data.data_actual.idalmacen) ? 
                        isNaN(on_data.data_actual.idalmacen) ? false : true : false;
                }
            }
        }
        if (bandera) return null;

        if (this.state.isProducto) {
            return (
                <div className="forms-groups margin-group-content ">

                    <h2 className="title-logo-content">Totales Stock</h2>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="input-group-content cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                            <Input 
                                title="Total Stock"
                                value={this.state.stock}
                                readOnly={true}
                                style={{ textAlign: 'right'}}
                            />
                        </div>
                        <div className="input-group-content cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                            <Input 
                                title="Total Minimo"
                                value={this.state.stockmin}
                                readOnly={true}
                                style={{ textAlign: 'right'}}
                            />
                        </div>
                        <div className="input-group-content cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                            <Input 
                                title="Total Maximo"
                                value={this.state.stockmax}
                                readOnly={true}
                                style={{ textAlign: 'right'}}
                            />
                        </div>
                    </div>
                </div>

            );

        } 

        return null;

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
            });

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
                    
                    
                    <div className="input-group-content cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                        <Input 
                            title="Codigo"
                            value={this.state.masCodigo}
                            onChange={this.cambioMasCodigo.bind(this)}
                        />
                    </div>

                    <div className="input-group-content cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                        <Input 
                            title="Descripcion"
                            value={this.state.descripcionCodigo}
                            onChange={this.cambioDescCodigo.bind(this)}
                        />
                    </div>

                    <div className="center cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">

                        <button
                            className="btns btns-sm btns-primary" 
                            type="submit"
                            onClick={() => this.agregarCodigo()}>
                            Agregar
                        </button>

                    </div>

                    <div className="card cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
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
                            className="btns btns-primary" 
                            type="button"
                            onClick={() => this.openCloseModalPC()}>
                            Agregar
                        </button>
                        <button
                            className="btns btns-danger" 
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
                            <th>Nro</th>
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
                                        <td><label className="col-show">Nro: </label>{key + 1}</td>
                                        <td><label className="col-show">Descripcion: </label>{item.descripcion}</td>
                                        <td><label className="col-show">Factor: </label>{item.valor}</td>
                                        <td><label className="col-show">Estado: </label>{estado}</td>
                                        <td><label className="col-show">Fecha Inicio: </label>{item.fechainicio}</td>
                                        <td><label className="col-show">Fecha Final: </label>{item.fechafin}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        );
    }

    eliminarFilaCaract(index) {
       
        this.state.idsCaracteristicas.splice(index,1);
        this.state.descDetalle.splice(index,1);
        this.setState({
            idsCaracteristicas: this.state.idsCaracteristicas,
            descDetalle: this.state.descDetalle
        })
        
    }
  
    deleteImg() {
        let index = this.state.indexImg <= 0 ? 0 : this.state.indexImg - 1;
        this.state.images.splice(this.state.indexImg, 1);
        this.state.nameImages.splice(this.state.indexImg, 1);
        this.setState({
            images: this.state.images,
            nameImages: this.state.nameImages,
            indexImg: index
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

    componentCodigo() {

        if (this.state.codigosProd.length > 0) {
            
            this.state.codigosProd.map((item, key) => (
                <div key={key} className="text-center-content col-lg-3-content">
                    <Input 
                        title={this.state.descCodigos[key]}
                        value={this.state.codigosProd[key]}
                        onChange={this.cambioCodProductoOtro.bind(this, key)}
                    />
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
                    <C_Input 
                        title="Costo 2"
                        type="number"
                        value={this.state.arrayCostos[i]}
                        onChange={this.cambioCosto2.bind(this)}
                        className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom'
                        style={{ textAlign: 'right'}}
                    />
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
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{padding: 0}}>
                    <div className="cols-lg-2 cols-md-2"></div>
                    <C_Input 
                        type="number"
                        value={this.state.costox}
                        title="Costo"
                        onChange={this.cambioCostoX.bind(this)}
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                        style={{ textAlign: 'right'}}
                    />

                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                        <C_Button title='Agregar'
                            type='primary' onClick={() => this.addCosto()}
                        />
                    </div> 
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
        )
    }

    componentAddCodigo() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                        title="Codigo"
                        value={this.state.masCodigo}
                        onChange={this.cambioMasCodigo.bind(this)}
                    />
                    <C_Input 
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                        title="Descripcion"
                        value={this.state.descripcionCodigo}
                        onChange={this.cambioDescCodigo.bind(this)}
                    />

                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                        <C_Button 
                            type="primary" title='Agregar'
                            onClick={() => this.agregarCodigo()}
                            style={{'marginTop': '-2px'}}
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
                                {this.state.codigosProd.map((item, key) => (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{item}</td>
                                        <td>{this.state.descCodigos[key]}</td>
                                        <td style={{textAlign: 'center',}}>
                                            <C_Button title={<i className="fa fa-remove"></i>}
                                                type="danger" size="small"
                                                onClick={() => {
                                                    this.state.codigosProd.splice(key,1);
                                                    this.state.descCodigos.splice(key,1);
                                                    this.setState({
                                                        codigosProd: this.state.codigosProd,
                                                        descCodigos: this.state.descCodigos
                                                    });
                                                }}
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

    openModalLPrecios() {
        this.setState({ displayModalLP: true });
    }

    closeModalLPrecios() {
        this.setState({ displayModalLP: false });
    }

    openModalAddCostos() {
        this.setState({ visibleAddCosto: true });
    }

    closeModalAddCostos() {
        this.setState({ visibleAddCosto: false });
    }

    openModalAddCodigo() {
        this.setState({ visibleAddCodigo: true });
    }

    closeModalAddCodigo() {
        this.setState({visibleAddCodigo: false});
    }

    showStoreConfirm() {
        if(!this.validarDatos()) return;
        if (!this.validarDatosAlmacen()) return;
        if (!this.validarDatosCaracteristicas()) return;
        const guardarProducto = this.guardarProducto.bind(this);
        Modal.confirm({
            title: '¿Esta seguro de guardar el producto?',
            content: 'Si todos los datos son correctos! ¿Desea continuar?',
            okText: 'Si',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                guardarProducto();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    redirect() {
        this.setState({redirect: true});
    }

    showCancelConfirm() {
        const redirect = this.redirect;
        Modal.confirm({
            title: 'Cancelar Nuevo Producto',
            content: '¿Todos los datos se perderan, estas seguro de continuar',
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

    addCaracteristica() {
        this.state.idsCaracteristicas.push('');
        this.state.descDetalle.push("");
        this.setState({
            idsCaracteristicas: this.state.idsCaracteristicas,
            descDetalle: this.state.descDetalle
        })
    }
    readOnlyTipoProducto() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) {
                if (on_data.on_create == 'compra_create') {
                    bandera = this.validar_keyStorage(on_data.data_actual.idalmacen) ? 
                        isNaN(on_data.data_actual.idalmacen) ? false : true : false;
                }
            }
        }
        return bandera;
    }
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.producto_index}/>
            )
        }
        const verificarPermisosStockAlm = this.verificarPermisosStockAlm();
        const verificarPermisosStock = this.verificarPermisosStock();
        const modalAddCodProd = this.modalAddCodProd();
        const componentListaprecios = this.componentListaprecios();
        const componentCodigo = this.componentCodigo();
        const componentCosto = this.componentCosto();
        const componentAddCostos = this.componentAddCostos();
        const componentAddCodigo = this.componentAddCodigo();
        const listaUnidades = this.listaUnidades();
        const listaMonedas = this.listaMonedas();

        return (

            <div>
                
                { modalAddCodProd }

                <Confirmation
                    visible={this.state.modalOk}
                    title="Guardar Registro de Producto"
                    onCancel={this.onCancelMO}
                    loading={this.state.loadingOk}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de guardar el producto?
                            </label>
                        </div>
                    ]}
                />

                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registro de Producto"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro del producto?,
                                Los datos se perderan.
                            </label>
                        </div>
                    ]}
                />

                <Modal
                    title="Lista de Precios"
                    visible={this.state.displayModalLP}
                    onOk={this.closeModalLPrecios.bind(this)}
                    onCancel={this.closeModalLPrecios.bind(this)}
                    width={700}
                    
                >
                    { componentListaprecios }

                </Modal>

                <Modal
                    title="Agregar Costos"
                    visible={this.state.visibleAddCosto}
                    onOk={this.closeModalAddCostos.bind(this)}
                    onCancel={this.closeModalAddCostos.bind(this)}
                    footer={
                        <C_Button 
                            title="Aceptar"
                            onClick={this.closeModalAddCostos.bind(this)}
                        />
                    }
                >
                    { componentAddCostos }

                </Modal>

                <Modal
                    title="Agregar Codigos"
                    visible={this.state.visibleAddCodigo}
                    onOk={this.closeModalAddCodigo.bind(this)}
                    onCancel={this.closeModalAddCodigo.bind(this)}
                    footer={
                        <C_Button 
                            title="Aceptar"
                            onClick={this.closeModalAddCodigo.bind(this)}
                        />
                    }
                >
                    { componentAddCodigo }

                </Modal>

                <div className="rows">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="title-logo-content"> Registrar Producto </h1>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="forms-groups">
                            <C_Input
                                title="Codigo Prod"
                                value={this.state.codproducto}
                                onChange={this.cambioCodProducto.bind(this)}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.configCodigo}
                                validar={this.state.validarCodigo}
                                mensaje='El codigo ya existe'
                            />
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                <div className="txts-center">
                                    <C_Button
                                        onClick={this.openModalAddCodigo.bind(this)}
                                        title="Agregar Otros Codigos"
                                        type="primary"
                                        permisions={this.permisions.add_cod}
                                        configAllowed={this.state.configOtrosCodigos}
                                    />
                                </div>
                            </div>
                            <C_Select
                                value={this.state.tipo}
                                title={"Tipo"}
                                onChange={this.cambioTipo.bind(this)}
                                permisions={this.permisions.tipo}
                                component={[
                                    <Option key={0} value="P">Producto</Option>,
                                    <Option key={1} value="S">Servicio</Option>
                                ]}
                                // readOnly={this.readOnlyTipoProducto()}
                            />
                            <C_Select
                                value={this.state.idMoneda}
                                title="Moneda"
                                onChange={this.cambioMoneda.bind(this)}
                                component={listaMonedas}
                                permisions={this.permisions.moneda}
                            />
                        </div>

                        <div className="forms-groups" style={{padding: 0}}>
                            {
                                this.state.codigosProd.map((item, key) => (
                                    <C_Input 
                                        title={this.state.descCodigos[key]}
                                        value={this.state.codigosProd[key]}
                                        onChange={this.cambioCodProductoOtro.bind(this, key)}
                                        permisions={this.permisions.add_cod}
                                        key={key}
                                    />
                                ))
                            }
                        </div>

                        <div className="forms-groups">
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
                                title="Unidad Medida"
                                onChange={this.cambioUnidad.bind(this)}
                                component={listaUnidades}
                                permisions={this.permisions.unidad}
                            />
                        </div>

                        <div className="forms-groups">
                            
                            <C_Caracteristica 
                                title="Caracteristicas"
                                data={this.state.caracteristicas}
                                onAddRow={this.addCaracteristica}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.idsCaracteristicas}
                                onChangeSelect={this.cambioCaracteristica}
                                valuesInput={this.state.descDetalle}
                                onChangeInput={this.cambioInputC}
                                onDeleteRow={this.eliminarFilaCaract}
                                permisions={this.permisions.caract}
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 txts-center">
                                <CImage
                                    onChange={this.selectImg.bind(this)}
                                    images={this.state.images}
                                    next={this.next}
                                    prev={this.prev}
                                    index={this.state.indexImg}
                                    delete={this.deleteImg}
                                    permisions={this.permisions.foto}
                                />
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
                                    className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom'
                                    style={{ textAlign: 'right'}}
                                />
                                
                                { componentCosto }

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                    <C_Button
                                        title='Agregar otro costo'
                                        type='primary'
                                        onClick={this.openModalAddCostos.bind(this)}
                                        permisions={this.permisions.add_costo}
                                        configAllowed={this.state.configMasCostos}
                                    />
                                </div>
                                
                                <C_Input 
                                    title="Precio"
                                    type="number"
                                    value={this.state.precio}
                                    onChange={this.cambioPrecio.bind(this)}
                                    permisions={this.permisions.precio}
                                    className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom'
                                    style={{ textAlign: 'right'}}
                                />

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                    <C_Button
                                        title='Agregar a Lista Precios'
                                        type='primary'
                                        onClick={this.openModalLPrecios.bind(this)}
                                        permisions={this.permisions.add_lista}
                                        configAllowed={this.state.configListaPrecio}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    { verificarPermisosStockAlm }

                    { verificarPermisosStock }

                    <div className="forms-groups">
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

                    <div className="forms-groups">
                        <div className="txts-center">
                            <C_Button
                                title='Guardar'
                                type='primary'
                                onClick={this.validarData}
                            />
                            <C_Button
                                title='Cancelar'
                                type='danger'
                                onClick={() => this.setState({ modalCancel: true })}
                            />
                        </div>
                    </div>

                </div>

            </div>


        );
    }
}

CreateProducto.propTypes = {
    idalmacen: PropTypes.any,
}

CreateProducto.defaultProps = {
    idalmacen: null,
}

export default withRouter(CreateProducto);

