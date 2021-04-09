import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal,Card, message, Table } from 'antd';
import ws from '../../../tools/webservices';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import C_Select from '../../../components/data/select';
import C_Input from '../../../components/data/input';
import C_Button from '../../../components/data/button';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

class IndexProforma extends Component {

    constructor(props){
        super(props);
        this.state = {
            proformas: [],
            proformasDefault: [],
            pagination: {},
            paginationDefault: {},
            visibleModalVer: false,
            noSesion: false,
            configCodigo: false,
            cantidad: 10,
            busqueda: '',
            nroPagina: 1,
            timeoutSearch: undefined,
            timeoutSearch2: undefined
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
                title: 'Codigo',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Cliente',
                dataIndex: 'cliente',
                key: 'cliente',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.cliente.localeCompare(b.cliente)}
            },
            {
                title: readData(keysStorage.isabogado) == 'A' ? 'Abogado' : 'Vendedor',
                dataIndex: 'vendedor',
                key: 'vendedor',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.vendedor - b.vendedor,
            },
            {
                title: 'Sucursal',
                dataIndex: 'sucursal',
                key: 'sucursal',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.sucursal.localeCompare(b.sucursal)}
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

        this.permisions = {
            btn_ver: readPermisions(keys.venta_btn_ver),
            btn_nuevo: readPermisions(keys.venta_btn_nuevo),
            btn_editar: readPermisions(keys.venta_btn_editar),
            btn_eliminar: readPermisions(keys.venta_btn_eliminar)
        }

        this.onChangePage = this.onChangePage.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.onChangeSizePag = this.onChangeSizePag.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.searchProforma = this.searchProforma.bind(this);
        this.searchProforma2 = this.searchProforma2.bind(this);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link to={"/commerce/admin/proforma/show/" + (data)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye" > </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger" 
                    onClick={() => this.showDeleteConfirm(data)}
                    aria-label="eliminar">
                    <i className="fa fa-trash" > </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = "/commerce/admin/proforma/create";
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button
                    title='Nuevo'
                    type='primary'
                    onClick={this.onCreateData.bind(this)}
                />
            );
        }
        return null;
    }
    
    componentDidMount() {
        this.getConfigsClient();
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            this.getProformas();
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
    
    getProformas() {
        
        httpRequest('get', ws.wsproforma)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    let apecli = data[i].apellidoCliente == null ? '' : data[i].apellidoCliente;
                    let apeven = data[i].apellidoVendedor == null ? '' : data[i].apellidoVendedor;
                    arr.push({
                        id: data[i].idventa,
                        nro: i + 1,
                        codigo: this.state.configCodigo ? data[i].codventa : data[i].idventa.toString(),
                        cliente: data[i].nombreCliente + ' ' + apecli,
                        vendedor: data[i].nombreVendedor + ' ' + apeven,
                        sucursal: data[i].nombreSucursal
                    });
                }
                this.setState({
                    proformas: arr,
                    proformasDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination
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

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }


    deleteProforma(id) {
        httpRequest('delete', ws.wsproforma + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                console.log('Se elimino correctamente');
                //this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
                this.setState({
                    proformas: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result)
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
        
        httpRequest('get', ws.wsingresoproducto + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    ingresoproductos: result.data,
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

    onChangeSizePag(value) {
        this.searchProforma2(null, value);
        this.setState({
            cantidad: value
        })
    }

    async searchProforma2(value, cantidad) {
        await httpRequest('get', ws.wsproforma, {
            busqueda: value,
            paginate: cantidad
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    let apecli = data[i].apellidoCliente == null ? '' : data[i].apellidoCliente;
                    let apeven = data[i].apellidoVendedor == null ? '' : data[i].apellidoVendedor;
                    arr.push({
                        id: data[i].idventa,
                        nro: this.state.cantidad * (this.state.nroPagina - 1) + i + 1,
                        codigo: this.state.configCodigo ? data[i].codventa : data[i].idventa.toString(),
                        cliente: data[i].nombreCliente + ' ' + apecli,
                        vendedor: data[i].nombreVendedor + ' ' + apeven,
                        sucursal: data[i].nombreSucursal
                    });
                }
                this.setState({
                    proformas: arr,
                    pagination: result.pagination,
                    timeoutSearch: undefined
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                console.log('No se pudo procesar la solicitud...');
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchProforma(value) {
        if (value.length > 0) {
            if (this.state.timeoutSearch) {
                clearTimeout(this.state.timeoutSearch);
                this.setState({ timeoutSearch: undefined })
            }
            this.state.timeoutSearch = setTimeout(() => this.searchProforma2(value, this.state.cantidad), 300);
            this.setState({
                timeoutSearch: this.state.timeoutSearch,
                busqueda: value
            })
        } else {
            if (this.state.timeoutSearch) {
                clearTimeout(this.state.timeoutSearch);
            }
            
            this.setState({
                proformas: this.state.proformasDefault,
                pagination: this.state.paginationDefault,
                timeoutSearch: undefined,
                busqueda: value
            })
            
        }
    }

    onChangeSearch(value) {
        this.searchProforma(value);
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
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Proformas</h1>
                        </div>

                        <div className="pulls-right">
                            { btnNuevo }
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <C_Select
                                value={this.state.cantidad}
                                onChange={this.onChangeSizePag}
                                title='Mostrar'
                                className=''
                                style={{ width: 65 }}
                                component={[
                                    <Option key={0} value={10}>10</Option>,
                                    <Option key={1} value={25}>25</Option>,
                                    <Option key={2} value={50}>50</Option>,
                                    <Option key={3} value={100}>100</Option>
                                ]}
                            />
                        </div>

                        <div className="pulls-right">
                            <C_Input
                                value={this.state.busqueda}
                                onChange={this.onChangeSearch}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.proformas}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="nro"
                            />
                        </div>
                    </div>
                    {/*}
                    <div className="forms-groups">

                        <div className="tabless">

                            <table className="tables-respons">

                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Codigo</th>
                                        <th>Cliente</th>
                                        <th>Vendedor</th>
                                        <th>Sucursal</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.proformas.map(
                                        (item, key) => {
                                            let apellidoCli = item.apellidoCliente == null ? '' : item.apellidoCliente;
                                            let apellidoVen = item.apellidoVendedor == null ? '' : item.apellidoVendedor;
                                            let codigo = item.idventa;
                                            if (this.state.configCodigo) {
                                                codigo = item.codventa;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo} </td>
                                                    <td>{item.nombreCliente + ' ' + apellidoCli}</td>
                                                    <td>{item.nombreVendedor + ' ' + apellidoVen} </td>
                                                    <td>{item.nombreSucursal}</td>
                                                    <td>
                                                        { this.btnVer(item.idventa) }

                                                        { this.btnEliminar(item.idventa) }
                                                        
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    */}

                    <div className="forms-groups">
                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexProforma);
