
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { message, TreeSelect, Select } from 'antd';

import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData, getConfigColor } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import { dateToString, hourToString } from '../../../utils/toolsDate';
import C_Select from '../../../componentes/data/select';
import C_Input from '../../../componentes/data/input';
import C_DatePicker from '../../../componentes/data/date';
import C_Button from '../../../componentes/data/button';
import ws from '../../../utils/webservices';

const {Option} = Select;

export default class Reporte_Cliente extends Component{

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
            exportar: 'N',
            ordenarpor: 1,

            items: [],

            arrayCaracteristica: [],
            arrayDetalleCaracteristica: [],
            noSesion: false
        }
    }

    onChangeOrd(event) {
        this.setState({
            ordenarpor: event
        })
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
                console.log(result);
            }

        }).catch(
            error => console.log(error)
        );
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
            tipopersoneria: event,
        });
    }

    onChangeTipoCliente(event) {
        this.setState({
            tipocliente: event,
        });
    }

    onChangeNombre(event) {
        this.setState({
            nombre: event,
        });
    }

    onChangeApellido(event) {
        this.setState({
            apellido: event,
        });
    }

    onChangeGenero(event) {
        this.setState({
            genero: event,
        });
    }

    onChangeNit(event) {
        this.setState({
            nit: event,
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
        if (event.toString().length == 0) {
            this.setState({
                nacimientoinicio: '',
                nacimientofin: '',
            });
        }else {
            if (event > this.state.nacimientofin) {
                this.setState({
                    nacimientoinicio: event,
                    nacimientofin: '',
                });
            }else {
                this.setState({
                    nacimientoinicio: event,
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

    onChangeExportar(event) {
        this.setState({
            exportar: event,
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

        let key = JSON.parse(readData(keysStorage.user));
        const usuario = ((key == null) || (typeof key == 'undefined' )) ? 
            null : (key.apellido == null)? key.nombre: key.nombre + ' ' + key.apellido;

        let conexion = readData(keysStorage.connection);

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio}/>)
        }
        if (this.state.redirect){
            return (<Redirect to={routes.cliente_index} />)
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
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Cliente</h1>
                    </div>

                    <form action={routes.cliente_reporte_generar} target="_blank" method="post">

                        <input type="hidden" value={_token} name="_token" />
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

                                <C_Select
                                    value={this.state.tipopersoneria} 
                                    onChange={this.onChangeTipoPersoneria.bind(this)}
                                    title='Tipo Personeria'
                                    component={[
                                        <Option key={0} value=""> Seleccionar </Option>,
                                        <Option key={1} value="N"> Natural </Option>,
                                        <Option key={2} value="J"> Juridico </Option>
                                    ]}
                                />
                                <input type="hidden" value={this.state.tipopersoneria} name='tipopersoneria' />

                                <C_Select
                                    value={this.state.tipocliente}
                                    title='Tipo Cliente'
                                    onChange={this.onChangeTipoCliente.bind(this)}
                                    component={
                                        this.state.arrayclientetipo.map(
                                            (data, key) => ((key == 0)?
                                                [
                                                    <Option key={-1} value={''}>
                                                        {'Seleccionar ... '}
                                                    </Option>,
                                                    <Option key={key} value={data.idclientetipo}>
                                                        {data.descripcion}
                                                    </Option>
                                                ]:
                                                    <Option key={key} value={data.idclientetipo}>
                                                        {data.descripcion}
                                                    </Option>
                                            )
                                        )
                                    }
                                />
                                <input type='hidden' value={this.state.tipocliente} name='tipocliente' />

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
                                            className='lbls-input active' style={{ color: getConfigColor() }}>
                                            Ciudad
                                        </label>
                                    </div>
                                    <input type='hidden' value={this.state.ciudad}
                                        name='ciudad' />
                                </div>

                                <C_Select
                                    value={this.state.genero} 
                                    onChange={this.onChangeGenero.bind(this)}
                                    title='Genero'
                                    component={[
                                        <Option key={0} value=""> Seleccionar </Option>,
                                        <Option key={1} value="M"> Masculino </Option>,
                                        <Option key={2} value="F"> Femenino </Option>,
                                        <Option key={3} value="N"> Sin Declarar </Option>,
                                    ]}
                                />
                                <input type='hidden' value={this.state.genero} name='genero' />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <C_Input 
                                    title='Nombre'
                                    value={this.state.nombre}
                                    onChange={this.onChangeNombre.bind(this)}
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type='hidden' value={this.state.nombre} name='nombre' />

                                <C_Input 
                                    title='Apellido'
                                    value={this.state.apellido}
                                    onChange={this.onChangeApellido.bind(this)}
                                    className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type='hidden' value={this.state.apellido} name='apellido' />

                                <C_Input 
                                    title='Nit'
                                    value={this.state.nit}
                                    onChange={this.onChangeNit.bind(this)}
                                />
                                <input type='hidden' value={this.state.nit} name='nit' />

                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="cols-lg-3 cols-md-3"></div>
                                
                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.nacimientoinicio}
                                    onChange={this.onChangeNacimientoInicio.bind(this)}
                                    title="Fecha Nacimiento - Desde"
                                />
                                <input type='hidden' value={this.state.nacimientoinicio} name='nacimientoinicio' />

                                <C_DatePicker 
                                    allowClear={true}
                                    value={this.state.nacimientofin}
                                    onChange={this.onChangeNacimientoFin.bind(this)}
                                    title="Fecha Nacimiento - Fin"
                                    readOnly={(this.state.nacimientoinicio != '')?false:true}
                                />
                                <input type='hidden' value={this.state.nacimientofin} name='nacimientofin' />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                
                                <div className="cols-lg-3 cols-md-3"></div>

                                <C_Select
                                    className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"
                                    value={this.state.ordenarpor}
                                    onChange={this.onChangeOrd.bind(this)}
                                    title='Ordenar Por'
                                    component={[
                                        <Option key={1} value={1}> Id Cliente  </Option>,
                                        <Option key={2} value={2}> Nombre </Option>,
                                        <Option key={3} value={3}> Apellido </Option>,
                                        <Option key={4} value={4}> Tipo Cliente </Option>,
                                        <Option key={5} value={5}> Tipo Personeria </Option>,
                                        <Option key={6} value={6}> Nit </Option>
                                    ]}
                                />
                                <input type="hidden" name="ordenacion" value={this.state.ordenarpor} />
                                
                                <C_Select
                                    className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12"
                                    value={this.state.exportar}
                                    onChange={this.onChangeExportar.bind(this)}
                                    title='Exportar A'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" name="exportar" value={this.state.exportar} />
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