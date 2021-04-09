
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider} from 'antd';
const confirm = Modal.confirm;
export default class IndexVenta extends Component {
   constructor(props){
       super(props)
       this.state = {
           ventas:[],
           visible:false,
           arrayDatosPersonales:[],
           arrayDetalleVenta:[],
           arrayDetalleListaPrecio:[]
       }
   }
    componentWillMount(){
            axios.get('/commerce/api/venta').then(response => {
                this.setState({
                    ventas:response.data.data
                })
            }).catch(error => {
                console.log(error);
            })
    }
    eliminarVenta(this2,datosVenta){
            console.log("entro a")
            console.log(datosVenta)
            console.log(this2.state.ventas)
            axios.delete('/commerce/api/venta/'+datosVenta.idventa).then( response => {
                console.log(response)
                if(response.data.response == 1){
                    message.success("Se elimino correctamente el Registro De Venta");
                    var posicion = this2.state.ventas.indexOf(datosVenta)
                    this2.state.ventas.splice(posicion,1)
                    this2.setState({
                        ventas:this2.state.ventas
                    })
                }else if(response.data.response == -1){
                    message.error("No se Puede Eliminar Este Registro ya tiene un Plan de Pago")
                }
            }).catch (error => {
                console.log(error);
            })
    }
    showDeleteConfirm(this2,datosVenta) {
        confirm({
            title: 'Esta Seguro De Eliminar Esta Registro?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                this2.eliminarVenta(this2,datosVenta)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
   modalDeConfirmacionVenta(datosVenta){
         console.log("entro")
         this.showDeleteConfirm(this,datosVenta);
   }
   verDatosRegistroVenta(datosVenta){
       console.log(datosVenta)
       
        var body = {
            "idventa":datosVenta.idventa
        }
        axios.get('/commerce/api/venta/'+datosVenta.idventa+'/edit').then(response=>{
            if(response.data.response == 1){

                this.setState({
                    arrayDatosPersonales:response.data.data,
                    arrayDetalleListaPrecio:response.data.datosDetallePrecio,
                    arrayDetalleVenta:response.data.datosDetalle
                })
            }
            console.log(response)
            console.log("array datos  personales",this.state.arrayDatosPersonales)

            console.log("array datos  detalle",this.state.arrayDetalleVenta)

            console.log("array datos  preciolist",this.state.arrayDetalleListaPrecio)

        }).catch(error => {
            console.log(error);
        });
   }
   eliminarVenta(this2,datosVenta){

        axios.delete('/commerce/api/venta/'+ datosVenta.idventa).then( response => {
            
            if(response.data.response == 1){
                message.success("Se elimino correctamente el Registro De Venta");
                var posicion = this2.state.ventas.indexOf(datosVenta);
                
                this2.state.ventas.splice(posicion,1)
                this2.setState({
                    ventas: this2.state.ventas
                });

            }else if(response.data.response == -1){
                message.error("No se Puede Eliminar Este Registro ya tiene un Plan de Pago")
            }
        }).catch (error => {
            console.log(error);
        })
    }

    showDeleteConfirm(this2,datosVenta) {
        confirm({
            title: 'Esta Seguro De Eliminar Esta Registro?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                
                this2.eliminarVenta(this2,datosVenta)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    modalDeConfirmacionVenta(datosVenta){
        
        this.showDeleteConfirm(this, datosVenta);
    }

    verDatosRegistroVenta(datosVenta){ 
        var body = {
            "idventa":  datosVenta.idventa
        }
        axios.get('/commerce/api/venta/'+datosVenta.idventa+'/edit').then(response=>{
            if(response.data.response == 1){

                this.setState({
                    arrayDatosPersonales:   response.data.data,
                    arrayDetalleListaPrecio:    response.data.datosDetallePrecio,
                    arrayDetalleVenta:  response.data.datosDetalle
                });
           }
        }).catch(error => {
           console.log(error)
        });
        this.setState({
            visible:    !this.state.visible
        });
    }

    handleOk (e)  {
        this.setState({
            visible: false,
        });
    }

    handleCancel (e) {
        this.setState({
            visible: false,
        });
    }
   render(){
       return (
           <div>
               <Modal

                    title="Datos De Venta"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    width={850}
                    okText="Aceptar"
                    bodyStyle={{  
                        height : window.innerHeight * 0.9 
                    }}
                >
                   <div className='row-content-modal'> 
                        <div className="form-group-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].codventa:""}</label>
                            </div>
                                
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Fecha:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].fecha: ""} </label>
                            </div>
                               
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Sucursal:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombresucursal: ""} </label>
                            </div>
                              
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Almacen:</label>
                                <label >{this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].almacen: ""} </label>
                            </div>     
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].idcliente:""}</label>
                            </div>
                                
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Cliente:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombrecliente + " " + this.state.arrayDatosPersonales[0].apellidocliente: ""} </label>
                            </div>
                               
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Nit:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nit: ""} </label>
                            </div>
                              
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Moneda:</label>
                                <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""} </label>
                            </div>   
                        </div>
                    </div>
                </Modal>
                <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Listado de Venta </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/indexVenta/nuevo/crearVenta" className="btn btn-primary-content">
                                    <i > Nuevo </i>
                                </Link>
                            </div>
                        
                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">          
                                <div className="input-group-content">
                                    <select className="form-control-content w-25-content">
                                        <option value="2"> 2 </option>
                                        <option value="5"> 5 </option>
                                        <option value="10"> 10 </option>
                                        <option value="25"> 25 </option>
                                        <option value="50"> 50 </option>
                                        <option value="100"> 100 </option>
                                    </select>
                                    <h3 className="title-md-content"> Mostrar </h3>
                            </div>
                            </div>
                            <div className="pull-right-content">
                                <div className="input-group-content">
                                    <input type="text" className="form-control-content w-75-content" placeholder=" Buscar ..."/>
                                    <i className="fa fa-search fa-content"> </i>
                                </div>
                            </div>
                        </div>
                        <div className="table-content">
                        <table className="table-responsive-content">
                            <thead>
                            <tr className="row-header">
                                <th>Nro</th>
                                <th>Codigo</th>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th>Fecha</th>
                                <th>Sucursal</th>
                                <th>Accion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.ventas.map((l,i)=>(
                                <tr>
                                    <td><label className="col-show">Nro: </label> {i+1}</td>
                                    <td><label className="col-show">Codigo: </label>{l.codventa} </td>
                                    <td><label className="col-show">Cliente: </label> {l.nombreCliente + " " + l.apellidoCliente}</td>
                                    <td><label className="col-show">Vendedor: </label>{l.nombreVendedor + " " + l.apellidoVendedor} </td>
                                    <td><label className="col-show">Fecha: </label> {l.fecha}</td>
                                    <td><label className="col-show">Sucursal: </label> {l.nombreSucursal}</td>
                                    <td><label className="col-show">Accion: </label>
                                        <Link to={"/commerce/admin/indexVenta/show/" + (l.idventa)}
                                            className="btn-content btn-success-content hint--bottom hint--success" 
                                            aria-label="detalles">
                                            <i className="fa fa-eye" > </i>
                                        </Link>
                                  
                                        <a className="btn-content btn-danger-content hint--bottom hint--error" 
                                            onClick={this.modalDeConfirmacionVenta.bind(this,   l)}
                                            aria-label="eliminar">
                                            <i className="fa fa-trash" > </i>
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>
                </div>
                                
           </div>
       )
   }
}