
import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';
import Input from '../component/input';
import Select from '../component/select';
import TextArea from '../component/textarea';

export default class CrearUsuario extends Component{

    constructor() {
        super();

        this.state = {
            redirect: false,

            nro: 0,
            fecha: this.fechaActual(),
            nombre: '',
            apellido: '',
            sexo: 'M',
            email: '',
            telefono: '',
            notas: '',

            login: '',
            password: '',

            validacionNombre: 1,
            validacionApellido: 1,
            validacionLogin: 1,
            validacionPassword: 1,
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
        axios.get('/commerce/api/usuario/nuevo').then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    this.setState({
                        nro: response.data.data,
                    });
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onChangeNombre(event) {
        this.setState({
            nombre: event,
            validacionNombre: 1,
        });
    }
    onChangeApellido(event) {
        this.setState({
            apellido: event,
            validacionApellido: 1,
        });
    }
    onChangeGenero(event) {
        this.setState({
            sexo: event,
        });
    }
    onChangeEmail(event) {
        this.setState({
            email: event,
        });
    }
    onChangeTelefono(event) {
        this.setState({
            telefono: event,
        });
    }
    onChangeUsuario(event) {
        this.setState({
            login: event,
            validacionLogin: 1,
        });
    }
    onChangePassword(event) {
        this.setState({
            password: event,
            validacionPassword: 1,
        });
    }
    onChangeNotas(event) {
        this.setState({
            notas: event,
        });
    }

    onSubmit(event) {
        event.preventDefault();

        if ((this.state.nombre.toString().length > 0) && (this.state.apellido.toString().length > 0) && 
            (this.state.login.toString().length > 0) && (this.state.password.toString().length > 0)) {
            
            var formData = new FormData();
            
            formData.append('nombre', this.state.nombre);
            formData.append('apellido', this.state.apellido);
            formData.append('sexo', this.state.sexo);
            formData.append('email', this.state.email);
            formData.append('telefono', this.state.telefono);
            formData.append('login', this.state.login);
            formData.append('password', this.state.password);
            formData.append('notas', this.state.notas);

            axios.post('/commerce/api/usuario/post', formData).then(
                response => {
                    this.setState({
                        redirect: true,
                    });
                }
            ).catch(
                error => console.log(error)
            );
        } else {
            if (this.state.nombre.toString().length == 0) {
                this.setState({
                    validacionNombre: 0,
                });
            }
            if (this.state.apellido.toString().length == 0) {
                this.setState({
                    validacionApellido: 0,
                });
            }
            if (this.state.login.toString().length == 0) {
                this.setState({
                    validacionLogin: 0,
                });
            }
            if (this.state.password.toString().length == 0) {
                this.setState({
                    validacionPassword: 0,
                });
            }
        }
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/indexUsuario" />);
        }
        return (
            <div className="rows">
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Usuario</h1>
                    </div>
                    <div className="pulls-right">
                        <Link to="/commerce/admin/indexUsuario" className="btns btns-primary">
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
                    
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12">

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.nombre}
                                    title='Nombre*'
                                    onChange={this.onChangeNombre.bind(this)}
                                    validar={this.state.validacionNombre}
                                />
                            </div> 

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.apellido}
                                    title='Apellido*'
                                    onChange={this.onChangeApellido.bind(this)}
                                    validar={this.state.validacionApellido}
                                />
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">

                                <Select 
                                    value={this.state.sexo}
                                    title='Genero*'
                                    onChange={this.onChangeGenero.bind(this)}
                                    data={[
                                        {   value: 'M', title: 'Masculino'},
                                        {   value: 'F', title: 'Femenino'}
                                    ]}
                                />
                            </div> 

                            <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.email}
                                    title='Email*'
                                    onChange={this.onChangeEmail.bind(this)}
                                />
                            </div> 

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.telefono}
                                    title='Telefono*'
                                    onChange={this.onChangeTelefono.bind(this)}
                                />
                            </div> 

                            <div className="cols-lg-2 cols-md-2 cols-sm-2"></div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.login}
                                    title='Usuario*'
                                    onChange={this.onChangeUsuario.bind(this)}
                                    validar={this.state.validacionLogin}
                                />
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                            
                                <Input 
                                    value={this.state.password}
                                    title='Password*'
                                    onChange={this.onChangePassword.bind(this)}
                                    type='password'
                                    validar={this.state.validacionPassword}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12" style={{'padding': '0'}}>
                        
                            <div className="cards-img">
                            
                                <div className="imgs-cards"></div>
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