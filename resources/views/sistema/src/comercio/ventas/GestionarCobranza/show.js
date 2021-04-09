import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table } from 'antd';

import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import { readPermisions } from '../../../utils/toolsPermisions';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import {columns} from '../../../utils/columnsTable';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString, convertYmdToDmy } from '../../../utils/toolsDate';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import C_CheckBox from '../../../componentes/data/checkbox';
import C_Input from '../../../componentes/data/input';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class ShowCobranza extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible_imprimir: false,
            visible_cobro: false,
            loading: false,

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
            configCodigo: false,

            fkidtipocontacredito: null,
            facturarsiempre: 'N',
            ventaendospasos: false,
            facturacion: null,
            clienteesabogado: false,

            checked_imprimir_ok: true,
            checked_imprimir_cancel: false,

            checked_generarfactura_ok: false,
            checked_generarfactura_cancel: true,

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            idventa: null,

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
                    configCodigo: result.configcliente.codigospropios,
                    ventaendospasos: result.configcliente.ventaendospasos,
                    facturarsiempre: result.configcliente.facturarsiempre,
                    clienteesabogado: result.configcliente.clienteesabogado,
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

    cargarCuotasTable(data, array) {

        let length = data.length;
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                Nro: (i+1),
                Descripcion: data[i].descripcion,
                'Fecha Pagado': convertYmdToDmy(data[i].fechaapagar),
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
                    fecha: convertYmdToDmy(cobro.fecha),
                    hora: cobro.hora,
                    codcliente: codcliente,
                    cliente: venta.cliente.nombre + ' ' + (venta.cliente.apellido == null ? '' : venta.cliente.apellido),
                    totalventa: parseFloat(venta.mtototventa).toFixed(2),
                    pagos: parseFloat(venta.mtototcobrado).toFixed(2),
                    notas: cobro.notas == null ? '' : cobro.notas,
                    totalpago: totalCuotas,
                    cuotaspagar: result.cuotas.length,
                    listaCuotas: result.cuotas,
                    dataTableCuotas: dataTable,
                    idcobro: cobro.idcobro,
                    fkidtipocontacredito: venta.fkidtipocontacredito,
                    facturacion: result.factura,
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
    generar_recibo() {
        this.setState({
            visible_imprimir: true,
        });
    }
    componentReciboVenta() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">

                    {(this.state.facturarsiempre != 'N' && this.state.fkidtipocontacredito == 1 && this.state.ventaendospasos)?
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <C_Input className=''
                                    value={'Generar factura: '}
                                    style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'Si'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedGenerarFacturaOk.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedGenerarFacturaOk.bind(this)}
                                            checked={this.state.checked_generarfactura_ok}
                                        />
                                    }
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    value={'No'}
                                    readOnly={true}
                                    className=''
                                    style={{cursor: 'pointer', 
                                        background: 'white',
                                    }}
                                    onClick={this.onChangeCheckedGenerarFacturaCancel.bind(this)}
                                    suffix={
                                        <C_CheckBox
                                            style={{marginTop: -3,}}
                                            onChange={this.onChangeCheckedGenerarFacturaCancel.bind(this)}
                                            checked={this.state.checked_generarfactura_cancel}
                                        />
                                    }
                                />
                            </div>
                        </div>: null

                    }

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                            <C_Input className=''
                                value={'Imprimir Nota de venta: '}
                                style={{width: '100%', textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={'Si'}
                                readOnly={true}
                                className=''
                                style={{cursor: 'pointer', 
                                    background: 'white',
                                }}
                                onClick={this.onChangeCheckedImprimirOk.bind(this)}
                                suffix={
                                    <C_CheckBox
                                        style={{marginTop: -3,}}
                                        onChange={this.onChangeCheckedImprimirOk.bind(this)}
                                        checked={this.state.checked_imprimir_ok}
                                    />
                                }
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={'No'}
                                readOnly={true}
                                className=''
                                style={{cursor: 'pointer', 
                                    background: 'white',
                                }}
                                onClick={this.onChangeCheckedImprimirCancel.bind(this)}
                                suffix={
                                    <C_CheckBox
                                        style={{marginTop: -3,}}
                                        onChange={this.onChangeCheckedImprimirCancel.bind(this)}
                                        checked={this.state.checked_imprimir_cancel}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div style={{textAlign: 'right', paddingRight: 5, }}>
                        <C_Button
                            title={'Aceptar'}
                            type='primary'
                            onClick={this.ongenerarRecibo.bind(this)}
                        />  
                        <C_Button
                            title={'Cancelar'}
                            type='danger'
                            onClick={this.onCerrarImprimir.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
    onCerrarImprimir() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.setState({
                visible_imprimir: false,
                loading: false,
            });
        }, 300);
    }
    ongenerarRecibo(event) {
        event.preventDefault();

        this.setState({
            loading: true,
        });

        if (this.state.checked_imprimir_ok || this.state.checked_generarfactura_ok) {

            if (this.state.checked_generarfactura_ok) {
                let body = {
                    idcobro: this.props.match.params.id,
                    facturarsiempre: this.state.facturarsiempre,
                    generarfactura: this.state.checked_generarfactura_ok ? 'A' : 'N',
                    ventaendospasos: this.state.ventaendospasos ? 'A' : 'N',
                }
                httpRequest('post', ws.wscobranza_factura, body)
                .then(result => {
    
                    if (result.response == 1) {

                        if (result.bandera == 0) {

                            this.setState({
                                venta_first: result.venta,
                                venta_detalle: result.venta_detalle,
                                planpago: result.planpago,
                                config_cliente: result.configcliente,
                                idventa: result.idventa,
                                facturacion: result.factura,
                            });

                            setTimeout(() => {

                                document.getElementById('imprimir_factura').submit();

                            }, 1000);

                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                    visible_imprimir: false,
                                });
                            }, 1500);

                        }else {
                            notification.error({
                                message: 'Advertencia',
                                description:
                                    'No se puede generar la Factura, revise Dosificacion de Factura...!!!',
                            });
                            this.setState({
                                loading: false,
                            });
                        }
    
                    } else if (result.response == -2) {
                        this.setState({ noSesion: true, });
                    } else {
                        console.log('Ocurrio un problema en el servidor');
                        this.setState({
                            loading: false,
                        })
                    }
                }).catch(error => {
                    message.error(strings.message_error);
                });

                return;
            }

            if (this.state.checked_imprimir_ok) {
                setTimeout(() => {
                    document.getElementById('imprimir_recibo').submit();
                }, 300);
                setTimeout(() => {
                    this.setState({
                        loading: false,
                        visible_imprimir: false,
                    });
                }, 600);
                return;
            }

            setTimeout(() => {
                this.setState({
                    loading: false,
                });
            }, 200);

        }else {
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
            }, 300);
        }
    }
    onChangeCheckedImprimirOk() {
        if (this.state.checked_imprimir_ok) {
            this.setState({
                checked_imprimir_ok: false,
                checked_imprimir_cancel: true,
            });
        }else {
            this.setState({
                checked_imprimir_ok: true,
                checked_imprimir_cancel: false,
            });
        }
    }
    onChangeCheckedImprimirCancel() {
        if (this.state.checked_imprimir_cancel) {
            this.setState({
                checked_imprimir_ok: true,
                checked_imprimir_cancel: false,
            });
        }else {
            this.setState({
                checked_imprimir_ok: false,
                checked_imprimir_cancel: true,
            });
        }
    }
    onChangeCheckedGenerarFacturaOk() {
        if (this.state.checked_generarfactura_ok) {
            this.setState({
                checked_generarfactura_ok: false,
                checked_generarfactura_cancel: true,
            });
        }else {
            this.setState({
                checked_generarfactura_ok: true,
                checked_generarfactura_cancel: false,
            });
        }
    }
    onChangeCheckedGenerarFacturaCancel() {
        if (this.state.checked_generarfactura_cancel) {
            this.setState({
                checked_generarfactura_ok: true,
                checked_generarfactura_cancel: false,
            });
        }else {
            this.setState({
                checked_generarfactura_ok: false,
                checked_generarfactura_cancel: true,
            });
        }
    }
    imprimirNotaRecibo() {
        document.getElementById('imprimir_recibo').submit();
    }
    generar_factura(event) {
        event.preventDefault();
        let body = {
            idcobro: this.props.match.params.id,
        }
        this.setState({
            visible_cobro: true,
            loading: true,
        });

        httpRequest('post', ws.wscobranza + '/show_data_factura', body)
        .then(result => {
            if (result.response == 1) {

                this.setState({
                    venta_first: result.venta,
                    venta_detalle: result.venta_detalle,
                    planpago: result.planpago,
                    config_cliente: result.configcliente,
                    idventa: result.idventa,
                });

                setTimeout(() => {
                    document.getElementById('imprimir_factura').submit();
                    this.setState({
                        visible_cobro: false,
                        loading: false,
                    });
                }, 800);

            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
            message.error(strings.message_error);
        });
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
                <Redirect to={routes.cobranza_index} />
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
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">
                <Confirmation
                    visible={this.state.visible_imprimir}
                    loading={this.state.loading}
                    title="Recibo Cobro"
                    width={500}
                    content={this.componentReciboVenta()}
                    footer={false}
                />
                <Confirmation
                    visible={this.state.visible_cobro}
                    title="Cobro"
                    loading={this.state.loading}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Cargando Informacion...?
                            </label>
                        </div>
                    }
                />
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
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                <Input
                                    title="Total Venta"
                                    value={this.state.totalventa}
                                    readOnly={true}
                                    permisions={this.permisions.total_venta}
                                    style={{ textAlign: 'right' }}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '10px'}}>
                                <Input
                                    title="Saldo"
                                    value={(this.state.totalventa - this.state.pagos).toFixed(2)}
                                    readOnly={true}
                                    permisions={this.permisions.saldo}
                                    style={{ textAlign: 'right' }}
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
                                    style={{ textAlign: 'right' }}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <Input
                                    title="Total Cuotas"
                                    value={this.state.totalpago.toFixed(2)}
                                    readOnly={true}
                                    style={{ textAlign: 'right' }}
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

                                <form target="_blank" method="post" action={routes.cobranza_recibo} id="imprimir_recibo" style={{display: 'none'}} >
                                    <input type="hidden" value={_token} name="_token" />
                                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                    <input type="hidden" value={x_login} name="x_login" />
                                    <input type="hidden" value={x_fecha} name="x_fecha" />
                                    <input type="hidden" value={x_hora} name="x_hora" />
                                    <input type="hidden" value={token} name="authorization" />
                                    
                                    <input type="hidden" value={conexion} name="x_conexion" />
                                    <input type="hidden" value={this.props.match.params.id} name="id" />
                                    <input type="hidden" value={usuario} name="usuario" />

                                </form>

                                <form target="_blank" id='imprimir_factura' method="post" action={routes.reporte_venta_factura} >

                                    <input type="hidden" value={_token} name="_token" />
                                    <input type="hidden" value={conexion} name="x_conexion" />
                                    <input type="hidden" value={usuario} name="usuario" />

                                    <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                    <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                    <input type="hidden" value={x_login} name="x_login" />
                                    <input type="hidden" value={x_fecha} name="x_fecha" />
                                    <input type="hidden" value={x_hora} name="x_hora" />
                                    <input type="hidden" value={token} name="authorization" />
                                    <input type="hidden" value={JSON.stringify(this.permisions)} name="permisos" />
                                    <input type="hidden" value={(this.state.clienteesabogado)?'A':'V'} name="clienteesabogado" />

                                    <input type='hidden' value={this.state.idventa} name='idventa' />

                                    <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                                    <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                                    <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                                    <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                                </form>


                                {(this.state.facturacion == null && this.state.fkidtipocontacredito == 1 && 
                                    this.state.facturarsiempre != 'N' && this.state.ventaendospasos)?
                                    <C_Button
                                        title={'Generar Factura'}
                                        type='primary'
                                        onClick={this.generar_recibo.bind(this)}
                                    />:null
                                }

                                {(this.state.facturacion != null && this.state.ventaendospasos && this.state.fkidtipocontacredito == 1)?
                                    <C_Button
                                        title={'Volver Imprimir Factura'}
                                        type='primary'
                                        onClick={this.generar_factura.bind(this)}
                                    />:null
                                }

                                <C_Button type='primary'
                                    title='Imprimir Nota'
                                    onClick={this.imprimirNotaRecibo.bind(this)}
                                />
                                <C_Button onClick={() => this.setState({redirect: true})}
                                    title='Atras' type='danger'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}    