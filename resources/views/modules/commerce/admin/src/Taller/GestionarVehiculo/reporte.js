
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { message, Modal, Spin, Icon, TreeSelect } from 'antd';
import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import Input from '../../../components/input';
import ws from '../../../tools/webservices';
import keysStorage from '../../../tools/keysStorage';
import { dateToString, hourToString } from '../../../tools/toolsDate';

export default class ReporteVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            inputInicio: true,

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
            configCodigo: false
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', '/commerce/api/vehiculo/reporte')
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
            codigoVehiculo: event.target.value,
        });
    }

    onChangePlacaVehiculo(event) {
        this.setState({
            placaVehiculo: event.target.value,
        });
    }

    onChangeChasisVehiculo(event) {
        this.setState({
            chasisVehiculo: event.target.value,
        });
    }

    onChangeIdCliente(event) {
        this.setState({
            idCliente: event.target.value,
        });
    }

    onChangeNombreCliente(event) {
        this.setState({
            nombreCliente: event.target.value,
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
            tipoVehiculo: event.target.value,
        });
    }

    onChangeArrayDetalleCaracteristica(posicion, event) {
        this.state.arrayDetalleCaracteristica[posicion] = event.target.value;
        this.setState({
            arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
        });
    }

    onChangeArrayCarracteristica(posicion, event) {
        this.state.arrayCaracteristica[posicion] = event.target.value;
        this.state.items[posicion] = event.target.value;
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
        httpRequest('post', '/commerce/admin/vehiculoReporte')
        .then(result => {
                console.log(result.data)
            } 
        ).catch(
            error => {console.log(error); }
        );
    }

    componentVehiculoCaracteristica(posicion) {
        var arrayCaracteristica = [];

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
                        <option key={indice} value={resultado.idvehiculocaracteristica}>
                            {resultado.caracteristica}
                        </option>
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
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? null : 
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        let conexion = readData(keysStorage.connection);
        const user = JSON.parse(readData(keysStorage.user));

        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const token = readData(keysStorage.token);

        if (this.state.noSeseion){
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/vehiculo/index"/>)
        }

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Vehiculo</h1>
                    </div>

                    <div className="pulls-right">
                        <button type="button" 
                            onClick={this.regresarIndexVehiculo.bind(this)} 
                            className="btns btns-primary">
                                Atras
                        </button>
                    </div>

                    <form action="/commerce/admin/vehiculo/generar" target="_blank" method="post">

                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={conexion} name="x_conexion" />

                        <input type="hidden" value={token} name="authorization" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />

                        <div className="forms-groups" style={{'borderBottom': '1px solid #e8e8e8'}}>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <Input 
                                            id="idvehiculo"
                                            value={this.state.idVehiculo} 
                                            title="Id Vehiculo"
                                            type="text"
                                            onChange={this.onChangeIdVehiculo.bind(this)}
                                            onFocus={this.idVehiculoFocus.bind(this)} 
                                            onBlur={this.idVehiculoBlur.bind(this)}
                                            configAllowed={this.state.configCodigo}
                                        />
                                        
                                        <input type="hidden" value={this.state.idVehiculo} name="idppp" />
                                    </div>
                                </div>

                                <div className="cols-lg-1"></div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.codigoVehiculo} 
                                            onChange={this.onChangeCodigoVehiculo.bind(this)}
                                            className='forms-control'
                                            placeholder='Ingresar codigo...'
                                        />
                                        <label
                                            className='lbls-input active'>
                                            Codigo Vehiculo
                                        </label>
                                        <input type="hidden" value={this.state.codigoVehiculo} name="codigoppp" />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.placaVehiculo} 
                                            onChange={this.onChangePlacaVehiculo.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar placa..."
                                        />
                                        <label
                                            className="lbls-input active">
                                            Placa
                                        </label>
                                        <input type="hidden" value={this.state.placaVehiculo} name="placappp" />
                                    </div>
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="inputs-groups">
                                        <input type="text"
                                            value={this.state.chasisVehiculo} 
                                            onChange={this.onChangeChasisVehiculo.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar chasis..."/>
                                        <label  
                                            className="lbls-input active">
                                            Chasis
                                        </label>
                                        <input type="hidden" value={this.state.chasisVehiculo} name="chasisppp"/>
                                    </div>
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.idCliente} 
                                            onChange={this.onChangeIdCliente.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar id cliente..."
                                        />
                                        <label 
                                            className="lbls-input active">
                                            Id Cliente
                                        </label>
                                        <input type="hidden" value={this.state.idCliente} name="idClienteppp" />
                                    </div>
                                </div>

                                <div className="cols-lg-1"></div>

                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text"
                                            value={this.state.nombreCliente} 
                                            onChange={this.onChangeNombreCliente.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar cliente..."
                                        />
                                        <label 
                                            className="lbls-input active">
                                            Nombre Cliente
                                        </label>
                                        <input type="hidden" value={this.state.nombreCliente} name="nombreCliente" />
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <TreeSelect
                                            value={(this.state.idVehiculoTipo === 0)?'Seleccionar':this.state.idVehiculoTipo}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                                            treeData={this.state.arrayVehiculoTipo}
                                            allowClear
                                            style={{'fontFamily': 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif'}}
                                            onChange={this.onChangeIdVehiculoTipo.bind(this)}
                                        />
                                        <input type="hidden" value={this.state.idVehiculoTipo} name="idVehiculoTipoppp" />
                                        <label
                                            className="lbls-input active">
                                            Tipo
                                        </label>
                                    </div>
                                </div>

                                <div className="cols-lg-1"></div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content" >
                                        <select 
                                            value={this.state.tipoVehiculo}
                                            onChange={this.onChangeTipoVehiculo.bind(this)}
                                            className="forms-control"
                                            name="tipopartprivppp"
                                        >
                                            <option value=""> Seleccionar </option>
                                            <option value="P"> Publico </option>
                                            <option value="R"> Privado </option>
                                        </select>
                                        <label 
                                            className="lbls-input active">
                                            Tipo Uso
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content" >
                                        <select name="ordenacion" 
                                            className="forms-control"
                                        >
                                            <option value={1}> Id Vehiculo </option>
                                            <option value={2}> Codigo </option>
                                            <option value={3}> Placa </option>
                                            <option value={4}> Chasis </option>
                                            <option value={5}> Id cliente </option>
                                            <option value={6}> Nombre Cliente </option>
                                            <option value={7}> Tipo </option>
                                            <option value={8}> Tipo Uso </option>  
                                        </select>
                                        <label
                                            className="lbls-input active">
                                            Ordenar Por
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content" >
                                        <select name="reporte"
                                            className="forms-control"
                                        >
                                            <option value="N"> Seleccionar </option>
                                            <option value="P"> PDF </option>
                                            <option value="E"> ExCel </option>
                                        </select>
                                        <label
                                            className="lbls-input active">
                                            Exportar A
                                        </label>
                                    </div>
                                </div>
                            
                            </div>

                        </div>

                        <div className="form-group-content">
                            <div className="pull-left-content">
                                <label>Caracteristicas:</label>
                            </div>
                        </div>

                        <div className="form-group-content">

                            <div className="col-lg-3-content col-md-2-content "></div>

                            <div className="col-lg-6-content col-md-8-content col-sm-12-content col-xs-12-content">
                            
                                <div className="card-caracteristica">

                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                        <div className="pull-left-content">
                                            <h1 className="title-logo-content"> Referencia </h1>
                                        </div>
                                    </div>

                                    <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                        <div className="pull-left-content">
                                            <h1 className="title-logo-content"> Valor </h1>
                                        </div>
                                    </div>

                                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                        <div className="pull-right-content">
                                            {(this.state.items.length === this.state.cantidadDeCaracteristica)?'':
                                                <a className="btns btns-ms btns-primary"
                                                    onClick={this.handleAddRow.bind(this)}
                                                    style={{'marginTop': '15px', 'padding': '2px 3px'}}>
                                                    <i className="fa fa-plus"></i>
                                                </a>
                                            }
                                        </div>
                                    </div>

                                    <div className="caja-content">
                                        {this.state.items.map(
                                            (resultado, indice) => {
                                                return (
                                                    <div key={indice}>
                                                        <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                                            <select className="forms-control"
                                                                value={this.state.arrayCaracteristica[indice]}
                                                                onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                                >
                                                                <option value={0}>Seleccionar</option>

                                                                {this.componentVehiculoCaracteristica(indice)}

                                                            </select>
                                                        </div>
                                                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                                            <input type="text"  
                                                                placeholder=" Ingresar detalles ..."
                                                                className='forms-control'
                                                                value={this.state.arrayDetalleCaracteristica[indice]}  
                                                                onChange={this.onChangeArrayDetalleCaracteristica.bind(this, indice)}      
                                                            />
                                                        </div>

                                                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-1-content"
                                                                style={{'marginLeft': '-7px'}}>
                                                                <div className="text-center-content">
                                                                    <i onClick={this.handleRemoveRow.bind(this, indice)}
                                                                        className="fa fa-times btns btns-sm btns-danger"
                                                                        style={{'marginTop': '2px'}}> </i>
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

                            <div className="col-lg-3-content col-md-2-content "></div>

                        </div>

                        <div className="form-group-content"
                            style={{'marginBottom': '-10px'}}>
                            <div className="text-center-content">
                                <button type="button" onClick={this.limpiarDatos.bind(this)}
                                    className="btns btns-primary"
                                    style={{'marginRight': '20px'}}>
                                    Limpiar
                                </button>
                                <button type="submit"
                                    className="btns btns-primary"
                                    style={{'marginRight': '20px'}}>
                                    Generar
                                </button>
                                <button onClick={this.regresarIndexVehiculo.bind(this)}
                                    type="button" className="btns btns-danger">
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