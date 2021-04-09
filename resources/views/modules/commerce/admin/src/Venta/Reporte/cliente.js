
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { message, Select } from 'antd';

import 'antd/dist/antd.css';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import { dateToString, hourToString } from '../../../tools/toolsDate';
import C_Select from '../../../components/data/select';
import C_Input from '../../../components/data/input';
import C_DatePicker from '../../../components/data/date';
import C_Button from '../../../components/data/button';
import C_TreeSelect from '../../../components/data/treeselect';

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

            exportar: 'N',
            ordenar: 1,

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

    componentWillMount() {

        setTimeout(() => {

            this.setState({
                inputInicio: false,
            });

        }, 300);

        httpRequest('get', '/commerce/api/cliente/reporte')
        .then(result => {

            if (result.response === 1) {

                if (result.data.length > 3) {
                    this.state.items = [0, 0, 0];
                    this.state.arrayCaracteristica = [0, 0, 0];
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
    onChangeExportar(value) {
        this.setState({
            exportar: value,
        });
    }
    onChangeOrdenar(value) {
        this.setState({
            ordenar: value,
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
        if (this.state.items.length < this.state.cantidadArrayContacto) {
            this.state.items.push(0);
            this.state.arrayCaracteristica.push(0);
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
        arrayCaracteristica.push(
            <Option value={0} key={-1}>Seleccionar</Option>
        )
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
                        <Option key={indice} value={resultado.idreferenciadecontacto}>
                            {resultado.descripcion}
                        </Option>
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
            exportar: 'N',
            ordenar: 1,
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
            return (<Redirect to="/commerce/admin/cliente/index"/>)
        }
        
        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());
        const x_connection = readData(keysStorage.connection);

        return (
            <div className="rows">

                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Reporte Cliente</h1>
                    </div>

                    <form action="/commerce/admin/cliente/generar" target="_blank" method="post">

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

                                
                                <C_TreeSelect 
                                    value={(this.state.ciudad == '')?undefined:this.state.ciudad}
                                    treeData={this.state.arrayArbolCiudad}
                                    allowClear={true}
                                    onChange={this.onChangeCiudad.bind(this)}
                                    title='Ciudad'
                                />
                                <input type='hidden' value={this.state.ciudad} name='ciudad' />

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
                                <C_Select value={this.state.ordenar}
                                    title='Ordenar Por'
                                    onChange={this.onChangeOrdenar.bind(this)}
                                    component={
                                        [
                                            <Option value={1} key={0}>ID Cliente</Option>,
                                            <Option value={2} key={1}>Nombre</Option>,
                                            <Option value={3} key={2}>Apellido</Option>,
                                            <Option value={4} key={3}>Tipo Cliente</Option>,
                                            <Option value={5} key={4}>Tipo Personeria</Option>,
                                            <Option value={6} key={5}>Nit</Option>,
                                        ]
                                    }
                                />
                                <input type='hidden' name='ordenacion' value={this.state.ordenar} />
                                
                                <C_Select value={this.state.exportar}
                                    title='Exportar A'
                                    onChange={this.onChangeExportar.bind(this)}
                                    component={
                                        [
                                            <Option value='N' key={0}>Seleccionar</Option>,
                                            <Option value='P' key={1}>PDF</Option>,
                                            <Option value='F' key={2}>Excel</Option>,
                                        ]
                                    }
                                />
                                <input type='hidden' name='exportar' value={this.state.exportar} />
                            
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
                                                <C_Button size='small'
                                                    type='primary'
                                                    title={<i className='fa fa-plus'></i>}
                                                    onClick={this.handleAddRow.bind(this)}
                                                    style={{'marginTop': '15px',}}
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
                                                            className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12'
                                                            value={this.state.arrayCaracteristica[indice]}
                                                            onChange={this.onChangeArrayCarracteristica.bind(this, indice)}
                                                            component={this.componentCaracteristica(indice)}
                                                        />
                                                        <C_Input 
                                                            className='cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12'
                                                            value={this.state.arrayDetalleCaracteristica[indice]}  
                                                            onChange={this.onChangeArrayDetalleCaracteristica.bind(this, indice)} 
                                                            placeholder=" Ingresar detalles ..."
                                                        />

                                                        <div className="cols-lg-1 cols-md-1 cols-sm-12 cols-xs-12"
                                                                style={{'marginLeft': '-7px'}}>
                                                                <div className="txts-center">
                                                                    <C_Button size='small'
                                                                        type='danger'
                                                                        title={<i className='fa fa-remove'></i>}
                                                                        onClick={this.handleRemoveRow.bind(this, indice)}
                                                                    />
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