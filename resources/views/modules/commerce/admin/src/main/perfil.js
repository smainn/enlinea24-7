
import React, { Component } from 'react';

import { Icon, DatePicker, Input, Select, message } from 'antd';
const { Option } = Select;

import 'antd/dist/antd.css';
import moment from 'moment';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { httpRequest, removeAllData, readData, saveData } from '../../tools/toolsStorage';
import routes from '../../tools/routes';
import keysStorage from '../../tools/keysStorage';
import Confirmation from '../../components/confirmation';
import C_Button from '../../components/data/button';
import C_Input from '../../components/data/input';

export default class PerfilUsuario extends Component {
    
    constructor(props) {
        super(props);
        this.state = {

            nombre: '',
            apellido: '',
            fechanacimiento: '',
            email: '',
            telefono: '',
            genero: '',

            foto: '',
            image: 0,

            password: '',
            newpassword: '',
            repeatpassword: '',

            control: false,
            visible: false,
            loading: false,
            bandera: 0,
            redirect: false,

            opcionemail: '@gmail.com',

            update: 0,
            errorpa: true,
            errornp: true,
            errorrp: true,

            noSesion: false,

            showpa: true,
            shownp: true,
            showrp: true,
        }
    }

    componentDidMount() {
        this.getPerfil();
    }

    getPerfil() {
        let key = JSON.parse(readData(keysStorage.user));

        let nombre = (typeof key == 'undefined' || key == null)?'':key.nombre;
        let apellido = (typeof key == 'undefined' || key == null)?'':key.apellido;

        let nacimiento = (typeof key == 'undefined' || key == null)?'':key.fechanacimiento;
        let email = (typeof key == 'undefined' || key == null)?'':key.email;
        let telefono = (typeof key == 'undefined' || key == null)?'':key.telefono;
        let genero = (typeof key == 'undefined' || key == null)?'':key.genero;
        let foto = (typeof key == 'undefined' || key == null)?'':key.foto;

        this.setState({
            nombre: nombre,
            apellido: (apellido == null)?'':apellido,
            fechanacimiento: (nacimiento == null)?'':nacimiento,
            email: (email == null)?'':email,
            telefono: (telefono == null)?'':telefono,
            genero: genero,
            foto: (foto ==null)?'':foto,
        });
    }

    onChangePassword(event) {
        if (event.toString().length <= 15) {
            this.setState({
                password: event,
                control: true,
                errorpa: true,
            });
        }
    }
    onChangeNewPassword(event) {
        if (event.toString().length <= 15) {
            this.setState({
                newpassword: event,
                control: true,
                errornp: true,
            });
        }
    }
    onChangeRepeatPassword(event) {
        if (event.toString().length <= 15) {
            this.setState({
                repeatpassword: event,
                control: true,
                errorrp: true,
            });
        }
    }

    onclickUpdate() {
        this.setState({
            update: 1,
        });
    }
    onClickPassword() {
        this.setState({
            update: 2,
        });
    }
    onClickBack() {
        if (this.state.control) {
            this.setState({
                visible: true,
                bandera: 1,
            });
        }else {
            this.getPerfil();
            this.setState({
                update: 0,
                control: false,
                password: '',
                newpassword: '',
                repeatpassword: '',
                image: 0,
            });
        }
    }
    onClickAccept() {
        this.setState({
            visible: true,
            bandera: 2,
        });
    }
    onClickAcceptUpdatePassword() {
        let bandera = 0;
        if ((this.state.password == '' && this.state.newpassword == '' && this.state.repeatpassword == '') || 
            
            (this.state.password == '' && this.state.newpassword == '' && this.state.repeatpassword != '') || 
            (this.state.password == '' && this.state.newpassword != '' && this.state.repeatpassword == '') || 
            (this.state.password != '' && this.state.newpassword == '' && this.state.repeatpassword == '')) {
            message.error('No se permite campo vacio');
            bandera = 1;
        }

        if (this.state.password == '' && this.state.newpassword != '' && this.state.repeatpassword != '') {
            message.warning('Favor de introducir contraseña');
            bandera = 1;
        }
        if (this.state.password != '' && this.state.newpassword == '' && this.state.repeatpassword != '') {
            message.warning('Favor de introducir nueva contraseña');
            bandera = 1;
        }
        if (this.state.password != '' && this.state.newpassword != '' && this.state.repeatpassword == '') {
            message.warning('Favor de introducir repetir contraseña');
            bandera = 1;
        }

        if (bandera == 0) {
            if (this.state.newpassword != this.state.repeatpassword) {
                message.warning('La nueva contraseña no coinciden');
                bandera = 1;
            }
        }

        if (bandera == 0) {
            
            if (this.state.newpassword.toString().length > 7 ||
                this.state.repeatpassword.toString().length > 7
            ){
                this.setState({
                    visible: true,
                    bandera: 3,
                });
            }else {
                if (this.state.newpassword.toString().length < 8) {
                    this.setState({
                        errornp: false,
                    });
                }
                if (this.state.repeatpassword.toString().length < 8) {
                    this.setState({
                        errorrp: false,
                    });
                }
                message.warning('Contraseña requerido minimo 8 caracteres');
            }

        }else {
            if (this.state.password == '') {
                this.setState({
                    errorpa: false,
                });
            }
            if (this.state.newpassword == '') {
                this.setState({
                    errornp: false,
                });
            }
            if (this.state.repeatpassword == '') {
                this.setState({
                    errorrp: false,
                });
            }
        }
        
    }
    showClaveActual() {
        this.setState({
            showpa: !this.state.showpa,
        });
    }
    showClaveNuevo() {
        this.setState({
            shownp: !this.state.shownp,
        });
    }
    showClaveRepetir() {
        this.setState({
            showrp: !this.state.showrp,
        });
    }

    update() {
        if (this.state.update == 1) {
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                        <C_Button onClick={this.onClickBack.bind(this)}
                            type='danger' title='Cancelar'
                        />
                        <C_Button onClick={this.onClickAccept.bind(this)}
                            type='primary' title='Aceptar'
                        />
                    </div>
                </div>
            );
        }else {
            if (this.state.update == 0) {
                return (
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                        <C_Button onClick={this.onclickUpdate.bind(this)}
                            type='primary' title='Editar Perfil'
                        />
                        <C_Button onClick={this.onClickPassword.bind(this)}
                            type='primary' title='Editar Contraseña'
                        />
                    </div>
                );
            }else {
                return (
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <C_Input title='Contraseña Actual'
                                className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                                value={this.state.password}
                                validar={(this.state.errorpa)?1:0}
                                type={(this.state.showpa)?'password':'text'}
                                onChange={this.onChangePassword.bind(this)}
                                suffix={(this.state.showpa)?
                                    <Icon type='eye' onClick={this.showClaveActual.bind(this)}/>:
                                    <Icon type='eye-invisible' onClick={this.showClaveActual.bind(this)}/>
                                }
                            />
                            <C_Input title='Nueva Contraseña'
                                className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                                value={this.state.newpassword}
                                validar={(this.state.errornp)?1:0}
                                type={(this.state.shownp)?'password':'text'}
                                onChange={this.onChangeNewPassword.bind(this)}
                                suffix={(this.state.shownp)?
                                    <Icon type='eye' onClick={this.showClaveNuevo.bind(this)}/>:
                                    <Icon type='eye-invisible' onClick={this.showClaveNuevo.bind(this)}/>
                                }
                            />

                            <C_Input title='Repetir Contraseña'
                                className='cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12'
                                value={this.state.repeatpassword}
                                validar={(this.state.errorrp)?1:0}
                                type={(this.state.showrp)?'password':'text'}
                                onChange={this.onChangeRepeatPassword.bind(this)}
                                suffix={(this.state.showrp)?
                                    <Icon type='eye' onClick={this.showClaveRepetir.bind(this)}/>:
                                    <Icon type='eye-invisible' onClick={this.showClaveRepetir.bind(this)}/>
                                }
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center">
                            <C_Button onClick={this.onClickBack.bind(this)}
                                type='danger' title='Cancelar'
                            />
                            <C_Button onClick={this.onClickAcceptUpdatePassword.bind(this)}
                                type='primary' title='Aceptar'
                            />
                        </div>
                    </div>
                );
            }
        }
    }

    onChangeData(number, event) {
        if (number == 0) {
            this.setState({
                nombre: event.target.value,
                control: true,
            });
        }
        if (number == 1) {
            this.setState({
                apellido: event.target.value,
                control: true,
            });
        }
        if (number == 3) {
            this.setState({
                email: event.target.value,
                control: true,
            });
        }
        if (number == 4) {
            if (!isNaN(event.target.value)) {
                this.setState({
                    telefono: event.target.value,
                    control: true,
                });
            }
        }
        if (number == 5) {
            this.setState({
                genero: event,
                control: true,
            });
        }
    }

    onChangeDate(date, dateString) {
        this.setState({
            fechanacimiento: dateString,
            control: true,
        });
    }

    onChangeImage(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    foto: e.target.result,
                    image: 1,
                    control: true,
                });
            }
        }
    }
    deleteImage() {
        this.setState({
            foto: '',
            image: 1,
            control: true,
        });
    }

    get_data(value, number) {
        if (this.state.update == 1) {
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            if ((number == 0) || (number == 1) || (number == 3) || (number == 4)) {
                return (
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{'height': '42px', 
                            'marginBottom': '1px', 'padding': '0'}}>
                        <div className="inputs-groups">
                            <input type="text" 
                                className={`forms-control ${colors}`}
                                value={value}
                                onChange={this.onChangeData.bind(this, number)}
                                style={{'textAlign': 'left', 'width': '90%' , 
                                    'margin': '8px auto', 'lineHeight': '30px',
                                    'background': '#FFF', 'paddingLeft': '15px',
                                }}
                            />
                        </div>
                        
                    </div>
                );
            }
            if (number == 2) {
                const nacimiento = (value == '') ? null : moment(value, 'YYYY-MM-DD');

                return (
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{'height': '42px', 
                            'marginBottom': '1px', 'padding': '0'}}>
                        <div style={{'width': '90%', 'margin': '8px auto'}}>
                            <DatePicker 
                                value={nacimiento}
                                onChange={this.onChangeDate.bind(this)}
                                placeholder="Seleccionar Fecha"
                                style={{'width': '100%', 'background': '#FFF'}}
                            />
                        </div>
                    </div>
                );
            }
            if (number == 5) {
                return (
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{'height': '42px',
                            'marginBottom': '1px', 'padding': '0'}}>
                        <div style={{'width': '90%', 'margin': '8px auto'}}>
                            <Select value={this.state.genero}
                                onChange={this.onChangeData.bind(this, number)}
                                style={{'width': '100%', 'background': '#FFF'}}>
                                <Option value="N">Ninguno</Option>
                                <Option value="M">Masculino</Option>
                                <Option value="F">Femenino</Option>
                            </Select>
                        </div>
                    </div>
                );
            }

        }else {
            return (
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    style={{'borderBottom': '1px solid #e8e8e8', 
                        'marginBottom': '1px', 'padding': '0'}}>
                    <div className="inputs-groups">
                        <input type="text" 
                            className="forms-control"
                            value={value}
                            readOnly
                            style={{'border': '1px solid transparent', 'textAlign': 'left',
                                'background': '#FFF', 'height': '42px', 'borderRadius': '0',
                                'paddingLeft': '15px', 'color': 'black',
                            }}
                        />
                        <div style={{'position': 'absolute', 'right': '5px', 'padding': '3px',
                            'top': '13px', 'lineHeight': '10px', 'cursor': 'pointer'}}
                            onClick={this.onclickUpdate.bind(this)}>
                            <Icon type="edit" />
                        </div>
                    </div>
                </div>
            );
        }
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            bandera: 0,
            loading: false,
        });
    }

    onCancel() {
        this.setState({
            loading: true,
        });
        this.getPerfil();
        setTimeout(() => {
            this.setState({
                visible: false,
                control: false,
                loading: false,
                bandera: 0,
                update: 0,
                password: '',
                newpassword: '',
                repeatpassword: '',
                image: 0,
                shownp: true,
                showpa: true,
                showrp: true,
            });
        }, 300);
    }

    onSubmitData() {
        var key = JSON.parse(readData(keysStorage.user));
        var idusuario = ((key == null) || (typeof key == 'undefined'))?'':key.idusuario;
        let body = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            fechanacimiento: this.state.fechanacimiento,
            email: this.state.email,
            telefono: this.state.telefono,
            genero: this.state.genero,
            id: idusuario,
            bandera: this.state.image,
            foto: this.state.foto,
        };
        this.setState({
            loading: true,
        });

        httpRequest('post', '/commerce/api/usuario/perfil', body)
        .then(result => {

                if (result.response == 0) {
                    this.handleCerrarModal();
                    message.warning('Usuario no identificado');
                }

                if (result.response == 1) {
                    saveData(keysStorage.user, JSON.stringify(result.user));
                    this.getPerfil();
                    this.setState({
                        visible: false,
                        control: false,
                        loading: false,
                        bandera: 0,
                        update: 0,
                        image: 0,
                        shownp: true,
                        showpa: true,
                        showrp: true,
                    });
                    message.success('Exito en actualizar perfil');
                }

                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onSubmitDataPassword() {
        var key = JSON.parse(readData(keysStorage.user));
        var idusuario = ((key == null) || (typeof key == 'undefined'))?'':key.idusuario;
        var login = ((key == null) || (typeof key == 'undefined'))?'':key.login;
        let body = {
            id: idusuario,
            password: this.state.password,
            newpassword: this.state.newpassword,
            repeatpassword: this.state.repeatpassword,
            login: login,
        };
        this.setState({
            loading: true,
        });

        httpRequest('post', '/commerce/api/usuario/update_password', body)
        .then(result => {

                if (result.response == 0) {
                    this.handleCerrarModal();
                    message.warning('Ups! Hubo un error en la nueva contraseña');
                }

                if (result.response == -1) {
                    this.handleCerrarModal();
                    message.warning('Contraseña incorrecta');
                    this.setState({
                        errorpa: false,
                    });
                }

                if (result.response == 1) {
                    this.setState({
                        visible: false,
                        control: false,
                        loading: false,
                        bandera: 0,
                        image: 0,
                        update: 0,
                        password: '',
                        newpassword: '',
                        repeatpassword: '',
                        shownp: true,
                        showpa: true,
                        showrp: true,
                    });
                    message.success('Exito en actualizar contraseña');
                }

                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    componentConfirmation() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='Cancelar Registro Perfil'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.onCancel.bind(this)}
                    content = '¿Esta seguro de cancelar los registros?'
                />
            );
        }else {
            if (this.state.bandera == 2) {
                return (
                    <Confirmation
                        visible={this.state.visible}
                        title='Guardar Registro'
                        loading={this.state.loading}
                        onCancel={this.handleCerrarModal.bind(this)}
                        onClick={this.onSubmitData.bind(this)}
                    />
                );
            }else {
                return (
                    <Confirmation
                        visible={this.state.visible}
                        title='Guardar Registro'
                        loading={this.state.loading}
                        onCancel={this.handleCerrarModal.bind(this)}
                        onClick={this.onSubmitDataPassword.bind(this)}
                    />
                );
            }
        }
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }

        let key = JSON.parse(readData(keysStorage.user));

        let nombre = (typeof key == 'undefined' || key == null)?'':key.nombre;
        let apellido = (typeof key == 'undefined' || key == null)?'':key.apellido;
        let user = (apellido == null)?nombre:(nombre + ' ' + apellido);

        let genero = (this.state.genero == 'N')?'Ninguno':(this.state.genero == 'M')?'Masculino':'Femenino';

        return (
            <div className="rows" style={{'overflow': 'hidden'}}>
                {this.componentConfirmation()}
                <div className="forms-groups" 
                    style={{'padding': '20px',
                        'paddingLeft': '80px', 'paddingRight': '80px'}}>
                    
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div style={{'width': '100%', 'padding': '5px', 'textAlign': 'center'}}>
                                <h1 style={{'fontSize': '25px'}}>Perfil de {user}</h1>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">

                                <div style={{'width': '200px', 
                                    'boxSizing': 'border-box', // 'overflow': 'hidden',
                                    'margin': '10px',
                                    'height': '200px', 'float': 'right',
                                    'borderRadius': '50%',
                                    'WebkitBorderRadius': '50%',
                                    'MozBorderRadius': '50%',
                                    'position': 'relative',
                                }}>
                                    <img src={(this.state.foto == '')?'/img/perfil.png':this.state.foto} 
                                    alt="none"
                                        style={{'position': 'absolute',
                                            'top': '0', 'left': '0',
                                            'width': '100%', 'height': '100%',
                                            'borderRadius': '50%',
                                            'WebkitBorderRadius': '50%',
                                            'MozBorderRadius': '50%',
                                        }}
                                    />
                                    {(this.state.update == 1)?
                                        <div style={{'position': 'absolute', 
                                            'right': '15px', 'padding': '5px',
                                            'bottom': '10px', 'lineHeight': '10px', 
                                            'background': '#3E88F9', 'borderRadius': '50%',
                                            'border': '2px solid #22A1FF',
                                            'cursor': 'pointer'}}
                                            >
                                            <input type="file" onChange={this.onChangeImage.bind(this)}
                                                className="img-content"/>

                                            <Icon type="camera" style={{color: '#FFF', 'fontSize': '18px'}} />
                                        </div>:''
                                    }
                                    {(this.state.update == 1)?
                                        <div style={{'position': 'absolute', 
                                            'right': '15px', 'padding': '5px',
                                            'top': '18px', 'lineHeight': '5px', 
                                            'background': '#FF1414', 'borderRadius': '50%',
                                            'border': '2px solid #FF4F4F',
                                            'cursor': 'pointer'}}
                                            onClick={this.deleteImage.bind(this)}
                                            >
                                            <Icon type="close" style={{color: '#FFF', 'fontSize': '15px'}} />
                                        </div>:''
                                    }

                                </div>
                            </div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" 
                                style={{'padding': '0'}}>
                                
                                <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12" 
                                    style={{'padding': '0'}}>
                                    
                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Nombre: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Apellido: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Fecha Nacimiento: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Email: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Telefono: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'borderBottom': '1px solid #e8e8e8', 
                                            'marginBottom': '1px', 'padding': '0'}}>
                                        <input type="text" 
                                            className="forms-control"
                                            value="Genero: "
                                            readOnly
                                            style={{'border': '1px solid transparent', 'textAlign': 'right',
                                                'background': '#ECF7FF', 'height': '42px', 'borderRadius': '0',
                                                'paddingRight': '15px', 'color': 'blue',
                                            }}
                                        />
                                    </div>

                                </div>
                                
                                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12"
                                    style={{'padding': '0'}}>
                                    
                                    {this.get_data(this.state.nombre, 0)}
                                    {this.get_data(this.state.apellido, 1)}
                                    {this.get_data(this.state.fechanacimiento, 2)}
                                    {this.get_data(this.state.email, 3)}
                                    {this.get_data(this.state.telefono, 4)}
                                    {this.get_data(genero, 5)}

                                </div>
                            </div>
                        </div>

                        {this.update()}

                    </div>

                </div>
            </div>
        );
    }
}


