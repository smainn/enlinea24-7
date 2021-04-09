
import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Select, Dropdown, Menu, Divider } from 'antd';

import { stringToDate, stringToDateB, dateToString, hourToString, convertDmyToYmd, convertYmdToDmy } from '../../utils/toolsDate';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData, readData, saveData } from '../../utils/toolsStorage';

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
let dat = new Date();
dat.setMonth(dat.getMonth() - 1);

class IndexLibroDiario extends Component{

    constructor(props){
        super(props);
        this.state = {
            idmoneda: '',
            monedas: [],
            idtipo: 0,
            tipos: [],
            idcuenta: 0,
            referidoa: '',
            glosa: '',
            nivel: -1,
            doctype: 'S',
            valcuenta: undefined,
            idperiodo: 0,
            nomperiodo: 'Por Periodo',
            periodos: [],
            cuentascodnom: [],
            cuentas: [],
            fechadesde: dateToString(dat, 'f2'),
            fechahasta: dateToString(now, 'f2'),
            checkGestion: true,
            checkPeriodo: false,
            visibleDropdown: false,
            asientoautomatico: false,
            noSesion: false
        }

        this.onChangeMoneda = this.onChangeMoneda.bind(this);
        this.onChangeTipo = this.onChangeTipo.bind(this);
        this.onChangeCuenta = this.onChangeCuenta.bind(this);
        this.onChangeCheckGestion = this.onChangeCheckGestion.bind(this);
        this.onChangeCheckPeriodo = this.onChangeCheckPeriodo.bind(this);
        this.onVisibleChangeDropdown = this.onVisibleChangeDropdown.bind(this);
        this.onClickMenuPeriodo = this.onClickMenuPeriodo.bind(this);
        this.onChangeDesde = this.onChangeDesde.bind(this);
        this.onChangeHasta = this.onChangeHasta.bind(this);
        this.onChangeReferidoa = this.onChangeReferidoa.bind(this);
        this.onChangeGlosa = this.onChangeGlosa.bind(this);
        this.onChangeTipoDoc = this.onChangeTipoDoc.bind(this);
        this.limpiar = this.limpiar.bind(this);
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

    onChangeCuenta(value) {
        if (this.isValidoCuenta(value, this.state.cuentascodnom, 1)) {
            let arr = this.state.cuentas;
            let length = arr.length;
            let idcuenta = this.state.idcuenta;
            for (let i = 0; i < length; i++) {
                let name = arr[i].codcuenta + ' ' + arr[i].nombre;
                if (name == value) {
                    idcuenta = arr[i].idcuentaplan;
                    break;
                }
            }
            this.setState({
                valcuenta: value,
                idcuenta: idcuenta
            })
        } else {
            message.warning(`La cuenta no es valida, debe seleccionar una cuenta del nivel ${this.state.nivel}`);
        }
        
    }

    onChangeMoneda(value) {
        this.setState({
            idmoneda: value
        })
    }

    onChangeTipo(value) {
        this.setState({
            idtipo: value
        })
    }

    onChangeCheckGestion(evt) {
        this.setState({
            checkGestion: evt.target.checked,
            checkPeriodo: false,
            nomperiodo: 'Por Periodo',
            idperiodo: 0
        })
    }

    onChangeCheckPeriodo(evt) {
        if (!evt.target.checked) {
            this.setState({
                checkPeriodo: evt.target.checked,
                checkGestion: false,
                visibleDropdown: false
            })
        } else {
            this.setState({
                checkPeriodo: evt.target.checked,
                checkGestion: false
            })
        }
        
    }

    onVisibleChangeDropdown(evt) {
        if (this.state.checkPeriodo) {
            this.setState({
                visibleDropdown: !this.state.visibleDropdown
            })
        }
    }

    onChangeTipoDoc(value) {
        this.setState({
            doctype: value
        })
    }

    onChangeDesde(dateString) {
        this.setState({
            fechadesde: dateString
        })
    }

    onChangeHasta(dateString) {
        this.setState({
            fechahasta: dateString
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

    onClickMenuPeriodo(evt) {
        let arr = this.state.periodos;
        let length = arr.length;
        let nomperiodo = 'Por periodo';
        for (let i = 0; i < length; i++) {
            if (evt.key == arr[i].idperiodocontable) {
                nomperiodo = arr[i].descripcion;
                break;
            }
        }
        this.setState({
            visibleDropdown: false,
            nomperiodo: nomperiodo,
            idperiodo: evt.key
        })
    }

    componentDidMount() {
        this.create();
    }

    create() {
        httpRequest('get', ws.wslibrodiario)
        .then((result) => {
            if (result.response == 1) {
                this.arbolCuentas(result.cuentascodnom, result.cuentas);
                this.setState({
                    tipos :result.tiposcomprobantes,
                    cuentascodnom: result.cuentascodnom,
                    cuentas: result.cuentas,
                    
                    periodos: result.periodos,
                    fechadesde: result.periodos.length > 0 ? convertYmdToDmy(result.periodos[0].inicio) : this.state.fechadesde,
                    fechahasta: result.periodos.length > 0 ? convertYmdToDmy(result.periodos[0].fin) : this.state.fechahasta,
                    monedas: result.monedas,
                    idmoneda: result.monedas.length > 0 ? result.monedas[0].idmoneda : '',
                    nivel: result.cuentaconfig.numniveles
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
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
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].codcuenta + ' ' + array[i].nombre,
                    key: array[i].idcuentaplan
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    limpiar() {
        this.setState({
            glosa: '',
            referidoa: '',
            checkGestion: true,
            checkPeriodo: false,
            nomperiodo: 'Por periodo',
            idperiodo: 0,
            idcuenta: 0,
            valcuenta: undefined
        })
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    listTipos() {
        let data = this.state.tipos;
        let length = data.length;
        let arr = [
            <Option key={-1} value={0}>Seleccionar</Option>
        ];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idcomprobantetipo}>{data[i].descripcion}</Option>
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
                <Option key={i} value={data[i].idmoneda}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    validarParametros() {
        if (!this.state.checkGestion && !this.state.checkPeriodo && 
            (this.state.fechadesde == '' || this.state.fechahasta == '')) {
            message.warning('Debe seleccionar una opcion, Gestion, Periodo o las fechas personalizadas');
            return false;
        }
        let ini = stringToDate(this.state.fechadesde, 'f2');
        let hasta = stringToDate(this.state.fechahasta, 'f2');
        if (hasta < ini) {
            message.warning('La fecha de inicio no puede ser menor que la del final');
            return false;
        }
        return true;
    }

    generar(event) {
        event.preventDefault();
        if (!this.validarParametros()) return;
        document.getElementById('form').submit();
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }

        const menu_periodo = (
            <Menu onClick={this.onClickMenuPeriodo}>
                {this.state.periodos.map((item, key) => {
                    return (
                    <Menu.Item key={item.idperiodocontable}>
                        {item.descripcion}
                    </Menu.Item>
                    )
                })}
            </Menu>
        ); 

        const listMonedas = this.listMonedas();
        const listTipos = this.listTipos();

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
                            <h1 className="lbls-title"> Libro Diario </h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form id="form" action={routes.reporte_libro_diario_generar} target="_blank" method='post'>
                            
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
                            
                                <C_Select 
                                    title='Tipo'
                                    value={this.state.idtipo}
                                    onChange={this.onChangeTipo}
                                    component={listTipos}
                                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                />
                                <input type='hidden' value={this.state.idtipo} name='idtipo' />
                                <C_Select 
                                    title='Moneda'
                                    value={this.state.idmoneda}
                                    onChange={this.onChangeMoneda}
                                    component={listMonedas}
                                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                />
                                <input type='hidden' value={this.state.idmoneda} name='idmoneda' />
                                <C_TreeSelect
                                    showSearch={true}   
                                    value={this.state.valcuenta}
                                    treeData={this.state.cuentascodnom}
                                    onChange={this.onChangeCuenta}
                                    placeholder='Seleccione una opcion'
                                    className='cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12'
                                />
                                <input type='hidden' value={this.state.idcuenta} name='idcuenta' />

                                <Divider style={{ paddingTop: 10 }} orientation="left">Seleccionar</Divider>

                                <div>
                                    <C_Input 
                                        value='Toda la Gestion'
                                        readOnly={true}
                                        className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'
                                        style={{cursor: 'pointer', 
                                            background: (this.state.checkPeriodo)?'#F5F5F5':'white',
                                        }}
                                        onClick={this.onChangeCheckGestion.bind(this)}
                                        suffix={
                                            <C_CheckBox
                                                onChange={this.onChangeCheckGestion.bind(this)}
                                                checked={this.state.checkGestion}
                                                style={{top: -4,}}
                                            />
                                        }
                                    />
                                    <input type='hidden' value={this.state.checkGestion} name='gestion' />
                                    
                                    <Dropdown overlay={menu_periodo} trigger={['click']} 
                                        visible={this.state.visibleDropdown}
                                        onVisibleChange={this.onVisibleChangeDropdown.bind(this)}
                                    >
                                        <C_Input 
                                            value={this.state.nomperiodo}
                                            readOnly={true}
                                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12'
                                            style={{cursor: 'pointer', 
                                                background: (this.state.checkGestion)?'#F5F5F5':'white',
                                            }}
                                            suffix={
                                                <C_CheckBox
                                                    onChange={this.onChangeCheckPeriodo.bind(this)}
                                                    checked={this.state.checkPeriodo}
                                                    style={{top: -4,}}
                                                />
                                            }
                                        />
                                    </Dropdown>
                                    <input type='hidden' value={this.state.checkPeriodo} name='periodo' />
                                    <input type='hidden' value={this.state.idperiodo} name='idperiodo' />
                                    
                                    <C_DatePicker
                                        title='Desde Fecha'
                                        value={this.state.fechadesde}
                                        onChange={this.onChangeDesde}
                                        readOnly={(this.state.checkGestion || this.state.checkPeriodo)}
                                        className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"
                                    />
                                    <input type='hidden' value={convertDmyToYmd(this.state.fechadesde)} name='fechadesde' />
                                    <C_DatePicker
                                        title='Hasta Fecha'
                                        value={this.state.fechahasta}
                                        onChange={this.onChangeHasta}
                                        readOnly={(this.state.checkGestion || this.state.checkPeriodo)}
                                        className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"
                                    />
                                    <input type='hidden' value={convertDmyToYmd(this.state.fechahasta)} name='fechahasta' />
                                </div>
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    title='Referido a'
                                    value={this.state.referidoa}
                                    onChange={this.onChangeReferidoa}
                                    //className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type='hidden' value={this.state.referidoa} name='referidoa' />
                                <C_TextArea 
                                    title='Glosa'
                                    value={this.state.glosa}
                                    onChange={this.onChangeGlosa}
                                    //className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type='hidden' value={this.state.glosa} name='glosa' />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Asiento Automatico'}
                                    readOnly={true}
                                    className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'
                                    style={{cursor: 'pointer', background: '#F5F5F5', }}
                                    onClick={() => this.setState({asientoautomatico: !this.state.asientoautomatico, })}
                                    suffix={
                                        <C_CheckBox
                                            onChange={() => this.setState({asientoautomatico: !this.state.asientoautomatico, })}
                                            checked={this.state.asientoautomatico}
                                            style={{top: -4,}}
                                        />
                                    }
                                />
                                <input type='hidden' value={this.state.asientoautomatico ? 'S' : 'N'} name='asientoautomatico' />
                                <div className="cols-lg-6 cols-md-6 cols-sm-6"></div>
                                <C_Select 
                                    title='Exportar a'
                                    value={this.state.doctype}
                                    onChange={this.onChangeTipoDoc}
                                    component={[
                                        <Option key={0} value='S'>Seleccionar</Option>,
                                        <Option key={1} value='P'>PDF</Option>,
                                        <Option key={2} value='E'>Excel</Option>
                                    ]}
                                    className='cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12'
                                />
                                <input type='hidden' value={this.state.doctype} name='doctype' />
                            </div>
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button
                                        title='Limpiar'
                                        type='primary'
                                        onClick={this.limpiar}
                                    />
                                    <C_Button
                                        title='Generar Reporte'
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

export default IndexLibroDiario;

