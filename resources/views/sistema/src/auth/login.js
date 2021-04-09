
import React, { Component } from 'react';

import ReCAPTCHA from "react-google-recaptcha";
//import Captcha from '../../ConfigFabrica/keysCaptcha';

import {Link, Redirect} from 'react-router-dom';
import { httpRequest, saveData, saveMultiData, readData } from '../utils/toolsStorage';
import keysStorage from '../utils/keysStorage';
import ws from '../utils/webservices';
import strings from '../utils/strings';
import routes from '../utils/routes';
import { message, Alert, Spin, Icon, Menu, Table, Input, Select, Tree } from 'antd';
import 'antd/dist/antd.css';
import Confirmation from '../componentes/confirmation';

const Captcha = ws.Captcha; 
export default class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            empresa: '',
            usuario: '',
            password: '',
            captcha: false,
            loading: false,
            label: {
                usuario: true,
                password: true,
                empresa: true,
            },
            validacion: {
                usuario: true,
                password: true,
                empresa: true,
                captcha: true
            },

            showpassword: false,

            errors: {},
            messageError: '',
            error: false,
            nroIntentos: 0,
            isWait: false
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() { //login_sesion
        var img_login = document.getElementById('img_login');
        // img_login.onerror = (event) => {
        //     event.target.src = '/img/enlinea/nombre.png';
        // };
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

    wait(segundos) {
        let waitMoment = setInterval(() => {
            segundos--;
            if (segundos === 0) {
                clearInterval(waitMoment);
                this.setState({
                    isWait: false,
                    error: false,
                    nroIntentos: 0
                })
            } else {
                this.setState({
                    error: true,
                    messageError: `Debe esperar ${segundos} segundos para volver a intentarlo.`
                });
            }
            
        }, 1000);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.isWait) return;
        
        if ((this.state.usuario.toString().length > 0) && (this.state.password.toString().length > 0) &&
            (this.state.empresa.toString().length > 0) && this.state.captcha) {
            this.setState({
                loading: true
            })
            httpRequest('post', ws.wslogin,{
                login: this.state.usuario,
                password: this.state.password,
                empresa: this.state.empresa
            })
            .then((resp) => {
                console.log('RESP ', resp);
                this.setState({
                    loading: false
                })
                if (resp.response == 1) {
                    let img = {
                        logo: resp.logo,
                        logonombre: resp.logonombre,
                        logoreporte: resp.logoreporte
                    };
                    let abog = (resp.isabogado) ? 'A' : 'V';
                    
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
                            keysStorage.isabogado,
                            keysStorage.on_data,
                        ], 
                        [
                            resp.token, 
                            JSON.stringify(resp.user),
                            JSON.stringify(resp.permisions),
                            null,
                            resp.colors,
                            'N',
                            'N',
                            resp.connection,
                            JSON.stringify(img),
                            abog,
                            JSON.stringify( {on_create: null, data_actual: null, new_data: null} ),
                        ]
                    );
                    //message.success('Contraseña correcta');
                    setTimeout(() => {
                        this.props.history.push(routes.home);
                    }, 100);
                
                } else if (resp.response === -4) {
                    this.setState({
                        isWait: true
                    })
                    this.wait(resp.segundos);
                } else if (resp.response == 0) {
                    message.warning('Error, Contraseña o usuario incorrecto');
                } else {
                    message.error(strings.message_error);
                }
                
            })
            .catch((error) => {
                console.log(error);
                message.error('Ocurrio un problema con la conexion, porfavor revise su conexion a internet');
            })
        } else {
            if (this.state.usuario.toString().length == 0) {
                this.state.validacion.usuario = false;
            }
            if (this.state.password.toString().length == 0) {
                this.state.validacion.password = false;
            }
            if (this.state.empresa.toString().length == 0) {
                this.state.validacion.empresa = false;
            }
            if (!this.state.captcha) {
                this.state.validacion.captcha = false;
            }
            this.state.error = !this.state.validacion.usuario || !this.state.validacion.password || !this.state.validacion.password;
            this.setState({
                validacion: this.state.validacion,
                messageError: 'Error debe llenar los campos.',
                error: this.state.error
            });
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
        colors = ((colors == null) || (typeof colors == 'undefined')) ? '' : colors;

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
        //console.log(value);
        this.state.validacion.captcha = true;
        this.setState({
            captcha : true,
            validacion: this.state.validacion
        })
    }

    componentTitle() {

        try {
            let img = readData(keysStorage.img);
        
            if (img == null || img == '' || (typeof img == 'undefined')) {
                return (
                    <a href="/">
                        <img src='/img/enlinea/nombre.png' alt='none'
                            style={{ width: '70%' }} id='img_login'
                        />
                    </a>
                    
                );
            }
            img = JSON.parse(img);
            
            return (
                <a href="/">
                    <img src={img.logonombre} alt='none' id='img_login'
                        style={{ width: '70%' }}
                    />
                </a>
            );

        }catch {
            return (
                <a href="/">
                    <img src='/img/enlinea/nombre.png' alt='none'     
                        style={{ width: '70%' }} id='img_login'
                    />
                </a>
                
            );
        }
    }

    onShowPassword() {
        this.setState({
            showpassword: !this.state.showpassword,
        });
    }

    render(){
        let token = readData(keysStorage.token);
        if (token != null) {//ver depues como hacer otra manera
            return (
                <Redirect to={routes.home} />
            );
        }

        var columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Ciudad',
                dataIndex: 'zona',
                key: 'zona',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.zona.localeCompare(b.zona)}
            },
            {
                title: 'Enfermedad',
                dataIndex: 'enfermedad',
                key: 'enfermedad',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.enfermedad.localeCompare(b.enfermedad)}
            },
            {
                title: 'Dia',
                dataIndex: 'dia',
                key: 'dia',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.dia.localeCompare(b.dia)}
            },
            {
                title: 'Cant Total',
                dataIndex: 'cantidad',
                key: 'cantidad',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.cantidad.localeCompare(b.cantidad)}
            },
            {
                title: 'Prom Recuperado',
                dataIndex: 'recuperado',
                key: 'recuperado',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.recuperado.localeCompare(b.recuperado)}
            },
            {
                title: 'Prom Mortalidad',
                dataIndex: 'mortalidad',
                key: 'mortalidad',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.mortalidad.localeCompare(b.mortalidad)}
            },
        ];

        var data = [
            {
                nro: 1,
                ciudad: 'Santa Cruz',
                enfermedad: 'COVID-19',
                dia: 'jueves',
                cantidad: 44,
                recuperado: '20%',
                mortalidad: '2%',
            },
            {
                nro: 2,
                ciudad: 'BENI',
                enfermedad: 'COVID-19',
                dia: 'jueves',
                cantidad: 1,
                recuperado: '10%',
                mortalidad: '1%',
            },
            {
                nro: 3,
                ciudad: 'pando',
                enfermedad: 'COVID-19',
                dia: 'jueves',
                cantidad: 5,
                recuperado: '5%',
                mortalidad: '1%',
            },
            {
                nro: 4,
                ciudad: 'SANTA CRUZ',
                enfermedad: 'COVID-19',
                dia: 'viernes',
                cantidad: 25,
                recuperado: '10%',
                mortalidad: '1%',
            },
            {
                nro: 5,
                ciudad: 'BENI',
                enfermedad: 'COVID-19',
                dia: 'viernes',
                cantidad: 0,
                recuperado: '0%',
                mortalidad: '0%',
            },
            {
                nro: 6,
                ciudad: 'PANDO',
                enfermedad: 'COVID-19',
                dia: 'viernes',
                cantidad: 3,
                recuperado: '10%',
                mortalidad: '1%',
            },
        ];

        const componentTitle = this.componentTitle();
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        return (

            <div className="contenedor-formulario">
                <div className="wrap-formulario">
                    <Confirmation
                        title={'Iniciando Sesión'}
                        visible={this.state.loading}
                        content={
                            <div style={{ textAlign: 'center' }}>
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                            </div>
                        }
                    />
                    <div className="frms-groups txts-center" style={{'marginTop': '-10px'}}>
                        { componentTitle }
                    </div>
                    { this.state.error ? <Alert message={this.state.messageError} type="error" /> : null }
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
                                    readOnly={this.state.isWait}
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
                                    readOnly={this.state.isWait}
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
                                <input type={(!this.state.showpassword) ? 'password' : 'text'} 
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
                                    readOnly={this.state.isWait}
                                />
                                <label htmlFor="password" 
                                    className={this.classNameLabel(2)}>
                                    Password
                                </label>
                                <img className="img-formulario" src="/images/candado.png" />
                                
                                <i style={{'padding': '3px', 'cursor': 'pointer', 
                                        'position': 'absolute', 'right': '5px', 'top': '9px',
                                        'padding': '3px', 'display': 'flex', 'flexWrap': 'wrap', 
                                        'justifyContent': 'center', 'alignItems': 'center', border: '1px solid #e8e8e8'
                                    }}
                                >
                                    {(!this.state.showpassword) ? 
                                        <Icon type='eye' style={{color: 'black'}} onClick={this.onShowPassword.bind(this)}  /> : 
                                        <Icon type='eye-invisible' style={{color: 'black'}} onClick={this.onShowPassword.bind(this)}  />
                                    }
                                </i>
                            </div>
                        </div>
                        { !this.state.validacion.captcha ? <p style={{ color: 'red', fontSize: 14 }}>{'Error debe hacer el captcha'}</p> : null }
                        <ReCAPTCHA
                            sitekey={Captcha.site_key}
                            onChange={this.onChange1.bind(this)}
                            onExpired={() => this.setState({ captcha: false })}
                            size={'normal'} 
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



