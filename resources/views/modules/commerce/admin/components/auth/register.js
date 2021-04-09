
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {login} from './userFunction';

export default class Register extends Component{

    constructor() {
        super();
        this.state = {
            usuario: '',
            password: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
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

    render(){
        return (
            <div className="container">

                <div className="row">
                
                    <div className="col-md-6 mt-5 mx-auto">
                    
                        <form noValidate onSubmit={this.onSubmit}>
                        
                            <h1 className="h3 mb-3 font-weight-normal">
                                Please sign in
                            </h1>

                            <div className="form-group">
                            
                                <label htmlFor="usuario"> Usuario Adress</label>
                                <input type="text" 
                                    className="form-control"
                                    name="usuario"
                                    placeholder="Ingresar Usuario"
                                    value={this.state.usuario}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group">
                            
                                <label htmlFor="password"> Password</label>
                                <input type="password" 
                                    className="form-control"
                                    name="password"
                                    placeholder="Ingresar password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}



