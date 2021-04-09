
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { message } from 'antd';
import ws from '../../../utils/webservices';
import 'antd/dist/antd.css';
import { dateToString, convertYmdToDmy } from '../../../utils/toolsDate';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Input from '../../../componentes/data/input';
import C_TextArea from '../../../componentes/data/textarea';
import C_DatePicker from '../../../componentes/data/date';
import Confirmation from '../../../componentes/confirmation';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import keysStorage from '../../../utils/keysStorage';

let dateNext = new Date();
dateNext.setMonth(dateNext.getMonth() + 1);

class CrearHistorialVehiculo extends Component{

    constructor(props){
        super(props);
        this.state = {

            cliente: '',
            vehiculoplaca: '',
            vehiculodescripcion: '',

            nro: 0,
            diagnostico_entrada: '',
            trabajo_hecho: '',
            precio: '',
            km_actual: '',
            km_proximo: '',
            fecha_proxima: convertYmdToDmy(dateToString(dateNext)),
            nota: '',
            fecha: '',

            visible: false,
            loading: false,
            bandera: 0,

            noSesion: false
        }
    }

    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }

    componentDidMount() {

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        //console.log(on_data)
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'venta_create') {
                    var fecha_proxima =on_data.data_actual.vehiculo_historia.fecha_proxima;
                    this.setState({
                        cliente: on_data.data_actual.namecliente,
                        vehiculoplaca: on_data.data_actual.placa_vehiculo,
                        vehiculodescripcion: on_data.data_actual.descripcion_vehiculo,

                        diagnostico_entrada: on_data.data_actual.vehiculo_historia.diagnostico_entrada,
                        trabajo_hecho: on_data.data_actual.vehiculo_historia.trabajo_hecho,
                        precio: on_data.data_actual.vehiculo_historia.precio,
                        km_actual: on_data.data_actual.vehiculo_historia.km_actual,
                        km_proximo: on_data.data_actual.vehiculo_historia.km_proximo,

                        fecha_proxima: (fecha_proxima == '')?this.state.fecha_proxima:fecha_proxima,

                        nota: on_data.data_actual.vehiculo_historia.nota,
                        fecha: on_data.data_actual.vehiculo_historia.fecha,
                    });
                }
            }
        }

        this.getNroHistorico();
    }
    getNroHistorico() {
        httpRequest('get', ws.wsgetnrohistorico)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    nro: result.nro_historico
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onChangeDiagnosticoEntrada(value) {
        this.setState({
            diagnostico_entrada: value
        });
    }

    onChangeTrabajosHechos(value) {
        this.setState({
            trabajo_hecho: value
        });
    }

    onChangeKmActual(value) {
        this.setState({
            km_actual: value
        });
    }

    onChangeKmProximo(value) {
        this.setState({
            km_proximo: value
        });
    }

    onChangeFechaProxima(date) {
        this.setState({
            fecha_proxima: date
        });
    }

    onChangeNota(value) {
        this.setState({
            nota: value
        });
    }
    onSubmitData() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                
                var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;
                
                if (data_actual != null) {
                    data_actual.vehiculo_historia = {
                        diagnostico_entrada: this.state.diagnostico_entrada,
                        trabajo_hecho: this.state.trabajo_hecho,
                        fecha: this.state.fecha,
                        precio: this.state.precio,
                        km_actual: this.state.km_actual,
                        km_proximo: this.state.km_proximo,
                        fecha_proxima: this.state.fecha_proxima,
                        nota: this.state.nota,
                    };
                }

                var objecto_data = {
                    on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                    data_actual: data_actual,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
                
            this.props.history.goBack();
        }, 400);
    }

    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onCancelar.bind(this)}
                    title='Aceptar Historial Vehiculo'
                    onClick={this.onSubmitData.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de guardar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onCancelar.bind(this)}
                    title='Cancelar Historial Vehiculo'
                    onClick={this.onSalir.bind(this)}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de eliminar todos los registros agregados...?
                        </label>
                    }
                />
            )
        }
    }
    onSalir() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {

                var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;

                if (data_actual != null) {
                    data_actual.vehiculo_historia = {
                        diagnostico_entrada: "",
                        trabajo_hecho: "",
                        fecha: '',
                        precio: '',
                        km_actual: "",
                        km_proximo: "",
                        fecha_proxima: "",
                        nota: "",
                    };
                }
                var objecto_data = {
                    on_create: this.validar_data(on_data.on_create)?on_data.on_create:null,
                    data_actual: data_actual,
                    validacion: true,
                };
                saveData( keysStorage.on_data, JSON.stringify(objecto_data) );
            }
                
            this.props.history.goBack();
        }, 400);

    }
    onCancelar() {
        this.setState({
            visible: false,
        });
        setTimeout(() => {
            this.setState({
                bandera: 0,
            });
        }, 300);
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalShow = this.componentModalShow();

        return (
            <div className="rows">

                {componentModalShow}

                <div className="forms-groups">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Nuevo Historia Vehiculo</h1>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <div className='cols-lg-1 cols-md-1'></div>

                    <C_Input 
                        title="Cliente"
                        value={this.state.cliente}
                        readOnly={true}
                        className="cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_Input 
                        title="Placa"
                        value={this.state.vehiculoplaca}
                        readOnly={true}
                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                    />

                    <C_Input 
                        title="Descripcion"
                        value={this.state.vehiculodescripcion}
                        readOnly={true}
                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <C_TextArea 
                        title="Diagnostico Entrada"
                        value={this.state.diagnostico_entrada}
                        onChange={this.onChangeDiagnosticoEntrada.bind(this)}
                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                    />

                    <C_TextArea 
                        title="Diagnostico Salida"
                        value={this.state.trabajo_hecho}
                        onChange={this.onChangeTrabajosHechos.bind(this)} 
                        className="cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-normal"
                    />
                
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        title="Orden de Trabajo"
                        value={'00' + this.state.nro}
                        style={{textAlign: 'right', paddingRight: 15, }}
                        readOnly={true}
                    />
                    <div className="cols-lg-6 cols-md-6"></div>
                    <C_Input
                        title="Fecha"
                        value={this.state.fecha}
                        readOnly={true}        
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <C_Input 
                        title="Precio"
                        value={this.state.precio}
                        style={{textAlign: 'right', paddingRight: 15, }}
                        readOnly={true}
                        className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    <div className='cols-lg-7 cols-md-7'></div>
                    <C_DatePicker 
                        allowClear={false}
                        value={this.state.fecha_proxima}
                        onChange={this.onChangeFechaProxima.bind(this)}
                        title="Proxima Fecha"
                        className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-normal"
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    <div className='cols-lg-2 cols-md-2'></div>
                    
                    <C_Input 
                        title="Km/Milla Actual"
                        value={this.state.km_actual}
                        onChange={this.onChangeKmActual.bind(this)}
                        className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal"
                    />
                    
                    <C_Input 
                        title="Km/Milla Proximo"
                        value={this.state.km_proximo}
                        onChange={this.onChangeKmProximo.bind(this)}
                        className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12 pt-normal"
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
                            onClick={() => this.setState({visible: true, bandera: 1, })}
                        />
                        <C_Button
                            title='Cancelar'
                            type='danger'
                            onClick={() => this.setState({visible: true, bandera: 2, })}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CrearHistorialVehiculo);