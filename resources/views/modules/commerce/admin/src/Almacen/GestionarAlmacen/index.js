import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';

import ws from '../../../tools/webservices';
import { httpRequest } from '../../../tools/toolsStorage';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import ReactDatatable from '@ashvin27/react-datatable';
import TextArea from '../../../components/textarea';
import CSelect from '../../../components/select2';
import Confirmation from '../../../components/confirmation';
import C_Input from '../../../components/data/input';

import C_Select from '../../../components/data/select';
const { Option } = Select;

import C_Button from '../../../components/data/button';

export default class IndexAlmacen extends Component {
    constructor(props){
        super(props)
        this.state = {
            almacenes: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            almacenesDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            idAlmacen: 0,
            descripcion: '',
            direccion: '',
            notas: '',
            idSucursal: 0,
            sucursales: [],
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
            btn_nuevo: readPermisions(keys.almacenes_btn_nuevo),
            btn_editar: readPermisions(keys.almacenes_btn_editar),
            btn_eliminar: readPermisions(keys.almacenes_btn_eliminar),
            nombre: readPermisions(keys.almacenes_input_nombre),
            sucursal: readPermisions(keys.almacenes_select_sucursal),
            direccion: readPermisions(keys.almacenes_input_direccion),
            notas: readPermisions(keys.almacenes_textarea_notas)
        }

        this.modalAlmacenNuevo = this.modalAlmacenNuevo.bind(this);
        this.listarSucursales = this.listarSucursales.bind(this);
        this.modalAlmacenEditar = this.modalAlmacenEditar.bind(this);
        this.changePaginationAlmacen = this.changePaginationAlmacen.bind(this);
    }

    componentDidMount(){
        this.getAlmacenes();
        this.getSucursales();
    }

    getAlmacenes(){
        httpRequest('get', ws.wsGetAlmacenes)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    almacenes: datosAlmacenes,
                    almacenesDefaults: datosAlmacenes,
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

    storeAlmacen(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
            direccion: this.state.direccion,
            notas: this.state.notas,
            idSucursal: this.state.idSucursal,
        };
        httpRequest('post', ws.wsalmacen, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    almacenes: datosAlmacenes,
                    pagination: result.pagination,
                    descripcion: '',
                    direccion: '',
                    notas: '',
                    idSucursal: 0,
                    pagina: 1,
                });
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

    getSucursales(){
        httpRequest('get',ws.wssucursal)
        .then((result) => {
            //console.log('RESULT SUCURSALES ', result);
            if(result.response > 0 && result.data.length > 0){
                this.setState({
                    sucursales: result.data,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getAlmacen(id){
        this.setState({
            idalmacen: id,
        });
        httpRequest('get', ws.wsalmacen + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idAlmacen: id,
                    descripcion: result.data.descripcion,
                    direccion: result.data.direccion,
                    notas: result.data.notas,
                    idSucursal: result.data.fkidsucursal,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateAlmacen(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
            direccion: this.state.direccion,
            notas: this.state.notas,
            idSucursal: this.state.idSucursal,
        };
        httpRequest('put', ws.wsalmacen + '/' + this.state.idAlmacen, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente el Almacen');
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    modalEditar: false,
                    almacenes: datosAlmacenes,
                    pagination: result.pagination,
                    descripcion: '',
                    direccion: '',
                    notas: '',
                    idSucursal: 0,
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

    deleteAlmacen(id){
        httpRequest('delete', ws.wsalmacen + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente el Almacen');
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    almacenes: datosAlmacenes,
                    almacenesDefaults: datosAlmacenes,
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

    changePaginationAlmacen(page){
        httpRequest('get', ws.wsGetAlmacenes + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    almacenes: datosAlmacenes,
                    almacenesDefaults: datosAlmacenes,
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

    searchAlmacen(value){
        if(value.length > 0) {
            httpRequest('get', ws.wsGetAlmacenBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosAlmacenes = [];
                    for (let i = 0; i < data.length; i++) {
                        datosAlmacenes.push({
                            id: data[i].idalmacen,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                            direccion: data[i].direccion,
                        });
                    }
                    this.setState({
                        almacenes: datosAlmacenes,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                almacenes: this.state.almacenesDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationAlmacen(cantidad){
        httpRequest('get', ws.wsGetAlmacenesPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosAlmacenes = [];
                for (let i = 0; i < data.length; i++) {
                    datosAlmacenes.push({
                        id: data[i].idalmacen,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                        direccion: data[i].direccion,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    almacenes: datosAlmacenes,
                    almacenesDefaults: datosAlmacenes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Almacen',
            content: '¿Estas seguro de eliminar el Almacen?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteAlmacen(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    validarDatos(){
        if(this.state.descripcion.length === 0){
            message.warning('El campo nombre es obligatorio');
            return false;
        }
        if(this.state.idSucursal === 0){
            message.warning('Debe seleccionar una sucursal');
            return false;
        }
        return true;
    }

    listarSucursales(){
        let sucursales = this.state.sucursales;
        let datosSucursales = [
            <Option 
                key={-1} 
                value={0}
            >
            Seleccionar
            </Option>];
        for (let i = 0; i < sucursales.length; i++) {
            datosSucursales.push(
                <Option 
                    key={i} 
                    id={sucursales[i].idsucursal} 
                    value={sucursales[i].idsucursal}
                >
                    {sucursales[i].nombre}
                </Option>
            );
        }
        return datosSucursales;
    }

    closeModalAlmacenNuevo(){
        this.setState({
            modalNuevo: false,
            modalEditar: false,
            descripcion: '',
            direccion: '',
            notas: '',
            idSucursal: 0,
        });
    }

    closeModalAlmacenEditar(){
        this.setState({
            modalEditar: false,
            descripcion: '',
            direccion: '',
            notas: '',
            idSucursal: 0,
        });
    }

    onChangeDescripcion(event){
        this.setState({
            descripcion: event,
        })
    }

    onChangeDireccion(event){
        this.setState({
            direccion: event,
        })
    }

    onChangeNotas(event){
        this.setState({
            notas: event,
        })
    }

    onChangeIdSucursal(value) {
        this.setState({
            idSucursal: value
        });
    }

    handleSearchAlmacen(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchAlmacen(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePaginationSucursal(value){
        this.sizePaginationAlmacen(value);
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

    btnEditar(id){
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a
                    onClick={() => this.getAlmacen(id)}
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

    modalAlmacenNuevo(){
        const listarSucursales = this.listarSucursales();
        return(
           
            <Confirmation 
                visible={this.state.modalNuevo}
                title = "Nuevo Almacen"
                loading={false}
                onCancel={this.closeModalAlmacenNuevo.bind(this)}
                onClick={this.storeAlmacen.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.nombre}
                    />,
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom" key={1}>
                        <CSelect
                            key = {1}
                            value = {this.state.idSucursal}
                            title = {'Sucursal'}
                            onChange = {this.onChangeIdSucursal.bind(this)}
                            component = {listarSucursales}
                            permisions = {this.permisions.sucursal}
                        />
                    </div>
                    ,
                    <C_Input
                        key={2}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Direccion'
                        value={this.state.direccion}
                        onChange={this.onChangeDireccion.bind(this)}
                        permisions={this.permisions.direccion}
                    />,
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom" key={3}>
                        <TextArea
                            title = {'Notas'}
                            value = {this.state.notas}
                            onChange = {this.onChangeNotas.bind(this)}
                            permisions = {this.permisions.notas}
                        />
                    </div>
                ]}
            />
        );
    }

    modalAlmacenEditar(){
        const listarSucursales = this.listarSucursales();
        return(
            <Confirmation 
                visible={this.state.modalEditar}
                title = "Actualizar Almacen"
                loading={false}
                onCancel={this.closeModalAlmacenEditar.bind(this)}
                onClick={this.updateAlmacen.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.nombre}
                    />,
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom" key={1}>
                        <CSelect
                            key = {1}
                            value = {this.state.idSucursal}
                            title = {'Sucursal'}
                            onChange = {this.onChangeIdSucursal.bind(this)}
                            component = {listarSucursales}
                            permisions = {this.permisions.sucursal}
                        />
                    </div>
                    ,
                    <C_Input
                        key={2}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Direccion'
                        value={this.state.direccion}
                        onChange={this.onChangeDireccion.bind(this)}
                        permisions={this.permisions.direccion}
                    />,
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom" key={3}>
                        <TextArea
                            title = {'Notas'}
                            value = {this.state.notas}
                            onChange = {this.onChangeNotas.bind(this)}
                            permisions = {this.permisions.notas}
                        />
                    </div>
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalAlmacenNuevo = this.modalAlmacenNuevo();
        const modalAlmacenEditar = this.modalAlmacenEditar();
        return (
            // <div className="rows">
            //     <div className="cards">
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Almacenes</h1>
            //             </div>
            //             { btnNuevo }
            //             { modalAlmacenNuevo }
            //             { modalAlmacenEditar }
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
            //                         onChange = {this.handleSearchAlmacen.bind(this)}
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
            //             records = {this.state.almacenes}
            //         />
            //         <div className="pull-right">
            //             <Pagination
            //                 defaultCurrent = {1}
            //                 current = {this.state.pagina}
            //                 defaultPageSize = {this.state.nroPaginacion}
            //                 pageSize = {this.state.nroPaginacion}
            //                 onChange = {this.changePaginationAlmacen}
            //                 total = {this.state.pagination.total}
            //                 showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
            //             />
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    { modalAlmacenNuevo }
                    { modalAlmacenEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Almacenes</h1>
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
                                onChange={this.handleSearchAlmacen.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.almacenes}
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
                            onChange = {this.changePaginationAlmacen}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
