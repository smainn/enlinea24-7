import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import { cambiarFormato } from '../../../tools/toolsDate';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexCobranza extends Component {

    constructor(){
        super();
        this.state = {
            cobros: [],
            pagination: {},
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            codigo: readPermisions(keys.cobranza_input_codigo),
            codigo_venta: readPermisions(keys.cobranza_input_search_codigoVenta),
            fecha: readPermisions(keys.cobranza_fecha),
            cliente_cod: readPermisions(keys.cobranza_input_codigoCliente),
            cliente_nom: readPermisions(keys.cobranza_input_nombreCliente),
            notas: readPermisions(keys.cobranza_textarea_nota),
            total_venta: readPermisions(keys.cobranza_input_totalVenta),
            pagos_acumulados: readPermisions(keys.cobranza_input_pagosAcumulados),
            saldo: readPermisions(keys.cobranza_input_saldo),
            btn_nuevo: readPermisions(keys.cobranza_btn_nuevo),
            btn_ver: readPermisions(keys.cobranza_btn_ver),
            btn_eliminar: readPermisions(keys.cobranza_btn_eliminar),
        }
        this.onChangePage = this.onChangePage.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <Link to="/commerce/admin/cobranza/create" className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </Link>
                </div>
            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link to={"/commerce/admin/cobranza/show/" + (id)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye" > </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(id)}>
                    <i className="fa fa-trash"></i>
                </a>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getCobros();
        
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    getCobros() {

        httpRequest('get', ws.wscobranza)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    cobros: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteCobro(idcobro) {
        httpRequest('delete', ws.wscobranza + '/' + idcobro)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    cobros: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    showDeleteConfirm(idcobro) {
        const deleteCobro = this.deleteCobro.bind(this);
        Modal.confirm({
            title: 'Elimiar Cobro',
            content: '¿Estas seguro de eliminar el cobro?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deleteCobro(idcobro);
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
        httpRequest('get', ws.wscobranza + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    cobros: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }

        const btnNuevo = this.btnNuevo();
        return (

            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Cobranza</h1>
                        </div>
                        { btnNuevo }
                    </div>

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                    <option value="10"> 10 </option>
                                    <option value="25"> 25 </option>
                                    <option value="50"> 50 </option>
                                    <option value="100"> 100 </option>
                                </select>
                                <h3 className="lbl-input-form-content active"> Mostrar </h3>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <div className="inputs-groups">
                                <input type="text" 
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}}> 
                                </i>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Cod Cobro</th>
                                        <th>Cod Venta</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {this.state.cobros.map(
                                        (item, key) => {
                                            let apellido = item.apellidoCliente == null ? '' : item.apellidoCliente;
                                            let codcobro = item.idcobro;
                                            let codventa = item.idventa;
                                            if (this.state.configCodigo) {
                                                codcobro = item.codcobro == null ? '' : item.codcobro;
                                                codventa = item.codventa == null ? '' : item.codventa;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codcobro}</td>
                                                    <td>{codventa}</td>
                                                    <td>{item.nombreCliente + ' ' + apellido}</td>
                                                    <td>{cambiarFormato(item.fecha)}</td>
                                                    <td>
                                                        { this.btnVer(item.idcobro) }
                                                        
                                                        { this.btnEliminar(item.idcobro) }
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="forms-groups">

                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
