
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Spin, Icon, Select } from 'antd';
import 'antd/dist/antd.css';
const { Option } = Select;
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import Input from '../../../componentes/input';
import ws from '../../../utils/webservices';
import keysStorage from '../../../utils/keysStorage';
import C_Input from '../../../componentes/data/input';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_Select from '../../../componentes/data/select';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Button from '../../../componentes/data/button';

export default class Reporte_Vehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            inputInicio: true,

            ordenar: 1,
            exportar: 'N',

            idVehiculo: '',
            codigoVehiculo: '',
            placaVehiculo: '',
            chasisVehiculo: '',
            tipoVehiculo: '',
            idCliente: '',
            nombreCliente: '',

            idVehiculoTipo: 0,

            vehiculoCaracteristica: [],
            arrayPadreVehiculoTipo: [],
            arrayVehiculoTipo: [],

            items: [],
            cantidadDeCaracteristica: 0,

            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],

            noSeseion: false,
            configCodigo: false,
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', ws.wsvehiculoreporte)
        .then(result => {

            if (result.response === 1) {

                if (result.data.length > 3) {
                    this.state.items = [0, 0, 0];
                    this.state.arrayCaracteristica = ['', '', ''];
                    this.state.arrayDetalleCaracteristica = ['', '', ''];
                }else {
                    for (var pos = 0; pos < result.data.length; pos++) {
                        this.state.items.push(0);
                        this.state.arrayCaracteristica.push('');
                        this.state.arrayDetalleCaracteristica.push('');
                    }
                }

                this.setState({
                    vehiculoCaracteristica: result.data,
                    arrayPadreVehiculoTipo: result.vehiculoTipo,

                    items: this.state.items,
                    arrayCaracteristica: this.state.arrayCaracteristica,
                    arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                    cantidadDeCaracteristica: result.data.length,
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
                this.setState({ noSeseion: true })
            } else {
                console.log(result);
            }

        }).catch(
            error => console.log(error)
        );
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
        })
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

    regresarIndexVehiculo() {
        this.setState({
            redirect: true,
        });
    }

    onChangeIdVehiculo(event) {
        this.setState({
            idVehiculo: event
        });
    }

    onChangeCodigoVehiculo(event) {
        this.setState({
            codigoVehiculo: event,
        });
    }

    onChangePlacaVehiculo(event) {
        this.setState({
            placaVehiculo: event,
        });
    }

    onChangeChasisVehiculo(event) {
        this.setState({
            chasisVehiculo: event,
        });
    }

    onChangeIdCliente(event) {
        this.setState({
            idCliente: event,
        });
    }

    onChangeNombreCliente(event) {
        this.setState({
            nombreCliente: event,
        });
    }

    onChangeIdVehiculoTipo(event) {

        if (typeof event === 'undefined') {
            this.setState({
                idVehiculoTipo: 0,
            });
        }else {
            this.setState({
                idVehiculoTipo: event,
            });
        }
    }

    onChangeTipoVehiculo(event) {
        this.setState({
            tipoVehiculo: event,
        });
    }
    onChangeOrdenar(event) {
        this.setState({
            ordenar: event,
        });
    }
    onChangeExportar(event) {
        this.setState({
            exportar: event,
        });
    }

    onChangeArrayDetalleCaracteristica(posicion, event) {
        this.state.arrayDetalleCaracteristica[posicion] = event;
        this.setState({
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    onChangeArrayCarracteristica(posicion, event) {
        this.state.arrayCaracteristica[posicion] = event;
        this.state.items[posicion] = event;
        this.setState({
            arrayCaracteristica: this.state.arrayCaracteristica,
            items: this.state.items,
        });
    }

    focusInputInicio(e) {
        if (e != null) {
            if (this.state.inputInicio) {
                e.focus();
            }
        }
    }

    handleAddRow() {
        if (this.state.items.length < this.state.cantidadDeCaracteristica) {
            this.state.items.push(0);
            this.state.arrayCaracteristica.push('');
            this.state.arrayDetalleCaracteristica.push('');
            this.setState({
                items: this.state.items,
                arrayCaracteristica: this.state.arrayCaracteristica,
                arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            });
        }
        if (this.state.items. length === this.state.cantidadDeCaracteristica) {
            message.success('cantidad completa de referencia');
        }
    }

    handleRemoveRow(indice) {
        this.state.items.splice(indice, 1);
        this.state.arrayCaracteristica.splice(indice, 1);
        this.state.arrayDetalleCaracteristica.splice(indice, 1);
        this.setState({
            items: this.state.items,
            arrayCaracteristica: this.state.arrayCaracteristica,
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    generarReporte(e) {
        var data = {
            'idVehiculo': this.state.idVehiculo
        }
        httpRequest('post', ws.wsvehiculorepor)
        .then(result => {
                console.log(result.data)
            } 
        ).catch(
            error => {console.log(error); }
        );
    }

    componentVehiculoCaracteristica(posicion) {
        var arrayCaracteristica = [];

        arrayCaracteristica.push(
            <Option key={-1} value={''}>Seleccionar</Option>
        );

        this.state.vehiculoCaracteristica.map(
            (resultado, indice) => {
                var bandera = 0;
                for (var i = 0; i < this.state.items.length; i++) {
                    if (this.state.items[i] != 0) {
                        if (i != posicion) {
                            if (this.state.items[i] != 0) {
                                if (resultado.idvehiculocaracteristica == this.state.items[i]) {
                                    bandera = 1;
                                }
                            }
                        }
                    }
                }
                if (bandera == 0) {
                    arrayCaracteristica.push(
                        <Option key={indice} value={resultado.idvehiculocaracteristica}>
                            {resultado.caracteristica}
                        </Option>
                    );
                }
            }
        );
        return arrayCaracteristica;
    }

    idVehiculoFocus() {
        this.state.InputFocusBlur[0] = 1;
        this.state.labelFocusBlur[0] = 1;
        this.setState({
            InputFocusBlur: this.state.InputFocusBlur,
            labelFocusBlur: this.state.labelFocusBlur,
        });
    }

    idVehiculoBlur() {
        if (this.state.idVehiculo.length == 0) {
            this.state.InputFocusBlur[0] = 0;
            this.state.labelFocusBlur[0] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
                labelFocusBlur: this.state.labelFocusBlur,
            });
        }else {
            this.state.InputFocusBlur[0] = 0;
            this.setState({
                InputFocusBlur: this.state.InputFocusBlur,
            });
        }
    }

    limpiarDatos() {
        this.setState({
            idVehiculo: '',
            codigoVehiculo: '',
            placaVehiculo: '',
            chasisVehiculo: '',
            tipoVehiculo: '',
            idCliente: '',
            nombreCliente: '',

            idVehiculoTipo: 0,

        });
    }

    render() {

        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;
        
        let conexion = readData(keysStorage.connection);

        if (this.state.noSeseion){
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to={routes.vehiculo_index} />)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Vehiculo</h1>
                    </div>

                    <form action={routes.vehiculo_reporte_generar} target="_blank" method="post">
                        
                        <input type="hidden" value={meta[0].getAttribute('content')} name="_token" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={x_connection} name="x_conexion" />
                        <input type="hidden" value={token} name="authorization" />

                        <input type="hidden" value={usuario} name="usuario" />

                        <div className="forms-groups" style={{'borderBottom': '1px solid #e8e8e8'}}>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.idVehiculo} 
                                    title="Id Vehiculo"
                                    onChange={this.onChangeIdVehiculo.bind(this)}
                                    configAllowed={this.state.configCodigo}
                                />
                                <input type="hidden" value={this.state.idVehiculo} name="idppp" />

                                <div className="cols-lg-1"></div>

                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.codigoVehiculo} 
                                    title="Codigo Vehiculo"
                                    onChange={this.onChangeCodigoVehiculo.bind(this)}
                                />
                                <input type="hidden" value={this.state.codigoVehiculo} name="codigoppp" />

                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.placaVehiculo} 
                                    title="Placa"
                                    onChange={this.onChangePlacaVehiculo.bind(this)}
                                />
                                <input type="hidden" value={this.state.placaVehiculo} name="placappp" />

                                <C_Input 
                                    className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.chasisVehiculo} 
                                    title="Chasis"
                                    onChange={this.onChangeChasisVehiculo.bind(this)}
                                />
                                <input type="hidden" value={this.state.chasisVehiculo} name="chasisppp"/>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <C_Input 
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.idCliente} 
                                    title="Id Cliente"
                                    onChange={this.onChangeIdCliente.bind(this)}
                                />
                                <input type="hidden" value={this.state.idCliente} name="idClienteppp" />

                                <div className="cols-lg-1"></div>

                                <C_Input 
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={this.state.nombreCliente} 
                                    title="Nombre Cliente"
                                    onChange={this.onChangeNombreCliente.bind(this)}
                                />
                                <input type="hidden" value={this.state.nombreCliente} name="nombreCliente" />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <C_TreeSelect 
                                    className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-bottom"
                                    value={(this.state.idVehiculoTipo === 0)?'Seleccionar':this.state.idVehiculoTipo}
                                    treeData={this.state.arrayVehiculoTipo}
                                    allowClear={true}
                                    title='Tipo'
                                    style={{'fontFamily': 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif'}}
                                    onChange={this.onChangeIdVehiculoTipo.bind(this)}
                                />
                                <input type="hidden" value={this.state.idVehiculoTipo} name="idVehiculoTipoppp" />
                                    

                                <div className="cols-lg-1"></div>

                                <C_Select
                                    title='Tipo Uso'
                                    value={this.state.tipoVehiculo}
                                    onChange={this.onChangeTipoVehiculo.bind(this)}
                                    component={[
                                        <Option key={0} value=''>Seleccionar</Option>,
                                        <Option key={1} value='P'>Publico</Option>,
                                        <Option key={2} value='R'>Privado</Option>
                                    ]}
                                />
                                <input type="hidden" value={this.state.tipoVehiculo} name="tipopartprivppp" />

                                <C_Select
                                    title='Ordernar Por'
                                    value={this.state.ordenar}
                                    onChange={this.onChangeOrdenar.bind(this)}
                                    component={[
                                        <Option key={0} value={1}>Id Vehiculo</Option>,
                                        <Option key={1} value={2}>Codigo</Option>,
                                        <Option key={2} value={3}>Placa</Option>,
                                        <Option key={3} value={4}>Chasis</Option>,
                                        <Option key={4} value={5}>Id Cliente</Option>,
                                        <Option key={5} value={6}>Nombre Cliente</Option>,
                                        <Option key={6} value={7}>Tipo</Option>,
                                        <Option key={7} value={8}>Tipo Uso</Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenar} name="ordenacion" />

                                <C_Select
                                    title='Exportar A'
                                    value={this.state.exportar}
                                    onChange={this.onChangeExportar.bind(this)}
                                    component={[
                                        <Option key={0} value={'N'}>Seleccionar</Option>,
                                        <Option key={1} value={'P'}>PDF</Option>,
                                        <Option key={2} value={'E'}>ExCel</Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.exportar} name="reporte" />
                            
                            </div>

                        </div>

                        <div className="forms-groups">
                            <div className="pull-left-content">
                                <label>Caracteristicas:</label>
                            </div>
                        </div>

                        <div className="forms-groups">

                            <div className="cols-lg-3 cols-md-2"></div>

                            <div className="cols-lg-6 cols-md-8 cols-sm-12 cols-xs-12">
                            
                                <div className="card-caracteristica">

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Referencia </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                        <div className="pulls-left">
                                            <h1 className="title-logo-content"> Valor </h1>
                                        </div>
                                    </div>

                                    <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                        <div className="pulls-right">
                                            {(this.state.items.length === this.state.cantidadDeCaracteristica)?'':
                                                <C_Button
                                                    title={<i className="fa fa-plus"></i>}
                                                    type='primary'
                                                    style={{'marginTop': '15px', 'padding': '2px 2px'}}
                                                    size='small'
                                                    onClick={this.handleAddRow.bind(this)}
                                                />
                                            }
                                        </div>
                                    </div>

                                    <div className="caja-content">
                                        {this.state.items.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice}>
                                                        <C_Select 
                                                            title=''
                                                            value={this.state.arrayCaracteristica[indice]}
                                                            onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                            component={this.componentVehiculoCaracteristica(indice)}
                                                            className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12"
                                                        />
                                                        <C_Input 
                                                            value={this.state.arrayDetalleCaracteristica[indice]}  
                                                            onChange={this.onChangeArrayDetalleCaracteristica.bind(this, indice)}  
                                                            placeholder={' Ingresar detalles ...'}
                                                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                                        />

                                                        <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                                style={{'marginLeft': '-7px'}}>
                                                                <div className="txts-center">
                                                                    <C_Button
                                                                        title={<i className="fa fa-times"></i>}
                                                                        type='danger'
                                                                        style={{'marginTop': '2px', 'padding': '2px 2px'}}
                                                                        size='small'
                                                                        onClick={this.handleRemoveRow.bind(this, indice)}
                                                                    />
                                                                </div>
                                                        </div>
                                                        
                                                    </div>
                                                );
                                            }
                                        )}
                                        <input type="hidden" value={this.state.arrayCaracteristica} name="arrayCaracteristica" />
                                        <input type="hidden" value={this.state.arrayDetalleCaracteristica} name="arrayDetalleCaracteristica" />
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="forms-groups"
                            style={{'marginBottom': '-10px'}}>
                            <div className="txts-center">
                                <C_Button
                                    title='Limpiar'
                                    type='primary'
                                    onClick={this.limpiarDatos.bind(this)}
                                />
                                <C_Button
                                    title='Generar'
                                    type='primary'
                                    submit={true}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}