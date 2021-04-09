
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { readData, httpRequest, removeAllData } from '../../../utils/toolsStorage';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_DatePicker from '../../../componentes/data/date';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import { message, Select } from 'antd';
import 'antd/dist/antd.css';
import C_Button from '../../../componentes/data/button';
const {Option} = Select;

export default class Reporte_Venta_Cobro extends Component{

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

            ordenar: '1',
            exportar: '1',
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
            usuario: (idgrupo == 3)?usuario:'',
        });

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

            ordenar: '1',
            exportar: '1',
        });
    }

    componentvendedoradmin() {
        if (this.state.fkidgrupo != 3) {
            return (
                <C_Input 
                    className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                    value={this.state.Vendedor}
                    onChange={this.onChangeVendedor.bind(this)}
                    title={this.state.configTitleVend}
                />
            );
        }
        return (
            <C_Input 
                className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                value={this.state.usuario}
                onChange={this.onChangeVendedor.bind(this)}
                title={this.state.configTitleVend}
                readOnly={true}
            />
        );
        
    }

    render(){

        const componentvendedoradmin = this.componentvendedoradmin();

        let key = JSON.parse(readData(keysStorage.user));
        const idusuario = ((key == null) || (typeof key == 'undefined'))?null:key.idusuario;
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        let conexion = readData(keysStorage.connection);

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
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">

                <div className="cards" style={{'marginBottom': '8px'}}>

                    <div className="pulls-left">
                        <h1 className="lbls-title">REPORTE DE COBROS REALIZADOS</h1>
                    </div>
                </div>

                <div className="cards">

                    <form action={routes.reporte_venta_por_cobros_generar} target="_blank" method="post">
                        
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

                                <C_DatePicker 
                                    value={this.state.fechaInicioVenta}
                                    title='Fecha Inicio*'
                                    onChange={this.onChangeFechaInicioVenta.bind(this)}
                                    allowClear={true}
                                />
                                <input type="hidden" value={this.state.fechaInicioVenta} name="fechainicioVenta" />

                                <C_DatePicker 
                                    value={this.state.fechaFinVenta}
                                    title='Fecha Final*'
                                    onChange={this.onChangeFechaFinVenta.bind(this)}
                                    allowClear={true}
                                    readOnly={
                                        (this.state.fechaInicioVenta == '')?true:false
                                    }
                                />
                                <input type="hidden" value={this.state.fechaFinVenta} name="fechafinventa" />
                                
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

                                <C_DatePicker 
                                    value={this.state.fechaInicioCuota}
                                    title='Fecha Inicio*'
                                    onChange={this.onChangeFechaInicioCuota.bind(this)}
                                    allowClear={true}
                                />
                                <input type="hidden" value={this.state.fechaInicioCuota} name="fechainiciocuota" />

                                <C_DatePicker 
                                    value={this.state.fechaFinCuota}
                                    title='Fecha Fin*'
                                    onChange={this.onChangeFechaFinCuota.bind(this)}
                                    allowClear={true}
                                    readOnly={
                                        (this.state.fechaInicioCuota == '')?true:false
                                    }
                                />
                                <input type="hidden" value={this.state.fechaFinCuota} name="fechafincuota" />
                                    
                            </div>
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.cliente}
                                    onChange={this.onChangeCliente.bind(this)}
                                    title='Cliente'
                                />
                                <input type="hidden" value={this.state.cliente} name="cliente" />

                                {componentvendedoradmin}
                                <input type="hidden" value={this.state.Vendedor} name="vendedor" />
                                
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

                                <C_Select 
                                    value={this.state.opcion}
                                    title='Opciones*'
                                    onChange={this.onChangeOpcion.bind(this)}
                                    component={[
                                        <Option key={1} value={""}>Seleccionar</Option>,
                                        <Option key={2} value={"<"}>Menor</Option>,
                                        <Option key={3} value={"<="}>Menor Igual</Option>,
                                        <Option key={4} value={">"}>Mayor</Option>,
                                        <Option key={5} value={">="}>Mayor Igual</Option>,
                                        <Option key={6} value={"<>"}>Distinto</Option>,
                                        <Option key={7} value={"="}>Igual</Option>,
                                        <Option key={8} value={"!"}>Entre</Option>
                                    ]}
                                />
                                <input type="hidden" value={this.state.opcion} name="opcion" />
                                
                                <C_Input 
                                    value={this.state.montoInicial} 
                                    onChange={this.onChangeMontoInicial.bind(this)}
                                    title='Monto Inicial'
                                    readOnly={(this.state.opcion != '')?false:true}
                                />
                                <input type="hidden" value={this.state.montoInicial} name="montoinicial" />

                                {(this.state.opcionEntre)?
                                    <C_Input 
                                        value={this.state.montoFinal} 
                                        onChange={this.onChangeMontoFinal.bind(this)}
                                        readOnly={(this.state.opcion != '')?false:true}
                                        title='Monto Final'
                                    />:''
                                }
                                <input type="hidden" value={this.state.montoFinal} name="montofinal" />
                                
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>

                                <C_Select 
                                    value={this.state.ordenar}
                                    title='Ordenar Por*'
                                    onChange={this.onChangeOrdenar.bind(this)}
                                    component={[
                                        <Option key={0} value="1">ID Cobro</Option>,
                                        <Option key={1} value="2">Fecha de Cobro</Option>,
                                        <Option key={2} value="3">Cliente</Option>,
                                        <Option key={3} value="4">{this.state.configTitleVend}</Option>,
                                        <Option key={4} value="5">ID Venta</Option>,
                                        <Option key={5} value="6">Fecha a Cobrar</Option>,
                                        <Option key={6} value="7">Nro Cuota</Option>,
                                        <Option key={7} value="8">Monto Cobrado</Option>,
                                        <Option key={8} value="9">Monto a Cobrar</Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenar} name="ordenar" />

                                <C_Select 
                                    value={this.state.exportar}
                                    title='Exportar a*'
                                    onChange={this.onChangeExportar.bind(this)}
                                    component={[
                                        <Option key={0} value="1">Seleccionar</Option>,
                                        <Option key={1} value="2">PDF</Option>,
                                        <Option key={2} value="3">Excel</Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.exportar} name="exportar" />

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



