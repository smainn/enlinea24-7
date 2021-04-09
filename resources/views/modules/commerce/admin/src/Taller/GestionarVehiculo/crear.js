import React, { Component, useCallback } from 'react';
import {Redirect, Link} from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
import ShowCliente from '../../Venta/GestionarCliente/ShowCliente';
import CrearCliente from '../../Venta/GestionarCliente/crear';
import Confirmation from '../../../components/confirmation';
import CImage from '../../../components/image';

import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData, readData, saveData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_TreeSelect from '../../../components/data/treeselect';
import C_TextArea from '../../../components/data/textarea';
import C_Caracteristica from '../../../components/data/caracteristica';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';
const { Option } = Select;
const CANT_CLIENTES_DEFAULT = 30;

export default class CrearVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            inputInicio: true,
            redirect: false,

            validarPlaca: 1,

            aviso: 1,

            mostrarCrearCliente: false,
            mostrarCrearVehiculo: true,
            
            visibleCrearVehiculo: false,
            visibleShowCliente: false,
            visibleCancelVehiculo: false,
            visibleImagen: false,

            loadModalCrearVehiculo: false,

            codigo: '',
            placa: '',
            chasis: '',
            nota: '',
            descripcion: '',

            codigoVehiculo: '',
            placaVehiculo: '',  
            chasisVehiculo: '',
            tipoVehiculo: 'R',
            descripcionVehiculo: '',
            notaVehiculo: '',

            idCliente: 0,
            codigoCliente: '',
            nombreCliente: '',

            idVehiculoTipo: 0,

            mensaje: 'Chasis*',
            buscarCliente: '',

            validacion: [1, 1, 1, 1, 1, 1],
            clientes: [],
            clientesCargados: [],

            arrayPadreVehiculoTipo: [],
            arrayVehiculoTipo: [],

            items: [1, 2, 3],

            //arrayCaracteristica: ['', '', ''],
            arrayCaracteristica: ['', '', ''],
            arrayDetalleCaracteristica: ['', '', ''],

            caracteristicaVehiculo: [],

            clienteContactarloSeleccionado: [],
            clienteSeleccionado: [],

            arrayImage: [],
            indice: 0,

            tecla: 0,

            noSesion: false,
            configCodigo: false,

            valueSeacrhCliente: undefined,
            timeoutSearch: undefined,
            resultClientes: [],
            resultClientesDefault: [],
            validarCodigo: 1,
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

        this.redirect = this.redirect.bind(this);

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.onChangeArrayCarracteristica = this.onChangeArrayCarracteristica.bind(this);
        this.onChangeArrayDetalleCaracteristica = this.onChangeArrayDetalleCaracteristica.bind(this);
        this.handleRemoveRow = this.handleRemoveRow.bind(this);
        this.handleAddRow = this.handleAddRow.bind(this);

        this.searchClienteByIdCod = this.searchClienteByIdCod.bind(this);
        this.handleSearchCliCod = this.handleSearchCliCod.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.searchClienteByNombre = this.searchClienteByNombre.bind(this);
        this.handleSearchCliNombre = this.handleSearchCliNombre.bind(this);

    }

    searchClienteByIdCod(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchclienteidcod + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes: result.data
                    });
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
            this.setState({
                resultClientes: this.state.resultClientesDefault
            });
        }
        
    }

    handleSearchCliCod(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByIdCod(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchCliente(value) {
        this.setState({ 
            valueSeacrhCliente: value,
        })
    }

    onDeleteCliente() {
        this.setState({
            valueSeacrhCliente: undefined,
        })
    }

    searchClienteByNombre(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wssearchclientenombre + '/' + value)
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultClientes: result.data
                    });
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
            this.setState({
                resultClientes: this.state.resultClientesDefault
            });
        }

    }

    handleSearchCliNombre(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getClientesDefault();
        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 600);

        httpRequest('get', '/commerce/api/vehiculo/nuevo')
        .then(result => {
            if( result.response == 1) {

                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idvehiculocaracteristica,
                        title: data[i].caracteristica
                    });
                }

                this.setState({
                    clientes: result.cliente,
                    clientesCargados: result.cliente,
                    arrayPadreVehiculoTipo: result.vehiculoTipo,
                    idVehiculoTipo: result.vehiculoTipo[0].idvehiculotipo,
                    //caracteristicaVehiculo: result.data,
                    caracteristicaVehiculo: arr,
                });

                var array = result.vehiculoTipo;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrevehiculo == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idvehiculotipo
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolTipoVehiculo(array_aux);
                this.setState({
                    arrayVehiculoTipo: array_aux
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }

        }).catch(error => {
            console.log(error)
        });
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    getClientesDefault() {
        httpRequest('get', ws.wsclientes + '/' + CANT_CLIENTES_DEFAULT)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    resultClientes: result.data,
                    resultClientesDefault: result.data
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                //error
                console.log('Ocurrio un error en el servidor');
            }
        })
        .catch((error) => {
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

    getCliente() {
        var url = '/commerce/admin/showCliente';
        httpRequest('get', url)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    clientes: result.cliente,
                    clientesCargados: result.cliente,
                });
            }
            
        }).catch(error => {
            console.log(error);
        });
    }

    getTipoVehiculo() {
        httpRequest('get', '/commerce/admin/getTipoVehiculo')
        .then(result => {
            //console.log('RESUL ==> ', result);
            if (result.ok) {
                this.setState({
                    arrayPadreVehiculoTipo: result.data
                });
                var array = result.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadrevehiculo == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idvehiculotipo
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolTipoVehiculo(array_aux);
                this.setState({
                    arrayVehiculoTipo: array_aux
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }

        }).catch(error => {
            console.log(error)
        });
    }

    arbolTipoVehiculo(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosTipoVehiculo(data[i].value);
            if (hijos.length > 0) {
                data[i].children = hijos;
            }
            this.arbolTipoVehiculo(hijos);
        }
    }

    hijosTipoVehiculo(idpadre) {
        var array =  this.state.arrayPadreVehiculoTipo;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadrevehiculo === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idvehiculotipo
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
            }
        }else {
            if (this.state.tecla === 2) {
                if (e.key === 'ArrowRight') {
                    this.onChangeNext();
                }
                if(e.key === 'ArrowLeft') {
                    this.onChangePreview();
                }
            }
        }  
    }

    arrayVacio(array) {
        if (array.length === 0) {
            return true;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] != '') {
                return false;
            }
        }
        return true;
    }

    regresarIndexVehiculo() {
        
        if ((this.state.codigoVehiculo === '') && (this.state.placaVehiculo === '') &&
            (this.state.chasisVehiculo === '') && (this.state.tipoVehiculo === '') &&
            (this.state.idCliente === 0) && (this.state.idVehiculoTipo === 0) &&
            (this.arrayVacio(this.state.arrayCaracteristica)) && 
            (this.arrayVacio(this.state.arrayDetalleCaracteristica)) && 
            (this.state.arrayImage.length === 0)) {

                this.setState({
                    redirect: !this.state.redirect
                });
            } else {
                this.setState({
                    visibleCancelVehiculo: true,
                });
            }
    }

    redirect() {
        this.setState({redirect: true});
    }

    showCancelConfirm() {
        const redirect = this.redirect;
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro del nuevo vehiculo?',
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

    verificarCodigo(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wscodvehiculovalido + '/' + value)
            .then((result) => {
                console.log('RESP ', result);
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

    onChangeCodigoVehiculo(event) {
        this.handleVerificCodigo(event);
        this.setState({
            codigoVehiculo: event,
            codigo: event,
        });
    }

    onChangePlacaVehiculo(event) {
        this.setState({
            placaVehiculo: event,
            validarPlaca: 1,
            placa: event,
        });
    }

    onChangeChasisVehiculo(event) {
        this.setState({
            chasisVehiculo: event,
            chasis: event,
        });
    }

    onChangeTipoVehiculo(event) {
        this.setState({
            tipoVehiculo: event,
        });
    }

    onChangeIdVehiculoTipo(value) {
        this.state.validacion[5] = 1;
        this.setState({
            idVehiculoTipo: value,
            validacion: this.state.validacion,
        });
    }

    handleAddRow() {
        //this.state.items.push(this.state.items.length + 1);
        this.state.arrayCaracteristica.push('');
        this.state.arrayDetalleCaracteristica.push('');
        this.setState({
            //items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    handleRemoveRow(indice) {
        //this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            //items: this.state.items,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            arrayCaracteristica: this.state.arrayCaracteristica,
        });
    }

    onChangeArrayCarracteristica(event) {
        this.state.arrayCaracteristica[event.id] = event.value;
        
        this.state.arrayDetalleCaracteristica[event.id] = '';
        
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    onChangeArrayDetalleCaracteristica(event) {
        if (this.state.arrayCaracteristica[event.id] != 0) {
            this.state.arrayDetalleCaracteristica[event.id] = event.value;
            this.setState({
                arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            });
        }
        return;
    }

    onChangeImage(e) {
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                var longitud = this.state.arrayImage.length;
                this.state.arrayImage.push(e.target.result);
                this.setState({
                    arrayImage: this.state.arrayImage,
                    indice: longitud,
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }else {
            message.warning('solo se permite imagen');
        }
    }

    handleRemoveImage() {
        const newImage = this.state.arrayImage;
        newImage.splice(this.state.indice, 1);
        if (this.state.indice === (this.state.arrayImage.length)){
            this.setState({
                indice: 0,
                arrayImage: newImage,
            });
        }else {
            this.setState({arrayImage: newImage});
        }
    }

    onChangePreview() {
        if (this.state.arrayImage.length > 1){
            var indicePreview = this.state.indice;
            if (indicePreview === 0){
                indicePreview = this.state.arrayImage.length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.setState({
                indice: indicePreview
            });
        }
    }

    onChangeNext() {
        if (this.state.arrayImage.length > 1){
            var indiceNext = this.state.indice;
            if (indiceNext === (this.state.arrayImage.length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.setState({
                indice: indiceNext
            });
        }
    }

    abrirImagen() {
        this.setState({
            tecla: 2,
            visibleImagen: true,
        });
    }

    onchangeDescripcionVehiculo(event) {
        this.setState({
            descripcionVehiculo: event,
            descripcion: event,
        });
    }

    onChangeNotaVehiculo(event) {
        this.setState({
            notaVehiculo: event,
            nota: event,
        });
    }

    onSubmit(e) {
        e.preventDefault();

        if ((this.state.placaVehiculo.length > 0) && 
            (this.state.tipoVehiculo.length > 0) && 
            (this.state.valueSeacrhCliente != undefined) && (this.state.idVehiculoTipo > 0) &&
            this.state.validarCodigo == 1 && (!this.state.configCodigo || this.state.codigoVehiculo.length > 0)) {
            this.setState({
                visibleCrearVehiculo: true,
            });
        }else {
            this.validarDatos();
        }
    }

    validarDatos() {
        if (this.state.placaVehiculo.length === 0) {
            this.state.validarPlaca = 0;
        }
        if (this.state.tipoVehiculo.length === 0) {
            this.state.validacion[3] = 0;
        }
        /*if (this.state.valueSeacrhCliente === undefined) {
            //this.state.validacion[4] = 0;
        }*/
        if (this.state.idVehiculoTipo === 0) {
            this.state.validacion[5] = 0;
        }

        if (this.state.configCodigo && this.state.codigoVehiculo.length === 0) {
            this.state.validarCodigo = 0;
        }
        message.error("No se permite campo vacios");

        this.setState({
            validacion: this.state.validacion,
            validarPlaca: this.state.validarPlaca,
            validarCodigo: this.state.validarCodigo
        });
    }

    handleCerrarModal() {
        this.setState({
            visibleCrearVehiculo: false,
            loadModalCrearVehiculo: false,
            visibleShowCliente: false,
            visibleCancelVehiculo: false,
            visibleImagen: false,
            tecla: 0,
        });
    }

    onCancelVehiculo(e) {
        e.preventDefault();
        this.setState({
            loadModalCrearVehiculo: true,
        });

        setTimeout(() => {

            this.handleCerrarModal();
            this.setState({
                redirect: true,
            });

        }, 400);
    }

    onSubmitGuardarDatos(e) {
        
        e.preventDefault();
        let body = {
            codigoVehiculo: this.state.codigo,
            placaVehiculo: this.state.placa,
            chasisVehiculo: this.state.chasis,
            tipoVehiculo: this.state.tipoVehiculo,
            idCliente: this.state.valueSeacrhCliente,
            notaVehiculo: this.state.nota,
            descripcionVehiculo: this.state.descripcion,
            tipo: this.state.idVehiculoTipo,
            imagenVehiculo: JSON.stringify(this.state.arrayImage),
            caracteristica: JSON.stringify(this.state.arrayCaracteristica),
            detalleCaracteristica: JSON.stringify(this.state.arrayDetalleCaracteristica)
        };

        this.setState({
            loadModalCrearVehiculo: true,
        });

        httpRequest('post', '/commerce/api/vehiculo/post', body)
        .then((result) => {
                if (result.response === 1) {
                    this.setState({
                        redirect: true
                    });               
                    message.success('exito en guardar los datos'); 
                }
                if (result.response === 0) {
                    console.log(result.data);
                }
                if (result.response === 2) {

                    this.state.validacion[2] = 2;
                    this.setState({
                        mensaje: result.data,
                        validacion: this.state.validacion,
                    });
                    this.handleCerrarModal();

                    this.error(1);
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
        }).catch(
            error => {
                console.log(error);
            }
        )
    }

    error(bandera) {
        if (bandera === 2) {
            message.error('Hubo un error al agregar vehiculo');
        }else {
            message.warning('Ups Ya existe el Chasis');
        }
    }

    componentCancelVehiculo() {
        return (
            <Confirmation 
                visible={this.state.visibleCancelVehiculo}
                loading={this.state.loadModalCrearVehiculo}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Cancelar Vehiculo'
                onClick={this.onCancelVehiculo.bind(this)}
                content='¿Estas seguro de cancelar...?'
            />
        );
    }

    componentShowUpdateVehiculo() {
        return (
            <Confirmation 
                visible={this.state.visibleCrearVehiculo}
                loading={this.state.loadModalCrearVehiculo}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Registrar Vehiculo'
                onClick={this.onSubmitGuardarDatos.bind(this)}
            />
        );
    }

    componentShowCliente() {
        return (
            <Modal
                title="Datos de Cliente"
                visible={this.state.visibleShowCliente}
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
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
                    cliente={this.state.clienteSeleccionado} 
                />
            </Modal>
        );
    }

    crearNuevoCliente() {
        saveData(keysStorage.createcliente, 'A');
        this.setState({
            mostrarCrearCliente: true,
            mostrarCrearVehiculo: false,
        });
    }

    verDatosCliente() {
        var data = {
            'idCliente': this.state.valueSeacrhCliente
        }
        httpRequest('post', '/commerce/api/showCliente', data).then(
            result =>{
                if (result.response == -2) {

                } else if (result.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);

                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
                        visibleShowCliente: true,
                    });
                }
        }).catch(
            error => {
                console.log(error);
            }
        )
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    getResultadoCrearCliente(cliente, bandera) {
        this.getClientesDefault();
        this.getCliente();
        if (bandera == 1) {
            this.setState({
                mostrarCrearCliente: false,
                mostrarCrearVehiculo: true,
                valueSeacrhCliente: cliente.idcliente,
                nombreCliente: (cliente.apellido == null) ? cliente.nombre : cliente.nombre + ' ' +  cliente.apellido,
                codigoCliente: (cliente.codcliente == null) ? '' : cliente.codcliente,
            });
        }else {
            this.setState({
                mostrarCrearCliente: false,
                mostrarCrearVehiculo: true,
            })
        }
    }

    next() {
        this.setState({
            indice: (this.state.indice + 1) % this.state.arrayImage.length,
        })
    }

    prev() {
        this.setState({
            indice: (this.state.indice + this.state.arrayImage.length - 1) % this.state.arrayImage.length,
        })
    }

    btnVerCrearCliente() {
        if ((typeof this.state.valueSeacrhCliente == 'undefined') && (this.permisions.agregar_cliente.visible == 'A')) {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-6 cols-xs-12 pt-bottom'">
                    <div className="txts-center">
                        <C_Button type='primary'
                            title={<i className="fa fa-plus"> </i>}
                            style={{marginTop: 7, padding: 3}} size='small'
                            onClick={this.crearNuevoCliente.bind(this)}
                        />
                    </div>
                </div>
            );
        } else if(this.permisions.ver_cliente.visible == 'A') {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-6 cols-xs-12 pt-bottom'">
                    <div className="txts-center">
                        <C_Button type='danger'
                            title={<i className="fa fa-eye"> </i>}
                            style={{marginTop: 7, padding: 3}} size='small'
                            onClick={this.verDatosCliente.bind(this)}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }

    resultClientesCod() {
        let data = this.state.resultClientes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let codigo = this.state.configCodigo ? data[i].codcliente : data[i].idcliente;
            arr.push(
                <Option key={i} value={data[i].idcliente}>{codigo}</Option>
            );
        }
        return arr;
    }

    resultClientesNom() {
        let data = this.state.resultClientes;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            let fullname = data[i].apellido == null ? data[i].nombre : data[i].nombre + ' ' + data[i].apellido;
            arr.push(
                <Option key={i} value={data[i].idcliente}>{fullname}</Option>
            );
        }
        return arr;
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        const componentShowUpdateVehiculo = this.componentShowUpdateVehiculo();
        const componentShowCliente = this.componentShowCliente();
        const componentCancelVehiculo = this.componentCancelVehiculo();
        const btnVerCrearCliente = this.btnVerCrearCliente();
        const resultClientesCod = this.resultClientesCod();
        const resultClientesNom = this.resultClientesNom();

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/vehiculo/index"/>)
        }

        return (
            <div>

                <div style={{'display': (this.state.mostrarCrearCliente)?'block':'none'}}>
                    <CrearCliente 
                        bandera={1}
                        aviso={this.state.aviso}
                        callback={this.getResultadoCrearCliente.bind(this)}
                    />
                </div>
            
                <div 
                    className="rows" 
                    style={{'display': (this.state.mostrarCrearVehiculo)?'block':'none'}}>

                    { componentShowUpdateVehiculo }

                    { componentShowCliente }

                    { componentCancelVehiculo }

                    <div className="cards">

                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Vehiculo</h1>
                        </div>

                        <div className="forms-groups">

                            <form onSubmit={this.onSubmit.bind(this)} encType="multipart/form-data">

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'padding': 0,}}>
                                    <C_Input 
                                        value={this.state.codigoVehiculo}
                                        onChange={this.onChangeCodigoVehiculo.bind(this)}
                                        title='Codigo'
                                        validar={this.state.validarCodigo}
                                        permisions={this.permisions.codigo}
                                        configAllowed={this.state.configCodigo}
                                        mensaje='El codigo ya existe'
                                    />
                                    <input type="hidden" value={this.state.codigo} />

                                    <C_Input 
                                        title='Placa*'
                                        value={this.state.placaVehiculo}
                                        onChange={this.onChangePlacaVehiculo.bind(this)}
                                        validar={this.state.validarPlaca}
                                        permisions={this.permisions.placa}
                                    />
                                    <input type="hidden" value={this.state.placa} />

                                    <C_Input 
                                        title='Chasis*'
                                        value={this.state.chasisVehiculo} 
                                        onChange={this.onChangeChasisVehiculo.bind(this)}
                                        permisions={this.permisions.chasis}
                                    />
                                    <input type="hidden" value={this.state.chasis} />

                                    <C_Select
                                        title='Tipo Uso*'
                                        value={this.state.tipoVehiculo}
                                        onChange={this.onChangeTipoVehiculo.bind(this)}
                                        permisions={this.permisions.tipo}
                                        component={[
                                            <Option key={0} value='R'>Privado</Option>,
                                            <Option key={1} value='P'>Publico</Option>
                                        ]}
                                    />
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'padding': 0,}}>
                                    
                                    { btnVerCrearCliente }

                                    <C_Select 
                                        title='Codigo Cliente'
                                        showSearch={true}
                                        value={this.state.valueSeacrhCliente}
                                        placeholder={"Buscar producto por Id o descripcion"}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearchCliCod}
                                        onChange={this.onChangeSearchCliente}
                                        notFoundContent={null}
                                        allowDelete={true}      
                                        onDelete={this.onDeleteCliente}                                  
                                        component={resultClientesCod}
                                        //permisions={this.permisions.search_prod}
                                    />
                                    <C_Select
                                        className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom"
                                        title='Nombre Cliente'
                                        showSearch={true}
                                        value={this.state.valueSeacrhCliente}
                                        placeholder={"Buscar producto por nombre"}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearchCliNombre}
                                        onChange={this.onChangeSearchCliente}
                                        notFoundContent={null}
                                        allowDelete={true}      
                                        onDelete={this.onDeleteCliente}                                  
                                        component={resultClientesNom}
                                        //permisions={this.permisions.search_prod}
                                    />
                                    <C_TreeSelect
                                        title="Vehiculo*"
                                        value={(this.state.idVehiculoTipo === 0)?'Seleccionar':this.state.idVehiculoTipo}
                                        treeData={this.state.arrayVehiculoTipo}
                                        placeholder="Seleccione una opcion"
                                        onChange={this.onChangeIdVehiculoTipo.bind(this)}
                                        permisions={this.permisions.vehiculo}
                                    />

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                        <C_Caracteristica 
                                            title="Caracteristicas"
                                            data={this.state.caracteristicaVehiculo}
                                            onAddRow={this.handleAddRow}
                                            optionDefault="Seleccionar"
                                            valuesSelect={this.state.arrayCaracteristica}
                                            onChangeSelect={this.onChangeArrayCarracteristica}
                                            valuesInput={this.state.arrayDetalleCaracteristica}
                                            onChangeInput={this.onChangeArrayDetalleCaracteristica}
                                            onDeleteRow={this.handleRemoveRow}
                                            permisions={this.permisions.caracteristicas}
                                        />

                                        <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                            <CImage
                                                onChange={this.onChangeImage.bind(this)}
                                                //image={this.state.img}
                                                images={this.state.arrayImage}
                                                next={this.next}
                                                prev={this.prev}
                                                index={this.state.indice}
                                                delete={this.handleRemoveImage}
                                                style={{ 
                                                        height: 240, 
                                                        'border': '1px solid transparent',
                                                    }}
                                                permisions={this.permisions.imagenes}
                                            />
                                        </div>
                                                
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'padding': 0,}}>
                                        <C_TextArea 
                                            value={this.state.descripcionVehiculo}
                                            onChange={this.onchangeDescripcionVehiculo.bind(this)}
                                            title='Descripcion'
                                            permisions={this.permisions.descripcion}
                                        />
                                        <input type="hidden" value={this.state.descripcion} />

                                        <C_TextArea 
                                            value={this.state.notaVehiculo}
                                            onChange={this.onChangeNotaVehiculo.bind(this)}
                                            title='Notas'
                                            permisions={this.permisions.notas}
                                        />
                                        <input type="hidden" value={this.state.nota} />
                                    </div>

                                    <div className="forms-groups">
                                        <div className="txts-center">
                                            <C_Button
                                                title='Aceptar'
                                                type='primary'
                                                submit={true}
                                            />
                                            <C_Button
                                                title='Cancelar'
                                                type='danger'
                                                onClick={this.showCancelConfirm.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            
            </div>
        
        );
    }
}