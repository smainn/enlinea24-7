
import React, { Component } from 'react';
import { message, Select, Modal } from 'antd';
import { Redirect, withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import CSelect from '../../../componentes/select2';
import CImage from '../../../componentes/image';
import { httpRequest, removeAllData, readData, saveData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import Confirmation from '../../../componentes/confirmation';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import keysStorage from '../../../utils/keysStorage';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import Lightbox from 'react-image-lightbox';
const {Option} = Select;

class CrearParteVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            isOpen: false,
            posicion_imagen: -1,

            cliente: '',
            vehiculoplaca: '',
            vehiculodescripcion: '',

            vehiculo_parte: [],

            idvehiculoparte: [],
            cantidad: [],
            estado: [],
            observacion: [],
            imagen: [],
            indice: [],

            visible: false,
            loading: false,
            bandera: 0,

            noSesion: false
        }
    }

    componentDidMount() {
        this.getPartesVehiculo();
    }
    validar_data(data) {
        if ((data == null) || (data == '') || (typeof data == 'undefined')) {
            return false;
        }
        return true;
    }
    getPartesVehiculo() {

        var on_data = JSON.parse( readData(keysStorage.on_data) );
        //console.log(on_data)
        var bandera = false;
        if (this.validar_data(on_data)) {
            if (this.validar_data(on_data.data_actual) && this.validar_data(on_data.on_create)) 
            {
                if (on_data.on_create == 'venta_create') {
                    bandera = true;
                    this.setState({
                        cliente: on_data.data_actual.namecliente,
                        vehiculoplaca: on_data.data_actual.placa_vehiculo,
                        vehiculodescripcion: on_data.data_actual.descripcion_vehiculo,
                    });
                }
            }
        }

        httpRequest('get', ws.wsvehiculoparte + '/get_data')
        .then(result => {
            if (result.response == 1) {
                
                for (var i = 0; i < result.data.length; i++) {

                    let id = result.data[i].idvehiculopartes;

                    if ((bandera) && (this.validar_data(on_data.data_actual.array_vehiculoparte)) && 
                            (this.validar_data(on_data.data_actual.array_vehiculoparte.idvehiculoparte))) 
                    {
                        let index = on_data.data_actual.array_vehiculoparte.idvehiculoparte.indexOf(id);
                        if (index >= 0) {
                            this.state.idvehiculoparte.push(on_data.data_actual.array_vehiculoparte.idvehiculoparte[index]);
                            this.state.imagen.push(on_data.data_actual.array_vehiculoparte.imagen[index]);
                            this.state.indice.push(0);
                            this.state.cantidad.push(on_data.data_actual.array_vehiculoparte.cantidad[index]);
                            this.state.estado.push(on_data.data_actual.array_vehiculoparte.estado[index]);
                            this.state.observacion.push(on_data.data_actual.array_vehiculoparte.observacion[index]);
                        }else {
                            this.state.idvehiculoparte.push(id);
                            this.state.imagen.push([]);
                            this.state.indice.push(0);
                            this.state.cantidad.push(0);
                            this.state.estado.push('S');
                            this.state.observacion.push('');
                        }
                    }else {
                        this.state.idvehiculoparte.push(id);
                        this.state.imagen.push([]);
                        this.state.indice.push(0);
                        this.state.cantidad.push(0);
                        this.state.estado.push('S');
                        this.state.observacion.push('');
                    }
                }
                this.setState({
                    vehiculo_parte: result.data,
                    imagen: this.state.imagen,
                    indice: this.state.indice,
                    cantidad : this.state.cantidad,
                    estado: this.state.estado,
                    observacion: this.state.observacion,
                    idvehiculoparte: this.state.idvehiculoparte,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error('Ocurrio un problema en el servidor');
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onChangeImagen(index, e) {
        if (this.state.cantidad[index] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        let files = e.target.files;

        if ((files[0].type === 'image/png') || (files[0].type === 'image/jpg') || 
            (files[0].type === 'image/jpeg')) {

            let reader = new FileReader();
            reader.onload = (e) => {
                this.state.indice[index] = this.state.imagen[index].length;
                this.state.imagen[index].push({
                    foto: e.target.result,
                    path: false,
                });
                this.setState({
                    imagen: this.state.imagen,
                    indice: this.state.indice,
                });
            };
            reader.readAsDataURL(e.target.files[0]); 
        }
    }

    onChangeDelete(index) {
        var imagen = this.state.imagen[index];
        var indice = this.state.indice[index];
        if (imagen.length - 1 == indice) {
            this.state.indice[index] = 0;
        }
        imagen.splice(indice, 1);
        this.state.imagen[index] = imagen;
        this.setState({
            imagen: this.state.imagen,
            indice: this.state.indice,
        });
    }

    onChangePreview(index) {
        if (this.state.imagen[index].length > 1){
            var indicePreview = this.state.indice[index];
            if (indicePreview == 0){
                indicePreview = this.state.imagen[index].length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.state.indice[index] = indicePreview;
            this.setState({
                indice: this.state.indice,
            })
        }
    }

    onChangeNext(index) {
        if (this.state.imagen[index].length > 1){
            var indiceNext = this.state.indice[index];
            if (indiceNext == (this.state.imagen[index].length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.state.indice[index] = indiceNext;
            this.setState({
                indice: this.state.indice,
            })
        }
    }

    onChangeCantidad(index, value) {
        var bandera = false;
        if (value == '') {
            this.state.cantidad[index] = 0;
            if (this.state.estado[index] != 'S' || this.state.observacion[index] != '' || this.state.imagen[index].length > 0) {
                bandera = true;
            }
        }
        if (!isNaN(value)) {
            value = parseInt(value);
            if (value >= 0) {
                this.state.cantidad[index] = value;
            }
            if (value == 0) {
                if (this.state.estado[index] != 'S' || this.state.observacion[index] != '' || this.state.imagen[index].length > 0) {
                    bandera = true;
                }
            }
        }
        if (bandera) {
            var actualizar = () => {
                this.state.estado[index] = 'S';
                this.state.observacion[index] = '';
                this.state.imagen[index] = [];
                this.state.indice[index] = 0;
                this.state.cantidad[index] = 0;

                this.setState({
                    cantidad: this.state.cantidad,
                    estado: this.state.estado,
                    observacion: this.state.observacion,
                    imagen: this.state.imagen,
                    indice: this.state.indice,
                });
            };
            Modal.confirm({
                title: 'Advertencia',
                content: 'Al cambiar la cantidad a inicial se perderan los registros, ¿Desea continuar?',
                onOk() {
                    actualizar();
                },
                onCancel() {
                },
            });
        }else {
            this.setState({
                cantidad: this.state.cantidad,
            });
        }
        
    }

    onChangeEstado(index, value) {
        if (this.state.cantidad[index] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        this.state.estado[index] = value;
        this.setState({
            estado: this.state.estado,
        });
    }

    onChangeObservacion(index, value) {
        if (this.state.cantidad[index] == 0) {
            message.warning('La cantidad debe ser mayor que cero');
            return;
        }
        this.state.observacion[index] = value;
        this.setState({
            observacion: this.state.observacion,
        });
    }

    onAbrirModal(index) {
        this.setState({
            isOpen: true,
            posicion_imagen: index,
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
                    data_actual.array_vehiculoparte = {
                        idvehiculoparte: this.state.idvehiculoparte,
                        imagen: this.state.imagen,
                        cantidad: this.state.cantidad,
                        estado: this.state.estado,
                        observacion: this.state.observacion,
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
    onChangeModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onCancelar.bind(this)}
                    title='Aceptar Partes Vehiculo'
                    onClick={this.onSubmitData.bind(this)}
                    width={400}
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
                    title='Cancelar Partes Vehiculo'
                    onClick={this.onSalir.bind(this)}
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
    onSalir() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            
            var on_data = JSON.parse( readData(keysStorage.on_data) );
            if (this.validar_data(on_data)) {
                var data_actual = this.validar_data(on_data.data_actual)?on_data.data_actual:null;
                if (data_actual != null) {
                    data_actual.array_vehiculoparte = {
                        idvehiculoparte: [],
                        imagen: [],
                        cantidad: [],
                        estado: [],
                        observacion: [],
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
    lighBox() {
        if (this.state.isOpen) {
            var index = this.state.posicion_imagen;
            var imagen = this.state.imagen[index];
            const nextSrc = imagen.length <= 1 ? null : imagen[(this.state.indice[index] + 1) % imagen.length].foto;
            const prevSrc = imagen.length <= 1 ? null : imagen[(this.state.indice[index] + imagen.length - 1) % imagen.length].foto;
            return (
                <Lightbox
                    mainSrc={this.state.imagen[index][this.state.indice[index]].foto}
                    nextSrc={nextSrc}
                    prevSrc={prevSrc}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={this.onChangePreview.bind(this, index)}
                    onMoveNextRequest={this.onChangeNext.bind(this, index)}
                />
            );
        }
        return null;
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
            <div className="rows">
                {this.lighBox()}
                { componentModalShow }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Registrar Parte Vehiculo</h1>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className='cols-lg-1 cols-md-1'></div>
                    <C_Input 
                        title="Cliente"
                        value={this.state.cliente}
                        readOnly={true}
                        className='cols-lg-5 cols-md-5 cols-sm-12 cols-xs-12 pt-bottom'
                    />
                    <C_Input 
                        title="Placa"
                        value={this.state.vehiculoplaca}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Descripcion"
                        value={this.state.vehiculodescripcion}
                        readOnly={true}
                    />
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="table-detalle"
                        style={{ maxHeight: 450, maxWidth: 910, overflow: 'scroll', padding: 5, }}
                        >
                        <table className="table-response-detalle" style={{width: 'auto', margin: 'auto', }}>
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th>Nombre</th>
                                    <th style={{margin: 'auto', }}>Cantidad</th>
                                    <th style={{margin: 'auto',  }}>Estado</th>
                                    <th>Observaciones</th>
                                    <th style={{margin: 'auto',  }}>Foto</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.vehiculo_parte.map((item, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>
                                                {key + 1}
                                            </td>
                                            <td>
                                                {item.nombre}
                                            </td>
                                            <td>
                                                <C_Input className='' number={true}
                                                    style={{width: 70, margin: 'auto', margin: 0, textAlign: 'right', paddingRight: 18, }}
                                                    value={this.state.cantidad[key]}
                                                    onChange={this.onChangeCantidad.bind(this, key)}
                                                />
                                            </td>
                                            <td>
                                                <C_Select className='' 
                                                    style={{width: 130, margin: 'auto', }}
                                                    value={this.state.estado[key]}
                                                    onChange={this.onChangeEstado.bind(this, key)}
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
                                                <C_Input className='' 
                                                    style={{width: 180, margin: 'auto', }}
                                                    value={this.state.observacion[key]}
                                                    onChange={this.onChangeObservacion.bind(this, key)}
                                                />
                                            </td>
                                            <td style={{position: 'relative', width: 'auto', height: 'auto', }}>
                                                <div style={{width: 90, height: 80, margin: 'auto', position: 'relative', boxSizing: 'border-box',
                                                            padding: 5, borderRadius: 5, border: '4px double blue'
                                                        }}
                                                >
                                                    <i className="fa fa-upload" 
                                                        style={{float: 'left', position: 'relative', width: 22, height: 22, background: '#E6E6E6',
                                                            fontSize: 15, zIndex: 40, border: '1px solid black', top: -15, left: -15,
                                                        }}
                                                    >
                                                        <input type="file" 
                                                            style={{position: 'absolute', width: '100%', height: '100%', top: 0, 
                                                                left: 0, bottom: 0, opacity: 0
                                                            }}
                                                            onChange={this.onChangeImagen.bind(this, key)}
                                                        />
                                                    </i>

                                                    {(this.state.imagen[key].length > 0)?
                                                        <i onClick={this.onChangeDelete.bind(this, key)}
                                                            className="fa fa-times"
                                                            style={{'color': 'black', position: 'absolute', top: -10, right: -10, zIndex: 40,
                                                                width: 22, height: 22, border: '1px solid black', textAlign: 'center',
                                                                fontSize: 18, cursor: 'pointer', borderRadius: 5, background: '#E6E6E6',
                                                            }}
                                                        > 
                                                        </i>:null
                                                    }

                                                    {(this.state.imagen[key].length == 0)?
                                                        <img src="/images/default.jpg" alt="none" className="img-principal" />:
                                                        <img src={this.state.imagen[key][this.state.indice[key]].foto} alt="none" 
                                                            className="img-principal" onClick={this.onAbrirModal.bind(this, key)}
                                                        />
                                                    }

                                                    {(this.state.imagen[key].length > 1)?
                                                        <i onClick={this.onChangePreview.bind(this, key)}
                                                            className="fa fa-angle-double-left"
                                                            style={{'color': 'black', position: 'absolute', bottom: -10, left: -10,
                                                                width: 22, height: 22, border: '1px solid black', textAlign: 'center',
                                                                fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: '#E6E6E6', 
                                                            }}
                                                        ></i>:null
                                                    }

                                                    {(this.state.imagen[key].length > 1)?
                                                        <i onClick={this.onChangeNext.bind(this, key)}
                                                            className="fa fa-angle-double-right"
                                                            style={{'color': 'black', position: 'absolute', bottom: -10, right: -10,
                                                                width: 22, height: 22, border: '1px solid black', textAlign: 'center',
                                                                fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: '#E6E6E6',
                                                            }}
                                                        > 
                                                        </i>:null
                                                    }
                                                    
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

export default withRouter(CrearParteVehiculo);