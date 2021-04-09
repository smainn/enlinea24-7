import React, { Component, Fragment } from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import Input from '../../componentes/input';
import Confirmation from '../../componentes/confirmation';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import strings from '../../utils/strings';
import routes from '../../utils/routes';
const { Option } = Select;

class IndexSucursal extends Component {
    constructor(props){
        super(props)
        this.state = {

            sucursales: [],

            array_data: [],
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

            sucursalesDefaults: [],
            paginacionDefaults: {},
            modalNuevo: false,
            modalEditar: false,
            idSucursal: 0,
            nombre: '',
            direccion: '',
            modalCancel: false,
            loadingC: false,
            idDelete: -1,

            noSesion: false,
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
                title: 'Tipo Empresa',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipo.localeCompare(b.tipo)}
            },
            {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Nit',
                dataIndex: 'nit',
                key: 'nit',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nit.localeCompare(b.nit)}
            },
            {
                title: 'Tipo Sucursal',
                dataIndex: 'tiposucursal',
                key: 'tiposucursal',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tiposucursal.localeCompare(b.tiposucursal)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.sucursales_btn_nuevo),
            btn_editar: readPermisions(keys.sucursales_btn_editar),
            btn_eliminar: readPermisions(keys.sucursales_btn_eliminar),
            nombre: readPermisions(keys.sucursales_input_nombre),
            direccion: readPermisions(keys.sucursales_input_direccion)
        }
        this.changePaginationSucursal = this.changePaginationSucursal.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteSucursal(this.state.idDelete);
        this.setState({
            loadingC: true
        })
    }

    onCancelMC() {
        this.setState({
            modalCancel: false
        })
    }

    componentDidMount(){
        this.get_data(1, '', 10);
    }

    get_data(page, value, sizePagination){
        httpRequest('get', ws.wssucursal + '/index'+ '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if(result.response == 1){

                let array_data = [];
                var data = result.data.data;
                for (let i = 0; i < data.length; i++) {
                    array_data.push({
                        id: data[i].idsucursal,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].nombrecomercial == null ? data[i].razonsocial == null ? 'S/N' : data[i].razonsocial : data[i].nombrecomercial,
                        tipo: data[i].tipoempresa == null ? 'S/Tipo' : data[i].tipoempresa == 'N' ? 'Natural' : 'Juridico',
                        nit: data[i].nit == null ? 'S/Nit' : data[i].nit,
                        tiposucursal: data[i].tiposucursal == null ? 'S/Tipo' : data[i].tiposucursal == 'M' ? 'Matriz' : 'Sucursal',
                    });
                }

                this.setState({
                    array_data: array_data,
                    pagination: result.pagination,
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

    deleteSucursal(id){
        httpRequest('delete', ws.wssucursal + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente la sucursal');
                let data = result.data;
                let datosSucursales = [];
                for (let i = 0; i < data.length; i++) {
                    datosSucursales.push({
                        id: data[i].idsucursal,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].nombre,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    sucursales: datosSucursales,
                    sucursalesDefaults: datosSucursales,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: 1,
                    modalCancel: false,
                    loadingC: false
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true, modalCancel: false, loadingC: false })
            } else {
                message.warning('No se puede eliminar porque ya esta en uso');
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
        });
    }

    changePaginationSucursal(page){
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Sucursal',
            content: '¿Estas seguro de eliminar la Sucursal?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteSucursal(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    closeModalSucursalNuevo(){
        this.setState({
            modalNuevo: false,
            nombre: '',
            direccion: '',
        });
    }

    closeModalSucursalEditar(){
        this.setState({
            modalEditar: false,
            nombre: '',
            direccion: '',
        });
    }

    handleSearchSucursal(value){
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

    onChangeSizePaginationSucursal(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button 
                        type='primary' title='Nuevo'
                        //onClick={() => this.setState({modalNuevo: true})}
                        onClick={() => this.props.history.push(routes.sucursal_create)}
                    />
                </div>
            );
        }
        return null;
    }

    btnVer(id) {
        //if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-success"
                    onClick={() => this.props.history.push(routes.sucursal_show + '/' + id) }>
                    <i className="fa fa-eye"> </i>
                </a>
            );
        //}
        //return null;
    }

    btnEditar(id){
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a
                    //onClick={() => this.getSucursal(id)}
                    onClick={() => this.props.history.push(routes.sucursal_edit + '/' + id)}
                    className="btns btns-sm btns-outline-primary"
                    >
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(data){
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a
                    onClick={() => this.setState({ modalCancel: true, idDelete: data })}//this.showDeleteConfirm(this, data)}
                    className="btns btns-sm btns-outline-danger">
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    render() {
        const btnNuevo = this.btnNuevo();
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (

            <div className="rows">
                <Confirmation
                    visible={this.state.modalCancel}
                    title="Eliminar Sucursal"
                    loading={this.state.loadingC}
                    onCancel={this.onCancelMC}
                    onClick={this.onOkMC}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar la sucursal?
                            </label>
                        </div>
                    ]}
                />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Sucursales</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationSucursal.bind(this)}
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
                                onChange={this.handleSearchSucursal.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_data}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {this.state.pagina}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.changePaginationSucursal}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexSucursal);
