
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, notification ,Icon, DatePicker, Modal, Select} from 'antd';
import { httpRequest, removeAllData, readData, saveData } from '../../../tools/toolsStorage';
import ws from '../../../tools/webservices';

import "antd/dist/antd.css";     
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import Lightbox from 'react-image-lightbox';
import CTreeSelect from '../../../components/treeselect';
import Confirmation from '../../../components/confirmation';
import CCharacteristic from '../../../components/characteristic';
import CImage from '../../../components/image';

import { readPermisions } from '../../../tools/toolsPermisions';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import CSelect from '../../../components/select2';
import PropTypes from 'prop-types';
import keysStorage from '../../../tools/keysStorage';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_DatePicker from '../../../components/data/date';
import C_TreeSelect from '../../../components/data/treeselect';
import C_Caracteristica from '../../../components/data/caracteristica';
import C_Button from '../../../components/data/button';

const {Option} = Select;

let date = new Date()

class CrearCliente extends Component{

    constructor(props){
        super(props);
        this.state = {
            openImage: false,
            validarNombre: 1,

            inputInicio: true,
            redirect: false,
            loadModalCrearCliente: false,

            visibleCrearCliente: false,

            habilidar:false,
            alert1: false,

            codigocliente: '',
            tipocliente: '',
            tipopersoneria: 'S',
            nombrecliente: '',
            apellidocliente: '',
            nitcicliente: '',
            sexocliente: 'N',
            fechanacimientocliente: null,

            ciudadclientedata: 1,
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
            validacion: [1],

            nro: 0,
            noSesion: false,
            configCodigo: false,
            validarCodigo: 1,
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
        this.redirect = this.redirect.bind(this);
        this.eliminarFoto = this.eliminarFoto.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);
        this.cambioReferenciaSelect = this.cambioReferenciaSelect.bind(this);
        this.cambioDescripcionInput = this.cambioDescripcionInput.bind(this);
        this.handleRemoveRow = this.handleRemoveRow.bind(this);
        this.onChangeClienteFechaNaci = this.onChangeClienteFechaNaci.bind(this);
    }

    componentDidMount() {
        this.getConfigsClient();
        if (this.props.bandera == 0) {
            this.getData();
        }
    }

    getData() {
        this.getCiudad();
        this.getReferencias();
        this.getTipoClientes();
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

    getTipoClientes(){
        httpRequest('get', '/commerce/api/tipocliente')
        .then(result => {   
            if (result.response == 1) {
                this.setState({
                    tipo_clientes: result.data,
                    tipocliente: result.data[0].idclientetipo,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    getCiudad(){
        httpRequest('get', '/commerce/api/ciudad').
        then(result => {
            if (result.response == 1) {
                this.setState({
                    ciudadCargados: result.data,
                    //ciudadclientedata: result.data[0].idciudad,
                    nro: result.nro,
                });
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
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result)
            }
            
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

    redirect() {
        if (this.props.bandera == 1) {
            this.limpiarDatos();
            this.props.callback({}, 0);
            //message.success('Se cancelo Correctamente');
        } else {
            this.setState({redirect: true});
        }
    }

    showCancelConfirm() {

        const redirect = this.redirect;
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro del nuevo cliente?',
            content: 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                redirect();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    getReferencias(){
        httpRequest('get', ws.wsreferenciascont)
        .then((result) => {
            if (result.response == 1) {
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
                    if (i <= 2) {
                        arr2.push("");
                        arr3.push("");
                    }
                }
                this.setState({
                    referencias: arr,
                    referenciaSelect: arr2,
                    descripcionReferencia: arr3
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            
        })
        .catch((error) => {
            console.log(error);
        })
    }

    verificarCodigo(value) {

        if (value.length > 0) {
            httpRequest('get', ws.wscodclientevalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validarCodigo: 1 })
                    } else {
                        this.setState({ validarCodigo: 0 })
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            this.setState({ validarCodigo: 1 })
        }
        
    }

    handleVerificCodigo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeClienteCodigo(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigocliente: event,
        });
    }

    onChangeClienteTipo(value) {
        this.setState({
            tipocliente: value,
            inputInicio: false,
        });
    }

    onChangeClientePersoneria(event) {
        this.setState({
            tipopersoneria: event,
        });
        if (event === 'J') {
            this.setState({
                sexocliente: 'N',
                habilidar: true,
            });
        } else {
            this.setState({
                sexocliente: 'N',
                habilidar: false,
            });
        }
    }

    onChangeClienteNombre(event) {
        this.setState({
            nombrecliente: event,
            validarNombre: 1,
        });
    }

    onChangeClienteApellido(event) {
        this.setState({
            apellidocliente: event,
        });
    } 

    onChangeClienteNitci(event) {
        this.setState({
            nitcicliente: event,
        });
    }

    onChangeClienteSexo(event) {
        this.setState({
            sexocliente: event,
        });
    }

    onChangeClienteFechaNaci(date) {
        this.setState({
            fechanacimientocliente: date,
        });
    }

    onChangeCiudadCliente(event) {
        this.setState({
            ciudadclientedata: event,
        });
    }

    cambioReferenciaSelect(event){
        let index = event.id;
        let valor = event.value;
        if (valor == '') {

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

    cambioDescripcionInput(event) {

        let posicion = event.id;
        let valor = event.value;

        if (typeof this.state.referenciaSelect[posicion] === 'undefined' || this.state.referenciaSelect[posicion] === "" || 
            this.state.referenciaSelect[posicion] == '') {
            message.warning('Seleccione una opcion para poder seguir ');
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
            contactoCliente: event,
        });
    }

    onChangeClienteNota(event) {
        this.setState({
            notasCliente: event,
        });
    }

    validarSexo() {
        if (this.state.habilidar == true && this.permisions.genero.visible == 'A') {
            return (
                <C_Select 
                    value={this.state.sexocliente}
                    title='Genero*'
                    onChange={this.onChangeClienteSexo.bind(this)}
                    component={[
                        <Option key={0} value="N">Ninguno</Option>
                    ]}
                />
            );
        }else if(this.permisions.genero.visible == 'A') {
            return (
                <C_Select 
                    value={this.state.sexocliente}
                    title='Genero*'
                    onChange={this.onChangeClienteSexo.bind(this)}
                    component={[
                        <Option key={0} value="N">Ninguno</Option>,
                        <Option key={1} value="M">Masculino</Option>,
                        <Option key={2} value="F">Femenino</Option>
                    ]}
                />
            );
        }
        return null;
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
                <div className="pulls-right">
                    <i className="styleImg-content fa fa-trash" style={{'right': '5px'}}
                        onClick={this.eliminarFoto.bind(this)}></i>
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
            description: 'Tipo De Imagen Incorrecta, Asegurese de que sea PNG o JPG',
            icon: <Icon type="warning" style={{ color: '#dfce01' }} />,
            onClick: () => {
                
            },
        });
    }

    onchangeComponentImage() {
        if (this.state.fotocliente !== "" && this.state.fotocliente !== null) {
            return (
                <img src={this.state.fotocliente} 
                    style={{'cursor': 'pointer'}}
                    onClick={this.abrirImagen.bind(this)}
                    alt="none" className="img-principal" 
                />
            );
        }else{
            return (
                <img src="/images/default.jpg" 
                    alt="none" className="img-principal"
                />
            );
        }
    }

    handleAddRow() {
        
        //var newRow = this.state.items.concat(this.state.items.length + 1);
        this.setState({
            //items: newRow,
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
        //var newItem = this.state.items;
        //newItem.splice(i, 1);

        this.state.referenciaSelect.splice(i, 1);
        this.state.descripcionReferencia.splice(i, 1);
        this.setState({
            //items: newItem,
            referenciaSelect: this.state.referenciaSelect,
            descripcionReferencia: this.state.descripcionReferencia
        });
    }
    

    guardarDatos(e) {
        //e.preventDefault();

        if (this.state.nombrecliente.toString().trim().length > 0 && 
            (!this.state.configCodigo || this.state.codigocliente.length > 0)) {
            this.setState({
                visibleCrearCliente: true,
            });
        } else {
            if(this.state.nombrecliente.toString().trim().length == 0) {
                this.state.validarNombre = 0;
                this.setState({
                    validarNombre: this.state.validarNombre,
                    nombreCliente: '',
                });
            }
            message.error("Error campo Requerido");
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
                if (String(this.state.descripcionReferencia[i]).trim().length > 0 && 
                    String(this.state.referenciaSelect[i]).trim().length > 0 && 
                    typeof this.state.referenciaSelect[i] !== 'undefined' && 
                    typeof this.state.descripcionReferencia[i] !== 'undefined') {
                    
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
        //e.preventDefault();
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
        let body = {
            codigoCliente: this.state.codigocliente,
            nombreCliente: this.state.nombrecliente,
            apellidoCliente: this.state.apellidocliente,
            nitCliente: this.state.nitcicliente,
            fotoCliente: this.state.fotocliente,
            sexoCliente: sexo,
            tipoPersoneriaCliente: this.state.tipopersoneria,
            fechaNacimientoCliente: this.state.fechanacimientocliente,
            notasCliente: this.state.notasCliente,
            contactoCliente: this.state.contactoCliente,
            fkidciudad: this.state.ciudadclientedata,
            fkidtipocliente: this.state.tipocliente,
            datosTablaIntermedia: JSON.stringify(typeof clienteCont === 'undefined'?[]:clienteCont),
        };

            httpRequest('post', '/commerce/api/cliente', body)
            .then(result => {
                if(result.response === 1){
                    
                    if (this.props.bandera === 1) {

                        this.limpiarDatos();
                        this.handleCerrarModal();
                        this.props.callback(result.cliente, 1);
                        message.success('Se Registro Correctamente');

                    }else {
                        message.success('Se Registro Correctamente');
                        this.setState({
                            redirect:!this.state.redirect
                        });
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }

            }).catch(error => {
                //console.log('ERROR aca');
                console.log(error)

            });
    }

    limpiarDatos() {
        let tipocliente = this.state.tipo_clientes.length === 0 ? '' : this.state.tipo_clientes[0].idclientetipo;
        this.setState({
            codigocliente: '',
            tipocliente: tipocliente,
            tipopersoneria: 'S',
            nombrecliente: '',
            apellidocliente: '',
            nitcicliente: '',
            habilidar: false,
            sexocliente: 'N',
            fechanacimientocliente: '',
            ciudadclientedata: 1,
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
            <Confirmation
                visible={this.state.visibleCrearCliente}
                loading={this.state.loadModalCrearCliente}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Registrar Cliente'
                onClick={this.onSubmitGuardarDatos.bind(this)}
                content='¿Estas seguro de guardar datos...?'
            />
        );
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

    componentFechaNac() {
        if (this.permisions.fecha_nac.visible == 'A') {
            let disabled = this.permisions.fecha_nac.editable == 'A' ? false : true;
            return (
                <C_DatePicker 
                    format={'YYYY-MM-DD'}
                    allowClear={true}
                    onChange={this.onChangeClienteFechaNaci}
                    value={this.state.fechanacimientocliente}
                    readOnly={disabled}
                    title={'Fecha Nacimiento'}
                />
            );
        }
        return null;
    }

    render() {

        const keyCreateCliente = readData(keysStorage.createcliente);
        if (keyCreateCliente == 'A') {
            this.getData();
            saveData(keysStorage.createcliente, 'N');
        }

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        //const componentInmage = this.onchangeComponentImage();
        const componentUpdateCliente = this.componentUpdateCliente();
        const listTipoClients = this.listTipoClients();
        const componentFechaNac = this.componentFechaNac();

        if(this.state.redirect){
            return (<Redirect to="/commerce/admin/cliente/index" />)
        }

        return (
            <div className="rows">
                {componentUpdateCliente}
                {(this.state.openImage)?
                    <Lightbox
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={this.state.fotocliente}
                    />
                :''}
                <div className="cards" style={{'padding': 0}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar cliente</h1>
                        </div>
                    </div>
                    
                    
                    {/*<form onSubmit={this.guardarDatos.bind(this)} encType="multipart/form-data">*/}
                        <div className="forms-groups">
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    value={this.state.codigocliente}
                                    onChange={this.onChangeClienteCodigo.bind(this)}
                                    title='Codigo'
                                    validar={this.state.validarCodigo}
                                    permisions={this.permisions.codigo}
                                    configAllowed={this.state.configCodigo}
                                    mensaje='El codigo ya existe'
                                />

                                <C_Select 
                                    title="Tipo Cliente"
                                    value={this.state.tipocliente}
                                    onChange={this.onChangeClienteTipo.bind(this)}
                                    component={listTipoClients}
                                    permisions={this.permisions.tipo}
                                />

                                <C_Select 
                                    title='Tipo Personeria*'
                                    value={this.state.tipopersoneria}
                                    onChange={this.onChangeClientePersoneria.bind(this)}
                                    permisions={this.permisions.personeria}
                                    component={[
                                        <Option key={0} value="S">Ninguno</Option>,
                                        <Option key={1} value="N">Natural</Option>,
                                        <Option key={2} value="J">Juridico</Option>
                                    ]}
                                />
                                { componentFechaNac }
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <C_Input 
                                    value={this.state.nombrecliente}
                                    onChange={this.onChangeClienteNombre.bind(this)}
                                    title='Nombre'
                                    validar={this.state.validarNombre}
                                    permisions={this.permisions.nombre}
                                />

                                <C_Input 
                                    value={this.state.apellidocliente}
                                    onChange={this.onChangeClienteApellido.bind(this)}
                                    title='Apellido'
                                    permisions={this.permisions.apellido}
                                    className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                                />

                                <C_Input 
                                    value={this.state.nitcicliente}
                                    onChange={this.onChangeClienteNitci.bind(this)}
                                    title='Nit/Ci'
                                    permisions={this.permisions.nit}
                                />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3 cols-sm-3"></div>

                                    {this.validarSexo()}
                                
                                <C_TreeSelect 
                                    title="Ciudad"
                                    value={this.state.ciudadclientedata}
                                    treeData={this.state.ciudad}
                                    placeholder="Seleccionar"
                                    onChange={this.onChangeCiudadCliente.bind(this)}
                                    permisions={this.permisions.ciudad}
                                />
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
                                <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12"
                                    style={{ marginLeft: 50 }}>
                                    <div className="text-center-content">
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
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea 
                                        value={this.state.contactoCliente}
                                        onChange={this.onChangeClienteContacto.bind(this)}
                                        title='Contacto'
                                        permisions={this.permisions.contacto}
                                    />
                                </div>
                                <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                                    <TextArea 
                                        value={this.state.notasCliente}
                                        onChange={this.onChangeClienteNota.bind(this)}
                                        title='Observaciones'
                                        permisions={this.permisions.observaciones}
                                    />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="txts-center">
                                    <C_Button onClick={this.guardarDatos.bind(this)}
                                        title='Aceptar' type='primary'
                                    />
                                    <C_Button onClick={this.showCancelConfirm.bind(this)}
                                        title='Cancelar' type='danger'
                                    />
                                </div>
                            </div>
                        </div>
                    {/*</form>*/}
                </div>
            </div>
        );
    }
}

CrearCliente.propTypes = {
    bandera: PropTypes.number,
}

CrearCliente.defaultProps = {
    bandera: 0,
}

export default CrearCliente;

