import React, { Component, Fragment } from 'react';
import { message, Modal, Spin, Icon, Table, Select, Pagination } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';

import ws from '../../../tools/webservices';
import Confirmation from '../../../components/confirmation';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
const { Option } = Select;

import C_Button from '../../../components/data/button';

export default class IndexProductoCaracteristica extends Component{
    constructor(props) {
        super(props);
        this.state = {
            caracteristicasProducto: [],
            caracteristicasProductoDefaults: [],
            noSesion: false,
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            paginacionDefaults: {},
            buscar: '',
            modalNuevo: false,
            modalEditar: false,
            idCaracteristicaProducto: 0,
            caracteristica: '',
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
                title: 'Característica',
                dataIndex: 'caracteristica',
                key: 'caracteristica',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.caracteristica.localeCompare(b.caracteristica)}
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
            btn_nuevo: readPermisions(keys.prodcaracteristicas_btn_nuevo),
            btn_editar: readPermisions(keys.prodcaracteristicas_btn_editar),
            btn_eliminar: readPermisions(keys.prodcaracteristicas_btn_eliminar),
            caracteristica: readPermisions(keys.prodcaracteristicas_input_descripcion),
        }
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.btnNuevo = this.btnNuevo.bind(this);
        this.changePaginationCaracteristicasProducto = this.changePaginationCaracteristicasProducto.bind(this);
    }

    componentDidMount(){
        this.getCaracteristicasProducto();
    }

    getCaracteristicasProducto(){
        httpRequest('get', ws.wspcaracteristica)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    caracteristicasProducto: datosCaracteristicasProducto,
                    caracteristicasProductoDefaults: datosCaracteristicasProducto,
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

    storeCaracteristicaProducto(){
        if(!this.validarDatos()) return;
        let atributos = {
            caracteristica: this.state.caracteristica,

        }
        httpRequest('post', ws.wspcaracteristica, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    caracteristicasProducto: datosCaracteristicasProducto,
                    pagination: result.pagination,
                    caracteristica: '',
                    pagina: 1,
                })
                message.success('Se guardo correctamente la nueva caracteristica');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getCaracteristicaProducto(id){
        this.setState({
            idCaracteristicaProducto: id,
        });
        httpRequest('get', ws.wspcaracteristica + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idCaracteristicaProducto: id,
                    caracteristica: result.data.caracteristica,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateCaracteristicaProducto(){
        if(!this.validarDatos()) return;
        let atributos = {
            caracteristica: this.state.caracteristica,
        };
        httpRequest('put', ws.wspcaracteristica + '/' + this.state.idCaracteristicaProducto, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo la caracteristica del producto');
                let data = result.data;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    modalEditar: false,
                    caracteristicasProducto: datosCaracteristicasProducto,
                    pagination: result.pagination,
                    caracteristica: '',
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

    deleteCaracteristicaProducto(id){
        httpRequest('delete', ws.wspcaracteristica + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente la caracteristica del producto');
                let data = result.data;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < data.length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    caracteristicasProducto: datosCaracteristicasProducto,
                    caracteristicasProductoDefaults: datosCaracteristicasProducto,
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
            title: 'Elimiar Caracteristica del Producto',
            content: '¿Estas seguro de eliminar la caracteristica del producto?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteCaracteristicaProducto(item);
            },
            onCancel() {
                message.warning('A cancelado la eliminacion');
            },
        });
    }

    changePaginationCaracteristicasProducto(page){
        httpRequest('get', ws.wspcaracteristica + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: 10 * (page - 1) + i + 1,
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    caracteristicasProducto: datosCaracteristicasProducto,
                    caracteristicasProductoDefaults: datosCaracteristicasProducto,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchSizePaginateCaracteristicaProducto(value, sizePagination){
        httpRequest('get', ws.wspcaracteristica, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosCaracteristicasProducto = [];
                for (let i = 0; i < length; i++) {
                    datosCaracteristicasProducto.push({
                        id: data[i].idproduccaracteristica,
                        nro: (i + 1),
                        caracteristica: data[i].caracteristica,
                    });
                }
                this.setState({
                    caracteristicasProducto: datosCaracteristicasProducto,
                    pagination: result.pagination,
                })
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    handleSearchCaracteristicaProducto(value){
        this.searchSizePaginateCaracteristicaProducto(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateCaracteristicaProducto(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

    validarDatos(){
        if(this.state.caracteristica.length === 0){
            message.warning('El campo nombre es obligatorio');
            return false;
        }
        return true;
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
                    onClick={() => this.getCaracteristicaProducto(id)}
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

    closeModalCaracteristicaProductoNuevo(){
        this.setState({
            modalNuevo: false,
            caracteristica: '',
        });
    }


    closeModalCaracteristicaProductoEditar(){
        this.setState({
            modalEditar: false,
            caracteristica: '',
        });
    }

    onChangeCaracteristica(event){
        this.setState({
            caracteristica: event,
        })
    }

    onSubmitEditar(e) {
        e.preventDefault();
        if (this.state.caracteristica.toString().trim().length > 0) {

            let body = {
                id: this.state.idproduccaracteristica,
                descripcion: this.state.caracteristica
            };

            this.setState({
                loadModal: true,
            });

            httpRequest('post', '/commerce/api/producto_caracteristica/update', body)
            .then(result => {
                if (result.response === 1) {

                    this.getData(1, '', 10);
                    this.handleCerrar();
                    message.success('actualizacion exitosamente');

                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            })
            .catch(
                error => {
                    console.log(error);
                }
            );

        }else {

            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion,
                caracteristica: '',
            });

            message.error('No se permite campo vacio');

        }
    }

    onSubmitCrear(e) {

        e.preventDefault();

        if (this.state.caracteristica.toString().trim().length > 0) {

            this.setState({
                loadModal: true,
            });

            httpRequest('post', '/commerce/api/producto_caracteristica/post', {
                descripcion: this.state.caracteristica
            })
            .then(result => {
                    if (result.response === 1) {

                        this.getData(1, '', 10);
                        this.handleCerrar();
                        message.success('datos guardados exitosamente');

                    } else if (result.response == -2) {
                        this.setState({ noSesion: true });
                    } else {
                        console.log(result);
                    }
                }).catch(
                    error => {
                        console.log(error);
                    }
                );


        }else {
            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion,
                caracteristica: '',
            });
            message.error('No se permite campo vacio');
        }
    }

    modalCaracteristicaProductoNuevo(){
        return(
            <Confirmation
                visible={this.state.modalNuevo}
                title = "Nueva Caracteristica de Producto"
                loading={false}
                onCancel={this.closeModalCaracteristicaProductoNuevo.bind(this)}
                onClick={this.storeCaracteristicaProducto.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key = {0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.caracteristica}
                        onChange={this.onChangeCaracteristica.bind(this)}
                        permisions={this.permisions.caracteristica}
                    />
                ]}
            />
        );
    }

    modalCaracteristicaProductoEditar(){
        return(
            <Confirmation
                visible={this.state.modalEditar}
                title = "Actualizar Caracteristica de Producto"
                loading={false}
                onCancel={this.closeModalCaracteristicaProductoEditar.bind(this)}
                onClick={this.updateCaracteristicaProducto.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key = {0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.caracteristica}
                        onChange={this.onChangeCaracteristica.bind(this)}
                        permisions={this.permisions.caracteristica}
                    />
                ]}
            />
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const modalCaracteristicaProductoNuevo = this.modalCaracteristicaProductoNuevo();
        const modalCaracteristicaProductoEditar = this.modalCaracteristicaProductoEditar();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                    { modalCaracteristicaProductoNuevo }
                    { modalCaracteristicaProductoEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Caracteristicas de Productos</h1>
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
                                onChange={this.handleSearchCaracteristicaProducto.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.caracteristicasProducto}
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
                            onChange = {this.changePaginationCaracteristicasProducto}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
