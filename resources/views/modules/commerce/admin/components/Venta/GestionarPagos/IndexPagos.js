import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import { wspagos } from '../../../WS/webservices';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexCobranza extends Component {

    constructor(){
        super();
        this.state = {
            pagos: [],
            pagination: {},
            
        }

        this.onChangePage = this.onChangePage.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        
        this.getPagos();
        
    }
    
    getPagos() {

        axios.get(wspagos)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    pagos: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deletePago(idpago) {
        
        axios.delete(wspagos + '/' + idpago)
        .then((resp) => {
            let result = resp.data;
            console.log('RESP SERVER ', result);
            if (result.response > 0) {
                message.success(result.message);
                this.setState({
                    pagos: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    showDeleteConfirm(idpago) {

        const deletePago = this.deletePago.bind(this);
        Modal.confirm({
            title: 'Elimiar Pago',
            content: '¿Estas seguro de eliminar el pago?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deletePago(idpago);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentBodyModalVer() {
        
    }

    closeModalVer() {

    }

    visibleModalVer() {

    }

    onChangePage(page, pageSize) {
        axios.get(wspagos + '?page=' + page)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    pagos: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {

        const componentBodyModalVer = this.componentBodyModalVer();
        
        return (

                <div> 
                    <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Gestion de Pagos </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/pagos/create" className="btn btn-primary-content">
                                    <i> Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <div className="input-group-content">
                                    <select className="form-control-content w-25-content" id="card-search">
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
                                    <input type="text" className="form-control-content w-75-content" placeholder=" Buscar ..."/>
                                    <i className="fa fa-search fa-content"> </i>
                                </div>
                            </div>
                        </div>

                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>Nro</th>
                                    <th>Cod pago</th>
                                    <th>Cod compra</th>
                                    <th>Nombre Proveedor</th>
                                    <th>Fecha</th>
                                    <th>Operaciones</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.pagos.map((item,key) => {
                                        let apellido = item.apellidoProveedor == null ? '' : item.apellidoProveedor;
                                        let fullname = item.nombreProveedor + ' ' + apellido;
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">Nro: </label>{key + 1}</td>
                                                <td><label className="col-show">Cod Pago: </label>{item.codpago}</td>
                                                <td><label className="col-show">Cod com: </label>{item.codcompra}</td>
                                                <td><label className="col-show">Prov: </label>{fullname}</td>
                                                <td><label className="col-show">Fecha: </label>{item.fecha}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <Link to={"/commerce/admin/pagos/show/" + (item.idpagos)}
                                                        className="btn-content btn-success-content hint--bottom hint--success" 
                                                        aria-label="detalles">
                                                        <i className="fa fa-eye" > </i>
                                                    </Link>
                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        onClick={() => this.showDeleteConfirm(item.idpagos)}
                                                        >
                                                        <i className="fa fa-trash"> 
                                                        </i>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
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
                </div>
        );
    }
}
