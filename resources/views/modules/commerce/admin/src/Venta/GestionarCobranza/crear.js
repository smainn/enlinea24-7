
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link} from 'react-router-dom';
import { message, Modal, DatePicker, Select, Divider, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, hourToString, dateHourToString } from '../../../tools/toolsDate';
import ws from '../../../tools/webservices';
import keys from '../../../tools/keys';
import routes from '../../../tools/routes';
import {httpRequest, removeAllData, readData} from '../../../tools/toolsStorage';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import CSelect from '../../../components/select2';

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;

import moment from 'moment';
import { readPermisions } from '../../../tools/toolsPermisions';
import Confirmation from '../../../components/confirmation';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';
import C_Select from '../../../components/data/select';
import C_DatePicker from '../../../components/data/date';
import C_CheckBox from '../../../components/data/checkbox';

const Option = Select.Option;
let dateNow = new Date();

export default class CreateCobranza extends Component{

    constructor(){
        super();
        this.state = {
            visibleprint: false,
            idcobro: 0,

            visibleCobro: false,
            nro: 0,
            fechaActual: this.fechaActual(),

            codcobro: '',
            fecha: dateHourToString(dateNow),
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
            arrayCheck: [],
            messageConfirm: '',
            valSearchIdCod: undefined,
            valSearchCli: undefined,
            timeoutSearchCod: null,

            redirect: false,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,

            searchByCli: false,
            resultClientes: [],

            productos: [],
            vendedores: [],
            ventas: [],
            arrayCheckVenta: [],
            ultimoCheck: -1,
            ultimoCheckCuota: -1,

            pagarPorMonto: true,
            pagarSelect: true,
            isabogado: false,
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

        /*
        let sw = false;
        if (value == '') {
            value = 0;
        } else if (isNaN(value)) {
            sw = true;
            //return;
        } else if (value[0] == '0') {
            value = value.substring(1);
        } else if (isNaN(value[0])) {
            value[0] = "";
        } else if(parseInt(value) < 0) {
            sw = true;
            //return;
        }
        */

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
                    totalPagar: value,
                    pagarSelect: false
                })
            }
        }

        /*
        let cant = parseInt(value);
        let checkbox = this.state.arrayCheck;
        let total = 0;
        for (let i = 0; i < checkbox.length; i++) {
            if (i < cant) {
                total = total + parseFloat(this.state.listaCuotas[i].montoapagar);
                checkbox[i] = true;
            } else {
                checkbox[i] = false;
            }
        }
        this.setState({
            cantCuotas: value,
            arrayCheck: checkbox,
            totalPagar: total.toFixed(2)
        });
        */
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
            fecha: this.state.fecha,
            notas: this.state.notas,
            idsplanpago: JSON.stringify(idsPlanPago),
            montos: JSON.stringify(montos),
            idventa: this.state.idventa,
            mtotocobrado: this.state.totalPagar,
            montoPagar: this.state.cantCuotas //MONTO A PAGAR
        };
        console.log(body);
        httpRequest('post', ws.wscobranza, body)
        .then((result) => {
            if (result.response > 0) {
                message.success(result.message);
                this.setState({
                    visibleCobro: false,
                    idcobro: result.idcobro,
                });
                setTimeout(() => {
                    this.setState({
                        visibleprint: true,
                    });
                }, 300);
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    searchVentaIdCod(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchventaidcod + '/' + value)
            .then((result) => {
                if (result.response > 0) {
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
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
            })
        } else {
            /*
            this.setState({
                resultProveCod: []
            });
            */
        }
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
                let cod = array[i].cliente.codcliente;
                codcliente = (cod == null || !this.state.configCodigo) ? array[i].cliente.idcliente :  cod;
                let apellido = array[i].cliente.apellido == null ? '' : array[i].cliente.apellido;
                fullname = array[i].cliente.nombre + ' ' + apellido;
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
            montototal: total,
            valSearchIdCod: value,
            cliente: fullname,
            codcliente: codcliente,
            totalpagos: cobrado,
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
                console.log(result);
                this.setState({
                    listaCuotas: [], 
                    arrayCheck: [],
                    arraySaldos: []
                });
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                listaCuotas: [],
                arrayCheck: [],
                arraySaldos: []
            });
        })
    }

    validarParametros() {
        if (this.state.codcobro.length === 0 && this.state.configCodigo) {
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
        this.getConfigsClient();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios,
                    isabogado: result.data.clienteesabogado
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getNroCobro() {
        httpRequest('get', '/commerce/api/cobro/create')
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
                this.setState({
                    nro: result.data,
                });
        })
        .catch(
            error => console.log(error)
        );
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
                    format='YYYY-MM-DD HH:mm'
                    value={this.state.fecha}
                    onChange={this.onChangeFecha}
                    className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                    title='Fecha'
                    placeholder="Selecciona la Fecha"
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
                message.error('Ocurrio un problema con la conexio, vuelva a cargar la pagina');
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
            montototal: venta.montototal,
            totalpagos: venta.montocobrado,
            saldo: saldo,
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
                                            {item.montototal}
                                            {/*}
                                            <Input
                                                placeholder="Total"
                                                value={item.montototal}
                                            />*/}
                                        </td>
                                        <td>
                                            {item.saldopagar}
                                            {/*<Input
                                                placeholder="Saldo"
                                                value={item.saldopagar}
                                            />*/}
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
                        <button 
                            type="button" 
                            className="btns btns-primary"
                            onClick={this.seleccionarVenta.bind(this)}>
                            Seleccionar y volver
                        </button>
                        <button
                            className="btns btns-danger" 
                            type="button" 
                            onClick={this.sinSeleccionarVenta.bind(this)}>
                            Volver sin seleccionar
                        </button>
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
                    <button 
                        onClick={() => this.setState({ searchByCli: true })}
                        type="button"
                        className="btns btns-primary">
                        Buscar por cliente
                    </button>
                </div>
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
        const componentBtnSearchCli = this.componentBtnSearchCli();

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/cobranza/index/"/>
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
                        onOk={this.storeCobranza}
                        //footer={null}
                    >
                        { componentModalConfirm }
                </Modal>
                <Modal
                    visible={this.state.visibleprint}
                    footer={null}
                    title={'Recibo de Cobro'}
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
                            <form target="_blank" method="post" action="/commerce/admin/cobranza/recibo">

                                <input type="hidden" value={conexion} name="x_conexion" />
                                <input type="hidden" value={this.state.idcobro} name="id" />
                                <input type="hidden" value={usuario} name="usuario" />

                                <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                <input type="hidden" value={x_login} name="x_login" />
                                <input type="hidden" value={x_fecha} name="x_fecha" />
                                <input type="hidden" value={x_hora} name="x_hora" />
                                <input type="hidden" value={token} name="authorization" />

                                <button type="button" onClick={this.onCancelPrint.bind(this)}
                                    className="btns btns-danger">
                                    No
                                </button>
                                <button 
                                    onClick={this.onOkPrint.bind(this)}
                                    type="submit"
                                    className="btns btns-primary">
                                    Si
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
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
                                        let codventa = this.state.configCodigo ? item.codventa : item.idventa;
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
                                <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                    <Input
                                        title="Codigo"
                                        value={this.state.codcliente}
                                        readOnly={true}
                                        permisions={this.permisions.cliente_cod}
                                    />
                                </div>

                                <div className="cols-lg-8 cols-md-8 cols-sm-9 cols-xs-12">
                                    <Input
                                        title="Cliente"
                                        value={this.state.cliente}
                                        readOnly={true}
                                        permisions={this.permisions.cliente_nom}
                                    /> 
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <TextArea
                                        title="Notas"
                                        value={this.state.notas}
                                        onChange={this.onChangeNotas}
                                        permisions={this.permisions.notas}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <Input
                                    title="Total Venta"
                                    value={this.state.montototal}
                                    readOnly={true}
                                    permisions={this.permisions.total_venta}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{ marginTop: 30 }}
                            >
                                <Input
                                    title="Pagos Acumulados"
                                    value={this.state.totalpagos}
                                    readOnly={true}
                                    permisions={this.permisions.pagos_acumulados}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{ marginTop: 30 }}
                                >
                                <Input
                                    title="Saldo"
                                    value={this.state.saldo}
                                    readOnly={true}
                                    permisions={this.permisions.saldo}
                                />
                            </div>
                        </div>

                        <Divider orientation='left'>Lista de Cuotas</Divider>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input
                                    //title="Cuotas a Pagar "
                                    title="Monto a Pagar "
                                    value={this.state.cantCuotas}
                                    onChange={this.onChangeCuotasPagar}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input
                                    title="Total a Pagar"
                                    value={this.state.totalPagar}
                                    readOnly={true}
                                />
                            </div>
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
                                                    <td>{item.fechaapagar}</td>
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


