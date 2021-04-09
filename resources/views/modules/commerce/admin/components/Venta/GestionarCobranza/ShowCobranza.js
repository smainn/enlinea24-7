import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import { wscobranza } from '../../../WS/webservices';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class ShowCobranza extends Component {
    constructor(){
        super();
        this.state = {
            codcobro: '',
            codventa: '',
            fecha: '',
            hora: '',
            codcliente: '',
            cliente: '',
            totalventa: 0,
            pagos: 0,
            saldo: 0,
            notas: '',
            listaCuotas: [],
            totalpago: 0,
            cuotaspagar: '',
            redirect: false
        }
    }

    componentDidMount() {
        this.getCobro();
    }

    getCobro() {
        axios.get(wscobranza + '/' + this.props.match.params.id)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP SERV ', result);
            if (result.response > 0) {
                let totalCuotas = 0;
                let cobro = result.cobro;
                let venta = result.venta;
                for (let i = 0; i < result.cuotas.length; i++) {
                    totalCuotas += parseFloat(result.cuotas[i].montopagado);
                }
                this.setState({
                    codcobro: cobro.codcobro == null ? '' : cobro.codcobro,
                    codventa: venta.codventa == null ? '' : venta.codventa,
                    fecha: cobro.fecha,
                    hora: cobro.hora,
                    codcliente: venta.cliente.codcliente,
                    cliente: venta.cliente.nombre + ' ' + venta.cliente.apellido,
                    totalventa: venta.mtototventa,
                    pagos: venta.mtotocobrado,
                    notas: cobro.notas == null ? '' : cobro.notas,
                    totalpago: totalCuotas,
                    cuotaspagar: result.cuotas.length,
                    listaCuotas: result.cuotas
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render() {

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/cobranza/index"/>
            )
        }
        return (
            <div className="form-group-content">
                <div className="col-lg-12-content">
                    <div className="col-lg-9-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo Cobro</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codcobro}</label>
                                </div>
                            </div>
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo Venta</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codventa}</label>
                                </div>
                            </div>
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Fecha</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.fecha + ' ' + this.state.hora}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo cli</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codcliente}</label>
                                </div>
                            </div>
                            <div className="col-lg-8-content">
                                <div className="col-lg-2-content">
                                    <label className="label-content-modal">Cliente</label>
                                </div>
                                <div className="col-lg-10-content">
                                    <label>{this.state.cliente}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12-content">
                            <div className="col-lg-12-content">
                                <div className="col-lg-2-content">
                                    <label className="label-content-modal">Notas</label>
                                </div>
                                <div className="col-lg-8-content">
                                    <textarea 
                                        readOnly 
                                        className="form-textarea-content"
                                        value={this.state.notas}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3-content">
                        <div className="col-lg-12-content">
                            <label className="label-content-modal">Total Venta</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.totalventa}</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label className="label-content-modal">Pagos Acumulados</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.pagos}</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label className="label-content-modal">Saldo</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.totalventa - this.state.pagos}</label>
                        </div>
                    </div>
                </div>
                <Divider orientation='left'>Lista de Cuotas</Divider>
                <div className="col-lg-12-content">
                    <div className="col-lg-6-content">
                        <div className="col-lg-3-content">
                            <label className="label-content-modal">Total Cuotas</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label>{this.state.totalpago}</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label className="label-content-modal">Cantidad Cuotas</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label>{this.state.cuotaspagar}</label>
                        </div>
                    </div>
                    <div className="col-lg-12-content">
                        <div 
                            className="col-lg-9-content"
                            style={{marginLeft: WIDTH_WINDOW * 0.1}}>
                            <div className="col-lg-1-content">
                                <label style={{color: 'black'}}>Nro</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label style={{color: 'black'}}>Descripcion</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label style={{color: 'black'}}>Fecha pagado</label>
                            </div>
                            <div className="col-lg-3-content">
                                <label style={{color: 'black'}}>Monto pagado</label>
                            </div>
                        </div>
                        <div className="col-lg-9-content"
                            style={{
                                marginLeft: WIDTH_WINDOW * 0.1,
                                height: 200,
                                overflow: 'scroll'
                            }}>
                            {
                                this.state.listaCuotas.map((item, key) => {
                                    return (
                                        <div key={key} className="col-lg-12-content">
                                            <div className="col-lg-1-content">
                                                <label>{key + 1}</label>
                                            </div>
                                            <div className="col-lg-3-content">
                                                <label>{item.descripcion}</label>
                                            </div>
                                            <div className="col-lg-3-content">
                                                <label>{item.fechaapagar}</label>
                                            </div>
                                            <div className="col-lg-3-content">
                                                <label>{item.montoapagar}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="text-center-content">
                    <button
                        type="button"
                        className="btn-blue-content"
                        onClick={() => this.setState({redirect: true})}>
                        Atras
                    </button>
                </div>
            </div>
        )
    }
}    