
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

export default class Reporte_Compra extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            idcompra: '',
            tipocompra: '',
            fechainicio: '',
            fechafin: '',
            idsucursal: '',
            idalmacen: '',
            idmoneda: '',
            proveedor: '',
            ordenar: 1,
            exportar: 'N',
            array_sucursal: [],
            array_almacen: [],
            array_moneda: [],
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
        httpRequest('get', ws.wscompra + '/reporte')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_sucursal: result.sucursal,
                    array_moneda: result.moneda,
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
                fechafin: '',
                fechainicio: event,
            });
        }else {
            if (event <= this.state.fechafin) {
                this.setState({
                    fechainicio: event,
                });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
    }
    onChangeFechaFinal(event) {
        if (event == '') {
            this.setState({
                fechafin: '',
            });
        }else {
            if (event >= this.state.fechainicio) {
                this.setState({
                    fechafin: event,
                });
            }else {
                message.error('Fecha Final no puede ser menor que la Fecha Inicio');
            }
        }
    }
    getAlmacen(value) {
        var body = {
            idsucursal: value,
        };
        httpRequest('post', ws.wssucursal + '/get_almacen', body)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_almacen: result.almacen,
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
    onchangeSucursal(value) {
        this.setState({
            idsucursal: value,
            idalmacen: '',
        });
        if (value != '') {
            this.getAlmacen(value);
        }
    }
    commponentSucursal() {
        let data = this.state.array_sucursal;
        let arr = [
            <Option key={-1} value={''}>
                {'Seleccionar ... '}
            </Option>
        ];
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
        let arr = [
            <Option key={-1} value={''}>
                {'Seleccionar ... '}
            </Option>
        ];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idalmacen}>
                    { data[i].descripcion }
                </Option>
            );
        }
        return arr;
    }
    componentMoneda() {
        let data = this.state.array_moneda;
        let arr = [
            <Option key={-1} value={''}>
                {'Seleccionar ... '}
            </Option>
        ];
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <Option key={i} value={data[i].idmoneda}>
                    { data[i].descripcion }
                </Option>
            );
        }
        return arr;
    }
    limpiarDatos() {
        this.setState({
            idcompra: '',
            tipocompra: '',
            fechainicio: dateToString(new Date(), 'f2'),
            fechafin: '',
            idsucursal: '',
            idalmacen: '',
            idmoneda: '',
            proveedor: '',
            ordenar: 1,
            exportar: 'N',
            array_almacen: [],
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
                                REPORTE COMPRA
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <form action={routes.reporte_compra_generar} target="_blank" method="post">

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
                                    value={this.state.idcompra}
                                    title={ this.state.config_codigo ? 'Cod Compra' : 'ID Compra'}
                                    onChange={(value) => this.setState({idcompra: value,})}
                                />
                                <input type="hidden" value={this.state.idcompra} name="idcompra" />
                                <input type="hidden" value={this.state.config_codigo ? 'A' : 'N'} name="config_codigo" />
                                <C_Select
                                    value={this.state.tipocompra}
                                    title='Tipo Compra'
                                    onChange={(value) => this.setState({tipocompra: value,})}
                                    component={[
                                        <Option key={1} value={''}>
                                            {'Seleccionar ... '}
                                        </Option>,
                                        <Option key={2} value={'C'}>
                                            {'CONTADO'}
                                        </Option>,
                                        <Option key={2} value={'R'}>
                                            {'CREDITO'}
                                        </Option>
                                    ]}
                                />
                                <input type="hidden" value={this.state.tipocompra} name="tipocompra" />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechainicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title="Fecha Inicio"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechainicio)} name="fechainicio" />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechafin}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title="Fecha Final"
                                />
                                <input type="hidden" value={convertDmyToYmd(this.state.fechafin)} name="fechafin" />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Select
                                    value={this.state.idsucursal}
                                    title='Sucursal'
                                    onChange={this.onchangeSucursal.bind(this)}
                                    permisions={this.permission.sucursal}
                                    component={this.commponentSucursal()}
                                />
                                <input type="hidden" value={this.state.idsucursal} name="idsucursal"/>
                                <C_Select
                                    value={this.state.idalmacen}
                                    title='Almacen'
                                    onChange={(value) => this.setState({idalmacen: value,})}
                                    permisions={this.permission.almacen}
                                    component={this.componentAlmacen()}
                                    readOnly={this.state.idsucursal == '' ? true : false}
                                />
                                <input type="hidden" value={this.state.idalmacen} name="idalmacen"/>
                                <C_Select
                                    value={this.state.idmoneda}
                                    title='Moneda'
                                    onChange={(value) => this.setState({idmoneda: value,})}
                                    permisions={this.permission.moneda}
                                    component={this.componentMoneda()}
                                />
                                <input type="hidden" value={this.state.idmoneda} name="idmoneda"/>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Proveedor'
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
                                        <Option key={0} value={1}> ID COMPRA </Option>,
                                        <Option key={1} value={2}> TIPO COMPRA </Option>,
                                        <Option key={2} value={3}> FECHA </Option>,
                                        <Option key={3} value={4}> PROVEEDOR </Option>,
                                        // <Option key={6} value={7}> MONEDA </Option>,
                                        // <Option key={5} value={6}> SUCURSAL </Option>,
                                        // <Option key={6} value={7}> ALMACEN </Option>,
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