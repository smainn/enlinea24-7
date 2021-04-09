
import React, { Component } from 'react';

import {Redirect, Link} from 'react-router-dom';

import { message, Select, notification } from 'antd';
import 'antd/dist/antd.css';

import { httpRequest, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import ws from '../../../utils/webservices';
import { dateToString, hourToString, convertDmyToYmd } from '../../../utils/toolsDate';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_DatePicker from '../../../componentes/data/date';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
import C_TreeSelect from '../../../componentes/data/treeselect';
import C_Caracteristica from '../../../componentes/data/caracteristica';
const { Option } = Select;

export default class Reporte_Proveedor extends Component{
    constructor(props){
        super(props);
        
        this.state = {

            codidproveedor: '',
            nombre: '',
            apellido: '',
            nit: '',
            nameciudad: '',
            idciudad: '',
            fkidcontacto: ['', '', ''],
            arraydetcontacto: ['', '', ''],

            array_contacto: [],
            tree_ciudad: [],

            ordenar: 1,
            exportar: 'N',
            config_codigo: true,
            noSesion: false,

        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsProveedor + '/reporte')
        .then((result) => {
            console.log(result)
            if (result.response == 1) {
                this.setState({
                   config_codigo: result.configscliente.codigospropios,
                   array_contacto: result.referenciacontacto,
                });
                this.cargarTreeCiudad(result.ciudad, result.ciudadpadre);
            } else if (result.response == -2) {
                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    cargarTreeCiudad(array_ciudad, data) {
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].descripcion,
                value: array[i].idciudad,
                idciudad: array[i].idciudad,
            };
            array_aux.push(objeto);
        }
        this.treeCiudad(array_aux, array_ciudad);
        this.setState({
            tree_ciudad: array_aux,
        });
    }
    treeCiudad(data, array_ciudad) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCiudad(data[i].idciudad, array_ciudad);
            data[i].children = hijos;
            this.treeCiudad(hijos, array_ciudad);
        }
    }
    childrenCiudad(idpadre, array_ciudad) {
        var array = array_ciudad;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].idpadreciudad == idpadre) {
                var objeto = {
                    title: array[i].descripcion,
                    value: array[i].idciudad,
                    idciudad: array[i].idciudad,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    onChangeIDCiudad(value, label, extra) {
        // console.log(extra)
        // var idciudad = extra.triggerNode ? extra.triggerNode.props.idciudad : '' ;
        this.setState({idciudad: value, });
    }
    limpiarDatos() {
        this.setState({
            codidproveedor: '',
            nombre: '',
            apellido: '',
            nit: '',
            nameciudad: '',
            idciudad: '',
            fkidcontacto: ['', '', ''],
            arraydetcontacto: ['', '', ''],

            ordenar: 1,
            exportar: 'N',
        });
    }
    render() {

        const token = readData(keysStorage.token);
        const user = JSON.parse(readData(keysStorage.user));
        const x_idusuario =  user == undefined ? 0 : user.idusuario;
        const x_grupousuario = user == undefined ? 0 : user.idgrupousuario;
        const x_login = user == undefined ? null : user.login;
        const x_fecha =  dateToString(new Date());
        const x_hora = hourToString(new Date());

        const conexion = readData(keysStorage.connection);
        const meta = document.getElementsByName('csrf-token');
        const _token = meta.length > 0 ? meta[0].getAttribute('content') : '';

        const usuario = user == undefined ? null : user.apellido == null ? user.nombre : user.nombre + ' ' + user.apellido;

        if (this.state.noSesion){
            return (<Redirect to={routes.inicio}/>)
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-froups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">
                                REPORTE PROVEEDOR
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <form action={routes.reporte_proveedor_generar} target="_blank" method="post">

                            <input type="hidden" value={_token} name="_token" />
                            <input type="hidden" value={conexion} name="x_conexion" />
                            <input type="hidden" value={usuario} name="usuario" />

                            <input type="hidden" value={x_idusuario} name="x_idusuario" />
                            <input type="hidden" value={x_grupousuario} name="x_grupousuario" />
                            <input type="hidden" value={x_login} name="x_login" />
                            <input type="hidden" value={x_fecha} name="x_fecha" />
                            <input type="hidden" value={x_hora} name="x_hora" />
                            <input type="hidden" value={token} name="authorization" />

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className='cols-lg-3 cols-md-3'></div>
                                <C_Input
                                    value={this.state.codidproveedor}
                                    title={ this.state.config_codigo ? 'Codigo' : 'ID'}
                                    onChange={(value) => this.setState({codidproveedor: value,})}
                                />
                                <input type="hidden" value={this.state.codidproveedor} name="codidproveedor" />
                                <C_TreeSelect   
                                    allowClear={true}
                                    title='Ciudad'
                                    value={this.state.idciudad}
                                    treeData={this.state.tree_ciudad}
                                    placeholder='Seleccione una opcion'
                                    onChange={this.onChangeIDCiudad.bind(this)}
                                />
                                <input type="hidden" value={this.state.idciudad} name="idciudad" />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <C_Input
                                    value={this.state.nombre}
                                    title={ 'Nombre'}
                                    onChange={(value) => this.setState({nombre: value,})}
                                />
                                <input type="hidden" value={this.state.nombre} name="nombre" />
                                <C_Input
                                    value={this.state.apellido}
                                    title={ 'Apellido'}
                                    onChange={(value) => this.setState({apellido: value,})}
                                    className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom"
                                />
                                <input type="hidden" value={this.state.apellido} name="apellido" />
                                <C_Input
                                    value={this.state.nit}
                                    title={ 'Nit'}
                                    onChange={(value) => this.setState({nit: value,})}
                                />
                                <input type="hidden" value={this.state.nit} name="nit" />
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Caracteristica 
                                    title="Referencia de Contacto"
                                    data={this.state.array_contacto}
                                    onAddRow={() => {
                                        this.state.arraydetcontacto.push('');
                                        this.state.fkidcontacto.push('');
                                        this.setState({
                                            fkidcontacto: this.state.fkidcontacto,
                                            arraydetcontacto: this.state.arraydetcontacto,
                                        });
                                    } }
                                    optionDefault="Seleccionar"
                                    valuesSelect={this.state.fkidcontacto}
                                    onChangeSelect={ (event) => {
                                        let index = event.id;
                                        let valor = event.value;
                                        if (valor == "") {
                                            this.state.arraydetcontacto[index] = "";
                                        }
                                        this.state.fkidcontacto[index] = valor;
                                        this.setState({
                                            arraydetcontacto: this.state.arraydetcontacto,
                                            fkidcontacto: this.state.fkidcontacto,
                                        });
                                    } }
                                    valuesInput={this.state.arraydetcontacto}
                                    onChangeInput={ (event) => {
                                        let index = event.id;
                                        let value = event.value;
                                        if (this.state.fkidcontacto[index] == "") {
                                            message.warning('FAVOR DE SELECCIONAR CONTACTO');
                                            return;
                                        }
                                        this.state.arraydetcontacto[index] = value;
                                        this.setState({
                                            arraydetcontacto: this.state.arraydetcontacto,
                                        });
                                    } }
                                    onDeleteRow={ (index) => {
                                        this.state.fkidcontacto.splice(index, 1);
                                        this.state.arraydetcontacto.splice(index, 1);
                                        this.setState({
                                            fkidcontacto: this.state.fkidcontacto,
                                            arraydetcontacto: this.state.arraydetcontacto,
                                        });
                                    } }
                                />
                                <input type="hidden" value={JSON.stringify(this.state.fkidcontacto)} name="fkidcontacto" />
                                <input type="hidden" value={JSON.stringify(this.state.arraydetcontacto)} name="arraydetcontacto" />
                            </div>
                            
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                                <div className="cols-lg-3 cols-md-3"></div>
                                <C_Select 
                                    value={this.state.ordenar}
                                    title='Ordenar Por'
                                    onChange={(value) => this.setState({ordenar: value,})}
                                    component={[
                                        <Option key={0} value={1}> ID PROVEEDOR </Option>,
                                        <Option key={1} value={2}> NOMBRE </Option>,
                                        <Option key={2} value={3}> APELLIDO  </Option>,
                                        <Option key={3} value={4}> CIUDAD  </Option>,
                                        <Option key={4} value={5}> NIT  </Option>,
                                    ]}
                                />
                                <input type="hidden" value={this.state.ordenar} name="ordenar" />
                                <C_Select 
                                    value={this.state.exportar}
                                    onChange={(value) => this.setState({exportar: value,})}
                                    title='Exportar'
                                    component={[
                                        <Option key={0} value="N"> Seleccionar </Option>,
                                        <Option key={1} value="P"> PDF </Option>,
                                        <Option key={2} value="E"> ExCel </Option>
                                    ]}
                                />
                                <input type="hidden" name="exportar" value={this.state.exportar} />
                            </div>
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
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
            </div>
        );
    }
}