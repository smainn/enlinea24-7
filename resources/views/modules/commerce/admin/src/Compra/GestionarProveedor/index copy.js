
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { message, Modal, Spin, Icon } from 'antd';
import 'antd/dist/antd.css';
import ShowProveedor from './show';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';

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

            nroPagination: 10,
            buscar: '',

            loadIndex: false,
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            btn_ver: readPermisions(keys.proveedor_btn_ver),
            btn_nuevo: readPermisions(keys.proveedor_btn_nuevo),
            btn_editar: readPermisions(keys.proveedor_btn_editar),
            btn_eliminar: readPermisions(keys.proveedor_btn_eliminar)
        }

        this.btnVer = this.btnVer.bind(this);
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getProveedor(1, '', 5);
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getProveedor(page, buscar, nroPaginacion) {
/*
        this.setState({
            loadIndex: true
        });
*/
        var url = '/commerce/api/proveedor/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        
        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    proveedor: result.proveedor.data,
                    pagination: result.pagination,
                    /*loadIndex: false*/
                });
            }
            
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
        this.getProveedor(1, this.state.buscar, event.target.value);
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
        httpRequest('post', '/commerce/api/proveedor/show', data)
        .then(result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    proveedorSeleccionado: result.proveedor,
                    proveedorContacto: result.contacto,
                    visibleShow: true
                });
            }
                
        })
        .catch(
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
                width={900}
                style={{'top': '20px'}}
            >

                <ShowProveedor
                    callback={this.getResultadoProveedorShow.bind(this)}
                    proveedor={this.state.proveedorSeleccionado}
                    contacto={this.state.proveedorContacto}
                    bandera={1}
                />

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
                        {/*<form onSubmit={this.onSubmitDelete.bind(this)} encType="multipart/form-data">*/}
                            <div className="text-center-content"
                                style={{'marginTop': '-15px'}}>
                                <label className='label-group-content'>
                                    ¿Estas seguro de eliminar el proveedor?
                                </label>
                            </div>

                            <div className="form-group-content" 
                                style={{
                                    'borderTop': '1px solid #e8e8e8',
                                    'marginBottom': '-20px'
                                }}>
    
                                <div className="pull-right-content"
                                        style={{'marginRight': '-10px'}}>
                                    <button 
                                        onClick={this.onSubmitDelete.bind(this)}
                                        type="button" 
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
                        {/*</form>*/}
                        
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
        //e.preventDefault();
        /*const formData = new FormData();
        formData.append('id', this.state.idProveedor);
        */
        this.setState({
            loadModalDelete: true
        });
        httpRequest('post', '/commerce/admin/anularProveedor', {
            id: this.state.idProveedor
        })
        .then(result => {
            if (result.response === 1) {
                this.state.proveedor.splice(this.state.posicionProveedor, 1);
                this.setState({
                    proveedor: this.state.proveedor,
                    loadModalDelete: false,
                });
                this.handleCerrarModalDelete();
                message.success('Exito en eliminar proveedor');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                //this.handleCerrarModalDelete();
                
                this.setState({
                    visibleDelete: false,
                    loadModalDelete: false,
                    posicionProveedor: -1
                })
                message.warning(result.message);
            }
                
        })
        .catch(
            error => {
                this.setState({
                    loadModalDelete: false
                });
                console.log(error);
            }
        )
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A'){
            return(
                <Link to="/commerce/admin/proveedor/create" className="btns btns-primary">
                    <i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return(
                <a onClick={this.abrirModalShow.bind(this, id)}
                    className="btns btns-sm btns-outline-success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return(
                <Link to={`/commerce/admin/proveedor/edit/${id}`}
                    className="btns btns-sm btns-outline-primary"
                    aria-label="editar" >
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id, key) {
        if(this.permisions.btn_eliminar.visible == 'A'){
            return(
                <a onClick={this.abrirModalDelete.bind(this, id, key)}
                    className="btns btns-sm btns-outline-danger"
                    aria-label="eliminar" >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const componentModalDelete = this.onChangeModalDelete();
        const componentModalShow = this.onChangeModalShow();
        const btnNuevo = this.btnNuevo();

        return (
            <div className="rows">

                {componentModalDelete}

                {componentModalShow}

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Proveedor</h1>
                        </div>
                        <div className="pulls-right">
                            {btnNuevo}
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control"
                                    value={this.state.nroPagination}
                                    onChange={this.onChangeNroPagination.bind(this)}
                                >
                                
                                    <option value="10"> 10 </option>
                                    <option value="25"> 25 </option>
                                    <option value="50"> 50 </option>
                                    <option value="100"> 100 </option>
                                </select>
                                <h3 className="lbl-input-form-content active"> Mostrar </h3>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <div className="inputs-groups">
                                <input type="text" 
                                        onKeyPress={this.onChangeEnter.bind(this)}
                                        value={this.state.buscar} 
                                        onChange={this.onChangeBuscarDato.bind(this)}
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}} 
                                    onClick={this.onChangeBuscar.bind(this)}> 
                                </i>
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="tabless">
                            <table className="tables-respons">
                                <thead>
                                    <tr>
                                        <th>Nro</th>
                                        <th>Codigo</th>
                                        <th>Nombre</th>
                                        <th>Nit</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.proveedor.map(
                                        (resultado, key) => {
                                            let codigo = resultado.idproveedor;
                                            if (this.state.configCodigo) {
                                                codigo = resultado.codproveedor;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>
                                                        {key + 1}
                                                    </td>
                                                    <td>
                                                        {codigo}
                                                    </td>
                                                    <td>
                                                        {resultado.nombre} {resultado.apellido}
                                                    </td>
                                                    <td>
                                                        {resultado.nit}
                                                    </td>
                                                    <td>
                                                        { this.btnVer(resultado.idproveedor) }
                                                        { this.btnEditar(resultado.idproveedor) }
                                                        { this.btnEliminar(resultado.idproveedor, key) }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="forms-groups">

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
                </div>
            </div>
        );
    }
}