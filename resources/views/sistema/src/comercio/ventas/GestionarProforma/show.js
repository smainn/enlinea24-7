import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import { TreeSelect,message,Modal,Button,Divider} from 'antd';
import Item from 'antd/lib/list/Item';
import ShowVehiculoHistoria from '../../taller/GestionarVehiculoHistoria/ShowVehiculoHistoria';
import ShowParteVehiculo from '../../taller/GestionarParteVehiculo/ShowParteVehiculo';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import { convertYmdToDmy, dateToString, hourToString } from '../../../utils/toolsDate';
import Confirmation from '../../../componentes/confirmation';
import keysStorage from '../../../utils/keysStorage';

const confirm = Modal.confirm;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
export default class ShowProforma extends Component {
    constructor(props){
        super(props)
        this.state = {

            ventas:[],
            visible:false,

            visible_imprimir: false,
            loading: false,

            arrayDatosPersonales:[],
            arrayDetalleVenta:[],
            arrayDetalleListaPrecio:[],
            subTotalVenta : '',
            totalVenta:'',
            descuentoVenta:'',
            recargoVenta:'',
            verPlanPago: false,
            textBtnPlan: 'Mostrar Plan de Pago',
            redirect: false,
            vehiculoHistoria: {
                descripcion: '',
                placa: '',
                fecha: '',
                nombre: '',
                apellido: '',
                diagnosticoentrada: '',
                trabajoshechos: '',
                kmactual: '',
                kmproximo: '',
                fechaproxima: '',
                notas: ''
            },
            placaVehiculo: '',
            descrpVehiculo: '',
            comisionVendedor: 0,
            vehiculoPartes: [],
            visibleModalVerHistorial: false,
            visibleModalVerPartes: false,
            noSesion: false,
            configCodigo: false,

            venta_first: {},
            venta_detalle: [],
            planpago: [],
            config_cliente: {},
            idventa: null,
        }

        this.permisions = {
            btn_add_cli: readPermisions(keys.proforma_btn_agregarCliente),
            btn_ver_cli: readPermisions(keys.proforma_btn_verCliente),
            codigo: readPermisions(keys.proforma_input_codigo),
            fecha: readPermisions(keys.proforma_fecha),
            sucursal: readPermisions(keys.proforma_select_sucursal),
            almacen: readPermisions(keys.proforma_select_almacen),
            cli_cod: readPermisions(keys.proforma_input_search_codigoCliente),
            cli_nomb: readPermisions(keys.proforma_input_search_nombreCliente),
            cli_nit: readPermisions(keys.proforma_input_nitCliente),
            vehiculo_cod: readPermisions(keys.proforma_select_search_codigoVehiculo),
            vehiculo_placa: readPermisions(keys.proforma_select_search_placaVehiculo),
            vehiculo_descrp: readPermisions(keys.proforma_input_descripcionVehiculo),
            vend_cod: readPermisions(keys.proforma_input_search_codigoVendedor),
            vend_nomb: readPermisions(keys.proforma_input_search_nombreVendedor),
            vend_comision: readPermisions(keys.proforma_input_comisionVendedor),
            lista_precios: readPermisions(keys.proforma_select_search_listaPrecios),
            moneda: readPermisions(keys.proforma_select_moneda),
            t_prod_cod: readPermisions(keys.proforma_tabla_columna_codigoProducto),
            t_prod_desc: readPermisions(keys.proforma_tabla_columna_producto),
            t_cantidad: readPermisions(keys.proforma_tabla_columna_cantidad),
            t_lista_precios: readPermisions(keys.proforma_tabla_columna_listaPrecio),
            t_precio_unitario: readPermisions(keys.proforma_tabla_columna_precioUnitario),
            t_descuento: readPermisions(keys.proforma_tabla_columna_descuento),
            observaciones: readPermisions(keys.proforma_textarea_observaciones),
            descuento: readPermisions(keys.proforma_input_descuento),
            recargo: readPermisions(keys.proforma_input_recargo),
            btn_historial_veh: readPermisions(keys.proforma_btn_historialVehiculo),
            btn_partes_veh: readPermisions(keys.proforma_btn_partesVehiculo),
            sub_total: readPermisions(keys.proforma_input_subTotal)
        }
    }

    componentDidMount(){
        this.getConfigsClient();
        this.getProforma();
        this.getHistorialVehiculo();
        this.getPartesVehiculo();
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios
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

    getProforma() {

        httpRequest('get', ws.wsventa + '/' + this.props.match.params.id+'/edit')
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    arrayDatosPersonales: result.data,
                    arrayDetalleListaPrecio: result.datosDetallePrecio,
                    arrayDetalleVenta: result.datosDetalle,
                    placaVehiculo: result.vehiculo.placa,
                    descrpVehiculo: result.vehiculo.tipo,
                    comisionVendedor: result.data[0].valorcomision
                });
                var subtotal = 0;
                for (let i = 0; i < result.datosDetalle.length;i++) {
                    let cantidad = parseInt(result.datosDetalle[i].cantidad);
                    let preciounit = parseFloat(result.datosDetalle[i].preciounit);
                    let descuento = (preciounit * (parseFloat(result.datosDetalle[i].factor_desc_incre) * cantidad))/100;
                    var total = cantidad * preciounit - descuento;
                    subtotal = subtotal + total

                }
                var totalgeneral = subtotal - ((subtotal * parseFloat(result.data[0].descuentoporcentaje)) / 100) + ((subtotal * parseFloat(result.data[0].recargoporcentaje)) / 100)

                this.setState({
                        subTotalVenta:subtotal,
                        totalVenta: totalgeneral,
                        descuentoVenta:result.data[0].descuentoporcentaje,
                        recargoVenta:result.data[0].recargoporcentaje
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }

        }).catch(error => {
            console.log(error)
            message.error(strings.message_error);
        })
    }

    detalleVenta() {

        if (this.state.arrayDetalleVenta.length > 0) {
            const listasPrecios = this.state.arrayDetalleListaPrecio;
            return(
                <>
                <Divider>Productos</Divider>
                <div 
                    className="table-detalle" 
                    style={{ 
                        width: '90%',
                        marginLeft: '5%',
                        overflow: 'auto'
                    }}>
                    <table className="table-response-detalle">
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Descripcion</th>
                                <th>Unidad</th>
                                <th>Cantidad</th>
                                <th>Lista</th>
                                <th>Precio Uni</th>
                                <th>Desc</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.arrayDetalleVenta.map((item, key) => {
                                let descuento = (parseFloat(item.preciounit) * parseFloat(item.factor_desc_incre)) / 100;
                                let total = (parseFloat(item.preciounit) * parseInt(item.cantidad)) - descuento;
                                return (
                                    <tr key={key}>
                                        <td>{item.codproducto}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.unidadmedida}</td>
                                        <td>{item.cantidad}</td>
                                        <td>{listasPrecios[key].listadescripcion}</td>
                                        <td>{item.preciounit}</td>
                                        <td>{item.factor_desc_incre}</td>
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
            message.warning('La proforma no tiene historial de vehiculo');
        }
    }

    showPartesVehiculo() {
        if (this.state.vehiculoPartes.length > 0) {
            this.setState({
                visibleModalVerPartes: true,
            });
        } else {
            message.warning('La proforma no tiene partes de vehiculo');
        }
    }

    btnHistorial() {
        if (this.permisions.btn_historial_veh.visible == 'A') {
            return (
                <C_Button
                    title='Historial Vehiculo'
                    type='primary'
                    onClick={this.showHistorialVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    btnPartes() {
        if (this.permisions.btn_partes_veh.visible == 'A') {
            return (
                <C_Button
                    title='Ver Partes de Vehiculo Vehiculo'
                    type='primary'
                    onClick={this.showPartesVehiculo.bind(this)}
                />
            );
        }
        return null;
    }

    generar_notaventa() {
        this.setState({
            visible_imprimir: true,
            loading: true,
        });
        let body = {
            idventa: this.props.match.params.id,
        }
        httpRequest('post', ws.wsproforma_recibo, body)
        .then(result => {
            if (result.response == 1) {

                this.setState({
                    venta_first: result.venta,
                    venta_detalle: result.venta_detalle,
                    planpago: result.planpago,
                    config_cliente: result.configcliente,
                });

                setTimeout(() => {
                    document.getElementById('imprimir_recibo').submit();
                    this.setState({
                        visible_imprimir: false,
                        loading: false,
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
    componentLoading() {
        return (
            <Confirmation
                visible={this.state.visible_imprimir}
                title="Nota de Proforma"
                loading={this.state.loading}
                width={400}
                content = {
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                        <label>
                            ¿Cargando Nota de proforma?
                        </label>
                    </div>
                }
            />
        );
    }

    render() {

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

        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';
        
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        if (this.state.redirect === true) {
            return (<Redirect to={routes.proforma_index} />)
        }
        let codventa = '';
        let fecha = '';
        let nombresucursal = '';
        let idcliente = '';
        let fullnameClient = '';
        let nit = '';
        let fullnameVend = '';
        let id = '';
        let tipo = '';
        if (this.state.arrayDatosPersonales.length > 0) {
            tipo = this.state.arrayDatosPersonales[0].fkidtipocontacredito == 2 ? 'Credito' : 'Contado';
            codventa = this.state.configCodigo ? this.state.arrayDatosPersonales[0].codventa : this.state.arrayDatosPersonales[0].idventa;
            fecha = convertYmdToDmy(this.state.arrayDatosPersonales[0].fecha) + ' ' + this.state.arrayDatosPersonales[0].hora;
            nombresucursal = this.state.arrayDatosPersonales[0].nombresucursal;
            idcliente = this.state.arrayDatosPersonales[0].idcliente;
            let nombreClient = this.state.arrayDatosPersonales[0].nombrecliente;
            let apellidoClient = this.state.arrayDatosPersonales[0].apellidocliente == null ? '' : this.state.arrayDatosPersonales[0].apellidocliente;
            fullnameClient = nombreClient + ' ' + apellidoClient;
            nit = this.state.arrayDatosPersonales[0].nit;
            let nombreVend = this.state.arrayDatosPersonales[0].nombrevendedor;
            let apellidoVend = this.state.arrayDatosPersonales[0].apellidovendedor == null ? '' : this.state.arrayDatosPersonales[0].apellidovendedor;
            fullnameVend = nombreVend + ' ' + apellidoVend;   
            id = this.state.arrayDatosPersonales[0].idventa;         
        }
        let almacen = '';
        if (this.state.arrayDetalleVenta.length > 0) {
            almacen = this.state.arrayDetalleVenta[0].almacen;
        }

        const btnHistorial = this.btnHistorial();
        const btnPartes = this.btnPartes();

        return (
            <div className="rows">
                {this.componentLoading()}
                <form target="_blank" id='imprimir_recibo' method="post" action={routes.reporte_proforma_recibo} style={{display: 'none'}}>

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

                    <input type='hidden' value={this.props.match.params.id} name='idventa' />

                    <input type="hidden" value={JSON.stringify(this.state.venta_first)} name="venta_first" />
                    <input type="hidden" value={JSON.stringify(this.state.venta_detalle)} name="venta_detalle" />
                    <input type="hidden" value={JSON.stringify(this.state.planpago)} name="planpago" />
                    <input type="hidden" value={JSON.stringify(this.state.config_cliente)} name="config_cliente" />

                </form>
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
                                <h1 className="lbls-title">Detalle Proforma</h1>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={codventa}
                                    title='Codigo'
                                    readOnly={true}
                                    permisions={this.permisions.codigo}
                                    //configAllowed={this.state.configCodigo}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">

                                <Input 
                                    value={fecha} 
                                    title='Fecha'
                                    readOnly={true}
                                    permisions={this.permisions.fecha}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={nombresucursal}
                                    title='Sucursal'
                                    readOnly={true}
                                    permisions={this.permisions.sucursal}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <Input 
                                    value={almacen} 
                                    title='Almacen'
                                    readOnly={true}
                                    permisions={this.permisions.almacen}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-6 cols-md-6 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={fullnameClient} 
                                    title='Cliente'
                                    readOnly={true}
                                    permisions={this.permisions.cli_nomb}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={nit}
                                    title='Nit'
                                    readOnly={true}
                                    permisions={this.permisions.cli_nit}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input
                                    title="Placa Vechiculo"
                                    value={this.state.placaVehiculo}
                                    readOnly={true}
                                    permisions={this.permisions.vehiculo_placa}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input
                                    title="Vechiculo"
                                    value={this.state.descrpVehiculo}
                                    readOnly={true}
                                    //permisions={permisionsVehDesc}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-6 cols-md-6 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={fullnameVend}
                                    title='Vendedor'
                                    readOnly={true}
                                    permisions={this.permisions.vend_nomb}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input
                                    title="Comsion"
                                    value={this.state.comisionVendedor}
                                    readOnly={true}
                                    permisions={this.permisions.vend_comision}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""}
                                    title='Moneda'
                                    readOnly={true}
                                    permisions={this.permisions.moneda}
                                />
                            </div>
                        </div>

                        {this.detalleVenta()}

                        <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <TextArea 
                                    value={this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].notas:""}
                                    title='Notas'
                                    readOnly={true}
                                    permisions={this.permisions.observaciones}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-12 cols-md-12 cols-xs-12">
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.subTotalVenta}
                                        readOnly={true}
                                        title="SubTotal"
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.descuentoVenta}
                                        readOnly={true}
                                        title="Descuento"
                                        permisions={this.permisions.descuento}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.recargoVenta}
                                        readOnly={true}
                                        title="Recargo"
                                        permisions={this.permisions.recargo}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.totalVenta}
                                        readOnly={true}
                                        title="Total"
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="text-center-content">

                                <C_Button
                                    title={'Imprimir Proforma'}
                                    type='primary'
                                    onClick={this.generar_notaventa.bind(this)}
                                />
                                <C_Button
                                    title='Aceptar'
                                    type='danger'
                                    onClick={() => this.setState({redirect: true})}
                                />
                                {/* { btnHistorial }
                                { btnPartes } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}