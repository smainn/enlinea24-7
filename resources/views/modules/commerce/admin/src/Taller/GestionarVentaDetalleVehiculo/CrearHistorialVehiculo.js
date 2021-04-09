
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { message } from 'antd';
import ws from '../../../tools/webservices';
import 'antd/dist/antd.css';
import { dateToString } from '../../../tools/toolsDate';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import C_Input from '../../../components/data/input';
import C_TextArea from '../../../components/data/textarea';
import C_DatePicker from '../../../components/data/date';
import Confirmation from '../../../components/confirmation';
import C_Button from '../../../components/data/button';

let dateNext = new Date();
dateNext.setMonth(dateNext.getMonth() + 1);

export default class CrearHistorialVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {

            diagnosticoEntrada: '',
            trabajosHechos: '',
            precio: 0,
            kmActual: '',
            kmProximo: '',
            fechaProxima: dateToString(dateNext),
            nota: '',

            visibleCancelModal: false,
            visibleAceptarModal: false,

            loadCancelModal: false,
            loadAceptarModal: false,
            nroHistorico: 0,
            bandera: 0,
            noSesion: false
        }
    }

    cancelarHistorialVehiculo() {

        this.setState({
            diagnosticoEntrada: '',
            trabajosHechos: '',
            precio: 0,
            kmActual: '',
            kmProximo: '',
            loadCancelModal: true,
        });

        const datosHistorialVehiculo = {

            diagnosticoEntrada: '',
            trabajosHechos: '',
            precio: 0,
            kmActual: '',
            kmProximo: '',
            fechaProxima: '' 
        };
        setTimeout(() => {
            this.handleCerrar(this.state.bandera);
        }, 200);
        
        this.props.callback(datosHistorialVehiculo);

    }

    componentDidMount() {
        //this.getNroHistorico();
        this.cargarDatos();
    }

    cargarDatos() {
        if (this.props.historialVehiculo != null) {
            this.setState({
                diagnosticoEntrada: this.props.historialVehiculo.diagnosticoEntrada,
                trabajosHechos: this.props.historialVehiculo.trabajosHechos,
                kmActual: this.props.historialVehiculo.kmActual,
                kmProximo: this.props.historialVehiculo.kmProximo,
                nota: this.props.historialVehiculo.notas,
            })
        }
    }

    getNroHistorico() {
        httpRequest('get', ws.wsgetnrohistorico)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    nroHistorico: result.nro_historico
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onChangeDiagnosticoEntrada(value) {
        this.setState({
            diagnosticoEntrada: value
        });
    }

    onChangeTrabajosHechos(value) {
        this.setState({
            trabajosHechos: value
        });
    }

    onChangePrecio(e) {
        
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
            this.state.precio = '0';
        
        }else {

            nuevaCadenaDePrecio = parseFloat(nuevaCadenaDePrecio);
            nuevaCadenaDePrecio = nuevaCadenaDePrecio.toLocaleString("en");
            
            this.state.precio = nuevaCadenaDePrecio;
        
        }

        this.setState({
            precio: this.state.precio
        });

    }

    onChangeKmActual(value) {
        this.setState({
            kmActual: value
        });
    }

    onChangeKmProximo(value) {
        this.setState({
            kmProximo: value
        });
    }

    onChangeFechaProxima(date) {
        this.setState({
            fechaProxima: date
        });
    }

    onChangeNota(value) {
        this.setState({
            nota: value
        });
    }

    abrirModal(bandera) {
        if (bandera === 1) {
            this.setState({
                bandera: bandera,
                visibleAceptarModal: !this.state.visibleAceptarModal,
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
                loadAceptarModal: false
            });
        }else {
            if (bandera === 2) {
                this.setState({
                    visibleCancelModal: !this.state.visibleCancelModal,
                    bandera: 0,
                    loadCancelModal: false,
                });
            }
        }
        
    }

    validarDatos() {
        if (this.state.fechaProxima == '') {
            message.warning('La fecha proxima es obligatoria');
            return false;       
        }
        return true;
    }

    aceptarHistorialVehiculo() {

        if (!this.validarDatos()) return;
        const datosHistorialVehiculo = {
            diagnosticoEntrada: this.state.diagnosticoEntrada,
            fecha: this.props.fechaActual,
            trabajosHechos: this.state.trabajosHechos,
            precio: this.props.precio,
            kmActual: this.state.kmActual == '' ? 0 : this.state.kmActual,
            kmProximo: this.state.kmProximo == '' ? 0 : this.state.kmProximo,
            fechaProxima: this.state.fechaProxima,
            notas: this.state.nota
        };

        this.setState({
            loadAceptarModal: true,
        });
        setTimeout(() => {
            this.handleCerrar(this.state.bandera);
        }, 200);
        
        message.success('datos guardados exitosamente');
        this.props.callback(datosHistorialVehiculo);
    }

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Confirmation
                    visible={this.state.visibleAceptarModal}
                    loading={this.state.loadAceptarModal}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    title='Aceptar Historial Vehiculo'
                    onClick={this.aceptarHistorialVehiculo.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de guardar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
        if (this.state.bandera === 2) {
            return (
                <Confirmation
                    visible={this.state.visibleCancelModal}
                    loading={this.state.loadCancelModal}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    title='Cancelar Historial Vehiculo'
                    onClick={this.cancelarHistorialVehiculo.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de eliminar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="forms-groups">

                {componentModalShow}

                <div className="forms-groups">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Historia Vehiculo</h1>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <C_Input 
                        title="Cliente"
                        value={this.props.cliente}
                        readOnly={true}
                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_Input 
                        title="Placa"
                        value={this.props.vehiculoPlaca}
                        readOnly={true}
                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                    />

                    <C_Input 
                        title="Descripcion"
                        value={this.props.vehiculoDescripcion}
                        readOnly={true}
                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <C_TextArea 
                        title="Diagnostico Entrada"
                        value={this.state.diagnosticoEntrada}
                        onChange={this.onChangeDiagnosticoEntrada.bind(this)}
                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                    />

                    <C_TextArea 
                        title="Diagnostico Salida"
                        value={this.state.trabajosHechos}
                        onChange={this.onChangeTrabajosHechos.bind(this)} 
                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                    />
                
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        title="Nro de Orden de Trabajo"
                        value={this.props.nroVenta}
                        readOnly={true}
                    />
                    <div className="cols-lg-6 cols-md-6"></div>
                    <C_Input
                        title="Fecha"
                        value={this.props.fechaActual}
                        readOnly={true}        
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <C_Input 
                        title="Precio"
                        value={this.props.precio}
                        readOnly={true}
                        className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_Input 
                        title="Km/Milla Actual"
                        value={this.state.kmActual}
                        onChange={this.onChangeKmActual.bind(this)}
                        className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_Input 
                        title="Km/Milla Proximo"
                        value={this.state.kmProximo}
                        onChange={this.onChangeKmProximo.bind(this)}
                        className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_DatePicker 
                        allowClear={true}
                        value={this.state.fechaProxima}
                        onChange={this.onChangeFechaProxima.bind(this)}
                        title="Proxima Fecha"
                        className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal"
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <C_TextArea 
                        title="Nota"
                        value={this.state.nota}
                        onChange={this.onChangeNota.bind(this)}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-normal"
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="txts-center">
                        <C_Button
                            title='Aceptar y Guardar'
                            type='primary'
                            onClick={this.abrirModal.bind(this, 1)}
                        />
                        <C_Button
                            title='Cancelar'
                            type='danger'
                            onClick={this.abrirModal.bind(this, 2)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}