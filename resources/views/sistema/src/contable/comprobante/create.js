
import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, dateToString, convertDmyToYmd, hourToString } from '../../utils/toolsDate';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../utils/toolsStorage';

import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import { dateToStringB } from '../../utils/toolsDate';

import PropTypes from 'prop-types';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_DatePicker from '../../componentes/data/date';

import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
import Confirmation from '../../componentes/confirmation';
const {Option} = Select;

class CreateComprobante extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible_cancelar: false,
            visible_submit: false,
            visible_imprimir: false,
            loading: false,
            idcomprobante: 0,
            idcomprobantetipo: '',
            numero: '',
            fecha: dateToString(new Date(), 'f2'),
            nrodoc: '',
            idmoneda: '',
            tipocambio: '',
            idtipopago: '',
            contabilizar: true,
            idbanco: '',
            namebanco: '',
            nrocheque: '',
            referidoa: '',
            glosa: '',
            idscuentas: [
                { idcuenta: '', namecuenta: '',
                    glosas: '', debes: '', haberes: '',
                    namecentrocosto: '', idcentrodecosto: '',
                },
            ],
            totaldebe: 0,
            totalhaber: 0,
            nivel: -1,
            array_Tipocomprobante: [],
            array_periodo: [],
            array_moneda: [],
            array_tipopago: [],
            array_banco: [],
            tree_banco: [],
            array_centrocosto: [],
            tree_centrocosto: [],
            array_cuenta: [],
            tree_cuenta: [],
            noSesion: false,
        }
    }
    componentDidMount() {
        for (let i = 0; i < 2; i++) {
            var cuentafirst = {
                idcuenta: '', namecuenta: '',
                glosas: '', debes: '', haberes: '',
                namecentrocosto: '', idcentrodecosto: '',
            };
            this.state.idscuentas.push(cuentafirst);
        }
        this.setState({
            idscuentas: this.state.idscuentas,
        });
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wscomprobante + '/create')
        .then((result) => {
            if (result.response == 1) {
                // console.log(result)
                var on_data = JSON.parse( readData(keysStorage.on_data) );
                var bandera = false;
                if (this.validar_keyStorage(on_data)) {
                    if (this.validar_keyStorage(on_data.data_actual) && this.validar_keyStorage(on_data.on_create)) 
                    {
                        if (on_data.on_create == 'plancuenta_create') {
                            bandera =  true;
                            on_data = on_data.data_actual;
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
                var idcomprobantetipo = result.tiposcomprobantes.length > 0 ? result.tiposcomprobantes[0].idcomprobantetipo : '';
                var numero = result.tiposcomprobantes.length > 0 ? result.tiposcomprobantes[0].numeroactual + 1 : '';
                var idmoneda = result.monedas.length > 0 ? result.monedas[0].idmoneda : '';
                var tipocambio = result.monedas.length > 0 ? result.monedas[0].valor == null ? 1 : result.monedas[0].valor : 1;
                var idtipopago = result.tipospagos.length > 0 ? result.tipospagos[0].idtipopago : '';
                if (bandera) {
                    if (on_data.cuentaplan != null) {
                        if (on_data.cuentaplan.nivel == result.cuentaconfig.numniveles) {
                            var sw = false;
                            for (let i = 0; i < on_data.idscuentas.length; i++) {
                                var element = on_data.idscuentas[i];
                                if (element.idcuenta == '') {
                                    on_data.idscuentas[i].idcuenta = on_data.cuentaplan.idcuentaplan;
                                    on_data.idscuentas[i].namecuenta = on_data.cuentaplan.codcuenta + ' ' + on_data.cuentaplan.nombre;
                                    var sw = true;
                                    break;
                                }
                            }
                            if (!sw) {
                                var cuentafirst = {
                                    idcuenta: on_data.cuentaplan.idcuentaplan, 
                                    namecuenta: on_data.cuentaplan.codcuenta + ' ' + on_data.cuentaplan.nombre,
                                    glosas: '', debes: '', haberes: '',
                                    namecentrocosto: '', idcentrodecosto: '',
                                };
                                on_data.idscuentas.push(cuentafirst);
                            }
                        }else {
                            message.warning(`La cuenta registrado debe ser de nivel ${result.cuentaconfig.numniveles}`);
                        }
                    }
                }
                this.setState({
                    array_Tipocomprobante: result.tiposcomprobantes,
                    array_periodo: result.periodos,
                    array_moneda: result.monedas,
                    array_tipopago: result.tipospagos,
                    array_banco: result.bancos,
                    array_centrocosto: result.centrocosto,
                    array_cuenta: result.cuenta,
                    nivel: result.cuentaconfig.numniveles,

                    idcomprobantetipo: bandera ? on_data.idcomprobantetipo : idcomprobantetipo,
                    numero: bandera ? on_data.numero : numero,
                    fecha: bandera ? on_data.fecha : this.state.fecha,
                    nrodoc: bandera ? on_data.nrodoc : this.state.nrodoc,
                    idmoneda: bandera ? on_data.idmoneda : idmoneda,
                    tipocambio: bandera ? on_data.tipocambio : tipocambio,
                    idtipopago: bandera ? on_data.idtipopago : idtipopago,
                    contabilizar: bandera ? on_data.contabilizar : this.state.contabilizar,
                    idbanco: bandera ? on_data.idbanco : this.state.idbanco,
                    namebanco: bandera ? on_data.namebanco : this.state.namebanco,
                    nrocheque: bandera ? on_data.nrocheque : this.state.nrocheque,
                    referidoa: bandera ? on_data.referidoa : this.state.referidoa,
                    glosa: bandera ? on_data.glosa : this.state.glosa,
                    idscuentas: bandera ? on_data.idscuentas : this.state.idscuentas,
                    totaldebe: bandera ? on_data.totaldebe : this.state.totaldebe,
                    totalhaber: bandera ? on_data.totalhaber : this.state.totalhaber,

                });
                this.cargarTreeBanco(result.bancos, result.bancopadre);
                this.cargarTreeCentroCosto(result.centrocosto, result.centrocostopadre);
                this.cargarTreeCuenta(result.cuenta, result.cuentapadre);
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    cargarTreeBanco(array_banco, data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].nombre,
                value: array[i].nombre,
                idbanco: array[i].idbanco,
            };
            array_aux.push(objeto);
        }
        this.treeBanco(array_aux, array_banco);
        this.setState({
            tree_banco: array_aux,
        });
    }
    treeBanco(data, array_banco) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenBanco(data[i].idbanco, array_banco);
            data[i].children = hijos;
            this.treeBanco(hijos, array_banco);
        }
    }
    childrenBanco(idpadre, array_banco) {
        var array = array_banco;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidbancopadre == idpadre) {
                var objeto = {
                    title: array[i].nombre,
                    value: array[i].nombre,
                    idbanco: array[i].idbanco,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    cargarTreeCentroCosto(array_centrocosto, data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].nombre,
                value: array[i].nombre,
                idcentrodecosto: array[i].idcentrodecosto,
            };
            array_aux.push(objeto);
        }
        this.treeCentroCosto(array_aux, array_centrocosto);
        this.setState({
            tree_centrocosto: array_aux,
        });
    }
    treeCentroCosto(data, array_centrocosto) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCentroCosto(data[i].idcentrodecosto, array_centrocosto);
            data[i].children = hijos;
            this.treeCentroCosto(hijos, array_centrocosto);
        }
    }
    childrenCentroCosto(idpadre, array_centrocosto) {
        var array = array_centrocosto;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcentrodecostopadre == idpadre) {
                var objeto = {
                    title: array[i].nombre,
                    value: array[i].nombre,
                    idcentrodecosto: array[i].idcentrodecosto,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    cargarTreeCuenta(array_cuenta, data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].codcuenta + ' ' + array[i].nombre,
                value: array[i].codcuenta + ' ' + array[i].nombre,
                idcuentaplan: array[i].idcuentaplan,
            };
            array_aux.push(objeto);
        }
        this.treeCuenta(array_aux, array_cuenta);
        this.setState({
            tree_cuenta: array_aux,
        });
    }
    treeCuenta(data, array_cuenta) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCuenta(data[i].idcuentaplan, array_cuenta);
            data[i].children = hijos;
            this.treeCuenta(hijos, array_cuenta);
        }
    }
    childrenCuenta(idpadre, array_cuenta) {
        var array = array_cuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].codcuenta + ' ' + array[i].nombre,
                    idcuentaplan: array[i].idcuentaplan,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    onChangeIDComprobanteTipo(value) {
        let data = this.state.array_Tipocomprobante;
        let numero = this.state.numero;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idcomprobantetipo == value) {
                numero = data[i].numeroactual + 1;
                break;
            }
        }
        this.setState({
            idcomprobantetipo: value,
            numero: numero
        });
    }
    enPeriodoActivo(dateString) {
        let fecha = stringToDate(dateString, 'f2');
        let arr = this.state.array_periodo;
        let valido = false;
        for (let i = 0; i < arr.length; i++) {
            let ini = stringToDate(arr[i].fechaini);
            let fin = stringToDate(arr[i].fechafin);
            if (fecha >= ini && fecha <= fin) {
                valido = true;
                break;
            }
        }
        return valido;
    }
    onChangeFecha(date) {
        if (!this.enPeriodoActivo(date)) {
            message.warning('La fecha no es valida, debe estar dentro de algun periodo activo');
            return;
        }
        this.setState({
            fecha: date,
        });
    }
    onChangeNroDoc(value) {
        this.setState({ nrodoc: value, });
    }
    onChangeIDMoneda(value) {
        let data = this.state.array_moneda;
        let tipocambio = this.state.tipocambio;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idmoneda == value) {
                tipocambio = data[i].valor == null ? 1 : data[i].valor;
                break;
            }
        }
        this.setState({
            idmoneda: value,
            tipocambio: tipocambio,
        });
    }
    only2Decimals(num) {
        let index = num.indexOf('.');
        if (index >= 0) {
            let dif = num.length - index;
            return dif <= 3 ? true : false;
        }
        return true;
    }
    onChangeTipoCambio(value) {
        if(isNaN(value)) return;
        if (!this.only2Decimals(value)) return;
        this.setState({
            tipocambio: value,
        })
    }
    onChangeIDTipoPago(value) {
        if (value != 2) {
            this.setState({
                idbanco: '',
                namebanco: '',
                nrocheque: '',
            });
        }
        this.setState({ idtipopago: value, });
    }
    onChangeContabilizar(event) {
        this.setState({ contabilizar: event.target.checked, });
    }
    onChangeIDBanco(value, label, extra) {
        this.setState({idbanco: extra.triggerNode.props.idbanco, namebanco: value});
    }
    onchangeNroCheque(value) {
        this.setState({ nrocheque: value, });
    }
    onChangeReferidoA(value) {
        this.setState({ referidoa: value, });
    }
    onChangeGlosa(value) {
        this.setState({ glosa: value, });
    }
    isValidoCuenta(idcuentaplan, data, nivel) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].idcuentaplan == idcuentaplan) {
                if (nivel == this.state.nivel) {
                    return true;
                } else {
                    return false;
                }
            }
            if (this.isValidoCuenta(idcuentaplan, data[i].children, nivel + 1)) return true;
        }
        return false;
    }
    onChangeIDcuenta(index, value, label, extra) {
        if (this.isValidoCuenta(extra.triggerNode.props.idcuentaplan, this.state.tree_cuenta, 1)) {
            this.state.idscuentas[index].namecuenta = value;
            this.state.idscuentas[index].idcuenta = extra.triggerNode.props.idcuentaplan;
            this.setState({
                idscuentas: this.state.idscuentas,
            });
        } else {
            message.warning(`Debe seleccionar una cuenta del nivel ${this.state.nivel}`);
        }
    }
    onChangeGlosas(index, value) {
        this.state.idscuentas[index].glosas = value;
        this.setState({
            idscuentas: this.state.idscuentas,
        });
    }
    calcularHaberDebeTotal() {
        let data = this.state.idscuentas;
        let totaldebe = 0;
        let totalhaber = 0;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.idcuenta != '') {
                totaldebe += isNaN(parseFloat(item.debes)) ? 0 : parseFloat(item.debes);
                totalhaber += isNaN(parseFloat(item.haberes)) ? 0 : parseFloat(item.haberes);
            }
        }
        totaldebe = isNaN(totaldebe) ? 0 : totaldebe.toFixed(2);
        totalhaber = isNaN(totalhaber) ? 0 : totalhaber.toFixed(2);
        this.setState({
            totaldebe: totaldebe,
            totalhaber: totalhaber,
        });
    }
    onChangeDebes(index, value) {
        if (this.state.idscuentas[index].idcuenta == '' || isNaN(value) || !this.only2Decimals(value)) return;
        this.state.idscuentas[index].debes = value;
        this.setState({
            idscuentas: this.state.idscuentas,
        },
            () => this.calcularHaberDebeTotal()
        );
    }
    onChangeHaberes(index, value) {
        if (this.state.idscuentas[index].idcuenta == '' || isNaN(value) || !this.only2Decimals(value)) return;
        this.state.idscuentas[index].haberes = value;
        this.setState({
            idscuentas: this.state.idscuentas,
        },
            () => this.calcularHaberDebeTotal()
        );
    }
    onChangeCCostos(index, value, label, extra) {
        this.state.idscuentas[index].namecentrocosto = value;
        this.state.idscuentas[index].idcentrodecosto = extra.triggerNode.props.idcentrodecosto;
        this.setState({
            idscuentas: this.state.idscuentas,
        });
    }
    removeCuenta(index) {
        this.state.idscuentas.splice(index, 1);
        this.setState({
            idscuentas: this.state.idscuentas,
        },
            () => this.calcularHaberDebeTotal()
        );
    }
    addCuenta() {
        var cuentafirst = {
            idcuenta: '', namecuenta: '',
            glosas: '', debes: '', haberes: '',
            namecentrocosto: '', idcentrodecosto: '',
        };
        this.state.idscuentas.push(cuentafirst);
        this.setState({
            idscuentas: this.state.idscuentas,
        });
    }
    componenteComprobanteTipo() {
        let data = this.state.array_Tipocomprobante;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idcomprobantetipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    componenteMoneda() {
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
    componenteTiposPagos() {
        let data = this.state.array_tipopago;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idtipopago}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }
    onSalir() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 500);
    }
    componentBack() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registro"
                onCancel={() => this.setState({visible_cancelar: false,})}
                onClick={this.onSalir.bind(this)}
                width={400}
                content={'¿Esta seguro de cancelar los registro? Los datos ingresados se perderan.'}
            />
        );
    }
    validarData() {
        let data = this.state.idscuentas;
        let c = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].idcuenta != '') c++;
            if (data[i].idcuenta != '' && data[i].debes == '' && data[i].haberes == '') {
                message.warning('Complete los campos del debe y el haber de la fila Nro, ' + (i + 1));
                return;
            }
        }
        if (c < 2) {
            message.warning('Deben haber por lo menos 2 registros de cuentas');
            return;
        }
        if (this.state.contabilizar && this.state.totaldebe !== this.state.totalhaber) {
            message.warning('El Total Debe y el Total Haber tienen que ser iguales');
            return;
        }
        if (!this.enPeriodoActivo(this.state.fecha)) {
            message.warning('La fecha debe estar dentro de un periodo activo');
            return;
        }
        this.setState({
            visible_submit: true,
        });
    }
    cargarIdsCuentas(idscuentas, glosas, debes, haberes, idscentrocostos) {
        for (let i = 0; i < this.state.idscuentas.length; i++) {
            var data = this.state.idscuentas[i];
            if (data.idcuenta != '') {
                idscuentas.push(data.idcuenta);
                glosas.push(data.glosas);
                debes.push(data.debes == '' ? 0 : data.debes);
                haberes.push(data.haberes == '' ? 0 : data.haberes);
                idscentrocostos.push(data.idcentrodecosto == '' ? null : data.idcentrodecosto);
            }
        }
    }
    onStoreComprobante() {
        this.setState({
            loading: true,
        })
        var idscuentas = [];
        var glosas = [];
        var debes = [];
        var haberes = [];
        var idscentrocostos = [];
        this.cargarIdsCuentas(idscuentas, glosas, debes, haberes, idscentrocostos);
        let body = {
            idtipo: this.state.idcomprobantetipo,
            fecha: convertDmyToYmd(this.state.fecha),
            nrodoc: this.state.nrodoc,
            idmoneda: this.state.idmoneda,
            tipocambio: this.state.tipocambio,
            idtipopago: this.state.idtipopago,
            contabilizar: this.state.contabilizar,
            idbanco: this.state.idbanco,
            nrocheque: this.state.nrocheque,
            referidoa: this.state.referidoa,
            glosa: this.state.glosa,

            idscuentas: JSON.stringify(idscuentas),
            glosas: JSON.stringify(glosas),
            debes: JSON.stringify(debes),
            haberes: JSON.stringify(haberes),
            idscentrocostos: JSON.stringify(idscentrocostos),
        };
        httpRequest('post', ws.wscomprobante, body)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    idcomprobante: result.idcomprobante, visible_submit: false, loading: false,
                });
                setTimeout(() => {
                    this.setState({
                        visible_imprimir: true,
                    })
                }, 700);
            } else if (result.response == 2) {
                message.error(result.message);
                this.setState({
                    loading: false,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, loading: false, });
            } else {
                message.error(result.message);
                this.setState({ loading: false, });
            }
            console.log(result)
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
            })
        });
    }
    componentSubmit() {
        return (
            <Confirmation
                visible={this.state.visible_submit}
                loading={this.state.loading}
                title="Registrar Comprobante"
                onCancel={() => this.setState({visible_submit: false,})}
                onClick={this.onStoreComprobante.bind(this)}
                width={400}
                content={'¿Esta seguro de guardar el comprobante?'}
            />
        );
    }
    componentImprimir() {
        return (
            <Confirmation
                visible={this.state.visible_imprimir}
                loading={this.state.loading}
                title="Imprimir Comprobante"
                onCancel={this.onSalir.bind(this)}
                onClick={this.onImprimir.bind(this)}
                width={400}
                content={'¿Desea imprimir el Comprobante?'}
            />
        );
    }
    onImprimir() {
        document.getElementById('form_comp').submit();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 700);
    }
    validar_keyStorage(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    on_data_keyStorage() {
        return {
            idcomprobantetipo: this.state.idcomprobantetipo,
            numero: this.state.numero,
            fecha: this.state.fecha,
            nrodoc: this.state.nrodoc,
            idmoneda: this.state.idmoneda,
            tipocambio: this.state.tipocambio,
            idtipopago: this.state.idtipopago,
            contabilizar: this.state.contabilizar,
            idbanco: this.state.idbanco,
            namebanco: this.state.namebanco,
            nrocheque: this.state.nrocheque,
            referidoa: this.state.referidoa,
            glosa: this.state.glosa,
            idscuentas: this.state.idscuentas,
            totaldebe: this.state.totaldebe,
            totalhaber: this.state.totalhaber,
        };
    }
    crearNuevoPlanCuenta() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_keyStorage(on_data)) {
            var objecto_data = {
                on_create: 'plancuenta_create',
                data_actual: this.on_data_keyStorage(),
                new_data: null,
                validacion: true,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }
        setTimeout(() => {
            var url = routes.plan_de_cuenta_index;
            this.props.history.push(url);
        }, 500);
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
        const usuario = user == null ? '' : (user.apellido == null)?user.nombre:user.nombre + ' ' + user.apellido;
        const x_idusuario =  user == null ? 0 : user.idusuario;
        const x_grupousuario = user == null ? 0 : user.idgrupousuario;
        const x_login = user == null ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">
                {this.componentBack()}
                {this.componentSubmit()}
                {this.componentImprimir()}

                <form target="_blank" id="form_comp" style={{display: 'none',}} action={routes.comprobante_imprimir} method="post">
                    <input type="hidden" value={_token} name="_token" />
                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                    <input type="hidden" value={x_login} name="x_login" />
                    <input type="hidden" value={x_fecha} name="x_fecha" />
                    <input type="hidden" value={x_hora} name="x_hora" />
                    <input type="hidden" value={x_connection} name="x_conexion" />
                    <input type="hidden" value={token} name="authorization" />
                    <input type='hidden' value={usuario} name='usuario' />    
                    <input type='hidden' value={this.state.idcomprobante} name='idcomprobante' />   
                </form>

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Nuevo Comprobrante</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <C_Select 
                            title='Tipo'
                            value={this.state.idcomprobantetipo}
                            onChange={this.onChangeIDComprobanteTipo.bind(this)}
                            component={this.componenteComprobanteTipo()}
                        />
                        <C_Input
                            title='Numero'
                            value={this.state.numero}
                            readOnly={true}
                        />
                        <C_DatePicker 
                            value={this.state.fecha}
                            onChange={this.onChangeFecha.bind(this)}
                        />
                        <C_Input
                            title='Nro Doc'
                            value={this.state.nrodoc}
                            onChange={this.onChangeNroDoc.bind(this)}
                        />
                        <C_Select
                            title='Moneda'
                            value={this.state.idmoneda}
                            onChange={this.onChangeIDMoneda.bind(this)}
                            component={this.componenteMoneda()}
                        />
                        <C_Input
                            title='Tipo Cambio'
                            value={this.state.tipocambio}
                            onChange={this.onChangeTipoCambio.bind(this)}
                            style={{ textAlign: 'right' }}
                        />
                        <C_Select
                            title='Tipo Pago'
                            value={this.state.idtipopago}
                            onChange={this.onChangeIDTipoPago.bind(this)}
                            component={this.componenteTiposPagos()}
                        />
                        <C_CheckBox
                            title='Contabilizar'
                            style={{ marginTop: 16, marginLeft: 4 }}
                            onChange={this.onChangeContabilizar.bind(this)}
                            checked={this.state.contabilizar}
                        />
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-3 cols-md-3"></div>
                        <C_TreeSelect   
                            showSearch={true}
                            title='Banco'
                            value={this.state.namebanco}
                            treeData={this.state.tree_banco}
                            placeholder='Seleccione una opcion'
                            onChange={this.onChangeIDBanco.bind(this)}
                            configAllowed={this.state.idtipopago == 2 ? true : false}
                        />
                        <C_Input
                            title='Nro Cheque'
                            value={this.state.nrocheque}
                            onChange={this.onchangeNroCheque.bind(this)}
                            configAllowed={this.state.idtipopago == 2 ? true : false}
                        />
                    </div>
                    <div className="forms-groups">
                        <C_TextArea 
                            title='Referido a'
                            value={this.state.referidoa}
                            onChange={this.onChangeReferidoA.bind(this)}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                        />
                        <C_TextArea 
                            title='Glosa'
                            value={this.state.glosa}
                            onChange={this.onChangeGlosa.bind(this)}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                        />
                    </div>
                    <div className="forms-groups">
                        <div className="pull-right">
                            <C_Button
                                title='+'
                                type='success'
                                onClick={this.addCuenta.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="table-detalle" style={{ width: '100%', overflow: 'auto', height: 'auto', maxHeight: 400, }}>
                            <table className="table-response-detalle">
                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th style={{ width: 300, minWidth: 300, }}>
                                            Cuenta 
                                            <C_Button placement='top' tooltip='NUEVA CUENTA'
                                                title={<i className="fa fa-plus"></i>}
                                                type='primary' size='small' style={{padding: 4, float: 'right', marginTop: -8,}}
                                                onClick={this.crearNuevoPlanCuenta.bind(this)}
                                            />
                                        </th>
                                        <th>Glosa</th>
                                        <th style={{ width: 90, minWidth: 90, }}>Debe</th>
                                        <th style={{ width: 90, minWidth: 90, }}>Haber</th>
                                        <th>C.Costo</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.idscuentas.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <C_TreeSelect
                                                        showSearch={true}
                                                        value={item.namecuenta}
                                                        treeData={this.state.tree_cuenta}
                                                        onChange={this.onChangeIDcuenta.bind(this, key)}
                                                        placeholder='Seleccione una opcion'
                                                        className=''
                                                        style={{ width: 300, minWidth: 300, }}
                                                    />
                                                </td>
                                                <td>
                                                    <C_TextArea 
                                                        value={item.glosas}
                                                        onChange={this.onChangeGlosas.bind(this, key)}
                                                        style={{ height: '100%' }}
                                                        className=""
                                                        readOnly={item.idcuenta == '' ? true : false}
                                                    />
                                                </td>
                                                <td>
                                                    <C_Input
                                                        value={item.debes}
                                                        onChange={this.onChangeDebes.bind(this, key)}
                                                        className=""
                                                        readOnly={item.idcuenta == '' || item.haberes != '' ? true : false}
                                                        style={{ width: 90, minWidth: 90, textAlign: 'right', }}
                                                    />
                                                </td>
                                                <td>
                                                    <C_Input
                                                        value={item.haberes}
                                                        onChange={this.onChangeHaberes.bind(this, key)}
                                                        className=""
                                                        readOnly={item.idcuenta == '' || item.debes != '' ? true : false}
                                                        style={{ width: 90, minWidth: 90, textAlign: 'right', }}
                                                    />
                                                </td>
                                                <td>
                                                    <C_TreeSelect
                                                        showSearch={true}   
                                                        value={item.namecentrocosto}
                                                        treeData={this.state.tree_centrocosto}
                                                        onChange={this.onChangeCCostos.bind(this, key)}
                                                        placeholder='Seleccione una opcion'
                                                        className=''
                                                        readOnly={item.idcuenta == '' ? true : false}
                                                    />
                                                </td>
                                                <td>
                                                    <C_Button title={<i className='fa fa-remove'></i>}
                                                        type='danger' size='small'
                                                        onClick={() => this.removeCuenta(key)}
                                                        style={{'padding': '3px'}}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr key={-1}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <C_Input
                                                value={this.state.totaldebe}
                                                readOnly={true}
                                                className=""
                                                style={{ width: 90, minWidth: 90, textAlign: 'right', }}
                                            />
                                        </td>
                                        <td>
                                            <C_Input
                                                value={this.state.totalhaber}
                                                readOnly={true}
                                                className=""
                                                style={{ width: 90, minWidth: 90, textAlign: 'right', }}
                                            />
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="txts-center">
                            <C_Button
                                title='Guardar'
                                type='primary'
                                onClick={this.validarData.bind(this)}
                            />
                            <C_Button
                                title='Cancelar'
                                type='danger'
                                onClick={() => this.setState({ visible_cancelar: true, })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateComprobante);

