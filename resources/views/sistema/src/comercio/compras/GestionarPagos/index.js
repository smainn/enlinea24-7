import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect, withRouter } from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import { cambiarFormato, convertYmdToDmy } from '../../../utils/toolsDate';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;

const {Option} = Select;

class IndexPago extends Component {

    constructor(props){
        super(props);
        this.state = {
            pagos: [],
            noSesion: false,
            configCodigo: false,
            modalCancel: false,
            loadingC: false,
            idDelete: -1,

            array_pago: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,

        }
        this.permisions = {
            btn_ver: readPermisions(keys.pago_btn_ver),
            btn_nuevo: readPermisions(keys.pago_btn_nuevo),
            btn_eliminar: readPermisions(keys.pago_btn_eliminar)
        }

        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Cod Pago',
                dataIndex: 'codpago',
                key: 'codpago',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codpago.localeCompare(b.codpago)}
            },
            {
                title: 'Cod Compra',
                dataIndex: 'codcompra',
                key: 'codcompra',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codcompra.localeCompare(b.codcompra)}
            },
            {
                title: 'Proveedor',
                dataIndex: 'proveedor',
                key: 'proveedor',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.proveedor.localeCompare(b.proveedor)},
            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fecha.localeCompare(b.fecha)},
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];

        this.btnVer = this.btnVer.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);

    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deletePago(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    componentDidMount() {
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wspagos + '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if(result.response == 1){
                let data = result.data.data;
                let array = [];
                for (let i = 0; i < data.length; i++) {
                    array.push({
                        id: data[i].idpagos,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        codpago: result.configcli.codigospropios ? data[i].codpago == null ? data[i].idpagos : data[i].codpago : data[i].idpagos,
                        codcompra: result.configcli.codigospropios ? data[i].codcompra == null ? data[i].idcompra : data[i].codcompra : data[i].idcompra,
                        proveedor: data[i].apellidoProveedor == null ? data[i].nombreProveedor : data[i].nombreProveedor + ' ' + data[i].apellidoProveedor,
                        fecha: convertYmdToDmy(data[i].fecha),
                    });
                }
                this.setState({
                    array_pago: array,
                    pagination: result.pagination,
                    configCodigo: result.configcli.codigospropios,
                    pagina: page,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    deletePago(idpago) {
        httpRequest('delete', ws.wspagos + '/' + idpago)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    pagos: result.data,
                    pagination: result.pagination,
                    modalCancel: false,
                    loadingC: false
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true, loadingC: false, modalCancel: false })
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

    onCreateData() {
        var url = routes.pago_create;
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
                <Link to={routes.pago_show + '/' + id}
                    className="btns btns-sm btns-outline-success"
                    aria-label="detalles">
                    <i className="fa fa-eye" > </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == "A") {
            return(
                <a className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ modalCancel: true, idDelete: id }) }//this.showDeleteConfirm(id)}
                >
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
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.get_data(1, value, this.state.nroPaginacion), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangeNroPagination(value) {
        this.setState({
            nroPaginacion: value,
        });
        this.get_data(1, this.state.buscar, value);
    }
    onChangePagina(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const btnNuevo = this.btnNuevo();

        return (
            <div className="rows">
                <div className="cards">
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Pago"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar el pago?
                            </label>
                        </div>
                    ]}
                />
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
                                value = {this.state.nroPaginacion}
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
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_pago}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "id"
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="pull-right py-3">
                            <Pagination
                                defaultCurrent = {this.state.pagina}
                                pageSize = {this.state.nroPaginacion}
                                onChange = {this.onChangePagina.bind(this)}
                                total = {this.state.pagination.total}
                                showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexPago);

