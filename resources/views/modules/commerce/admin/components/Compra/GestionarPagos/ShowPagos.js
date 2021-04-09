import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import { wspagos } from '../../../WS/webservices';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class ShowCobranza extends Component {
    constructor(){
        super();
        this.state = {
            codpago: '',
            codcompra: '',
            fecha: '',
            hora: '',
            codproveedor: '',
            proveedor: '',
            totalcompra: 0,
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
        this.getPago();
    }

    getPago() {
        axios.get(wspagos + '/' + this.props.match.params.id)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP SERV ', result);
            if (result.response > 0) {
                let totalCuotas = 0;
                let pago = result.pago;
                let compra = result.compra;
                for (let i = 0; i < result.cuotas.length; i++) {
                    totalCuotas += parseFloat(result.cuotas[i].montopagado);
                }
                this.setState({
                    codpago: pago.codpago == null ? '' : pago.codpago,
                    codcompra: compra.codcompra == null ? '' : compra.codcompra,
                    fecha: pago.fecha,
                    codproveedor: compra.proveedor.codproveedor,
                    proveedor: compra.proveedor.nombre + ' ' + (compra.proveedor.apellido == null ? '' : compra.proveedor.apellido),
                    totalcompra: compra.mtototcompra,
                    pagos: compra.mtototpagado,
                    notas: pago.notas == null ? '' : pago.notas,
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
                <Redirect to="/commerce/admin/pagos/index"/>
            )
        }
        return (
            <div className="form-group-content">
                <div className="col-lg-12-content">
                    <div className="col-lg-9-content">
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo Pago</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codpago}</label>
                                </div>
                            </div>
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo Compra</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codcompra}</label>
                                </div>
                            </div>
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Fecha</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.fecha}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12-content">
                            <div className="col-lg-4-content">
                                <div className="col-lg-6-content">
                                    <label className="label-content-modal">Codigo Prov</label>
                                </div>
                                <div className="col-lg-6-content">
                                    <label>{this.state.codproveedor}</label>
                                </div>
                            </div>
                            <div className="col-lg-8-content">
                                <div className="col-lg-2-content">
                                    <label className="label-content-modal">Cliente</label>
                                </div>
                                <div className="col-lg-10-content">
                                    <label>{this.state.proveedor}</label>
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
                            <label className="label-content-modal">Total Compra</label>
                        </div>
                        <div className="col-lg-12-content">
                            <label>{this.state.totalcompra}</label>
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
                            <label>{this.state.totalcompra - this.state.pagos}</label>
                        </div>
                    </div>
                </div>
                <Divider orientation='left'>Lista de Cuotas</Divider>
                <div className="col-lg-12-content">
                    <div className="col-lg-5-content">
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
                                <label style={{color: 'black'}}>Fecha Pagado</label>
                            </div>
                            <div className="col-lg-2-content">
                                <label style={{color: 'black'}}>Monto Pagado</label>
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
                                                <label>{item.fechadepago}</label>
                                            </div>
                                            <div className="col-lg-2-content">
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