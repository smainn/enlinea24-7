
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message, Select, notification } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import { dateToString, hourToString, convertDmyToYmd } from '../../../utils/toolsDate';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
const { Option } = Select;

export default class Reporte_CompraCuentaPorPagar extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            fechainicio: '',
            fechafin: '',
            fechainiciocuota: '',
            fechafincuota: '',
            codidproveedor: '',
            proveedor: '',
            ordenar: 1,
            exportar: 'N',
            config_codigo: true,
            noSesion: false,
        }
        this.permission = {
            sucursal: readPermisions(keys.compra_select_sucursal),
            almacen: readPermisions(keys.compra_select_almacen),
            moneda: readPermisions(keys.compra_select_moneda),
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wspagos + '/reporte_cuentaporpagar')
        .then((result) => {
            console.log(result)
            if (result.response == 1) {
                this.setState({
                    config_codigo: result.configscliente.codigospropios,
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
    onChangeFechaInicio(event) {
        if (event == '' || this.state.fechafin == '') {
            this.setState({
                fechafin: '', fechainicio: event,
            });
        }else {
            if (event <= this.state.fechafin) {
                this.setState({ fechainicio: event, });
            }else {
                message.error('FECHA INCICIO no puede ser mayor a FECHA FINAL');
            }
        }
    }
    onChangeFechaFinal(event) {
        if (event == '') {
            this.setState({ fechafin: '', });
        }else {
            if (event >= this.state.fechainicio) {
                this.setState({ fechafin: event, });
            }else {
                message.error('FECHA FINAL no puede ser menor a FECHA INICIO');
            }
        }
    }
    onChangeFechaInicioCuota(event) {
        if (event == '' || this.state.fechafincuota == '') {
            this.setState({
                fechafincuota: '', fechainiciocuota: event,
            });
        }else {
            if (event <= this.state.fechafincuota) {
                this.setState({ fechainiciocuota: event, });
            }else {
                message.error('FECHA INCICIO no puede ser mayor a FECHA FINAL');
            }
        }
    }
    onChangeFechaFinalCuota(event) {
        if (event == '') {
            this.setState({ fechafincuota: '', });
        }else {
            if (event >= this.state.fechainiciocuota) {
                this.setState({ fechafincuota: event, });
            }else {
                message.error('FECHA FINAL no puede ser menor a FECHA INICIO');
            }
        }
    }
    limpiarDatos() {
        this.setState({
            fechainicio: '',
            fechafin: '',
            fechainiciocuota: '',
            fechafincuota: '',
            codidproveedor: '',
            proveedor: '',
            ordenar: 1,
            exportar: 'N',
        });
    }
    render() {

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

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">
                                REPORTE CUENTAS POR PAGAR
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <form action={routes.reporte_cuentaporpagar_generar} target="_blank" method="post">

                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={conexion} name="x_conexion" />
                            <input type="hidden" value={usuario} name="usuario" />

                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={token} name="authorization" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'FECHA COMPRA'} 
                                    readOnly={true}
                                    style={{ fontSize: 12, background: 'white', }}
                                />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechainicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Inicio"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechainicio)} name="fechainicio" />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechafin}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    readOnly={this.state.fechainicio == '' ? true : false}
                                    title="Final"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechafin)} name="fechafin" />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'FECHA VENCIMIENTO CUOTA'} 
                                    readOnly={true}
                                    style={{ fontSize: 12, background: 'white', }}
                                />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechainiciocuota}
                                    onChange={this.onChangeFechaInicioCuota.bind(this)}
                                    title="Inicio"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechainiciocuota)} name="fechainiciocuota" />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechafincuota}
                                    onChange={this.onChangeFechaFinalCuota.bind(this)}
                                    readOnly={this.state.fechainiciocuota == '' ? true : false}
                                    title="Final"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechafincuota)} name="fechafincuota" />
                            </div>
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'PROVEEDOR'} 
                                    readOnly={true}
                                    style={{ fontSize: 12, background: 'white', }}
                                />
                                <C_Input 
                                    value={this.state.codidproveedor}
                                    style={{ fontSize: 12, }}
                                    onChange={ (value) => this.setState({ codidproveedor: value, }) }
                                    title={this.state.config_codigo ? 'Codigo' : 'ID'}
                                />
                                <input type="hidden" value={this.state.codidproveedor} name="codidproveedor"/>
                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Nombre'
                                    value={this.state.proveedor} 
                                    onChange={(value) => this.setState({proveedor: value,})}
                                />
                                <input type="hidden" value={this.state.proveedor} name="proveedor"/>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Select 
                                    value={this.state.ordenar}
                                    title='Ordenar Por'
                                    onChange={(value) => this.setState({ordenar: value,})}
                                    component={[
                                        <Option key={0} value={1}> ID PAGO </Option>,
                                        <Option key={1} value={2}> FECHA COMPRA </Option>,
                                        <Option key={2} value={3}> FECHA CUOTA  </Option>,
                                        <Option key={3} value={4}> PROVEEDOR  </Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenar} name="ordenar" />
                                <C_Select 
                                    value={this.state.exportar}
                                    onChange={(value) => this.setState({exportar: value,})}
                                    title='Exportar'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" name="exportar" value={this.state.exportar} />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button
                                        title='Limpiar'
                                        type='primary'
                                        onClick={this.limpiarDatos.bind(this)}
                                    />
                                    <C_Button
                                        title='Generar'
                                        type='primary'
                                        submit={true}
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