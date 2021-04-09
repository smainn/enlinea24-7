
import React, { Component } from 'react';

import axios from 'axios';

import {Redirect} from 'react-router-dom';

import { TreeSelect, message, notification ,Icon, DatePicker, Modal, Spin} from 'antd';

import "antd/dist/antd.css";     

var CIUDAD_CLIENTE={"descripcion":'Seleccionar'}

const URL_CLIENTE_TIPO = '/commerce/api/tipocliente';

export default class CrearCliente extends Component{

    constructor(props){
        super(props);
        this.state = {
            inputInicio: true,
            redirect: false,
            loadModalCrearCliente: false,

            visibleCrearCliente: false,

            habilidar:false,
            alert1: false,

            codigocliente: '',
            tipocliente: '',
            tipopersoneria: 'N',
            nombrecliente: '',
            apellidocliente: '',
            nitcicliente: '',
            sexocliente: 'M',
            fechanacimientocliente: '',
            ciudadclientedata: undefined,
            fotocliente: '',
            contactoCliente: '',
            notasCliente: '',

            tipo_clientes: [],
            ciudad: [],
            ciudadCargados: [],
            items: [1, 2, 3],

            referenciaSelect: [],
            descripcionReferencia: [],

            referencias: [],
        }
    }

    componentWillMount(){
        if (this.props.aviso === 1) {
            this.getCiudad();
            this.getReferencias();
            this.getTipoClientes();
        }
        axios.get('').then(response => {
            
            if (response.data.response == 1) {
                this.setState({
                    tipo_clientes: response.data.data,
                    tipocliente: response.data.data[0].idclientetipo,

                    ciudadCargados: response.data.ciudad,
                    ciudadclientedata: response.data.ciudad[0].idciudad,

                    referencias: response.data.referencia,
                });

                var array = response.data.ciudad;
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

                this.setState({
                    ciudad: array_aux
                });
            }

        }).catch(error => {
            console.log(error)
        });
    }

    getTipoClientes(){
        axios.get('/commerce/api/tipocliente').then(response => {   
            if(response.data.response == 1) {
                this.setState({
                    tipo_clientes: response.data.data,
                    tipocliente: response.data.data[0].idclientetipo,
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    getCiudad(){
        axios.get('/commerce/api/ciudad').
        then(response => {

            this.setState({
                ciudadCargados: response.data.data,
                ciudadclientedata: response.data.data[0].idciudad,
            });

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

            this.setState({
                ciudad: array_aux
            });

        }).catch(error => {
            console.log(error)
        })
    }

    arbolCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {

            var hijos = this.hijos(data[i].value);
            if (hijos.length > 0) {
                data[i].children = hijos;
            }
            this.arbolCiudad(hijos);
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

    getReferencias(){
        axios.get('/commerce/api/referenciacontacto').then(response => {
            if(response.data.response == 1) {
                this.setState({
                    referencias:response.data.data,
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onChangeClienteCodigo(event) {
        this.setState({
            codigocliente: event.target.value,
        });
    }

    onChangeClienteTipo(event) {
        this.setState({
            tipocliente: event.target.value,
            inputInicio: false,
        });
    }

    onChangeClientePersoneria(event) {
        this.setState({
            tipopersoneria: event.target.value,
            inputInicio: false,
        });
        if (event.target.value === 'J') {
            this.setState({
                habilidar: true,
            });
        } else {
            this.setState({
                habilidar: false,
            });
        }
    }

    onChangeClienteNombre(event) {
        this.setState({
            nombrecliente:event.target.value,
            inputInicio: false,
        });
    }

    onChangeClienteApellido(event) {
        this.setState({
            apellidocliente:event.target.value,
            inputInicio: false,
        });
    } 

    onChangeClienteNitci(event) {
        this.setState({
            nitcicliente: event.target.value,
            inputInicio: false,
        });
    }

    onChangeClienteSexo(event) {
        this.setState({
            sexocliente: event.target.value,
            inputInicio: false,
        });
    }

    onChangeClienteFechaNaci(event) {
        this.setState({
            fechanacimientocliente: event.target.value,
        });
    }

    onChangeCiudadCliente(event) {
        this.setState({
            ciudadclientedata: event,
        });
    }

    cambioReferenciaSelect(e){
        let index = e.target.id;
        let valor = e.target.value;
        if (isNaN(valor)) {

            this.state.descripcionReferencia[index] = "";
            this.state.referenciaSelect[index] = "";
            this.setState({
                descripcionReferencia: this.state.descripcionReferencia,
                inputInicio: false,
            });

        } else {
            this.state.referenciaSelect[index] = parseInt(valor);
            this.state.descripcionReferencia[index] = "";
            this.setState({
                referenciaSelect: this.state.referenciaSelect,
                descripcionReferencia: this.state.descripcionReferencia,
                inputInicio: false,
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
                descripcionReferencia: this.state.descripcionReferencia,
                inputInicio: false,
            });
        }
    }

    onChangeClienteContacto(event) {
        this.setState({
            contactoCliente: event.target.value,
            inputInicio: false,
        });
    }

    onChangeClienteNota(event) {
        this.setState({
            notasCliente: event.target.value,
            inputInicio: false,
        });
    }

    validarSexo() {
        if (this.state.habilidar == true) {
            return (
                <select name="sexocliente" id="sexocliente" 
                        className="form-control-content cursor-not-allowed"
                        value={this.state.sexocliente}
                        onChange={this.onChangeClienteSexo.bind(this)}
                        disabled={this.state.habilidar}>
                    <option value="S" selected> Sin Declarar</option>
                </select>
            );
        }else {
            return (
                <select name="sexocliente" id="sexocliente" className="form-control-content"
                        value={this.state.sexocliente}
                        onChange={this.onChangeClienteSexo.bind(this)}
                        disabled={this.state.habilidar}>
                    <option value="M">Masculino</option>
                    <option value="F" >Femenino</option>
                </select>
            );
        }
    }

    cambiofoto(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    fotocliente: e.target.result,
                    alert1: false,
                    inputInicio: false,
                });
            }
        } else {
            this.setState({
                alert1: true,
                inputInicio: false,
            });
        }
    }

    eliminarFoto() {
        this.setState({
            fotocliente: '',
        });
    }

    validarEliminarFoto() {
        if(this.state.fotocliente !== '') {
            return (
                <div className="pull-right-content">
                    <i className="styleImg fa fa-trash" onClick={this.eliminarFoto.bind(this)}></i>
                </div>
            )
        }else{
            return null;
        }
    }

    validarImagen() {
        
        if (this.state.alert1 == true) {
            {this.openNotification()}

        } else {
            return null;
        }

    }

    openNotification () {
        notification.open({
            message: 'Alerta',
            description: 'Tipo De Imagen Incorrecta, Asegurese de que sea PNG y JPG',
            icon: <Icon type="warning" style={{ color: '#dfce01' }} />,
            onClick: () => {
                
            },
        });
    }

    onchangeComponentImage() {
        if (this.state.fotocliente !== "" && this.state.fotocliente !== null) {
            return (
                <div className="caja-img caja-altura" >
                    <img src={this.state.fotocliente} style={{'cursor': 'pointer'}}
                        alt="none" className="img-principal" />
                </div>
            );
        }else{
            return (
                <div className="caja-img caja-altura">
                    <img src="/images/default.jpg" 
                         alt="none" className="img-principal"/>
                </div>
            );
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

        this.state.referenciaSelect.splice(i, 1);
        this.state.descripcionReferencia.splice(i, 1);
        this.setState({
            items: newItem,
            referenciaSelect: this.state.referenciaSelect,
            descripcionReferencia: this.state.descripcionReferencia
        });
    }
    

    guardarDatos(e) {
        e.preventDefault();

        if((this.state.codigocliente.length > 0) && (this.state.nombrecliente.length > 0) && 
            (this.state.apellidocliente.length > 0)) {
            this.setState({
                visibleCrearCliente: true,
            });
        }else {
            if(this.state.nombrecliente == "") {
                message.error("Nombre es un campo Requerido");
            }
            if(this.state.apellidocliente == "") {
                message.error("Apellido es un campo Requerido");
            }
            if(this.state.codigocliente == "") {
                message.error("Codigo es un campo Requerido");
            }
        }
    }

    focusInputInicio(event) {
        if (event != null) {
            if (this.state.inputInicio) {
                event.focus();
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

    handleCerrarModal() {
        this.setState({
            visibleCrearCliente: false,
            loadModalCrearCliente: false,
        });
    }

    validarRferenciaContacto() {
        if (this.state.descripcionReferencia.length > 0) {
            var array = []
            for (let i = 0; i < this.state.descripcionReferencia.length; i++) {
                if (String(this.state.descripcionReferencia[i]).trim().length > 0 && String(this.state.referenciaSelect[i]).trim().length > 0 && typeof this.state.referenciaSelect[i] !== 'undefined' && typeof this.state.descripcionReferencia[i] !== 'undefined') {
                    
                    var referenciaDesc = {
                        "fkidreferenciacontacto": typeof this.state.referenciaSelect[i] !== 'undefined' ? this.state.referenciaSelect[i]:this.state.referencias[0].idreferenciadecontacto,
                        "valor": this.state.descripcionReferencia[i]
                    }
                    array.push(referenciaDesc);
                }
            }
        }
        return array;
    }

    onSubmitGuardarDatos(e) {
        e.preventDefault();
        this.setState({
            loadModalCrearCliente: true,
        });
        var clienteCont = this.validarRferenciaContacto()
        var sexo = ''
        if(this.state.habilidar === true){
            sexo = 'N'
        }else{
            sexo = this.state.sexocliente;
        }

        const formData = new FormData();

            formData.append('codigoCliente', this.state.codigocliente);
            formData.append('nombreCliente', this.state.nombrecliente);
            formData.append('apellidoCliente', this.state.apellidocliente);
            formData.append('nitCliente', this.state.nitcicliente);
            formData.append('fotoCliente', this.state.fotocliente);
            formData.append('sexoCliente', sexo);
            formData.append('tipoPersoneriaCliente', this.state.tipopersoneria);
            formData.append('fechaNacimientoCliente', this.state.fechanacimientocliente);
            formData.append('notasCliente', this.state.notasCliente);
            formData.append('contactoCliente', this.state.contactoCliente);
            formData.append('fkidciudad', this.state.ciudadclientedata);
            formData.append('fkidtipocliente', this.state.tipocliente);
            formData.append('datosTablaIntermedia', JSON.stringify(typeof clienteCont === 'undefined'?[]:clienteCont));
            
            axios.post('/commerce/api/cliente', formData,{
                headers:{'Content-Type':'multipart/form-data'}
            }).then(response => {

                if(response.data.response === 1){
                    
                    if (this.props.aviso === 1) {
                        this.limpiarDatos();
                        this.handleCerrarModal();
                        this.props.callback(response.data.cliente, 1);
                        message.success('Se Registro Correctamente');
                    }else {
                        message.success('Se Registro Correctamente');
                        this.setState({
                            redirect:!this.state.redirect
                        });
                    }

                }

            }).catch(error => {
                console.log(error)
            });
    }

    limpiarDatos() {
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
            items: [1, 2, 3],
        });
    }

    componentUpdateCliente() {
        return (
            <Modal
                visible={this.state.visibleCrearCliente}
                title='Registrar Cliente'
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                width={400}
            >
                <div>

                    <div className="form-group-content"
                        style={{'display': (this.state.loadModalCrearCliente)?'none':'block'}}>
                        
                        <form onSubmit={this.onSubmitGuardarDatos.bind(this)} encType="multipart/form-data">
                            
                            <div className="text-center-content"
                                style={{'marginTop': '-15px', 'marginBottom': '10px'}}>
                                
                                <label className='label-group-content'>
                                    Estas seguro de guardar datos?
                                </label>
                            
                            </div>

                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
    
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button type="submit" 
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button> 
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrarModal.bind(this)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    </div>

                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadModalCrearCliente)?'block':'none',
                            'marginTop': '-15px'
                        }}>
                        <div className="text-center-content">
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                            
                        </div>
                        <div className="text-center-content"
                            style={{'marginTop': '20px'}}>
                            <label> Cargando Informacion Favor de Esperar ...</label>
                        </div>

                    </div>
                
                </div>

            </Modal>
        );
    }

    render() {

        const componentInmage = this.onchangeComponentImage();

        const componentUpdateCliente = this.componentUpdateCliente();

        if(this.state.redirect){
            return (<Redirect to="/commerce/admin/indexCliente" />)
        }

        return (
            <div className='row-content'>
                {componentUpdateCliente}
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Registrar Cliente </h1>
                    </div>
                </div>
                <div className="card-body-content card-primary-content">
                    
                    <form onSubmit={this.guardarDatos.bind(this)}
                        className="form-content" encType="multipart/form-data">
                        
                        <div className="form-group-content col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content">
                                    <input  type="text" ref={this.focusInputInicio.bind(this)}
                                            value={this.state.codigocliente}
                                            placeholder="Ingresar Codigo"
                                            onChange={this.onChangeClienteCodigo.bind(this)}
                                            className='form-control-content reinicio-padding'
                                    />
                                    <label htmlFor="codigocliente"
                                        className="label-group-content"> Codigo </label>
                                </div>
                            </div>

                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content">
                                    <select name="tipocliente" id="tipocliente" 
                                        className="form-control-content"
                                        value={this.state.tipocliente} 
                                        onChange={this.onChangeClienteTipo.bind(this)}>

                                        {this.state.tipo_clientes.map((resultado, indice)=>(
                                            <option key={indice} value={resultado.idclientetipo}>{resultado.descripcion}</option>
                                        ))}

                                    </select>
                                    <label htmlFor="tipocliente"
                                        className="label-group-content"> 
                                            Tipo Cliente 
                                    </label>

                                </div>
                            </div>
                        
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content">
                                    <select name="tipopersoneria" id="tipopersoneria" 
                                            className="form-control-content"
                                            value={this.state.tipopersoneria} onChange={this.onChangeClientePersoneria.bind(this)}>
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
                                            onChange={this.onChangeClienteNombre.bind(this)}
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
                                            onChange={this.onChangeClienteApellido.bind(this)}
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
                                            onChange={this.onChangeClienteNitci.bind(this)}
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

                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content">
                                    <input id="fechanacimiento" type="date"
                                            value={this.state.fechanacimientocliente}
                                            placeholder="Ingresar Fecha Nacimiento"
                                            onChange={this.onChangeClienteFechaNaci.bind(this)}
                                            className='form-control-content reinicio-padding' />
                                    <label htmlFor="fechanacimiento"
                                            className="label-group-content"> 
                                        Fecha {this.state.habilidar == true ? 'Fundacion' : 'Nacimiento'} {this.state.habilidar}  
                                    </label>
                                </div>
                            </div>

                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <div className="input-group-content">
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        value={this.state.ciudadclientedata}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.ciudad}
                                        placeholder="Seleccionar"
                                        onChange={this.onChangeCiudadCliente.bind(this)}
                                    />
                                    <label htmlFor="ciudadcliente"
                                            className="label-group-content"> Ciudad  </label>
                                </div>
                            </div>

                        </div>
                    
                        <div className="form-group-content col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            
                            <div className="col-lg-1-content col-md-1-content"></div>
                            
                            <div className="col-lg-11-content col-md-11-content col-sm-12-content col-xs-12-content">
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
                        </div>

                        <div className="form-group-content col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content ">
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                <div className="card-caracteristica">
                                    <div className="pull-left-content">
                                        <h1 className="title-logo-content ">Referencia Para Contactarlo </h1>
                                    </div>
                                    <div className="pull-right-content" style={{ marginTop: 10, marginRight: 15 }}>
                                        <i className="fa fa-plus btn-content btn-secondary-content" onClick={this.handleAddRow.bind(this)}> </i>
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
                                                                {this.state.referencias.map((j, k)=>(

                                                                    <option key={k} value={j.idreferenciadecontacto}>{j.descripcion}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content" style={{marginBottom:10}}>
                                                            <input type="text"
                                                                    
                                                                placeholder="Ingresar descripcion ..."
                                                                className={((typeof this.state.referenciaSelect[i] != 'undefined') && (this.state.referenciaSelect[i] != ''))?'form-control-content': 'form-control-content cursor-not-allowed'}
                                                                value={typeof this.state.descripcionReferencia[i] === 'undefined'?"":this.state.descripcionReferencia[i]}
                                                                readOnly={((typeof this.state.referenciaSelect[i] != 'undefined') && (this.state.referenciaSelect[i] != ''))?false:true}
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

                                <textarea className="textarea-content" value={this.state.contactoCliente} 
                                    onChange={this.onChangeClienteContacto.bind(this)}> </textarea>

                                <label className="label--group-content">Contacto </label>
                            </div>
                            <div className="col-lg-12-content col-md-12-content col-sm-6-content col-xs-12-content">
                                <div className="input-group-content">
                                    <textarea className="textarea-content" value={this.state.notasCliente} 
                                        onChange={this.onChangeClienteNota.bind(this)}/>
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
                                <button type="button" className="btn-content btn-sm-content btn-danger-content" 
                                    onClick={this.salirCrear.bind(this)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    
                    </form>
                </div>
            </div>
        );
    }
}