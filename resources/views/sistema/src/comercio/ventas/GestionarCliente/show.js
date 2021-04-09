

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import {cambiarFormato, convertYmdToDmy} from '../../../utils/toolsDate'
import Lightbox from 'react-image-lightbox';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest } from '../../../utils/toolsStorage';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';
import C_Input from '../../../componentes/data/input';
import C_TextArea from '../../../componentes/data/textarea';

export default class ShowCliente extends Component{

    constructor(props){
        super(props);
        this.state = {
            openImage: false,
            configCodigo: false,
        }

        this.permisions = {
            codigo: readPermisions(keys.cliente_input_codigo),
            tipo: readPermisions(keys.cliente_select_tipoCliente),
            fecha_nac: readPermisions(keys.cliente_fechaNacimiento),
            personeria: readPermisions(keys.cliente_select_tipoPersoneria),
            caracteristicas: readPermisions(keys.cliente_caracteristicas),
            nombre: readPermisions(keys.cliente_input_nombre),
            apellido: readPermisions(keys.cliente_input_apellido),
            nit: readPermisions(keys.cliente_input_nit),
            genero: readPermisions(keys.cliente_select_genero),
            ciudad: readPermisions(keys.cliente_select_ciudad),
            imagen: readPermisions(keys.cliente_imagenes),
            contacto: readPermisions(keys.cliente_textarea_contactos),
            observaciones: readPermisions(keys.cliente_textarea_observaciones)
        }
    }

    visualizarImagen() {
        if (this.props.cliente != null) {
            if (this.permisions.imagen.visible == 'A') {
                if (this.props.cliente.foto != null && this.props.cliente.foto != '') {
                    return (
                        <img src={this.props.cliente.foto} 
                            alt="none" className='img-principal'
                            style={{'cursor': 'pointer'}}
                            onClick={this.abrirImagen.bind(this)} 
                        />
                    )
                } else {
                    return (
                        <img src="/images/default.jpg"  
                            alt="none" className="img-principal"/>
                    )
                }
            }
        }
        return null;
    }

    abrirImagen() {
        this.setState({
            openImage: true,
        });
    }

    closeImagen() {
        this.setState({
            openImage: false,
        });
    }

    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }

    componentDidMount() {
        this.getConfigsClient();
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.configcliente.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            
            message.error(strings.message_error);
        })
    }

    componentReferencias() {
        if (this.permisions.caracteristicas.visible == 'A') {
            return (
                <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                    
                    <div className="card" style={{ 'height':'265px' }}>
                        <div className="card-header">
                            <label style={{'padding': '2px', 'position': 'relative',
                                'color': '#5D6160', 'font': '500 18px Roboto', 'marginTop': '4px'}}>
                                Referencia para contactarlo
                            </label>
                        </div>
                        <div 
                            className="card-body" 
                            style={{ 
                                maxHeight: '265px', 
                                overflowY: 'auto',
                                padding: 10,
                                paddingRight: 5,
                            }}>
                            {this.props.contactoCliente.map(
                                (resultado, indice) => (
                                    <div key={indice} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                                            
                                        <C_Input 
                                            value={resultado.descripcion}
                                            readOnly={true}
                                            title='Contacto'
                                            className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12"
                                        />
                                        <C_Input 
                                            value={resultado.valor}
                                            readOnly={true}
                                            title={resultado.descripcion}
                                            className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12"
                                        />
                                    </div>
                                )

                            )}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const componentReferencias = this.componentReferencias();

        let codigoCliente = '';
        let cliente = this.props.cliente;
        let personeria = 'Ninguno';

        if (cliente != null) {
            if (this.state.configCodigo) {
                codigoCliente = (cliente.codcliente == null) ? cliente.idcliente : cliente.codcliente;
            }else {
                codigoCliente = cliente.idcliente;
            }
            if (cliente.tipopersoneria == 'J') {
                personeria = 'Juridico';
            }else if (cliente.tipopersoneria == 'N') {
                personeria = 'Natural';
            }
        }
        return (
            <div className="forms-groups"
                style={{'marginTop': '-20px'}}>

                    {(this.state.openImage)?
                        <Lightbox
                            onCloseRequest={this.closeImagen.bind(this)}
                            mainSrc={cliente == null ? '' : cliente.foto}
                        />
                    :''}

                <div className="forms-groups">

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                readOnly={true}
                                value={codigoCliente}
                                title='Codigo'
                                permisions={this.permisions.codigo}
                            />
                            <C_Input 
                                readOnly={true}
                                value={ cliente == null ? '' : cliente.tipo}
                                title='Tipo Cliente'
                                permisions={this.permisions.tipo}
                            />
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : personeria}
                                title='Personeria'
                                permisions={this.permisions.personeria}
                            />
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : (cliente.fechanac == null) ? 'Sin Dato' : convertYmdToDmy(cliente.fechanac)}
                                title={cliente == null ? '' : (cliente.tipopersoneria == 'J')?"Fecha Fundacion":"Fecha Nacimiento"}
                                permisions={this.permisions.fecha_nac}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : (cliente.apellido == null)?
                                        cliente.nombre:
                                        cliente.nombre + ' ' + cliente.apellido}
                                title='Nombre'
                                permisions={this.permisions.nombre}
                                className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12 pt-bottom"
                            />
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : (cliente.nit == null)?'Sin Nit':cliente.nit}
                                title='Nit/Ci'
                                permisions={this.permisions.nit}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : (cliente.sexo == 'M')?'Masculino':
                                    (cliente.sexo == 'F')?'Femenino':'Sin Definir'}
                                title='Genero'
                                permisions={this.permisions.genero}
                            />
                            <C_Input 
                                readOnly={true}
                                value={cliente == null ? '' : cliente.ciudad}
                                title='Ciudad'
                                permisions={this.permisions.ciudad}
                            />
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                            { componentReferencias }
                            
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <div className="card-img-content" style={{'border': 'none'}}>
                                    <div className="img-card">
                                        {this.visualizarImagen()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <C_TextArea 
                                value={cliente == null ? '' : (cliente.contacto != null)?cliente.contacto:''}
                                readOnly={true}
                                title='Contacto'
                                permisions={this.permisions.contacto}
                            />
                            <C_TextArea 
                                value={cliente == null ? '' : (cliente.notas != null)?cliente.notas:''}
                                readOnly={true}
                                title='Observaciones'
                                permisions={this.permisions.observaciones}
                            />
                        </div>
                    
                    </div>

                </div>
            
            </div>
        );

    }
}




