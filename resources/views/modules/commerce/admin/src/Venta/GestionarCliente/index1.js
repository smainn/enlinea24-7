
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider} from 'antd';

import "antd/dist/antd.css";     // for css

import ShowCliente from './ShowCliente';
import Input from '../../../components/input';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import ws from '../../../tools/webservices';

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
            verFecha:'',

            buscar: '',
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            btn_ver: readPermisions(keys.cliente_btn_ver),
            btn_nuevo: readPermisions(keys.cliente_btn_nuevo),
            btn_editar: readPermisions(keys.cliente_btn_editar),
            btn_eliminar: readPermisions(keys.cliente_btn_eliminar)
        }
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.verDatosCliente.bind(this, data)}
                    className="btns btns-sm btns-outline-success hint--bottom hint--success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={"/commerce/admin/cliente/edit/"+(data)}
                    className="btns btns-sm btns-outline-primary hint--bottom" aria-label="editar">
                    <i className="fa fa-edit"></i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger hint--bottom hint--error" 
                    aria-label="eliminar" 
                    onClick={this.eliminarElemento.bind(this, data)}>
                    <i className="fa fa-trash" > </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to="/commerce/admin/cliente/create" className="btns btns-primary"><i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
        httpRequest('get', '/commerce/api/cliente')
        .then(result => {
            
            if (result.response == 1) {
                this.setState({
                    clientes: result.data
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
            
        }).catch(error => {
            console.log(error);
        })
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

    eliminarFila(this2,datosCliente){
    
        httpRequest('delete', '/commerce/api/cliente/' + datosCliente.idcliente)
        .then( result => {
            if (result.response === 1){
                message.success("Se elimino correctamente el Registro");
                var posicion = this2.state.clientes.indexOf(datosCliente)
                this2.state.clientes.splice(posicion,1)
                
                this2.setState({
                    clientes: this2.state.clientes
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.response === 0) {
                message.warning("No se pudo eliminar por que se encuentra registrado en una transaccion");
            } else {
                console.log(result);
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
        this.showDeleteConfirm(this,datosCliente);

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
    verDatosRegistro(datosRegistro){
        if(datosRegistro.fechanac !== null){
            var fechaForm = datosRegistro.fechanac.split("-")
            var fecha = fechaForm[2] + "/" + fechaForm[1] + "/" + fechaForm[0] 
        }
        var data = {
            'idcliente':datosRegistro.idcliente,
            'fkidciudad':datosRegistro.fkidciudad,
            'fkidtipocliente':datosRegistro.fkidclientetipo,
        }
        httpRequest('post', '/commerce/api/showCliente', data)
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    datosCiudad : result.ciudad.descripcion,
                    datosTipocliente:result.tipoCliente.descripcion,
                    datosDeContactanos:result.descripcionRefe
                })
            } else if (result.response == -2) {
                this.setState({
                    noSesion: true
                })
            } else {
                console.log(result);
            }
            
        }).catch(error => {
            console.log(error)
        })
        this.setState({
            visible:true,
            datosActuales:datosRegistro,
            verFecha:fecha    
        })
    }
    habilitarParaContactarnos(){
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
        httpRequest('post', '/commerce/api/showCliente', data)
        .then(result =>{

                if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else if (result.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
                        visibleDatoCliente: !this.state.visibleDatoCliente
                    });
                }
            }
        )
        .catch((error) => {
            console.log(error);
        })
    }

    handleCerrar() {
        this.setState({
            visibleDatoCliente: !this.state.visibleDatoCliente
        })
    }

    onChangeBuscarDato(event) {
        this.setState({
            buscar: event.target.value,
        });
    }
    
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">

                <Modal
                    title="Datos de Cliente"
                    visible={this.state.visibleDatoCliente}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    okText="Aceptar"
                    cancelText='Cancelar'
                    width={900}
                    style={{'top': '20px'}}
                    bodyStyle={{  
                        height : window.innerHeight * 0.8
                    }}
                >
                    <ShowCliente 
                        contactoCliente={this.state.clienteContactarloSeleccionado} 
                        cliente={this.state.clienteSeleccionado} />

                </Modal>

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar cliente</h1>
                        </div>

                        <div className="pulls-right">
                            <Link to="/commerce/admin/cliente/reporte" className="btns btns-primary"><i className="fa fa-file-text"></i>
                            &nbsp;Reporte
                            </Link>
                            { btnNuevo }
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
                                    <option value="10"> 10 </option>
                                    <option value="25"> 25 </option>
                                    <option value="50"> 50 </option>
                                    <option value="100"> 100 </option>
                                </select>
                                <h3 className="lbl-input-form-content active"> Mostrar </h3>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <div className="inputs-groups">
                                <input type="text" 
                                        value={this.state.buscar} 
                                        onChange={this.onChangeBuscarDato.bind(this)}
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}}> 
                                </i>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="tabless">

                            <table className="tables-respons">

                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Codigo</th>
                                        <th>Nombre</th>
                                        <th>Nit</th>
                                        <th>Tipo</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.clientes.map( 
                                        (resultado, key) => {
                                            let apellido = resultado.apellido == null ? '' : resultado.apellido;
                                            let codigo = resultado.idcliente;
                                            if (this.state.configCodigo) {
                                                codigo = resultado.codcliente == null ? '' : resultado.codcliente;
                                            }
											let tipo = 'Ninguno';
											if (resultado.tipopersoneria == 'N') {
												tipo = 'Natural';
											} else if (resultado.tipopersoneria == 'J') {
												tipo = 'Juridico';
											}	
                                            return (
                                                <tr key={key}>
                                                    <td>{key+1}</td>
                                                    <td>{codigo} </td>
                                                    <td>{resultado.nombre} {apellido}</td>
                                                    <td>{resultado.nit} </td>
                                                    <td>{tipo}</td>
                                                    <td>
                                                        { this.btnVer(resultado.idcliente) }
                                                        
                                                        { this.btnEditar(resultado.idcliente) }
                                                        
                                                        { this.btnEliminar(resultado) }
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


