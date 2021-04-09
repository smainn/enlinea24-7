
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';
import { TreeSelect,message,notification ,Icon,Modal,Button,Divider, DatePicker} from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import "antd/dist/antd.css";     // for css
import Input from '../../../components/input';
import Select from '../../../components/select';
import TextArea from '../../../components/textarea';
import Lightbox from 'react-image-lightbox';
import SelectView from '../../../components/select';
import CDatePicker from '../../../components/datepicker';
import CCharacteristic from '../../../components/characteristic';
import CImage from '../../../components/image';

import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import CSelect from '../../../components/select2';
import moment from 'moment';
import CTreeSelect from '../../../components/treeselect';
import C_Caracteristica from '../../../components/data/caracteristica';
import C_Button from '../../../components/data/button';

const confirm = Modal.confirm;
export default class EditarCliente extends Component{

    constructor(props){
        super(props)

        this.state = {
            openImage: false,
            validarNombre: 1,
            clientes:[],

            nombrecliente:'',
            codigocliente:'',
            tipocliente:'',
            fotocliente:'',
            tipopersoneria: 'S',
            apellidocliente:'',
            nitcicliente:'',
            sexocliente:'M',
            ciudadcliente:'',
            fechanacimientocliente:'',
            ////validaciones
            habilidar:false,
            tipo_clientes:[],
            ciudad:[],
            array_ciudad: [],
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
            nro: 0,
            fecha: this.fechaActual(),
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            codigo: readPermisions(keys.cliente_input_codigo),
            tipo: readPermisions(keys.cliente_select_tipoCliente),
            fecha_nac: readPermisions(keys.cliente_fechaNacimiento),
            personeria: readPermisions(keys.cliente_select_tipoPersoneria),
            caracteristicas: readPermisions(keys.cliente_caracteristicas),
            nombre: readPermisions(keys.cliente_input_nombre),
            apellido: readPermisions(keys.cliente_input_apellido),
            nit: readPermisions(keys.cliente_input_nit),
            genero: readPermisions(keys.cliente_select_genero),
            ciudad: readPermisions(keys.cliente_select_ciudad),
            imagen: readPermisions(keys.cliente_imagenes),
            contacto: readPermisions(keys.cliente_textarea_contactos),
            observaciones: readPermisions(keys.cliente_textarea_observaciones)
        }

        this.handleAddRow = this.handleAddRow.bind(this);
        this.eliminarFoto = this.eliminarFoto.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.cambioReferenciaSelect = this.cambioReferenciaSelect.bind(this);
        this.cambioDescripcionInput = this.cambioDescripcionInput.bind(this);
        this.handleRemoveRow = this.handleRemoveRow.bind(this);
        this.clienteFechaNaci = this.clienteFechaNaci.bind(this);
    }
    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = dia + '/' + mes + '/' + year;

        return fechaFormato;   
    }

    showConfirm(state,sexo,clienteCont,props,this2) {
        confirm({
            title: 'Esta Seguro De Actualizar Esta Informacion?',
            content: 'yes',
            onOk() {
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

                httpRequest('put', '/commerce/api/cliente/'+this2.props.match.params.id, datosActualizar)
                .then(result => {
                    if (result.response === 1) {

                        message.success('Se Registro Correctamente');

                        this2.state.redirect = ! this2.state.redirect
                        this2.setState({
                            redirect : this2.state.redirect
                        }) 
                    } else if (result.response == -2) {
                        this2.setState({ noSesion: true })
                    } else{
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
        httpRequest('get', '/commerce/api/cliente/'+this.props.match.params.id+'/edit')
        .then(result => {
            if (result.response == 1) {
                for (let i=0 ; i < result.data2.length ; i++){
                    this.state.items.push(this.state.items.length + 1)
                    this.state.referenciaSelect.push(result.data2[i].fkidreferenciadecontacto)
                    this.state.descripcionReferencia.push(result.data2[i].valor)
                    this.state.idParaContactarlo.push(result.data2[i].idclientecontactarlo)
                }
                if(result.data.sexo == 'N'){
                    this.setState({
                        habilidar: !this.state.habilidar
                    })
                }
                let codigoCliente = result.data.idcliente;
                codigoCliente = this.state.configCodigo ? result.data.codcliente : codigoCliente;
                this.setState({
                    nro: result.data.idcliente,
                    nombrecliente: result.data.nombre,
                    apellidocliente: (result.data.apellido == null)?'':result.data.apellido,
                    codigocliente: codigoCliente,
                    tipopersoneria: result.data.tipopersoneria,
                    tipocliente: result.data.fkidclientetipo,
                    nitcicliente: (result.data.nit == null)?'':result.data.nit,
                    sexocliente: result.data.sexo,
                    fechanacimientocliente: (result.data.fechanac == null)?'':result.data.fechanac,
                    ciudadclientedata: result.data.fkidciudad,
                    contactoCliente: (result.data.contacto == null)?'':result.data.contacto,
                    notasCliente: (result.data.notas == null)?'':result.data.notas,
                    fotocliente: result.data.foto,
                    referenciaSelect: this.state.referenciaSelect,
                    descripcionReferencia: this.state.descripcionReferencia,
                    items: this.state.items,
                    idParaContactarlo: this.state.idParaContactarlo
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Error al traer los datos');
            }
            
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
        this.setState({
            ciudadclientedata: value
        })
    }
    getTipoClientes(){

        httpRequest('get', '/commerce/api/tipocliente')
        .then(result => {
            if (result.response === 1) {
                this.setState({
                    tipo_clientes: result.data
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getReferencias(){
        httpRequest('get', ws.wsreferenciascont)
        .then((result) => {
            //console.log(result);
            let data = result.data;
            let length = data.length;
            let arr = [];
            let arr2 = [];
            let arr3 = [];
            for (let i = 0; i < length; i++) {
                arr.push({
                    id: data[i].idreferenciadecontacto,
                    title: data[i].descripcion
                });
                /*if (i <= 2) {
                    arr2.push(0);
                    arr3.push("");
                }*/
            }
            this.setState({
                referencias: arr,
                /*referenciaSelect: arr2,
                descripcionReferencia: arr3*/
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getCiudad(){

        httpRequest('get', '/commerce/api/ciudad').
        then(result => {

            this.setState({
                array_ciudad: result.data
            })

            var array = result.data;
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
            //console.log('id del producto ',data[i].value);
            var hijos = this.hijos(data[i].value);
            //console.log('hijos');
            //console.log(hijos);
            data[i].children = hijos;
            //if(hijos.length > 0){
            this.arbolCiudad(hijos);
            //}
        }
    }

    hijos(idpadre) {
        var array =  this.state.array_ciudad;
        //console.log('DATA DE LOS PRODUCTOS');
        //console.log(array);
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            //console.log('ELEMENTO');
            //console.log(array[i]);
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
                    //console.log('datos de referencia',this.state.descripcionReferencia[i])
                    //console.log("foranea key",typeof this.state.referenciaSelect[i] !== 'undefined' ? this.state.referenciaSelect[i] : this.state.referencias[0].idreferenciadecontacto)
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

    componentDidMount(){
        this.getConfigsClient();
        this.getTipoClientes();
        this.getReferencias();
        this.getCiudad();
    }
    
    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                
                this.getClienteId();
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

    guardarDatos(e) {
        //e.preventDefault();
        var clienteCont=this.validarRferenciaContacto()
        var sexo = ''
        
        if(this.state.habilidar === true){
            sexo = 'N'
        }else{
            sexo = this.state.sexocliente;
        }

        var respuesta = 0
        if (this.state.nombrecliente.length > 0){

            respuesta = this.showConfirm(this.state,sexo,clienteCont,this.props,this)
            
            if(respuesta === 1){
                console.log("respuesta dada")
            }else{
                console.log("respuesta fall")
            }
        }else{
            this.setState({
                validarNombre: 0,
            });
            message.error('campos requeridos');
        }
    }

    clienteCodigo(event) {
        message.error('No puede ser Editado el Codigo');
    }
    clienteTipo(value) {
        this.setState({
            tipocliente: value
        })
    }
    clientePersoneria(event) {
        this.setState({
            tipopersoneria: event,
        })
        if (event === 'J') {
            this.setState({
                sexocliente: 'N',
                habilidar:true,
            })
        } else {
            this.setState({
                sexocliente: 'N',
                habilidar:false
            })
        }
    }
    clienteNombre(event) {
        this.setState({
            nombrecliente: event,
            validarNombre: 1,
        })
    }
    clienteApellido(event) {
        this.setState({
            apellidocliente: event,
        })
    }
    clienteNitci(data) {
        this.setState({
            nitcicliente: data,
        })
    }
    clienteSexo(data) {
        this.setState({
            sexocliente: data,
        })
    }
    clienteFechaNaci(date, dateString) {
        this.setState({
            fechanacimientocliente: dateString,
        })
    }
    clienteCiudad(data) {
        this.setState({
            ciudadcliente:data.target.value
        })
    }

    clienteFoto(event) {
        this.setState({
            fotocliente :event.target.files[0]
        })

    }
    clienteNota(event) {
        this.setState({
            notasCliente: event, 
        })
    }

    clienteContacto(event) {
        this.setState({
            contactoCliente: event,
        })
    }
    
    cambiofoto(event) {
        let files=event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
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
        if (this.state.alert1 === true) {

            {this.openNotification()}

        } else {
            return null
        }

    }
    validarSexo() {
        if (this.state.habilidar === true && this.permisions.genero.visible == 'A') {
            return (
                <CSelect 
                    value={this.state.sexocliente}
                    title='Genero*'
                    onChange={this.clienteSexo.bind(this)}
                    component={[
                        <Option key={0} value="N">Ninguno</Option>
                    ]}
                />
            )
        } else if(this.permisions.genero.visible == 'A') {
            return (
                <CSelect 
                    value={this.state.sexocliente}
                    title='Genero*'
                    onChange={this.clienteSexo.bind(this)}
                    component={[
                        <Option key={0} value="N">Ninguno</Option>,
                        <Option key={1} value="M">Masculino</Option>,
                        <Option key={2} value="F">Femenino</Option>
                    ]}
                />
            )
        }
        return null;
    }
    cambioReferenciaSelect(event){
        let index = event.id;
        let valor = event.value;
        if (valor == '') {
            this.state.referenciaSelect[index] = ""
            this.setState({
                referenciaSelect: this.state.referenciaSelect
            })
        } else {
            this.state.referenciaSelect[index] = parseInt(valor);
            this.setState({
                referenciaSelect:this.state.referenciaSelect
            })
        }
    }
    cambioDescripcionInput(event) {
        let index = event.id;
        let valor = event.value;
        if (typeof this.state.referenciaSelect[index] === 'undefined' || this.state.referenciaSelect[index] === "") {
            message.error('Seleccione una opcion para poder seguir ');
        } else {
            this.state.descripcionReferencia[index] = valor;
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
                <div className="pulls-right">
                    <i className="styleImg-content fa fa-trash" style={{'right': '5px'}}
                        onClick={this.eliminarFoto.bind(this)}></i>
                </div>
            )
        }else{
            return null
        }
    }

    handleAddRow() {
       /* var newRow = this.state.items.concat(this.state.items.length + 1);
        this.setState({
            items: newRow
        });*/
        this.setState({
            descripcionReferencia: [
                ...this.state.descripcionReferencia,
                ""
            ],
            referenciaSelect: [
                ...this.state.referenciaSelect,
                ''
            ]
        });
    }

    handleRemoveRow(i) {
        var newItem = this.state.items;
        newItem.splice(i, 1);
        var idEliminar = this.state.idParaContactarlo[i];
        if(typeof idEliminar !== 'undefined'){
            this.state.idParaContactarloEliminar.push(idEliminar);
        }
        this.state.idParaContactarlo.splice(i,1);
        this.state.referenciaSelect.splice(i,1);
        this.state.descripcionReferencia.splice(i,1);
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
                <img src={this.state.fotocliente} alt="none" 
                    onClick={this.abrirImagen.bind(this)}
                    style={{'cursor': 'pointer'}}
                    className="img-principal" />
            )
        }else{
            return (
                <img src="/images/default.jpg"
                        alt="none" className="img-principal" />
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
        this.setState({
            redirect:true
        })
    }

    abrirImagen() {
        this.setState({
            openImage: true,
        });
    }

    closeImagen() {
        this.setState({
            openImage: false,
        });
    }

    componentFechaNac() {
        if (this.permisions.fecha_nac.visible == 'A') {
            let disabled = this.permisions.fecha_nac.editable == 'A' ? false : true;
            let fechaNac = this.state.fechanacimientocliente == '' ? null : moment(this.state.fechanacimientocliente, 'YYYY-MM-DD');
            return (
                <div className="inputs-groups">
                    <DatePicker
                        //allowClear={false}
                        //defaultValue={moment('2000-01-01', 'YYYY-MM-DD')}
                        format={'YYYY-MM-DD'}
                        onChange={this.clienteFechaNaci}
                        value={fechaNac}
                        style={{
                            alignContent: 'center',
                            width: '100%',
                            minWidth: '100%',
                        }}
                        disabled={disabled}
                    />
                    <label 
                        htmlFor="fechaini" 
                        className="lbls-input active">
                        Fecha Nacimiento 
                    </label>
                </div>
                /*}
                <div className="inputs-groups">
                    <DatePicker
                        allowClear={false}
                        defaultValue={moment('2000-01-01', 'YYYY-MM-DD')}
                        format={'YYYY-MM-DD'}
                        onChange={this.clienteFechaNaci}
                        value={moment(this.state.fechanacimientocliente, 'YYYY-MM-DD')}
                        style={{
                            alignContent: 'center',
                            width: '100%',
                            minWidth: '100%',
                        }}
                        disabled={disabled}
                    />
                    <label 
                        htmlFor="fechaini" 
                        className="lbls-input active">
                        {(this.state.habilidar == true) ? 'Fecha Fundacion' : 'Fecha Nacimiento'}
                    </label>
                    
                    </div>*/
            );
        }
        return null;
    }

    listTipoClients() {

        let data = this.state.tipo_clientes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option 
                    key={i} 
                    value={data[i].idclientetipo}>
                    {data[i].descripcion}
                </Option>
            );
        }
        return arr;
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }

        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/cliente/index" />)
        }
        const listTipoClients = this.listTipoClients();
        const componentInmage = this.onchangeComponentImage();
        const componentFechaNac = this.componentFechaNac();

        return (
            <div className="rows">
                {(this.state.openImage)?
                    <Lightbox 
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={this.state.fotocliente}
                    />
                :''}
                <div className="cards" style={{'padding': '0'}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Editar cliente</h1>
                        </div>
                    </div>


                    <div className="forms-groups">
                        {/*<form onSubmit={this.guardarDatos.bind(this)} encType="multipart/form-data" >*/}
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <Input 
                                        value={this.state.codigocliente}
                                        onChange={this.clienteCodigo.bind(this)}
                                        title='Codigo'
                                        permisions={this.permisions.codigo}
                                        readOnly={true}
                                        //configAllowed={this.state.configCodigo}
                                    />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <CSelect
                                        title="Tipo Cliente"
                                        value={this.state.tipocliente}
                                        onChange={this.clienteTipo.bind(this)}
                                        component={listTipoClients}
                                        permisions={this.permisions.tipo}
                                    />
                                    {/*}
                                    <div className="inputs-groups">
                                        <select name="tipocliente" id="tipocliente" 
                                            className="forms-control"
                                            value={this.state.tipocliente} 
                                            onChange={this.clienteTipo.bind(this)}>

                                            {this.state.tipo_clientes.map((resultado, indice)=>(
                                                <option key={indice} value={resultado.idclientetipo}>{resultado.descripcion}</option>
                                            ))}

                                        </select>
                                        <label htmlFor="tipocliente"
                                            className="lbls-input active"> 
                                                Tipo Cliente 
                                        </label>

                                    </div>
                                    */}
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <CSelect
                                        title='Tipo Personeria*'
                                        value={this.state.tipopersoneria}
                                        onChange={this.clientePersoneria.bind(this)}
                                        permisions={this.permisions.personeria}
                                        component={[
                                            <Option key={0} value="S">Ninguno</Option>,
                                            <Option key={1} value="N">Natural</Option>,
                                            <Option key={2} value="J">Juridico</Option>
                                        ]}
                                    />
                                    {/*}
                                    <SelectView
                                        value={this.state.tipopersoneria}
                                        title='Tipo Personeria*'
                                        onChange={this.clientePersoneria.bind(this)}
                                        data={[
                                            {   value: 'N', title: 'Natural'},
                                            {   value: 'J', title: 'Juridico'}
                                        ]}
                                    />
                                    */}
                                </div>

                                <div className="col-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    { componentFechaNac }
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">    
                                    <Input 
                                        value={this.state.nombrecliente}
                                        onChange={this.clienteNombre.bind(this)}
                                        title='Nombre'
                                        validar={this.state.validarNombre}
                                        permisions={this.permisions.nombre}
                                    />
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    
                                    <Input 
                                        value={this.state.apellidocliente}
                                        onChange={this.clienteApellido.bind(this)}
                                        title='Apellido'
                                        permisions={this.permisions.apellido}
                                    />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <Input 
                                        value={this.state.nitcicliente}
                                        onChange={this.clienteNitci.bind(this)}
                                        title='Nit/Ci'
                                        permisions={this.permisions.nit}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                    {this.validarSexo()}
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <CTreeSelect
                                        title="Ciudad"
                                        value={this.state.ciudadclientedata}
                                        treeData={this.state.ciudad}
                                        placeholder="Seleccionar"
                                        onChange={this.onChange.bind(this)}
                                        permisions={this.permisions.ciudad}
                                    />
                                    {/*}
                                    <div className="inputs-groups">
                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            value={this.state.ciudadclientedata}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.ciudad}
                                            placeholder="Seleccionar"
                                            onChange={this.onChange.bind(this)}
                                        />
                                        <label htmlFor="ciudadcliente"
                                                className="lbls-input active"> Ciudad  </label>
                                    </div>
                                */}
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Caracteristica 
                                    title="Referencia Para Contactarlo "
                                    data={this.state.referencias}
                                    onAddRow={this.handleAddRow}
                                    optionDefault="Seleccionar"
                                    valuesSelect={this.state.referenciaSelect}
                                    onChangeSelect={this.cambioReferenciaSelect}
                                    valuesInput={this.state.descripcionReferencia}
                                    onChangeInput={this.cambioDescripcionInput}
                                    onDeleteRow={this.handleRemoveRow}
                                    permisions={this.permisions.caracteristicas}
                                />

                                <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                    <CImage 
                                        onChange={this.cambiofoto.bind(this)}
                                        image={this.state.fotocliente}
                                        images={[]}
                                        //next={this.next}
                                        //prev={this.prev}
                                        //index={this.state.indice}
                                        delete={this.eliminarFoto}
                                        style={{ 
                                                height: 240, 
                                                'border': '1px solid transparent',
                                            }}
                                        permisions={this.permisions.imagen}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea 
                                        value={this.state.contactoCliente}
                                        onChange={this.clienteContacto.bind(this)}
                                        title='Contacto'
                                        permisions={this.permisions.contacto}
                                    />
                                </div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea 
                                        value={this.state.notasCliente}
                                        onChange={this.clienteNota.bind(this)}
                                        title='Observaciones'
                                        permisions={this.permisions.observaciones}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="txts-center">
                                    <C_Button onClick={this.guardarDatos.bind(this)}
                                        type='primary' title='Aceptar'
                                    />
                                    <C_Button onClick={this.salirAIndex.bind(this)}
                                        type='danger' title='Cancelar'
                                    />
                                </div>
                            </div>
                        {/*</form>*/}
                    </div>
                </div>
            </div>
        );

    }


}
