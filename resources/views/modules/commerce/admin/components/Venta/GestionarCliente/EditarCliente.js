
import React, { Component } from 'react';
import axios from 'axios';

import {Redirect,Link} from 'react-router-dom';
import { TreeSelect,message,notification ,Icon,Modal,Button,Divider} from 'antd';
import "antd/dist/antd.css";     // for css

const confirm = Modal.confirm;
export default class EditarCliente extends Component{

    constructor(props){
        super(props)

        this.handleAddRow = this.handleAddRow.bind(this);
        this.state = {
            clientes:[],

            nombrecliente:'',
            codigocliente:'',
            tipocliente:'',
            fotocliente:'',
            tipopersoneria:'N',
            apellidocliente:'',
            nitcicliente:'',
            sexocliente:'M',
            ciudadcliente:'',
            fechanacimientocliente:'',
            ////validaciones
            habilidar:false,
            tipo_clientes:[],
            ciudad:[],
            dropdownOpen: false,
            btnDropright:false,
            btnDropright2:false,
            modal:false,
            referencias:[],
            alert1:false,
            referenciaSelect:[],
            descripcionReferencia:[],
            contactoCliente:'',
            notasCliente:'',
            selectedOption:null,
            clienteContacto:[],
            redirect:false,
            ciudadclientedata:undefined,
            items: [],
            idParaContactarlo:[],
            idParaContactarloEliminar:[],
        }
    }
    showConfirm(state,sexo,clienteCont,props,this2) {
        confirm({
            title: 'Esta Seguro De Actualizar Esta Informacion?',
            content: 'yes',
            onOk() {
                console.log("state   ")
                console.log(state)
                var datosActualizar = {
                    'codigoCliente':state.codigocliente,
                    'apellidoCliente':state.apellidocliente,
                    'nombreCliente':state.nombrecliente,
                    'nitCliente':state.nitcicliente,
                    'fotoCliente':state.fotocliente,
                    'sexoCliente':sexo,
                    'tipoPersoneriaCliente':state.tipopersoneria,
                    'fechaNacimientoCliente':state.fechanacimientocliente,
                    'notasCliente':state.notasCliente,
                    'contactoCliente':state.contactoCliente,
                    'fkidciudad':state.ciudadclientedata,
                    'fkidtipocliente':state.tipocliente,
                    'datosTablaIntermedia':JSON.stringify(clienteCont),
                    'idParaContactarlo':JSON.stringify(state.idParaContactarlo),
                    'idParaContactarloEliminar':JSON.stringify(state.idParaContactarloEliminar),
                }
                console.log(props.match.params.datos)
                axios.put('/commerce/api/cliente/'+props.match.params.datos, datosActualizar
                ).then(response => {
                    //console.log(this2)
                    console.log("datos devueltos del servicio")
                    console.log(response)

                    if(response.data.response === 1){

                        message.success('Se Registro Correctamente');

                        console.log(response.data.response)
                        // return "response.data.response";

                        console.log("slio de  redirec")
                        this2.state.redirect = ! this2.state.redirect
                        this2.setState({
                            redirect : this2.state.redirect
                        })
                    }else{
                        message.error("Ocurrio algun error intentelo nuevamente");
                    }

                }).catch(error => {
                    console.log(error)
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    getClienteId() {
        console.log("llego aqui")
        axios.get('/commerce/api/cliente/'+this.props.match.params.datos+'/edit').then(response => {
            console.log("123")
            console.log(response.data)
            console.log("llego bien el edit")
            var array = []
            var array1 =[]
            var array2 = []
            for (let i=0 ; i < response.data.data2.length ; i++){
                this.state.items.push(this.state.items.length + 1)
                this.state.referenciaSelect.push(response.data.data2[i].fkidreferenciadecontacto)
                this.state.descripcionReferencia.push(response.data.data2[i].valor)
                this.state.idParaContactarlo.push(response.data.data2[i].idclientecontactarlo)
            }
            if(response.data.data.sexo == 'N'){
                this.setState({
                    habilidar: !this.state.habilidar
                })
            }
            this.setState({
                nombrecliente:response.data.data.nombre,
                apellidocliente:response.data.data.apellido,
                codigocliente:response.data.data.codcliente,
                tipopersoneria:response.data.data.tipopersoneria,
                tipocliente:response.data.data.fkidclientetipo,
                nitcicliente:response.data.data.nit,
                sexocliente:response.data.data.sexo,
                fechanacimientocliente:response.data.data.fechanac,
                ciudadclientedata:response.data.data.fkidciudad,
                contactoCliente:response.data.data.contacto,
                notasCliente:response.data.data.notas,
                fotocliente:response.data.data.foto,
                referenciaSelect:this.state.referenciaSelect,
                descripcionReferencia:this.state.descripcionReferencia,
                items:this.state.items,
                idParaContactarlo:this.state.idParaContactarlo
            })
        }).catch(error => {
            console.log(error);
        })
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
            if(response.data.response === 1) {
                this.setState({
                    tipo_clientes:response.data.data
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
            console.log("bien")
            if(response.data.response === 1) {
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
                ciudad:response.data.data
            })

            var array = response.data.data;
            var array_aux = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].idpadreciudad == null) {
                    var elem = {
                        label: array[i].descripcion,
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
        var array =  this.state.ciudad;
        //console.log('DATA DE LOS PRODUCTOS');
        //console.log(array);
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            //console.log('ELEMENTO');
            //console.log(array[i]);
            if(array[i].idpadreciudad == idpadre){
                var elemento = {
                    label: array[i].descripcion,
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
        this.getClienteId();
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
        console.log(sexo)
        console.log(this.state.nombrecliente)
        console.log(this.state.apellidocliente)
        console.log(this.state.nitcicliente)
        console.log(this.state.tipocliente)
        console.log(this.state.fotocliente)
        console.log(this.state.fechanacimientocliente)
        console.log(this.state.contactoCliente)
        console.log(this.state.notasCliente)
        console.log(this.state.tipopersoneria)
        console.log(this.state.codigocliente)
        console.log(clienteCont)
        var respuesta = 0
        if(this.state.codigocliente.length > 0 && this.state.nombrecliente.length > 0 && this.state.apellidocliente.length > 0 && this.state.CIUDAD_CLIENTE !== 'Seleccionar'){

            respuesta = this.showConfirm(this.state,sexo,clienteCont,this.props,this)
            console.log(respuesta)
            if(respuesta === 1){
                console.log("respuesta dada")
            }else{
                console.log("respuesta fall")
            }
        }else{
            alert("campos requeridos");
        }
    }

    clienteCodigo(event) {

        message.error('No puede ser Editado el Codigo');

        /*  this.setState({
              codigocliente:event.target.value
          })*/
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
        if (this.state.alert1 === true) {

            {this.openNotification()}

        } else {
            return null
        }

    }
    validarSexo() {
        if (this.state.habilidar === true) {
            return (
                <select name="sexocliente" id="sexocliente" className="form-control-content"
                        value={this.state.sexocliente}
                        onChange={this.clienteSexo.bind(this)}
                        disabled={this.state.habilidar}>
                    <option value="S" selected> Sin Declarar</option>
                </select>
            )
        } else {
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
        console.log(index)
        console.log(valor)
        console.log(e.target)
        if (isNaN(valor)) {
            console.log("nan     s")
            this.state.descripcionReferencia[index] = ""
            this.state.referenciaSelect[index] = ""
            this.setState({
                descripcionReferencia:this.state.descripcionReferencia
            })
        } else {
            this.state.referenciaSelect[index] = parseInt(valor);
            this.setState({
                referenciaSelect:this.state.referenciaSelect
            })
        }
        console.log("select  ",this.state.referenciaSelect);
        console.log("array     ",this.state.descripcionReferencia);
    }
    cambioDescripcionInput(e) {
        let index = e.target.id;
        let valor = e.target.value;
        console.log("select invalido     ",this.state.referenciaSelect[index])
        if (typeof this.state.referenciaSelect[index] === 'undefined' || this.state.referenciaSelect[index] === "") {
            message.error('Seleccione una opcion para poder seguir ');
        } else {
            this.state.descripcionReferencia[index] = valor;
            console.log("array     ",this.state.descripcionReferencia);
            this.setState({
                descripcionReferencia: this.state.descripcionReferencia
            })
        }
    }
    eliminarFoto() {
        this.setState({
            fotocliente:''
        })
    }
    validarEliminarFoto() {
        if(this.state.fotocliente !== '' && this.state.fotocliente !== null) {
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
        console.log(this.state.idParaContactarlo)
        console.log(this.state.idParaContactarloEliminar)
        console.log(this.state.referenciaSelect[i])
        console.log(this.state.descripcionReferencia[i])
        var idEliminar = this.state.idParaContactarlo[i];
        console.log("id Eliminar   ",idEliminar)
        if(typeof idEliminar !== 'undefined'){
            this.state.idParaContactarloEliminar.push(idEliminar);
        }
        this.state.idParaContactarlo.splice(i,1);
        this.state.referenciaSelect.splice(i,1);
        this.state.descripcionReferencia.splice(i,1);
        console.log("asdasdsadasdsad")
        console.log(this.state.referenciaSelect)
        console.log(this.state.descripcionReferencia)
        this.setState({
            items: newItem,
            referenciaSelect:this.state.referenciaSelect,
            descripcionReferencia:this.state.descripcionReferencia,
            idParaContactarlo:this.state.idParaContactarlo,
            idParaContactarloEliminar:this.state.idParaContactarloEliminar
        });
    }

    onchangeComponentImage() {
        if (this.state.fotocliente !== "" && this.state.fotocliente !== null) {
            return (
                <div className="caja-img caja-altura">
                    <img src={this.state.fotocliente} alt="none" className="img-principal" />
                </div>
            )
        }else{
            return (
                <div className="caja-img caja-altura">
                    <img src="/images/default.jpg" style={{'cursor': 'pointer'}}
                         alt="none" className="img-principal" />
                </div>
            )
        }
    }

    onSubmit(e) {
        e.preventDefault();
        if ((this.state.codigoVehiculo.length === 0) ||
            (this.state.chasisVehiculo.length === 0) || (this.state.placaVehiculo.length === 0)){
            if (this.state.codigoVehiculo.length === 0){
                this.state.validacion[0] = 'form-control-content error';
                this.state.mensaje[0] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.placaVehiculo.length === 0){
                this.state.validacion[1] = 'form-control-content error';
                this.state.mensaje[1] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
            if (this.state.chasisVehiculo.length === 0){
                this.state.validacion[2] = 'form-control-content error';
                this.state.mensaje[2] = 'Campo Requerido';
                this.setState({
                    validacion: this.state.validacion,
                    mensaje: this.state.mensaje
                })
            }
        }
    }
    salirAIndex(){
        console.log("salir index")
        this.setState({
            redirect:true
        })
    }
    render() {
        const componentInmage = this.onchangeComponentImage();
        if(this.state.redirect){
            console.log("entroooooooo")
            return (<Redirect to="/commerce/admin/indexCliente/" />)
        }
        return (
            <div>
                <div className="row-content">
                    <div className="card-header-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Editar Cliente </h1>
                        </div>
                    </div>
                    <div className="card-body-content card-primary-content">
                    <form onSubmit={this.guardarDatos.bind(this)} className="formulario-content" encType="multipart/form-data" id="form_register">
                        <div>
                            <div className="form-group-content col-lg-8-content">
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="codigocliente" type="text"
                                               value={this.state.codigocliente}
                                               placeholder="Ingresar Codigo ..."
                                               onChange={this.clienteCodigo.bind(this)}
                                               className='form-control-content'
                                        />
                                        <label htmlFor="codigocliente"
                                               className="label-content"> Codigo </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select name="tipocliente" id="tipocliente" className="form-control-content"
                                                value={this.state.tipocliente} onChange={this.clienteTipo.bind(this)}>
                                            {this.state.tipo_clientes.map((l,i)=>(
                                                <option key={i} value={l.idclientetipo}>{l.descripcion}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="tipocliente"
                                               className="label-content"> Tipo Cliente </label>

                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <select name="tipopersoneria" id="tipopersoneria" className="form-control-content"
                                                value={this.state.tipopersoneria} onChange={this.clientePersoneria.bind(this)}>
                                            <option value="N">Natural</option>
                                            <option value="J">Juridico</option>
                                        </select>
                                        <label htmlFor="tipopersoneria"
                                               className="label-content"> Tipo Personeria </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="nombrecliente" type="text"
                                               value={this.state.nombrecliente}
                                               placeholder="Ingresar Nombre ..."
                                               onChange={this.clienteNombre.bind(this)}
                                               className='form-control-content' />
                                        <label htmlFor="nombrecliente"
                                               className="label-content"> Nombre </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="apellidocliente" type="text"
                                               value={this.state.apellidocliente}
                                               placeholder="Ingresar Apellido ..."
                                               onChange={this.clienteApellido.bind(this)}
                                               className='form-control-content'/>
                                        <label htmlFor="apellidocliente"
                                               className="label-content"> Apellido  </label>
                                    </div>
                                </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="nitcicliente" type="number"
                                               value={this.state.nitcicliente}
                                               placeholder="Ingresar Nit/Ci ..."
                                               onChange={this.clienteNitci.bind(this)}
                                               className='form-control-content' />
                                        <label htmlFor="nitcicliente"
                                               className="label-content"> Nit/Ci </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">

                                        {this.validarSexo()}
                                        <label htmlFor="sexocliente"
                                               className="label-content"> Sexo </label>
                                    </div>
                                </div>
                                <div className="col-lg-1-content col-md-1-content"> </div>
                                <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input id="fechanacimiento" type="date"
                                               value={this.state.fechanacimientocliente}
                                               placeholder="Ingresar Fecha Nacimiento ..."
                                               onChange={this.clienteFechaNaci.bind(this)}
                                               className='form-control-content' />
                                        <label htmlFor="fechanacimiento"
                                               className="label-content"> Fecha {this.state.habilidar == true ?'Fundacion':'Nacimiento'}  </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
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
                                               className="label-content"> Ciudad  </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-content col-lg-4-content">
                                <div className="col-lg-1-content col-md-2-content col-sm-12-content col-xs-12-content">

                                </div>  
                                <div className="col-lg-9-content col-md-4-content col-sm-12-content col-xs-12-content">
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
                                        <div className="pull-left-content">
                                            <h1 className="title-logo-content">Referencia Para Contactarlo </h1>
                                        </div>
                                        <div className="pull-right-content" style={{ marginTop:10,marginRight:15 }}>
                                            <i className="fa fa-plus btn-content btn-secondary-content" onClick={this.handleAddRow}> </i>
                                        </div>
                                        <div className="caja-content caja-content-altura">
                                            {
                                                this.state.items.map((valor, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div className="col-lg-5-content col-md-6-content col-sm-12-content col-xs-12-content" style={{marginBottom:10}}>
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
                                                                       id={i}
                                                                       name="valor" placeholder="Ingresar descripcion ..."
                                                                       className="form-control-content"
                                                                       value={typeof this.state.descripcionReferencia[i]==='undefined'?"":this.state.descripcionReferencia[i]}
                                                                       onChange={this.cambioDescripcionInput.bind(this)}
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

                                    <textarea className="textarea-content" onChange={this.clienteContacto.bind(this)} value={this.state.contactoCliente}>
                                    </textarea>
                                    <label className="label-content">Contacto </label>
                                </div>
                                <div className="col-lg-12-content col-md-12-content col-sm-6-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <textarea className="textarea-content" onChange={this.clienteNota.bind(this)} value={this.state.notasCliente}/>
                                        <label className="label-content">Observaciones </label>
                                    </div>
                                </div>

                            </div>
                            <div className="form-group-content">
                                <div className="text-center-content">
                                    <button type="submit" className="btn-content btn-success-content">
                                        Aceptas
                                    </button>
                                    <button type="button" className="btn-content btn-danger-content" onClick={this.salirAIndex.bind(this)}>
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
