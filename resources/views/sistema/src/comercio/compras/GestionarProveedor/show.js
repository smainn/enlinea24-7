
import React, { Component } from 'react';

import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import ws from '../../../utils/webservices';
import { httpRequest } from '../../../utils/toolsStorage';

import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';

export default class ShowProveedor extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            openImage: false,
            configCodigo: false
        }

        this.permisions = {
            verNro: readPermisions(keys.proveedor_ver_nro),
            verFecha: readPermisions(keys.proveedor_ver_fecha),
            codigo: readPermisions(keys.proveedor_input_codigo),
            nombre: readPermisions(keys.proveedor_input_nombre),
            apellido: readPermisions(keys.proveedor_input_apellido),
            nit: readPermisions(keys.proveedor_input_nit),
            ciudad: readPermisions(keys.proveedor_select_ciudad),
            estado: readPermisions(keys.proveedor_select_estado),
            caracteristicas: readPermisions(keys.proveedor_caracteristicas),
            imagenes: readPermisions(keys.proveedor_imagenes),
            notas: readPermisions(keys.proveedor_textarea_nota),
            descripciones: readPermisions(keys.proveedor_textarea_descripcion),
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
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
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


    visualizarImagen() {
        if (this.props.proveedor == null) {
            return null;
        }else {
            if (this.props.proveedor.foto != null) {
                return (
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="card-img-content" style={{'border': 'none'}}>
                            <div className="img-card">
                                <img src={this.props.proveedor.foto} 
                                    style={{'cursor': 'pointer'}}
                                    onClick={this.abrirImagen.bind(this)}
                                    alt="none" className='img-principal' />
                            </div>
                        </div>
                    </div>
                )
            }else {
                return (
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="card-img-content" style={{'border': 'none'}}>
                            <div className="img-card">
                                <img src="/images/default.jpg"
                                alt="none" className="img-principal"/>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        
    }

    cerrarModal() {
        this.props.callback();
    }

    render() {
        let proveedor = this.props.proveedor;
        let codigo = '';
        let ciudad = '';
        let estado = '';
        let nombre = '';
        let nit = '';
        let contacto = '';
        let notas = '';
        if (proveedor != null) {
            let codproveedor = proveedor.codproveedor;
            let id = proveedor.idproveedor;
            codigo = (codproveedor == null || !this.state.configCodigo) ? id : codproveedor;
            ciudad = proveedor.ciudad == null ? 'S/Ciudad' : proveedor.ciudad;
            estado = proveedor.estado === 'A' ? 'Activo' : 'Desactivo';
            nombre = proveedor.apellido == null ? proveedor.nombre : proveedor.nombre + ' ' + proveedor.apellido;
            nit = proveedor.nit == null ? 'S/Nit' : proveedor.nit;
            contacto = proveedor.contactos != null ? proveedor.contactos : '';
            notas = proveedor.notas != null ? proveedor.notas : '';
        }
        return (
            <div className="form-group-content"
                style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>

                {(this.state.openImage)?
                    <Lightbox 
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={proveedor == null ? '' : proveedor.foto}
                    />
                :''}

                <div className="forms-group" style={{'borderBottom': '1px solid #e8e8e8'}}>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12" style={{'marginTop': '10px'}}>
                            <Input 
                                value={codigo}
                                title='Codigo*'
                                readOnly={true}
                                permisions = {this.permisions.codigo}
                                //configAllowed={this.state.configCodigo}
                            />
                        </div>

                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12" style={{'marginTop': '10px'}}>
                            <Input 
                                value={ciudad}
                                title='Ciudad*'
                                readOnly={true}
                                permisions = {this.permisions.ciudad}
                            />
                        </div>

                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12" style={{'marginTop': '10px'}}>
                            
                            <Input 
                                value={estado}
                                title='Estado*'
                                readOnly={true}
                                permisions = {this.permisions.estado}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginBottom': '5px'}}>
                    
                        <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12" style={{'marginTop': '10px'}}>
                        
                            <Input 
                                value={nombre}
                                title='Nombre*'
                                readOnly={true}
                                permisions = {this.permisions.nombre}
                            />
                        
                        </div>

                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12" style={{'marginTop': '10px'}}>
                            
                            <Input 
                                value={nit}
                                title='Nit*'
                                readOnly={true}
                                permisions = {this.permisions.nit}
                            />
                        </div>
                    </div>
                
                </div>

                <div className="forms-groups">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12">

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
                                    {this.props.contacto.map(
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

                        <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                            {this.visualizarImagen()}
                        </div>
                    </div>
                </div>

                <div className="forms-groups">
                
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" style={{'marginTop': '5px'}}>
                            
                            <TextArea 
                                value={contacto}
                                title='Descripcion'
                                readOnly={true}
                                permisions = {this.permisions.descripciones}
                            />
                        </div>

                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" style={{'marginTop': '5px'}}>
                        
                            <TextArea 
                                value={notas}
                                title='Notas'
                                readOnly={true}
                                permisions = {this.permisions.notas}
                            />
                        </div>
                    </div>
                </div>

                <div className="forms-groups" style={{'padding': '2px', 'borderTop': '1px solid #e8e8e8'}}>
                    <div className="pulls-right">
                        <C_Button
                            title='Aceptar'
                            type='primary'
                            onClick={this.cerrarModal.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}