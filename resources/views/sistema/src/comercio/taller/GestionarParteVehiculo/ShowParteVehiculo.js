
import React, { Component } from 'react';
import ws from '../../../utils/webservices';
//import {cambiarFormato} from '../../../utils/toolsDate'
import TextArea from '../../../componentes/textarea';
import Input from '../../../componentes/input';
import CSelect from '../../../componentes/select2';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import { message } from 'antd';
import strings from '../../../utils/strings';

export default class ShowParteVehiculo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            nroVenta: 0,
            nombreCliente: '',
            apellidoCliente: '',
            placa: '',
            nombrePartes: '',
            indices: [],
            indice: [],
            arrayFotos: [],
            partesVehiculo: [],
            imagenParteVehiculo: [],
            cantidadParteVehiculo: [],
            estadoParteVehiculo: [],
            observacionParteVehiculo: [],
            noSesion: false
        }
    }
    
    componentDidMount() {
        this.preparDatos();
        this.getPartesVehiculo();
    }

    inArray(array, value) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (array[i].idvp == value) {
                return i;
            }
        }
        return -1;
    }

    getPartesVehiculo() {
        httpRequest('get', ws.wsgetpartesvehiculoall)
        .then((result) => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.ok) {
                let array = result.data;
                let length = array.length;
                for (let i = 0; i < length; i++) {
                    let posicion = this.inArray(this.props.vehiculoPartes, array[i].idvehiculopartes);
                    if (posicion >= 0) {
                        let elem = this.props.vehiculoPartes[posicion];
                        this.state.imagenParteVehiculo.push(elem.fotos);
                        this.state.indice.push(0);
                        this.state.cantidadParteVehiculo.push(elem.cantidad);
                        this.state.estadoParteVehiculo.push(elem.estado);
                        this.state.observacionParteVehiculo.push(elem.observaciones);
                    } else {
                        var data = [];
                        this.state.imagenParteVehiculo.push(data);
                        this.state.indice.push(0);
                        this.state.cantidadParteVehiculo.push(0);
                        this.state.estadoParteVehiculo.push('S');
                        this.state.observacionParteVehiculo.push('');
                    }
                    
                }
                
                this.setState({
                    partesVehiculo: result.data,
                    imagenParteVehiculo: this.state.imagenParteVehiculo,
                    cantidadParteVehiculo: this.state.cantidadParteVehiculo,
                    estadoParteVehiculo: this.state.estadoParteVehiculo,
                    observacionParteVehiculo: this.state.observacionParteVehiculo,
                });
            }
        })
        .catch(error => {
                console.log(error)
                message.error(strings.message_error);
            }
        );
    }

    onChangePreview(posicion) {
        if (this.state.arrayFotos[posicion].length > 1) {
            var indicePreview = this.state.indices[posicion];
            if (indicePreview === 0) {
                indicePreview = this.state.arrayFotos[posicion].length - 1;
            } else {
                indicePreview = indicePreview - 1;
            }
            this.state.indices[posicion] = indicePreview;
            this.setState({
                indices: this.state.indices
            })
        }
    }

    onChangeNext(posicion) {
        if (this.state.arrayFotos[posicion].length > 1){
            var indiceNext = this.state.indices[posicion];
            if (indiceNext === (this.state.arrayFotos[posicion].length - 1)){
                indiceNext = 0;
            }else{
                indiceNext = indiceNext + 1;
            }
            this.state.indices[posicion] = indiceNext;
            this.setState({
                indices: this.state.indices
            })
        }
    }

    preparDatos() {
        let array = this.props.vehiculoPartes;
        let length = array.length;
        let indices = [];
        let arrayFotos = [];
        for (let i = 0; i < length; i++) {
            indices.push(0);
            arrayFotos.push(array[i].fotos);
        }
        this.setState({
            indices: indices,
            arrayFotos: arrayFotos
        });
    }
    cerrarModal() {
        this.props.callback();
    }

    getPathImg(posicion, index) {

        let array = this.state.arrayFotos[posicion];
        return array[index].foto;
    }

    getEstado(value) {
        let estado = '';
        switch (value) {
            case 'N':
                estado = 'Nuevo';
                break;
            case 'E':
                estado = 'Estandar';
            case 'M':
                estado = 'Mal Estado';
                break;
            case 'D':
                estado = 'Desgastado';
                break;
            case 'O':
                estado = 'Otro';
                break;
            default:
                estado = 'Sin Definir';
                
        }
        return estado;
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        let nroVenta = '';
        let nombreCliente = '';
        let apellidoCliente = '';
        let placa = '';
        let nombrePartes = '';
        if (this.props.vehiculoPartes.length > 0) {
            nroVenta =  this.props.vehiculoPartes[0].nroVenta;
            nombreCliente = this.props.vehiculoPartes[0].nombreCliente;
            apellidoCliente = this.props.vehiculoPartes[0].apellidoCliente == null ? '' : this.props.vehiculoPartes[0].apellidoCliente;
            placa = this.props.vehiculoPartes[0].placa;
            nombrePartes = this.props.vehiculoPartes[0].nombrePartes;
        }
        return (
            <div className="form-group-content" style={{'marginTop': '-20px', 'marginBottom': '-20px'}}>
                
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                        style={{'border': '1px solid #e8e8e8'}}>
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <Input
                                title="Nro Venta"
                                value={nroVenta}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <Input
                                title="Cliente"
                                value={nombreCliente + ' ' + apellidoCliente}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <Input
                                title="Placa"
                                value={placa}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                            <Input
                                title="Descripcion"
                                value={nombrePartes}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    //style={{'border': '1px solid #e8e8e8'}}
                >
                    <div 
                        className="table-detalle"
                        style={{ height: 400 }}
                        >
                        <table className="table-response-detalle">
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th style={{ width: '20%' }}>Nombre</th>
                                    <th style={{ width: '10%' }}>Cantidad</th>
                                    <th style={{ width: '20%' }}>Estado</th>
                                    <th style={{ width: '30%' }}>Observaciones</th>
                                    <th>Foto</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.partesVehiculo.map((item, key) => {
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
                                                    readOnly={true}
                                                    //onChange={this.onChangeCantidadParteVehiculo.bind(this, key)}
                                                />
                                            </td>
                                            <td>
                                                <CSelect
                                                    value={this.state.estadoParteVehiculo[key]}
                                                    //onChange={this.onChangeEstadoParteVehiculo.bind(this, key)}
                                                    readOnly={true}
                                                    component={[
                                                        <Option value="S">Seleccionar</Option>,
                                                        <Option value="N">Nuevo</Option>,
                                                        <Option value="E">Estandar</Option>,
                                                        <Option value="M">Mal Estado</Option>,
                                                        <Option value="D">Desgastado</Option>,
                                                        <Option value="O">Otro</Option>
                                                    ]}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    value={this.state.observacionParteVehiculo[key]}
                                                    readOnly={true}
                                                    //title="Obervaciones"
                                                />
                                            </td>
                                            <td>
                                                <div className="card-caracteristica">
                                                    {/*}
                                                    <div className="pull-left-content">
                                                        <i className="styleImg fa fa-upload imgMod">
                                                            <input type="file" 
                                                                className="img-content" id={key}
                                                                //onChange={this.onChangeImagenParteVehiculo.bind(this)}
                                                            />
                                                        </i>
                                                    </div>
                                                */}
                                                    <div className="caja-img small-image">
                                                        {(this.state.arrayFotos[key] == undefined)?
                                                            <img src="/images/default.jpg" alt="none" className="img-principal" />
                                                            :
                                                            <img style={{'cursor': 'pointer'}} 
                                                                src={this.getPathImg(key, this.state.indices[key])}
                                                                alt="none" className="img-principal" />
                                                        }
                                                    </div>
                                                    <div className="pull-left-content">
                                                        <i 
                                                            onClick={this.onChangePreview.bind(this, key)}
                                                            className="fa-left-content fa fa-angle-double-left small-left"
                                                                style={{'color': '#868686'}}> </i>
                                                    </div>
                                            
                                                    <div className="pull-right-content">
                                                        <i
                                                            onClick={this.onChangeNext.bind(this, key)}
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
                        {/**========================================================================================== */}
                    {/*}
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                        style={{'borderBottom': '1px solid #e8e8e8'}}>
                        <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                            <label className="label-group-content"
                                style={{'color': '#053079'}}>
                                Nro
                            </label>
                        </div>
                        <div className="col-lg-2-content col-md-2-content col-ms-2-content col-xs-12-content">
                            <label className="label-group-content"
                                style={{'color': '#053079'}}>
                                Nombre
                            </label>
                        </div>
                        <div className="col-lg-2-content col-md-1-content col-sm-1-content col-xs-12-content">
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
                        <div className="col-lg-3-content col-md-4-content col-sm-3-content col-xs-12-content">
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
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                        style={{'borderBottom': '1px solid #e8e8e8', height: 400,overflow: 'scroll'}}>
                    {
                        this.state.partesVehiculo.map((resultado, indice) =>  {
                            
                            return (
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
                                            //onChange={this.onChangeCantidadParteVehiculo.bind(this, indice)}
                                            maxLength="10"
                                            value={this.state.cantidadParteVehiculo[indice]}
                                            className="form-control-content reinicio-padding" />
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                        <select className="form-control-content reinicio-padding"
                                            value={this.state.estadoParteVehiculo[indice]}
                                            //onChange={this.onChangeEstadoParteVehiculo.bind(this, indice)}
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
                                            //onChange={this.onChangeObservacionParteVehiculo.bind(this, indice)} 
                                        />
                                    </div> 
                                    <div className="col-lg-2-content col-md-2-content col-sm-3-content col-xs-12-content">
                                        <div className="card-caracteristica">
                                            <div className="pull-left-content">
                                                <i className="styleImg fa fa-upload imgMod">
                                                    <input type="file" 
                                                        className="img-content" id={indice}
                                                        //onChange={this.onChangeImagenParteVehiculo.bind(this)}
                                                    />
                                                </i>
                                            </div>
                                            <div className="caja-img small-image">
                                                {(this.state.arrayFotos[indice] == undefined)?
                                                    <img src="/images/default.jpg" alt="none" className="img-principal" />
                                                    :
                                                    <img style={{'cursor': 'pointer'}} 
                                                        src={this.getPathImg(indice, this.state.indices[indice])}
                                                        alt="none" className="img-principal" />
                                                }
                                            </div>
                                            <div className="pull-left-content">
                                                <i 
                                                    onClick={this.onChangePreview.bind(this, indice)}
                                                    className="fa-left-content fa fa-angle-double-left small-left"
                                                        style={{'color': '#868686'}}> </i>
                                            </div>
                                    
                                            <div className="pull-right-content">
                                                <i
                                                    onClick={this.onChangeNext.bind(this, indice)}
                                                    className="fa-right-content fa fa-angle-double-right small-right"
                                                    style={{'color': '#868686'}}> </i>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            )
                        })
                    }
                    </div>
                */}
                </div>
                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        
                    </div>
                    <div className="col-lg-6-content col-md-6-content col-sm-12-content col-xs-12-content">
                        <div className="pull-right-content">
                            <a onClick={this.props.callback .bind(this)}
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