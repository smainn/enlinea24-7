import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider} from 'antd';
const confirm = Modal.confirm;
export default class ShowVenta extends Component {
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
            recargoVenta:''
        }
    }

    componentWillMount(){
        axios.get('/commerce/api/venta/'+this.props.match.params.id+'/edit').then(response=>{
            if(response.data.response == 1){

                this.setState({
                    arrayDatosPersonales:response.data.data,
                    arrayDetalleListaPrecio:response.data.datosDetallePrecio,
                    arrayDetalleVenta:response.data.datosDetalle
                })
                var subtotal = 0
                for(let i = 0; i < response.data.datosDetalle.length;i++){
                   var total = parseFloat(response.data.datosDetalle[i].preciounit)-((parseFloat(response.data.datosDetalle[i].preciounit)*parseFloat(response.data.datosDetalle[i].factor_desc_incre))/100)*parseInt(response.data.datosDetalle[i].cantidad)
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
                            {this.state.arrayDetalleVenta.map((l,i)=>(
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
                                        <label className='text-center-content'> {parseFloat(l.preciounit)-((parseFloat(l.preciounit)*parseFloat(l.factor_desc_incre))/100)*parseInt(l.cantidad)}  </label>
                                    </div>
                                    <Divider/>

                                </div>
                            ))}
                    </div>
                </div>
            )
        }
    }
    render(){
        console.log('render')
        return (
                     <div className='row-content-modal'> 
                        <div className="form-group-content">
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].codventa:""}</label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Fecha:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].fecha: ""} </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>Sucursal:</label>
                                         </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombresucursal: ""} </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe label-group-margenRigth'>Almacen:</label>
                                        </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].almacen: ""} </label>
                                    </div>
                                
                                
                        </div>
                        <div className="form-group-content">
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].idcliente:""}</label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe'>Cliente:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombrecliente + " " + this.state.arrayDatosPersonales[0].apellidocliente: ""} </label>
                                    </div>
                               
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe '>Nit:</label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nit: ""} </label>
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
                                        <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombrevendedor + " " + this.state.arrayDatosPersonales[0].apellidovendedor: ""} </label>
                                    </div> 
                                    <div className="col-lg-1-content col-md-1-content col-sm-2-content col-xs-12-content">
                                        <label className='label-content-modal label-group-content-nwe '>Lista:</label>
                                    </div>   
                                    <div className="col-lg-2-content col-md-2-content col-sm-4-content col-xs-12-content">
                                        <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].listadescripcion: ""} </label>
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
                    </div>
        )
    }
}