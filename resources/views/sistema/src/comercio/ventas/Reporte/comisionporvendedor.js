
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message, Select } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import CDatePicker from '../../../componentes/datepicker';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_Input from '../../../componentes/data/input';
import C_Button from '../../../componentes/data/button';
const { Option } = Select;

export default class Reporte_Comision_Por_Vendedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            usuario: '',
            fkidgrupo: 0,

            fechainicio: '',
            fechafinal: '',

            redirect: false,
            exportar: 'N',
            ordenarPor: 1,

            idcliente: '',
            cliente: '',

            idvendedor: '',
            vendedor: '',

            noSesion: false,
            config: [
                {
                    comventasventaalcredito: false,
                    comtaller: false,
                },
            ],
            configTitleVend: '',
            codigoPropios: true,
        }
    }

    componentDidMount() {

        this.getConfigsClient();
        let key = JSON.parse(readData(keysStorage.user));
        var idgrupo = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        var usuario = (typeof key == 'undefined' || key == null)?'':
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        this.setState({
            fkidgrupo: (idgrupo == null)?0:idgrupo,
            usuario: (idgrupo > 2)?usuario:'',
            configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
        });
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    codigoPropios: result.configcliente.codigospropios,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onChangeVendedorVenta(event) {
        this.setState({
            vendedor: event.target.value,
        });
    }

    onChangeIdVendedor(value) {
        this.setState({
            idvendedor: value,
        });
    }

    onChangeVendedor(value) {
        this.setState({
            vendedor: value,
        });
    }

    onChangeIdCliente(value) {
        this.setState({
            idcliente: value,
        });
    }

    onChangeCliente(value) {
        this.setState({
            cliente: value,
        });
    }

    onChangeFechaInicio(date) {
        if (date == '') {
            this.setState({
                fechainicio: '',
                fechafinal: '',
            });
        }else {
            this.setState({
                fechainicio: date,
            });
        }
    }
    onChangeFechaFinal(date) {
        if (date == '') {
            this.setState({
                fechafinal: '',
            });
        }else {
            if (date >= this.state.fechainicio) {
                this.setState({
                    fechafinal: date,
                });
            }else {
                message.error('Fecha incorrecta');
            }
        }
    }

    limpiarDatos() {
        this.setState({
            exportar: 'N',
            ordenarPor: 1,

            idcliente: '',
            cliente: '',

            idvendedor: '',
            vendedor: '',

            fechainicio: '',
            fechafinal: '',
        });
    }

    onChangeExportar(value) {
        this.setState({
            exportar: value,
        });
    }

    onChangeOrdenarPor(value) {
        this.setState({
            ordenarPor: value,
        });
    }

    componentvendedoradmin() {

        if (this.state.fkidgrupo == 1 || this.state.fkidgrupo == 2) {
            return (
                <C_Input 
                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                    value={this.state.vendedor}
                    title={' ' + this.state.configTitleVend}
                    onChange={this.onChangeVendedor.bind(this)}
                />
            );
        }
        return (
            <C_Input 
                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                value={this.state.usuario}
                title={' ' + this.state.configTitleVend}
                onChange={this.onChangeVendedor.bind(this)}
                readOnly={true}
            />
        );
        
    }

    render() {

        const componentvendedoradmin = this.componentvendedoradmin();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;

        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to={routes.venta_index} />)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        let isAbogado = (readData(keysStorage.isabogado) == null) ? 'V' : readData(keysStorage.isabogado);
        let cliente_Abogado = (isAbogado == 'A') ? 'Abogado' : 'Vendedor';

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Reporte Comision por {cliente_Abogado}</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form action={routes.reporte_comision_vendedor_generar} target="_blank" method="post">

                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />

                            <input type="hidden" value={usuario} name="usuario" />
                            <input type="hidden" value={idusuario} name="idusuario" />
                            <input type="hidden" value={this.state.fkidgrupo} name="fkidgrupo" />

                            <input type="hidden" value={cliente_Abogado} name="cliente_abogado" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <C_Input 
                                    value={this.state.configTitleVend + ': '}
                                    readOnly={true}
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{'border': '2px solid transparent', 'background': 'transparent'}}
                                />
                                <C_Input 
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.idvendedor}
                                    title={
                                        (this.state.codigoPropios)?'Codigo':'Id'
                                    }
                                    onChange={this.onChangeIdVendedor.bind(this)}
                                />
                                <input type="hidden" name="idvendedor" value={this.state.idvendedor} />
                                
                                {componentvendedoradmin}
                                
                                <input type="hidden" name="vendedor" value={this.state.vendedor} />
                                <input type="hidden" name="codorid" value={(this.state.codigoPropios)?'1':'0'} />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Cliente: '}
                                    readOnly={true}
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{'border': '2px solid transparent', 'background': 'transparent'}}
                                />
                                <C_Input 
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.idcliente}
                                    title={
                                        (this.state.codigoPropios)?'Codigo':'Id'
                                    }
                                    onChange={this.onChangeIdCliente.bind(this)}
                                />
                                <input type="hidden" name="idcliente" value={this.state.idcliente} />
                                
                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.cliente}
                                    title='Cliente'
                                    onChange={this.onChangeCliente.bind(this)}
                                />
                                <input type="hidden" name="cliente" value={this.state.cliente} />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    value='Fecha de Venta desde'
                                    readOnly={true}
                                    style={{'border': '2px solid transparent', 'background': 'transparent'}}
                                />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechainicio}
                                    onChange={this.onChangeFechaInicio.bind(this)}
                                    title='Fecha Inicio'
                                />
                                <input type="hidden" name="fechainicio" value={this.state.fechainicio} />
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.fechafinal}
                                    onChange={this.onChangeFechaFinal.bind(this)}
                                    title='Fecha Final'
                                    readOnly={
                                        (this.state.fechainicio == '')?true:false
                                    }
                                />
                                <input type="hidden" name="fechafinal" value={this.state.fechafinal} />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>

                                <C_Select 
                                    value={this.state.ordenarPor}
                                    title='Ordenar Por'
                                    onChange={this.onChangeOrdenarPor.bind(this)}
                                    component={[
                                        <Option key={0} value={1}> Id {cliente_Abogado} </Option>,
                                        <Option key={1} value={2}> Cod Vendedor </Option>,
                                        <Option key={2} value={3}> {this.state.configTitleVend} </Option>,
                                        <Option key={3} value={4}> Cliente </Option>,
                                        <Option key={4} value={5}> Monto Total </Option>,
                                    ]}
                                />
                                <input type="hidden" name="order" value={this.state.ordenarPor} />
                                
                                <C_Select 
                                    value={this.state.exportar}
                                    onChange={this.onChangeExportar.bind(this)}
                                    title='Exportar'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" name="reporte" value={this.state.exportar} />

                            </div>

                            <div className="forms-groups"
                                style={{'marginBottom': '-10px'}}>
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