

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import Lightbox from 'react-image-lightbox';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest } from '../../../tools/toolsStorage';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Button from '../../../components/data/button';

export default class ShowVendedor extends Component{

    constructor(props){
        super(props);
        this.state = {
            openImage: false,
            configCodigo: false,
            imagen: '',
        }

        this.permisions = {
            codigo: readPermisions(keys.vendedor_input_codigo),
            comision: readPermisions(keys.vendedor_select_comision),
            nit: readPermisions(keys.vendedor_input_nit),
            fecha_nac: readPermisions(keys.vendedor_fechaNacimiento),
            nombre: readPermisions(keys.vendedor_input_nombre),
            apellido: readPermisions(keys.vendedor_input_apellido),
            genero: readPermisions(keys.vendedor_select_genero),
            caracteristicas: readPermisions(keys.vendedor_caracteristicas),
            imagen: readPermisions(keys.vendedor_imagenes),
            notas: readPermisions(keys.vendedor_textarea_nota)
        }
    }

    componentImg() {
        if (this.permisions.imagen.visible == 'A') {
            if (this.props.vendedor.foto == '' || this.props.vendedor.foto == null) {
                return (
                    <img 
                        src='/images/default.jpg'
                        alt="none" className="img-principal" />
                );
                
            } else {
                return (
                    <img 
                        src={this.props.vendedor.foto}
                        onClick={this.abrirImagen.bind(this, this.props.vendedor.foto)}
                        alt="none" className="img-principal" />
                );
            }
        }
        return null;
    }

    componentCaracteristicas() {
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
                            {this.props.referencia.map(
                                (resultado, indice) => (
                                    <div key={indice} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                                        <div className="cols-lg-4 cols-md-4 cols-sm-4">
                                            <Input
                                                value={resultado.referencia}
                                                readOnly={true}
                                                title='Contacto'
                                            />
                                        </div>
                                        <div className="cols-lg-8 cols-md-8 cols-sm-8">
                                            <Input 
                                                value={resultado.dato}
                                                readOnly={true}
                                                title={resultado.referencia}
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

    abrirImagen(imagen) {
        this.setState({
            openImage: true,
            imagen: imagen,
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

    cerralModal() {
        if (typeof this.props.onCancel != 'undefined') {
            this.props.onCancel();
        }
    }

    render() {
        let componentImg = this.componentImg();
        let componentCaracteristicas = this.componentCaracteristicas();

        let estado = this.props.vendedor.estado == 'A' ? 'Activo' : 'No Activo';
        let apellido = this.props.vendedor.apellido == null ? '' : this.props.vendedor.apellido;
        let completo = this.props.vendedor.nombre + ' ' + apellido;
        let sexo = 'Ninguno';
        let nit = this.props.vendedor.nit == null ? '' : this.props.vendedor.nit;
        let nacimiento = this.props.vendedor.fechanac == null ? '' : this.props.vendedor.fechanac;

        if (this.props.vendedor.sexo == 'M') {
            sexo = 'Masculino';
        } else if (this.props.vendedor.sexo == 'F') {
            sexo = 'Femenino';
        }
        let comisionventa = '';
        if (this.props.vendedor.comisionventa != undefined) {
            comisionventa = this.props.vendedor.comisionventa.descripcion;
        }
        let codigoVendedor = this.props.vendedor.idvendedor;
        if (this.state.configCodigo) {
            codigoVendedor = this.props.vendedor.codvendedor == null ? codigoVendedor : this.props.vendedor.codvendedor;
        }

        return (
            <div className="forms-groups" style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>

                {(this.state.openImage)?
                    <Lightbox 
                        onCloseRequest={this.closeImagen.bind(this)}
                        mainSrc={this.state.imagen}
                    />
                :''}

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <C_Input 
                            title="Codigo"
                            value={codigoVendedor}
                            readOnly={true}
                            permisions={this.permisions.codigo}
                            //configAllowed={this.state.configCodigo}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />

                        <C_Input 
                            title="Comision"
                            value={comisionventa}
                            readOnly={true}
                            permisions={this.permisions.comision}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />
                        
                        <C_Input 
                            title="Nit/Ci"
                            value={nit}
                            readOnly={true}
                            permisions={this.permisions.nit}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />
                        
                        <C_Input 
                            title="Fecha Nac"
                            value={nacimiento}
                            readOnly={true}
                            permisions={this.permisions.fecha_nac}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                        <C_Input 
                            title="Nombre"
                            value={completo}
                            readOnly={true}
                            permisions={this.permisions.nombre}
                            className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                        />
                        
                        <C_Input 
                            title="Sexo"
                            value={sexo}
                            readOnly={true}
                            permisions={this.permisions.genero}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />

                        <C_Input 
                            title="Estado"
                            value={estado}
                            readOnly={true}
                            //permisions={permisions}
                            className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                        />
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        { componentCaracteristicas }

                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                                <div className="card-img-content" style={{'border': 'none'}}>
                                    <div className="img-card">
                                        { componentImg }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={(this.props.vendedor.notas == null)?'':this.props.vendedor.notas}
                                readOnly={true}
                                permisions={this.permisions.notas}
                            />
                        </div>

                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="pulls-right">
                            <C_Button
                                title='Cerrar'
                                type='primary'
                                onClick={this.cerralModal.bind(this)}
                            />
                        </div>
                    </div>

                </div>
                
            </div>
        );

    }
}

ShowVendedor.propTypes = {
    referencia: PropTypes.array,
 }
  
 ShowVendedor.defaultProps = {
    referencia: [],
 }



