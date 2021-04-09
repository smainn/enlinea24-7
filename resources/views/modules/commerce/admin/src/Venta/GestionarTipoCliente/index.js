import React, { Component, Fragment }  from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Select } from 'antd';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes'
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import ReactDatatable from '@ashvin27/react-datatable';
import Input from '../../../components/input';
import Confirmation from '../../../components/confirmation';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

export default class IndexTipoCliente extends Component {
    constructor(props){
        super(props)
        this.state = {
            tipoClientes: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            tipoClientesDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            idTipoCliente: 0,
            descripcion: '',
            timeoutSearch: undefined,
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
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.tipocliente_btn_nuevo),
            btn_editar: readPermisions(keys.tipocliente_btn_editar),
            btn_eliminar: readPermisions(keys.tipocliente_btn_eliminar),
            descripcion: readPermisions(keys.tipocliente_input_descripcion)
        }
        this.modalTipoClienteNuevo = this.modalTipoClienteNuevo.bind(this);
        this.modalTipoClienteEditar = this.modalTipoClienteEditar.bind(this);
        this.changePaginationTipoCliente = this.changePaginationTipoCliente.bind(this);
    }

    componentDidMount(){
        this.getTipoClientes();
    }

    getTipoClientes(){
        httpRequest('get', ws.wsGetTipoClientes)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    storeTipoCliente(nombre){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        }
        httpRequest('post', ws.wsTipoClientes, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    tipoClientes: datosTipoClientes,
                    pagination: result.pagination,
                    descripcion: '',
                    pagina: 1,
                })
                message.success('Se guardo correctamente el tipo de cliente');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTipoCliente(id){
        this.setState({
            idTipoCliente: id,
        });
        httpRequest('get', ws.wsTipoClientes + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idTipoCliente: id,
                    descripcion: result.data.descripcion,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateTipoCliente(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        };
        httpRequest('put', ws.wsTipoClientes + '/' + this.state.idTipoCliente, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente el tipo de cliente');
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    modalEditar: false,
                    tipoClientes: datosTipoClientes,
                    pagination: result.pagination,
                    descripcion : '',
                    pagina: 1,
                })

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteTipoCliente(id){
        httpRequest('delete', ws.wsTipoClientes + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente el tipo de cliente');
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: 1,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.warning('No se puede eliminar porque ya esta en uso')
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        });
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Tipo de Cliente',
            content: '¿Estas seguro de eliminar el tipo de cliente?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteTipoCliente(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    changePaginationTipoCliente(page){
        httpRequest('get', ws.wsGetTipoClientes + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: page,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    searchTipoCliente(value){
        if (value.length > 0) {
            httpRequest('get', ws.wsBusquedaTipoCliente + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosTipoClientes = [];
                    for (let i = 0; i < data.length; i++) {
                        datosTipoClientes.push({
                            id: data[i].idclientetipo,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                        });
                    }
                    this.setState({
                        tipoClientes: datosTipoClientes,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                tipoClientes: this.state.tipoClientesDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationTipoCliente(cantidad){
        httpRequest('get', ws.wsCantidadPaginacionTipoCliente + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoClientes = [];
                for (let i = 0; i < data.length; i++) {
                    datosTipoClientes.push({
                        id: data[i].idclientetipo,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    tipoClientes: datosTipoClientes,
                    tipoClientesDefaults: datosTipoClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    validarDatos(){
        if(this.state.descripcion.length === 0){
            message.warning('El campo nombre es hobligatorio');
            return false;
        }
        return true;
    }

    closeModalNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
        });
    }

    closeModalEditar(){
        this.setState({
            modalEditar: false,
            descripcion: '',
        });
    }

    onChangeDescripcion(event){
        this.setState({
            descripcion: event,
        })
    }

    handleSearchTipoCliente(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchTipoCliente(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePaginationTipoCliente(value){
        this.sizePaginationTipoCliente(value);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={() => this.setState({modalNuevo: true})}
                    />
                </div>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a
                    onClick={() => this.getTipoCliente(id)}
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
                    onClick={() => this.showDeleteConfirm(this, data)}
                    className="btns btns-sm btns-outline-danger">
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    modalTipoClienteNuevo(){
        return(
           
            <Confirmation 
                visible={this.state.modalNuevo}
                title="Nuevo Tipo de Cliente"
                loading={false}
                onCancel={this.closeModalNuevo.bind(this)}
                onClick={this.storeTipoCliente.bind(this)}
                width={450}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        //permisions={this.permisions.nombre}
                    />
                ]}
            />
        );
    }

    modalTipoClienteEditar(){
        return(
            <Confirmation 
                visible={this.state.modalEditar}
                title="Actualizar Tipo de Cliente"
                loading={false}
                onCancel={this.closeModalEditar.bind(this)}
                onClick={this.updateTipoCliente.bind(this)}
                width={450}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        //permisions={this.permisions.nombre}
                    />
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalTipoClienteNuevo = this.modalTipoClienteNuevo();
        const modalTipoClienteEditar = this.modalTipoClienteEditar();
        return (
            // <div className="rows">
            //     <div className="cards">
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Tipo de Clientes</h1>
            //             </div>
            //             { btnNuevo }
            //             { modalTipoClienteNuevo }
            //             { modalTipoClienteEditar }
            //         </div>
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <div className="inputs-groups">
            //                     <select className="forms-control"
            //                         value = {this.state.nroPaginacion}
            //                         onChange = {this.onChangeSizePaginationTipoCliente.bind(this)}
            //                     >
            //                         <option value="10"> 10 </option>
            //                         <option value="25"> 25 </option>
            //                         <option value="50"> 50 </option>
            //                         <option value="100"> 100 </option>
            //                     </select>
            //                     <h3 className="lbl-input-form-content active"> Mostrar </h3>
            //                 </div>
            //             </div>
            //             <div className="pulls-right">
            //                 <div className="inputs-groups">
            //                     <input
            //                         type="text"
            //                         value = {this.state.buscar}
            //                         onChange = {this.handleSearchTipoCliente.bind(this)}
            //                         className="forms-control w-75-content"
            //                         placeholder=" buscar ..."/>
            //                             <h3 className="lbls-input active"> Buscar </h3>
            //                             <i className="fa fa-search fa-content" style={{'top': '3px'}}></i>
            //                 </div>
            //             </div>
            //         </div>
            //         <ReactDatatable
            //             config = {this.state.config}
            //             columns = {this.columns}
            //             records = {this.state.tipoClientes}
            //         />
            //         <div className="pull-right">
            //             <Pagination
            //                 defaultCurrent = {1}
            //                 current = {this.state.pagina}
            //                 defaultPageSize = {this.state.nroPaginacion}
            //                 pageSize = {this.state.nroPaginacion}
            //                 onChange = {this.changePaginationTipoCliente}
            //                 total = {this.state.pagination.total}
            //                 showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
            //             />
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    { modalTipoClienteNuevo }
                    { modalTipoClienteEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Tipo de Clientes</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationTipoCliente.bind(this)}
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
                                onChange={this.handleSearchTipoCliente.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.tipoClientes}
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
                            onChange = {this.changePaginationTipoCliente}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
