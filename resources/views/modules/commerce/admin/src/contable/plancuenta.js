
import React, { Component } from 'react';

import axios from 'axios';
import { httpRequest, removeAllData, readData } from '../../tools/toolsStorage';
import {Redirect} from 'react-router-dom';
import routes from '../../tools/routes';
import C_Button from '../../components/data/button';
import keysStorage from '../../tools/keysStorage';
import { Icon, Dropdown, Menu } from 'antd';
import "antd/dist/antd.css";
import Confirmation from '../../components/confirmation';

//php artisan db:seed --class=\\Modules\\Commerce\\Database\\Seeders\\CuentaPlanEjemploTableSeeder

const data = [
    {idcuenta: 1, codcuenta: '1.0.0.00.000', nombre: 'Activo', fkidcuentaplanpadre: null},
    {idcuenta: 2, codcuenta: '1.1.0.00.000', nombre: 'Activo Corriente', fkidcuentaplanpadre: 1},
    {idcuenta: 3, codcuenta: '1.1.1.00.000', nombre: 'Disponible', fkidcuentaplanpadre: 2},
    {idcuenta: 4, codcuenta: '1.1.1.01.000', nombre: 'Caja', fkidcuentaplanpadre: 3},
    {idcuenta: 5, codcuenta: '1.1.1.01.001', nombre: 'Caja M/N', fkidcuentaplanpadre: 4},
    {idcuenta: 6, codcuenta: '1.1.1.01.002', nombre: 'Caja M/E', fkidcuentaplanpadre: 4},
    {idcuenta: 7, codcuenta: '1.1.1.02.000', nombre: 'Caja Chica', fkidcuentaplanpadre: 3},
    {idcuenta: 8, codcuenta: '1.1.1.02.001', nombre: 'Caja Chica M/N', fkidcuentaplanpadre: 7},
    {idcuenta: 9, codcuenta: '1.1.1.03.000', nombre: 'Banco', fkidcuentaplanpadre: 3},
    {idcuenta: 10, codcuenta: '1.1.1.03.001', nombre: 'Banco M/N', fkidcuentaplanpadre: 9},
    {idcuenta: 11, codcuenta: '1.1.1.03.002', nombre: 'Banco M/E', fkidcuentaplanpadre: 9},
    {idcuenta: 12, codcuenta: '1.2.0.00.000', nombre: 'Activo No Corriente', fkidcuentaplanpadre: 1},
    {idcuenta: 13, codcuenta: '2.0.0.00.000', nombre: 'Pasivo', fkidcuentaplanpadre: null},
    {idcuenta: 14, codcuenta: '3.0.0.00.000', nombre: 'Patrimonio', fkidcuentaplanpadre: null},
    {idcuenta: 15, codcuenta: '4.0.0.00.000', nombre: 'Ingresos', fkidcuentaplanpadre: null},
    {idcuenta: 16, codcuenta: '5.0.0.00.000', nombre: 'Egresos', fkidcuentaplanpadre: null},
];

export default class Plan_de_Cuenta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            familiacuenta: [],
            noSesion: false,
            height: 0,
            visible: false,
            bandera: 0,
            loading: false,
        }
    }
    componentDidMount() {
        httpRequest('get', '/commerce/api/plan_de_cuenta/index').then(
            response => {
                console.log(response)
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    onClickPorDefecto() {
        if (this.state.familiacuenta.length == 0) {
            //this.cargarDatosPorDefecto();
        }else {
            this.setState({
                bandera: 1,
                visible: true,
            })
        }
    }
    cargarDatosPorDefecto() {
        httpRequest('post', '/commerce/api/plan_de_cuenta/por_defecto').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        data: response.data,
                    });
                }
                var array = response.data;
                var array_aux = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].fkidcuentaplanpadre == null) {
                        var objeto = {
                            codigo: array[i].codcuenta,
                            title: array[i].nombre,
                            value: array[i].idcuenta,
                            idpadre: array[i].fkidcuentaplanpadre,
                            
                            icon: false,
                            treenode: false,
                            visible: false,
                        };
                        array_aux.push(objeto);
                    }
                }
                this.arbolFamilia(array_aux);
                this.setState({
                    familiacuenta: array_aux,
                    visible: false,
                    bandera: 0,
                });
            }
        ).catch(
            error => console.log(error)
        );
    }

    arbolFamilia(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].value);
            data[i].children = hijos;
            this.arbolFamilia(hijos);
        }
    }
    hijosFamilia(idpadre) {
        var array =  this.state.data;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    codigo: array[i].codcuenta,
                    title: array[i].nombre,
                    value: array[i].idcuenta,
                    idpadre: array[i].fkidcuentaplanpadre,

                    icon: false,
                    treenode: false,
                    visible: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    cargarTreeNode(data, bool) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            data[i].treenode = bool;
            this.cargarTreeNode(data[i].children, bool);
        }
    }
    onChangeChecked(event) {
        event.icon = !event.icon;
        this.cargarTreeNode(event.children, event.icon);
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    vistaPlanCuenta() {
        var recorrido = [];
        var contador = 0;
        this.recorridoEnPreOrden(this.state.familiacuenta, recorrido, contador);
        return recorrido;
    }
    recorridoEnPreOrden(nodoActual, recorrido, contador) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {

            var longitud = contador * 17 + 18;
            longitud = longitud.toString();
            longitud = longitud + 'px';

            recorrido.push(
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" 
                    key={nodoActual[i].value} 
                    style={{ 'height': '30px',
                        'display' : (nodoActual[i].treenode)?'none':'block', 
                    }}
                >

                    <div className="cols-lg-12 cols-md-9 cols-sm-12 cols-xs-12 padding-0" 
                        style={{'height': '100%',}}>
                    
                        <label style={{'position': 'relative', 'cursor': 'pointer',
                            'marginLeft': longitud.toString()}}>

                                <input type="checkbox" 
                                    style={{'display': 'none'}} 
                                    id={nodoActual[i].value} 
                                    onChange={this.onChangeChecked.bind(this, nodoActual[i])}
                                    checked={nodoActual[i].icon} 
                                />
                                <label 
                                    style={{'padding': '3px', 'margin': '0', 'fontSize': 14,
                                        lineHeight: 'normal', 'position': 'relative',
                                        'marginRight': '5px', 'marginTop': '-2px',
                                        'paddingRight': '1px', 'cursor': 'pointer',
                                    }}
                                    htmlFor={nodoActual[i].value}>
                                    <Icon style={{'display': 'block', 'fontWeight': 'bold'}} 
                                        type={
                                            (nodoActual[i].icon)?'right':'down'
                                        } 
                                    />
                                </label>
                                {nodoActual[i].codigo}
                                &nbsp;&nbsp;
                                {nodoActual[i].title}

                        </label>

                        {(nodoActual[i].idpadre == null)?null:
                            <Dropdown overlay={
                                <Menu style={{padding: 3}}>
                                    <Menu.Item key="0">
                                        Adicionar Cuenta
                                    </Menu.Item>
                                    <Menu.Item key="1">
                                        Editar Cuenta
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        Eliminar Cuenta
                                    </Menu.Item>
                                </Menu>
                            } 

                                trigger={['click']} visible={nodoActual[i].visible}
                                    onVisibleChange={this.onClickDropDownMenu.bind(this, nodoActual[i])}>
                                <Icon type="more"
                                    style={{padding: 0, position: 'relative',
                                        left: 10, top: -1, paddingTop: 3, paddingBottom: 3,
                                        cursor: 'pointer',}}
                                />
                            </Dropdown>
                        }
                        
                    </div>
                </div>
            );
            this.recorridoEnPreOrden(nodoActual[i].children, recorrido, contador + 1);
        }
    }
    onClickDropDownMenu(nodoActual) {
        nodoActual.visible = !nodoActual.visible;
        this.setState({
            familiacuenta: this.state.familiacuenta,
        })
    }
    onContraerArbol(data) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idpadre == null) {
                data[i].icon = true;
                this.cargarTreeNode(data[i].children, data[i].icon);
            }
        }
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    onExpandirArbol(data) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].idpadre == null) {
                data[i].icon = false;
                this.cargarTreeNode(data[i].children, data[i].icon);
            }
        }
        this.setState({
            familiacuenta: this.state.familiacuenta,
        });
    }
    onClose() {
        this.setState({
            visible: false,
            bandera: 0,
        });
    }
    componentConfirmation() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation 
                    visible={this.state.visible}
                    title = "Confirmacion de Plan de Cuenta"
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <label>¿Estas seguro de guardar cambios?</label>
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                    onClick={this.cargarDatosPorDefecto()}
                />
            );
        } 
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }
        var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        return (
            <div className='rows'>
                {this.componentConfirmation()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Plan de cuentas</h1>
                    </div>

                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0 scrollbars' 
                        id={`styles-scrollbar${colors}`}
                    >
                        {this.vistaPlanCuenta()}
                    </div>

                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title='Expandir'
                                type='primary'
                                onClick={this.onExpandirArbol.bind(this, this.state.familiacuenta)}
                            />
                            <C_Button title='Contraer'
                                type='primary'
                                onClick={this.onContraerArbol.bind(this, this.state.familiacuenta)}
                            />
                            <C_Button title='Imprimir PDF'
                                type='primary'
                            />
                            <C_Button title='Exportar EXCEL'
                                type='primary'
                            />
                        </div>
                    </div>
                    <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                        <div className='txts-center'>
                            <C_Button title='Importar'
                                type='primary'
                            />
                            <C_Button title='Por defecto'
                                type='primary'
                                onClick={this.onClickPorDefecto.bind(this)}
                            />
                            <C_Button title='Vaciar'
                                type='primary'
                            />
                            <C_Button title='Salir'
                                type='primary'
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}