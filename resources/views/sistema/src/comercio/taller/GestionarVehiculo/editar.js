

import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Select } from 'antd';
import 'antd/dist/antd.css';
const { Option } = Select;
import ShowCliente from '../../ventas/GestionarCliente/show';

import Confirmation from '../../../componentes/confirmation';
import CImage from '../../../componentes/image';

import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_Caracteristica from '../../../componentes/data/caracteristica';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
const CANT_CLIENTES_DEFAULT = 30;

export default class EditVehiculo extends Component{

    constructor(props){
        super(props);

        this.state = {

            inputInicio: true,
            redirect: false,

            visibleShowCliente: false,
            visibleCancelVehiculo: false,
            visibleEditarVehiculo: false,
            visibleImagen: false,

            loadModalEditarVehiculo: false,

            mensaje: 'Chasis*',

            codigoVehiculo: '',
            placaVehiculo: '',
            chasisVehiculo: '',
            idCliente: 0,

            nombreCliente: '',
            codigoCliente: '',

            tipoVehiculo: '',
            idVehiculoTipo: 0,
            notaVehiculo: '',
            descripcionVehiculo: '',

            arrayImage: [],
            arrayImage2: [],
            indice: 0,
            arrayImageRemove: [],

            clienteSeleccionado: [],
            clienteContactarloSeleccionado: [],

            arrayPadreVehiculo: [],
            arrayTipoVehiculo: [],

            caracteristicaVehiculo: [],
            items: [],
            subItem: [],
            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],
            arrayDetalle: [],
            arrayDeleteCaracteristica: [],

            clientes: [],
            clientesCargados: [],

            validacion: [1, 1, 1, 1, 1, 1],

            buscarCliente: '',
            tecla: 0,

            codigo: '',
            placa: '',
            chasis: '',
            descripcion: '',
            nota : '',

            noSesion: false,
            configCodigo: false,
            resultClientes: [],
            resultClientesDefault: [],
            timeoutSearch: undefined,
            valueSeacrhCliente: undefined,
            modalCancel: false,
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
        this.searchClienteByNombre = this.searchClienteByNombre.bind(this);
        this.handleSearchCliCod = this.handleSearchCliCod.bind(this);
        this.handleSearchCliNombre = this.handleSearchCliNombre.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);

    }

    onOkMC() {
        this.setState({
            modalCancel: false,
            redirect: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
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
                message.error(strings.message_error);
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
                message.error(strings.message_error);
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

    agregarCliente(cliente) {
        setTimeout(() => {
            let data = this.state.resultClientesDefault;
            let length = data.length;
            for (let i = 0; i < length; i++) {
                if (data[i].idcliente == cliente.idcliente) {
                    data.push(cliente);
                    this.setState({
                        resultClientesDefault: data
                    });
                    break;
                }
            }
            
        }, 200)
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getClientesDefault();
        httpRequest('get', ws.wsvehiculoedit + '/' + this.props.match.params.id + '')
        .then(
            result => {
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else if (result.ok) {
                    if (result.detalle.length > 0) {
                        result.detalle.map(
                            resultado => {
                                this.state.items.push(resultado.idvehiculocaracdetalle);
                                this.state.arrayCaracteristica.push(resultado.fkidvehiculocaracteristica);
                                this.state.arrayDetalleCaracteristica.push(resultado.descripcion);
                                this.state.subItem.push(0);
                            }
                        );

                        if (this.state.items.length < 3) {
                            var limite = this.state.items.length;
                            for (var i = limite; i < 3; i++) {
                                this.state.items.push('');
                                this.state.arrayCaracteristica.push('');
                                this.state.arrayDetalleCaracteristica.push('');
                                this.state.subItem.push(0);
                            }
                        } 

                    } else {
                        for (var i = 0; i < 3; i++){
                            this.state.items.push('');
                            this.state.arrayCaracteristica.push('');
                            this.state.arrayDetalleCaracteristica.push(''); 
                            this.state.subItem.push(0);
                        }
                    }

                    //para el cuadro de caracteristicas
                    let data = result.caracteristica;
                    let length = data.length;
                    let arr = [];
                    for (let i = 0; i < length; i++) {
                        arr.push({
                            id: data[i].idvehiculocaracteristica,
                            title: data[i].caracteristica
                        });
                    }

                    data = result.foto;
                    length = data.length;
                    let arr2 = [];
                    for (let i = 0; i < length; i++) {
                        arr2.push(data[i].foto);
                    }
                    let codigoVehiculo = result.config.codigospropios ? result.data.codvehiculo : result.data.idvehiculo;
                    let codigoCliente = result.config.codigospropios ? result.data.codcliente : result.data.idcliente;
                    let cliente = {
                        idcliente: result.data.fkidcliente,
                        codcliente: codigoCliente,
                        nombre: result.data.nombre,
                        apellido: result.data.apellido
                    };

                    //this.agregarCliente(cliente); //agrega un cliena a la lista si es que no existe en la lista

                    this.setState({
                        codigoVehiculo: codigoVehiculo,
                        placaVehiculo: result.data.placa,
                        chasisVehiculo: (result.data.chasis === null)?'':result.data.chasis,
                        idCliente: result.data.fkidcliente,
                        valueSeacrhCliente: result.data.fkidcliente,
                        tipoVehiculo: result.data.tipopartpublic,
                        idVehiculoTipo: result.data.fkidvehiculotipo,
                        notaVehiculo: (result.data.notas == null)?'':result.data.notas,
                        descripcionVehiculo: (result.data.descripcion == null) ?'' : result.data.descripcion,
                        nombreCliente: (result.data.apellido === null) ? result.data.nombre : result.data.nombre + ' ' + result.data.apellido,
                        codigoCliente: codigoCliente,   
                        arrayImage: result.foto,
                        arrayImage2: arr2,
                        //caracteristicaVehiculo: result.caracteristica,
                        caracteristicaVehiculo: arr,
                        arrayPadreVehiculo: result.vehiculoTipo,
                        
                        arrayDetalle: result.detalle,
                        items: this.state.items,
                        subItem: this.state.subItem,
                        arrayCaracteristica: this.state.arrayCaracteristica,
                        arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,

                        clientes: result.cliente,
                        clientesCargados: result.cliente,

                        codigo: (result.data.codvehiculo === null)?'':result.data.codvehiculo,
                        placa: result.data.placa,
                        chasis: (result.data.chasis === null)?'':result.data.chasis,
                        nota: (result.data.notas == null)?'':result.data.notas,
                        descripcion: (result.data.descripcion == null)?'':result.data.descripcion,
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
                        arrayTipoVehiculo: array_aux
                    });
                } else {
                    console.log('Ocurrio un problema en el servidor');
                }
            }
        ).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
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
            message.error(strings.message_error);
        })
    }

    handleEventKeyPress(e) {
    }

    getTipoVehiculo() {
        httpRequest('get', ws.wsgettipovehiculo)
        .then(result => {
            if (result.ok) {
                this.setState({
                    arrayPadreVehiculo: result.data
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
                    arrayTipoVehiculo: array_aux
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }

        }).catch(error => {
            console.log(error)
            message.error(strings.message_error);
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
        var array =  this.state.arrayPadreVehiculo;
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

    getCliente() {
        var url = ws.wsshowcliente;
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
            message.error(strings.message_error);
        });
    }

    regresarListado() {
        this.setState({
            redirect: true,
        });
    }

    regresarIndexVehiculo() {
        this.setState({
            visibleCancelVehiculo: true,
        });  
    }

    redirect() {
        this.setState({redirect: true});
    }

    onChangeCodigoVehiculo(event) {
        this.setState({
            codigoVehiculo: event,
            codigo: event
        });
    }

    onChangePlacaVehiculo(event) {
        this.setState({
            placaVehiculo: event,
            placa: event,
        });
    }

    onChangeChasisVehiculo(event) {
        this.setState({
            chasisVehiculo: event,
            mensaje: 'Chasis*',
            chasis: event,
        });
    }

    onChangeTipoVehiculo(event) {
        this.setState({
            tipoVehiculo: event,
        });
    }

    onChangeIdCliente(e) {
        this.setState({
            idCliente: e.target.value,
        });
    }

    onChangeIdVehiculoTipo(value) {
        this.state.validacion[5] = 1;
        this.setState({
            idVehiculoTipo: value,
            validacion: this.state.validacion
        });
    }

    onChangeArrayCarracteristica(event) {
        this.state.arrayCaracteristica[event.id] = event.value;
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
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
                const image = {
                    idvehiculofoto: 0,
                    foto: e.target.result
                };
                this.state.arrayImage.push(image);
                this.setState({
                    arrayImage: this.state.arrayImage,
                    arrayImage2: [
                        ...this.state.arrayImage2,
                        e.target.result
                    ],
                    indice: longitud
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleRemoveImage() {
        const newImage = this.state.arrayImage;
        if (this.state.arrayImage[this.state.indice].idvehiculofoto != 0) {
            this.state.arrayImageRemove.push(this.state.arrayImage[this.state.indice].idvehiculofoto);
        }

        newImage.splice(this.state.indice, 1);
        this.state.arrayImage2.splice(this.state.indice, 1);
        let indice = this.state.indice;
        if (this.state.indice === (this.state.arrayImage.length)){
            indice = 0;
            /*this.setState({
                indice: 0
            });*/
        }
        this.setState({
            arrayImage: newImage,
            arrayImage2: this.state.arrayImage2,
            arrayImageRemove: this.state.arrayImageRemove,
            indice: indice
        });

    }

    onChangeNotaVehiculo(event) {
        this.setState({
            notaVehiculo: event,
            nota: event,
        });
    }

    onchangeDescripcionVehiculo(event) {
        this.setState({
            descripcionVehiculo: event,
            descripcion: event,
        });
    }

    handleAddRow() {
        this.state.items.push('');
        this.state.arrayCaracteristica.push('');
        this.state.arrayDetalleCaracteristica.push('');
        this.setState({
            items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    handleRemoveRow(indice) {

        if (this.state.items[indice] != ''){
            this.state.arrayDeleteCaracteristica.push(this.state.items[indice]);
            this.setState({
                arrayDeleteCaracteristica: this.state.arrayDeleteCaracteristica
            });
        }

        this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            items: this.state.items,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            arrayCaracteristica: this.state.arrayCaracteristica,
        });
    }

    verDatosCliente() {
        var data = {
            'idCliente': this.state.idCliente
        }
        httpRequest('post', ws.wsshowcliente, data)
        .then(result =>{
                if (result.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);

                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
                        visibleShowCliente: true,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            }
        ).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            }
        )
    }

    onCancelVehiculo(e) {
        e.preventDefault();
        this.setState({
            loadModalEditarVehiculo: true,
        });

        setTimeout(() => {

            this.handleCerrarModal();
            this.setState({
                redirect: true,
            });

        }, 300);
    }

    onSubmit(e) {
        e.preventDefault();

        if ((this.state.placaVehiculo.length > 0) && (this.state.tipoVehiculo.length > 0) && 
            (this.state.valueSeacrhCliente != undefined) && (this.state.idVehiculoTipo > 0)){
                this.setState({
                    visibleEditarVehiculo: true,
                });
        }else {
            this.validarDatos();
        }
    }

    validarDatos() {
        if (this.state.placaVehiculo.length === 0) {
            this.state.validacion[1] = 0;
        }
        if (this.state.tipoVehiculo.length === 0) {
            this.state.validacion[3] = 0;
        }
        if (this.state.idCliente === 0) {
            this.state.validacion[4] = 0;
        }
        if (this.state.idVehiculoTipo === 0) {
            this.state.validacion[5] = 0;
        }

        message.error("No se permite campo vacios");

        this.setState({
            validacion: this.state.validacion
        });
    }

    handleCerrarModal() {
        this.setState({
            visibleShowCliente: false,
            visibleCancelVehiculo: false,
            visibleEditarVehiculo: false,
            visibleImagen: false,
        });
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

    componentCancelVehiculo() {
        return (
            <Confirmation
                visible={this.state.visibleCancelVehiculo}
                loading={this.state.loadModalEditarVehiculo}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Cancelar Actualizacion'
                onClick={this.onCancelVehiculo.bind(this)}
                content='¿Estas seguro de no editar...?'
            />
        );
    }

    onSubmitGuardarDatos(e) {
        e.preventDefault();

        var newArray = [];

        this.state.arrayDetalle.map(
            resultado => {
                newArray.push(resultado.iddetallevehicarac);
            }
        );
            let body = {
                idvehiculo: this.props.match.params.id,
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
                detalleCaracteristica: JSON.stringify(this.state.arrayDetalleCaracteristica),
                items: JSON.stringify(this.state.items),
                arrayDelete: JSON.stringify(this.state.arrayDeleteCaracteristica),
                array: JSON.stringify(newArray),
                ImageDelete: JSON.stringify(this.state.arrayImageRemove)
            };
            this.setState({
                loadModalEditarVehiculo: true,
            });

            httpRequest('post', ws.wsvehiculoupdate, body)
            .then((result) => {
                    if (result.response === 1){
                        
                        this.regresarListado();
                        message.success('Exito en editar');
                        
                    } else if (result.response === 0) {
                        console.log('Ocurrio un problema en el servidor');
                    } else if (result.response === 2) {
                        this.state.validacion[2] = 2;
                        this.setState({
                            mensaje: result.data,
                            validacion: this.state.validacion
                        });
                        this.handleCerrarModal();
                        message.warning('Hubo un problema al actualizar');
                    } else if (result.response == -2) {
                        this.setState({ noSesion: true })
                    } else {
                        console.log('Ocurrio un problema en el servidor');
                    }
            }).catch(error => {
                console.log(error);
                message.error(strings.message_error);
            });
    }

    componentUpdateVehiculo() {
        return (
            <Confirmation 
                visible={this.state.visibleEditarVehiculo}
                loading={this.state.loadModalEditarVehiculo}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Editar Vehiculo'
                onClick={this.onSubmitGuardarDatos.bind(this)}
                content='¿Estas seguro de actualizar...?'
            />
        );
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

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    btnVerCrearCliente() {
        if (this.state.idCliente === 0 && this.permisions.agregar_cliente.visible == 'A') {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-6 cols-xs-12">
                    <div className="txts-center">
                        <C_Button type='primary'
                            title={<i className="fa fa-plus"> </i>}
                            style={{marginTop: 7, padding: 3}} size='small'
                            //onClick={this.crearNuevoCliente.bind(this)}
                        />
                    </div>
                </div>
            );
        } else if(this.permisions.ver_cliente.visible == 'A') {
            return (
                <div className="cols-lg-1 cols-md-1 cols-sm-6 cols-xs-12">
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
            );
        }
        const componentShowCliente = this.componentShowCliente();
        const componentCancelVehiculo = this.componentCancelVehiculo();
        const componentUpdateVehiculo = this.componentUpdateVehiculo();
        const btnVerCrearCliente = this.btnVerCrearCliente();
        const resultClientesCod = this.resultClientesCod();
        const resultClientesNom = this.resultClientesNom();

        if (this.state.redirect){
            return (<Redirect to={routes.vehiculo_index} />)
        }   
        let codigoVehiculo = this.state.codigoVehiculo;
        if (this.state.configCodigo) {
            codigoVehiculo = this.state.codigoVehiculo == null ? '' : this.state.codigoVehiculo;
        }
        return (
            
            <div className="rows">
                {componentShowCliente}
                {componentCancelVehiculo}
                {componentUpdateVehiculo}
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Editar Vehiculo"
                    //loading={this.state.loadingCancel}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar la actualizacion del vehiculo?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title" style={{'marginTop': '-4px'}}>Datos actuales del Vehiculo</h1>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <form onSubmit={this.onSubmit.bind(this)} encType="multipart/form-data">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'padding': 0,}}>
                                <C_Input
                                    value={codigoVehiculo} 
                                    onChange={this.onChangeCodigoVehiculo.bind(this)}
                                    title='Codigo'
                                    permisions={this.permisions.codigo}
                                    readOnly={true}
                                    //configAllowed={this.state.configCodigo}
                                />
                                <input type="hidden" value={this.state.codigo} />

                                <C_Input 
                                    value={this.state.placaVehiculo}
                                    onChange={this.onChangePlacaVehiculo.bind(this)}
                                    title='Placa*'
                                    permisions={this.permisions.placa}
                                />
                                <input type="hidden" value={this.state.placa} />

                                <C_Input 
                                    value={this.state.chasisVehiculo}
                                    onChange={this.onChangeChasisVehiculo.bind(this)}
                                    title='Chasis*'
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
                                    style={{ width: '100%', minWidth: '100%' }}
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
                                    style={{ width: '100%', minWidth: '100%' }}
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
                                    treeData={this.state.arrayTipoVehiculo}
                                    placeholder="Seleccione una opcion"
                                    onChange={this.onChangeIdVehiculoTipo.bind(this)}
                                    permisions={this.permisions.vehiculo}
                                    //readOnly={!this.state.isProducto}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'padding': 0,}}>
                                
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
                                <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">
                                    <CImage
                                        onChange={this.onChangeImage.bind(this)}
                                        //image={this.state.img}
                                        images={this.state.arrayImage2}
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

                                <div className="text-center-content">
                                    <C_Button
                                        title='Actualizar'
                                        type='primary'
                                        submit={true}
                                    />
                                    <C_Button
                                        title='Cancelar'
                                        type='danger'
                                        onClick={() => this.setState({ modalCancel: true })}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        );

    }
}




