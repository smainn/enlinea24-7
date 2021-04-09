
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { message, Modal, Spin, Icon, TreeSelect } from 'antd';

import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';

export default class ReporteCliente extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            inputInicio: true,

            tipopersoneria: '',
            tipocliente: '',
            nombre: '',
            apellido: '',
            genero: '',
            nit: '',
            ciudad: '',
            nacimientoinicio: '',
            nacimientofin: '',

            arrayclientetipo: [],
            arrayCiudad: [],
            arrayArbolCiudad: [],
            arrayContacto: [],
            cantidadArrayContacto: 0,

            items: [],

            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],
            noSesion: false
        }
    }

    componentDidMount() {

        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', ws.wsclientereporte)
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

                    arrayclientetipo: result.clientetipo,
                    arrayCiudad: result.ciudad,
                    arrayContacto: result.data,
                    cantidadArrayContacto: result.data.length,

                    items: this.state.items,
                    arrayCaracteristica: this.state.arrayCaracteristica,
                    arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
                });

                var array = result.ciudad;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].idpadreciudad == null) {
                        var elem = {
                            title: array[i].descripcion,
                            value: array[i].idciudad
                        };
                        array_aux.push(elem);
                    }
                }
                this.arbolCiudad(array_aux);
                this.setState({
                    arrayArbolCiudad: array_aux
                });
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

    arbolCiudad(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosCiudad(data[i].value);
            
            data[i].children = hijos;
            
            this.arbolCiudad(hijos);
        }
    }

    hijosCiudad(idpadre) {
        var array =  this.state.arrayCiudad;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idpadreciudad === idpadre){
                var elemento = {
                    title: array[i].descripcion,
                    value: array[i].idciudad
                };
                hijos.push(elemento);
            }
        }
        return hijos;
    }

    regresarIndex() {
        this.setState({
            redirect: true,
        });
    }

    onChangeTipoPersoneria(event) {
        this.setState({
            tipopersoneria: event.target.value,
        });
    }

    onChangeTipoCliente(event) {
        this.setState({
            tipocliente: event.target.value,
        });
    }

    onChangeNombre(event) {
        this.setState({
            nombre: event.target.value,
        });
    }

    onChangeApellido(event) {
        this.setState({
            apellido: event.target.value,
        });
    }

    onChangeGenero(event) {
        this.setState({
            genero: event.target.value,
        });
    }

    onChangeNit(event) {
        this.setState({
            nit: event.target.value,
        });
    }

    onChangeCiudad(event) {
        if (typeof event === 'undefined') {
            this.setState({
                ciudad: '',
            });
        }else {
            this.setState({
                ciudad: event,
            });
        }
    }

    onChangeNacimientoInicio(event) {
        if (event.target.value.toString().length == 0) {
            this.setState({
                nacimientoinicio: '',
                nacimientofin: '',
            });
        }else {
            if (event.target.value > this.state.nacimientofin) {
                this.setState({
                    nacimientoinicio: event.target.value,
                    nacimientofin: '',
                });
            }else {
                this.setState({
                    nacimientoinicio: event.target.value,
                });
            }
            
        }
    }

    onChangeNacimientoFin(event) {
        if (this.state.nacimientoinicio != '') {
            if (event.target.value >= this.state.nacimientoinicio) {
                this.setState({
                    nacimientofin: event.target.value,
                });
            }else {
                if (event.target.value == '') {
                    this.setState({
                        nacimientofin: '',
                    });
                }else {
                    message.error('La fecha final debe ser mayor');
                }
            }
        }
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
        if (this.state.items.length < this.state.cantidadArrayContacto) {
            this.state.items.push(0);
            this.state.arrayCaracteristica.push('');
            this.state.arrayDetalleCaracteristica.push('');
            this.setState({
                items: this.state.items,
                arrayCaracteristica: this.state.arrayCaracteristica,
                arrayDetalleCaracteristica: this.state.arrayDetalleCaracteristica,
            });
        }
        if (this.state.items. length === this.state.cantidadArrayContacto) {
            message.success('cantidad completa de contacto');
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

    componentCaracteristica(posicion) {
        var arrayCaracteristica = [];

        this.state.arrayContacto.map(
            (resultado, indice) => {
                var bandera = 0;
                for (var i = 0; i < this.state.items.length; i++) {
                    if (this.state.items[i] != 0) {
                        if (i != posicion) {
                            if (this.state.items[i] != 0) {
                                if (resultado.idreferenciadecontacto == this.state.items[i]) {
                                    bandera = 1;
                                }
                            }
                        }
                    }
                }
                if (bandera == 0) {
                    arrayCaracteristica.push(
                        <option key={indice} value={resultado.idreferenciadecontacto}>
                            {resultado.descripcion}
                        </option>
                    );
                }
            }
        );
        return arrayCaracteristica;
    }

    limpiarDatos() {
        this.setState({
            tipopersoneria: '',
            tipocliente: '',
            ciudad: '',
            genero: '',
            nombre: '',
            apellido: '',
            nit: '',
            nacimientoinicio: '',
            nacimientofin: '',
        });
    }

    render() {
        let conexion = readData(keysStorage.connection);
        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? null : 
            (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }
        if (this.state.redirect){
            return (<Redirect to={routes.cliente_index} />)
        }

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Cliente</h1>
                    </div>

                    <div className="pulls-right">
                        <button type="button" 
                            onClick={this.regresarIndex.bind(this)} 
                            className="btns btns-primary">
                                Atras
                        </button>
                    </div>

                    <form action={routes.cliente_reporte_generar} target="_blank" method="post">
                        <input type="hidden" value={usuario} name="usuario" />
                        <input type="hidden" value={conexion} name="x_conexion" />
                        <input type="hidden" value={x_idusuario} name="x_idusuario" />
                        <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                        <input type="hidden" value={x_login} name="x_login" />
                        <input type="hidden" value={x_fecha} name="x_fecha" />
                        <input type="hidden" value={x_hora} name="x_hora" />
                        <input type="hidden" value={token} name="authorization" />
                        <div className="forms-groups" style={{'borderBottom': '1px solid #e8e8e8'}}>
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select type="text"
                                            value={this.state.tipopersoneria} 
                                            onChange={this.onChangeTipoPersoneria.bind(this)}
                                            className='forms-control'>

                                            <option value=''>Seleccionar</option>
                                            <option value='N'>Natural</option>    
                                            <option value='J'>Juridico</option>    
                                        </select>

                                        <label 
                                            className='lbls-input active'>
                                            Tipo Personeria
                                        </label>
                                    </div>
                                    <input type="hidden" value={this.state.tipopersoneria} 
                                        name='tipopersoneria' />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select type="text"
                                            value={this.state.tipocliente} 
                                            onChange={this.onChangeTipoCliente.bind(this)}
                                            className='forms-control'>

                                            <option value=''>Seleccionar</option>

                                            {this.state.arrayclientetipo.map(
                                                (response, key) => (
                                                    <option key={key} value={response.idclientetipo}>
                                                        {response.descripcion}
                                                    </option>
                                                )
                                            )}  
                                        </select>

                                        <label 
                                            className='lbls-input active'>
                                            Tipo Cliente
                                        </label>
                                    </div>
                                    <input type='hidden' value={this.state.tipocliente}
                                        name='tipocliente' />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <TreeSelect
                                            value={(this.state.ciudad == '')?'Seleccionar':this.state.ciudad}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                                            treeData={this.state.arrayArbolCiudad}
                                            allowClear
                                            style={{'fontFamily': 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
                                                'width': '100%', 'minWidth': '100%'}}
                                            onChange={this.onChangeCiudad.bind(this)}
                                        />
                                        <label
                                            className='lbls-input active'>
                                            Ciudad
                                        </label>
                                    </div>
                                    <input type='hidden' value={this.state.ciudad}
                                        name='ciudad' />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups">
                                        <select type="text"
                                            value={this.state.genero} 
                                            onChange={this.onChangeGenero.bind(this)}
                                            className='forms-control'>

                                            <option value=''>Seleccionar</option>
                                            <option value='M'>Masculino</option>    
                                            <option value='F'>Femenino</option>  
                                            <option value='N'>Sin Declarar</option>  
                                        </select>

                                        <label 
                                            className='lbls-input active'>
                                            Genero
                                        </label>
                                    </div>
                                    <input type='hidden' value={this.state.genero}
                                        name='genero' />
                                </div>

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    
                                    <div className="inputs-groups">

                                        <input 
                                            type='text' value={this.state.nombre}
                                            onChange={this.onChangeNombre.bind(this)}
                                            className="forms-control"
                                            placeholder='Ingresar nombre'
                                        />
                                        <label className="lbls-input active">Nombre</label>
                                    </div>
                                    <input type='hidden' value={this.state.nombre}
                                        name='nombre' />
                                </div>

                                <div className="cols-lg-4 cols-md-4 cols-sm-6 cols-xs-12">
                                    
                                    <div className="inputs-groups">

                                        <input 
                                            type='text' value={this.state.apellido}
                                            onChange={this.onChangeApellido.bind(this)}
                                            className="forms-control"
                                            placeholder='Ingresar apellido'
                                        />
                                        <label className="lbls-input active">Apellido</label>
                                    </div>
                                    <input type='hidden' value={this.state.apellido}
                                        name='apellido' />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    
                                    <div className="inputs-groups">

                                        <input 
                                            type='text' value={this.state.nit}
                                            onChange={this.onChangeNit.bind(this)}
                                            className="forms-control"
                                            placeholder='Ingresar nit'
                                        />
                                        <label className="lbls-input active">Nit</label>
                                    </div>
                                    <input type='hidden' value={this.state.nit}
                                        name='nit' />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">

                                    <div className="inputs-groups">
                                        <input 
                                            type='date' value={this.state.nacimientoinicio}
                                            className='forms-control'
                                            onChange={this.onChangeNacimientoInicio.bind(this)}
                                        />
                                        <label className="lbls-input active">Fecha Nacimiento - Desde</label>
                                    </div>
                                    <input type='hidden' value={this.state.nacimientoinicio}
                                        name='nacimientoinicio' />
                                </div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">

                                    <div className="inputs-groups">
                                        <input 
                                            type='date' value={this.state.nacimientofin}
                                            className={(this.state.nacimientoinicio != '')?
                                                    'forms-control':
                                                    'forms-control cursor-not-allowed'}
                                            readOnly={(this.state.nacimientoinicio != '')?false:true}
                                            onChange={this.onChangeNacimientoFin.bind(this)}
                                        />
                                        <label style={{'color': (this.state.nacimientoinicio != '')?'#4476FA':'#e8e8e8'}}
                                            className="lbls-input active">
                                                Fecha Nacimiento - Fin
                                            </label>
                                    </div>
                                    <input type='hidden' value={this.state.nacimientofin}
                                        name='nacimientofin' />
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <div className="cols-lg-3 cols-md-3"></div>

                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups" >
                                        <select name="ordenacion" id="ordenar"
                                            className='forms-control'
                                            style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                            <option value={1}> Id Cliente </option>
                                            <option value={2}> Nombre </option>
                                            <option value={3}> Apellido </option>
                                            <option value={4}> Tipo Cliente </option>
                                            <option value={5}> Tipo Personeria </option>
                                            <option value={6}> Nit </option>
                                        </select>
                                        <label htmlFor="ordenar"
                                            className='lbls-input active'>
                                            Ordenar Por
                                        </label>
                                    </div>
                                </div>
                                <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                    <div className="inputs-groups" >
                                        <select name="exportar" id="exportar"
                                            className='forms-control'
                                            style={{'paddingBottom': '5px', 'paddingTop': '5px'}}>
                                            <option value="N"> Seleccionar </option>
                                            <option value="P"> PDF </option>
                                            <option value="E"> ExCel </option>
                                        </select>
                                        <label htmlFor="exportar"
                                            className='lbls-input active'>
                                            Exportar A
                                        </label>
                                    </div>
                                </div>
                            
                            </div>

                        </div>

                        <div className="forms-groups">
                            <div className="pulls-left">
                                <label>Caracteristicas:</label>
                            </div>
                        </div>

                        <div className="forms-groups">

                            <div className="cols-lg-3 cols-md-3 "></div>

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
                                            {(this.state.items.length === this.state.cantidadArrayContacto)?'':
                                                <a className="btns btns-sm btns-primary"
                                                    onClick={this.handleAddRow.bind(this)}
                                                    style={{'marginTop': '15px', 'padding': '3px'}}>
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
                                                        <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                                                            <select className="forms-control"
                                                                style={{'paddingBottom': '5px', 'paddingTop': '5px'}}
                                                                value={this.state.arrayCaracteristica[indice]}
                                                                onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                                >
                                                                <option value={0}>Seleccionar</option>

                                                                {this.componentCaracteristica(indice)}

                                                            </select>
                                                        </div>
                                                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
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
                                        <input type="hidden" value={this.state.arrayCaracteristica} 
                                            name="arrayCaracteristica" />
                                        <input type="hidden" value={this.state.arrayDetalleCaracteristica} 
                                            name="arrayDetalleCaracteristica" />
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
                                <button onClick={this.regresarIndex.bind(this)}
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