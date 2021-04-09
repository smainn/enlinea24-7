
import React, { Component } from 'react';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class CrearHistorialVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {

            diagnosticoEntradaVehiculoHistorial: '',
            trabajoHechosVehiculoHistorial: '',
            precioVehiculoHistorial: 0,
            kmActualVehiculoHistorial: '',
            kmProximoVehiculoHistorial: '',
            fechaProximaVehiculoHistorial: '',
            notaVehiculoHistorial: '',

            visibleCancelModal: false,
            visibleAceptarModal: false,

            loadCancelModal: false,
            loadAceptarModal: false,

            bandera: 0
        }
    }

    cancelarHistorialVehiculo() {

        this.setState({
            diagnosticoEntradaVehiculoHistorial: '',
            trabajoHechosVehiculoHistorial: '',
            precioVehiculoHistorial: 0,
            kmActualVehiculoHistorial: '',
            kmProximoVehiculoHistorial: '',
            fechaProximaVehiculoHistorial: '',
            loadCancelModal: !this.state.loadCancelModal
        });

        const datosHistorialVehiculo = {

            diagnosticoEntrada: '',
            trabajoHechos: '',
            precio: 0,
            kmActual: '',
            kmProximo: '',
            fechaProxima: ''
            
        };

        setTimeout(() => {

            message.error('dato eliminado exitosamente');

            this.handleCerrar(this.state.bandera);

            this.props.callback(datosHistorialVehiculo);

        }, 500);

    }

    onChangeDiagnosticoEntradaVehiculoHistorial(e) {
        this.setState({
            diagnosticoEntradaVehiculoHistorial: e.target.value
        });
    }

    onChangeTrabajoHechosVehiculoHistorial(e) {
        this.setState({
            trabajoHechosVehiculoHistorial: e.target.value
        });
    }

    onChangePrecioVehiculoHistorial(e) {
        
        var valor = e.target.value;
        var numeros = '0123456789';
        var nuevaCadenaDePrecio = '';
        var bandera = 0;
        var contador = 0;
        
        for (var i = 0; i < valor.length; i++) {
            if (numeros.indexOf(valor.charAt(i), 0) != -1) {
                if (bandera === 0) {
                    if (i === 0) {
                        if (valor.charAt(i) !== '0') {
                            nuevaCadenaDePrecio+= valor.charAt(i);
                        }
                    }else {
                        nuevaCadenaDePrecio+= valor.charAt(i);
                    }
                }else {
                    if (contador < 1) {
                        nuevaCadenaDePrecio+= valor.charAt(i);
                    }else {
                        if ((valor.length - 1) === (i + 1)) {
                            nuevaCadenaDePrecio+= valor.charAt(i + 1);
                        }else {
                            nuevaCadenaDePrecio+= valor.charAt(i);
                        }
                        i = valor.length;
                    }
                    contador++;
                }
            }else {
                if (valor.charAt(i) === '.') {
                    nuevaCadenaDePrecio+= valor.charAt(i);
                    bandera = 1;
                }
            }
        }
        if (nuevaCadenaDePrecio.length === 0) {
            this.state.precioVehiculoHistorial = '0';
        
        }else {

            nuevaCadenaDePrecio = parseFloat(nuevaCadenaDePrecio);
            nuevaCadenaDePrecio = nuevaCadenaDePrecio.toLocaleString("en");
            
            this.state.precioVehiculoHistorial = nuevaCadenaDePrecio;
        
        }

        this.setState({
            precioVehiculoHistorial: this.state.precioVehiculoHistorial
        });

    }

    onChangeKmActualVehiculoHistorial(e) {
        this.setState({
            kmActualVehiculoHistorial: e.target.value
        });
    }

    onChangeKmProximoVehiculoHistorial(e) {
        this.setState({
            kmProximoVehiculoHistorial: e.target.value
        });
    }

    onChangeFechaProximaVehiculoHistorial(e) {
        this.setState({
            fechaProximaVehiculoHistorial: e.target.value
        });
    }

    onChangeNotaVehiculoHistorial(e) {
        this.setState({
            notaVehiculoHistorial: e.target.value
        });
    }

    abrirModal(bandera) {
        if (bandera === 1) {
            this.setState({
                bandera: bandera,
                visibleAceptarModal: !this.state.visibleAceptarModal
            });
        }else {
            if (bandera === 2) {
                this.setState({
                    bandera: bandera,
                    visibleCancelModal: !this.state.visibleCancelModal
                });
            }
        }
    }

    handleCerrar(bandera) {
        if (bandera === 1) {
            this.setState({
                visibleAceptarModal: !this.state.visibleAceptarModal,
                bandera: 0,
                loadAceptarModal: !this.state.loadAceptarModal
            });
        }else {
            if (bandera === 2) {
                this.setState({
                    visibleCancelModal: !this.state.visibleCancelModal,
                    bandera: 0,
                    loadCancelModal: !this.state.loadCancelModal
                });
            }
        }
        
    }

    aceptarHistorialVehiculo() {

        const datosHistorialVehiculo = {

            diagnosticoEntrada: this.state.diagnosticoEntradaVehiculoHistorial,
            trabajoHechos: this.state.trabajoHechosVehiculoHistorial,
            precio: this.state.precioVehiculoHistorial,
            kmActual: this.state.kmActualVehiculoHistorial,
            kmProximo: this.state.kmProximoVehiculoHistorial,
            fechaProxima: this.state.fechaProximaVehiculoHistorial
            
        };

        this.setState({
            loadAceptarModal: !this.state.loadAceptarModal
        });

        setTimeout(() => {

            this.handleCerrar(this.state.bandera);

            message.success('datos guardados exitosamente');

            this.props.callback(datosHistorialVehiculo);

        }, 500);

    }

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Modal
                    title='Aceptar Historial'
                    visible={this.state.visibleAceptarModal}
                    onOk={this.handleCerrar.bind(this, this.state.bandera)}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    footer={null}
                    width={400}
                >
                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadAceptarModal)?'none':'block'}}>
                            <div className='form-group-content' 
                                    style={{'marginTop': '-10px'}}>
                                <div className="text-center-content">
                                    <label>Estas seguro de guardar todos los registros agregados?</label>
                                </div>
                            </div>
                            <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button type="button" 
                                        onClick={this.aceptarHistorialVehiculo.bind(this)}
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button>
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadAceptarModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            
            )
        }
        if (this.state.bandera === 2) {
            return (
                <Modal
                    title='Cancelar Historial'
                    visible={this.state.visibleCancelModal}
                    onOk={this.handleCerrar.bind(this, this.state.bandera)}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    footer={null}
                    width={400}
                >
                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadCancelModal)?'none':'block'}}>
                            <div className='form-group-content' 
                                style={{'marginTop': '-10px'}}>
                                <div className="text-center-content">
                                    <label>Estas seguro de eliminar todos los registros agregados?</label>
                                </div>
                            </div>
                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
                                
                                <div className="pull-right-content"
                                    style={{'marginRight': '-10px'}}>
                                    <button type="button" 
                                        onClick={this.cancelarHistorialVehiculo.bind(this)}
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button>
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                            Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-content"
                            style={{
                                'display': (this.state.loadCancelModal)?'block':'none',
                                'marginTop': '-15px'
                            }}>
                            <div className="text-center-content">
                                <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                
                            </div>
                            <div className="text-center-content"
                                style={{'marginTop': '20px'}}>
                                <label> Cargando Informacion Favor de Esperar ...</label>
                            </div>

                        </div>
                    </div>

                </Modal>
            )
        }
    }

    render() {

        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="form-group-content">

                {componentModalShow}
                       
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                
                    <div className="col-lg-4-content col-md-4-content col-sm-4-content col-xs-12-content">
                        
                        <label className="label-group-content"
                            style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                Nro Historial: <span className="label-group-content">005</span>
                        </label>
                        
                    </div>
       
                    <div className="col-lg-8-content col-md-8-content col-sm-8-content col-xs-12-content">
                        <div className="pull-right-content">
                            <div className="input-group-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                        Fecha: 
                                    <span style={{'color': '#868686'}}>
                                        {'  ' + this.props.fechaActual}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                </div>


                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <label className="label-group-content"
                            style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                Cliente: <span className="label-group-content">{this.props.cliente}</span>
                        </label>
                    </div>
                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className="label-group-content"
                            style={{'color': '#053079', 'marginLeft': '-8px'}}>
                            Placa: <span className="label-group-content">{this.props.vehiculoDelcliente.placa}</span>
                        </label>
                    </div>
                    <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className="label-group-content"
                            style={{'color': '#053079', 'marginLeft': '-8px'}}>
                            Descripcion: <span className="label-group-content">{this.props.vehiculoDelcliente.descripcion}</span>
                        </label>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                    style={{
                            'marginTop': '-10px',
                            'borderTop': '1px solid #e8e8e8',
                            'paddingTop': '20px',
                        }}>
                    
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <textarea value={this.state.diagnosticoEntradaVehiculoHistorial}
                            onChange={this.onChangeDiagnosticoEntradaVehiculoHistorial.bind(this)} 
                            className="form-textarea-content textareaHeight-4 cursorAuto">
                        </textarea>
                        <label className="label-group-content">Diagnostico Entrada</label>
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <textarea value={this.state.trabajoHechosVehiculoHistorial}
                            onChange={this.onChangeTrabajoHechosVehiculoHistorial.bind(this)}
                            className="form-textarea-content textareaHeight-4 cursorAuto">
                        </textarea>
                        <label className="label-group-content">Trabajo Realizado</label>
                    </div>
                
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                    style={{'borderTop': '1px solid #e8e8e8', 'marginTop': '10px'}}>
                    <label className="label-group-content"
                        style={{'color': '#053079'}}>
                            Nro de Orden de Trabajo: <span className="label-group-content">005</span>
                    </label>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                        <input type="text" 
                            value={this.state.precioVehiculoHistorial} 
                            onChange={this.onChangePrecioVehiculoHistorial.bind(this)}
                            className='form-control-content reinicio-padding'
                            placeholder=" Ingresar precio"/>
                        <label className='label-group-content'>Precio*</label>
                    </div>
                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        <input type="text" 
                            value={this.state.kmActualVehiculoHistorial} 
                            onChange={this.onChangeKmActualVehiculoHistorial.bind(this)}
                            className='form-control-content reinicio-padding'
                            placeholder=" Ingresar Km/Milla Actual"/>
                        <label className='label-group-content'>Km/Milla Actual </label>
                    </div>
                    <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                        <input type="text" 
                            value={this.state.kmProximoVehiculoHistorial} 
                            onChange={this.onChangeKmProximoVehiculoHistorial.bind(this)}
                            className='form-control-content reinicio-padding'
                            placeholder=" Ingresar Proximo Km/Milla"/>
                        <label className='label-group-content'> Km/Milla Proximo</label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                        <input type="date" 
                            value={this.state.fechaProximaVehiculoHistorial} 
                            onChange={this.onChangeFechaProximaVehiculoHistorial.bind(this)}
                            className='form-control-content reinicio-padding'
                        />
                        <label className='label-group-content'>Proxima fecha </label>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <textarea value={this.state.notaVehiculoHistorial}
                            onChange={this.onChangeNotaVehiculoHistorial.bind(this)}
                            className="form-textarea-content cursorAuto">
                        </textarea>
                        <label className="label-group-content">Nota</label>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="text-center-content">
                        <button onClick={this.abrirModal.bind(this, 1)}
                            type="button" className="btn-content btn-sm-content btn-blue-content"
                            style={{'marginRight': '20px'}}>
                            Aceptar y Guardar
                        </button>
                        <button type="button" onClick={this.abrirModal.bind(this, 2)}
                            className="btn-content btn-sm-content btn-cancel-content">
                            Cancelar y Guardar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}