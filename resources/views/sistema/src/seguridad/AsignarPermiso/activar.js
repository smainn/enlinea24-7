
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Confirmation from '../../componentes/confirmation';

import { message, Tooltip, Icon } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';
import C_Button from '../../componentes/data/button';
import C_CheckBox from '../../componentes/data/checkbox';
import ws from '../../utils/webservices';

export default class ActivarPrivilegio extends Component {

    constructor(props) {
        super(props);
        this.state = {

            FamiliaPermisos: [],
            permisos: [],
            arrayPermisos: [],

            message: 0,
            mensaje: '',

            sw: 0,
            visible: false,
            loading: false,
            noSesion: false
        }

    }

    componentDidMount() {
        this.getPermisos();
    }
    
    getPermisos() {
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null) ? 0 : key.idgrupousuario;
        
        if (id == 1) {
            httpRequest('get', ws.wspermisionshow + '/' + id)
            .then(result => {
                    if (result.response == 0) {
                    } else if (result.response == 1) {
                        this.setState({
                            permisos: result.data,
                        });

                        var array = result.data;
                        var array_aux = [];
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].idcomponentepadre == null) {
                                var objeto = {
                                    title: array[i].descripcion,
                                    value: array[i].idcomponente,
                                    tipo: array[i].tipo,
                                    active: (array[i].activo == 'N')?false:true,
                                    validacion: false,
                                    icon: false,
                                    treenode: false,
                                };
                                array_aux.push(objeto);
                            }
                        }
                        this.arbolPermisos(array_aux);
                        this.setState({
                            FamiliaPermisos: array_aux,
                        });
                    } else if (result.response == -2) {
                        this.setState({ noSesion: true })
                    }
            })
            .catch(
                error => console.log(error)
            );
        }

    }

    arbolPermisos(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosPermisos(data[i].value);
            data[i].children = hijos;
            this.arbolPermisos(hijos);
        }
    }
    hijosPermisos(idpadre) {
        var array =  this.state.permisos;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].idcomponentepadre === idpadre) {
                var objeto = {
                    title: array[i].descripcion,
                    value: array[i].idcomponente,
                    tipo: array[i].tipo,
                    active: (array[i].activo == 'N')?false:true,
                    validacion: false,
                    icon: false,
                    treenode: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }

    cargarPorDefectoActive(data, bandera) { 
        if (bandera == 1) {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].active = false;
                this.cargarPorDefectoActive(data[i].children, bandera);
            }
        }else {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].active = true;
                this.cargarPorDefectoActive(data[i].children, bandera);
            }
        }
    }

    onChangeCheckedActive(event) {
        if (event.active) {
            event.active = false;
            this.cargarPorDefectoActive(event.children, 1);
        }else {
            event.active = true;
            this.cargarPorDefectoActive(event.children, 2);
        }
        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos,
        });
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
            FamiliaPermisos: this.state.FamiliaPermisos,
        });
    }

    vistaPermiso() {
        var recorrido = [];
        var contador = 0;
        this.recorridoEnPreOrden(this.state.FamiliaPermisos, recorrido, contador);
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

                    <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-9 padding-0" style={{'height': '100%'}}>
                    
                        <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8" style={{'borderRight': '1px solid #e8e8e8', 'borderTop': '1px solid #e8e8e8'}}>
                            
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
                                    
                                    {nodoActual[i].title}
                            </label>
                        </div>

                        <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderTop': '1px solid #e8e8e8', 'borderRight': '1px solid #e8e8e8'}}>
                            <label>{nodoActual[i].tipo}</label>
                        </div>
                        
                    </div>

                    <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3 padding-0" style={{'borderTop': '1px solid #e8e8e8', 'height': '100%'}}>
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center" 
                                style={{'borderRight': '1px solid #e8e8e8'}}>
                                
                                <C_CheckBox
                                    tooltip={nodoActual[i].title} placement='left'
                                    onChange={this.onChangeCheckedActive.bind(this, nodoActual[i])}
                                    checked={nodoActual[i].active}
                                />

                            </div>

                        </div>
                    </div>
                </div>
            );
            this.recorridoEnPreOrden(nodoActual[i].children, recorrido, contador + 1);
        }
    }

    onsubmit(event) {
        event.preventDefault();
        this.setState({
            sw: 1,
            visible: true,
        });
    }

    cargarPermisos() {
        var recorrido = [];
        this.cargarPermisosRecursivo(this.state.FamiliaPermisos, recorrido);
        this.state.arrayPermisos = recorrido;
        this.setState({
            arrayPermisos: this.state.arrayPermisos,
        });
    }
    cargarPermisosRecursivo(nodoActual, recorrido) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {
            recorrido.push(nodoActual[i]);
            this.cargarPermisosRecursivo(nodoActual[i].children, recorrido);
        }
    }

    onsubmitGuardarDatos(event) {
        event.preventDefault();
        this.cargarPermisos();
        this.setState({
            loading: true,
        });

        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?0:key.idgrupousuario;

        if (id == 1) {
            httpRequest('post', ws.wspermisionactivar, {
                permisos: JSON.stringify(this.state.arrayPermisos),
                id: id
            })
            .then(result => {
                if (result.response == 0) {
                    message.warning('No puede realizar la accion');
                    this.handleCerrarModal();

                } else if (result.response == 1) {
                    message.success('Exito en activar permisos...');
                    this.getPermisos();
                    this.handleCerrarModal();
                
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            })
            .catch(
                error => console.log(error)
            );

        }    
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            sw: 0,
            loading: false,
        });
    }

    confirmation() {
        if (this.state.sw == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Guardar Registro'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.onsubmitGuardarDatos.bind(this)}
                />
            );
        }
    }

    activarTodos(data) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            data[i].active = true;
            this.activarTodos(data[i].children);
        }
    }

    addAll() {
        this.activarTodos(this.state.FamiliaPermisos);
        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos
        });
    }
    removeAll() {
        this.quitarTodos(this.state.FamiliaPermisos);
        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos
        });
    }
    quitarTodos(data) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            data[i].active = false;
            this.quitarTodos(data[i].children);
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
            <div className="rows">
                {this.confirmation()}

                <div className={(this.state.message == 0)?'alert-message':'alert-message active'}>
                    {this.state.mensaje}
                </div>

                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Activar Permiso</h1>
                    </div>
                    
                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" 
                            style={{marginBottom: 20,  textAlign: 'center'}}>
                                <C_Button 
                                    title='Asignar Todos'
                                    type='primary'
                                    onClick={this.addAll.bind(this)}
                                />
                                <C_Button 
                                    title='Quitar Todos'
                                    type='primary'
                                    onClick={this.removeAll.bind(this)}
                                />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 border padding-0" style={{'fontFamily': 'Roboto'}}>
                    
                            <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-9 padding-0" style={{'height': '60px', 'fontWeight': 'bold'}}>
                            
                                <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 txts-center"
                                    style={{'borderRight': '1px solid #e8e8e8', 'borderBottom': '1px solid #e8e8e8', 'height': '100%'}}>
                                
                                    <label>Componente/Funcion</label>
                                </div>

                                <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" 
                                    style={{'borderRight': '1px solid #e8e8e8', 'height': '100%'}}>
                                    <label>Tipo</label>
                                </div>
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3 padding-0" style={{'height': '60px', 'fontWeight': 'bold'}}>
                            
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center" style={{'height': '50%'}}>
                                
                                    <label>Permisos/Privilegios</label>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{'borderTop': '1px solid #e8e8e8', 'height': '50%'}}>
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                        <label>Activo</label>
                                    </div>
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0 scrollbars" id={`styles-scrollbar${colors}`}>
                                {this.vistaPermiso()}
                            </div>
                            
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="txts-center">
                            <C_Button 
                                title='Guardar'
                                type='primary'
                                onClick={this.onsubmit.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}