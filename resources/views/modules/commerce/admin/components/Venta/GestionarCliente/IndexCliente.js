
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider} from 'antd';

import "antd/dist/antd.css";     // for css

import ShowCliente from './ShowCliente';

const TreeNode = TreeSelect.TreeNode;

const confirm = Modal.confirm;

export default class IndexCliente extends Component{
    constructor(props){
        super(props);
        this.state={

            clienteSeleccionado: [],
            clienteContactarloSeleccionado: [],

            visibleDatoCliente: false,

            clientes:[],
            modal:'none',
            visible:false,
            datosActuales:'',
            datosCiudad:'',
            datosTipocliente:'',
            datosDeContactanos:[],
            bandera:0,
            verFecha:''
        }
    }
    componentWillMount() {
        console.log(window)
        console.log("llego aqui")

        axios.get('').then(resultado => {
            console.log(resultado);

        }).catch(error => {
            console.log(error)
        });

        axios.get('/commerce/api/cliente').then(response => {
            console.log(response.data)
            console.log("bien")
            this.setState({
                clientes:response.data
            })
        }).catch(error => {
            console.log(error);
        })
    }
    eliminarFila(this2,datosCliente){
    
        axios.delete('/commerce/api/cliente/' + datosCliente.idcliente).then( response => {
            if(response.data.response === 1){
                message.success("Se elimino correctamente el Registro");
                var posicion = this2.state.clientes.indexOf(datosCliente)
                this2.state.clientes.splice(posicion,1)
                
                this2.setState({
                    clientes: this2.state.clientes
                });
            }
            if (response.data.response === 0) {
                message.warning("No se pudo eliminar por que se encuentra registrado en una transaccion");
            }
        }).catch (error => {

            console.log(error);
        })


    }
    showDeleteConfirm(this2,datosCliente) {
        confirm({
            title: 'Esta Seguro De Eliminar Esta Fila?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                this2.eliminarFila(this2,datosCliente)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    eliminarElemento(datosCliente){
        console.log("entro")
        this.showDeleteConfirm(this,datosCliente);

    }
    handleOk (e)  {
        console.log("ok")
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel (e) {
        console.log("cancel")
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    verDatosRegistro(datosRegistro){
        console.log("fecha Formato",datosRegistro.fechanac)
        if(datosRegistro.fechanac !== null){
            var fechaForm = datosRegistro.fechanac.split("-")
            var fecha = fechaForm[2] + "/" + fechaForm[1] + "/" + fechaForm[0] 
        }
        var data = {
            'idcliente':datosRegistro.idcliente,
            'fkidciudad':datosRegistro.fkidciudad,
            'fkidtipocliente':datosRegistro.fkidclientetipo,
        }
        axios.post('/commerce/api/showCliente',data).then(response=>{
            console.log(response)
            console.log(response.data.ciudad.descripcion)
            console.log(response.data.tipoCliente.descripcion)
            console.log(response.data.tipoCliente)
            console.log(response.data.descripcionRefe)
            this.setState({
                datosCiudad : response.data.ciudad.descripcion,
                datosTipocliente:response.data.tipoCliente.descripcion,
                datosDeContactanos:response.data.descripcionRefe
            })
        }).catch(error => {
            console.log(error)
        })
        console.log("ver datos")
        console.log(datosRegistro)
        console.log("slir")
        this.setState({
            visible:true,
            datosActuales:datosRegistro,
            verFecha:fecha    
        })
    }
    habilitarParaContactarnos(){
        console.log("tamaño",this.state.datosDeContactanos.length)
        if(this.state.datosDeContactanos.length > 0){
            return(
                <div>
                    <div className='form-group-content col-lg-12-content color-label-modal'>
                        <Divider orientation='left'>Detalles Para Contactarlo</Divider>
                    </div>
                    <div className="form-group-content col-lg-8-content">
                        <div className="caja-content caja-content-alturaView">
                            <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Para Contactarlo  </label>
                            </div>
                            <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Referencia  </label>
                            </div>
                            <div className="col-lg-8-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Descripcion  </label>
                            </div>
                            {this.state.datosDeContactanos.map((l,i)=>(
                                <div>
                                    <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <label className='text-center-content'> {l.referencia}  </label>
                                    </div>

                                    <div className="col-lg-8-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <label className='text-center-content'> {l.valor}  </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }
    habilitarExtra(){
        if(this.state.datosDeContactanos.length > 0){
            return (
                <div className="form-group-content col-lg-4-content">
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Contacto:   </label><label>{this.state.datosActuales.contacto}</label>
                    </div>
                    <Divider></Divider>
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Observaiones:   </label><label>{this.state.datosActuales.notas}</label>
                    </div>
                    <Divider></Divider>
                </div>
            )
        }else{
            return (
                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Contacto:   </label><label>{this.state.datosActuales.contacto}</label>
                    </div>
                    <Divider></Divider>
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Observaiones:   </label><label>{this.state.datosActuales.notas}</label>
                    </div>
                    <Divider></Divider>
                </div>
            )
        }
    }
    imagenVisualizar(){
        if(this.state.datosActuales.foto !== null && this.state.datosActuales !==""){
            return (
                <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src={this.state.datosActuales.foto} alt="none" className='img-principal'></img>
                    </div>
                </div>
            )

        }else{
            return (

                <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src="/images/default.jpg"  style={{'cursor': 'pointer'}}
                         alt="none" className="img-principal"/>
                    </div>
                </div>
            )

        }
    }
    cerrarModal(){
        this.setState({
            modal:'none',
        })
    }

    verDatosCliente(id) {
        var data = {
            'idCliente': id
        }
        axios.post('/commerce/api/showCliente', data).then(
            response =>{
                if (response.data.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(response.data.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: response.data.clienteContactarlo,
                        visibleDatoCliente: !this.state.visibleDatoCliente
                    });
                }
            }
        )
    }

    handleCerrar() {
        this.setState({
            visibleDatoCliente: !this.state.visibleDatoCliente
        })
    }
    
    render() {

        return (
            <div>
                
                <Modal
                    title="Datos de Cliente"
                    visible={this.state.visibleDatoCliente}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    okText="Aceptar"
                    cancelText='Cancelar'
                    width={900}
                    style={{'top': '40px'}}
                    bodyStyle={{  
                        height : window.innerHeight * 0.8
                    }}
                >
                    <ShowCliente 
                        contactoCliente={this.state.clienteContactarloSeleccionado} 
                        cliente={this.state.clienteSeleccionado} />

                </Modal>

                <div className="row-content">
                    <div className="card-body-content card-primary-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Listado de Cliente </h1>
                        </div>
                        <div className="pull-right-content">
                            <Link to="/commerce/admin/indexCliente/nuevo/crearCliente" 
                                className="btn-content btn-sm-content btn-primary-content">
                                <i> Nuevo </i>
                            </Link>
                        </div>
                    </div>
                    <div className="card-header-content">
                        <div className="pull-left-content">
                                 <div className="input-group-content">
                                    <select 
                                        className="form-control-content w-25-content">
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
                                <th>Nombre</th>
                                <th>Nit</th>
                                <th>Tipo</th>
                                <th>Accion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.clientes.map((l,i)=>(
                                <tr>
                                    <td><label className="col-show">Nro: </label> {i+1}</td>
                                    <td><label className="col-show">Codigo: </label>{l.codcliente} </td>
                                    <td><label className="col-show">Nombre: </label> {l.nombre + " " + l.apellido}</td>
                                    <td><label className="col-show">Nit: </label>{l.nit} </td>
                                    <td><label className="col-show">Tipo Personeria: </label> {l.tipopersoneria==='J'?"Juridico":"Natural"}</td>
                                    <td><label className="col-show">Accion: </label>
                                        <a onClick={this.verDatosCliente.bind(this,l.idcliente)}
                                            className="btn-content btn-success-content hint--bottom hint--success" 
                                            aria-label="detalles">
                                            <i className="fa fa-eye"> </i>
                                        </a>
                                        <Link to={"/commerce/admin/indexCliente/editar/"+(l.idcliente)}>
                                        <a className="btn-content btn-primary-content hint--bottom" aria-label="editar">
                                            <i className="fa fa-edit"></i>
                                        </a>
                                        </Link>
                                        <a className="btn-content btn-danger-content hint--bottom hint--error" aria-label="eliminar" onClick={this.eliminarElemento.bind(this,l)}>
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
        );

    }
}


