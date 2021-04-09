
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';

import CSelect from '../../../components/select2';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import Confirmation from '../../../components/confirmation';
import { message, Select } from 'antd';
const {Option} = Select;
import "antd/dist/antd.css";
import CImage from '../../../components/image';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';

export default class CrearUsuario extends Component{

    constructor() {
        super();

        this.state = {
            caracteres: {
                numeros: '0 1 2 3 4 5 6 7 8 9',
                mayusculas: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
                minusculas: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
            },
            redirect: false,
            visible: false,
            loading: false,

            nro: 0,
            fecha: this.fechaActual(),
            nombre: '',
            apellido: '',
            sexo: 'N',
            email: '',
            telefono: '',
            notas: '',
            bandera: 0,

            login: '',
            password: '',

            imagen: '',

            validacionNombre: 1,
            validacionApellido: 1,
            validacionLogin: 1,
            validacionPassword: 1,
            noSesion: false
        }

        this.permisions = {
            nombre: readPermisions(keys.usuario_input_nombre),
            apellido: readPermisions(keys.usuario_input_apellido),
            genero: readPermisions(keys.usuario_select_genero),
            correo: readPermisions(keys.usuario_input_correo),
            telefono: readPermisions(keys.usuario_input_telefono),
            telefono: readPermisions(keys.usuario_input_telefono),
            usuario: readPermisions(keys.usuario_input_usuario),
            password: readPermisions(keys.usuario_input_password),
            notas: readPermisions(keys.usuario_textarea_nota),
            imagen: readPermisions(keys.usuario_image)
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
            validacionPassword: 1,
        });
    }
    onChangeTelefono(event) {
        if (!isNaN(event)) {
            this.setState({
                telefono: event,
            });
        }
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

        if ((this.state.nombre.toString().trim().length > 0) && 
            (this.state.apellido.toString().trim().length > 0) && 
            (this.state.login.toString().trim().length > 0) && 
            (this.state.email.toString().trim().length > 0)) {
            
            this.setState({
                visible: true,
                bandera: 2,
            });

        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    validacionNombre: 0,
                    nombre: '',
                });
            }
            if (this.state.apellido.toString().trim().length == 0) {
                this.setState({
                    validacionApellido: 0,
                    apellido: '',
                });
            }
            if (this.state.login.toString().trim().length == 0) {
                this.setState({
                    validacionLogin: 0,
                    login: '',
                });
            }
            if (this.state.email.toString().trim().length == 0) {
                this.setState({
                    validacionPassword: 0,
                    email: '',
                });
            }
            message.error('No se permite campo vacio');
        }
    }

    onSubmitGuardarDatos(event) {
        event.preventDefault();

        var mayuscula = this.state.caracteres.mayusculas;
        var minuscula = this.state.caracteres.minusculas;
        var numero = this.state.caracteres.numeros;

        var caracteres = mayuscula + ' ' + minuscula + ' ' + numero;
        caracteres = caracteres.split(' ');

        var newpassword = '';
        
        for (let i = 0; i < 8; i++) {
            if (i == 0) {
                newpassword += caracteres[Math.floor(Math.random() * (caracteres.length-10))];
            }else {
                newpassword += caracteres[Math.floor(Math.random() * caracteres.length)];
            }
        }

        this.setState({
            loading: true,
        });
        let body = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            sexo: this.state.sexo,
            email: this.state.email,
            telefono: this.state.telefono,
            login: this.state.login,
            password: this.state.password,
            notas: this.state.notas,
            image: this.state.imagen,
            newpassword: newpassword,
        };
        httpRequest('post', '/commerce/api/usuario/post', body)
            .then(result => {
                if (result.response == 0) {
                    this.setState({
                        validacionLogin: 0,
                    });
                    this.handleCerrarModal();
                    message.warning('Ya existe el nombre de usuario');
                } 
                if (result.response == -3) {
                    this.setState({
                        validacionPassword: 0,
                    });
                    this.handleCerrarModal();
                    message.error('Se permite solo email');
                }  
                if (result.response == 1) {
                    this.handleCerrarModal();
                    this.setState({
                        redirect: true,
                    });
                    message.success('Exito en crear');
                } 
                if (result.response == -1) {
                    this.handleCerrarModal();
                    message.error('Error al procesar solicitud');
                } 
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
        .catch((error) => {
            console.log('ERROR ', error);
        }
        );
    }

    onClickSalir() {
        this.setState({
            visible: true,
            bandera: 1,
        });
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            bandera: 0,
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
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title='¿Esta seguro de cancelar el registro del nuevo Usuario?'
                    loading={this.state.loading}
                    onCancel={this.handleCerrarModal.bind(this)}
                    onClick={this.onCancelUsuario.bind(this)}
                    content = 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?'
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
                        onClick={this.onSubmitGuardarDatos.bind(this)}
                    />
                );
            }
        }
    }

    cambiofoto(event) {
        let files = event.target.files
        if (files[0].type == 'image/png' || files[0].type == 'image/jpg' || files[0].type == 'image/jpeg') {
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload=(e) => {
                this.setState({
                    imagen: e.target.result,
                });
            }
        }
    }

    eliminarFoto() {
        this.setState({
            imagen: '',
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />);
        }
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/usuario/index" />);
        }
        return (
            <div className="rows">
                {this.componentConfirmation()}
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Usuario</h1>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12">
                            
                            <C_Input 
                                value={this.state.nombre}
                                title='Nombre*'
                                onChange={this.onChangeNombre.bind(this)}
                                validar={this.state.validacionNombre}
                                permisions={this.permisions.nombre}
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                            />
                            <C_Input 
                                value={this.state.apellido}
                                title='Apellido*'
                                onChange={this.onChangeApellido.bind(this)}
                                validar={this.state.validacionApellido}
                                permisions={this.permisions.apellido}
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                            />
                            <C_Select 
                                value={this.state.sexo}
                                title='Genero*'
                                onChange={this.onChangeGenero.bind(this)}
                                permisions={this.permisions.genero}
                                component={[
                                    <Option key={0} value='N' >Ninguno</Option>,
                                    <Option key={1} value='M' >Masculino</Option>,
                                    <Option key={2} value='F' >Femenino</Option>
                                ]}
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                            />
                            <C_Input 
                                value={this.state.email}
                                title='Email*'
                                validar={this.state.validacionPassword}
                                onChange={this.onChangeEmail.bind(this)}
                                permisions={this.permisions.correo}
                                className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12 mt-4"
                            />
                            <C_Input 
                                value={this.state.telefono}
                                title='Telefono*'
                                onChange={this.onChangeTelefono.bind(this)}
                                permisions={this.permisions.telefono}
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                            />
                            <div className="cols-lg-4 cols-md-4 cols-sm-4"></div>
                            <C_Input 
                                value={this.state.login}
                                title='Usuario*'
                                onChange={this.onChangeUsuario.bind(this)}
                                validar={this.state.validacionLogin}
                                permisions={this.permisions.usuario}
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12" style={{'padding': '0'}}>
                        
                            <div className="text-center-content">
                                <CImage
                                    onChange={this.cambiofoto.bind(this)}
                                    image={this.state.imagen}
                                    images={[]}
                                    delete={this.eliminarFoto.bind(this)}
                                    permisions={this.permisions.imagen}
                                    style={{ 
                                        height: 240, 
                                        'border': '1px solid transparent',
                                    }}
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
                                permisions={this.permisions.notas}
                            />
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