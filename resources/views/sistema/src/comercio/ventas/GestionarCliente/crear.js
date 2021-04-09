
import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import { message, Select} from 'antd';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import ws from '../../../utils/webservices';

import "antd/dist/antd.css";
import Confirmation from '../../../componentes/confirmation';
import CImage from '../../../componentes/image';

import { readPermisions } from '../../../utils/toolsPermisions';
import routes from '../../../utils/routes';
import keys from '../../../utils/keys';
import PropTypes from 'prop-types';
import keysStorage from '../../../utils/keysStorage';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import { convertDmyToYmd } from '../../../utils/toolsDate';
import C_TextArea from '../../../componentes/data/textarea';

const {Option} = Select;

class CrearCliente extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            array_tipo_cliente: [],

            array_ciudad: [],
            array_ciudad_tree: [],

            codigo: '',
            idtipocliente: '',
            tipopersoneria: 'S',
            fechanacimiento: '',
            nombre: '',
            apellido: '',
            nit: '',
            genero: 'N',
            idciudad: '',
            imagen: '',
            contacto: '',
            nota: '',

            timeoutSearch: undefined,
            validar_codigo: 1,
            validar_nombre: 1,

            array_contacto: [],
            array_contacto_select: ['', '', ''],
            array_contacto_descripcion: ['', '', ''],

            config_codigo: false,
            noSesion: false,
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
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        httpRequest('get', ws.wscliente + '/create')
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_tipo_cliente: result.tipo_cliente,
                    idtipocliente: (result.tipo_cliente.length > 0)?result.tipo_cliente[0].idclientetipo:'',

                    array_ciudad: result.ciudad,
                    idciudad: (result.ciudad.length > 0)?result.ciudad[0].idciudad:'',

                    array_contacto: result.referencia_contacto,

                    config_codigo: (result.config == null)?false:result.config.codigospropios,
                });
                this.cargarTree(result.ciudad);
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            if (result.response == -1) {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        });
    }
    cargarTree(data) {
        var array_aux = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].idpadreciudad == null) {
                var elem = {
                    title: data[i].descripcion,
                    value: data[i].idciudad,
                };
                array_aux.push(elem);
            }
        }
        this.treeCiudad(array_aux);
        this.setState({
            array_ciudad_tree: array_aux
        });
    }
    treeCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childreenCiudad(data[i].value);
            data[i].children = hijos;
            this.treeCiudad(hijos);
        }
    }
    childreenCiudad(idpadre) {
        var array =  this.state.array_ciudad;
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
    handleVerificCodigo(value) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.verificarCodigo(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    verificarCodigo(value) {
        if (value.toString().length > 0) {
            httpRequest('get', ws.wscodclientevalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1 })
                    } else {
                        this.setState({ validar_codigo: 0 })
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                message.error(strings.message_error);
            })
        } else {
            this.setState({ validarCodigo: 1 })
        }
    }
    onChangeCodigo(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigo: event,
        });
    }
    onChangeIDTipoCliente(event) {
        this.setState({
            idtipocliente: event,
        });
    }
    onChangeTipoPersoneria(event) {
        this.setState({
            tipopersoneria: event,
            genero: 'N',
        });
    }
    onChangeFechaNacimiento(event) {
        this.setState({
            fechanacimiento: event,
        });
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event,
            validar_nombre: 1,
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event,
        });
    }
    onChangeNit(event) {
        this.setState({
            nit: event,
        });
    }
    onChangeGenero(event) {
        this.setState({
            genero: event,
        });
    }
    onChangeCiudad(event) {
        this.setState({
            idciudad: event,
        });
    }
    onChangeContacto(event) {
        this.setState({
            contacto: event,
        });
    }
    onChangeNota(event) {
        this.setState({
            nota: event,
        });
    }
    cambioReferenciaSelect(event){
        let index = event.id;
        let value = event.value;
        if (value == '') {
            this.state.array_contacto_descripcion[index] = "";
            this.state.array_contacto_select[index] = "";
            this.setState({
                array_contacto_descripcion: this.state.array_contacto_descripcion,
                array_contacto_select: this.state.array_contacto_select,
            });
        } else {
            this.state.array_contacto_select[index] = parseInt(value);
            this.state.array_contacto_descripcion[index] = "";
            this.setState({
                array_contacto_select: this.state.array_contacto_select,
                array_contacto_descripcion: this.state.array_contacto_descripcion,
            });
        }
    }
    cambioDescripcionInput(event) {
        let posicion = event.id;
        let value = event.value;
        if (typeof this.state.array_contacto_select[posicion] == 'undefined' || this.state.array_contacto_select[posicion] == "" || 
            this.state.array_contacto_select[posicion] == '') {
            message.warning('Seleccione una opcion para poder seguir ');
        } else {
            this.state.array_contacto_descripcion[posicion] = value;
            this.setState({
                array_contacto_descripcion: this.state.array_contacto_descripcion,
            });
        }
    }
    handleAddRow() {
        this.setState({
            array_contacto_descripcion: [
                ...this.state.array_contacto_descripcion,
                ""
            ],
            array_contacto_select: [
                ...this.state.array_contacto_select,
                ''
            ]
        });
    }
    handleRemoveRow(i) {
        this.state.array_contacto_select.splice(i, 1);
        this.state.array_contacto_descripcion.splice(i, 1);
        this.setState({
            array_contacto_select: this.state.array_contacto_select,
            array_contacto_descripcion: this.state.array_contacto_descripcion,
        });
    }
    cambiofoto(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    imagen: e.target.result,
                });
            }
        } else {
            message.error('archivo incorrecto!!!');
        }
    }
    eliminarFoto() {
        this.setState({
            imagen: '',
        });
    }
    componentTipoCliente() {
        let array = [];
        for (let i = 0; i < this.state.array_tipo_cliente.length; i++) {
            var data = this.state.array_tipo_cliente[i];
            array.push(
                <Option key={i} value={data.idclientetipo}>
                    {data.descripcion}
                </Option>
            );
        }
        return array;
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        })
    }
    onSalir(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var objecto_data = {
                    on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                    data_actual: this.validar_data(on_data.data_actual)?on_data.data_actual:null,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
                
            this.props.history.goBack();
        }, 400);
    }
    componenetOption() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Cancelar Registrar Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de cancelar el registro del cliente?
                                Los datos ingresados se perderan.
                            </label>
                        </div>
                    }
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onClose.bind(this)}
                    title='Registrar Cliente'
                    onClick={this.onSubmitData.bind(this)}
                    content='¿Estas seguro de guardar datos...?'
                />
            );
        }
    }
    guardarDatos(e) {
        e.preventDefault();
        if ((this.state.codigo == '' && this.state.config_codigo) || this.state.validar_codigo == 0) {
            this.setState({
                validar_codigo: 0,
            });
        }
        if (this.state.nombre.toString().trim().length > 0 && 
            (!this.state.config_codigo || this.state.codigo.toString().length > 0)) {
            this.setState({
                visible: true,
                bandera: 2,
            });
        } else {
            if(this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    validar_nombre: 0,
                });
            }
            message.error("Error campo Requerido");
        }
    }
    validarRferenciaContacto() {
        var array = [];
        if (this.state.array_contacto_descripcion.length > 0) {
            for (let i = 0; i < this.state.array_contacto_descripcion.length; i++) {

                if (String(this.state.array_contacto_descripcion[i]).trim().length > 0 && 
                    String(this.state.array_contacto_select[i]).trim().length > 0 && 
                    typeof this.state.array_contacto_select[i] != 'undefined' && 
                    typeof this.state.array_contacto_descripcion[i] != 'undefined') 
                {    
                    var referenciaDesc = {
                        "fkidreferenciacontacto": (typeof this.state.array_contacto_select[i] != 'undefined') ? 
                        this.state.array_contacto_select[i]:this.state.array_contacto[0].id,
                        "valor": this.state.array_contacto_descripcion[i]
                    }
                    array.push(referenciaDesc);
                }
            }
        }
        return array;
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    onSubmitData() {
        this.setState({
            loading: true,
        });
        var clienteCont = this.validarRferenciaContacto();
        var body = {
            codigoCliente: this.state.codigo,
            nombreCliente: this.state.nombre,
            apellidoCliente: this.state.apellido,
            nitCliente: this.state.nit,
            fotoCliente: this.state.imagen,
            sexoCliente: this.state.genero,
            tipoPersoneriaCliente: this.state.tipopersoneria,
            fechaNacimientoCliente: convertDmyToYmd(this.state.fechanacimiento),
            notasCliente: this.state.nota,
            contactoCliente: this.state.contacto,
            fkidciudad: this.state.idciudad,
            fkidtipocliente: this.state.idtipocliente,
            datosTablaIntermedia: JSON.stringify(typeof clienteCont === 'undefined'?[]:clienteCont),
        };

        httpRequest('post', ws.wscliente, body)
        .then(result => {
            if(result.response == 1){
                
                var on_data = JSON.parse( readData(keysStorage.on_data) );
                
                if (this.validar_data(on_data)) {

                    var bandera = this.validar_data(on_data.data_actual)?true:false;
                    var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;

                    if (bandera) {
                        var apellido = (result.cliente.apellido == null)?'':result.cliente.apellido;
                        data_actual.idcliente = result.cliente.idcliente;
                        data_actual.nitcliente = (result.cliente.nit == null)?'':result.cliente.nit;
                        data_actual.namecliente = result.cliente.nombre + ' ' + apellido;
                        data_actual.nombrecliente = result.cliente.nombre + ' ' + apellido;
                        data_actual.cliente = result.cliente;
                    }

                    var objecto_data = {
                        on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                        data_actual: (bandera)?data_actual:null,
                        validacion: true,
                    };

                    saveData( keysStorage.on_data, JSON.stringify(objecto_data) );

                }

                message.success('Se Registro Correctamente');

                this.props.history.goBack();
                
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);

        });
    }
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                {this.componenetOption()}
                <div className="cards" style={{'padding': 0}}>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar cliente</h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.codigo}
                                onChange={this.onChangeCodigo.bind(this)}
                                title='Codigo'
                                validar={this.state.validar_codigo}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.config_codigo}
                                mensaje='El codigo ya existe'
                            />
                            <C_Select 
                                title="Tipo Cliente"
                                value={this.state.idtipocliente}
                                onChange={this.onChangeIDTipoCliente.bind(this)}
                                component={this.componentTipoCliente()}
                                permisions={this.permisions.tipo}
                            />
                            <C_Select 
                                title='Tipo Personeria*'
                                value={this.state.tipopersoneria}
                                onChange={this.onChangeTipoPersoneria.bind(this)}
                                permisions={this.permisions.personeria}
                                component={[
                                    <Option key={0} value="S">Ninguno</Option>,
                                    <Option key={1} value="N">Natural</Option>,
                                    <Option key={2} value="J">Juridico</Option>,
                                ]}
                            />
                            <C_DatePicker
                                allowClear={true}
                                onChange={this.onChangeFechaNacimiento.bind(this)}
                                value={this.state.fechanacimiento}
                                title={'Fecha Nacimiento'}
                                permisions={this.permisions.fecha_nac}
                                readOnly={this.permisions.fecha_nac.editable == 'A' ? false : true}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.nombre}
                                onChange={this.onChangeNombre.bind(this)}
                                title='Nombre'
                                validar={this.state.validar_nombre}
                                permisions={this.permisions.nombre}
                            />
                            <C_Input 
                                value={this.state.apellido}
                                onChange={this.onChangeApellido.bind(this)}
                                title='Apellido'
                                permisions={this.permisions.apellido}
                                className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom'
                            />
                            <C_Input 
                                value={this.state.nit}
                                onChange={this.onChangeNit.bind(this)}
                                title='Nit/Ci'
                                permisions={this.permisions.nit}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Select 
                                value={this.state.genero}
                                title='Genero*'
                                onChange={this.onChangeGenero.bind(this)}
                                permisions={this.permisions.genero}
                                component={
                                    (this.state.tipopersoneria == 'J')?
                                    [<Option key={0} value="N">Ninguno</Option>]:
                                    [
                                        <Option key={0} value="N">Ninguno</Option>,
                                        <Option key={1} value="M">Masculino</Option>,
                                        <Option key={2} value="F">Femenino</Option>,
                                    ]
                                }
                            />
                            <C_TreeSelect 
                                title="Ciudad"
                                value={this.state.idciudad}
                                treeData={this.state.array_ciudad_tree}
                                onChange={this.onChangeCiudad.bind(this)}
                                permisions={this.permisions.ciudad}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Caracteristica 
                                title="Referencia Para Contactarlo"
                                data={this.state.array_contacto}
                                onAddRow={this.handleAddRow.bind(this)}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.array_contacto_select}
                                onChangeSelect={this.cambioReferenciaSelect.bind(this)}
                                valuesInput={this.state.array_contacto_descripcion}
                                onChangeInput={this.cambioDescripcionInput.bind(this)}
                                onDeleteRow={this.handleRemoveRow.bind(this)}
                                permisions={this.permisions.caracteristicas}
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12"
                                style={{ marginLeft: 50 }}>
                                <div className="txts-center">
                                    <CImage
                                        onChange={this.cambiofoto.bind(this)}
                                        image={this.state.imagen}
                                        images={[]}
                                        delete={this.eliminarFoto.bind(this)}
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
                            <C_TextArea 
                                value={this.state.contacto}
                                onChange={this.onChangeContacto.bind(this)}
                                title='Contacto'
                                permisions={this.permisions.contacto}
                            />
                            <C_TextArea 
                                value={this.state.nota}
                                onChange={this.onChangeNota.bind(this)}
                                title='Observaciones'
                                permisions={this.permisions.observaciones}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button onClick={this.guardarDatos.bind(this)}
                                    title='Aceptar' type='primary'
                                />
                                <C_Button onClick={() => this.setState({ visible: true, bandera: 1, })}
                                    title='Cancelar' type='danger'
                                />
                            </div>
                        </div>
                    </div>
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

export default withRouter(CrearCliente);

