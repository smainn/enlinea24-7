import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class ShowPago extends Component {
    constructor(props) {
        super(props);
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
            redirect: false,
            nro: 0,
            fecha: '',
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            verNro: readPermisions(keys.pago_ver_nro),
            verFecha: readPermisions(keys.pago_ver_fecha),
            codigo: readPermisions(keys.pago_input_codigo),
            codigoCompra: readPermisions(keys.pago_input_search_codigoCompra),
            fecha: readPermisions(keys.pago_fecha),
            totalCompra: readPermisions(keys.pago_input_totalCompra),
            codigoProveedor: readPermisions(keys.pago_input_codigoProveedor),
            nombreProveedor: readPermisions(keys.pago_input_nombreProveedor),
            acumulados: readPermisions(keys.pago_input_acumulados),
            notas: readPermisions(keys.pago_textarea_nota),
            saldo: readPermisions(keys.pago_input_saldo),
            totalPagar: readPermisions(keys.pago_input_totalPagar),
            cuotasPagar: readPermisions(keys.pago_input_cuotasPagar),
            //columnaSaldo: readPermisions(keys.pago_tabla_columna_saldo)
        }
    }

    componentDidMount() {
        this.getConfigsClient();
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getPago();
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getPago() {
        httpRequest('get', ws.wspagos + '/' + this.props.match.params.id)
        .then((result) => {
            if (result.response == 1) {
                let totalCuotas = 0;
                let pago = result.pago;
                let compra = result.compra;
                for (let i = 0; i < result.cuotas.length; i++) {
                    totalCuotas += parseFloat(result.cuotas[i].montopagado);
                }
                this.setState({
                    codpago: (pago.codpago == null || !this.state.configCodigo) ? pago.idpagos : pago.codpago,
                    codcompra: (compra.codcompra == null || !this.state.configCodigo) ? compra.idcompra : compra.codcompra,
                    fecha: pago.fecha,
                    codproveedor: (compra.proveedor.codproveedor == null || !this.state.configCodigo) ? compra.proveedor.idproveedor : compra.proveedor.codproveedor,
                    proveedor: compra.proveedor.nombre + ' ' + (compra.proveedor.apellido == null ? '' : compra.proveedor.apellido),
                    totalcompra: parseFloat(compra.mtototcompra).toFixed(2),
                    pagos: parseFloat(compra.mtototpagado).toFixed(2),
                    notas: pago.notas == null ? '' : pago.notas,
                    totalpago: parseFloat(totalCuotas).toFixed(2),
                    cuotaspagar: result.cuotas.length,
                    listaCuotas: result.cuotas,
                    nro: pago.idpago,
                    fecha: pago.created_at,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        if (this.state.redirect) {
            return (
                <Redirect to={routes.pago_index} />
            )
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Detalle Pago</h1>
                        </div>
                    </div>


                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-sm-12">
                                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Codigo Pago"
                                            value={this.state.codpago}
                                            readOnly={true}
                                            permisions = {this.permisions.codigo}
                                            //configAllowed={this.state.configCodigo}
                                        />
                                    </div>

                                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Codigo Compra"
                                            value={this.state.codcompra}
                                            readOnly={true}
                                            permisions = {this.permisions.codigoCompra}
                                        />
                                    </div>

                                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Fecha"
                                            value={this.state.fecha}
                                            readOnly={true}
                                            permisions = {this.permisions.fecha}
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Codigo Prov"
                                            value={this.state.codproveedor}
                                            readOnly={true}
                                            permisions = {this.permisions.codigoProveedor}
                                        />
                                    </div>

                                    <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12">
                                        <Input
                                            title="Proveedor"
                                            value={this.state.proveedor}
                                            readOnly={true}
                                            permisions = {this.permisions.nombreProveedor}
                                        />
                                    </div>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <TextArea
                                            title="Notas"
                                            value={this.state.notas}
                                            readOnly={true}
                                            permisions = {this.permisions.notas}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                    style={{'marginBottom': '10px'}}>
                                    <Input
                                        title="Total Compra"
                                        value={this.state.totalcompra}
                                        readOnly={true}
                                        permisions = {this.permisions.totalCompra}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                    style={{'marginBottom': '10px'}}>
                                    <Input
                                        title="Pagos Acumulados"
                                        value={this.state.pagos}
                                        readOnly={true}
                                        permisions = {this.permisions.acumulados}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Saldo"
                                        value={(this.state.totalcompra - this.state.pagos).toFixed(2)}
                                        readOnly={true}
                                        permisions = {this.permisions.saldo}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                            </div>

                            <Divider orientation='left'>Lista de Cuotas</Divider>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-2 cols-md-2"></div>
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Total Pagos"
                                        value={this.state.totalpago}
                                        readOnly={true}
                                        permisions = {this.permisions.cuotasPagar}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Total a Pagar"
                                        value={ parseFloat( this.state.totalcompra * 1 - this.state.pagos * 1 ).toFixed(2) }
                                        readOnly={true}
                                        permisions = {this.permisions.totalPagar}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div 
                                    className="table-detalle" 
                                    style={{ 
                                        width: '80%',
                                        marginLeft: '10%',
                                        overflow: 'auto'
                                    }}>
                                    <table className="table-response-detalle">
                                        <thead>
                                            <tr>
                                                <th>Nro</th>
                                                <th>Descripcion</th>
                                                <th>Fecha Pagado</th>
                                                <th>Monto Pagado</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.state.listaCuotas.map((item, key) => {
                                                
                                                return (
                                                    <tr key={key}>
                                                        <td>{key + 1}</td>
                                                        <td>{item.descripcion}</td>
                                                        <td>{item.fechadepago}</td>
                                                        {/*<td>{item.montoapagar}</td>*/}
                                                        <td>{item.mtopagado}</td>
                                                    </tr>
                                                )
                                            }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>   
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="txts-center">
                                    <C_Button
                                        title='Atras'
                                        type='primary'
                                        onClick={() => this.setState({redirect: true})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}    