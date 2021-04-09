

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import Input from '../../../components/input';
import {cambiarFormato} from '../../../tools/toolsDate'
import TextArea from '../../../components/textarea';
import Lightbox from 'react-image-lightbox';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest } from '../../../tools/toolsStorage';
import ws from '../../../tools/webservices';

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
        if (this.permisions.imagen.visible == 'A') {
            if (this.props.cliente[0].foto != null && this.props.cliente[0].foto != '') {
                return (
                    
                    <img src={this.props.cliente[0].foto} 
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
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
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
                                        <div className="cols-lg-4 cols-md-4 cols-sm-4">
                                            <Input
                                                value={resultado.descripcion}
                                                readOnly={true}
                                                title='Contacto'
                                            />
                                        </div>
                                        <div className="cols-lg-8 cols-md-8 cols-sm-8">
                                            <Input 
                                                value={resultado.valor}
                                                readOnly={true}
                                                title={resultado.descripcion}
                                            />
                                        </div>
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
       let codigoCliente = this.props.cliente[0].idcliente;
       if (this.state.configCodigo) {
           codigoCliente = this.props.cliente[0].codcliente == null ? codigoCliente : this.props.cliente[0].codcliente;
       }
       let personeria = 'Ninguno';
       if (this.props.cliente[0].tipopersoneria == 'J') {
           personeria = 'Juridico';
       }else if (this.props.cliente[0].tipopersoneria == 'N') {
           personeria = 'Natural';
       }
        return (
            <div className="form-group-content col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                style={{'marginTop': '-20px'}}>

                    {(this.state.openImage)?
                        <Lightbox
                            onCloseRequest={this.closeImagen.bind(this)}
                            mainSrc={this.props.cliente[0].foto}
                        />
                    :''}

                <div className="form-group-content" style={{'padding': '0'}}>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input 
                                    readOnly={true}
                                    value={codigoCliente}
                                    title='Codigo'
                                    permisions={this.permisions.codigo}
                                    //configAllowed={this.state.configCodigo}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">

                                <Input 
                                    readOnly={true}
                                    value={(this.props.cliente[0].tipo == null)?'Sin Codigo':this.props.cliente[0].tipo}
                                    title='Tipo Cliente'
                                    permisions={this.permisions.tipo}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input 
                                    readOnly={true}
                                    value={personeria}
                                    title='Personeria'
                                    permisions={this.permisions.personeria}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">

                                <Input 
                                    readOnly={true}
                                    value={(this.props.cliente[0].fechanac == null)?'Sin Dato':cambiarFormato(this.props.cliente[0].fechanac)}
                                    title={this.props.cliente[0].tipopersoneria === 'J'?"Fecha Fundacion":"Fecha Nacimiento"}
                                    permisions={this.permisions.fecha_nac}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-9 cols-md-9 cols-sm-6 cols-xs-12">
                                <Input 
                                    readOnly={true}
                                    value={(this.props.cliente[0].apellido == null)?
                                            this.props.cliente[0].nombre:
                                            this.props.cliente[0].nombre + ' ' + this.props.cliente[0].apellido}
                                    title='Nombre'
                                    permisions={this.permisions.nombre}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input 
                                    readOnly={true}
                                    value={(this.props.cliente[0].nit == null)?'Sin Nit':this.props.cliente[0].nit}
                                    title='Nit/Ci'
                                    permisions={this.permisions.nit}
                                />
                            </div>
                        </div>

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-3 cols-md-3"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">
                                <Input 
                                    readOnly={true}
                                    value={(this.props.cliente[0].sexo === 'M')?'Masculino':
                                        (this.props.cliente[0].sexo === 'F')?'Femenino':'Sin Definir'}
                                    title='Genero'
                                    permisions={this.permisions.genero}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-6 cols-xs-12">

                                <Input 
                                    readOnly={true}
                                    value={this.props.cliente[0].ciudad}
                                    title='Ciudad'
                                    permisions={this.permisions.ciudad}
                                />
                            </div>
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
                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <TextArea 
                                    value={(this.props.cliente[0].contacto != null)?this.props.cliente[0].contacto:''}
                                    readOnly={true}
                                    title='Contacto'
                                    permisions={this.permisions.contacto}
                                />
                            </div>

                            <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                                <TextArea 
                                    value={(this.props.cliente[0].notas != null)?this.props.cliente[0].notas:''}
                                    readOnly={true}
                                    title='Observaciones'
                                    permisions={this.permisions.observaciones}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            
            </div>
        );

    }
}




