
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import Confirmation from '../../../components/confirmation';

import { message, Tooltip } from 'antd';
import "antd/dist/antd.css";
import { httpRequest, removeAllData, readData, saveData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import C_Input from '../../../components/data/input';
import C_TextArea from '../../../components/data/textarea';
import C_Button from '../../../components/data/button';
import C_CheckBox from '../../../components/data/checkbox';

export default class CrearGrupoUsuario extends Component{

    constructor() {
        super();

        this.state = {
            redirect: false,
            visible: false,
            loading: false,
            sw: 0,

            nombre: '',
            notas: '',

            usuarios: [],
            usuariosConGrupo: [],

            estado: [],
            bandera: [],

            validacionNombre: 1,
            noSesion: false
        }
    }

    componentDidMount() {
        httpRequest('get', '/commerce/api/grupousuario/nuevo')
        .then(result => {
                if (result.response == 0) {
                    console.log('error en la conexion');
                } else if (result.response == 1) {
                    this.setState({
                        usuarios: result.usuario,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onChangeNombre(event) {
        this.setState({
            nombre: event.toUpperCase(),
            validacionNombre: 1,
        });
    }
    onChangeNotas(event) {
        this.setState({
            notas: event,
        });
    }
    onChangeUsuarioSinGrupo(pos) {
        if (this.state.estado[pos] == 0) {
            this.state.estado[pos] = 1;
        }else {
            this.state.estado[pos] = 0;
        }
        this.setState({
            estado: this.state.estado,
        });
    }
    onchangeUsuarioConGrupo(pos) {
        if (this.state.bandera[pos] == 0) {
            this.state.bandera[pos] = 1;
        }else {
            this.state.bandera[pos] = 0;
        }
        this.setState({
            bandera: this.state.bandera,
        });
    }

    usuariosSinGrupos() {
        
        var array = [];

        this.state.usuarios.map(
            (response, key) => {
                if (typeof this.state.estado[key] == 'undefined') {
                    this.state.estado[key] = 0;
                }
                array.push(
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{'borderTop': '1px solid #e8e8e8'}} key={key}>

                        <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 border-right padding-0">
                            <label className="txts-sm">{response.login}</label>
                        </div>
                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6 border-right padding-0">
                            <label className="txts-sm">{response.nombre + ' ' + response.apellido}</label>
                        </div>
                        <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2 padding-0" style={{'position': 'relative'}}>
                            <C_CheckBox
                                onChange={this.onChangeUsuarioSinGrupo.bind(this, key)}
                                checked={(this.state.estado[key] == 0)?false:true}
                                style={{'position': 'absolute', 'left': '10px', 'top': '3px'}}
                            />
                        </div>
                    </div>
                );
                
            }
        );
        return array;
    }

    usuariosConGrupos() {
        var array = [];

        this.state.usuariosConGrupo.map(
            (response, key) => {
                
                array.push(
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{'borderTop': '1px solid #e8e8e8'}} key={key}>

                        <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 border-right padding-0">
                            <label className="txts-sm">{response.login}</label>
                        </div>
                        <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6 border-right padding-0">
                            <label className="txts-sm">{response.nombre + ' ' + response.apellido}</label>
                        </div>
                        <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2 padding-0" style={{'position': 'relative'}}>
                            <C_CheckBox
                                onChange={this.onchangeUsuarioConGrupo.bind(this, key)}
                                checked={(this.state.bandera[key] == 0)?false:true}
                                style={{'position': 'absolute', 'left': '10px', 'top': '3px'}}
                            />
                        </div>
                    </div>
                );
                
            }
        );
        return array;
    }

    agregarGrupo() {
        var pos = 0;
        
        while (pos < this.state.estado.length) {
            if (this.state.estado[pos] == 1) {
                this.state.usuariosConGrupo.push(this.state.usuarios[pos]);
                this.state.bandera.push(0);
                this.state.usuarios.splice(pos, 1);
                this.state.estado.splice(pos, 1);
            }else {
                pos++;
            }   
        }
        this.setState({
            usuariosConGrupo: this.state.usuariosConGrupo,
            usuarios: this.state.usuarios,
            bandera: this.state.bandera,
            estado: this.state.estado,
        });
    }
    quitarGrupo() {
        var pos = 0;
        
        while (pos < this.state.bandera.length) {
            if (this.state.bandera[pos] == 1) {
                this.state.usuarios.push(this.state.usuariosConGrupo[pos]);
                this.state.estado.push(0);
                this.state.usuariosConGrupo.splice(pos, 1);
                this.state.bandera.splice(pos, 1);
            }else {
                pos++;
            }   
        }
        this.setState({
            usuariosConGrupo: this.state.usuariosConGrupo,
            usuarios: this.state.usuarios,
            bandera: this.state.bandera,
            estado: this.state.estado,
        });
    }

    onSubmit(event) {
        event.preventDefault();

        if (this.state.nombre.toString().trim().length > 0) {
            this.setState({
                sw: 2,
                visible: true,
            });
        }else {
            this.setState({
                validacionNombre: 0,
                nombre: '',
            });
            message.error('No se permite campo vacio');
        }
    }

    onGuardarDatos(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        
        var user = JSON.parse(readData(keysStorage.user));
        var idusuario = (user == null)?'':user.idusuario;

        let body = {
            nombre: this.state.nombre,
            notas: this.state.notas,
            usuarios: JSON.stringify(this.state.usuariosConGrupo),
            idusuario: idusuario
        };
        httpRequest('post', '/commerce/api/grupousuario/post', body)
        .then(result => {
                if (result.response == 1) {
                    if (result.bandera == 1) {
                        saveData(keysStorage.user, JSON.stringify(result.user));
                    }
                    message.success('Exito en crear grupo de usuario...');
                    this.setState({
                        redirect: true,
                    });
                } else if (result.response == 0) {
                    this.setState({
                        validacionNombre: 0,
                    });
                    message.warning('No se permite campo repetido');
                    this.handleCerrarModal();
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onClickSalir() {
        this.setState({
            visible: true,
            sw: 1,
        });
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            sw: 0,
            loading: false,
        });
    }

    onCancelUsuario(e) {
        e.preventDefault();
        this.setState({
            loading: true,
        });

        setTimeout(() => {

            this.handleCerrarModal();
            this.setState({
                redirect: true,
            });

        }, 400);
    }

    componentConfirmation() {
        if (this.state.sw == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title = '¿Esta seguro de cancelar el registro del nuevo Grupo?'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.onCancelUsuario.bind(this)}
                    content = 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?'
                />
            );
        } else {
            if (this.state.sw == 2) {
                return (
                    <Confirmation
                        visible={this.state.visible}
                        title='Guardar Registro'
                        loading={this.state.loading}
                        onCancel={this.handleCerrarModal.bind(this)}
                        onClick={this.onGuardarDatos.bind(this)}
                    />
                );
            }
        }
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />);
        }
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/grupo-usuario/index" />);
        }
        return (
            <div className="rows">
                {this.componentConfirmation()}
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Grupo Usuario</h1>
                    </div>


                    <div className="forms-groups">
                        <div className="cols-lg-4 cols-md-4"></div>
                        <C_Input
                            value={this.state.nombre}
                            title='Nombre*'
                            onChange={this.onChangeNombre.bind(this)}
                            validar={this.state.validacionNombre}
                            className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-bottom'
                        />
                    </div>

                    <div className="forms-groups">
                        <C_TextArea 
                            value={this.state.notas}
                            title="Notas"
                            onChange={this.onChangeNotas.bind(this)}
                            className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom'
                        />
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12 mt-4 border padding-0">
                            
                                <div className="txts-center bd-bottom">
                                    <label className="lbl-txts">Usuarios sin grupo</label>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                                
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 border-right padding-0">
                                        <label className="txts-sm">Login</label>
                                    </div>
                                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6 border-right padding-0">
                                        <label className="txts-sm">Usuario</label>
                                    </div>
                                    <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2 padding-0">
                                        <label className="txts-sm">Marcar</label>
                                    </div>
                                </div>
                                
                                {this.usuariosSinGrupos()}

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 optionButton" 
                                    style={{'borderTop': '1px solid #e8e8e8'}}>
                                
                                    <button type="button" style={{'width': '100%'}}
                                        onClick={this.agregarGrupo.bind(this)}
                                        className="btns btns-primary"> 
                                            Agregar Usuario
                                    </button>
                                </div>
                            </div>

                            <div className="cols-lg-2 cols-md-2 cols-sm-2 mt-4 optionGroup">
                            
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                                    <Tooltip placement="right" title={<span>Agregar</span>}>
                                        <C_Button 
                                            title={'>'}
                                            type='primary'
                                            onClick={this.agregarGrupo.bind(this)}
                                        />
                                    </Tooltip>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                                    <Tooltip placement="right" title={<span>Quitar</span>}>
                                        <C_Button 
                                            title={'<'}
                                            type='primary'
                                            onClick={this.quitarGrupo.bind(this)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12 mt-4 border" style={{'padding': '0'}}>
                            
                                <div className="txts-center bd-bottom">
                                    <label className="lbl-txts">Usuarios que pertenecen al grupo</label>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                                
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 border-right padding-0">
                                        <label className="txts-sm">Login</label>
                                    </div>
                                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-6 border-right padding-0">
                                        <label className="txts-sm">Usuario</label>
                                    </div>
                                    <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-2 padding-0">
                                        <label className="txts-sm">Marcar</label>
                                    </div>
                                </div>
                                {this.usuariosConGrupos()}

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 optionButton" 
                                    style={{'borderTop': '1px solid #e8e8e8'}}>
                                
                                    <button type="button" style={{'width': '100%'}}
                                        onClick={this.quitarGrupo.bind(this)}
                                        className="btns btns-primary"> 
                                            Quitar Usuario
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="txts-center">

                            <C_Button 
                                title='Guardar'
                                type='primary'
                                onClick={this.onSubmit.bind(this)}
                            />
                            <C_Button 
                                title='Cancelar'
                                type='danger'
                                onClick={this.onClickSalir.bind(this)}
                            />
                            
                        </div>
                    </div>
                </div>
                    
            </div>
        );
    }
}