
import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import { Modal, message, Select, Alert, Icon, notification, Tooltip } from 'antd';

import QrReader from 'react-qr-reader';

import ws from '../../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import { dateToString, fullHourToString, stringToDate, convertDmyToYmd, hourToString, convertYmdToDmy } from '../../../utils/toolsDate';

import ShowProveedor from '../GestionarProveedor/show';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';
import C_Select from '../../../componentes/data/select';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import keysStorage from '../../../utils/keysStorage';
import C_CheckBox from '../../../componentes/data/checkbox';
import AddQr from './addQr';

const { Option } = Select;

const CANTIDAD_PRODUCTOS_DEFAULT = 30;

let now = new Date();

class CreateCompra extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible_proveedor: false,
            visible_cancelar: false,
            visible_tipopago: false,
            visible_pago: false,
            visible_compra: false,
            visible_imprimir: false,

            visible_generarFactura: false,
            loading_generarFactura: false,

            visible_generarQr: false,
            loading_generarQr: false,

            loading: false,
            loading_compra: false,
            loading_imprimir: false,

            checked_imprimir_ok: true,
            checked_imprimir_cancel: false,

            timeoutSearch: undefined,

            config_codigo: false,
            es_abogado: true,
            idcompra: null,

            obj_factura: {
                nitproveedor: '',
                nrofactura: '',
                nroautorizacion: '',
                fechafactura: '',
                montototalfacturado: '',
                codigocontrol: '',
                nitcliente: '',
            },
            check_regfactura: 'N',
            scanResultFile: '',
            scanResultWebCamFile: '',

            codigo: '',
            idsucursal: '',
            idalmacen: '',
            idmoneda: '',
            idproveedor: '',
            nitproveedor: '',
            planpago: 'C',
            fkidtipocontacredito: 1,
            fecha: dateToString(new Date(), 'f2'),
            hora: fullHourToString(new Date()),

            validar_codigo: 1,

            array_sucursal: [],
            array_almacen: [],
            array_moneda: [],
            array_producto: [],
            array_proveedor: [],

            productos_index: [
                {
                    idproducto: '', unidadmedida: '',
                    cantidad: 0, costo: 0,
                    costototal: 0, array_producto: [],
                    alert: 1, stock: 0, tipo: '',
                },
            ],
            notas: '',
            costototal: 0,
            proveedor: null,
            proveedor_contacto: [],

            anticipo: 0,
            saldo: 0,
            nrocuota: 1,
            fechainipago: '',
            periodo: 30,
            array_cuotas: [],

            compra: {},
            compradetalle: [],
            planpago: [],
            config_cliente: {},

            valor_cambio: 1,
            array_tipocambio: [],

            noSesion: false,
        }
        this.permisions = {
            ver_nro: readPermisions(keys.compra_ver_nro),
            ver_fecha: readPermisions(keys.compra_ver_fecha),
            codigo: readPermisions(keys.compra_input_codigo),
            sucursal: readPermisions(keys.compra_select_sucursal),
            almacen: readPermisions(keys.compra_select_almacen),
            moneda: readPermisions(keys.compra_select_moneda),
            agregar_proveedor : readPermisions(keys.compra_btn_agregarProveedor),
            ver_proveedor: readPermisions(keys.compra_btn_verProveedor),
            codigo_proveedor: readPermisions(keys.compra_input_search_codigoProveedor),
            nombre_proveedor: readPermisions(keys.compra_input_search_nombreProveedor),
            nit_proveedor: readPermisions(keys.compra_input_nitProveedor),
            plan_pago: readPermisions(keys.compra_select_planPago),
            fecha: readPermisions(keys.compra_fecha),
            hora: readPermisions(keys.compra_hora),
            col_codigo_prod: readPermisions(keys.compra_tabla_columna_codigoProducto),
            col_producto: readPermisions(keys.compra_tabla_columna_producto),
            col_cantidad: readPermisions(keys.compra_tabla_columna_cantidad),
            col_costo_unit: readPermisions(keys.compra_tabla_columna_costoUnitario),
            notas: readPermisions(keys.compra_textarea_nota),
            total: readPermisions(keys.compra_input_total)
        }
    }
    componentDidMount() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        //console.log(on_data);
        var bandera = false;
        if (this.validar_keyStorage(on_data)) {
            if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) 
            {
                if (on_data.on_create == 'compra_create') {
                    bandera =  this.validar_keyStorage(on_data.validacion)?on_data.validacion:false;
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
        this.setState({
            config_codigo: data.config_codigo,
            es_abogado: data.es_abogado,
            codigo: data.codigo,
            idsucursal: data.idsucursal,
            idalmacen: data.idalmacen,
            idmoneda: data.idmoneda,
            idproveedor: data.idproveedor,
            nitproveedor: data.nitproveedor,
            planpago: data.planpago,
            fecha: data.fecha,
            hora: data.hora,
            validar_codigo: data.validar_codigo,
            array_sucursal: data.array_sucursal,
            array_almacen: data.array_almacen,
            array_moneda: data.array_moneda,
            array_producto: data.array_producto,
            array_proveedor: data.array_proveedor,
            productos_index: data.productos_index,
            notas: data.notas,
            costototal: data.costototal,
            valor_cambio: data.valor_cambio,
            array_tipocambio: data.array_tipocambio,
        },
            () => this.calcularCostoTotal()
        );
    }
    get_data() {
        httpRequest('get', ws.wscreatecompra)
        .then((result) => {
            if (result.response == 1) {
                console.log(result)

                this.state.productos_index[0].array_producto = result.producto;
                for (let i = 0; i < 2; i++) {
                    var objeto = {
                        idproducto: '', unidadmedida: '', cantidad: 0,
                        costo: 0, costototal: 0, stock: 0, tipo: '',
                        array_producto: result.producto, alert: 1,
                    };
                    this.state.productos_index.push(objeto);
                }

                var idmoneda = result.moneda.length > 0 ? result.moneda[0].idmoneda : '';
                var valor_cambio = 1;

                for (let index = 0; index < result.tipocambio.length; index++) {
                    const element = result.tipocambio[index];
                    if (element.fkidmonedauno == idmoneda) {
                        valor_cambio = element.valor;
                        break;
                    }
                }
                
                this.setState({
                    config_codigo: result.configscliente.codigospropios,
                    es_abogado: result.configscliente.clienteesabogado,
                    idsucursal: result.sucursal.length > 0 ? result.sucursal[0].idsucursal : '',
                    idalmacen: result.almacen.length > 0 ? result.almacen[0].idalmacen : '',
                    idmoneda: idmoneda,
                    array_sucursal: result.sucursal,
                    array_almacen: result.almacen,
                    array_moneda: result.moneda,
                    array_producto: result.producto,
                    array_proveedor: result.proveedor,
                    productos_index: this.state.productos_index,
                    valor_cambio: valor_cambio, array_tipocambio: result.tipocambio,
                });
            } else if (result.response == -2) {

                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);

            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    verificarCodigo(value) {
        if (value.toString().trim().length > 0) {
            httpRequest('get', ws.wscodcompravalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1, });
                    } else {
                        this.setState({ validar_codigo: 0, });
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
            this.setState({ validar_codigo: 1, });
        }
        
    }
    handleVerificCodigo(value) {
        var search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(search), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch, });
    }
    onChangeCodCompra(value) {
        this.handleVerificCodigo(value);
        this.setState({ codigo: value, });
    }
    getSucursal(idsucursal) {
        var body = {
            idsucursal: idsucursal,
        };
        httpRequest('post', ws.wscompra + '/get_sucursal', body)
        .then(result => {
            if (result.response == 1) {
                // console.log(result);
                for (let i = 0; i < this.state.productos_index.length; i++) {
                    const element = this.state.productos_index[i];
                    element.idproducto = '';
                    element.unidadmedida = '';
                    element.cantidad = 0; element.costo = 0;
                    element.costototal = 0; element.alert = 1;
                    element.stock = 0; element.tipo = '';
                    element.array_producto = result.producto;
                }
                this.setState({
                    idsucursal: idsucursal,
                    array_almacen: result.almacen,
                    idalmacen: result.almacen.length > 0 ? result.almacen[0].idalmacen : '',
                    array_producto: result.producto,
                    productos_index: this.state.productos_index,
                },
                    () => this.calcularCostoTotal()
                );
                
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
    onChangeIDSucursal(value) {
        const getSucursal = this.getSucursal.bind(this, value);
        Modal.confirm({
            title: 'Cambiar de Sucursal',
            content: 'Al cambiar de sucursal se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              getSucursal();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    getalmacen(idalmacen) {
        var body = {
            idalmacen: idalmacen,
        };
        httpRequest('post', ws.wscompra + '/get_almacen', body)
        .then(result => {
            if (result.response == 1) {
                // console.log(result);
                for (let i = 0; i < this.state.productos_index.length; i++) {
                    const element = this.state.productos_index[i];
                    element.idproducto = '';
                    element.unidadmedida = '';
                    element.cantidad = 0; element.costo = 0;
                    element.costototal = 0; element.alert = 1;
                    element.stock = 0; element.tipo = '';
                    element.array_producto = result.producto;
                }
                this.setState({
                    idalmacen: idalmacen,
                    array_producto: result.producto,
                    productos_index: this.state.productos_index,
                },
                    () => this.calcularCostoTotal()
                );
                
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
    onChangeIDAlmacen(value) {
        const getalmacen = this.getalmacen.bind(this, value);
        Modal.confirm({
            title: 'Cambiar de almacen',
            content: 'Al cambiar de almacen se perderan los productos selecciondos, ¿Desea continuar?',
            onOk() {
              console.log('OK');
              getalmacen();
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    onChangeIDMoneda(value) {
        var valor_cambio = 1;
        for (let index = 0; index < this.state.array_tipocambio.length; index++) {
            const element = this.state.array_tipocambio[index];
            if (element.fkidmonedauno == value) {
                valor_cambio = element.valor;
                break;
            }
        }
        this.setState({
            idmoneda: value,
            valor_cambio: valor_cambio,
        });
    }
    searchProveedorByNom(search) {
        var body = {
            search: search,
        };
        httpRequest('post', ws.wscompra + '/searchProveedorByNom', body)
        .then((result) => {
            if (result.response > 0) {
                console.log(result)
                this.setState({
                    array_proveedor: result.proveedor,
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
    onSearchProvNom(value) {
        var search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProveedorByNom(search), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchProveedorByCodId(search) {
        var body = {
            search: search,
        };
        httpRequest('post', ws.wscompra + '/searchProveedorByCodId', body)
        .then((result) => {
            if (result.response > 0) {
                console.log(result)
                this.setState({
                    array_proveedor: result.proveedor,
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
    onSearchProvCodID(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProveedorByCodId(value), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeIDProv(value) {
        let array = this.state.array_proveedor;
        let nit = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproveedor == value) {
                nit = array[i].nit == null ? '' : array[i].nit;
                break;
            }
        }
        this.setState({
            idproveedor: value,
            nitproveedor: nit,
        });
    }
    calcularCostoTotal() {
        var costototal = 0;
        var data = this.state.productos_index;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            costototal +=  parseFloat(element.costototal);
        }
        this.setState({
            costototal: parseFloat(costototal).toFixed(2),
        });
    }
    addRowProducto() {
        var objeto = {
            idproducto: '', unidadmedida: '',
            cantidad: 0, costo: 0,
            costototal: 0, array_producto: this.state.array_producto,
            alert: 1, stock: 0, tipo: '',
        };
        this.state.productos_index.push(objeto);
        this.setState({
            productos_index: this.state.productos_index,
        },
            () => this.calcularCostoTotal()
        );
    }
    removeProductRow(index) {
        this.state.productos_index.splice(index, 1);
        this.setState({
            productos_index: this.state.productos_index,
        },
            () => this.calcularCostoTotal()
        );
    }
    get_producto(index, idproducto) {
        var body = {
            idproducto: idproducto,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wscompra + '/get_producto', body)
        .then(result => {
            if (result.response == 1) {
                // console.log(result);
                if (result.producto != null) {
                    this.state.productos_index[index].idproducto = idproducto;
                    this.state.productos_index[index].cantidad = 1;
                    this.state.productos_index[index].unidadmedida = result.producto.abreviacion;
                    this.state.productos_index[index].costo = result.producto.costo;
                    this.state.productos_index[index].costototal = result.producto.costo;
                    this.state.productos_index[index].stock = result.producto.stock;
                    this.state.productos_index[index].tipo = result.producto.tipo;
                    this.setState({
                        productos_index: this.state.productos_index,
                    },
                        () => this.calcularCostoTotal()
                    );
                }else {
                    message.error('Producto Invalido. Favor de Seleccion otro producto...');
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
        var data = this.state.productos_index;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == value) {
                return true;
            }
        }
        return false;
    }
    searchProductoByCodID(index, search) {
        var body = {
            search: search,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wscompra + '/search_prodCodID', body)
        .then(result => {
            if (result.response == 1) {
                // console.log(result);
                this.state.productos_index[index].array_producto = result.data;
                this.setState({
                    productos_index: this.state.productos_index,
                });
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
    onSearchProdCod(key, value) {
        var search = value;
        var index = key;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoByCodID(index, search), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchProductoByDesc(index, search) {
        var body = {
            search: search,
            idalmacen: this.state.idalmacen,
        };
        httpRequest('post', ws.wscompra + '/search_prodDesc', body)
        .then(result => {
            if (result.response == 1) {
                // console.log(result);
                this.state.productos_index[index].array_producto = result.data;
                this.setState({
                    productos_index: this.state.productos_index,
                });
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
    onSearchProdDesc(key, value) {
        var search = value;
        var index = key;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchProductoByDesc(index, search), 500);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeIDProducto(index, value) {
        if (!this.esProductoSeleccionado(value)) {
            this.get_producto(index, value);
        }else {
            message.warning('El producto ya fue seleccionado...');
        }
    }
    onDeleteIDProducto(index) {
        this.state.productos_index[index].idproducto = '';
        this.state.productos_index[index].unidadmedida = '';
        this.state.productos_index[index].cantidad = 0;
        this.state.productos_index[index].costo = 0;
        this.state.productos_index[index].costototal = 0;
        this.state.productos_index[index].alert = 1;
        this.state.productos_index[index].stock = 0;
        this.state.productos_index[index].tipo = '';
        this.setState({
            productos_index: this.state.productos_index,
        },
            () => this.calcularCostoTotal()
        );
    }
    onChangeProdCantidad(index, value) {
        if (!isNaN(value)) {
            if (parseInt(value) >= 0) {
                this.state.productos_index[index].cantidad = parseInt(value);
                var costo = this.state.productos_index[index].costo;
                var cantidad = this.state.productos_index[index].cantidad;
                this.state.productos_index[index].costototal = parseFloat(cantidad * costo).toFixed(2);
                this.setState({
                    productos_index: this.state.productos_index,
                },
                    () => this.calcularCostoTotal()
                );
            }
        }
        if (value == '') {
            this.state.productos_index[index].cantidad = 0;
            var costo = this.state.productos_index[index].costo;
            var cantidad = this.state.productos_index[index].cantidad;
            this.state.productos_index[index].costototal = parseFloat(cantidad * costo).toFixed(2);
            this.setState({
                productos_index: this.state.productos_index,
            },
                () => this.calcularCostoTotal()
            );
        }
    }
    onChangeProdCosto(index, value) {
        if (!isNaN(value)) {
            if (parseInt(value) >= 0) {
                this.state.productos_index[index].costo = value;
                var cantidad = this.state.productos_index[index].cantidad;
                var costo = this.state.productos_index[index].costo;
                this.state.productos_index[index].costototal = parseFloat(cantidad * costo).toFixed(2);
                this.setState({
                    productos_index: this.state.productos_index,
                },
                    () => this.calcularCostoTotal()
                );
            }
        }
        if (value == '') {
            this.state.productos_index[index].costo = 0;
            var cantidad = this.state.productos_index[index].cantidad;
            var costo = this.state.productos_index[index].costo;
            this.state.productos_index[index].costototal = parseFloat(cantidad * costo).toFixed(2);
            this.setState({
                productos_index: this.state.productos_index,
            },
                () => this.calcularCostoTotal()
            );
        }
    }
    componentSecursal() {
        let data = this.state.array_sucursal;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idsucursal}>
                    { data[i].nombrecomercial == null ? 
                        data[i].razonsocial == null ? 'S/Nombre' : 
                        data[i].razonsocial : data[i].nombrecomercial }
                </Option>
            );
        }
        return arr;
    }
    componentAlmacen() {
        let data = this.state.array_almacen;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    componentMoneda() {
        let data = this.state.array_moneda;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idmoneda}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    componentProveedorCodID() {
        let data = this.state.array_proveedor;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            let codproveedor = this.state.config_codigo ? data[i].codproveedor == null ? data[i].idproveedor : data[i].codproveedor : data[i].idproveedor;
            arr.push(
                <Option 
                    key={i} value={data[i].idproveedor}>
                    {codproveedor}
                </Option>
            );
        }
        return arr;
    }
    componentProveedorNom() {
        let data = this.state.array_proveedor;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option 
                    key={i} value={data[i].idproveedor}>
                    {data[i].nombre + ' ' + apellido}
                </Option>
            );
        }
        return arr;
    }
    componentProductoCodID(index) {
        let data = this.state.productos_index[index].array_producto;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let codproducto = this.state.config_codigo ? data[i].codproducto == null ? data[i].idproducto : data[i].codproducto : data[i].idproducto;
            array.push(
                <Option key={i} value={data[i].idproducto}>
                    {codproducto}
                </Option>
            );
        }
        return array;
    }
    componentProductoDesc(index) {
        let data = this.state.productos_index[index].array_producto;
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
    componentButtomProveedor() {
        if (this.state.idproveedor == '') {
            return (
                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom">
                    <C_Button onClick={this.crearNuevoProveedor.bind(this)}
                        type='primary' size='small'
                        title={<i className="fa fa-plus"></i>} style={{padding: 4}}
                    />
                </div>
            )
        } else {
            return (
                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom">
                    <C_Button onClick={this.onShowProveedor.bind(this)}
                        type='danger' size='small'
                        title={<i className="fa fa-eye"></i>} style={{padding: 4}}
                    />
                </div>
            )
        }
    }
    onShowProveedor() {
        var data = {
            idProveedor: this.state.idproveedor,
        }
        httpRequest('post', ws.wsproveedorshow, data)
        .then(result => {
            console.log(result)
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                if (result.response >= 0) {
                    console.log(result)
                    this.setState({
                        proveedor: result.proveedor,
                        proveedor_contacto: result.contacto,
                        visible_proveedor: true,
                    });
                }else {
                    message.warning('Hubo problemas al traer informacion...');
                }
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    validar_keyStorage(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    crearNuevoProveedor() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_keyStorage(on_data)) {
            var objecto_data = {
                on_create: 'compra_create',
                data_actual: this.on_data_keyStorage(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }
        var url = routes.proveedor_create;
        this.props.history.push(url);
    }
    crearNuevoProducto() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_keyStorage(on_data)) {
            var objecto_data = {
                on_create: 'compra_create',
                data_actual: this.on_data_keyStorage(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }
        var url = routes.producto_create;
        this.props.history.push(url);
    }
    on_data_keyStorage() {
        return {
            config_codigo: this.state.config_codigo, es_abogado: this.state.es_abogado,
            codigo: this.state.codigo, idsucursal: this.state.idsucursal,
            idalmacen: this.state.idalmacen, idmoneda: this.state.idmoneda,
            idproveedor: this.state.idproveedor, nitproveedor: this.state.nitproveedor,
            planpago: this.state.planpago,
            fecha: this.state.fecha, hora: this.state.hora,
            validar_codigo: this.state.validar_codigo,
            array_sucursal: this.state.array_sucursal, array_almacen: this.state.array_almacen,
            array_moneda: this.state.array_moneda, array_producto: this.state.array_producto,
            array_proveedor: this.state.array_proveedor, productos_index: this.state.productos_index,
            notas: this.state.notas, costototal: this.state.costototal,
            valor_cambio: this.state.valor_cambio, array_tipocambio: this.state.array_tipocambio,
        };
    }
    onSalir() {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_keyStorage(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
                validacion: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }
        setTimeout(() => {
            this.props.history.goBack();
        }, 500);
    }
    componentProveedorShow() {
        return (
            <Modal
                title='Datos de Proveedor'
                visible={this.state.visible_proveedor}
                footer={null}
                width={850}
                onCancel={() => this.setState({proveedor: null, proveedor_contacto: [], visible_proveedor: false,})}
                style={{'top': '40px'}}
            >
                <ShowProveedor
                    callback={() => this.setState({proveedor: null, proveedor_contacto: [], visible_proveedor: false,})}
                    proveedor={this.state.proveedor}
                    contacto={this.state.proveedor_contacto}
                    bandera={1}
                />
            </Modal>
        );
    }
    componentCancelarCompra() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registro de compra"
                onCancel={() => this.setState({visible_cancelar: false,})}
                onClick={this.onSalir.bind(this)}
                width={400}
                content={'¿Esta seguro de cancelar los registro? Los datos ingresados se perderan.'}
            />
        );
    }
    componentPago() {
        return (
            <Confirmation
                visible={this.state.visible_pago}
                title="Plan De Pago"
                //onCancel={this.onCerrarPago.bind(this)}
                width={780}
                zIndex={900}
                content={
                    <div className="forms-groups">
                        <C_Input
                            value={this.state.costototal}
                            readOnly={true}
                            title="Monto a Pagar"
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            style={{ textAlign: 'right' }}
                        />
                        <C_Input
                            title="Anticipo"
                            value={this.state.anticipo}
                            onChange={this.onChangeAnticipo.bind(this)}
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            style={{ textAlign: 'right', margin: 10, paddingRight: 15, }}
                        />
                        <C_Input
                            title="Saldo a Pagar"
                            value={this.state.saldo}
                            readOnly={true}
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            style={{ textAlign: 'right' }}
                        />
                        <C_Input
                            title="Numero de Cuotas"
                            value={this.state.nrocuota} 
                            onChange={this.onChangeNumeroCuota.bind(this)}
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            style={{ textAlign: 'right', margin: 10, paddingRight: 15, }}
                            number={true}
                        />
                        <C_DatePicker
                            value={this.state.fechainipago}
                            allowClear={false}
                            onChange={(date) => this.setState({fechainipago: date,})}
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            style={{ textAlign: 'right', width: '100%', minWidth: '100%', }}
                        />
                        <C_Select
                            onChange={(value) => this.setState({periodo : value,})}
                            value={this.state.periodo}
                            className="cols-lg-4 cols-md-4 col-sm-4 cols-xs-12 pt-normal"
                            component={[
                                <Option key={0} value={1}>Diario</Option>,
                                <Option key={1} value={7}>Semanal</Option>,
                                <Option key={2} value={30}>Mensual</Option>
                            ]}
                        />
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Generar Plan de Pago'
                                    type='primary'
                                    onClick={this.generarPlanPago.bind(this)}
                                />
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
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Grabar'
                                    type='primary'
                                    onClick={this.validarCuotas.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={this.cancelarpago.bind(this)}
                                />
                                
                            </div>
                        </div>
                    </div>
                }
                footer={false}
            />
        );
    }
    validarCuotas() {
        if (this.state.array_cuotas.length == 0) {
            notification.error({
                message: 'Advertencia',
                description:
                    'No se pudo generar el plan pago. Favor de aumentar al menos un plan de pago...',
                
            });
            return;
        }
        this.setState({
            visible_compra: true,
        });
    }
    cancelarpago() {
        var actualizar = () => {
            this.setState({
                fkidtipocontacredito: 1, 
                saldo: 0, periodo: 30, anticipo: 0, nrocuota: 1,
                fechainipago: '', array_cuotas: [],
            });
            setTimeout(() => {
                this.setState({visible_pago: false, });
            }, 1000);
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
    modificarMonto(index, value) {

        if (value < 0) return;

        let monto = (value == '')?0:value;

        let saldoAnterior = index == 0 ? this.state.saldo : this.state.array_cuotas[index - 1].saldo;
        this.state.array_cuotas[index].montoPagar = monto == 0 ? 0 : monto;
        let auxSaldo = parseFloat(saldoAnterior) - parseFloat(monto);

        if (auxSaldo < 0) {
            message.warning('Numero no valido, el saldo da negativo');
            return;
        }

        let valorDefault = index == 0 ? parseFloat(this.state.saldo/this.state.nrocuota - 1) : this.state.array_cuotas[index - 1].montoPagar;
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
    modificarFechaPlan(index, date) {
        var fecha = new Date();
        fecha = dateToString(fecha, 'f2');

        var fecha_actual = stringToDate(fecha, 'f2');
        var fecha_modificada = stringToDate(date, 'f2');

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
    }
    generarPlanPago() {
        if (this.state.saldo == 0 || this.state.nrocuota < 1) {
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
            for (let i = 0; i < this.state.nrocuota; i++) {

                var fecha = stringToDate(this.state.fechainipago, 'f2');
                fecha.setDate(fecha.getDate() + (parseInt(this.state.periodo) * i));
                var fechaAmostrar = dateToString(fecha, 'f2');

                let cuota = (this.state.saldo / this.state.nrocuota).toFixed(2);
                suma = suma + parseFloat(cuota);
                let saldo = (this.state.saldo - ((this.state.saldo/this.state.nrocuota) * (i + 1))).toFixed(2);
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
                array[array.length - 2].saldo = parseFloat(parseFloat(array[array.length - 1].montoPagar) + parseFloat(this.state.saldo - suma)).toFixed(2);
            }
            array[array.length - 1].montoPagar = parseFloat(parseFloat(array[array.length - 1].montoPagar) + parseFloat(this.state.saldo - suma)).toFixed(2);
            this.setState({
                array_cuotas: array,
            });
        }
    }
    dosDecimals(data) {
        let value = data.toString().split('.');
        if (value.length > 1) {
            if (value[1].length > 2) {
                return false;
            }
        }
        return true;
    }
    onChangeAnticipo(value) {
        if (isNaN(value)) return;
        let anticipo = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        if (value < 0) {
            message.warning('El anticipo no puede ser negativo');
            return;
        }
        let total = (this.state.costototal - anticipo).toFixed(2);
        if (total < 0) {
            message.warning('El saldo no puede ser menor que cero');
            return;
        }
        if (!this.dosDecimals(value)) return;
        this.setState({ 
            anticipo: value,
            saldo: total
        });
    }
    onChangeNumeroCuota(value) {
        value = value == '' ? 1 : isNaN(value) ? 1 : parseInt(value);
        this.setState({
            nrocuota: value,
        });
    }
    componentTipoPlanPago() {
        return (
            <Confirmation
                visible={this.state.visible_tipopago}
                title="Tipo de Pago"
                onCancel={() => this.setState({visible_tipopago: false,})}
                onClose={() => this.setState({visible_tipopago: false,})}
                width={450}
                zIndex={850}
                content={
                    <div className="txts-center">
                        <C_Button
                            style={{'marginTop': '-10px', 'marginBottom': '5px'}}
                            title={'Contado'}
                            type='danger'
                            onClick={() => {
                                this.setState({fkidtipocontacredito: 1,})
                                setTimeout(() => {
                                    this.setState({ visible_compra: true, });
                                }, 1000);
                            }}
                        />
                        <C_Button
                            style={{'marginTop': '-10px', 'marginBottom': '5px'}}
                            title={'Credito'}
                            type='danger'
                            onClick={() => {
                                let fechainipago = new Date(convertDmyToYmd(this.state.fecha));
                                fechainipago.setMonth(fechainipago.getMonth() + 1);
                                this.setState({
                                    fkidtipocontacredito: 2, 
                                    saldo: this.state.costototal, periodo: 30,
                                    fechainipago: dateToString(fechainipago, 'f2'),
                                });
                                setTimeout(() => {
                                    this.setState({ visible_pago: true, });
                                }, 1000);
                            }}
                        />
                    </div>
                }
                footer={false}
            />
        );
    }
    onValidar_data() {
        console.log(this.permisions.plan_pago)
        if (this.state.idalmacen == '' || this.state.idsucursal == '' || this.state.idmoneda == '') {
            message.error('Favor de traer informacion de sucursal o almacen o moneda...');
            return;
        }
        if (this.state.config_codigo && this.state.codigo.toString().trim().length == 0) {
            message.error('El codigo es requerido');
            return;
        }
        if (this.state.idproveedor == '') {
            message.error('Favor de seleccionar proveedor...');
            return;
        }
        let cantidad = 0;
        let data = this.state.productos_index;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idproducto == '') {
                cantidad++;
            }
            if (parseInt(data[i].cantidad) == 0 && data[i].idproducto != '') {
                message.error('Un producto no puede quedar con cantidad 0');
                return;
            }
            if (parseFloat(data[i].costo) == 0 && data[i].idproducto != '' && parseInt(data[i].cantidad) > 0) {
                message.error('Un producto no puede quedar con costo 0');
                return;
            }
        }
        if (cantidad == this.state.productos_index.length) {
            message.error('Favor de seleccionar un producto...');
            return;
        }
        if (this.permisions.plan_pago.editable == 'A') {
            this.setState({
                visible_tipopago: true,
            });
        }else {
            this.setState({
                visible_compra: true,
            });
        }
    }
    componentSubmitCompra() {
        return (
            <Confirmation
                visible={this.state.visible_compra}
                loading={this.state.loading_compra}
                title="Registrar Compra"
                onCancel={() => this.setState({visible_compra: false,})}
                onClick={this.storeCompra.bind(this)}
                zIndex={950}
                width={350}
                content={'Estas seguro de registrar la compra?'}
            />
        );
    }
    obtenerDatos(idsProductos, cantidades, costos, costosTotales) {
        let array = this.state.productos_index;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idproducto != '' && array[i].idproducto.toString().trim().length > 0 && (!isNaN(array[i].idproducto))) {
                idsProductos.push(this.state.productos_index[i].idproducto);
                cantidades.push(this.state.productos_index[i].cantidad);
                costos.push(this.state.productos_index[i].costo);
                costosTotales.push(this.state.productos_index[i].costototal);
            }
            
        }
    }
    getDatosCuotas(montos, fechas, descripciones) {
        let array = this.state.array_cuotas;
        for (let i = 0; i < array.length; i++) {
            montos.push(array[i].montoPagar);
            fechas.push(array[i].fechastore);
            descripciones.push(array[i].descripcion);
        }
    }
    storeCompra() {
        this.setState({
            loading_compra: true,
        });
        let idsProductos = [];
        let cantidades = [];
        let costos = [];
        let costosTotales = [];
        this.obtenerDatos(idsProductos, cantidades, costos, costosTotales);
        let montos = [];
        let fechas = [];
        let descripciones = [];
        if (this.state.fkidtipocontacredito == 2) {
            this.getDatosCuotas(montos, fechas, descripciones);
        }
        let body = {
            codcompra: this.state.codigo,
            fecha: convertDmyToYmd(this.state.fecha),
            hora: this.state.hora,
            anticipopagado: this.state.anticipo,
            notas: this.state.notas,
            idproveedor: this.state.idproveedor,
            tipo: this.state.fkidtipocontacredito == 1 ? 'C' : 'R',
            costoTotal: this.state.costototal,
            idmoneda: this.state.idmoneda,
            idalmacen: this.state.idalmacen,
            idsproductos: JSON.stringify(idsProductos),
            cantidades: JSON.stringify(cantidades),
            costos: JSON.stringify(costos),
            costostotales: JSON.stringify(costosTotales),
            montos: JSON.stringify(montos),
            fechas: JSON.stringify(fechas),
            descripciones: JSON.stringify(descripciones),
            valor_cambio: this.state.valor_cambio,

            check_regfactura: this.state.check_regfactura,
            nitproveedor: this.state.obj_factura.nitproveedor,
            nrofactura: this.state.obj_factura.nrofactura,
            nroautorizacion: this.state.obj_factura.nroautorizacion,
            fechafactura: convertDmyToYmd(this.state.obj_factura.fechafactura),
            montototalfacturado: this.state.obj_factura.montototalfacturado,
            codigocontrol: this.state.obj_factura.codigocontrol,
            nitcliente: this.state.obj_factura.nitcliente,

        };
        httpRequest('post', ws.wscompra, body)
        .then((result) => {
            console.log(result)
            if (result.response > 0) {
                notification.success({
                    message: 'COMPRA EXITOSA',
                    description:
                        'Se guardo correctamente la compra realizada...',
                });
                this.setState({
                    idcompra: result.idcompra,
                });
                setTimeout(() => {
                    this.setState({
                        loading_compra: false,
                        visible_imprimir: true,
                    });
                }, 500);
                //console.log(result)
                //this.props.history.goBack();
            } else if (result.response == -2) {
                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);
            } else {
                message.error('Ocurrio un problema al guardar, intentelo nuevmente');
                this.setState({
                    loading_compra: false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loading_compra: false,
            });
            message.error('Ocurrio un problema con la conexion, revise su conexion e intentlo nuevamente');
        })
    }
    onChangeCheckedImprimir() {
        this.setState({
            checked_imprimir_ok: !this.state.checked_imprimir_ok,
            checked_imprimir_cancel: !this.state.checked_imprimir_cancel,
        });
    }
    componentImprimirCompra() {
        return (
            <Confirmation
                visible={this.state.visible_imprimir}
                loading={this.state.loading_imprimir}
                title="FINALIZAR COMPRA"
                zIndex={980}
                width={500}
                content={
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <C_Input className=''
                                    value={'Imprimir Nota de Compra: '}
                                    style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Si'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', background: 'white',}}
                                    onClick={this.onChangeCheckedImprimir.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedImprimir.bind(this)}
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
                                    onClick={this.onChangeCheckedImprimir.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedImprimir.bind(this)}
                                            checked={this.state.checked_imprimir_cancel}
                                        />
                                    }
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'center', paddingRight: 5, }}>
                                <C_Button
                                    title={'Aceptar'}
                                    type='primary'
                                    onClick={this.ongenerarRecibo.bind(this)}
                                /> 
                                <C_Button
                                    title={'Cancelar'}
                                    type='danger'
                                    onClick={this.onCancelarRecibo.bind(this)}
                                /> 
                            </div>
                        </div>
                    </div>
                }
                footer={false}
            />
        );
    }
    onCancelarRecibo() {
        this.setState({
            loading_imprimir: true,
        });
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_keyStorage(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
                validacion: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }
        setTimeout(() => {
            this.props.history.goBack();
        }, 1000);
    }
    ongenerarRecibo() {
        if (this.state.checked_imprimir_cancel) {
            this.setState({
                loading_imprimir: true,
            });
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_keyStorage(on_data)) {
                var objecto_data = {
                    on_create: null,
                    data_actual: null,
                    new_data: null,
                    validacion: null,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
            setTimeout(() => {
                this.props.history.goBack();
            }, 1000);
        }else {
            this.setState({
                loading_imprimir: true,
            });
            let body = {
                idcompra: this.state.idcompra,
            }
            httpRequest('post', ws.wscompra + '/generar_recibo', body)
            .then(result => {
                //console.log(result)
                if (result.response == 1) {
                    this.setState({
                        compra: result.compra,
                        compradetalle: result.compradetalle,
                        planpago: result.planpago,
                        config_cliente: result.config_cliente,
                    });

                    var on_data = JSON.parse( readData(keysStorage.on_data) );
                    if (this.validar_keyStorage(on_data)) {
                        var objecto_data = {
                            on_create: null,
                            data_actual: null,
                            new_data: null,
                            validacion: null,
                        };
                        saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                    }

                    setTimeout(() => {
                        document.getElementById('imprimir_recibo').submit()
                    }, 1000);

                    setTimeout(() => {
                        this.props.history.goBack();
                    }, 1500);
                    
                } else if (result.response == -2) {
                    notification.error({
                        message: 'Sesion',
                        description:
                            'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                    });
                    setTimeout(() => {
                        this.setState({ noSesion: true, });
                    }, 300);
                } else {
                    message.error('Ocurrio un problema en el servidor. Favor de intentar Nuevamente.');
                    this.setState({
                        loading_imprimir: false,
                    });
                }
            }).catch(error => {
                message.error(strings.message_error);
                this.setState({
                    loading_imprimir: false,
                });
            });
        }
    }

    onRegistrarFacturaCompra() {
        if ( this.state.obj_factura.nitproveedor.toString().trim().length == 0 ) {
            message.error( 'Nit Proveedor requerido.' );
            return;
        }
        if ( this.state.obj_factura.nrofactura.toString().trim().length == 0 ) {
            message.error( 'Nro Factura requerido.' );
            return;
        }
        if ( this.state.obj_factura.nroautorizacion.toString().trim().length == 0 ) {
            message.error( 'Nro Autorización requerido.' );
            return;
        }
        if ( this.state.obj_factura.fechafactura.toString().trim().length == 0 ) {
            message.error( 'Fecha Factura requerido.' );
            return;
        }
        if ( this.state.obj_factura.montototalfacturado.toString().trim().length == 0 ) {
            message.error( 'Monto total Facturado requerido.' );
            return;
        }
        if ( parseFloat(this.state.obj_factura.montototalfacturado) <= 0 ) {
            message.error( 'El Monto total Facturado debe ser mayor a 0.' );
            return;
        }
        if ( this.state.obj_factura.codigocontrol.toString().trim().length == 0 ) {
            message.error( 'Código Control requerido.' );
            return;
        }
        if ( this.state.obj_factura.nitcliente.toString().trim().length == 0 ) {
            message.error( 'Nit Cliente requerido.' );
            return;
        }
        message.success( 'Registro Factura de compra guardado exitosamente.' );
        this.setState({
            visible_generarFactura: false,
            check_regfactura: 'A',
        });
    }

    componentRegistroFactura() {
        if ( !this.state.visible_generarFactura ) return null;
        const qrRef = React.createRef();
        return (
            <Confirmation
                visible={this.state.visible_generarFactura}
                loading={this.state.loading_generarFactura}
                title="Registrar Factura de compra"
                zIndex={700} style={{ top: 30, }}
                width={600}
                content={
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nit del Proveedor'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.nitproveedor }
                                onChange={ (value) => {
                                    this.state.obj_factura.nitproveedor = value;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nro. de la factura'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.nrofactura }
                                onChange={ (value) => {
                                    this.state.obj_factura.nrofactura = value;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nro. de autorización'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.nroautorizacion }
                                onChange={ (value) => {
                                    this.state.obj_factura.nroautorizacion = value;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Fecha de la factura'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_DatePicker
                                allowClear={true} title=''
                                value={this.state.obj_factura.fechafactura}
                                onChange={ ( date ) => {
                                    this.state.obj_factura.fechafactura = date;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Monto total Facturado'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.montototalfacturado }
                                onChange={ (value) => {
                                    if ( value == "" ) {
                                        this.state.obj_factura.montototalfacturado = value;
                                        this.setState({
                                            obj_factura: this.state.obj_factura,
                                        });
                                        return;
                                    }
                                    if ( !isNaN( value ) ) {
                                        this.state.obj_factura.montototalfacturado = value;
                                        this.setState({
                                            obj_factura: this.state.obj_factura,
                                        });
                                    }
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Código de control'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.codigocontrol }
                                onChange={ (value) => {
                                    this.state.obj_factura.codigocontrol = value;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'NIT del Cliente'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.obj_factura.nitcliente }
                                onChange={ (value) => {
                                    this.state.obj_factura.nitcliente = value;
                                    this.setState({
                                        obj_factura: this.state.obj_factura,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'center', }}>
                                <C_Button
                                    title={'Web Scan QR '}
                                    type='primary'
                                    onClick={ () => {
                                        this.setState({
                                            visible_generarQr: true,
                                        });
                                    } }
                                />
                                <C_Button
                                    title={'Leer Imagen Qr'}
                                    type='danger'
                                    onClick={ () => {
                                        qrRef.current.openImageDialog();
                                    } }
                                /> 
                                <C_Button
                                    title={' Cargar Manual '}
                                    type='primary'
                                    onClick={ () => {
                                        let obj_factura = {
                                            nitproveedor: this.state.nitproveedor,
                                            nrofactura: '',
                                            nroautorizacion: '',
                                            fechafactura: this.state.fecha,
                                            montototalfacturado: this.state.costototal,
                                            codigocontrol: '',
                                            nitcliente: '',
                                        };
                                        this.setState({
                                            obj_factura: obj_factura,
                                        });
                                    } }
                                />
                                <QrReader 
                                    ref={ qrRef }
                                    delay={300} style={{ width: 200, height: 200, margin: 'auto', display: 'none', }}
                                    onError={ (error) => {
                                        console.log('Error scam')
                                        console.log(error)
                                    } }
                                    onScan={ ( result ) => {
                                        
                                        console.log(result)
                                        if ( result ) {
                                            let data = result.split('|');
                                            if ( data.length >= 8 ) {
                                                this.state.obj_factura.nitproveedor = data[0];
                                                this.state.obj_factura.nrofactura = data[1];
                                                this.state.obj_factura.nroautorizacion = data[2];
                                                this.state.obj_factura.fechafactura = convertYmdToDmy( data[3], '/' );
                                                this.state.obj_factura.montototalfacturado = data[4];
                                                this.state.obj_factura.codigocontrol = data[6];
                                                this.state.obj_factura.nitcliente = data[7];
                                                this.setState({
                                                    obj_factura: this.state.obj_factura,
                                                    visible_generarQr: false,
                                                });
                                                return;
                                            } else {
                                                message.warning(' Qr inválido ')
                                            }
                                        } else {
                                            message.error( 'Imagen Inválido.' );
                                        }
                                        
                                    } }
                                    legacyMode
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'center', paddingRight: 5, }}>
                                <C_Button
                                    title={'Guardar y volver a Compra'}
                                    type='primary'
                                    onClick={ this.onRegistrarFacturaCompra.bind(this) }
                                /> 
                                <C_Button
                                    title={'Salir sin guardar'}
                                    type='danger'
                                    onClick={ () => {
                                        this.setState({
                                            obj_factura: {
                                                nitproveedor: '',
                                                nrofactura: '',
                                                nroautorizacion: '',
                                                fechafactura: '',
                                                montototalfacturado: '',
                                                codigocontrol: '',
                                                nitcliente: '',
                                            },
                                            visible_generarFactura: false,
                                            check_regfactura: 'N',
                                        });
                                    } }
                                /> 
                            </div>
                        </div>
                    </div>
                }
                footer={false}
            />
        );
    }

    componentGenerarQr() {
        if ( !this.state.visible_generarQr ) return null;
        return (
            <AddQr 
                visible={ this.state.visible_generarQr }
                loading={ this.state.loading_generarQr }
                onSanWebCan={ (result) => {
                    console.log(result)
                    if ( result ) {
                        let data = result.split('|');
                        if ( data.length >= 8 ) {
                            this.state.obj_factura.nitproveedor = data[0];
                            this.state.obj_factura.nrofactura = data[1];
                            this.state.obj_factura.nroautorizacion = data[2];
                            this.state.obj_factura.fechafactura = convertYmdToDmy( data[3], '/' );
                            this.state.obj_factura.montototalfacturado = data[4];
                            this.state.obj_factura.codigocontrol = data[6];
                            this.state.obj_factura.nitcliente = data[7];
                            this.setState({
                                obj_factura: this.state.obj_factura,
                                visible_generarQr: false,
                            });
                            return;
                        } else {
                            message.warning(' Qr inválido ')
                        }
                    } else {
                        message.error( 'Imagen Inválido.' );
                    }
                    this.setState({
                        visible_generarQr: false,
                    });
                } }
                onCancel={ () => {
                    this.setState({
                        visible_generarQr: false,
                    });
                } }
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }

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

        const usuario = user == undefined ? null : user.apellido == null ? user.nombre : user.nombre + ' ' + user.apellido;
        
        return (
            <div className="rows">

                {this.componentProveedorShow()}
                {this.componentCancelarCompra()}
                {this.componentTipoPlanPago()}
                {this.componentPago()}
                {this.componentSubmitCompra()}
                {this.componentImprimirCompra()}

                { this.componentRegistroFactura() }
                { this.componentGenerarQr() }

                <div className="cards">

                    <form target="_blank" id='imprimir_recibo' method="post" action={routes.reporte_compra_recibo} >

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

                        <input type="hidden" value={JSON.stringify(this.state.compra)} name="compra_first" />
                        <input type="hidden" value={JSON.stringify(this.state.compradetalle)} name="compra_detalle" />
                        <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                        <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                    </form>

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Compra</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Codigo"
                                value={this.state.codigo}
                                onChange={this.onChangeCodCompra.bind(this)}
                                validar={this.state.validar_codigo}
                                permisions = {this.permisions.codigo}
                                configAllowed={this.state.config_codigo}
                                mensaje='El codigo ya existe'
                            />
                            <C_Select
                                value={this.state.idsucursal}
                                title={"Sucursal"}
                                onChange={this.onChangeIDSucursal.bind(this)}
                                component={this.componentSecursal()}
                                permisions = {this.permisions.sucursal}
                            />
                            <C_Select
                                value={this.state.idalmacen}
                                title={"Almacen"}
                                onChange={this.onChangeIDAlmacen.bind(this)}
                                component={this.componentAlmacen()}
                                permisions={this.permisions.almacen}
                            />
                            <C_Select
                                value={this.state.idmoneda}
                                title={"Moneda"}
                                onChange={this.onChangeIDMoneda.bind(this)}
                                component={this.componentMoneda()}
                                permisions = {this.permisions.moneda}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{padding: 0,}}>
                                { this.componentButtomProveedor() }
                                <C_Select
                                    showSearch={true}
                                    value={this.state.idproveedor}
                                    placeholder={"Buscar proveedor por Id o Codigo"}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchProvCodID.bind(this)}
                                    onChange={this.onChangeIDProv.bind(this)}
                                    notFoundContent={null}
                                    component={this.componentProveedorCodID()}
                                    onDelete={() => this.setState({idproveedor: '', nitproveedor: '',})}
                                    allowDelete={this.state.idproveedor == '' ? false : true}
                                    title="Cod/Id"
                                    permisions = {this.permisions.codigo_proveedor}
                                    className="cols-lg-10 cols-md-10 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                            </div>
                            <C_Select
                                showSearch={true}
                                value={this.state.idproveedor}
                                placeholder={"Buscar proveedor"}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchProvNom.bind(this)}
                                onChange={this.onChangeIDProv.bind(this)}
                                notFoundContent={null}
                                component={this.componentProveedorNom()}
                                onDelete={() => this.setState({idproveedor: '', nitproveedor: '',})}
                                allowDelete={this.state.idproveedor == '' ? false : true}
                                title="Nombre"
                                permisions = {this.permisions.nombre_proveedor}
                                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Input
                                title="Nit"
                                value={this.state.nitproveedor}
                                //onChange={this.onChangeNit}
                                readOnly={true}
                                permisions = {this.permisions.nit_proveedor}
                            />
                            {/* <C_Select
                                value={this.state.planpago}
                                title={"Plan Pago"}
                                onChange={(value) => this.setState({planpago: value,})}
                                component={[
                                    <Option key={0} value="C">Contado</Option>,
                                    <Option key={1} value="R">Credito</Option>
                                ]}
                                permisions = {this.permisions.plan_pago}
                                
                            /> */}
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_DatePicker
                                format='DD-MM-YYYY'
                                placeholder="Select Time"
                                value={this.state.fecha}
                                defaultValue={this.state.fecha}
                                onChange={(date) => this.setState({fecha: date,})}
                                title="Fecha"
                                permisions = {this.permisions.fecha}
                            />
                            <C_DatePicker
                                showTime={true}
                                mode='time'
                                format='HH:mm:ss'
                                placeholder="Select Time"
                                value={this.state.hora}
                                onChange={(time) => this.setState({hora: time,})}
                                title="Hora"
                                permisions = {this.permisions.hora}
                            />
                        </div>
                    </div>
                    <div className="table_index_comerce">
                        <div className="cabecera_comerce">
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 130, minWidth: 130, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Cod Producto'}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: (!this.state.es_abogado) ? 250: 320, 
                                    minWidth: (!this.state.es_abogado) ? 250: 320, 
                                    height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Producto'}
                                suffix={
                                        <C_Button placement='top' tooltip='NUEVO PRODUCTO'
                                            title={<i className="fa fa-plus"></i>}
                                            type='primary' size='small' style={{padding: 4, }}
                                            onClick={this.crearNuevoProducto.bind(this)}
                                        />
                                }
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 70, minWidth: 70, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Unid. Med.'}
                                configAllowed={!this.state.es_abogado}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 120,  minWidth: 120, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Cantidad'}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 150, 
                                    minWidth: 150, 
                                    height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Costo Unit'}
                            />
                            <C_Input className=''
                                readOnly={true}
                                style={{width: 150, minWidth: 150, height: 30, margin: 10, marginBottom: -2, maringLeft: 0, marginRight: 0,
                                    fontSize: 12, textAlign: 'center', paddingLeft: 0, paddingRight: 0, fontWeight: 'bold',
                                    border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid #e8e8e8'
                                }}
                                value={'Costo Total'}
                            />
                            <div style={{width: 40, minWidth: 40, height: 30, background: 'transparent', margin: 10, marginBottom: -2,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <C_Button
                                    title={<i className="fa fa-plus"></i>}
                                    type='primary' size='small' style={{padding: 4, }}
                                    onClick={this.addRowProducto.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="body_commerce" style={{paddingTop: 10,}}>
                            {this.state.productos_index.map(
                                (data, key) => (
                                    <div style={{width: '100%', display: 'flex', 
                                            paddingTop: 8, paddingBottom: 8, position: 'relative'}} 
                                        key={key}
                                    >
                                        {(data.idproducto != '')?
                                            <div className='alert_commerce_success'
                                                style={{position: 'absolute', left: 4, top: -4, padding: 1, paddingLeft: 3, paddingRight: 3,
                                                    border: '1px solid #3DC7BE', borderRadius: 2, fontSize: 13, color: 'white',
                                                    background: '#3DC7BE', fontFamily: 'Roboto', zIndex: 5,
                                                }}
                                            > 
                                                {data.tipo == 'P' ? 'Stock: ' + parseInt(data.stock) : 'SERVICIO'}
                                            </div>:null
                                        }
                                        <C_Select //alert_commerce_success
                                            showSearch={true}
                                            value={data.idproducto}
                                            placeholder="Codigo"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={this.onSearchProdCod.bind(this, key)}
                                            onChange={this.onChangeIDProducto.bind(this, key)}
                                            component={this.componentProductoCodID(key)}
                                            allowDelete={(data.idproducto == '')?false:true}
                                            onDelete={this.onDeleteIDProducto.bind(this, key)}
                                            style={{width: 130, minWidth: 130, marginTop: 5, marginLeft: 10, marginRight: 10, }}
                                            className=''
                                        />
                                        <C_Select
                                            showSearch={true}
                                            value={data.idproducto}
                                            placeholder="Descripcion"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={this.onSearchProdDesc.bind(this, key)}
                                            onChange={this.onChangeIDProducto.bind(this, key)}
                                            component={this.componentProductoDesc(key)}
                                            allowDelete={(data.idproducto == '')?false:true}
                                            onDelete={this.onDeleteIDProducto.bind(this, key)}
                                            style={{width: (!this.state.es_abogado) ? 250: 320, 
                                                minWidth: (!this.state.es_abogado) ? 250: 320, 
                                                marginTop: 5, marginRight: 10,
                                            }}
                                            className=''
                                        />
                                        <C_Input className=''
                                            readOnly={true}
                                            style={{ width: 70, minWidth: 70, textAlign: 'right', 
                                                paddingRight: 5, marginTop: 5, marginRight: 10,
                                            }}
                                            configAllowed={!this.state.es_abogado}
                                            value={data.unidadmedida}
                                        />
                                        <C_Input className=''
                                            value={data.cantidad}
                                            readOnly={(data.idproducto == '')?true:false}
                                            onChange={this.onChangeProdCantidad.bind(this, key)}
                                            style={{width: 120, minWidth: 120, textAlign: 'right', 
                                                paddingRight: data.idproducto != '' ? 15 : 5, marginTop: 5, marginRight: 10,
                                            }}
                                        />
                                        <C_Input className=''
                                            value={data.costo}
                                            onChange = {this.onChangeProdCosto.bind(this, key)}
                                            style={{width: 150, 
                                                minWidth: 150, 
                                                textAlign: 'right', paddingRight: 5, marginTop: 5, marginRight: 10,
                                            }}
                                            readOnly={(data.idproducto == '')?true:false}
                                        />
                                        <C_Input className=''
                                            value={data.costototal}
                                            readOnly={true}
                                            style={{width: 150, minWidth: 150, textAlign: 'right', 
                                                paddingRight: 5, marginTop: 5, marginRight: 10,
                                            }}
                                        />
                                        <div style={{width: 40, minWidth: 40, height: 35, background: 'transparent', marginTop: 5, marginBottom: -2,
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                            }}
                                        >
                                            <C_Button
                                                title={<i className="fa fa-remove"></i>}
                                                type='danger' size='small' style={{padding: 3, }}
                                                onClick={this.removeProductRow.bind(this, key)}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{marginTop: 10,}}>
                            <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12">
                                <TextArea
                                    title="Notas"
                                    value={this.state.notas}
                                    onChange={(value) => this.setState({notas: value,})}
                                    permisions = {this.permisions.notas}
                                />
                            </div>
                            <div className="cols-lg-1 cols-md-1 cols-sm-1"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input
                                    title="Total"
                                    value={this.state.costototal}
                                    readOnly={true}
                                    permisions = {this.permisions.total}
                                    style={{marginTop: 10,}}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title={'Registrar Factura'}
                                    type='primary'
                                    onClick={ () => {
                                        this.setState({ visible_generarFactura: true, });
                                    } }
                                    style={{ marginRight: 10, }}
                                /> 
                                <C_Button
                                    title='Guardar Compra'
                                    type='primary'
                                    onClick={this.onValidar_data.bind(this)}
                                />
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({visible_cancelar: true,})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(CreateCompra);