
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { message, Modal, Spin, Icon, Pagination } from 'antd';
import 'antd/dist/antd.css';

import { wsinventariocorte } from '../../../WS/webservices';

export default class IndexInventarioCorte extends Component{

    constructor() {
        
        super();
        this.state = {
            inventarios: [],
            pagination: {}
        }
    }

    componentDidMount() {
        //this.getProveedor(1, '', 5);
        this.getInventarios();
    }

    getInventarios() {

        axios.get(wsinventariocorte)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    inventarios: result.data,
                    pagination: result.pagination
                });
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })

    }

    onChangePage(page, pageSize) {
        
        axios.get(wsinventariocorte + '?page=' + page)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    inventarios: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        
        return (
            <div className="row-content">

                <div className="card-body-content card-primary-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Gestionar Inventario</h1>
                    </div>
                    <div className="pull-right-content">
                        <Link to="/commerce/admin/inventariocorte/create"
                            className="btn-content btn-sm-content btn-primary-content">
                            <i> Nuevo </i>
                        </Link>
                    </div>
                </div>
                <div className="card-header-content">

                    <div className="pull-left-content">
                        <div className="input-group-content">
                            <select 
                                //value={this.state.nroPagination}
                                //onChange={this.onChangeNroPagination.bind(this)}
                                className="form-control-content w-25-content">
                                <option value="2"> 2 </option>
                                <option value="5"> 5 </option>
                                <option value="10"> 10 </option>
                                <option value="25"> 25 </option>
                                <option value="50"> 50 </option>
                                <option value="100"> 100 </option>
                            </select>
                            <h3 className="title-md-content"> Mostrar </h3>
                        </div>
                    </div>

                    <div className="pull-right-content">
                        <div className="input-group-content">
                            <input 
                                type="text" 
                                //onKeyPress={this.onChangeEnter.bind(this)}
                                //value={this.state.buscar} 
                                //onChange={this.onChangeBuscarDato.bind(this)}
                                className="form-control-content w-75-content"  
                                placeholder=" Buscar ..."/>
                            <i 
                                className="fa fa-search fa-content" 
                                //onClick={this.onChangeBuscar.bind(this)}
                            > 
                            </i>
                        </div>
                    </div>

                </div>

                <div className="table-content">
                    <table className="table-responsive-content">
                        <thead>
                        <tr className="row-header">
                            <th>Nro</th>
                            <th>Descripcion</th>
                            <th>Almacen</th>
                            <th>Fecha</th>
                            <th>Opcion</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.inventarios.map((item, key) => (
                                    <tr key={key}>
                                        <td>
                                            <label className="col-show">Id: </label> {key + 1}
                                        </td>
                                        <td>
                                            <label className="col-show">Descripcion: </label> {item.descripcion}
                                        </td>

                                        <td>
                                            <label className="col-show">Almacen: </label> {'ALMACEN 1'}
                                        </td>

                                        <td>
                                            <label className="col-show">Fecha: </label> {item.fecha}
                                        </td>
                                        
                                        <td><label className="col-show">Opcion: </label>
                                            <a 
                                                //onClick={this.abrirModalShow.bind(this, proveedor.idproveedor)}
                                                className="btn-content btn-success-content hint--bottom hint--success" 
                                                aria-label="detalles">
                                                <i className="fa fa-eye"> </i>
                                            </a>
                                            <Link 
                                                //to={`/commerce/admin/indexProveedor/actualizar/${proveedor.idproveedor}`}
                                                className="btn-content btn-primary-content hint--bottom hint--bottom"
                                                aria-label="editar" >
                                                <i className="fa fa-edit"> </i>
                                            </Link>
                                            <a 
                                                //onClick={this.abrirModalDelete.bind(this, proveedor.idproveedor, indice)}
                                                className="btn-content btn-danger-content hint--bottom hint--error"
                                                aria-label="eliminar" >
                                                <i className="fa fa-trash"> </i>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="text-center-content">
                    <Pagination 
                        defaultCurrent={1}
                        onChange={this.onChangePage}
                        total={this.state.pagination.total} />
                </div>
            </div>
        );
    }
}