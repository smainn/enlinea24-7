
import React, { Component } from 'react';

import axios from 'axios';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

export default class IndexParteVehiculo extends Component{

    constructor() {
        super();
        this.state = {

            mensaje: 'parte de Vehiculo Activado',

            vehiculoPartes: [],
            idVehiculoParte: 0,

            descripcionParteVehiculo: '',
            estado: true,

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

            modal: 'none',
            bandera: 0,
            tecla: 0,

            validacion: [1],

            visibleCrearModal: false,
            visibleEditarModal: false,
            visibleDeleteModal: false,

            loadModal: false,

        }
    }

    componentDidMount() {
        this.getVehiculoPartes(1, '', 5);
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        }
    }

    getVehiculoPartes(page, buscar, nroPaginacion) {

        var url = 'indexParteVehiculo?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        axios.get(url).then( resultado => {
            this.setState({
                vehiculoPartes: resultado.data.vehiculoPartes.data,
                pagination: resultado.data.pagination
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
        this.getVehiculoPartes(page,  buscar, nroPaginacion);
    }

    onChangeBuscarDato(e) {
        this.setState({
            buscar: e.target.value
        })
    }

    onChangeEnter(e){
        if (e.key === 'Enter') {
            this.getVehiculoPartes(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getVehiculoPartes(1, this.state.buscar, this.state.nroPagination);
    }

    onChangeNroPagination(e) {
        this.setState({
            nroPagination: e.target.value
        });
    }

    onChangeDescripcionParteVehiculo(e) {
        this.state.validacion[0] = 1;
        this.setState({
            descripcionParteVehiculo: e.target.value,
            validacion: this.state.validacion
        });
    }

    onchangeActivarParteVehiculo(e) {
        this.setState({
            mensaje: (!this.state.estado)?'parte de Vehiculo Activado':'parte de Vehiculo Desactivado',
            estado: !this.state.estado,
        });
    }

    handleCerrar(bandera) {
        this.state.validacion[0] = 1;
        if (bandera === 1) {
            this.setState({
                modal: 'none',
                idVehiculoParte: 0,
                tecla: 0,
                bandera: 0,
                descripcionParteVehiculo: '',
                estado: true,
                mensaje: 'parte de Vehiculo Activado',
                visibleCrearModal: !this.state.visibleCrearModal,
                validacion: this.state.validacion,
                loadModal: false
            });
        }else {
            if (bandera === 2) {
                this.setState({
                    modal: 'none',
                    idVehiculoParte: 0,
                    tecla: 0,
                    bandera: 0,
                    descripcionParteVehiculo: '',
                    estado: true,
                    mensaje: 'parte de Vehiculo Activado',
                    visibleEditarModal: !this.state.visibleEditarModal,
                    validacion: this.state.validacion,
                    loadModal: false
                });

            }else {
                this.setState({
                    modal: 'none',
                    idVehiculoParte: 0,
                    tecla: 0,
                    bandera: 0,
                    descripcionParteVehiculo: '',
                    estado: true,
                    mensaje: 'parte de Vehiculo Activado',
                    visibleDeleteModal: !this.state.visibleDeleteModal,
                    validacion: this.state.validacion,
                    loadModal: false
                });
            }
        }
    }

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Modal
                    title='Nueva parte Vehiculo'
                    visible={this.state.visibleCrearModal}
                    onOk={this.handleCerrar.bind(this, this.state.bandera)}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    footer={null}
                    width={500}
                >
                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitCrear.bind(this)} encType="multipart/form-data">
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"></div>
                                
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" ref={function(input) {if (input != null) {input.focus();}}}
                                            value={this.state.descripcionParteVehiculo}
                                            onChange={this.onChangeDescripcionParteVehiculo.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-outline-content':'form-outline-content error'}
                                            placeholder="Agregar descripcion..."
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Descripcion</label>
                                    </div>

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
                                        <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
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
            );
        }
        if (this.state.bandera === 2) {
            return (
                <Modal
                    title='Editar parte Vehiculo'
                    visible={this.state.visibleEditarModal}
                    onOk={this.handleCerrar.bind(this, this.state.bandera)}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    footer={null}
                    width={500}
                >
                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitEditar.bind(this)} encType="multipart/form-data">
                                
                                <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"></div>
                                
                                <div className="col-lg-8-content col-md-8-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.descripcionParteVehiculo}
                                            onChange={this.onChangeDescripcionParteVehiculo.bind(this)}
                                            className={(this.state.validacion[0] === 1)?'form-outline-content':'form-outline-content error'}
                                            placeholder="Agregar descripcion..."
                                        />
                                        <label className={(this.state.validacion[0] === 1)?'label-group-content':'label-group-content error'}>Descripcion</label>
                                    </div>
                                </div>
                                <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                        <input type="checkbox" checked={this.state.estado} onChange={this.onchangeActivarParteVehiculo.bind(this)}
                                            className="check-content" id="activar" />
                                        <label htmlFor="activar" className="lbl-checkbox-content">{this.state.mensaje}</label>
                                    </div>
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
                                        <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
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
            );
        }
        if (this.state.bandera === 3) {
            return (
                <Modal
                    title='Eliminar parte Vehiculo'
                    visible={this.state.visibleDeleteModal}
                    onOk={this.handleCerrar.bind(this, this.state.bandera)}
                    onCancel={this.handleCerrar.bind(this, this.state.bandera)}
                    footer={null}
                    width={500}
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
                                        <button type="button" onClick={this.handleCerrar.bind(this, this.state.bandera)}
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
            );
        }
    }

    onSubmitEliminar(e) {

        e.preventDefault();

        const formData = new FormData();
        formData.append('id', this.state.idVehiculoParte);

        this.setState({
            loadModal: true
        });

        axios.post('/commerce/admin/destroyParteVehiculo', formData).then(
            response => {          
                if (response.data.response === 1) {
                    this.getVehiculoPartes(1, '', 5);
                    this.handleCerrar(this.state.bandera);
                    message.success('eliminado exitosamente');
                }else {
                    if (response.data.response === 0) {
                        this.handleCerrar(this.state.bandera);
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

    onSubmitEditar(e) {
        e.preventDefault();
        if (this.state.descripcionParteVehiculo.length > 0) {

            const formData = new FormData();
            formData.append('id', this.state.idVehiculoParte);
            formData.append('descripcion', this.state.descripcionParteVehiculo);
            formData.append('estado', this.state.estado);

            this.setState({
                loadModal: true
            });

            axios.post('/commerce/admin/updateParteVehiculo', formData).then(
                response => {          
                    if (response.data.response === 1) {

                        this.getVehiculoPartes(1, '', 5);
                        this.handleCerrar(this.state.bandera);
                        message.success('actualizacion exitosamente');

                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );

        }else {

            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion
            });

            message.error('No se permite campo vacio en descripcion');

        }
    }

    onSubmitCrear(e) {

        e.preventDefault();

        if (this.state.descripcionParteVehiculo.length > 0) {

            const formData = new FormData();
            formData.append('descripcion', this.state.descripcionParteVehiculo);
            formData.append('estado', this.state.estado);

            this.setState({
                loadModal: true
            });

            axios.post('/commerce/admin/postParteVehiculo', formData).then(
                response => {  

                    if (response.data.response === 1) {

                        this.getVehiculoPartes(1, '', 5);
                        this.handleCerrar(this.state.bandera);
                        message.success('datos guardados exitosamente');

                    }
                }).catch(
                    error => {
                        console.log(error);
                    }
                );
    

        }else {
            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion
            });
            message.error('No se permite campo vacio en descripcion');
        }
    }

    abrirModal(objeto) {
        if (objeto.bandera === 1) {
            this.setState({
                modal: 'block',
                bandera: objeto.bandera,
                idVehiculoParte: objeto.id,
                tecla: 1,
                descripcionParteVehiculo: objeto.nombre,
                visibleCrearModal: !this.state.visibleCrearModal,
                estado: (objeto.estado == 'A')?true:false,
                mensaje: (objeto.estado == 'A')?'parte de Vehiculo Activado':'parte de Vehiculo Desactivado'
            });
        }else {
            if (objeto.bandera === 2) {
                this.setState({
                    modal: 'block',
                    bandera: objeto.bandera,
                    idVehiculoParte: objeto.id,
                    tecla: 1,
                    descripcionParteVehiculo: objeto.nombre,
                    visibleEditarModal: !this.state.visibleEditarModal,
                    estado: (objeto.estado == 'A')?true:false,
                    mensaje: (objeto.estado == 'A')?'parte de Vehiculo Activado':'parte de Vehiculo Desactivado'
                });
            }else {
                this.setState({
                    modal: 'block',
                    bandera: objeto.bandera,
                    idVehiculoParte: objeto.id,
                    tecla: 1,
                    descripcionParteVehiculo: objeto.nombre,
                    visibleDeleteModal: !this.state.visibleDeleteModal,
                    estado: (objeto.estado == 'A')?true:false,
                    mensaje: (objeto.estado == 'A')?'parte de Vehiculo Activado':'parte de Vehiculo Desactivado'
                });
            }
        }
        
    }

    cerrarModal(){
        this.setState({
            modal: 'none',
            idVehiculoParte: 0,
            tecla: 0,
            bandera: 0,
            descripcionParteVehiculo: '',
            estado: true,
            mensaje: 'parte de Vehiculo Activado'
        });
    }

    render() {
        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="row-content">
                
                {componentModalShow}

                <div className="card-body-content card-primary-content">
                    <div className="pull-left-content">
                        <h1 className="title-logo-content"> Listado parte Vehiculo </h1>
                    </div>
                    <div className="pull-right-content">
                        <a onClick={this.abrirModal.bind(this, {bandera: 1, id: 0, nombre: '', estado: 'A'})}
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
                            <th>Descripcion</th>
                            <th>Estado</th>  
                            <th>Opcion</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.vehiculoPartes.map((vehiculoParte, indice) => (
                                    <tr key={indice}>
                                        <td><label className="col-show">Id: </label> {vehiculoParte.idvehiculopartes}</td>
                                        <td><label className="col-show">Descripcion: </label> {vehiculoParte.nombre}</td>
                                        
                                        <td><label className="col-show">Estado: </label> {(vehiculoParte.estado === 'A')?'Activo':'Desactivado'}</td>
                                        
                                        <td><label className="col-show">Opcion: </label>
                                            <a className="btn-content btn-primary-content hint--bottom hint--bottom"
                                                aria-label="editar" onClick={this.abrirModal.bind(this, {bandera: 2, id : vehiculoParte.idvehiculopartes, nombre: vehiculoParte.nombre, estado: vehiculoParte.estado})}>
                                                <i className="fa fa-edit"> </i>
                                            </a>
                                            <a className="btn-content btn-danger-content hint--bottom hint--error"
                                                aria-label="eliminar" onClick={this.abrirModal.bind(this, {bandera: 3, id : vehiculoParte.idvehiculopartes, nombre: vehiculoParte.nombre, estado: vehiculoParte.estado})}>
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
        );
    }
}