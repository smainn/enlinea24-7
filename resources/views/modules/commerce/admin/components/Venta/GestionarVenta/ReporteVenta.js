
import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';

import { message } from 'antd';

import axios from 'axios';

export default class ReporteVenta extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,

            idVenta: '',
            tipoVenta: '',
            fechaInicio: '',
            fechaFinal: '',
            sucursalVenta: '',
            almacenVenta: '',
            monedaVenta: '',
            clienteVenta: '',
            vendedorVenta: '',

            montoTotalVenta: '',
            operacionMontoTotal: '',
            montoTotalVentaHasta: '',

            operacionMontoTotalCobrado: '',
            montoTotalCobrado: '',
            montoTotalCobradoHasta: '',

            operacionMontoTotalPorCobrar: '',
            montoTotalPorCobrar: '',
            montoTotalPorCobrarHasta: '',

            moneda: [],

            inputInicio: true
        }
    }

    componentWillMount() {
        axios.get('').then(
            response => {
                this.setState({
                    moneda: response.data.data,
                    inputInicio: false,
                });
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }

    regresarIndexVenta() {
        this.setState({
            redirect: true,
        });
    }

    onChangeIdVenta(event) {
        this.setState({
            idVenta: event.target.value,
        });
    }

    onChangeTipoVenta(event) {
        this.setState({
            tipoVenta: event.target.value,
        });
    }

    onChangeFechaInicio(event) {
        if (this.state.fechaFinal == '') {
            this.setState({
                fechaInicio: event.target.value,
            });
        }else {
            if (event.target.value <= this.state.fechaFinal) {
                this.setState({
                    fechaInicio: event.target.value,
                });
            }else {
                message.error('Fecha inicio no puede ser mayor que la fecha final');
            }
        }
        if (event.target.value == '') {
            this.setState({
                fechaFinal: '',
            });
        }
    }
    
    onChangeFechaFinal(event) {
        if (event.target.value == '') {
            this.setState({
                fechaFinal: event.target.value,
            });
        }else {
            if (this.state.fechaInicio == '') {
                this.setState({
                    fechaFinal: event.target.value,
                });
            }else {
                if (event.target.value >= this.state.fechaInicio) {
                    this.setState({
                        fechaFinal: event.target.value,
                    });
                }else {
                    message.error('Fecha Final no puede ser menor que la fecha Inicio');
                }
            }
        }
    }

    onChangeSucursalVenta(event) {
        this.setState({
            sucursalVenta: event.target.value,
        });
    }

    onChangeAlmacenVenta(event) {
        this.setState({
            almacenVenta: event.target.value,
        });
    }

    onChangeMonedaVenta(event) {
        this.setState({
            monedaVenta: event.target.value,
        });
    }

    onChangeClienteVenta(event) {
        this.setState({
            clienteVenta: event.target.value,
        });
    }

    onChangeVendedorVenta(event) {
        this.setState({
            vendedorVenta: event.target.value,
        });
    }

    onChangeOperacionMontoTotal(event) {
        this.setState({
            operacionMontoTotal: event.target.value,
        });
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
        });
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
        });
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
            idVenta: '',
            tipoVenta: '',
            fechaInicio: '',
            fechaFinal: '',
            sucursalVenta: '',
            almacenVenta: '',
            monedaVenta: '',
            clienteVenta: '',
            vendedorVenta: '',

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

    render() {

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/indexVenta"/>)
        }

        return (
            <div className="row-content">
                
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Reporte de Venta </h1>
                    </div>
                    <div className="pull-right-content">
                        <button onClick={this.regresarIndexVenta.bind(this)}
                            type="button" className="btn-content btn-sm-content btn-primary-content">
                            Atras
                        </button>
                    </div>
                </div>

                <div className="card-body-content">
                
                    <form action="/commerce/admin/ventaReporte" target="_blank" method="post">

                        <div className="form-group-content" style={{'borderBottom': '1px solid #e8e8e8'}}>
                        
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.idVenta} 
                                            onChange={this.onChangeIdVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            ref={this.focusInputInicio.bind(this)}
                                            placeholder=" Ingresar id"/>
                                        <label className='label-group-content'>Id Vehiculo</label>
                                        <input type="hidden" value={this.state.idVenta} name="idVenta" />
                                    </div>
                                </div>

                                <div className="col-lg-1-content"></div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.tipoVenta} 
                                            onChange={this.onChangeTipoVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar Tipo"
                                        />
                                        <label className='label-group-content'>Tipo Venta</label>
                                        <input type="hidden" value={this.state.tipoVenta} name="tipoVenta" />
                                    </div>
                                </div>
                            
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="date" 
                                            value={this.state.fechaInicio} 
                                            onChange={this.onChangeFechaInicio.bind(this)}
                                            className='form-control-content reinicio-padding'
                                        />
                                        <label className='label-group-content'>Fecha Inicio</label>
                                        <input type="hidden" value={this.state.fechaInicio} name="fechaInicio" />
                                    </div>
                                </div>

                                {(this.state.fechaInicio != '')?
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input type="date" 
                                                value={this.state.fechaFinal} 
                                                onChange={this.onChangeFechaFinal.bind(this)}
                                                className='form-control-content reinicio-padding'
                                            />
                                            <label className='label-group-content'>Fecha Fin</label>
                                            <input type="hidden" value={this.state.fechaFinal} name="fechaFinal" />
                                        </div>
                                    </div>: ''
                                }
                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.sucursalVenta} 
                                            onChange={this.onChangeSucursalVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar sucursal"/>
                                        <label className='label-group-content'>Sucursal</label>
                                        <input type="hidden" value={this.state.sucursalVenta} name="sucursalVenta"/>
                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.almacenVenta} 
                                            onChange={this.onChangeAlmacenVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar almacen"/>
                                        <label className='label-group-content'>Almacen</label>
                                        <input type="hidden" value={this.state.almacenVenta} name="almacenVenta"/>
                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content"
                                            value={this.state.monedaVenta} 
                                            onChange={this.onChangeMonedaVenta.bind(this)}>
                                            <option value="">Seleccionar</option>
                                            {this.state.moneda.map(
                                                (resultado, key) => (
                                                    <option key={key} value={resultado.idmoneda}>{resultado.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className='label-group-content'>Moneda</label>
                                        <input type="hidden" value={this.state.monedaVenta} name="monedaVenta"/>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">

                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.clienteVenta} 
                                            onChange={this.onChangeClienteVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar cliente"/>
                                        <label className='label-group-content'>Cliente</label>
                                        <input type="hidden" value={this.state.clienteVenta} name="clienteVenta"/>
                                    </div>
                                </div>

                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.vendedorVenta} 
                                            onChange={this.onChangeVendedorVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar vendedor"/>
                                        <label className='label-group-content'>Vendedor</label>
                                        <input type="hidden" value={this.state.vendedorVenta} name="vendedorVenta"/>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                                
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label className='label-group-content'>MontoTotal Venta:</label>
                                    </div>
                                </div>

                                <div style={{'marginLeft': '-80px'}} className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                            value={this.state.operacionMontoTotal}
                                            onChange={this.onChangeOperacionMontoTotal.bind(this)}
                                            style={{'marginTop': '-15px', 'width': '73%'}}>
                                            <option value="">Opcion</option>
                                            <option value="<">{'<'}</option>
                                            <option value="<=">{'<='}</option>
                                            <option value=">">{'>'}</option>
                                            <option value=">=">{'>='}</option>
                                            <option value="<>">{'!='}</option>
                                            <option value="!">{'entre'}</option>
                                        </select>
                                        <input type="hidden" value={this.state.operacionMontoTotal} name="operacionMontoTotal"/>
                                    </div>
                                </div>

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" style={{'marginTop': '-15px'}}
                                            value={this.state.montoTotalVenta} 
                                            onChange={this.onChangeMontoTotalVenta.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar monto"/>
                                        <input type="hidden" value={this.state.montoTotalVenta} name="montoTotalVenta"/>
                                    </div>
                                </div>

                                {(this.state.operacionMontoTotal == '!')?
                                    <div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <label className='label-group-content'>Hasta:</label>
                                            </div>
                                        </div>

                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input type="text" style={{'marginTop': '-15px'}}
                                                    value={this.state.montoTotalVentaHasta} 
                                                    onChange={this.onChangeMontoTotalVentaHasta.bind(this)}
                                                    className='form-control-content reinicio-padding'
                                                    placeholder=" Ingresar monto"/>
                                                <input type="hidden" value={this.state.montoTotalVentaHasta} name="montoTotalVentaHasta"/>
                                            </div>
                                        </div>
                                    </div>:
                                    ''
                                }

                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                                
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label className='label-group-content'>MontoTotal Cobrado:</label>
                                    </div>
                                </div>

                                <div style={{'marginLeft': '-80px'}} className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                            value={this.state.operacionMontoTotalCobrado}
                                            onChange={this.onChangeOperacionMontoTotalCobrado.bind(this)}
                                            style={{'marginTop': '-15px', 'width': '73%'}}>
                                            <option value="">Opcion</option>
                                            <option value="<">{'<'}</option>
                                            <option value="<=">{'<='}</option>
                                            <option value=">">{'>'}</option>
                                            <option value=">=">{'>='}</option>
                                            <option value="<>">{'!='}</option>
                                            <option value="!">{'entre'}</option>
                                        </select>
                                        <input type="hidden" value={this.state.operacionMontoTotalCobrado} name="operacionMontoTotalCobrado"/>
                                    </div>
                                </div>

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" style={{'marginTop': '-15px'}}
                                            value={this.state.montoTotalCobrado} 
                                            onChange={this.onChangeMontoTotalCobrado.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar monto"/>
                                        <input type="hidden" value={this.state.montoTotalCobrado} name="montoTotalCobrado"/>
                                    </div>
                                </div>

                                {(this.state.operacionMontoTotalCobrado == '!')?
                                    <div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <label className='label-group-content'>Hasta:</label>
                                            </div>
                                        </div>

                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input type="text" style={{'marginTop': '-15px'}}
                                                    value={this.state.montoTotalCobradoHasta} 
                                                    onChange={this.onChangeMontoTotalCobradoHasta.bind(this)}
                                                    className='form-control-content reinicio-padding'
                                                    placeholder=" Ingresar monto"/>
                                                <input type="hidden" value={this.state.montoTotalCobradoHasta} name="montoTotalCobradoHasta"/>
                                            </div>
                                        </div>
                                    </div>:
                                    ''
                                }

                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <label className='label-group-content'>MontoTotal por Cobrar:</label>
                                    </div>
                                </div>

                                <div style={{'marginLeft': '-80px'}} className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select className="form-control-content reinicio-padding"
                                            value={this.state.operacionMontoTotalPorCobrar}
                                            onChange={this.onChangeOperacionMontoTotalPorCobrar.bind(this)}
                                            style={{'marginTop': '-15px', 'width': '73%'}}>
                                            <option value="">Opcion</option>
                                            <option value="<">{'<'}</option>
                                            <option value="<=">{'<='}</option>
                                            <option value=">">{'>'}</option>
                                            <option value=">=">{'>='}</option>
                                            <option value="<>">{'!='}</option>
                                            <option value="!">{'entre'}</option>
                                        </select>
                                        <input type="hidden" value={this.state.operacionMontoTotalPorCobrar} name="operacionMontoTotalPorCobrar"/>
                                    </div>
                                </div>

                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" style={{'marginTop': '-15px'}}
                                            value={this.state.montoTotalPorCobrar} 
                                            onChange={this.onChangeMontoTotalPorCobrar.bind(this)}
                                            className='form-control-content reinicio-padding'
                                            placeholder=" Ingresar monto"/>
                                        <input type="hidden" value={this.state.montoTotalPorCobrar} name="montoTotalPorCobrar"/>
                                    </div>
                                </div>

                                {(this.state.operacionMontoTotalPorCobrar == '!')?
                                    <div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <label className='label-group-content'>Hasta:</label>
                                            </div>
                                        </div>

                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <div className="input-group-content">
                                                <input type="text" style={{'marginTop': '-15px'}}
                                                    value={this.state.montoTotalPorCobrarHasta} 
                                                    onChange={this.onChangeMontoTotalPorCobrarHasta.bind(this)}
                                                    className='form-control-content reinicio-padding'
                                                    placeholder=" Ingresar monto"/>
                                                <input type="hidden" value={this.state.montoTotalPorCobrarHasta} name="montoTotalPorCobrarHasta"/>
                                            </div>
                                        </div>
                                    </div>:
                                    ''
                                }

                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                            
                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    
                                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content"></div>

                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content" >
                                            <select name="order"
                                                className='form-control-content'>
                                                <option value={1}> id Venta </option>
                                                <option value={2}> Codigo </option>
                                                <option value={3}> Placa </option>
                                                <option value={4}> Chasis </option>
                                                <option value={5}> Id cliente </option>
                                                <option value={6}> Nombre Cliente </option>
                                                <option value={7}> Tipo </option>
                                                <option value={8}> Tipo Uso </option>  
                                            </select>
                                            <label className='label-group-content'>Ordenar Por:</label>
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">

                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content" >
                                            <select name="reporte"
                                                className='form-control-content'>
                                                <option value="N"> Seleccionar </option>
                                                <option value="P"> PDF </option>
                                                <option value="E"> ExCel </option>
                                            </select>
                                            <label className='label-group-content'>Exportar a:</label>
                                        </div>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>

                        <div className="form-group-content"
                            style={{'marginBottom': '-10px'}}>
                            <div className="text-center-content">
                                <button type="button" onClick={this.limpiarDatos.bind(this)}
                                    className="btn-content btn-sm-content btn-blue-content"
                                    style={{'marginRight': '20px'}}>
                                    Limpiar
                                </button>
                                <button type="submit"
                                    className="btn-content btn-sm-content btn-success-content"
                                    style={{'marginRight': '20px'}}>
                                    Generar
                                </button>
                                <button onClick={this.regresarIndexVenta.bind(this)}
                                    type="button" className="btn-content btn-sm-content btn-danger-content">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}