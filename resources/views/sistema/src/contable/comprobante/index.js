
import React, { Component, Fragment } from 'react';

import { Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, message, Divider, Table, Select, notification } from 'antd';
import ws from '../../utils/webservices';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';

import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import strings from '../../utils/strings';
import { convertYmdToDmy } from '../../utils/toolsDate';
import Confirmation from '../../componentes/confirmation';
import C_CheckBox from '../../componentes/data/checkbox';
const { Option } = Select;

class IndexComprobante extends Component {
    constructor(props){
        super(props);
        this.state = {
            comprobantes: [],
            visibleModalVer: false,
            visible_loading: false,
            noSesion: false,
            buscar: '',
            comprobante: undefined,
            detalle: [],
            timeoutSearch: undefined,
            pagination: {},
            paginationDefault: {},
            pagina: 1,
            comprobantesDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            busqueda: '',
            cantPaginas: 10,
            modalCancel: false,
            loadingC: false,
            idDelete: -1,

            asientoautomdecomprob: false,
            configcodigo: false,
            visible_generar: false,
            selected: false,
            selected_data: false,
            selected_sistemacomercial: 0,
            array_sistcomercial: [],
            idsistcomercial: null,
        };

        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                width: 50,
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
                defaultSortOrder: 'ascend',
                width: 100,
                sorter: (a, b) => {return a.fecha.localeCompare(b.fecha)}
            },
            {
                title: 'TipoComp',
                dataIndex: 'tipocomp',
                key: 'tipocomp',
                defaultSortOrder: 'ascend',
                width: 150,
                sorter: (a, b) => {return a.tipocomp.localeCompare(b.tipocomp)}
            },
            {
                title: 'Numero',
                dataIndex: 'numero',
                key: 'numero',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.numero.localeCompare(b.numero)}
            },
            {
                title: 'Referido a',
                dataIndex: 'referidoa',
                key: 'referidoa',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.referidoa.localeCompare(b.referidoa)}
            },
            {
                title: 'Glosa',
                dataIndex: 'glosa',
                key: 'glosa',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.glosa.localeCompare(b.glosa)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                width: 150,
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record)}
                            {this.btnEditar(record)}
                            {this.btnEliminar(record)}
                            {this.checkcontabilizar(record)}
                        </Fragment>
                    );
                }
            },
        ];

        this.permisions = {
            btn_nuevo: readPermisions(keys.comprobante_btn_nuevo),
            btn_ver: readPermisions(keys.comprobante_btn_ver),
            btn_editar: readPermisions(keys.comprobante_btn_editar),
            btn_eliminar: readPermisions(keys.comprobante_btn_eliminar)
        }
        
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeSizePage = this.onChangeSizePage.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteComprobante(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    btnVer(comprobante) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link  to={routes.comprobante_show + '/' + comprobante.id}
                    className="btns btns-sm btns-outline-success"
                    aria-label="Ver">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEditar(comprobante) {
        if (this.permisions.btn_editar.visible == 'A' && comprobante.estado == 'A') {
        //if (comprobante.estado == 'A') {
            return (
                <Link  to={routes.comprobante_edit + '/' + comprobante.id}
                    className="btns btns-sm btns-outline-primary"
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(comprobante) {
        if (this.permisions.btn_eliminar.visible == 'A' && comprobante.estado == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ modalCancel: true, idDelete: comprobante.id }) }
                >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }
    checkcontabilizar(data) {
        return (
            <C_CheckBox
                style={{ marginLeft: 1, position: 'relative', top: 10 }}
                disabled={true}
                checked={data.contabilizar}
                tooltip='Contabilizar'
                placement='left'
            />
        );
    }

    onCreateData() {
        var url = routes.comprobante_create;
        this.props.history.push(url);
    }

    btnNuevo() {
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

    showComprobante(id) {
        httpRequest('get', ws.wscomprobante + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    comprobante: result.comprobante,
                    detalle: result.detalle,
                    visibleModalVer: true
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    componentDidMount() {
        this.getComprobantes(1, '', 10);
    }

    getComprobantes(page, search, nropagination) {
        httpRequest('get', ws.wscomprobante + '?page=' + page, {
            busqueda: search,
            paginate: nropagination
        })
        .then((result) => {
            console.log(result)
            if (result.response == 1) {
                let data = result.data;
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].idcomprobante,
                        nro: 10 * (page - 1) + (i + 1),
                        estado: data[i].estado,
                        fecha: convertYmdToDmy(data[i].fecha.substring(0, 10)),
                        tipocomp: data[i].comprobantetipo,
                        numero: data[i].codcomprobante,
                        referidoa: data[i].referidoa == null ? '' : data[i].referidoa,
                        glosa: data[i].glosa == null ? '' : data[i].glosa,
                        contabilizar: data[i].contabilizar == 'S' ? true : false,
                    });
                }

                this.setState({
                    comprobantes: arr,
                    pagination: result.pagination,
                    configcodigo: result.configcliente.codigospropios,
                    asientoautomdecomprob: result.configcliente.asientoautomdecomprob == 'S' ? true : false,
                })
            
            } else if (result.response == -2) {
                this.setState({
                    noSesion: true
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    onChangePage(page){
        this.getComprobantes(page, this.state.buscar, this.state.nroPaginacion);
    }

    onChangeSearch(value){
        var search = value;
        this.setState({
            buscar: value,
            pagina: 1,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(
            () => this.getComprobantes(1, search, this.state.nroPaginacion), 500
        );
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeSizePage(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.getComprobantes(1, this.state.buscar, value);
    }

    deleteComprobante(id) {
        this.setState({
            loadingC: true,
        });
        httpRequest('delete', ws.wscomprobante + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                this.getComprobantes(1, '', 10);
                this.setState({
                    loadingC: false,
                    modalCancel: false,
                    pagina: 1,
                    buscar: '',
                    nroPaginacion: 10,
                });
                message.success('Exito en eliminar Comprobante');
            } else if (result.response == -2) {
                this.setState({ 
                    noSesion: true,
                    loadingC: false,
                    modalCancel: false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({ 
                loadingC: false,
                modalCancel: false,
            });
        })
    }

    onCargarSistemaComercial() {
        this.setState({ visible_loading: true, });
        httpRequest('post', ws.wscomprobante + '/get_sistemacomercial', {
            selected: this.state.selected_sistemacomercial,
        })
        .then((result) => {
            if (result.response == 1) {
                if (result.data.length == 0) {
                    notification.warning({
                        message: 'WARMING',
                        description:'NO HAY REGISTRO. TODOS LOS REGISTROS YA ESTAN EN ASIENTO AUTOMATICO',
                    });
                }
                this.setState({
                    selected: true, selected_data: false,
                    visible_loading: false,
                    array_sistcomercial: result.data,
                });
                return;
            } else if (result.response == -2) {
                this.setState({ noSesion: true, });
                return;
            }
            this.setState({ visible_loading: false, });
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({ visible_loading: false, });
        });
    }
    searchSistemaComercial(value) {
        var body = {
            searchByIdCod: value,
            selected: this.state.selected_sistemacomercial,
        };
        httpRequest('post', ws.wscomprobante + '/searchsistemacomercialByIdCod', body)
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    array_sistcomercial: result.data,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true });
            } else {
                message.error('No se pudo obtener informacion');
            }
        }).catch (error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onSearchIDCODSistemaComercial(value) {
        var search = value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: null});
        }
        this.state.timeoutSearch = setTimeout(() => this.searchSistemaComercial(search), 800);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onAsignarAsientoAutomatico() {
        if (this.state.idsistcomercial == null) {
            notification.warning({
                message: 'WARMING',
                description:'FAVOR DE SELECCIONAR UN REGISTRO',
            });
        }else {
            this.setState({ visible_loading: true, });
            var body = {
                id: this.state.idsistcomercial,
                selected: this.state.selected_sistemacomercial,
            };
            httpRequest('post', ws.wscomprobante + '/generar_comprobante', body)
            .then(result => {
                console.log(result)
                if (result.response == 1) {
                    if (result.idcomprobante == -5) {
                        var periodo = this.state.selected_sistemacomercial == 1 ? 'VENTA AL CONTADO/CREDITO' : '';
                        periodo = this.state.selected_sistemacomercial == 2 ? 'COBRO A CLIENTE' : '';
                        periodo = this.state.selected_sistemacomercial == 3 ? 'COMPRA AL CONTADO/CREDITO' : '';
                        periodo = this.state.selected_sistemacomercial == 4 ? 'PAGO A PROVEEDOR' : '';
                        notification.warning({
                            message: 'WARNING',
                            description:'EL FECHA O PERIODO DE ' + periodo + ' NO ESTA HABILITADO.',
                        });
                        this.setState({ visible_loading: false, });
                        return;
                    }
                    if (result.idcomprobante < 1) {
                        notification.warning({
                            message: 'WARNING',
                            description:'FALLO EL PROCESO DE GENERAR COMPROBANTE. FAVOR DE VERIFICAR INFORMACION',
                        });
                        this.setState({ visible_loading: false, });
                        return;
                    }
                    notification.success({
                        message: 'SUCCESS',
                        description:'EXITO EN GENERAR COMPROBANTE.',
                    });
                    this.props.history.push(routes.comprobante_edit + '/' + result.idcomprobante);
                    return;
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    message.error('NO SE PUDO ASIGNAR INFORMACION');
                }
                this.setState({ visible_loading: false, });
            }).catch (error => {
                console.log(error);
                message.error(strings.message_error);
                this.setState({ visible_loading: false, });
            });
        }
    }
    componentSistemaComercial() {
        let data = this.state.array_sistcomercial;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            var codigo = this.state.configcodigo ? data[i].codigo == null ? data[i].id : data[i].codigo : data[i].id;
            array.push(
                <Option key={i} value={data[i].id}>
                    {codigo}
                </Option>
            );
        }
        return array;
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        const btnNuevo = this.btnNuevo();
        return (

            <div className="rows">
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Comprobante"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar el comprobante?
                            </label>
                        </div>
                    ]}
                />

                <Confirmation
                    visible={this.state.visible_loading}
                    title={null}
                    loading={true}
                    width={400}
                />

                {!this.state.visible_generar ?

                    <div className="cards">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar comprobantes</h1>
                        </div>
                        {/* { btnNuevo } */}
                        <div className="pulls-right">
                            {this.state.asientoautomdecomprob ?
                                <C_Button
                                    title='Generar desde SISTEMA COMERCIAL'
                                    type='primary'
                                    onClick={() => this.setState({ visible_generar: true, })}
                                /> : null 
                            }
                            <C_Button
                                title='Nuevo'
                                type='primary'
                                onClick={this.onCreateData.bind(this)}
                            />
                        </div>
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <C_Select
                                    value={this.state.nroPaginacion}
                                    onChange={this.onChangeSizePage.bind(this)}
                                    title='Mostrar'
                                    className=''
                                    style={{ width: 65 }}
                                    component={[
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
                                    dataSource={this.state.comprobantes}
                                    bordered={true}
                                    pagination={false}
                                    className="tables-respons"
                                    rowKey="id"
                                />
                            </div>
                        </div>
                        <div className="pull-right py-3">
                            <Pagination
                                defaultCurrent={this.state.pagina}
                                pageSize={this.state.nroPaginacion}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total}
                                showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                            />
                        </div>
                    </div> : 
                
                    <div className='cards'>
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title">Asiento Automatico Comprobante</h1>
                            </div>
                        </div>
                        <div className="forms-groups">
                            <div className="cols-lg-4 cols-md-4"></div>
                            {!this.state.selected ?
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <C_Select
                                        value={this.state.selected_sistemacomercial}
                                        onChange={(value) => {
                                            if (value == 0) {
                                                this.setState({selected_sistemacomercial: value, selected_data: false, })
                                            }else {
                                                this.setState({selected_sistemacomercial: value, selected_data: true, })
                                            }
                                        }}
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        component={[
                                            <Option key={0} value={0}>
                                                Seleccionar
                                            </Option>,
                                            <Option key={1} value={1}>
                                                Venta al contado/Crédito
                                            </Option>,
                                            <Option key={2} value={2}>
                                                Cobro a Cliente
                                            </Option>,
                                            <Option key={3} value={3}>
                                                Compra al Contado/Crédito
                                            </Option>,
                                            <Option key={4} value={4}>
                                                Pago a Proveedor
                                            </Option>,
                                        ]}
                                    />
                                </div> : 
                                <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                    <C_Select
                                        value={this.state.idsistcomercial}
                                        onChange={(value) => this.setState({idsistcomercial: value,}) }
                                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                                        title='Ingresar ID/Codigo'
                                        component={this.componentSistemaComercial()}
                                        showSearch={true}
                                        showArrow={false}
                                        onSearch={this.onSearchIDCODSistemaComercial.bind(this)}
                                        filterOption={false}
                                        defaultActiveFirstOption={false}
                                        allowDelete={(this.state.idsistcomercial == null)?false:true}
                                        onDelete={() => this.setState({idsistcomercial: null, }) }
                                    />
                                </div>
                            }
                        </div>
                        <div className="forms-groups txts-center">
                            {!this.state.selected_data ? null :
                                <C_Button 
                                    title='Cargar Informacion' type='primary'
                                    onClick={this.onCargarSistemaComercial.bind(this)}
                                />
                            }
                            {this.state.selected ? 
                                <C_Button
                                    title='Asignar Asiento Automatico'
                                    type='primary'
                                    onClick={this.onAsignarAsientoAutomatico.bind(this)}
                                /> : null 
                            }
                            {this.state.selected ? 
                                <C_Button
                                    title='Cancelar'
                                    type='danger'
                                    onClick={() => {
                                        this.setState({ selected: false,  
                                            selected_sistemacomercial: 0,
                                            idsistcomercial: null,
                                            selected_data: false,
                                            array_sistcomercial: [],
                                        });
                                    }}
                                /> : null 
                            }
                        </div>
                        <div className="forms-groups txts-center">
                            <C_Button
                                title='IR A LISTADO'
                                type='danger'
                                onClick={() => {
                                    this.setState({ selected: false,  
                                        selected_sistemacomercial: 0,
                                        visible_generar: false, idsistcomercial: null,
                                    });
                                }}
                            />
                        </div>
                    </div> 
                }

            </div>
        );
    }
}

export default withRouter(IndexComprobante);
