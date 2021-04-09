

import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';

import { Modal,TreeSelect,message,
    notification ,Icon,Divider, Alert,
    Select, DatePicker
} from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";
import CrearParteVehiculo from "../../taller/GestionarVentaDetalleVehiculo/CrearParteVehiculo";
import ShowCliente from '../GestionarCliente/show';
import CrearCliente from '../GestionarCliente/crear';
import CrearHistorialVehiculo from '../../taller/GestionarVentaDetalleVehiculo/CrearHistorialVehiculo';
import { dateToString, dateToStringB, stringToDate, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import CDatePicker from '../../../componentes/datepicker';
import CSelect from '../../../componentes/select2';
import CTreeSelect from '../../../componentes/treeselect';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import C_DatePicker from '../../../componentes/data/date';
import Confirmation from '../../../componentes/confirmation';

const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const NUMERO_PRODUCTOS = 3;

const CANTIDAD_CLIENTES_DEFAULT = 30;
const CANTIDAD_VENDEDORES_DEFAULT = 30;
const CANTIDAD_PRODUCTOS_DEFAULT = 30;
let dateNow = new Date();
export default class CreateProforma extends Component{

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
            vehiculoDescripcion: '',
            vehiculoPlaca: '',

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
            nroVenta: 0,

            mostrarOpcionHistorialVehiculo: 0,
            fechaActual: '',
            fechaHoy: dateToStringB(dateNow, "/"),
            historialVehiculo: {
                fecha: '',
                diagnosticoEntrada: '',
                trabajoHechos: '',
                precio: 0,
                kmActual: '',
                kmProximo: '',
                fechaProxima: ''
            },

            codigoVenta: "",
            fechaVenta: dateToString(dateNow, 'f2'),

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
            arrayListaVenta2: [],
            arrayPrecioUnit: [],
            arrayDescuento: [],
            arrayPrecioTotal: [],
            arrayIdAlmacenProdDetalle: [],
            arrayListaPreProdDetalle: [],
            subTotalVenta: 0,
            descuentoVenta: 0,
            recargoVenta: 0,
            totalVenta: 0,
            arrayItems: [],
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

            resultClientesDefault: [],
            resultClientes: [],
            resultVehiculos: [],
            resultVehiculosDefault: [],
            resultVendedores: [],
            resultVendedoresDefault: [],
            resultProductos: [],
            resultProductosDefault: [],
            timeoutSearch: undefined,
            valSearchClieCod: undefined,
            valSearchClieNombre: undefined,
            valSearchVehiculoPlaca: undefined,
            valSearchVendedorCod: undefined,
            valSearchVendedorFullname: undefined,
            valuesSearchProd: [],

            vehiculoId: '',
            vehiculoDescripcion: '',
            vehiculosCliente: [],
            
            monedas: [],
            
            anticipo: 0,
            saldoApagar: 0,
            NumeroCuota: 1,
            fechaInicioDePago: dateToString(dateNow),
            tipoPeriodo: 1,
            listaDeCuotas: [],
            alertModal: false,

            noSesion: false,
            configTaller: false,
            configCodigo: false,
            configEditPrecioUnit: false,
            configVehiculoHistorial: false,
            configVehiculoPartes: false,

            resultListaPrecios: [],
            resultListaPreciosDefault: [],

            valSearchVehiculoCod: undefined,
            valSearchListaPrecio: undefined,
            validarCodigo: 1,
            modalCancel: false,
            modalOk: false,
            loadingOk: false,
            
        }

        this.permisions = {
            btn_add_cli: readPermisions(keys.proforma_btn_agregarCliente),
            btn_ver_cli: readPermisions(keys.proforma_btn_verCliente),
            codigo: readPermisions(keys.proforma_input_codigo),
            fecha: readPermisions(keys.proforma_fecha),
            sucursal: readPermisions(keys.proforma_select_sucursal),
            almacen: readPermisions(keys.proforma_select_almacen),
            cli_cod: readPermisions(keys.proforma_input_search_codigoCliente),
            cli_nomb: readPermisions(keys.proforma_input_search_nombreCliente),
            cli_nit: readPermisions(keys.proforma_input_nitCliente),
            vehiculo_cod: readPermisions(keys.proforma_select_search_codigoVehiculo),
            vehiculo_placa: readPermisions(keys.proforma_select_search_placaVehiculo),
            vehiculo_descrp: readPermisions(keys.proforma_input_descripcionVehiculo),
            vend_cod: readPermisions(keys.proforma_input_search_codigoVendedor),
            vend_nomb: readPermisions(keys.proforma_input_search_nombreVendedor),
            vend_comision: readPermisions(keys.proforma_input_comisionVendedor),
            lista_precios: readPermisions(keys.proforma_select_search_listaPrecios),
            moneda: readPermisions(keys.proforma_select_moneda),
            t_prod_cod: readPermisions(keys.proforma_tabla_columna_codigoProducto),
            t_prod_desc: readPermisions(keys.proforma_tabla_columna_producto),
            t_cantidad: readPermisions(keys.proforma_tabla_columna_cantidad),
            t_lista_precios: readPermisions(keys.proforma_tabla_columna_listaPrecio),
            t_precio_unitario: readPermisions(keys.proforma_tabla_columna_precioUnitario),
            t_descuento: readPermisions(keys.proforma_tabla_columna_descuento),
            observaciones: readPermisions(keys.proforma_textarea_observaciones),
            descuento: readPermisions(keys.proforma_input_descuento),
            recargo: readPermisions(keys.proforma_input_recargo),
            btn_historial_veh: readPermisions(keys.proforma_btn_historialVehiculo),
            btn_partes_veh: readPermisions(keys.proforma_btn_partesVehiculo),
            sub_total: readPermisions(keys.proforma_input_subTotal)
        }

        this.onChangeSearchClienteCod = this.onChangeSearchClienteCod.bind(this);
        this.handleSearchClienteByIdCod = this.handleSearchClienteByIdCod.bind(this);
        this.handleSearchClienteByNombre = this.handleSearchClienteByNombre.bind(this);
        this.onChangeSearchClienteNombre = this.onChangeSearchClienteNombre.bind(this);
        this.handleSearchVendedorByIdCod = this.handleSearchVendedorByIdCod.bind(this);
        this.onChangeSearchVendedorIdCod = this.onChangeSearchVendedorIdCod.bind(this);
        this.onChangeSearchVendedorByFullName = this.onChangeSearchVendedorByFullName.bind(this);
        this.handleSearchVendedorByFullName = this.handleSearchVendedorByFullName.bind(this);
        this.onSearchProdNom = this.onSearchProdNom.bind(this);
        this.onSearchProdCod = this.onSearchProdCod.bind(this);
        this.onChangeSearchProdId = this.onChangeSearchProdId.bind(this);
        this.onChangeSearchProdNom = this.onChangeSearchProdNom.bind(this);
        this.ventaAlmacen = this.ventaAlmacen.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.onChangeSearchVehiculo = this.onChangeSearchVehiculo.bind(this);
        this.searchVehiculoByPlaca = this.searchVehiculoByPlaca.bind(this);
        this.onSearchVehiculoPlaca = this.onSearchVehiculoPlaca.bind(this);
        this.onDeleteVehiculo = this.onDeleteVehiculo.bind(this);
        this.onSearchVehiculoCod = this.onSearchVehiculoCod.bind(this);
        this.searchVehiculoByCod = this.searchVehiculoByCod.bind(this);
        this.onDeleteListaPrecio = this.onDeleteListaPrecio.bind(this);
        this.searchListaPrecio = this.searchListaPrecio.bind(this);
        this.handleSearchListaPrecio = this.handleSearchListaPrecio.bind(this);
        this.onChangeSearchListaPrecio = this.onChangeSearchListaPrecio.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        this.validarData = this.validarData.bind(this);

    }

    validarData(type) {
        if (!this.validarDatos()) return;
        this.setState({
            modalOk: true,
            type: type
        })
    }

    onOkMO() {
        if (this.state.type == 'N') return;
        this.guardarVenta(this.state.type);
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

    onDeleteSearchProd(index) {
        
        this.state.valuesSearchProd[index].id = undefined;
        this.state.valuesSearchProd[index].descripcion = undefined;
        this.state.arrayUnidadVentaAbrev[index] = '';
        this.state.arrayCantidadVenta[index] = 1;
        this.state.arrayListaVenta[index] = this.state.valSearchListaPrecio;
        this.state.arrayPrecioUnit[index] = '';
        this.state.arrayDescuento[index] = 0;
        this.state.arrayPrecioTotal[index] = '';

        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayListaVenta: this.state.arrayListaVenta,
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayDescuento: this.state.arrayDescuento,
            arrayPrecioTotal: this.state.arrayPrecioTotal
        })
    }

    onDeleteListaPrecio() {

        for (let i = 0; i < this.state.valuesSearchProd.length; i++) {
            this.state.arrayPrecioUnit[i] = "";
            this.state.arrayPrecioTotal[i] = "";
            this.state.arrayCantidadVenta[i] = 1;
            this.state.arrayTipoPoS[i] = "";
            this.state.arrayUnidadVentaAbrev[i] = "";
            this.state.arrayDescuento[i] = 0;
            this.state.arrayUnidadVenta[i] = "";
            this.state.arrayIdAlmacenProdDetalle[i] = "";
            this.state.valuesSearchProd[i] = {id : undefined, descripcion: undefined };
            this.state.arrayListaVenta[i] = undefined;
        }
        
        this.setState({
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayPrecioTotal: this.state.arrayPrecioTotal,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayDescuento: this.state.arrayDescuento,
            arrayUnidadVenta: this.state.arrayUnidadVenta,
            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayListaVenta: this.state.arrayListaVenta,

            valSearchListaPrecio: undefined
        })
        //this.ClearDetalle();
    }

    onDeleteVehiculo() {
        this.setState({
            valSearchVehiculoCod: undefined,
            vehiculoDescripcion: '',
            resultVehiculos: this.state.resultVehiculosDefault
        })
    }

    onDeleteCliente() {
        this.setState({
            valSearchClieCod: undefined,
            valSearchClieNombre: undefined,
            nitVenta: null,
            valSearchVehiculoCod: undefined,
            resultVehiculos: [],
            resultVehiculosDefault: [],
            vehiculoDescripcion: ''
        })
    }

    actualizarListaPrecio(value) {

        let length = this.state.valuesSearchProd.length;
        for (let i = 0; i < length; i++) {
            this.state.arrayListaVenta[i] = value;
            //this.state.arrayListaVenta2[i] = idlistaprecio;
        }
        this.setState({
            arrayListaVenta: this.state.arrayListaVenta,
            //arrayListaVenta2: this.state.arrayListaVenta2,
            //listaMonedaVenta: array,
            //listaVentaId: idlistaprecio,
            //listaVentaDesc: descripcion
        })

    }

    getProductos(idalmacen) {

        let body = { idalmacen: idalmacen, cantidad: CANTIDAD_PRODUCTOS_DEFAULT };
        httpRequest('post', ws.wsalmacenproductos, body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    resultProductos: result.data,
                    resultProductosDefault: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    ClearDetalle() {

        for (let i = 0; i < this.state.valuesSearchProd.length; i++) {
            this.state.arrayPrecioUnit[i] = "";
            this.state.arrayPrecioTotal[i] = "";
            this.state.arrayCantidadVenta[i] = 1;
            this.state.arrayTipoPoS[i] = "";
            this.state.arrayUnidadVentaAbrev[i] = "";
            this.state.arrayDescuento[i] = 0;
            this.state.arrayUnidadVenta[i] = "";
            this.state.arrayIdAlmacenProdDetalle[i] = "";
            this.state.valuesSearchProd[i] = {id : undefined, descripcion: undefined};
            this.state.arrayListaVenta[i] = undefined;
        }

        this.setState({
            arrayProductoVenta:[],
            arrayCodProVenta:[],
            subTotalVenta:'',
            descuentoVenta:0,
            recargoVenta:0,
            totalVenta:'',

            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayPrecioTotal: this.state.arrayPrecioTotal,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayDescuento: this.state.arrayDescuento,
            arrayUnidadVenta: this.state.arrayUnidadVenta,
            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayListaVenta: this.state.arrayListaVenta,
            resultListaPrecios: [],
            resultListaPreciosDefault: [],
            valSearchListaPrecio: undefined
        })
    }

    getComision(fkidcomision){
        var body = {
            fkidcomisionventa: fkidcomision
        }
        httpRequest('post', ws.wstraercomisionvend, body)
        .then(result => {
            if(result.response == 1) {
                this.setState({
                    comisionvendedor:result.data[0].valor,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    preparandoDatos() {

        for (let i = 0; i < NUMERO_PRODUCTOS; i++) {
            this.state.arrayCodProVenta.push(0);
            this.state.arrayCantidadVenta.push('');
            this.state.arrayPrecioUnit.push('');
            this.state.arrayDescuento.push('');
            this.state.arrayPrecioTotal.push('');
            this.state.arrayCantidadVenta[i] = 1;
            this.state.arrayDescuento[i] = 0;
            this.state.valuesSearchProd.push({
                id: undefined,
                descripcion: undefined 
            });
        }

        this.setState({
            arrayCodProVenta: this.state.arrayCodProVenta,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayDescuento: this.state.arrayDescuento,
            arrayPrecioTotal: this.state.arrayPrecioTotal,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayDescuento: this.state.arrayDescuento
        });
    }

    getListaPrecios(idmoneda){

        httpRequest('post', ws.wsgetlistasactivas, {
            idmoneda: idmoneda
        })
        .then((result) => {
            if (result.response === 1 && result.data.length > 0) {
                
                this.setState({
                    listaVenta: result.data,
                    resultListaPrecios: result.data,
                    valSearchListaPrecio: result.data[0].idlistaprecio
                },
                    () => this.actualizarListaPrecio(result.data[0].idlistaprecio)
                );
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.data.length === 0) {
                message.warning('No existe una Lista de precio con la moneda selecionada');
            } else {
                //
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    componentDidMount(){
        this.preparandoDatos();
        this.createProforma();
    }

    createProforma() {
        httpRequest('get', ws.wscreateproforma)
        .then((result) => {
            //console.log(result);
            if (result.response == 1) {
                let configFabrica = result.configsfabrica;
                let configCliente = result.configscliente;
                this.getListaPrecios(result.monedas[0].idmoneda);
                this.setState({
                    configTaller: configFabrica.comtaller,
                    configVehiculoHistorial: configFabrica.comtallervehiculohistoria,
                    configVehiculoPartes: configFabrica.comtallervehiculoparte,
                    configCodigo: configCliente.codigospropios,
                    configEditPrecioUnit: configCliente.editprecunitenventa,
                    resultClientes: result.clientes,
                    resultClientesDefault: result.clientes,
                    resultVendedores: result.vendedores,
                    resultClientesDefault: result.vendedores,
                    monedas: result.monedas,
                    monedaVentaId: result.monedas[0].idmoneda,
                    almacenVenta: result.almacenes,
                    sucursalVenta: result.sucursales,
                    sucursalVentaId: result.sucursales[0].idsucursal,
                    tipoContaCredito: result.tiposcontacredito,
                    
                }, 
                    () => this.actualizarAlmacen(result.sucursales[0].idsucursal)
                )
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodproformavalido + '/' + value)
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

    ventaCodigo(value) {
        this.handleVerificCodigo(value);
        this.setState({
            codigoVenta: value
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

    getAlmacenProd(idproducto, index) {
        
        httpRequest('get', ws.wsgetalmacenprod + '/' + idproducto)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                for (let i = 0; i < length; i++) {
                    if (data[i].idalmacen == this.state.almacenVentaId) {
                        //console.log('--------------------------------------------------------------');
                        //console.log('ESTE ES EL ID DE ALMACEN PROD DETALLE ', data[i].idalmacenprod);
                        this.state.arrayIdAlmacenProdDetalle[index] = data[i].idalmacenprod;
                        //console.log('IDS ALMACEN PROD DETALLE ', this.state.arrayIdAlmacenProdDetalle);
                        //console.log('--------------------------------------------------------------');
                        this.setState({
                            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle
                        });
                        break;
                    }
                }
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onChangeSearchProdId(index, value) {

        if (this.isProductoSelecct(value)) {
            message.warning('El producto ya fue seleccionado');
            return;
        }
        let array = this.state.resultProductos;
        let descripcion = 'No existe el producto';
        let idunidadm = 0;
        let tipo = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                idunidadm = array[i].fkidunidadmedida;
                tipo = array[i].tipo;
                break;
            }
        }
        this.getNombreUnidadMedida(idunidadm, index);
        //this.validarStock(this.state.almacenVentaId, value, this.state.arrayCantidadVenta[index]);
        this.getTraerPrecio(value, index);
        this.getAlmacenProd(value, index);
        this.state.arrayTipoPoS[index] = tipo;
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayTipoPoS: this.state.arrayTipoPoS
        });
    }

    isProductoSelecct(idproducto) {
        
        let array = this.state.valuesSearchProd;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].id == idproducto) return true;
        }
        return false;
    }

    searchListaPrecio(value) {

        if (value.length > 0) {
            httpRequest('get', ws.wssearchlistaprecio + '/' + value, {
                idmoneda: this.state.monedaVentaId
            })
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultListaPrecios: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('No se pudo procesar la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultListaPrecios: this.state.resultListaPreciosDefault
            });
        }
    }

    handleSearchListaPrecio(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchListaPrecio(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchListaPrecio(value) {

        let data = this.state.valuesSearchProd;
        let length = data.length;
        for (let i = 0; i < length ; i++) {
            this.state.arrayListaVenta[i] = value;
            if (data[i].id != undefined) {
                this.getTraerPrecio(data[i].id, i);
            }
        }
        this.setState({
            //listaVentaId: value,
            valSearchListaPrecio: value,
            arrayListaVenta: this.state.arrayListaVenta,
            //arrayListaVenta2: this.state.arrayListaVenta2
        })
        //this.ClearDetalle();
    }

    onChangeSearchProdNom(index, value) {

        if (this.isProductoSelecct(value)) {
            message.warning('El producto ya fue seleccionado');
            return;
        }

        let array = this.state.resultProductos;
        let descripcion = 'No existe el producto';
        let idunidadm = 0;
        let tipo = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                idunidadm = array[i].fkidunidadmedida;
                tipo = array[i].tipo;
                break;
            }
        }
        this.getNombreUnidadMedida(idunidadm, index);
        //this.validarStock(this.state.almacenVentaId, value, this.state.arrayCantidadVenta[index], index);
        this.getTraerPrecio(value, index);
        this.getAlmacenProd(value, index);
        this.state.arrayTipoPoS[index] = tipo;
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
        //console.log('PRODUCTOS ', this.state.valuesSearchProd);
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayTipoPoS: this.state.arrayTipoPoS
        });
    }

    /****************FALTA *****************************************************************************************/
    searchClienteByIdCod(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchclienteidcod + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultClientes: this.state.resultClientesDefault
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultClientes: this.state.resultClientesDefault
            });
        }
    }

    handleSearchClienteByIdCod(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchClienteCod(value) {

        let array = this.state.resultClientes;
        let nameFull = undefined;
        let nit = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idcliente == value || array[i].codcliente == value) {
                let apellido = array[i].apellido == null ? '' : array[i].apellido;
                nameFull = array[i].nombre + ' ' + apellido;
                nit = array[i].nit;
                break;
            }
        }
        this.getVehiculoDelCliente(value);
        this.setState({
            valSearchClieCod: value == '' ? undefined : value,
            valSearchClieNombre: nameFull,
            nitVenta: nit
        });
    }

    searchClienteByNombre(value) {
        
        if (value.length > 0) {
            httpRequest('get', ws.wssearchclientenombre + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultClientes: this.state.resultClientesDefault
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultClientes: this.state.resultClientesDefault
            });
        }
        
    }

    handleSearchClienteByNombre(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    searchVehiculoByPlaca(value) {
        if (value.length > 0) {
            httpRequest('post', ws.wsclivehiculosplaca, {
                value: value,
                idcliente: this.state.valSearchClieCod
            })
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultVehiculos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultVehiculos: this.state.resultVehiculosDefault
            });
        }
    }

    onSearchVehiculoPlaca(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByPlaca(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    searchVehiculoByCod(value) {
        if (value.length > 0) {
            httpRequest('post', ws.wsclivehiculosidcod, {
                value: value,
                idcliente: this.state.valSearchClieCod
            })
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultVehiculos: result.data,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultVehiculos: this.state.resultVehiculosDefault
            });
        }
    }

    onSearchVehiculoCod(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchVehiculo(value) {
        let data = this.state.resultVehiculos;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idvehiculo == value) {
                this.setState({
                    valSearchVehiculoCod: value,
                    vehiculoDescripcion: data[i].vehiculotipo
                });
                break;
            }
        }
    }

    onChangeSearchClienteNombre(value) {

        let array = this.state.resultClientes;
        let nameFull = undefined;
        let nit = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idcliente == value || array[i].codcliente == value) {
                let apellido = array[i].apellido == null ? '' : array[i].apellido;
                nameFull = array[i].nombre + ' ' + apellido;
                nit = array[i].nit;
                break;
            }
        }
        this.getVehiculoDelCliente(value);
        this.setState({
            valSearchClieCod: value == '' ? undefined : value,
            valSearchClieNombre: nameFull,
            nitVenta: nit
        });
    }

    searchVendedorByIdCod(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchvendedoridcod + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultVendedores: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultVendedores: this.state.resultVendedoresDefault
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultVendedores: this.state.resultVendedoresDefault
            });
        }
        

    }

    handleSearchVendedorByIdCod(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchVendedorIdCod(value) {

        let array = this.state.resultVendedores;
        let descripcion = '';
        let fullname = 'No existe';
        let idcomision = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idvendedor == value) {
                let apellido = array[i].apellido == null ? '' : array[i].apellido;
                fullname = array[i].nombre + ' ' + apellido;
                idcomision = array[i].fkidcomisionventa;
                break;
            }
        }
        this.getComision(idcomision);
        this.setState({
            valSearchVendedorCod: value,
            valSearchVendedorFullname: fullname,
            fkidcomisionventa: idcomision
        });
    }

    searchVendedorByFullName(value) {

        if (value.length > 0) {
            httpRequest('get', ws.wssearchvendedorfullname + '/' + value)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultVendedores: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.setState({
                        resultVendedores: resultVendedoresDefault
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({
                resultVendedores: resultVendedoresDefault
            });
        }
        

    }

    handleSearchVendedorByFullName(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByFullName(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchVendedorByFullName(value) {

        let array = this.state.resultVendedores;
        let idvendedor ='';
        let idcomision = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idvendedor == value) {
                idvendedor = array[i].idvendedor;
                idcomision = array[i].fkidcomisionventa;
                break;
            }
        }
        this.getComision(idcomision);
        this.setState({
            valSearchVendedorFullname: value,
            valSearchVendedorCod: idvendedor,
            fkidcomisionventa: idcomision
        });
    }

    searchProductoByCodId(value) {
        
        if (value.length > 0 && this.state.almacenVentaId != '') {
            let body = { value: value, idalmacen: this.state.almacenVentaId};
            httpRequest('post', ws.wssearchprodidalm, body)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                    this.setState({
                        resultProductos: this.state.resultProductosDefault
                    });
                }
            })
            .catch((error) => {
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
                this.setState({
                    resultProductos: this.state.resultProductosDefault
                });
            })
        } else {
            this.setState({
                resultProductos: this.state.resultProductosDefault
            });
        }
    }

    searchProductoByDesc(value) {
        
        if (value.length > 0 && this.state.almacenVentaId != '') {
            let body = { value: value, idalmacen: this.state.almacenVentaId};
            httpRequest('post', ws.wssearchproddescalm, body)
            .then((result) => {
                if (result.response > 0) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                    this.setState({
                        resultProductos: this.state.resultProductosDefault
                    });
                }
            })
            .catch((error) => {
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
                this.setState({
                    resultProductos: this.state.resultProductosDefault
                });
            })
        } else {
            this.setState({
                resultProductos: this.state.resultProductosDefault
            });
        }
    }

    onSearchProdCod(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoByCodId(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onSearchProdNom(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoByDesc(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    /****************FALTA *****************************************************************************************/
    ventaFecha(dateString){

        var fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() - 1);
        var fechaModi = stringToDate(dateString, 'f2')
        
        if (fechaModi.getTime() < fechaActual.getTime()) {
            message.error("Fecha Invalida");
        } else {
            this.setState({
                fechaVenta: dateString
            });
        }

    }

    confirmChangeMoneda(value) {
        //const value = e.target.value;
        const ventaMoneda = this.ventaMoneda.bind(this);
        Modal.confirm({
            title: 'Cambiar de Moneda',
            content: 'Al cambiar de moneda se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              ventaMoneda(value);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    ventaMoneda(value) {
        this.state.listaMonedaVenta.splice(0, this.state.listaMonedaVenta.length)
        this.setState({
            monedaVentaId: value
        })
        this.ClearDetalle();
        //this.actualizarListaPrecio(value);
    }

    confirmChangeSucursal(value) {
        //const value = e.target.value;
        const ventaSucursal = this.ventaSucursal.bind(this);
        Modal.confirm({
            title: 'Cambiar de Sucursal',
            content: 'Al cambiar de sucursal se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              ventaSucursal(value);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    ventaSucursal(value) {
        this.state.almacenVentaSucursal.splice(0, this.state.almacenVentaSucursal.length);
        this.setState({
            sucursalVentaId: value
        })
        this.ClearDetalle();
        this.actualizarAlmacen(value);
    }

    actualizarAlmacen(idsucursal) {

        let idalmacen = 0;
        for (let i = 0; i < this.state.almacenVenta.length ; i++) {
            if (this.state.almacenVenta[i].fkidsucursal == idsucursal) {
                this.state.almacenVentaSucursal.push(this.state.almacenVenta[i]);
                idalmacen = this.state.almacenVentaSucursal[0].idalmacen;
            }
        }
        this.setState({
            almacenVentaSucursal: this.state.almacenVentaSucursal,
            almacenVentaId: idalmacen
        });

        this.getProductos(idalmacen);

    }

    confirmChangeAlmacen(value) {

        //const value = e.target.value;
        const ventaAlmacen = this.ventaAlmacen.bind(this);
        Modal.confirm({
            title: 'Cambiar de almacen',
            content: 'Al cambiar de almacen se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              ventaAlmacen(value);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    ventaAlmacen(value) {
        this.setState({
            almacenVentaId: value
        });
        this.ClearDetalle();
        this.getProductos(value);
    }

    ventaCliente(value) {

        if (typeof value != 'undefined') {
            var array =  value.split(" ")
            this.setState({
                clienteDataVenta1:array[0]
            });
            for (let i = 0; i < this.state.clienteVenta.length; i++) {
                if (this.state.clienteVenta[i].idcliente == array[0]) {
                    this.setState({
                        clienteDataVenta2:this.state.clienteVenta[i].nombre + " " + this.state.clienteVenta[i].apellido,
                        nitVenta:this.state.clienteVenta[i].nit === null ? "no tiene" : this.state.clienteVenta[i].nit
                    })
                }
            }
            this.getVehiculoDelCliente(array[0]);
        } else {
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
        httpRequest('get', ws.wsgetvehiculo + '?id=' + idCliente + '')
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                let vehiculo = result.data[0];
                let codvehiculo = (vehiculo.codvehiculo == null || !this.state.configCodigo) ? '' : vehiculo.codvehiculo;
                this.setState({
                    vehiculosCliente: result.data,
                    valSearchVehiculoCod: vehiculo.idvehiculo,
                    vehiculoPlaca: vehiculo.placa,
                    vehiculoDescripcion: vehiculo.vehiculotipo,
                    resultVehiculos: result.data,
                    resultVehiculosDefault: result.data,
                    //vehiculoId: vehiculo.idvehiculo + ' ' + codvehiculo,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculoId: '',
                    vehiculoPlaca: '',
                    vehiculoDescripcion:'',
                    valSearchVehiculoCod: undefined,
                    vehiculosCliente: [],
                    resultVehiculos: [],
                    resultVehiculosDefault: []
                });
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                vehiculoId: '',
                vehiculoPlaca: '',
                vehiculoDescripcion:'',
                valSearchVehiculoCod: undefined,
                vehiculosCliente: [],
                resultVehiculos: [],
                resultVehiculosDefault: []
            });
        })

    }
   
    getNombreUnidadMedida(idunidadmedida,index){
        var body = {
            "fkidunidadmedida":idunidadmedida
        };
        httpRequest('post', ws.wstraerunidadmed,body)
        .then(result => {

            if (result.response == 1) {

                this.state.arrayUnidadVentaAbrev[index] = result.data[0].abreviacion
                this.setState({
                    arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    ventaCantidad(index, value) {
        
        if (isNaN(value)) return;
        //let index = e.target.id;
        let valor = value == '' ? 0 : value;
        if (this.state.valuesSearchProd[index].id != undefined) {
            
            if (parseFloat(valor) >= 0) {
                if (this.state.arrayTipoPoS[index] == "P") {
                    this.validarStock(this.state.almacenVentaId, this.state.valuesSearchProd[index].id, valor, index);
                } else {
                    this.state.arrayCantidadVenta[index] = value;
                    this.setState({
                        arrayCantidadVenta: this.state.arrayCantidadVenta
                    });
                }

            } else {
                this.state.arrayCantidadVenta[index] = valor;
                message.warning("Cantidad Igual o Mayor a 1 Por favor");
                this.setState({
                    arrayCantidadVenta: this.state.arrayCantidadVenta
                });
            }
        } else  {
            message.warning("Por Favor Seleccion un Producto");
        }
    }

    validarStock(idalmacen, idproducto, valor, index){
        var  body =  {
            idalmacen: idalmacen,
            idproducto: idproducto
        }
        httpRequest('post', ws.wsverificarstock, body).
        then(result => {
            if (result.response == 1) {
                if (result.data.length > 0) {
                    let stockSuma = 0;
                    let length = result.data.length;
                    for (let i = 0; i < length ; i++) {
                        stockSuma = stockSuma + result.data[i].stock;
                    }

                    if (parseInt(stockSuma) >= parseInt(valor)) {
                        this.state.arrayCantidadVenta[index] = valor;

                        this.setState({
                            arrayCantidadVenta: this.state.arrayCantidadVenta
                        });
                    } else {
                        message.error("Stock Agotado");
                    }
                } else {
                    message.error("No existe Producto en un almacen");
                }

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error("Error Del Servidor");
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    getTraerPrecio(idProducto, posicion) {
        
        var body = {
            idproducto: parseInt(idProducto),
            idlistaprecio: this.state.arrayListaVenta[posicion]
        }
        httpRequest('post', ws.wsgetprecioprod, body)
        .then(result => {
            if (result.response == 1) {
                if (result.data.length > 0) {
                    this.state.arrayPrecioUnit[posicion] = result.data[0].precio;
                    this.state.arrayListaPreProdDetalle[posicion] = result.data[0].idlistapreproducdetalle;
                    this.setState({
                        arrayPrecioUnit: this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle: this.state.arrayListaPreProdDetalle
                    });
                } else {
                    this.state.arrayPrecioUnit[posicion] = 0;
                    this.state.arrayListaPreProdDetalle[posicion] = 0;
                    this.setState({
                        arrayPrecioUnit: this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle: this.state.arrayListaPreProdDetalle
                    });
                    message.warning("El producto no se encuentra en la lista de precio");
                    //return false;
                }
                this.CalculoPrecioTotal(posicion);
                this.calculoSubTotal();
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un probleman en el servidor');
            }
        })
        .catch (error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getIdListaPrecio(descripcion) {
        let array = this.state.listaVenta;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].descripcion == descripcion) {
                return array[i].idlistaprecio;
            }
        }
        return -1;
    }

    ventaLista(index, value) {

        if (this.state.valuesSearchProd[index].id == undefined) {
            message.warning('Debe elegir un producto');
            return;
        }
        //let idlistaprecio = this.getIdListaPrecio(value);
        this.state.arrayListaVenta[index] = value;
        //this.state.arrayListaVenta2[index] = idlistaprecio;
        
        this.setState({
            arrayListaVenta: this.state.arrayListaVenta,
            //arrayListaVenta2: this.state.arrayListaVenta2,
        });
        
        this.getTraerPrecio(this.state.valuesSearchProd[index].id, index);

    }

    ventaListaPrincipal(value) {

        //let index = this.state.listaVenta.indexOf(value);
        let idlistaprecio = this.getIdListaPrecio(value);
        let length = this.state.valuesSearchProd.length;
        for (let i = 0; i < length ; i++) {
            this.state.arrayListaVenta[i] = value;
            this.state.arrayListaVenta2[i] = idlistaprecio;
        }
        this.setState({
            listaVentaId: idlistaprecio,
            listaVentaDesc: value,
            arrayListaVenta: this.state.arrayListaVenta,
            arrayListaVenta2: this.state.arrayListaVenta2
        });
        this.ClearDetalle();
    }

    ventaPrecioUnit(index, value) {
        
        if (isNaN(value)) return;
        //let index = e.target.id
        //let valor = parseFloat(e.target.value)
        if (this.state.valuesSearchProd[index].id != undefined) {
            if (value >= 0) {
                this.state.arrayPrecioUnit[index] = value
                this.setState({
                    arrayPrecioUnit: this.state.arrayPrecioUnit
                })
            } else {
                this.state.arrayPrecioUnit[index] = 0;
                this.setState({
                    arrayPrecioUnit: this.state.arrayPrecioUnit
                })
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        } else {
            message.error("Por favor seleccione un Producto");
        }
    }

    ventaDescuento(index, value){
        
        if (isNaN(value)) return;
        //let index = e.target.id
        //let valor = parseFloat(e.target.value)
        if (this.state.valuesSearchProd[index].id != undefined) {
            if ( value >= 0) {
                this.state.arrayDescuento[index] = value;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                });
            } else {
                this.state.arrayDescuento[index] = 0;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                })
                message.error("Descuento tiene que ser Mayor e Igual a 0");
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        } else {
            message.error("Por Favor Seleccione unProducto");
        }
    }

    CalculoPrecioTotal(posicion){
        let PrecioUnidad = parseFloat(this.state.arrayPrecioUnit[posicion]);
        let Descuento = parseFloat( this.state.arrayDescuento[posicion] );
        let cantidad = parseFloat(this.state.arrayCantidadVenta[posicion]);
       
        let precioTotal = ((PrecioUnidad - (PrecioUnidad * Descuento) / 100) * cantidad);
        this.state.arrayPrecioTotal[posicion] = precioTotal.toFixed(2);
        this.setState({
            arrayPrecioTotal: this.state.arrayPrecioTotal
        });
    }

    calculoSubTotal() {
        let subTotal = 0;
        for(let i = 0; i < this.state.arrayPrecioTotal.length; i++){
            if (this.state.arrayPrecioTotal[i] != "") {
                subTotal = subTotal + parseFloat(this.state.arrayPrecioTotal[i]);
            } 
        }
        this.setState({
            subTotalVenta: subTotal.toFixed(2)
        });
        this.CalculoTotal(1, subTotal);
    }

    ventaDescuentoTotal(value){
        if (isNaN(value)) return;
        let valor = parseFloat(value);
        if(valor >= 0 ){
            this.setState({
                descuentoVenta: value
            })

            this.CalculoTotal(0,valor);
        }else{
            this.setState({
                descuentoVenta:0
            })

            this.CalculoTotal(0,0);
        }
    }
    
    ventaRecargoTotal(value){
        if (isNaN(value)) return;
        let valor = parseFloat(value);
        if(valor >= 0){
            this.setState({
                recargoVenta: value
            });

            this.CalculoTotal(2,valor);
        }else{
            this.setState({
                recargoVenta: 0
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
    ventaObservacion(value){
        this.setState({
            observacionVenta: value
        })
    }

    validarDatos() {

        if ((this.state.codigoVenta.length === 0 && this.state.configCodigo) || this.state.validarCodigo == 0) {
            message.error('Debe introducir un codigo');
            return false;
        } 
        if (this.state.valSearchClieCod == undefined) {
            message.error('Debe seleccionar un cliente');
            return false;
        }
        if (this.state.valSearchVendedorCod == undefined) {
            message.error('Debe seleccionar un vendedor');
            return false;
        }
        if (this.state.valuesSearchProd.length === 0) {
            message.error('Debe seleccionar un Producto por lo menos');
            return false;
        }
        let b = false;
        for (let i = 0; i < this.state.valuesSearchProd.length; i++) {
            if (this.state.valuesSearchProd[i].id != undefined && this.state.arrayPrecioUnit[i] == 0) {
                message.error('Un producto no puede quedar con precio 0');
                return false;
            } else if (this.state.valuesSearchProd[i].id != undefined) {
                b = true;
            }
        }

        if (!b) {
            message.error('Debe seleccionar un producto por lo menos');
            return false;
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

    guardarVenta(){
        
        if(String(this.state.fechaVenta).length > 0  && String(this.state.comisionvendedor).length > 0
            && String(this.state.idusuario).length > 0 && String(this.state.estado).length > 0 && String(this.state.estadoProceso).length > 0
            && String(this.state.sucursalVentaId).length > 0 && String(this.state.valSearchClieCod).length > 0 && String(this.state.valSearchVendedorCod).length > 0
            && String(this.state.fkidtipocontacredito).length > 0 && String(this.state.fkidtipotransacventa).length > 0){

            var hora = new Date();
            var ventadetalle = [];
            var idsProductos = [];
            for (let i = 0;i < this.state.valuesSearchProd.length ; i++) {

                if (parseFloat(this.state.arrayPrecioUnit[i]) !== 0 && !isNaN(this.state.arrayPrecioUnit[i]) &&
                    this.state.valuesSearchProd[i].id != undefined) {
                    //console.log('DATA XDDXD', this.state.valuesSearchProd[i]);
                    var detalle = {
                        cantidad: parseInt(this.state.arrayCantidadVenta[i]),
                        precioUnit: parseFloat(this.state.arrayPrecioUnit[i]),
                        factor: parseFloat(this.state.arrayDescuento[i]),
                        tipo: this.state.arrayTipoPoS[i],
                        fkidalmacenprodetalle: parseInt(this.state.arrayIdAlmacenProdDetalle[i]),
                        fkidlistaproddetalle: parseInt(this.state.arrayListaPreProdDetalle[i]),
                        idProducto: parseInt(this.state.valuesSearchProd[i].id)
                    }
                    ventadetalle.push(detalle);
                    idsProductos.push(this.state.valuesSearchProd[i].id);
                }
            }

            let idvehiculo = this.state.vehiculoId.split(' ');
            var body = {
                codigoventa: this.state.codigoVenta,
                fechaventa: convertDmyToYmd(this.state.fechaVenta),
                estado: 'V',
                recargoVenta: isNaN(this.state.recargoVenta) ? 0 : parseFloat(this.state.recargoVenta),
                descuentoVenta: isNaN(this.state.descuentoVenta) ? 0 : parseFloat(this.state.descuentoVenta),
                nota: this.state.observacionVenta,
                estadoProceso: 'E',
                fechaHoraFin: null,
                idusuario: 1,
                fkidsucursal: this.state.sucursalVentaId,
                fkidcliente: this.state.valSearchClieCod,
                fkidvendedor: this.state.valSearchVendedorCod,
                fkidvehiculo: this.state.valSearchVehiculoCod,
                fkidtipocontacredito: 1,
                fkidtipotransacventa: 1,
                idmoneda: this.state.monedaVentaId,
                hora: hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
                comision: parseInt(this.state.comisionvendedor),
                arrayidproducto: JSON.stringify(idsProductos),
                arraycantidad: JSON.stringify(this.state.arrayCantidadVenta),
                arraypreciounit: JSON.stringify(this.state.arrayPrecioUnit),
                arraydescuento: JSON.stringify(this.state.arrayDescuento) ,
                arrayIdAlmacenProdDetalle: JSON.stringify(this.state.arrayIdAlmacenProdDetalle),
                arrayListaPreProdDetalle: JSON.stringify(this.state.arrayListaPreProdDetalle),
                arrayventadetalle: JSON.stringify(ventadetalle),
                condicion: 'C',
                anticipo: null,
                totalventa: this.state.totalVenta,
                montocobrado: this.state.anticipo,
                vehiculoParte: JSON.stringify(this.state.vehiculoParte),
                cantidadParteVehiculo: JSON.stringify(this.state.cantidadParteVehiculo),
                estadoParteVehiculo: JSON.stringify(this.state.estadoParteVehiculo),
                observacionParteVehiculo: JSON.stringify(this.state.observacionParteVehiculo),
                imagenParteVehiculo: JSON.stringify(this.state.imagenParteVehiculo),
                indiceParteVehiculo: JSON.stringify(this.state.indiceParteVehiculo),
                historialVehiculo: JSON.stringify(this.state.historialVehiculo)
            };

            httpRequest('post', ws.wsproforma, body)
            .then(result => {
                if(result.response == 1) {
                    this.setState({
                        redirect: true,
                        modalOk: false,
                        loadingOk: false
                    })
                    message.success("se inserto correctamente");
                } else if (result.response == -2) {
                    this.setState({ 
                        noSesion: true,
                        modalOk: false,
                        loadingOk: false
                    })
                } else {
                    console.log('Ocurrio un probleman en el servidor');
                    this.setState({
                        loadingOk: false,
                        modalOk: false
                    })
                }
            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
                this.setState({
                    loadingOk: false,
                    modalOk: false
                })
            })
        } else {
            console.log('FALTA DATOS');
            message.error("datos tienen que estar llenos")
            this.setState({
                loadingOk: false,
                modalOk: false
            })
        }

    }

    modificarFechaPlan(e){
        var fecha = e.target.value;
        var index = e.target.id;
        var datos = this.state.listaDeCuotas[index];
        var fechaModi = fecha.split('-');
        //var fechaFormato = String(fechaModi[2]+"/"+fechaModi[1]+"/"+fechaModi[0])
        var fechaActual = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]))
        var fechaVenta = this.state.fechaVenta.split('-')
        //var fechaVentaFormato = String(fechaVenta[2]+"/"+fechaVenta[1]+"/"+fechaVenta[0])
        var fechaVentaComparar =  new Date(parseInt(fechaVenta[0]),parseInt(fechaVenta[1])-1,parseInt(fechaVenta[2]))
        
        if (fechaActual.getTime() >= fechaVentaComparar.getTime()) {
            this.state.listaDeCuotas[index].FechaApagar = fecha
            this.setState({
                listaDeCuotas:this.state.listaDeCuotas
            })
        } else {
            console.log("no es mayor")
        }
        // fechaActual.setDate(fechaActual.getDate()+(parseInt(this.state.tipoPeriodo) * i))

    }

    modificarMonto(e){

        var monto = e.target.value == "" ? 0 : e.target.value;
        if (parseFloat(monto) < 0) return;
        let array = this.state.listaDeCuotas;
        var index = parseInt(e.target.id);
        var saldoAnterior = index == 0 ? this.state.saldoApagar : this.state.listaDeCuotas[index-1].saldo;
        this.state.listaDeCuotas[index].montoPagar = monto;
        let montoAnterior = this.state.listaDeCuotas[index-1].montoPagar;
        let auxSaldo = saldoAnterior - monto;
        this.state.listaDeCuotas[index].saldo = auxSaldo;
        let difMonto = montoAnterior - monto;
        let porcion = difMonto / (this.state.listaDeCuotas.length - index - 1);

        for (let i = index+1; i < this.state.listaDeCuotas.length ; i++) {
            let auxMontoPagar = montoAnterior + porcion;
            this.state.listaDeCuotas[i].montoPagar = auxMontoPagar;
            let saldo = parseFloat(this.state.listaDeCuotas[i-1].saldo) - parseFloat(this.state.listaDeCuotas[i].montoPagar);
            if (saldo < 0) {
                message.warning('No pueden habar negativos');
                this.setState({
                    listaDeCuotas: array
                });
                return;
            }
            this.state.listaDeCuotas[i].saldo = saldo;
        }
        this.setState({
            listaDeCuotas: this.state.listaDeCuotas
        })
    }

    PlandePago(){
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
                                value={l.FechaApagar} 
                                onChange={this.modificarFechaPlan.bind(this)}>
                            </input>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable">
                            <input
                                id={i} 
                                className='form-control-content reinicio-padding'
                                type='text' 
                                value={l.montoPagar} 
                                onChange={this.modificarMonto.bind(this)}>
                            </input>
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
            var saldo = this.state.totalVenta - parseFloat(anticipo)
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
        for (let i = 0 ; i < this.state.NumeroCuota; i++) {
            var arrayfecha = this.state.fechaInicioDePago.split('-');
            var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0]);
            var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]));
            fecha.setDate(fecha.getDate()+(parseInt(this.state.tipoPeriodo) * i));
            var mes = fecha.getMonth()+1 > 9 ? "" : "0";
            var dia = fecha.getDate() > 9 ? "" : "0";
            var fechaAmostrar = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate()

            if (i+1 == this.state.NumeroCuota) {
                var saldo = this.state.saldoApagar
                var montoPagarPlan = Math.round((saldo-((Math.round((saldo/this.state.NumeroCuota)*100)/100)*(i)))*100)/100;
                var saldoPagarPlan = 0;
            } else {
                var montoPagarPlan = Math.round((this.state.saldoApagar/this.state.NumeroCuota)*100)/100
                var saldo = this.state.saldoApagar
                var saldoredondeado = (Math.round((saldo/this.state.NumeroCuota)*100)/100)*(i+1)
                var saldoPagarPlan = Math.round((saldo-saldoredondeado)*100)/100
            }
            let cuotas = {
                Nro: i+1,
                saldo: saldoPagarPlan,
                descripcion: "Cuota Nro."+" "+(i+1),
                FechaApagar: fechaAmostrar,
                montoPagar: montoPagarPlan,
            }
            this.state.listaDeCuotas.push(cuotas);

        }
        this.setState({
            listaDeCuotas:this.state.listaDeCuotas
        })

    }
    fechaPagoInicio(e){

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
                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 borderTable form-planpagocabezera ">
                        <label className="label-group-content-nwe label-plan-pago">Nro Cuotas</label>
                    </div>
                    <div className="cols-lg-3 cols-md-2 cols-sm-12 cols-xs-12 borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago ">Descripcion</label>
                    </div>
                    <div className="cols-lg-3 cols-md-2 cols-sm-12 cols-xs-12 borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago">Fecha a Pagar</label>
                    </div>
                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 borderTable form-planpagocabezera">
                        <label className="label-group-content-nwe label-plan-pago">Monto a Pagar</label>
                    </div>
                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 borderTable form-planpagocabezera">
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

    addRowDetalle() {

        this.setState({
            arrayPrecioUnit: [
                ...this.state.arrayPrecioUnit,
                ''
            ],
            arrayPrecioTotal: [
                ...this.state.arrayPrecioTotal,
                ''
            ],
            arrayCantidadVenta: [
                ...this.state.arrayCantidadVenta,
                0
            ],
            arrayTipoPoS: [
                ...this.state.arrayTipoPoS,
                ''
            ],
            arrayUnidadVentaAbrev: [
                ...this.state.arrayUnidadVentaAbrev,
                ''
            ],
            arrayDescuento: [
                ...this.state.arrayDescuento,
                0
            ],
            arrayUnidadVenta: [
                ...this.state.arrayUnidadVenta,
                ''
            ],
            arrayIdAlmacenProdDetalle: [
                ...this.state.arrayIdAlmacenProdDetalle,
                ''
            ],
            valuesSearchProd: [
                ...this.state.valuesSearchProd,
                { id: undefined, descripcion: undefined }
            ],
            arrayListaPreProdDetalle: [
                ...this.state.arrayListaPreProdDetalle,
                ''
            ],
            arrayListaVenta: [
                ...this.state.arrayListaVenta,
                this.state.valSearchListaPrecio
            ],
            arrayListaVenta2: [
                ...this.state.arrayListaVenta2,
                this.state.listaVentaId
            ],
        });
    }

    removeRowDetalle(i) {
        
        this.state.arrayPrecioUnit.splice(i,1)
        this.state.arrayPrecioTotal.splice(i,1)
        this.state.arrayCantidadVenta.splice(i,1)
        this.state.arrayTipoPoS.splice(i,1)
        this.state.arrayUnidadVentaAbrev.splice(i,1)
        this.state.arrayDescuento.splice(i,1)
        this.state.arrayUnidadVenta.splice(i,1)
        this.state.arrayIdAlmacenProdDetalle.splice(i,1)
        //this.state.arrayCodProVenta.splice(i,1);
        this.state.valuesSearchProd.splice(i, 1);
        this.state.arrayListaPreProdDetalle.splice(i,1)
        //this.state.arrayProductoVenta.splice(i,1)
        this.state.arrayListaVenta.splice(i,1)
        this.state.arrayListaVenta2.splice(i,1)
        this.setState({
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayPrecioTotal: this.state.arrayPrecioTotal,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayDescuento: this.state.arrayDescuento,
            arrayUnidadVenta: this.state.arrayUnidadVenta,
            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayListaVenta: this.state.arrayListaVenta,
            arrayListaVenta2: this.state.arrayListaVenta2,
            arrayListaPreProdDetalle: this.state.arrayListaPreProdDetalle
        },
            () => this.calculoSubTotal()
        );
    }

    onChangeIdVehiculoCliente(value) {
        let array = this.state.vehiculosCliente;
        let length = array.length;
        let placa = '';
        let descripcion = '';
        let codvehiculo = '';
        let arr = value.split(' ');
        for (let i = 0; i < length; i++) {
            if (array[i].idvehiculo == arr[0]) {
                placa = array[i].placa;
                descripcion = array[i].descripcion;
                codvehiculo = array[i].codvehiculo;
                break;
            }
        }
      
        this.setState({
            vehiculoId: value,
            vehiculoPlaca: placa,
            vehiculoDescripcion: descripcion,
            //fechaActual: this.state.fechaActual
        });
    }

    onChangePlacaVehiculoCliente(value) {

        let array = this.state.vehiculosCliente;
        let length = array.length;
        let idvehiculo = '';
        let descripcion = '';
        let codvehiculo = '';
        for (let i = 0; i < length; i++) {
            if (array[i].placa == value) {
                idvehiculo = array[i].idvehiculo;
                descripcion = array[i].descripcion;
                codvehiculo = array[i].codvehiculo;
                break;
            }
        }

        this.setState({
            vehiculoId: idvehiculo + ' ' + codvehiculo,
            vehiculoPlaca: value,
            vehiculoDescripcion: descripcion
        });

    }

    cambiarRegistroParteVehiculo() {

        if (this.state.valSearchVehiculoCod != undefined) {

            let data = this.state.resultVehiculos;
            let length = data.length;
            for (let i = 0; i < length; i++) {
                if (data[i].idvehiculo == this.state.valSearchVehiculoCod) {
                    this.state.vehiculoDescripcion = data[i].vehiculotipo;
                    this.state.vehiculoPlaca = data[i].placa;
                    break;
                }
            }

            this.state.mostrarOpcionParteVehiculo = 1;
            this.state.mostrarOpcionRegistrarVenta = 0;
            this.state.tituloPrincipal = 'Registrar Partes de Vehiculo';

            this.setState({
                mostrarOpcionParteVehiculo: this.state.mostrarOpcionParteVehiculo,
                mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
                tituloPrincipal: this.state.tituloPrincipal
            });
        } else {
            message.warning('Debe seleccionar un vehiculo');
        }
    }

    cambiarRegistroHistorialVehiculo() {

        if (this.state.valSearchVehiculoCod != undefined) {

            let data = this.state.resultVehiculos;
            let length = data.length;
            for (let i = 0; i < length; i++) {
                if (data[i].idvehiculo == this.state.valSearchVehiculoCod) {
                    this.state.vehiculoDescripcion = data[i].vehiculotipo;
                    this.state.vehiculoPlaca = data[i].placa;
                    break;
                }
            }

            this.state.mostrarOpcionHistorialVehiculo = 1;
            this.state.mostrarOpcionRegistrarVenta = 0;
            this.state.tituloPrincipal = 'Registrar Historial del Vehiculo';
    
            this.setState({
                mostrarOpcionHistorialVehiculo: this.state.mostrarOpcionHistorialVehiculo,
                mostrarOpcionRegistrarVenta: this.state.mostrarOpcionRegistrarVenta,
                tituloPrincipal: this.state.tituloPrincipal
            });
        } else {
            message.warning('Debe seleccionar un vehiculo');
        }
        
    }

    getResultadoParteVehiculo(resultado) {

        this.setState({
            mostrarOpcionParteVehiculo: 0,
            mostrarOpcionRegistrarVenta: 1,
            tituloPrincipal: 'Registrar Proforma',
            vehiculoParte: resultado.vehiculoParte,
            cantidadParteVehiculo: resultado.cantidadParteVehiculo,
            estadoParteVehiculo: resultado.estadoParteVehiculo,
            observacionParteVehiculo: resultado.observacionParteVehiculo,
            imagenParteVehiculo: resultado.imagenParteVehiculo,
            indiceParteVehiculo: resultado.indiceParteVehiculo
        });
           
    }

    getResultadoHistorialVehiculo(resultado) {

        this.setState({
            mostrarOpcionHistorialVehiculo: 0,
            mostrarOpcionRegistrarVenta: 1,
            tituloPrincipal: 'Registrar Proforma',
            historialVehiculo: resultado
        });
    }


    verDatosCliente(id) {
        var data = {
            'idCliente': id
        }
        httpRequest('post', ws.wsshowcliente, data)
        .then(result => {
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else if (result.data) {
                    
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
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
        this.getClientes();
        if (bandera != 0) {
            this.setState({
                mostrarCrearCliente: !this.state.mostrarCrearCliente,
                valSearchClieCod: cliente.idcliente,
                valSearchClieNombre: cliente.nombre + ' ' + cliente.apellido,
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
    
    showConfirmStore() {

        if (!this.validarDatos()) return;
        const guardarVenta = this.guardarVenta.bind(this);
        Modal.confirm({
          title: 'Guardar Proforma',
          content: '¿Estas seguro de guardar la proforma?',
          onOk() {
            console.log('OK');
            guardarVenta();
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
            title: 'Esta seguro de cancelar el registro de la nueva proforma?',
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

    resultClientCod() {
        let arr = [];
        let data = this.state.resultClientes;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let codcliente = data[i].codcliente == null ? '' : data[i].codcliente;
            arr.push(
                <Option 
                    key={i} value={data[i].idcliente}>
                    {data[i].idcliente + ' ' + codcliente}
                </Option>
            );
        }
        return arr;
    }

    resultClientNomb() {
        let arr = [];
        let data = this.state.resultClientes;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            let fullname = data[i].nombre + ' ' + apellido;
            arr.push(
                <Option 
                    key={i} value={data[i].idcliente}>
                    {fullname}
                </Option>
            );
        }
        return arr;
        
    }

    listaVehiculosCod() {
       
        let arr = [];
        let data = this.state.vehiculosCliente;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let codvehiculo = (data[i].codvehiculo == null || !this.state.configCodigo) ? '' : data[i].codvehiculo;
            arr.push(
                <TreeNode
                    key={i}
                    value={data[i].idvehiculo + ' ' + codvehiculo} 
                    title={data[i].idvehiculo + ' ' + codvehiculo} 
                />
            );
        }
        return arr;
    }

    listaVehiculosPlaca() {
        
        let arr = [];
        let data = this.state.vehiculosCliente;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(
                <TreeNode
                    key={i}
                    value={data[i].placa} 
                    title={data[i].placa} 
                />
            );
        }
        return arr;
    }

    columnCodProd() {
        if (this.permisions.t_prod_cod.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe "> 
                    CodProd 
                </label>
            );
        }
        return null;
    }

    columnDescProd() {
        if (this.permisions.t_prod_desc.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe"> 
                    Producto 
                </label>
            );
        }
        return null;
    }

    columnCantidad() {
        if (this.permisions.t_cantidad.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe"> 
                    Cantidad 
                </label>
            );
        }
        return null;
    }

    columnListaPrecios() {
        if (this.permisions.t_lista_precios.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe"> 
                    Lista 
                </label>
            );
        }
        return null;
    }

    columnPrecioUnit() {
        if (this.permisions.t_precio_unitario.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe "> 
                    Precio Unit 
                </label>
            );
        }
        return null;
    }

    columnDescuento() {
        if (this.permisions.t_descuento.visible == 'A') {
            return (
                <label 
                    htmlFor="lista" 
                    className="label-group-content-nwe"> 
                    % Dcto. 
                </label>
            );
        }
        return null;
    }

    resultVendCod() {
        let arr = [];
        let data = this.state.resultVendedores;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let codvendedor = (data[i].codvendedor == null || !this.state.configCodigo) ? '' : data[i].codvendedor;
            arr.push(
                <Option 
                    key={i} value={data[i].idvendedor}>
                    {data[i].idvendedor + ' ' + codvendedor}
                </Option>
            );
        }
        return arr;
    }

    resultVendNomb() {
        let arr = [];
        let data = this.state.resultVendedores;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option 
                    key={i} value={data[i].idvendedor}>
                    {data[i].nombre + ' ' + apellido}
                </Option>
            );
        }
        return arr;
    }

    resultClientCod() {
            let arr = [];
            let data = this.state.resultClientes;
            let length = data.length;
            for (let i = 0; i < length; i++) {
                let codcliente = (data[i].codcliente == null || !this.state.configCodigo) ? '' : data[i].codcliente;
                arr.push(
                    <Option 
                        key={i} value={data[i].idcliente}>
                        {data[i].idcliente + ' ' + codcliente}
                    </Option>
                );
            }
            return arr;
    }

    buttonAddShowCliente() {

        if (typeof this.state.valSearchClieCod != 'undefined' && this.permisions.btn_ver_cli.visible == 'A') {
            
            return (
                <div className="input-group-content">
                    <C_Button title={<i className="fa fa-eye"></i>}
                        type='danger' size='small' style={{padding: 4}}
                        onClick={this.verDatosCliente.bind(this, this.state.valSearchClieCod)}
                    />
                </div>
            );
        } else if (this.permisions.btn_add_cli.visible == 'A') {
            return (
                <div className="input-group-content">
                    <C_Button title={<i className="fa fa-plus"></i>}
                        type='primary' size='small' style={{padding: 4}}
                        onClick={this.crearNuevoCliente.bind(this)}
                    />

                </div>
            );
        }
        return null;
    }

    listaSucursales() {
        
        let arr = [];
        let data = this.state.sucursalVenta;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idsucursal}>{data[i].nombre}</Option>
            );
        }
        return arr;
    }

    listaAlmacenes() {
        let arr = [];
        let data = this.state.almacenVentaSucursal;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    listaPrecios() {
        let arr = [];
        let data = this.state.listaMonedaVenta;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(
                <TreeNode
                    key={i}
                    value={data[i].descripcion} 
                    title={data[i].descripcion} 
                />
            );
        }
        return arr;
    }

    listaMonedas() {

        let arr = [];
        let data = this.state.monedas;
        let length = data.length;
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

    resultCodIdProds() {
        let data = this.state.resultProductos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let codproducto = (data[i].codproducto == null || !this.state.configCodigo) ? '' : data[i].codproducto;
            arr.push(
                    <Option 
                        key={i} value={data[i].idproducto}>
                        {data[i].idproducto + ' ' + codproducto}
                    </Option>
            );
        }
        return arr;
    }

    resultDescProds() {
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

    listNodesListaPrecios() {

        let data = this.state.listaMonedaVenta;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <TreeNode 
                    value={data[i].descripcion} 
                    title={data[i].descripcion} 
                    key={i}/>
            );
        }
        return arr;
    }

    btnHistorial() {
        if (this.permisions.btn_historial_veh.visible == 'A' && this.state.configVehiculoHistorial) {
            return (
                <C_Button
                    title='Historial Vehiculo'
                    type='primary'
                    onClick={this.cambiarRegistroHistorialVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    btnPartes() {
        if (this.permisions.btn_partes_veh.visible == 'A' && this.state.configVehiculoPartes) {
            return (
                    <C_Button
                    title='Partes Vehiculo'
                    type='primary'
                    onClick={this.cambiarRegistroParteVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    resultVehiculosCod() {
        let arr = [];
        let data = this.state.resultVehiculos;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let codigo = this.state.configCodigo ? data[i].codvehiculo : data[i].idvehiculo;
            arr.push(

                <Option 
                    key={i} value={data[i].idvehiculo}>
                    {codigo}
                </Option>
            );
        }
        return arr;
    
    }

    resultVehiculosPlaca() {
        let arr = [];
        let data = this.state.resultVehiculos;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} value={data[i].idvehiculo}>
                    {data[i].placa}
                </Option>
            );
        }
        return arr;
    }

    listListaPrecios() {
        let data = this.state.resultListaPrecios;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i ++) {
            arr.push(
                <Option 
                    key={i} value={data[i].idlistaprecio}>
                    {data[i].descripcion}
                </Option>
            )
        }
        return arr;
    }

    render() {
        if (this.state.noSesion){
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        if(this.state.redirect === true){
            return (<Redirect to={routes.proforma_index} />)
        }
        //console.log('LONGITUD DE PRODUCTOS ', this.state.productoVenta.length)
        const buttonAddShowCliente = this.buttonAddShowCliente();
        const resultClientCod = this.resultClientCod();
        const resultClientNomb = this.resultClientNomb();
        const listaSucursales = this.listaSucursales();
        const listaAlmacenes = this.listaAlmacenes();
        const resultVendNomb = this.resultVendNomb();
        const resultVendCod = this.resultVendCod();
        const listaMonedas = this.listaMonedas();
        const columnCodProd = this.columnCodProd();
        const columnDescProd = this.columnDescProd();
        const columnCantidad = this.columnCantidad();
        const columnListaPrecios = this.columnListaPrecios();
        const columnPrecioUnit = this.columnPrecioUnit();
        const columnDescuento = this.columnDescuento();
        const resultCodIdProds = this.resultCodIdProds();
        const resultDescProds = this.resultDescProds();
        const btnHistorial = this.btnHistorial();
        const btnPartes = this.btnPartes();
        const resultVehiculosCod = this.resultVehiculosCod();
        const resultVehiculosPlaca = this.resultVehiculosPlaca();
        const listListaPrecios = this.listListaPrecios();

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

                <Confirmation
                    visible={this.state.modalOk}
                    title="Registrar Proforma"
                    loading={this.state.loadingOk}
                    onCancel={this.onCancelMO}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de registrar la Proforma?
                            </label>
                        </div>
                    ]}
                />
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registro de Proforma"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de proforma?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    ]}
                />
                
                <div style={{'display': (this.state.mostrarCrearCliente)?'none':'block'}}>

                    <div className="rows" 
                        style={{'display': (this.state.mostrarOpcionRegistrarVenta === 1)?'block':'none'}}>
                        <div className="cards">
                            <div className="forms-groups">
                                <div className="pulls-left">
                                    <h1 className="lbls-title">Registrar Proformas</h1>
                                </div>
                            </div>
                            <div className="forms-groups">
                                {/*<form onSubmit={this.guardarDatos.bind(this)} encType="multipart/form-data">*/}
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <Input 
                                                value={this.state.codigoVenta}
                                                onChange={this.ventaCodigo.bind(this)}
                                                title='Codigo'
                                                validar={this.state.validarCodigo}
                                                permisions={this.permisions.codigo}
                                                configAllowed={this.state.configCodigo}
                                            />
                                            {
                                                this.state.validarCodigo == 0 ?
                                                    <p style={{ color: 'red' }}>El codigo ya existe</p>
                                                :
                                                    null
                                            }
                                        </div>

                                        <C_DatePicker
                                            allowClear={false}
                                            value={this.state.fechaVenta}
                                            onChange={this.ventaFecha.bind(this)}
                                            permisions={this.permisions.fecha}
                                            className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12"
                                        />

                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                value={this.state.sucursalVentaId}
                                                title={"Sucursal"}
                                                onChange={this.confirmChangeSucursal.bind(this)}
                                                component={listaSucursales}
                                                permisions={this.permisions.sucursal}
                                            />
                                        </div>

                                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                            <CSelect
                                                value={this.state.almacenVentaId}
                                                title={"Almacen"}
                                                onChange={this.confirmChangeAlmacen.bind(this)}
                                                component={listaAlmacenes}
                                                permisions={this.permisions.almacen}
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className="cols-lg-1 cols-md-1 cols-sm-4 cols-xs-12">
                                            { buttonAddShowCliente }
                                        </div>
                                        <div className="cols-lg-2 cols-md-2 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchClieCod}
                                                placeholder={"Buscar por Cod/Id"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearchClienteByIdCod}
                                                onChange={this.onChangeSearchClienteCod}
                                                notFoundContent={null}
                                                component={resultClientCod}
                                                title="Codigo Cliente"
                                                onDelete={this.onDeleteCliente}
                                                allowDelete={true}
                                                permisions={this.permisions.cli_cod}
                                            />
                                        </div>

                                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchClieNombre}
                                                placeholder={"Buscar por nombre"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearchClienteByNombre}
                                                onChange={this.onChangeSearchClienteNombre}
                                                notFoundContent={null}
                                                component={resultClientNomb}
                                                title="Nombre Cliente"
                                                onDelete={this.onDeleteCliente}
                                                allowDelete={true}
                                                permisions={this.permisions.cli_nomb}
                                            />
                                        </div>
                                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                            <Input 
                                                value={(this.state.nitVenta === null)?'':this.state.nitVenta}
                                                title='Nit'
                                                readOnly={true}
                                                permisions={this.permisions.cli_nit}
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className="cols-lg-1 cols-md-1 cols-sm-3 cols-xs-12"></div>
                                        <div className="cols-lg-2 cols-md-2 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchVehiculoCod}
                                                placeholder={"Buscar por codigo"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.onSearchVehiculoCod}
                                                onChange={this.onChangeSearchVehiculo}
                                                notFoundContent={null}
                                                component={resultVehiculosCod}
                                                title="Cod vehiculo"
                                                onDelete={this.onDeleteVehiculo}
                                                allowDelete={true}
                                                permisions={this.permisions.vehiculo_cod}
                                                configAllowed={this.state.configTaller}
                                            />
                                        </div>
                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchVehiculoCod}
                                                placeholder={"Buscar por placa"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.onSearchVehiculoPlaca}
                                                onChange={this.onChangeSearchVehiculo}
                                                notFoundContent={null}
                                                component={resultVehiculosPlaca}
                                                title="Placa vehiculo"
                                                onDelete={this.onDeleteVehiculo}
                                                allowDelete={true}
                                                permisions={this.permisions.vehiculo_placa}
                                                configAllowed={this.state.configTaller}
                                                //disabled={(this.state.valSearchClieCod == undefined) ? true : false}
                                            />
                                        </div>
                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <Input
                                                title="Descripcion"
                                                value={this.state.vehiculoDescripcion}
                                                permisions={this.permisions.vehiculo_descrp}
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className="cols-lg-1 cols-md-1 cols-sm-3 cols-xs-12"></div>
                                        <div className="cols-lg-2 cols-md-2 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchVendedorCod}
                                                placeholder={"Buscar por id/cod"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearchVendedorByIdCod}
                                                onChange={this.onChangeSearchVendedorIdCod}
                                                notFoundContent={null}
                                                component={resultVendCod}
                                                title="Codigo"
                                                permisions={this.permisions.vend_cod}
                                            />
                                        </div>
                                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" >
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchVendedorFullname}
                                                placeholder={"Buscar por nombre"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearchVendedorByFullName}
                                                onChange={this.onChangeSearchVendedorByFullName}
                                                notFoundContent={null}
                                                component={resultVendNomb}
                                                title="Nombre"
                                                permisions={this.permisions.vend_nomb}
                                            />
                                        </div>
                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <Input
                                                title="Comision"
                                                value={this.state.comisionvendedor}
                                                onChange={this.onChangeComisionVendedor}
                                                permisions={this.permisions.vend_comision}
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3'></div>
                                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                            <CSelect
                                                showSearch={true}
                                                value={this.state.valSearchListaPrecio}
                                                placeholder={"Buscar por descripcion"}
                                                style={{ width: '100%' }}
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearchListaPrecio}
                                                onChange={this.onChangeSearchListaPrecio}
                                                notFoundContent={null}
                                                component={listListaPrecios}
                                                title='Lista Precios'
                                                onDelete={this.onDeleteListaPrecio}
                                                allowDelete={true}
                                                permisions={this.permisions.lista_precios}
                                            />
                                        </div>
                                        <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                            <CSelect
                                                value={this.state.monedaVentaId}
                                                title={"Moneda"}
                                                onChange={this.confirmChangeMoneda.bind(this)}
                                                component={listaMonedas}
                                                permisions={this.permisions.moneda}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{
                                            'border': '1px solid #e8e8e8', 
                                            'marginBottom': '15px', 
                                            //'padding-right' : '10px'
                                        }}>
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                                            style={{
                                                'borderBottom': '1px solid #e8e8e8',
                                                //'padding-right' : '10px'
                                            }}>

                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    //'padding-right' : '10px',
                                                    'width' : '11%',
                                                    'textAlign': 'center',
                                                    
                                                }}>
                                                { columnCodProd }
                                            </div>
                                            <div className="cols-lg-2 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    //'padding-right' : '10px',
                                                    'textAlign': 'center',
                                                }}>
                                                { columnDescProd }
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    //'padding-right' : '10px',
                                                    'textAlign': 'center',
                                                }}>
                                                <label 
                                                    htmlFor="lista" 
                                                    className="label-group-content-nwe"> 
                                                    Unid. Med 
                                                </label>
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    'textAlign': 'center',
                                                    'padding-right' : '10px'
                                                }}>
                                                { columnCantidad }
                                            </div>
                                            <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2"
                                                style={{
                                                    'textAlign': 'center',
                                                    //'padding-right' : '10px'
                                                }}>
                                                { columnListaPrecios }
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    //'padding-right' : '10px',
                                                    'textAlign': 'center',
                                                }}>
                                                { columnPrecioUnit }
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    //'padding-right' : '10px',
                                                    'textAlign': 'center',
                                                }}>
                                                { columnDescuento }
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{
                                                    'textAlign': 'center',
                                                    //'padding-right' : '10px',
                                                    width: '14%'
                                                }}>
                                                <label 
                                                    htmlFor="lista" 
                                                    className="label-group-content-nwe"> 
                                                    Precio Total 
                                                </label>
                                            </div>
                                            <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                style={{ 'padding-right' : '10px'}}>
                                                <div className="input-group-content">
                                                    <C_Button title={<i className="fa fa-plus"></i>}
                                                        type='primary' size='small' style={{padding: 4}}
                                                        onClick={this.addRowDetalle.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            {/*}
                                            <i style={{'position': 'absolute', 'top': '3px', 'right': '14px', 'padding': '4px'}}
                                                className="fa fa-plus btns btns-sm btns-primary" 
                                                onClick={this.addRowDetalle.bind(this)}> 
                                            </i>
                                            */}
                                        </div>

                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                            <div className="caja-content" >
                                                {this.state.valuesSearchProd.map((item, key)=>(
                                                    <div key={key} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'position': 'relative'}}>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'width': '11%',
                                                                'padding-right': '10px',
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <CSelect
                                                                    key={key}
                                                                    showSearch={true}
                                                                    value={this.state.valuesSearchProd[key].id}
                                                                    placeholder={"Id"}
                                                                    style={{ width: '100%' }}
                                                                    defaultActiveFirstOption={false}
                                                                    showArrow={false}
                                                                    filterOption={false}
                                                                    onSearch={this.onSearchProdCod}
                                                                    onChange={this.onChangeSearchProdId.bind(this, key)}
                                                                    notFoundContent={null}
                                                                    component={resultCodIdProds}
                                                                    //title="Codigo Cliente"
                                                                    allowDelete={true}
                                                                    onDelete={this.onDeleteSearchProd.bind(this, key)}
                                                                    permisions={this.permisions.t_prod_cod}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-2 cols-md-4 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <CSelect
                                                                    key={key}
                                                                    showSearch={true}
                                                                    value={this.state.valuesSearchProd[key].descripcion}
                                                                    placeholder={"Buscar..."}
                                                                    style={{ width: '100%' }}
                                                                    defaultActiveFirstOption={false}
                                                                    showArrow={false}
                                                                    filterOption={false}
                                                                    onSearch={this.onSearchProdNom}
                                                                    onChange={this.onChangeSearchProdNom.bind(this, key)}
                                                                    notFoundContent={null}
                                                                    component={resultDescProds}
                                                                    //title="Codigo Cliente"
                                                                    allowDelete={true}
                                                                    onDelete={this.onDeleteSearchProd.bind(this, key)}
                                                                    permisions={this.permisions.t_prod_desc}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <input id={key} type="text"
                                                                    value = {typeof this.state.arrayUnidadVentaAbrev[key] == 'undefined' ? "" :this.state.arrayUnidadVentaAbrev[key] }
                                                                    placeholder="Unidad"
                                                                    className='forms-control'
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <Input
                                                                    value={this.state.arrayCantidadVenta[key]}
                                                                    onChange={this.ventaCantidad.bind(this, key)}
                                                                    permisions={this.permisions.t_cantidad}
                                                                    style={{ textAlign: 'right' }}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="cols-lg-2 cols-md-4 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <CSelect
                                                                    showSearch={true}
                                                                    value={this.state.arrayListaVenta[key]}
                                                                    placeholder={"Buscar por descripcion"}
                                                                    style={{ width: '100%' }}
                                                                    defaultActiveFirstOption={false}
                                                                    showArrow={false}
                                                                    filterOption={false}
                                                                    onSearch={this.handleSearchListaPrecio}
                                                                    onChange={this.ventaLista.bind(this, key)}
                                                                    notFoundContent={null}
                                                                    component={listListaPrecios}
                                                                    title='Lista Precios'
                                                                    //onDelete={this.onDeleteListaPrecio}
                                                                    //allowDelete={true}
                                                                    permisions={this.permisions.t_lista_precios}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <Input
                                                                    value={typeof this.state.arrayPrecioUnit[key] == 'undefined' ? "" :this.state.arrayPrecioUnit[key]}
                                                                    onChange={this.ventaPrecioUnit.bind(this, key)}
                                                                    permisions={this.permisions.t_precio_unitario}
                                                                    readOnly={!this.state.configEditPrecioUnit}
                                                                    style={{ textAlign: 'right' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <Input
                                                                    value={this.state.arrayDescuento[key]}
                                                                    onChange={this.ventaDescuento.bind(this, key)}
                                                                    permisions={this.permisions.t_descuento}
                                                                    style={{ textAlign: 'right' }}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="cols-lg-1 cols-md-3 cols-sm-6 cols-xs-12"
                                                            style={{
                                                                'padding-right' : '10px',
                                                                width: '14%'
                                                            }}>
                                                            <div className="inputs-groups">
                                                                <Input
                                                                    //placeholder="Precio Total"
                                                                    value={ typeof this.state.arrayPrecioTotal[key] == 'undefined' ? "" : this.state.arrayPrecioTotal[key]}
                                                                    readOnly={true}
                                                                    style={{ textAlign: 'right' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                            style={{ 'padding-right' : '10px'}}>
                                                            <div className="input-group-content">
                                                                <C_Button title={<i className="fa fa-remove"></i>}
                                                                    type='danger' size='small' style={{padding: 4, marginLeft:20}}
                                                                    onClick={this.removeRowDetalle.bind(this, key)}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/*}
                                                        <a className="btns btns-sm btns-danger"
                                                                style={{'position': 'absolute', 'top': '5px', 'right': '-10px', 'padding': '4px'}}
                                                                onClick={this.removeRowDetalle.bind(this, key)}>
                                                            <i className="fa fa-remove"></i>
                                                        </a>
                                                        */}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12">
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                            <TextArea 
                                                value={this.state.observacionVenta} 
                                                onChange={this.ventaObservacion.bind(this)}
                                                title='Observaciones'
                                                permisions={this.permisions.observaciones}
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12" style={{'border': '1px solid #e8e8e8'}}>
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                            <Input
                                                title="Sub Total"
                                                value={this.state.subTotalVenta}
                                                readOnly={true}
                                                style={{ textAlign: 'right' }}
                                                permisions={this.permisions.sub_total}
                                            />
                                        </div>
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                            <Input
                                                title="% Desc"
                                                value={this.state.descuentoVenta}
                                                onChange={this.ventaDescuentoTotal.bind(this)}
                                                permisions={this.permisions.descuento}
                                                style={{ textAlign: 'right' }}
                                            />
                                        </div>
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                            <Input
                                                title="% Recargo "
                                                value={this.state.recargoVenta}
                                                onChange={this.ventaRecargoTotal.bind(this)}
                                                permisions={this.permisions.recargo}
                                                style={{ textAlign: 'right' }}
                                            />
                                        </div>
                                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                            <Input
                                                title="Total "
                                                value={this.state.totalVenta}
                                                readOnly={true}
                                                style={{ textAlign: 'right' }}
                                            />
                                        </div>
                                        
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <div className="txts-center">

                                            { btnHistorial }

                                            { btnPartes }

                                            <C_Button
                                                title='Generar'
                                                type='primary'
                                                onClick={this.validarData.bind(this)}
                                            />
                                            <C_Button
                                                title='Cancelar'
                                                type='danger'
                                                onClick={() => this.setState({ modalCancel: true })}
                                            />
                                        </div>
                                    </div>
                                {/*</form>*/}
                            </div>
                        </div>
                    </div>    
                
                    <div className="forms-groups"
                        style={{'marginBottom': '5px',
                            'display': (this.state.mostrarOpcionParteVehiculo === 0)?'none':'block'}}>
                        
                        <CrearParteVehiculo
                            vehiculoParte={this.state.vehiculoParte}
                            cantidad={this.state.cantidadParteVehiculo}
                            estado={this.state.estadoParteVehiculo}
                            observacion={this.state.observacionParteVehiculo}
                            imagen={this.state.imagenParteVehiculo}
                            indice={this.state.indiceParteVehiculo}
                            //vehiculoDelcliente={this.state.vehiculoSeleccionado}
                            vehiculoPlaca={this.state.vehiculoPlaca}
                            vehiculoDescripcion={this.state.vehiculoDescripcion}          
                            cliente={this.state.valSearchClieNombre}

                            callback={this.getResultadoParteVehiculo.bind(this)}
                        />
                    </div>

                    <div className="forms-groups"
                        style={{
                            'marginBottom': '5px',
                            'display': (this.state.mostrarOpcionHistorialVehiculo === 0)?'none':'block'
                            }}>

                        <CrearHistorialVehiculo 
                            fechaActual={this.state.fechaVenta}
                            precio={this.state.totalVenta}
                            //vehiculoDelcliente={this.state.vehiculoSeleccionado}
                            vehiculoPlaca={this.state.vehiculoPlaca}
                            vehiculoDescripcion={this.state.vehiculoDescripcion}             
                            cliente={this.state.valSearchClieNombre}
                            callback={this.getResultadoHistorialVehiculo.bind(this)}
                            nroVenta={this.state.nroVenta}
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