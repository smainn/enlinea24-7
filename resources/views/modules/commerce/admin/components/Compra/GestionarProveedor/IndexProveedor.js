
import React, { Component } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';

import { message, Modal, Spin, Icon } from 'antd';

import 'antd/dist/antd.css';

import ShowProveedor from './ShowProveedor';

export default class IndexProveedor extends Component{

    constructor() {
        
        super();
        this.state = {

            proveedorSeleccionado: [],
            proveedorContacto: [],

            visibleDelete: false,
            visibleShow: false,

            loadModalDelete: false,
            idProveedor: 0,
            posicionProveedor: -1,

            proveedor: [],

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

            loadIndex: false,
        }
    }

    componentDidMount() {
        this.getProveedor(1, '', 5);
    }

    getProveedor(page, buscar, nroPaginacion) {
/*
        this.setState({
            loadIndex: true
        });
*/
        var url = 'indexProveedor?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        
        axios.get(url).then( resultado => {
            this.setState({
                proveedor: resultado.data.proveedor.data,
                pagination: resultado.data.pagination,
                /*loadIndex: false*/
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
        this.getProveedor(page,  buscar, nroPaginacion);
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
            this.getProveedor(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getProveedor(1, this.state.buscar, this.state.nroPagination);
    }

    abrirModalShow(id) {
        
        var data = {
            'idProveedor': id
        }
        axios.post('/commerce/admin/showProveedor', data).then(
            response =>{
                
                this.setState({
                    proveedorSeleccionado: response.data.proveedor,
                    proveedorContacto: response.data.contacto,
                    visibleShow: true
                });
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }

    handleCerrarModalShow() {
        this.setState({
            visibleShow: false,
            posicionProveedor: -1,
            proveedorSeleccionado: [],
            proveedorContacto: []
        });
    }

    getResultadoProveedorShow() {
        this.handleCerrarModalShow();
    }

    onChangeModalShow() {
        return (
            <Modal
                title='Datos de Proveedor'
                visible={this.state.visibleShow}
                onOk={this.handleCerrarModalShow.bind(this)}
                onCancel={this.handleCerrarModalShow.bind(this)}
                footer={null}
                width={850}
                style={{'top': '40px'}}
            >

                <ShowProveedor
                    callback={this.getResultadoProveedorShow.bind(this)}
                    proveedor={this.state.proveedorSeleccionado}
                    contacto={this.state.proveedorContacto}
                    bandera={1}
                >
                </ShowProveedor>

            </Modal>

        )
    }

    abrirModalDelete(id, indice) {
        this.setState({
            idProveedor: id,
            visibleDelete: true,
            posicionProveedor: indice
        });
    }

    handleCerrarModalDelete() {
        this.setState({
            visibleDelete: false,
            loadModalDelete: false,
            posicionProveedor: -1
        });
    }

    onChangeModalDelete(){
        return (
            <Modal
                title='Eliminar Proveedor'
                visible={this.state.visibleDelete}
                onOk={this.handleCerrarModalDelete.bind(this)}
                onCancel={this.handleCerrarModalDelete.bind(this)}
                footer={null}
                width={400}
            >
                <div>
                    <div className="form-group-content"
                        style={{'display': (this.state.loadModalDelete)?'none':'block'}}>
                        
                        <form onSubmit={this.onSubmitDelete.bind(this)} encType="multipart/form-data">
                            
                            <div className="text-center-content"
                                style={{'marginTop': '-15px'}}>
                                
                                <label className='label-group-content'>
                                    Estas seguro de eliminar el proveedor?
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
                                    <button type="button" onClick={this.handleCerrarModalDelete.bind(this, this.state.bandera)}
                                        className="btn-content btn-sm-content btn-cancel-content">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    </div>
                    <div className="form-group-content"
                        style={{
                            'display': (this.state.loadModalDelete)?'block':'none',
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

    onSubmitDelete(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', this.state.idProveedor);

        this.setState({
            loadModalDelete: true
        });
        axios.post('/commerce/admin/anularProveedor', formData).then(
            resultado => {
                if (resultado.data.response === 1){
                    this.state.proveedor.splice(this.state.posicionProveedor, 1);
                    this.setState({
                        proveedor: this.state.proveedor,
                        loadModalDelete: false,
                    });
                    this.handleCerrarModalDelete();
                    message.success('Exito en eliminar proveedor');
                }
                
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

    render() {
        
        const componentModalDelete = this.onChangeModalDelete();

        const componentModalShow = this.onChangeModalShow();

        return (
            <div className="row-content">

                {componentModalDelete}

                {componentModalShow}

                <div style={{'display': (this.state.loadIndex)?'none':'block'}}>
                
                    <div className="card-body-content card-primary-content">
                        <div className="pull-left-content">
                            <h1 className="title-logo-content"> Listado de Proveedor</h1>
                        </div>
                        <div className="pull-right-content">
                            <Link to="/commerce/admin/indexProveedor/nuevo/crearProveedor"
                                className="btn-content btn-sm-content btn-primary-content">
                                <i> Nuevo </i>
                            </Link>
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
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Nit</th>
                                <th>Opcion</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.proveedor.map((proveedor, indice) => (
                                        <tr key={indice}>
                                            
                                            <td>
                                                <label className="col-show">Id: </label> {proveedor.idproveedor}
                                            </td>

                                            <td>
                                                <label className="col-show">Codigo: </label> {proveedor.codproveedor}
                                            </td>

                                            <td>
                                                <label className="col-show">Nombre: </label> {proveedor.nombre} {proveedor.apellido}
                                            </td>

                                            <td>
                                                <label className="col-show">Nit: </label> {proveedor.nit}
                                            </td>
                                            
                                            <td><label className="col-show">Opcion: </label>
                                                <a onClick={this.abrirModalShow.bind(this, proveedor.idproveedor)}
                                                    className="btn-content btn-success-content hint--bottom hint--success" 
                                                    aria-label="detalles">
                                                    <i className="fa fa-eye"> </i>
                                                </a>
                                                <Link to={`/commerce/admin/indexProveedor/actualizar/${proveedor.idproveedor}`}
                                                    className="btn-content btn-primary-content hint--bottom hint--bottom"
                                                    aria-label="editar" >
                                                    <i className="fa fa-edit"> </i>
                                                </Link>
                                                <a onClick={this.abrirModalDelete.bind(this, proveedor.idproveedor, indice)}
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
        );
    }
}