import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Select } from 'antd';
import ws from '../../../tools/webservices';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes'
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import Input from '../../../components/input';
import Confirmation from '../../../components/confirmation';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

export default class IndexUnidadMedida extends Component {
    constructor(props){
        super(props)
        this.state = {
            unidadesMedidas: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            unidadesMedidasDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            idUnidadMedida: 0,
            descripcion: '',
            abreviacion: '',
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
                title: 'Abreviacion',
                dataIndex: 'abreviacion',
                key: 'abreviacion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.abreviacion.localeCompare(b.abreviacion)}
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
            btn_nuevo: readPermisions(keys.unidadmedida_btn_nuevo),
            btn_editar: readPermisions(keys.unidadmedida_btn_editar),
            btn_eliminar: readPermisions(keys.unidadmedida_btn_eliminar),
            nombre: readPermisions(keys.unidadmedida_input_nombre),
            abreviacion: readPermisions(keys.unidadmedida_input_abreviacion),
        }
        this.modalUnidadMedidaNuevo = this.modalUnidadMedidaNuevo.bind(this);
        this.modalUnidadMedidaEditar = this.modalUnidadMedidaEditar.bind(this);
        this.changePaginationUnidadMedida = this.changePaginationUnidadMedida.bind(this);
    }

    componentDidMount(){
        this.getUnidadesMedida();
    }

    getUnidadesMedida(){
        httpRequest('get', ws.wsGetUnidadesMedida)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    unidadesMedidas: datosUnidadesMedida,
                    unidadesMedidasDefaults: datosUnidadesMedida,
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

    storeUnidadMedida(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
            abreviacion: this.state.abreviacion,
        }
        httpRequest('post', ws.wsunidadmedida, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    unidadesMedidas: datosUnidadesMedida,
                    pagination: result.pagination,
                    descripcion: '',
                    abreviacion: '',
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

    getUnidadMedida(id){
        this.setState({
            idUnidadMedida: id, 
        });
        httpRequest('get', ws.wsunidadmedida + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    modalEditar: true,
                    idUnidadMedida: id,
                    descripcion: result.data.descripcion,
                    abreviacion: result.data.abreviacion,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateUnidadMedida(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
            abreviacion: this.state.abreviacion,
        };
        httpRequest('put', ws.wsunidadmedida + '/' + this.state.idUnidadMedida, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente la unidad de medida');
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    modalEditar: false,
                    unidadesMedidas: datosUnidadesMedida,
                    pagination: result.pagination,
                    descripcion: '',
                    abreviacion: '',
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

    deleteUnidadMedida(id){
        httpRequest('delete', ws.wsunidadmedida + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente la unida de medida');
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    unidadesMedidas: datosUnidadesMedida,
                    unidadesMedidasDefaults: datosUnidadesMedida,
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

    changePaginationUnidadMedida(page){
        httpRequest('get', ws.wsGetUnidadesMedida + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    unidadesMedidas: datosUnidadesMedida,
                    unidadesMedidasDefaults: datosUnidadesMedida,
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

    searchUnidadMedida(value){
        if(value.length > 0) {
            httpRequest('get', ws.wsGetUnidadMedidaBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let datosUnidadesMedida = [];
                    for (let i = 0; i < data.length; i++) {
                        datosUnidadesMedida.push({
                            id: data[i].idunidadmedida,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                            abreviacion: data[i].abreviacion,
                        });
                    }
                    this.setState({
                        unidadesMedidas: datosUnidadesMedida,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                unidadesMedidas: this.state.unidadesMedidasDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationUnidadMedida(cantidad){
        httpRequest('get', ws.wsGetUnidadesMedidaPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosUnidadesMedida = [];
                for (let i = 0; i < data.length; i++) {
                    datosUnidadesMedida.push({
                        id: data[i].idunidadmedida,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                        abreviacion: data[i].abreviacion,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    unidadesMedidas: datosUnidadesMedida,
                    unidadesMedidasDefaults: datosUnidadesMedida,
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
            title: 'Elimiar Unidad de medida',
            content: '¿Estas seguro de eliminar la unidad de medida?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteUnidadMedida(item);
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
        if (this.state.abreviacion.length === 0) {
            message.warning('El campo abreviacion es obligatorio');
            return false;
        }
        return true;
    }

    closeModalUnidadMedidaNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
            abreviacion: '',
        });
    }

    closeModalUnidadMedidaEditar(){
        this.setState({
            modalEditar: false,
            descripcion: '',
            abreviacion: '',
        });
    }

    onChangeDescripcion(event){
        this.setState({
            descripcion: event,
        })
    }

    onChangeAbreviacion(event){
        this.setState({
            abreviacion: event,
        })
    }

    onChangeSizePaginationUnidadMedida(value){
        this.sizePaginationUnidadMedida(value);
    }

    handleSearchUnidadMedida(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchUnidadMedida(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button onClick={() => this.setState({modalNuevo: true})}
                        type='primary' title='Nuevo'
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
                    onClick={() => this.getUnidadMedida(id)}
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

    modalUnidadMedidaNuevo(){
        return(
            /*
            <Modal
                title = "Nueva Unidad de Medida"
                visible = {this.state.modalNuevo}
                onCancel = {this.closeModalUnidadMedidaNuevo.bind(this)}
                closable = {false}
                okText = 'Guardar'
                cancelText = 'Cancelar'
                onOk = {this.storeUnidadMedida.bind(this)}
            >
                <Input 
                    title = 'Nombre'
                    value = {this.state.descripcion}
                    onChange = {this.onChangeDescripcion.bind(this)}
                    permisions = {this.permisions.nombre}
                />
                <br/>
                <Input 
                    title = 'Abreviacion'
                    value = {this.state.abreviacion}
                    onChange = {this.onChangeAbreviacion.bind(this)}
                    permisions = {this.permisions.abreviacion}
                />
            </Modal>
            */
            
            <Confirmation 
                visible={this.state.modalNuevo}
                title = "Nueva Unidad de Medida"
                loading={false}
                onCancel={this.closeModalUnidadMedidaNuevo.bind(this)}
                onClick={this.storeUnidadMedida.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key = {0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.nombre}
                    />
                    ,
                    <C_Input
                        key = {1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title = 'Abreviacion'
                        value={this.state.abreviacion}
                        onChange={this.onChangeAbreviacion.bind(this)}
                        permisions={this.permisions.abreviacion}
                    />
                ]}
            />
        );
    }

    modalUnidadMedidaEditar(){
        return(
            /*
            <Modal
                title = "Actualizar Unidad de Medida"
                visible = {this.state.modalEditar}
                onCancel = {this.closeModalUnidadMedidaEditar.bind(this)}
                closable = {false}
                okText = 'Actualizar'
                cancelText = 'Cancelar'
                onOk = {this.updateUnidadMedida.bind(this)}
            >
                <Input 
                    title = 'Nombre'
                    value = {this.state.descripcion}
                    onChange = {this.onChangeDescripcion.bind(this)}
                    permisions = {this.permisions.nombre}
                />
                <br/>
                <Input 
                    title = 'Abreviacion'
                    value = {this.state.abreviacion}
                    onChange = {this.onChangeAbreviacion.bind(this)}
                    permisions = {this.permisions.abreviacion}
                />
            </Modal>
            */
            <Confirmation 
                visible={this.state.modalEditar}
                title = "Actualizar Unidad de Medida"
                loading={false}
                onCancel={this.closeModalUnidadMedidaEditar.bind(this)}
                onClick={this.updateUnidadMedida.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        permisions={this.permisions.nombre}
                    />
                    ,
                    <C_Input
                        key={1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title = 'Abreviacion'
                        value={this.state.abreviacion}
                        onChange={this.onChangeAbreviacion.bind(this)}
                        permisions={this.permisions.abreviacion}
                    />
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalUnidadMedidaNuevo = this.modalUnidadMedidaNuevo();
        const modalUnidadMedidaEditar = this.modalUnidadMedidaEditar();
        return (
            // <div className="rows">
            //     <div className="cards">
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Unidades de Medida</h1>
            //             </div>
            //             { btnNuevo }
            //             { modalUnidadMedidaNuevo }
            //             { modalUnidadMedidaEditar }
            //         </div>
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <div className="inputs-groups">
            //                     <select className="forms-control"
            //                         value = {this.state.nroPaginacion}
            //                         onChange = {this.onChangeSizePaginationUnidadMedida.bind(this)}
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
            //                         onChange = {this.handleSearchUnidadMedida.bind(this)}
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
            //             records = {this.state.unidadesMedidas}
            //         />
            //         <div className="pull-right">
            //             <Pagination
            //                 defaultCurrent = {1}
            //                 current = {this.state.pagina}
            //                 defaultPageSize = {this.state.nroPaginacion}
            //                 pageSize = {this.state.nroPaginacion}
            //                 onChange = {this.changePaginationUnidadMedida}
            //                 total = {this.state.pagination.total}
            //                 showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
            //             />
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    { modalUnidadMedidaNuevo }
                    { modalUnidadMedidaEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Unidades de Medida</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationUnidadMedida.bind(this)}
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
                                onChange={this.handleSearchUnidadMedida.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.unidadesMedidas}
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
                            onChange = {this.changePaginationUnidadMedida}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}