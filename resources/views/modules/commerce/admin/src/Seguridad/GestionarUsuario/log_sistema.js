
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { message, Select } from 'antd';
import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import C_Input from '../../../components/data/input';
import C_DatePicker from '../../../components/data/date';
import C_Select from '../../../components/data/select';
import keysStorage from '../../../tools/keysStorage';
import { dateToString, hourToString } from '../../../tools/toolsDate';
import C_Button from '../../../components/data/button';
const { Option } = Select;

export default class Log_Del_Sistema extends Component{

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            usuario: '',
            fechainicio: '',
            fechafinal: '',

            ordenarPor: 1,
            exportar: 'N',

            redirect: false,
            noSesion: false,
        }
    }

    componentDidMount() {
        
    }

    onChangeLogin(event) {
        this.setState({
            login: event,
        });
    }
    onChangeUsuario(event) {
        this.setState({
            usuario: event,
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

    onChangeOrdenarPor(event) {
        this.setState({
            ordenarPor: event,
        });
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }
    limpiarDatos() {
        this.setState({
            login: '',
            usuario: '',

            fechainicio: '',
            fechafinal: '',

            ordenarPor: 1,
            exportar: 'N',
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        const token = readData(keysStorage.token);
        const x_idusuario =  ((key == null) || (typeof key == 'undefined')) ? 0 : key.idusuario;
        const x_grupousuario = ((key == null) || (typeof key == 'undefined')) ? 0 : key.idgrupousuario;
        const x_login = ((key == null) || (typeof key == 'undefined')) ? null : key.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);

        return (
            <div className="rows">
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte de Log de Sistema</h1>
                    </div>

                    <div className="forms-groups">

                        <form action="/commerce/admin/log_del_sistema/generar" target="_blank" method="post">

                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />

                            <input type="hidden" value={usuario} name="user" />
                            <input type="hidden" value={idusuario} name="idusuario" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    value={'Usuario: '}
                                    readOnly={true}
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    style={{'border': '2px solid transparent', 'background': 'transparent'}}
                                />
                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.login}
                                    title='Login'
                                    onChange={this.onChangeLogin.bind(this)}
                                />
                                <input type="hidden" name="login" value={this.state.login} />
                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.usuario}
                                    title='Nombre Usuario'
                                    onChange={this.onChangeUsuario.bind(this)}
                                />
                                <input type="hidden" name="usuario" value={this.state.usuario} />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{'paddingLeft': 0}}
                            >
                                <C_Input
                                    value={'Fecha: '}
                                    readOnly={true}
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
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
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{'paddingLeft': 0}}
                            >
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Select
                                    value={this.state.ordenarPor}
                                    title='Ordenar Por'
                                    onChange={this.onChangeOrdenarPor.bind(this)}
                                    component={[
                                        <Option key={0} value={1}> Id Log </Option>,
                                        <Option key={1} value={2}> Id Usuario </Option>,
                                        <Option key={2} value={3}> Login </Option>,
                                        <Option key={3} value={4}> Nombre Usuario </Option>,
                                        <Option key={4} value={5}> Fecha </Option>,
                                    ]}
                                />
                                <input type="hidden" name="ordenar" value={this.state.ordenarPor} />
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
                                <input type="hidden" name="exportar" value={this.state.exportar} />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                style={{'paddingLeft': 0}}
                            >
                                <div className="text-center-content">
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