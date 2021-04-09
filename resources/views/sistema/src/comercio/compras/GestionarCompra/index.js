import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect, withRouter} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import routes from '../../../utils/routes';
import keys from '../../../utils/keys';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import { readPermisions } from '../../../utils/toolsPermisions';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import { convertYmdToDmy } from '../../../utils/toolsDate';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
const {Option} = Select;

class IndexCompra extends Component {

    constructor(props){
        super(props);
        this.state = {
            compras: [],
            visibleModalVer: false,
            visibleModalEli: false,
            almacenes: [],
            codigos: [],
            caracteristicas: [],
            fotos: [],
            referencias: [],
            vendedor: {
                codvendedor: '',
                nombre: '',
                apellido: '',
                nit: '',
                sexo: '',
                estado: '',
                fechanac: '',
                notas: '',
                idcomision: 0
            },
            
            comprasDefaults: [],
            paginacionDefaults: {},
            modalCancel: false,
            loadingC: false,
            idDelete: -1,

            array_compra: [],
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

            noSesion: false,
            configCodigo: false,

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
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.toString().localeCompare(b.codigo.toString())}
            },
            {
                title: 'Fecha',
                dataIndex: 'fechacompra',
                key: 'fechacompra',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fechacompra.toString().localeCompare(b.fechacompra.toString())}
            },
            {
                title: 'Proveedor',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Tipo de Pago',
                dataIndex: 'tipopago',
                key: 'tipopago',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipopago.localeCompare(b.tipopago)}
            },
            {
                title: 'Monto Total',
                dataIndex: 'montototal',
                key: 'montototal',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.montototal.toString().localeCompare(b.montototal)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {/* {this.btnEditar(record.id)} */}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_ver: readPermisions(keys.compra_btn_ver),
            btn_nuevo: readPermisions(keys.compra_btn_nuevo),
            btn_eliminar: readPermisions(keys.compra_btn_eliminar)
        }
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.closeModalVer = this.closeModalVer.bind(this);
        this.deleteCompra = this.deleteCompra.bind(this);
        this.changePaginationCompras = this.changePaginationCompras.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteCompra(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    btnVer(idcompra) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link  to={routes.compra_show + '/' + idcompra}
                    className="btns btns-sm btns-outline-success"
                    aria-label="editar">
                    <i className="fa fa-eye"> </i>
                </Link>
            );
        }
        return null;
    }

    onCreateData() {
        var url = routes.compra_create;
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

    btnEliminar(idcompra) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ modalCancel: true, idDelete: idcompra }) }//this.showDeleteConfirm(idcompra)}
                    >
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    componentDidMount() {
        this.get_data(1, '', 10);
    }

    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wscompra + '/index' + '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if(result.response == 1){
                
                console.log(result)
                let data = result.data.data;
                let array = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipo === 'R') {
                        tipo = 'Credito';
                    }else{
                        tipo = 'Contado';
                    }
                    array.push({
                        id: data[i].idcompra,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        codigo: result.configcli.codigospropios ? data[i].codcompra == null ? data[i].idcompra : data[i].codcompra : data[i].idcompra,
                        nombre: data[i].proveedor,
                        tipopago: tipo,
                        montototal: data[i].mtototcompra,
                        fechacompra: convertYmdToDmy(data[i].fecha),
                    });
                }
                this.setState({
                    array_compra: array,
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

    changePaginationCompras(page){
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    deleteVendLista(idvendedor) {

        let data = this.state.vendedores;
        let length = data.length;
        let dataNew = [];
        for (let i = 0; i < length; i++) {
            if (data[i].idvendedor !== idvendedor) {
                dataNew.push(data[i]);
            }
        }
        this.setState({
            vendedores: dataNew
        });
    }

    deleteCompra(idcompra) {
        httpRequest('delete', ws.wscompra + '/' + idcompra)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    modalCancel: false,
                    loadingC: false
                });
                this.get_data(1, '', 10);
            } else if (result.response == -2) {
                this.setState({ noSesion: true, modalCancel:  false, loadingC: false })
            } else {
                message.warning(result.message);
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

    showDeleteConfirm(idcompra) {
        const deleteCompra = this.deleteCompra;
        Modal.confirm({
            title: 'Elimiar Compra',
            content: '¿Estas seguro de eliminar la Compra?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                deleteCompra(idcompra);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onChangeBuscar(value) {
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

    onChangeSizePagination(value) {
        this.setState({
            nroPaginacion: value,
        });
        this.get_data(1, this.state.buscar, value);
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
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Compra"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la compra?
                            </label>
                        </div>
                    ]}
                />
            <div className="cards">
                <div className="pulls-left">
                    <h1 className="lbls-title">Gestionar Compras</h1>
                </div>
                { btnNuevo }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <C_Select
                            value = {this.state.nroPaginacion}
                            onChange = {this.onChangeSizePagination.bind(this)}
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
                            onChange={this.onChangeBuscar.bind(this)}
                            title='Buscar'
                            className=''
                        />


                </div>
                <div className="forms-groups" style={{paddingTop: 10}}>
                    <div className="tabless">
                        <Table
                            columns={this.columns}
                            dataSource={this.state.array_compra}
                            bordered = {true}
                            pagination = {false}
                            className = "tables-respons"
                            rowKey = "id"
                        />
                    </div>
                </div>
                <div className="pull-right py-3">
                    <Pagination
                        defaultCurrent = {this.state.pagina}
                        pageSize = {this.state.nroPaginacion}
                        onChange = {this.changePaginationCompras}
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

export default withRouter(IndexCompra);
