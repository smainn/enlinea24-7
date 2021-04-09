import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import { cambiarFormato, convertYmdToDmy } from '../../../utils/toolsDate';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

class IndexCobranza extends Component {

    constructor(props){
        super(props);
        this.state = {
            cobros: [],
            pagination: {},
            noSesion: false,
            configCodigo: false,
            modalCancel: false,
            loadingC: false,
            idDelete: -1
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
        this.onCancelMC = this.onCancelMC.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteCobro(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    onCreateData() {
        var url = routes.cobranza_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={this.onCreateData.bind(this)}
                    />
                </div>
            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link to={routes.cobranza_show + '/' + (id)}
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
                    onClick={() => this.setState({ modalCancel: true, idDelete: id })}//this.showDeleteConfirm(id)}
                    >
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
                    configCodigo: result.configcliente.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
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
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    deleteCobro(idcobro) {
        httpRequest('delete', ws.wscobranza + '/' + idcobro)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    cobros: result.data,
                    pagination: result.pagination,
                    loadingC: false,
                    modalCancel: false
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, modalCancel: false, loadingC: false })
            } else {
                console.log('Ocurrio un problema en el servidor');
                this.setState({
                    modalCancel: false,
                    loadingC: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                modalCancel: false,
                loadingC: false
            })
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
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
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

                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Eliminar Cobro"
                        loading={this.state.loadingC}
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de eliminar el cobro realizado?
                                </label>
                            </div>
                        ]}
                    />

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
                                                    <td>{convertYmdToDmy(item.fecha)}</td>
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

export default withRouter(IndexCobranza);
