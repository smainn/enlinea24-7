
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { message,Modal,Pagination, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

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

class IndexEntregaProducto extends Component {
   constructor(props){
       super(props)
       this.state = {
           visibleOpcion: false,

           visible: false,
           arrayDatosPersonales: [],
           arrayDetalleVenta: [],
           arrayDetalleListaPrecio: [],

           cantidad: 10,

           ventas: [],
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
           configTitleVend: '',
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
                            {this.btnEliminar(record.id)}
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
        return (
            <a className="btns btns-sm btns-outline-danger" 
                style={{ fontWeight: 'bold' }}
                onClick={() => this.props.history.push(routes.entregaproducto + '/nuevo/' + data ) }
            >
                N
            </a>
        );
    }

    onCreateData() {
        this.get_data(1, '', 10);
    }

    btnNuevo() {
        return (
            <C_Button
                title='Refrescar'
                type='primary'
                onClick={this.onCreateData.bind(this)}
            />
        );
    }

    componentDidMount(){
        this.get_data(1, '', 10);
    }

    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wsentregaproducto + '/index'+ '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
            pagina: page,
        })
        .then(result => {
            if (result.response == 1) {

                let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);

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
                    pagination: result.pagination,
                    configCodigo: result.configcliente.codigospropios,
                    configTitleVend: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                    pagina: page,
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

    onChangePage(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }

    onCancel() {
        this.setState({
            visibleOpcion: false,
        });
    }

    onChangeSizePag(value) {
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }

    onChangeSearch(value) {
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
                            <h1 className="lbls-title">
                                Entrega de Productos
                            </h1>
                        </div>
                        <div className="pulls-right">
                            { btnNuevo }
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value={this.state.nroPaginacion}
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
                                value={this.state.buscar}
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
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={this.state.pagina}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total}
                                pageSize={this.state.nroPaginacion}
                                showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                            />
                        </div> 
                    </div>
                </div>
           </div>
       )
   }
}

export default withRouter(IndexEntregaProducto);
