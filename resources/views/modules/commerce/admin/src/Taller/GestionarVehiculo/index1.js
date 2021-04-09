
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { message, Modal, Spin, Icon } from 'antd';
import 'antd/dist/antd.css';

import ShowVehiculo from './show';
import Confirmation from '../../../components/confirmation';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';


export default class IndexVehiculo extends Component{

    constructor() {
        super();
        this.state = {

            focus: [0],

            vehiculos: [],
            idVehiculo: 0,

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

            showVisible: false,

            vehiculoDetalle: [],
            vehiculoFoto: [],
            vehiculoCaracteristica: [],

            indiceVehiculo: 0,

            deleteVisible: false,
            loadModal: true,
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            btn_ver: readPermisions(keys.vehiculo_btn_ver),
            btn_editar: readPermisions(keys.vehiculo_btn_editar),
            btn_eliminar: readPermisions(keys.vehiculo_btn_eliminar),
            btn_nuevo: readPermisions(keys.vehiculo_btn_nuevo),
            btn_reporte: readPermisions(keys.vehiculo_btn_reporte)
        }

        this.btnVer = this.btnVer.bind(this);
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
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
        this.getVehiculo(page,  buscar, nroPaginacion);
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getVehiculo(1, '', 10);
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

    getVehiculo(page, buscar, nroPaginacion) {

        var url = '/commerce/api/vehiculo/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.setState({
                    vehiculos: result.vehiculo.data,
                    pagination: result.pagination
                });
            }
            
        }).catch( error => {
            console.log(error)
        });
    }

    onChangeNroPagination(event) {
        this.setState({
            nroPagination: event.target.value
        });
        this.getVehiculo(1, this.state.buscar, event.target.value);
    }

    onChangeBuscarDato(e) {
        this.setState({
            buscar: e.target.value
        });
    }

    onChangeEnter(e){
        if (e.key === 'Enter') {
            this.getVehiculo(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getVehiculo(1, this.state.buscar, this.state.nroPagination);
    }

    showVehiculo(id) {
        this.getDetalleVehiculo(id);
        this.setState({
            showVisible: true,
            idVehiculo: id,
        });
    }

    getDetalleVehiculo(id) {
        httpRequest('get', '/commerce/api/vehiculo/show/' + id + '')
        .then( result => {
            if (result.response === 1){
                this.setState({
                    vehiculoDetalle: result.data,
                    vehiculoFoto: result.foto,
                    vehiculoCaracteristica: result.caracteristica
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        }).catch( error => {console.log(error)});
    }

    handleCerrarModal() {
        this.setState({
            showVisible: false,
            idVehiculo: 0,
            deleteVisible: false,
            indiceVehiculo: 0,
            loadModal: true,
        });
    }

    getResultadoDetalleVehiculo() {
        this.setState({
            showVisible: false,
            idVehiculo: 0,
        });
    }

    componentModalShow() {
        return (
            <Modal
                title='Datos del Vehiculo'
                visible={this.state.showVisible}
                onOk={this.handleCerrarModal.bind(this)}
                onCancel={this.handleCerrarModal.bind(this)}
                footer={null}
                width={850}
                style={{'top': '40px'}}
            >

                <ShowVehiculo 
                    vehiculo={this.state.vehiculoDetalle} 
                    imagen={this.state.vehiculoFoto}
                    caracteristica={this.state.vehiculoCaracteristica}
                    callback={this.getResultadoDetalleVehiculo.bind(this)}
                />

            </Modal>
        );
    }

    deleteVehiculo(id, indice) {
        this.setState({
            idVehiculo: id,
            indiceVehiculo: indice,
            deleteVisible: true,
        });
    }

    anularVehiculo() {
        const vehiculoSeleccionado = {
            id: this.state.idVehiculo
        };
        this.setState({
            loadModal: false,
        });
        httpRequest('post', '/commerce/api/vehiculo/anular', vehiculoSeleccionado)
        .then( result => {
            if (result.response === 1){
                
                this.state.vehiculos.splice(this.state.indiceVehiculo, 1);
                this.setState({
                    vehiculos: this.state.vehiculos
                });
                this.handleCerrarModal();
                message.success('Se elimino correctamente');
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                this.handleCerrarModal();
                message.warning(result.message);
            }
        }).catch( error => {console.log(error)});
    }

    componentModalDelete() {
        return (
            <Confirmation 
                visible={this.state.deleteVisible}
                loading={!this.state.loadModal}
                onCancel={this.handleCerrarModal.bind(this)}
                title='Eliminar Vehiculo'
                onClick={this.anularVehiculo.bind(this)}
                content='¿Estas seguro de eliminar...?'
            />
        );
    }

    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    aria-label="detalles" onClick={this.showVehiculo.bind(this, id)}>
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={`/commerce/admin/vehiculo/edit/${id}`}
                        className="btns btns-sm btns-outline-primary hint--bottom" aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id, key) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar" onClick={this.deleteVehiculo.bind(this, id, key)}>
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }
    
    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to="/commerce/admin/vehiculo/create"
                        className="btns btns-primary">
                    <i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    btnReporte() {
        if (this.permisions.btn_reporte.visible == 'A') {
            return (
                <Link to="/commerce/admin/vehiculo/reporte"
                        className="btns btns-primary">
                    <i className="fa fa-file-text"></i>
                    &nbsp;Reporte
                </Link>
            )
        }
        return null;
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const componentShowVehiculo = this.componentModalShow();
        const componentDeleteVehiculo = this.componentModalDelete();
        const btnNuevo = this.btnNuevo();
        const btnReporte = this.btnReporte();
        
        return (
            <div className="rows">
                
                {componentShowVehiculo}

                {componentDeleteVehiculo}

                <div className="cards">

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <h1 className="lbls-title"> 
                                Gestionar Vehiculo 
                            </h1>
                        </div>
                        <div className="pulls-right">
                            { btnReporte }
                            { btnNuevo }
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select value={this.state.nroPagination}
                                    onChange={this.onChangeNroPagination.bind(this)}
                                    className="forms-control"
                                >
                                    <option value="10"> 10 </option>
                                    <option value="25"> 25 </option>
                                    <option value="50"> 50 </option>
                                    <option value="100"> 100 </option>
                                </select>
                                <h3 className="lbls-input active"> Mostrar </h3>
                            </div>
                        </div>

                        <div className="pulls-right">
                            <div className="inputs-groups" 
                                style={{'marginTop': '10px', 'marginBottom': '10px'}}>
                                <input type="text" 
                                        onKeyPress={this.onChangeEnter.bind(this)}
                                        value={this.state.buscar} 
                                        onChange={this.onChangeBuscarDato.bind(this)}
                                        className="forms-control w-75-content"  placeholder=" buscar ..."/>
                                    <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}} onClick={this.onChangeBuscar.bind(this)}> </i>
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
                                        <th>Cliente</th>
                                        <th>Placa</th>
                                        <th>Tipo Uso</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.vehiculos.map(
                                        (resultado, key) => {
                                            let codigo = resultado.idvehiculo;
                                            if (this.state.configCodigo) {
                                                codigo = resultado.codvehiculo;
                                            }
                                            
                                            return (
                                                <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{codigo}</td>
                                                <td>{resultado.nombre} {resultado.apellido}</td>
                                                <td>{resultado.placa}</td>
                                                <td>{(resultado.tipopartpublic === 'R')?'Privado':'Publico'}</td>
                                                <td>
                                                    { this.btnVer(resultado.idvehiculo) }

                                                    { this.btnEditar(resultado.idvehiculo) }
                                                    
                                                    { this.btnEliminar(resultado.idvehiculo, key) }
                                                    
                                                </td>
                                            </tr>
                                            );
                                        }
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
