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
import C_CheckBox from '../../../components/data/checkbox';
const { Option } = Select;

export default class IndexTipoTraspaso extends Component {
    constructor(props){
        super(props)
        this.state = {
            tipoTraspasos: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            tipoTraspasosDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            idTipoTraspaso: 0,
            descripcion: '',
            estado: false,
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
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.estado.localeCompare(b.estado)}
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
        this.modalTipoTraspasoNuevo = this.modalTipoTraspasoNuevo.bind(this);
        this.changePaginationTipoTraspaso = this.changePaginationTipoTraspaso.bind(this);
    }

    componentDidMount(){
        this.getTipoTraspasos();
    }

    getTipoTraspasos(){
        httpRequest('get', ws.wsGetTipoTraspasos)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoTraspasos = [];
                let bandera;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    tipoTraspasos: datosTipoTraspasos,
                    tipoTraspasosDefaults: datosTipoTraspasos,
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

    storeTipoTraspaso(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
        }
        httpRequest('post', ws.wstiposalingresotrans, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoTraspasos = [];
                let bandera;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    tipoTraspasos: datosTipoTraspasos,
                    pagination: result.pagination,
                    descripcion: '',
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

    getTipoTraspaso(id){
        this.setState({
            idTipoTraspaso: id, 
        });
        httpRequest('get', ws.wstiposalingresotrans + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                let bandera;
                if (result.data.estado === 'A') {
                    bandera = true;
                }else{
                    bandera = false;
                }
                this.setState({
                    modalEditar: true,
                    idTipoTraspaso: id,
                    descripcion: result.data.descripcion,
                    estado: bandera,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateTipoTraspaso(){
        if(!this.validarDatos()) return;
        let condicion;
        if (this.state.estado == true) {
            condicion = 'A';
        }else{
            condicion = 'D';
        }
        let atributos = {
            descripcion: this.state.descripcion,
            estado: condicion,
        };
        httpRequest('put', ws.wstiposalingresotrans + '/' + this.state.idTipoTraspaso, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente el tipo de traspaso');
                let data = result.data;
                let datosTipoTraspasos = [];
                let bandera;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    modalEditar: false,
                    tipoTraspasos: datosTipoTraspasos,
                    pagination: result.pagination,
                    descripcion: '',
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

    deleteTipoTraspaso(id){
        httpRequest('delete', ws.wstiposalingresotrans + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente el tipo de traspaso');
                let data = result.data;
                let bandera;
                let datosTipoTraspasos = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    tipoTraspasos: datosTipoTraspasos,
                    tipoTraspasosDefaults: datosTipoTraspasos,
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

    changePaginationTipoTraspaso(page){
        httpRequest('get', ws.wsGetTipoTraspasos + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let bandera;
                let datosTipoTraspasos = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    tipoTraspasos: datosTipoTraspasos,
                    tipoTraspasosDefaults: datosTipoTraspasos,
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

    sizePaginationTipoTraspaso(cantidad){
        httpRequest('get', ws.wsGetTipoTraspasosPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let bandera;
                let datosTipoTraspasos = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].estado === 'A') {
                        bandera = 'Activado';
                    }else{
                        bandera = 'Desactivado';
                    }
                    datosTipoTraspasos.push({
                        id: data[i].idingresosalidatrastipo,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                        estado: bandera,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    tipoTraspasos: datosTipoTraspasos,
                    tipoTraspasosDefaults: datosTipoTraspasos,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    searchTipoTraspaso(value){
        if(value.length > 0) {
            httpRequest('get', ws.wsGetTipoTraspaso + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let bandera;
                    let datosTipoTraspasos = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].estado === 'A') {
                            bandera = 'Activado';
                        }else{
                            bandera = 'Desactivado';
                        }
                        datosTipoTraspasos.push({
                            id: data[i].idingresosalidatrastipo,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                            estado: bandera,
                        });
                    }
                    this.setState({
                        tipoTraspasos: datosTipoTraspasos,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                tipoTraspasos: this.state.tipoTraspasosDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Tipo el tipo de traspaso',
            content: '¿Estas seguro de eliminar el tipo de traspaso?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteTipoTraspaso(item);
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
        return true;
    }

    closeModalTipoTraspasoNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
        });
    }

    closeModalTipoTraspasoEditar(){
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

    onChangeEstado(event){
        this.setState({
            estado: event.target.checked,
        })
    }

    handleSearchTipoTraspaso(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchTipoTraspaso(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }
    onChangeSizePaginationTipoTraspaso(value){
        this.sizePaginationTipoTraspaso(value);
    }

    btnNuevo() {
        return (
            <div className="pulls-right">
                <C_Button onClick={() => this.setState({modalNuevo: true})}
                    type='primary' title='Nuevo'
                />
            </div>
        );
    }

    btnEditar(id){
        return (
            <a 
                onClick={() => this.getTipoTraspaso(id)}
                className="btns btns-sm btns-outline-primary"
                >
                <i className="fa fa-edit"> </i>
            </a>
        );
    }

    btnEliminar(data){
        return (
            <a 
                onClick={() => this.showDeleteConfirm(this, data)}
                className="btns btns-sm btns-outline-danger">
                <i className="fa fa-trash"> 
                </i>
            </a>
        );
    }

    modalTipoTraspasoNuevo(){
        return(
            <Confirmation 
                visible={this.state.modalNuevo}
                title = "Nuevo Tipo de Traspaso"
                loading={false}
                onCancel={this.closeModalTipoTraspasoNuevo.bind(this)}
                onClick={this.storeTipoTraspaso.bind(this)}
                width={400}
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

    modalTipoTraspasoEditar(){
        return(
            <Confirmation 
                visible={this.state.modalEditar}
                title = "Nuevo Tipo de Traspaso"
                loading={false}
                onCancel={this.closeModalTipoTraspasoEditar.bind(this)}
                onClick={this.updateTipoTraspaso.bind(this)}
                width={400}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        //permisions={this.permisions.nombre}
                    />,
                    <div key={1} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <C_CheckBox
                            onChange={this.onChangeEstado.bind(this)}
                            checked={this.state.estado}
                            title='Estado'
                        />
                    </div>
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalTipoTraspasoNuevo = this.modalTipoTraspasoNuevo();
        const modalTipoTraspasoEditar = this.modalTipoTraspasoEditar();
        return (
            // <div className="rows">
            //     <div className="cards">
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Tipos de Traspasos</h1>
            //             </div>
            //             { btnNuevo }
            //             { modalTipoTraspasoNuevo }
            //             { modalTipoTraspasoEditar }
            //         </div>
            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <div className="inputs-groups">
            //                     <select className="forms-control"
            //                         value = {this.state.nroPaginacion}
            //                         onChange = {this.onChangeSizePaginationTipoTraspaso.bind(this)}
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
            //                         onChange = {this.handleSearchTipoTraspaso.bind(this)}
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
            //             records = {this.state.tipoTraspasos}
            //         />
            //         <div className="pull-right">
            //             <Pagination
            //                 defaultCurrent = {1}
            //                 current = {this.state.pagina}
            //                 defaultPageSize = {this.state.nroPaginacion}
            //                 pageSize = {this.state.nroPaginacion}
            //                 onChange = {this.changePaginationTipoTraspaso}
            //                 total = {this.state.pagination.total}
            //                 showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
            //             />
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    { modalTipoTraspasoNuevo }
                    { modalTipoTraspasoEditar }
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Tipo de Traspasos</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationTipoTraspaso.bind(this)}
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
                                onChange={this.handleSearchTipoTraspaso.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.tipoTraspasos}
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
                            onChange = {this.changePaginationTipoTraspaso}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}