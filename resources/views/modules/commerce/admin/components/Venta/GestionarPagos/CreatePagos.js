
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, DatePicker, Select, Divider } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { stringToDate, dateToString, hourToString, dateHourToString } from '../../../tools/toolsDate';
import { wspagos, wssearchcompraidcod, wsgetcuotascompra } from '../../../WS/webservices';

const WIDTH_WINDOW = window.innerWidth;
const HEIGHT_WINDOW = window.innerHeight;

const Option = Select.Option;
let dateNow = new Date();

export default class CreateCobranza extends Component{

    constructor(){
        super();
        this.state = {
            codpago: '',
            fecha: dateHourToString(dateNow),
            hora: hourToString(dateNow),
            notas: '',
            
            idcompra: 0,
            codproveedor: '',
            proveedor: '',
            montototal: 0,
            totalpagos: 0,
            saldo: 0,
            cantCuotas: '',
            messageConfirm: '',
            totalPagar: 0,
            arraySaldos: [],
            listaCuotas: [],
            resultCompras: [],
            arrayCheck: [],
            messageConfirm: '',
            valSearchIdCod: undefined,
            timeoutSearchCod: null,

            redirect: false,
        }

        this.onChangePago = this.onChangePago.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeHora = this.onChangeHora.bind(this);
        this.onChangeNotas = this.onChangeNotas.bind(this);
        this.onChangeTotal = this.onChangeTotal.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onChangeCuotasPagar = this.onChangeCuotasPagar.bind(this);
        this.onSearchCompraIdCod = this.onSearchCompraIdCod.bind(this);
        this.onChangeSearchCompra = this.onChangeSearchCompra.bind(this);
        this.storePago = this.storePago.bind(this);
        
    }

    onChangeTotal(e) {
        this.setState({ montototal: e.target.value });
    }

    onChangePago(e) {
        this.setState({ codpago: e.target.value });
    }

    onChangeFecha(date,dateString) {
        this.setState({ fecha: dateString });
    }

    onChangeHora(date,dateString) {
        this.setState({ hora: dateString });
    }

    onChangeNotas(e) {
        this.setState({ notas: e.target.value });
    }

    onChangeCheck(e) {
        
        this.state.arrayCheck[e.target.id] = !this.state.arrayCheck[e.target.id];
        console.log('ARRAY ', this.state.arrayCheck);
        this.setState({
            arrayCheck: this.state.arrayCheck
        });
    }

    onChangeCuotasPagar(e) {
        
        let cant = parseInt(e.target.value);
        let checkbox = this.state.arrayCheck;
        
        if ((e.target.value != '' && isNaN(cant)) || cant > checkbox.length || cant < 0) {
            message.warning('Numero no valido');
            for (let i = 0; i < checkbox.length; i++) {
                checkbox[i] = false;
            }
            this.setState({
                arrayCheck: checkbox
            });
            return;
        }
        
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
            cantCuotas: e.target.value,
            arrayCheck: checkbox,
            totalPagar: total
        });
    }

    getIdsPlanPago(idsPlanPago, montos) {
        for (let i = 0; i < this.state.cantCuotas; i++) {
            idsPlanPago.push(this.state.listaCuotas[i].idcompraplanporpagar );
            montos.push(this.state.listaCuotas[i].montoapagar);
        }
    }

    storePago(e) {
        let idsPlanPago = [];
        let montos = [];
        this.getIdsPlanPago(idsPlanPago, montos);
        let body = {
            codpago: this.state.codpago,
            fecha: this.state.fecha,
            notas: this.state.notas,
            idsplanpago: JSON.stringify(idsPlanPago),
            montos: JSON.stringify(montos),
            idcompra: this.state.idcompra,
            mtotocobrado: this.state.totalPagar
        };

        console.log("BODY ",body);

        axios.post(wspagos, body)
        .then((resp) => {
            let result = resp.data;
            console.log(result);
            if (result.response > 0) {
                message.success(result.message);
                this.setState({
                    visiblePago: false,
                    redirect: true,
                });
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    searchCompraIdCod(value) {
        if (value.length > 0) {
            axios.get(wssearchcompraidcod + '/' + value)
            .then((resp) => {
                let result = resp.data;
                console.log('RESULT SEARCH COMPRA ', result);
                if (result.response > 0) {
                    this.setState({
                        resultCompras: result.data
                    });
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

    onSearchCompraIdCod(value) {

        if (this.state.timeoutSearchCod) {
            clearTimeout(this.state.timeoutSearchCod);
            this.setState({ timeoutSearchCod: null});
        }
        this.state.timeoutSearchCod = setTimeout(this.searchCompraIdCod(value), 300);
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
            console.log('ELEMN ', array[i]);
            if (array[i].idcompra == value || array[i].codcompra == value) {
                //console.log();
                codproveedor = array[i].proveedor.codproveedor,
                fullname = array[i].proveedor.nombre + ' ' + array[i].proveedor.apellido;
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
        
        axios.get(wsgetcuotascompra + '/' + idcompra)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0 && result.cuotas.length > 0) {
                let cuotas = result.cuotas;
                let saldo = result.cuotas[0].mtototcompra - result.cuotas[0].mtototpagado;
                let array = [];
                let arraySaldos = [];
                for (let i = 0; i < cuotas.length; i++) {
                    array.push(false);
                    if (i === 0) {
                        arraySaldos[i] = saldo - cuotas[i].montoapagar;
                    } else {
                        arraySaldos[i] = arraySaldos[i-1] - cuotas[i].montoapagar;
                    }
                }
                this.setState({
                    listaCuotas: result.cuotas,
                    arrayCheck: array,
                    arraySaldos: arraySaldos
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    validarParametros() {

        if (this.state.valSearchIdCod == undefined) {
            message.error('Debe seleccionar una venta');
            return false;
        }
        if (this.state.listaCuotas.length === 0) {
            message.error('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        if (this.state.cantCuotas == '' || this.state.cantCuotas < 1) {
            message.error('Debe tener al menos una cuota para registrar el cobro');
            return false;
        }
        return true;
    }

    getMessageConfirm() {

        let mensaje = '';
        for (let i = 0; i < this.state.cantCuotas; i++) {
            mensaje = mensaje + this.state.listaCuotas[i].descripcion + ' ';
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
        let mensaje = this.getMessageConfirm();
        this.setState({ 
            visiblePago: true,
            messageConfirm: mensaje
        });
    }

    closeModalCobro() {
        this.setState({ visiblePago: false });
    }

    componentDidMount() {

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

    render(){

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/pagos/index/"/>
            )
        }
        const componentModalConfirm = this.componentModalConfirm();

        return (
            <div>
                <Modal
                        title="Guardar Pago"
                        visible={this.state.visiblePago}
                        onCancel={this.closeModalCobro.bind(this)}
                        onOk={this.storePago}
                        //footer={null}
                    >
                        { componentModalConfirm }
                </Modal>
                
                <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Pago </h1>
                        </div>
                </div>
        
                    <div className="col-lg-9-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <input 
                                    id="codpago" 
                                    type="text"
                                    value={this.state.codpago}
                                    placeholder="Codigo"
                                    onChange={this.onChangePago}
                                    className="form-control-content" 
                                    />
                                <label 
                                    htmlFor="codpago" 
                                    className="label-content"> Codigo Pago 
                                </label>
                            </div>

                            <div className="col-lg-4-content">
                                <Select
                                    showSearch
                                    value={this.state.valSearchIdCod}
                                    placeholder={"Buscar proveedor por Id o Codigo"}
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearchCompraIdCod}
                                    onChange={this.onChangeSearchCompra}
                                    notFoundContent={null}
                                    allowClear={true}
                                >
                                    {this.state.resultCompras.map((item, key) => (
                                        <Option 
                                            key={key} value={item.codcompra}>
                                            {item.idcompra + ' ' +item.codcompra}
                                        </Option>
                                    ))}
                                </Select>
                                <label 
                                    htmlFor="searchventa" 
                                    className="label-content">
                                    Codigo Compra
                                </label>
                            </div>

                            <div className="col-lg-4-content">
                                <DatePicker
                                    showTime
                                    allowClear={false}
                                    format='YYYY-MM-DD HH:mm'
                                    placeholder="Selecciona la Fecha"
                                    style={{ width: '100%' }}
                                    defaultValue={moment(this.state.fecha, 'YYYY-MM-DD HH:mm')}
                                    onChange={this.onChangeFecha} 
                                />
                                
                                <label 
                                    htmlFor="fecha" 
                                    className="label-content">
                                    Fecha
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <input 
                                    id="codproveedor" 
                                    type="text"
                                    value={this.state.codproveedor}
                                    placeholder="Codigo"
                                    //onChange={this.handleApellido}
                                    className="form-control-content" 
                                />
                                <label 
                                    htmlFor="codproveedor" 
                                    className="label-content">
                                    Codigo 
                                </label>
                            </div>
                            <div className="col-lg-8-content">
                                <input 
                                    id="proveedor" 
                                    type="text"
                                    value={this.state.proveedor}
                                    placeholder="Cliente"
                                    className="form-control-content" 
                                    /> 
                                <label 
                                    htmlFor="proveedor" 
                                    className="label-content">
                                    Proveedor 
                                </label>
                            </div>
                        </div>

                        <div className="input-group-content col-lg-12-content">
                            <label 
                                htmlFor="idcomision" 
                                className="label-content">
                                Notas
                            </label>
                            <textarea
                                type="text"
                                className="textarea-content"
                                value={this.state.notas}
                                onChange={this.onChangeNotas}
                            />
                        </div>
                    </div>

                    <div className="col-lg-3-content">
                        <div className="col-lg-12-content">
                            <input 
                                id="totalcompra" 
                                type="text"
                                value={this.state.montototal}
                                placeholder="Total Venta"
                                //onChange={this.onChangeTotal}
                                className="form-control-content" 
                            />
                        </div>
                        <div className="col-lg-12-content">
                            <label 
                                htmlFor="totalcompra" 
                                className="label-content">
                                Total Compra
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <input 
                                id="totalpagos" 
                                type="text"
                                value={this.state.totalpagos}
                                placeholder="Total Venta"
                                //onChange={this.handleApellido}
                                className="form-control-content" 
                            />
                        </div>
                        <div className="col-lg-12-content">
                            <label 
                                htmlFor="totalpagos" 
                                className="label-content">
                                Pagos Acumulados
                            </label>
                        </div>
                        <div className="col-lg-12-content">
                            <input 
                                id="saldo" 
                                type="text"
                                value={this.state.saldo}
                                placeholder="Saldo"
                                //onChange={this.handleApellido}
                                className="form-control-content" 
                            />
                        </div>
                        <div className="col-lg-12-content">
                            <label 
                                htmlFor="saldo" 
                                className="label-content">
                                Saldo
                            </label>
                        </div>
                    </div>
                    <Divider orientation='left'>Lista de Cuotas</Divider>
                    <div className="col-lg-12-content">
                        <div className="pull-right-content">
                            <div className="col-lg-12-content">
                                <div className="col-lg-4-content">
                                    <input 
                                        id="total" 
                                        type="text"
                                        value={this.state.totalPagar}
                                        //onChange={this.onChangeCuotasPagar}
                                        placeholder="Total a pagar"
                                        className="form-control-content" 
                                    />
                                    <label 
                                        htmlFor="total" 
                                        className="label-content">
                                        Total a Pagar
                                    </label>
                                </div>
                                <div className="col-lg-4-content">
                                    <input 
                                        id="cantCuotas" 
                                        type="text"
                                        value={this.state.cantCuotas}
                                        onChange={this.onChangeCuotasPagar}
                                        placeholder="Cuotas a pagar"
                                        className="form-control-content" 
                                    />
                                    <label 
                                        htmlFor="cantCuotas" 
                                        className="label-content">
                                        Cuotas a Pagar 
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group-content col-lg-12-content">
                        <div 
                            className="col-lg-9-content"
                            style={{marginLeft: WIDTH_WINDOW * 0.1}}
                        >
                            <div className="col-lg-1-content">
                                <label style={{color: 'black'}}>Nro</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label style={{color: 'black'}}>Descripcion</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label style={{color: 'black'}}>Fecha a Apagar</label>
                            </div>
                            <div className="col-lg-2-content">
                                <label style={{color: 'black'}}>Monto a Apagar</label>
                            </div>
                            <div className="col-lg-2-content">
                                <label style={{color: 'black'}}>Saldo</label>
                            </div>
                            <div className="col-lg-1-content">
                                <label style={{color: 'black'}}>Seleccionar</label>
                            </div>
                        </div>
                        <div className="col-lg-9-content"
                            style={{
                                marginLeft: WIDTH_WINDOW * 0.1,
                                height: 200,
                                overflow: 'scroll'
                            }}>
                            {
                                this.state.listaCuotas.map((item, key) => {
                                    return (
                                        <div key={key} className="col-lg-12-content">
                                            <div className="col-lg-1-content">
                                                <label>{key + 1}</label>
                                            </div>
                                            <div className="col-lg-3-content">
                                                <label>{item.descripcion}</label>
                                            </div>
                                            <div className="col-lg-3-content">
                                                <label>{item.fechadepago}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <label>{item.montoapagar}</label>
                                            </div>
                                            <div className="col-lg-2-content">
                                                <label>{this.state.arraySaldos[key]}</label>
                                            </div>
                                            <div className="col-lg-1-content">
                                                <input
                                                    id={key}
                                                    type="checkbox"
                                                    //value={this.state.arrayCheck[key]}
                                                    checked={this.state.arrayCheck[key]}
                                                    //onChange={this.onChangeCheck}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                    <div className="form-group-content">

                        <div className="text-center-content">
                            <button 
                                type="button" 
                                className="btn-content btn-success-content"
                                onClick={this.openModalCobro.bind(this)}>
                                Guardar
                            </button>
                            <button
                                className="btn-content btn-danger-content" 
                                type="button" 
                                onClick={this.showConfirmCancel.bind(this)}>
                                Cancelar
                            </button>
                        </div>

                    </div>                         
            </div>
        );
    }
}


