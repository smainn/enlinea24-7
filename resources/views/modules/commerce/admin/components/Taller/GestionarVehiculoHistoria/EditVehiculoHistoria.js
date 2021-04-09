
import React, { Component } from 'react';

import axios from 'axios';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class EditVehiculoHistoria extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            seleccionCliente: true,
            idCliente: 0,
            nombreCliente: '',

            diagnosticoEntradaVehiculoHistoria: '',
            trabajoHechosVehiculoHistoria: '',

            precioVehiculoHistoria: 0,
            precioRegistradoVehiculoHistoria: 0,

            kmActualVehiculoHistoria: '',
            kmProximoVehiculoHistoria: '',
            fechaProximaVehiculoHistoria: '',
            notaVehiculoHistoria: '',

            idVehiculo: 0,

            vehiculosDelcliente: [],

            buscarCliente: '',

            cliente: [],
            control: true,

            visible: false,
            loadModal: false,
        }
    }

    regresarListadoVehiculoHistoria() {
        const vehiculoHistoria = {
            bandera : 0
        }
        
        this.props.callback(vehiculoHistoria);

        this.setState({
            loadModal: false,
            idCliente: 0,
            nombreCliente: '',

            diagnosticoEntradaVehiculoHistoria: '',
            trabajoHechosVehiculoHistoria: '',

            precioVehiculoHistoria: 0,
            precioRegistradoVehiculoHistoria: 0,

            kmActualVehiculoHistoria: '',
            kmProximoVehiculoHistoria: '',
            fechaProximaVehiculoHistoria: '',
            notaVehiculoHistoria: '',

            idVehiculo: 0,
            vehiculosDelcliente: [],

            buscarCliente: '',

            cliente: [],
            control: true,

        });
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        if (e.key === 'Escape') {
            this.cerrarSeleccionCliente();
        }
        
    }

    cerrarSeleccionCliente(){
        this.setState({
            seleccionCliente: true,
            buscarCliente: '',
        });
    }

    abrirSeleccionCliente() {
        this.setState({
            seleccionCliente: !this.state.seleccionCliente,
            cliente: this.props.cliente,
            buscarCliente: '',
        });
    }

    deleteCliente() {
        this.setState({
            idCliente: 0,
            nombreCliente: '',
            seleccionCliente: true,
            idVehiculo: 0,
            buscarCliente: '',
            cliente: this.props.cliente,
            control: false,
        });
    }

    onchangeSeleccionCliente(e) {
        this.setState({
            idCliente: e.target.id,
            nombreCliente: e.target.value,
            seleccionCliente: true,
            buscarCliente: '',
            cliente: this.props.cliente,
            control: false,
            idVehiculo: 0
        });
        this.getVehiculoDelCliente(e.target.id);

    }

    getVehiculoDelCliente(idCliente) {
        axios.get('/commerce/admin/getVehiculo?id=' + idCliente + '').then(
            resultado => {
                if (resultado.data.ok) {
                    this.setState({
                        vehiculosDelcliente: resultado.data.data
                    });
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        );

    }

    onChangeVehiculo(e) {
        this.setState({
            idVehiculo: e.target.value,
            control: false,
        });
    }

    onChangeDiagnosticoEntradaVehiculoHistoria(e) {
        this.setState({
            diagnosticoEntradaVehiculoHistoria: e.target.value,
            control: false,
        });
    }

    onChangeTrabajoHechosVehiculoHistoria(e) {
        this.setState({
            trabajoHechosVehiculoHistoria: e.target.value,
            control: false,
        });
    }

    onChangeFechaProximaVehiculoHistoria(e){
        
        if(e.target.value < this.props.fechaFormato){
            if (e.target.value === '') {
                this.setState({
                    fechaProximaVehiculoHistoria: e.target.value,
                    control: false,
                });
            }else {
                message.error("Fecha Invalida");
            }
        }else{
            this.setState({
                fechaProximaVehiculoHistoria: e.target.value,
                control: false,
            });
        }

    }

    onChangeKmActualVehiculoHistoria(e) {
        this.setState({
            kmActualVehiculoHistoria: e.target.value,
            control: false,
        });
    }

    onChangeKmProximoVehiculoHistoria(e){
        this.setState({
            kmProximoVehiculoHistoria: e.target.value,
            control: false,
        });
    }

    onChangePrecioVehiculoHistoria(e) {

        var valor = e.target.value;
        var numeros = '0123456789';
        var nuevaCadenaDePrecio = '';
        
        for (var i = 0; i < valor.length; i++) {
            if (numeros.indexOf(valor.charAt(i), 0) != -1) {
                
                if (i === 0) {
                    if (valor.charAt(i) !== '0') {
                        nuevaCadenaDePrecio+= valor.charAt(i);
                    }
                }else {
                    nuevaCadenaDePrecio+= valor.charAt(i);
                }
                
            }
        }
        if (nuevaCadenaDePrecio.length === 0) {
            this.state.precioVehiculoHistoria = '0'; 
            this.state.precioRegistradoVehiculoHistoria = '0';     
        
        }else{
            this.state.precioRegistradoVehiculoHistoria = nuevaCadenaDePrecio;

            nuevaCadenaDePrecio = parseFloat(nuevaCadenaDePrecio);

            nuevaCadenaDePrecio = nuevaCadenaDePrecio.toLocaleString("en");
            
            this.state.precioVehiculoHistoria = nuevaCadenaDePrecio;
        }

        this.setState({
            precioVehiculoHistoria: this.state.precioVehiculoHistoria,
            precioRegistradoVehiculoHistoria: this.state.precioRegistradoVehiculoHistoria,
            control: false,
        });
    }

    onChangeNotaVehiculoHistoria(e) {
        this.setState({
            notaVehiculoHistoria: e.target.value,
            control: false,
        });
    }

    onChangeKeyPressBuscarCliente(e) {
        
    }

    onChangeBuscarCliente(e) {
        this.setState({
            buscarCliente: e.target.value,
            control: false,
        });
        this.actualizarListaCliente(e.target.value);
    }

    actualizarListaCliente(dato) {
        const texto = dato.toLowerCase();

        this.state.cliente = [];

        for (var i = 0; i < this.props.cliente.length; i++) {

            var nombreCompleto = this.props.cliente[i].nombre + ' ' + this.props.cliente[i].apellido;
            nombreCompleto = nombreCompleto.toLowerCase();

            if (nombreCompleto.includes(texto)) {
                this.state.cliente.push(this.props.cliente[i]);
            }
        }
        this.setState({
            cliente: this.state.cliente
        });
    }

    onSubmit(e) {      
        e.preventDefault();

        if ((this.state.idCliente != 0) && (this.state.idVehiculo != 0) && 
            (this.state.precioRegistradoVehiculoHistoria > 0)) {
            this.setState({
                visible: true
            });

        }else {
            this.analizarValidacion();
        }
    }

    onSubmitGuardarDatos(e) {
        
        e.preventDefault();

        this.setState({
            loadModal: true,
        });

        if ((this.state.idCliente != 0) && (this.state.idVehiculo != 0) && 
            (this.state.precioRegistradoVehiculoHistoria > 0)) {

            const formData = new FormData();

            formData.append('diagnosticoEntrada', this.state.diagnosticoEntradaVehiculoHistoria);
            formData.append('trabajoHecho', this.state.trabajoHechosVehiculoHistoria);
            formData.append('precio', this.state.precioRegistradoVehiculoHistoria);
            formData.append('kmActual', this.state.kmActualVehiculoHistoria);
            formData.append('kmProximo', this.state.kmProximoVehiculoHistoria);
            formData.append('fechaProxima', this.state.fechaProximaVehiculoHistoria);
            formData.append('nota', this.state.notaVehiculoHistoria);

            formData.append('idCliente', this.state.idCliente);
            formData.append('idVehiculo', this.state.idVehiculo);

            formData.append('idVehiculoHistoria', this.props.vehiculoHistoria.idvehiculohistoria);

            if (!this.state.control) {

                axios.post('/commerce/admin/updateVehiculoHistoria', formData).then(
                    response => {          
                        if (response.data.response === 1) {
    
                            this.regresarListadoVehiculoHistoria();
    
                            this.handleCerrarModal();       
    
                            message.success('datos guardados exitosamente');
    
                        }
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                );
            }else {
                this.regresarListadoVehiculoHistoria();
    
                this.handleCerrarModal();       

                message.success('datos guardados exitosamente');
            }

        }else {
            this.analizarValidacion();
        }
    }

    analizarValidacion() {
        if (this.state.idCliente == 0) {
            message.error('Campo cliente requerido');
        }
        if (this.state.idVehiculo == 0) {
            message.error('Campo vehiculo requerido');
        }
        if (this.state.precioRegistradoVehiculoHistoria < 1) {
            message.error('campo precio requerido');
        }
    }

    handleCerrarModal() {
        this.setState({
            visible: false,
            loadModal: false
        });
    }

    onChangeShow() {
        return (
            <Modal
                visible={this.state.visible}
                title='Editar Historia Vehiculo'
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                width={400}
            >

                <div>
                    <div className="form-group-content"
                        style={{'display': (this.state.loadModal)?'none':'block'}}>
                        
                        <form onSubmit={this.onSubmitGuardarDatos.bind(this)} encType="multipart/form-data">
                            
                            <div className="text-center-content"
                                style={{'marginTop': '-15px'}}>
                                
                                <label className='label-group-content'>
                                    Estas seguro de actualizar los datos?
                                </label>
                            
                            </div>

                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
    
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button type="submit" 
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button> 
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrarModal.bind(this)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    </div>
                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadModal)?'block':'none',
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

    cargarDatos() {
        if (this.props.bandera === 1) {
            if (this.state.control) {
                this.state.cliente = this.props.cliente;
                this.getVehiculoDelCliente(this.props.vehiculoHistoria.idcliente);
                this.state.idCliente = this.props.vehiculoHistoria.idcliente;
                this.state.nombreCliente = this.props.vehiculoHistoria.nombre + ' ' + this.props.vehiculoHistoria.apellido;
                this.state.idVehiculo = this.props.vehiculoHistoria.idvehiculo;
                this.state.diagnosticoEntradaVehiculoHistoria = (this.props.vehiculoHistoria.diagnosticoentrada === null)?'':this.props.vehiculoHistoria.diagnosticoentrada;
                this.state.trabajoHechosVehiculoHistoria = (this.props.vehiculoHistoria.trabajoshechos === null)?'':this.props.vehiculoHistoria.trabajoshechos;
                
                this.state.precioRegistradoVehiculoHistoria = this.props.vehiculoHistoria.precio;
                
                var nuevaCadenaDePrecio = parseFloat(this.props.vehiculoHistoria.precio);

                nuevaCadenaDePrecio = nuevaCadenaDePrecio.toLocaleString("en");
                this.state.precioVehiculoHistoria = nuevaCadenaDePrecio;
                
                this.state.kmActualVehiculoHistoria = (this.props.vehiculoHistoria.kmactual === null)?'':this.props.vehiculoHistoria.kmactual;
                this.state.kmProximoVehiculoHistoria = (this.props.vehiculoHistoria.kmproximo === null)?'':this.props.vehiculoHistoria.kmproximo;
                this.state.fechaProximaVehiculoHistoria = (this.props.vehiculoHistoria.fechaproxima === null)?'':this.props.vehiculoHistoria.fechaproxima;
                this.state.notaVehiculoHistoria = (this.props.vehiculoHistoria.notas === null)?'':this.props.vehiculoHistoria.notas;
            }
        }
    }

    render() {

        const componentShow = this.onChangeShow();

        this.cargarDatos();
        
        return (
            <div className="row-content"
                style={{'display': (!this.props.visibleEditar)?'none':'block'}}>

                {componentShow}

                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Editar Historia Vehiculo </h1>
                    </div>
                    <div className="pull-right-content">
                        <a onClick={this.regresarListadoVehiculoHistoria.bind(this)}
                            className="btn-content btn-sm-content btn-primary-content">
                            Atras
                        </a>
                    </div>
                </div>
                <div className="card-body-content">

                    <form className="form-content" onSubmit={this.onSubmit.bind(this)}
                            encType="multipart/form-data">

                        <div className="form-group-content" style={{'padding': '0 0 0 0'}}>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                onClick={this.cerrarSeleccionCliente.bind(this)}>
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
                        
                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                style={{'borderTop': '1px solid #e8e8e8'}}>
                                
                                <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <div style={{'width': '100%'}} onClick={this.abrirSeleccionCliente.bind(this)}>
                                            
                                            <input type="text" readOnly style={{'cursor': 'pointer', 'textAlign': 'left'}}
                                                className='form-control-content' 
                                                value={(this.state.idCliente === 0)?' Favor de seleccionar Cliente...':this.state.nombreCliente}
                                            />

                                            {(this.state.idCliente === 0)?
                                                <i className="fa fa-caret-down fa-content" > </i>:
                                                <i className="fa fa-times fa-content" onClick={this.deleteCliente.bind(this)}> </i>
                                            }
                                            <label className='label-group-content'>Cliente*</label>
    
                                        </div>

                                        <div className="menu-content" 
                                            style={{'display': (this.state.seleccionCliente)?'none':'block'}}
                                            >
                                            <div className="sub-menu-content">

                                                <input type="text" maxLength="50" 
                                                    value={this.state.buscarCliente}
                                                    onChange={this.onChangeBuscarCliente.bind(this)}
                                                    onKeyPress={this.onChangeKeyPressBuscarCliente.bind(this)}
                                                    ref={function(input) {if (input != null) {input.focus();}}}
                                                    className="form-control-outline-content" />

                                                <i className="fa fa-search fa-content" style={{'top': '2px'}}> </i>

                                            </div>
                                            {this.state.cliente.map(
                                                    (resultado, indice) => {
                                                        return (
                                                            <div key={indice} className="sub-menu-content">
                                                                <input type="text" 
                                                                    className={(this.state.idCliente == resultado.idcliente)?'input-content active':'input-content'}
                                                                    onClick={this.onchangeSeleccionCliente.bind(this)}
                                                                    id={resultado.idcliente} readOnly value={resultado.nombre + ' ' + resultado.apellido} />
                                                            </div>
                                                        )
                                                    }
                                                )
                                            }
                                        </div> 

                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content"
                                    onClick={this.cerrarSeleccionCliente.bind(this)}>
                                    <div className="input-group-content" >
                                        <select value={this.state.idVehiculo} 
                                            onChange={this.onChangeVehiculo.bind(this)}
                                            className='form-control-content'>
                                            <option value={0}> Seleccionar </option>
                                            {this.state.vehiculosDelcliente.map(
                                                (resultado, indice) => (
                                                    <option key={indice} value={resultado.idvehiculo}>{resultado.placa}</option>
                                                )
                                            )}
                                        </select>
                                        <label className='label-group-content'>Placa*</label>
                                    </div>
                                </div>

                                <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content"
                                    onClick={this.cerrarSeleccionCliente.bind(this)}>
                                    <div className="input-group-content" >
                                        <select value={this.state.idVehiculo} 
                                            onChange={this.onChangeVehiculo.bind(this)}
                                            className='form-control-content'>
                                            <option value={0}> Seleccionar </option>
                                            {this.state.vehiculosDelcliente.map(
                                                (resultado, indice) => (
                                                    <option key={indice} value={resultado.idvehiculo}>{resultado.descripcion}</option>
                                                )
                                            )}
                                        </select>
                                        <label className='label-group-content'>Vehiculo*</label>
                                    </div>
                                </div>

                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                style={{'borderTop': '1px solid #e8e8e8', 'paddingTop': '15px'}}
                                onClick={this.cerrarSeleccionCliente.bind(this)}>
                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <textarea value={this.state.diagnosticoEntradaVehiculoHistoria}
                                        onChange={this.onChangeDiagnosticoEntradaVehiculoHistoria.bind(this)} 
                                        className="form-textarea-content textareaHeight-4 cursorAuto">
                                    </textarea>
                                    <label className="label-group-content">Diagnostico Entrada</label>
                                </div>
                                <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                                    <textarea value={this.state.trabajoHechosVehiculoHistoria}
                                        onChange={this.onChangeTrabajoHechosVehiculoHistoria.bind(this)}
                                        className="form-textarea-content textareaHeight-4 cursorAuto">
                                    </textarea>
                                    <label className="label-group-content">Trabajo Realizado</label>
                                </div>
                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                onClick={this.cerrarSeleccionCliente.bind(this)}>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <input type="text" 
                                        value={this.state.precioVehiculoHistoria} 
                                        onChange={this.onChangePrecioVehiculoHistoria.bind(this)}
                                        className='form-control-content reinicio-padding'
                                        placeholder=" Ingresar precio"/>
                                    <label className='label-group-content'>Precio*</label>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <input type="text" 
                                        value={this.state.kmActualVehiculoHistoria} 
                                        onChange={this.onChangeKmActualVehiculoHistoria.bind(this)}
                                        className='form-control-content reinicio-padding'
                                        placeholder=" Ingresar Km/Milla Actual"/>
                                    <label className='label-group-content'>Km/Milla Actual </label>
                                </div>
                                <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                    <input type="text" 
                                        value={this.state.kmProximoVehiculoHistoria} 
                                        onChange={this.onChangeKmProximoVehiculoHistoria.bind(this)}
                                        className='form-control-content reinicio-padding'
                                        placeholder=" Ingresar Proximo Km/Milla"/>
                                    <label className='label-group-content'> Km/Milla Proximo</label>
                                </div>
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                                    <input type="date" 
                                        value={this.state.fechaProximaVehiculoHistoria} 
                                        onChange={this.onChangeFechaProximaVehiculoHistoria.bind(this)}
                                        className='form-control-content reinicio-padding'
                                    />
                                    <label className='label-group-content'>Proxima fecha </label>
                                </div>
                            </div>

                            <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                    onClick={this.cerrarSeleccionCliente.bind(this)}>
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <textarea value={this.state.notaVehiculoHistoria}
                                        onChange={this.onChangeNotaVehiculoHistoria.bind(this)}
                                        className="form-textarea-content cursorAuto">
                                    </textarea>
                                    <label className="label-group-content">Notas</label>
                                </div>
                            </div>

                        </div>

                        <div className="form-group-content"
                            onClick={this.cerrarSeleccionCliente.bind(this)}>
                            <div className="text-center-content">
                                <button type="submit" className="btn-content btn-sm-content btn-success-content"
                                    style={{'marginRight': '20px'}}>
                                    Aceptar
                                </button>
                                <button onClick={this.regresarListadoVehiculoHistoria.bind(this)}
                                    type="button" className="btn-content btn-sm-content btn-danger-content">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        );
    }
}