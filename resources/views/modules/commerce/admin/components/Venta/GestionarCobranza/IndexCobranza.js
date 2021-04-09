import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

import { wscobranza } from '../../../WS/webservices';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexCobranza extends Component {

    constructor(){
        super();
        this.state = {
            cobros: [],
            pagination: {},
            
        }

        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        
        this.getCobros();
        
    }
    
    getCobros() {

        axios.get(wscobranza)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    cobros: result.data
                });
            }
        })
        .catch((error) => {
            console.log(error);
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
                //thisContex.deleteVendedor(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentBodyModalVer() {
        
    }

    closeModalVer() {

    }

    visibleModalVer() {

    }

    render() {

        const componentBodyModalVer = this.componentBodyModalVer();
        
        return (

                <div>
                        <Modal
                            title="Datos del Cobro"
                            visible={this.state.visibleModalVer}
                            onOk={this.closeModalVer.bind(this)}
                            //footer={}
                            onCancel={this.closeModalVer.bind(this)}
                            width={WIDTH_WINDOW * 0.7}
                            bodyStyle={{
                                height: HEIGHT_WINDOW,  
                            }}
                        >

                            { componentBodyModalVer }

                        </Modal>
                        
                    <div className="row-content">
                        <div className="card-body-content">
                            <div className="pull-left-content">
                                <h1 className="title-logo-content"> Gestion de Cobranza </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/cobranza/create" className="btn btn-primary-content">
                                    <i> Nuevo </i>
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
                                    <th>Codigo</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Notas</th>
                                    <th>Operaciones</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.cobros.map((item,key) => {
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">Nro: </label>{key + 1}</td>
                                                <td><label className="col-show">Codigo: </label>{item.codcobro}</td>
                                                <td><label className="col-show">Fecha: </label>{item.fecha}</td>
                                                <td><label className="col-show">Hora: </label>{item.hora}</td>
                                                <td><label className="col-show">Notas: </label>{item.nota}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <a 
                                                        className="btn-content btn-success-content"
                                                        //onClick={() => this.showVendedor(item)}
                                                        >
                                                        <i className="fa fa-eye"> </i>
                                                    </a>

                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        //onClick={() => this.showDeleteConfirm(this,item)}
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
