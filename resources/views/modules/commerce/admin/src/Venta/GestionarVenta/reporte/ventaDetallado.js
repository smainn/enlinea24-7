
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../../tools/toolsStorage';
import routes from '../../../../tools/routes';
import keysStorage from '../../../../tools/keysStorage';
import ws from '../../../../tools/webservices';
import CDatePicker from '../../../../components/datepicker';
import { dateToString, hourToString } from '../../../../tools/toolsDate';

export default class ReporteVentaDetallado extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            exportar: 'N',
            ordenarPor: 1,

            id: '',
            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',

            cliente: '',
            vendedor: '',

            placa: '',

            montoTotalVenta: '',
            operacionMontoTotal: '',
            montoTotalVentaHasta: '',

            operacionMontoTotalCobrado: '',
            montoTotalCobrado: '',
            montoTotalCobradoHasta: '',

            operacionMontoTotalPorCobrar: '',
            montoTotalPorCobrar: '',
            montoTotalPorCobrarHasta: '',

            arrayMoneda: [],
            arrayAlmacen: [],
            ArraySucursal: [],
            Arraytipocontacredito: [],

            inputInicio: true,

            noSesion: false,
            config: [
                {
                    comventasventaalcredito: false,
                    comtaller: false,
                },
            ],
            configTitleVend: ''
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        httpRequest('get', '/commerce/api/venta/reporte')
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    arrayMoneda: result.data,
                    inputInicio: false,
                    arrayAlmacen: result.almacen,
                    ArraySucursal: result.sucursal,
                    Arraytipocontacredito: result.tipo,
                    config: result.configuracion
                });
            }
                
        })
        .catch(
            error => {
                console.log(error);
            }
        );
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

    regresarIndexVenta() {
        this.setState({
            redirect: true,
        });
    }

    onChangeIdVenta(event) {
        this.setState({
            id: event.target.value,
        });
    }

    onChangeTipoVenta(event) {
        this.setState({
            tipo: event.target.value,
        });
    }

    onChangeFechaInicio(date, dateString) {
        if (this.state.fechaFinal == '') {
            this.setState({
                fechaInicio: dateString,
            });
        }else {
            if (dateString <= this.state.fechaFinal) {
                this.setState({
                    fechaInicio: dateString,
                });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
            });
        }
    }
    
    onChangeFechaFinal(date, dateString) {
        if (dateString == '') {
            this.setState({
                fechaFinal: '',
            });
        }else {
            
            if (dateString >= this.state.fechaInicio) {
                this.setState({
                    fechaFinal: dateString,
                });
            }else {
                message.error('Fecha Final no puede ser menor que la fecha Inicio');
            }
        
        }
    }

    onChangeSucursalVenta(event) {
        this.setState({
            sucursal: event.target.value,
        });
    }

    onChangeAlmacenVenta(event) {
        this.setState({
            almacen: event.target.value,
        });
    }

    onChangeMonedaVenta(event) {
        this.setState({
            moneda: event.target.value,
        });
    }

    onChangeClienteVenta(event) {
        this.setState({
            cliente: event.target.value,
        });
    }

    onChangeVendedorVenta(event) {
        this.setState({
            vendedor: event.target.value,
        });
    }

    onChangePlacaVenta(event) {
        this.setState({
            placa: event.target.value,
        });
    }

    onChangeOperacionMontoTotal(event) {

        this.setState({
            operacionMontoTotal: event.target.value,
            montoTotalVentaHasta: '',
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalVenta: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto total fin');
        }
    }

    onChangeMontoTotalVenta(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalVenta: event.target.value,
           });
        }
    }

    onChangeMontoTotalVentaHasta(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalVentaHasta: event.target.value,
           });
        }
    }

    onChangeOperacionMontoTotalCobrado(event) {
        this.setState({
            operacionMontoTotalCobrado: event.target.value,
            montoTotalCobradoHasta: ''
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalCobrado: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto cobrado fin');
        }
    }

    onChangeMontoTotalCobrado(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalCobrado: event.target.value,
           });
        }
    }

    onChangeMontoTotalCobradoHasta(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalCobradoHasta: event.target.value,
           });
        }
    }

    onChangeOperacionMontoTotalPorCobrar(event) {

        this.setState({
            operacionMontoTotalPorCobrar: event.target.value,
            montoTotalPorCobrarHasta: ''
        });
        if (event.target.value == '') {
            this.setState({
                montoTotalPorCobrar: '',
            });
        }
        if (event.target.value == '!') {
            message.success('habilitado monto por cobrar fin');
        }
    }

    onChangeMontoTotalPorCobrar(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalPorCobrar: event.target.value,
           });
        }
    }

    onChangeMontoTotalPorCobrarHasta(event) {
        if (!isNaN(event.target.value)) {
           this.setState({
               montoTotalPorCobrarHasta: event.target.value,
           });
        }
    }

    limpiarDatos() {
        this.setState({
            exportar: 'N',
            ordenarPor: 1,

            id: '',
            tipo: '',
            fechaInicio: '',
            fechaFinal: '',

            sucursal: '',
            almacen: '',
            moneda: '',

            cliente: '',
            vendedor: '',

            montoTotalVenta: '',
            operacionMontoTotal: '',
            montoTotalVentaHasta: '',

            operacionMontoTotalCobrado: '',
            montoTotalCobrado: '',
            montoTotalCobradoHasta: '',

            operacionMontoTotalPorCobrar: '',
            montoTotalPorCobrar: '',
            montoTotalPorCobrarHasta: '',

        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    onChangeExportar(event) {
        this.setState({
            exportar: event.target.value,
        });
    }

    onChangeOrdenarPor(event) {
        this.setState({
            ordenarPor: event.target.value,
        });
    }

    render() {
        let conexion = readData(keysStorage.connection);
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? null : 
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/venta/index"/>)
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
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Reporte ventas detallado</h1>
                        </div>
                        <div className="pulls-right">
                            <Link to="/commerce/admin/venta/index" className="btns btns-primary">
                                Atras
                            </Link>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <form action="/commerce/admin/venta_detalle/generar" target="_blank" method="post">

                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={x_connection} name="x_conexion" />
                            <input type="hidden" value={token} name="authorization" />

                            <input type="hidden" value={usuario} name="usuario" />
                            <input type="hidden" value={conexion} name="x_conexion" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">

                                    <div className="inputs-groups">
                                        <input type='text'
                                            className="forms-control"
                                            value={this.state.id}
                                            onChange={this.onChangeIdVenta.bind(this)}
                                            placeholder=' Ingresar id...'
                                        />
                                        <label className="lbls-input active">Id venta</label>
                                        <input type="hidden" value={this.state.id} name="id" />
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-1 cols-md-1"></div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    
                                    <div className="inputs-groups">
                                        <select  className="forms-control"
                                            value={this.state.tipo}  
                                            onChange={this.onChangeTipoVenta.bind(this)}  
                                        >
                                            <option value=''> Seleccionar...</option>
                                            {this.state.Arraytipocontacredito.map(
                                                (data, key) => (
                                                    <option key={key} value={data.idtipocontacredito}>{data.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className="lbls-input active">Tipo Venta</label>
                                        <input type="hidden" value={this.state.tipo} name="tipoVenta" />
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">

                                    <CDatePicker
                                        allowClear={true}
                                        value={this.state.fechaInicio}
                                        onChange={this.onChangeFechaInicio.bind(this)}
                                        title="Fecha Inicio"
                                    />
                                        
                                    <input type="hidden" value={this.state.fechaInicio} name="fechaInicio" />
                                    
                                </div>

                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">

                                        <CDatePicker
                                            allowClear={true}
                                            value={this.state.fechaFinal}
                                            onChange={this.onChangeFechaFinal.bind(this)}
                                            title="Fecha Final"
                                            readOnly={
                                                (this.state.fechaInicio == '')?true:false
                                            }
                                        />
                                        <input type="hidden" value={this.state.fechaFinal} name="fechaFinal" />
                                            
                                    </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select
                                            value={this.state.sucursal}
                                            onChange={this.onChangeSucursalVenta.bind(this)}
                                            className="forms-control"  
                                            style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {this.state.ArraySucursal.map(
                                                (resultado, key) => (
                                                    <option key={key} value={resultado.idsucursal}>{resultado.nombre}</option>
                                                )
                                            )}

                                        </select>
                                        <label className='lbls-input active'>Sucursal</label>
                                        <input type="hidden" value={this.state.sucursal} name="sucursal"/>
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select 
                                            value={this.state.almacen} 
                                            onChange={this.onChangeAlmacenVenta.bind(this)}
                                            className="forms-control"  
                                            style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                        >
                                            <option value="">Seleccionar</option>
                                            {this.state.arrayAlmacen.map(
                                                (resultado, key) => (
                                                    <option key={key} value={resultado.idalmacen}>{resultado.descripcion}</option>
                                                )
                                            )}

                                        </select>
                                        <label className='lbls-input active'>Almacen</label>
                                        <input type="hidden" value={this.state.almacen} name="almacen"/>
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select
                                            className='forms-control'
                                            value={this.state.moneda} 
                                            onChange={this.onChangeMonedaVenta.bind(this)}
                                            style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                            <option value="">Seleccionar</option>
                                            {this.state.arrayMoneda.map(
                                                (resultado, key) => (
                                                    <option key={key} value={resultado.idmoneda}>{resultado.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className='lbls-input active'>Moneda</label>
                                        <input type="hidden" value={this.state.moneda} name="moneda"/>
                                    </div>
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' 
                                            value={this.state.cliente} 
                                            onChange={this.onChangeClienteVenta.bind(this)}
                                            className='forms-control'
                                            placeholder=' Ingresar cliente...'
                                        />
                                        <label className='lbls-input active'>Cliente</label>
                                        <input type="hidden" value={this.state.cliente} name="cliente"/>
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' 
                                            value={this.state.vendedor} 
                                            onChange={this.onChangeVendedorVenta.bind(this)}
                                            className='forms-control'
                                            placeholder={' Ingresar ' + this.state.configTitleVend + '...'}
                                        />
                                        <label className='lbls-input active'>{this.state.configTitleVend}</label>
                                        <input type="hidden" value={this.state.vendedor} name="vendedor"/>
                                    </div>
                                    
                                </div>
                            </div>

                            {(this.state.config[0].comtaller)?

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12"></div>
                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text" 
                                                placeholder="Ingresar placa..."
                                                className="forms-control"
                                                value={this.state.placa}
                                                onChange={this.onChangePlacaVenta.bind(this)}
                                            />
                                            <label className="lbls-input active">Placa</label>
                                        </div>
                                        <input type="hidden" name="placa" value={this.state.placa} />
                                    </div>
                                </div>:''
                            }

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Monto Total Venta'
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select 
                                            className='forms-control'
                                            value={this.state.operacionMontoTotal}
                                            onChange={this.onChangeOperacionMontoTotal.bind(this)}>
                                            <option value="">Seleccionar...</option>
                                            <option value="<">{'Menor'}</option>
                                            <option value="<=">{'Menor igual'}</option>
                                            <option value=">">{'Mayor'}</option>
                                            <option value=">=">{'Mayor igual'}</option>
                                            <option value="<>">{'Diferente'}</option>
                                            <option value="=">{'Igual'}</option>
                                            <option value="!">{'Entre'}</option>
                                        </select>
                                        <label className="lbls-input active">Opcion</label>
                                        <input type="hidden" value={this.state.operacionMontoTotal} name="operacionMontoTotal"/>
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12"> 
                                    <div className="inputs-groups">
                                        <input type="text"
                                            value={this.state.montoTotalVenta} 
                                            onChange={this.onChangeMontoTotalVenta.bind(this)}
                                            className={(this.state.operacionMontoTotal != '')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            placeholder='Ingresar monto...'
                                            readOnly={(this.state.operacionMontoTotal != '')?false:true}
                                        />
                                        
                                        <label style={{'color': (this.state.operacionMontoTotal != '')?'#4476FA':'#e8e8e8'}}
                                            className='lbls-input active'>
                                            Monto Total
                                        </label>
                                        <input type="hidden" value={this.state.montoTotalVenta} name="montoTotal"/>
                                    </div>
                                </div>

                                <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12">
                                    <div className='inputs-groups'>
                                        <input type='text' readOnly
                                            style={{'border': '1px solid transparent'}}
                                            value='Hasta '
                                            className='forms-control'
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.montoTotalVentaHasta}
                                            onChange={this.onChangeMontoTotalVentaHasta.bind(this)}
                                            className={(this.state.operacionMontoTotal == '!')?
                                                'forms-control':
                                                'forms-control cursor-not-allowed'}
                                            placeholder='Ingresar monto...'
                                            readOnly={(this.state.operacionMontoTotal == '!')?false:true}
                                            />

                                        <label style={{'color': (this.state.operacionMontoTotal == '!')?'#4476FA':'#e8e8e8'}}
                                            className='lbls-input active'>
                                            Monto Total
                                        </label>
                                        <input type="hidden" value={this.state.montoTotalVentaHasta} name="montoTotalFin"/>
                                    </div>
                                </div>

                            </div>

                            {(this.state.config[0].comventasventaalcredito)?
                            
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='Monto Total Cobrado'
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <select 
                                                className='forms-control'
                                                value={this.state.operacionMontoTotalCobrado}
                                                onChange={this.onChangeOperacionMontoTotalCobrado.bind(this)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="<">{'Menor'}</option>
                                                <option value="<=">{'Menor  igual'}</option>
                                                <option value=">">{'Mayor'}</option>
                                                <option value=">=">{'Mayor igual'}</option>
                                                <option value="<>">{'Diferente'}</option>
                                                <option value="=">{'Igual'}</option>
                                                <option value="!">{'Entre'}</option>
                                            </select>
                                            <label className="lbls-input active">Opcion</label>
                                            <input type="hidden" value={this.state.operacionMontoTotalCobrado} name="operacionMontoTotalCobrado"/>
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text" 
                                                value={this.state.montoTotalCobrado}
                                                onChange={this.onChangeMontoTotalCobrado.bind(this)}
                                                className={(this.state.operacionMontoTotalCobrado != '')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                                placeholder='Ingresar monto...'
                                                readOnly={(this.state.operacionMontoTotalCobrado != '')?false:true}
                                            />
                                            
                                            <label style={{'color': (this.state.operacionMontoTotalCobrado != '')?'#4476FA':'#e8e8e8'}}
                                                className='lbls-input active'>
                                                Monto Cobrado
                                            </label>
                                            <input type="hidden" value={this.state.montoTotalCobrado} name="montoTotalCobrado"/>
                                        </div>
                                    </div>
                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='Hasta '
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text"
                                                value={this.state.montoTotalCobradoHasta} 
                                                onChange={this.onChangeMontoTotalCobradoHasta.bind(this)}
                                                className={(this.state.operacionMontoTotalCobrado == '!')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                                placeholder='Ingresar monto...'
                                                readOnly={(this.state.operacionMontoTotalCobrado == '!')?false:true}
                                            />

                                            <label style={{'color': (this.state.operacionMontoTotalCobrado == '!')?'#4476FA':'#e8e8e8'}}
                                                className='lbls-input active'>
                                                Monto Cobrado
                                            </label>
                                            <input type="hidden" value={this.state.montoTotalCobradoHasta} name="montoTotalCobradoHasta"/>
                                        </div>
                                    </div>

                                </div>

                            :''}
                            {(this.state.config[0].comventasventaalcredito)?
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                    <div className="cols-lg-3 cols-md-3 cols-sm-12 col-xs-12">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='MontoTotal por Cobrar'
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <select className='forms-control'
                                                value={this.state.operacionMontoTotalPorCobrar}
                                                onChange={this.onChangeOperacionMontoTotalPorCobrar.bind(this)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="<">{'Menor'}</option>
                                                <option value="<=">{'Menor igual'}</option>
                                                <option value=">">{'Mayor'}</option>
                                                <option value=">=">{'Mayor igual'}</option>
                                                <option value="<>">{'Diferente'}</option>
                                                <option value="=">{'Igual'}</option>
                                                <option value="!">{'Entre'}</option>
                                            </select>
                                            <label className="lbls-input active">Opcion</label>
                                            <input type="hidden" value={this.state.operacionMontoTotalPorCobrar} name="operacionMontoTotalPorCobrar"/>
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text"
                                                value={this.state.montoTotalPorCobrar}
                                                onChange={this.onChangeMontoTotalPorCobrar.bind(this)}
                                                className={(this.state.operacionMontoTotalPorCobrar != '')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                                placeholder='Ingresar monto...'
                                                readOnly={(this.state.operacionMontoTotalPorCobrar != '')?false:true}
                                            />
                                            <label style={{'color': (this.state.operacionMontoTotalPorCobrar != '')?'#4476FA':'#e8e8e8'}}
                                                className='lbls-input active'>
                                                Monto por cobrar
                                            </label>
                                            <input type="hidden" value={this.state.montoTotalPorCobrar} name="montoTotalPorCobrar"/>
                                        </div>
                                    </div> 
                                    <div className="cols-lg-1 cols-md-1 cols-sm-12 col-xs-12">
                                        <div className='inputs-groups'>
                                            <input type='text' readOnly
                                                style={{'border': '1px solid transparent'}}
                                                value='Hasta '
                                                className='forms-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <input type="text" 
                                                value={this.state.montoTotalPorCobrarHasta} 
                                                onChange={this.onChangeMontoTotalPorCobrarHasta.bind(this)}
                                                className={(this.state.operacionMontoTotalPorCobrar == '!')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                                placeholder='Ingresar monto...'
                                                readOnly={(this.state.operacionMontoTotalPorCobrar == '!')?false:true}
                                            />
                                            
                                            <label style={{'color': (this.state.operacionMontoTotalPorCobrar == '!')?'#4476FA':'#e8e8e8'}}
                                                className='lbls-input active'>
                                                Monto por cobrar
                                            </label>
                                            <input type="hidden" value={this.state.montoTotalPorCobrarHasta} name="montoTotalPorCobrarHasta"/>
                                        </div>
                                    </div>

                                </div>
                            :''}

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                    
                                    <div className="cols-lg-6 cols-md-6"></div>

                                    <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <select name="order" id="ordenar"
                                                value={this.state.ordenarPor}
                                                onChange={this.onChangeOrdenarPor.bind(this)}
                                                className='forms-control'
                                            >
                                                <option value={1}> Id Venta </option>
                                                <option value={2}> Fecha </option>
                                                <option value={3}> Cliente </option>
                                                <option value={4}> {this.state.configTitleVend} </option>
                                                <option value={5}> Tipo Venta </option>
                                                <option value={6}> Monto Total </option>
                                                <option value={7}> Monto Cobrado </option> 
                                            </select>
                                            <label htmlFor="ordenar" 
                                                className='lbls-input active'>
                                                Ordenar por 
                                            </label>
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                        <div className="inputs-groups">
                                            <select name="reporte" id="exportar"
                                                value={this.state.exportar}
                                                onChange={this.onChangeExportar.bind(this)}
                                                className='forms-control'
                                            >
                                                <option value="N"> Seleccionar </option>
                                                <option value="P"> PDF </option>
                                                <option value="E"> ExCel </option>
                                            </select>
                                            <label htmlFor="exportar" 
                                                className='lbls-input active'>
                                                Exportar
                                            </label>
                                        </div>
                                    </div>
                                    
                                </div>

                            </div>

                            <div className="forms-groups"
                                style={{'marginBottom': '-10px'}}>
                                <div className="text-center-content">
                                    <button type="button" onClick={this.limpiarDatos.bind(this)}
                                        className="btns btns-primary"
                                        style={{'marginRight': '20px'}}>
                                        Limpiar
                                    </button>
                                    <button type="submit"
                                        className="btns btns-primary"
                                        style={{'marginRight': '20px'}}>
                                        Generar
                                    </button>
                                    <button onClick={this.regresarIndexVenta.bind(this)}
                                        type="button" className="btns btns-danger">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}