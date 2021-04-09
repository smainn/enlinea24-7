
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import axios from 'axios';

export default class IndexVehiculo extends Component{

    constructor() {
        super();
        this.state = {
            vehiculos: []
        }
    }

    componentWillMount() {
        axios.get('indexVehiculo').then( resultado => {
            this.setState({
                vehiculos: resultado.data
            });
            console.log(resultado.data);
        }).catch( error => {
            console.log(error)
        });
    }

    render() {

        return (
            <div>
                <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Listado de Vehiculo </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/indexVehiculo/nuevo/crearVehiculo" className="btn btn-primary-content">
                                    <i className="fa fa-plus"> Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <select className="form-control-sm-content" id="card-search">
                                    <option value="1"> 10 </option>
                                    <option value="2"> 25 </option>
                                    <option value="3"> 50 </option>
                                    <option value="4"> 100 </option>
                                </select>
                                <h3 className="title-lg-content"> Mostrar </h3>
                            </div>
                            <div className="pull-right-content">
                                <input type="text" className="form-control-md-content" id="input-search" placeholder=" Buscar ..."/>
                                <i className="fa fa-search input-fa"> </i>
                            </div>
                        </div>
                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>#</th>
                                    <th>Placa</th>
                                    <th>Tipo</th>
                                    <th>Chasis</th>
                                    <th>Descripcion</th>
                                    <th>Notas</th>
                                    <th>Opcion</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><label className="col-show">#: </label> 1</td>
                                    <td><label className="col-show">Placa: </label> dfsdf </td>
                                    <td><label className="col-show">Tipo: </label> sdfsdfsdf</td>
                                    <td><label className="col-show">Chasis: </label>sdfsdfsd </td>
                                    <td><label className="col-show">Descripcion: </label>sdfsfsdf </td>
                                    <td><label className="col-show">Notas: </label>sdfsdfsdfsd</td>
                                    <td><label className="col-show">Opcion: </label>
                                        <a  className="btn btn-sm btn-default-content hint--bottom" aria-label="editar"><i className="fa fa-edit"> </i></a>
                                        <a className="btn btn-sm btn-danger-content hint--bottom hint--error" aria-label="eliminar"><i className="fa fa-trash"> </i></a>
                                        <a className="btn btn-sm btn-success-content hint--bottom hint--success" aria-label="detalles"><i className="fa fa-eye"> </i></a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>
        );

    }
}


