
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { Modal,message,
     Divider, Alert,
    Select, Checkbox, notification,
} from 'antd';
import "antd/dist/antd.css";
import CrearParteVehiculo from "../../taller/GestionarVentaDetalleVehiculo/CrearParteVehiculo";
import ShowCliente from '../GestionarCliente/show';
import CrearCliente from '../GestionarCliente/crear';
import CrearHistorialVehiculo from '../../taller/GestionarVentaDetalleVehiculo/CrearHistorialVehiculo';

import { stringToDate, dateToString, dateToStringB, hourToString, convertYmdToDmy, convertDmyToYmd } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';

import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';

import moment from 'moment';

import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';

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
import C_TextArea from '../../../componentes/data/textarea';
import C_CheckBox from '../../../componentes/data/checkbox';

const Option = Select.Option;

let dateNow = new Date();
let fehcaIniPago = new Date();
fehcaIniPago.setMonth(fehcaIniPago.getMonth() + 1);

let value = 0;

class CrearVenta extends Component{

    constructor(props){
        super(props)
        this.state = {
            inicio_venta: false,
            visible: false,
            loading: false,
            bandera: 0,
            valor_cambio: 1.00,

            visible_pago: false,

            visible_imprimir: false,
            loading_imprimir: false,

            visible_showproducto: false,
            productoalmacen: null,

            visible_contado: false,
            visible_credito: false,

            loading_contado: false,
            loading_credito: false,

            idventa: -1,
            
            codigo: '',
            fecha: dateToString(dateNow, 'f2'),
            idsucursal: '',
            idalmacen: '',
            idlistaprecio: '',
            idmoneda: '',

            idvendedor: '',
            comision_vendedor: '',

            idcliente: '',
            namecliente: '',
            nitcliente: '',

            idvehiculo: '',
            descripcion_vehiculo: '',
            placa_vehiculo: '',

            facturarsiempre: 'N',

            validar_codigo: 1,

            array_sucursal: [],
            array_almacen: [],
            array_moneda: [],
            array_listaprecio: [],
            array_producto: [],

            array_vendedor: [],
            vendedor: {},
            vendedor_contacto: [],

            array_cliente: [],
            cliente: {},
            cliente_contacto: [],

            array_vehiculo: [],
            array_tipo_pago: [],

            array_tablero_venta: [
                {
                    idproducto: '',
                    unidadmedida: '',
                    cantidad: 0,
                    idlistaprecio: '',
                    idalmacenprodetalle: '',
                    idlistapreproducdetalle: '',
                    preciounitario: value.toFixed(2),
                    descuento: 0,
                    preciototal: value.toFixed(2),
                    tipo: '',
                    validacion: false,
                    alert: 1,
                    array_producto: [],
                    array_listaprecio: [],
                }
            ],

            observacion: '',
            subtotal: value.toFixed(2),
            descuento_general: 0,
            recargo_general: 0,
            total_general: value.toFixed(2),

            array_vehiculoparte: {
                idvehiculoparte: [],
                imagen: [],
                cantidad: [],
                estado: [],
                observacion: [],
            },

            vehiculo_historia: {
                diagnostico_entrada: '',
                trabajo_hecho: '',
                fecha: '',
                precio: '',
                km_actual: '',
                km_proximo: '',
                fecha_proxima: '',
                nota: '',
            },

            anticipo: 0,
            saldo_por_pagar: value.toFixed(2),
            nro_cuota: 1,
            fecha_inicio_pago: dateToString(fehcaIniPago, 'f2'),
            tipo_periodo: 30,
            array_cuotas: [],

            idtipocontacredito: 0,

            config_taller: false,
            config_codigo: false,
            config_preciounitario: false,
            config_vehiculohistorial: false,
            config_vehiculoparte: false,
            config_credito: false,
            clienteesabogado: true,
            config_venta2pasos: false,

            checked_imprimir_ok: true,
            checked_imprimir_cancel: false,

            checked_generarfactura_ok: false,
            checked_generarfactura_cancel: true,

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            factura: {},

            timeoutSearch: undefined,
            facturaactiva: false,

            noSesion: false,
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
            btn_cargar_proforma: readPermisions(keys.venta_btn_cargar_proforma),
            add_vend: readPermisions(keys.venta_btn_agragarVendedor),
            show_vend: readPermisions(keys.venta_btn_verVendedor),
        }
    }
    cargar_data(data) {
        if (this.validar_data(data.cliente)) {
            data.array_cliente.push(data.cliente);
            data.cliente = null;
        }
        if (this.validar_data(data.vendedor)) {
            data.array_vendedor.push(data.vendedor);
            data.vendedor = null;
        }
        if (this.validar_data(data.facturaactiva)) {
            if (data.facturaactiva == true) {
                notification.error({
                    message: 'Advertencia',
                    description:
                        'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                });
            }
        }
        this.setState({
            inicio_venta: true,
            valor_cambio: data.valor_cambio,

            codigo: data.codigo,
            fecha: data.fecha,
            idsucursal: data.idsucursal,
            idalmacen: data.idalmacen,
            idlistaprecio: data.idlistaprecio,
            idmoneda: data.idmoneda,

            idvendedor: data.idvendedor,
            comision_vendedor: data.comision_vendedor,
            idcliente: data.idcliente,
            nitcliente: data.nitcliente,
            namecliente: data.namecliente,

            idvehiculo: data.idvehiculo,
            descripcion_vehiculo: data.descripcion_vehiculo,
            placa_vehiculo: data.placa_vehiculo,

            facturarsiempre: data.facturarsiempre,

            array_tablero_venta: data.array_tablero_venta,

            observacion: data.observacion,
            subtotal: data.subtotal,
            descuento_general: data.descuento_general,
            recargo_general: data.recargo_general,
            total_general: data.total_general,

            array_vehiculoparte: data.array_vehiculoparte,
            vehiculo_historia: data.vehiculo_historia,

            array_sucursal: data.array_sucursal,
            array_almacen: data.array_almacen,
            array_moneda: data.array_moneda,
            array_listaprecio: data.array_listaprecio,
            array_producto: data.array_producto,
            array_vendedor: data.array_vendedor,
            array_cliente: data.array_cliente,
            array_vehiculo: data.array_vehiculo,
            array_tipo_pago: data.array_tipo_pago,

            config_codigo: data.config_codigo,
            config_taller: data.config_taller,
            config_preciounitario: data.config_preciounitario,
            config_vehiculohistorial: data.config_vehiculohistorial,
            config_vehiculoparte: data.config_vehiculoparte,
            config_credito: data.config_credito,
            clienteesabogado: data.clienteesabogado,
            facturaactiva: data.facturaactiva,
            config_venta2pasos: data.config_venta2pasos
        });
    }
    componentDidMount() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'venta_create') {
                    bandera =  this.validar_data(on_data.validacion)?on_data.validacion:false;
                    var objecto_data = {
                        on_create: null,
                        data_actual: null,
                        new_data: null,
                        validacion: null,
                    };
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                }
            }
        }
        if (bandera) {
            this.cargar_data(on_data.data_actual);
            return;
        }
        this.get_data();
    }

    get_data() {

        httpRequest('get', ws.wscreateventa)
        .then((result) => {
            console.log('RESULT ', result);
            if (result.response == 1) {

                var idlistaprecio = (result.listaprecios.length > 0)?result.listaprecios[0].idlistaprecio : '';
                var valor = 0;

                this.state.array_tablero_venta[0].idlistaprecio = idlistaprecio;
                this.state.array_tablero_venta[0].array_producto = result.productos;
                this.state.array_tablero_venta[0].array_listaprecio = result.listaprecios;

                if (result.bandera == 1) {
                    notification.error({
                        message: 'Advertencia',
                        description:
                            'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                    });
                }

                for (let i = 0; i < 2; i++) {
                    var objecto = {
                        idproducto: '',
                        unidadmedida: '',
                        cantidad: 0,
                        idlistaprecio: idlistaprecio,
                        idalmacenprodetalle: '',
                        idlistapreproducdetalle: '',
                        preciounitario: valor.toFixed(2),
                        descuento: 0,
                        preciototal: valor.toFixed(2),
                        tipo: '',
                        validacion: false,
                        alert: 1,
                        array_producto: result.productos,
                        array_listaprecio: result.listaprecios,
                    };
                    this.state.array_tablero_venta.push(objecto);
                }

                this.setState({
                    inicio_venta: true,
                    facturaactiva: result.bandera == 1 ? true : false,

                    array_sucursal: result.sucursales,
                    array_almacen: result.almacenes,
                    array_listaprecio: result.listaprecios,
                    array_moneda: result.monedas,
                    array_producto: result.productos,

                    array_vendedor: result.vendedores,
                    array_cliente: result.clientes,
                    array_tipo_pago: result.tiposcontacredito,
                    valor_cambio: result.tipocambio == null ? 1 : result.tipocambio.valor,

                    array_tablero_venta: this.state.array_tablero_venta,

                    idsucursal: (result.sucursales.length > 0)?result.sucursales[0].idsucursal : '',
                    idalmacen: (result.almacenes.length > 0)?result.almacenes[0].idalmacen : '',
                    idlistaprecio: idlistaprecio,
                    idmoneda: (result.monedas.length > 0)?result.monedas[0].idmoneda : '',

                    config_codigo: (result.configscliente == null)?false:result.configscliente.codigospropios,
                    facturarsiempre: (result.configscliente == null)?false:result.configscliente.facturarsiempre,
                    config_preciounitario: (result.configscliente == null)?false:result.configscliente.editprecunitenventa,
                    config_taller: (result.configsfabrica == null)?false:result.configsfabrica.comtaller,
                    config_vehiculohistorial: (result.configsfabrica == null)?false:result.configsfabrica.comtallervehiculohistoria,
                    config_vehiculoparte: (result.configsfabrica == null)?false:result.configsfabrica.comtallervehiculoparte,
                    config_credito: (result.configsfabrica == null)?false:result.configsfabrica.comventasventaalcredito,
                    clienteesabogado: result.configscliente.clienteesabogado,
                    config_venta2pasos: (result.configscliente == null) ? false : result.configscliente.ventaendospasos,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true  });
            } else {
                print('RESULT ==> ', result);
                message.error('Ocurrio un problema al obtener los datos');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    verificarCodigo(value) {
        if (value.toString().trim().length > 0) {
            httpRequest('get', ws.wscodventavalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1 });
                    } else {
                        this.setState({ validar_codigo: 0 });
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            this.setState({ validar_codigo: 1 });
        }
    }
    handleVerificarCodigo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeCodigo(value) {
        this.handleVerificarCodigo(value);
        this.setState({
            codigo: value
        })
    }
    onChangeFecha(date){
        this.setState({
            fecha: date,
        });
    }
    get_sucursal(idsucursal, idmoneda, idlistaprecio) {
        var body = {
            idsucursal: idsucursal,
            idmoneda: idmoneda,
            idlistaprecio: idlistaprecio,
        };
        httpRequest('post', ws.wsventa + '/get_sucursal', body)
        .then((result) => {
            if (result.response == 1) {
                var number = 0;
                this.state.array_tablero_venta.map(
                    data => {
                        data.idproducto = '';
                        data.unidadmedida = '';
                        data.tipo = '';
                        data.cantidad = 0;
                        data.idlistaprecio = idlistaprecio;
                        data.idalmacenprodetalle = '';
                        data.idlistapreproducdetalle = '';
                        data.preciounitario = number.toFixed(2);
                        data.descuento = 0;
                        data.validacion = false;
                        data.alert = 1;
                        data.preciototal = number.toFixed(2);
                        data.array_producto = result.data.data;
                    }
                );
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                    array_almacen: result.almacen,
                    array_producto: result.data.data,
                    idlistaprecio: idlistaprecio,
                    idalmacen: (result.idalmacen == null)?'':result.idalmacen,
                    idsucursal: idsucursal,
                    idmoneda: idmoneda,
                    subtotal: number.toFixed(2),
                    descuento_general: 0,
                    recargo_general: 0,
                    total_general: number.toFixed(2),
                });
                message.success('Datos cargados exitosamente!!!');

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obenet el precio del producto');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeSucursal(value) {
        var idsucursal = value;
        var idmoneda = this.state.idmoneda;
        var idlistaprecio = this.state.idlistaprecio;
        const actualizar = this.get_sucursal.bind(this, idsucursal, idmoneda, idlistaprecio);
        Modal.confirm({
            title: 'Cambiar de Sucursal',
            content: 'Al cambiar de sucursal se perderan todos los registrados seleccionados, ¿Desea continuar?',
            onOk() {
                actualizar();
            },
            onCancel() {
            },
        });
    }
    get_almacen(idlistaprecio, idalmacen, idsucursal, idmoneda) {
        var body = {
            idlistaprecio: idlistaprecio,
            idalmacen: idalmacen,
            idsucursal: idsucursal,
            idmoneda: idmoneda,
        };
        httpRequest('post', ws.wsventa + '/get_almacen', body)
        .then((result) => {
            if (result.response == 1) {
                var number = 0;
                this.state.array_tablero_venta.map(
                    data => {
                        data.idproducto = '';
                        data.unidadmedida = '';
                        data.tipo = '';
                        data.cantidad = 0;
                        data.idlistaprecio = idlistaprecio;
                        data.idalmacenprodetalle = '';
                        data.idlistapreproducdetalle = '';
                        data.preciounitario = number.toFixed(2);
                        data.descuento = 0;
                        data.preciototal = number.toFixed(2);
                        data.validacion = false;
                        data.alert = 1;
                        data.array_producto = result.data.data;
                    }
                );
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                    idlistaprecio: idlistaprecio,
                    idalmacen: idalmacen,
                    idsucursal: idsucursal,
                    idmoneda: idmoneda,
                    array_producto: result.data.data,
                    subtotal: number.toFixed(2),
                    descuento_general: 0,
                    recargo_general: 0,
                    total_general: number.toFixed(2),
                });
                message.success('Datos cargados exitosamente!!!');

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obenet el precio del producto');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeAlmacen(value) {
        var idlistaprecio = this.state.idlistaprecio;
        var idsucursal = this.state.idsucursal;
        var idmoneda = this.state.idmoneda;
        const actualizar = this.get_almacen.bind(this, idlistaprecio, value, idsucursal, idmoneda);
        Modal.confirm({
            title: 'Cambiar de almacen',
            content: 'Al cambiar de almacen se perderan todos los registros seleccionados, ¿Desea continuar?',
            onOk() {
              actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    onDeleteClienteID() {
        this.setState({
            idcliente: '',
            nitcliente: '',
            namecliente: '',
            idvehiculo: '',
            descripcion_vehiculo: '',
        });
        this.searchClienteByIdCod('')
    }
    onchangeIDCliente(value) {
        let nit = '';
        let apellido = '';
        let namecliente = '';
        let array = this.state.array_cliente;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idcliente == value) {
                nit = array[i].nit;
                apellido = (array[i].apellido == null)?'':array[i].apellido;
                namecliente = array[i].nombre + ' ' + apellido;
                break;
            }
        }
        this.setState({
            idcliente: value,
            nitcliente: (nit == null)?'':nit,
            namecliente: namecliente,
        });
        this.get_vehiculo(value);
    }

    get_vehiculo(idcliente) {
        httpRequest('post', ws.wsventa + '/get_vehiculo', {
            idcliente: idcliente
        })
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_vehiculo: result.data,
                    idvehiculo: (result.data.length > 0)?result.data[0].idvehiculo:'',
                    descripcion_vehiculo: (result.data.length > 0)?result.data[0].vehiculotipo:'',
                    placa_vehiculo: (result.data.length > 0)?result.data[0].placa:'',
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Error al conectar al servidor');
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onSearchIDCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchClienteByIdCod(value) {
        httpRequest('post', ws.wssearchclienteidcod, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchNombreCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchClienteByNombre(value) {
        httpRequest('post', ws.wssearchclientenombre, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onDeleteVendedorID() {
        this.setState({
            idvendedor: '',
            comision_vendedor: '',
        });
        this.searchVendedorByIdCod('');
    }
    onchangeIDVehiculo(value) {
        let descripcion = '';
        let placa = '';
        let array = this.state.array_vehiculo;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idvehiculo == value) {
                descripcion = array[i].vehiculotipo;
                placa = array[i].placa;
                break;
            }
        }
        this.setState({
            idvehiculo: value,
            descripcion_vehiculo: descripcion,
            placa_vehiculo: placa,
        });
    }
    onSearchIDVehiculo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchVehiculoByIdCod(value) {
        httpRequest('post', ws.wsclivehiculosidcod, {
            value: value,
            idcliente: this.state.idcliente,
        })
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_vehiculo: result.data,
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
        });
    }
    onSearchPlacaVehiculo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByPlaca(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchVehiculoByPlaca(value) {
        httpRequest('post', ws.wsclivehiculosplaca, {
            value: value,
            idcliente: this.state.idcliente,
        })
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_vehiculo: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Ocurrio un problema con la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onDeleteVehiculoID() {
        this.setState({
            idvehiculo: '',
            descripcion_vehiculo: '',
        });
        this.searchVehiculoByPlaca('');
    }
    onchangeIDVendedor(value) {
        let comision = '';
        let array = this.state.array_vendedor;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idvendedor == value) {
                comision = array[i].valor;
                break;
            }
        }
        this.setState({
            idvendedor: value,
            comision_vendedor: comision,
        });
    }
    onSearchIDVendedor(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchVendedorByIdCod(value) {
        httpRequest('post', ws.wssearchvendedoridcod, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_vendedor: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Error al realizar servicio Favor de cargar la pagina');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onChangeComisionVendedor(value) {
        if (!isNaN(value)) {
            value = parseInt(value);
            if (value >= 0 && value <= 100) {
                this.setState({
                    comision_vendedor: value,
                });
            }
        }
    }
    onSearchNombreVendedor(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByFullName(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchVendedorByFullName(value) {
        httpRequest('post', ws.wssearchvendedorfullname, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_vendedor: result.data
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('Error al realizar servicio Favor de cargar la pagina');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeListaPrecio(value) {
        var idlistaprecio = value;
        var idalmacen = this.state.idalmacen;
        var idsucursal = this.state.idsucursal;
        var idmoneda = this.state.idmoneda;
        
        const actualizar = this.get_almacen.bind(this, idlistaprecio, idalmacen, idsucursal, idmoneda);

        Modal.confirm({
            title: 'Cambiar de Lista de Precios',
            content: 'Al cambiar de lista de precios se perderan los registros seleccionados, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    get_moneda(idalmacen, idsucursal, idmoneda) {
        var body = {
            idalmacen: idalmacen,
            idsucursal: idsucursal,
            idmoneda: idmoneda,
        };
        httpRequest('post', ws.wsventa + '/get_moneda', body)
        .then((result) => {
            if (result.response == 1) {
                var number = 0;
                this.state.array_tablero_venta.map(
                    data => {
                        data.idproducto = '';
                        data.unidadmedida = '';
                        data.tipo = '';
                        data.cantidad = 0;
                        data.idlistaprecio = (result.idlistaprecio == null)?'':result.idlistaprecio;
                        data.idalmacenprodetalle = '';
                        data.idlistapreproducdetalle = '';
                        data.preciounitario = number.toFixed(2);
                        data.descuento = 0;
                        data.preciototal = number.toFixed(2);
                        data.validacion = false;
                        data.alert = 1;
                        data.array_producto = result.data.data;
                        data.array_listaprecio = result.lista_precio;
                    }
                );
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                    array_listaprecio: result.lista_precio,
                    array_producto: result.data.data,
                    idalmacen: idalmacen,
                    idsucursal: idsucursal,
                    idmoneda: idmoneda,
                    idlistaprecio: (result.idlistaprecio == null)?'':result.idlistaprecio,
                    subtotal: number.toFixed(2),
                    descuento_general: 0,
                    recargo_general: 0,
                    total_general: number.toFixed(2),
                    valor_cambio: result.tipocambio == null ? 1 : result.tipocambio.valor,
                });
                message.success('Datos cargados exitosamente!!!');

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obenet el precio del producto');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeMoneda(value) {
        var idalmacen = this.state.idalmacen;
        var idsucursal = this.state.idsucursal;
        var idmoneda = value;
        
        const actualizar = this.get_moneda.bind(this, idalmacen, idsucursal, idmoneda);

        Modal.confirm({
            title: 'Cambiar de Moneda',
            content: 'Al cambiar de moneda se perderan los registros seleccionados, ¿Desea continuar?',
            onOk() {
                console.log('OK');
                actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    esProductoSeleccionado(value) {
        var data = this.state.array_tablero_venta;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == value) {
                return true;
            }
        }
        return false;
    }
    onDeleteProductoID(index) {
        const actualizar = () => {
            var number = 0;
            this.state.array_tablero_venta[index].idproducto = '';
            this.state.array_tablero_venta[index].unidadmedida = '';
            this.state.array_tablero_venta[index].tipo = '';
            this.state.array_tablero_venta[index].idalmacenprodetalle = '';
            this.state.array_tablero_venta[index].idlistapreproducdetalle = '';
            this.state.array_tablero_venta[index].cantidad = number;
            this.state.array_tablero_venta[index].preciounitario = number.toFixed(2);
            this.state.array_tablero_venta[index].descuento = 0;
            this.state.array_tablero_venta[index].preciototal = number.toFixed(2);
            this.state.array_tablero_venta[index].validacion = false;
            this.state.array_tablero_venta[index].alert = 1;

            var subtotal = 0;
            this.state.array_tablero_venta.map(
                data => {
                    subtotal = subtotal + parseFloat(data.preciototal);
                }
            );

            var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
            var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
                subtotal: parseFloat(subtotal).toFixed(2),
                total_general: parseFloat(subtotal + recargo - descuento).toFixed(2), 
            });
        };
        Modal.confirm({
            title: 'Quitar Producto',
            content: 'Al quitar se perderan los registros seleccionados, ¿Desea continuar?',
            onOk() {
                actualizar();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    get_data_producto(index, id) {
        var body = {
            idproducto: parseInt(id),
            idlistaprecio: this.state.array_tablero_venta[index].idlistaprecio,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wsventa + '/get_productoprecio', body)
        .then(result => {
            if (result.response == 1) {
                
                var validacion = (result.data == null)? false: true;

                if (validacion) {
                    this.state.array_tablero_venta[index].unidadmedida = result.data.abreviacion;
                    this.state.array_tablero_venta[index].preciounitario = parseFloat(result.data.precio).toFixed(2);
                    this.state.array_tablero_venta[index].tipo = result.data.tipo;
                    this.state.array_tablero_venta[index].idalmacenprodetalle = result.data.idalmacenproddetalle;
                    this.state.array_tablero_venta[index].idlistapreproducdetalle = result.data.idlistapreproducdetalle;
                    this.state.array_tablero_venta[index].cantidad = 1;
                    this.state.array_tablero_venta[index].preciototal = parseFloat(result.data.precio).toFixed(2);

                    if (result.data.tipo == 'P') {
                        if (parseInt(result.data.stock) < 1) {
                            var number = 0;
                            this.state.array_tablero_venta[index].cantidad = 0;
                            this.state.array_tablero_venta[index].descuento = 0;
                            this.state.array_tablero_venta[index].preciototal = number.toFixed(2);
                            this.state.array_tablero_venta[index].validacion = true;
                            this.state.array_tablero_venta[index].tipo = '';
                            this.state.array_tablero_venta[index].alert = -1;
                            message.warning('Producto agotado...');
                        }else {
                            this.state.array_tablero_venta[index].alert = 1;
                        }
                    }else {
                        this.state.array_tablero_venta[index].alert = 1;
                    }

                    var subtotal = 0;
                    this.state.array_tablero_venta.map(
                        data => {
                            subtotal = subtotal + parseFloat(data.preciototal);
                        }
                    );

                    var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
                    var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

                    this.setState({
                        array_tablero_venta: this.state.array_tablero_venta,
                        subtotal: parseFloat(subtotal).toFixed(2),
                        total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
                    });

                }else {
                    message.error('Error al traer detalle del producto!!!')
                }

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obtener los producto');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onchangeProductoID(index, value) {
        if (!this.esProductoSeleccionado(value)) {
            this.state.array_tablero_venta[index].idproducto = value;
            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
            });
            this.get_data_producto(index, value);
        }else {
            message.warning('El producto ya fue seleccionado...');
        }
    }
    onSearchProductoID(index, value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProducto(value, index, 1), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onSearchProductoDesc(index, value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProducto(value, index, 2), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchProducto(value, index, bandera) {
        var body = {
            value: value,
            idlistaprecio: this.state.array_tablero_venta[index].idlistaprecio,
            idalmacen: this.state.idalmacen,
            bandera: bandera,
        };
        httpRequest('post', ws.wsventa + '/search_producto', body)
        .then((result) => {
            if (result.response == 1) {
                this.state.array_tablero_venta[index].array_producto = result.data.data;
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obtener el precio del producto');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeCantidadIndex(index, value) {
        var cantidad = (value == '')?1:parseInt(value);
        if (cantidad > 0) {

            this.state.array_tablero_venta[index].cantidad = cantidad;

            var descuento = this.state.array_tablero_venta[index].descuento;
            var precio = this.state.array_tablero_venta[index].preciounitario;
            descuento = parseFloat(parseFloat(descuento / 100) * precio * cantidad);

            this.state.array_tablero_venta[index].preciototal = parseFloat((precio * cantidad) - descuento).toFixed(2);

            var subtotal = 0;
            this.state.array_tablero_venta.map(
                data => {
                    subtotal = subtotal + parseFloat(data.preciototal);
                }
            );

            var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
            var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
                subtotal: parseFloat(subtotal).toFixed(2),
                total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
            });
            if (this.state.array_tablero_venta[index].tipo == 'P') {
                this.validar_stock(this.state.idalmacen, index, value);
            }
        }
    }
    validar_stock(idalmacen, index, cantidad) {
        var  body =  {
            idalmacen: idalmacen,
            idproducto: this.state.array_tablero_venta[index].idproducto,
        }
        httpRequest('post', ws.wsverificarstock, body).
        then(result => {
            if (result.response == 1) {
                if (result.data == null) {
                    message.error('No existe producto en almacen!!!');
                    message.warning('Favor de actualizar datos nuevamente!!!');
                }else {
                    var stock = parseInt(result.data.stock);
                    cantidad = parseInt(cantidad);
                    if (cantidad > stock) {

                        message.warning('No existe la cantidad requerida del producto');

                        this.state.array_tablero_venta[index].cantidad = stock;

                        var descuento = this.state.array_tablero_venta[index].descuento;
                        var precio = this.state.array_tablero_venta[index].preciounitario;
                        descuento = parseFloat(parseFloat(descuento/100)*precio*stock);

                        this.state.array_tablero_venta[index].preciototal = parseFloat((precio*stock)-descuento).toFixed(2);

                        var subtotal = 0;
                        this.state.array_tablero_venta.map(
                            data => {
                                subtotal = subtotal + parseFloat(data.preciototal);
                            }
                        );

                        var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
                        var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);
                        
                        this.setState({
                            array_tablero_venta: this.state.array_tablero_venta,
                            subtotal: parseFloat(subtotal).toFixed(2),
                            total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
                        });
                        message.warning('El stock tope del producto requerido es ' + result.data.stock);
                    }
                }
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onChangePrecioUnitarioIndex(index, value) {
        value = (value == '')?1:value;
        if (!isNaN(value) && value > 0) {
            this.state.array_tablero_venta[index].preciounitario = value;
            var descuento = this.state.array_tablero_venta[index].descuento;
            var cantidad = this.state.array_tablero_venta[index].cantidad;
            this.state.array_tablero_venta[index].preciototal = parseFloat((parseFloat(value) * cantidad) - descuento).toFixed(2);
            var subtotal = 0;
            this.state.array_tablero_venta.map(
                data => {
                    subtotal = subtotal + parseFloat(data.preciototal);
                }
            );
            var descuento_general = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
            var recargo_general = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);
            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
                subtotal: parseFloat(subtotal).toFixed(2),
                total_general: parseFloat(subtotal + recargo_general - descuento_general).toFixed(2),
            });
        }
    }
    onChangeListaPrecioIndex(index, value) {
        var body = {
            idlistaprecio: value,
            idalmacen: this.state.idalmacen,
            idproducto: this.state.array_tablero_venta[index].idproducto,
        };
        httpRequest('post', ws.wsventa + '/get_listaprecio', body)
        .then(result => {
            if (result.response == 1) {
                var data = result.data.data;

                if (result.get_producto == null) {

                    const actualizar = () => {

                        var number = 0;
                        this.state.array_tablero_venta[index].idproducto = '';
                        this.state.array_tablero_venta[index].unidadmedida = '';
                        this.state.array_tablero_venta[index].tipo = '';
                        this.state.array_tablero_venta[index].cantidad = number;
                        this.state.array_tablero_venta[index].preciounitario = number.toFixed(2);
                        this.state.array_tablero_venta[index].descuento = 0;
                        this.state.array_tablero_venta[index].preciototal = number.toFixed(2);
                        
                        this.state.array_tablero_venta[index].array_producto = data;
                        this.state.array_tablero_venta[index].idlistaprecio = value;
                        this.state.array_tablero_venta[index].idalmacenprodetalle = '';
                        this.state.array_tablero_venta[index].idlistapreproducdetalle = '';

                        var subtotal = 0;
                        this.state.array_tablero_venta.map(
                            data => {
                                subtotal = subtotal + parseFloat(data.preciototal);
                            }
                        );

                        var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
                        var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

                        this.setState({
                            array_tablero_venta: this.state.array_tablero_venta,
                            subtotal: parseFloat(subtotal).toFixed(2),
                            total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
                        });

                    };
                    Modal.confirm({
                        title: 'Cambio Lista Precio',
                        content: 'Al cambiar se perderan los registros seleccionados, ¿Desea continuar?',
                        onOk() {
                            actualizar();
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                    });

                }else {
                    
                    var cantidad = this.state.array_tablero_venta[index].cantidad;
                    var descuento = this.state.array_tablero_venta[index].descuento;
                    var precio = parseFloat(result.get_producto.precio).toFixed(2);
                    descuento = parseFloat(parseFloat(descuento/100)*precio*cantidad);

                    data.push(result.get_producto);
                    this.state.array_tablero_venta[index].array_producto = [];
                    this.state.array_tablero_venta[index].array_producto = data;
                    this.state.array_tablero_venta[index].idlistaprecio = value;
                    this.state.array_tablero_venta[index].preciounitario = precio;
                    this.state.array_tablero_venta[index].idlistapreproducdetalle = result.get_producto.idlistapreproducdetalle;
                    this.state.array_tablero_venta[index].preciototal = parseFloat(precio*cantidad-descuento).toFixed(2);

                    var subtotal = 0;
                    this.state.array_tablero_venta.map(
                        data => {
                            subtotal = subtotal + parseFloat(data.preciototal);
                        }
                    );

                    var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
                    var recargo = parseFloat(parseFloat(this.state.recargo_general / 100)* subtotal);

                    this.setState({
                        array_tablero_venta: this.state.array_tablero_venta,
                        subtotal: parseFloat(subtotal).toFixed(2),
                        total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
                    });

                }

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo cargar los productos');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
        
    }
    onChangeSearchListaPrecio(index, value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchListaPrecioIndex(value, index), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchListaPrecioIndex(value, index) {
        httpRequest('post', ws.wssearchlistaprecio, {
            idmoneda: this.state.idmoneda,
            descripcion: value,
        })
        .then((result) => {
            if (result.response == 1) {
                this.state.array_tablero_venta[index].array_listaprecio = result.data;
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo procesar la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeDescuentoIndex(index, value) {
        var descuento = (value == '')?0:parseInt(value);
        if (descuento >= 0 && descuento <= 100) {
            this.state.array_tablero_venta[index].descuento = descuento;

            var cantidad = this.state.array_tablero_venta[index].cantidad;
            var precio = this.state.array_tablero_venta[index].preciounitario;
            descuento = parseFloat(parseFloat(descuento/100) * precio * cantidad);

            this.state.array_tablero_venta[index].preciototal = parseFloat((precio * cantidad) - descuento).toFixed(2);

            var subtotal = 0;
            this.state.array_tablero_venta.map(
                data => {
                    subtotal = subtotal + parseFloat(data.preciototal);
                }
            );

            var descuento_general = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
            var recargo_general = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
                total_general: parseFloat(subtotal + recargo_general - descuento_general).toFixed(2),
                subtotal: parseFloat(subtotal).toFixed(2),
            });
        }
    }
    componentSucursal() {
        let array = [];
        let data = this.state.array_sucursal;
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idsucursal}>
                    { data[i].nombrecomercial == null ? data[i].razonsocial == null ? 'S/Nombre' : data[i].razonsocial : data[i].nombrecomercial }
                </Option>
            );
        }
        return array;
    }
    componentAlmacen() {
        let array = [];
        let data = this.state.array_almacen;
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idalmacen}>{data[i].descripcion}</Option>
            );
        }
        return array;
    }
    componentClienteCodID() {
        let array = [];
        let data = this.state.array_cliente;
        for (let i = 0; i < data.length; i++) {
            let codcliente = this.state.config_codigo ? data[i].codcliente : data[i].idcliente;
            array.push(
                <Option key={i} value={data[i].idcliente}>
                    {codcliente}
                </Option>
            );
        }
        return array;
    }
    componentClienteNombre() {
        let array = [];
        let data = this.state.array_cliente;
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            let fullname = data[i].nombre + ' ' + apellido;
            array.push(
                <Option key={i} value={data[i].idcliente}>
                    {fullname}
                </Option>
            );
        }
        return array;
    }
    componentVehiculoCodID() {
        let array = [];
        let data = this.state.array_vehiculo;
        for (let i = 0; i < data.length; i++) {
            let codigo = this.state.config_codigo ? data[i].codvehiculo : data[i].idvehiculo;
            array.push(
                <Option key={i} value={data[i].idvehiculo}>
                    {codigo}
                </Option>
            );
        }
        return array;
    }
    componentVhiculoPlaca() {
        let array = [];
        let data = this.state.array_vehiculo;
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idvehiculo}>
                    {data[i].placa}
                </Option>
            );
        }
        return array;
    }
    componentVendedorCodID() {
        let array = [];
        let data = this.state.array_vendedor;
        for (let i = 0; i < data.length; i++) {
            let codvendedor = (data[i].codvendedor == null || !this.state.config_codigo) ? '' : data[i].codvendedor;
            array.push(
                <Option key={i} value={data[i].idvendedor}>
                    {data[i].idvendedor + ' ' + codvendedor}
                </Option>
            );
        }
        return array;
    }
    componentVendedorName() {
        let array = [];
        let data = this.state.array_vendedor;
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            array.push(
                <Option key={i} value={data[i].idvendedor}>
                    {data[i].nombre + ' ' + apellido}
                </Option>
            );
        }
        return array;
    }
    componentListaPrecio() {
        let data = this.state.array_listaprecio;
        let array = [];
        for (let i = 0; i < data.length; i ++) {
            array.push(
                <Option key={i} value={data[i].idlistaprecio}>
                    {data[i].descripcion}
                </Option>
            )
        }
        return array;
    }
    componentMoneda() {
        let array = [];
        let data = this.state.array_moneda;
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idmoneda}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array;
    }
    componentProductoDescripcion(index) {
        let data = this.state.array_tablero_venta[index].array_producto;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return array;
    }
    componentProductoCodID(index) {
        let data = this.state.array_tablero_venta[index].array_producto;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let codproducto = (data[i].codproducto == null || !this.state.config_codigo) ? '' : data[i].codproducto;
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {data[i].idproducto + ' ' + codproducto}
                </Option>
            );
        }
        return array;
    }
    componentListaPrecioTablero(index) {
        let data = this.state.array_tablero_venta[index].array_listaprecio;
        let array = [];
        for (let i = 0; i < data.length; i ++) {
            array.push(
                <Option key={i} value={data[i].idlistaprecio}>
                    {data[i].descripcion}
                </Option>
            )
        }
        return array;
    }
    searchListaPrecio(value) {
        httpRequest('post', ws.wssearchlistaprecio, {
            idmoneda: this.state.idmoneda,
            descripcion: value,
        })
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_listaprecio: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo procesar la busqueda');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    handleSearchListaPrecio(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchListaPrecio(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    addRowIndex() {
        var body = {
            idlistaprecio: this.state.idlistaprecio,
            idalmacen: this.state.idalmacen,
            idsucursal: this.state.idsucursal,
            idmoneda: this.state.idmoneda,
        };
        httpRequest('post', ws.wsventa + '/get_almacen', body)
        .then((result) => {
            if (result.response == 1) {

                var number = 0;

                var objecto = {
                    idproducto: '',
                    unidadmedida: '',
                    cantidad: 0,
                    idlistaprecio: this.state.idlistaprecio,
                    idalmacenprodetalle: '',
                    idlistapreproducdetalle: '',
                    preciounitario: number.toFixed(2),
                    descuento: 0,
                    preciototal: number.toFixed(2),
                    tipo: '',
                    validacion: false,
                    alert: 1,
                    array_producto: result.data.data,
                    array_listaprecio: this.state.array_listaprecio,
                };

                this.state.array_tablero_venta.push(objecto);

                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                });

            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo cargar los datos favor de intentar');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    removeRowIndex(index) {
        this.state.array_tablero_venta.splice(index, 1);

        var subtotal = 0;
        this.state.array_tablero_venta.map(
            data => {
                subtotal = subtotal + parseFloat(data.preciototal);
            }
        );

        var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
        var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);
        
        this.setState({
            array_tablero_venta: this.state.array_tablero_venta,
            total_general: parseFloat(subtotal + recargo - descuento).toFixed(2),
            subtotal: parseFloat(subtotal).toFixed(2),
        });
    }
    showProductoRowIndex(data, index) {
        if ( data.idproducto != "" && data.idproducto != null ) {
            httpRequest('get', ws.wsproductoexistalm, {idproducto: data.idproducto })
            .then(result =>{
                    if (result.response == -2) {
                        this.setState({ noSesion: true });
                        return;
                    }
                    if (result.response == 1) {
                        this.setState({
                            visible_showproducto: true,
                            productoalmacen: result.data,
                        });
                        return;
                    }
                    message.error("Error al procesar servicio");
                }
            )
            .catch((error) => {
                message.error(strings.message_error);
            });
        } else {
            message.warning( " Favor de seleccionar Producto. " );
        }
    }
    componentShowProductoAlmacen() {
        let stockactual = 0;
        return (
            <Confirmation
                visible={this.state.visible_showproducto}
                title="Consulta de existencia en almacenes"
                zIndex={950}
                width={750}
                content={
                    this.state.productoalmacen == null ? null :
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                            <table className="table-response-detalle">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th colSpan="4" style={{ textAlign: 'left', }}>
                                            { this.state.productoalmacen.length == 0 ? '-' : this.state.productoalmacen[0].descripcion }
                                        </th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Almacén</th>
                                        <th>Stock</th>
                                        <th>Ubicación en Almacen</th>
                                        <th>Dirección física almacen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productoalmacen.map((data, key) => {
                                        stockactual += data.stock * 1;
                                        return (
                                            <tr key={key}>
                                                <td>{data.sucursal}</td>
                                                <td>{data.almacen}</td>
                                                <td>{data.stock}</td>
                                                <td>{data.ubicacion}</td>
                                                <td>{data.almacendireccion}</td>
                                            </tr>
                                        )
                                    } )}
                                    <tr>
                                        <th colSpan="2"> Stock total disponible </th>
                                        <th> {stockactual} </th>
                                        <th colSpan="2"> </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'right', paddingRight: 5, }}>
                                <C_Button
                                    title={'Aceptar'}
                                    type='primary'
                                    onClick={ () => this.setState({ visible_showproducto: false, productoalmacen: null, }) }
                                /> 
                            </div>
                        </div>
                    </div>
                }
                footer={false}
            />
        );
    }
    onChangeObservacion(event) {
        this.setState({
            observacion: event,
        });
    }
    onChangeDescuentoGeneral(value) {
        var descuento = (value == '')?0:parseInt(value);

        if (descuento >= 0 && descuento <= 100) {

            var subtotal = parseFloat(this.state.subtotal);
            var descuento_general = parseFloat(parseFloat(descuento / 100) * subtotal);
            var recargo = parseFloat(parseFloat(this.state.recargo_general / 100) * subtotal);

            this.setState({
                descuento_general: descuento,
                total_general: parseFloat(subtotal + recargo - descuento_general).toFixed(2),
            });
        }
    }
    onChangeRecargoGeneral(value) {
        var recargo = (value == '')?0:parseInt(value);

        if (recargo >= 0 && recargo <= 100) {

            var subtotal = parseFloat(this.state.subtotal);
            var descuento = parseFloat(parseFloat(this.state.descuento_general / 100) * subtotal);
            var recargo_general = parseFloat(parseFloat(recargo / 100) * subtotal);

            this.setState({
                recargo_general: recargo,
                total_general: parseFloat(subtotal + recargo_general - descuento).toFixed(2),
            });
        }
    }
    showCliente() {
        httpRequest('post', ws.wsshowcliente, {idCliente: this.state.idcliente})
        .then(result =>{
                if (result.response == -2) {
                    this.setState({ noSesion: true });
                }
                if (result.response == 1) {
                    this.setState({
                        cliente: result.cliente,
                        cliente_contacto: result.clientecontacto,
                        visible: true,
                        bandera: 2,
                    });
                }
            }
        )
        .catch((error) => {
            message.error(strings.message_error);
        });
    }
    showVendedor() {
        httpRequest('get', ws.wsvendedor + '/' + this.state.idvendedor)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vendedor: result.vendedor,
                    vendedor_contacto: result.referencias,
                    visible: true,
                    bandera: 1,
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
    buttonAddShowVendedor() {
        if (this.state.idvendedor != '' && this.permisions.show_vend.visible == 'A' && this.state.inicio_venta) {
            return (
                <div className='cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12'>
                    <C_Button
                        title={<i className="fa fa-eye"></i>}
                        type='danger' size='small' style={{padding: 4}}
                        onClick={this.showVendedor.bind(this)}
                    />
                </div>
            );
        } else if (this.permisions.add_vend.visible == 'A'  && this.state.inicio_venta) {
            return (
                <div className='cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12'>
                    <C_Button
                        title={<i className="fa fa-plus"></i>}
                        type='primary' size='small' style={{padding: 4}}
                        onClick={this.crearNuevoVendedor.bind(this)}
                    />
                </div>
            );
        }
    }
    buttonAddShowCliente() {
        if (this.state.idcliente != '' && this.permisions.show_cli.visible == 'A'  && this.state.inicio_venta) {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12">
                    <C_Button
                        title={<i className="fa fa-eye"></i>}
                        type='danger' size='small' style={{padding: 4}}
                        onClick={this.showCliente.bind(this)}
                    />
                </div>
            );
        } else if (this.permisions.add_cli.visible == 'A'  && this.state.inicio_venta) {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12">
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
    crearNuevoVendedor() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'venta_create',
                data_actual: this.on_data_component(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }

        var url = routes.vendedor_create;
        this.props.history.push(url);
    }
    crearNuevoCliente() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'venta_create',
                data_actual: this.on_data_component(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }

        var url = routes.cliente_create;
        this.props.history.push(url);
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    on_data_component() {
        return {
            valor_cambio: this.state.valor_cambio,
            codigo: this.state.codigo,
            fecha: this.state.fecha,
            idsucursal: this.state.idsucursal,
            idalmacen: this.state.idalmacen,
            idlistaprecio: this.state.idlistaprecio,
            idmoneda: this.state.idmoneda,

            idvendedor: this.state.idvendedor,
            comision_vendedor: this.state.comision_vendedor,
            idcliente: this.state.idcliente,
            nitcliente: this.state.nitcliente,
            namecliente: this.state.namecliente,

            idvehiculo: this.state.idvehiculo,
            descripcion_vehiculo: this.state.descripcion_vehiculo,
            placa_vehiculo: this.state.placa_vehiculo,

            facturarsiempre: this.state.facturarsiempre,

            array_tablero_venta: this.state.array_tablero_venta,

            observacion: this.state.observacion,
            subtotal: this.state.subtotal,
            descuento_general: this.state.descuento_general,
            recargo_general: this.state.recargo_general,
            total_general: this.state.total_general,

            array_vehiculoparte: this.state.array_vehiculoparte,
            vehiculo_historia: this.state.vehiculo_historia,

            array_sucursal: this.state.array_sucursal,
            array_almacen: this.state.array_almacen,
            array_moneda: this.state.array_moneda,
            array_listaprecio: this.state.array_listaprecio,
            array_producto: this.state.array_producto,
            array_vendedor: this.state.array_vendedor,
            array_cliente: this.state.array_cliente,
            array_vehiculo: this.state.array_vehiculo,
            array_tipo_pago: this.state.array_tipo_pago,

            config_codigo: this.state.config_codigo,
            config_preciounitario: this.state.config_preciounitario,
            config_taller: this.state.config_taller,
            config_vehiculohistorial: this.state.config_vehiculohistorial,
            config_vehiculoparte: this.state.config_vehiculoparte,
            config_credito: this.state.config_credito,
            clienteesabogado: this.state.clienteesabogado,
            facturaactiva: this.state.facturaactiva,
            config_venta2pasos: this.state.config_venta2pasos
        };
    }
    onClose() {
        this.setState({
            visible: false,
        });
        setTimeout(() => {
            this.setState({
                loading: false,
                bandera: 0,
                vendedor: null,
                vendedor_contacto: [],
                cliente: null,
                cliente_contacto: [],
            });
        }, 500);
    }
    componentModalOption() {
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title={"Datos del " + ((isAbogado == 'A') ? 'Abogado' : 'Vendedor')}
                    onCancel={this.onClose.bind(this)}
                    width={850}
                    cancelText={'Aceptar'}
                    content={
                        <ShowVendedor
                            vendedor={this.state.vendedor}
                            referencia={this.state.vendedor_contacto}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Datos de Cliente"
                    onCancel={this.onClose.bind(this)}
                    width={850}
                    cancelText={'Aceptar'}
                    content={
                        <ShowCliente
                            contactoCliente={this.state.cliente_contacto}
                            cliente={this.state.cliente}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Cancelar Registrar Venta"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content={'¿Esta seguro de cancelar el registro de venta? Los datos ingresados se perderan.'}
                />
            );
        }
        if (this.state.bandera == 4) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Tipo de Pago"
                    onCancel={this.onClose.bind(this)}
                    onClose={this.onClose.bind(this)}
                    width={450}
                    zIndex={850}
                    content={
                        <div className="txts-center">
                            {this.state.array_tipo_pago.map(
                                (data, key) => (
                                    <C_Button key={key}
                                        style={{'marginTop': '-10px', 'marginBottom': '5px'}}
                                        title={data.descripcion}
                                        type='danger'
                                        onClick={this.optionPlanPago.bind(this, key, data.idtipocontacredito)}
                                    />
                                )
                            )}
                        </div>
                    }
                    footer={false}
                />
            );
        }
    }

    optionPlanPago(key, id) {
        switch (key) {
            case 0 :
                //this.validarData('contado');
                this.setState({
                    idtipocontacredito: id,
                });
                setTimeout(() => {
                    this.setState({
                        visible_contado: true,
                    });
                }, 1000);
                break;
            case 1 :
                var fechainiciopago = new Date(convertDmyToYmd(this.state.fecha));
                fechainiciopago.setMonth(fechainiciopago.getMonth() + 1);
                this.setState({
                    saldo_por_pagar: this.state.total_general,
                    idtipocontacredito: id,
                    fecha_inicio_pago: dateToString(fechainiciopago, 'f2'),
                });
                setTimeout(() => {
                    this.setState({
                        visible_pago: true,
                    });
                }, 1000);
                break;
        }
    }
    onSalir(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var objecto_data = {
                    on_create: null,
                    data_actual: null,
                    new_data: null,
                    validacion: null,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
            this.props.history.goBack();
        }, 300);
    }
    cargarProforma() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'venta_create',
                data_actual: this.on_data_component(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }

        var url = routes.venta_proforma;
        this.props.history.push(url);
    }
    onVehiculoHistoria() {
        if (this.state.idvehiculo != '') {

            var on_data = JSON.parse( readData(keysStorage.on_data) );

            this.state.vehiculo_historia.fecha = this.state.fecha;
            this.state.vehiculo_historia.precio = this.state.total_general;

            this.setState({
                vehiculo_historia: this.state.vehiculo_historia,
            });

            setTimeout(() => {
                if (this.validar_data(on_data)) {
                    var objecto_data = {
                        on_create: 'venta_create',
                        data_actual: this.on_data_component(),
                        new_data: null,
                        validacion: true,
                    };
    
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                    on_data = JSON.parse( readData(keysStorage.on_data) );
                }
    
                var url = routes.venta_vehiculohistoria;
                this.props.history.push(url);
            }, 200);

        }else {
            message.warning('Se debe seleccionar Vehiculo');
        }
    }
    btnHistorial() {
        if (this.permisions.btn_historial_veh.visible == 'A' && this.state.config_vehiculohistorial) {
            return (
                <C_Button
                    title='Historial Vehiculo'
                    type='primary'
                    onClick={this.onVehiculoHistoria.bind(this)}
                />
            );
        }
        return null;
    }
    onVehiculoParte() {
        if (this.state.idvehiculo != '') {

            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var objecto_data = {
                    on_create: 'venta_create',
                    data_actual: this.on_data_component(),
                    new_data: null,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                on_data = JSON.parse( readData(keysStorage.on_data) );
            }

            var url = routes.venta_vehiculoparte;
            this.props.history.push(url);

        }else {
            message.warning('Se debe seleccionar Vehiculo');
        }
    }
    btnPartes() {
        if (this.permisions.btn_partes_veh.visible == 'A' && this.state.config_vehiculoparte) {
            return (
                <C_Button
                    title='Partes Vehiculo'
                    type='primary'
                    onClick={this.onVehiculoParte.bind(this)}
                />
            );
        }
        return null;
    }
    onValidar_data() {
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        if (this.state.config_codigo && this.state.codigo.toString().trim().length === 0) {
            message.error('El codigo es requerido');
            return false;
        }
        if (this.state.idcliente == '') {
            message.error('Debe seleccionar un cliente');
            return false;
        }
        if (this.state.idvendedor == '') {
            var title = (isAbogado == 'A')?'Abogado':'Vendedor';
            message.error('Debe seleccionar un ' + title);
            return false;
        }

        let cantidad = 0;
        let data = this.state.array_tablero_venta;

        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == '') {
                cantidad++;
            }
            if (parseInt(data[i].cantidad) == 0 && data[i].idproducto != '') {
                message.error('Un producto no puede quedar con cantidad 0');
                return false;
            }
            if (parseFloat(data[i].preciounitario) == 0 && data[i].idproducto != '' && parseInt(data[i].cantidad) > 0) {
                message.error('Un producto no puede quedar con precio 0');
                return false;
            }
        }

        if (cantidad == this.state.array_tablero_venta.length) {
            message.error('Debe seleccionar un Producto por lo menos');
            return false;
        }

        return true;
    }
    onPagar() {
        if (this.onValidar_data()) {
            if (this.state.config_credito) {
                this.setState({
                    visible: true,
                    bandera: 4,
                });
            }else {
               this.setState({
                   visible_contado: true,
                   idtipocontacredito: 1,
               }); 
            }
        }
    }
    onCerrarPago() {
        var value = 0;
        let fehcaIniPago = new Date();
        fehcaIniPago.setMonth(fehcaIniPago.getMonth() + 1);

        var actualizar = () => {
            this.setState({
                visible_pago: false,
                anticipo: 0,
                saldo_por_pagar: value.toFixed(2),
                nro_cuota: 1,
                fecha_inicio_pago: dateToString(fehcaIniPago, 'f2'),
                tipo_periodo: 30,
                array_cuotas: [],
                idtipocontacredito: 0,
            });
        }

        Modal.confirm({
            title: 'Cancelar Plan de Pago',
            content: 'Al cancelar el plan de pagos se perderan todos los registros, ¿Desea continuar?',
            zIndex: 950,
            onOk() {
              actualizar();
            },
            onCancel() {
              
            },
        });
    }
    onChangeAnticipoPago(value) {
        value = (value == '')?0:value;
        if (!isNaN(value) && value >= 0) {
            var saldo = this.state.saldo_por_pagar;
            this.state.saldo_por_pagar = this.state.total_general - parseFloat(value);
            if (parseFloat(this.state.saldo_por_pagar) < 0) {
                message.warning('El anticipo no puede ser mayor al Total de Venta');
                this.setState({
                    saldo_por_pagar: saldo,
                });
            }else {
                this.setState({
                    anticipo: value,
                    saldo_por_pagar: parseFloat(this.state.saldo_por_pagar).toFixed(2),
                });
            }
        }
    }
    onChangeNroCuota(value) {
        value = (value == '')?1:value;
        if (!isNaN(value) && value > 0) {
            this.setState({
                nro_cuota: value,
            });
        }
    }
    onChangeFechaInicioPago(date) {
        this.setState({
            fecha_inicio_pago: date,
        });
    }
    onchangeTipoPeriodo(value) {
        this.setState({
            tipo_periodo: value,
        });
    }
    generarPlanPago() {
        if (this.state.saldo_por_pagar == 0 || this.state.nro_cuota < 1) {
            notification.error({
                message: 'Advertencia',
                description:
                  'No se pudo generar el plan pago favor de revisar los datos...',
               
              });
              this.setState({
                  array_cuotas: [],
              });
        }else {
            let array = [];
            let suma = 0;
            for (let i = 0; i < this.state.nro_cuota; i++) {

                var fecha = stringToDate(this.state.fecha_inicio_pago, 'f2');
                fecha.setDate(fecha.getDate() + (parseInt(this.state.tipo_periodo) * i));
                var fechaAmostrar = dateToString(fecha, 'f2');

                let cuota = (this.state.saldo_por_pagar / this.state.nro_cuota).toFixed(2);
                suma = suma + parseFloat(cuota);
                let saldo = (this.state.saldo_por_pagar - ((this.state.saldo_por_pagar/this.state.nro_cuota) * (i + 1))).toFixed(2);
                let cuotas = {
                    Nro: i + 1,
                    descripcion: "Cuota Nro. " + (i + 1),
                    FechaApagar: fechaAmostrar,
                    fechastore: dateToString(fecha),
                    montoPagar: cuota,
                    saldo: saldo,
                }
                array.push(cuotas);
            }
            if (array.length > 1) {
                array[array.length - 2].saldo = parseFloat(parseFloat(array[array.length - 1].montoPagar) + parseFloat(this.state.saldo_por_pagar - suma)).toFixed(2);
            }
            array[array.length - 1].montoPagar = parseFloat(parseFloat(array[array.length - 1].montoPagar) + parseFloat(this.state.saldo_por_pagar - suma)).toFixed(2);
            this.setState({
                array_cuotas: array,
            });
        }
    }
    modificarFechaPlan(index, date) {
        var fecha = new Date();
        fecha = dateToString(fecha, 'f2');

        var fecha_actual = stringToDate(fecha, 'f2');
        var fecha_modificada = stringToDate(date, 'f2');

        //if (fecha_modificada.getTime() >= fecha_actual.getTime()) {
            var data = this.state.array_cuotas;
            for (let i = 0; i < data.length; i++) {
                if (i == index) {
                    if (i == 0) {
                        if (i == (data.length - 1)) {
                            data[i].FechaApagar = date;
                            data[i].fechastore = convertDmyToYmd(date);
                        }else {
                            var fecha_posterior = stringToDate(data[i + 1].FechaApagar, 'f2');
                            if (fecha_modificada.getTime() < fecha_posterior.getTime()) {
                                data[i].FechaApagar = date;
                                data[i].fechastore = convertDmyToYmd(date);
                            }else {
                                message.warning('La fecha debe ser menor a la fecha posterior...');
                            }
                        }
                        
                    }else {
                        if (i == (data.length - 1)) {
                            var fecha_anterior = stringToDate(data[i - 1].FechaApagar, 'f2');
                            if (fecha_modificada.getTime() > fecha_anterior.getTime()) {
                                data[i].FechaApagar = date;
                                data[i].fechastore = convertDmyToYmd(date);
                            }else {
                                message.warning('La fecha debe ser mayor a la fecha anterior...');
                            }
                        }else {
                            var fecha_anterior = stringToDate(data[i - 1].FechaApagar, 'f2');
                            var fecha_posterior = stringToDate(data[i + 1].FechaApagar, 'f2');
                            if ((fecha_modificada.getTime() > fecha_anterior.getTime()) && (fecha_modificada.getTime() < fecha_posterior.getTime())) {
                                data[i].FechaApagar = date;
                                data[i].fechastore = convertDmyToYmd(date);
                            }else {
                                if (fecha_modificada.getTime() <= fecha_anterior.getTime()) {
                                    message.warning('La fecha debe ser mayor a la fecha anterior...');
                                }
                                if (fecha_modificada.getTime() >= fecha_posterior.getTime()) {
                                    message.warning('La fecha debe ser menor a la fecha posterior...');
                                }
                            }
                        }
                    }
                }
            }
            this.setState({
                array_cuotas: this.state.array_cuotas,
            });
        // }else {
        //     message.warning('No se permite fecha menor a la actual...');
        // }
    }
    modificarMonto(index, value) {

        if (value < 0) return;

        let monto = (value == '')?0:value;

        let saldoAnterior = index == 0 ? this.state.saldo_por_pagar : this.state.array_cuotas[index - 1].saldo;
        this.state.array_cuotas[index].montoPagar = monto == 0 ? 0 : monto;
        let auxSaldo = parseFloat(saldoAnterior) - parseFloat(monto);

        if (auxSaldo < 0) {
            message.warning('Numero no valido, el saldo da negativo');
            return;
        }

        let valorDefault = index == 0 ? parseFloat(this.state.saldo_por_pagar/this.state.nro_cuota - 1) : this.state.array_cuotas[index - 1].montoPagar;
        this.state.array_cuotas[index].saldo = auxSaldo.toFixed(2);
        let porcion = (parseFloat(valorDefault) - parseFloat(monto)) / (this.state.array_cuotas.length - index - 1);
        let length = this.state.array_cuotas.length;

        for (let i = index + 1; i < length ; i++) {

            let montoPagarActual = parseFloat(valorDefault) + porcion;
            let saldoAnterior = parseFloat(this.state.array_cuotas[i - 1].saldo);

            if (montoPagarActual > saldoAnterior || montoPagarActual < 0) {
                montoPagarActual = saldoAnterior;
            }
            this.state.array_cuotas[i].montoPagar = montoPagarActual.toFixed(2);
            let saldo = saldoAnterior - montoPagarActual;
            this.state.array_cuotas[i].saldo = saldo.toFixed(2);

        }

        var index = this.state.array_cuotas.length - 1;
        var val = parseFloat(this.state.array_cuotas[index].montoPagar);
        var saldo = parseFloat(this.state.array_cuotas[index].saldo);

        if (saldo != 0 && saldo > 0) {
            var result = val + saldo;
            this.state.array_cuotas[index].montoPagar = result.toFixed(2); 
            this.state.array_cuotas[index].saldo = 0; 
        }

        this.setState({
            array_cuotas: this.state.array_cuotas,
        });

    }
    componentDetPago() {
        return (
            <div className="forms-groups">
                <C_Input 
                    title="Total Monto a Pagar"
                    value={this.state.total_general}
                    readOnly={true}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom borderRigth"
                    style={{ textAlign: 'right', paddingRight: 20 }}
                />
                <C_Input 
                    title="Anticipo"
                    value={this.state.anticipo} 
                    onChange={this.onChangeAnticipoPago.bind(this)}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom borderRigth"
                    style={{ textAlign: 'right', paddingRight: 20, margin: 0}}
                    number={true}
                />
                <C_Input 
                    title="Saldo a Pagar"
                    value={this.state.saldo_por_pagar}
                    readOnly={true}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom borderRigth"
                    style={{ textAlign: 'right', paddingRight: 20 }}
                />

                <C_Input 
                    title="Numero de Cuotas"
                    value={this.state.nro_cuota} 
                    onChange={this.onChangeNroCuota.bind(this)}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom borderRigth"
                    style={{ textAlign: 'right', paddingRight: 20, margin: 0}}
                    number={true}
                />
                <C_DatePicker
                    allowClear={false}
                    value={this.state.fecha_inicio_pago}
                    onChange={this.onChangeFechaInicioPago.bind(this)}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom borderRigth"
                />
                <C_Select 
                    title="Tipo Periodo"
                    value={this.state.tipo_periodo}
                    onChange={this.onchangeTipoPeriodo.bind(this)}
                    component={[
                        <Option key={0} value={1}>Diario</Option>,
                        <Option key={1} value={7}>Semanal</Option>,
                        <Option key={2} value={30}>Mensual</Option>
                    ]}
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal borderRigth"
                />
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="txts-center">
                        <button 
                            type="button" 
                            className="btn-content btn-success-content" 
                            onClick={this.generarPlanPago.bind(this)}
                        >
                            Generar Plan Pago
                        </button>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom">
                    <div className="table-detalle" style={{ overflow: 'auto', }}>
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
                                {this.state.array_cuotas.map((item, key) => {
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
                                                    value={item.FechaApagar}
                                                    allowClear={false}
                                                    onChange={this.modificarFechaPlan.bind(this, key)}
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
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div style={{textAlign: 'right', paddingRight: 5, }}>
                            {(this.state.array_cuotas.length == 0)?null:
                                <C_Button
                                    title={'Guardar'}
                                    type='primary'
                                    onClick={this.validarCuotas.bind(this)}
                                />
                            }
                            <C_Button
                                title={'Cancelar'}
                                type='danger'
                                onClick={this.onCerrarPago.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    validarCuotas() {
        let data = this.state.array_cuotas;
        for (let i = 0; i < data.length; i++) {
            if (data[i].montoPagar == '' || parseFloat(data[i].montoPagar) < 1) {
                notification.error({
                message: 'Advertencia',
                description:
                    'No se pudo generar el plan pago. Favor de revisar los datos...',
                
                });
                return;
            }
        }
        //this.state.t
        this.setState({
            visible_credito: true,
            //fkitipo
        });
    }
    onCerrarContado() {
        this.setState({
            visible_contado: false,
            idtipocontacredito: 0,
            loading_contado: false,
        });
    }
    onCerrarCredito() {
        this.setState({
            visible_credito: false,
            idtipocontacredito: 0,
            loading_credito: false,
        });
    }
    onSubmitVenta() {

        if (this.state.idtipocontacredito == 1) {
            this.setState({
                loading_contado: true,
            });
        }else {
            this.setState({
                loading_credito: true,
            });
        }

        var hora = new Date();

        var ventadetalle = [];
        var idsProductos = [];

        for (let i = 0; i < this.state.array_tablero_venta.length ; i++) {

            var producto = this.state.array_tablero_venta[i];

            if ((producto.idproducto != '') && (producto.preciounitario > 0) && (producto.cantidad > 0)) {
                var detalle = {
                    cantidad: parseInt(producto.cantidad),
                    precioUnit: parseFloat(producto.preciounitario),
                    factor: parseFloat(producto.descuento),
                    tipo: producto.tipo,
                    fkidalmacenprodetalle: parseInt(producto.idalmacenprodetalle),
                    fkidlistaproddetalle: parseInt(producto.idlistapreproducdetalle),
                    idProducto: parseInt(producto.idproducto)
                }
                ventadetalle.push(detalle);
                idsProductos.push(producto.idproducto);
            }
        }

        let fechaNow = new Date();
        var fecha_actual = convertDmyToYmd(dateToString(fechaNow, 'f2'));

        let body = {
            fecha_actual: fecha_actual,
            codigoventa: this.state.codigo,
            fechaventa: convertDmyToYmd(this.state.fecha),
            estado: 'V',
            recargoVenta: isNaN(this.state.recargo_general) ? 0 : parseFloat(this.state.recargo_general),
            descuentoVenta: isNaN(this.state.descuento_general) ? 0 : parseFloat(this.state.descuento_general),
            nota: this.state.observacion,
            //estadoProceso: 'E',
            fechaHoraFin: null,
            idusuario: 1,
            fkidsucursal: this.state.idsucursal,
            fkidcliente: this.state.idcliente,
            fkidvendedor: this.state.idvendedor,
            idmoneda: this.state.idmoneda,
            facturarsiempre: this.state.facturarsiempre,
            nitcliente: this.state.nitcliente,
            namecliente: this.state.namecliente,
            valor_cambio: this.state.valor_cambio,
            
            fkidvehiculo: this.state.idvehiculo == '' ? null : this.state.idvehiculo,
            fkidtipocontacredito: this.state.idtipocontacredito,
            fkidtipotransacventa: 1,
            hora: hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
            comision: parseFloat(this.state.comision_vendedor),
            

            arrayventadetalle: JSON.stringify(ventadetalle),
            condicion: this.state.idtipocontacredito == 1 ?'contado': 'credito', 
            anticipo: null,

            subtotal: this.state.subtotal,
            
            totalventa: this.state.total_general,
            montocobrado: this.state.config_venta2pasos ? 0 : this.state.anticipo,

            vehiculoParte: JSON.stringify(this.state.array_vehiculoparte.idvehiculoparte),
            cantidadParteVehiculo: JSON.stringify(this.state.array_vehiculoparte.cantidad),
            estadoParteVehiculo: JSON.stringify(this.state.array_vehiculoparte.estado),
            observacionParteVehiculo: JSON.stringify(this.state.array_vehiculoparte.observacion),
            imagenParteVehiculo: JSON.stringify(this.state.array_vehiculoparte.imagen),

            historialVehiculo: JSON.stringify(this.state.vehiculo_historia),

        };

        if (this.state.idtipocontacredito == 2) {
            var sumaPlan = 0;
            
            for (let i = 0; i < this.state.array_cuotas.length; i++) {
                sumaPlan = sumaPlan + parseFloat(this.state.array_cuotas[i].montoPagar);
            }
            let diferencia = sumaPlan > this.state.saldo_por_pagar ? sumaPlan - this.state.saldo_por_pagar : this.state.saldo_por_pagar - sumaPlan;
            if (diferencia < 1) {

                body.planPago = JSON.stringify(this.state.array_cuotas);
                body.anticipo = parseFloat(this.state.anticipo);
                body.estadoProceso = 'F';
                body.estadoPlan = 'I';
                body.fkidtipocontacredito = 2;
                message.success("Plan de Pago Correcto");

            } else {
                message.error("plan de Pago Incorrecto");
            }
        }

        //console.log('BODY ', body);
        httpRequest('post', ws.wsventa, body)
        .then(result => {
            console.log(result)
            if (result.response == 1) {

                if (result.bandera == 1) {
                    notification.error({
                        message: 'Advertencia',
                        description:
                            'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                    
                    });
                }

                var facturarsiempre = this.state.facturarsiempre;

                if (this.state.idtipocontacredito == 1) {
                    this.setState({
                        loading_contado: false,
                        visible_contado: false,
                        idventa: result.idventa,
                        facturarsiempre: this.state.config_venta2pasos ? 'N' : result.bandera == 1 ? 'N' : facturarsiempre ,
                        checked_generarfactura_ok: this.state.config_venta2pasos ? false :  result.bandera == 1 ? false : facturarsiempre == 'S' ? true : false ,
                        checked_generarfactura_cancel: this.state.config_venta2pasos ? true : result.bandera == 1 ? true : facturarsiempre == 'S' ? false : true ,
                    });
                }else {
                    this.setState({
                        loading_credito: false,
                        visible_credito: false,
                        idventa: result.idventa,
                        facturarsiempre: 'N' ,
                    });
                }

                setTimeout(() => {
                    
                    this.setState({
                        visible_imprimir: true,
                    });
                }, 600);


                message.success("Se inserto correctamente");
            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                console.log('Ocurrio un problema en el servidor');
                console.log(result.error);
                this.setState({
                    loading: false,
                })
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                modalOk: false,
                loadingOk: false
            })
        });

    }

    onCerrarImprimir() {
        this.setState({
            loading_imprimir: true,
        });
        setTimeout(() => {
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var objecto_data = {
                    on_create: null,
                    data_actual: null,
                    new_data: null,
                    validacion: null,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
            this.props.history.goBack();
        }, 300);
    }

    ongenerarRecibo(event) {
        event.preventDefault();

        this.setState({
            loading_imprimir: true,
        });

        if (this.state.checked_imprimir_ok || this.state.checked_generarfactura_ok) {

            let body = {
                idventa: this.state.idventa,
                facturarsiempre: this.state.facturarsiempre,
                nitcliente: this.state.nitcliente,
                namecliente: this.state.namecliente,
                fkidtipocontacredito: this.state.idtipocontacredito,
                generarfactura: this.state.checked_generarfactura_ok?'A':'N',
                bandera: 0,
            }

            httpRequest('post', ws.wsdetalleventa_recibo, body)
            .then(result => {
                if (result.response == 1) {

                    this.setState({
                        venta_first: result.venta,
                        venta_detalle: result.venta_detalle,
                        planpago: result.planpago,
                        config_cliente: result.configcliente,
                        factura: result.factura,
                    });

                    if (result.bandera == 1) {
                        notification.error({
                            message: 'Advertencia',
                            description:
                                'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                        });
                    }

                    if (this.state.facturarsiempre == 'S') {
                        if (result.bandera == 1) {
                            setTimeout(() => {
                                document.getElementById('imprimir_recibo').submit();
                            }, 600);
                        }else {
                            setTimeout(() => {
                                document.getElementById('imprimir_factura').submit();
                            }, 800);
                        }
                    }else {
                        if (this.state.checked_generarfactura_ok) {
                            if (result.bandera == 1) {
                                setTimeout(() => {
                                    document.getElementById('imprimir_recibo').submit();
                                }, 600);
                            }else {
                                setTimeout(() => {
                                    document.getElementById('imprimir_factura').submit();
                                }, 600);
                            }
                        }else {
                            setTimeout(() => {
                                document.getElementById('imprimir_recibo').submit();
                            }, 600);
                        }
                    }

                    setTimeout(() => {
                        var on_data = JSON.parse( readData(keysStorage.on_data) );
                        if (this.validar_data(on_data)) {
                            var objecto_data = {
                                on_create: null,
                                data_actual: null,
                                new_data: null,
                                validacion: null,
                            };
                            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                        }
                        this.props.history.goBack();
                    }, 1400);

                } else if (result.response == -2) {
                    this.setState({ noSesion: true, });
                } else {
                    console.log('Ocurrio un problema en el servidor');
                    this.setState({
                        loading: false,
                    })
                }
            }).catch(error => {
                message.error(strings.message_error);
            });

        }else {
            this.setState({
                loading_imprimir: true,
            });
            setTimeout(() => {
                var on_data = JSON.parse( readData(keysStorage.on_data) );
                if (this.validar_data(on_data)) {
                    var objecto_data = {
                        on_create: null,
                        data_actual: null,
                        new_data: null,
                        validacion: null,
                    };
                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                }
                this.props.history.goBack();
            }, 300);
        }
    }
    componentReciboVenta() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">

                    {((this.state.facturarsiempre == 'P' || this.state.facturarsiempre == 'S') && !this.state.config_venta2pasos)?
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <C_Input className=''
                                    value={'Generar factura: '}
                                    style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Si'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedGenerarFacturaOk.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedGenerarFacturaOk.bind(this)}
                                            checked={this.state.checked_generarfactura_ok}
                                        />
                                    }
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'No'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedGenerarFacturaCancel.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedGenerarFacturaCancel.bind(this)}
                                            checked={this.state.checked_generarfactura_cancel}
                                        />
                                    }
                                />
                            </div>
                        </div>: null

                    }

                    { (this.state.facturarsiempre == 'S') ? null :  

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <C_Input className=''
                                    value={'Imprimir Nota de venta: '}
                                    style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Si'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedImprimirOk.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedImprimirOk.bind(this)}
                                            checked={this.state.checked_imprimir_ok}
                                        />
                                    }
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'No'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedImprimirCancel.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedImprimirCancel.bind(this)}
                                            checked={this.state.checked_imprimir_cancel}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    }
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div style={{textAlign: 'right', paddingRight: 5, }}>
                        <C_Button
                            title={'Aceptar'}
                            type='primary'
                            onClick={this.ongenerarRecibo.bind(this)}
                        />  
                        <C_Button
                            title={'Cancelar'}
                            type='danger'
                            onClick={this.onCerrarImprimir.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
    onChangeCheckedImprimirOk() {
        if (this.state.checked_imprimir_ok) {
            this.setState({
                checked_imprimir_ok: false,
                checked_imprimir_cancel: true,
            });
        }else {
            this.setState({
                checked_imprimir_ok: true,
                checked_imprimir_cancel: false,
            });
        }
    }
    onChangeCheckedImprimirCancel() {
        if (this.state.checked_imprimir_cancel) {
            this.setState({
                checked_imprimir_ok: true,
                checked_imprimir_cancel: false,
            });
        }else {
            this.setState({
                checked_imprimir_ok: false,
                checked_imprimir_cancel: true,
            });
        }
    }
    onChangeCheckedGenerarFacturaOk() {
        if (this.state.checked_generarfactura_ok) {
            this.setState({
                checked_generarfactura_ok: false,
                checked_generarfactura_cancel: true,
            });
        }else {
            this.setState({
                checked_generarfactura_ok: true,
                checked_generarfactura_cancel: false,
            });
        }
    }
    onChangeCheckedGenerarFacturaCancel() {
        if (this.state.checked_generarfactura_cancel) {
            this.setState({
                checked_generarfactura_ok: true,
                checked_generarfactura_cancel: false,
            });
        }else {
            this.setState({
                checked_generarfactura_ok: false,
                checked_generarfactura_cancel: true,
            });
        }
    }
    render() {
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        let producto_servicio = (isAbogado == 'A') ? 'Servicio' : 'Producto';

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

        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        const buttonAddShowCliente = this.buttonAddShowCliente();
        const buttonAddShowVendedor = this.buttonAddShowVendedor();

        const btnHistorial = this.btnHistorial();
        const btnPartes = this.btnPartes();

        let fechaNew = new Date();
        var fecha_actualNew = convertDmyToYmd(dateToString(fechaNew, 'f2'));

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                {this.componentModalOption()}
                {this.componentShowProductoAlmacen()}

                <Confirmation
                    visible={this.state.visible_imprimir}
                    loading={this.state.loading_imprimir}
                    title="Finalizar Venta"
                    zIndex={950}
                    width={500}
                    content={this.componentReciboVenta()}
                    footer={false}
                />

                <Confirmation
                    visible={this.state.visible_pago}
                    title="Plan De Pago"
                    onCancel={this.onCerrarPago.bind(this)}
                    width={780}
                    zIndex={900}
                    content={this.componentDetPago()}
                    footer={false}
                />

                <Confirmation
                    visible={this.state.visible_contado}
                    title="Registrar Venta"
                    loading={this.state.loading_contado}
                    onCancel={this.onCerrarContado.bind(this)}
                    onClick={this.onSubmitVenta.bind(this)}
                    width={350}
                    zIndex={950}
                    content={'Estas seguro de registrar la venta?'}
                />

                <Confirmation
                    visible={this.state.visible_credito}
                    loading={this.state.loading_credito}
                    title="Registrar Venta"
                    onCancel={this.onCerrarCredito.bind(this)}
                    onClick={this.onSubmitVenta.bind(this)}
                    zIndex={950}
                    width={350}
                    content={'Estas seguro de registrar la venta?'}
                />

                <form target="_blank" id='imprimir_recibo' method="post" action={routes.reporte_venta_recibo} >

                    <input type="hidden" value={_token} name="_token" />
                    <input type="hidden" value={conexion} name="x_conexion" />
                    <input type="hidden" value={usuario} name="usuario" />

                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                    <input type="hidden" value={x_login} name="x_login" />
                    <input type="hidden" value={x_fecha} name="x_fecha" />
                    <input type="hidden" value={x_hora} name="x_hora" />
                    <input type="hidden" value={token} name="authorization" />
                    <input type="hidden" value={JSON.stringify(this.permisions)} name="permisos" />
                    <input type="hidden" value={(this.state.clienteesabogado)?'A':'V'} name="clienteesabogado" />

                    <input type='hidden' value={this.state.idventa} name='idventa' />

                    <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                    <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                    <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                    <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                </form>

                <form target="_blank" id='imprimir_factura' method="post" action={routes.reporte_venta_factura} >

                    <input type="hidden" value={_token} name="_token" />
                    <input type="hidden" value={conexion} name="x_conexion" />
                    <input type="hidden" value={usuario} name="usuario" />

                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                    <input type="hidden" value={x_login} name="x_login" />
                    <input type="hidden" value={x_fecha} name="x_fecha" />
                    <input type="hidden" value={x_hora} name="x_hora" />
                    <input type="hidden" value={token} name="authorization" />
                    <input type="hidden" value={JSON.stringify(this.permisions)} name="permisos" />
                    <input type="hidden" value={(this.state.clienteesabogado)?'A':'V'} name="clienteesabogado" />

                    <input type='hidden' value={this.state.idventa} name='idventa' />

                    <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                    <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                    <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                    <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                </form>

                <div className="cards" style={{'padding': 0,}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Venta</h1>
                        </div>
                        <div className="pulls-right">
                            <C_Input 
                                value={'TC: ' + parseFloat(this.state.valor_cambio).toFixed(2) }
                                readOnly={true}
                                className=''
                                style={{width: 100, background: 'none', textAlign: 'right', paddingRight: 10, }}
                            />
                        </div>
                    </div>
                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal">
                            {(this.state.inicio_venta)?
                                <C_Button
                                    title='Cargar Proforma'
                                    type='primary'
                                    onClick={this.cargarProforma.bind(this)}
                                    permisions={this.permisions.btn_cargar_proforma}
                                />:null
                            }
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.codigo}
                                onChange={this.onChangeCodigo.bind(this)}
                                title='Codigo'
                                validar={this.state.validar_codigo}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.config_codigo}
                                mensaje='El codigo ya existe'
                            />
                            <C_DatePicker
                                allowClear={false}
                                value={this.state.fecha}
                                onChange={this.onChangeFecha.bind(this)}
                                permisions={this.permisions.fecha}
                            />
                            <C_Select
                                value={this.state.idsucursal}
                                title={"Sucursal"}
                                onChange={this.onChangeSucursal.bind(this)}
                                component={this.componentSucursal()}
                                permisions={this.permisions.sucursal}
                            />
                            <C_Select
                                value={this.state.idalmacen}
                                title={"Almacen"}
                                onChange={this.onChangeAlmacen.bind(this)}
                                component={this.componentAlmacen()}
                                permisions={this.permisions.almacen}
                            />
                        </div>
                        
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            { buttonAddShowCliente }
                            <C_Select
                                showSearch={true}
                                value={this.state.idcliente}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Codigo Cliente'}
                                onSearch={this.onSearchIDCliente.bind(this)}
                                onChange={this.onchangeIDCliente.bind(this)}
                                component={this.componentClienteCodID()}
                                allowDelete={(this.state.idcliente == '')?false:true}
                                onDelete={this.onDeleteClienteID.bind(this)}
                                permisions={this.permisions.cli_cod}
                                className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal'
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idcliente}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Nombre Cliente'}
                                onSearch={this.onSearchNombreCliente.bind(this)}
                                onChange={this.onchangeIDCliente.bind(this)}
                                component={this.componentClienteNombre()}
                                allowDelete={(this.state.idcliente == '')?false:true}
                                onDelete={this.onDeleteClienteID.bind(this)}
                                permisions={this.permisions.cli_nomb}
                                className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                            />
                            <C_Input
                                title="NIT"
                                value={this.state.nitcliente}
                                permisions={this.permisions.cli_nit}
                                onChange={(event) => this.setState({nitcliente: event,})}
                                readOnly={(this.state.idcliente == '')?true:false}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1"></div>
                            <C_Select
                                showSearch={true}
                                value={this.state.idvehiculo}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Codigo Vehiculo'}
                                onSearch={this.onSearchIDVehiculo.bind(this)}
                                onChange={this.onchangeIDVehiculo.bind(this)}
                                component={this.componentVehiculoCodID()}
                                allowDelete={(this.state.idvehiculo == '')?false:true}
                                onDelete={this.onDeleteVehiculoID.bind(this)}
                                permisions={this.permisions.veh_cod_id}
                                className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal'
                                configAllowed={this.state.config_taller}
                                readOnly={(this.state.idcliente == '')?true:false}
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idvehiculo}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Placa vehiculo'}
                                onSearch={this.onSearchPlacaVehiculo.bind(this)}
                                onChange={this.onchangeIDVehiculo.bind(this)}
                                component={this.componentVhiculoPlaca()}
                                allowDelete={(this.state.idvehiculo == '')?false:true}
                                onDelete={this.onDeleteVehiculoID.bind(this)}
                                permisions={this.permisions.veh_placa}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                                configAllowed={this.state.config_taller}
                                readOnly={(this.state.idcliente == '')?true:false}
                            />
                            <C_Input
                                title="Descripcion"
                                value={this.state.descripcion_vehiculo}
                                permisions={this.permisions.veh_desc}
                                readOnly={true}
                                configAllowed={this.state.config_taller}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />
                        </div>
                        
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            {buttonAddShowVendedor}
                            <C_Select
                                showSearch={true}
                                value={this.state.idvendedor}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Codigo ' + ((isAbogado == 'A') ? 'Abogado' : 'Vendedor')}
                                onSearch={this.onSearchIDVendedor.bind(this)}
                                onChange={this.onchangeIDVendedor.bind(this)}
                                component={this.componentVendedorCodID()}
                                allowDelete={(this.state.idvendedor == '')?false:true}
                                onDelete={this.onDeleteVendedorID.bind(this)}
                                permisions={this.permisions.vend_cod}
                                className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal'
                            />
                            <C_Select
                                showSearch={true}
                                value={this.state.idvendedor}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                title={'Nombre ' + ((isAbogado == 'A') ? 'Abogado' : 'Vendedor')}
                                onSearch={this.onSearchNombreVendedor.bind(this)}
                                onChange={this.onchangeIDVendedor.bind(this)}
                                component={this.componentVendedorName()}
                                allowDelete={(this.state.idvendedor == '')?false:true}
                                onDelete={this.onDeleteVendedorID.bind(this)}
                                permisions={this.permisions.vend_nomb}
                                className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                            />
                            <C_Input
                                title="Comision"
                                value={this.state.comision_vendedor}
                                onChange={this.onChangeComisionVendedor.bind(this)}
                                permisions={this.permisions.vend_comision}
                                readOnly={(this.state.idvendedor == '')?true:false}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-2 cols-md-2"></div>
                            <C_Select
                                showSearch={true}
                                value={this.state.idlistaprecio}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.handleSearchListaPrecio.bind(this)}
                                onChange={this.onChangeListaPrecio.bind(this)}
                                component={this.componentListaPrecio()}
                                title='Lista Precios'
                                permisions={this.permisions.lista_precio}
                                className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Select
                                value={this.state.idmoneda}
                                title={"Moneda"}
                                onChange={this.onChangeMoneda.bind(this)}
                                component={this.componentMoneda()}
                                permisions={this.permisions.moneda}
                            />
                        </div>
                    </div>
                    
                    <div className="table_index_comerce">
                        
                        <div className="cabecera_comerce">

                            <C_Input className=''
                                readOnly={true}
                                style={{width: 110, minWidth: 110, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Cod Producto'}
                                permisions={this.permisions.t_prod_cod}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: (this.permisions.t_lista_precios.visible == 'A') ? (!this.state.clienteesabogado) ? 210: 280 : (!this.state.clienteesabogado) ? 390: 460, 
                                    minWidth: (this.permisions.t_lista_precios.visible == 'A') ? (!this.state.clienteesabogado) ? 210: 280 : (!this.state.clienteesabogado) ? 390: 460, 
                                    height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Producto'}
                                permisions={this.permisions.t_prod_desc}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 70, minWidth: 70, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Unid. Med.'}
                                configAllowed={!this.state.clienteesabogado}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 70,  minWidth: 70, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Cantidad'}
                                permisions={this.permisions.t_cantidad}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 180, minWidth: 180, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Lista Precio'}
                                permisions={this.permisions.t_lista_precios}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: (this.permisions.t_descuento.visible == 'A') ? 90 : 150, 
                                    minWidth: (this.permisions.t_descuento.visible == 'A') ? 90 : 150, 
                                    height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Precio Unit'}
                                permisions={this.permisions.t_precio_unit}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 60, minWidth: 60, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'%Dcto.'}
                                permisions={this.permisions.t_descuento}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 90, minWidth: 90, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Precio Total'}
                            />
                            <div style={{width: 35, minWidth: 35, height: 30, background: 'transparent', margin: 10, marginBottom: -2,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <C_Button
                                    title={<i className="fa fa-plus"></i>}
                                    type='primary' size='small' style={{padding: 3, }}
                                    onClick={this.addRowIndex.bind(this)}
                                />
                            </div>
                            

                        </div>

                        <div className="body_commerce">
                            {this.state.array_tablero_venta.map(
                                (data, key) => (
                                    <div style={{width: '100%', display: 'flex', borderBottom: '1px solid #e8e8e8', paddingTop: 8, paddingBottom: 8, position: 'relative'}} key={key} >
                                        {(data.alert == -1)?
                                            <div className='alert_commerce'>
                                                Agotado
                                            </div>:null
                                        }
                                        <C_Select
                                            showSearch={true}
                                            value={data.idproducto}
                                            placeholder="Id"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={this.onSearchProductoID.bind(this, key)}
                                            onChange={this.onchangeProductoID.bind(this, key)}
                                            component={this.componentProductoCodID(key)}
                                            allowDelete={(data.idproducto == '')?false:true}
                                            onDelete={this.onDeleteProductoID.bind(this, key)}
                                            permisions={this.permisions.t_prod_cod}
                                            style={{width: 100, minWidth: 100, margin: 10, }}
                                            className=''
                                        />
                                        <C_Select
                                            showSearch={true}
                                            value={data.idproducto}
                                            placeholder="Descripcion"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={this.onSearchProductoDesc.bind(this, key)}
                                            onChange={this.onchangeProductoID.bind(this, key)}
                                            component={this.componentProductoDescripcion(key)}
                                            allowDelete={(data.idproducto == '')?false:true}
                                            onDelete={this.onDeleteProductoID.bind(this, key)}
                                            permisions={this.permisions.t_prod_desc}
                                            style={{width: (this.permisions.t_lista_precios.visible == 'A') ? (!this.state.clienteesabogado) ? 210: 270 : (!this.state.clienteesabogado) ? 370: 440, 
                                                minWidth: (this.permisions.t_lista_precios.visible == 'A') ? (!this.state.clienteesabogado) ? 210: 270 : (!this.state.clienteesabogado) ? 370: 440, 
                                                margin: 10, 
                                            }}
                                            className=''
                                        />
                                        <C_Input className=''
                                            value={data.unidadmedida}
                                            readOnly={true}
                                            style={{ width: 60, minWidth: 60, textAlign: 'right', paddingRight: 5, margin: 10, }}
                                            configAllowed={!this.state.clienteesabogado}
                                        />
                                        <C_Input className=''
                                            value={data.cantidad}
                                            onChange={this.onChangeCantidadIndex.bind(this, key)}
                                            permisions={this.permisions.t_cantidad}
                                            style={{width: 60, minWidth: 60, textAlign: 'right', paddingRight: (data.tipo == '')?5:18, margin: 10, }}
                                            readOnly={(data.tipo == '')?true:false}
                                            number={true}
                                        />
                                        <C_Select
                                            showSearch={true}
                                            value={data.idlistaprecio}
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={this.onChangeSearchListaPrecio.bind(this, key)}
                                            onChange={this.onChangeListaPrecioIndex.bind(this, key)}
                                            component={this.componentListaPrecioTablero(key)}
                                            permisions={this.permisions.t_lista_precios}
                                            style={{ width: 170, margin: 10, }}
                                            className=''
                                        />
                                        <C_Input className=''
                                            value={data.preciounitario}
                                            onChange={this.onChangePrecioUnitarioIndex.bind(this, key)}
                                            permisions={this.permisions.t_precio_unit}
                                            style={{width: (this.permisions.t_descuento.visible == 'A') ? 80 : 130, 
                                                minWidth: (this.permisions.t_descuento.visible == 'A') ? 80 : 130, 
                                                textAlign: 'right', paddingRight: 18, margin: 10, 
                                            }}
                                            readOnly={(data.tipo == '' || !this.state.config_preciounitario)?true:false}
                                            number={true}
                                        />
                                        <C_Input className=''
                                            value={data.descuento}
                                            onChange={this.onChangeDescuentoIndex.bind(this, key)}
                                            permisions={this.permisions.t_descuento}
                                            style={{width: 50, minWidth: 50, textAlign: 'right', paddingRight: (data.tipo == '')?5:18, margin: 10, }}
                                            readOnly={(data.tipo == '')?true:false}
                                            number={true}
                                        />
                                        <C_Input className=''
                                            value={data.preciototal}
                                            readOnly={true}
                                            style={{width: 80, minWidth: 80, textAlign: 'right', paddingRight: 5, margin: 10, }}
                                        />
                                        <div style={{width: 35, minWidth: 35, height: 33, background: 'transparent', margin: 10, 
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: 4,}}>
                                            <C_Button
                                                title={<i className="fa fa-remove"></i>}
                                                type='danger' size='small' style={{padding: 3, }}
                                                onClick={this.removeRowIndex.bind(this, key)}
                                            />
                                            { this.state.clienteesabogado ? null : 
                                                <C_Button
                                                    title={<i className="fa fa-eye"></i>}
                                                    type='danger' size='small' style={{padding: 3, }}
                                                    onClick={this.showProductoRowIndex.bind(this, data, key)}
                                                />
                                            }
                                        </div>

                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea
                                title="Observaciones"
                                value={this.state.observacion} 
                                onChange={this.onChangeObservacion.bind(this)}
                                permisions={this.permisions.observaciones}
                                className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12 pt-bottom'
                            />
                            <div className='cols-lg-1 cols-md-1'></div>
                            <div className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom' 
                                style={{paddingLeft: 15, paddingRight: 15, border: '2px solid #e8e8e8', 
                                    borderRadius: 4, paddingTop: 10,
                                }}
                            >
                                <C_Input
                                    title="Sub Total"
                                    value={this.state.subtotal}
                                    readOnly={true}
                                    style={{paddingRight: 20, textAlign: 'right', }}
                                    permisions={this.permisions.sub_total}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal'
                                />
                                <C_Input
                                    title="% Desc"
                                    value={this.state.descuento_general}
                                    onChange={this.onChangeDescuentoGeneral.bind(this)}
                                    style={{ textAlign: 'right', margin: 0, paddingRight: (parseFloat(this.state.subtotal) > 0)?25:5, }}
                                    permisions={this.permisions.descuento}
                                    number={true}
                                    readOnly={(parseFloat(this.state.subtotal) > 0)?false:true}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal'
                                />
                                <C_Input
                                    title="% Recargo"
                                    value={this.state.recargo_general}
                                    onChange={this.onChangeRecargoGeneral.bind(this)}
                                    style={{ textAlign: 'right', margin: 0, paddingRight: (parseFloat(this.state.subtotal) > 0)?25:5, }}
                                    permisions={this.permisions.recargo}
                                    number={true}
                                    readOnly={(parseFloat(this.state.subtotal) > 0)?false:true}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal'
                                />
                                <C_Input
                                    title="Total"
                                    value={this.state.total_general}
                                    readOnly={true}
                                    style={{paddingRight: 20, textAlign: 'right', }}
                                    className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                { btnHistorial }
                                { btnPartes }
                                <C_Button
                                    title={(this.state.config_venta2pasos) ? 'Guardar y definir pago' : 'Pagar'}
                                    type='primary'
                                    onClick={this.onPagar.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({ visible: true, bandera: 3, }) }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }

}

export default withRouter(CrearVenta);