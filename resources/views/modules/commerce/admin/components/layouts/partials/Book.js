

import React, { Component } from 'react';

import ReactDOM from 'react-dom'
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import { TreeSelect,message,notification ,Icon,Divider,DatePicker} from 'antd';
import "antd/dist/antd.css";     // for css


var CIUDAD_CLIENTE={"descripcion":'Seleccionar'}
const URL_CLIENTE_TIPO = '/commerce/api/tipocliente';

export default class Book extends Component{

    constructor(props){
        super(props);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.state = {
            nombrecliente: '',
            codigocliente: '',
            tipocliente: '',
            fotocliente: '',
            tipopersoneria: 'N',
            apellidocliente: '',
            nitcicliente: '',
            sexocliente: 'M',
            ciudadcliente: '',
            fechanacimientocliente: '',
            ////validaciones

            habilidar: false,
            tipo_clientes: [],
            ciudad: [],

            ciudadCargados: [],

            dropdownOpen: false,
            btnDropright: false,
            btnDropright2: false,
            modal: false,
            referencias: [],
            alert1: false,
            referenciaSelect: [],
            descripcionReferencia: [],
            contactoCliente: '',
            notasCliente: '',
            selectedOption: null,
            clienteContacto: [],
            redirect: false,
            ciudadclientedata: undefined,

            tipoPersoneriaCambio: 'Nacimiento',
            modalImage: 'none',

            items: [1,2,3],
        }
    }
    openNotification () {
        notification.open({
            message: 'Alerta',
            description: 'Tipo De Imagen Incorrecta, Asegurese de que sea PNG y JPG',
            icon: <Icon type="warning" style={{ color: '#dfce01' }} />,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    onChange (value) {
        console.log("value select tree")
        console.log(value)
        this.setState({
            ciudadclientedata:value
        })
        console.log(this.state.ciudadclientedata)
    }
    getTipoClientes(){
        console.log("llego aqui")
        axios.get('/commerce/api/tipocliente').then(response => {
            console.log(response.data)
            console.log("bien")
            if(response.data.response == 1) {
                this.setState({
                    tipo_clientes:response.data.data,
                    tipocliente:response.data.data[0].idclientetipo
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getReferencias(){
        console.log("llego aqui")
        axios.get('/commerce/api/referenciacontacto').then(response => {
            console.log(response.data)
            console.log("referencias")
            if(response.data.response == 1) {
                this.setState({
                    referencias:response.data.data
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getCiudad(){
        axios.get('/commerce/api/ciudad').
        then(response => {
            console.log("ciudades")
            console.log(response.data.data)

            this.setState({
                ciudadCargados:response.data.data,
                ciudadclientedata:response.data.data[0].idciudad
            })

            var array = response.data.data;
            var array_aux = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].idpadreciudad == null) {
                    var elem = {
                        title: array[i].descripcion,
                        value: array[i].idciudad,
                    };
                    array_aux.push(elem);
                }
            }

            this.arbolCiudad(array_aux);
            console.log('ARBOL DE LAS CIUDADES');
            console.log(array_aux);

            this.setState({
                ciudad: array_aux
            });
            console.log("CIUDADESSSSS    ")
            console.log(this.state.ciudad);

        }).catch(error => {
            console.log(error)
        })
    }
    arbolCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            //console.log('id del producto ',data[i].value);
            var hijos = this.hijos(data[i].value);
            //console.log('hijos');
            //console.log(hijos);
            if (hijos.length > 0) {
                data[i].children = hijos;
            }

            //if(hijos.length > 0){
            this.arbolCiudad(hijos);
            //}
        }
    }
    hijos(idpadre) {
        var array =  this.state.ciudadCargados;

        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadreciudad == idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idciudad
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    validarRferenciaContacto() {
        if (this.state.descripcionReferencia.length > 0) {
            var array = []
            for (let i = 0; i < this.state.descripcionReferencia.length; i++) {
                if (String(this.state.descripcionReferencia[i]).trim().length > 0 && String(this.state.referenciaSelect[i]).trim().length > 0 && typeof this.state.referenciaSelect[i] !== 'undefined' && typeof this.state.descripcionReferencia[i] !== 'undefined') {
                    console.log('datos de referencia',this.state.descripcionReferencia[i])
                    console.log("foranea key",typeof this.state.referenciaSelect[i] !== 'undefined' ? this.state.referenciaSelect[i] : this.state.referencias[0].idreferenciadecontacto)
                    var referenciaDesc = {
                        "fkidreferenciacontacto": typeof this.state.referenciaSelect[i] !== 'undefined' ? this.state.referenciaSelect[i]:this.state.referencias[0].idreferenciadecontacto,
                        "valor":this.state.descripcionReferencia[i]
                    }
                    array.push(referenciaDesc)
                }
            }
        }
        return array
    }
    componentWillMount(){

        axios.get('').then(resultado => {
            console.log(resultado);

        }).catch(error => {
            console.log(error)
        });

        this.getTipoClientes();
        this.getReferencias();
        this.getCiudad();

    }
    guardarDatos(e) {
        e.preventDefault();
        var clienteCont=this.validarRferenciaContacto()
        var sexo = ''
        if(this.state.habilidar === true){
            sexo = 'N'
        }else{
            sexo = this.state.sexocliente;
        }

        if(this.state.codigocliente.length > 0 && this.state.nombrecliente.length > 0 && this.state.apellidocliente.length > 0 && this.state.CIUDAD_CLIENTE !== 'Seleccionar'){
            const formData = new FormData();
            formData.append('codigoCliente',this.state.codigocliente)
            formData.append('nombreCliente',this.state.nombrecliente)
            formData.append('apellidoCliente',this.state.apellidocliente)
            formData.append('nitCliente',this.state.nitcicliente)
            formData.append('fotoCliente',this.state.fotocliente)
            formData.append('sexoCliente',sexo)
            formData.append('tipoPersoneriaCliente',this.state.tipopersoneria)
            formData.append('fechaNacimientoCliente',this.state.fechanacimientocliente)
            formData.append('notasCliente',this.state.notasCliente)
            formData.append('contactoCliente',this.state.contactoCliente)
            formData.append('fkidciudad',this.state.ciudadclientedata)
            formData.append('fkidtipocliente',this.state.tipocliente)
            formData.append('datosTablaIntermedia',JSON.stringify(typeof clienteCont === 'undefined'?[]:clienteCont))
            axios.post('/commerce/api/cliente', formData,{
                headers:{'Content-Type':'multipart/form-data'}
            }).then(response => {

                if(response.data.response === 1){
                    message.success('Se Registro Correctamente');
                    
                    if (this.props.aviso === 1) {
                        
                        this.setState({
                            codigocliente: '',
                            tipocliente: this.state.tipo_clientes[0].idclientetipo,
                            tipopersoneria: 'N',
                            nombrecliente: '',
                            apellidocliente: '',
                            nitcicliente: '',
                            habilidar: false,
                            sexocliente: 'M',
                            fechanacimientocliente: '',
                            ciudadclientedata: this.state.ciudadCargados[0].idciudad,
                            fotocliente: '',
                            contactoCliente: '',
                            notasCliente: '',
                            descripcionReferencia: [],
                            referenciaSelect: [],
                            items: [1, 2, 3]
                        });

                        this.props.callback(response.data.cliente, 1);
                    }else {
                        this.setState({
                            redirect:!this.state.redirect
                        });
                    }
                }

            }).catch(error => {
                console.log(error)
            })

        }else{
            if(this.state.nombrecliente == "") {
                message.error("Nombre es un campo Requerido");
            }
            if(this.state.apellidocliente == "") {
                message.error("Apellido es un campo Requerido")
            }
            if(this.state.codigocliente == "") {
                message.error("Codigo es un campo Requerido")
            }
        }
    }

    clienteCodigo(event) {
        this.setState({
            codigocliente:event.target.value
        })
    }
    clienteTipo(event) {
        this.setState({
            tipocliente:event.target.value
        })
    }
    clientePersoneria(event) {
        this.setState({
            tipopersoneria:event.target.value
        })
        if (event.target.value === 'J') {
            this.setState({
                habilidar:true,
            })
        } else {
            this.setState({
                habilidar:false
            })
        }
    }
    clienteNombre(event) {
        this.setState({
            nombrecliente:event.target.value
        })
    }
    clienteApellido(event) {
        this.setState({
            apellidocliente:event.target.value
        })
    }
    clienteNitci(data) {
        this.setState({
            nitcicliente:data.target.value
        })
    }
    clienteSexo(data) {
        this.setState({
            sexocliente:data.target.value
        })
    }
    clienteFechaNaci(data) {
        console.log(data.target.value)
        this.setState({
            fechanacimientocliente:data.target.value
        })
    }
    clienteCiudad(data) {
        this.setState({
            ciudadcliente:data.target.value
        })
    }

    clienteFoto(event) {
        console.log(event.target.files[0]);
        this.setState({
            fotocliente :event.target.files[0]
        })

    }
    clienteNota(event) {
        this.setState({
            notasCliente:event.target.value
        })
    }
    clienteContacto(event) {
        this.setState({
            contactoCliente:event.target.value
        })
    }
    cambiofoto(event) {
        let files=event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                console.log("datos resultado")
                console.log(e.target.result)
                console.log(files)
                console.log(files[0].type)
                this.setState({
                    fotocliente:e.target.result,
                    alert1:false
                })
            }
        } else {
            this.setState({
                alert1:true
            })
        }
    }

    validarImagen() {
        console.log(this.state.alert1)
        /* setTimeout(()=>{
        this.setState({
            alert1:false
        })
    },10000)*/
        if (this.state.alert1 == true) {

            {this.openNotification()}

        } else {
            return null
        }

    }
    validarSexo() {
        if (this.state.habilidar == true) {
                return (
                    <select name="sexocliente" id="sexocliente" className="form-control-content"
                            value={this.state.sexocliente}
                            onChange={this.clienteSexo.bind(this)}
                            disabled={this.state.habilidar}>
                        <option value="S" selected> Sin Declarar</option>
                    </select>
                )
           }else {
                return (
                    <select name="sexocliente" id="sexocliente" className="form-control-content"
                            value={this.state.sexocliente}
                            onChange={this.clienteSexo.bind(this)}
                            disabled={this.state.habilidar}>
                        <option value="M">Masculino</option>
                        <option value="F" >Femenino</option>
                    </select>
                )
        }
    }
    cambioReferenciaSelect(e){
        let index = e.target.id;
        let valor = e.target.value;
        if (isNaN(valor)) {

            this.state.descripcionReferencia[index] = "";
            this.state.referenciaSelect[index] = "";
            this.setState({
                descripcionReferencia:this.state.descripcionReferencia
            });

        } else {
            this.state.referenciaSelect[index] = parseInt(valor);
            this.state.descripcionReferencia[index] = "";
            this.setState({
                referenciaSelect: this.state.referenciaSelect,
                descripcionReferencia: this.state.descripcionReferencia
            });
        }
    }
    cambioDescripcionInput(posicion, e) {
        
        let valor = e.target.value;

        if (typeof this.state.referenciaSelect[posicion] === 'undefined' || this.state.referenciaSelect[posicion] === "") {
             message.error('Seleccione una opcion para poder seguir ');
        } else {
            this.state.descripcionReferencia[posicion] = valor;
            this.setState({
                descripcionReferencia: this.state.descripcionReferencia
            });
        }
    }
    eliminarFoto() {
        this.setState({
            fotocliente:''
        })
    }
    validarEliminarFoto() {
        if(this.state.fotocliente !== '') {
            return (
                <div className="pull-right-content">
                    <i className="styleImg fa fa-trash" onClick={this.eliminarFoto.bind(this)}></i>
                </div>
            )
        }else{
            return null
        }
    }

    handleAddRow() {
        var newRow = this.state.items.concat(this.state.items.length + 1);
        this.setState({
            items: newRow
        });
    }

    handleRemoveRow(i) {
        var newItem = this.state.items;
        newItem.splice(i, 1);
        console.log("aaaaaaaaaaaa")
        console.log(this.state.referenciaSelect[i])
        console.log(this.state.descripcionReferencia[i])


        this.state.referenciaSelect.splice(i,1);
        this.state.descripcionReferencia.splice(i,1);
        console.log("asdasdsadasdsad")
        console.log(this.state.referenciaSelect)
        console.log(this.state.descripcionReferencia)
        this.setState({
            items: newItem,
            referenciaSelect:this.state.referenciaSelect,
            descripcionReferencia:this.state.descripcionReferencia
        });
    }

    onchangeComponentImage() {
        if (this.state.fotocliente !== "" && this.state.fotocliente !== null) {
            return (
                <div className="caja-img caja-altura" >
                    <img src={this.state.fotocliente} style={{'cursor': 'pointer'}}
                        alt="none" className="img-principal" />
                </div>
            )
        }else{
            return (
                <div className="caja-img caja-altura">
                    <img src="/images/default.jpg" 
                         alt="none" className="img-principal"/>
                </div>
            )
        }
    }
    cerrarModalImage() {
        this.setState({
            modalImage: 'none',
            tecla: 0
        })
    }
    abrirModalImage() {
        this.setState({
            modalImage: 'block',
            tecla: 1
        });
    }
    onChangeModalImage() {
        
        return (
            <div className="content-img">
                <i className="fa fa-times fa-delete-image" onClick={this.cerrarModalImage.bind(this)}> </i>
                    <img src={this.state.fotocliente}
                        alt="none" className="img-principal"
                        style={{'objectFit': 'fill', 'borderRadius': '8px'}} />       
            </div>
        );
    }

    onSubmit(e) {
        e.preventDefault();
        if ((this.state.codigoVehiculo.length == 0) ||
            (this.state.chasisVehiculo.length == 0) || (this.state.placaVehiculo.length == 0)){
            if (this.state.codigoVehiculo.length == 0){
                this.state.validacion[0] = 'form-control-content error';
                this.state.mensaje[0] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.placaVehiculo.length == 0){
                this.state.validacion[1] = 'form-control-content error';
                this.state.mensaje[1] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.chasisVehiculo.length == 0){
                this.state.validacion[2] = 'form-control-content error';
                this.state.mensaje[2] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
        }
    }
    salirCrear(){

        if (this.props.aviso === 1) {
            this.props.callback({}, 0);
        }else {
            this.setState({
                redirect:!this.state.redirect
            });
        }

    }
 
    render() {
        const componentImage = this.onChangeModalImage();
        const componentInmage = this.onchangeComponentImage();
        if(this.state.redirect){
            console.log("entroooooooo")
            return (<Redirect to="/commerce/admin/indexCliente/" />)
        }
       
        return (
            <div>
                <div className="row-content">
                <div className="divFormularioImagen" style={{'display': this.state.modalImage}}>
                     {componentImage}
                </div>
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Registrar Cliente </h1>
                        </div>
                    </div>
                    <div className="card-body-content card-primary-content">
                        <form
                            onSubmit={this.guardarDatos.bind(this)}
                            className="form-content" encType="multipart/form-data">
                            <div>
                                <div className="form-group-content col-lg-8-content">
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input  type="text"
                                                   value={this.state.codigocliente}
                                                   placeholder="Ingresar Codigo"
                                                   onChange={this.clienteCodigo.bind(this)}
                                                   className='form-control-content reinicio-padding'
                                            />
                                            <label htmlFor="codigocliente"
                                                   className="label-group-content"> Codigo </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <select name="tipocliente" id="tipocliente" className="form-control-content"
                                                    value={this.state.tipocliente} onChange={this.clienteTipo.bind(this)}>
                                                {this.state.tipo_clientes.map((l,i)=>(
                                                    <option key={i} value={l.idclientetipo}>{l.descripcion}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="tipocliente"
                                                   className="label-group-content"> Tipo Cliente </label>

                                        </div>
                                    </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <select name="tipopersoneria" id="tipopersoneria" className="form-control-content"
                                                    value={this.state.tipopersoneria} onChange={this.clientePersoneria.bind(this)}>
                                                <option value="N">Natural</option>
                                                <option value="J">Juridico</option>
                                            </select>
                                            <label htmlFor="tipopersoneria"
                                                   className="label-group-content"> Tipo Personeria </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input type="text"
                                                   value={this.state.nombrecliente}
                                                   placeholder="Ingresar Nombre"
                                                   onChange={this.clienteNombre.bind(this)}
                                                   className='form-control-content reinicio-padding' />
                                            <label htmlFor="nombrecliente"
                                                   className="label-group-content"> Nombre </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input type="text"
                                                   value={this.state.apellidocliente}
                                                   placeholder="Ingresar Apellido"
                                                   onChange={this.clienteApellido.bind(this)}
                                                   className='form-control-content reinicio-padding'/>
                                            <label htmlFor="apellidocliente"
                                                   className="label-group-content"> Apellido  </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input type="text"
                                                   value={this.state.nitcicliente}
                                                   placeholder="Ingresar Nit/Ci"
                                                   onChange={this.clienteNitci.bind(this)}
                                                   className='form-control-content reinicio-padding' />
                                            <label htmlFor="nitcicliente"
                                                   className="label-group-content"> Nit/Ci </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">

                                            {this.validarSexo()}
                                            <label htmlFor="sexocliente"
                                                   className="label-group-content"> Sexo </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content"> </div>
                                    <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <input id="fechanacimiento" type="date"
                                                   value={this.state.fechanacimientocliente}
                                                   placeholder="Ingresar Fecha Nacimiento"
                                                   onChange={this.clienteFechaNaci.bind(this)}
                                                   className='form-control-content reinicio-padding' />
                                            <label htmlFor="fechanacimiento"
                                                   className="label-group-content"> Fecha {this.state.habilidar == true ? 'Fundacion' : 'Nacimiento'} {this.state.habilidar}  </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-1-content"> </div>
                                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <TreeSelect
                                                style={{ width: 200 }}
                                                value={this.state.ciudadclientedata}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={this.state.ciudad}
                                                placeholder="Seleccionar"
                                                onChange={this.onChange.bind(this)}
                                            />
                                            <label htmlFor="ciudadcliente"
                                                   className="label-group-content"> Ciudad  </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group-content col-lg-4-content">
                                     <div className="col-lg-1-content col-md-2-content col-sm-12-content col-xs-12-content">

                                     </div>                   
                                    <div className="col-lg-9-content col-md-8-content col-sm-12-content col-xs-12-content">
                                        <div className="card-caracteristica">
                                            <div className="pull-left-content">
                                                <i className="styleImg fa fa-upload">
                                                    <input type="file" className="img-content"
                                                           onChange={this.cambiofoto.bind(this)}/>
                                                </i>
                                            </div>
                                            {this.validarEliminarFoto()}
                                                {componentInmage}
                                            {this.validarImagen()}
                                        </div>
                                    </div>
                                    <div className="col-lg-1-content col-md-2-content col-sm-12-content col-xs-12-content">

                                    </div>    
                                </div>
                                <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content ">
                                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                        <div className="card-caracteristica">

                                            <div>
                                                <div className="pull-left-content">
                                                    <h1 className="title-logo-content ">Referencia Para Contactarlo </h1>
                                                </div>
                                                <div className="pull-right-content" style={{ marginTop:10,marginRight:15 }}>
                                                    <i className="fa fa-plus btn-content btn-secondary-content" onClick={this.handleAddRow}> </i>
                                                </div>
                                            </div>
                                            <div className="caja-content caja-content-altura">
                                                {
                                                    this.state.items.map((valor, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content" style={{marginBottom:10}}>
                                                                    <select name="referencia"
                                                                            id={i}
                                                                            className="form-control-content"
                                                                            value={typeof this.state.referenciaSelect[i] === 'undefined'?"Seleccione":  this.state.referenciaSelect[i]}
                                                                            onChange={this.cambioReferenciaSelect.bind(this)}>
                                                                        <option>Seleccionar</option>
                                                                        {this.state.referencias.map((j,k)=>(
                                                                            <option key={k} value={j.idreferenciadecontacto}>{j.descripcion}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content" style={{marginBottom:10}}>
                                                                    <input type="text"
                                                                           
                                                                        placeholder="Ingresar descripcion ..."
                                                                        className={(typeof this.state.referenciaSelect[i] != 'undefined'?'form-control-content': 'form-control-content cursor-not-allowed')}
                                                                        value={typeof this.state.descripcionReferencia[i] === 'undefined'?"":this.state.descripcionReferencia[i]}
                                                                        readOnly={((typeof this.state.referenciaSelect[i] != 'undefined'))?false:true}
                                                                        onChange={this.cambioDescripcionInput.bind(this, i)}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-1-content col-md-1-content">
                                                                    <div className="text-center-content">
                                                                        <i className="fa fa-remove btn-content btn-danger-content"
                                                                           onClick={this.handleRemoveRow.bind(this, i)}> </i>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <div className="col-lg-12-content col-md-12-content col-sm-6-content col-xs-12-content">

                                        <textarea className="textarea-content" value={this.state.contactoCliente} onChange={this.clienteContacto.bind(this)}>
                                        </textarea>
                                        <label className="label--group-content">Contacto </label>
                                    </div>
                                    <div className="col-lg-12-content col-md-12-content col-sm-6-content col-xs-12-content">
                                        <div className="input-group-content">
                                            <textarea className="textarea-content" value={this.state.notasCliente} onChange={this.clienteNota.bind(this)}/>
                                            <label className="label-group-content">Observaciones </label>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-group-content">
                                    <div className="text-center-content">
                                        <button type="submit" className="btn-content btn-sm-content btn-success-content"
                                            style={{'marginRight': '20px'}}>
                                            Aceptar
                                        </button>
                                        <button type="button" className="btn-content btn-sm-content btn-danger-content" onClick={this.salirCrear.bind(this)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    }
}




