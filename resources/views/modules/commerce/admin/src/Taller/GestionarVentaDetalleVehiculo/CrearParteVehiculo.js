
import React, { Component } from 'react';
import { message, Select } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import ws from '../../../tools/webservices';
import Input from '../../../components/input';
import CSelect from '../../../components/select2';
import CImage from '../../../components/image';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import Confirmation from '../../../components/confirmation';
import C_Button from '../../../components/data/button';
const {Option} = Select;

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
            imgsb64: [],
            modal: 'none',
            bandera: 0,

            visibleCancelModal: false,
            visibleAceptarModal: false,

            loadCancelModal: false,
            loadAceptarModal: false,
            noSesion: false
        }
    }

    componentDidMount() {
        this.getPartesVehiculo();
    }

    getPartesVehiculo() {
        httpRequest('get', ws.wsgetpartesvehiculoall)
        .then(result => {
            console.log('partes vehiculo ', result);
            if (result.ok) {
                for (var i = 0; i < result.data.length; i++) {
                    if (this.props.idsvehiculopartes != undefined && this.props.idsvehiculopartes.length > 0) {
                        let id = result.data[i].idvehiculopartes;
                        let index = this.props.idsvehiculopartes.indexOf(id);
                        if (index >= 0) {
                            this.state.imagenParteVehiculo.push(this.props.imagen[index]);
                            this.state.indice.push(0);
                            this.state.cantidadParteVehiculo.push(this.props.cantidad[index]);
                            this.state.estadoParteVehiculo.push(this.props.estado[index]);
                            this.state.observacionParteVehiculo.push(this.props.observacion[index]);
                        } else {
                            this.state.imagenParteVehiculo.push([]);
                            this.state.indice.push(0);
                            this.state.cantidadParteVehiculo.push(0);
                            this.state.estadoParteVehiculo.push('S');
                            this.state.observacionParteVehiculo.push('');
                        }
                    } else {
                        this.state.imagenParteVehiculo.push([]);
                        this.state.indice.push(0);
                        this.state.cantidadParteVehiculo.push(0);
                        this.state.estadoParteVehiculo.push('S');
                        this.state.observacionParteVehiculo.push('');
                    }

                }
                //console.log('VEHICULO PARTES');
                this.setState({
                    vehiculoParte: result.data,
                    imagenParteVehiculo: this.state.imagenParteVehiculo,
                    indice: this.state.indice,
                    cantidadParteVehiculo : this.state.cantidadParteVehiculo,
                    estadoParteVehiculo: this.state.estadoParteVehiculo,
                    observacionParteVehiculo: this.state.observacionParteVehiculo,
                    idParteVehiculo: this.state.idParteVehiculo,
                    nombreParteVehiculo: this.state.nombreParteVehiculo
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch(
            error => {
                console.log(error)
            }
        );
    }

    onChangeImagenParteVehiculo(e) {
        if (this.state.cantidadParteVehiculo[e.target.id] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        var posicion = e.target.id;
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || 
            (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.state.indice[posicion] = this.state.imagenParteVehiculo[posicion].length;
                this.state.imagenParteVehiculo[posicion].push({
                    foto: e.target.result,
                    path: false
                });
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

    onChangeCantidadParteVehiculo(posicion, value) {
        var valor = value;
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

    onChangeEstadoParteVehiculo(posicion, value) {
        if (this.state.cantidadParteVehiculo[posicion] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        this.state.estadoParteVehiculo[posicion] = value;
        this.setState({
            estadoParteVehiculo: this.state.estadoParteVehiculo
        });
    }

    onChangeObservacionParteVehiculo(posicion, value) {
        if (this.state.cantidadParteVehiculo[posicion] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        this.state.observacionParteVehiculo[posicion] = value;
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
        var  length = this.state.vehiculoParte.length;
        for (var i = 0; i < length; i++) {
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
            loadCancelModal: true
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
            this.handleCerrar(this.state.bandera);
        }, 300);
            
        this.props.callback(datosParteVehiculo);

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
            loadAceptarModal: true,
        });

        setTimeout(() => {
            this.handleCerrar(this.state.bandera);
        }, 300);

        message.success('datos guardados exitosamente');

        this.props.callback(datosParteVehiculo);

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
                loadAceptarModal: false,
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

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Confirmation
                    visible={this.state.visibleAceptarModal}
                    loading={this.state.loadAceptarModal}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    title='Aceptar Partes Vehiculo'
                    onClick={this.aceptarParteVehiculo.bind(this)}
                    width={400}
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
                    title='Cancelar Partes Vehiculo'
                    onClick={this.cancelarParteVehiculo.bind(this)}
                    width={400}
                    content={
                        <label style={{paddingBottom: 10}}>
                            ¿Estas seguro de eliminar todos los registros agregados...?
                        </label>
                    }
                />
            );
        }
        
    }

    listaEstados() {

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

                { componentModalShow }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Registro Parte Vehiculo</h1>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                        style={{'border': '1px solid #e8e8e8'}}>
                        <div className="cols-lg-2 cols-md-2 cols-sm-12 cols-xs-12">
                            <Input
                                title="Nro Venta"
                                value={"002"}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Cliente"
                                value={this.props.cliente}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Placa"
                                value={this.props.vehiculoPlaca}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <Input
                                title="Descripcion"
                                value={this.props.vehiculoDescripcion}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="table-detalle"
                        style={{ height: 400 }}
                        >
                        <table className="table-response-detalle">
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th style={{ width: '20%' }}>Nombre</th>
                                    <th style={{ width: '10%' }}>Cantidad</th>
                                    <th style={{ width: '15%' }}>Estado</th>
                                    <th style={{ width: '30%' }}>Observaciones</th>
                                    <th>Foto</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.vehiculoParte.map((item, key) => {
                                    let total = parseFloat(item.preciounit) - parseFloat(item.factor_desc_incre);
                                    return (
                                        <tr key={key}>
                                            <td>
                                                {key + 1}
                                            </td>
                                            <td>
                                                {item.nombre}
                                            </td>
                                            <td>
                                                <Input
                                                    value={this.state.cantidadParteVehiculo[key]}
                                                    onChange={this.onChangeCantidadParteVehiculo.bind(this, key)}
                                                />
                                            </td>
                                            <td>
                                                <CSelect
                                                    value={this.state.estadoParteVehiculo[key]}
                                                    onChange={this.onChangeEstadoParteVehiculo.bind(this, key)}
                                                    component={[
                                                        <Option key={0} value="S">Seleccionar</Option>,
                                                        <Option key={1} value="N">Nuevo</Option>,
                                                        <Option key={2} value="E">Estandar</Option>,
                                                        <Option key={3} value="M">Mal Estado</Option>,
                                                        <Option key={4} value="D">Desgastado</Option>,
                                                        <Option key={5} value="O">Otro</Option>
                                                    ]}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    value={this.state.observacionParteVehiculo[key]}
                                                    onChange={this.onChangeObservacionParteVehiculo.bind(this, key)}
                                                />
                                            </td>
                                            <td>
                                                <div className="card-caracteristica">
                                                    <div className="pull-left-content">
                                                        <i className="styleImg fa fa-upload imgMod">
                                                            <input type="file" 
                                                                className="img-content" id={key}
                                                                onChange={this.onChangeImagenParteVehiculo.bind(this)}/>
                                                        </i>
                                                    </div>
                                                    <div className="caja-img small-image">
                                                        {(this.state.imagenParteVehiculo[key].length === 0)?
                                                            <img src="/images/default.jpg" alt="none" className="img-principal" />
                                                            :
                                                            <img style={{'cursor': 'pointer'}} 
                                                                src={this.state.imagenParteVehiculo[key][this.state.indice[key]].foto}
                                                                alt="none" className="img-principal" />
                                                        }
                                                    </div>
                                                    <div className="pull-left-content">
                                                        <i onClick={this.onChangePreview.bind(this, key)}
                                                            className="fa-left-content fa fa-angle-double-left small-left"
                                                                style={{'color': '#868686'}}> </i>
                                                    </div>
                                            
                                                    <div className="pull-right-content">
                                                        <i onClick={this.onChangeNext.bind(this, key)}
                                                            className="fa-right-content fa fa-angle-double-right small-right"
                                                            style={{'color': '#868686'}}> </i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
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