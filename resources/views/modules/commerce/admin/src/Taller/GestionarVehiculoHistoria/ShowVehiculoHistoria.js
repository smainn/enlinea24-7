
import React, { Component } from 'react';

import {cambiarFormato} from '../../../tools/toolsDate'
import TextArea from '../../../components/textarea';
import Input from '../../../components/input';
import C_Button from '../../../components/data/button';

export default class ShowVehiculoHistoria extends Component{

    constructor(props) {
        super(props);
    }
    cerrarModal() {
        this.props.callback();
    }

    render() {
        // console.log('HISTORIAL VEHICULO ', this.props.vehiculoHistoria);
        return (
            <div className="form-group-content" style={{'marginTop': '-15px', 'marginBottom': '-20px'}}>
                

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                
                    <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                    
                        <Input 
                            title='Cliente*'
                            readOnly={true}
                            value={(this.props.vehiculoHistoria.apellido == null)?
                                this.props.vehiculoHistoria.nombre:
                                (this.props.vehiculoHistoria.nombre + ' ' + this.props.vehiculoHistoria.apellido)}

                        />
                    </div>

                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                    
                        <Input 
                            title='Placa*'
                            readOnly={true}
                            value={this.props.vehiculoHistoria.placa}
                        />
                    </div>

                    <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                    
                        <Input 
                            title='Vehiculo*'
                            readOnly={true}
                            value={this.props.vehiculoHistoria.descripcion}
                        />
                    </div>
                    {(this.props.precio == null)?'':
                    
                        <div className="col-lg-4-content col-md-4-content col-sm-2-content col-xs-2-content">
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                <label className='label-content-modal label-group-content-nwe'>Precio:</label>
                            </div>
                            <div className="col-lg-6-content col-md-6-content col-sm-6-content col-xs-6-content">
                                <label>{this.props.precio}</label>
                            </div>
                        </div>
                    }
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                
                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                    
                        <Input 
                            title='Km Actual*'
                            readOnly={true}
                            value={this.props.vehiculoHistoria.kmactual}
                        />
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">

                        <Input 
                            title='Km Proximo*'
                            value={this.props.vehiculoHistoria.kmproximo}
                            readOnly={true}
                        />
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                    
                        <Input 
                            readOnly={true}
                            title='Fecha Proxima*'
                            value={cambiarFormato(this.props.vehiculoHistoria.fechaproxima)}
                        />
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                
                    <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                    
                        <TextArea 
                            readOnly={true}
                            value={(this.props.vehiculoHistoria.diagnosticoentrada != null)?
                                this.props.vehiculoHistoria.diagnosticoentrada:''}
                            title='Diagnostico Entrada'
                        /> 
                    </div>

                    <div className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12">
                    
                        <TextArea 
                            readOnly={true}
                            title='Trabajos Hechos'
                            value={(this.props.vehiculoHistoria.trabajoshechos != null)?
                                this.props.vehiculoHistoria.trabajoshechos:''}
                        />
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <TextArea 
                            readOnly={true}
                            value={(this.props.vehiculoHistoria.notas != null)?
                                this.props.vehiculoHistoria.notas:''}
                            title='Notas'
                        />
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" style={{'marginTop': '-10px'}}>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="pulls-right">
                            <C_Button
                                title='Aceptar'
                                type='primary'
                                onClick={this.cerrarModal.bind(this)}
                            />
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}