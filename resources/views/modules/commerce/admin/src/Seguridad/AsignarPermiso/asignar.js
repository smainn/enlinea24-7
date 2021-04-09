
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../../components/input';
import SelectPaginate from '../../../components/selectPaginate';
import Confirmation from '../../../components/confirmation';

import { message, Tooltip, Icon } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import C_Button from '../../../components/data/button';
import C_CheckBox from '../../../components/data/checkbox';

export default class AsignarPrivilegio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            nombre: '',
            bandera: 0,

            validarGrupo: 1,

            gruposUsuarios: [],
            data: [],

            FamiliaPermisos: [],
            arrayPermisos: [],

            arrayCheckedPermisos: [],

            permisos: [],

            vistaPermiso: [],

            detalleGrupo: 0,
            estadoPrivilegio: 0,

            message: 0,
            mensaje: '',

            sw: 0,
            visible: false,
            loading: false,
            noSesion: false,

            pordefecto: {
                visible: true,
                editable: true,
                novisible: false,
            },
        }

    }

    componentDidMount() {
        this.getGrupoUsuario(1, '', 5);
        this.getPermisos();
    }
    
    getPermisos() {
        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?0:key.idgrupousuario;

        if (id == 1 || id == 2) {

            httpRequest('get', '/commerce/api/permiso/show/' + id)
            .then(result => {
                if (result.response == 0) {
                    console.log('error en la conexion');
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

                                visible: false,
                                editable: false,
                                noVisible: false,

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
                    console.log(array_aux)
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
                    visible: false,
                    editable: false,
                    noVisible: false,

                    validacion: false,
                    icon: false,
                    treenode: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }

    getGrupoUsuario(page, buscar, nroPaginacion) {

        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?'':key.idgrupousuario;
        
        httpRequest('get', '/commerce/api/permiso/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion + '&id=' + id)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                result.data.data.map(
                    response => {
                        var objeto = {
                            value: response.idgrupousuario,
                            title: response.nombre,
                        }
                        this.state.data.push(objeto);
                    }
                );
                this.setState({
                    data: this.state.data,
                });
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

    onChangeGrupo(event) {
        this.setState({
            nombre: event.title,
            id: event.value,
            validarGrupo: 1,
        });
        this.getPermisosDelGrupo(event.value);
    }
    getPermisosDelGrupo(idGrupoUsuario) {

        let key = JSON.parse(readData(keysStorage.user));
        var id = (typeof key == 'undefined' || key == null)?0:key.idgrupousuario;
        var formData = {
            id: idGrupoUsuario,
            idgrupo: id,
        }

        if (id == 1 || id == 2) {

            httpRequest('post', '/commerce/api/getPermisos', formData)
            .then(result => {
                if (result.response == 0) {
                } else if (result.response == 1) {
                    if (result.data.length > 0) {

                        this.setState({
                            detalleGrupo: 1,
                            estadoPrivilegio: 1,
                            bandera: 1,
                            permisos: result.data
                        });
    
                        var array = result.data;
                        var array_aux = [];
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].idcomponentepadre == null) {
                                var objeto = {
                                    title: array[i].descripcion,
                                    value: array[i].idcomponente,
                                    tipo: array[i].tipo,
                                    asignacion: array[i].idasignacionprivilegio,
    
                                    visible: (array[i].visible == 'A')?true:false,
                                    editable: (array[i].editable == 'A')?true:false,
                                    noVisible: (array[i].novisible == 'A')?true:false,
    
                                    validacion: false,
                                    icon: false,
                                    treenode: false,
                                };
                                array_aux.push(objeto);
                            }
                        }
                        this.arbolPermisosDelGrupo(array_aux);
                        this.setState({
                            FamiliaPermisos: array_aux,
                        });

                    }else {
                        this.getPermisos();
                        this.setState({
                            detalleGrupo: 1,
                            estadoPrivilegio: 1,
                            bandera: 0,
                        });
                    }
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

    arbolPermisosDelGrupo(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosPermisosDelGrupo(data[i].value);
            data[i].children = hijos;
            this.arbolPermisosDelGrupo(hijos);
        }
    }
    hijosPermisosDelGrupo(idpadre) {
        var array =  this.state.permisos;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idcomponentepadre === idpadre){
                var objeto = {
                    title: array[i].descripcion,
                    value: array[i].idcomponente,
                    tipo: array[i].tipo,
                    asignacion: array[i].idasignacionprivilegio,
    
                    visible: (array[i].visible == 'A')?true:false,
                    editable: (array[i].editable == 'A')?true:false,
                    noVisible: (array[i].novisible == 'A')?true:false,

                    validacion: false,
                    icon: false,
                    treenode: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }

    cargarPorDefectoVisible(data, bandera) { 
        if (bandera == 1) {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].visible = false;
                data[i].editable = false;
                this.cargarPorDefectoVisible(data[i].children, bandera);
            }
        }else {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].visible = true;
                data[i].noVisible = false;
                this.cargarPorDefectoVisible(data[i].children, bandera);
            }
        }
    }

    onChangeCheckedVisible(event) {
        if (this.state.estadoPrivilegio > 0) {
            if (event.visible) {
                event.visible = false;
                event.editable = false;
                this.cargarPorDefectoVisible(event.children, 1);
            }else {
                event.visible = true;
                event.noVisible = false;
                this.cargarPorDefectoVisible(event.children, 2);
            }
            this.setState({
                FamiliaPermisos: this.state.FamiliaPermisos,
            });
        }else {
            if (this.state.message == 0) {
                this.setState({
                    message: 1,
                    mensaje: 'Favor de seleccionar Grupo',
                });
                setTimeout(
                    () => {
                        this.setState({
                            message: 0,
                            mensaje: '',
                        });
                    }, 5000
                );
            }
            
        }
    }

    cargarPorDefectoEditable(data, bandera) { 
        if (bandera == 1) {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].editable = false;
                this.cargarPorDefectoEditable(data[i].children, bandera);
            }
        }else {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].editable = true;
                this.cargarPorDefectoEditable(data[i].children, bandera);
            }
        }
    }

    onChangeCheckedEditable(event) {
        if (this.state.estadoPrivilegio > 0) {
            if (event.visible) {
                if (event.editable) {
                    event.editable = false;
                    this.cargarPorDefectoEditable(event.children, 1);
                }else {
                    event.editable = true;
                    this.cargarPorDefectoEditable(event.children, 2);
                }
                this.setState({
                    FamiliaPermisos: this.state.FamiliaPermisos,
                });
            }else {
                if (this.state.message == 0) {
                    this.setState({
                        message: 1,
                        mensaje: 'Favor de habilitar visible',
                    });
                    setTimeout(
                        () => {
                            this.setState({
                                message: 0,
                                mensaje: '',
                            });
                        }, 5000
                    );
                }
            }
        }else {
            if (this.state.message == 0) {
                this.setState({
                    message: 1,
                    mensaje: 'Favor de seleccionar Grupo',
                });
                setTimeout(
                    () => {
                        this.setState({
                            message: 0,
                            mensaje: '',
                        });
                    }, 5000
                );
            }
        }
    }

    cargarPorDefectoNoVisible(data, bandera) { 
        if (bandera == 1) {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].noVisible = false;
                this.cargarPorDefectoNoVisible(data[i].children, bandera);
            }
        }else {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                data[i].visible = false;
                data[i].editable = false;
                data[i].noVisible = true;
                this.cargarPorDefectoNoVisible(data[i].children, bandera);
            }
        }
    }

    onChangeCheckedNoVisible(event) {
        if (this.state.estadoPrivilegio > 0) {
            if (event.noVisible) {
                event.noVisible = false;
                this.cargarPorDefectoNoVisible(event.children, 1);
            }else {
                event.noVisible = true;
                event.editable = false;
                event.visible = false;
                this.cargarPorDefectoNoVisible(event.children, 2);
            }
            this.setState({
                FamiliaPermisos: this.state.FamiliaPermisos,
            });
        }else {
            if (this.state.message == 0) {
                this.setState({
                    message: 1,
                    mensaje: 'Favor de seleccionar Grupo',
                });
                setTimeout(
                    () => {
                        this.setState({
                            message: 0,
                            mensaje: '',
                        });
                    }, 5000
                );
            }
        }
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
                    
                    <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 padding-0" style={{'height': '100%'}}>
                    
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

                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 padding-0" style={{'borderTop': '1px solid #e8e8e8', 'height': '100%'}}>
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                        
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" 
                                style={{'borderRight': '1px solid #e8e8e8'}}>
                                <C_CheckBox 
                                    tooltip={nodoActual[i].title} placement='left'
                                    onChange={this.onChangeCheckedVisible.bind(this, nodoActual[i])}
                                    checked={nodoActual[i].visible}
                                />
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                <C_CheckBox 
                                    tooltip={nodoActual[i].title} placement='left'
                                    onChange={this.onChangeCheckedEditable.bind(this, nodoActual[i])}
                                    checked={nodoActual[i].editable}
                                />

                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                
                                <C_CheckBox 
                                    tooltip={nodoActual[i].title} placement='left'
                                    onChange={this.onChangeCheckedNoVisible.bind(this, nodoActual[i])}
                                    checked={nodoActual[i].noVisible}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            );
            this.recorridoEnPreOrden(nodoActual[i].children, recorrido, contador + 1);
        }
    }

    generarPorDefecto() {}

    onclickCargarPorDefecto() {
        
        this.cargarPorDefecto(this.state.FamiliaPermisos);

        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos,
            estadoPrivilegio: 1,
            //visible: true,
            //sw: 2,
        });
    }
    cargarPorDefecto(nodoActual) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {
            this.cargarPorDefecto(nodoActual[i].children);
            nodoActual[i].visible = true;
            nodoActual[i].editable = true;
            nodoActual[i].noVisible = false;
        }
    }

    removeAll() {
        this.quitarTodos(this.state.FamiliaPermisos);
        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos,
            estadoPrivilegio: 1,
        });
    }
    quitarTodos(data) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            data[i].visible = false;
            data[i].editable = false;
            data[i].noVisible = false;
            this.quitarTodos(data[i].children);
        }
    }

    onDeleteGrupo() {
        this.cargarInicio(this.state.FamiliaPermisos);
        this.setState({
            nombre: '',
            id: '',
            detalleGrupo: 0,
            estadoPrivilegio: 0,
            FamiliaPermisos: this.state.FamiliaPermisos,
        });
    }
    cargarInicio(nodoActual) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {
            this.cargarInicio(nodoActual[i].children);
            nodoActual[i].visible = false;
            nodoActual[i].editable = false;
            nodoActual[i].noVisible = false;
        }
    }
    onsubmit(event) {
        event.preventDefault();
        if (this.state.id.toString().length > 0) {
            if (this.validar()) {
                this.setState({
                    sw: 1,
                    visible: true,
                });
            }else {
                if (this.state.message == 0) {
                    this.setState({
                        message: 1,
                        mensaje: 'Favor de llenar Campo',
                    });
                    setTimeout(
                        () => {
                            this.setState({
                                message: 0,
                                mensaje: '',
                            });
                        }, 5000
                    );
                }
            }
        }else {
            if (this.state.message == 0) {
                this.setState({
                    message: 1,
                    mensaje: 'Favor de seleccionar Grupo',
                    validarGrupo: 0,
                });
                setTimeout(
                    () => {
                        this.setState({
                            message: 0,
                            mensaje: '',
                        });
                    }, 5000
                );
            }
        }
        
    }

    onsubmitGuardarDatos(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        let body = {
            permisos: JSON.stringify(this.state.arrayPermisos),
            idGrupo: this.state.id,
            bandera: this.state.bandera
        };
        httpRequest('post', '/commerce/api/postPermisos', body)
        .then(result => {
            console.log('RESULT ', result);
            this.handleCerrarModal();
            if (result.response == 0) {
                console.log(result.message);
            } else if (result.response == 1) {
                message.success('Exito en asignar permisos...');
                this.onDeleteGrupo();
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch(error => {
            this.handleCerrarModal();
            console.log(error);
        });
    }

    validar() {
        var array = [];
        var recorrido = [];
        this.validarRecursivo(this.state.FamiliaPermisos, array, recorrido);
        if (array.length > 0) {
            return false;
        }
        this.state.arrayPermisos = recorrido;
        this.setState({
            arrayPermisos: this.state.arrayPermisos,
            FamiliaPermisos: this.state.FamiliaPermisos,
        });
        return true;
    }
    validarRecursivo(nodoActual, array, recorrido) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {
            if ((!nodoActual[i].visible) && (!nodoActual[i].editable) && (!nodoActual[i].noVisible)) {
                array.push(1);
                nodoActual[i].validacion = true;
            }
            recorrido.push(nodoActual[i]);
            this.validarRecursivo(nodoActual[i].children, array, recorrido);
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
        if (this.state.sw == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Cargar Por Defecto'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    content = {[
                        <div key={0} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0"
                            style={{'marginBottom': '10px'}}
                        >
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <th style={{'textAlign': 'center'}}>
                                            Visible
                                        </th>
                                        <th style={{'textAlign': 'center'}}>
                                            Editable
                                        </th>
                                        <th style={{'textAlign': 'center'}}>
                                            No Visible
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{'textAlign': 'center'}}>
                                            <label className="checkboxContainer">
                                                <input type="checkbox"
                                                    checked={this.state.pordefecto.visible}
                                                    onChange={this.onChangePorDefectoVisible.bind(this)}
                                                />
                                                <span className="checkmark">  </span>
                                            </label>
                                        </td>
                                        <td style={{'textAlign': 'center'}}>
                                            <label className="checkboxContainer">
                                                <input type="checkbox"
                                                    checked={this.state.pordefecto.editable}
                                                    onChange={this.onChangePorDefectoEditable.bind(this)}
                                                />
                                                <span className="checkmark">  </span>
                                            </label>
                                        </td>
                                        <td style={{'textAlign': 'center'}}>
                                            <label className="checkboxContainer">
                                                <input type="checkbox"
                                                    checked={this.state.pordefecto.novisible}
                                                    onChange={this.onChangePorDefectoNoVisible.bind(this)}
                                                />
                                                <span className="checkmark">  </span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ]}
                    onClick={this.generarPorDefecto.bind(this)}
                />
            );
        }
    }
    onChangePorDefectoVisible() {
        this.state.pordefecto.visible = !this.state.pordefecto.visible;
        if (this.state.pordefecto.visible) {
            this.state.pordefecto.novisible = false;
        }
        this.setState({
            pordefecto: this.state.pordefecto,
        });
    }
    onChangePorDefectoEditable() {
        if (this.state.pordefecto.visible) {
            this.state.pordefecto.editable = !this.state.pordefecto.editable;
            this.setState({
                pordefecto: this.state.pordefecto,
            });
        }else {
            message.warning('Favor de activar visible');
        }
    }
    onChangePorDefectoNoVisible() {
        this.state.pordefecto.novisible = !this.state.pordefecto.novisible;

        if (this.state.pordefecto.novisible) {
            this.state.pordefecto.visible = false;
            this.state.pordefecto.editable = false;
        }
        this.setState({
            pordefecto: this.state.pordefecto,
        });
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
                        <h1 className="lbls-title">Asignar Privilegios</h1>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-4 cols-md-4 cols-sm-4"></div>
                            <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                                <Input
                                    title='Id Grupo'
                                    value={this.state.id}
                                    validar={this.state.validarGrupo}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <SelectPaginate 
                                    title="Grupo"
                                    data={this.state.data}
                                    value={this.state.nombre}
                                    onChange={this.onChangeGrupo.bind(this)}
                                    onDelete={this.onDeleteGrupo.bind(this)}
                                    validar={this.state.validarGrupo}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={(this.state.detalleGrupo == 0)?'efecto-grupo-privilegio':'efecto-grupo-privilegio active'}>
                    
                        <div className="forms-groups">
                        
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            
                                <div className="txts-center">
                                    <C_Button 
                                        title='Cargar por Defecto'
                                        type='primary'
                                        onClick={this.onclickCargarPorDefecto.bind(this)}
                                    />
                                    <C_Button 
                                        title='Quitar Todos'
                                        type='primary'
                                        onClick={this.removeAll.bind(this)}
                                    />
                                    <C_Button 
                                        title='Importar de Otro Grupo'
                                        type='primary'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 border padding-0" style={{'fontFamily': 'Roboto'}}>
                    
                            <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 padding-0" style={{'height': '60px', 'fontWeight': 'bold'}}>
                            
                                <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 txts-center"
                                    style={{'borderRight': '1px solid #e8e8e8', 'borderBottom': '1px solid #e8e8e8', 'height': '100%'}}>
                                
                                    <label>Componente/Funcion</label>
                                </div>

                                <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" 
                                    style={{'borderRight': '1px solid #e8e8e8', 'height': '100%'}}>
                                    <label>Tipo</label>
                                </div>
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 padding-0" style={{'height': '60px', 'fontWeight': 'bold'}}>
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center" style={{'height': '50%'}}>
                                
                                    <label>Permisos/Privilegios</label>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{'borderTop': '1px solid #e8e8e8', 'height': '50%'}}>
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                        <label>Visible</label>
                                    </div>
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                        <label>Editable</label>
                                    </div>
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center">
                                        <label>No visible</label>
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
                            <C_Button
                                title='Cancelar'
                                type='danger'
                            />
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}