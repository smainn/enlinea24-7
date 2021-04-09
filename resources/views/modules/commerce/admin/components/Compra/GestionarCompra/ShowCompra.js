import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect, BrowserRouter as  Link } from 'react-router-dom';
import { Modal, message, DatePicker, Select, Divider } from 'antd';
import { wscompra} from '../../../WS/webservices';
import { dateToString, hourToString } from '../../../tools/toolsDate';

const { Option } = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

let now = new Date();
export default class ShowCompra extends Component {
    constructor(){
        super();
        this.state = {
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
            productos: [],
            textButtomPlanPago: 'Motrar Plan de Pago',
            mostarplanpago: false,
            redirect: false
        }
    }

    componentDidMount() {
        this.getCompra();
        this.getProductos();
    }

    getCompra() {
        axios.get(wscompra + '/' + this.props.match.params.id)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT ', result);
            if (result.response > 0) {
                this.setState({
                    codigo: result.data.codcompra,
                    fecha: result.data.fecha,
                    hora: result.data.hora,
                    anticipo: result.data.anticipopagado,
                    estado: result.data.estado,
                    tipo: result.data.tipo == 'R' ? 'Credito' : 'Contado',
                    notas: result.data.notas,
                    proveedor: result.data.proveedor,
                    listaCuotas: result.data.planpagos
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getProductos() {
        axios.get(wscompra + '/' + this.props.match.params.id + '/productos')
        .then((resp) => {
            let result = resp.data;
            console.log('GET PRODUCTOS ', result);
            if (result.response > 0) {
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
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onClickBtnPlanPago() {
        if (this.state.mostarplanpago === true) {
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
                        className="btn-content btn-success-content"
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
                <div 
                    className="form-group-content"
                    style={{ marginLeft: WIDTH_WINDOW*0.1 }}
                >
                    <div className="col-lg-9-content">
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Nro Cuotas</label>
                        </div>
                        <div className="col-lg-3-content">
                            <label className="label-content-modal">Descripcion</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Fecha a Cobrar</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Monto a Cobrar</label>
                        </div>
                        <div className="col-lg-1-content">
                            <label className="label-content-modal">Saldo</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Estado</label>
                        </div>
                    </div>
                    <div className="col-lg-9-content"
                        style={{ height: 200, overflow: 'scroll' }}
                    >
                        {
                            this.state.listaCuotas.map((item, key) => {
                                let estado = item.estado == 'I' ? 'Debe' : 'Pagado';
                                return (
                                    <div>
                                        <div className="col-lg-2-content">
                                            <label>{key + 1}</label>
                                        </div>
                                        <div className="col-lg-3-content">
                                            <label>{item.descripcion}</label>
                                        </div>
                                        <div className="col-lg-2-content">
                                            <label>{item.fechadepago}</label>
                                        </div>
                                        <div className="col-lg-2-content">
                                            <label>{item.montoapagar}</label>
                                        </div>
                                        <div className="col-lg-1-content">
                                            <label>{item.montoapagar - item.montopagado}</label>
                                        </div>
                                        <div className="col-lg-2-content">
                                            <label>{estado}</label>
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

    componentTituloPlanPago() {
        if (this.state.tipo == 'Credito') {
            return (
                <Divider orientation='left'>Plan de Pago</Divider>
            )
        }
        return null;
    }
 
    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/commerce/admin/compra/index/"/>
            )
        }
        const componentButtomPlanPago = this.componentButtomPlanPago();
        const componentPlanPago = this.componentPlanPago();
        const componentTituloPlanPago = this.componentTituloPlanPago();
        return (
            <div>
                <div className="form-group-content">
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe'>
                            Codigo:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.codigo}
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe'>
                            Fecha:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.fecha}
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Hora:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.hora} 
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Anticipo:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.anticipo} 
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Proveedor:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.proveedor.nombre + ' ' +this.state.proveedor.apellido} 
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Notas:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.notas} 
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Sucursal:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.sucursal} 
                        </label>
                    </div>
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Almacen:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.almacen} 
                        </label>
                    </div>   
                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>
                            Tipo:
                        </label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                        <label>
                            {this.state.tipo} 
                        </label>
                    </div>   
                </div>
                <Divider orientation='left'>Productos</Divider>
                <div 
                    className="from-group-content"
                    style={{marginLeft: WIDTH_WINDOW * 0.1}}
                >
                    <div className="col-lg-12-content">
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Cod/Id</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Producto</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">U Medida</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Costo Uni</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Cantidad</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Total</label>
                        </div>
                    </div>
                    
                        {
                            this.state.productos.map((item, key) => (
                                <div key={key} className="col-lg-12-content">
                                    <div className="col-lg-2-content">
                                        <label>{item.idproducto}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.descripcion}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.unidadmed}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.costounit}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.cantidad}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{ item.cantidad * item.costounit }</label>
                                    </div>
                                </div>
                            ))
                        }
                        <Divider />
                    <div className="col-lg-12-content">
                        <div className="col-lg-2-content">
                        </div>
                        <div className="col-lg-2-content">
                        </div>
                        <div className="col-lg-2-content">
                        </div>
                        <div className="col-lg-2-content">
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">Total Final</label>
                        </div>
                        <div className="col-lg-2-content">
                            <label>{this.state.total}</label>
                        </div>
                    </div>   
                </div>
                { componentTituloPlanPago }
                
                { componentButtomPlanPago }
                { componentPlanPago }
            </div>
        )
    }

}