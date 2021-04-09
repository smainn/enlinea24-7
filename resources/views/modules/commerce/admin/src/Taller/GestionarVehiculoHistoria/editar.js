
import React, { Component } from 'react';
import { message, Modal, Spin, Icon, DatePicker, Select} from 'antd';
import {Link, Redirect} from 'react-router-dom';

import 'antd/dist/antd.css';
import Input from '../../../components/input';
import moment from 'moment';
import CDatePicker from '../../../components/datepicker';
import { dateToString } from '../../../tools/toolsDate';
import TextArea from '../../../components/textarea';
import Confirmation from '../../../components/confirmation';

import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest } from '../../../tools/toolsStorage';
import CSelect from '../../../components/select2';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';
import C_Select from '../../../components/data/select';
import C_Input from '../../../components/data/input';
import C_DatePicker from '../../../components/data/date';
import C_TextArea from '../../../components/data/textarea';
import C_Button from '../../../components/data/button';
const { Option } = Select;
const CANT_CLIENTES_DEFAULT = 30;

export default class EditVehiculoHistoria extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            visible: false,
            loadModal: false,

            bandera: 0,

            contenedor: 0,
            contentCodigo: 0,

            nroHistorial: '',

            idVehiculo: 0,
            idCliente: 0,

            pagination: {
                total: 0,
                current_page: 0,
                per_page: 0,
                last_page: 0,
                from: 0,
                to:   0
            },
            pagina: 1,
            clientes: [],
            vehiculos: [],

            nombreCliente: '',
            codigoCliente: '',
            buscarCliente: '',
            buscarCodigo: '',

            descripcionVehiculo: '',

            kmActual: '',
            kmProximo: '',
            fechaProximo: dateToString(),
            diagnosticoEntrada: '',
            trabajoRealizado: '',
            nota: '',
            precio: 0,

            noSesion: false,
            valueSeacrhCliente: undefined,
            timeoutSearch: undefined,
            resultClientes: [],
            resultClientesDefault: [],
            configCodigo: false,
            resultVehiculos: [],
            resultVehiculosDefault: [],
            tiposVehiculo: [],
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
        this.searchClienteByIdCod = this.searchClienteByIdCod.bind(this);
        this.handleSearchCliCod = this.handleSearchCliCod.bind(this);
        this.onChangeSearchCliente = this.onChangeSearchCliente.bind(this);
        this.onDeleteCliente = this.onDeleteCliente.bind(this);
        this.onChangeSearchVehiculo = this.onChangeSearchVehiculo.bind(this);
        this.handleSearchVehiculo = this.handleSearchVehiculo.bind(this);
        this.searchVehiculoByPlaca = this.searchVehiculoByPlaca.bind(this);
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
                        idVehiculo: value,
                        descripcionVehiculo: data[i].fkidvehiculotipo,
                        valueSeacrhCliente: data[i].idcliente
                    });
                } else {
                    this.setState({
                        idVehiculo: value,
                        descripcionVehiculo: data[i].fkidvehiculotipo,
                        valueSeacrhCliente: data[i].idcliente
                    });
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

    handleSearchCliNombre(value) {

        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchClienteByNombre(value), 300);
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
            descripcionVehiculo: '',
            idVehiculo: undefined,
            descripcionVehiculo: '',
            //resultVehiculos: []
        })
    }

    componentDidMount() {
        this.getTiposVehiculos();
        this.getConfigsClient();
        this.getClientesDefault();
        httpRequest('get', '/commerce/api/vehiculo-historia/edit/' + this.props.match.params.id + '')
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    nroHistorial: result.data.idvehiculohistoria,
                    
                    resultVehiculos: result.vehiculo,
                    resultVehiculosDefault: result.vehiculo,
                    idCliente: result.data.idcliente,
                    valueSeacrhCliente: result.data.idcliente,
                    nombreCliente: result.data.cliente,
                    codigoCliente: result.data.codcliente,
                    idVehiculo: result.data.idvehiculo,
                    descripcionVehiculo: result.data.descripcion,

                    kmActual: result.data.kmactual,
                    kmProximo: result.data.kmproximo,
                    fechaProximo: result.data.fechaproxima,

                    diagnosticoEntrada: (result.data.diagnosticoentrada == null)?'':result.data.diagnosticoentrada,
                    trabajoRealizado: (result.data.trabajoshechos == null)?'':result.data.trabajoshechos,
                    nota: (result.data.notas == null)? '':result.data.notas,

                });

            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }
        }).catch(
            error => {console.log(error);}
        );
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
            } else {
                //
            }
        })
        .catch((error) => {
            console.log(error);
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
        })
    }

    getVehiculo(idCliente) {
        httpRequest('get', '/commerce/admin/getVehiculo?id=' + idCliente + '')
        .then(result => {
            if (result.response == 1) {
                if (result.data.length > 0) {
                    this.setState({
                        //idVehiculo: result.data[0].idvehiculo,
                        resultVehiculos: result.data,
                        resultVehiculosDefault: result.data,
                        idVehiculo: result.data[0].idvehiculo,
                        //idVehiculo: result.data[0].idvehiculo,
                        descripcionVehiculo: result.data[0].fkidvehiculotipo,
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
                console.log(result);
            }
        }).catch(
            error => {
                console.log(error);
            }
        );
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
    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }
    onChangeFechaProximo(dateString) {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);

        var fechaFormato = year + '-' + mes + '-' + dia;

        if (dateString >= fechaFormato) {
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

    showCancelConfirm() {
        const redirect = this.redirect;
        Modal.confirm({
            title: '¿Esta seguro de cancelar la actualizacion del historial del vehiculo?',
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

    handleCerrar() {
        this.setState({
            visible: false,
            bandera: 0,
            loadModal: false,
        });
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

        }, 800);
    }

    onChangeModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    title='Cancelar Editar Vehiculo Historia'
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
                    title='Editar Vehiculo Historia'
                    onClick={this.confirmarDatos.bind(this)}
                    content='¿Estas seguro de editar el historial...?'
                />

            );
        }
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
        //if ((this.state.idCliente == 0) || (this.state.idVehiculo == '')) {
        if ((this.state.valueSeacrhCliente == undefined) || (this.state.idVehiculo == undefined || this.state.idVehiculo == '')) {
            return false;
        }
        return true;
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
            fechaProxima: this.state.fechaProximo,
            nota: this.state.nota,
            idCliente: this.state.valueSeacrhCliente,
            idVehiculo: this.state.idVehiculo,
            idVehiculoHistoria: this.props.match.params.id,
        };
        httpRequest('post', '/commerce/api/vehiculo-historia/update', body)
        .then(result => {
            //console.log('RESULT ==> ', result);
            if (result.response == 1) {

                this.handleCerrar(); 
                this.setState({
                    redirect: true,
                });      

                message.success('datos actualizados exitosamente');

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch(
            error => {
                console.log(error);
            }
        );
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
                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                    allowClear={false}
                    title='Fecha Proxima'
                    format='YYYY-MM-DD'
                    placeholder="Selecciona la Fecha"
                    value={moment(this.state.fechaProximo, 'YYYY-MM-DD')}
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

    render() {
        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>);
        }
        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/vehiculo-historia/index"/>);
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
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title" style={{'marginTop': '-4px'}}>
                                    Datos actuales del historial del vehiculo
                            </h1>
                        </div>
                    </div>

                    <form onSubmit={this.onSubmit.bind(this)} encType="multipart/form-data">
                        <div className="forms-groups">
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Select
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Codigo Cliente'
                                    showSearch={true}
                                    value={this.state.valueSeacrhCliente}
                                    placeholder={"Buscar cliente por codigo"}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchCliCod}
                                    onChange={this.onChangeSearchCliente}
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
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchCliNombre.bind(this)}
                                    onChange={this.onChangeSearchCliente}
                                    allowDelete={true}      
                                    onDelete={this.onDeleteCliente}                                  
                                    component={resultClientesNom}
                                    //permisions={this.permisions.search_prod}
                                />
                                <C_Select
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    title='Placa Vehiculo'
                                    showSearch={true}
                                    value={this.state.idVehiculo}
                                    placeholder={"Buscar vehiculo"}
                                    style={{ width: '100%', minWidth: '100%' }}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearchVehiculo}
                                    onChange={this.onChangeSearchVehiculo}
                                    allowDelete={true}      
                                    onDelete={this.onDeleteCliente}                                  
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
                                    title='Actualizar'
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
                    </form>
                </div>
            </div>
        );
    }
}