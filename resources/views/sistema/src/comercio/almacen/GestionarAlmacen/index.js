import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';

import ws from '../../../utils/webservices';
import { httpRequest } from '../../../utils/toolsStorage';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import TextArea from '../../../componentes/textarea';
import CSelect from '../../../componentes/select2';
import Confirmation from '../../../componentes/confirmation';
import C_Input from '../../../componentes/data/input';

import C_Select from '../../../componentes/data/select';
const { Option } = Select;

import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';

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
            modalCancel: false,
            loadingC: false,
            idDelete: -1
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
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteAlmacen(this.state.idDelete);
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
            //console.log(error);
            message.error(strings.message_error);
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
            message.error(strings.message_error);
        });
    }

    getSucursales(){
        httpRequest('get',ws.wssucursal)
        .then((result) => {
            // console.log('RESULT SUCURSALES ', result);
            if(result.response > 0 && result.data.data.length > 0){
                this.setState({
                    sucursales: result.data.data,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
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
            message.error(strings.message_error);
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
            message.error(strings.message_error);
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
            //console.log(error);
            message.error(strings.message_error);
            this.setState({
                modalCancel: false,
                loadingC: false
            })
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
            message.error(strings.message_error);
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
            })
            .catch((error) => {
                message.error(strings.message_error);
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
            message.error(strings.message_error);
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
                    { sucursales[i].tipoempresa = 'N' ? 
                        sucursales[i].nombrecomercial == null ? 'S/N' : sucursales[i].nombrecomercial :
                        sucursales[i].razonsocial == null ? 'S/N' : sucursales[i].razonsocial
                    }
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
                    onClick={() => this.setState({ modalCancel: true, idDelete: data }) }//this.showDeleteConfirm(this, data)}
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

            <div className="rows">
                    { modalAlmacenNuevo }
                    { modalAlmacenEditar }
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
