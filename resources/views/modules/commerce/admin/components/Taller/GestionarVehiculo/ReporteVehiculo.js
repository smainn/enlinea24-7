
import React, { Component } from 'react';

import {Redirect} from 'react-router-dom';

import axios from 'axios';

export default class ReporteVehiculo extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            redirect: false,
            idVehiculo: '',
        }
    }

    regresarIndexVehiculo() {
        this.setState({
            redirect: true,
        });
    }

    onChangeIdVehiculo(event) {
        this.setState({
            idVehiculo: event.target.value,
        });
    }

    generarReporte() {
        var data = {
            'idVehiculo': this.state.idVehiculo
        }
        axios.get('/commerce/admin/vehiculoReporte').then(
            response => {
                console.log(response.data.data)
            }
        ).catch(
            error => {console.log(error); }
        );
    }

    render() {

        if (this.state.redirect){
            return (<Redirect to="/commerce/admin/indexVehiculo"/>)
        }

        return (
            <div className="row-content">
                <div className="card-header-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Reporte de Vehiculos </h1>
                    </div>
                    <div className="pull-right-content">
                        <button onClick={this.regresarIndexVehiculo.bind(this)}
                            type="button" className="btn-content btn-sm-content btn-primary-content">
                            Atras
                        </button>
                    </div>
                </div>

                <div className="card-body-content">
                    <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                        
                        <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                                <input type="text" 
                                    value={this.state.idVehiculo} onChange={this.onChangeIdVehiculo.bind(this)}
                                    className='form-control-content'
                                    placeholder=" Ingresar id"/>
                                <label className='label-group-content'>Id Vehiculo</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group-content"
                        style={{'marginBottom': '-10px'}}>
                        <div className="text-center-content">
                            <button type="button" onClick={this.generarReporte.bind(this)}
                                className="btn-content btn-sm-content btn-success-content"
                                style={{'marginRight': '20px'}}>
                                Generar
                            </button>
                            <button onClick={this.regresarIndexVehiculo.bind(this)}
                                type="button" className="btn-content btn-sm-content btn-danger-content">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}