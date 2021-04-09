
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class IndexProducto extends Component{
    render() {

        return (
            <div>
                <div className="row-content">
                    <div className="card-body-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Listado de Producto </h1>
                        </div>
                        <div className="pull-right-content">
                            <Link to="/commerce/admin/indexProducto/nuevo/crearProducto" className="btn btn-primary-content">
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
                                <th>Nombre</th>
                                <th>Color</th>
                                <th>Codigo</th>
                                <th>Descripcion</th>
                                <th>Notas</th>
                                <th>Opcion</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><label className="col-show">#: </label> 1</td>
                                <td><label className="col-show">Nombre: </label> dfsdf </td>
                                <td><label className="col-show">Color: </label> sdfsdfsdf</td>
                                <td><label className="col-show">Codigo: </label>sdfsdfsd </td>
                                <td><label className="col-show">Descripcion: </label>sdfsfsdf </td>
                                <td><label className="col-show">Notas: </label>sdfsdfsdfsd</td>
                                <td><label className="col-show">Opcion: </label>
                                    <a  className="btn btn-sm btn-default-content"><i className="fa fa-edit"> </i></a>
                                    <a className="btn btn-sm btn-danger-content"><i className="fa fa-trash"> </i></a>
                                    <a className="btn btn-sm btn-success-content"><i className="fa fa-eye"> </i></a>
                                </td>
                            </tr>
                            <tr>
                                <td><label className="col-show">#: </label> 2</td>
                                <td><label className="col-show">Nombre: </label> dfs dfgdf </td>
                                <td><label className="col-show">Color: </label> sd dfgfsdfsdf</td>
                                <td><label className="col-show">Codigo: </label>sdfsdfsd </td>
                                <td><label className="col-show">Descripcion: </label>sd eewfsfsdf </td>
                                <td><label className="col-show">Notas: </label>sdfsdfsdfsd</td>
                                <td><label className="col-show">Opcion: </label>
                                    <a className="btn btn-sm btn-default-content"><i className="fa fa-edit"> </i></a>
                                    <a className="btn btn-sm btn-danger-content"><i className="fa fa-trash"> </i></a>
                                    <a className="btn btn-sm btn-success-content"><i className="fa fa-eye"> </i></a>
                                </td>
                            </tr>
                            <tr>
                                <td><label className="col-show">#: </label> 3</td>
                                <td><label className="col-show">Nombre: </label>  wedfsdf </td>
                                <td><label className="col-show">Color: </label> we sdfsdfsdf</td>
                                <td><label className="col-show">Codigo: </label> wesdfsdfsd </td>
                                <td><label className="col-show">Descripcion: </label> wersdfsfsdf </td>
                                <td><label className="col-show">Notas: </label> wesdfsdfsdfsd</td>
                                <td><label className="col-show">Opcion: </label>
                                    <a  className="btn btn-sm btn-default-content"><i className="fa fa-edit"> </i></a>
                                    <a className="btn btn-sm btn-danger-content"><i className="fa fa-trash"> </i></a>
                                    <a className="btn btn-sm btn-success-content"><i className="fa fa-eye"> </i></a>
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


