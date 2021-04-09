import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal,Card, message } from 'antd';
import { wssalidaproducto } from '../../../WS/webservices';

const URL_DELETE_LISTA_PRECIO = '/commerce/api/listaprecio/';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexSalidaPro extends Component {

    constructor(){
        super();
        this.state = {
            salidaproductos: [],
            listaproductos: [],
            salidaproducto: {},
            visibleModalVer: false
        }

        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        this.getSalidasProductos();
    }
    
    getSalidasProductos() {
        axios.get(wssalidaproducto)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT SALIDAS ', result);
            
            if (result.response > 0) {
                this.setState({
                    salidaproductos: result.data
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


    deleteSalidaProducto(id) {
        axios.delete(wssalidaproducto + '/' + id)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                //this.deleteLista(listaprecio.idlistaprecio);
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

    showDeleteConfirm(thisContex, id) {
        Modal.confirm({
            title: 'Elimiar Salida Producto',
            content: '¿Estas seguro de eliminar la salida de prodcuto?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                thisContex.deleteSalidaProducto(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showSalidaProd(id) {
        
        axios.get(wssalidaproducto + '/' + id)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT ', result);
            if (result.response > 0) {
                this.setState({
                    salidaproducto: result.salidaprod,
                    visibleModalVer: true,
                    listaproductos: result.data
                });
            } else {
                
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentBodyModalVer() {
        let tipo = this.state.salidaproducto.tipo == undefined ? '' : this.state.salidaproducto.tipo.descripcion;
        return (
            <div className="col-lg-12-content">

                <div className="form-group-content col-lg-12-content">

                    <div className="col-lg-4-content">
                        <div className="col-lg-4-content">
                            <label className="label-content-modal">
                                Codigo:
                            </label>
                        </div>
                        <div className="col-lg-8-content">
                            <label className="label-group-content">
                                {this.state.salidaproducto.codsalidaprod}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-4-content">
                        <div className="col-lg-4-content">
                            <label className="label-content-modal">
                                tipo:
                            </label>
                        </div>
                        <div className="col-lg-8-content">
                            <label className="label-group-content">
                            {tipo}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-4-content">
                        <div className="col-lg-6-content">
                            <label className="label-content-modal">
                                Fecha-Hora:
                            </label>
                        </div>
                        <div className="col-lg-6-content">
                            <label className="label-group-content">
                                {this.state.salidaproducto.fechahora}
                            </label>
                        </div>
                    </div>

                    <div className="col-lg-8-content">
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Notas:
                            </label>
                        </div>
                        <div className="col-lg-10-content">
                            <label className="label-group-content">
                                {this.state.salidaproducto.notas}
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
                                Almacen
                            </label>
                        </div>
                        <div className="col-lg-2-content">
                            <label className="label-content-modal">
                                Cantidad
                            </label>
                        </div>
                    </div>
                    
                    <div className="caja-caracteristica-view-content col-lg-12-content">
                       {
                           this.state.listaproductos.map((item, key) => (
                            <div 
                                key={key}
                                className="col-lg-12-content"
                                style={{ marginTop: -5, marginBottom: -5}}
                            >
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
                                    <label>{item.almacen}</label>
                                </div>
                                <div className="col-lg-2-content">
                                    <label>{item.cantidad}</label>
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
                        title="Detalle Salida Producto"
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
                                <h1 className="title-logo-content"> Lista de Salidas de Productos </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/salidaprod/create" className="btn btn-primary-content">
                                    <i className="fa fa-plus"> Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <select className="form-control-sm-content" id="card-search">
                                    <option value="1"> 10 </option>
                                    <option value="2"> 25 </option>
                                    <option value="3"> 50 </option>
                                    <option value="4"> 100 </option>
                                </select>
                                <h3 className="title-lg-content"> Mostrar </h3>
                            </div>
                            <div className="pull-right-content">
                                <input type="text" className="form-control-md-content" id="input-search" placeholder=" Buscar ..."/>
                                <i className="fa fa-search input-fa"> </i>
                            </div>
                        </div>

                        <div className="table-content">
                            <table className="table-responsive-content">
                                <thead>
                                <tr className="row-header">
                                    <th>Nro</th>
                                    <th>Codigo</th>
                                    <th>Fecha-Hora</th>
                                    <th>Tipo</th>
                                    <th>Accion</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.salidaproductos.map((item,key) => {
                                        let tipo = item.tipo == undefined ? '' : item.tipo.descripcion;
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">#: </label>{key + 1}</td>
                                                <td><label className="col-show">Cod: </label>{item.codsalidaprod}</td>
                                                <td><label className="col-show">Fecha-h: </label>{item.fechahora}</td>
                                                <td><label className="col-show">Tipo: </label>{tipo}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <a className="btn-content btn-success-content"
                                                        onClick={() => this.showSalidaProd(item.idsalidaproducto) }
                                                        >
                                                        <i className="fa fa-eye"> </i>
                                                    </a>
                                                    <Link  
                                                        to={"/commerce/admin/salidaprod/edit/" + item.idsalidaproducto}
                                                        className="btn-content btn-primary-content" 
                                                        aria-label="editar">
                                                        <i className="fa fa-edit"> </i>
                                                    </Link>
                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        onClick={() => this.showDeleteConfirm(this,item.idsalidaproducto)}
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
