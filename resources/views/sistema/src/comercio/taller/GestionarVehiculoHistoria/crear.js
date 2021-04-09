
import React, { Component } from 'react';
import { message, Modal, Spin, Icon, DatePicker, Select } from 'antd';
import 'antd/dist/antd.css';

import {Link, Redirect} from 'react-router-dom';
import { dateToString, stringToDate, convertYmdToDmy } from '../../../utils/toolsDate';
import Confirmation from '../../../componentes/confirmation';
import moment from 'moment';
import CSelect from '../../../componentes/select2';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import C_Select from '../../../componentes/data/select';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';
import C_TextArea from '../../../componentes/data/textarea';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
const { Option } = Select;
const CANT_CLIENTES_DEFAULT = 30;
let now = new Date();
export default class CrearVehiculoHistoria extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            visible: false,
            loadModal: false,

            bandera: 0,

            contenedor: 0,
            nroHistorial: 0,
            contentCodigo: 0,

            pagination: {
                total: 0,
                current_page: 0,
                per_page: 0,
                last_page: 0,
                from: 0,
                to:   0
            },
            pagina: 5,
            clientes: [],
            vehiculos: [],

            buscarCliente: '',
            buscarCodigo: '',
            idCliente: 0,
            nombreCliente: '',
            codigoCliente: '',

            idVehiculo: 0,
            descripcionVehiculo: '',

            kmActual: '',
            kmProximo: '',
            fechaProximo: dateToString(now, 'f2'),
            diagnosticoEntrada: '',
            trabajoRealizado: '',
            nota: '',
            precio: 0,
            noSesion: false,
            valueSeacrhCliente: undefined,
            valueSeacrhVehiculo: undefined,
            timeoutSearch: undefined,
            resultClientes: [],
            resultClientesDefault: [],
            resultVehiculos: [],
            resultVehiculosDefault: [],
            tiposVehiculo: [],
            configCodigo: false,
            modalCancel: false,

        }

        this.permisions = {
            cod_cli: readPermisions(keys.vehiculo_historia_select_search_codigoCliente),
            nom_cli: readPermisions(keys.vehiculo_historia_select_search_nombreCliente),
            placa: readPermisions(keys.vehiculo_historia_select_placa),
            tipo: readPermisions(keys.vehiculo_historia_input_descripcion), //tipo vehiculo
            km_actual: readPermisions(keys.vehiculo_historia_input_kmActual),
            km_proximo: readPermisions(keys.vehiculo_historia_input_kmProximo),
            fecha_prox: readPermisions(keys.vehiculo_historia_fechaProxima),
            diagnostico: readPermisions(keys.vehiculo_historia_textarea_diagnostico),
            trabajo: readPermisions(keys.vehiculo_historia_textarea_trabajo),
            nota: readPermisions(keys.vehiculo_historia_textarea_nota)
        }

        this.redirect = this.redirect.bind(this);
        this.componentFechaProxima = this.componentFechaProxima.bind(this);
        this.searchClienteByIdCod = this.searchClienteByIdCod.bind(this);
        this.handleSearchCliCod = this.handleSearchCliCod.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.searchClienteByNombre = this.searchClienteByNombre.bind(this);
        this.handleSearchCliNombre = this.handleSearchCliNombre.bind(this);
        this.handleSearchVehiculo = this.handleSearchVehiculo.bind(this);
        this.searchVehiculoByPlaca = this.searchVehiculoByPlaca.bind(this);
        this.onChangeSearchVehiculo = this.onChangeSearchVehiculo.bind(this);
        this.onDeleteSearchVehiculo = this.onDeleteSearchVehiculo.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
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

    searchVehiculoByPlaca(value) {
        if (value.length > 0) {
            httpRequest('post', ws.wsclivehiculosplaca, {
                value: value,
                idcliente: this.state.valueSeacrhCliente == undefined ? null : this.state.valueSeacrhCliente
            })
            .then((result) => {
                if (result.response == 1) {
                    this.setState({
                        resultVehiculos: result.data
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
                resultVehiculos: this.state.resultVehiculosDefault
            });
        }
        
    }

    handleSearchVehiculo(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchVehiculoByPlaca(value), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSearchVehiculo(value) {
        let data = this.state.resultVehiculos;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idvehiculo == value) {
                if (this.state.valueSeacrhCliente == undefined) {
                    this.addCliente({
                        idcliente: data[i].idcliente, 
                        codcliente: data[i].codcliente,
                        nombre: data[i].nombre,
                        apellido: data[i].apellido
                    });
                    this.setState({
                        descripcionVehiculo: data[i].fkidvehiculotipo,
                        valueSeacrhVehiculo: value,
                        valueSeacrhCliente: data[i].idcliente
                    })
                } else {
                    this.setState({
                        descripcionVehiculo: data[i].fkidvehiculotipo,
                        valueSeacrhVehiculo: value,
                        valueSeacrhCliente: data[i].idcliente
                    })
                }
                break;
            }
        }
    }

    addCliente(cliente) {
        
        let data = this.state.resultClientes;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idcliente == cliente.idcliente) {
                return;
            }
        }
        this.setState({
            resultClientes: [
                ...this.state.resultClientes,
                cliente
            ]
        })
    }

    onDeleteSearchVehiculo() {
        this.setState({
            valueSeacrhVehiculo: undefined
        })
    }

    searchClienteByIdCod(value) {
        httpRequest('post', ws.wssearchclienteidcod, {value: value})
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
        });
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
        this.getVehiculo(value);
        this.setState({ 
            valueSeacrhCliente: value,
         })
    }

    onDeleteCliente() {
        this.setState({
            valueSeacrhCliente: undefined,
            valueSeacrhVehiculo: undefined,
            descripcionVehiculo: '',
            //resultVehiculos: [],
            //resultVehiculosDefault: [],
        })
    }

    searchClienteByNombre(value) {
        httpRequest('post', ws.wssearchclientenombre, {value: value})
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
        this.getTiposVehiculos();
        this.getClientesDefault();
        httpRequest('get', ws.wsvehiculohistoriacreate)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    nroHistorial: result.data + 1,
                    pagination: result.pagination,
                    pagina: 1,
                    clientes: result.cliente.data,
                    //fechaProximo: dateToString
                });
            }
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
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
            } else {
                //
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getTiposVehiculos() {
        httpRequest('get', ws.wstipovehiculo)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    tiposVehiculo: result.data
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Error en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
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
    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }
    fechaProxima() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        mes = (mes == 12)?1:mes + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = year + '-' + mes + '-' + dia;

        return fechaFormato;
    }

    getCliente(page, buscar, nroPagina) {
        var url =  ws.wsmostrarcliente + '?page=' + page + '&buscar=' + 
            buscar + '&pagina=' + nroPagina;
        httpRequest('get', url)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    clientes: result.cliente.data,
                    pagination: result.pagination,
                });
            }
            
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    getVehiculo(idCliente) {
        httpRequest('get', ws.wsgetvehiculo, {
            id: idCliente
        })
        .then(result => {
            //console.log(result);
            if (result.response == 1) {
                if (result.data.length > 0) {
                    this.setState({
                        //idVehiculo: result.data[0].idvehiculo,
                        resultVehiculos: result.data,
                        valueSeacrhVehiculo: result.data[0].idvehiculo,
                        //descripcionVehiculo: result.data[0].descripcion,
                        descripcionVehiculo: result.data[0].fkidvehiculotipo,
                        resultVehiculosDefault: result.data,
                    });
                } else {
                    message.warning('El cliente no tiene vehiculos');
                    this.setState({
                        //vehiculos: result.data,
                        resultVehiculos: result.data,
                    });
                }
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

    deleteCliente() {
        this.setState({
            contenedor: 0,
            contentCodigo: 0,
            buscarCliente: '',
            buscarCodigo: '',
            idCliente: 0,
            nombreCliente: '',
            codigoCliente: '',
            vehiculos: [],
            idVehiculo: 0,
            descripcionVehiculo: '',
        });
    }

    onChangeIdVehiculo(event) {
        this.setState({
            //idVehiculo: event.target.value,
            idVehiculo: event
        });
        this.state.vehiculos.map(
            result => {
                if (result.idvehiculo == event) {
                    this.setState({
                        descripcionVehiculo: result.descripcion,
                    });
                }
            }
        )
    }

    onChangeKmActual(event) {
        this.setState({
            kmActual: event,
        });
    }
    onChangeKmProximo(event) {
        this.setState({
            kmProximo: event,
        });
    }

    onChangeFechaProximo(dateString) {
        
        let date = stringToDate(dateString, 'f2');
        let now = new Date();
        if (date >= now) {
            this.setState({
                fechaProximo: dateString,
            });
        }
        
    }

    onChangeDiagnosticoEntrada(event) {
        this.setState({
            diagnosticoEntrada: event,
        });
    }

    onChangeTrabajoRealizado(event) {
        this.setState({
            trabajoRealizado: event,
        });
    }

    onChangeNota(event) {
        this.setState({
            nota: event,
        });
    }

    regresarListado() {
        if ((this.state.idCliente == 0) && (this.state.kmActual == '') && 
            (this.state.kmProximo == '') && (this.state.diagnosticoEntrada == '') && 
            (this.state.trabajoRealizado == '') && (this.state.nota == '')) {
            this.setState({
                redirect: true,
            });
        }else {
            this.setState({
                visible: true,
                bandera: 1,
            });
        }
    }

    redirect() {
        this.setState({redirect: true});
    }

    handleCerrar() {
        this.setState({
            visible: false,
            bandera: 0,
            loadModal: false,
        });
    }

    onChangeModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    title='Cancelar Historia Vehiculo'
                    onClick={this.regresarAtras.bind(this)}
                    content='¿Estas seguro de cancelar el historial...?'
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    title='Nuevo Historia Vehiculo'
                    onClick={this.confirmarDatos.bind(this)}
                    content='¿Estas seguro de crear el historial...?'
                />

            );
        }
        return null;
    }

    confirmarDatos(event) {
        event.preventDefault();
        this.setState({
            loadModal: true,
        });

        let body = {
            diagnosticoEntrada: this.state.diagnosticoEntrada,
            trabajoHecho: this.state.trabajoRealizado,
            precio: this.state.precio,
            kmActual: this.state.kmActual,
            kmProximo: this.state.kmProximo,
            fechaProxima: convertYmdToDmy(this.state.fechaProximo),
            nota: this.state.nota,
            idCliente: this.state.valueSeacrhCliente,
            idVehiculo: this.state.valueSeacrhVehiculo
        }

        httpRequest('post', ws.wsvehiculohistoriastore, body)
        .then(result => {      
            this.handleCerrar();     
            if (result.response == 1) {
                this.setState({
                    redirect: true,
                });     
                message.success('datos guardados exitosamente');

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        }).catch(error => {
                this.handleCerrar(); 
                console.log(error);
                message.error(strings.message_error);
            }
        );
    }

    regresarAtras() {
        this.setState({
            loadModal: true,
        })
        setTimeout(() => {

            this.handleCerrar();
            this.setState({
                redirect: true,
            });
            message.success('se cancelo con exito');

        }, 400);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.analizarValidacion()) {
            this.setState({
                visible: true,
                bandera: 2,
            });
        }else {
            message.error('No se permite campo vacio ');
        }
    }

    analizarValidacion() {
        //if ((this.state.idCliente == 0) || (this.state.idVehiculo == 0)) {
        if ((this.state.valueSeacrhCliente == undefined) || (this.state.valueSeacrhVehiculo == undefined)) {
            return false;
        }
        return true;
    }

    listaTiposVehiculos() {
        let data = this.state.tiposVehiculo;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idvehiculotipo}>{data[i].descripcion}</Option>
            );
        }
        return arr;
    }

    componentFechaProxima() {
        if (this.permisions.fecha_prox.visible == 'A') {
            let b = this.permisions.fecha_prox.editable == 'A' ? false : true;
            return (
                <C_DatePicker
                    title='Fecha Proxima'
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                    allowClear={false}
                    //format='YYYY-MM-DD'
                    placeholder="Selecciona la Fecha"
                    value={moment(this.state.fechaProximo, 'DD-MM-YYYY')}                        
                    //defaultValue={moment(this.state.fecha, 'YYYY-MM-DD HH:mm')}
                    onChange={this.onChangeFechaProximo.bind(this)} 
                    readOnly={b}
                />
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

    resultVehiculosPlaca() {
        let data = this.state.resultVehiculos;
        let length = data.length;
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(
                <Option key={i} value={data[i].idvehiculo}>{data[i].placa}</Option>
            );
        }
        return arr;
    }

    render () {
        if (this.state.noSesion){
            removeAllData();
            return (<Redirect to={routes.inicio}/>);
        }
        if (this.state.redirect){
            return (<Redirect to={routes.vehiculo_historia} />);
        }

        const componentModalShow = this.onChangeModalShow();
        const listaTiposVehiculos = this.listaTiposVehiculos();
        const componentFechaProxima = this.componentFechaProxima();
        const resultClientesCod = this.resultClientesCod();
        const resultClientesNom = this.resultClientesNom();
        const resultVehiculosPlaca = this.resultVehiculosPlaca();

        return (
            <div className="rows">

                {componentModalShow}
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Cancelar Registro de Historia del Vehiculo"
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de historia del vehiculo?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <h1 className="lbls-title">Registrar Historia Vehiculo</h1>
                        </div>
                    </div>

                    <form onSubmit={this.onSubmit.bind(this)} encType="multipart/form-data">
                        <div className="forms-groups">

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <C_Select
                                    className='cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom'
                                    title='Codigo Cliente'
                                    showSearch={true}
                                    value={this.state.valueSeacrhCliente}
                                    placeholder={"Buscar cliente por codigo"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchCliCod}
                                    onChange={this.onChangeSearchCliente}
                                    //notFoundContent={null}
                                    allowDelete={true}      
                                    onDelete={this.onDeleteCliente}                                  
                                    component={resultClientesCod}
                                    //permisions={this.permisions.search_prod}
                                />
                                <C_Select
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Nombre Cliente'
                                    showSearch={true}
                                    value={this.state.valueSeacrhCliente}
                                    placeholder={"Buscar cliente por nombre"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchCliNombre}
                                    onChange={this.onChangeSearchCliente}
                                    //notFoundContent={null}
                                    allowDelete={true}      
                                    onDelete={this.onDeleteCliente}                                  
                                    component={resultClientesNom}
                                    //permisions={this.permisions.search_prod}
                                />
                                <C_Select
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Placa Vehiculo'
                                    showSearch={true}
                                    value={this.state.valueSeacrhVehiculo}
                                    placeholder={"Buscar vehiculo"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchVehiculo}
                                    onChange={this.onChangeSearchVehiculo}
                                    //notFoundContent={null}
                                    allowDelete={true}      
                                    onDelete={this.onDeleteSearchVehiculo}                                  
                                    component={resultVehiculosPlaca}
                                    //permisions={this.permisions.search_prod}
                                />
                                <C_Select
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Vehiculo*'
                                    value={this.state.descripcionVehiculo}
                                    //onChange={this.onChangeTipoVehiculo.bind(this)}
                                    permisions={this.permisions.tipo}
                                    readOnly={true}
                                    component={listaTiposVehiculos}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input 
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.kmActual}
                                    onChange={this.onChangeKmActual.bind(this)}
                                    title='Km/Milla Actual*'
                                    permisions={this.permisions.km_actual}
                                />

                                <C_Input 
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.kmProximo}
                                    onChange={this.onChangeKmProximo.bind(this)}
                                    title='Km/Milla Proximo*'
                                    permisions={this.permisions.km_proximo}
                                />
                                { componentFechaProxima }
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    value={this.state.diagnosticoEntrada}
                                    onChange={this.onChangeDiagnosticoEntrada.bind(this)}
                                    title='Diagnostico Entrada'
                                    permisions={this.permisions.diagnostico}
                                />

                                <C_TextArea 
                                    value={this.state.trabajoRealizado}
                                    onChange={this.onChangeTrabajoRealizado.bind(this)}
                                    title='Trabajo Realizado'
                                    permisions={this.permisions.trabajo}
                                />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_TextArea 
                                    className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.nota}
                                    onChange={this.onChangeNota.bind(this)}
                                    title='Nota'
                                    permisions={this.permisions.nota}
                                />
                            </div>
                        </div>

                        <div className="forms-groups">
                            <div className="text-center-content">
                                <C_Button
                                    title='Aceptar'
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
        );
    }
}