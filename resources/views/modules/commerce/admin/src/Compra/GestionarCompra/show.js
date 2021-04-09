import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';
import { Modal, message, DatePicker, Select, Divider, Table } from 'antd';
import ws from '../../../tools/webservices';
import { dateToString, hourToString } from '../../../tools/toolsDate';
import Input from '../../../components/input';
import { columns } from '../../../tools/columnsTable';
import TextArea from '../../../components/textarea';

import keys from '../../../tools/keys';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import { readPermisions } from '../../../tools/toolsPermisions';
import C_Button from '../../../components/data/button';

const { Option } = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

let now = new Date();
export default class ShowCompra extends Component {
    constructor(){
        super();
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
            proveedor: {},
            listaCuotas: [],
            dataTableCuotas: [],
            productos: [],
            moneda: '',
            textButtomPlanPago: 'Motrar Plan de Pago',
            mostarplanpago: false,
            redirect: false,
            noSesion: false,
            configCodigo: false
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
        this.getConfigsClient();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getProductos();
                this.getCompra();
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    cargarCuotas(data) {
        
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            array.push({
                key: i,
                Nro: i + 1,
                Descripcion: data[i].descripcion,
                'Fecha a Cobrar': data[i].fechadepago,
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
            if (result.response == 1) {
                this.cargarCuotas(result.data.planpagos);
                let codigo = result.data.idcompra;
                if (this.state.configCodigo) {
                    codigo = result.data.codcompra == null ? '' : result.data.codcompra;
                }
                this.setState({
                    codigo: codigo,
                    fecha: result.data.fecha,
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
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
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
                    <button
                        className="btns btns-primary"
                        onClick={() => this.onClickBtnPlanPago()}
                    >
                        {this.state.textButtomPlanPago}
                    </button>
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
 
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }

        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/compra/"/>
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
        return (
            <div className="rows">
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
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Almacen"
                                    value={this.state.almacen} 
                                    readOnly={true}
                                    permisions = {this.permisions.almacen}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Codigo"
                                    value={provcod} 
                                    readOnly={true}
                                    permisions = {this.permisions.codigo_proveedor}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Proveedor"
                                    value={this.state.proveedor.nombre + ' ' + apellido}
                                    readOnly={true}
                                    permisions = {this.permisions.nombre_proveedor}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    title="Nit"
                                    value={this.state.proveedor.nit} 
                                    readOnly={true}
                                    permisions = {this.permisions.nit_proveedor}
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
                                        <th>Cantidad</th>
                                        <th>Costo Unitario</th>
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
                                    type='primary'
                                    onClick={() => this.setState({redirect: true})}
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