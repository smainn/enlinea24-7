
import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { dateToString, convertDmyToYmd, hourToString } from '../../../utils/toolsDate';
import { removeAllData, httpRequest, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Input from '../../../componentes/data/input';
import ws from '../../../utils/webservices';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_DatePicker from '../../../componentes/data/date';
import C_Select from '../../../componentes/data/select';

import { Select, Modal, message } from 'antd';
import strings from '../../../utils/strings';
import C_Button from '../../../componentes/data/button';
import keysStorage from '../../../utils/keysStorage';
import ShowCliente from '../GestionarCliente/show';
import Confirmation from '../../../componentes/confirmation';
import C_TextArea from '../../../componentes/data/textarea';
import C_CheckBox from '../../../componentes/data/checkbox';

const { Option } = Select;

let dateNow = new Date();
let value = 0;

class CreateProforma extends Component{

    constructor(props){
        super(props)
        this.state = {
            visible_cliente: false,
            visible_cancelar: false,
            visible_submit: false,
            visible_imprimir: false,
            loading: false,

            codigo: '',
            fecha: dateToString(dateNow, 'f2'),
            idsucursal: '',
            idalmacen: '',

            idcliente: '',
            nitcliente: '',
            namecliente: '',

            idvehiculo: '',
            descripcion_vehiculo: '',

            idvendedor: '',
            comision_vendedor: '',

            idmoneda: '',
            idlistaprecio: '',

            array_sucursal: [],
            array_almacen: [],
            array_cliente: [],
            array_vehiculo: [],
            array_vendedor: [],
            array_moneda: [],
            array_listaprecio: [],
            array_producto: [],
            array_tipo_pago: [],

            idtipocontacredito: 0,

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

            validar_codigo: 1,
            timeoutSearch: undefined,

            config_codigo: false,
            config_taller: false,
            clienteesabogado: true,
            config_preciounitario: false,
            inicio_venta: false,

            cliente: {},
            cliente_contacto: [],

            checked_imprimir_ok: true,
            checked_imprimir_cancel: false,

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            idventa: null,

            noSesion: false,
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
    }

    componentDidMount(){
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        var bandera = false;
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'proforma_create') {
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

    cargar_data(data) {
        if (this.validar_data(data.cliente)) {
            data.array_cliente.push(data.cliente);
            data.cliente = null;
        }
        this.setState({
            inicio_venta: true,

            codigo: data.codigo,
            fecha: data.fecha,
            idsucursal: data.idsucursal,
            idalmacen: data.idalmacen,

            idcliente: data.idcliente,
            nitcliente: data.nitcliente,
            namecliente: data.namecliente,

            idvehiculo: data.idvehiculo,
            descripcion_vehiculo: data.descripcion_vehiculo,

            idvendedor: data.idvendedor,
            comision_vendedor: data.comision_vendedor,

            idmoneda: data.idmoneda,
            idlistaprecio: data.idlistaprecio,

            array_sucursal: data.array_sucursal,
            array_almacen: data.array_almacen,
            array_cliente: data.array_cliente,
            array_vehiculo: data.array_vehiculo,
            array_vendedor: data.array_vendedor,
            array_moneda: data.array_moneda,
            array_listaprecio: data.array_listaprecio,
            array_producto: data.array_producto,
            array_tipo_pago: data.array_tipo_pago,

            array_tablero_venta: data.array_tablero_venta,

            observacion: data.observacion,
            subtotal: data.subtotal,
            descuento_general: data.descuento_general,
            recargo_general: data.recargo_general,
            total_general: data.total_general,

            validar_codigo: data.validar_codigo,
            config_codigo: data.config_codigo,
            config_taller: data.config_taller,
            clienteesabogado: data.clienteesabogado,
            config_preciounitario: data.config_preciounitario,

        });
    }

    get_data() {
        httpRequest('get', ws.wscreateproforma)
        .then((result) => {
            if (result.response == 1) {

                var idlistaprecio = (result.listaprecios.length > 0)?result.listaprecios[0].idlistaprecio : '';
                var valor = 0;

                this.state.array_tablero_venta[0].idlistaprecio = idlistaprecio;
                this.state.array_tablero_venta[0].array_producto = result.productos;
                this.state.array_tablero_venta[0].array_listaprecio = result.listaprecios;

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
                    config_codigo: (result.configscliente == null)?false:result.configscliente.codigospropios,
                    config_taller: (result.configsfabrica == null)?false:result.configsfabrica.comtaller,
                    clienteesabogado: (result.configscliente == null)?false:result.configscliente.clienteesabogado,
                    config_preciounitario: (result.configscliente == null)?false:result.configscliente.editprecunitenventa,

                    array_sucursal: result.sucursales,
                    array_almacen: result.almacenes,
                    array_cliente: result.clientes,
                    array_vendedor: result.vendedores,
                    array_moneda: result.monedas,
                    array_listaprecio: result.listaprecios,
                    array_producto: result.productos,
                    array_tipo_pago: result.tiposcontacredito,

                    array_tablero_venta: this.state.array_tablero_venta,

                    idsucursal: (result.sucursales.length > 0) ? result.sucursales[0].idsucursal : '',
                    idalmacen: (result.almacenes.length > 0) ? result.almacenes[0].idalmacen : '',
                    idmoneda: (result.monedas.length > 0) ? result.monedas[0].idmoneda : '',
                    idlistaprecio: (result.listaprecios.length > 0) ? result.listaprecios[0].idlistaprecio : '',
                    inicio_venta: true,
                });
            }else if (result.response == -2) {
                this.setState({ noSesion: true  });
            } else {
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
            httpRequest('get', ws.wscodproformavalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1 })
                    } else {
                        this.setState({ validar_codigo: 0 })
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
            this.setState({ validar_codigo: 1 })
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
            codigo: value,
        });
    }
    onChangeFecha(dateString) {
        this.setState({
            fecha: dateString
        });
    }
    get_sucursal(idsucursal, idmoneda, idlistaprecio) {
        var body = {
            idsucursal: idsucursal,
            idmoneda: idmoneda,
            idlistaprecio: idlistaprecio,
        };
        httpRequest('post', ws.wsproformasucursal , body)
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
                        data.idlistapreproducdetalle = '',
                        data.preciounitario = number.toFixed(2);
                        data.descuento = 0;
                        data.validacion = false;
                        data.alert = 1;
                        data.preciototal = number.toFixed(2);
                        data.array_producto = result.productos;
                    }
                );
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                    array_almacen: result.almacenes,
                    array_producto: result.productos,
                    idlistaprecio: idlistaprecio,
                    idalmacen: (result.almacenes.length > 0) ? result.almacenes[0].idalmacen : '',
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
    get_almacen(idsucursal, idmoneda, idlistaprecio, idalmacen) {
        var body = {
            idsucursal: idsucursal,
            idmoneda: idmoneda,
            idlistaprecio: idlistaprecio,
            idalmacen: idalmacen,
        };
        httpRequest('post', ws.wsproformaalmacen, body)
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
                        data.array_producto = result.data;
                    }
                );
                this.setState({
                    array_tablero_venta: this.state.array_tablero_venta,
                    idlistaprecio: idlistaprecio,
                    idalmacen: idalmacen,
                    idsucursal: idsucursal,
                    idmoneda: idmoneda,
                    array_producto: result.data,

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
        var idsucursal = this.state.idsucursal;
        var idmoneda = this.state.idmoneda;
        var idlistaprecio = this.state.idlistaprecio;
        var idalmacen = value;
        const actualizar = this.get_almacen.bind(this, idsucursal, idmoneda, idlistaprecio, idalmacen);
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
    onSearchIDCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByIdCod(value), 300);
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
    onSearchNombreCliente(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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
    onSearchIDVehiculo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onDeleteVehiculoID() {
        this.setState({
            idvehiculo: '',
            descripcion_vehiculo: '',
        });
        this.searchVehiculoByIdCod('');
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
    onSearchPlacaVehiculo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByPlaca(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onchangeIDVehiculo(value) {
        let descripcion = '';
        let array = this.state.array_vehiculo;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idvehiculo == value) {
                descripcion = array[i].vehiculotipo;
                break;
            }
        }
        this.setState({
            idvehiculo: value,
            descripcion_vehiculo: descripcion,
        });
    }

    onDeleteVendedorID() {
        this.setState({
            idvendedor: '',
            comision_vendedor: '',
        });
        this.searchVendedorByIdCod('');
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
    onSearchIDVendedor(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByIdCod(value), 300);
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
    onSearchNombreVendedor(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVendedorByFullName(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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
    onChangeListaPrecio(value) {
        var idlistaprecio = value;
        var idalmacen = this.state.idalmacen;
        var idsucursal = this.state.idsucursal;
        var idmoneda = this.state.idmoneda;
        
        const actualizar = this.get_almacen.bind(this, idsucursal, idmoneda, idlistaprecio, idalmacen);

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
                        data.idlistapreproducdetalle = '',
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

    get_producto(index, id) {
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
    esProductoSeleccionado(value) {
        var data = this.state.array_tablero_venta;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == value) {
                return true;
            }
        }
        return false;
    }
    onchangeProductoID(index, value) {
        if (!this.esProductoSeleccionado(value)) {
            this.state.array_tablero_venta[index].idproducto = value;
            this.setState({
                array_tablero_venta: this.state.array_tablero_venta,
            });
            this.get_producto(index, value);
        }else {
            message.warning('El producto ya fue seleccionado...');
        }
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
    onChangeSearchListaPrecio(index, value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchListaPrecioIndex(value, index), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
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
            let codcliente = (this.state.config_codigo) ? (data[i].codcliente == null) ? data[i].idcliente: data[i].codcliente : data[i].idcliente;
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
            let codigo = (this.state.config_codigo) ? (data[i].codvehiculo == null) ? data[i].idvehiculo: data[i].codvehiculo : data[i].idvehiculo;
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
            let codvendedor = (this.state.config_codigo) ? (data[i].codvendedor == null) ? data[i].idvendedor: data[i].codvendedor : data[i].idvendedor;
            array.push(
                <Option key={i} value={data[i].idvendedor}>
                    {codvendedor}
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
    componentProductoCodID(index) {
        let data = this.state.array_tablero_venta[index].array_producto;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let codproducto = (this.state.config_codigo) ? (data[i].codproducto == null) ? data[i].idproducto: data[i].codproducto : data[i].idproducto;
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {codproducto}
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

    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    on_data_component() {
        return {
            codigo: this.state.codigo,
            fecha: this.state.fecha,
            idsucursal: this.state.idsucursal,
            idalmacen: this.state.idalmacen,

            idcliente: this.state.idcliente,
            nitcliente: this.state.nitcliente,
            namecliente: this.state.namecliente,

            idvehiculo: this.state.idvehiculo,
            descripcion_vehiculo: this.state.descripcion_vehiculo,

            idvendedor: this.state.idvendedor,
            comision_vendedor: this.state.comision_vendedor,

            idmoneda: this.state.idmoneda,
            idlistaprecio: this.state.idlistaprecio,

            array_sucursal: this.state.array_sucursal,
            array_almacen: this.state.array_almacen,
            array_cliente: this.state.array_cliente,
            array_vendedor: this.state.array_vendedor,
            array_vehiculo: this.state.array_vehiculo,
            array_moneda: this.state.array_moneda,
            array_listaprecio: this.state.array_listaprecio,
            array_producto: this.state.array_producto,
            array_tipo_pago: this.state.array_tipo_pago,

            array_tablero_venta: this.state.array_tablero_venta,

            observacion: this.state.observacion,
            subtotal: this.state.subtotal,
            descuento_general: this.state.descuento_general,
            recargo_general: this.state.recargo_general,
            total_general: this.state.total_general,

            validar_codigo: this.state.validar_codigo,
            config_codigo: this.state.config_codigo,
            config_taller: this.state.config_taller,
            clienteesabogado: this.state.clienteesabogado,
            config_preciounitario: this.state.config_preciounitario,
        };
    }
    crearNuevoCliente() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'proforma_create',
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
                        visible_cliente: true,
                    });
                }
            }
        )
        .catch((error) => {
            message.error(strings.message_error);
        });
    }
    buttonAddShowCliente() {
        if (this.state.idcliente != '' && this.permisions.btn_ver_cli.visible == 'A' && this.state.inicio_venta) {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12">
                    <C_Button
                        title={<i className="fa fa-eye"></i>}
                        type='danger' size='small' style={{padding: 4}}
                        onClick={this.showCliente.bind(this)}
                    />
                </div>
            );
        } else if (this.permisions.btn_add_cli.visible == 'A' && this.state.inicio_venta) {
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

    onClose() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.setState({
                visible_cliente: false,
                visible_cancelar: false,
                visible_submit: false,
                loading: false,
                cliente: null,
                cliente_contacto: [],
            });
        }, 300);
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
    onSubmit() {
        this.setState({
            loading: true,
        });
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
            estadoProceso: 'E',
            fechaHoraFin: null,
            idusuario: 1,
            fkidsucursal: this.state.idsucursal,
            fkidcliente: this.state.idcliente,
            fkidvendedor: this.state.idvendedor,
            idmoneda: this.state.idmoneda,
            nitcliente: this.state.nitcliente,
            namecliente: this.state.namecliente,
            fkidvehiculo: this.state.idvehiculo == '' ? null : this.state.idvehiculo,

            hora: hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
            comision: parseFloat(this.state.comision_vendedor),
            
            arrayventadetalle: JSON.stringify(ventadetalle),
            anticipo: null,
            totalventa: this.state.total_general,
        };
        httpRequest('post', ws.wsproforma, body)
            .then(result => {
                if(result.response == 1) {
                    message.success("se inserto correctamente");
                    this.setState({
                        loading: false,
                        visible_submit: false,
                        idventa: result.idventa,
                    });
                    setTimeout(() => {
                        this.setState({
                            visible_imprimir: true,
                        });
                    }, 500);
                    return;
                } else if (result.response == -2) {
                    this.setState({ 
                        noSesion: true,
                    })
                } else {
                    console.log('Ocurrio un probleman en el servidor');
                }
                this.setState({
                    loading: false,
                    visible_submit: false,
                });
            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
                this.setState({
                    loading: false,
                    visible_submit: false,
                });
            });
    }
    componentClienteVer() {
        return (
            <Confirmation
                visible={this.state.visible_cliente}
                loading={this.state.loading}
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
    componentCancelar() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registrar Venta"
                onCancel={this.onClose.bind(this)}
                onClick={this.onSalir.bind(this)}
                width={400}
                content={'¿Esta seguro de cancelar el registro de venta? Los datos ingresados se perderan.'}
            />
        );
    }
    componentSubmit() {
        return (
            <Confirmation
                visible={this.state.visible_submit}
                title="Registrar Proforma"
                loading={this.state.loading}
                onCancel={this.onClose.bind(this)}
                onClick={this.onSubmit.bind(this)}
                width={400}
                content = {
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                        <label>
                            ¿Esta seguro de registrar la Proforma?
                        </label>
                    </div>
                }
            />
        );
    }
    componentRecibo() {
        return (
            <Confirmation
                visible={this.state.visible_imprimir}
                loading={this.state.loading}
                title="Finalizar Proforma"
                zIndex={950}
                width={500}
                content={this.componentReciboVenta()}
                footer={false}
            />
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
    componentReciboVenta() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                            <C_Input className=''
                                value={'Imprimir Nota de Proforma: '}
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
    onCerrarImprimir() {
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
    ongenerarRecibo(event) {
        event.preventDefault();

        this.setState({
            loading: true,
        });

        if (this.state.checked_imprimir_ok) {
            let body = {
                idventa: this.state.idventa,
            }

            httpRequest('post', ws.wsproforma_recibo, body)
            .then(result => {
                if (result.response == 1) {

                    this.setState({
                        venta_first: result.venta,
                        venta_detalle: result.venta_detalle,
                        planpago: result.planpago,
                        config_cliente: result.configcliente,
                    });

                    message.success('Nota de Proforma generada');

                    setTimeout(() => {
                        document.getElementById('imprimir_recibo').submit();
                    }, 300);

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
                    }, 500);

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
    }

    validarDatos() {
        if ((this.state.codigo.toString().trim().length == 0 && this.state.config_codigo) || this.state.validar_codigo == 0) {
            message.error('Debe introducir un codigo');
            return false;
        } 
        if (this.state.idcliente == '') {
            message.error('Debe seleccionar un cliente');
            return false;
        }
        if (this.state.idvendedor == '') {
            let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
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
    validarData() {
        if (!this.validarDatos()) return;
        this.setState({
            visible_submit: true,
        });
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

        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        if (this.state.noSesion){
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        const buttonAddShowCliente = this.buttonAddShowCliente();
        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        return (
            <div className="rows">
                {this.componentClienteVer()}
                {this.componentCancelar()}
                {this.componentSubmit()}
                {this.componentRecibo()}

                <form target="_blank" id='imprimir_recibo' method="post" action={routes.reporte_proforma_recibo} style={{display: 'none'}}>

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

                <div className="cards" style={{padding: 0,}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Proforma</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
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
                                title='Fecha'
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
                                permisions={this.permisions.vehiculo_cod}
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
                                permisions={this.permisions.vehiculo_placa}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                                configAllowed={this.state.config_taller}
                                readOnly={(this.state.idcliente == '')?true:false}
                            />
                            <C_Input
                                title="Descripcion"
                                value={this.state.descripcion_vehiculo}
                                permisions={this.permisions.vehiculo_descrp}
                                readOnly={true}
                                configAllowed={this.state.config_taller}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1 cols-sm-3 cols-xs-12"></div>
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
                                permisions={this.permisions.lista_precios}
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
                                permisions={this.permisions.t_precio_unitario}
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
                            <div style={{width: 20, minWidth: 20, height: 30, background: 'transparent', margin: 10, marginBottom: -2,
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
                                            permisions={this.permisions.t_precio_unitario}
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
                                        <div style={{width: 20, minWidth: 20, height: 33, background: 'transparent', margin: 10, 
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: 4,}}>
                                            <C_Button
                                                title={<i className="fa fa-remove"></i>}
                                                type='danger' size='small' style={{padding: 3, }}
                                                onClick={this.removeRowIndex.bind(this, key)}
                                            />
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
                                <C_Button
                                    title='Generar'
                                    type='primary'
                                    onClick={this.validarData.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({ visible_cancelar: true, }) }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateProforma);
