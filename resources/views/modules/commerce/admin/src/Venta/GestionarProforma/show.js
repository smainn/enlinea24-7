import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import { TreeSelect,message,Modal,Button,Divider} from 'antd';
import Item from 'antd/lib/list/Item';
import ShowVehiculoHistoria from '../../Taller/GestionarVehiculoHistoria/ShowVehiculoHistoria';
import ShowParteVehiculo from '../../Taller/GestionarParteVehiculo/ShowParteVehiculo';
import ws from '../../../tools/webservices';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import C_Button from '../../../components/data/button';

const confirm = Modal.confirm;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
export default class ShowProforma extends Component {
    constructor(props){
        super(props)
        this.state = {
            ventas:[],
            visible:false,
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
            configCodigo: false
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
            btn_partes_veh: readPermisions(keys.proforma_btn_partesVehiculo)
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
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
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
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getProforma() {

        httpRequest('get', ws.wsventa + '/' + this.props.match.params.id+'/edit')
        .then(result => {
            if (result.response == 1) {
                console.log(result);
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
                console.log(result);
            }

        }).catch(error => {
            console.log(error)
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
                        width: '80%',
                        marginLeft: '10%',
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
                                let total = parseFloat(item.preciounit) - parseFloat(item.factor_desc_incre);
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
    detallePlanPago() {
        if (this.state.verPlanPago) {
            return (
                <div className="form-group-content">
                    <div className="col-lg-12-content">
                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <label 
                                className='label-content-modal text-center-content'> 
                                Nro Cuotas  
                            </label>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label 
                            className='label-content-modal text-center-content'> 
                                Descripcion
                            </label>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal text-center-content'> 
                                Fecha a Cobrar
                            </label>
                        </div>
                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <label 
                            className='label-content-modal text-center-content'> 
                                Monto a Cobrar  
                            </label>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label 
                            className='label-content-modal text-center-content'> 
                                Saldo  
                            </label>
                        </div>
                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <label 
                                className='label-content-modal text-center-content'> 
                                Estado 
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-12-content"
                        style={{ height: 250, overflow: 'scroll' }}>
                        {
                            this.state.arrayPlanPago.map((value, index) => {
                                let estado = value.estado == 'I' ? 'Debe' : 'Pagado';
                                return (
                                    <div className="col-lg-12-content">
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {index + 1}  
                                            </label>
                                        </div>
                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {value.descripcion}
                                            </label>
                                        </div>
                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {value.fechaapagar}
                                            </label>
                                        </div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {value.montoapagar} 
                                            </label>
                                        </div>
                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {value.montoapagar - value.montopagado}  
                                            </label>
                                        </div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label> 
                                                {estado} 
                                            </label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
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

    render(){
        //console.log('render')
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        if (this.state.redirect === true) {
            return (<Redirect to="/commerce/admin/proforma/index" />)
        }
        const detallePlanPago = this.detallePlanPago();
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
            fecha = this.state.arrayDatosPersonales[0].fecha + ' ' + this.state.arrayDatosPersonales[0].hora;
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
                            <div className="pulls-right">
                                <C_Button
                                    title='Atras'
                                    type='primary'
                                    onClick={() => this.setState({redirect: true})}
                                />
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
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
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
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
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
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <Input 
                                    value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].listadescripcion: ""}
                                    title='Lista'
                                    readOnly={true}
                                    permisions={this.permisions.lista_precios}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3 cols-sm-4 cols-xs-12">
                                <Input 
                                    value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""}
                                    title='Moneda'
                                    readOnly={true}
                                    permisions={this.permisions.moneda}
                                />
                            </div>
                            {/*}
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input
                                    title="Anticipo"
                                    value={this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].anticipo: ""}
                                    readOnly={true}
                                    //permisions={permisionsAnti}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input
                                    title="Tipo Contado o Credito"
                                    value={tipo}
                                    readOnly={true}
                                    //permisions={permisionsTipo}
                                />
                            </div>   
                            */}
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

                                {/*<div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <label className='label-content-modal label-group-content-nwe '>SubTotal:</label>
                                </div>*/}
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.subTotalVenta}
                                        readOnly={true}
                                        title="SubTotal"
                                    />
                                </div>

                                {/*<div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <label className='label-content-modal label-group-content-nwe '>Descuento:</label>
                                </div>*/}
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.descuentoVenta}
                                        readOnly={true}
                                        title="Descuento"
                                        permisions={this.permisions.descuento}
                                    />
                                </div>

                                {/*<div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <label className='label-content-modal label-group-content-nwe'>Recargo:</label>
                            </div>*/}
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                    <Input 
                                        value={this.state.recargoVenta}
                                        readOnly={true}
                                        title="Recargo"
                                        permisions={this.permisions.recargo}
                                    />
                                </div>

                                {/*<div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <label className='label-content-modal label-group-content-nwe '>Total:</label>
                        </div>*/}
                                <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12">
                                    <Input 
                                        value={this.state.totalVenta}
                                        readOnly={true}
                                        title="Total"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="text-center-content">
                                
                                { btnHistorial }

                                { btnPartes }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}