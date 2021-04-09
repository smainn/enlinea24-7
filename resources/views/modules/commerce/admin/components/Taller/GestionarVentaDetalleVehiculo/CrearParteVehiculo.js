
import React, { Component } from 'react';

import axios from 'axios';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class CrearParteVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {

            vehiculoParte: [],

            imagenParteVehiculo: [],
            indice: [],
            
            cantidadParteVehiculo: [],
            estadoParteVehiculo: [],
            observacionParteVehiculo: [],

            modal: 'none',
            bandera: 0,

            visibleCancelModal: false,
            visibleAceptarModal: false,

            loadCancelModal: false,
            loadAceptarModal: false,

        }
    }

    componentWillMount() {
        axios.get('/commerce/admin/getParteVehiculo').then(
            resultado => {
                if(resultado.data.ok) {
                    for (var i = 0; i < resultado.data.data.length; i++) {
                        var array = [];
                        this.state.imagenParteVehiculo.push(array);
                        this.state.indice.push(0);
                        this.state.cantidadParteVehiculo.push(0);
                        this.state.estadoParteVehiculo.push('S');
                        this.state.observacionParteVehiculo.push('');
                    }
                    this.setState({
                        vehiculoParte: resultado.data.data,
                        imagenParteVehiculo: this.state.imagenParteVehiculo,
                        indice: this.state.indice,
                        cantidadParteVehiculo : this.state.cantidadParteVehiculo,
                        estadoParteVehiculo: this.state.estadoParteVehiculo,
                        observacionParteVehiculo: this.state.observacionParteVehiculo,
                        idParteVehiculo: this.state.idParteVehiculo,
                        nombreParteVehiculo: this.state.nombreParteVehiculo
                    });
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }

    onChangeImagenParteVehiculo(e) {
        var posicion = e.target.id;
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.state.indice[posicion] = this.state.imagenParteVehiculo[posicion].length;
                this.state.imagenParteVehiculo[posicion].push(e.target.result);
                this.setState({
                    imagenParteVehiculo: this.state.imagenParteVehiculo,
                    indice: this.state.indice
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    onChangePreview(posicion) {
        if (this.state.imagenParteVehiculo[posicion].length > 1){
            var indicePreview = this.state.indice[posicion];
            if (indicePreview === 0){
                indicePreview = this.state.imagenParteVehiculo[posicion].length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.state.indice[posicion] = indicePreview;
            this.setState({
                indice: this.state.indice
            })
        }
    }

    onChangeNext(posicion) {
        if (this.state.imagenParteVehiculo[posicion].length > 1){
            var indiceNext = this.state.indice[posicion];
            if (indiceNext === (this.state.imagenParteVehiculo[posicion].length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.state.indice[posicion] = indiceNext;
            this.setState({
                indice: this.state.indice
            })
        }
    }

    onChangeCantidadParteVehiculo(posicion, e) {
        var valor = e.target.value;
        var numeros = '0123456789';
        var nuevaCadenaDeCantidad = '';
        for (var i = 0; i < valor.length; i++) {
            if (numeros.indexOf(valor.charAt(i), 0) != -1) {
                if (i === 0) {
                    if (valor.charAt(i) !== '0') {
                        nuevaCadenaDeCantidad+= valor.charAt(i);
                    }
                }else {
                    nuevaCadenaDeCantidad+= valor.charAt(i);
                }
            }
        }
        if (nuevaCadenaDeCantidad.length === 0) {
            this.state.cantidadParteVehiculo[posicion] = '0';
        }else {
            this.state.cantidadParteVehiculo[posicion] = nuevaCadenaDeCantidad;
        }
        this.setState({
            cantidadParteVehiculo: this.state.cantidadParteVehiculo
        });
    }

    onChangeEstadoParteVehiculo(posicion, e) {
        this.state.estadoParteVehiculo[posicion] = e.target.value;
        this.setState({
            estadoParteVehiculo: this.state.estadoParteVehiculo
        });
    }

    onChangeObservacionParteVehiculo(posicion, e) {
        this.state.observacionParteVehiculo[posicion] = e.target.value;
        this.setState({
            observacionParteVehiculo: this.state.observacionParteVehiculo
        });
    }

    cancelarParteVehiculo() {
        var cantidad = [];
        var estado = [];
        var observacion = [];
        var imagen = [];
        var posicion = [];
        for (var i = 0; i < this.state.vehiculoParte.length; i++) {
            var array = [];
            imagen.push(array);
            posicion.push(0);
            cantidad.push(0);
            estado.push('S');
            observacion.push('');
        }

        this.setState({
            imagenParteVehiculo: imagen,
            indice: posicion,
            cantidadParteVehiculo: cantidad,
            estadoParteVehiculo: estado,
            observacionParteVehiculo: observacion,
            loadCancelModal: !this.state.loadCancelModal
        });

        const datosParteVehiculo = {
            bandera: 1,
            cantidadParteVehiculo: cantidad,
            estadoParteVehiculo: estado,
            observacionParteVehiculo: observacion,
            imagenParteVehiculo: imagen,
            vehiculoParte: this.state.vehiculoParte,
            indiceParteVehiculo: posicion
        };

        setTimeout(() => {

            message.error('dato eliminado exitosamente');

            this.handleCerrar(this.state.bandera);

            this.props.callback(datosParteVehiculo);

        }, 1500);

    }

    aceptarParteVehiculo() {
        const datosParteVehiculo = {
            bandera: 2,
            cantidadParteVehiculo: this.state.cantidadParteVehiculo,
            estadoParteVehiculo: this.state.estadoParteVehiculo,
            observacionParteVehiculo: this.state.observacionParteVehiculo,
            imagenParteVehiculo: this.state.imagenParteVehiculo,
            vehiculoParte: this.state.vehiculoParte,
            indiceParteVehiculo: this.state.indice
        };

        this.setState({
            loadAceptarModal: !this.state.loadAceptarModal
        });

        setTimeout(() => {

            this.handleCerrar(this.state.bandera);

            message.success('datos guardados exitosamente');

            this.props.callback(datosParteVehiculo);

        }, 1500);

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

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Modal
                    title='Aceptar Partes Vehiculo'
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
                                        onClick={this.aceptarParteVehiculo.bind(this)}
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
                    title='Cancelar Partes Vehiculo'
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
                                        onClick={this.cancelarParteVehiculo.bind(this)}
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
            );
        }
        
    }

    render() {

        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="form-group-content">

                {componentModalShow}

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                        style={{'border': '1px solid #e8e8e8'}}>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                    Nro Venta:
                                </label>
                            </div>
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    005
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-4px'}}>
                                    Cliente:
                                </label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content" style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {this.props.cliente}
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                    Placa :
                                </label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content" style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {this.props.vehiculoDelcliente.placa}
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-5-content col-md-5-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-12px'}}>
                                    Descripcion :
                                </label>
                            </div>
                            <div className="col-lg-7-content col-md-7-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content" style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {this.props.vehiculoDelcliente.descripcion}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-1-content col-md-1-content">
                        
                    </div>
                    <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content"
                        style={{'border': '1px solid #e8e8e8'}}>
                        
                        <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                            style={{'borderBottom': '1px solid #e8e8e8'}}>
                            <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                    Id
                                </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-ms-2-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                    Nombre
                                </label>
                            </div>
                            <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                    Cantidad
                                </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                    Estado
                                </label>
                            </div>
                            <div className="col-lg-4-content col-md-4-content col-sm-3-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                    Observaciones
                                </label>
                            </div>
                            <div className="col-lg-2-content col-md-2-content col-sm-3-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079'}}>
                                    Foto
                                </label>
                            </div>
                        </div>
                        {this.state.vehiculoParte.map(
                            (resultado, indice) => (
                                <div key={indice} className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                    style={{'borderBottom': '1px solid #e8e8e8'}}>
                                    <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                        <label className="label-group-content" style={{'display': 'block', 'marginTop': '25px'}}>
                                            {resultado.idvehiculopartes}
                                        </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                        <label className="label-group-content" style={{'display': 'block', 'marginTop': '25px'}}>
                                            {resultado.nombre}
                                        </label>
                                    </div>
                                    <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                        <input type="text" style={{'marginTop': '12px', 'fontSize': '15px'}} 
                                            onChange={this.onChangeCantidadParteVehiculo.bind(this, indice)}
                                            maxLength="10"
                                            value={this.state.cantidadParteVehiculo[indice]}
                                            className="form-control-content reinicio-padding" />
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                        <select className="form-control-content reinicio-padding"
                                            value={this.state.estadoParteVehiculo[indice]}
                                            onChange={this.onChangeEstadoParteVehiculo.bind(this, indice)}
                                            style={{'marginTop': '12px', 'fontSize': '15px'}}>
                                            <option value="S">Seleccionar</option>
                                            <option value="N">Nuevo</option>
                                            <option value="E">Estandar</option>
                                            <option value="M">Mal Estado</option>
                                            <option value="D">Desgastado</option>
                                            <option value="O">Otro</option>
                                        </select>
                                    </div>  
                                    <div className="col-lg-4-content col-md-4-content col-sm-3-content col-xs-12-content">
                                        <input type="text" style={{'marginTop': '12px', 'fontSize': '15px'}}
                                            size="10" placeholder="Ingresar Observacion"
                                            className="form-control-content reinicio-padding"
                                            value={this.state.observacionParteVehiculo[indice]}
                                            onChange={this.onChangeObservacionParteVehiculo.bind(this, indice)} />
                                    </div> 
                                    <div className="col-lg-2-content col-md-2-content col-sm-3-content col-xs-12-content">
                                        <div className="card-caracteristica">
                                            <div className="pull-left-content">
                                                <i className="styleImg fa fa-upload imgMod">
                                                    <input type="file" 
                                                        className="img-content" id={indice}
                                                        onChange={this.onChangeImagenParteVehiculo.bind(this)}/>
                                                </i>
                                            </div>
                                            <div className="caja-img small-image">
                                                {(this.state.imagenParteVehiculo[indice].length === 0)?
                                                    <img src="/images/default.jpg" alt="none" className="img-principal" />
                                                    :
                                                    <img style={{'cursor': 'pointer'}} 
                                                        src={this.state.imagenParteVehiculo[indice][this.state.indice[indice]]}
                                                        alt="none" className="img-principal" />
                                                }
                                            </div>
                                            <div className="pull-left-content">
                                                <i onClick={this.onChangePreview.bind(this, indice)}
                                                    className="fa-left-content fa fa-angle-double-left small-left"
                                                        style={{'color': '#868686'}}> </i>
                                            </div>
                                    
                                            <div className="pull-right-content">
                                                <i onClick={this.onChangeNext.bind(this, indice)}
                                                    className="fa-right-content fa fa-angle-double-right small-right"
                                                    style={{'color': '#868686'}}> </i>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            )
                        )}
                    </div>
                    <div className="col-lg-1-content col-md-1-content"></div>
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