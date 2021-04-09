

import React, { Component } from 'react';
import { message, Modal, Spin, Icon, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import ShowVehiculoHistoria from './ShowVehiculoHistoria';
import {Link, Redirect} from 'react-router-dom';
import {cambiarFormato} from '../../../tools/toolsDate'
import Confirmation from '../../../components/confirmation';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';

export default class IndexVehiculoHistoria extends Component{

    constructor() {
        
        super();

        this.state = {
            loadModal: false,
            visible: false,
            bandera: 0,

            nroPagination: 10,
            buscar: '',

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

            vehiculoHistoriaSeleccionado: [],
            idVehiculoHistoria: 0,
            noSesion: false
        }

        this.permisions = {
            btn_ver: readPermisions(keys.vehiculo_historia_btn_ver),
            btn_nuevo: readPermisions(keys.vehiculo_historia_btn_nuevo),
            btn_eliminar: readPermisions(keys.vehiculo_historia_btn_eliminar)
        }
        
        this.btnVer = this.btnVer.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
    }

    componentDidMount() {

        this.getVehiculoHistoria(1, '', 10);

    }

    onChangeNroPagination(e) {
        this.setState({
            nroPagination: e.target.value
        });
        this.getVehiculoHistoria(1, this.state.buscar, e.target.value);
    }

    getVehiculoHistoria(page, buscar, nroPaginacion) {

        var url = '/commerce/api/vehiculo-historia/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        
        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculoHistoria: result.vehiculoHistoria.data,
                    pagination: result.pagination,
            
                });
            }
            
        })
        .catch( error => {
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

    onKeyPressEnter(e){
        if (e.key === 'Enter') {
            this.getVehiculoHistoria(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onClickBuscar() {
        this.getVehiculoHistoria(1, this.state.buscar, this.state.nroPagination);
    }

    onChangeBuscarDato(e) {
        this.setState({
            buscar: e.target.value
        })
    }

    showVehiculoHistoria(id) {
        var data = {
            'idVehiculoHistoria': id
        }
        httpRequest('post', '/commerce/admin/showVehiculoHistoria', data)
        .then(result =>{
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculoHistoriaSeleccionado: result.data,
                    visible: true,
                    bandera: 1,
                });
            }
        })
        .catch(
            error => {
                console.log(error);
            }
        )
    }

    handleCerrar() {
        this.setState({
            visible: false,
            bandera: 0,
            loadModal: false,
            idVehiculoHistoria: 0,
        });
    }

    getResultadoVehiculoHistoriaShow() {
        this.handleCerrar();
    }

    onChangeModalShow() {

        if (this.state.bandera == 1) {

            return (
                <Modal
                    title='Datos de Vehiculo Historia'
                    visible={this.state.visible}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={800}
                    style={{'top': '20px'}}
                >

                    <ShowVehiculoHistoria 
                        callback={this.getResultadoVehiculoHistoriaShow.bind(this)}
                        vehiculoHistoria={this.state.vehiculoHistoriaSeleccionado}
                    />

                </Modal>
            );
        }

        if (this.state.bandera == 2) {

            return (
                <Confirmation 
                    visible={this.state.visible}
                    loading={this.state.loadModal}
                    onCancel={this.handleCerrar.bind(this)}
                    title='Eliminar Vehiculo Historia'
                    onClick={this.onSubmitEliminar.bind(this)}
                    content='¿Estas seguro de eliminar...?'
                />
            );
        }
    }

    deleteVehiculoHistoria(id) {
        this.setState({
            visible: true,
            bandera: 2,
            idVehiculoHistoria: id,
        });
    }

    onSubmitEliminar(e) {
        e.preventDefault();
        
        /*const formData = new FormData();
        formData.append('id', this.state.idVehiculoHistoria);
        */
        this.setState({
            loadModal: true
        });

        httpRequest('post', '/commerce/api/vehiculo-historia/anular', {
            id: this.state.idVehiculoHistoria
        })
        .then(result => {    
            this.handleCerrar();      
            if (result.response === 1) {
                this.getVehiculoHistoria(1, '', 10);
                message.success('eliminado exitosamente');
            } else if (result.response === 0) {
                message.warning('No se puede eliminar por que esta en una transaccion');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch(
            error => {
                this.handleCerrar();   
                console.log(error);
            }
        );

    }

    buttonEdit(item) {
        if (item.fkidventa == null) {
            return (
                <Link to={`/commerce/admin/vehiculo-historia/edit/${item.idvehiculohistoria}`}
                    className="btns btns-sm btns-outline-primary hint--bottom hint--bottom"
                    aria-label="editar" >
                    <i className="fa fa-edit"> </i>
                </Link>

            );
        }
        return null;
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.showVehiculoHistoria.bind(this, id)}
                    className="btns btns-sm btns-outline-success hint--bottom hint--success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <Link to="/commerce/admin/vehiculo-historia/create" className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </Link>
                </div>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a onClick={this.deleteVehiculoHistoria.bind(this, id)}
                    className="btns btns-sm btns-outline-danger hint--bottom hint--error"
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
        const componentModalShow = this.onChangeModalShow();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">

                {componentModalShow}

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Vehiculo Historia</h1>
                        </div>
                        { btnNuevo }
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
                                        onKeyPress={this.onKeyPressEnter.bind(this)}
                                        value={this.state.buscar} 
                                        onChange={this.onChangeBuscarDato.bind(this)}
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}} 
                                    onClick={this.onClickBuscar.bind(this)}> 
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
                                        <th>Fecha Recibida</th>
                                        <th>Cliente</th>
                                        <th>Vehiculo</th>
                                        <th>Fecha Proxima</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.vehiculoHistoria.map(
                                        (resultado, key) => (
                                            <tr key={key}>
                                                <td>
                                                    {key + 1}
                                                </td>

                                                <td>
                                                    {cambiarFormato(resultado.fecha)}
                                                </td>

                                                <td>
                                                    {(resultado.apellido == null)?
                                                        resultado.nombre:
                                                        resultado.nombre + ' ' + resultado.apellido
                                                    }
                                                </td>

                                                <td>
                                                    {resultado.descripcion} - {resultado.placa}
                                                </td>

                                                <td>
                                                    {cambiarFormato(resultado.fechaproxima)}
                                                </td>
                                                
                                                <td>

                                                    { this.btnVer(resultado.idvehiculohistoria) }

                                                    { this.buttonEdit(resultado) }

                                                    { this.btnEliminar(resultado.idvehiculohistoria) }
                                                    
                                                </td>
                                            </tr>
                                        )
                                    )}
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
                </div>
            </div>
        );

    }
}