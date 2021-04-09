
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {login} from './userFunction';

import {Link} from 'react-router-dom';

export default class Login extends Component{

    constructor() {
        super();
        this.state = {
            usuario: '',
            password: '',
            label: {
                usuario: true,
                password: true,
            },
            errors: {}
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsuario(event) {
        this.setState({
            usuario: event.target.value,
        });
    }
    onChangePassword(event) {
        this.setState({
            password: event.target.value,
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const user = {
            usuario: this.state.usuario,
            password: this.state.password,
        }

        console.log(user);
        
    }

    onFocus(bandera) {
        if (bandera == 1) {
            this.state.label.usuario = false;
        }
        if (bandera == 2) {
            this.state.label.password = false;
        }
        this.setState({
            label: this.state.label,
        });
    }
    onBlur(bandera) {
        if (bandera == 1) {
            if (this.state.usuario.toString().length == 0) {
                this.state.label.usuario = true;
            } 
        }
        if (bandera == 2) {
            if (this.state.password.toString().length == 0) {
                this.state.label.password = true;
            } 
        }
        this.setState({
            label: this.state.label,
        });
    }

    render(){
        return (
            <div className="contenedor-formulario">
            
                <div className="wrap-formulario">

                    <div className="frms-groups txts-center" style={{'marginTop': '-10px'}}>
                    
                        <Link to="/commerce/admin" style={{'cursor': 'pointer'}} className="title-txt">
                            ERP
                        </Link>
                    </div>
                    
                    <form onSubmit={this.onSubmit} className="formulario">
                        <div className="forms-groups mgbn-sm">
                            
                            <div className="inputs-groups">
                            
                                <input type="text" 
                                    id="usersname" 
                                    className="forms-control"
                                    value={this.state.usuario}
                                    onChange={this.onChangeUsuario.bind(this)} 
                                    onFocus={this.onFocus.bind(this, 1)}
                                    onBlur={this.onBlur.bind(this, 1)}
                                    style={{'paddingLeft': '25px'}}
                                />
                                <label htmlFor="usersname" 
                                    className={(this.state.label.usuario)?'lbls-formulario':'lbls-formulario active'}>
                                    Usuario
                                </label>
                                <img className="img-formulario" src="/images/usuario.png" />
                            </div>
                        </div>

                        <div className="forms-groups mgbn-sm">
                            <div className="inputs-groups">
                                
                                <input type="password" 
                                    id="password" 
                                    value={this.state.password}
                                    onChange={this.onChangePassword.bind(this)}
                                    onFocus={this.onFocus.bind(this, 2)}
                                    onBlur={this.onBlur.bind(this, 2)}
                                    style={{'paddingLeft': '25px'}}
                                    className="forms-control" 
                                />
                                <label htmlFor="password" 
                                    className={(this.state.label.password)?'lbls-formulario':'lbls-formulario active'}>
                                    Password
                                </label>
                                <img className="img-formulario" src="/images/candado.png" />
                            </div>
                        </div>

                        <div className="forms-groups">
                        
                            <div className="inputs-groups">
                            
                                <button type="submit" className="btns btns-primary btns-block">
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}



