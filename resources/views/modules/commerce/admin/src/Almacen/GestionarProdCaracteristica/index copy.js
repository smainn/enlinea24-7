import React, { Component } from 'react';
import { message, Modal, Spin, Icon } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';

export default class IndexProductoCaracteristica extends Component{
    constructor() {
        super();
        this.state = {
            mensaje: 'Activado',
            data: [],
            idproduccaracteristica: 0,
            caracteristica: '',
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
            nroPagination: 10,
            buscar: '',
            modal: 'none',
            bandera: 0,
            tecla: 0,
            validacion: [1],
            visibleCrearModal: false,
            visibleEditarModal: false,
            visibleDeleteModal: false,
            loadModal: false,
            InputFocusBlur: [0, 0],
            labelFocusBlur: [0, 0],
            noSesion: false
        }
        this.permisions = {
            btn_nuevo: readPermisions(keys.prodcaracteristicas_btn_nuevo),
            btn_editar: readPermisions(keys.prodcaracteristicas_btn_editar),
            btn_eliminar: readPermisions(keys.prodcaracteristicas_btn_eliminar),
            descripcion: readPermisions(keys.prodcaracteristicas_input_descripcion),
        }
        this.btnEditar = this.btnEditar.bind(this);
        this.btnEliminar = this.btnEliminar.bind(this);
        this.btnNuevo = this.btnNuevo.bind(this);
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-primary hint--bottom hint--bottom"
                    aria-label="editar" onClick={this.abrirModal.bind(this, data)}>
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar" onClick={this.abrirModal.bind(this, data)}>
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <a onClick={this.abrirModal.bind(this, {bandera: 1, id: 0, nombre: ''})}
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
        document.addEventListener("keydown", this.handleEventKeyPress.bind(this));
    }

    handleEventKeyPress(e) {
        if (this.state.tecla === 1) {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        }
    }

    getData(page, buscar, nroPaginacion) {
        var url = '/commerce/api/producto_caracteristica/index?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        httpRequest('get', url)
        .then( result => {
            if (result.response == -2) {
                this.setState({ noSesion: true})
            } else {
                this.setState({
                    data: result.data.data,
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

    onChangeCaracteristica(e) {
        this.state.validacion[0] = 1;
        this.setState({
            caracteristica: e.target.value,
            validacion: this.state.validacion
        });
    }

    onchangeActivarParteVehiculo(e) {
        this.setState({
            mensaje: (!this.state.estado)?'Activado':'Desactivado',
            estado: !this.state.estado,
        });
    }

    handleCerrar() {
        this.state.validacion[0] = 1;
        this.setState({
            idproduccaracteristica: 0,
            tecla: 0,
            bandera: 0,
            caracteristica: '',
            visibleCrearModal: false,
            visibleEditarModal: false,
            visibleDeleteModal: false,
            validacion: this.state.validacion,
            loadModal: false,
        });
        
    }

    onChangeModalShow() {
        if (this.state.bandera === 1) {
            return (
                <Modal
                    title='Nuevo producto caracteristica'
                    visible={this.state.visibleCrearModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >
                    <div>
                        <div className="form-group-content"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitCrear.bind(this)} encType="multipart/form-data" style={{'marginTop': '-10px'}}>
                                
                                <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12" style={{'marginBottom': '14px'}}>
                                    <div className="inputs-groups">
                                        <input type="text" ref={function(input) {if (input != null) input.focus();}}
                                            value={this.state.caracteristica}
                                            onChange={this.onChangeCaracteristica.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar caracteristica ..."
                                        />
                                        <label htmlFor="descripcion" 
                                            className="lbls-input active">
                                            Descripcion
                                        </label>
                                    </div>

                                </div>


                                <div className="form-group-content" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px',
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btns btns-primary">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btns btns-danger">
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
                    title='Editar producto caracteristica'
                    visible={this.state.visibleEditarModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={450}
                >
                    <div>
                        <div className="forms-groups"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitEditar.bind(this)} encType="multipart/form-data">
                                
                                <div className="cols-lg-8 cols-md-8 cols-sm-12 cols-xs-12">
                                    <div className="input-group-content">
                                        <input type="text" 
                                            value={this.state.caracteristica}
                                            ref={function(input) {if (input != null) input.focus();}}
                                            onChange={this.onChangeCaracteristica.bind(this)}
                                            className="forms-control"
                                            placeholder="Ingresar caracteristica ..."
                                        />
                                        <label htmlFor="descripcion" 
                                            className="lbls-input active">
                                            Descripcion
                                        </label>
                                    </div>
                                </div>

                                <div className="forms-groups" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btns btns-primary">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btns btns-danger">
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
                    title='Eliminar producto caracteristica'
                    visible={this.state.visibleDeleteModal}
                    onOk={this.handleCerrar.bind(this)}
                    onCancel={this.handleCerrar.bind(this)}
                    footer={null}
                    width={400}
                >
                    <div>
                        <div className="forms-groups"
                            style={{'display': (this.state.loadModal)?'none':'block'}}>
                            
                            <form onSubmit={this.onSubmitEliminar.bind(this)} encType="multipart/form-data">
                                
                                <div className="text-center-content"
                                    style={{'marginTop': '-15px'}}>
                                    
                                    <label className='label-group-content'>
                                        Estas seguro de eliminar?
                                    </label>
                                
                                </div>

                                <div className="forms-groups" 
                                    style={{
                                        'borderTop': '1px solid #e8e8e8',
                                        'marginBottom': '-20px'
                                    }}>
        
                                    <div className="pull-right-content"
                                            style={{'marginRight': '-10px'}}>
                                        <button type="submit" 
                                            className="btns btns-primary">
                                                Aceptar
                                        </button>
                                    </div>
                                    <div className="pull-right-content">
                                        <button type="button" onClick={this.handleCerrar.bind(this)}
                                            className="btns btns-danger">
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
        /*
        const formData = new FormData();
        formData.append('id', this.state.idproduccaracteristica);
        */
        this.setState({
            loadModal: true,
        });

        httpRequest('post', '/commerce/api/producto_caracteristica/anular', {
            id: this.state.idproduccaracteristica
        })
        .then(result => {          
                if (result.response === 1) {
                    this.getData(1, '', 10);
                    this.handleCerrar();
                    message.success('eliminado exitosamente');
                } else if (result.response === 0) {
                        this.handleCerrar();
                        message.warning('No se pudo eliminar por que esta asignado a producto');
                } else if(result.response == -2) {
                    this.setState({ noSesion: true })
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
        if (this.state.caracteristica.toString().trim().length > 0) {
            /*
            const formData = new FormData();
            formData.append('id', this.state.idproduccaracteristica);
            formData.append('descripcion', this.state.caracteristica);
            */
            let body = {
                id: this.state.idproduccaracteristica,
                descripcion: this.state.caracteristica
            };

            this.setState({
                loadModal: true,
            });

            httpRequest('post', '/commerce/api/producto_caracteristica/update', body)
            .then(result => {          
                if (result.response === 1) {

                    this.getData(1, '', 10);
                    this.handleCerrar();
                    message.success('actualizacion exitosamente');

                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            })
            .catch(
                error => {
                    console.log(error);
                }
            );

        }else {

            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion,
                caracteristica: '',
            });

            message.error('No se permite campo vacio');

        }
    }

    onSubmitCrear(e) {

        e.preventDefault();

        if (this.state.caracteristica.toString().trim().length > 0) {
            /*
            const formData = new FormData();
            formData.append('descripcion', this.state.caracteristica);
            */
            this.setState({
                loadModal: true,
            });

            httpRequest('post', '/commerce/api/producto_caracteristica/post', {
                descripcion: this.state.caracteristica
            })
            .then(result => {  
                    if (result.response === 1) {

                        this.getData(1, '', 10);
                        this.handleCerrar();
                        message.success('datos guardados exitosamente');

                    } else if (result.response == -2) {
                        this.setState({ noSesion: true });
                    } else {
                        console.log(result);
                    }
                }).catch(
                    error => {
                        console.log(error);
                    }
                );
    

        }else {
            this.state.validacion[0] = 0;
            this.setState({
                validacion: this.state.validacion,
                caracteristica: '',
            });
            message.error('No se permite campo vacio');
        }
    }

    abrirModal(objeto) {
        if (objeto.bandera === 1) {
            this.setState({
                idproduccaracteristica: objeto.id,
                tecla: 1,
                bandera: objeto.bandera,
                caracteristica: objeto.nombre,
                visibleCrearModal: !this.state.visibleCrearModal,
            });
        }else {
            if (objeto.bandera === 2) {
                this.setState({
                    bandera: objeto.bandera,
                    idproduccaracteristica: objeto.id,
                    tecla: 1,
                    caracteristica: objeto.nombre,
                    visibleEditarModal: !this.state.visibleEditarModal,
                });
            }else {
                this.setState({
                    bandera: objeto.bandera,
                    idproduccaracteristica: objeto.id,
                    tecla: 1,
                    caracteristica: objeto.nombre,
                    visibleDeleteModal: !this.state.visibleDeleteModal,
                });
            }
        }
        
    }

    cerrarModal(){
        this.setState({
            idproduccaracteristica: 0,
            tecla: 0,
            bandera: 0,
            caracteristica: '',
        });
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
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
                            <h1 className="lbls-title">Gestionar Producto Caracteristica</h1>
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
                                        <th>Caracteristica</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.data.map(
                                        (resultado, key) => {
                                            let obj1 = {
                                                bandera: 2, 
                                                id : resultado.idproduccaracteristica, 
                                                nombre: resultado.caracteristica, 
                                            };
                                            let obj2 = {
                                                bandera: 3, 
                                                id : resultado.idproduccaracteristica, 
                                                nombre: resultado.caracteristica,
                                            };
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{resultado.caracteristica}</td>
                                                    
                                                    <td>
                                                        { this.btnEditar(obj1) }

                                                        { this.btnEliminar(obj2) }
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