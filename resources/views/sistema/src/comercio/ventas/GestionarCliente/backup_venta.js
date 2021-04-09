
import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';

import { Modal,TreeSelect,message,
     Divider, Alert,
    Select, Checkbox
} from 'antd';
import "antd/dist/antd.css";
import CrearParteVehiculo from "../../taller/GestionarVentaDetalleVehiculo/CrearParteVehiculo";
import ShowCliente from './show';
import CrearCliente from './crear';
import CrearHistorialVehiculo from '../../taller/GestionarVentaDetalleVehiculo/CrearHistorialVehiculo';

import { stringToDate, dateToString, dateToStringB, hourToString, convertYmdToDmy, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';

import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';

import moment from 'moment';
import CSelect from '../../../componentes/select2';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';

import CDatePicker from '../../../componentes/datepicker';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import CreateVendedor from '../Vendedor/crear';
import ShowVendedor from '../Vendedor/show';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const NUMERO_PRODUCTOS = 3;

const CANTIDAD_PRODUCTOS_DEFAULT = 30;
const CANTIDAD_CLIENTES_DEFAULT = 30;
const CANTIDAD_VENDEDORES_DEFAULT = 30;
let dateNow = new Date();
let fehcaIniPago = new Date();
fehcaIniPago.setMonth(fehcaIniPago.getMonth() + 1);
export default class CrearVenta extends Component{

    constructor(props){
        super(props)
        this.state = {
            visibleprint: false,
            idventa: 0,

            addshowvendedor: true,

            newCliente: false,
            newVenta: true,
            newVendedor: false,
            arrayvendedor: [],
            arrayreferencia: [],
            visibleModalVendedor: false,

            aviso: 1,

            clienteSeleccionado: [],
            clienteContactarloSeleccionado: [],

            visibleModalCliente: false,

            vehiculosDelcliente: [],
            vehiculoSeleccionado: [],
            vehiculoDescripcion: '',

            idVehiculoDelCliente: '0',

            tituloPrincipal: 'Registrar Venta',
            mostrarOpcionParteVehiculo: 0,
            mostrarOpcionRegistrarVenta: 1,

            vehiculoParte: [],
            cantidadParteVehiculo: [],
            estadoParteVehiculo: [],
            observacionParteVehiculo: [],
            imagenParteVehiculo: [],
            indiceParteVehiculo: [],
            idsvehiculopartes: [],

            mostrarOpcionHistorialVehiculo: 0,
            fechaActual: '',

            historialVehiculo: {
                fecha: '',
                diagnosticoEntrada: '',
                trabajoHechos: '',
                precio: 0,
                kmActual: '',
                kmProximo: '',
                fechaProxima: '',
                notas: ''
            },

            codigoVenta: "",
            fechaHoy: dateToStringB(dateNow, "/"),
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
            listaVentaDesc: '',

            productoVenta: [],
            productoCodVenta: undefined,
            productoNombreVenta: undefined,
            unidadMedVenta: '',

            arrayCodProVenta: [],
            arrayProductoVenta: [],
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
            arrayItems: [],
            observacionVenta: "",
            visible: false,
            nroVenta: 0,

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
            resultListaPrecios: [],
            resultListaPreciosDefault: [],
            timeoutSearch: undefined,
            valSearchClieCod: undefined,
            valSearchClieNombre: undefined,
            valSearchVendedorCod: undefined,
            valSearchVendedorFullname: undefined,
            valSearchListaPrecio: undefined,
            valuesSearchProd: [],
            vehiculoId: '',
            vehiculoPlaca: '',
            vehiculosCliente: [],

            monedas: [],
            
            anticipo: 0,
            saldoApagar: 0,
            NumeroCuota: 1,
            fechaInicioDePago: dateToString(fehcaIniPago, 'f2'),
            tipoPeriodo: 1,
            listaDeCuotas: [],
            alertModal: false,
            messageAlert: '',
            noSesion: false,
            configCredito: false,
            configVehiculoPartes: false,
            configVehiculoHistorial: false,
            configTaller: false,
            configCodigo: false,
            configEditPrecioUnit: false,
            configTitleVend: '',

            valSearchVehiculoCod: undefined,
            validarCodigo: 1,
            clienteesabogado: 'V',
            cargarProforma: false,

            productos: [],
            vendedores: [],
            ventas: [],
            arrayCheckVenta: [],
            ultimoCheck: -1,
            valSearchCli: undefined,
            resultClientesDefault2: [],
            resultClientes2: [],
            modalCancel: false,
            modalOk: false,
            loadingOk: false,
            type: 'N'
        }

        this.permisions = {
            codigo: readPermisions(keys.venta_input_codigo),
            fecha: readPermisions(keys.venta_fecha),
            sucursal: readPermisions(keys.venta_select_sucursal),
            almacen: readPermisions(keys.venta_select_almacen),
            add_cli: readPermisions(keys.venta_btn_agragarCliente),
            show_cli: readPermisions(keys.venta_btn_verCliente),
            cli_cod: readPermisions(keys.venta_input_search_codigoCliente),
            cli_nomb: readPermisions(keys.venta_input_search_nombreCliente),
            cli_nit: readPermisions(keys.venta_input_search_nitCliente),
            veh_cod_id: readPermisions(keys.venta_select_search_codigoVehiculo),
            veh_placa: readPermisions(keys.venta_select_search_placaVehiculo),
            veh_desc: readPermisions(keys.venta_input_descripcionVehiculo),
            moneda: readPermisions(keys.venta_select_moneda),
            vend_cod: readPermisions(keys.venta_input_search_codigoVendedor),
            vend_nomb: readPermisions(keys.venta_input_search_nombreVendedor),
            vend_comision: readPermisions(keys.venta_input_comisionVendedor),
            lista_precio: readPermisions(keys.venta_select_search_listaPrecios),
            t_prod_cod: readPermisions(keys.venta_tabla_columna_codigoProducto),
            t_prod_desc: readPermisions(keys.venta_tabla_columna_producto),
            t_cantidad: readPermisions(keys.venta_tabla_columna_cantidad),
            t_lista_precios: readPermisions(keys.venta_tabla_columna_listaPrecio),
            t_precio_unit: readPermisions(keys.venta_tabla_columna_precioUnitario),
            t_descuento: readPermisions(keys.venta_tabla_columna_descuento),
            observaciones: readPermisions(keys.venta_textarea_observaciones),
            recargo: readPermisions(keys.venta_input_recargo),
            descuento: readPermisions(keys.venta_input_descuento),
            btn_historial_veh: readPermisions(keys.venta_btn_historialVehiculo),
            btn_partes_veh: readPermisions(keys.venta_btn_partesVehiculo),
            anticipo: readPermisions(keys.venta_input_anticipo),
            sub_total: readPermisions(keys.venta_input_subTotal),
            btn_cargar_proforma: readPermisions(keys.venta_btn_cargar_proforma)
        }

        this.onChangeSearchClienteCod = this.onChangeSearchClienteCod.bind(this);
        this.handleSearchClienteByIdCod = this.handleSearchClienteByIdCod.bind(this);
        this.handleSearchClienteByNombre = this.handleSearchClienteByNombre.bind(this);
        this.onChangeSearchClienteNombre = this.onChangeSearchClienteNombre.bind(this);
        this.handleSearchVendedorByIdCod = this.handleSearchVendedorByIdCod.bind(this);
        this.onChangeSearchVendedorIdCod = this.onChangeSearchVendedorIdCod.bind(this);
        this.onChangeSearchVendedorByFullName = this.onChangeSearchVendedorByFullName.bind(this);
        this.handleSearchVendedorByFullName = this.handleSearchVendedorByFullName.bind(this);
        this.handleSearchListaPrecio = this.handleSearchListaPrecio.bind(this);
        this.onChangeSearchListaPrecio = this.onChangeSearchListaPrecio.bind(this);
        this.onSearchProdNom = this.onSearchProdNom.bind(this);
        this.onSearchProdCod = this.onSearchProdCod.bind(this);
        this.onChangeSearchProdId = this.onChangeSearchProdId.bind(this);
        this.onChangeSearchProdNom = this.onChangeSearchProdNom.bind(this);
        this.confirmChangeAlmacen = this.confirmChangeAlmacen.bind(this);
        this.confirmChangeMoneda = this.confirmChangeMoneda.bind(this);
        this.confirmChangeSucursal = this.confirmChangeSucursal.bind(this);
        this.ventaAlmacen = this.ventaAlmacen.bind(this);
        this.ventaSucursal = this.ventaSucursal.bind(this);
        this.ventaMoneda = this.ventaMoneda.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.onChangeComisionVendedor = this.onChangeComisionVendedor.bind(this);
        this.onSearchVehiculoCod = this.onSearchVehiculoCod.bind(this);
        this.onSearchVehiculoPlaca = this.onSearchVehiculoPlaca.bind(this);
        this.searchVehiculoByCod = this.searchVehiculoByCod.bind(this);
        this.searchVehiculoByPlaca = this.searchVehiculoByPlaca.bind(this);
        this.onChangeSearchVehiculo = this.onChangeSearchVehiculo.bind(this);
        this.onDeleteVehiculo = this.onDeleteVehiculo.bind(this);
        this.onDeleteVendedor = this.onDeleteVendedor.bind(this);
        this.onDeleteListaPrecio = this.onDeleteListaPrecio.bind(this);
        this.searchCliente = this.searchCliente.bind(this);
        this.onSearchCliente = this.onSearchCliente.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.seleccionarVenta = this.seleccionarVenta.bind(this);
        this.sinSeleccionarVenta = this.sinSeleccionarVenta.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        this.validarData = this.validarData.bind(this);
    }

    validarData(type) {
        if (!this.validarDatos()) return;
        if (!this.validarCuotas()) return;
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

    onDeleteListaPrecio() {
        this.ClearDetalle();
    }

    onDeleteVendedor() {
        this.setState({
            valSearchVendedorCod: undefined,
            valSearchVendedorFullname: undefined,
            comisionvendedor: '',
            addshowvendedor: true,
        })
    }

    onDeleteSearchProd(index) {
        
        this.state.valuesSearchProd[index].id = undefined;
        this.state.valuesSearchProd[index].descripcion = undefined;
        this.state.arrayUnidadVentaAbrev[index] = '';
        this.state.arrayCantidadVenta[index] = 1;
        this.state.arrayPrecioUnit[index] = '';
        this.state.arrayDescuento[index] = 0;
        this.state.arrayPrecioTotal[index] = '';
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayDescuento: this.state.arrayDescuento,
            arrayPrecioTotal: this.state.arrayPrecioTotal
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

    onDeleteVehiculo() {
        this.setState({
            valSearchVehiculoCod: undefined,
            vehiculoDescripcion: '',
            resultVehiculos: this.state.resultVehiculosDefault
        })
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
 
    onChangeComisionVendedor(value) {
        
        if (isNaN(value)) return;
        
        this.setState({
            comisionvendedor: value
        });
    }

    getCliente(){

        httpRequest('get', ws.wscliente).
        then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.setState({
                clienteVenta: result,
            })

        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    
    actualizarListaPrecio(idlistaprecio) {
        let length = this.state.valuesSearchProd.length;
        for (let i = 0; i < length; i++) {
            this.state.arrayListaVenta[i] = idlistaprecio;
            //this.state.arrayListaVenta[i] = descripcion;
        }
        this.setState({
            arrayListaVenta: this.state.arrayListaVenta,
        });
    }

    getListaPrecios(idmoneda) {
        httpRequest('post', ws.wsgetlistasactivas, {
            idmoneda: idmoneda
        })
        .then((result) => {
            if (result.response === 1 && result.data.length > 0) {
                this.setState({
                    valSearchListaPrecio: result.data[0].idlistaprecio,
                    resultListaPrecios: result.data,
                    resultListaPreciosDefault: result.data,
                    //listaVenta: result.data,
                },
                    () => this.actualizarListaPrecio(result.data[0].idlistaprecio)
                //() => this.actualizarListaPrecio(this.state.monedaVentaId)
                );
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.data.length === 0) {
                message.error('No existe un alista de precio')
            } else {
                //
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })

    }

    ClearDetalle() {

        for (let i = 0; i < this.state.valuesSearchProd.length; i++) {
            this.state.arrayPrecioUnit[i] = "";
            this.state.arrayPrecioTotal[i] = "";
            this.state.arrayCantidadVenta[i] = 1;
            this.state.arrayTipoPoS[i] = "";//
            this.state.arrayUnidadVentaAbrev[i] = "";//
            this.state.arrayDescuento[i] = 0;
            this.state.arrayIdAlmacenProdDetalle[i] = "";
            this.state.valuesSearchProd[i] = {id : undefined, descripcion: undefined, valido: true};
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
            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayListaVenta: this.state.arrayListaVenta,
            resultListaPrecios: [],
            resultListaPreciosDefault: [],
            valSearchListaPrecio: undefined,
        });
        
    }

    getComision(fkidcomision){
        var body = {
            "fkidcomisionventa":fkidcomision
        };
        httpRequest('post', ws.wstraercomisionvend,body)
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    comisionvendedor: result.data[0].valor,
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
                descripcion: undefined,
                valido: true 
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

    componentDidMount() {
        this.preparandoDatos();
        this.createVenta();
        /*
        //this.getNorVenta();
        */
    }

    createVenta() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wscreateventa)
        .then((result) => {
            if (result.response == 1) {
                let configCli = result.configscliente;
                let idmoneda = result.monedas.length > 0 ? result.monedas[0].idmoneda : '';
                this.getListaPrecios(idmoneda);

                let idsucursal = result.sucursales.length > 0 ? result.sucursales[0].idsucursal : '';
                
                this.setState({
                    configCodigo: configCli.codigospropios,
                    configEditPrecioUnit: configCli.editprecunitenventa,
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                    clienteesabogado: (configCli.clienteesabogado == true) ? 'A' : 'V',
                    resultClientes: result.clientes,
                    resultClientesDefault: result.clientes,
                    resultVendedores: result.vendedores,
                    resultVendedoresDefault: result.vendedores,
                    monedas: result.monedas,
                    monedaVentaId: idmoneda,
                    almacenVenta: result.almacenes,
                    sucursalVenta: result.sucursales,
                    sucursalVentaId: idsucursal,
                    tipoContaCredito: result.tiposcontacredito,
                    configCredito: result.configsfabrica.comventasventaalcredito,
                    configTaller: result.configsfabrica.comtaller,
                    configVehiculoHistorial: result.configsfabrica.comtallervehiculohistoria,
                    configVehiculoPartes: result.configsfabrica.comtallervehiculoparte,
                },
                    () => {
                        this.actualizarAlmacen(idsucursal);
                    }
                )
            } else if (result.response == -2) {
                this.setState({
                    noSesion: true
                })
            } else {
                console.log('Ocurrio un problema al obtener los datos');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getNorVenta() {
        httpRequest('get', ws.wsgetnroventa)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                   nroVenta: result.nro_venta 
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

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodventavalido + '/' + value)
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
        let unidadMedida = '';
        
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                idunidadm = array[i].fkidunidadmedida;
                tipo = array[i].tipo;
                unidadMedida = array[i].abreviacion;
                break;
            }
        }
        
        if (tipo == 'P') {
            this.validarStock(this.state.almacenVentaId, value, this.state.arrayCantidadVenta[index], index);
        } else {
            this.state.arrayCantidadVenta[index] = 1;
        }
        //let idlistaprecio = this.getIdListaPrecio(this.state.arrayListaVenta[index]);
        this.getTraerPrecio(value, index);
        //this.getNombreUnidadMedida(idunidadm, index);
        this.state.arrayUnidadVentaAbrev[index] = unidadMedida;
        this.getAlmacenProd(value, index);
        this.state.arrayTipoPoS[index] = tipo;
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayCantidadVenta: this.state.arrayCantidadVenta
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

    onChangeSearchProdNom(index, value) {
        if (this.isProductoSelecct(value)) {
            message.warning('El producto ya fue seleccionado');
            return;
        }
        let array = this.state.resultProductos;
        let descripcion = 'No existe el producto';
        let idunidadm = 0;
        let tipo = '';
        let unidadMedida = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto == value) {
                descripcion = array[i].descripcion;
                idunidadm = array[i].fkidunidadmedida;
                tipo = array[i].tipo;
                //unidadMedida = array[i].descripcionUnidad;
                unidadMedida = array[i].abreviacion;
                break;
            }
        }

        if (tipo == 'P') {
            this.validarStock(this.state.almacenVentaId, value, this.state.arrayCantidadVenta[index], index);
        } else {
            this.state.arrayCantidadVenta[index] = 1;
        }
        //let idlistaprecio = this.getIdListaPrecio(this.state.arrayListaVenta[index]);
        this.getTraerPrecio(value, index);
        //this.getNombreUnidadMedida(idunidadm, index);
        this.state.arrayUnidadVentaAbrev[index] = unidadMedida;
        this.getAlmacenProd(value, index);
        this.state.arrayTipoPoS[index] = tipo;
        this.state.valuesSearchProd[index].id = value;
        this.state.valuesSearchProd[index].descripcion = descripcion;
        this.setState({
            valuesSearchProd: this.state.valuesSearchProd,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayCantidadVenta: this.state.arrayCantidadVenta
        });
    }

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
                    console.log('Ocurrio un problema en el servidor');
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
            fkidcomisionventa: idcomision,
            addshowvendedor: false,
        });
    }

    searchVendedorByFullName(value) {

        if (value.length > 0) {
            httpRequest('get', ws.wssearchvendedorfullname + '/' + value)
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
            fkidcomisionventa: idcomision,
            addshowvendedor: false,
        });
    }

    searchProductoByCodId(value) {
        
        if (value.length > 0 && this.state.almacenVentaId != '') {
            let body = { value: value, idalmacen: this.state.almacenVentaId};
            httpRequest('post', ws.wssearchprodidalm, body)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultProductos: result.data
                    });
                } else {
                    message.error('Ocurrio un problema con la busqueda');
                    this.setState({
                        resultProductos: this.state.resultProductosDefault
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
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
                if (result.response == 1) {
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
                message.error(strings.message_error);
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

        //let idlistaprecio = this.getIdListaPrecio(value);
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
        })
        //this.ClearDetalle();
    }

    ventaFecha(dateString){
        var fechaActual = new Date();
        var fecha = stringToDate(dateString, 'f2');
        fechaActual.setDate(fechaActual.getDate() - 1);
        if(fecha.getTime() < fechaActual.getTime()){
            message.error("Fecha Invalida");
        }else{
            this.setState({
                fechaVenta: dateString
            })
        }

    }

    confirmChangeMoneda(value) {
        //const value = value;
        const ventaMoneda = this.ventaMoneda;
        Modal.confirm({
            title: 'Cambiar de Moneda',
            content: 'Al cambiar de moneda se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              ventaMoneda(value);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    ventaMoneda(value) {

        this.ClearDetalle();
        this.setState({
            monedaVentaId: value,
        });
        //this.actualizarListaPrecio(value);
    }

    confirmChangeSucursal(value) {
        const ventaSucursal = this.ventaSucursal;
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
        this.state.almacenVentaSucursal.splice(0,this.state.almacenVentaSucursal.length);
        this.setState({
            sucursalVentaId: value
        })
        this.ClearDetalle();
        this.actualizarAlmacen(value);
    }

    actualizarAlmacen(idsucursal) {

        let idalmacen = '';
        let arr = [];
        for (let i = 0; i < this.state.almacenVenta.length ; i++) {
            if (this.state.almacenVenta[i].fkidsucursal == idsucursal) {
                arr.push(this.state.almacenVenta[i]);
                idalmacen = this.state.almacenVenta[0].idalmacen;
            }
        }

        this.setState({
            almacenVentaSucursal: arr,
            almacenVentaId: idalmacen
        });

        this.getProductos(idalmacen);
        return idalmacen;
    }

    confirmChangeAlmacen(value) {

        const ventaAlmacen = this.ventaAlmacen;
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

    ventaAlmacen(value){
        this.setState({
            almacenVentaId: value
        })
        this.ClearDetalle();
        this.getProductos(value);
    }

    getVehiculoDelCliente(idCliente) {

        httpRequest('get', ws.wsgetvehiculo, {
            id: idCliente
        })
        .then((result) => {
            if (result.response == 1 && result.data.length > 0) {
                let vehiculo = result.data[0];
                let codvehiculo = this.state.configCodigo ? vehiculo.codvehiculo  :vehiculo.idvehiculo;
                this.setState({
                    vehiculoId: vehiculo.idvehiculo + ' ' + codvehiculo,
                    valSearchVehiculoCod: vehiculo.idvehiculo,
                    vehiculoPlaca: vehiculo.placa,
                    vehiculoDescripcion: vehiculo.vehiculotipo,
                    vehiculosCliente: result.data,
                    resultVehiculos: result.data,
                    resultVehiculosDefault: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculoId: '',
                    vehiculoPlaca: '',
                    vehiculoDescripcion: '',
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
                vehiculoDescripcion: '',
                valSearchVehiculoCod: undefined,
                vehiculosCliente: [],
                resultVehiculos: []
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

    ventaProducto(value){

        var array = String(value).split(" ");
        var indexArray = array.length-1;
        var index = parseInt(array[indexArray]);
        this.state.arrayCodProVenta[index] = array[0];
        this.setState({
            arrayCodProVenta: this.state.arrayCodProVenta
        });

        for (let i = 0; i < this.state.productoVenta.length; i++) {
            if (this.state.productoVenta[i].idproducto == array[0]) {
                this.state.arrayProductoVenta[index] = this.state.productoVenta[i].descripcion;//
                this.state.arrayIdAlmacenProdDetalle[index] = this.state.productoVenta[i].idalmacenproddetalle;
                this.getNombreUnidadMedida(this.state.productoVenta[i].fkidunidadmedida,index);
                this.state.arrayTipoPoS[index] = this.state.productoVenta[i].tipo;
                this.setState({
                    arrayIdAlmacenProdDetalle:this.state.arrayIdAlmacenProdDetalle,
                    arrayProductoVenta:this.state.arrayProductoVenta,
                    arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                    arrayTipoPoS:this.state.arrayTipoPoS
                });
                break;
            }
        }

        if (this.state.arrayTipoPoS[index] == "P") {
            this.validarStock(this.state.almacenVentaId, this.state.arrayCodProVenta[index], 
                this.state.arrayCantidadVenta[index]);
        }
        this.getTraerPrecio(this.state.arrayCodProVenta[index], index);

    }

    ventaCantidad(index, value){

        if (isNaN(value) || value < 0 || this.state.arrayTipoPoS[index] == 'S' ) return;
        value = parseInt(value);
        if (this.state.valuesSearchProd[index].id != undefined) {
            if (value > 0) {
                
                this.state.arrayCantidadVenta[index] = value;
                this.setState({
                    arrayCantidadVenta: this.state.arrayCantidadVenta
                })
                if (this.state.arrayTipoPoS[index] == "P") {
                    this.validarStock(this.state.almacenVentaId, this.state.valuesSearchProd[index].id, value, index);
                }
            } else if (value < 0) {
                message.warning("Cantidad Igual o Mayor a 1 Por favor");
            } else {
                this.state.arrayCantidadVenta[index] = "";
                this.setState({
                    arrayCantidadVenta: this.state.arrayCantidadVenta
                })
            }
        } else  {
            message.warning("Por Favor Seleccion un Producto");
        }
    }

    validarAllStocks(idalmacen) {
        let data = this.state.valuesSearchProd;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let cantidad = this.state.arrayCantidadVenta[i];
            this.validarStock(idalmacen, data[i].id, cantidad, i);
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
                    for (let i = 0; i < result.data.length ; i++) {
                        stockSuma = stockSuma + result.data[i].stock
                    }

                    if (parseInt(stockSuma) < parseInt(valor)) {

                        this.state.arrayCantidadVenta[index] = 0;
                        this.setState({
                            arrayCantidadVenta: this.state.arrayCantidadVenta
                        });
                        message.warning("No existe la cantidad requerida del producto");
                        /*
                        this.state.arrayCantidadVenta[index] = valor;
                        //this.state.arrayCantidadVenta[index] = 1;

                        this.setState({
                            arrayCantidadVenta: this.state.arrayCantidadVenta
                        });
                        */
                    }/* else {
                        this.state.arrayCantidadVenta[index] = 0;
                        this.setState({
                            arrayCantidadVenta: this.state.arrayCantidadVenta
                        });
                        message.error("Stock Agotado");
                    }*/
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    this.state.arrayCantidadVenta[index] = 0;
                    this.setState({
                        arrayCantidadVenta: this.state.arrayCantidadVenta
                    });
                    message.error("No existe Producto en un almacen");
                }

            } else {
                message.error("Error Del Servidor");
            }
            this.CalculoPrecioTotal(index);
            this.calculoSubTotal();
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getTraerPrecio(idProducto, posicion) {
        var body = {
            idproducto: parseInt(idProducto),
            idlistaprecio: this.state.arrayListaVenta[posicion]
        };

        httpRequest('post', ws.wsgetprecioprod, body)
        .then(result => {
            if (result.response == 1) {
                if (result.data.length == 1) {
                    this.state.arrayPrecioUnit[posicion] = result.data[0].precio;
                    this.state.arrayListaPreProdDetalle[posicion] = result.data[0].idlistapreproducdetalle;
                    this.state.valuesSearchProd[posicion].valido = true;
                    this.setState({
                        arrayPrecioUnit: this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle: this.state.arrayListaPreProdDetalle,
                        valuesSearchProd: this.state.valuesSearchProd
                    });
                } else {
                    this.state.arrayPrecioUnit[posicion] = 0;
                    this.state.arrayListaPreProdDetalle[posicion] = 0;
                    this.state.valuesSearchProd[posicion].valido = false;
                    this.setState({
                        arrayPrecioUnit: this.state.arrayPrecioUnit,
                        arrayListaPreProdDetalle: this.state.arrayListaPreProdDetalle,
                        valuesSearchProd: this.state.valuesSearchProd
                    });
                    message.warning("El producto no se encuentra en la lista de precios seleccionada");
                    //return false;
                }
                this.CalculoPrecioTotal(posicion);
                this.calculoSubTotal();
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('No se pudo obenet el precio del producto');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    ventaLista(index, value) {
        if (this.state.valuesSearchProd[index].id == undefined) {
            message.warning('Debe elegir un producto');
            return;
        }
        //let idlistaprecio = this.getIdListaPrecio(value);
        this.state.arrayListaVenta[index] = value;
        
        this.setState({
            arrayListaVenta: this.state.arrayListaVenta,
        });
        
        this.getTraerPrecio(this.state.valuesSearchProd[index].id, index);
        
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

    ventaPrecioUnit(index, value){
        //let index = e.target.id
        
        if (isNaN(value) || value < 0) return;
        
        if (this.state.valuesSearchProd[index].id != undefined) {
            if (value >= 0) {
                this.state.arrayPrecioUnit[index] = value;
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
            message.warning("Por favor seleccione un Producto");
        }
    }

    ventaDescuento(index, value){

        if (isNaN(value) || value < 0) return;
        //let valor = parseFloat(value)
        if (this.state.valuesSearchProd[index].id != undefined) {
            if ( value >= 0 && value <= 100) {
                this.state.arrayDescuento[index] = value;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                });
            } else {
                this.state.arrayDescuento[index] = 0;
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                })
                message.warning("Descuento tiene que ser Mayor e Igual a 0 y menor o igual que 100");
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
        let prec = isNaN(PrecioUnidad) ? 0 : PrecioUnidad;
        let desc = isNaN(Descuento) ? 0 : Descuento;
        let cant = isNaN(cantidad) ? 0 : cantidad;
        let precioTotal = ((prec - (prec * desc) / 100) * cant);
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
        subTotal = subTotal.toFixed(2);
        this.setState({
            subTotalVenta: subTotal
        },
            () => this.calculoTotal()
        );
    }

    ventaDescuentoTotal(value){
        
        if(value >= 0 && value <= 100){
            this.setState({
                descuentoVenta: value
            },
                () => this.calculoTotal()
            );
        }
    }
    
    ventaRecargoTotal(value){
        
        if(value >= 0 && value <= 100){
            this.setState({
                recargoVenta: value
            },
                () => this.calculoTotal() 
            );
        }

    }
    calculoTotal() {

        let descuento = (this.state.descuentoVenta * parseFloat(this.state.subTotalVenta)) / 100;
        let recargo = (this.state.recargoVenta * parseFloat(this.state.subTotalVenta)) / 100;
        let total = parseFloat(this.state.subTotalVenta) - descuento;
        total = total + recargo;
        this.setState({
            totalVenta: total.toFixed(2),
            saldoApagar: total.toFixed(2),
        });
    }

    ventaObservacion(value) {
        this.setState({
            observacionVenta: value
        })
    }

    validarDatos() {

        if ((this.state.configCodigo && this.state.codigoVenta.length === 0) || this.state.validarCodigo == 0) {
            message.error('El codigo es requerido');
            return false;
        }
        if (this.state.valSearchClieCod == undefined) {
            message.error('Debe seleccionar un cliente');
            return false;
        }
        if (this.state.valSearchVendedorCod == undefined) {
            message.error('Debe seleccionar un' + this.state.configTitleVend);
            return false;
        }

        if (this.state.valuesSearchProd.length === 0) {
            message.error('Debe seleccionar un Producto por lo menos');
            return false;
        }
        
        let b = false;
        for (let i = 0; i < this.state.valuesSearchProd.length; i++) {
            if (this.state.valuesSearchProd[i].id != undefined && this.state.arrayPrecioUnit[i] <= 0) {
                message.error('No puede comprar un producto con precio cero');
                return false;
            }
            if (this.state.valuesSearchProd[i].id != undefined) {
                b = true;
            }

            if (this.state.valuesSearchProd[i].id != undefined && !this.state.valuesSearchProd[i].valido) {
                message.error('Todos los productos deben estar en almenos una lista de precios');
                return false;
            }
        }

        if (!b) {
            message.error('Debe seleccionar un Producto por lo menos');
            return false;
        }

        let data = this.state.arrayCantidadVenta;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i] == 0 || data[i] == "") {
                message.error('Un producto o puede quedar con cantidad 0');
                return false;
            }
        }

        return true;
    }

    validarCuotas() {
        let array = this.state.listaDeCuotas;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].montoPagar == '' || parseFloat(array[i].montoPagar) == 0) {
                this.setState({
                    alertModal: true,
                    messageAlert: 'No debe haber cuotas en cero'
                });
                return false;
            }
        }
        this.setState({
            alertModal: false
        });
        return true;
    }

    pagar() {
        if (!this.validarDatos()) return;
        if (this.state.configCredito) {
            this.setState({
                visible: true
            })
        } else {
            //this.showConfirmStore('contado');
            this.validarData('contado');
        }
        
    }

    handleCancel(){
        this.setState({
            visible:!this.state.visible
        })
    }

    handleCancelcredito(){
        this.setState({
            visibleCredito: false
        })
    }

  
    guardarVenta(condicion){
       
        if(String(this.state.fechaVenta).length > 0  && String(this.state.comisionvendedor).length > 0
            && String(this.state.idusuario).length > 0 && String(this.state.estado).length > 0 && String(this.state.estadoProceso).length > 0
            && String(this.state.sucursalVentaId).length > 0 && String(this.state.valSearchClieCod).length > 0 && String(this.state.valSearchVendedorCod).length > 0
            && String(this.state.fkidtipocontacredito).length > 0 && String(this.state.fkidtipotransacventa).length > 0){

            var hora = new Date();
            var ventadetalle = [];
            var idsProductos = [];
            for (let i = 0;i < this.state.valuesSearchProd.length ; i++) {

                if (parseInt(this.state.arrayPrecioUnit[i]) !== 0 && !isNaN(this.state.arrayPrecioUnit[i]) &&
                    this.state.valuesSearchProd[i].id != undefined) {
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

            let body = {
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
                idmoneda: this.state.monedaVentaId,
                //fkidvehiculo: arr[0],
                fkidvehiculo: this.state.valSearchVehiculoCod == undefined ? null : this.state.valSearchVehiculoCod,
                fkidtipocontacredito: condicion == 'contado' ? 1 : 2,
                fkidtipotransacventa: 1,
                hora: hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
                comision: parseFloat(this.state.comisionvendedor),
                arrayidproducto: JSON.stringify(idsProductos),
                arraycantidad: JSON.stringify(this.state.arrayCantidadVenta),
                arraypreciounit: JSON.stringify(this.state.arrayPrecioUnit),
                arraydescuento: JSON.stringify(this.state.arrayDescuento) ,
                //arrayIdAlmacenProdDetalle: JSON.stringify(this.state.arrayIdAlmacenProdDetalle),
                arrayListaPreProdDetalle: JSON.stringify(this.state.arrayListaPreProdDetalle),
                arrayventadetalle: JSON.stringify(ventadetalle),
                condicion: condicion,
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

            if (condicion == 'credito') {
                var sumaPlan = 0;
                let sum = 0;
                for (let i = 0; i < this.state.listaDeCuotas.length; i++) {
                    sumaPlan = sumaPlan + parseFloat(this.state.listaDeCuotas[i].montoPagar);
                }
                let diferencia = sumaPlan > this.state.saldoApagar ? sumaPlan - this.state.saldoApagar : this.state.saldoApagar - sumaPlan;
                if (diferencia < 1) {
                    body.planPago = JSON.stringify(this.state.listaDeCuotas);
                    body.anticipo = parseFloat(this.state.anticipo);
                    body.estadoProceso = 'F';
                    body.estadoPlan = 'I';
                    body.fkidtipocontacredito = 2;
                    message.success("Plan de Pago Correcto")
                } else {
                    message.error("plan de Pago Incorrecto")
                }
                
            }
            httpRequest('post', ws.wsventa, body)
            .then(result => {
                if (result.response == 1) {
                    this.setState({
                        visible: false,
                        idventa: result.idventa,
                        loadingOk: false,
                        modalOk: false
                    })
                    setTimeout(() => {
                        this.setState({
                            visibleprint: true,
                        });
                    }, 400);

                    message.success("se inserto correctamente");
                } else if (result.response == -2) {
                    this.setState({ noSesion: true, modalOk: false, loadingOk: false })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                    this.setState({
                        modalOk: false,
                        loadingOk: false
                    })
                }
            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
                this.setState({
                    modalOk: false,
                    loadingOk: false
                })
            })
        } else {
            message.warning("datos tienen que estar llenos")
            this.setState({
                modalOk: false,
                loadingOk: false
            })
        }

    }

    pagarCredito(){
        this.setState({
            visible: false,
            visibleCredito: !this.state.visibleCredito
        })
    }

    modificarFechaPlan(index, dateString){
        
        var fechaModi = stringToDate(dateString, 'f2');
        var fechaVenta = stringToDate(this.state.fechaVenta, 'f2');
        
        if (fechaModi.getTime() >= fechaVenta.getTime()) {
            this.state.listaDeCuotas[index].FechaApagar = dateString;
            this.state.listaDeCuotas[index].fechastore = convertDmyToYmd(dateString);
            this.setState({
                listaDeCuotas: this.state.listaDeCuotas
            });
        } else{
            
        }

    }

    modificarMonto(index, value) {
        
       if (value < 0) return;
        let monto = value;
        let saldoAnterior = index == 0 ? this.state.saldo : this.state.listaDeCuotas[index-1].saldo;
        this.state.listaDeCuotas[index].montoPagar = monto == 0 ? '' : monto;
        let montoAnterior = this.state.listaDeCuotas[index-1].montoPagar;
        let auxSaldo = parseFloat(saldoAnterior) - parseFloat(monto);
        if (auxSaldo < 0) {
            message.warning('Numero no valido, el saldo da negativo');
            return;
        }
        let valorDefault = index == 0 ? this.state.listaDeCuotas[index+1].montoPagar : this.state.listaDeCuotas[index-1].montoPagar;
        this.state.listaDeCuotas[index].saldo = auxSaldo.toFixed(2);
        let porcion = (parseFloat(valorDefault) - parseFloat(monto)) / (this.state.listaDeCuotas.length - index - 1);
        let length = this.state.listaDeCuotas.length;
        for (let i = index+1; i < length ; i++) {
            let montoPagarActual = parseFloat(valorDefault) + porcion;
            let saldoAnterior = parseFloat(this.state.listaDeCuotas[i-1].saldo);
            if (montoPagarActual > saldoAnterior || montoPagarActual < 0) {
                montoPagarActual = saldoAnterior;
            }
            this.state.listaDeCuotas[i].montoPagar = montoPagarActual.toFixed(2);
            let saldo = saldoAnterior - montoPagarActual;
            this.state.listaDeCuotas[i].saldo = saldo.toFixed(2);
        }

        var index = this.state.listaDeCuotas.length-1;
        var val = parseFloat(this.state.listaDeCuotas[index].montoPagar);
        var saldo = parseFloat(this.state.listaDeCuotas[index].saldo);
        if (saldo != 0 && saldo > 0) {
            var result = val + saldo;
            this.state.listaDeCuotas[index].montoPagar = result.toFixed(2); 
            this.state.listaDeCuotas[index].saldo = 0; 
        }
        this.setState({
            listaDeCuotas: this.state.listaDeCuotas
        })
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
            saldoApagar: saldo.toFixed(2)
        })
    }

    anticipoPago(value){
        var valor = value;
        if(valor == ''){
            this.setState({
                anticipo: value
            })
        } else if(valor < 0) {

            message.error("No Puede Ingresar Numeros Negativos")
            this.setState({
                anticipo:0
            })
        } else {
            this.setState({
                anticipo: value
            })
        }

        this.saldoPagar(value)
    }

    numeroCuotaPlan(value){
        
        if (value < 0) return;
        this.setState({
            NumeroCuota: value,

        })

    }

    calculoDePlanPago(){

        let arr = [];
        let sum = 0;
        let fechaPiv = stringToDate(this.state.fechaInicioDePago, 'f2');
        var i;
        for (i = 0 ; i < this.state.NumeroCuota - 1 ; i++){
            var fecha = stringToDate(this.state.fechaInicioDePago, 'f2');
            fecha.setDate(fecha.getDate()+(parseInt(this.state.tipoPeriodo) * i));
            var fechaAmostrar = dateToString(fecha, 'f2');

            let cuota = (this.state.saldoApagar/this.state.NumeroCuota).toFixed(2);
            sum = sum + parseFloat(cuota);
            let cuotas = {
                Nro: i+1,
                descripcion: "Cuota Nro."+" "+(i+1),
                FechaApagar: fechaAmostrar,
                fechastore: dateToString(fecha),
                montoPagar: cuota,
                saldo: (this.state.saldoApagar-((this.state.saldoApagar/this.state.NumeroCuota)*(i+1))).toFixed(2)
            }
            arr.push(cuotas);
        }
        let ultimaCuota = (this.state.saldoApagar - sum).toFixed(2);
        fechaPiv.setDate(fechaPiv.getDate()+(parseInt(this.state.tipoPeriodo) * i));
        arr.push({
            Nro: i + 1,
            descripcion: "Cuota Nro." + " " + (i+1),
            FechaApagar: dateToString(fechaPiv, 'f2'),
            fechastore: dateToString(fechaPiv),
            montoPagar: ultimaCuota,
            saldo: 0
        });
        arr[i-1].saldo = ultimaCuota;
        this.setState({
            listaDeCuotas: arr
        })
    }

    generarPlanPago() {
        if (this.state.fechaInicioDePago == '') {
            this.setState({ 
                alertModal: true,
                messageAlert: 'Debe seleccionar la fecha'
            });
            return;
        } else {
            this.setState({ alertModal: false });
            this.calculoDePlanPago();
        }
        
    }

    fechaPagoInicio(dateString){

        this.setState({
            fechaInicioDePago: dateString
        })
    }

    tipoPeriodo(value){
        this.setState({
            tipoPeriodo: value
        })
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

        if (this.state.listaDeCuotas.length > 0) {
            return(
                <div className="forms-groups">
                    <div className="txts-center">
                        <div className="cols-lg-3 cols-md-3">

                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <C_Button
                                title={'Guardar'}
                                type='primary'
                                onClick={this.validarData.bind(this, 'credito')}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <C_Button
                                title={'Cancelar'}
                                type='danger'
                                onClick={this.showConfirmCancelarPlanCredito.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
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
                1
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
            arrayIdAlmacenProdDetalle: [
                ...this.state.arrayIdAlmacenProdDetalle,
                ''
            ],
            valuesSearchProd: [
                ...this.state.valuesSearchProd,
                { id: undefined, descripcion: undefined, valido: true }
            ],
            arrayListaPreProdDetalle: [
                ...this.state.arrayListaPreProdDetalle,
                ''
            ],
            arrayListaVenta: [
                ...this.state.arrayListaVenta,
                this.state.valSearchListaPrecio
            ]
        });
    }

    removeRowDetalle(i) {
        
        this.state.arrayPrecioUnit.splice(i,1)
        this.state.arrayPrecioTotal.splice(i,1)
        this.state.arrayCantidadVenta.splice(i,1)
        this.state.arrayTipoPoS.splice(i,1)
        this.state.arrayUnidadVentaAbrev.splice(i,1)
        this.state.arrayDescuento.splice(i,1)
        this.state.arrayIdAlmacenProdDetalle.splice(i,1)
        this.state.valuesSearchProd.splice(i, 1);
        this.state.arrayListaPreProdDetalle.splice(i,1)
        this.state.arrayListaVenta.splice(i,1)
        this.setState({
            arrayPrecioUnit: this.state.arrayPrecioUnit,
            arrayPrecioTotal: this.state.arrayPrecioTotal,
            arrayCantidadVenta: this.state.arrayCantidadVenta,
            arrayTipoPoS: this.state.arrayTipoPoS,
            arrayUnidadVentaAbrev: this.state.arrayUnidadVentaAbrev,
            arrayDescuento: this.state.arrayDescuento,
            arrayIdAlmacenProdDetalle: this.state.arrayIdAlmacenProdDetalle,
            valuesSearchProd: this.state.valuesSearchProd,
            arrayListaVenta: this.state.arrayListaVenta,
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
        let arr = value.split(' ');
        for (let i = 0; i < length; i++) {
            if (array[i].idvehiculo == arr[0]) {
                placa = array[i].placa;
                descripcion = array[i].descripcion;
                break;
            }
        }
        this.setState({
            vehiculoId: value,
            vehiculoPlaca: placa,
            vehiculoDescripcion: descripcion,
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
                codvehiculo = this.state.configCodigo ? array[i].idvehiculo : array[i].codvehiculo;
                break;
            }
        }
        
        this.setState({
            vehiculoId: idvehiculo + ' ' + codvehiculo,
            vehiculoPlaca: value,
            vehiculoDescripcion: descripcion,
        });
    }

    cambiarRegistroParteVehiculo() {
        if (this.state.vehiculoId != '') {

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
            message.warning('Debe seleccionar un vehiculo!');
        }
        
    }

    cambiarRegistroHistorialVehiculo() {
        
        if (this.state.vehiculoId != '') {

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
                tituloPrincipal: this.state.tituloPrincipal,
                vehiculoDescripcion: this.state.vehiculoDescripcion,
                vehiculoPlaca: this.state.vehiculoPlaca
            });
        } else {
            message.warning('Debe seleccionar un vehiculo!');
        }
        
    }

    getResultadoParteVehiculo(resultado) {

        this.setState({
            mostrarOpcionParteVehiculo: 0,
            mostrarOpcionRegistrarVenta: 1,
            tituloPrincipal: 'Registrar Venta',
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
            tituloPrincipal: 'Registrar Venta',
            historialVehiculo: resultado
        });
    }

    verDatosCliente(id) {
        var data = {
            'idCliente': id
        }
        httpRequest('post', ws.wsshowcliente, data)
        .then(result =>{
                if (result.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
                        visibleModalCliente: true,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            }
        )
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    handleCerrar() {
        this.setState({
            visibleModalCliente: false,
            visibleModalVendedor: false,
        });
    }

    getResultadoCrearCliente(cliente, bandera) {
        this.getCliente();
        var nameFull = cliente.apellido == null ?cliente.nombre:cliente.nombre + ' ' + cliente.apellido;
        if (bandera != 0) {
            this.setState({
                newCliente: false,
                newVenta: true,
                valSearchClieCod: cliente.idcliente,
                valSearchClieNombre: nameFull,
                nitVenta: cliente.nit == null?'':cliente.nit,
                
            });
        }else {
            this.setState({
                newCliente: false,
                newVenta: true,
            })
        }
    }

    crearNuevoCliente() {
        saveData(keysStorage.createcliente, 'A');
        this.setState({
            newCliente: true,
            newVenta: false,
        });
    }
    
    showConfirmStore(tipo) {

        const guardarVenta = this.guardarVenta.bind(this);
        if (!this.validarDatos()) return;
        if (!this.validarCuotas()) return;
        Modal.confirm({
          title: 'Guardar Venta',
          content: '¿Estas seguro de guardar la venta?',
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
            title: 'Cancelar Venta',
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
                //this.showConfirmStore('contado');
                this.validarData('contado');
                //this.guardarVenta('Contado');
                break;
            case 1 :
                this.pagarCredito('credito');
                break;
        }
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
                let codcliente = this.state.configCodigo ? data[i].codcliente : data[i].idcliente;
                arr.push(
                    <Option 
                        key={i} value={data[i].idcliente}>
                        {codcliente}
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

    componentOptionPlanPago() {
        
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                style={{'textAlign': 'center',}}>
                {
                    this.state.tipoContaCredito.map((item, key) => {
                        return (
                            <C_Button key={key}
                                style={{'marginTop': '-20px', 'marginBottom': '25px'}}
                                title={item.descripcion}
                                type='primary'
                                onClick={this.optionPlanPago.bind(this, key)}
                            />
                        )
                    })
                }
            </div>
        )
        
    }

    buttonAddShowCliente() {

        if (typeof this.state.valSearchClieCod != 'undefined' && this.permisions.show_cli.visible == 'A') {
            return (
                <div className="input-group-content">
                    <C_Button
                        title={<i className="fa fa-eye"></i>}
                        type='danger' size='small' style={{padding: 4}}
                        onClick={this.verDatosCliente.bind(this, this.state.valSearchClieCod)}
                    />
                </div>
            );
        } else if (this.permisions.add_cli.visible == 'A') {
            return (
                <div className="input-group-content">
                    <C_Button
                        title={<i className="fa fa-plus"></i>}
                        type='primary' size='small' style={{padding: 4}}
                        onClick={this.crearNuevoCliente.bind(this)}
                    />
                </div>
            );
        }
        return null;
    }

    buttonAddShowVendedor() {
        
        if (!this.state.addshowvendedor  /*&& (permisionsShowCli.visible == 'A') */) {
            return (
                <C_Button
                    title={<i className="fa fa-eye"></i>}
                    type='danger' size='small' style={{padding: 4}}
                    onClick={this.showVendedor.bind(this, this.state.valSearchVendedorCod)}
                />
            );
        } //else if (permisionsAddCli.visible == 'A') {
            return (
                <C_Button
                    title={<i className="fa fa-plus"></i>}
                    type='primary' size='small' style={{padding: 4}}
                    onClick={this.crearNuevoVendedor.bind(this)}
                />
            );
        //}
    }

    searchCliente(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchcliproformas + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes2: result.data
                    })
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
                    
        }
    }

    onSearchCliente(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(() => this.searchCliente(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    getProformasCliente(id) {
        httpRequest('get', ws.wsgetproformascliente + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                let length = result.productos.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push(false);
                }
                this.setState({
                    vendedores: result.vendedores,
                    productos: result.productos,
                    ventas: result.ventas,
                    arrayCheckVenta: arr
                })
                this.state.ventas;
                this.state.productos;
                this.state.vendedores;
                this.state.arrayCheckVenta;
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onChangeSearchCliente(value) {

        this.getProformasCliente(value);
        this.setState({
            valSearchCli: value
        })
    }

    listClientes() {
        let data = this.state.resultClientes2;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option key={i} value={data[i].idcliente}>{data[i].nombre + ' ' + apellido}</Option>
            );
        }
        return arr;
    }

    onChangeCheckVentas(index, value) {
        if (this.state.ultimoCheck == index) {
            this.state.arrayCheckVenta[index] = !this.state.arrayCheckVenta[index];
            let ind = this.state.arrayCheckVenta[index] ? index : -1;
            this.setState({
                arrayCheckVenta: this.state.arrayCheckVenta,
                ultimoCheck: ind
            })
        } else {
            if (parseInt(this.state.ultimoCheck) >= 0) {
                this.state.arrayCheckVenta[this.state.ultimoCheck] = false;
            }
            this.state.arrayCheckVenta[index] = true;
            this.setState({
                arrayCheckVenta: this.state.arrayCheckVenta,
                ultimoCheck: index
            })
        }
        
        
    }

    componentCargarProforma() {
        const listClientes = this.listClientes();
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-ls-3 cols-md-3 cols-sm-6 cols-xs-12">
                    <p>Nombre del cliente</p>
                </div>
                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                    <CSelect
                        showSearch={true}
                        value={this.state.valSearchCli}
                        placeholder={"Buscar cliente por nombre"}
                        style={{ width: '100%', minWidth: '100%' }}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.onSearchCliente}
                        onChange={this.onChangeSearchCliente}
                        notFoundContent={null}
                        allowClear={true}
                        allowDelete={true}
                        onDelete={this.onDeselectCli}
                        component={listClientes}
                    />
                </div>
                <div className="table-detalle" 
                    style={{ 
                        width: '90%',
                        marginLeft: '5%',
                        overflow: 'auto',
                        marginTop: 100
                    }}>
                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                <th>Nro</th>
                                <th>Cod Proforma</th>
                                {this.state.isabogado ? <th>Nombre Abogado</th> : <th>Nombre Vendedor</th>}
                                <th>Fecha Proforma</th>
                                <th>Productos</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.ventas.map((item, key) => {
                                let codigo = this.state.configCodigo ? item.codventa : item.idventa;
                                let nombreve = this.state.vendedores[key].nombre;
                                let apellidove = this.state.vendedores[key].apellido == null ? '' : this.state.vendedores[key].apellido;
                                let productos = this.state.productos[key].cadena;
                                return (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>
                                            {codigo}
                                            {/*}
                                            <Input
                                                value={codigo}
                                                readOnly={true}
                                                style={{ width: 50 }}
                                            />*/}
                                        </td>
                                        <td style={{ width: 230 }}>
                                            {nombreve + ' ' + apellidove}
                                            {/*}
                                            <Input
                                                value={nombreve + ' ' + apellidove}
                                                readOnly={true}
                                                style={{ width: 230 }}
                                            />*/}
                                        </td>
                                        <td style={{ width: 100 }}>{item.fecha}</td>
                                        <td style={{ width: 200 }}>
                                            {productos}
                                        </td>
                                        <td>
                                            <Checkbox 
                                                onChange={this.onChangeCheckVentas.bind(this, key)}
                                                checked={this.state.arrayCheckVenta[key]}>  
                                            </Checkbox>
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
                            title='Seleccionar y volver'
                            type='primary'
                            onClick={this.seleccionarVenta}
                        />
                        <C_Button
                            title='Volver sin seleccionar'
                            type='danger'
                            onClick={this.sinSeleccionarVenta}
                        />
                    </div>
                </div>
            </div>
        );
    }

    

    cargarVenta(id) {
        httpRequest('get', ws.wsproformacompleta + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                let proforma = result.proforma;
                let idalmacen = this.actualizarAlmacen(proforma.idsucursal);
                this.getVehiculoDelCliente(proforma.idcliente);
                //lista de precios
                let data = result.productos;
                let tipos = result.tipos;
                let length = data.length;
                for (let i = 0; i < length ; i++) {
                    this.state.arrayListaVenta[i] = proforma.idlistaprecio;
                    if (data[i].id != undefined) {
                        this.getTraerPrecio(data[i].id, i);
                    }
                }

                let vehiculopartes = result.vehiculopartes;
                this.setState({
                    valSearchClieNombre: result.proforma.nomc + ' ' + (result.proforma.apec == null ? '' : result.proforma.apec),
                    ventaFecha: convertYmdToDmy(proforma.fecha),
                    idsucursal: proforma.idsucursal,
                    valSearchClieCod: proforma.idcliente, //revisar esto luego
                    nitVenta: proforma.nit == null ? '' : proforma.nit,
                    valSearchVendedorCod: proforma.idvendedor,
                    addshowvendedor: false,
                    valSearchListaPrecio: proforma.idlistaprecio,
                    arrayListaVenta: this.state.arrayListaVenta,
                    comisionvendedor: proforma.tomarcomisionvendedor,
                    //monedaVentaId: proforma.idmoneda, 
                    arrayIdAlmacenProdDetalle: result.idsalmacenprod,
                    arrayTipoPoS: result.tipos,
                    arrayUnidadVentaAbrev: result.abreviaciones,

                    valuesSearchProd: result.productos,
                    arrayCantidadVenta: result.cantidades,
                    arrayListaVenta: result.listaprecios,
                    arrayPrecioUnit: result.precios,
                    arrayDescuento: result.descuentos,
                    observacionVenta: proforma.observaciones,
                    descuentoVenta: proforma.descuentoporcentaje,
                    recargoVenta: proforma.recargoporcentaje,
                    historialVehiculo: result.vehiculohistoria,

                    vehiculoParte: [],
                    cantidadParteVehiculo: vehiculopartes.vpcantidades,
                    estadoParteVehiculo: vehiculopartes.vpestados,
                    observacionParteVehiculo: vehiculopartes.vpobservaciones,
                    imagenParteVehiculo: vehiculopartes.vpfotos,
                    indiceParteVehiculo: vehiculopartes.indicesfotos,
                    idsvehiculopartes: vehiculopartes.idsvpartes,
                    cargarProforma: false,
                    mostrarOpcionRegistrarVenta: 1
                },
                    () => this.validarAllStocks(idalmacen)
                )
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    seleccionarVenta() {
        if (this.state.ultimoCheck < 0 || this.state.ventas.length === 0) {
            message.warning('Debe seleccionar una venta');
            return;
        }
        let proforma = this.state.ventas[this.state.ultimoCheck];
        this.cargarVenta(proforma.idventa);
    }

    sinSeleccionarVenta() {
        this.state.arrayCheckVenta[this.state.ultimoCheck] = false;
        this.setState({
            searchByCli: false,
            cargarProforma: false,
            mostrarOpcionRegistrarVenta: 1
        })
    }


    showVendedor(idvendedor) {
        httpRequest('get', ws.wsvendedor + '/' + idvendedor)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    arrayvendedor: result.vendedor,
                    arrayreferencia: result.referencias,
                    visibleModalVendedor: true
                });
            } 
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    crearNuevoVendedor() {
        saveData(keysStorage.createvendedor, 'A');
        this.setState({
            newVendedor: true,
            newVenta: false,
        });
    }

    onCancelVendedor() {
        this.setState({
            newVendedor: false,
            newVenta: true,
        });
    }

    onSubmitVendedor(event) {
        this.getComision(event.fkidcomisionventa);
        this.setState({
            newVendedor: false,
            newVenta: true,
            valSearchVendedorCod: event.idvendedor,
            valSearchVendedorFullname: event.idvendedor,
            addshowvendedor: false,
            resultVendedores: [
                ...this.state.resultVendedores,
                event,
            ],
            resultVendedoresDefault: [
                ...this.state.resultVendedoresDefault,
                event,
            ]
        });
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
        if (this.permisions.t_precio_unit.visible == 'A') {
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

    onCancelPrint() {
        this.setState({
            visibleprint: false,
            redirect: true,
        });
    }

    onOkPrint() {
        setTimeout(() => {
            this.setState({
                visibleprint: false,
                redirect: true
            })
        }, 300);
    }

    componentCrearParteVehiculo() {

        if (this.state.mostrarOpcionParteVehiculo === 1) {
            return (
                <CrearParteVehiculo
                    vehiculoParte={this.state.vehiculoParte}
                    cantidad={this.state.cantidadParteVehiculo}
                    estado={this.state.estadoParteVehiculo}
                    observacion={this.state.observacionParteVehiculo}
                    imagen={this.state.imagenParteVehiculo}
                    indice={this.state.indiceParteVehiculo}
                    vehiculoPlaca={this.state.vehiculoPlaca}
                    vehiculoDescripcion={this.state.vehiculoDescripcion} 
                    idsvehiculopartes={this.state.idsvehiculopartes}                                   
                    //vehiculoDelcliente={this.state.vehiculoSeleccionado}
                    cliente={this.state.valSearchClieNombre}
                    callback={this.getResultadoParteVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    componentCrearHistorialVehiculo() {
        if (this.state.mostrarOpcionHistorialVehiculo == 1) {
            return (
                <CrearHistorialVehiculo 
                    fechaActual={this.state.fechaVenta}
                    //vehiculoDelcliente={this.state.vehiculoSeleccionado}vehiculoPlaca={this.state.vehiculoPlaca}
                    vehiculoPlaca={this.state.vehiculoPlaca}
                    vehiculoDescripcion={this.state.vehiculoDescripcion}             
                    cliente={this.state.valSearchClieNombre}
                    precio={this.state.totalVenta}
                    historialVehiculo={this.state.historialVehiculo}
                    //diagnosticoEntrada
                    callback={this.getResultadoHistorialVehiculo.bind(this)}
                    nroVenta={this.state.nroVenta}
                />
            );
        }
        return null;
    }

    render() {

        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        if(this.state.redirect === true){
            return (<Redirect to={routes.venta_index} />)
        }
        let componentOptionPlanPago = this.componentOptionPlanPago();
        const buttonAddShowVendedor = this.buttonAddShowVendedor();
        const buttonAddShowCliente = this.buttonAddShowCliente();
        const resultVendNomb = this.resultVendNomb();
        const resultVendCod = this.resultVendCod();
        const resultClientCod = this.resultClientCod();
        const resultClientNomb = this.resultClientNomb();
        const listaMonedas = this.listaMonedas();
        const listaSucursales = this.listaSucursales();
        const listaAlmacenes = this.listaAlmacenes();
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
        const componentCargarProforma = this.componentCargarProforma();
        const componentCrearParteVehiculo = this.componentCrearParteVehiculo();
        const componentCrearHistorialVehiculo = this.componentCrearHistorialVehiculo();
        
        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
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
                    title={"Datos del Vendedor"}
                    visible={this.state.visibleModalVendedor}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={850}
                    style={{'top': '35px'}}
                >
                    <ShowVendedor
                        vendedor={this.state.arrayvendedor}
                        referencia={this.state.arrayreferencia}
                        onCancel={this.handleCerrar.bind(this)}
                    />
                    
                </Modal>
                <Modal
                    title="Tipo de Pago"
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    { componentOptionPlanPago }
                </Modal>
                <Confirmation
                    visible={this.state.modalOk}
                    title="Registrar Venta"
                    loading={this.state.loadingOk}
                    onCancel={this.onCancelMO}
                    onClick={this.onOkMO}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de registrar la venta?
                            </label>
                        </div>
                    ]}
                />
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registrar Venta"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de venta?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    ]}
                />

                <Modal
                    title="Plan De Pago"
                    visible={this.state.visibleCredito}
                    onCancel={this.handleCancelcredito.bind(this)}
                    footer={null}
                    width={950}
                >
                    <div className="forms-groups">
                        
                        <C_Input 
                            title="Total Monto a Pagar"
                            value={this.state.totalVenta}
                            readOnly={true}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                            style={{ textAlign: 'right' }}
                        />
                        
                        <C_Input 
                            type="number"
                            title="Anticipo"
                            value={this.state.anticipo} 
                            onChange={this.anticipoPago.bind(this)}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                            style={{ textAlign: 'right' }}
                        />
                        
                        <C_Input 
                            title="Saldo a Pagar"
                            value={this.state.saldoApagar} 
                            readOnly={true}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                            style={{ textAlign: 'right' }}
                        />
                       
                        <C_Input 
                            type="number"
                            title="Numero de Cuotas"
                            value={this.state.NumeroCuota} 
                            onChange={this.numeroCuotaPlan.bind(this)}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                            style={{ textAlign: 'right' }}
                        />
                        
                        <C_DatePicker
                            format={'DD-MM-YYYY'}
                            onChange={this.fechaPagoInicio.bind(this)}
                            allowClear={false}
                            value={this.state.fechaInicioDePago}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                        />
                        
                        <C_Select 
                            title="Tipo Periodo"
                            value={this.state.tipoPeriodo}
                            onChange={this.tipoPeriodo.bind(this)}
                            //permisions={permisions}
                            component={[
                                <Option key={0} value={1}>Diario</Option>,
                                <Option key={1} value={7}>Semanal</Option>,
                                <Option key={2} value={30}>Mensual</Option>
                            ]}
                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                        />
                        <div className="txts-center">
                            <div className="cols-lg-12 cols-md-2 cols-sm-12 cols-xs-12">
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
                        
                        <div className="table-detalle" 
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
                                        <th>Fecha a Apagar</th>
                                        <th>Monto a Pagar</th>
                                        <th>Saldo</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.listaDeCuotas.map((item, key) => {
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
                                                    <C_DatePicker
                                                        //showTime={true}
                                                        format='DD-MM-YYYY'
                                                        placeholder="Select Time"
                                                        value={item.FechaApagar}
                                                        //defaultValue={this.state.fecha}
                                                        onChange={this.modificarFechaPlan.bind(this, key)}
                                                        //title="Fecha"
                                                        className=""
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        value={item.montoPagar}
                                                        onChange={this.modificarMonto.bind(this, key)}
                                                        style={{ textAlign: 'right' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        value={item.saldo}
                                                        readOnly={true}
                                                        style={{ textAlign: 'right' }}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {this.footerPlanPago()}
                        
                    </div>
                </Modal>

                <Modal
                    visible={this.state.visibleprint}
                    footer={null}
                    title={'Recibo de Venta'}
                    bodyStyle={{padding: 10, paddingTop: 6}}
                    width={320}
                >
                    <div className="forms-groups">

                        <div style={{'width': '100%',}}>
                            <label style={{'paddingLeft': '20px'}}>
                                Desea imprimir el recibo?
                            </label>
                        </div>

                        <div className="forms-groups" 
                            style={{'textAlign': 'right','borderTop': '1px solid #e8e8e8'}}>
                            <form target="_blank" method="post" action={routes.reporte_venta_recibo} >

                                <input type="hidden" value={_token} name="_token" />
                                <input type="hidden" value={conexion} name="x_conexion" />
                                <input type="hidden" value={this.state.idventa} name="id" />
                                <input type="hidden" value={usuario} name="usuario" />

                                <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                <input type="hidden" value={x_login} name="x_login" />
                                <input type="hidden" value={x_fecha} name="x_fecha" />
                                <input type="hidden" value={x_hora} name="x_hora" />
                                <input type="hidden" value={token} name="authorization" />
                                <input type="hidden" value={JSON.stringify(this.permisions)} name="permisos" />
                                <input type="hidden" value={this.state.clienteesabogado} name="clienteesabogado" />

                                <C_Button
                                    title={'No'}
                                    type='danger'
                                    onClick={this.onCancelPrint.bind(this)}
                                />
                                <C_Button
                                    title={'Si'}
                                    type='primary' submit={true}
                                    onClick={this.onOkPrint.bind(this)}
                                />
                            </form>
                        </div>
                    </div>
                </Modal>

                <div style={{'display': (this.state.newVenta)?'block':'none'}}>

{/*
                <div className="card-body-content" style={{'display': (this.state.mostrarOpcionRegistrarVenta === 1)?'block':'none'}}>
*/}
                <div className="cards" style={{'display': (this.state.mostrarOpcionRegistrarVenta === 1)?'block':'none'}}>
                    {/*<form onSubmit={this.guardarDatos.bind(this)} className="formulario-content" encType="multipart/form-data" id="form_register">*/}
                        <div>
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> {this.state.tituloPrincipal} </h1>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Button
                                    title='Cargar Proforma'
                                    type='primary'
                                    onClick={() => this.setState({ cargarProforma: true, mostrarOpcionRegistrarVenta: 0})}
                                    permisions={this.permisions.btn_cargar_proforma}
                                />
                            </div>
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                    <Input
                                        title="Codigo"
                                        value={this.state.codigoVenta}
                                        onChange={this.ventaCodigo.bind(this)}
                                        validar={this.state.validarCodigo}
                                        permisions={this.permisions.codigo}
                                        configAllowed={this.state.configCodigo}
                                    />
                                    {
                                        this.state.validarCodigo == 0 ?
                                            <p style={{color: 'red'}}>El codigo ya existe</p>
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
                                <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                    <CSelect
                                        value={this.state.almacenVentaId}
                                        title={"Almacen"}
                                        onChange={this.confirmChangeAlmacen.bind(this)}
                                        component={listaAlmacenes}
                                        permisions={this.permisions.almacen}
                                    />
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <div className="cols-lg-1 cols-md-1 cols-sm-4 cols-xs-12">
                                    { buttonAddShowCliente }
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
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
                                        allowClear={true}
                                        onDelete={this.onDeleteCliente}
                                        allowDelete={true}
                                        permisions={this.permisions.cli_cod}
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <CSelect
                                        showSearch={true}
                                        value={this.state.valSearchClieCod}
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
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <Input
                                        title="Nit"
                                        value={(this.state.nitVenta === null) ? '' : this.state.nitVenta}
                                        permisions={this.permisions.cli_nit}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                              
                                <div className="cols-lg-1 cols-md-1 cols-sm-3 cols-xs-12">
                                </div>
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
                                        permisions={this.permisions.veh_cod_id}
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
                                        permisions={this.permisions.veh_placa}
                                        configAllowed={this.state.configTaller}
                                        //disabled={(this.state.valSearchClieCod == undefined) ? true : false}
                                    />
                                </div>
                                <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                    <Input
                                        title="Descripcion"
                                        value={this.state.vehiculoDescripcion}
                                        permisions={this.permisions.veh_desc}
                                        readOnly={true}
                                        configAllowed={this.state.configTaller}
                                    />
                                </div>
                            </div>
                            
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <div className="cols-lg-1 cols-md-1 cols-sm-3 cols-xs-12">
                                    {buttonAddShowVendedor}
                                </div>
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
                                        title={'Codigo ' + this.state.configTitleVend}
                                        onDelete={this.onDeleteVendedor}
                                        allowDelete={true}
                                        permisions={this.permisions.vend_cod}
                                        
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12" >
                                    <CSelect
                                        showSearch={true}
                                        value={this.state.valSearchVendedorCod}
                                        placeholder={"Buscar por nombre"}
                                        style={{ width: '100%' }}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearchVendedorByFullName}
                                        onChange={this.onChangeSearchVendedorByFullName}
                                        notFoundContent={null}
                                        component={resultVendNomb}
                                        title={'Nombre ' + this.state.configTitleVend}
                                        onDelete={this.onDeleteVendedor}
                                        allowDelete={true}
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
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
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
                                        permisions={this.permisions.lista_precio}
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
{/*}
                            <div className="card-caracteristica">
                                <div className='form-group-content'>
                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12">
*/}
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                                style={{
                                    'border': '1px solid #e8e8e8', 
                                    'marginBottom': '15px', 
                                    'padding-right' : '10px'
                                }}>
                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12' 
                                    style={{
                                        'borderBottom': '1px solid #e8e8e8',
                                        'padding-right' : '10px'
                                    }}>
                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px',
                                            'width' : '11%'
                                        }}>
                                        { columnCodProd }
                                    </div>
                                    {/*<div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">*/}

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px'
                                        }}>
                                        { columnDescProd }
                                    </div>
                                    {/*<div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12">*/}
                                    {isAbogado != 'A' ? 
                                        <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12" 
                                            style={{
                                                'textAlign': 'center',
                                                'padding-right' : '10px'
                                            }}>
                                                <label 
                                                    htmlFor="lista" 
                                                    className="label-group-content-nwe"> 
                                                    Unid. Med 
                                                </label>
                                            
                                        </div>
                                        : null
                                    }
                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px'
                                        }}>
                                        { columnCantidad }
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px'
                                        }}>
                                        { columnListaPrecios }
                                    </div>

                                    <div className="cols-lg-1 cols-md-2 cols-sm-6 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px'
                                        }}>
                                        { columnPrecioUnit }
                                    </div>
                                    <div className="cols-lg-1 cols-md-2 cols-sm-6 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px'
                                        }}>
                                        { columnDescuento }
                                    </div>

                                    <div className="cols-lg-1 cols-md-2 cols-sm-6 cols-xs-12" 
                                        style={{
                                            'textAlign': 'center',
                                            'padding-right' : '10px',
                                            width: '14%'
                                        }}>
                                        <label 
                                            htmlFor="lista" 
                                            className="label-group-content-nwe"> 
                                            Precio Total 
                                        </label>
                                    </div>
                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                        style={{ 'padding-right' : '10px'}}>
                                        <div className="input-group-content">
                                            <C_Button
                                                title={<i className="fa fa-plus"></i>}
                                                type='primary' size='small' style={{padding: 4, marginLeft: 13 }}
                                                onClick={this.addRowDetalle.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                    style={{ 'padding-right' : '10px'}}>
                                    <div className="caja-content">
                                        {this.state.valuesSearchProd.map((item, key)=>(
                                            <div key={key} className="forms-groups">
                                                <div className="cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12"
                                                    style={{ 'padding-right' : '10px', 'width' : '11%'}}>
                                                    <div className="input-group-content">
                                                        <CSelect
                                                            key={key}
                                                            showSearch={true}
                                                            value={this.state.valuesSearchProd[key].id}
                                                            style={{ width: '100%' }}
                                                            placeholder="Id"
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
                                                <div className="cols-lg-2 cols-md-2 cols-sm-6 cols-xs-12" 
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
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
                                                            component={resultDescProds}
                                                            //title="Codigo Cliente"
                                                            allowDelete={true}
                                                            onDelete={this.onDeleteSearchProd.bind(this, key)}
                                                            permisions={this.permisions.t_prod_desc}
                                                        />
                                                    </div>
                                                </div>
                                                {isAbogado != 'A' ? 
                                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                        style={{ 'padding-right' : '10px'}}>
                                                        <div className="input-group-content">
                                                            <Input
                                                                value = {typeof this.state.arrayUnidadVentaAbrev[key] == 'undefined' ? "" :this.state.arrayUnidadVentaAbrev[key] }
                                                                readOnly={true}
                                                                style={{ textAlign: 'right' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                                }
                                                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
                                                        <Input
                                                            //type="number"
                                                            value={this.state.arrayCantidadVenta[key]}
                                                            onChange={this.ventaCantidad.bind(this, key)}
                                                            permisions={this.permisions.t_cantidad}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
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
                                                            permisions={this.permisions.t_lista_precios}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
                                                        <Input
                                                            //type="number"
                                                            value={typeof this.state.arrayPrecioUnit[key] == 'undefined' ? "" :this.state.arrayPrecioUnit[key]}
                                                            onChange={this.ventaPrecioUnit.bind(this, key)}
                                                            permisions={this.permisions.t_precio_unit}
                                                            readOnly={!this.state.configEditPrecioUnit}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
                                                        <Input
                                                            //type="number"
                                                            value={this.state.arrayDescuento[key]}
                                                            onChange={this.ventaDescuento.bind(this, key)}
                                                            permisions={this.permisions.t_descuento}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px', width: '14%'}}>
                                                    <div className="input-group-content">
                                                        <Input
                                                            value={ typeof this.state.arrayPrecioTotal[key] == 'undefined' ? "" : this.state.arrayPrecioTotal[key]}
                                                            readOnly={true}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                    style={{ 'padding-right' : '10px'}}>
                                                    <div className="input-group-content">
                                                        <C_Button
                                                            title={<i className="fa fa-remove"></i>}
                                                            type='danger' size='small' style={{padding: 4, marginLeft: 20 }}
                                                            onClick={this.removeRowDetalle.bind(this, key)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <TextArea
                                        title="Observaciones"
                                        value={this.state.observacionVenta} 
                                        onChange={this.ventaObservacion.bind(this)}
                                        permisions={this.permisions.observaciones}
                                    />
                                </div>
                            </div>
                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'border': '1px solid #e8e8e8'}}>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                        <Input
                                            title="Sub Total"
                                            value={this.state.subTotalVenta}
                                            readOnly={true}
                                            permisions={this.permisions.sub_total}
                                        />
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                        <Input
                                            type="number"
                                            title="% Desc"
                                            value={this.state.descuentoVenta}
                                            onChange={this.ventaDescuentoTotal.bind(this)}
                                            permisions={this.permisions.descuento}
                                        />
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                        <Input
                                            type="number"
                                            title="% Recargo "
                                            value={this.state.recargoVenta}
                                            onChange={this.ventaRecargoTotal.bind(this)}
                                            permisions={this.permisions.recargo}
                                        />
                                    </div>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Total "
                                            value={this.state.totalVenta}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>
                            <div className="forms-groups">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <div className="txts-center">
                                        
                                        { btnHistorial }
                                        
                                        { btnPartes }
                                        <C_Button
                                            title='Pagar'
                                            type='primary'
                                            onClick={this.pagar.bind(this)}
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
                    {/*</form>*/}
                </div>    
                
                { componentCrearParteVehiculo }

                { componentCrearHistorialVehiculo }
                
            
                </div>

                <div style={{ 'display': (this.state.newCliente)?'block':'none' }}>
                    <CrearCliente
                        aviso={this.state.aviso}
                        bandera={1}
                        callback={this.getResultadoCrearCliente.bind(this)}
                    />
                </div>

                <div style={{ 'display': (this.state.newVendedor)?'block':'none' }}>
                    <CreateVendedor
                        bandera={1}
                        onCancel={this.onCancelVendedor.bind(this)}
                        onSubmit={this.onSubmitVendedor.bind(this)}
                    />
                </div>
                
                <div className="cards" style={{'display': (this.state.cargarProforma) ? 'block' : 'none'}}>
                    { componentCargarProforma }
                </div>

            </div>
        
        )
    }

}