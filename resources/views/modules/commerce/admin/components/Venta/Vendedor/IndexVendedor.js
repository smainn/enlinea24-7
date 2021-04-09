import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';

const URL_GET_VENDEDORES = '/commerce/api/vendedor';
const URL_SHOW_VENDEDOR = '/commerce/api/vendedor/';
const URL_DELETE_VENDEDOR = '/commerce/api/vendedor/';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

const DATA = ["component1", "component2"];

export default class IndexVendedor extends Component {

    constructor(){
        super();
        this.state = {
            vendedores: [],
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

        //showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }


    

    componentDidMount() {
        
        this.obtenerVendedores();
        
    }
    
    obtenerVendedores() {

        axios.get(URL_GET_VENDEDORES)
        .then((resp) => {
            let result = resp.data;
            if (result.response > 0) {
                this.setState({
                    vendedores: result.data
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

    deleteVendedor(vendedor) {
        let URL_DELETE = URL_DELETE_VENDEDOR + vendedor.idvendedor;
        axios.delete(URL_DELETE)
        .then((resp) => {
            console.log(resp.data);
            let result = resp.data;
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                this.deleteVendLista(vendedor.idvendedor);
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
                thisContex.deleteVendedor(item);
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
        
        let componentImg = this.componentImg();
        let componentRecursive = this.componentRecursive();

        let estado = this.state.vendedor.estado == 'A' ? 'Activo' : 'No Activo';
        let sexo = 'Ninguno';
        if (this.state.vendedor.sexo == 'M') {
            sexo = 'Masculino';
        } else if (this.state.sexo == 'F') {
            sexo = 'Femenino';
        }
        let comisionventa = '';
        if (this.state.vendedor.comisionventa != undefined) {
            comisionventa = this.state.vendedor.comisionventa.descripcion;
        }
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
                                    {this.state.vendedor.codvendedor}
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
                                    {estado}
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
                                    {this.state.vendedor.nombre + " " + this.state.vendedor.apellido}
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
                                    {this.state.vendedor.nit}
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
                                    {sexo}
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
                                {this.state.vendedor.fechanac}
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
                                    {comisionventa}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group-content col-lg-4-content">
                        <div className="card-caracteristica">
                            <div className="caja-img caja-altura">
                                { componentImg }
                            </div>
                        </div>
                    </div>

                </div>

                <div className="form-group-content col-lg-12-content">
                    <div className="form-group-content col-lg-12-content">
                        <Divider orientation="left">Detalles del Vendedor</Divider>
                    </div>
                    <div className="form-group-content col-lg-8-content">
                        <div className="form-group-content col-lg-6-content">
                            <label className="label-content-modal">Referencia</label>
                        </div>
                        <div className="form-group-content col-lg-6-content">
                            <label className="label-content-modal">Contacto</label>
                        </div>
                        
                        <div className="caja-caracteristica-view-content col-lg-12-content">
                            {
                                this.state.referencias.map((item, key) => (
                                    <div key={key} className="col-lg-12-content">
                                        <div className="col-lg-6-content">
                                            <label>{item.referencia}</label>
                                        </div>

                                        <div className="col-lg-6-content">
                                            <label>{item.dato}</label>
                                        </div>
                                    </div>
                                
                                ))
                            }
                        </div>
                    </div>
                    <div className="form-group-content col-lg-4-content">
                        <div className="form-group-content col-lg-12-content">
                            <label className="label-content-modal">
                                Notas:
                            </label>
                            <label className="label-group-content">
                                {this.state.vendedor.notas}
                            </label>
                        </div>
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
                            title="Datos del Vendedor"
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
                                <h1 className="title-logo-content"> Listado de Vendedor </h1>
                            </div>
                            <div className="pull-right-content">
                                <Link to="/commerce/admin/vendedor/createVendedor" className="btn btn-primary-content">
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
                                    <th>Nombre</th>
                                    <th>Ci/Nit</th>
                                    <th>Comision</th>
                                    <th>Operaciones</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    this.state.vendedores.map((item,key) => {
                                        let sexo = "Ninguno";
                                        if (item.sexo == "M") {
                                            sexo = "Masculino";
                                        } else if(item.sexo == "F") {
                                            sexo = "Femenino";
                                        }
                                        let estado = item.estado == "A" ? "Activo" : "No Activo";
                                        return (
                                            <tr key={key}>
                                                <td><label className="col-show">Nro: </label>{key + 1}</td>
                                                <td><label className="col-show">Codigo: </label>{item.codvendedor}</td>
                                                <td><label className="col-show">Nombre: </label>{item.nombre + " " + item.apellido}</td>
                                                <td><label className="col-show">Ci: </label>{item.nit}</td>
                                                <td><label className="col-show">Comision: </label>{item.comisionventa.descripcion}</td>
                                                <td><label className="col-show">Opcion: </label>
                                                    
                                                    <a 
                                                        className="btn-content btn-success-content"
                                                        onClick={() => this.showVendedor(item)}
                                                        >
                                                        <i className="fa fa-eye"> </i>
                                                    </a>

                                                    <Link  to={"/commerce/admin/vendedor/editVendedor/" + item.idvendedor}
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
