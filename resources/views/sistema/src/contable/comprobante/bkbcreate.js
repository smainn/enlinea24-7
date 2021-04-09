
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, stringToDateB, dateToString, convertYmdToDmy, convertDmyToYmd } from '../../utils/toolsDate';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../utils/toolsStorage';
import Lightbox from 'react-image-lightbox';
import CImage from '../../componentes/image';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import { dateToStringB } from '../../utils/toolsDate';
import CSelect from '../../componentes/select2';
import PropTypes from 'prop-types';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_DatePicker from '../../componentes/data/date';
import C_Caracteristica from '../../componentes/data/caracteristica';
import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import C_TextArea from '../../componentes/data/textarea';
import strings from '../../utils/strings';
import C_CheckBox from '../../componentes/data/checkbox';
import Confirmation from '../../componentes/confirmation';
const {Option} = Select;

const NRO_CUENTA_DEFAULT = 3;

class EditComprobante extends Component{

    constructor(props){
        super(props);
        this.state = {
            idtipopago: '',
            tipospagos: [],
            bancos: [],
            listbancos: [],
            idbanco: -1,
            nombanco: undefined,
            nrocheque: '',
            monedas: [],
            idtipo: '',
            tiposcomprobantes: [],
            periodos: [],
            idperiodo: '',
            idmoneda: '',
            numero: '',
            nrodoc: '',
            tipocambio: '',
            referidoa: '',
            glosa: '',
            nivel: -1,
            fecha: '',//dateToString(new Date(), 'f2'),
            //gestion: undefined,
            idscuentas: [null, null, null],
            idscuentasdel: [],
            codscuentas: [undefined, undefined, undefined],
            nomcuentas: [undefined, undefined, undefined],
            glosas: ['', '', ''],
            debes: ['', '', ''],
            haberes: ['', '', ''],
            idscentrocostos: [null, null, null],
            nomscentrocostos: [undefined, undefined, undefined],
            cuentas: [],
            cuentascod: [],
            cuentasnom: [],
            cuentas: [],
            centrocostos: [],
            centrocostos2: [],
            cuentasSelect: [],
            totaldebe: '',
            totalhaber: '',
            contabilizar: true,
            redirect: false,
            modalOk: false,
            modalCancel: false,
            loadingOk: false
        }

        this.onChangeTipo = this.onChangeTipo.bind(this);
        this.onChangeFecha = this.onChangeFecha.bind(this);
        this.onChangeMoneda = this.onChangeMoneda.bind(this);
        this.onChangeNroDoc = this.onChangeNroDoc.bind(this);
        this.onChangeBanco = this.onChangeBanco.bind(this);
        this.onChangeTipoPago = this.onChangeTipoPago.bind(this);
        this.onChangeCheckCont = this.onChangeCheckCont.bind(this);
        this.onChangeReferidoa = this.onChangeReferidoa.bind(this);
        this.onChangeGlosa = this.onChangeGlosa.bind(this);
        //this.onChangeCuentasCod = this.onChangeCuentasCod.bind(this);
        this.onChangeCuentasNom = this.onChangeCuentasNom.bind(this);
        this.onChangeTipoCambio = this.onChangeTipoCambio.bind(this);
        this.onChangeNroCheque = this.onChangeNroCheque.bind(this);
        this.addCuenta = this.addCuenta.bind(this);
        this.onOkMO = this.onOkMO.bind(this);
        this.onCancelMO = this.onCancelMO.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    validarData() {
        if(!this.validarDatos()) return;
        this.setState({
            visiblePlanPago: false,
            modalOk: true
        })
    }

    onOkMO() {
        this.updateComprobante();
        this.setState({
            loadingOk: true
        })
    }

    onCancelMO() {
        this.setState({
            modalOk: false,
            visiblePlanPago: true
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

    onChangeTipo(value) {
        let data = this.state.tiposcomprobantes;
        let length = data.length;
        let numero = this.state.numero;
        for (let i = 0; i < length; i++) {
            if (data[i].idcomprobantetipo == value) {
                numero = data[i].numeroactual + 1;
                break;
            }
        }
        this.setState({
            idtipo: value,
            numero: numero
        })
    }

    onChangeCheckCont(evt) {
        this.setState({
            contabilizar: evt.target.checked
        })
    }

    onChangeFecha(dateString) {
        let fecha = stringToDate(dateString, 'f2');
        let arr = this.state.periodos;
        let length = arr.length;
        let valido = false;
        for (let i = 0; i < length; i++) {
            let ini = stringToDate(arr[i].fechaini);
            let fin = stringToDate(arr[i].fechafin);
            if (fecha >= ini && fecha <= fin) {
                valido = true;
                break;
            }
        }
        if (!valido) {
            message.warning('La fecha no es valida, debe estar dentro de algun periodo activo');
            return;
        }
        this.setState({
            fecha: dateString
        })
    }

    onChangeMoneda(value) {
        let data = this.state.monedas;
        let length = data.length;
        let tipocambio = this.state.tipocambio;
        console.log(data)
        for (let i = 0; i < length; i++) {
            if (data[i].idmoneda == value) {
                tipocambio = data[i].valor == null ? 1 : data[i].valor;
                break;
            }
        }
        this.setState({
            idmoneda: value,
            tipocambio: tipocambio
        })
    }

    onChangeTipoCambio(value) {
        if(isNaN(value)) return;
        if (!this.only2Decimals(value)) return;
        this.setState({
            tipocambio: value
        })
    }

    onChangeNroDoc(value) {
        this.setState({
            nrodoc: value
        })
    }

    onChangeBanco(value) {
        let data = this.state.listbancos;
        let length = data.length;
        let id = this.state.idbanco;
        for (let i = 0; i < length; i++) {
            if (data[i].nombre == value) {
                id = data[i].idbanco;
                break;
            }
        }
        this.setState({
            idbanco: id,
            nombanco: value
        })
    }

    onChangeNroCheque(value) {
        if (isNaN(value)) return;
        this.setState({
            nrocheque: value
        })
    }

    onChangeTipoPago(value) {
        this.setState({
            idtipopago: value
        })
    }

    onChangeReferidoa(value) {
        this.setState({
            referidoa: value
        })
    }

    onChangeGlosa(value) {
        this.setState({
            glosa: value    
        })
    }

    isValido(key, data) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].value == key) {
                if (data[i].children == undefined) {
                    return true;
                } else {
                    return false;
                }
            }
            if (data[i].children != undefined) {
                if (this.isValido(key, data[i].children))
                    return true;
            }
        }
        return false;
    }

    isValidoCuenta(key, data, nivel) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].value == key) {
                //if (data[i].children == undefined && nivel == this.state.nivel) {
                if (nivel == this.state.nivel) {
                    return true;
                } else {
                    return false;
                }
            }
            if (data[i].children != undefined) {
                if (this.isValidoCuenta(key, data[i].children, nivel + 1))
                    return true;
            }
        }
        return false;
    }

    /*onChangeCuentasCod(index, value) {
        let pos = this.state.codscuentas.indexOf(value);
        if (this.isValidoCuenta(value, this.state.cuentascod, 1) && pos == -1) {
            let data = this.state.cuentas;
            let length = data.length;
            let nom = this.state.nomcuentas[index];
            let id = this.state.idscuentas[index].id;
            for (let i = 0; i < length; i ++) {
                if (data[i].codcuenta == value) {
                    nom = data[i].nombre;
                    id = data[i].idcuentaplan;
                    break;
                }
            }
            this.state.nomcuentas[index] = nom;
            this.state.codscuentas[index] = value;
            this.state.idscuentas[index].id = id;
            this.setState({
                idscuentas: this.state.idscuentas,
                nomcuentas: this.state.nomcuentas,
                codscuentas: this.state.codscuentas
            })
        } else if (pos != -1) {
            message.warning('La cuenta ya fue seleccionada');
        } else {
            message.warning(`Debe seleccionar una cuenta del nivel ${this.state.nivel}`);
        }
    }*/

    onChangeCuentasNom(index, value) {
        //let pos = this.state.nomcuentas.indexOf(value);  &&  pos == -1
        if (this.isValidoCuenta(value, this.state.cuentasnom, 1)) {
            let cuentas = this.state.cuentas;
            let size = cuentas.length;
            let cuenta = null;
            for (let j = 0; j < size; j++) {
                let name = cuentas[j].codcuenta + ' ' + cuentas[j].nombre;
                if (value == name) {
                    cuenta = {id: cuentas[j].idcuentaplan, iddet: -1, };
                    break;
                }
            }
            this.state.nomcuentas[index] = value;
            this.state.idscuentas[index] = cuenta;
            
            this.setState({
                nomcuentas: this.state.nomcuentas,
            })
        }  else {
            message.warning(`Debe seleccionar una cuenta del nivel ${this.state.nivel}`);
        }
    }

    onChangeGlosas(index, value) {
        if (this.state.nomcuentas[index] == undefined) return;
        this.state.glosas[index] = value;
        this.setState({
            glosas: this.state.glosas
        })
    }

    only2Decimals(num) {
        let index = num.indexOf('.');
        if (index >= 0) {
            let dif = num.length - index;
            return dif <= 3 ? true : false;
        }
        return true;
    }

    onChangeDebes(index, value) {
        if (this.state.nomcuentas[index] == undefined) return;
        if (isNaN(value)) return;
        if (!this.only2Decimals(value)) return;
        this.state.debes[index] = value;
        this.setState({
            debes: this.state.debes
        },
            () => this.calcularHaberDebeTotal()
        )
    }

    onChangeHaberes(index, value) {
        if (this.state.nomcuentas[index] == undefined) return;
        if (isNaN(value)) return;
        if (!this.only2Decimals(value)) return;
        this.state.haberes[index] = value;
        this.setState({
            haberes: this.state.haberes
        },
            () => this.calcularHaberDebeTotal()
        )
    }

    onChangeCCostos(index, value) {
        
        if (this.state.nomcuentas[index] == undefined) return;
        if (this.isValido(value, this.state.centrocostos2)) {
            let data = this.state.centrocostos;
            let length = data.length;
            let id = this.state.idscentrocostos[index];
            for (let i = 0; i < length; i++) {
                if (data[i].nombre == value) {
                    id = data[i].idcentrodecosto;
                    break;
                }
            }

            this.state.nomscentrocostos[index] = value;
            this.state.idscentrocostos[index] = id;
            this.setState({
                nomscentrocostos: this.state.nomscentrocostos,
                idscentrocostos: this.state.idscentrocostos
            })
        } else {
            message.warning('Debe seleccionar un centro de costo del ultimo nivel');
        }
    }

    calcularHaberDebeTotal() {
        let debes = this.state.debes;
        let haberes = this.state.haberes;
        let length = debes.length;
        let totalDebe = 0;
        let totalHaber = 0;
        for (let i = 0; i < length; i++) {
            if (this.state.nomcuentas[i] != undefined) {
                totalDebe += isNaN(parseFloat(debes[i])) ? 0 : parseFloat(debes[i]);
                totalHaber += isNaN(parseFloat(haberes[i])) ? 0 : parseFloat(haberes[i]);
            }
        }
        totalDebe = isNaN(totalDebe) ? 0 : totalDebe.toFixed(2);
        totalHaber = isNaN(totalHaber) ? 0 : totalHaber.toFixed(2);
        this.setState({
            totaldebe: totalDebe,
            totalhaber: totalHaber
        })
    }

    cargarDetalles(cuentascod, cuentasnom, centrocostos) {
        let arr = [];
        for (let i = 0; i < NRO_CUENTA_DEFAULT; i++) {
            arr.push(-1);
            //arr2.push(cuentascod);
            //arr3.push(cuentasnom);
            //arr4.push(centrocostos);
        }
        this.setState({
            idscuentas: arr,
            //cuentascod: arr2,
            //cuentasnom: arr3,
            //centrocostos: arr4
        })
    }

    componentDidMount() {
        this.getComprobante();
    }

    getComprobante() {
        httpRequest('get', ws.wscomprobante + '/' + this.props.match.params.id + '/edit')
        .then((result) => {
            console.log(result)
            if (result.response == 1) {
                this.arbolBancos(result.bancos2, result.bancos);
                //let cuentascod = result.cuentascod;
                //let cuentas2 = [];
                //this.arbolCuentas(result.cuentascod, result.cuentas);
                this.arbolCuentas2(result.cuentasnom, result.cuentas);
                this.arbolCentroCostos(result.centrocostos2, result.centrocostos);
                //this.cargarDetalles(result.cuentascod, result.cuentasnom, result.centrocostos2);
                this.setState({
                    tipospagos: result.tipospagos,
                    bancos: result.bancos2,
                    listbancos: result.bancos,
                    nombanco: result.nombanco,
                    tiposcomprobantes: result.tiposcomprobantes,
                    periodos: result.periodos,
                    contabilizar: result.comprobante.contabilizar == 'S' ? true : false,
                    monedas: result.monedas,
                    fecha: convertYmdToDmy(result.comprobante.fecha),
                    idtipopago: result.comprobante.fkidtipopago,
                    idbanco: result.comprobante.fkidbanco,
                    idtipo: result.comprobante.fkidcomprobantetipo,
                    numero: result.comprobante.codcomprobante,
                    idmoneda: result.comprobante.fkidmoneda,
                    nrodoc: result.comprobante.nrodoc,
                    tipocambio: result.comprobante.tipocambio,
                    referidoa: result.comprobante.referidoa,
                    glosa: result.comprobante.glosa,
                    //gestion: result.gestion,
                    //cuentascod: result.cuentascod,
                    cuentasnom: result.cuentasnom,
                    centrocostos: result.centrocostos,
                    centrocostos2: result.centrocostos2,
                    cuentas: result.cuentas,
                    nivel: result.cuentaconfig.numniveles,
                    nrocheque: result.comprobante.nrochequetarjeta,
                    idscuentas: result.detalles.idscuentas,
                    //codscuentas: result.detalles.codscuentas,
                    nomcuentas: result.detalles.nomcuentas,
                    glosas: result.detalles.glosas,
                    debes: result.detalles.debes,
                    haberes: result.detalles.haberes,
                    idscentrocostos: result.detalles.idscentrocostos,
                    nomscentrocostos: result.detalles.nomscentrocostos,
                }, 
                    () => this.calcularHaberDebeTotal()
                )
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    validarDatos() {
        let data = this.state.nomcuentas;
        let length = data.length;
        let c = 0;
        for (let i = 0; i < length; i++) {
            if (data[i] != undefined)
                c++;
            if (data[i] != undefined && this.state.debes[i] == '' && this.state.haberes[i] == '') {
                message.warning('Complete los campos del debe y el haber de la fila Nro ', (i + 1));
                return false;
            }
        }
        if (c < 2) {
            message.warning('Deben haber por lo menos 2 registros de cuentas');
            return false;
        }
            

        if (this.state.contabilizar && this.state.totaldebe != this.state.totalhaber) {
            message.warning('El Total Debe y el Total Haber tienen que ser iguales');
            return false;
        }

        return true;
    }

    updateIdsCuentas() {
        let arr = this.state.nomcuentas;
        let length = arr.length;
        for (let i = 0; i < length; i++) {
            if (arr[i] != undefined) {
                let cuentas = this.state.cuentas;
                let size = cuentas.length;
                let id = -1;
                for (let j = 0; j < size; j++) {
                    let name = cuentas[j].codcuenta + ' ' + cuentas[j].nombre;
                    if (arr[i] == name) {
                        id = cuentas[i].idcuentaplan;
                    }
                }
                this.state.idscuentas[i].id = id;
            }
        }
    }

    cargarIdsCuentas() {
        let arr = this.state.nomcuentas;
        let length = arr.length;
        let ids = [];
        for (let i = 0; i < length; i++) {
            if (arr[i] != undefined) {
                let cuentas = this.state.cuentas;
                let size = cuentas.length;
                let id = null;
                for (let j = 0; j < size; j++) {
                    let name = cuentas[j].codcuenta + ' ' + cuentas[j].nombre;
                    if (arr[i] == name) {
                        id = cuentas[j].idcuentaplan;
                        break;
                    }
                }
                if (id != null) {
                    ids.push(id);
                }
            }
        }
        return ids;
    }
    updateComprobante() {

        let body = {
            fecha: this.state.fecha,
            idtipo: this.state.idtipo,
            idmoneda: this.state.idmoneda,
            idbanco: this.state.idbanco,
            fecha: convertDmyToYmd(this.state.fecha),
            nrocheque: this.state.nrocheque,
            tipocambio: this.state.tipocambio,
            idtipopago: this.state.idtipopago,
            nrodoc: this.state.nrodoc,
            referidoa: this.state.referidoa,
            glosa: this.state.glosa,
            idscuentasdel: JSON.stringify(this.state.idscuentasdel),
            //idscuentas: JSON.stringify(this.state.idscuentas),
            idscuentas: JSON.stringify(this.state.idscuentas), //idscuentas: JSON.stringify(this.cargarIdsCuentas()),
            glosas: JSON.stringify(this.state.glosas),
            debes: JSON.stringify(this.state.debes),
            haberes: JSON.stringify(this.state.haberes),
            idscentrocostos: JSON.stringify(this.state.idscentrocostos),
            contabilizar: this.state.contabilizar
        };
        console.log(body);
        
        httpRequest('put', ws.wscomprobante + '/' + this.props.match.params.id, body)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({ redirect: true, loadingOk: false, modalOk: false });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, loadingOk: false, modalCancel: false })
            } else {
                console.log('Ocurrio un problema en el servidor');
                this.setState({
                    modalOk: false,
                    loadingOk: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                modalOk: false,
                loadingOk: false
            })
        })

    }

    componentTreSelectBanco() {
        if (this.state.idtipopago == 2) { // SI ES CHEQUE
            return (
                <C_TreeSelect
                    treeDefaultExpandAll={true}   
                    showSearch={true}
                    title='Banco'
                    value={this.state.nombanco}
                    treeData={this.state.bancos}
                    placeholder='Seleccione una opcion'
                    onChange={this.onChangeBanco}
                />
            );
        }
        return null;
    }

    componentNroCheque() {
        if (this.state.idtipopago == 2) { // SI ES CHEQUE
            return (
                <C_Input
                    title='Nro Cheque'
                    value={this.state.nrocheque}
                    onChange={this.onChangeNroCheque}
                />
            );
        }
        return null;
    }
                            

    arbolCuentas2(data, array) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosCuenta2(data[i].key, array);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
                this.arbolCuentas2(hijos, array);
            }
        }
    }

    hijosCuenta2(idpadre, array) {
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == idpadre) {
                const elemento = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].codcuenta + ' ' + array[i].nombre,
                    key: array[i].idcuentaplan
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    arbolCuentas(data, array) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosCuenta(data[i].key, array);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
                this.arbolCuentas(hijos, array);
            }
        }
    }

    hijosCuenta(idpadre, array) {
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcuentaplanpadre == idpadre) {
                const elemento = {
                    title: array[i].codcuenta,
                    value: array[i].codcuenta,
                    key: array[i].idcuentaplan
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    cargarBancos(bancos) {
        let idDefecto = bancos[0].idbanco;
        var array_aux = [];
        for (var i = 0; i < bancos.length; i++) {
            if (bancos[i].idpadrefamilia == null) {
                var elem = {
                    title: bancos[i].nombre,
                    value: bancos[i].idbanco,
                    key: bancos[i].idbanco
                };
                array_aux.push(elem);
            }
        }
        this.arbolBancos(array_aux, bancos);
        this.setState({
            bancos: array_aux,
            //idbanco: idDefecto
        });
    }

    arbolCentroCostos(data, array) {

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosCentrosCostos(data[i].key, array);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
                this.arbolCentroCostos(hijos, array);
            }
        }
    }

    hijosCentrosCostos(idpadre, array) {
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcentrodecostopadre == idpadre) {
                const elemento = {
                    title: array[i].nombre,
                    value: array[i].nombre,
                    key: array[i].idcentrodecosto
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    arbolBancos(data, array) {

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var hijos = this.hijosBanco(data[i].key, array);
                if (hijos.length > 0) {
                    data[i].children = hijos;
                }
                this.arbolBancos(hijos, array);
            }
        }
    }

    hijosBanco(idpadre, array) {
        var hijos = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidbancopadre == idpadre) {
                const elemento = {
                    title: array[i].nombre,
                    value: array[i].nombre,
                    key: array[i].idbanco
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    addCuenta() {
        this.state.idscuentas.push({id: -1, iddet: -1});
        //this.state.codscuentas.push(undefined);
        this.state.nomcuentas.push(undefined);
        this.state.glosas.push('');
        this.state.debes.push('');
        this.state.haberes.push('');
        this.state.idscentrocostos.push(null);
        this.state.nomscentrocostos.push(undefined);
    
        this.setState({
            idscuentas: this.state.idscuentas,
            //codscuentas: this.state.codscuentas,
            nomcuentas: this.state.nomcuentas,
            glosas: this.state.glosas,
            debes: this.state.debes,
            haberes: this.state.haberes,
            idscentrocostos: this.state.idscentrocostos,
            nomscentrocostos: this.state.nomscentrocostos
        })
    }

    removeCuenta(index) {
        if (this.state.idscuentas[index].iddet != -1) {
            this.state.idscuentasdel.push(this.state.idscuentas[index].iddet);
        }
        this.state.idscuentas.splice(index, 1);
        //this.state.codscuentas.splice(index, 1);
        this.state.nomcuentas.splice(index, 1);
        this.state.glosas.splice(index, 1);
        this.state.debes.splice(index, 1);
        this.state.haberes.splice(index, 1);
        this.state.idscentrocostos.splice(index, 1);
        this.state.nomscentrocostos.splice(index, 1);
        this.setState({
            idscuentasdel: this.state.idscuentasdel,
            idscuentas: this.state.idscuentas,
            //codscuentas: this.state.codscuentas,
            nomcuentas: this.state.nomcuentas,
            glosas: this.state.glosas,
            debes: this.state.debes,
            haberes: this.state.haberes,
            idscentrocostos: this.state.idscentrocostos,
            nomscentrocostos: this.state.nomscentrocostos
        },
            () => this.calcularHaberDebeTotal()
        )
    }

    listTipos() {
        let data = this.state.tiposcomprobantes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idcomprobantetipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    listMonedas() {
        let data = this.state.monedas;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idmoneda}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    listTiposPagos() {
        let data = this.state.tipospagos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idtipopago}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    showConfirmUpdate() {

        if(!this.validarDatos()) return;
        const updateComprobante = this.updateComprobante.bind(this);
        Modal.confirm({
          title: 'Acutalizar Comprobante',
          content: '¿Estas seguro de actulizar el comprobante?',
          onOk() {
            console.log('OK');
            updateComprobante();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    showConfirmCancel() {

        const redirect = this.redirect.bind(this);
        Modal.confirm({
          title: 'Cancelar Editar Comprobante',
          content: '¿Estas seguro de cancelar , los datos no se guardaran',
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

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.comprobante_index} />
            )
        }
        const listTipos = this.listTipos();
        const listMonedas = this.listMonedas();
        const listTiposPagos = this.listTiposPagos();
        const componentTreSelectBanco = this.componentTreSelectBanco();
        const componentNroCheque = this.componentNroCheque();
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups" style={{'marginTop': '-15px'}}>
                        <div className="pulls-left">
                            <h1 className="lbls-title">Editar Comprobrante</h1>
                        </div>
                    </div>
                    <Confirmation
                        visible={this.state.modalOk}
                        title="Editar Comprobante"
                        loading={this.state.loadingOk}
                        onCancel={this.onCancelMO}
                        onClick={this.onOkMO}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de editar el comprobante?
                                </label>
                            </div>
                        ]}
                    />

                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Cancelar Editar Comprobante"
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de cancelar la actualizacion del comprobante?
                                    Los datos modificados se perderan.
                                </label>
                            </div>
                        ]}
                    />

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                           
                            <C_Select 
                                title='Tipo'
                                value={this.state.idtipo}
                                onChange={this.onChangeTipo}
                                component={listTipos}
                                readOnly={true}
                            />

                            <C_Input
                                title='Numero'
                                value={this.state.numero}
                                readOnly={true}
                            />

                            <C_DatePicker 
                                value={this.state.fecha}
                                onChange={this.onChangeFecha}
                            />

                            <C_Input
                                title='Nro Doc'
                                value={this.state.nrodoc}
                                onChange={this.onChangeNroDoc}
                            />

                            <C_Select
                                title='Moneda'
                                value={this.state.idmoneda}
                                onChange={this.onChangeMoneda}
                                component={listMonedas}
                            />

                            <C_Input
                                title='Tipo Cambio'
                                value={this.state.tipocambio}
                                onChange={this.onChangeTipoCambio}
                                style={{ textAlign: 'right' }}
                                //readOnly={true}
                            />

                            <C_Select
                                title='Tipo Pago'
                                value={this.state.idtipopago}
                                onChange={this.onChangeTipoPago}
                                component={listTiposPagos}
                            />

                            <C_CheckBox
                                title='Contabilizar'
                                style={{ marginTop: 16, marginLeft: 4 }}
                                onChange={this.onChangeCheckCont}
                                checked={this.state.contabilizar}
                            />

                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            { componentTreSelectBanco }

                            { componentNroCheque }

                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                title='Referido a'
                                value={this.state.referidoa}
                                onChange={this.onChangeReferidoa}
                                //className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            />

                            <C_TextArea 
                                title='Glosa'
                                value={this.state.glosa}
                                onChange={this.onChangeGlosa}
                                //className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                        </div>
                            <div className="pull-right">
                                <C_Button
                                    title='+'
                                    type='success'
                                    onClick={this.addCuenta}
                                />
                            </div>
                            <div className="table-detalle" 
                                style={{ 
                                    width: '100%',
                                    //marginLeft: '10%',
                                    overflow: 'auto',
                                    height: 400
                                }}>
                                <table className="table-response-detalle">
                                    <thead>
                                        <tr>
                                            <th>Nro</th>
                                            {/*<th>Codigo</th>*/}
                                            <th>
                                                Cuenta 
                                                <C_Button placement='top' tooltip='NUEVA CUENTA'
                                                    title={<i className="fa fa-plus"></i>}
                                                    type='primary' size='small' style={{padding: 4, float: 'right'}}
                                                    //onClick={this.addRowProducto.bind(this)}
                                                />
                                            </th>
                                            <th>Glosa</th>
                                            <th style={{ width: '12%' }}>Debe</th>
                                            <th style={{ width: '12%' }}>Haber</th>
                                            <th>C.Costo</th>
                                            <th>Accion</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.idscuentas.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    {/*<td>
                                                        <C_TreeSelect
                                                            treeDefaultExpandAll={true}
                                                            showSearch={true}   
                                                            value={this.state.codscuentas[key]}
                                                            treeData={this.state.cuentascod}
                                                            onChange={this.onChangeCuentasCod.bind(this, key)}
                                                            placeholder='Seleccione una opcion'
                                                            className=''
                                                        />
                                                    </td>*/}
                                                    <td>
                                                        <C_TreeSelect
                                                            treeDefaultExpandAll={true}
                                                            showSearch={true}
                                                            value={this.state.nomcuentas[key]}
                                                            treeData={this.state.cuentasnom}
                                                            onChange={this.onChangeCuentasNom.bind(this, key)}
                                                            placeholder='Seleccione una opcion'
                                                            className=''
                                                        />
                                                    </td>
                                                    <td>
                                                        <C_TextArea 
                                                            //title='Referido a'
                                                            value={this.state.glosas[key]}
                                                            onChange={this.onChangeGlosas.bind(this, key)}
                                                            className=""
                                                            style={{ height: '100%' }}
                                                            readOnly={this.state.nomcuentas[key] == undefined ? true : false}
                                                        />
                                                    </td>
                                                    <td style={{ width: '12%' }}>
                                                        <C_Input
                                                            value={this.state.debes[key]}
                                                            onChange={this.onChangeDebes.bind(this, key)}
                                                            className=""
                                                            readOnly={((this.state.haberes[key] != '' && this.state.haberes[key] != 0) || this.state.nomcuentas[key] == undefined) ? true : false}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td style={{ width: '12%' }}>
                                                        <C_Input
                                                            value={this.state.haberes[key]}
                                                            onChange={this.onChangeHaberes.bind(this, key)}
                                                            className=""
                                                            readOnly={((this.state.debes[key] != '' && this.state.debes[key] != 0) || this.state.nomcuentas[key] == undefined) ? true : false}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <C_TreeSelect
                                                            showSearch={true}   
                                                            value={this.state.nomscentrocostos[key]}
                                                            treeData={this.state.centrocostos2}
                                                            onChange={this.onChangeCCostos.bind(this, key)}
                                                            placeholder='Seleccione una opcion'
                                                            className=''
                                                            readOnly={this.state.nomcuentas[key] == undefined ? true : false}
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
                                            )
                                        }
                                        )}
                                        <tr key={-1}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <C_Input
                                                    key={0}
                                                    //title='Total Debe'
                                                    value={this.state.totaldebe}
                                                    readOnly={true}
                                                    className=""
                                                    style={{ textAlign: 'right' }}
                                                />
                                            </td>
                                            <td>
                                                <C_Input
                                                    key={1}
                                                    //title='Total Haber'
                                                    value={this.state.totalhaber}
                                                    readOnly={true}
                                                    className=""
                                                    style={{ textAlign: 'right' }}
                                                />
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button
                                    title='Guardar'
                                    type='primary'
                                    onClick={this.validarData.bind(this)}
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
        );
    }
}

export default EditComprobante;

