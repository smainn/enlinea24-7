
import React, { Component } from 'react';

import axios from 'axios';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

import CrearVehiculoHistoria from './CrearVehiculoHistoria';

import EditVehiculoHistoria from './EditVehiculoHistoria';

import ShowVehiculoHistoria from './ShowVehiculoHistoria';

export default class IndexVehiculoHistoria extends Component{

    constructor() {
        
        super();
        this.state = {

            idVehiculoHistoria: 0,

            loadModal: false,

            visibleVehiculoHistoria: false,
            visibleVehiculoHistoriaDelete: false,
            vehiculoHistoriaSeleccionado: [],

            vehiculoHistoria: [],

            pagination: {
                total: 0,
                current_page: 0,
                per_page: 0,
                last_page: 0,
                from: 0,
                to:   0
            },
            offset : 3,

            nroPagination: 5,
            buscar: '',

            indexVehiculoHistoria: true,

            loadIndex: false,
            crearVehiculoHistoria: false,
            fechaActual: '',
            fechaFormato: '',
            clientes: [],

            editarVehiculoHistoria: false,
            bandera: 0
        }
    }

    componentDidMount() {

        this.getVehiculoHistoria(1, '', 5);

    }

    getVehiculoHistoria(page, buscar, nroPaginacion) {

        /*this.setState({
            loadIndex: true
        });
        */

        var url = 'indexVehiculoHistoria?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        
        axios.get(url).then( resultado => {

            this.setState({
                vehiculoHistoria: resultado.data.vehiculoHistoria.data,
                pagination: resultado.data.pagination,
                /*loadIndex: false */
            });
        }).catch( error => {
            console.log(error)
        });

    }

    onChangeIsActivedPaginate() {
        return this.state.pagination.current_page;
    }

    onChangePagesNumber() {
        if (!this.state.pagination.to){
            return [];
        }
        var from = this.state.pagination.current_page - this.state.offset;
        if (from < 1){
            from = 1;
        }
        var to = from + (this.state.offset * 2);
        if (to >=this.state.pagination.last_page){
            to = this.state.pagination.last_page;
        }
        var pageArray = [];
        while (from <= to){
            pageArray.push(from);
            from++;
        }
        return pageArray;
    }

    cambiarPagina(page, buscar, nroPaginacion) {
        this.state.pagination.current_page = page;

        this.setState({
            pagination: this.state.pagination
        });
        this.getVehiculoHistoria(page,  buscar, nroPaginacion);
    }

    onChangeNroPagination(e) {
        this.setState({
            nroPagination: e.target.value
        });
    }

    onChangeBuscarDato(e) {
        this.setState({
            buscar: e.target.value
        })
    }

    onChangeEnter(e){
        if (e.key === 'Enter') {
            this.getVehiculoHistoria(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getVehiculoHistoria(1, this.state.buscar, this.state.nroPagination);
    }

    addZero(nro) {
        if (nro < 10) {
            nro = '0' + nro;
        }
        return nro;
    }

    fechaActual() {
        var fechaActual = new Date();

        var dia = fechaActual.getDate();
        var mes = fechaActual.getMonth() + 1;
        var year = fechaActual.getFullYear();

        dia = this.addZero(dia);
        mes = this.addZero(mes);

        var fecha = dia + '/' + mes + '/' + year;

        return fecha;

    }

    getCliente() {
        var url = '/commerce/admin/showCliente';
        axios.get(url).then(resultado => {
            this.setState({
                clientes: resultado.data.cliente
            });
        }).catch(error => {
            console.log(error)
        });
    }

    crearVehiculoHistoria() {

        this.state.fechaActual = this.fechaActual();
        this.getCliente();
        var fecha = new Date();

        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();

        dia = this.addZero(dia);
        mes = this.addZero(mes);

        var fechaFormato = year + '-' + mes + '-' + dia;

        this.setState({
            crearVehiculoHistoria: true,
            fechaActual: this.state.fechaActual,
            fechaFormato: fechaFormato,
            indexVehiculoHistoria: false
        });
    }

    getOnSubmitVehiculoHistoria(resultado) {
        if (resultado.bandera === 0) {
            this.getVehiculoHistoria(1, '', 5);
            this.setState({
                crearVehiculoHistoria: false,
                indexVehiculoHistoria: true
            });
        }
    }

    editarVehiculoHistoria(indice) {

        this.state.vehiculoHistoriaSeleccionado = this.state.vehiculoHistoria[indice];

        this.state.fechaActual = this.fechaActual();
        this.getCliente();

        var fecha = new Date();

        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var year = fecha.getFullYear();

        dia = this.addZero(dia);
        mes = this.addZero(mes);

        var fechaFormato = year + '-' + mes + '-' + dia;

        this.setState({
            editarVehiculoHistoria: true,
            indexVehiculoHistoria: false,
            fechaActual: this.state.fechaActual,
            fechaFormato: fechaFormato,
            vehiculoHistoriaSeleccionado: this.state.vehiculoHistoriaSeleccionado,
            bandera: 1
        });
    }

    getOnSubmitEditarVehiculoHistoria(resultado) {
        
        if (resultado.bandera === 0) {
            this.getVehiculoHistoria(this.state.pagination.current_page, '', 5);
            this.setState({
                editarVehiculoHistoria: false,
                indexVehiculoHistoria: true,
                bandera: 0
            });
        }
    }

    showVehiculoHistoria(id) {
        var data = {
            'idVehiculoHistoria': id
        }
        axios.post('/commerce/admin/showVehiculoHistoria', data).then(
            response =>{
                this.setState({
                    vehiculoHistoriaSeleccionado: response.data.data,
                    visibleVehiculoHistoria: true
                });
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

    deleteVehiculoHistoria(id) {
        this.setState({
            visibleVehiculoHistoriaDelete: true,
            idVehiculoHistoria: id,
        });
    }

    handleCerrarModalShow() {
        this.setState({
            visibleVehiculoHistoria: false,
            visibleVehiculoHistoriaDelete: false,
            idVehiculoHistoria: 0,
            loadModal: false,
        });
    }

    onChangeModalShow() {
        return (
            <Modal
                title='Datos de Vehiculo Historia'
                visible={this.state.visibleVehiculoHistoria}
                onOk={this.handleCerrarModalShow.bind(this)}
                onCancel={this.handleCerrarModalShow.bind(this)}
                footer={null}
                width={700}
                style={{'top': '40px'}}
            >

                <ShowVehiculoHistoria 
                    callback={this.getResultadoVehiculoHistoriaShow.bind(this)}
                    vehiculoHistoria={this.state.vehiculoHistoriaSeleccionado}
                />

            </Modal>
        )
    }

    onSubmitEliminar(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('id', this.state.idVehiculoHistoria);

        this.setState({
            loadModal: true
        });

        axios.post('/commerce/admin/anularVehiculoHistoria', formData).then(
            response => {          
                if (response.data.response === 1) {
                    this.getVehiculoHistoria(1, '', 5);
                    this.handleCerrarModalShow();
                    message.success('eliminado exitosamente');
                }else {
                    if (response.data.response === 0) {
                        
                        message.warning('No se puede eliminar por que esta en una transaccion');
                    }
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        );

    }

    onchangeModalDelete() {
        return(
            <Modal
                title='Eliminar Vehiculo Historia'
                visible={this.state.visibleVehiculoHistoriaDelete}
                onOk={this.handleCerrarModalShow.bind(this)}
                onCancel={this.handleCerrarModalShow.bind(this)}
                footer={null}
                width={350}
            >

                <div>
                    <div className="form-group-content"
                        style={{'display': (this.state.loadModal)?'none':'block'}}>
                        
                        <form onSubmit={this.onSubmitEliminar.bind(this)} encType="multipart/form-data">
                            
                            <div className="text-center-content"
                                style={{'marginTop': '-15px'}}>
                                
                                <label className='label-group-content'>
                                    Estas seguro de eliminar?
                                </label>
                            
                            </div>

                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
    
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button type="submit" 
                                        className="btn-content btn-sm-content btn-blue-content">
                                            Aceptar
                                    </button>
                                </div>
                                <div className="pull-right-content">
                                    <button type="button" onClick={this.handleCerrarModalShow.bind(this)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    </div>
                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadModal)?'block':'none',
                            'marginTop': '-15px'
                        }}>
                        <div className="text-center-content">
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                            
                        </div>
                        <div className="text-center-content"
                            style={{'marginTop': '20px'}}>
                            <label> Cargando Informacion Favor de Esperar ...</label>
                        </div>

                    </div>
                </div>

            </Modal>
        )
    }

    getResultadoVehiculoHistoriaShow() {
        this.handleCerrarModalShow();
    }

    render() {
        
        const componentModalShow = this.onChangeModalShow();

        const componentModalDelete = this.onchangeModalDelete();
        
        return (
            <div>

                {componentModalShow}

                {componentModalDelete}

                <CrearVehiculoHistoria 
                    visibleCrear={this.state.crearVehiculoHistoria}
                    callback={this.getOnSubmitVehiculoHistoria.bind(this)}
                    fechaActual={this.state.fechaActual}
                    cliente={this.state.clientes}
                    fechaFormato={this.state.fechaFormato}
                    
                />

                <EditVehiculoHistoria
                    visibleEditar={this.state.editarVehiculoHistoria}
                    callback={this.getOnSubmitEditarVehiculoHistoria.bind(this)}
                    fechaActual={this.state.fechaActual}
                    cliente={this.state.clientes}
                    fechaFormato={this.state.fechaFormato}
                    vehiculoHistoria={this.state.vehiculoHistoriaSeleccionado}
                    bandera={this.state.bandera}
                />

                <div className="row-content"
                    style={{'display': (this.state.indexVehiculoHistoria)?'block':'none'}}>
                    

                    <div style={{'display': (this.state.loadIndex)?'none':'block'}}>
                    
                        <div className="card-body-content card-primary-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Listado Vehiculo Historia</h1>
                            </div>
                            <div className="pull-right-content">
                                <a onClick={this.crearVehiculoHistoria.bind(this)}
                                    className="btn-content btn-sm-content btn-primary-content">
                                    <i> Nuevo </i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="card-header-content">

                            <div className="pull-left-content">
                                <div className="input-group-content">
                                    <select value={this.state.nroPagination}
                                        onChange={this.onChangeNroPagination.bind(this)}
                                        className="form-control-content w-25-content">
                                        <option value="2"> 2 </option>
                                        <option value="5"> 5 </option>
                                        <option value="10"> 10 </option>
                                        <option value="25"> 25 </option>
                                        <option value="50"> 50 </option>
                                        <option value="100"> 100 </option>
                                    </select>
                                    <h3 className="title-md-content"> Mostrar </h3>
                                </div>
                            </div>

                            <div className="pull-right-content">
                                <div className="input-group-content">
                                    <input type="text" onKeyPress={this.onChangeEnter.bind(this)}
                                        value={this.state.buscar} onChange={this.onChangeBuscarDato.bind(this)}
                                        className="form-control-content w-75-content"  placeholder=" Buscar ..."/>
                                    <i className="fa fa-search fa-content" onClick={this.onChangeBuscar.bind(this)}> </i>
                                </div>
                            </div>

                        </div>

                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>Id</th>
                                    <th>Fecha Recibida</th>
                                    <th>Cliente</th>
                                    <th>Vehiculo</th>
                                    <th>Fecha Proxima</th>
                                    <th>Opcion</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.vehiculoHistoria.map((vehiculoHistoria, indice) => (
                                            <tr key={indice}>
                                                
                                                <td>
                                                    <label className="col-show">Id: </label> {vehiculoHistoria.idvehiculohistoria}
                                                </td>

                                                <td>
                                                    <label className="col-show">Fecha Recibida: </label> {vehiculoHistoria.fecha}
                                                </td>

                                                <td>
                                                    <label className="col-show">Cliente: </label> {vehiculoHistoria.nombre} {vehiculoHistoria.apellido}
                                                </td>

                                                <td>
                                                    <label className="col-show">Vehiculo: </label> {vehiculoHistoria.descripcion} - {vehiculoHistoria.placa}
                                                </td>

                                                <td>
                                                    <label className="col-show">Fecha Proxima: </label> {vehiculoHistoria.fechaproxima}
                                                </td>
                                                
                                                <td><label className="col-show">Opcion: </label>

                                                    <a onClick={this.showVehiculoHistoria.bind(this, vehiculoHistoria.idvehiculohistoria)}
                                                        className="btn-content btn-success-content hint--bottom hint--success" 
                                                        aria-label="detalles">
                                                        <i className="fa fa-eye"> </i>
                                                    </a>

                                                    <a onClick={this.editarVehiculoHistoria.bind(this, indice)}
                                                        className="btn-content btn-primary-content hint--bottom hint--bottom"
                                                        aria-label="editar" >
                                                        <i className="fa fa-edit"> </i>
                                                    </a>

                                                    <a onClick={this.deleteVehiculoHistoria.bind(this, vehiculoHistoria.idvehiculohistoria)}
                                                        className="btn-content btn-danger-content hint--bottom hint--error"
                                                        aria-label="eliminar" >
                                                        <i className="fa fa-trash"> </i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    {(this.state.pagination.current_page > 1) ?
                                        <li className="page-item">
                                            <a  onClick={this.cambiarPagina.bind(this, this.state.pagination.current_page - 1, this.state.buscar, this.state.nroPagination)}
                                                className="page-link"
                                                href="#" aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                        </li>:
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#"
                                                aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                        </li>
                                    }
                                    {this.onChangePagesNumber().map(
                                        (page) => (
                                            <li key={page}
                                                className={(page === this.onChangeIsActivedPaginate.bind())?
                                                    'page-item active':'page-item'}>
                                                <a className="page-link" onClick={this.cambiarPagina.bind(this, page, this.state.buscar, this.state.nroPagination)} href="#">{page}</a></li>
                                        )
                                    )}
                                    {(this.state.pagination.current_page < this.state.pagination.last_page) ?
                                        <li className="page-item">
                                            <a className="page-link"
                                                onClick={this.cambiarPagina.bind(this, this.state.pagination.current_page + 1, this.state.buscar, this.state.nroPagination)}
                                                href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </li>:
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </li>
                                    }
                                </ul>
                            </nav>
                        </div>
                    
                    </div>

                    
                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadIndex)?'block':'none',
                            'marginTop': '-15px'
                        }}>
                        <div className="text-center-content">
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 45 }} spin />} />
                                    
                        </div>
                        <div className="text-center-content"
                            style={{'marginTop': '20px'}}>
                            <label> Cargando Informacion Favor de Esperar ...</label>
                        </div>

                    </div>

                </div>
            
            </div>
        );
    }
}