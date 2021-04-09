
import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import TextArea from '../../../components/textarea';
import Confirmation from '../../../components/confirmation';
import { message, Select } from 'antd';
import "antd/dist/antd.css";
import CImage from '../../../components/image';
import { httpRequest, removeAllData, saveData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import keysStorage from '../../../tools/keysStorage';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

export default class EditarUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            caracteres: {
                numeros: '0 1 2 3 4 5 6 7 8 9',
                mayusculas: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
                minusculas: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
            },
            redirect: false,
            visible: false,
            visiblegenerar: false,

            loading: false,
            sw: 0,

            nro: 0,
            fecha: this.fechaActual(),
            nombre: '',
            apellido: '',
            sexo: 'N',
            estado: 'A',
            email: '',
            telefono: '',
            notas: '',

            emailusers: '',
            emailoriginal: '',

            login: '',
            password: '',
            imagen: '',
            bandera: 0,

            idgrupousuario: 0,

            validacionNombre: 1,
            validacionApellido: 1,
            validacionLogin: 1,
            validacionPassword: 1,
            validacionemail: 1,
            validacionemailusers: 1,
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
        httpRequest('get', '/commerce/api/usuario/edit/' + this.props.match.params.id + '')
        .then(result => {
                if (result.response == 0) {
                    console.log('error en la conexion');
                } else if (result.response == 1) {
                    this.setState({
                        nro: result.data.idusuario,
                        nombre: result.data.nombre,
                        apellido: (result.data.apellido == null)?'':result.data.apellido,
                        sexo: result.data.sexo,
                        email: (result.data.email == null)?'':result.data.email,
                        emailusers: (result.data.email == null)?'':result.data.email,
                        emailoriginal: (result.data.email == null)?'':result.data.email,
                        telefono: (result.data.telefono == null)?'':result.data.telefono,
                        login: result.data.login,
                        notas: (result.data.notas == null)?'':result.data.notas,
                        imagen: (result.data.foto == null)?'':result.data.foto,
                        estado: result.data.estado,
                        idgrupousuario: result.data.fkidgrupousuario,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
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
            validacionemail: 1,
        });
    }

    onChangeTelefono(event) {
        this.setState({
            telefono: event,
        });
    }

    onChangeEstado(event) {
        this.setState({
            estado: event,
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

        if ((this.state.nombre.toString().trim().length > 0) && 
            (this.state.apellido.toString().trim().length > 0) && 
            (this.state.login.toString().trim().length > 0) && 
            (this.state.email.toString().trim().length > 0)) {
            
            this.setState({
                bandera: 2,
                visible: true,
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
                    validacionemail: 0,
                    email: '',
                });
            }
            message.error('No se permite campo vacio');
        }
    }

    onSubmitUpdate(event) {
        event.preventDefault();

        var mayuscula = this.state.caracteres.mayusculas;
        var minuscula = this.state.caracteres.minusculas;
        var numero = this.state.caracteres.numeros;

        var caracteres = mayuscula + ' ' + minuscula + ' ' + numero;
        caracteres = caracteres.split(' ');

        var newpassword = '';
        /*
        for (let i = 0; i < 8; i++) {
            if (i == 0) {
                newpassword += caracteres[Math.floor(Math.random() * (caracteres.length-10))];
            }else {
                newpassword += caracteres[Math.floor(Math.random() * caracteres.length)];
            }
        }*/

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
            imagen: this.state.imagen,
            bandera: this.state.sw,
            id: this.props.match.params.id,
            newpassword: newpassword,
            estado: this.state.estado,
        };

        httpRequest('post', '/commerce/api/usuario/update', body)
        .then(result => {
                if (result.response == -1) {
                    this.handleCerrarModal();
                    message.error('Error al procesar solicitud');
                }  
                if (result.response == -3) {
                    this.setState({
                        validacionemail: 0,
                    });
                    this.handleCerrarModal();
                    message.error('Se permite solo email');
                }  
                if (result.response == 0) {
                    this.setState({
                        validacionLogin: 0,
                    });
                    this.handleCerrarModal();
                    message.warning('Ya existe el nombre Usuario');
                } 
                if (result.response == 1) {

                    var user = JSON.parse(readData(keysStorage.user));
                    var idusuario = (user == null)?null:user.idusuario;

                    if (this.props.match.params.id == idusuario) {
                        saveData(keysStorage.user, JSON.stringify(result.user));
                    }
                    this.setState({
                        redirect: true,
                    });
                    message.success('Exito en actualizar usuario');
                } 
                if (result.response == -2) {
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
            bandera: 1,
        });
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            bandera: 0,
            loading: false,
            visiblegenerar: false,
            emailusers: this.state.emailoriginal,
            validacionemailusers: 1,
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
                    title='¿Esta seguro de cancelar la actualizacion del Usuario?'
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
                        title='Actualizar Registro'
                        loading={this.state.loading}
                        onCancel={this.handleCerrarModal.bind(this)}
                        onClick={this.onSubmitUpdate.bind(this)}
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
                    sw: 1,
                });
            }
        }
    }

    eliminarFoto() {
        this.setState({
            imagen: '',
            sw: 1,
        });
    }

    onClickGenerarClave() {
        this.setState({
            visiblegenerar: true,
        });
    }

    onGenerarPassword(event) {
        event.preventDefault();
        if (this.state.emailusers.toString().trim().length == 0) {
            this.setState({
                validacionemailusers: 0,
            });
        }else {
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
                email: this.state.emailusers,
                newpassword: newpassword,
                id: this.props.match.params.id,
            };
    
            httpRequest('post', '/commerce/api/usuario/generar_password', body)
            .then(result => {

                    if (result.response == -1) {
                        this.handleCerrarModal();
                        message.error('Error al procesar solicitud');
                    }  
                    if (result.response == -3) {
                        this.setState({
                            validacionemailusers: 0,
                            loading: false,
                        });
                        message.error('Se permite solo email');
                    }  
                    if (result.response == 1) {
                        this.handleCerrarModal()
                        message.success('Exito en envio del nuevo password');
                    } 

                    if (result.response == -2) {
                        this.setState({ noSesion: true })
                    }
                }
            ).catch(
                error => console.log(error)
            );
        }
    }

    componentGenerarPassword() {
        return (
            <Confirmation 
                visible={this.state.visiblegenerar}
                title='Generar Password'
                loading={this.state.loading}
                onCancel={this.handleCerrarModal.bind(this)}
                onClick={this.onGenerarPassword.bind(this)}
                content = {[
                    <C_Input 
                        key={0}
                        value={this.state.emailusers}
                        title='Email'
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        onChange={this.onChangeEmailUsers.bind(this)}
                        validar={this.state.validacionemailusers}
                    />
                ]}
            />
        );
    }

    onChangeEmailUsers(value) {
        this.setState({
            emailusers: value,
            validacionemailusers: 1,
        });
    }

    componentEstado() {
        let key = JSON.parse(readData(keysStorage.user));
        var idusuario = (typeof key == 'undefined' || key == null)?0:key.idusuario;
        
        if (this.state.idgrupousuario == 1 || idusuario == this.props.match.params.id) {
            return (
                <C_Select
                    className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                    value={this.state.estado}
                    title='Estado*'
                    onChange={this.onChangeEstado.bind(this)}
                    readOnly={true}
                    component={[
                        <Option key={0} value='A' >Activo</Option>,
                        <Option key={1} value='N' >No Activo</Option>,
                    ]}
                />
            );
        }
        return (
            <C_Select
                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                value={this.state.estado}
                title='Estado*'
                onChange={this.onChangeEstado.bind(this)}
                component={[
                    <Option key={0} value='A' >Activo</Option>,
                    <Option key={1} value='N' >No Activo</Option>,
                ]}
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio}/>);
        }
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/usuario/index" />);
        }
        return (
            <div className="rows">

                {this.componentConfirmation()}
                {this.componentGenerarPassword()}

                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Actualizar Usuario</h1>
                    </div>

                    <div className="forms-groups">
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12">
                            <C_Input 
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                                value={this.state.nombre}
                                title='Nombre*'
                                onChange={this.onChangeNombre.bind(this)}
                                validar={this.state.validacionNombre}
                                permisions={this.permisions.nombre}
                            />
                            <C_Input 
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                                value={this.state.apellido}
                                title='Apellido*'
                                onChange={this.onChangeApellido.bind(this)}
                                validar={this.state.validacionApellido}
                                permisions={this.permisions.apellido}
                            />
                            <C_Select
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                                value={this.state.sexo}
                                title='Genero*'
                                onChange={this.onChangeGenero.bind(this)}
                                permisions={this.permisions.genero}
                                component={[
                                    <Option key={0} value='N' >Ninguno</Option>,
                                    <Option key={1} value='M' >Masculino</Option>,
                                    <Option key={2} value='F' >Femenino</Option>
                                ]}
                            />
                            <C_Input 
                                className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12 mt-4"
                                value={this.state.email}
                                title='Email*'
                                onChange={this.onChangeEmail.bind(this)}
                                permisions={this.permisions.correo}
                                validar={this.state.validacionemail}
                            />
                            <C_Input 
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                                value={this.state.telefono}
                                title='Telefono*'
                                onChange={this.onChangeTelefono.bind(this)}
                                permisions={this.permisions.telefono}
                            />
                            {this.componentEstado()}
                            <C_Input 
                                className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4"
                                value={this.state.login}
                                title='Usuario*'
                                onChange={this.onChangeUsuario.bind(this)}
                                readOnly={true}
                                validar={this.state.validacionLogin}
                                permisions={this.permisions.usuario}
                            />
                            <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                                <C_Button
                                    title='Generar Password'
                                    type='primary' style={{marginTop: 20}}
                                    onClick={this.onClickGenerarClave.bind(this)}
                                />
                            </div>
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