import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal,Card, message } from 'antd';

const URL_GET_LISTA_PRECIOS = '/commerce/api/listaprecio';
const URL_SHOW_LISTA_PRECIO = '/commerce/api/listaprecio/';
const URL_DELETE_LISTA_PRECIO = '/commerce/api/listaprecio/';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexListaPrecio extends Component {

    constructor(){
        super();
        this.state = {
            listaPrecios: [],
            listaPrecio: {},
            listaProductos: [],
            visibleModalVer: false
        }

        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        
        this.getListaPrecios();
        
    }
    
    getListaPrecios() {
        axios.get(URL_GET_LISTA_PRECIOS)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    listaPrecios: result.data
                });
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
        let URL_DELETE = URL_DELETE_LISTA_PRECIO + listaprecio.idlistaprecio;
        axios.delete(URL_DELETE)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
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
            title: 'Elimiar Vendedor',
            content: '¿Estas seguro de eliminar al Vendedor?',
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
        
        const URL_SHOW_LITA = URL_SHOW_LISTA_PRECIO + listaprecio.idlistaprecio;
        axios.get(URL_SHOW_LITA)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT ', result);
            if (result.response > 0) {
                this.setState({
                    listaPrecio: result.listaprecio,
                    listaProductos: result.listaproductos,
                    visibleModalVer: true
                });
            } else {

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
            <div className="col-lg-12-content">

                <div className="col-lg-12-content">
                    
                    <div className="col-lg-12-content">
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Descripcion:
                            </label>
                        </div>
                        <div className="col-lg-10-content">
                            <label className="label-group-content">
                                {this.state.listaPrecio.descripcion}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Valor:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {this.state.listaPrecio.valor}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Accion:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {accion}
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Fijo/Porcent:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {fijoporcentaje}
                            </label>
                        </div>
                    </div>
                    
                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Fecha Inicio:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {this.state.listaPrecio.fechainicio}
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Fecha Fin:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {this.state.listaPrecio.fechafin}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Moneda:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {moneda.descripcion}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-8-content">
                        <div className="col-lg-3-content">
                            <label className="label-content-modal">
                                Notas:
                            </label>
                        </div>
                        <div className="col-lg-9-content">
                            <label className="label-group-content">
                                {this.state.listaPrecio.notas}
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Estado:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {estado}
                            </label>
                        </div>
                    </div>
                </div>

                <div 
                    className="form-group-content col-lg-9-content"
                    style={{marginLeft: 100 }}
                >

                    <div className="form-group-content col-lg-12-content">
                        <div className="col-lg-1-content">
                            <label className="label-content-modal">
                                Nro
                            </label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Id Producto
                            </label>
                        </div>
                        <div className="col-lg-5-content">
                            <label className="label-content-modal">
                                Descripcion
                            </label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Precio Orig
                            </label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Precio Modif
                            </label>
                        </div>
                    </div>
                    
                    <div className="caja-caracteristica-view-content col-lg-12-content">
                        {
                            this.state.listaProductos.map((item, key) => (
                                <div key={key} className="col-lg-12-content border-table">
                                    <div className="col-lg-1-content">
                                        <label>{key + 1}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.idproducto}</label>
                                    </div>
                                    <div className="col-lg-5-content">
                                        <label>{item.descripcion}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.precio}</label>
                                    </div>
                                    <div className="col-lg-2-content">
                                        <label>{item.preciomod}</label>
                                    </div>
                                </div>
                                
                            ))
                        }
                    </div>
                </div>
        
            </div>
        );
    }

    render() {

        const componentBodyModalVer = this.componentBodyModalVer();
        
        return (
                <div>
                    <Modal
                        title="Detalle de la Lista de Precio"
                        visible={this.state.visibleModalVer}
                        onOk={this.closeModalVer.bind(this)}
                        onCancel={this.closeModalVer.bind(this)}
                        width={WIDTH_WINDOW * 0.7}
                        bodyStyle={{
                            height: HEIGHT_WINDOW * 0.7,  
                        }}
                    >

                        { componentBodyModalVer }

                    </Modal>
                        
                    <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Lista de Precios </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/listaprecio/createListaPrecio" className="btn btn-primary-content">
                                    <i > Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <div className="input-group-content">
                                    <select className="form-control-content w-25-content" id="card-search">
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
                                    <input type="text" className="form-control-content w-75-content" placeholder=" Buscar ..."/>
                                    <i className="fa fa-search fa-content"> </i>
                                </div>
                            </div>
                        </div>

                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>Nro</th>
                                    <th>Descripcion</th>
                                    <th>Valor</th>
                                    <th>Fijo/Porcentaje</th>
                                    <th>Incre/Desc</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Accion</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.listaPrecios.map((item,key) => {
                                        let fijoporcentaje = item.fijoporcentaje == 'F' ? 'Fijo' : 'Porcentaje';
                                        let accion = item.accion == 'D' ? 'Descuento' : 'Incremento';
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">#: </label>{key + 1}</td>
                                                <td><label className="col-show">Descripcion: </label>{item.descripcion}</td>
                                                <td><label className="col-show">Valor: </label>{item.valor}</td>
                                                <td><label className="col-show">Fijo/Porcen: </label>{fijoporcentaje}</td>
                                                <td><label className="col-show">Incre/Desc: </label>{accion}</td>
                                                <td><label className="col-show">Fecha I: </label>{item.fechainicio}</td>
                                                <td><label className="col-show">Fecha Fin: </label>{item.fechafin}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <a 
                                                        className="btn-content btn-success-content"
                                                        onClick={() => this.showListaPrecio(item) }
                                                        >
                                                        <i className="fa fa-eye"> </i>
                                                    </a>

                                                    <Link  
                                                        to={"/commerce/admin/listaprecio/editListaPrecio/" + item.idlistaprecio}
                                                        className="btn-content btn-primary-content" 
                                                        aria-label="editar">
                                                        <i className="fa fa-edit"> </i>
                                                    </Link>

                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        onClick={() => this.showDeleteConfirm(this,item)}
                                                        >
                                                        <i className="fa fa-trash"> 
                                                        </i>
                                                    </a>
                                            
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>

                            </table>
                        </div>

                        <div className="text-center-content">
                            <Pagination 
                                defaultCurrent={1} 
                                total={50} />
                        </div>
                    </div>
                </div>
        );
    }
}
