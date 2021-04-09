import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal,Card, message } from 'antd';
import { wsproforma } from '../../../WS/webservices';

const URL_GET_INGRESOS_PRECIOS = '/commerce/api/listaprecio';
const URL_SHOW_LISTA_PRECIO = '/commerce/api/listaprecio/';
const URL_DELETE_LISTA_PRECIO = '/commerce/api/listaprecio/';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexProforma extends Component {

    constructor(){
        super();
        this.state = {
            proformas: [],
            pagination: {},
            visibleModalVer: false
        }

        this.onChangePage = this.onChangePage.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        this.getProformas();
    }
    
    getProformas() {
        axios.get(wsproforma)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT PROFORMAS ', result);
            
            if (result.response > 0) {
                this.setState({
                    proformas: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }


    deleteProforma(id) {
        axios.delete(wsproforma + '/' + id)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                //this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
                this.setState({
                    proformas: result.data,
                    pagination: result.pagination
                });
            } else {
                message.error(result.message);
            }
            
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        })
    }

    showDeleteConfirm(idventa) {
        const deleteProforma = this.deleteProforma.bind(this);
        Modal.confirm({
            title: 'Elimiar Ingreso Producto',
            content: '¿Estas seguro de eliminar el ingreso de productos?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deleteProforma(idventa);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onChangePage(page, pageSize) {
        
        axios.get(wsingresoproducto + '?page=' + page)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    ingresoproductos: result.data,
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
                <div>
                    
                    <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Gestionar Proformas </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link 
                                    to="/commerce/admin/proforma/create" 
                                    className="btn btn-primary-content">
                                    <i className="fa fa-plus"> 
                                        Nuevo 
                                    </i>
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
                                    <th>Nro</th>
                                    <th>Codigo</th>
                                    <th>Cliente</th>
                                    <th>Vendedor</th>
                                    <th>Sucursal</th>
                                    <th>Accion</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.proformas.map((item, key) => {
                                        let nombre = item.nombreCliente;
                                        let apellido = item.apellidoCliente == null ? '' : item.apellidoCliente;
                                        let fullnameCliente = nombre + ' ' + apellido;
                                        nombre = item.nombreVendedor;
                                        apellido = item.apellidoVendedor == null ? '' : item.apellidoVendedor;
                                        let fullnameProveedor = nombre + ' ' + apellido;
                                        return (
                                            <tr>
                                                <td><label className="col-show">Nro: </label> {key+1}</td>
                                                <td><label className="col-show">Codigo: </label>{item.codventa} </td>
                                                <td><label className="col-show">Cliente: </label> {fullnameCliente}</td>
                                                <td><label className="col-show">Vendedor: </label>{fullnameProveedor} </td>
                                                <td><label className="col-show">Sucursal: </label> {item.nombreSucursal}</td>
                                                <td><label className="col-show">Accion: </label>
                                                    <Link to={"/commerce/admin/proforma/show/" + (item.idventa)}
                                                        className="btn-content btn-success-content hint--bottom hint--success" 
                                                        aria-label="detalles">
                                                        <i className="fa fa-eye" > </i>
                                                    </Link>
                                            
                                                    <a className="btn-content btn-danger-content hint--bottom hint--error" 
                                                        onClick={() => this.showDeleteConfirm(item.idventa)}
                                                        aria-label="eliminar">
                                                        <i className="fa fa-trash" > </i>
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
                                total={this.state.pagination.total} 
                            />
                        </div>
                    </div>
                </div>
        );
    }
}
