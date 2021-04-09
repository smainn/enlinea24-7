import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { Modal, message, DatePicker, Select, Divider, Table, notification } from 'antd';
import ws from '../../../utils/webservices';
import { dateToString, hourToString, convertYmdToDmy, convertDmyToYmd } from '../../../utils/toolsDate';
import Input from '../../../componentes/input';
import { columns } from '../../../utils/columnsTable';
import TextArea from '../../../componentes/textarea';

import keys from '../../../utils/keys';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import { readPermisions } from '../../../utils/toolsPermisions';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import keysStorage from '../../../utils/keysStorage';
import Confirmation from '../../../componentes/confirmation';
import C_Input from '../../../componentes/data/input';
import QrReader from 'react-qr-reader';
import C_DatePicker from '../../../componentes/data/date';
import AddQr from './addQr';

const { Option } = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

let now = new Date();

class ShowCompra extends Component {
    constructor(props){
        super(props);
        this.state = {
            nro: 0,
            fechaActual: '',
            codigo: '',
            fecha: '',
            hora: '',
            anticipo: 0,
            notas: '',
            estado: '',
            tipo: '',
            total: 0,
            sucursal: '',
            almacen: '',
            proveedor: {
                nombre: '',
                apellido: '',
            },
            listaCuotas: [],
            dataTableCuotas: [],
            productos: [],
            moneda: '',
            textButtomPlanPago: 'Motrar Plan de Pago',
            mostarplanpago: false,
            redirect: false,
            noSesion: false,
            configCodigo: false,

            visible_imprimir: false,
            loading_imprimir: false,

            compra: {},
            compradetalle: [],
            planpago: [],
            config_cliente: {},

            nitproveedor: '',
            nrofacturaprov: '',
            nroautorizacionprov: '',
            fechafacturaprov: '',
            montofactprov: '',
            codigocontrol: '',
            nitclientefact: '',
            confactura: 'N',

            visible_generarFactura: false,
            loading_generarFactura: false,

            visible_generarQr: false,
            loading_generarQr: false,
        }

        this.permisions = {
            ver_nro: readPermisions(keys.compra_ver_nro),
            ver_fecha: readPermisions(keys.compra_ver_fecha),
            codigo: readPermisions(keys.compra_input_codigo),
            sucursal: readPermisions(keys.compra_select_sucursal),
            almacen: readPermisions(keys.compra_select_almacen),
            moneda: readPermisions(keys.compra_select_moneda),
            agregar_proveedor : readPermisions(keys.compra_btn_agregarProveedor),
            ver_proveedor: readPermisions(keys.compra_btn_verProveedor),
            codigo_proveedor: readPermisions(keys.compra_input_search_codigoProveedor),
            nombre_proveedor: readPermisions(keys.compra_input_search_nombreProveedor),
            nit_proveedor: readPermisions(keys.compra_input_nitProveedor),
            plan_pago: readPermisions(keys.compra_select_planPago),
            fecha: readPermisions(keys.compra_fecha),
            hora: readPermisions(keys.compra_hora),
            col_codigo_prod: readPermisions(keys.compra_tabla_columna_codigoProducto),
            col_producto: readPermisions(keys.compra_tabla_columna_producto),
            col_cantidad: readPermisions(keys.compra_tabla_columna_cantidad),
            col_costo_unit: readPermisions(keys.compra_tabla_columna_costoUnitario),
            notas: readPermisions(keys.compra_textarea_nota),
            total: readPermisions(keys.compra_input_total)
        }
    }

    componentDidMount() {
        this.getProductos();
        this.getCompra();
    }

    cargarCuotas(data) {
        
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                Nro: i + 1,
                Descripcion: data[i].descripcion,
                'Fecha a Cobrar': convertYmdToDmy(data[i].fechadepago),
                //'Monto a Cobrar': data[i].montoapagar,
                monto_pagar: data[i].montoapagar,
                'Deuda': data[i].sumtotalpagado,
                Estado: data[i].estado == 'I' ? 'Debe' : 'Cancelado'
            });
        }
        this.setState({
            dataTableCuotas: array
        });
    }

    getCompra() {
        httpRequest('get', ws.wscompra + '/' + this.props.match.params.id)
        .then((result) => {
            console.log( result )
            if (result.response == 1) {
                this.cargarCuotas(result.data.planpagos);
                let codigo = result.data.idcompra;
                if (this.state.configCodigo) {
                    codigo = result.data.codcompra == null ? '' : result.data.codcompra;
                }
                this.setState({
                    codigo: codigo,
                    fecha: convertYmdToDmy(result.data.fecha),
                    hora: result.data.hora,
                    anticipo: result.data.anticipopagado,
                    estado: result.data.estado,
                    tipo: result.data.tipo == 'R' ? 'Credito' : 'Contado',
                    notas: result.data.notas,
                    proveedor: result.data.proveedor,
                    listaCuotas: result.data.planpagos,
                    moneda: result.data.moneda == null ? '' : result.data.moneda.descripcion,
                    nro: result.data.idcompra,
                    fechaActual: result.data.created_at,
                    configCodigo: result.config_cliente.codigospropios,

                    nitproveedor: result.data.nitproveedor == null ? '' : result.data.nitproveedor,
                    nrofacturaprov: result.data.nrofacturaprov == null ? '' : result.data.nrofacturaprov,
                    nroautorizacionprov: result.data.nroautorizacionprov == null ? '' : result.data.nroautorizacionprov,
                    fechafacturaprov: result.data.fechafacturaprov == null ? '' : convertYmdToDmy(result.data.fechafacturaprov),
                    montofactprov: result.data.montofactprov == null ? 0 : result.data.montofactprov,
                    codigocontrol: result.data.codigocontrol == null ? '' : result.data.codigocontrol,
                    nitclientefact: result.data.nitclientefact == null ? '' : result.data.nitclientefact,
                    confactura: result.data.confactura == null ? 'N' : result.data.confactura,

                });

            } else if (result.response == -2) {

                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);

            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getProductos() {
        httpRequest('get', ws.wscompra + '/' + this.props.match.params.id + '/productos')
        .then((result) => {
            if (result.response == 1) {
                let array = result.data;
                let total = 0;
                let sucursal = '';
                let almacen = '';
                for (let i = 0; i < array.length; i++) {
                    total = total + array[i].cantidad * array[i].costounit;
                    sucursal = array[i].sucursal;
                    almacen = array[i].almacen;
                }
                this.setState({
                    productos: array,
                    total: total,
                    sucursal: sucursal,
                    almacen: almacen
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onClickBtnPlanPago() {
        if (this.state.mostarplanpago) {
            this.setState({ 
                mostarplanpago: false,
                textButtomPlanPago: 'Mostrar Plan de Pago'
            });
        } else {
            this.setState({ 
                mostarplanpago: true,
                textButtomPlanPago: 'Ocultar Plan de Pago'
            });
        }
    }

    componentButtomPlanPago() {
        if (this.state.tipo == 'Credito') {
            return (
                <div className="form-group-content">
                    <C_Button
                        title={this.state.textButtomPlanPago}
                        onClick={() => this.onClickBtnPlanPago()}
                    />
                    {/*}
                    <button
                        className="btns btns-primary"
                        onClick={() => this.onClickBtnPlanPago()}
                    >
                        {this.state.textButtomPlanPago}
                    </button>
                    */}
                </div>
            )
        } 
        return null;
        
    }

    componentPlanPago() {
        if (this.state.mostarplanpago) {
            return (
                <div className="form-group-content"
                    style={{ overflowY: 'scroll', height: 200 }}
                >
                    <Table
                        bordered
                        dataSource={this.state.dataTableCuotas}
                        columns={columns.compraCuotas}
                        pagination={false}
                        style={{
                            width: '70%',
                            height: 300,
                            marginLeft: '15%',
                            overflow: 'auto'
                        }}
                    />
                </div>
            )
        }
        return null;
    }


    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }

    generar_notacompra() {
        let body = {
            idcompra: this.props.match.params.id,
        }
        this.setState({
            visible_imprimir: true,
            loading_imprimir: true,
        });
        httpRequest('post', ws.wscompra + '/generar_recibo', body)
            .then(result => {
                //console.log(result)
                if (result.response == 1) {
                    this.setState({
                        compra: result.compra,
                        compradetalle: result.compradetalle,
                        planpago: result.planpago,
                        config_cliente: result.config_cliente,
                    });

                    setTimeout(() => {
                        document.getElementById('imprimir_recibo').submit()
                    }, 1000);

                    setTimeout(() => {
                        this.setState({
                            loading_imprimir: false,
                            visible_imprimir: false,
                        });
                    }, 1200);
                    
                } else if (result.response == -2) {
                    notification.error({
                        message: 'Sesion',
                        description:
                            'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                    });
                    setTimeout(() => {
                        this.setState({ noSesion: true, });
                    }, 300);
                } else {
                    message.error('Ocurrio un problema en el servidor. Favor de intentar Nuevamente.');
                    this.setState({
                        loading_imprimir: false,
                        visible_imprimir: false,
                    });
                }
            }).catch(error => {
                message.error(strings.message_error);
                this.setState({
                    loading_imprimir: false,
                    visible_imprimir: false,
                });
            });
    }

    onRegistrarFactura() {
        if ( this.state.nitproveedor.toString().trim().length == 0 ) {
            message.error( 'Nit Proveedor requerido.' );
            return;
        }
        if ( this.state.nrofacturaprov.toString().trim().length == 0 ) {
            message.error( 'Nro Factura requerido.' );
            return;
        }
        if ( this.state.nroautorizacionprov.toString().trim().length == 0 ) {
            message.error( 'Nro Autorización requerido.' );
            return;
        }
        if ( this.state.fechafacturaprov.toString().trim().length == 0 ) {
            message.error( 'Fecha Factura requerido.' );
            return;
        }
        if ( this.state.montofactprov.toString().trim().length == 0 ) {
            message.error( 'Monto total Facturado requerido.' );
            return;
        }
        if ( parseFloat(this.state.montofactprov) <= 0 ) {
            message.error( 'El Monto total Facturado debe ser mayor a 0.' );
            return;
        }
        if ( this.state.codigocontrol.toString().trim().length == 0 ) {
            message.error( 'Código Control requerido.' );
            return;
        }
        if ( this.state.nitclientefact.toString().trim().length == 0 ) {
            message.error( 'Nit Cliente requerido.' );
            return;
        }
        this.setState({
            loading_generarFactura: true,
        });
        let body = {
            nitproveedor: this.state.nitproveedor,
            nrofactura: this.state.nrofacturaprov,
            nroautorizacion: this.state.nroautorizacionprov,
            fechafactura: convertDmyToYmd(this.state.fechafacturaprov),
            montototalfacturado: this.state.montofactprov,
            codigocontrol: this.state.codigocontrol,
            nitcliente: this.state.nitclientefact,
            idcompra: this.props.match.params.id,
        };
        console.log(body)
        httpRequest('post', ws.wscompra + '/storeFactura', body)
        .then((result) => {
            console.log(result)
            if (result.response == 1) {
                this.setState({
                    nitproveedor: result.data.nitproveedor == null ? '' : result.data.nitproveedor,
                    nrofacturaprov: result.data.nrofacturaprov == null ? '' : result.data.nrofacturaprov,
                    nroautorizacionprov: result.data.nroautorizacionprov == null ? '' : result.data.nroautorizacionprov,
                    fechafacturaprov: result.data.fechafacturaprov == null ? '' : convertYmdToDmy(result.data.fechafacturaprov),
                    montofactprov: result.data.montofactprov == null ? 0 : result.data.montofactprov,
                    codigocontrol: result.data.codigocontrol == null ? '' : result.data.codigocontrol,
                    nitclientefact: result.data.nitclientefact == null ? '' : result.data.nitclientefact,
                    confactura: result.data.confactura == null ? 'N' : result.data.confactura,
                });
                notification.success({
                    message: 'COMPRA EXITOSA',
                    description: 'Se guardo correctamente la factura...',
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        }).finally( () => {
            this.setState({
                loading_generarFactura: false,
                visible_generarFactura: false,
            })
        } );
    }

    componentRegistroFactura() {
        if ( !this.state.visible_generarFactura ) return null;
        if ( this.state.confactura == 'S' ) {
            return (
                <Confirmation
                    visible={this.state.visible_generarFactura}
                    loading={this.state.loading_generarFactura}
                    title={ "Detalle Factura" }
                    zIndex={700} style={{ top: 30, }}
                    width={600}
                    content={
                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Nit del Proveedor'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.nitproveedor }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Nro. de la factura'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.nrofacturaprov }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Nro. de autorización'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.nroautorizacionprov }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Fecha de la factura'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_DatePicker
                                    allowClear={true} title=''
                                    value={this.state.fechafacturaprov}
                                    readOnly={true}
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Monto total Facturado'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.montofactprov }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'Código de control'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.codigocontrol }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={'NIT del Cliente'}
                                    style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                    readOnly={true}
                                />
                                <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                    value={ this.state.nitclientefact }
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div style={{textAlign: 'center', paddingRight: 5, }}>
                                    <C_Button
                                        title={'Aceptar'}
                                        type='danger'
                                        onClick={ () => {
                                            this.setState({
                                                visible_generarFactura: false,
                                            });
                                        } }
                                    /> 
                                </div>
                            </div>
                        </div>
                    }
                    footer={false}
                />
            );
        }
        const qrRef = React.createRef();
        return (
            <Confirmation
                visible={this.state.visible_generarFactura}
                loading={this.state.loading_generarFactura}
                title={ "Registrar Factura" }
                zIndex={700} style={{ top: 30, }}
                width={600}
                content={
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nit del Proveedor'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.nitproveedor }
                                onChange={ (value) => {
                                    this.setState({
                                        nitproveedor: value,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nro. de la factura'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.nrofacturaprov }
                                onChange={ (value) => {
                                    this.setState({
                                        nrofacturaprov: value,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Nro. de autorización'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.nroautorizacionprov }
                                onChange={ (value) => {
                                    this.setState({
                                        nroautorizacionprov: value,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Fecha de la factura'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_DatePicker
                                allowClear={true} title=''
                                value={this.state.fechafacturaprov}
                                onChange={ ( date ) => {
                                    this.setState({
                                        fechafacturaprov: date,
                                    });
                                } }
                                className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Monto total Facturado'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.montofactprov }
                                onChange={ (value) => {
                                    if ( value == "" ) {
                                        this.setState({
                                            montofactprov: value,
                                        });
                                        return;
                                    }
                                    if ( !isNaN( value ) ) {
                                        this.setState({
                                            montofactprov: value,
                                        });
                                    }
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'Código de control'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.codigocontrol }
                                onChange={ (value) => {
                                    this.setState({
                                        codigocontrol: value,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{ marginBottom: 5, }}>
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={'NIT del Cliente'}
                                style={{ textAlign: 'right', paddingRight: 10, background: 'transparent', border: 'none' }}
                                readOnly={true}
                            />
                            <C_Input className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                value={ this.state.nitclientefact }
                                onChange={ (value) => {
                                    this.setState({
                                        nitclientefact: value,
                                    });
                                } }
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'center', }}>
                                <C_Button
                                    title={'Web Scan QR '}
                                    type='primary'
                                    onClick={ () => {
                                        this.setState({
                                            visible_generarQr: true,
                                        });
                                    } }
                                />
                                <C_Button
                                    title={'Leer Imagen Qr'}
                                    type='danger'
                                    onClick={ () => {
                                        qrRef.current.openImageDialog();
                                    } }
                                /> 
                                <C_Button
                                    title={' Cargar Manual '}
                                    type='primary'
                                    onClick={ () => {
                                        this.setState({
                                            nitproveedor: this.state.proveedor.nit == null ? '' : this.state.proveedor.nit,
                                            nrofacturaprov: '',
                                            nroautorizacionprov: '',
                                            fechafacturaprov: this.state.fecha,
                                            montofactprov: this.state.total,
                                            codigocontrol: '',
                                            nitclientefact: '',
                                        });
                                    } }
                                />
                                <QrReader 
                                    ref={ qrRef }
                                    delay={300} style={{ width: 200, height: 200, margin: 'auto', display: 'none', }}
                                    onError={ (error) => {
                                        console.log('Error scam')
                                        console.log(error)
                                    } }
                                    onScan={ ( result ) => {
                                        
                                        console.log(result)
                                        if ( result ) {
                                            let data = result.split('|');
                                            if ( data.length >= 8 ) {
                                                this.setState({
                                                    visible_generarQr: false,
                                                    nitproveedor: data[0],
                                                    nrofacturaprov: data[1],
                                                    nroautorizacionprov: data[2],
                                                    fechafacturaprov: convertYmdToDmy( data[3], '/' ),
                                                    montofactprov: data[4],
                                                    codigocontrol: data[6],
                                                    nitclientefact: data[7],
                                                });
                                                return;
                                            } else {
                                                message.warning(' Qr inválido ')
                                            }
                                        } else {
                                            message.error( 'Imagen Inválido.' );
                                        }
                                        
                                    } }
                                    legacyMode
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{textAlign: 'center', paddingRight: 5, }}>
                                <C_Button
                                    title={'Guardar Factura Compra'}
                                    type='primary'
                                    onClick={ this.onRegistrarFactura.bind(this) }
                                /> 
                                <C_Button
                                    title={'Salir sin guardar'}
                                    type='danger'
                                    onClick={ () => {
                                        this.setState({
                                            nitproveedor: '',
                                            nrofacturaprov: '',
                                            nroautorizacionprov: '',
                                            fechafacturaprov: '',
                                            montofactprov: '',
                                            codigocontrol: '',
                                            nitclientefact: '',
                                            visible_generarFactura: false,
                                        });
                                    } }
                                /> 
                            </div>
                        </div>
                    </div>
                }
                footer={false}
            />
        );
    }

    componentGenerarQr() {
        if ( !this.state.visible_generarQr ) return null;
        return (
            <AddQr 
                visible={ this.state.visible_generarQr }
                loading={ this.state.loading_generarQr }
                onSanWebCan={ (result) => {
                    console.log(result)
                    if ( result ) {
                        let data = result.split('|');
                        if ( data.length >= 8 ) {
                            this.setState({
                                visible_generarQr: false,
                                nitproveedor: data[0],
                                nrofacturaprov: data[1],
                                nroautorizacionprov: data[2],
                                fechafacturaprov: convertYmdToDmy( data[3], '/' ),
                                montofactprov: data[4],
                                codigocontrol: data[6],
                                nitclientefact: data[7],
                            });
                            return;
                        } else {
                            message.warning(' Qr inválido ')
                        }
                    } else {
                        message.error( 'Imagen Inválido.' );
                    }
                    this.setState({
                        visible_generarQr: false,
                    });
                } }
                onCancel={ () => {
                    this.setState({
                        visible_generarQr: false,
                    });
                } }
            />
        );
    }
 
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }

        if (this.state.redirect) {
            return (
                <Redirect to={routes.compra_index} />
            );
        }
        const componentButtomPlanPago = this.componentButtomPlanPago();
        const componentPlanPago = this.componentPlanPago();
        let apellido = this.state.proveedor.apellido == undefined ? '' : this.state.proveedor.apellido;
        let fulldate = this.state.fecha + ' ' + this.state.hora;
        let provcod = this.state.proveedor.idproveedor;

        if (this.state.configCodigo) {
            provcod = this.state.proveedor.codproveedor == null ? '' : this.state.proveedor.codproveedor;
        }

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());

        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        const usuario = user == undefined ? null : user.apellido == null ? user.nombre : user.nombre + ' ' + user.apellido;

        return (
            <div className="rows">

                { this.componentRegistroFactura() }
                { this.componentGenerarQr() }

                <Confirmation
                    visible={this.state.visible_imprimir}
                    title="Nota de Compra"
                    loading={this.state.loading_imprimir}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Cargando Nota de Venta?
                            </label>
                        </div>
                    }
                />

                <form target="_blank" id='imprimir_recibo' method="post" action={routes.reporte_compra_recibo} >

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

                    <input type="hidden" value={JSON.stringify(this.state.compra)} name="compra_first" />
                    <input type="hidden" value={JSON.stringify(this.state.compradetalle)} name="compra_detalle" />
                    <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                    <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                </form>

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Detalle Compra</h1>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Codigo"
                                    value={this.state.codigo}
                                    readOnly={true}
                                    permisions = {this.permisions.codigo}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Fecha"
                                    value={fulldate}
                                    readOnly={true}
                                    permisions = {this.permisions.fecha}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Anticipo"
                                    value={this.state.anticipo} 
                                    readOnly={true}
                                    style={{ textAlign: 'right' }}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Almacen"
                                    value={this.state.almacen} 
                                    readOnly={true}
                                    permisions={this.permisions.almacen}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Codigo"
                                    value={provcod} 
                                    readOnly={true}
                                    permisions={this.permisions.codigo_proveedor}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Proveedor"
                                    value={this.state.proveedor.nombre + ' ' + apellido}
                                    readOnly={true}
                                    permisions={this.permisions.nombre_proveedor}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Nit"
                                    value={this.state.proveedor.nit == null ? '' : this.state.proveedor.nit} 
                                    readOnly={true}
                                    permisions={this.permisions.nit_proveedor}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Sucursal"
                                    value={this.state.sucursal} 
                                    readOnly={true}
                                    permisions = {this.permisions.sucursal}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Tipo"
                                    value={this.state.tipo} 
                                    readOnly={true}
                                    permisions = {this.permisions.plan_pago}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Moneda"
                                    value={this.state.moneda} 
                                    readOnly={true}
                                    permisions = {this.permisions.moneda}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <TextArea
                                    title="Notas"
                                    value={this.state.notas == null ? '' : this.state.notas}
                                    readOnly={true}
                                    permisions = {this.permisions.notas}
                                />
                            </div>
                            
                        </div>
                        <Divider>Productos</Divider>
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
                                        <th>Codigo</th>
                                        <th>Producto</th>
                                        <th>Unidad</th>
                                        <th>Costo Unitario</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.productos.map((item, key) => {
                                        let total = parseFloat(item.preciounit) - parseFloat(item.factor_desc_incre);
                                        let codigo = (this.state.configCodigo) ? item.codproducto : item.idproducto;
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{codigo}</td>
                                                <td>{item.descripcion}</td>
                                                <td>{item.unidadmed}</td>
                                                <td>{item.costounit}</td>
                                                <td>{item.cantidad}</td>
                                                <td>{ item.cantidad * item.costounit }</td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                            <div className="inputs-groups">
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                    <label className="label-content-modal label-group-content-nwe label-group-margenRigth">Total Final</label>
                                </div>
                                <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2">
                                    <label>{this.state.total}</label>
                                </div>
                            </div>
                        </div>  

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            { componentButtomPlanPago }
                            <div className="txts-center">
                                <C_Button
                                    title='Atras'
                                    type='danger'
                                    onClick={() => this.props.history.goBack()}
                                />
                                <C_Button
                                    title={ this.state.confactura == 'S' ? 'Mostrar Factura' : 'Registrar Factura' }
                                    type='primary'
                                    onClick={ () => {
                                        this.setState({
                                            visible_generarFactura: true,
                                        });
                                    } }
                                />
                                <C_Button
                                    title={'Imprimir Nota de Compra'}
                                    type='primary'
                                    onClick={this.generar_notacompra.bind(this)}
                                />
                            </div>
                        </div>
                        { componentPlanPago }
                        
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(ShowCompra);
