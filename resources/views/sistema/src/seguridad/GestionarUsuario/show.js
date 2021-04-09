
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '../../componentes/input';
import TextArea from '../../componentes/textarea';
import CImage from '../../componentes/image';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import C_Button from '../../componentes/data/button';
import ws from '../../utils/webservices';

export default class ShowUsuario extends Component{

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            visible: false,
            loading: false,

            nro: 0,
            fecha: this.fechaActual(),
            nombre: '',
            apellido: '',
            sexo: 'M',
            email: '',
            telefono: '',
            notas: '',
            imagen: '',
            estado: 'A',

            login: '',
            noSesion: false
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
        httpRequest('get', ws.wsusuarioedit + '/' + this.props.match.params.id + '')
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
                        telefono: (result.data.telefono == null)?'':result.data.telefono,
                        login: result.data.login,
                        notas: (result.data.notas == null)?'':result.data.notas,
                        imagen: (result.data.foto == null)?'':result.data.foto,
                        estado: result.data.estado,
                        
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

    onIndex() {
        this.setState({
            redirect: true,
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        if (this.state.redirect) {
            return (<Redirect to={routes.usuario_index} />);
        }
        return (
            <div className="rows">
                
                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Detalle Usuario</h1>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-12">
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={this.state.nombre}
                                    title='Nombre*'
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={this.state.apellido}
                                    title='Apellido*'
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={(this.state.sexo == 'F')?'Femenino':'Masculino'}
                                    title='Genero*'
                                    readOnly={true}
                                />
                            </div> 
                            <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-12 mt-4">
                                <Input
                                    value={this.state.email}
                                    title='Email*'
                                    readOnly={true}
                                />
                            </div> 
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={this.state.telefono}
                                    title='Telefono*'
                                    readOnly={true}
                                />
                            </div> 
                            <div className="cols-lg-2 cols-md-2 cols-sm-2"></div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={(this.state.estado == 'A')?'Activo':'No Activo'}
                                    title='Usuario*'
                                    readOnly={true}
                                />
                            </div>
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 mt-4">
                                <Input 
                                    value={this.state.login}
                                    title='Usuario*'
                                    readOnly={true}
                                />
                            </div>
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12" style={{'padding': '0'}}>
                        
                            <div className="text-center-content">
                                <CImage
                                    image={this.state.imagen}
                                    images={[]}
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
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="txts-center">
                            <C_Button
                                title='Aceptar'
                                type='danger'
                                onClick={this.onIndex.bind(this)}
                            />
                            
                        </div>
                    </div>
                </div>
                    
            </div>
        );
    }
}