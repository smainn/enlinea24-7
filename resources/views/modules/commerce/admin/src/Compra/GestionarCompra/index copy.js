import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider } from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import { readPermisions } from '../../../tools/toolsPermisions';
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
            },
            noSesion: false,
            configCodigo: false
        }

        this.permisions = {
            btn_ver: readPermisions(keys.compra_btn_ver),
            btn_nuevo: readPermisions(keys.compra_btn_nuevo),
            btn_eliminar: readPermisions(keys.compra_btn_eliminar)
        }

        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.closeModalVer = this.closeModalVer.bind(this);
        this.deleteCompra = this.deleteCompra.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    btnVer(idcompra) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <Link  to={"/commerce/admin/compra/show/" + idcompra}
                    className="btns btns-sm btns-outline-success"
                    aria-label="editar">
                    <i className="fa fa-eye"> </i>
                </Link>
            );
        }
        return null;
    }

    btnNuevo() {
        /*}
                <div className="pulls-right">
                    <Link to="/commerce/admin/compra/create" className="btns btns-primary">
                        Nuevo
                    </Link>
                </div>
            */
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                
                <div className="pulls-right">
                    <Link to="/commerce/admin/compra/create" className="btns btns-primary">
                        <i className="fa fa-plus-circle"></i>
                        &nbsp;Nuevo
                    </Link>
                </div>
            );
        }
        return null;
    }

    btnEliminar(idcompra) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(idcompra)}
                    >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }
    

    componentDidMount() {
        this.getConfigsClient();
        this.getCompras();
    }

    getConfigsClient() {
        
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    getCompras() {

        httpRequest('get', ws.wscompra)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    compras: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
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
        httpRequest('delete', ws.wscompra + '/' + idcompra)
        .then((result) => {
            if (result.response == 1) {
                message.success(result.message);
                this.setState({
                    compras: result.compras,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
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
        
        httpRequest('get', ws.wscompra + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    compras: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
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

                <div className="cards">
                    
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Compra</h1>
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
                                <i className="fa fa-search fa-content" style={{'top': '3px'}}> 
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
                                        <th>Nombre</th>
                                        <th>Tipo Pago</th>
                                        <th>Sucursal</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.compras.map(
                                        (item, key) => {
                                            let apellido = item.proveedor.apellido == null ? '' : item.proveedor.apellido;
                                            let codigo = item.idcompra;
                                            if (this.state.configCodigo) {
                                                codigo = item.codcompra == null ? '' : item.codcompra;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo}</td>
                                                    <td>{item.proveedor.nombre + ' ' + apellido}</td>
                                                    <td>{(item.tipo == 'R') ? 'Credito' : 'Contado'}</td>
                                                    <td>{(item.sucursal == undefined) ? '' : item.sucursal.nombre}</td>
                                                    <td>
                                                        { this.btnVer(item.idcompra) }
                                                        
                                                        {
                                                        /**
                                                         <Link  to={"/commerce/admin/compra/edit/" + item.idcompra}
                                                            className="btn-content btn-primary-content" 
                                                            aria-label="editar">
                                                            <i className="fa fa-edit"> </i>
                                                        </Link>
                                                            */
                                                        }
                                                        { this.btnEliminar(item.idcompra) }
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        }
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
