import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../tools/webservices';
import keys from '../../../tools/keys';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData, readData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keysStorage from '../../../tools/keysStorage';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import ShowVendedor from './show';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
const { Option } = Select;

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
            },
            noSesion: false,
            configCodigo: false,
            configTitleVendedor: ''
        }

        this.permisions = {
            btn_ver: readPermisions(keys.vendedor_btn_ver),
            btn_nuevo: readPermisions(keys.vendedor_btn_nuevo),
            btn_editar: readPermisions(keys.vendedor_btn_editar),
            btn_eliminar: readPermisions(keys.vendedor_btn_eliminar),
            codigo: readPermisions(keys.vendedor_input_codigo),
            comision: readPermisions(keys.vendedor_select_comision),
            nit: readPermisions(keys.vendedor_input_nit),
            fecha_nac: readPermisions(keys.vendedor_fechaNacimiento),
            nombre: readPermisions(keys.vendedor_input_nombre),
            apellido: readPermisions(keys.vendedor_input_apellido),
            genero: readPermisions(keys.vendedor_select_genero),
            caracteristicas: readPermisions(keys.vendedor_caracteristicas),
            imagen: readPermisions(keys.vendedor_imagenes),
            notas: readPermisions(keys.vendedor_textarea_nota)
        }

        this.onChangePage = this.onChangePage.bind(this);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-success"
                    onClick={() => this.showVendedor(data)}
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
                <Link  to={"/commerce/admin/vendedor/edit/" + data}
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
                    onClick={() => this.showDeleteConfirm(this,data)}
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
                    <Link to="/commerce/admin/vendedor/create" className="btns btns-primary">
                    <i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                    </Link>
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
        // this.obtenerVendedores();
        this.getVendedores();
    }

    getConfigsClient() {
        let isAbogado = readData(keysStorage.isabogado) == null ? 'V' : readData(keysStorage.isabogado);
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    configCodigo: result.data.codigospropios,
                    configTitleVendedor: isAbogado == 'A' ? 'Abogado' : 'Vendedor',
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getVendedores(){
        httpRequest('get', ws.wsvendedor)
        .then((resp) => {
            console.log(resp);
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosClientes = [];
                for (let i = 0; i < length; i++) {
                    datosClientes.push({
                        id: data[i].idcliente,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idcliente.toString() : data[i].codcliente,
                        nombre: data[i].nombre + ' ' + data[i].apellido,
                        tipo: data[i].tipopersoneria === 'J' ? 'Juridico' : 'Natural',
                    });
                }
                this.setState({
                    clientes: datosClientes,
                    clientesDefaults: datosClientes,
                    pagination: resp.pagination,
                    paginacionDefaults: resp.pagination,
                })
            } else if(resp.response == -2) {
                this.setState({ noSession: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    obtenerVendedores() {
        httpRequest('get', ws.wsvendedor)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vendedores: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
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
        httpRequest('delete', ws.wsvendedor + '/' + vendedor.idvendedor)
        .then((result) => {
            if (result.response == 1) {
                this.deleteVendLista(vendedor.idvendedor);
                message.success(result.message);
            } else if (result.response == -2) {
                this.setState({ noSesion: true})
            } else {
                message.error(result.message);
            }

        })
        .catch((error) => {
            message.error('Ocurrio un problema, por favor recargue la pagina o vuelva a intentarlo');
        })
    }

    showDeleteConfirm(thisContex,item) {
        Modal.confirm({
            title: 'Elimiar Vendedor',
            content: '¿Estas seguro de eliminar al Vendedor?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                thisContex.deleteVendedor(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showVendedor(vendedor) {

        httpRequest('get', ws.wsvendedor + '/' + vendedor.idvendedor)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vendedor: result.vendedor,
                    referencias: result.referencias,
                    visibleModalVer: true
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onChangePage(page, pageSize) {

        httpRequest('get', ws.wsvendedor + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vendedores: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
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
                <Redirect to={routes.inicio}/>
            )
        }
        const btnNuevo = this.btnNuevo();
        //const isAbogado
        return (

            <div className="rows">

                <Modal
                    title={"Datos del " + this.state.configTitleVendedor}
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    footer={null}
                    width={850}
                    style={{'top': '35px'}}
                >
                    <ShowVendedor
                        vendedor={this.state.vendedor}
                        referencia={this.state.referencias}
                        onCancel={this.closeModalVer.bind(this)}
                    />

                </Modal>

                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">{'Gestionar ' + this.state.configTitleVendedor}</h1>
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
                                    placeholder=" buscar ..."
                                />
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
                                        <th>Ci/Nit</th>
                                        <th>Comision</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        this.state.vendedores.map((item, key) => {
                                            let codigo = item.idvendedor;
                                            if (this.state.configCodigo) {
                                                codigo = item.codvendedor;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo}</td>
                                                    <td>{item.nombre + ' ' + ((item.apellido == null)?'':item.apellido)}</td>
                                                    <td>{item.nit}</td>
                                                    <td>{item.comisionventa.descripcion}</td>
                                                    <td>

                                                        { this.btnVer(item) }
                                                        { this.btnEditar(item.idvendedor) }
                                                        { this.btnEliminar(item) }

                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
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
