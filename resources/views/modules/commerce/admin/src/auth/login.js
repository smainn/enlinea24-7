
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {login} from './userFunction';

import ReCAPTCHA from "react-google-recaptcha";
import Captcha from '../../ConfigFabrica/keysCaptcha';

import {Link, Redirect} from 'react-router-dom';
import { httpRequest, saveData, saveMultiData, readData } from '../../tools/toolsStorage';
import keysStorage from '../../tools/keysStorage';
import ws from '../../tools/webservices';
import routes from '../../tools/routes';
import { message, Result, Icon } from 'antd';
import 'antd/dist/antd.css';
import C_Button from '../../components/data/button';

export default class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            empresa: '',
            usuario: '',
            password: '',
            captcha: true,
            label: {
                usuario: true,
                password: true,
                empresa: true,
            },
            validacion: {
                usuario: true,
                password: true,
                empresa: true
            },
            errors: {}
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.redirectPag = this.redirectPag.bind(this);
    }

    redirectPag() {
        setTimeout(() => {
            window.location = '/';
        }, 100);
    }

    onChangeUsuario(event) {
        this.state.validacion.usuario = true;
        this.setState({
            usuario: event.target.value,
            validacion: this.state.validacion,
        });
    }
    
    onChangePassword(event) {
        this.state.validacion.password = true;
        this.setState({
            password: event.target.value,
            validacion: this.state.validacion,
        });
    }

    onChangeEmpresa(event) {
        this.state.validacion.empresa = true;
        this.setState({
            empresa: event.target.value,
            validacion: this.state.validacion
        })
    }

    onSubmit(event) {
        event.preventDefault();

        if (this.state.captcha) {
            if ((this.state.usuario.toString().length > 0) && (this.state.password.toString().length > 0)) {
            
                httpRequest('post', ws.wslogin,{
                    login: this.state.usuario,
                    password: this.state.password,
                    empresa: this.state.empresa
                })
                .then((resp) => {
                    //console.log(resp);
                    if (resp.response == 1) {
                        let img = {
                            logo: resp.logo,
                            logonombre: resp.logonombre,
                            logoreporte: resp.logoreporte
                        };
                        let abog = resp.isabogado ? 'A' : 'V';
                        saveMultiData(
                            [
                                keysStorage.token, 
                                keysStorage.user,
                                keysStorage.permisions,
                                keysStorage.LinkMenu,
                                keysStorage.colors,
                                keysStorage.createvendedor,
                                keysStorage.createcliente,
                                keysStorage.connection,
                                keysStorage.img,
                                keysStorage.isabogado
                            ], 
                            [
                                resp.token, 
                                JSON.stringify(resp.user),
                                btoa(JSON.stringify(resp.permisions)),
                                null,
                                resp.colors,
                                'N',
                                'N',
                                resp.connection,
                                JSON.stringify(img),
                                abog
                            ]
                        );
                        //message.success('Contraseña correcta');
                        setTimeout(() => {
                            this.props.history.push(routes.home);
                            console.log('HISTORY ', this.props.history);
                        }, 100);
                    
                    } else if(resp.response === -4){
                        //console.log('EL NO ESTA AUTENTICADO');
                    } else if(resp.response == 0){
                        message.warning('Error, Contraseña o usuario incorrecto');
                    } else {
                        message.error('Error, Ocurrio un problema al procesar la solicitud');
                    }
                    
                })
                .catch((error) => {
                    console.log(error);
                })
            } else {
                if (this.state.usuario.toString().length == 0) {
                    this.state.validacion.usuario = false;
                }
                if (this.state.password.toString().length == 0) {
                    this.state.validacion.password = false;
                }
                message.error('Por favor complete los campos requeridos');
                this.setState({
                    validacion: this.state.validacion,
                });
            }
            
        } else {
            message.error('Debe hacer el captcha');
        }
        
    }

    onFocus(bandera) {
        if (bandera == 1) {
            this.state.label.usuario = false;
        }
        if (bandera == 2) {
            this.state.label.password = false;
        }
        if (bandera == 3) {
            this.state.label.empresa = false;
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
        if (bandera == 3) {
            if (this.state.empresa.toString().length == 0) {
                this.state.label.empresa = true;
            } 
        }
        this.setState({
            label: this.state.label,
        });
    }

    className(bandera) {
        let colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (bandera == 1) {
            if (this.state.validacion.usuario) {
                return `forms-control ${colors}`;
            }
            return 'forms-control error';
        }
        if (bandera == 2) {
            if (this.state.validacion.password) {
                return `forms-control ${colors}`;
            }
            return 'forms-control error';
        }
        if (bandera == 3) {
            if (this.state.validacion.empresa) {
                return `forms-control ${colors}`;
            }
            return 'forms-control error';
        }
    }

    classNameLabel(bandera) {
        let colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (bandera == 1) {
            if (this.state.validacion.usuario) {
                if (this.state.label.usuario) {
                    return 'lbls-formulario';
                }
                return `lbls-formulario ${colors} active`;
            }
            if (this.state.label.usuario) {
                return 'lbls-formulario error';
            }
            return 'lbls-formulario error active';
        }

        if (bandera == 2) {
            if (this.state.validacion.password) {
                if (this.state.label.password) {
                    return 'lbls-formulario';
                }
                return `lbls-formulario ${colors} active`;
            }
            if (this.state.label.password) {
                return 'lbls-formulario error';
            }
            return 'lbls-formulario error active';
        }

        if (bandera == 3) {
            if (this.state.validacion.empresa) {
                if (this.state.label.empresa) {
                    return 'lbls-formulario';
                }
                return `lbls-formulario ${colors} active`;
            }
            if (this.state.label.empresa) {
                return 'lbls-formulario error';
            }
            return 'lbls-formulario error active';
        }
    }

    
    onChange1(value) {
        this.setState({
            captcha : true
        })
    }

    componentTitle() {
        
        let img = readData(keysStorage.img);
        if ((img != null) && (typeof img != 'undefined')) {
            img = JSON.parse(img);
            return (
                <img 
                    src={img == null ? '' : img.logonombre} 
                    alt='none'
                    style={{ width: '70%', cursor: 'pointer' }}
                    onClick={this.redirectPag}
                />
            );
        }
        return (
            <img 
                src='/img/enlinea/nombre.png' 
                alt='none'
                style={{ width: '70%', cursor: 'pointer' }}
                onClick={this.redirectPag}
            />
        );
    }
    
    render(){
        if (readData(keysStorage.token) != null) {//ver depues como hacer otra manera
            return (
                <Redirect to={routes.home} />
            );
        }

        const componentTitle = this.componentTitle();
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        return (
            <div className="contenedor-formulario">
                <div className="wrap-formulario">
                    <div className="frms-groups txts-center" style={{'marginTop': '-10px'}}>
                        { componentTitle }
                    </div>
                    <form onSubmit={this.onSubmit} className="formulario">
                        <div className="forms-groups mgbn-sm">
                            <div className="inputs-groups">
                                <input type="text" 
                                    id="empresa" 
                                    className={this.className(3)}
                                    value={this.state.empresa}
                                    onChange={this.onChangeEmpresa.bind(this)} 
                                    onFocus={this.onFocus.bind(this, 3)}
                                    onBlur={this.onBlur.bind(this, 3)}
                                    style={{'paddingLeft': '30px', 
                                        'height': '45px', 'paddingTop': 3,
                                        fontSize: '18px'
                                    }}
                                />
                                <label htmlFor="empresa" 
                                    className={this.classNameLabel(3)}>
                                    Empresa
                                </label>
                                <img className="img-formulario" src="/images/usuario.png" />
                            </div>
                        </div>
                        <div className="forms-groups mgbn-sm">
                            <div className="inputs-groups">
                                <input type="text" 
                                    id="usersname" 
                                    className={this.className(1)}
                                    value={this.state.usuario}
                                    onChange={this.onChangeUsuario.bind(this)} 
                                    onFocus={this.onFocus.bind(this, 1)}
                                    onBlur={this.onBlur.bind(this, 1)}
                                    style={{'paddingLeft': '30px', 
                                        'height': '45px', 'paddingTop': 3,
                                        fontSize: '18px'
                                    }}
                                />
                                <label htmlFor="usersname" 
                                    className={this.classNameLabel(1)}>
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
                                    style={{'paddingLeft': '30px', 
                                        'height': '45px', 'paddingTop': 3,
                                        fontSize: '18px'
                                    }}
                                    className={this.className(2)} 
                                />
                                <label htmlFor="password" 
                                    className={this.classNameLabel(2)}>
                                    Password
                                </label>
                                <img className="img-formulario" src="/images/candado.png" />
                            </div>
                        </div>

                        <ReCAPTCHA
                            sitekey={Captcha.site_key}
                            onChange={this.onChange1.bind(this)}
                            size={window.innerWidth < 500 ? 'compact' : 'normal'} 
                            style={{'width': '100%', 'minWidth': '100%'}}
                        />

                        <div className="forms-groups">
                            <div className="inputs-groups">
                                <button 
                                    style={{'fontWeight': 'bold'}}
                                    type="submit" 
                                    className={`btns btns-primary ${colors} btns-block`}>
                                    Iniciar Sesion
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
        );
    }
}



