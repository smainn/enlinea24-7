

import React, { Component } from 'react';

import { Modal } from 'antd';

import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import ws from '../../../tools/webservices';
import { httpRequest } from '../../../tools/toolsStorage';

import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Button from '../../../components/data/button';

export default class ShowVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {
            indice: 0,
            visible: false,
            imagen: [],
            tecla: 0,
            configCodigo: false
        }

        this.permisions = {
            ver_nro: readPermisions(keys.vehiculo_ver_nro),
            ver_fecha: readPermisions(keys.vehiculo_ver_fecha),
            codigo: readPermisions(keys.vehiculo_input_codigo),
            placa: readPermisions(keys.vehiculo_input_placa),
            chasis: readPermisions(keys.vehiculo_input_chasis),
            tipo: readPermisions(keys.vehiculo_select_tipo),
            agregar_cliente: readPermisions(keys.vehiculo_btn_agregarCliente),
            ver_cliente: readPermisions(keys.vehiculo_btn_verCliente),
            codigo_cliente: readPermisions(keys.vehiculo_select_search_codigoCliente),
            nombre_cliente: readPermisions(keys.vehiculo_select_search_nombreCliente),
            vehiculo: readPermisions(keys.vehiculo_select_vehiculo),
            caracteristicas: readPermisions(keys.vehiculo_caracteristicas),
            imagenes: readPermisions(keys.vehiculo_imagenes),
            descripcion: readPermisions(keys.vehiculo_textarea_descripcion),
            notas: readPermisions(keys.vehiculo_textarea_nota),
        }
    }

    componentDidMount() {
        this.getConfigsClient();
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
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

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'ArrowRight') {
                this.onChangeNext();
            }
            if(e.key === 'ArrowLeft') {
                this.onChangePreview();
            }
        }
    }

    onChangePreview() {
        if (this.props.imagen.length > 1){
            var indicePreview = this.state.indice;

            if (indicePreview === 0){
                indicePreview = this.props.imagen.length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.setState({
                indice: indicePreview
            })
        }
    }

    onChangeNext() {
        if (this.props.imagen.length > 1){
            var indiceNext = this.state.indice;

            if (indiceNext === (this.props.imagen.length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.setState({
                indice: indiceNext
            })
        }
    }

    cerralModal() {
        this.setState({
            indice: 0,
            tecla: 0,
        });
        this.props.callback();
    }

    abrirImagen() {
        this.setState({
            visible: true,
            tecla: 1,
        });
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            tecla: 0,
        });
    }

    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }

    componentModalImagen() {
        return (
            <Modal
                visible={this.state.visible}
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                closable={false}
                width={600}
                bodyStyle={{'padding': '0 0 0 0'}}
            >
                <div style={{'background': 'red'}} className="content-img">

                    <i className="fa fa-times fa-delete-image" onClick={this.handleCerrarModal.bind(this)}> </i>

                    {(this.props.imagen.length === 0)?'':
                        <img src={this.props.imagen[this.state.indice].foto} 
                            alt="none" className="img-principal"
                            style={{'objectFit': 'fill'}}
                        />
                    }

                    {(this.props.imagen.length > 1)?
                        <div className="pull-left-content">
                            <i onClick={this.onChangePreview.bind(this)}
                                className="fa-left-content fa fa-angle-double-left"> </i>
                        </div>:''
                    }
                    {(this.props.imagen.length > 1)?
                        <div className="pull-right-content">
                            <i onClick={this.onChangeNext.bind(this)}
                                className="fa-right-content fa fa-angle-double-right"> </i>
                        </div>:''
                    }
                
                </div>
            </Modal>
        );
    }

    render() {

        const componentModalImage = this.componentModalImagen();
        let codigoVehiculo = this.props.vehiculo.idvehiculo;
        let codigoCliente = this.props.vehiculo.idcliente;
        if (this.state.configCodigo) {
            codigoVehiculo = this.props.vehiculo.codvehiculo;
            codigoCliente = this.props.vehiculo.codcliente;
        }
        return (
            <div className="forms-groups" style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>
                {componentModalImage}
                <div className="forms-groups"
                    style={{'borderBottom': '1px solid #e8e8e8'}}>

                    
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>
                            
                            <Input 
                                value={codigoVehiculo}
                                readOnly={true}
                                title='Codigo*'
                                permisions={this.permisions.codigo}
                                //configAllowed={this.state.configCodigo}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>

                            <Input 
                                value={this.props.vehiculo.placa}
                                readOnly={true}
                                title='Placa*'
                                permisions={this.permisions.placa}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>

                            <Input 
                                value={(this.props.vehiculo.chasis == null)?'S/Chasis':this.props.vehiculo.chasis}
                                readOnly={true}
                                title='Chasis*'
                                permisions={this.permisions.chasis}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>
                            <Input 
                                value={(this.props.vehiculo.tipopartpublic === 'R'?'Privado':'Publico')}
                                readOnly={true}
                                title='Tipo Uso*'
                                permisions = {this.permisions.tipo}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>

                            <Input 
                                value={codigoCliente}
                                readOnly={true}
                                title='Codigo Cliente*'
                                permisions={this.permisions.codigo_cliente}
                            />
                        </div>

                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>

                            <Input 
                                value={(this.props.vehiculo.apellido == null)?
                                    this.props.vehiculo.nombre:
                                    (this.props.vehiculo.nombre + ' ' + this.props.vehiculo.apellido)}
                                readOnly={true}
                                title='Cliente*'
                                permisions={this.permisions.nombre_cliente}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12" style={{'marginTop': '8px'}}>
                            <Input 
                                value={this.props.vehiculo.descripcion}
                                readOnly={true}
                                title='Vehiculo*'
                                permisions={this.permisions.vehiculo}
                            />
                        </div>
                    </div>

                </div>

                <div className="forms-groups">
                
                    <div className="cols-lg-7 cols-md-7 cols-sm-12 cols-xs-12">
                        <div className="card" style={{ 'height':'265px' }}>
                            <div className="card-header">
                                <label style={{'padding': '2px', 'position': 'relative',
                                    'color': '#5D6160', 'font': '500 18px Roboto', 'marginTop': '4px'}}>
                                    Caracteristica Vehiculo
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
                                {this.props.caracteristica.map(
                                    (resultado, indice) => (
                                        <div key={indice} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                            style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                                            <div className="cols-lg-4 cols-md-4 cols-sm-4">
                                                <input 
                                                    value={resultado.caracteristica}
                                                    readOnly={true}
                                                    style={{cursor: 'not-allowed'}}
                                                    className="forms-control"/>
                                            </div>
                                            <div className="cols-lg-8 cols-md-8 cols-sm-8">
                                                <input
                                                    style={{marginLeft: -5, cursor: 'not-allowed'}}
                                                    value={resultado.descripcion} 
                                                    className="forms-control" 
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                    )

                                )}
                            </div>
                        </div>
                    </div>

                    <div className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12">
                    
                        <div className="card-img-content" style={{'height': '242px', 'border': '1px solid transparent'}}>
                            <div className="img-card" style={{'marginTop': '30px'}}>
                                {(this.props.imagen.length === 0)?
                                    <img src="/images/default.jpg" alt="none" className="img-principal" />:

                                    <img style={{'cursor': 'pointer'}} onClick={this.abrirImagen.bind(this)}
                                        src={this.props.imagen[this.state.indice].foto}
                                        alt="none" className="img-principal" />
                                }

                                {(this.props.imagen.length > 1)?
                                    <div className="pull-left-content">
                                        <i onClick={this.onChangePreview.bind(this)}
                                            className="fa-left-content fa fa-angle-double-left"> </i>
                                    </div>:''
                                }
                                {(this.props.imagen.length > 1)?
                                    <div className="pull-right-content">
                                        <i onClick={this.onChangeNext.bind(this)}
                                            className="fa-right-content fa fa-angle-double-right"> </i>
                                    </div>:''
                                }
                            </div>
                            
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginTop': '12px'}}>
                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                            <TextArea 
                                value={(this.props.vehiculo.detalle === null)?'':this.props.vehiculo.detalle}
                                readOnly={true}
                                title='Descripcion'
                                permisions={this.permisions.descripcion}
                            />
                        </div>

                        <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                        
                            <TextArea 
                                value={(this.props.vehiculo.notas === null)?'':this.props.vehiculo.notas}
                                readOnly={true}
                                title='Notas'
                                permisions={this.permisions.notas}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="pull-right-content">
                            <C_Button
                                title='Cancelar'
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




