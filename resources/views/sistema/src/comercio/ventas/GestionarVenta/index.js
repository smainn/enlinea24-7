
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { message,Modal,Pagination, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

import ModalOpcionReportes from './modalOpcionReporte';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import C_Select from '../../../componentes/data/select';
import C_Input from '../../../componentes/data/input';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
import { convertYmdToDmy } from '../../../utils/toolsDate';
const confirm = Modal.confirm;

const { Option } = Select;

class IndexVenta extends Component {
   constructor(props){
       super(props)
       this.state = {
           visibleOpcion: false,

           ventas: [],
           ventasDefault: [],
           visible: false,
           arrayDatosPersonales: [],
           arrayDetalleVenta: [],
           arrayDetalleListaPrecio: [],
           pagination: {},
           paginationDefault: {},
           cantidad: 10,
           nroPagina: 1,
           busqueda: '',

           noSesion: false,
           configCodigo: false,
           configTitleVend: '',
           comtaller: false,
           timeoutSearch: undefined,
           modalCancel: false,
           loadingC: false,
           idDelete: -1,
           idfactura: null,
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
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.fecha.localeCompare(b.fecha)}
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
                title: 'Tipo Pago',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipo.localeCompare(b.tipo)}
            },
            {
                title: 'Monto Total',
                dataIndex: 'montototal',
                key: 'montototal',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.montototal.localeCompare(b.montototal)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEliminar(record)}
                        </Fragment>
                    );
                }
            },
        ];

       this.permisions = {
           btn_reporte: readPermisions(keys.venta_btn_reporte),
           btn_ver: readPermisions(keys.venta_btn_ver),
           btn_nuevo: readPermisions(keys.venta_btn_nuevo),
           btn_editar: readPermisions(keys.venta_btn_editar),
           btn_eliminar: readPermisions(keys.venta_btn_eliminar)
       };

       this.onChangePage = this.onChangePage.bind(this);
       this.eliminarVenta = this.eliminarVenta.bind(this);
       this.onChangeSearch = this.onChangeSearch.bind(this);
       this.onChangeSizePag = this.onChangeSizePag.bind(this);
       this.onCancelMC = this.onCancelMC.bind(this);
       this.onOkMC = this.onOkMC.bind(this);
   }

    onCancelMC() {
        this.setState({
            modalCancel: false,
            idfactura: null,
        })
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.eliminarVenta(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    btnReporte() {
        if (this.permisions.btn_reporte.visible == 'A') {
            return (
                <button type="button" 
                    onClick={this.onClickReportes.bind(this)}
                    className="btns btns-primary">
                    <i className="fa fa-file-text"></i>
                    &nbsp;Reportes
                </button>
            );
        }
        return null;
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link to={routes.venta_show + '/' + (data)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye" > </i>
                </Link>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={routes.cliente_edit + '/' + (data)}
                    className="btns btns-sm btns-outline-primary hint--bottom" aria-label="editar">
                    <i className="fa fa-edit"></i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger" 
                    onClick={() => this.setState({ modalCancel: true, idDelete: data.id, idfactura: data.factura, }) }//this.showDeleteConfirm.bind(this, id)}
                    aria-label="eliminar">
                    <i className="fa fa-trash" > </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = routes.venta_create;
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

    componentDidMount(){
        this.getConfigsClient();
        this.getConfigsFabrica();
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getVentas();
                this.setState({
                    configCodigo: result.configcliente.codigospropios,
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getConfigsFabrica() {
        httpRequest('get', ws.wsconfigfabrica)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    comtaller: result.data.comtaller,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }


    getVentas() {
        httpRequest('get', ws.wsventa)
        .then(result => {
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
                        fecha: convertYmdToDmy(data[i].fecha),
                        cliente: data[i].nombreCliente + ' ' + apecli,
                        vendedor: data[i].nombreVendedor + ' ' + apeven,
                        tipo: data[i].tipo,
                        montototal: data[i].mtototventa,
                        factura: data[i].idfactura,
                    });
                }
                this.setState({
                    ventas: arr,
                    ventasDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log('No se proceso la solicitud correctamente...');
            }
        })
        .catch(error => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    eliminarVenta(id){
            httpRequest('delete', ws.wsventa + '/'+ id)
            .then( result => {
                console.log(result)
                if (result.response == 1) {
                    message.success("Se elimino correctamente el Registro De Venta");
                    this.getVentas();
                    this.setState({
                        loadingC: false,
                        modalCancel: false
                    })
                } else if (result.response == 0) {
                    message.error("No se Puede Eliminar Este Registro ya tiene un Plan de Pago");
                    this.setState({
                        loadingC: false,
                        modalCancel: false
                    })
                } else if (result.response == -2) {
                    this.setState({ noSesion: true, loadingC: false, modalCancel: false })
                } else if (result.response == -1) {
                    message.error('No se pudo procesar la peticion');
                    this.setState({
                        loadingC: false,
                        modalCancel: false
                    })
                }
            }).catch (error => {
                console.log(error);
                message.error(strings.message_error);
                this.setState({
                    loadingC: false,
                    modalCancel: false
                })
            })
    }

    showDeleteConfirm(id) {
        let eliminarVenta = this.eliminarVenta.bind(this);
        confirm({
            title: 'Esta Seguro De Eliminar Esta Registro?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                eliminarVenta(id);
                //this2.eliminarVenta(this2,datosVenta)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    verDatosRegistroVenta(datosVenta){ 
        var body = {
            "idventa":  datosVenta.idventa
        }
        httpRequest('get', ws.wsventa + '/' + datosVenta.idventa + '/edit')
        .then(result=>{
            if (result.response == 1) {

                this.setState({
                    arrayDatosPersonales:   result.data,
                    arrayDetalleListaPrecio:    result.datosDetallePrecio,
                    arrayDetalleVenta:  result.datosDetalle
                });
           } else if (result.response == -2) {
               this.setState({ noSesion: true })
           } else {
               console.log('Ocurrio un problema en la solicitud');
           }
        }).catch(error => {
           console.log(error);
           message.error(strings.message_error);
        });
        this.setState({
            visible: !this.state.visible
        });
    }

    handleOk (e)  {
        this.setState({
            visible: false,
        });
    }

    handleCancel (e) {
        this.setState({
            visible: false,
        });
    }

    onChangePage(page, pageSize) {

        httpRequest('get', ws.wsventa + '?page=' + page, {
            busqueda: this.state.busqueda,
            paginate: this.state.cantidad
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
                        nro: this.state.cantidad * (page - 1) + i + 1,
                        codigo: this.state.configCodigo ? data[i].codventa : data[i].idventa.toString(),
                        fecha: convertYmdToDmy(data[i].fecha),
                        cliente: data[i].nombreCliente + ' ' + apecli,
                        vendedor: data[i].nombreVendedor + ' ' + apeven,
                        tipo: data[i].tipo,
                        montototal: data[i].mtototventa,
                        factura: data[i].idfactura,
                    });
                }
                this.setState({
                    ventas: arr,
                    ventasDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination,
                    nroPagina: page
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

    onClickReportes() {
        this.setState({
            visibleOpcion: true,
        });
    }
    onCancel() {
        this.setState({
            visibleOpcion: false,
        });
    }

    onClickSeleccion(event) {
        if (event == 1) {
            this.props.history.push(routes.venta_reporte);
        }
        if (event == 2) {
            this.props.history.push(routes.venta_reporte_por_cobrar);
        }
        if (event == 3) {
            this.props.history.push(routes.venta_reporte_por_cobros);
        }
        if (event == 4) {
            this.props.history.push(routes.venta_reporte_detallado);
        }
        if (event == 5) {
            this.props.history.push(routes.venta_reporte_historico_vehiculo);
        }
    }

    onChangeSizePag(value) {
        this.searchVenta2(null, value);
        this.setState({
            cantidad: value
        });
    }

    searchVenta2(value, cantidad) {
        httpRequest('get', ws.wsventa, {
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
                        fecha: convertYmdToDmy(data[i].fecha),
                        cliente: data[i].nombreCliente + ' ' + apecli,
                        vendedor: data[i].nombreVendedor + ' ' + apeven,
                        tipo: data[i].tipo,
                        montototal: data[i].mtototventa,
                        factura: data[i].idfactura,
                    });
                }
                this.setState({
                    ventas: arr,
                    pagination: result.pagination,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                console.log('No se pudo procesar la solicitud...');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    searchVenta(value) {
        if (value.length > 0) {
            if (this.state.timeoutSearch) {
                clearTimeout(this.state.timeoutSearch);
                this.setState({ timeoutSearch: undefined })
            }
            this.state.timeoutSearch = setTimeout(() => this.searchVenta2(value, this.state.cantidad), 300);
            this.setState({
                timeoutSearch: this.state.timeoutSearch
            })
        } else {
            clearTimeout(this.state.timeoutSearch);
            this.setState({
                ventas: this.state.ventasDefault,
                pagination: this.state.paginationDefault,
                timeoutSearch: undefined
            })
        }
    }

    onChangeSearch(value) {
        this.searchVenta(value);
        this.setState({
            busqueda: value
        })
    }

   render() {
       if (this.state.noSesion) {
           removeAllData();
           return (
                <Redirect to={routes.inicio} />
           );
       }
       const btnNuevo = this.btnNuevo();
       const btnReporte = this.btnReporte();
       return (
           <div className="rows">

                <Modal
                    title="Datos De Venta"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    width={850}
                    okText="Aceptar"
                    bodyStyle={{  
                        height : window.innerHeight * 0.9 
                    }}
                >
                    <div className='row-content-modal'> 
                        <div className="form-group-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].codventa:""}</label>
                            </div>
                                
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Fecha:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].fecha: ""} </label>
                            </div>
                            
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Sucursal:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombresucursal: ""} </label>
                            </div>
                            
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Almacen:</label>
                                <label >{this.state.arrayDetalleVenta.length > 0 ? this.state.arrayDetalleVenta[0].almacen: ""} </label>
                            </div>     
                        </div>
                        <div className="form-group-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Codigo:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].idcliente:""}</label>
                            </div>
                                
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Cliente:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nombrecliente + " " + this.state.arrayDatosPersonales[0].apellidocliente: ""} </label>
                            </div>
                            
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Nit:</label>
                                <label >{this.state.arrayDatosPersonales.length > 0 ? this.state.arrayDatosPersonales[0].nit: ""} </label>
                            </div>
                            
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal label-group-content-nwe'>Moneda:</label>
                                <label >{this.state.arrayDetalleListaPrecio.length > 0 ? this.state.arrayDetalleListaPrecio[0].descripcion: ""} </label>
                            </div>   
                        </div>
                    </div>
                </Modal>

                <ModalOpcionReportes 
                    visible={this.state.visibleOpcion}
                    onCancel={this.onCancel.bind(this)}
                    onClick={this.onClickSeleccion.bind(this)}
                    configtaller={this.state.comtaller}
                />

                <Confirmation
                    visible={this.state.modalCancel}
                    title={'Eliminar Venta ' + (this.state.idfactura == null ? '' : 'Facturada')}
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la Venta?
                            </label>
                        </div>
                    ]}
                />

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Venta</h1>
                        </div>
                        <div className="pulls-right">
                            { /*btnReporte*/ }
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
                                dataSource={this.state.ventas}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="nro"
                                scroll={{ x: '100%', }}
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={this.state.nroPagina}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total}
                                pageSize={this.state.cantidad}
                                showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                            />
                        </div> 
                    </div>
                </div>
           </div>
       )
   }
}

export default withRouter(IndexVenta);
