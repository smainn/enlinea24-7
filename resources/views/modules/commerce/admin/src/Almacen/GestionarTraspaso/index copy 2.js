import React, { Component } from 'react';
import { message, Modal, Spin, Icon } from 'antd';
import { Redirect, withRouter, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import Confirmation from '../../../components/confirmation';

class IndexTraspasos extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            objecto: {},
            arrayData: [],
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
            noSesion: false
        }
        this.permisions = {
            btn_nuevo: readPermisions(keys.vehiculo_parte_btn_nuevo),
            btn_editar: readPermisions(keys.vehiculo_parte_btn_editar),
            btn_eliminar: readPermisions(keys.vehiculo_parte_btn_eliminar)
        }
        this.btnNuevo = this.btnNuevo.bind(this);
    }

    onNuevoTraspaso() {
        var url = '/commerce/admin/traspaso_producto/create'
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <a onClick={this.onNuevoTraspaso.bind(this)}
                        className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </a>
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getData(1, '', 10);
    }

    getData(page, buscar, nroPaginacion) {
        var url = '/commerce/api/traspaso_producto/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true})
            } else {
                this.setState({
                    arrayData: result.data.data,
                    pagination: result.pagination
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
        this.getData(page,  buscar, nroPaginacion);
    }

    onChangeBuscarDato(e) {
        this.setState({
            buscar: e.target.value
        })
    }

    onChangeEnter(e){
        if (e.key === 'Enter') {
            this.getData(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getData(1, this.state.buscar, this.state.nroPagination);
    }

    onChangeNroPagination(e) {
        this.setState({
            nroPagination: e.target.value
        });
        this.getData(1, this.state.buscar, e.target.value);
    }

    btnEliminar(objecto) {
        return (
            <a className="btns btns-sm btns-outline-danger"
                onClick={this.onDeleteTraspaso.bind(this, objecto)}
                >
                <i className="fa fa-trash"> 
                </i>
            </a>
        );
    }
    onDeleteTraspaso(objecto) {
        this.setState({
            visible: true,
            objecto: objecto,
        });
    }
    handleCerrarModal() {
        this.setState({
            visible: false,
            loading: false,
            objecto: {},
        });
    }

    componentConfirmacion() {
        return (
            <Confirmation
                visible={this.state.visible}
                title='Eliminar Traspaso'
                loading={this.state.loading}
                onCancel={this.handleCerrarModal.bind(this)}
                onClick={this.onSubmitDelete.bind(this)}
                content={
                    <label style={{paddingBottom: 5}}>
                        ¿Desea eliminar los registros...?
                    </label>
                }
            />
        );
    }

    onSubmitDelete() {
        var body = {
            id: this.state.objecto.idtraspasoproducto,
            fkidalmacen_entra: this.state.objecto.fkidalmacen_entra,
            fkidalmacen_sale: this.state.objecto.fkidalmacen_sale,
        };
        this.setState({
            loading: true,
        });
        httpRequest('post', '/commerce/api/traspaso_producto/destroy', body)
        .then((result) => {
            console.log(result);
            if (result.response == 1) {
                message.success('Exito en eliminar traspaso');
                this.getData(1, '', 10);
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.handleCerrarModal();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    btnVer(id) {
        return (
            <Link to={'/commerce/admin/traspaso_producto/show/' + id}
                className="btns btns-sm btns-outline-success"
                >
                <i className="fa fa-eye"> </i>
            </Link>
        );
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">
                {this.componentConfirmacion()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Traspaso Producto </h1>
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
                                        <th>Tipo</th>
                                        <th>Almacen Salida</th>
                                        <th>Almacen Entrante</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.arrayData.map(
                                        (resultado, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{resultado.codtraspaso}</td>
                                                    <td>{resultado.tipo}</td>
                                                    <td>{resultado.almacen_salida}</td>
                                                    <td>{resultado.almacen_entra}</td>
                                                    <td>
                                                        { this.btnVer(resultado.idtraspasoproducto) }
                                                        { this.btnEliminar(resultado) }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
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
        );
    }
}
export default withRouter(IndexTraspasos);