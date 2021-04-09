import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal,Card, message } from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import { cambiarFormato } from '../../../tools/toolsDate';

import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';

const CANTIDAD_LISTA_PRECIOS = 10;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexListaPrecio extends Component {

    constructor(){
        super();
        this.state = {
            listaPrecios: [],
            listaPrecio: {},
            listaProductos: [],
            pagination: {},
            visibleModalVer: false,
            noSesion: false,
        }

        this.permisions ={
            btn_ver: readPermisions(keys.lista_precio_btn_ver),
            btn_nuevo: readPermisions(keys.lista_precio_btn_nuevo),
            btn_editar: readPermisions(keys.lista_precio_btn_editar),
            btn_eliminar: readPermisions(keys.lista_precio_btn_eliminar),
            column_pre_mod: readPermisions(keys.lista_precio_tabla_columna_precioModificar)
        }

        this.onChangePage = this.onChangePage.bind(this);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-success"
                    onClick={() => this.showListaPrecio(data) }
                    >
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  
                    to={"/commerce/admin/lista-precios/edit/" + data}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(this, data)}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <Link to="/commerce/admin/lista-precios/create" className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </Link>
                </div>
            );
        }
        return null;
    }
    

    componentDidMount() {
        this.getListaPrecios(CANTIDAD_LISTA_PRECIOS);
    }
    
    getListaPrecios(cantidad) {

        httpRequest('get', ws.wslistaprecios + '/' + cantidad)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    listaPrecios: result.data,
                    pagination: result.pagination
                });
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

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    deleteLista(idlista) {

        let data = this.state.listaPrecios;
        let length = data.length;
        let array = [];
        for (let i = 0; i < length; i++) {
            if (data[i].idlistaprecio !== idlista) {
                array.push(data[i]);
            }
        }
        this.setState({
            listaPrecios: array
        });
    }

    deleteListaPrecio(listaprecio) {
        httpRequest('delete', ws.wslistaprecio + '/' + listaprecio.idlistaprecio)
        .then((result) => {
            if (result.response == 1) {
                console.log('Se elimino correctamente');
                this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
            
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        })
    }

    showDeleteConfirm(thisContex,item) {
        console.log(item);
        Modal.confirm({
            title: 'Elimiar Lista de Precio',
            content: '¿Estas seguro de eliminar la lista Precio?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                thisContex.deleteListaPrecio(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showListaPrecio(listaprecio) {
        
        httpRequest('get', ws.wslistaprecio + '/' + listaprecio.idlistaprecio)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    listaPrecio: result.listaprecio,
                    listaProductos: result.listaproductos,
                    visibleModalVer: true
                });
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

    onChangePage(page, pageSize) {
        
        httpRequest('get', ws.wslistaprecio + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    listaPrecios: result.data,
                    pagination: result.pagination
                });
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

    componentBodyModalVer() {
        let moneda = this.state.listaPrecio.moneda == undefined ? 'sin moneda' : this.state.listaPrecio.moneda;
        let accion = this.state.listaPrecio.accion == 'D' ? 'Decremento' : 'Incremento';
        let estado = this.state.listaPrecio.estado == 'A' ? 'Activo' : 'No Activo';
        let fijoporcentaje = this.state.listaPrecio.fijoporcentaje == 'F' ? 'Fijo' : 'Porcentaje';
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    
                    
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">
                            <Input
                                title="Descripcion"
                                value={this.state.listaPrecio.descripcion}
                                readOnly={true}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Moneda"
                                value={moneda.descripcion}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Valor"
                                value={this.state.listaPrecio.valor}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fijo/Porcent"
                                value={fijoporcentaje}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Accion"
                                value={accion}
                                readOnly={true}
                            />
                        </div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Estado"
                                value={estado}
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-3 cols-md-3"></div>
                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha Inicio"
                                value={this.state.listaPrecio.fechainicio}
                                readOnly={true}
                            />
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha Fin"
                                value={this.state.listaPrecio.fechafin}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={this.state.listaPrecio.notas == null ? '' : this.state.listaPrecio.notas}
                            />
                        </div>
                    </div>
                </div>

                <div  className="forms-groups cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                    <div 
                        className="table-detalle" 
                        style={{ 
                            width: '80%',
                            marginLeft: '10%',
                            overflow: 'auto'
                        }}>
                        <table className="table-response-detalle">
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th>Id Producto</th>
                                    <th>Descripcion</th>
                                    <th>Precio Orig</th>
                                    { this.permisions.column_pre_mod.visible == 'A' ? <th>Precio Modif</th> : null }
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    this.state.listaProductos.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{item.idproducto}</td>
                                                <td>{item.descripcion}</td>
                                                <td>{item.precio}</td>
                                                { this.permisions.column_pre_mod.visible == 'A' ? <td>{item.preciomod}</td> : null }
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>  
                </div>
            </div>
        );
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }

        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">

                <Modal
                    title="Detalle de la Lista de Precio"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    style={{'top': '10px'}}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,
                        overflow: 'auto'  
                    }}
                >
                    { componentBodyModalVer }
                </Modal>

                <div className="cards">

                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Lista de Precio</h1>
                        </div>
                        { btnNuevo }
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <div className="inputs-groups">
                                <select className="forms-control">
                                
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
                                        className="forms-control w-75-content"  
                                        placeholder=" buscar ..."/>
                                        <h3 className="lbls-input active"> Buscar </h3>
                                <i className="fa fa-search fa-content" style={{'top': '3px'}} > 
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
                                        <th>Descripcion</th>
                                        <th>Valor</th>
                                        <th>Fijo/Porc</th>
                                        <th>Incre/Desc</th>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.listaPrecios.map(
                                        (resultado, key) => (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{resultado.descripcion}</td>
                                                <td>{resultado.valor}</td>
                                                <td>{(resultado.fijoporcentaje == 'F') ? 'Fijo' : 'Porcentaje'}</td>
                                                <td>{(resultado.accion == 'D') ? 'Descuento' : 'Incremento'}</td>
                                                <td>{cambiarFormato(resultado.fechainicio)}</td>
                                                <td>{cambiarFormato(resultado.fechafin)}</td>
                                                <td>

                                                    { this.btnVer(resultado) }

                                                    { this.btnEditar(resultado.idlistaprecio) }

                                                    { this.btnEliminar(resultado) }
                                            
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="forms-groups">

                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1}
                                onChange={this.onChangePage}
                                total={this.state.pagination.total} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
