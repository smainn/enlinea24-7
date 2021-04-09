
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, withRouter} from 'react-router-dom';
import { message, Modal, DatePicker, Select, Divider, Checkbox, notification } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, hourToString, dateHourToString, convertDmyToYmd, convertYmdToDmy, convertDmyToYmdWithHour } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import keys from '../../../utils/keys';
import routes from '../../../utils/routes';
import {httpRequest, removeAllData, readData} from '../../../utils/toolsStorage';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import CSelect from '../../../componentes/select2';

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;

import moment from 'moment';
import { readPermisions } from '../../../utils/toolsPermisions';
import Confirmation from '../../../componentes/confirmation';
import keysStorage from '../../../utils/keysStorage';
import C_Button from '../../../componentes/data/button';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_CheckBox from '../../../componentes/data/checkbox';
import strings from '../../../utils/strings';
import C_Input from '../../../componentes/data/input';
import C_TextArea from '../../../componentes/data/textarea';

const Option = Select.Option;
let dateNow = new Date();

class CreateCobranza extends Component{

    constructor(props){
        super(props);
        this.state = {
            visibleprint: false,
            visible_imprimir: false,
            loading: false,
            idcobro: 0,

            visibleCobro: false,
            nro: 0,
            fechaActual: this.fechaActual(),

            codcobro: '',
            fecha: dateHourToString(dateNow, 'f2'),
            hora: hourToString(dateNow),
            notas: '',
            
            idventa: 0,
            codcliente: '',
            cliente: '',
            montototal: 0,
            totalpagos: 0,
            saldo: 0,
            cantCuotas: '',
            messageConfirm: '',
            totalPagar: 0,
            arraySaldos: [],
            listaCuotas: [],

            resultVentas: [],
            namecliente: '',
            nitcliente: '',

            arrayCheck: [],
            messageConfirm: '',
            valSearchIdCod: undefined,
            valSearchCli: undefined,
            timeoutSearchCod: null,

            redirect: false,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,
            ventaendospasos: false,
            facturarsiempre: 'N',

            checked_imprimir_ok: true,
            checked_imprimir_cancel: false,

            checked_generarfactura_ok: false,
            checked_generarfactura_cancel: true,

            searchByCli: false,
            resultClientes: [],

            productos: [],
            vendedores: [],
            ventas: [],
            arrayCheckVenta: [],
            ultimoCheck: -1,
            ultimoCheckCuota: -1,

            loadingOk: false,
            pagarPorMonto: true,
            pagarSelect: true,
            isabogado: false,

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            idventa: null,
            fkidtipocontacredito: null,

        }

        this.permisions = {
            codigo: readPermisions(keys.cobranza_input_codigo),
            codigo_venta: readPermisions(keys.cobranza_input_search_codigoVenta),
            fecha: readPermisions(keys.cobranza_fecha),
            cliente_cod: readPermisions(keys.cobranza_input_codigoCliente),
            cliente_nom: readPermisions(keys.cobranza_input_nombreCliente),
            notas: readPermisions(keys.cobranza_textarea_nota),
            total_venta: readPermisions(keys.cobranza_input_totalVenta),
            pagos_acumulados: readPermisions(keys.cobranza_input_pagosAcumulados),
            saldo: readPermisions(keys.cobranza_input_saldo),
            btn_search_cli: readPermisions(keys.cobranza_search_cliente)
        }

        this.onChangeCobro = this.onChangeCobro.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeHora = this.onChangeHora.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onChangeTotal = this.onChangeTotal.bind(this);
        this.onChangeCheckCuota = this.onChangeCheckCuota.bind(this);
        this.onChangeCuotasPagar = this.onChangeCuotasPagar.bind(this);
        this.onSearchVentaIdCod = this.onSearchVentaIdCod.bind(this);
        this.onChangeSearchVenta = this.onChangeSearchVenta.bind(this);
        this.storeCobranza = this.storeCobranza.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.onSearchCliente = this.onSearchCliente.bind(this);
        this.onDeselectCli = this.onDeselectCli.bind(this);
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = dia + '/' + mes + '/' + year;

        return fechaFormato;   
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

    onChangeTotal(e) {
        this.setState({ montototal: e.target.value });
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodcobrovalido + '/' + value)
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

    onChangeCobro(value) {
        this.handleVerificCodigo(value);
        this.setState({ codcobro: value });
    }

    onChangeFecha(dateString) {
        this.setState({ fecha: dateString });
    }

    onChangeHora(date,dateString) {
        this.setState({ hora: dateString });
    }

    onChangeNotas(value) {
        this.setState({ notas: value });
    }

    onChangeCheckCuota(index, e) {

        if (this.state.pagarSelect) {
            let value = e.target.checked;
            //this.state.arrayCheck[index] = !this.state.arrayCheck[index];
            if (value && index > 0 && !this.state.arrayCheck[index-1]) return;
            if (!value && index != this.state.ultimoCheckCuota) return;
            this.state.arrayCheck[index] = value;
            let length = this.state.arrayCheck.length;
            let sw = false;
            let sum = 0;
            for (let i = 0; i < length; i++) {
                if (this.state.arrayCheck[i]) {
                    sw = true;
                    let cuota = parseFloat(this.state.listaCuotas[i].montoapagar);
                    let pagado = parseFloat(this.state.listaCuotas[i].montopagado);
                    sum = sum + (cuota - pagado);
                }
            }
            let ult = value ? index : this.state.ultimoCheckCuota - 1;
            
            this.setState({
                arrayCheck: this.state.arrayCheck,
                pagarPorMonto: !sw,
                totalPagar: sum.toFixed(2),
                ultimoCheckCuota: ult
            });
        }
    }

    onChangeCuotasPagar(value) {

        if (isNaN(value) || this.state.listaCuotas.length === 0) return;
        if (parseFloat(value) > parseFloat(this.state.listaCuotas[0].mtototventa)) {
            message.warning('El monto no puede ser mayor a la deuda');
            return;
        }
        if (this.state.pagarPorMonto) {
            if (value == '' || value == 0) {
                this.setState({
                    cantCuotas: value,
                    totalPagar: 0,
                    pagarSelect: true
                })
            } else {
                this.setState({
                    cantCuotas: value,
                    totalPagar: parseFloat(value).toFixed(2),
                    pagarSelect: false
                })
            }
        }
    }

    getIdsPlanPago(idsPlanPago, montos) {
        let length = this.state.listaCuotas.length;
        for (let i = 0; i < length; i++) {
            if (this.state.arrayCheck[i]) {
                idsPlanPago.push(this.state.listaCuotas[i].idventaplandepago);
                let cuota = parseFloat(this.state.listaCuotas[i].montoapagar);
                let pagado = parseFloat(this.state.listaCuotas[i].montopagado);
                let saldo = cuota - pagado;
                montos.push(saldo);
            }
        }
    }

    storeCobranza(e) {
        let idsPlanPago = [];
        let montos = [];
        this.getIdsPlanPago(idsPlanPago, montos);
        let body = {
            codcobro: this.state.codcobro,
            fecha: convertDmyToYmdWithHour(this.state.fecha),
            notas: this.state.notas,
            idsplanpago: JSON.stringify(idsPlanPago),
            montos: JSON.stringify(montos),
            idventa: this.state.idventa,
            mtotocobrado: this.state.totalPagar,
            montoPagar: this.state.cantCuotas //MONTO A PAGAR
        };
        //console.log(body)
        httpRequest('post', ws.wscobranza, body)
        .then((result) => {
            if (result.response > 0) {

                message.success(result.message);

                if (result.bandera == 1) {
                    notification.error({
                        message: 'Advertencia',
                        description:
                            'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                    
                    });
                }

                var facturarsiempre = this.state.facturarsiempre;

                this.setState({
                    visibleCobro: false,
                    idcobro: result.idcobro,
                    fkidtipocontacredito: result.fkidtipocontacredito,
                    facturarsiempre: result.fkidtipocontacredito == 1 ?  !this.state.ventaendospasos ? 'N' : result.bandera == 1 ? 'N' : facturarsiempre :  'N',
                    checked_generarfactura_ok: result.fkidtipocontacredito == 1 ?  !this.state.ventaendospasos ? false :  result.bandera == 1 ? false : facturarsiempre == 'S' ? true : false :   false,
                    checked_generarfactura_cancel: result.fkidtipocontacredito == 1 ?  !this.state.ventaendospasos ? true : result.bandera == 1 ? true : facturarsiempre == 'S' ? false : true :  true ,
                });

                setTimeout(() => {
                    this.setState({
                        visible_imprimir: true,
                    });
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

    searchVentaIdCod(value) {
        let body = {
            value: value,
        };
        httpRequest('post', ws.wscobranza + '/searchByIdCod', body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    resultVentas: result.data
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

    onSearchVentaIdCod(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(() => this.searchVentaIdCod(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    onChangeSearchVenta(value) {
        let array = this.state.resultVentas;
        let codcliente = '';
        let fullname = '';
        let total = 0;
        let cobrado = 0;
        let idventa = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idventa == value || array[i].codventa == value) {
                let cod = array[i].codcliente;
                codcliente = (cod == null || !this.state.configCodigo) ? array[i].idcliente :  cod;
                let apellido = array[i].apellido == null ? '' : array[i].apellido;
                fullname = array[i].nombre + ' ' + apellido;
                total = parseFloat(array[i].mtototventa);
                cobrado = parseFloat(array[i].mtototcobrado);
                idventa = parseFloat(array[i].idventa);
                break;
            }
        }
        this.getCuotas(idventa);
        //let cliente = value + ' ' + fullname;
        //message.success('TOTAL ', montototal);
        let saldo = (total - cobrado).toFixed(2);
        this.setState({
            montototal: total.toFixed(2),
            valSearchIdCod: value,
            cliente: fullname,
            codcliente: codcliente,
            totalpagos: cobrado.toFixed(2),
            saldo: saldo,
            idventa: idventa
        });
    }

    getCuotas(idventa) {

        httpRequest('get', ws.wsgetcuotasventa + '/' + idventa)
        .then((result) => {
            if (result.response == 1 && result.cuotas.length > 0) {
                let cuotas = result.cuotas;
                let saldo = cuotas[0].mtototventa - cuotas[0].mtototcobrado;
                let array = [];
                let arraySaldos = [];
                for (let i = 0; i < cuotas.length; i++) {
                    array.push(false);
                    let montoPagar = (parseFloat(cuotas[i].montoapagar) - parseFloat(cuotas[i].montopagado)).toFixed(2);
                    
                    if (i === 0) {                        
                        arraySaldos[i] = (saldo - parseFloat(montoPagar)).toFixed(2)
                    } else {
                        arraySaldos[i] = (arraySaldos[i-1] - parseFloat(montoPagar)).toFixed(2);
                    }
                }
                this.setState({
                    listaCuotas: result.cuotas,
                    arrayCheck: array,
                    arraySaldos: arraySaldos
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
                this.setState({
                    listaCuotas: [], 
                    arrayCheck: [],
                    arraySaldos: []
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                listaCuotas: [],
                arrayCheck: [],
                arraySaldos: []
            });
        })
    }

    validarParametros() {
        if ((this.state.codcobro.length === 0 && this.state.configCodigo) || this.state.validarCodigo == 0) {
            message.error('El codigo es oblifgatorio');
            return false;
        }
        if (this.state.valSearchIdCod == undefined) {
            message.error('Debe seleccionar una venta');
            return false;
        }
        if (this.state.listaCuotas.length === 0) {
            message.error('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        if (this.state.pagarPorMonto && (this.state.cantCuotas == '' || this.state.cantCuotas < 1)) {
            message.error('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        return true;
    }

    getMessageConfirm() {

        let mensaje = '';
        if (this.state.pagarPorMonto) {
            let monto = this.state.totalPagar;
            let i = 0;
            while (monto > 0) {
                mensaje += this.state.listaCuotas[i].descripcion + ' ';
                monto -= this.state.listaCuotas[i].montoapagar;
                i++;
            }
        } else {
            let length = this.state.listaCuotas.length;
            for (let i = 0; i < length; i++) {
                if (this.state.arrayCheck[i]) {
                    mensaje += this.state.listaCuotas[i].descripcion + ' ';
                }
            }
        }

        return mensaje;

    }

    showConfirmStore() {
        if (!this.validarParametros()) return;
        const storeCobranza = this.storeCobranza.bind(this);
        Modal.confirm({
            title: 'Guardar Cobranza',
            content: this.getMessageConfirm(),
            onOk() {
                console.log('OK');
                storeCobranza();
            },
            onCancel() {
                console.log('Cancel');
                return false;
            },
        });
    }

    redirect() {
        this.setState({ redirect: true});
    }

    showConfirmCancel() {
        
        const redirect = this.redirect.bind(this);
        Modal.confirm({
            title: 'Salir de registrar cobro',
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

    openModalCobro() {
        if (!this.validarParametros()) return;
        let mensaje = this.getMessageConfirm();
        this.setState({ 
            visibleCobro: true,
            messageConfirm: mensaje
        });
    }

    closeModalCobro() {
        this.setState({ visibleCobro: false,});
    }

    componentDidMount() {
        this.get_data();
    }

    get_data() {
        httpRequest('get', ws.wscobranza + '/create')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configscliente.codigospropios,
                    isabogado: result.configscliente.clienteesabogado,
                    ventaendospasos: result.configscliente.ventaendospasos,
                    facturarsiempre: result.configscliente.facturarsiempre,
                    resultVentas: result.venta,
                });
                if (result.bandera == 1) {
                    notification.error({
                        message: 'Advertencia',
                        description:
                            'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                    });
                }
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    
    componentModalConfirm() {
        return (
            <div className="form-group-content">
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <label style={{'fontWeight': 'bold'}}>Cuotas seleccionadas</label>
                    </div>
                    <div className="col-lg-6-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <label>{this.state.messageConfirm}</label>
                    </div>
                </div>
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <label style={{'fontWeight': 'bold'}}>Monto Total Cobrado</label>
                    </div>
                    <div className="col-lg-6-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <label>{this.state.totalPagar}</label>
                    </div>
                </div>
            </div>
        )
    }

    validarPermisosFecha() {
        if (this.permisions.fecha.visible == 'A') {
            let disabled = this.permisions.fecha.editable == 'A' ? false : true;
            return (
                <C_DatePicker 
                    allowClear={false}
                    readOnly={disabled}
                    format='DD-MM-YYYY HH:mm'
                    value={this.state.fecha}
                    onChange={this.onChangeFecha}
                    className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                    title='Fecha'
                    placeholder="Selecciona la Fecha"
                    //showTime={true}
                />
            );
        }
        return null;
    }

    onCancelPrint() {
        this.setState({
            visibleprint: false,
            redirect: true,
        });
    }

    searchCliente(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchcliventas + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes: result.data
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

    getVentasCliente(id) {
        httpRequest('get', ws.wsgetventasclientes + '/' + id)
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
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onChangeSearchCliente(value) {

        this.getVentasCliente(value);
        this.setState({
            valSearchCli: value
        })
    }

    onDeselectCli() {
        this.setState({
            valSearchCli: undefined,
            vendedores: [],
            productos: [],
            ventas: [],
            arrayCheckVenta: []
        })
    }

    seleccionarVenta() {

        if (this.state.ultimoCheck < 0 || this.state.ventas.length === 0) {
            message.warning('Debe seleccionar una venta');
            return;
        }
        let venta = this.state.ventas[this.state.ultimoCheck];
        let clientes = this.state.resultClientes;
        let length = clientes.length;
        let fullname = this.state.cliente;
        let codcliente = this.state.codcliente;
        for (let i = 0; i < length; i++) {
            if (this.state.valSearchCli == clientes[i].idcliente) {
                codcliente = this.state.configCodigo ? clientes[i].codcliente : clientes[i].idcliente;
                let nombrecli = clientes[i].nombre;
                let apellidocli = clientes[i].apellido == null ? '' : clientes[i].apellido;
                fullname = nombrecli + ' ' + apellidocli;
                break;
            }
        }
        this.getCuotas(venta.idventa);
        let saldo = parseFloat(venta.montototal) - parseFloat(venta.montocobrado);
        this.setState({
            codcliente: codcliente,
            cliente: fullname,
            montototal: parseFloat(venta.montototal).toFixed(2),
            totalpagos: parseFloat(venta.montocobrado).toFixed(2),
            saldo: saldo.toFixed(2),
            searchByCli: false,
            resultVentas: [
                ...this.state.resultVentas,
                {
                    idventa: venta.idventa,
                    codventa: venta.codventa
                }
            ],
            valSearchIdCod: venta.idventa,
            idventa: venta.idventa
        })
    }

    sinSeleccionarVenta() {
        this.state.arrayCheckVenta[this.state.ultimoCheck] = false;
        this.setState({
            searchByCli: false,
            codcliente: '',
            cliente: '',
            montototal: 0,
            totalpagos: 0,
            saldo: 0,
            resultVentas: [],
            valSearchIdCod: undefined,
            idventa: 0,
            ultimoCheck: -1,
            arrayCheckVenta: this.state.arrayCheckVenta
        })
    }

    listClientes() {
        let data = this.state.resultClientes;
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
    
    componentSearhCli() {
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
                                <th>Cod Venta</th>
                                {this.state.isabogado ? <th>Nombre Abogado</th> : <th>Nombre Vendedor</th>}
                                <th>Fecha Venta</th>
                                <th>Productos</th>
                                <th>Monto Total</th>
                                <th>Saldo a Pagar</th>
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
                                        </td>
                                        <td style={{ width: 230 }}>
                                            {nombreve + ' ' + apellidove}
                                        </td>
                                        <td style={{ width: 100 }}>{item.fecha}</td>
                                        <td style={{ width: 200 }}>
                                            {productos}
                                        </td>
                                        <td>
                                            {item.montototal}
                                        </td>
                                        <td>
                                            {item.saldopagar}
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
                    <div className="text-center-content">
                        <C_Button 
                            title="Seleccionar y volver"
                            onClick={this.seleccionarVenta.bind(this)}
                        />

                        <C_Button 
                            title="Volver sin seleccionar"
                            onClick={this.sinSeleccionarVenta.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    onOkPrint() {
        setTimeout(() => {
            this.setState({
                visibleprint: false,
                redirect: true,
            });
        }, 300);
    }

    componentBtnSearchCli() {
        if (this.permisions.btn_search_cli.visible == 'A') {
            return (
                <div className="cols-lg-12">
                    <C_Button 
                        title="Buscar por cliente"
                        onClick={() => this.setState({ searchByCli: true })}
                    />
                </div>
            );
        }
        return null;
    }

    ongenerarRecibo(event) {
        event.preventDefault();

        this.setState({
            loading: true,
        });

        if (this.state.checked_imprimir_ok || this.state.checked_generarfactura_ok) {

            if (this.state.checked_generarfactura_ok) {
                
                let body = {
                    idcobro: this.state.idcobro,
                    facturarsiempre: this.state.facturarsiempre,
                    generarfactura: this.state.checked_generarfactura_ok ? 'A' : 'N',
                    ventaendospasos: this.state.ventaendospasos ? 'A' : 'N',
                }
    
                httpRequest('post', ws.wscobranza_factura, body)
                .then(result => {
    
                    if (result.response == 1) {

                        if (result.bandera == 0) {

                            this.setState({
                                venta_first: result.venta,
                                venta_detalle: result.venta_detalle,
                                planpago: result.planpago,
                                config_cliente: result.configcliente,
                                idventa: result.idventa,
                            });

                            setTimeout(() => {

                                document.getElementById('imprimir_factura').submit();

                            }, 1000);

                            setTimeout(() => {
                                this.props.history.goBack();

                            }, 1500);

                        }else {
                            notification.error({
                                message: 'Advertencia',
                                description:
                                    'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                            });
                            this.setState({
                                loading: false,
                            });
                        }
    
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
                setTimeout(() => {
                    document.getElementById('imprimir_recibo').submit();
                }, 500);
                setTimeout(() => {
                    this.props.history.goBack();
                }, 1000);
            }

        }else {
            this.setState({
                loading: true,
            });
            setTimeout(() => {
                this.props.history.goBack();
            }, 400);
        }
    }

    componentReciboVenta() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">

                    {((this.state.facturarsiempre == 'P' || this.state.facturarsiempre == 'S') && this.state.ventaendospasos && this.state.fkidtipocontacredito == 1)?
                    
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

    onCerrarImprimir() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 400);
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
        const componentBtnSearchCli = this.componentBtnSearchCli();
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';


        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.cobranza_index}/>
            )
        }
        const componentModalConfirm = this.componentModalConfirm();
        const validarPermisosFecha = this.validarPermisosFecha();
        const conexion = readData(keysStorage.connection);
        const componentSearhCli = this.componentSearhCli();

        return (
            <div className="rows">
                <Modal
                    title="Guardar Cobro"
                    visible={this.state.visibleCobro}
                    onCancel={this.closeModalCobro.bind(this)}
                    loading={this.state.loadingOk}
                    onOk={this.storeCobranza}
                    footer={
                        <div style={{ textAlign: 'center' }}>
                            <C_Button 
                                title="Cancelar"
                                onClick={this.closeModalCobro.bind(this)}
                                type="danger"
                            />
                            <C_Button 
                                title="Aceptar"
                                onClick={this.storeCobranza}
                            />
                        </div>
                    }
                >
                        { componentModalConfirm }
                </Modal>

                <Confirmation
                    visible={this.state.visible_imprimir}
                    loading={this.state.loading}
                    title="Finalizar Cobro"
                    zIndex={950}
                    width={500}
                    content={this.componentReciboVenta()}
                    footer={false}
                />

                <form target="_blank" method="post" action={routes.cobranza_recibo} id='imprimir_recibo'
                    style={{display: 'none'}}
                >

                    <input type="hidden" value={_token} name="_token" />
                    <input type="hidden" value={conexion} name="x_conexion" />
                    <input type="hidden" value={this.state.idcobro} name="id" />
                    <input type="hidden" value={usuario} name="usuario" />

                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                    <input type="hidden" value={x_login} name="x_login" />
                    <input type="hidden" value={x_fecha} name="x_fecha" />
                    <input type="hidden" value={x_hora} name="x_hora" />
                    <input type="hidden" value={token} name="authorization" />
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

                <div className="cards" style={{display: this.state.searchByCli ? '' : 'none'}}>
                    { componentSearhCli }
                </div>

                <div className="cards" style={{ display: this.state.searchByCli ? 'none' : '' }}>
                    
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Cobranza</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        { componentBtnSearchCli }
                        <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Codigo"
                                        value={this.state.codcobro}
                                        onChange={this.onChangeCobro}
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

                                <C_Select 
                                    showSearch
                                    value={this.state.valSearchIdCod}
                                    placeholder={"Buscar venta por Id o Codigo"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchVentaIdCod}
                                    onChange={this.onChangeSearchVenta}
                                    notFoundContent={null}
                                    allowClear={true}
                                    title='Codigo Venta'
                                    className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                                    component={this.state.resultVentas.map((item, key) => {
                                        let codventa = this.state.configCodigo ? item.codventa == null ? item.idventa : item.codventa : item.idventa;
                                        return (
                                            <Option 
                                                key={key} value={item.idventa}>
                                                {codventa}
                                            </Option>
                                        );
                                    })}
                                />
                                  
                                { validarPermisosFecha }
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    title="Codigo"
                                    value={this.state.codcliente}
                                    readOnly={true}
                                    permisions={this.permisions.cliente_cod}
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal"
                                />
                                <C_Input 
                                    title="Cliente"
                                    value={this.state.cliente}
                                    readOnly={true}
                                    permisions={this.permisions.cliente_nom}
                                    className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12 pt-normal"
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    title="Notas"
                                    value={this.state.notas}
                                    onChange={this.onChangeNotas}
                                    permisions={this.permisions.notas}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                            </div>
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <C_Input 
                                title="Total Venta"
                                value={this.state.montototal}
                                readOnly={true}
                                permisions={this.permisions.total_venta}
                                style={{ textAlign: 'right' }}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            <C_Input 
                                title="Pagos Acumulados"
                                value={this.state.totalpagos}
                                readOnly={true}
                                permisions={this.permisions.pagos_acumulados}
                                style={{ textAlign: 'right', marginTop: 6, }}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                            <C_Input 
                                title="Saldo"
                                value={this.state.saldo}
                                readOnly={true}
                                permisions={this.permisions.saldo}
                                style={{ textAlign: 'right', marginTop: 6, }}
                                className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                            />
                        </div>

                        <Divider orientation='left'>Lista de Cuotas</Divider>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Input 
                                title="Monto a Pagar "
                                value={this.state.cantCuotas}
                                onChange={this.onChangeCuotasPagar}
                            />
                            <C_Input 
                                title="Total a Pagar"
                                value={this.state.totalPagar}
                                readOnly={true}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div 
                                className="table-detalle" 
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
                                            <th>Fecha a Pagar</th>
                                            <th>Monto a Pagar</th>
                                            <th>Saldo</th>
                                            <th>Seleccionar</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.listaCuotas.map((item, key) => {
                                            let monto = parseFloat(item.montoapagar);
                                            let pagado = parseFloat(item.montopagado);
                                            let deuda = (monto - pagado).toFixed(2);
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{item.descripcion}</td>
                                                    <td>{convertYmdToDmy(item.fechaapagar)}</td>
                                                    <td>{deuda}</td>
                                                    <td>{this.state.arraySaldos[key]}</td>
                                                    <td>
                                                        <C_CheckBox
                                                            onChange={this.onChangeCheckCuota.bind(this, key)}
                                                            checked={this.state.arrayCheck[key]}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>  
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button onClick={this.openModalCobro.bind(this)}
                                    title='Guardar' type='primary'
                                />
                                <C_Button onClick={this.showConfirmCancel.bind(this)}
                                    title='Cancelar' type='danger'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateCobranza);
