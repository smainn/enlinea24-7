import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';
import { wscompra } from '../../../WS/webservices';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 


export default class IndexCompra extends Component {

    constructor(){
        super();
        this.state = {
            compras: [],
            pagination: {},
            visibleModalVer: false,
            visibleModalEli: false,

            almacenes: [],
            codigos: [],
            caracteristicas: [],
            fotos: [],
            referencias: [],
            vendedor: {
                codvendedor: '',
                nombre: '',
                apellido: '',
                nit: '',
                sexo: '',
                estado: '',
                fechanac: '',
                notas: '',
                idcomision: 0
            }
        }

        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.closeModalVer = this.closeModalVer.bind(this);
        this.deleteCompra = this.deleteCompra.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }


    

    componentDidMount() {
        this.getCompras();
    }
    
    getCompras() {

        axios.get(wscompra)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                console.log('COMPRAS ', result.data);
                this.setState({
                    compras: result.data,
                    pagination: result.pagination
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

    deleteVendLista(idvendedor) {

        let data = this.state.vendedores;
        let length = data.length;
        let dataNew = [];
        for (let i = 0; i < length; i++) {
            if (data[i].idvendedor !== idvendedor) {
                dataNew.push(data[i]);
            }
        }
        this.setState({
            vendedores: dataNew
        });
    }

    deleteCompra(idcompra) {
        axios.delete(wscompra + '/' + idcompra)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                message.success(result.message);
                this.setState({
                    compras: result.compras,
                    pagination: result.pagination
                });
            } else {
                message.error(result.message);
            }
            
        })
        .catch((error) => {
            console.log(error);
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        })
    }

    showDeleteConfirm(idcompra) {
        const deleteCompra = this.deleteCompra;
        Modal.confirm({
            title: 'Elimiar Compra',
            content: '¿Estas seguro de eliminar la Compra?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                deleteCompra(idcompra);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showVendedor(vendedor) {
        
        const URL_SHOW_VEN = URL_SHOW_VENDEDOR + vendedor.idvendedor;
        axios.get(URL_SHOW_VEN)
        .then((resp) => {
            let result = resp.data;
            console.log('RESULT ', result);
            if (result.response > 0) {
                this.setState({
                    vendedor: result.vendedor,
                    referencias: result.referencias,
                    visibleModalVer: true
                });
            } else {

            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentImg() {
        
        if (this.state.vendedor.foto == '' || this.state.vendedor.foto == null) {
            return (
                <img 
                    src='/images/default.jpg'
                    alt="none" className="img-principal" />
            )
            
        } else {
            return (
                <img 
                    src={this.state.vendedor.foto}
                    alt="none" className="img-principal" />
            )
        }
    }

    componentRecursive() {
        
    }

    componentBodyModalVer() {
        
        return (
            <div className="col-lg-12-content">
                <div className="form-group-content col-lg-12-content">
                    <div className="form-group-content col-lg-8-content">

                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Codigo:
                                </label>
                            </div>

                            <div className="col-lg-6-content">
                                <label className="label-align-start">
                                    {'this.state.vendedor.codvendedor'}
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Estado:
                                </label>
                            </div>
                            <div className="col-lg-6-content">
                                <label className="label-align-start">
                                    {'estado'}
                                </label>
                            </div>
                        </div>

                        <div className="col-lg-12-content">
                            <div className="col-lg-3-content">
                                <label className="label-content-modal">
                                    Nombre:
                                </label>
                            </div>
                            <div className="col-lg-9-content">
                                <label className="label-align-start">
                                    {'this.state.vendedor.nombre + " " + this.state.vendedor.apellido'}
                                </label>
                            </div>
                        </div>
                        
                       

                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Ci:
                                </label>
                            </div>
                            <div className="col-lg-6-content">
                                <label className="label-align-start">
                                    {'this.state.vendedor.nit'}
                                </label>
                            </div>
                        </div>

                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Sexo:
                                </label>
                            </div>
                            <div className="col-lg-6-content">
                                <label className="label-align-start">
                                    {'sexo'}
                                </label>
                            </div>
                        </div>

                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Fecha Nac:
                                </label>
                            </div>
                            <div className="col-lg-6-content">
                            <label className="label-align-start">
                                {'this.state.vendedor.fechanac'}
                            </label>
                            </div>
                        </div>
                        
                        <div className="col-lg-6-content">
                            <div className="col-lg-6-content">
                                <label className="label-content-modal">
                                    Comision:
                                </label>
                            </div>
                            <div className="col-lg-6-content">
                                <label className="label-align-start">
                                    {'comisionventa'}
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    onChangePage(page, pageSize) {
        
        axios.get(wscompra + '?page=' + page)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    compras: result.data,
                    pagination: result.pagination
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {

        const componentBodyModalVer = this.componentBodyModalVer();
        
        return (

                <div>
                        <Modal
                            title="Datos de la Compra"
                            visible={this.state.visibleModalVer}
                            onOk={this.closeModalVer}
                            //footer={}
                            onCancel={this.closeModalVer}
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
                                <h1 className="title-logo-content"> Gestion de Compras </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/compra/create" className="btn btn-primary-content">
                                    <i> Nuevo </i>
                                </Link>
                            </div>

                        </div>
                        <div className="card-header-content">
                            <div className="pull-left-content">
                                <div className="input-group-content">
                                    <select className="form-control-content w-25-content" id="card-search">
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
                                    <th>Nombre</th>
                                    <th>Tipo Pago</th>
                                    <th>Sucursal</th>
                                    <th>Opcion</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.compras.map((item,key) => {
                                        console.log('ITEM ', item);
                                        let sucursal = item.sucursal == undefined ? '' : item.sucursal.nombre;
                                        let nombre = item.proveedor == undefined ? '' : item.proveedor.nombre;
                                        let apellido = item.proveedor == undefined ? '' : item.proveedor.apellido;
                                        let fullname = nombre + ' ' + apellido;
                                        let tipo = item.tipo == 'R' ? 'Credito' : 'Contado';
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">Nro: </label>{key + 1}</td>
                                                <td><label className="col-show">Codigo: </label>{item.codcompra}</td>
                                                <td><label className="col-show">Nombre: </label>{fullname}</td>
                                                <td><label className="col-show">Tipo: </label>{tipo}</td>
                                                <td><label className="col-show">Sucursal: </label>{sucursal}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <Link  to={"/commerce/admin/compra/show/" + item.idcompra}
                                                        className="btn-content btn-success-content"
                                                        aria-label="editar">
                                                        <i className="fa fa-eye"> </i>
                                                    </Link>
                                                    {
                                                    /**
                                                     <Link  to={"/commerce/admin/compra/edit/" + item.idcompra}
                                                        className="btn-content btn-primary-content" 
                                                        aria-label="editar">
                                                        <i className="fa fa-edit"> </i>
                                                    </Link>
                                                        */
                                                    }
                                                    <a 
                                                        className="btn-content btn-danger-content"
                                                        onClick={() => this.showDeleteConfirm(item.idcompra)}
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
                                onChange={this.onChangePage}
                                total={this.state.pagination.total} />
                        </div>
                    </div>
                </div>
        );
    }
}
