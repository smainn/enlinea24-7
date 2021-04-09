import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider} from 'antd';
import Item from 'antd/lib/list/Item';
const confirm = Modal.confirm;
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
            textBtnPlan: 'Mostrar Plan de Pago'
        }
    }

    componentWillMount(){
        axios.get('/commerce/api/venta/'+this.props.match.params.id+'/edit').then(response=>{
            if(response.data.response == 1){
                console.log('DATOS VENTA ', response.data);
                this.setState({
                    arrayDatosPersonales: response.data.data,
                    arrayDetalleListaPrecio: response.data.datosDetallePrecio,
                    arrayDetalleVenta: response.data.datosDetalle,
                });
                var subtotal = 0
                for(let i = 0; i < response.data.datosDetalle.length;i++){
                    let cantidad = parseInt(response.data.datosDetalle[i].cantidad);
                    let preciounit = parseFloat(response.data.datosDetalle[i].preciounit);
                    let descuento = (preciounit * (parseFloat(response.data.datosDetalle[i].factor_desc_incre) * cantidad))/100;
                    var total = cantidad * preciounit - descuento;
                    subtotal = subtotal + total

                }
                var totalgeneral = subtotal - ((subtotal * parseFloat(response.data.data[0].descuentoporcentaje)) / 100) + ((subtotal * parseFloat(response.data.data[0].recargoporcentaje)) / 100)
                console.log('sub total ',subtotal)
                console.log('total general ', totalgeneral)
                console.log('descuento general ', response.data.data[0].descuentoporcentaje)
                console.log('recargo general ', response.data.data[0].recargoporcentaje)
                this.setState({
                        subTotalVenta:subtotal,
                        totalVenta:totalgeneral,
                        descuentoVenta:response.data.data[0].descuentoporcentaje,
                        recargoVenta:response.data.data[0].recargoporcentaje
                })
            }
            console.log(response)
            console.log("array datos  personales",this.state.arrayDatosPersonales)

            console.log("array datos  detalle",this.state.arrayDetalleVenta)

            console.log("array datos  preciolist",this.state.arrayDetalleListaPrecio)

        }).catch(error => {
            console.log(error)
        })
    }
    detalleVenta(){
        if(this.state.arrayDetalleVenta.length > 0){

            return(
                <div className='form-group-content' >
                 <Divider orientation='left'>Detalles De Venta</Divider>
                            <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> CodProd  </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Producto  </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Unid. Med  </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Cantidad  </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Lista  </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Precio Unit  </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> %Desc  </label>
                            </div>  
                            <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Precio Total  </label>
                            </div>
                     <div className="caja-content caja-content-alturaView">
                            {this.state.arrayDetalleVenta.map((l,i) => {
                                let precioTotal = parseInt(l.cantidad) * parseFloat(l.preciounit);
                                let descuento = (precioTotal * parseFloat(l.factor_desc_incre))/ 100;
                                let total = precioTotal - descuento;
                                return (
                                    <div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.idproducto}  </label>
                                        </div>

                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.descripcion}  </label>
                                        </div>
                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.abreviacion}  </label>
                                        </div>

                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.cantidad}  </label>
                                        </div>
                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {this.state.arrayDetalleListaPrecio[i].listadescripcion}  </label>
                                        </div>

                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.preciounit}  </label>
                                        </div>
                                        <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {l.factor_desc_incre}  </label>
                                        </div>

                                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                            <label className='text-center-content'> {total} </label>
                                        </div>
                                        <Divider/>  

                                    </div>
                                )
                            })}
                    </div>
                </div>
            )
        }
    }

    mostrarPlanPago() {
        console.log('ONCLICK ACA');
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
    render(){
        //console.log('render')
        const detallePlanPago = this.detallePlanPago();
        let codventa = '';
        let fecha = '';
        let nombresucursal = '';
        let idcliente = '';
        let fullnameClient = '';
        let nit = '';
        let fullnameProve = '';
        if (this.state.arrayDatosPersonales.length > 0) {
            codventa = this.state.arrayDatosPersonales[0].codventa;
            fecha = this.state.arrayDatosPersonales[0].fecha;
            nombresucursal = this.state.arrayDatosPersonales[0].nombresucursal;
            idcliente = this.state.arrayDatosPersonales[0].idcliente;
            let nombreClient = this.state.arrayDatosPersonales[0].nombrecliente;
            let apellidoClient = this.state.arrayDatosPersonales[0].apellidocliente == null ? '' : this.state.arrayDatosPersonales[0].apellidocliente;
            fullnameClient = nombreClient + ' ' + apellidoClient;
            nit = this.state.arrayDatosPersonales[0].nit;
            let nombreProve = this.state.arrayDatosPersonales[0].nombrevendedor;
            let apellidoProve = this.state.arrayDatosPersonales[0].apellidovendedor == null ? '' : this.state.arrayDatosPersonales[0].apellidovendedor;
            fullnameProve = nombreProve + ' ' + apellidoProve;            
        }
        let almacen = '';
        if (this.state.arrayDetalleVenta.length > 0) {
            almacen = this.state.arrayDetalleVenta[0].almacen;
        }
        return (
                     <div className='row-content-modal'> 
                        <div className="form-group-content">
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{codventa}</label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Fecha:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{fecha} </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>Sucursal:</label>
                                         </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{nombresucursal} </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>Almacen:</label>
                                        </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{almacen} </label>
                                    </div>
                                
                                
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{idcliente}</label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Cliente:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{fullnameClient} </label>
                            </div>
                        
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Nit:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{nit} </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Moneda:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""} </label>
                            </div>
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Codigo:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].idvendedor:""}</label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Vendedor:</label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{fullnameProve} </label>
                            </div> 
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Lista:</label>
                            </div>   
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].listadescripcion: ""} </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Anticipo:</label>
                            </div>   
                            <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].anticipo: ""} </label>
                            </div>                                    
                        </div>
                        {this.detalleVenta()}
                        <div className="form-group-content col-lg-9-content">
                            <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Notas:</label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-8-content col-xs-12-content">
                                <label >{this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].notas:""}</label>
                            </div>
                        </div>
                        <div className="form-group-content col-lg-3-content">
                            <div className="col-lg-4-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>SubTotal:</label>
                            </div>
                            <div className="col-lg-8-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label >{this.state.subTotalVenta}</label>
                            </div>
                            <div className="col-lg-4-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Descuento:</label>
                            </div>
                            <div className="col-lg-8-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label >{this.state.descuentoVenta}</label>
                            </div>
                            <div className="col-lg-4-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Recargo:</label>
                            </div>
                            <div className="col-lg-8-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label >{this.state.recargoVenta}</label>
                            </div>
                            <div className="col-lg-4-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe '>Total:</label>
                            </div>
                            <div className="col-lg-8-content col-md-6-content col-sm-12-content col-xs-12-content">
                                <label >{this.state.totalVenta}</label>
                            </div>
                                
                        </div>
                        {/* this.detallePlanPago()*/ }
                        
                    </div>
        )
    }
}