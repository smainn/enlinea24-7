import React, { Component, useCallback } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import { message, Select } from 'antd';
import 'antd/dist/antd.css';
import ShowCliente from '../../ventas/GestionarCliente/show';
import Confirmation from '../../../componentes/confirmation';
import CImage from '../../../componentes/image';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_TextArea from '../../../componentes/data/textarea';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
const { Option } = Select;

import PropTypes from 'prop-types';
import keysStorage from '../../../utils/keysStorage';

class CrearVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,
            timeoutSearch: undefined,

            cliente: null,
            cliente_contacto: [],

            codigo: '',
            placa: '',
            chasis: '',
            tipovehiculo: 'R',
            idvehiculotipo: '',
            idcliente: '',
            array_caracteristica_select: ['', '', ''],
            array_caracteristica_input: ['', '', ''],
            array_imagen: [],
            indice: 0,
            descripcion: '',
            nota: '',

            validar_codigo: 1,
            validar_placa: 1,
            validar_chasis: 1,

            array_cliente: [],
            array_vehiculotipo: [],
            vehiculotipo_tree: [],
            vehiculo_caracteristica: [],
            configCodigo: false,
            noSesion: false,
        }
        this.permisions = {
            ver_nro: readPermisions(keys.vehiculo_ver_nro),
            ver_fecha: readPermisions(keys.vehiculo_ver_fecha),
            codigo: readPermisions(keys.vehiculo_input_codigo),
            placa: readPermisions(keys.vehiculo_input_placa),
            chasis: readPermisions(keys.vehiculo_input_chasis),
            tipo: readPermisions(keys.vehiculo_select_tipo),
            agregar_cliente: readPermisions(keys.vehiculo_btn_agregarCliente),
            ver_cliente: readPermisions(keys.vehiculo_btn_verCliente),
            codigo_cliente: readPermisions(keys.vehiculo_select_search_codigoCliente),
            nombre_cliente: readPermisions(keys.vehiculo_select_search_nombreCliente),
            vehiculo: readPermisions(keys.vehiculo_select_vehiculo),
            caracteristicas: readPermisions(keys.vehiculo_caracteristicas),
            imagenes: readPermisions(keys.vehiculo_imagenes),
            descripcion: readPermisions(keys.vehiculo_textarea_descripcion),
            notas: readPermisions(keys.vehiculo_textarea_nota),
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {

        httpRequest('get', ws.wsvehiculocreate)
        .then(result => {
            if ( result.response == 1) {

                var on_data = JSON.parse( readData(keysStorage.on_data) );
                var bandera = false;
                if (this.validar_data(on_data)) {
                    if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
                    {
                        if (on_data.on_create == 'vehiculo_create') {
                            bandera = true;
                        }
                    }
                }

                if (bandera) {
                    var data = on_data.data_actual;
                    this.setState({
                        array_cliente: result.cliente.data,
                        array_vehiculotipo: result.vehiculo_tipo,
                        vehiculo_caracteristica: result.vehiculo_caracteristica,
                        configCodigo: result.config.codigospropios,

                        codigo: data.codigo,
                        placa: data.placa,
                        chasis: data.chasis,
                        tipovehiculo: data.tipovehiculo,
                        idcliente: data.idcliente,
                        idvehiculotipo: data.idvehiculotipo,
                        array_caracteristica_input: data.array_caracteristica_input,
                        array_caracteristica_select: data.array_caracteristica_select,
                        array_imagen: data.array_imagen,
                        descripcion: data.descripcion,
                        nota: data.nota,
                    });
                }else {
                    this.setState({
                        array_cliente: result.cliente.data,
                        array_vehiculotipo: result.vehiculo_tipo,
                        idvehiculotipo: (result.vehiculo_tipo.length > 0)?result.vehiculo_tipo[0].idvehiculotipo:'',
                        vehiculo_caracteristica: result.vehiculo_caracteristica,
                        configCodigo: result.config.codigospropios,
                    });
                }

                this.cargarTree(result.vehiculo_tipo);

            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }
        })
        .catch(error => {
            console.log(error)
            message.error(strings.message_error);
        });
    }
    cargarTree(data) {
        var array_aux = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].idpadrevehiculo == null) {
                var elem = {
                    title: data[i].descripcion,
                    value: data[i].idvehiculotipo,
                };
                array_aux.push(elem);
            }
        }
        this.treeVehiculoTipo(array_aux);
        this.setState({
            vehiculotipo_tree: array_aux
        });
    }
    treeVehiculoTipo(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childreenVehiculoTipo(data[i].value);
            data[i].children = hijos;
            this.treeVehiculoTipo(hijos);
        }
    }
    childreenVehiculoTipo(idpadre) {
        var array =  this.state.array_vehiculotipo;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo == idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idvehiculotipo
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }
    verificarCodigo(value) {
        if (value.toString().length > 0) {
            httpRequest('get', ws.wscodvehiculovalido + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    if (result.valido) {
                        this.setState({ validar_codigo: 1 });
                    } else {
                        this.setState({ validar_codigo: 0 });
                    }
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    message.error(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            });
        } else {
            this.setState({ validar_codigo: 1 });
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
    onChangeCodigo(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigo: event,
        });
    }
    onChangePlaca(event) {
        this.setState({
            placa: event,
            validar_placa: 1,
        });
    }
    onChangeChasis(event) {
        this.setState({
            chasis: event,
            validar_chasis: 1,
        });
    }
    onChangeTipoVehiculo(event) {
        this.setState({
            tipovehiculo: event,
        });
    }
    onChangeIDCliente(event) {
        this.setState({
            idcliente: event,
        });
    }
    onDeleteCliente() {
        this.setState({
            idcliente: '',
        });
    }
    onChangeIDVehiculoTipo(event) {
        this.setState({
            idvehiculotipo: event,
        });
    }
    onChangeCaracteristicaSelect(event) {
        this.state.array_caracteristica_select[event.id] = event.value;
        this.state.array_caracteristica_input[event.id] = '';
        this.setState({
            array_caracteristica_select: this.state.array_caracteristica_select,
            array_caracteristica_input: this.state.array_caracteristica_input,
        });
    }
    onChangeCaracteristicaInput(event) {
        if (this.state.array_caracteristica_select[event.id] != '') {
            this.state.array_caracteristica_input[event.id] = event.value;
            this.setState({
                array_caracteristica_input: this.state.array_caracteristica_input,
            });
        }
    }
    onChangeImage(e) {
        let files = e.target.files;
        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {
            let reader = new FileReader();
            reader.onload = (e) => {
                var longitud = this.state.array_imagen.length;
                this.state.array_imagen.push(e.target.result);
                this.setState({
                    array_imagen: this.state.array_imagen,
                    indice: longitud,
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }else {
            message.warning('solo se permite imagen');
        }
    }
    onchangeDescripcion(event) {
        this.setState({
            descripcion: event,
        });
    }
    onChangeNota(event) {
        this.setState({
            nota: event,
        });
    }
    componentClienteCodigo() {
        let data = this.state.array_cliente;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let codigo = (this.state.configCodigo) ? data[i].codcliente : data[i].idcliente;
            array.push(
                <Option key={i} value={data[i].idcliente}>{codigo}</Option>
            );
        }
        return array;
    }
    componentClienteNombre() {
        let data = this.state.array_cliente;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let fullname = (data[i].apellido == null) ? data[i].nombre : data[i].nombre + ' ' + data[i].apellido;
            array.push(
                <Option key={i} value={data[i].idcliente}>{fullname}</Option>
            );
        }
        return array;
    }
    onSearchClienteNombre(event) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(event), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchClienteByNombre(value) {
        httpRequest('post', ws.wssearchclientenombre, {value, value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchClienteCod(event) {
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByIdCod(event), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    searchClienteByIdCod(value) {
        httpRequest('post', ws.wssearchclienteidcod, {value: value})
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    array_cliente: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    verDatosCliente() {
        httpRequest('post', ws.wsshowcliente, {idCliente: this.state.idcliente})
        .then(result =>{
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
                if (result.response == 1) {
                    this.setState({
                        cliente: result.cliente,
                        cliente_contacto: result.clientecontacto,
                        visible: true,
                        bandera: 3,
                    });
                }
            }
        )
        .catch((error) => {
            message.error(strings.message_error);
        })
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    on_data_component() {
        return {
            codigo: this.state.codigo,
            placa: this.state.placa,
            chasis: this.state.chasis,
            tipovehiculo: this.state.tipovehiculo,
            idcliente: this.state.idcliente,
            idvehiculotipo: this.state.idvehiculotipo,
            array_caracteristica_input: this.state.array_caracteristica_input,
            array_caracteristica_select: this.state.array_caracteristica_select,
            array_imagen: this.state.array_imagen,
            descripcion: this.state.descripcion,
            nota: this.state.nota,
        };
    }
    onCreateData() {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: 'vehiculo_create',
                data_actual: this.on_data_component(),
                new_data: null,
                validacion: false,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            on_data = JSON.parse( readData(keysStorage.on_data) );
        }

        var url = routes.cliente_create;
        this.props.history.push(url);
    }
    btnVerCrearCliente() {
        if ((this.state.idcliente == '') && (this.permisions.agregar_cliente.visible == 'A')) {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12 pt-bottom">
                    <div className="txts-center">
                        <C_Button type='primary'
                            title={<i className="fa fa-plus"> </i>}
                            style={{marginTop: 5, padding: 4}} size='small'
                            onClick={this.onCreateData.bind(this)}
                        />
                    </div>
                </div>
            );
        } else if(this.permisions.ver_cliente.visible == 'A') {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12 pt-bottom">
                    <div className="txts-center">
                        <C_Button type='danger'
                            title={<i className="fa fa-eye"> </i>}
                            style={{marginTop: 5, padding: 4}} size='small'
                            onClick={this.verDatosCliente.bind(this)}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }
    handleAddRow() {
        this.state.array_caracteristica_select.push('');
        this.state.array_caracteristica_input.push('');
        this.setState({
            array_caracteristica_select: this.state.array_caracteristica_select,
            array_caracteristica_input: this.state.array_caracteristica_input,
        });
    }
    handleRemoveRow(indice) {
        this.state.array_caracteristica_select.splice(indice, 1);
        this.state.array_caracteristica_input.splice(indice, 1);
        this.setState({
            array_caracteristica_input: this.state.array_caracteristica_input,
            array_caracteristica_select: this.state.array_caracteristica_select,
        });
    }
    handleRemoveImage() {
        this.state.array_imagen.splice(this.state.indice, 1);
        if (this.state.indice == this.state.array_imagen.length) {
            this.setState({
                indice: 0,
                array_imagen: this.state.array_imagen,
            });
        }else {
            this.setState({ array_imagen: this.state.array_imagen, });
        }
    }
    next() {
        this.setState({
            indice: (this.state.indice + 1) % this.state.array_imagen.length,
        });
    }
    prev() {
        this.setState({
            indice: (this.state.indice + this.state.array_imagen.length - 1) % this.state.array_imagen.length,
        });
    }
    onSubmit(event) {
        event.preventDefault();
        if ((this.state.placa.toString().trim().length > 0) && (this.state.idcliente != '') &&
            (!this.state.configCodigo || this.state.codigo.toString().trim().length > 0)) 
        {
            this.setState({
                visible: true,
                bandera: 1,
            });
        }else {
            if (this.state.placa.toString().trim().length == 0) {
                this.state.validar_placa = 0;
            }
    
            if ((this.state.configCodigo) && (this.state.codigo.toString().trim().length == 0)) {
                this.state.validar_codigo = 0;
            }
            message.error("No se permite campo vacios");
            this.setState({
                validar_codigo: this.state.validar_codigo,
                validar_placa: this.state.validar_placa
            });
            if (this.state.idcliente == '') {
                message.error('Se requiere seleccionar cliente!!!');
            }
        }
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
        });
    }
    onSalir(event) {
        var on_data = JSON.parse( readData(keysStorage.on_data) );
        if (this.validar_data(on_data)) {
            var objecto_data = {
                on_create: null,
                data_actual: null,
                new_data: null,
            };
            saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
        }
        event.preventDefault();
        this.props.history.goBack();
    }
    onSubmitData(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        let body = {
            codigoVehiculo: this.state.codigo,
            placaVehiculo: this.state.placa,
            chasisVehiculo: this.state.chasis,
            tipoVehiculo: this.state.tipovehiculo,
            idCliente: this.state.idcliente,
            notaVehiculo: this.state.nota,
            descripcionVehiculo: this.state.descripcion,
            tipo: this.state.idvehiculotipo,
            imagenVehiculo: JSON.stringify(this.state.array_imagen),
            caracteristica: JSON.stringify(this.state.array_caracteristica_select),
            detalleCaracteristica: JSON.stringify(this.state.array_caracteristica_input)
        };
        httpRequest('post', ws.wsvehiculostore, body)
        .then((result) => {
                if (result.response == 1) {             
                    message.success('exito en guardar los datos');
                    var on_data = JSON.parse( readData(keysStorage.on_data) );

                    if (this.validar_data(on_data)) {
                        var objecto_data = {
                            on_create: null,
                            data_actual: null,
                            new_data: null,
                        };
                        saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
                    }

                    this.props.history.goBack();
                }
                if (result.response == 0) {
                    message.success('Ocurrio un problema en el servidor');
                }
                if (result.response == 2) {
                    this.setState({
                        validar_chasis: 0,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                }
                this.onClose();
        }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            }
        );
    }
    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Registrar Vehiculo"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSubmitData.bind(this)}
                    width={400}
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Cancelar Registro de Vehiculo"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content={
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de cancelar el registro del vehiculo?
                            </label>
                        </div>
                    }
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Datos de Cliente"
                    onCancel={this.onClose.bind(this)}
                    width={850}
                    cancelText={'Aceptar'}
                    content={
                        <ShowCliente
                            contactoCliente={this.state.cliente_contacto}
                            cliente={this.state.cliente}
                        />
                    }
                />
            );
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const btnVerCrearCliente = this.btnVerCrearCliente();
        return (
            <div className="rows">
                {this.componentModalShow()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Registrar Vehiculo</h1>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                value={this.state.codigo}
                                onChange={this.onChangeCodigo.bind(this)}
                                title='Codigo'
                                validar={this.state.validar_codigo}
                                permisions={this.permisions.codigo}
                                configAllowed={this.state.configCodigo}
                                mensaje='El codigo ya existe'
                            />
                            <C_Input 
                                title='Placa*'
                                value={this.state.placa}
                                onChange={this.onChangePlaca.bind(this)}
                                validar={this.state.validar_placa}
                                permisions={this.permisions.placa}
                            />
                            <C_Input 
                                title='Chasis*'
                                value={this.state.chasis} 
                                onChange={this.onChangeChasis.bind(this)}
                                permisions={this.permisions.chasis}
                                validar={this.state.validar_chasis}
                            />
                            <C_Select
                                title='Tipo Uso*'
                                value={this.state.tipovehiculo}
                                onChange={this.onChangeTipoVehiculo.bind(this)}
                                permisions={this.permisions.tipo}
                                component={[
                                    <Option key={0} value='R'>Privado</Option>,
                                    <Option key={1} value='P'>Publico</Option>
                                ]}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            { btnVerCrearCliente }
                            <C_Select 
                                title='Codigo Cliente'
                                showSearch={true}
                                value={this.state.idcliente}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchClienteCod.bind(this)}
                                onChange={this.onChangeIDCliente.bind(this)}
                                allowDelete={(this.state.idcliente == '')?false:true}
                                onDelete={this.onDeleteCliente.bind(this)}                            
                                component={this.componentClienteCodigo()}
                                //permisions={this.permisions.search_prod}
                            />
                            <C_Select
                                className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                                title='Nombre Cliente'
                                showSearch={true}
                                value={this.state.idcliente}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.onSearchClienteNombre.bind(this)}
                                onChange={this.onChangeIDCliente.bind(this)}
                                allowDelete={(this.state.idcliente == '')?false:true}      
                                onDelete={this.onDeleteCliente.bind(this)}                                  
                                component={this.componentClienteNombre()}
                                //permisions={this.permisions.search_prod}
                            />
                            <C_TreeSelect
                                title="Vehiculo*"
                                value={this.state.idvehiculotipo}
                                treeData={this.state.vehiculotipo_tree}
                                placeholder="Seleccione una opcion"
                                onChange={this.onChangeIDVehiculoTipo.bind(this)}
                                permisions={this.permisions.vehiculo}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Caracteristica 
                                title="Caracteristicas"
                                data={this.state.vehiculo_caracteristica}
                                onAddRow={this.handleAddRow.bind(this)}
                                optionDefault="Seleccionar"
                                valuesSelect={this.state.array_caracteristica_select}
                                onChangeSelect={this.onChangeCaracteristicaSelect.bind(this)}
                                valuesInput={this.state.array_caracteristica_input}
                                onChangeInput={this.onChangeCaracteristicaInput.bind(this)}
                                onDeleteRow={this.handleRemoveRow.bind(this)}
                                permisions={this.permisions.caracteristicas}
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                                <CImage
                                    onChange={this.onChangeImage.bind(this)}
                                    images={this.state.array_imagen}
                                    next={this.next.bind(this)}
                                    prev={this.prev.bind(this)}
                                    index={this.state.indice}
                                    delete={this.handleRemoveImage.bind(this)}
                                    style={{ height: 240, 'border': '1px solid #e8e8e8', }}
                                    permisions={this.permisions.imagenes}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                value={this.state.descripcion}
                                onChange={this.onchangeDescripcion.bind(this)}
                                title='Descripcion'
                                permisions={this.permisions.descripcion}
                            />
                            <C_TextArea 
                                value={this.state.nota}
                                onChange={this.onChangeNota.bind(this)}
                                title='Notas'
                                permisions={this.permisions.notas}
                            />
                        </div>
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="txts-center">
                                <C_Button title='Aceptar'
                                    type='primary'
                                    onClick={this.onSubmit.bind(this)}
                                />
                                <C_Button title='Cancelar'
                                    type='danger'
                                    onClick={() => this.setState({ visible: true, bandera: 2, })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CrearVehiculo.propTypes = {
    onCreateCliente: PropTypes.func,
}

CrearVehiculo.defaultProps = {
    onCreateCliente: undefined,
}

export default withRouter(CrearVehiculo);