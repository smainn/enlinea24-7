
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect, Link } from 'react-router-dom';
import { message, Modal, DatePicker, Select, Divider, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, hourToString, dateHourToString, convertYmdToDmy, convertDmyToYmd, convertDmyToYmdWithHour } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import moment from 'moment';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import CSelect from '../../../componentes/select2';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';
import C_TextArea from '../../../componentes/data/textarea';
import C_Select from '../../../componentes/data/select';
import C_CheckBox from '../../../componentes/data/checkbox';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;
const Option = Select.Option;
let dateNow = new Date();

export default class CreatePago extends Component{

    constructor(props) {
        super(props);
        this.state = {
            codpago: '',
            fecha: dateHourToString(dateNow, 'f2'),
            hora: hourToString(dateNow),
            notas: '',
            idcompra: 0,
            codproveedor: '',
            proveedor: '',
            montototal: 0,
            totalpagos: 0,
            saldo: 0,
            montoPagar: '',
            messageConfirm: '',
            totalPagar: 0,
            arraySaldos: [],
            listaCuotas: [],
            resultCompras: [],
            arrayCheckCuota: [],
            ultimoCheckCuota: -1,
            messageConfirm: '',
            valSearchIdCod: undefined,
            timeoutSearchCod: null,
            timeoutSearch: undefined,
            redirect: false,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,
            pagarPorMonto: true,
            pagarPorCuota: true,

            valSearchProv: undefined,
            compras: [],
            proveedores: [],
            productos: [],
            resultProveedores: [],
            searchProv: false,
            arrayCheckCompra: [],
            ultimoCheckCompra: -1,
            modalCancel: false,

        }

        this.permisions = {
            verNro: readPermisions(keys.pago_ver_nro),
            verFecha: readPermisions(keys.pago_ver_fecha),
            codigo: readPermisions(keys.pago_input_codigo),
            codigoCompra: readPermisions(keys.pago_input_search_codigoCompra),
            fecha: readPermisions(keys.pago_fecha),
            totalCompra: readPermisions(keys.pago_input_totalCompra),
            codigoProveedor: readPermisions(keys.pago_input_codigoProveedor),
            nombreProveedor: readPermisions(keys.pago_input_nombreProveedor),
            acumulados: readPermisions(keys.pago_input_acumulados),
            notas: readPermisions(keys.pago_textarea_nota),
            saldo: readPermisions(keys.pago_input_saldo),
            totalPagar: readPermisions(keys.pago_input_totalPagar),
            cuotasPagar: readPermisions(keys.pago_input_cuotasPagar),
            //columnaSaldo: readPermisions(keys.pago_tabla_columna_saldo)
            btn_search_prov: readPermisions(keys.pago_search_proveedor)
        }

        this.onChangePago = this.onChangePago.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeHora = this.onChangeHora.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onChangeTotal = this.onChangeTotal.bind(this);
        this.onChangeCheckCuota = this.onChangeCheckCuota.bind(this);
        this.onChangeMontoPagar = this.onChangeMontoPagar.bind(this);
        this.onSearchCompraIdCod = this.onSearchCompraIdCod.bind(this);
        this.onChangeSearchCompra = this.onChangeSearchCompra.bind(this);
        this.onSearchProveedor = this.onSearchProveedor.bind(this);
        this.searchProveedor = this.searchProveedor.bind(this);
        this.onChangeSearchProveedor = this.onChangeSearchProveedor.bind(this);
        this.onDeselectProv = this.onDeselectProv.bind(this);
        this.onChangeCheckCompra = this.onChangeCheckCompra.bind(this);
        this.storePago = this.storePago.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        
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

    onChangeTotal(e) {
        this.setState({ montototal: e.target.value });
    }

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodpagovalido + '/' + value)
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

    onChangePago(value) {
        this.handleVerificCodigo(value);
        this.setState({ codpago: value });
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

    onChangeCheckCompra(index, e) {
        if (this.state.ultimoCheckCompra == index) {
            this.state.arrayCheckCompra[index] = !this.state.arrayCheckCompra[index];
            let ind = this.state.arrayCheckCompra[index] ? index : -1;
            this.setState({
                arrayCheckCompra: this.state.arrayCheckCompra,
                ultimoCheckCompra: ind
            })
        } else {
            if (parseInt(this.state.ultimoCheckCompra) >= 0) {
                this.state.arrayCheckCompra[this.state.ultimoCheckCompra] = false;
            }
            this.state.arrayCheckCompra[index] = true;
            this.setState({
                arrayCheckCompra: this.state.arrayCheckCompra,
                ultimoCheckCompra: index
            })
        }
    }

    onChangeCheckCuota(index, e) {
        
        if (this.state.pagarPorCuota) {
            let value = e.target.checked;
            if (value && index > 0 && !this.state.arrayCheckCuota[index - 1]) return;
            if (!value && index !== this.state.ultimoCheckCuota) return;
            let ult = value ? index : this.state.ultimoCheckCuota - 1;
            let pagarPorMonto = ult == -1 ? true : false;
            let sum = this.state.totalPagar == '' ? 0 : parseFloat(this.state.totalPagar);
            let saldo = parseFloat(this.state.listaCuotas[index].montoapagar) - parseFloat(this.state.listaCuotas[index].montopagado);
            sum = value ? sum + saldo : sum - saldo;
            this.state.arrayCheckCuota[index] = value;
            this.setState({
                arrayCheckCuota: this.state.arrayCheckCuota,
                pagarPorMonto: pagarPorMonto,
                ultimoCheckCuota: ult,
                totalPagar: sum.toFixed(2)
            });
        }

    }

    onChangeMontoPagar(value) {
        
        if (this.state.pagarPorMonto) {
            if (isNaN(value)) return;
            if (value > this.state.saldo) {
                message.warning('El monto a pagar no puede ser mayor al saldo');
                return;
            }
            if (value == '' || value == 0) {
                this.setState({
                    montoPagar: value,
                    totalPagar: value,
                    pagarPorCuota: true
                });
            } else {
                this.setState({
                    montoPagar: value,
                    totalPagar: value,
                    pagarPorCuota: false
                });
            }
        }
        
    }

    getIdsPlanPago(idsPlanPago, montos) {
        let length = this.state.listaCuotas.length;
        let i = 0;
        while (i < length && this.state.arrayCheckCuota[i]) {
            idsPlanPago.push(this.state.listaCuotas[i].idcompraplanporpagar);
            let monto = parseFloat(this.state.listaCuotas[i].montoapagar);
            let pagado = parseFloat(this.state.listaCuotas[i].montopagado);
            let saldo = (monto - pagado).toFixed(2);
            montos.push(saldo);
            i++;
        }
    }

    storePago(e) {
        let idsPlanPago = [];
        let montos = [];
        this.getIdsPlanPago(idsPlanPago, montos);
        let body = {
            codpago: this.state.codpago,
            fecha: convertDmyToYmdWithHour(this.state.fecha),
            notas: this.state.notas,
            idsplanpago: JSON.stringify(idsPlanPago),
            montos: JSON.stringify(montos),
            idcompra: this.state.idcompra,
            mtotocobrado: this.state.totalPagar,
            montoPagar: this.state.montoPagar
        };
        httpRequest('post', ws.wspagos, body)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    visiblePago: false,
                    redirect: true,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
            console.log(result)
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
        
    }

    searchCompraIdCod(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchcompraidcod + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultCompras: result.data
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.los(result);
                    message.error('Ocurrio un problema con la busqueda');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            })
        } else {
            /*
            this.setState({
                resultProveCod: []
            });
            */
        }
    }

    onSearchCompraIdCod(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(() => this.searchCompraIdCod(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod});
    }

    onChangeSearchCompra(value) {
        let array = this.state.resultCompras;
        let codproveedor = '';
        let fullname = '';
        let total = 0;
        let cobrado = 0;
        let idcompra = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].idcompra == value || array[i].codcompra == value) {
                let prov = array[i].proveedor;
                codproveedor = (prov.codproveedor == null || !this.state.configCodigo) ? prov.idproveedor : prov.codproveedor;
                let apellido = array[i].proveedor.apellido == null ? '' : array[i].proveedor.apellido;
                fullname = array[i].proveedor.nombre + ' ' + apellido;
                total = array[i].mtototcompra;
                cobrado = array[i].mtototpagado;
                idcompra = array[i].idcompra;
                break;
            }
        }
        this.getCuotas(idcompra);
        //let cliente = value + ' ' + fullname;
        //message.success('TOTAL ', montototal);
        let saldo = total - cobrado;
        this.setState({
            montototal: total,
            valSearchIdCod: value,
            proveedor: fullname,
            codproveedor: codproveedor,
            totalpagos: cobrado,
            saldo: saldo,
            idcompra: idcompra
        });
    }

    getCuotas(idcompra) {
        
        httpRequest('get', ws.wsgetcuotascompra + '/' + idcompra)
        .then((result) => {
            if (result.response == 1 && result.cuotas.length > 0) {
                let cuotas = result.cuotas;
                let saldo = result.cuotas[0].mtototcompra - result.cuotas[0].mtototpagado;
                let array = [];
                let arraySaldos = [];
                let arr = [];
                let x = 0;
                for (let i = 0; i < cuotas.length; i++) {
                    if (cuotas[i].estado == 'I') {
                        arr.push(cuotas[i]);
                        array.push(false);
                        var sal;
                        if (x === 0) {
                            sal = saldo - (cuotas[i].montoapagar - cuotas[i].montopagado);
                            arraySaldos[x] = sal.toFixed(2);
                        } else {
                            sal = arraySaldos[x-1] - (cuotas[i].montoapagar - cuotas[i].montopagado);
                            arraySaldos[x] = sal.toFixed(2);
                        }
                        x++;
                    }
                    
                }
                this.setState({
                    listaCuotas: arr,
                    arrayCheckCuota: array,
                    arraySaldos: arraySaldos
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    listaCuotas: [],
                    arrayCheckCuota: [],
                    arraySaldos: []
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                listaCuotas: [],
                arrayCheckCuota: [],
                arraySaldos: []
            });
        })
    }

    validarParametros() {

        if ((this.state.codpago.length === 0 && this.state.configCodigo) || this.state.validarCodigo == 0) {
            message.warning('El codigo es obligatorio');
            return false;
        }
        if (this.state.valSearchIdCod == undefined) {
            message.warning('Debe seleccionar una compra');
            return false;
        }
        if (this.state.listaCuotas.length === 0) {
            message.warning('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        if (this.state.pagarPorMonto && (this.state.montoPagar == '' || this.state.montoPagar < 1)) {
            message.error('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        
        if (this.state.pagarPorCuota) {
            let arr = this.state.arrayCheckCuota;
            let length = arr.length;
            let b = false;
            for (let i = 0; i < length; i++) {
                if (arr[i]) {
                    b = true;
                    break;
                }
            }
            if (!b) {
                message.error('Debe tener al menos una cuota para registrar el cobro');
                return false;
            }
        }
        
        return true;
    }

    getMessageConfirm() {
        let mensaje = '';
        if (this.state.pagarPorCuota) {
            let i = 0;
            let length = this.state.listaCuotas.length;
            while (i < length && this.state.arrayCheckCuota[i]) {
                mensaje = mensaje + this.state.listaCuotas[i].descripcion + ' ';
                i++;
            }
        } else {
            let monto = this.state.montoPagar;
            let i = 0;
            while (monto > 0) {
                mensaje += this.state.listaCuotas[i].descripcion + ' ';
                monto -= this.state.listaCuotas[i].montoapagar;
                i++;
            }
        }
        return mensaje;
    }

    showConfirmStore() {
        if (!this.validarParametros()) return;
        const storePago = this.storePago.bind(this);
        Modal.confirm({
            title: 'Guardar Cobranza',
            content: this.getMessageConfirm(),
            onOk() {
                console.log('OK');
                storePago();
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
            visiblePago: true,
            messageConfirm: mensaje
        });
    }

    closeModalCobro() {
        this.setState({ visiblePago: false });
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    componentDidMount() {
        this.getConfigsClient();
    }
    
    componentModalConfirm() {
        return (
            <div className="form-group-content">
                <div className="col-lg-12-content">
                    <div className="col-lg-6-content">
                        <label>Cuotas seleccionadas</label>
                    </div>
                    <div className="col-lg-6-content">
                        <label>{this.state.messageConfirm}</label>
                    </div>
                </div>
                <div className="col-lg-12-content">
                    <div className="col-lg-6-content">
                        <label>Monto Total Cobrado</label>
                    </div>
                    <div className="col-lg-6-content">
                        <label>{this.state.totalPagar}</label>
                    </div>
                </div>
            </div>
        )
    }

    searchProveedor(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchprovecompras + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultProveedores: result.data
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

    onSearchProveedor(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(() => this.searchProveedor(value), 300);
        this.setState({ timeoutSearchCod: this.state.timeoutSearchCod });
    }

    onChangeSearchProveedor(value) {
        this.getComprasProveedor(value);
        this.setState({
            valSearchProv: value
        })
    }

    getComprasProveedor(id) {
        httpRequest('get', ws.wsgetcomprasproveedor + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                let length = result.compras.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push(false);
                }
                this.setState({
                    compras: result.compras,
                    productos: result.productos,
                    proveedores: result.proveedores,
                    arrayCheckCompra: arr
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onDeselectProv() {
        this.setState({
            valSearchProv: undefined
        })
    }

    listProveedores() {

        let data = this.state.resultProveedores;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let apellido = data[i].apellido == null ? '' : data[i].apellido;
            arr.push(
                <Option key={i} value={data[i].idproveedor}>
                    {data[i].nombre + ' ' + apellido}
                </Option>
            );
        }
        return arr;
    }

    seleccionarCompra() {
        let ult = this.state.ultimoCheckCompra;
        if (ult < 0 || this.state.compras.length === 0) {
            message.warning('Debe seleccionar una compra');
            return;
        }
        let proveedores = this.state.proveedores;
        let compra = this.state.compras[ult];
        let nombre = proveedores[ult].nombre;
        let apellido = proveedores[ult].apellido == null ? '' : proveedores[ult].apellido;
        if (!this.estaCompra(compra.idcompra)) {
            this.state.resultCompras.push({
                idcompra: compra.idcompra,
                codcompra: this.state.configCodigo ? compra.codcompra : compra.idcompra
            });
        }
        
        this.getCuotas(compra.idcompra);
        this.setState({
            searchProv: false,
            codproveedor: this.state.configCodigo ? proveedores[ult].codproveedor : proveedores[ult].idproveedor,
            proveedor: nombre + ' ' + apellido,
            montototal: compra.montototal,
            totalpagos: compra.montocobrado,
            saldo: compra.saldopagar,
            resultCompras: this.state.resultCompras,
            valSearchIdCod: compra.idcompra,
            idcompra: compra.idcompra
        });
    }

    estaCompra(id) {
        let data = this.state.resultCompras;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idcompra == id) {
                return true;
            }
        }
        return false;

    }

    sinSeleccionarCompra() {
        this.setState({
            searchProv: false
        })
    }

    componentSearhProv() {
        const listProveedores = this.listProveedores();
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-ls-3 cols-md-3 cols-sm-6 cols-xs-12">
                    <p>Nombre del Proveedor</p>
                </div>
                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                    <CSelect
                        showSearch={true}
                        value={this.state.valSearchProv}
                        placeholder={"Buscar cliente por nombre"}
                        style={{ width: '100%', minWidth: '100%' }}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.onSearchProveedor}
                        onChange={this.onChangeSearchProveedor}
                        notFoundContent={null}
                        allowClear={true}
                        allowDelete={true}
                        onDelete={this.onDeselectProv}
                        component={listProveedores}
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
                                <th>Cod Compra</th>
                                <th>Nombre Proveedor</th>
                                <th>Fecha Compra</th>
                                <th>Productos</th>
                                <th>Monto Total</th>
                                <th>Saldo a Pagar</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.compras.map((item, key) => {
                                let codigo = this.state.configCodigo ? item.codcompra : item.idcompra;
                                let nombre = this.state.proveedores[key].nombre;
                                let apellido = this.state.proveedores[key].apellido == null ? '' : this.state.proveedores[key].apellido;
                                let productos = this.state.productos[key].cadena;
                                return (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>
                                            {codigo}
                                        </td>
                                        <td style={{ width: 230 }}>
                                            {nombre + ' ' + apellido}
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
                                                onChange={this.onChangeCheckCompra.bind(this, key)}
                                                checked={this.state.arrayCheckCompra[key]}>  
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
                            onClick={this.seleccionarCompra.bind(this)}
                        />
                        <C_Button
                            title='Volver sin Seleccionar'
                            type='danger'
                            onClick={this.sinSeleccionarCompra.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.pago_index} />
            );
        }
        const componentModalConfirm = this.componentModalConfirm();
        const componentSearhProv = this.componentSearhProv();
        const motrarSearchProv = this.state.searchProv;
        
        return (
            <div className="rows">
                <Modal
                        title="Guardar Pago"
                        visible={this.state.visiblePago}
                        onCancel={this.closeModalCobro.bind(this)}
                        onOk={this.storePago}
                        footer={
                            <div style={{ textAlign: 'center' }}>
                                <C_Button
                                    title="Cancelar"
                                    type="danger"
                                    onClick={this.closeModalCobro.bind(this)}
                                />
                                <C_Button
                                    title="Aceptar"
                                    onClick={this.storePago}
                                />
                            </div>
                        }
                    >
                        { componentModalConfirm }
                </Modal>                
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registro de Pago"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de pago?
                                Los datos introducidos se perderan.
                            </label>
                        </div>
                    ]}
                />
                <div className="cards" style={{display: motrarSearchProv ? '' : 'none'}}>
                    { componentSearhProv }
                </div>
                <div style={{ display: motrarSearchProv ? 'none' : '' }}  className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Pagos</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Button
                                title='Buscar por Proveedor'
                                type='primary'
                                onClick={() => this.setState({ searchProv: true })}
                                permisions={this.state.btn_search_prov}
                            />
                        </div>
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{paddingTop: 0}}>
                                <C_Input
                                    title="Codigo Pago"
                                    value={this.state.codpago}
                                    onChange={this.onChangePago}
                                    validar={this.state.validarCodigo}
                                    permisions = {this.permisions.codigo}
                                    configAllowed={this.state.configCodigo}
                                    mensaje='El codigo ya existe'
                                    className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom"
                                />
                                <C_Select 
                                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom'
                                    showSearch={true}
                                    value={this.state.valSearchIdCod}
                                    placeholder={"Buscar compra por Id o Codigo"}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchCompraIdCod}
                                    onChange={this.onChangeSearchCompra}
                                    notFoundContent={null}
                                    allowClear={true}
                                    permisions = {this.permisions.codigoCompra}
                                    title='Codigo Compra'
                                    component={
                                        this.state.resultCompras.map((item, key) => {
                                            let codigoCompra = item.idcompra;
                                            if (this.state.configCodigo) {
                                                codigoCompra = item.codcompra;
                                            }
                                            return (
                                                <Option 
                                                    key={key} value={item.idcompra}>
                                                    {codigoCompra}
                                                </Option>
                                            );
                                    })}
                                />
                                <C_DatePicker
                                    allowClear={true}
                                    placeholder="Selecciona la Fecha"
                                    value={this.state.fecha}
                                    onChange={this.onChangeFecha}
                                    allowClear={false}
                                    format='DD-MM-YYYY HH:mm'
                                    title="Fecha"
                                    className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12 pt-bottom"
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    title="Codigo proveedor"
                                    value={this.state.codproveedor}
                                    readOnly={true}
                                    permisions = {this.permisions.codigoProveedor}
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12"
                                />
                                <C_Input
                                    title="Proveedor"
                                    value={this.state.proveedor}
                                    readOnly={true}
                                    permisions = {this.permisions.nombreProveedor}
                                    className='cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12'
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea
                                    title="Notas"
                                    value={this.state.notas}
                                    onChange={this.onChangeNotas}
                                    permisions = {this.permisions.notas}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                            </div>
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    title="Total Compra"
                                    value={this.state.montototal}
                                    readOnly={true}
                                    permisions = {this.permisions.totalCompra}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    title="Acumulados"
                                    value={this.state.totalpagos}
                                    readOnly={true}
                                    permisions = {this.permisions.acumulados}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    title="Saldo"
                                    value={this.state.saldo}
                                    readOnly={true}
                                    permisions = {this.permisions.saldo}
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                        </div>

                        <Divider orientation='left'>Lista de Cuotas</Divider>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>
                                <C_Input
                                    title="Monto a Pagar"
                                    value={this.state.montoPagar}
                                    onChange={this.onChangeMontoPagar}
                                    permisions={this.permisions.cuotasPagar}
                                    className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12"
                                    style={{ textAlign: 'right' }}
                                />
                                <C_Input
                                    title="Total a Pagar"
                                    value={this.state.totalPagar}
                                    readOnly={true}
                                    permisions = {this.permisions.totalPagar}
                                    className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12"
                                    style={{ textAlign: 'right' }}
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
                                            let total = parseFloat(item.preciounit) - parseFloat(item.factor_desc_incre);
                                            let codigo = item.codigo == null ? item.idproducto : item.codigo;
                                            let saldocuota = (parseFloat(item.montoapagar) - parseFloat(item.montopagado)).toFixed(2);
                                            
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{item.descripcion}</td>
                                                    <td>{convertYmdToDmy(item.fechadepago)}</td>
                                                    <td>{saldocuota}</td>
                                                    <td>{this.state.arraySaldos[key]}</td>
                                                    <td>
                                                        <C_CheckBox
                                                            onChange={this.onChangeCheckCuota.bind(this, key)}
                                                            checked={this.state.arrayCheckCuota[key]}
                                                        />
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
                                        title='Guardar'
                                        type='primary'
                                        onClick={this.openModalCobro.bind(this)}
                                    />
                                    <C_Button   
                                        title='Cancelar'
                                        type='danger'
                                        onClick={() => this.setState({ modalCancel: true })}//this.showConfirmCancel.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


