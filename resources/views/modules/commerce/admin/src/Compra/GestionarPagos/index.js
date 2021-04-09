import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect, withRouter } from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../tools/webservices';
import { cambiarFormato } from '../../../tools/toolsDate';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import C_Button from '../../../components/data/button';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;

const {Option} = Select;

class IndexPago extends Component {

    constructor(){
        super();
        this.state = {
            pagos: [],
            noSesion: false,
            pagination: {},
            configCodigo: false,
            buscar: '',
            timeoutSearch: undefined,
            pagina: 1,
            comprasDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
        }
        this.permisions = {
            btn_ver: readPermisions(keys.pago_btn_ver),
            btn_nuevo: readPermisions(keys.pago_btn_nuevo),
            btn_eliminar: readPermisions(keys.pago_btn_eliminar)
        }
        this.btnVer = this.btnVer.bind(this);
        //this.btnEliminar = this.btnEliminar.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    }

    componentDidMount() {
        this.getConfigsClient();
        this.getPagos();
    }

    getConfigsClient() {

        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getPagos() {

        httpRequest('get', ws.wspagos)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    pagos: result.data,
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

    deletePago(idpago) {
        httpRequest('delete', ws.wspagos + '/' + idpago)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    pagos: result.data,
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
    showDeleteConfirm(idpago) {
        console.log('ID PAGO ===> ', idpago);
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
        httpRequest('get', ws.wspagos + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    pagos: result.data,
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

    onCreateData() {
        var url = "/commerce/admin/pago/create";
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return(
                <C_Button
                    title='Nuevo'
                    type='primary'
                    onClick={this.onCreateData.bind(this)}
                />
            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A'){
            return(
                <Link to={"/commerce/admin/pago/show/" + id
                }
                    className="btns btns-sm btns-outline-success"
                    aria-label="detalles">
                    <i className="fa fa-eye" > </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        console.log('ID ==> ', id);
        if (this.permisions.btn_eliminar.visible == "A") {
            return(
                <a className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(id)}>
                    <i className="fa fa-trash"></i>
                </a>
            );
        }
        return null;
    }

    onChangeBuscarDato(value) {
        this.setState({
            buscar: value,
        });
    }
    onChangeNroPagination(value) {
        this.setState({
            nroPagination: value,
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();

        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Pagos</h1>
                        </div>
                        <div className="pulls-right">
                            { btnNuevo }
                        </div>
                    </div>
                    <div className="forms-groups">

                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPagination}
                                onChange = {this.onChangeNroPagination.bind(this)}
                                title = 'Mostrar'
                                className = ''
                                style = {{ width: 65 }}
                                component = {[
                                    <Option key = {0} value = {10}>10</Option>,
                                    <Option key = {1} value = {25}>25</Option>,
                                    <Option key = {2} value = {50}>50</Option>,
                                    <Option key = {3} value = {100}>100</Option>,
                                ]}
                            />
                        </div>

                        <div className="pulls-right">
                            <C_Input
                                value={this.state.buscar}
                                onChange={this.onChangeBuscarDato.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Cod Pago</th>
                                        <th>Cod Compra</th>
                                        <th>Proveedor</th>
                                        <th>Fecha</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.pagos.map(
                                        (resultado, key) => {
                                            let codpago = (resultado.codpago == null || !this.state.configCodigo) ? resultado.idpagos : resultado.codpago;
                                            let apellido = resultado.apellidoProveedor == null ? '' : resultado.apellidoProveedor;
                                            let codcompra = (resultado.codcompra == null || !this.state.configCodigo) ? resultado.idcompra : resultado.codcompra;
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codpago}</td>
                                                    <td>{codcompra}</td>
                                                    <td>{resultado.nombreProveedor + ' ' + apellido}</td>
                                                    <td>{cambiarFormato(resultado.fecha)}</td>
                                                    <td>
                                                        { this.btnVer(resultado.idpagos) }
                                                        { this.btnEliminar(resultado.idpagos) }
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

export default withRouter(IndexPago);

