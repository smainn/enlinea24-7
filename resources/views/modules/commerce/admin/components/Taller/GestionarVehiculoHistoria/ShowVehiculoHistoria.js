
import React, { Component } from 'react';

import {cambiarFormato} from '../../../tools/toolsDate'

export default class ShowVehiculoHistoria extends Component{

    cerrarModal() {
        this.props.callback();
    }

    render() {
        return (
            <div className="form-group-content" style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>
                
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Vehiculo:</label>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.descripcion}</label>
                        </div>
                    </div>
                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Placa:</label>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.placa}</label>
                        </div>
                    </div>
                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Fecha:</label>
                        </div>
                        <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                            <label> {cambiarFormato(this.props.vehiculoHistoria.fecha)}</label>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                    style={{'borderBottom': '1px solid #e8e8e8'}}>         
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Cliente:</label>
                        </div>
                        <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.nombre} {this.props.vehiculoHistoria.apellido}</label>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe'>Diagnostico Entrada:</label>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe'>Trabajos Hechos:</label>
                    </div>

                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <textarea readOnly className="form-textarea-content" 
                            value={(this.props.vehiculoHistoria.diagnosticoentrada != null)?this.props.vehiculoHistoria.diagnosticoentrada:''}>
                        </textarea>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <textarea readOnly className="form-textarea-content" 
                            value={(this.props.vehiculoHistoria.trabajoshechos != null)?this.props.vehiculoHistoria.trabajoshechos:''}>
                        </textarea>
                    </div>
                
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Precio:</label>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.precio}</label>
                        </div>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Proxima Fecha:</label>
                        </div>
                        <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                            <label> {cambiarFormato(this.props.vehiculoHistoria.fechaproxima)}</label>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                    style={{'borderBottom': '1px solid #e8e8e8', 'marginBottom': '5px'}}>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Km Actual:</label>
                        </div>
                        <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.kmactual}</label>
                        </div>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                            <label className='label-content-modal label-group-content-nwe'>Km Proximo:</label>
                        </div>
                        <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                            <label> {this.props.vehiculoHistoria.kmproximo}</label>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        <textarea readOnly className="form-textarea-content" 
                            value={(this.props.vehiculoHistoria.notas != null)?this.props.vehiculoHistoria.notas:''}>
                        </textarea>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal label-group-content-nwe'>Notas:</label>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="pull-right-content">
                            <a onClick={this.cerrarModal.bind(this)}
                                className="btn-content btn-sm-content btn-blue-content">
                                    Aceptar
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}