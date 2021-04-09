
import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';
import Input from '../component/input';

import TextArea from '../component/textarea';

export default class CrearGrupoUsuario extends Component{

    constructor() {
        super();

        this.state = {
            redirect: false,

            nro: 0,
            fecha: this.fechaActual(),
            nombre: '',
            notas: '',

            usuarios: [],
            usuariosConGrupo: [],

            estado: [],
            bandera: [],

            validacionNombre: 1,
        }
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();
        dia = this.addZero(dia);
        mes = this.addZero(mes);
        var fechaFormato = dia + '/' + mes + '/' + year;

        return fechaFormato;   
    }

    componentDidMount() {
        axios.get('/commerce/api/grupousuario/nuevo').then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    console.log(response.data.usuario)
                    this.setState({
                        nro: response.data.data,
                        usuarios: response.data.usuario,
                    });
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
                            <label className="txts-xs">
                                <input type="checkbox" 
                                    checked={(this.state.estado[key] == 0)?false:true}
                                    onChange={this.onChangeUsuarioSinGrupo.bind(this, key)} 
                                    className="checkboxs" />
                            </label>
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
                            <label className="txts-xs">
                                <input type="checkbox" 
                                    onChange={this.onchangeUsuarioConGrupo.bind(this, key)}
                                    checked={(this.state.bandera[key] == 0)?false:true}
                                    className="checkboxs" />
                            </label>
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

        if (this.state.nombre.toString().length > 0) {
            var formData = new FormData();
            formData.append('nombre', this.state.nombre);
            formData.append('notas', this.state.notas);
            formData.append('usuarios', JSON.stringify(this.state.usuariosConGrupo));

            axios.post('/commerce/api/grupousuario/post', formData).then(
                response => {
                    console.log(response.data.data)
                    this.setState({
                        redirect: true,
                    });
                }
            ).catch(
                error => console.log(error)
            );
        }else {
            this.setState({
                validacionNombre: 0,
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/indexGrupo" />);
        }
        return (
            <div className="rows">
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Grupo Usuario</h1>
                    </div>
                    <div className="pulls-right">
                        <Link to="/commerce/admin/indexGrupo" className="btns btns-primary">
                            Atras
                        </Link>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="pulls-left">
                            <Input 
                                value={this.state.nro}
                                title='Nro'
                                style={{'width': '50px'}}
                            />
                        </div>

                        <div className="pulls-right">
                        
                            <Input 
                                value={this.state.fecha}
                                title='Fecha'
                                style={{'width': '120px'}}
                            />
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <div className="cols-lg-4 cols-md-4 cols-sm-4"></div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12">             
                                <Input 
                                    value={this.state.nombre}
                                    title='Nombre*'
                                    onChange={this.onChangeNombre.bind(this)}
                                    validar={this.state.validacionNombre}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <TextArea 
                                value={this.state.notas}
                                title="Notas"
                                onChange={this.onChangeNotas.bind(this)}
                            />
                        </div>
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
                                
                                    <button type="button" aria-label="Agregar"
                                        onClick={this.agregarGrupo.bind(this)} 
                                        className="btns btns-primary tooltips"> 
                                            {'>'}
                                    </button>
                                    
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                                
                                    <button type="button" aria-label="Quitar"
                                        onClick={this.quitarGrupo.bind(this)}
                                        className="btns btns-primary tooltips"> 
                                             {'<'}
                                    </button>
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
                        
                            <button type="button" 
                                onClick={this.onSubmit.bind(this)}
                                className="btns btns-primary">
                                    Guardar
                            </button>

                            <button type="buton" className="btns btns-danger">Cancelar</button>
                            
                        </div>
                    </div>
                </div>
                    
            </div>
        );
    }
}