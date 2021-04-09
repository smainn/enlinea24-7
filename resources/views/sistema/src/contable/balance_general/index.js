
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { message, Select, Dropdown, Menu, Divider } from 'antd';
import 'antd/dist/antd.css';
import { stringToDate, stringToDateB, dateToString, hourToString, convertDmyToYmd, convertYmdToDmy } from '../../utils/toolsDate';
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
import C_TreeSelect from '../../componentes/data/treeselect';
import C_Button from '../../componentes/data/button';
import C_TextArea from '../../componentes/data/textarea';
import C_CheckBox from '../../componentes/data/checkbox';
import strings from '../../utils/strings';

const {Option} = Select;

const NRO_CUENTA_DEFAULT = 3;
let now = new Date();

class IndexBalanceGeneral extends Component{

    constructor(props){
        super(props);
        this.state = {
            idmoneda: '',
            monedas: [],
            ultnivel: -1,
            nivel: -1,
            doctype: 'S',
            fechadesde: '',
            fechahasta: dateToString(now, 'f2'),
            checkMostrarCodigo: false,
            noSesion: false
        }
        
        this.onChangeMoneda = this.onChangeMoneda.bind(this);
        this.onChangeCheckMostrarCodigo = this.onChangeCheckMostrarCodigo.bind(this);
        this.onChangeHasta = this.onChangeHasta.bind(this);
        this.onChangeNivel = this.onChangeNivel.bind(this);
        this.onChangeTipoDoc = this.onChangeTipoDoc.bind(this);
        this.limpiar = this.limpiar.bind(this);
    }

    onChangeMoneda(value) {
        this.setState({
            idmoneda: value
        })
    }

    onChangeCheckMostrarCodigo(evt) {
        this.setState({
            checkMostrarCodigo: evt.target.checked,
        })
    }

    onChangeHasta(dateString) {
        this.setState({
            fechahasta: dateString
        })
    }

    onChangeNivel(value) {
        this.setState({
            nivel: value
        })
    }

    onChangeTipoDoc(value) {
        this.setState({
            doctype: value
        })
    }

    limpiar() {

    }

    componentDidMount() {
        this.create();
    }

    create() {
        httpRequest('get', ws.wsbalancegeneral)
        .then((result) => {
            //console.log(result)
            if (result.response == 1) {
                this.setState({
                    fechadesde: convertYmdToDmy(result.gestion.fechaini),
                    fechahasta: convertYmdToDmy(result.gestion.fechafin),
                    monedas: result.monedas,
                    idmoneda: result.monedas.length > 0 ? result.monedas[0].idmoneda : '',
                    nivel: parseInt(result.config.numniveles) - 1,
                    ultnivel: result.config.numniveles
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            //console.log(error);
            message.error(strings.message_error);
        })
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    showConfirmCancel() {
        /*const redirect = this.redirect.bind(this);
        Modal.confirm({
          title: 'Cancelar Nuevo Comprobante',
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
        */
    }

    listMonedas() {
        let data = this.state.monedas;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idmoneda}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    listNiveles() {
        let length = this.state.ultnivel;
        let arr = [];
        for (let i = 1; i <= length; i++) {
            arr.push(
                <Option key={i} value={i}>{`Nivel ${i}`}</Option>
            );
        }
        return arr;
    }

    validarParametros() {
        
        return true;
    }

    generar(event) {
        event.preventDefault();
        if (!this.validarParametros()) return;
        document.getElementById('bg_form').submit();
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        const listMonedas = this.listMonedas();
        const listNiveles = this.listNiveles();

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));

        const usuario = user == null ? '' :
            (user.apellido == null)?user.nombre:user.nombre + ' ' + user.apellido;

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
                <div className="cards">
                    <div className="forms-groups" style={{'marginTop': '-15px'}}>

                        <div className="pulls-left">
                            <h1 className="lbls-title"> Balance General </h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form id="bg_form" action={routes.reporte_balance_general_generar} target="_blank" method='post'>
                            
                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />
                            <input type='hidden' value={usuario} name='usuario' />
                            {/*<input type='hidden' value={this.state.exportar} name='exportar' />*/}

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <C_Input 
                                        title='Desde'
                                        value={this.state.fechadesde}
                                        //onChange={this.onChangeTipo}
                                        //component={listTipos}
                                        className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                        readOnly={true}
                                    />
                                    <input type='hidden' value={convertDmyToYmd(this.state.fechadesde)} name='fechadesde' />
                                    <C_DatePicker
                                        title='Hasta'
                                        value={this.state.fechahasta}
                                        onChange={this.onChangeHasta}
                                        //readOnly={(this.state.checkGestion || this.state.checkPeriodo)}
                                        className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12"
                                    />
                                    <input type='hidden' value={convertDmyToYmd(this.state.fechahasta)} name='fechahasta' />
                                    <C_Select 
                                        title='Moneda'
                                        value={this.state.idmoneda}
                                        onChange={this.onChangeMoneda}
                                        component={listMonedas}
                                        className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                    />
                                    <input type='hidden' value={this.state.idmoneda} name='idmoneda' />
                                </div>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <C_Select 
                                        title='Nivel'
                                        value={this.state.nivel}
                                        onChange={this.onChangeNivel}
                                        component={listNiveles}
                                        className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                    />
                                    <input type='hidden' value={this.state.nivel} name='nivel' />
                                    <C_Input
                                        value="Mostrar Codigos"
                                        readOnly={true}
                                        className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                        suffix={
                                            <C_CheckBox
                                                style={{marginTop: -5,}}
                                                onChange={this.onChangeCheckMostrarCodigo}
                                                checked={this.state.checkMostrarCodigo}
                                                //disabled={this.state.disabled_gestion}
                                            />
                                        }
                                    />
                                    <input type='hidden' value={this.state.checkMostrarCodigo} name='mostrarcodigo' />
                                    <C_Select 
                                        title='Exportar a'
                                        value={this.state.doctype}
                                        onChange={this.onChangeTipoDoc}
                                        component={[
                                            <Option key={0} value='S'>Seleccionar</Option>,
                                            <Option key={1} value='P'>PDF</Option>,
                                            <Option key={2} value='E'>Excel</Option>
                                        ]}
                                        className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                    />
                                    <input type='hidden' value={this.state.doctype} name='doctype' />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button
                                        title='Limpiar'
                                        type='primary'
                                        onClick={this.limpiar}
                                    />
                                    <C_Button
                                        title='Generar Balance'
                                        type='primary'
                                        submit={true}
                                        onClick={this.generar.bind(this)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default IndexBalanceGeneral;

