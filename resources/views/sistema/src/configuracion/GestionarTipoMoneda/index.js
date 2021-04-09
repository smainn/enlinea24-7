
import React, { Component, Fragment } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';
import ws from '../../utils/webservices';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import Confirmation from '../../componentes/confirmation';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import C_CheckBox from '../../componentes/data/checkbox';
import strings from '../../utils/strings';
const { Option } = Select;

export default class IndexTipoMoneda extends Component {
    constructor(props){
        super(props)
        this.state = {
            tipoMonedas: [],
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            tipoMonedasDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            noSesion: false,
            modalNuevo: false,
            modalEditar: false,
            loading: false,
            idTipoMoneda: 0,
            descripcion: '',
            predeterminada: false,
            tipoCambio: 0,
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
                title: 'Tipo de Cambio',
                dataIndex: 'cambio',
                key: 'cambio',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.cambio - b.cambio,
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
        this.permisions = {
            btn_nuevo: readPermisions(keys.tipomoneda_btn_nuevo),
            btn_editar: readPermisions(keys.tipomoneda_btn_editar),
            btn_eliminar: readPermisions(keys.tipomoneda_btn_eliminar),
            // nombre: readPermisions(keys.tipomoneda_input_nombre),
            // tipocambio: readPermisions(keys.tipomoneda_input_tipocambio)
        }
        this.modalTipoMonedaNuevo = this.modalTipoMonedaNuevo.bind(this);
        this.modalTipoMonedaEditar = this.modalTipoMonedaEditar.bind(this);
        this.changePaginationTipoMoneda = this.changePaginationTipoMoneda.bind(this);
        this.onOkMC = this.onOkMC.bind(this);
        this.onCancelMC = this.onCancelMC.bind(this);
    }

    onOkMC() {
        if (this.state.idDelete == -1) return;
        this.deleteTipoMoneda(this.state.idDelete);
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
        this.getTipoMonedas();
    }

    getTipoMonedas(){
        httpRequest('get', ws.wsGetTipoMonedas)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let datosTipoMonedas = [];
                let estado;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    tipoMonedas: datosTipoMonedas,
                    tipoMonedasDefaults: datosTipoMonedas,
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
            message.error(strings.message_error);
        });
    }

    storeTipoMoneda(){
        if(!this.validarDatos()) return;
        let atributos = {
            descripcion: this.state.descripcion,
            tipoCambio: this.state.tipoCambio,
        }
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsmoneda, atributos)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let datosTipoMonedas = [];
                let estado;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    modalNuevo: false,
                    tipoMonedas: datosTipoMonedas,
                    pagination: result.pagination,
                    descripcion: '',
                    tipoCambio: 0,
                    pagina: 1,
                })
                message.success('Se guardo correctamente la unidad de medida');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
            this.setState({
                loading: false,
            });
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                loading: false,
            });
        });
    }

    getTipoMoneda(id){
        this.setState({
            idTipoMoneda: id, 
        });
        httpRequest('get', ws.wsmoneda + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                let estado;
                if (result.data.predeterminada === 'V') {
                    estado = true;
                }else{
                    estado = false;
                }
                this.setState({
                    modalEditar: true,
                    idTipoMoneda: id,
                    descripcion: result.data.descripcion,
                    predeterminada: estado,
                    tipoCambio: result.data.tipocambio,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    updateTipoMoneda(){
        if(!this.validarDatos()) return;
        let predeterminada;
        if (this.state.predeterminada == true) {
            predeterminada = 'V';
        }else{
            predeterminada = 'F';
        }
        let atributos = {
            descripcion: this.state.descripcion,
            predeterminada: predeterminada,
            tipoCambio: this.state.tipoCambio,
        };
        this.setState({
            loading: true,
        });
        httpRequest('put', ws.wsmoneda + '/' + this.state.idTipoMoneda, atributos)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se actualizo correctamente la unidad de medida');
                let data = result.data;
                let datosTipoMonedas = [];
                let estado;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    modalEditar: false,
                    tipoMonedas: datosTipoMonedas,
                    pagination: result.pagination,
                    descripcion: '',
                    tipoCambio: 0,
                    pagina: 1,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
            this.setState({
                loading: false,
            });
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.setState({
                loading: false,
            });
        })
    }

    deleteTipoMoneda(id){
        httpRequest('delete', ws.wsmoneda + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                message.success('Se elimino correctamente el tipo de moneda');
                let data = result.data;
                let estado;
                let datosTipoMonedas = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    tipoMonedas: datosTipoMonedas,
                    tipoMonedasDefaults: datosTipoMonedas,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: 1,
                    loadingC: false,
                    modalCancel: false
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true, loadingC: false, modalCancel: false })
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

    changePaginationTipoMoneda(page){
        httpRequest('get', ws.wsGetTipoMonedas + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let estado;
                let datosTipoMonedas = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: 10 * (page - 1) + i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    tipoMonedas: datosTipoMonedas,
                    tipoMonedasDefaults: datosTipoMonedas,
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
            message.error(strings.message_error);
        })
    }

    searchTipoMoneda(value){
        if(value.length > 0) {
            httpRequest('get', ws.wsGetTipoMonedaBusqueda + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.data;
                    let estado;
                    let datosTipoMonedas = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].predeterminada === 'V') {
                            estado = 'Activado';
                        }else{
                            estado = 'Desactivado';
                        }
                        datosTipoMonedas.push({
                            id: data[i].idmoneda,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            nombre: data[i].descripcion,
                            cambio: data[i].tipocambio,
                            estado: estado,
                        });
                    }
                    this.setState({
                        tipoMonedas: datosTipoMonedas,
                        pagination: result.pagination,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(strings.message_error);
            });
        }else{
            this.setState({
                tipoMonedas: this.state.tipoMonedasDefaults,
                pagination: this.state.paginacionDefaults,
            })
        }
    }

    sizePaginationUnidadMedida(cantidad){
        httpRequest('get', ws.wsGetTipoMonedasPaginacion + '/' + cantidad)
        .then((result) => {
            if(result.response == 1){
                let data = result.data;
                let estado;
                let datosTipoMonedas = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].predeterminada === 'V') {
                        estado = 'Activado';
                    }else{
                        estado = 'Desactivado';
                    }
                    datosTipoMonedas.push({
                        id: data[i].idmoneda,
                        nro: i + 1,
                        nombre: data[i].descripcion,
                        cambio: data[i].tipocambio,
                        estado: estado,
                    });
                }
                this.setState({
                    nroPaginacion: cantidad,
                    tipoMonedas: datosTipoMonedas,
                    tipoMonedasDefaults: datosTipoMonedas,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    showDeleteConfirm(thisContex,item){
        Modal.confirm({
            title: 'Elimiar Tipo de Moneda',
            content: '¿Estas seguro de eliminar el tipo de moneda?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                thisContex.deleteTipoMoneda(item);
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
        if (this.state.tipoCambio == 0){
            message.warning('El campo tipo de cambio no puede ser cero');
            return false;
        }
        if (this.state.tipoCambio < 0){
            message.warning('El campo tipo de cambio no puede ser negativo');
            return false;
        }
        return true;
    }

    closeModalTipoMonedaNuevo(){
        this.setState({
            modalNuevo: false,
            descripcion: '',
            tipoCambio: 0,
        });
    }

    closeModalTipoMonedaEditar(){
        this.setState({
            modalEditar: false,
            descripcion: '',
            tipoCambio: 0,
        });
    }

    onChangeDescripcion(event){
        this.setState({
            descripcion: event,
        })
    }

    onChangeTipoCambio(event){
        if (isNaN(event)) {
            return;
        }
        this.setState({
            tipoCambio: event,
        })
    }

    onChangeEstado(event){
        this.setState({
            predeterminada: event.target.checked,
        })
    }

    handleSearchTipoMoneda(value){
        if (this.state.timeoutSearch){
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchTipoMoneda(value), 300);
        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePaginationTipoMoneda(value){
        this.sizePaginationUnidadMedida(value);
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
                    onClick={() => this.getTipoMoneda(id)}
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

    modalTipoMonedaNuevo(){
        return(
            <Confirmation 
                visible={this.state.modalNuevo}
                title = "Nuevo Tipo de Moneda"
                loading={this.state.loading}
                onCancel={this.closeModalTipoMonedaNuevo.bind(this)}
                onClick={this.storeTipoMoneda.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key={0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                    />
                    ,
                    <C_Input
                        key={1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title = 'Tipo de Cambio'
                        value={this.state.tipoCambio}
                        onChange={this.onChangeTipoCambio.bind(this)}
                    />
                ]}
            />
        );
    }

    modalTipoMonedaEditar(){
        return(
            <Confirmation 
                visible={this.state.modalEditar}
                title = "Actualizar Tipo de Moneda"
                loading={this.state.loading}
                onCancel={this.closeModalTipoMonedaEditar.bind(this)}
                onClick={this.updateTipoMoneda.bind(this)}
                width={500}
                content = {[
                    <C_Input
                        key = {0}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                    />
                    ,
                    <C_Input
                        key = {1}
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title = 'Tipo de Cambio'
                        value={this.state.tipoCambio}
                        onChange={this.onChangeTipoCambio.bind(this)}
                    />,
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={2}>
                        <C_CheckBox
                            onChange={this.onChangeEstado.bind(this)}
                            checked={this.state.predeterminada}
                            title='Estado'
                        />
                    </div>
                ]}
            />
        );
    }

    render() {
        const btnNuevo = this.btnNuevo();
        const modalTipoMonedaNuevo = this.modalTipoMonedaNuevo();
        const modalTipoMonedaEditar =  this.modalTipoMonedaEditar();
        return (

            <div className="rows">
                    { modalTipoMonedaNuevo }
                    { modalTipoMonedaEditar }
                    <Confirmation
                        visible={this.state.modalCancel}
                        title="Eliminar el Tipo de Moneda"
                        loading={this.state.loadingC}
                        onCancel={this.onCancelMC}
                        onClick={this.onOkMC}
                        width={400}
                        content = {[
                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                                <label>
                                    ¿Esta seguro de eliminar el tipo de moneda?
                                </label>
                            </div>
                        ]}
                    />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Tipos de Moneda</h1>
                    </div>
                    { btnNuevo }
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                key = {0}
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePaginationTipoMoneda.bind(this)}
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
                                key = {0}
                                value={this.state.buscar}
                                onChange={this.handleSearchTipoMoneda.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.tipoMonedas}
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
                            onChange = {this.changePaginationTipoMoneda}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}