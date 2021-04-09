
import React, { Component } from 'react';

//import {cambiarFormato} from '../../../tools/toolsDate'

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
            arrayFotos: []
        }
    }
    
    componentDidMount() {
        this.preparDatos();
    }

    onChangePreview(posicion) {
        if (this.state.arrayFotos[posicion].length > 1){
            var indicePreview = this.state.indices[posicion];
            if (indicePreview === 0){
                indicePreview = this.state.arrayFotos[posicion].length - 1;
            }else{
                indicePreview = indicePreview - 1;
            }
            this.state.indices[posicion] = indicePreview;
            this.setState({
                indices: this.state.indices
            },
                () => console.log('INDICES ', this.state.indices)
            )
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
            },
                () => console.log('INDICES ', this.state.indices)
            )
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
        },
            () => console.log('FOTOS ', this.state.arrayFotos)
        );
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
        console.log('PARTES VEHICULO ', this.props.vehiculoPartes);
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
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                    Nro Venta:
                                </label>
                            </div>
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {nroVenta}
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-4-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-4px'}}>
                                    Cliente:
                                </label>
                            </div>
                            <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content" style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {nombreCliente + ' ' + apellidoCliente}
                                </label>
                            </div>
                        </div>
                        <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                            <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content"
                                    style={{'color': '#053079', 'marginLeft': '-8px'}}>
                                    Placa :
                                </label>
                            </div>
                            <div className="col-lg-6-content col-md-8-content col-sm-12-content col-xs-12-content">
                                <label className="label-group-content" style={{'display': 'block', 'marginLeft': '-20px'}}>
                                    {placa}
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
                                    {nombrePartes}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-10-content col-md-10-content col-sm-12-content col-xs-12-content"
                    style={{'border': '1px solid #e8e8e8'}}>
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
                    {
                        this.props.vehiculoPartes.map((item, key) => {
                            
                            return (
                                <div 
                                    key={key} 
                                    className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content"
                                    style={{'borderBottom': '1px solid #e8e8e8'}}>
                                    <div className="col-lg-1-content col-md-1-content col-sm-1-content col-xs-12-content">
                                        <label 
                                            className="label-group-content" 
                                            style={{'display': 'block', 'marginTop': '25px'}}>
                                            {key + 1}
                                        </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                        <label 
                                            className="label-group-content" 
                                            style={{'display': 'block', 'marginTop': '25px'}}>
                                            {item.nombrePartes}
                                        </label>
                                    </div>
                                    <div className="col-lg-2-content col-md-1-content col-sm-1-content col-xs-12-content">
                                        <input 
                                            type="text" 
                                            style={{'marginTop': '12px', 'fontSize': '15px'}} 
                                            maxLength="10"
                                            value={item.cantidad}
                                            className="form-control-content reinicio-padding" 
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-lg-2-content col-md-2-content col-sm-2-content col-xs-12-content">
                                        <input type="text" style={{'marginTop': '12px', 'fontSize': '15px'}}
                                            size="10" placeholder="Ingresar Observacion"
                                            className="form-control-content reinicio-padding"
                                            value={this.getEstado(item.estado)}
                                            readOnly
                                        />
                                    </div>  
                                    <div className="col-lg-3-content col-md-4-content col-sm-3-content col-xs-12-content">
                                        <input type="text" style={{'marginTop': '12px', 'fontSize': '15px'}}
                                            size="10" placeholder="Ingresar Observacion"
                                            className="form-control-content reinicio-padding"
                                            value={item.observaciones}
                                            readOnly
                                        />
                                    </div> 
                                    <div className="col-lg-2-content col-md-2-content col-sm-3-content col-xs-12-content">
                                        <div className="card-caracteristica">
                                            <div className="caja-img small-image">
                                                {(this.state.arrayFotos.length === 0)?
                                                    <img src="/images/default.jpg" alt="none" className="img-principal" />
                                                    :
                                                    <img style={{'cursor': 'pointer'}} 
                                                        src={this.getPathImg(key, this.state.indices[key])}
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
                                    </div> 
                                </div>
                            )
                        })
                    }
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