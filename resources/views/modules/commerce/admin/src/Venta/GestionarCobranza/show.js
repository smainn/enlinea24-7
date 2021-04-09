import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table } from 'antd';

import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import { readPermisions } from '../../../tools/toolsPermisions';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import {columns} from '../../../tools/columnsTable';
import keysStorage from '../../../tools/keysStorage';
import { dateToString, hourToString } from '../../../tools/toolsDate';
import C_Button from '../../../components/data/button';
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
            dataTableCuotas: [],
            totalpago: 0,
            cuotaspagar: '',
            redirect: false,
            idcobro: 0,
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            codigo: readPermisions(keys.cobranza_input_codigo),
            codigo_venta: readPermisions(keys.cobranza_input_search_codigoVenta),
            fecha: readPermisions(keys.cobranza_fecha),
            cliente_cod: readPermisions(keys.cobranza_input_codigoCliente),
            cliente_nom: readPermisions(keys.cobranza_input_nombreCliente),
            notas: readPermisions(keys.cobranza_textarea_nota),
            total_venta: readPermisions(keys.cobranza_input_totalVenta),
            pagos_acumulados: readPermisions(keys.cobranza_input_pagosAcumulados),
            saldo: readPermisions(keys.cobranza_input_saldo),
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getCobro();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    cargarCuotasTable(data, array) {

        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                Nro: (i+1),
                Descripcion: data[i].descripcion,
                'Fecha Pagado': data[i].fechaapagar,
                //'Monto Pagado': data[i].montopagado
                'Monto Pagado': data[i].montocobrado
            });
        }
        
    }

    getCobro() {
        httpRequest('get', ws.wscobranza + '/' + this.props.match.params.id)
        .then((result) => {
            if (result.response == 1) {
                let totalCuotas = 0;
                let cobro = result.cobro;
                let venta = result.venta;
                let dataTable = [];
                this.cargarCuotasTable(result.cuotas, dataTable);
                for (let i = 0; i < result.cuotas.length; i++) {
                    totalCuotas += parseFloat(result.cuotas[i].montopagado);
                }

                let codcliente = (venta.cliente.codcliente == null || !this.state.configCodigo) ? venta.cliente.idcliente : venta.cliente.codcliente;
                this.setState({
                    codcobro: (cobro.codcobro == null || !this.state.configCodigo) ? cobro.idcobro : cobro.codcobro,
                    codventa: (venta.codventa == null || !this.state.configCodigo) ?  venta.idventa : venta.codventa,
                    fecha: cobro.fecha,
                    hora: cobro.hora,
                    codcliente: codcliente,
                    cliente: venta.cliente.nombre + ' ' + (venta.cliente.apellido == null ? '' : venta.cliente.apellido),
                    totalventa: venta.mtototventa,
                    pagos: venta.mtototcobrado,
                    notas: cobro.notas == null ? '' : cobro.notas,
                    totalpago: totalCuotas,
                    cuotaspagar: result.cuotas.length,
                    listaCuotas: result.cuotas,
                    dataTableCuotas: dataTable,
                    idcobro: cobro.idcobro,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render() {
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/cobranza/index"/>
            )
        }
        const conexion = readData(keysStorage.connection);
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Detalle Cobranza</h1>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12" style={{'paddingLeft': '0'}}>
                                        <Input
                                            title="Codigo Cobro"
                                            value={this.state.codcobro}
                                            readOnly={true}
                                            permisions={this.permisions.codigo}
                                            //configAllowed={this.state.configCodigo}
                                        />
                                    </div>
                                </div>
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Codigo Venta"
                                        value={this.state.codventa}
                                        readOnly={true}
                                        permisions={this.permisions.codigo_venta}
                                        //configAllowed={this.state.configCodigo}
                                    />
                                </div>
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Fecha"
                                        value={this.state.fecha + ' ' + this.state.hora}
                                        readOnly={true}
                                        permisions={this.permisions.fecha}
                                    />
                                </div>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Codigo cli"
                                        value={this.state.codcliente}
                                        readOnly={true}
                                        permisions={this.permisions.cliente_cod}
                                    />
                                </div>
                                <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12">
                                    <Input
                                        title="Cliente"
                                        value={this.state.cliente}
                                        readOnly={true}
                                        permisions={this.permisions.cliente_nom}
                                    />
                                </div>
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <TextArea
                                        title="Notas"
                                        value={this.state.notas}
                                        readOnly={true}
                                        permisions={this.permisions.notas}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                <Input
                                    title="Pagos Acumulados"
                                    value={this.state.pagos}
                                    readOnly={true}
                                    permisions={this.permisions.pagos_acumulados}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                <Input
                                    title="Total Venta"
                                    value={this.state.totalventa}
                                    readOnly={true}
                                    permisions={this.permisions.total_venta}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                <Input
                                    title="Saldo"
                                    value={(this.state.totalventa - this.state.pagos).toFixed(2)}
                                    readOnly={true}
                                    permisions={this.permisions.saldo}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Divider orientation='left'>Lista de Cuotas</Divider>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <Input
                                    title="Cantidad Cuotas"
                                    value={this.state.cuotaspagar}
                                    readOnly={true}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <Input
                                    title="Total Cuotas"
                                    value={this.state.totalpago.toFixed(2)}
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Table
                                bordered
                                dataSource={this.state.dataTableCuotas}
                                columns={columns.cobranzaCuotas}
                                pagination={false}
                                style={{
                                    width: '70%',
                                    marginLeft: '15%',
                                }}
                                size="middle"
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="text-center-content">
                                <form target="_blank" method="post" action="/commerce/admin/cobranza/recibo">
                                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                    <input type="hidden" value={x_login} name="x_login" />
                                    <input type="hidden" value={x_fecha} name="x_fecha" />
                                    <input type="hidden" value={x_hora} name="x_hora" />
                                    <input type="hidden" value={token} name="authorization" />
                                    
                                    <input type="hidden" value={conexion} name="x_conexion" />
                                    <input type="hidden" value={this.props.match.params.id} name="id" />
                                    <input type="hidden" value={usuario} name="usuario" />
                                    <C_Button type='primary'
                                        title='Imprimir' submit={true}
                                    />
                                    <C_Button onClick={() => this.setState({redirect: true})}
                                        title='Atras' type='danger'
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}    