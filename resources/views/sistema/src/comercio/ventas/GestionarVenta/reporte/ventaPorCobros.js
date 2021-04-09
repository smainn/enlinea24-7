
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import axios from 'axios';
import Input from '../../../../componentes/input';
import Select from '../../../../componentes/select';
import { readData, httpRequest, removeAllData } from '../../../../utils/toolsStorage';
import keysStorage from '../../../../utils/keysStorage';
import ws from '../../../../utils/webservices';
import routes from '../../../../utils/routes';
import { dateToString, hourToString } from '../../../../utils/toolsDate';
import strings from '../../../../utils/strings';
import C_Button from '../../../../componentes/data/button';

export default class ReporteVentaPorCobrosRealizados extends Component{

    constructor(props) {
        super(props);
        this.state = {
            fechaInicioVenta: '',
            fechaFinVenta: '',

            fechaInicioCuota: '',
            fechaFinCuota: '',

            cliente: '',
            Vendedor: '',

            opcion: '',
            opcionEntre: false,
            montoInicial: '',
            montoFinal: '',

            ordenar: 1,
            exportar: 1,
            noSesion: false,
            configTitleVend: ''
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        this.verificarSesion()
    }

    getConfigsClient() {
            
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor'
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    verificarSesion() {                
        let user = JSON.parse(readData(keysStorage.user));
        let token = readData(keysStorage.token);
        httpRequest('post', ws.wsverificarsesion,{
            id: user.idusuario,
            token: token
        })
        .then((result) => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onClickAtras() {
        this.props.history.push(routes.venta_index);
    }

    onChangeFechaInicioVenta(event) {
        if (event.toString().length == 0) {
            this.setState({
                fechaInicioVenta: '',
                fechaFinVenta: '',
            });
        }else {
            if (event > this.state.fechaFinVenta) {
                this.setState({
                    fechaInicioVenta: event,
                    fechaFinVenta: '',
                });
            }else {
                this.setState({
                    fechaInicioVenta: event,
                });
            }
        }
    }

    onChangeFechaFinVenta(event) {
        if (this.state.fechaInicioVenta.toString().length > 0) {
            if (event >= this.state.fechaInicioVenta) {
                this.setState({
                    fechaFinVenta: event
                });
            }else {
                message.warning('Fecha Final invalido');
            }
        }else {
            message.error('Favor de introducir fecha Inicio');
        }
        
    }

    onChangeFechaInicioCuota(event) {
        if (event.toString().length == 0) {
            this.setState({
                fechaInicioCuota: '',
                fechaFinCuota: '',
            });
        }else {
            if (event > this.state.fechaFinCuota) {
                this.setState({
                    fechaInicioCuota: event,
                    fechaFinCuota: '',
                });
            }else {
                this.setState({
                    fechaInicioCuota: event,
                });
            }
        }
    }

    onChangeFechaFinCuota(event) {
        if (this.state.fechaInicioCuota.toString().length > 0) {
            if (event >= this.state.fechaInicioCuota) {
                this.setState({
                    fechaFinCuota: event,
                });
            }else {
                message.warning('Fecha Final invalido');
            }
        }else {
            message.error('Favor de introducir fecha Inicio');
        }
    }

    onChangeCliente(event) {
        this.setState({
            cliente: event.target.value,
        });
    }

    onChangeVendedor(event) {
        this.setState({
            Vendedor: event.target.value,
        });
    }

    onChangeOpcion(event) {
        if (event == '!') {
            this.setState({
                opcion: event,
                opcionEntre: true,
            });
        }else {
            this.setState({
                opcion: event,
                opcionEntre: false,
                montoFinal: '',
            });
        }
        
    }

    onChangeMontoInicial(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                montoInicial: event.target.value,
            });
        }
    }

    onChangeMontoFinal(event) {
        if (!isNaN(event.target.value)) {
            this.setState({
                montoFinal: event.target.value,
            });
        }
    }

    onChangeOrdenar(event) {
        this.setState({
            ordenar: event,
        });
    }

    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }

    onClickLimpiar() {
        this.setState({
            fechaInicioVenta: '',
            fechaFinVenta: '',

            fechaInicioCuota: '',
            fechaFinCuota: '',

            cliente: '',
            Vendedor: '',

            opcion: '',
            opcionEntre: false,
            montoInicial: '',
            montoFinal: '',

            ordenar: 1,
            exportar: 1,
        });
    }

    render(){
        let conexion = readData(keysStorage.connection);
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ?  null : 
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);

        return (
            <div className="rows">

                <div className="cards" style={{'marginBottom': '8px'}}>

                    <div className="pulls-left">
                        <h1 className="lbls-title">REPORTE DE COBROS REALIZADOS</h1>
                    </div>
                    <div className="pulls-right">
                        <a onClick={this.onClickAtras.bind(this)} className="btns btns-primary">
                            Atras
                        </a>
                    </div>
                </div>

                <div className="cards">

                    <form action={routes.reporte_venta_por_cobros_generar} target="_blank" method="post">

                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />

                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={conexion} name="x_conexion" />
                        <div className="forms-group">

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Fecha de Venta'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <Input 
                                        type="date"
                                        value={this.state.fechaInicioVenta}
                                        title='Fecha Inicio*'
                                        onChange={this.onChangeFechaInicioVenta.bind(this)}
                                    />
                                    <input type="hidden" value={this.state.fechaInicioVenta} name="fechainicioVenta" />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <Input 
                                        type="date"
                                        value={this.state.fechaFinVenta}
                                        title='Fecha Final*'
                                        onChange={this.onChangeFechaFinVenta.bind(this)}
                                    />
                                    <input type="hidden" value={this.state.fechaFinVenta} name="fechafinventa" />
                                </div>
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Fecha de Cobros'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <Input 
                                        type="date"
                                        value={this.state.fechaInicioCuota}
                                        title='Fecha Inicio*'
                                        onChange={this.onChangeFechaInicioCuota.bind(this)}
                                    />
                                    <input type="hidden" value={this.state.fechaInicioCuota} name="fechainiciocuota" />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <Input 
                                        type="date"
                                        value={this.state.fechaFinCuota}
                                        title='Fecha Fin*'
                                        onChange={this.onChangeFechaFinCuota.bind(this)}
                                    />
                                    <input type="hidden" value={this.state.fechaFinCuota} name="fechafincuota" />

                                </div>
                                    
                            </div>
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input
                                            type="text" value={this.state.cliente}
                                            onChange={this.onChangeCliente.bind(this)}
                                            className="forms-control" 
                                            placeholder='Ingresar nombre del cliente...'
                                        />
                                        <label className="lbls-input active">Cliente</label>
                                    </div>
                                    <input type="hidden" value={this.state.cliente} name="cliente" />
                                </div>

                                <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input
                                            type="text" value={this.state.Vendedor}
                                            onChange={this.onChangeVendedor.bind(this)}
                                            className="forms-control" 
                                            placeholder={'Ingresar nombre del ' + this.state.configTitleVend + '...'}
                                        />
                                        <label className="lbls-input active">{this.state.configTitleVend}</label>
                                    </div>
                                    <input type="hidden" value={this.state.Vendedor} name="vendedor" />
                                </div>
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Monto Cobrado'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <Select 
                                        value={this.state.opcion}
                                        title='Opciones*'
                                        onChange={this.onChangeOpcion.bind(this)}
                                        data={[
                                            {   value: '', title: 'Seleccionar'},
                                            {   value: '<', title: 'Menor'},
                                            {   value: '<=', title: 'Menor igual'},
                                            {   value: '>', title: 'Mayor'},
                                            {   value: '>=', title: 'Mayor igual'},
                                            {   value: '<>', title: 'Distinto'},
                                            {   value: '=', title: 'Igual'},
                                            {   value: '!', title: 'Entre'}
                                        ]}
                                    />
                                    <input type="hidden" value={this.state.opcion} name="opcion" />
                                </div>
                            
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type="text"
                                            value={this.state.montoInicial} 
                                            onChange={this.onChangeMontoInicial.bind(this)}
                                            className={(this.state.opcion != '')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            placeholder='Ingresar monto...'
                                            readOnly={(this.state.opcion != '')?false:true}
                                        />
                                        <label style={{'color': (this.state.opcion != '')?'#4476FA':'#e8e8e8'}}
                                            className='lbls-input active'>
                                            Monto Inicial
                                        </label>
                                    </div>
                                    <input type="hidden" value={this.state.montoInicial} name="montoinicial" />
                                </div>

                                {(this.state.opcionEntre)?
                                    <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text"
                                                value={this.state.montoFinal} 
                                                onChange={this.onChangeMontoFinal.bind(this)}
                                                className={(this.state.opcion != '')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                                placeholder='Ingresar monto...'
                                                readOnly={(this.state.opcion != '')?false:true}
                                            />
                                            <label style={{'color': (this.state.opcion != '')?'#4476FA':'#e8e8e8'}}
                                                className='lbls-input active'>
                                                Monto Final
                                            </label>
                                        </div>
                                        <input type="hidden" value={this.state.montoFinal} name="montofinal" />
                                    </div>:''
                                }
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">

                                    <div className="cols-lg-6 cols-md-6 cols-sm-6"></div>

                                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">

                                        <Select 
                                            value={this.state.ordenar}
                                            title='Ordenar Por*'
                                            onChange={this.onChangeOrdenar.bind(this)}
                                            data={[
                                                {   value: 1, title: 'id Cobro'},
                                                {   value: 2, title: 'Fecha de Cobro'},
                                                {   value: 3, title: 'Cliente'},
                                                {   value: 4, title: this.state.configTitleVend},
                                                {   value: 5, title: 'Id Venta'},
                                                {   value: 6, title: 'Fecha a cobrar'},
                                                {   value: 7, title: 'Nro Cuota'},
                                                {   value: 8, title: 'Monto Cobrado'},
                                                {   value: 9, title: 'Monto a Cobrar'}
                                            ]}
                                        />
                                        <input type="hidden" value={this.state.ordenar} name="ordenar" />
                                    </div>
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">

                                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">

                                        <Select 
                                            value={this.state.exportar}
                                            title='Exportar a*'
                                            onChange={this.onChangeExportar.bind(this)}
                                            data={[
                                                {   value: 1, title: 'Seleccionar'},
                                                {   value: 2, title: 'PDF'},
                                                {   value: 3, title: 'Excel'}
                                            ]}
                                        />
                                        <input type="hidden" value={this.state.exportar} name="exportar" />
                                    </div>
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'textAlign': 'center'}}>
                                    <C_Button
                                        title="Limpiar"
                                        type="primary"
                                        onClick={this.onClickLimpiar.bind(this)}
                                    />
                                    <C_Button
                                        title="Cancelar"
                                        type="primary"
                                        onClick={this.onClickAtras.bind(this)}
                                    />
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}



