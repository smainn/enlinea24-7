
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import Select from '../../../components/select';
import { readData, httpRequest, removeAllData } from '../../../tools/toolsStorage';
import keysStorage from '../../../tools/keysStorage';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import CDatePicker from '../../../components/datepicker';
import { dateToString, hourToString } from '../../../tools/toolsDate';
import C_Button from '../../../components/data/button';
import C_Input from '../../../components/data/input';


export default class Reporte_Por_Cobrar extends Component{

    constructor(props) {
        super(props);
        this.state = {
            fkidgrupo: 0,
            usuario: '',

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
        
        let key = JSON.parse(readData(keysStorage.user));
        var idgrupo = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        var usuario = (typeof key == 'undefined' || key == null)?'':
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        
        this.setState({
            fkidgrupo: (idgrupo == null)?0:idgrupo,
            usuario: (idgrupo > 2)?usuario:'',
        });

        this.getConfigsClient();
        this.verificarSesion();
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
        })
    }

    onClickAtras() {
        this.props.history.push('/commerce/admin/venta/index');
    }

    onChangeFechaInicioVenta(date, dateString) {
        if (dateString.toString().length == 0) {
            this.setState({
                fechaInicioVenta: '',
                fechaFinVenta: '',
            });
        }else {
            if (dateString > this.state.fechaFinVenta) {
                this.setState({
                    fechaInicioVenta: dateString,
                    fechaFinVenta: '',
                });
            }else {
                this.setState({
                    fechaInicioVenta: dateString,
                });
            }
        }
    }

    onChangeFechaFinVenta(date, dateString) {

        if (this.state.fechaInicioVenta.toString().length > 0) {
            if (dateString >= this.state.fechaInicioVenta) {
                this.setState({
                    fechaFinVenta: dateString
                });
            }else {
                message.warning('Fecha Final invalido');
            }
        }else {
            message.error('Favor de introducir fecha Inicio');
        }
        
    }

    onChangeFechaInicioCuota(date, dateString) {
        if (dateString.toString().length == 0) {
            this.setState({
                fechaInicioCuota: '',
                fechaFinCuota: '',
            });
        }else {
            if (dateString > this.state.fechaFinCuota) {
                this.setState({
                    fechaInicioCuota: dateString,
                    fechaFinCuota: '',
                });
            }else {
                this.setState({
                    fechaInicioCuota: dateString,
                });
            }
        }
    }

    onChangeFechaFinCuota(date, dateString) {
        if (this.state.fechaInicioCuota.toString().length > 0) {
            if (dateString >= this.state.fechaInicioCuota) {
                this.setState({
                    fechaFinCuota: dateString,
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
            cliente: event,
        });
    }

    onChangeVendedor(event) {
        this.setState({
            Vendedor: event,
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
        if (!isNaN(event)) {
            this.setState({
                montoInicial: event,
            });
        }
    }

    onChangeMontoFinal(event) {
        if (!isNaN(event)) {
            this.setState({
                montoFinal: event,
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

    componentvendedoradmin() {

        if (this.state.fkidgrupo == 1 || this.state.fkidgrupo == 2) {
            return (
                <C_Input value={this.state.Vendedor}
                    onChange={this.onChangeVendedor.bind(this)}
                    title={this.state.configTitleVend}
                    className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom'
                />
            );
        }
        return (
            <C_Input value={this.state.usuario}
                onChange={this.onChangeVendedor.bind(this)}
                title={this.state.configTitleVend}
                readOnly={true}
                className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom'
            />
        );
        
    }

    render(){

        const componentvendedoradmin = this.componentvendedoradmin();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

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
                        <h1 className="lbls-title">REPORTE DE CUENTAS POR COBRAR</h1>
                    </div>
                </div>

                <div className="cards">

                    <form action="/commerce/admin/generar-reporte-por-cobrar" target="_blank" method="post">
                        
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
                                    <CDatePicker
                                        allowClear={true}
                                        value={this.state.fechaInicioVenta}
                                        onChange={this.onChangeFechaInicioVenta.bind(this)}
                                        title="Fecha Inicio"
                                    />
                                    <input type="hidden" value={this.state.fechaInicioVenta} name="fechainicioVenta" />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    <CDatePicker
                                        allowClear={true}
                                        value={this.state.fechaFinVenta}
                                        onChange={this.onChangeFechaFinVenta.bind(this)}
                                        title="Fecha Final"
                                        readOnly={
                                            (this.state.fechaInicioVenta == '')?true:false
                                        }
                                    />
                                    <input type="hidden" value={this.state.fechaFinVenta} name="fechafinventa" />
                                </div>
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Fecha de Cuotas'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <CDatePicker
                                        allowClear={true}
                                        value={this.state.fechaInicioCuota}
                                        onChange={this.onChangeFechaInicioCuota.bind(this)}
                                        title="Fecha Inicio"
                                    />
                                    <input type="hidden" value={this.state.fechaInicioCuota} name="fechainiciocuota" />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <CDatePicker
                                        allowClear={true}
                                        value={this.state.fechaFinCuota}
                                        onChange={this.onChangeFechaFinCuota.bind(this)}
                                        title="Fecha Fin"
                                        readOnly={
                                            (this.state.fechaInicioCuota == '')?true:false
                                        }
                                    />
                                    <input type="hidden" value={this.state.fechaFinCuota} name="fechafincuota" />

                                </div>
                                    
                            </div>
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12 pt-bottom"
                                    onChange={this.onChangeCliente.bind(this)}
                                    value={this.state.cliente}
                                    title='Cliente'
                                />
                                <input type="hidden" value={this.state.cliente} name="cliente" />

                                {componentvendedoradmin}
                                <input type="hidden" value={this.state.Vendedor} name="vendedor" />
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Monto a Cobrar'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">

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
                            
                                <C_Input 
                                    value={this.state.montoInicial} 
                                    onChange={this.onChangeMontoInicial.bind(this)}
                                    readOnly={(this.state.opcion != '')?false:true}
                                    title='Monto Inicial'
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12"
                                />
                                <input type="hidden" value={this.state.montoInicial} name="montoinicial" />

                                <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>
                                <C_Input title='Monto Final'
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12"
                                    value={this.state.montoFinal} 
                                    onChange={this.onChangeMontoFinal.bind(this)}
                                    readOnly={(this.state.opcion == '!')?false:true}
                                />
                                <input type="hidden" value={this.state.montoFinal} name="montofinal" />
                                
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
                                                {   value: 1, title: 'id Venta'},
                                                {   value: 2, title: 'Fecha Venta'},
                                                {   value: 3, title: 'Cliente'},
                                                {   value: 4, title: this.state.configTitleVend},
                                                {   value: 5, title: 'Fecha Vencimiento'},
                                                {   value: 6, title: 'Monto'}
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
                                        title='Limpiar'
                                        type='primary'
                                        onClick={this.onClickLimpiar.bind(this)}
                                    />
                                    <C_Button
                                        title='Generar'
                                        type='primary'
                                        submit={true}
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



