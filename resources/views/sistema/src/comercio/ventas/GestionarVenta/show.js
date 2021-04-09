import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

import { TreeSelect,message,notification,
        Icon,Modal,Button,Card,Divider, Table} from 'antd';
import Item from 'antd/lib/list/Item';
import ShowVehiculoHistoria from '../../taller/GestionarVehiculoHistoria/ShowVehiculoHistoria';
import ShowParteVehiculo from '../../taller/GestionarParteVehiculo/ShowParteVehiculo';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import {columns} from '../../../utils/columnsTable';
import CSelect from '../../../componentes/select2';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString, convertYmdToDmy } from '../../../utils/toolsDate';
import C_Input from '../../../componentes/data/input';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import C_CheckBox from '../../../componentes/data/checkbox';

const confirm = Modal.confirm;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;

class ShowVenta extends Component {
    constructor(props){
        super(props)
        this.state = {
            ventas: [],
            visible: false,
            visible_venta: false,
            
            visible_imprimir: false,
            loading_imprimir: false,

            arrayDatosPersonales:[],
            arrayDetalleVenta:[],
            arrayDetalleListaPrecio:[],
            dataTableProd: [],
            dataTableCuotas: [],
            arrayPlanPago: [],
            subTotalVenta : '',
            totalVenta:'',
            descuentoVenta:'',
            recargoVenta:'',
            vehiculoHistoria: null,
            vehiculoPartes: [],
            verPlanPago: false,
            textBtnPlan: 'Mostrar Plan de Pago',
            visibleModalVerHistorial: false,

            visibleModalVerPartes: false,
            nroVenta: -1,
            placaVehiculo: '',
            descrpVehiculo: '',
            comisionVendedor: 0,

            visibleModalVerPartes: false,
            noSesion: false,
            configHistorialVeh: false,
            configPartesVeh: false,
            configCredito: false,
            configCodigo: false,
            configTitleVend: '',
            clienteesabogado: 'V',
            facturarsiempre: 'N',

            checked_imprimir_ok: false,
            checked_imprimir_cancel: true,

            checked_generarfactura_ok: true,
            checked_generarfactura_cancel: false,
            idtipocontacredito: '',
            nitcliente: '',
            namecliente: '',

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            factura: {},

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            factura: {},
            facturacion: null,
            ventaendospasos: false,

            valor_cambio: 1,
            sw_factura: 0,
        }

        this.permisions = {
            codigo: readPermisions(keys.venta_input_codigo),
            anticipo: readPermisions(keys.venta_input_anticipo),
            fecha: readPermisions(keys.venta_fecha),
            sucursal: readPermisions(keys.venta_select_sucursal),
            almacen: readPermisions(keys.venta_select_almacen),
            add_cli: readPermisions(keys.venta_btn_agragarCliente),
            show_cli: readPermisions(keys.venta_btn_verCliente),
            cli_cod: readPermisions(keys.venta_input_search_codigoCliente),
            cli_nomb: readPermisions(keys.venta_input_search_nombreCliente),
            cli_nit: readPermisions(keys.venta_input_search_nitCliente),
            veh_cod_id: readPermisions(keys.venta_select_search_codigoVehiculo),
            veh_placa: readPermisions(keys.venta_select_search_placaVehiculo),
            veh_desc: readPermisions(keys.venta_input_descripcionVehiculo),
            moneda: readPermisions(keys.venta_select_moneda),
            vend_cod: readPermisions(keys.venta_input_search_codigoVendedor),
            vend_nomb: readPermisions(keys.venta_input_search_nombreVendedor),
            vend_comision: readPermisions(keys.venta_input_comisionVendedor),
            lista_precio: readPermisions(keys.venta_select_search_listaPrecios),
            t_prod_cod: readPermisions(keys.venta_tabla_columna_codigoProducto),
            t_prod_desc: readPermisions(keys.venta_tabla_columna_producto),
            t_cantidad: readPermisions(keys.venta_tabla_columna_cantidad),
            t_lista_precios: readPermisions(keys.venta_tabla_columna_listaPrecio),
            t_precio_unit: readPermisions(keys.venta_tabla_columna_precioUnitario),
            t_descuento: readPermisions(keys.venta_tabla_columna_descuento),
            observaciones: readPermisions(keys.venta_textarea_observaciones),
            recargo: readPermisions(keys.venta_input_recargo),
            descuento: readPermisions(keys.venta_input_descuento),
            sub_total: readPermisions(keys.venta_input_subTotal),
            btn_historial_veh: readPermisions(keys.venta_btn_historialVehiculo),
            btn_partes_veh: readPermisions(keys.venta_btn_partesVehiculo),
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getConfigsFabrica();
        this.getVenta();
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios,
                    ventaendospasos: result.configcliente.ventaendospasos,
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                    clienteesabogado: (result.configcliente.clienteesabogado == true)?'A':'V',
                    facturarsiempre: result.configcliente.facturarsiempre,
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

    getConfigsFabrica() {
        httpRequest('get', ws.wsconfigfabrica)
        .then((result) => {
            if (result.response == 1) {
                if (result.data.comtallervehiculoparte) {
                    this.getPartesVehiculo();
                }
                if (result.data.comtallervehiculohistoria) {
                    this.getHistorialVehiculo();
                }
                this.setState({
                    configCredito: result.data.comventasventaalcredito,
                    configPartesVeh: result.data.comtallervehiculoparte,
                    configHistorialVeh: result.data.comtallervehiculohistoria
                })
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

    cargarProductos(data, listaPrecio) {

        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            let total = parseFloat(data[i].preciounit) - parseFloat(data[i].factor_desc_incre);
            array.push({
                key: i,
                CodProd: data[i].codproducto,
                Producto: data[i].descripcion,
                UnidMed: data[i].abreviacion,
                Cantidad: data[i].cantidad,
                Lista: listaPrecio[i].listadescripcion,
                PrecioUni: data[i].preciounit,
                Desc: data[i].factor_desc_incre,
                PrecioTotal: total
            });
        }
        this.setState({
            dataTableProd: array
        });
        
    }

    cargarCuotas(data) {
        
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                Nro: i + 1,
                Descripcion: data[i].descripcion,
                'Fecha a Cobrar': convertYmdToDmy(data[i].fechaapagar),
                'Monto a Pagar': parseFloat(data[i].montoapagar).toFixed(2),
                'Monto a Cobrar': (data[i].montoapagar - data[i].montocobrado).toFixed(2),
                Estado: data[i].estado == 'I' ? 'Debe' : 'Cancelado'
            });
        }
        this.setState({
            dataTableCuotas: array
        });
    }

    getPartesVehiculo() {
        httpRequest('get', ws.wsgetpartesvehiculo + '/' + this.props.match.params.id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vehiculoPartes: result.data
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

    getHistorialVehiculo() {
        httpRequest('get', ws.wsgethistorialvehiculo + '/' + this.props.match.params.id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vehiculoHistoria: result.data
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
    
    getVenta() {
        httpRequest('get', ws.wsventa + '/'+ this.props.match.params.id + '/edit')
        .then(result => {
            if (result.response == 1) {
                this.cargarCuotas(result.datosPlan);
                this.setState({
                    facturacion: result.factura,
                    arrayDatosPersonales: result.data,
                    valor_cambio: result.data.length > 0 ? result.data[0].tc == 0 ? 1 : result.data[0].tc : 1,

                    idtipocontacredito: result.data.length > 0 ? result.data[0].fkidtipocontacredito : '',
                    nitcliente: result.data.length > 0 ? result.data[0].nit == null ? '' : result.data[0].nit : '',
                    namecliente: result.data.length > 0 ? 
                        result.data[0].apellidocliente == null ? result.data[0].nombrecliente: 
                            result.data[0].nombrecliente + ' ' + result.data[0].apellidocliente : '',

                    arrayDetalleListaPrecio: result.datosDetallePrecio,
                    arrayDetalleVenta: result.datosDetalle,
                    arrayPlanPago: result.datosPlan,
                    nroVenta: result.data[0].idventa,
                    placaVehiculo: result.vehiculo.placa,
                    descrpVehiculo: result.vehiculo.tipo,
                    comisionVendedor: result.data[0].tomarcomisionvendedor,
                    sw_factura: 1,
                });
                var subtotal = 0;
                for (let i = 0; i < result.datosDetalle.length;i++) {
                    let cantidad = parseInt(result.datosDetalle[i].cantidad);
                    let preciounit = parseFloat(result.datosDetalle[i].preciounit);
                    let descuento = (preciounit * (parseFloat(result.datosDetalle[i].factor_desc_incre) * cantidad))/100;
                    var total = cantidad * preciounit - descuento;
                    subtotal = subtotal + total;

                }
                var totalgeneral = subtotal - ((subtotal * parseFloat(result.data[0].descuentoporcentaje)) / 100) + ((subtotal * parseFloat(result.data[0].recargoporcentaje)) / 100);
                this.setState({
                    subTotalVenta:subtotal,
                    totalVenta:totalgeneral,
                    descuentoVenta:result.data[0].descuentoporcentaje,
                    recargoVenta:result.data[0].recargoporcentaje
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    detalleVenta() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        if (this.state.arrayDetalleVenta.length > 0) {
            const listasPrecios = this.state.arrayDetalleListaPrecio;
            return(
                <>
                <Divider>Productos</Divider>
                <div className="table-detalle" 
                    style={{ 
                        width: '90%',
                        margin: 'auto',
                        overflow: 'auto',
                        marginBottom: 15,
                    }}
                >
                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                { this.permisions.t_prod_cod.visible == 'A' ? <th>Codigo</th> : null }
                                { this.permisions.t_prod_desc.visible == 'A' ? <th>Descripcion</th> : null }
                                { isAbogado != 'A' ? <th>Unidad</th> : null }
                                { this.permisions.t_cantidad.visible == 'A' ? <th>Cantidad</th> : null }
                                { this.permisions.t_lista_precios.visible == 'A' ? <th>Lista</th> : null }
                                { this.permisions.t_precio_unit.visible == 'A' ? <th>Precio Uni</th> : null }
                                { this.permisions.t_descuento.visible == 'A' ? <th>Desc</th> : null }
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.arrayDetalleVenta.map((item, key) => {
                                let descuento = (parseFloat(item.preciounit) * parseFloat(item.factor_desc_incre)) / 100;
                                let total = (parseFloat(item.preciounit) * parseInt(item.cantidad)) - descuento;
                                let codigo = item.idproducto;
                                if (this.state.configCodigo) {
                                    codigo = item.codproducto == null ? '' : item.codproducto;
                                }
                                return (
                                    <tr key={key}>
                                        { this.permisions.t_prod_cod.visible == 'A' ? (<td>{codigo}</td>) : null }
                                        { this.permisions.t_prod_desc.visible == 'A' ? <td>{item.descripcion}</td> : null }
                                        { isAbogado != 'A' ? <td>{item.unidadmedida}</td> : null }
                                        { this.permisions.t_cantidad.visible == 'A' ? <td>{item.cantidad}</td> : null }
                                        { this.permisions.t_lista_precios.visible == 'A' ? <td>{item.listadescripcion}</td> : null }
                                        { this.permisions.t_precio_unit.visible == 'A' ? <td>{item.preciounit}</td> : null }
                                        { this.permisions.t_descuento.visible == 'A' ? <td>{item.factor_desc_incre}</td> : null }
                                        <td>{total}</td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
                </>
            )
        }
    }

    mostrarPlanPago() {

        if (this.state.verPlanPago) {
            this.setState({
                verPlanPago: false,
                textBtnPlan: 'Mostrar Plan de Pago'
            });
        } else {
            this.setState({
                verPlanPago: true,
                textBtnPlan: 'Ocultar Plan de Pago'
            });
        }
    }

    detallePlanPago() {
        if (this.state.verPlanPago) {
            return (
                <div className="form-group-content"
                    style={{ overflow: 'scroll', height: 200 }}
                >
                    <Table
                        bordered
                        dataSource={this.state.dataTableCuotas}
                        columns={columns.ventaCuotas}
                        pagination={false}
                        style={{
                            width: '80%',
                            //height: 400,
                            overflow: 'auto',
                            margin: 'auto',
                            marginTop: 15,
                        }}
                    />
                </div>
            )
        }
        return null;
    }

    componentButtonPlanPago() {
        let det = this.state.arrayDetalleVenta;
        let b = (det.length > 0 && det[0].fkidtipocontacredito == 2) ? true : false;
        if (b > 0 && this.state.configCredito) {
            return (
                <C_Button
                    title={this.state.textBtnPlan}
                    onClick={() => this.mostrarPlanPago()}
                />
                /*
                <button 
                    type="buttom" 
                    className="btns btns-primary" 
                    style={{ border: '2px solid #e8e8e8'}}
                    onClick={() => this.mostrarPlanPago()}>
                    {this.state.textBtnPlan}
                </button>
                */
            )
        }
        return null;
    }

    closeModalVerHistorial() {
        this.setState({
            visibleModalVerHistorial: false,
        });
    }

    closeModalVerPartes() {
        this.setState({
            visibleModalVerPartes: false,
        });
    }

    showHistorialVehiculo() {
        if (this.state.vehiculoHistoria != null) {
            this.setState({
                visibleModalVerHistorial: true,
            });
        } else {
            message.warning('La venta no tiene historial de vehiculo');
        }
    }

    showPartesVehiculo() {
        if (this.state.vehiculoPartes.length > 0) {
            this.setState({
                visibleModalVerPartes: true,
            });
        } else {
            message.warning('La venta no tiene partes de vehiculo');
        }
    }

    btnHistorial() {
        if (this.permisions.btn_historial_veh.visible == 'A' && this.state.configHistorialVeh) {
            return (
                <C_Button
                    title={'Historial Vehiculo'}
                    type='primary'
                    onClick={this.showHistorialVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    btnPartes() {
        if (this.permisions.btn_partes_veh.visible == 'A' && this.state.configPartesVeh) {
            return (
                <C_Button
                    title={'Partes de Vehiculo'}
                    type='primary'
                    onClick={this.showPartesVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    generar_recibo() {
        this.setState({
            visible_imprimir: true,
        });
    }

    generar_factura(event) {
        event.preventDefault();
        let body = {
            idventa: this.props.match.params.id,
            bandera: 1,
        }
        this.setState({
            visible_venta: true,
            loading_imprimir: true,
        });

        httpRequest('post', ws.wsdetalleventashow_recibo, body)
        .then(result => {
            if (result.response == 1) {

                this.setState({
                    venta_first: result.venta,
                    venta_detalle: result.venta_detalle,
                    planpago: result.planpago,
                    config_cliente: result.configcliente,
                    factura: result.factura,
                });

                setTimeout(() => {
                    document.getElementById('imprimir_factura').submit();
                    this.setState({
                        visible_venta: false,
                        loading_imprimir: false,
                    });
                }, 400);

            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
            message.error(strings.message_error);
        });
    }

    generar_notaventa(event) {
        event.preventDefault();

        this.setState({
            visible_venta: true,
            loading_imprimir: true,
        });
        let body = {
            idventa: this.props.match.params.id,
            bandera: 0,
        }

        httpRequest('post', ws.wsdetalleventashow_recibo, body)
        .then(result => {
            if (result.response == 1) {

                this.setState({
                    venta_first: result.venta,
                    venta_detalle: result.venta_detalle,
                    planpago: result.planpago,
                    config_cliente: result.configcliente,
                    factura: result.factura,
                });

                setTimeout(() => {
                    document.getElementById('imprimir_recibo').submit();
                    this.setState({
                        visible_venta: false,
                        loading_imprimir: false,
                    });
                }, 400);

            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
            message.error(strings.message_error);
        });
    }

    componentReciboVenta() {
        return (
            <div className="forms-groups">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">

                    {(this.state.facturarsiempre == 'P' || this.state.facturarsiempre == 'S')?
                    
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
            loading_imprimir: true,
        });
        setTimeout(() => {
            this.setState({
                visible_imprimir: false,
                loading_imprimir: false,
            });
        }, 300);
    }

    ongenerarRecibo(event) {
        event.preventDefault();

        this.setState({
            loading_imprimir: true,
        });

        if (this.state.checked_imprimir_ok || this.state.checked_generarfactura_ok) {

            let body = {
                idventa: this.props.match.params.id,
                facturarsiempre: this.state.facturarsiempre,
                nitcliente: this.state.nitcliente,
                namecliente: this.state.namecliente,
                fkidtipocontacredito: this.state.idtipocontacredito,
                generarfactura: this.state.checked_generarfactura_ok?'A':'N',
                bandera: 1,
            }

            httpRequest('post', ws.wsdetalleventa_recibo, body)
            .then(result => {
                if (result.response == 1) {

                    this.setState({
                        venta_first: result.venta,
                        venta_detalle: result.venta_detalle,
                        planpago: result.planpago,
                        config_cliente: result.configcliente,
                        factura: result.factura,
                        facturacion: result.factura,
                    });

                    if (result.bandera == 1) {
                        notification.error({
                            message: 'Advertencia',
                            description:
                                'No se puede generar la factura. La fecha Limite de emision expiro ...',
                        });
                    }
                    
                    if (this.state.facturarsiempre == 'S') {
                        if (result.bandera == 1) {
                            setTimeout(() => {
                                document.getElementById('imprimir_recibo').submit();
                            }, 1000);
                        }else {
                            document.getElementById('imprimir_factura').submit();
                        }
                    }else {
                        if (this.state.checked_generarfactura_ok) {
                            if (result.bandera == 1) {
                                setTimeout(() => {
                                    document.getElementById('imprimir_recibo').submit();
                                }, 1000);
                            }else {
                                document.getElementById('imprimir_factura').submit();
                            }
                        }else {
                            document.getElementById('imprimir_recibo').submit();
                        }
                    }

                    this.setState({
                        visible_imprimir: false,
                        loading_imprimir: false,
                    });

                } else if (result.response == -2) {
                    this.setState({ noSesion: true, });
                } else {
                    console.log('Ocurrio un problema en el servidor');
                    this.setState({
                        loading_imprimir: false,
                    })
                }
            }).catch(error => {
                message.error(strings.message_error);
            });

        }else {
            this.setState({
                loading_imprimir: false,
            });
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

    render(){
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
            
        if(this.state.noSesion){
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        if(this.state.redirect === true){
            return (<Redirect to={routes.venta_index} />)
        }
        const detallePlanPago = this.detallePlanPago();
        const componentButtonPlanPago = this.componentButtonPlanPago();
        const btnHistorial = this.btnHistorial();
        const btnPartes = this.btnPartes();
        const conexion = readData(keysStorage.connection);
        let tipo = '';
        let fullnameCliente = '';
        let fullnameVendedor = '';
        let fulldate = '';
        if (this.state.arrayDatosPersonales.length > 0) {
            tipo = this.state.arrayDatosPersonales[0].fkidtipocontacredito == 2 ? 'Credito' : 'Contado';
            let apellido = this.state.arrayDatosPersonales[0].apellidocliente == null ? '' : this.state.arrayDatosPersonales[0].apellidocliente;
            fullnameCliente =  this.state.arrayDatosPersonales[0].nombrecliente + ' ' + apellido;  
            apellido = this.state.arrayDatosPersonales[0].apellidovendedor == null ? '' : this.state.arrayDatosPersonales[0].apellidovendedor;
            fullnameVendedor = this.state.arrayDatosPersonales[0].nombrevendedor + ' ' + apellido;
            fulldate = convertYmdToDmy(this.state.arrayDatosPersonales[0].fecha) + ' ' + this.state.arrayDatosPersonales[0].hora;
        }

        let notas = '';
        if (this.state.arrayDetalleVenta.length > 0) {
            notas = this.state.arrayDetalleVenta[0].notas == null ? ''  : this.state.arrayDetalleVenta[0].notas;
        }
        let codigoVenta = this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].idventa : '';
        if (this.state.configCodigo && this.state.arrayDatosPersonales.length > 0) {
            codigoVenta = this.state.arrayDatosPersonales[0].codventa == null ? codigoVenta : this.state.arrayDatosPersonales[0].codventa;
        }
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';
        return (
            <div className='rows'>
                <Confirmation
                    visible={this.state.visible_imprimir}
                    loading={this.state.loading_imprimir}
                    title="Recibo Venta"
                    width={500}
                    content={this.componentReciboVenta()}
                    footer={false}
                />
                <Confirmation
                    visible={this.state.visible_venta}
                    title="Venta"
                    loading={this.state.loading_imprimir}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Cargando Nota de Venta?
                            </label>
                        </div>
                    }
                />
                <Modal
                    title="Historial Vehiculo"
                    visible={this.state.visibleModalVerHistorial}
                    onOk={this.closeModalVerHistorial.bind(this)}
                    footer={null}
                    onCancel={this.closeModalVerHistorial.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    bodyStyle={{
                        height: HEIGHT_WINDOW,  
                    }}
                >
                    <ShowVehiculoHistoria
                        vehiculoHistoria={this.state.vehiculoHistoria}
                        precio={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].mtototventa : ''}
                        callback={this.closeModalVerHistorial.bind(this)}
                    />
                </Modal>
                <Modal
                    title="Partes del Vehiculo"
                    visible={this.state.visibleModalVerPartes}
                    onOk={this.closeModalVerPartes.bind(this)}
                    footer={null}
                    onCancel={this.closeModalVerPartes.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    bodyStyle={{
                        height: HEIGHT_WINDOW,  
                    }}
                >
                    
                    <ShowParteVehiculo
                        vehiculoPartes={this.state.vehiculoPartes}
                        callback={this.closeModalVerPartes.bind(this)}
                    />
                </Modal>
                
                <div className="cards">
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="pulls-left">
                                <h1 className="lbls-title">Detalle Venta</h1>
                            </div>
                            <div className="pulls-right">
                                <C_Input 
                                    value={'TC: ' + parseFloat(this.state.valor_cambio).toFixed(2) }
                                    readOnly={true}
                                    className=''
                                    style={{width: 100, background: 'none', textAlign: 'right', paddingRight: 10, }}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                            <C_Input 
                                title="Codigo"
                                value={codigoVenta}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />

                            <C_Input 
                                title="Fecha"
                                value={fulldate}
                                readOnly={true}
                                permisions={this.permisions.fecha}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />

                            <C_Input 
                                title="Sucursal"
                                value={this.state.arrayDatosPersonales.length > 0 ? 
                                        this.state.arrayDatosPersonales[0].tipoempresa == null ? 'S/N' : this.state.arrayDatosPersonales[0].tipoempresa == 'N' ? 
                                        this.state.arrayDatosPersonales[0].nombrecomercial == null ? 'S/N' : this.state.arrayDatosPersonales[0].nombrecomercial :
                                        this.state.arrayDatosPersonales[0].razonsocial == null ? 'S/N' : this.state.arrayDatosPersonales[0].razonsocial
                                    : ""
                                }
                                readOnly={true}
                                permisions={this.permisions.sucursal}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />

                            <C_Input 
                                title="Almacen"
                                value={this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].almacen: ""}
                                readOnly={true}
                                permisions={this.permisions.almacen}
                                className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            />
                            
                        </div>

                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                        <C_Input 
                            title="Cliente"
                            value={fullnameCliente}
                            readOnly={true}
                            permisions={this.permisions.cli_nomb}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                        />

                        <C_Input 
                            title="Nit"
                            value={this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nit: ""}
                            readOnly={true}
                            permisions={this.permisions.cli_nit}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                        />

                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3"></div>
                        <C_Input 
                            title="Placa Vechiculo"
                            value={this.state.placaVehiculo}
                            readOnly={true}
                            permisions={this.permisions.veh_placa}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                        />

                        <C_Input 
                            title="Vehiculo"
                            value={this.state.descrpVehiculo}
                            readOnly={true}
                            permisions={this.permisions.veh_desc}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                        />
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                        <C_Input 
                            title={this.state.configTitleVend}
                            value={fullnameVendedor}
                            readOnly={true}
                            permisions={this.permisions.vend_nomb}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                        />

                        <C_Input 
                            title="Comision"
                            value={this.state.comisionVendedor + '%'}
                            readOnly={true}
                            permisions={this.permisions.vend_comision}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            style={{ textAlign: 'right' }}
                        />
                        
                        {/* <C_Input 
                            title="Lista de Precio"
                            value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].listadescripcion: ""}
                            readOnly={true}
                            permisions={this.permisions.lista_precio}
                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal'
                        /> */}
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <div className="cols-lg-1 cols-md-1"></div>
                        
                        <C_Input 
                            title="Moneda"
                            value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""}
                            readOnly={true}
                            permisions={this.permisions.moneda}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                        />

                        <C_Input 
                            title="Anticipo"
                            value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].anticipo: ""}
                            readOnly={true}
                            permisions={this.permisions.anticipo}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                            style={{ textAlign: 'right' }}
                        />

                        <C_Input 
                            title="Tipo de Venta"
                            value={tipo}
                            readOnly={true}
                            //permisions={permisionsCo}
                            className='cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal'
                        />  
                    </div>

                    {this.detalleVenta()}

                    <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                        <C_TextArea 
                            title="Notas"
                            value={notas}
                            readOnly={true}
                            permisions={this.permisions.observaciones}
                            className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom'
                        />
                    </div>
                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Input
                                title="SubTotal"
                                value={this.state.subTotalVenta}
                                readOnly={true}
                                style={{ textAlign: 'right' }}
                                permisions={this.permisions.sub_total}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Input
                                title="Descuento"
                                value={this.state.descuentoVenta}
                                readOnly={true}
                                permisions={this.permisions.descuento}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Input
                                title="Recargo"
                                value={this.state.recargoVenta}
                                readOnly={true}
                                permisions={this.permisions.recargo}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <Input
                                title="Total"
                                value={this.state.totalVenta}
                                readOnly={true}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                    </div>
                    
                    
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            { componentButtonPlanPago }

                            { this.state.vehiculoHistoria == null ? null : btnHistorial }

                            { this.state.vehiculoPartes.length == 0 ? null : btnPartes }
                            
                        </div>
                    </div>
                    
                    { this.detallePlanPago() }

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            <form target="_blank" method="post" action={routes.reporte_venta_recibo} 
                                style={{display: 'none'}} id='imprimir_recibo'
                            >

                                <input type="hidden" value={_token} name="_token" />
                                <input type="hidden" value={x_idusuario} name="x_idusuario" />
                                <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                                <input type="hidden" value={x_login} name="x_login" />
                                <input type="hidden" value={x_fecha} name="x_fecha" />
                                <input type="hidden" value={x_hora} name="x_hora" />
                                <input type="hidden" value={token} name="authorization" />

                                <input type="hidden" value={conexion} name="x_conexion" />
                                <input type="hidden" value={usuario} name="usuario" />
                                <input type="hidden" value={JSON.stringify(this.permisions)} name="permisos" />
                                <input type="hidden" value={this.state.clienteesabogado} name="clienteesabogado" />

                                <input type="hidden" value={this.props.match.params.id} name="idventa" />
                                <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                                <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                                <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                                <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                            </form>

                            <form target="_blank" id='imprimir_factura' method="post" action={routes.reporte_venta_factura} 
                                style={{display: 'none'}}
                            >

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

                                <input type='hidden' value={this.props.match.params.id} name='idventa' />

                                <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                                <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                                <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                                <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                            </form>

                            {(this.state.facturacion != null && this.state.facturarsiempre != 'N' && this.state.sw_factura == 1)?
                                <C_Button
                                    title={'Volver Imprimir Factura'}
                                    type='primary'
                                    onClick={this.generar_factura.bind(this)}
                                />:null
                            }

                            {(this.state.facturacion == null && this.state.facturarsiempre != 'N' && this.state.sw_factura == 1)?
                                <C_Button
                                    title={'Generar Factura'}
                                    type='primary'
                                    onClick={this.generar_recibo.bind(this)}
                                />:null
                            }

                            <C_Button
                                title={'Imprimir Nota Venta'}
                                type='primary'
                                onClick={this.generar_notaventa.bind(this)}
                            />

                            <C_Button
                                title={'Aceptar'}
                                type='danger'
                                onClick={() => this.props.history.goBack() }
                            />
                        </div>
                        
                    </div>
                
                </div>
            </div>
                    
        )
    }
}

export default withRouter(ShowVenta);