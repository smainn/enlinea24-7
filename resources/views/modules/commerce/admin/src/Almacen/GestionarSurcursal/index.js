import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';
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

export default class IndexSucursal extends Component {
    constructor(props){
        super(props)
        this.state = {
            sucursales: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            sucursalesDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            idSucursal: 0,
            nombre: '',
            direccion: '',
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
                title: 'Dirección',
                dataIndex: 'direccion',
                key: 'direccion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.direccion.localeCompare(b.direccion)}
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
            btn_nuevo: readPermisions(keys.sucursales_btn_nuevo),
            btn_editar: readPermisions(keys.sucursales_btn_editar),
            btn_eliminar: readPermisions(keys.sucursales_btn_eliminar),
            nombre: readPermisions(keys.sucursales_input_nombre),
            direccion: readPermisions(keys.sucursales_input_direccion)
        }

        this.modalSucursalNuevo = this.modalSucursalNuevo.bind(this);
        this.modalSucursalEditar = this.modalSucursalEditar.bind(this);
        this.changePaginationSucursal = this.changePaginationSucursal.bind(this);
    }

    componentDidMount(){
        this.getSucursales();
    }

    getSucursales(){
        httpRequest('get', ws.wsGetSucursales)
        .then((result) => {
            if(result.response == 1){
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

    storeSucursal(){
        if(!this.validarDatos()) return;
        let atributos = {
            nombre: this.state.nombre,
            direccion: this.state.direccion,
        }
        httpRequest('post', ws.wssucursal, atributos)
        .then((result) => {
            if (result.response == 1) {
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
                    modalNuevo: false,
                    sucursales: datosSucursales,
                    pagination: result.pagination,
                    nombre: '',
                    direccion: '',
                    pagina: 1,
                })
                message.success('Se guardo correctamente la unidad de medida');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getSucursal(id){
        this.setState({
            idSucursal: id,
        });
        httpRequest('get', ws.wssucursal + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idSucursal: id,
                    nombre: result.data.nombre,
                    direccion: result.data.direccion,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateSucursal(){
        if(!this.validarDatos()) return;
        let atributos = {
            nombre: this.state.nombre,
            direccion: this.state.direccion,
        };
        httpRequest('put', ws.wssucursal + '/' + this.state.idSucursal, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente la Sucursal');
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
                    modalEditar: false,
                    sucursales: datosSucursales,
                    pagination: result.pagination,
                    nombre: '',
                    direccion: '',
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

    changePaginationSucursal(page){
        httpRequest('get', ws.wsGetSucursales + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosSucursales = [];
                for (let i = 0; i < data.length; i++) {
                    datosSucursales.push({
                        id: data[i].idsucursal,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].nombre,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    sucursales: datosSucursales,
                    sucursalesDefaults: datosSucursales,
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

    searchSucursal(value){
        if(value.length > 0) {
            httpRequest('get', ws.wsGetSucursalBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
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
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                sucursales: this.state.sucursalesDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationSucursal(cantidad){
        httpRequest('get', ws.wsGetSucursalesPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosSucursales = [];
                for (let i = 0; i < data.length; i++) {
                    datosSucursales.push({
                        id: data[i].idsucursal,
                        nro: i + 1,
                        nombre: data[i].nombre,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    sucursales: datosSucursales,
                    sucursalesDefaults: datosSucursales,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    validarDatos(){
        if(this.state.nombre.length === 0){
            message.warning('El campo nombre es obligatorio');
            return false;
        }
        if(this.state.direccion.length === 0){
            message.warning('El campo direccion es obligatorio');
            return false;
        }
        return true;
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

    onChangeNombre(event){
        this.setState({
            nombre: event,
        })
    }

    onChangeDireccion(event){
        this.setState({
            direccion: event,
        })
    }

    handleSearchSucursal(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchSucursal(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePaginationSucursal(value){
        this.sizePaginationSucursal(value);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button 
                        type='primary' title='Nuevo'
                        onClick={() => this.setState({modalNuevo: true})}
                    />
                </div>
            );
        }
        return null;
    }

    btnEditar(id){
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a
                    onClick={() => this.getSucursal(id)}
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

    modalSucursalNuevo(){
        return(
            <Confirmation 
                visible={this.state.modalNuevo}
                title = "Nueva Sucursal"
                loading={false}
                onCancel={this.closeModalSucursalNuevo.bind(this)}
                onClick={this.storeSucursal.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.nombre}
                        onChange={this.onChangeNombre.bind(this)}
                        permisions={this.permisions.nombre}
                    />,
                    <C_Input
                        key={1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Direccion'
                        value={this.state.direccion}
                        onChange={this.onChangeDireccion.bind(this)}
                        permisions={this.permisions.direccion}
                    />,
                ]}
            />
        );
    }

    modalSucursalEditar(){
        return(
            <Confirmation
                visible={this.state.modalEditar}
                title = "Nuevo Tipo de Traspaso"
                loading={false}
                onCancel={this.closeModalSucursalEditar.bind(this)}
                onClick={this.updateSucursal.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.nombre}
                        onChange={this.onChangeNombre.bind(this)}
                        permisions={this.permisions.nombre}
                    />,
                    <C_Input
                        key={1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Direccion'
                        value={this.state.direccion}
                        onChange={this.onChangeDireccion.bind(this)}
                        permisions={this.permisions.direccion}
                    />,
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalSucursalNuevo = this.modalSucursalNuevo();
        const modalSucursalEditar = this.modalSucursalEditar();
        return (
            // <div className="rows">
            //     <div className="cards">
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Sucursales</h1>
            //             </div>
            //             { btnNuevo }
            //             { modalSucursalNuevo }
            //             { modalSucursalEditar }
            //         </div>
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <div className="inputs-groups">
            //                     <select className="forms-control"
            //                         value = {this.state.nroPaginacion}
            //                         onChange = {this.onChangeSizePaginationSucursal.bind(this)}
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
            //                         onChange = {this.handleSearchSucursal.bind(this)}
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
            //             records = {this.state.sucursales}
            //         />
            //         <div className="pull-right">
            //             <Pagination
            //                 defaultCurrent = {1}
            //                 current = {this.state.pagina}
            //                 defaultPageSize = {this.state.nroPaginacion}
            //                 pageSize = {this.state.nroPaginacion}
            //                 onChange = {this.changePaginationSucursal}
            //                 total = {this.state.pagination.total}
            //                 showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
            //             />
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    { modalSucursalNuevo }
                    { modalSucursalEditar }
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
                                dataSource={this.state.sucursales}
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
