import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { render} from 'react-dom';
import { TreeSelect, message, notification, Icon, Modal, Button, Card, Divider, Pagination, Select, Table } from 'antd';
import "antd/dist/antd.css";     // for css
import ShowCliente from './ShowCliente';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const confirm = Modal.confirm;

class IndexCliente extends Component{
    constructor(props){
        super(props);
        this.state = {
            clienteSeleccionado: [],
            clienteContactarloSeleccionado: [],
            visibleDatoCliente: false,
            clientes:[],
            modal:'none',
            visible:false,
            datosActuales:'',
            datosCiudad:'',
            datosTipocliente:'',
            datosDeContactanos:[],
            bandera:0,
            verFecha:'',
            pagination: {},
            buscar: '',
            noSesion: false,
            configCodigo: false,
            timeoutSearch: undefined,
            pagina: 1,
            clientesDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
        }
        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipo.localeCompare(b.tipo)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_ver: readPermisions(keys.cliente_btn_ver),
            btn_nuevo: readPermisions(keys.cliente_btn_nuevo),
            btn_editar: readPermisions(keys.cliente_btn_editar),
            btn_eliminar: readPermisions(keys.cliente_btn_eliminar)
        }
        this.changePaginationClientes = this.changePaginationClientes.bind(this);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.verDatosCliente.bind(this, data)}
                    className="btns btns-sm btns-outline-success hint--bottom hint--success"
                    aria-label="detalles">
                    <i className="fa fa-eye"></i>
                </a>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={"/commerce/admin/cliente/edit/"+(data)}
                    className="btns btns-sm btns-outline-primary hint--bottom" aria-label="editar">
                    <i className="fa fa-edit"></i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-danger hint--bottom hint--error"
                    aria-label="eliminar"
                    onClick={this.eliminarElemento.bind(this, data)}>
                    <i className="fa fa-trash"></i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = "/commerce/admin/cliente/create";
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button onClick={this.onCreateData.bind(this)}
                        type='primary' title='Nuevo'
                    />
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
    }

    getClientes(){
        httpRequest('get', ws.wscliente)
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let length = data.length;
                let datosClientes = [];
                for (let i = 0; i < length; i++) {
                    let apellido;
                    if(data[i].apellido == null) {
                        apellido = data[i].nombre;
                    } else {
                        apellido = data[i].nombre + ' ' + data[i].apellido;
                    }
                    datosClientes.push({
                        id: data[i].idcliente,
                        nro: (i + 1),
                        codigo: this.state.configCodigo === false ? data[i].idcliente.toString() : data[i].codcliente,
                        nombre: apellido,
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

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getClientes();
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    eliminarFila(this2, datosCliente){
        httpRequest('delete', '/commerce/api/cliente/' + datosCliente)
        .then( result => {
            if (result.response === 1){
                let data = result.data;
                let vec = [];
                for (let i = 0; i<data.length; i++){
                    let codigo = this.state.configCodigo ? data[i].codcliente : data[i].idcliente;
                    let apellido;
                    if(data[i].apellido == null) {
                        apellido = data[i].nombre;
                    } else {
                        apellido = data[i].nombre + ' ' + data[i].apellido;
                    }
                    let tipoPersoneria;
                    if (data[i].tipopersoneria == 'J') {
                        tipoPersoneria = 'Juridico';
                    } else {
                        tipoPersoneria = 'Natural';
                    }
                    vec.push({
                        id: data[i].idcliente,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        codigo: codigo,
                        nombre: apellido,
                        nit: data[i].nit,
                        tipo: tipoPersoneria,
                    })
                }
                this2.setState({
                    clientes: vec,
                    clientesDefaults: vec,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.response === 0) {
                message.warning("No se pudo eliminar por que se encuentra registrado en una transaccion");
            } else {
                console.log(result);
            }
        }).catch (error => {
            console.log(error);
        })
    }

    showDeleteConfirm(this2,datosCliente) {
        confirm({
            title: 'Esta seguro de eliminar el cliente?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                this2.eliminarFila(this2,datosCliente)
            },
            onCancel(){
                // console.log('Cancel');
            },
        });
    }

    eliminarElemento(datosCliente){
        this.showDeleteConfirm(this,datosCliente);
    }

    handleOk(e){
        this.setState({
            visible: false,
        });
    }

    handleCancel(e){
        this.setState({
            visible: false,
        });
    }

    verDatosRegistro(datosRegistro){
        if(datosRegistro.fechanac !== null){
            var fechaForm = datosRegistro.fechanac.split("-")
            var fecha = fechaForm[2] + "/" + fechaForm[1] + "/" + fechaForm[0]
        }
        var data = {
            'idcliente':datosRegistro.idcliente,
            'fkidciudad':datosRegistro.fkidciudad,
            'fkidtipocliente':datosRegistro.fkidclientetipo,
        }
        httpRequest('post', '/commerce/api/showCliente', data)
        .then(result => {
            if (result.response == 1) {
                this.setState({
                    datosCiudad : result.ciudad.descripcion,
                    datosTipocliente:result.tipoCliente.descripcion,
                    datosDeContactanos:result.descripcionRefe
                })
            } else if (result.response == -2) {
                this.setState({
                    noSesion: true
                })
            } else {
                console.log(result);
            }
        }).catch(error => {
            console.log(error)
        })
        this.setState({
            visible:true,
            datosActuales:datosRegistro,
            verFecha:fecha
        })
    }

    habilitarParaContactarnos(){
        if(this.state.datosDeContactanos.length > 0){
            return(
                <div>
                    <div className='form-group-content col-lg-12-content color-label-modal'>
                        <Divider orientation='left'>Detalles Para Contactarlo</Divider>
                    </div>
                    <div className="form-group-content col-lg-8-content">
                        <div className="caja-content caja-content-alturaView">
                            <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Para Contactarlo  </label>
                            </div>
                            <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Referencia  </label>
                            </div>
                            <div className="col-lg-8-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <label className='label-content-modal text-center-content'> Descripcion  </label>
                            </div>
                            {this.state.datosDeContactanos.map((l,i)=>(
                                <div key={i}>
                                    <div className="col-lg-4-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <label className='text-center-content'> {l.referencia}  </label>
                                    </div>
                                    <div className="col-lg-8-content col-md-3-content col-sm-12-content col-xs-12-content">
                                        <label className='text-center-content'> {l.valor}  </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }

    habilitarExtra(){
        if(this.state.datosDeContactanos.length > 0){
            return (
                <div className="form-group-content col-lg-4-content">
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Contacto:   </label><label>{this.state.datosActuales.contacto}</label>
                    </div>
                    <Divider></Divider>
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Observaiones:   </label><label>{this.state.datosActuales.notas}</label>
                    </div>
                    <Divider></Divider>
                </div>
            )
        }else{
            return (
                <div className="form-group-content col-lg-12-content">
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Contacto:   </label><label>{this.state.datosActuales.contacto}</label>
                    </div>
                    <Divider></Divider>
                    <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                        <label className='label-content-modal'> Observaiones:   </label><label>{this.state.datosActuales.notas}</label>
                    </div>
                    <Divider></Divider>
                </div>
            )
        }
    }

    imagenVisualizar(){
        if(this.state.datosActuales.foto !== null && this.state.datosActuales !==""){
            return (
                <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src={this.state.datosActuales.foto} alt="none" className='img-principal'></img>
                    </div>
                </div>
            )
        }else{
            return (
                <div className="col-lg-12-content col-md-3-content col-sm-12-content col-xs-12-content">
                    <div className="caja-img-modal">
                         <img src="/images/default.jpg"  style={{'cursor': 'pointer'}}
                         alt="none" className="img-principal"/>
                    </div>
                </div>
            )
        }
    }

    cerrarModal(){
        this.setState({
            modal:'none',
        })
    }

    verDatosCliente(id) {
        var data = {
            'idCliente': id
        }
        httpRequest('post', '/commerce/api/showCliente', data)
        .then(result =>{
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else if (result.data) {
                    this.state.clienteSeleccionado = [];
                    this.state.clienteSeleccionado.push(result.cliente);
                    this.setState({
                        clienteSeleccionado: this.state.clienteSeleccionado,
                        clienteContactarloSeleccionado: result.clienteContactarlo,
                        visibleDatoCliente: !this.state.visibleDatoCliente
                    });
                }
            }
        )
        .catch((error) => {
            console.log(error);
        })
    }

    handleCerrar() {
        this.setState({
            visibleDatoCliente: !this.state.visibleDatoCliente
        })
    }

    changePaginationClientes(page){
        httpRequest('get', ws.wscliente + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosClientes = [];
                for (let i = 0; i < length; i++) {
                    datosClientes.push({
                        id: data[i].idcliente,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idcliente.toString() : data[i].codcliente,
                        nombre: data[i].nombre + ' ' + data[i].apellido,
                        tipo: data[i].tipopersoneria === 'J' ? 'Juridico' : 'Natural',
                    });
                }
                this.setState({
                    clientes: datosClientes,
                    clientesDefaults: datosClientes,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSession: true })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    searchSizePaginateCliente(value, sizePagination){
        httpRequest('get', ws.wscliente, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
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
                    pagination: result.pagination
                })
            } else if(result.response == -2) {
                this.setState({ noSession: true })
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    handleSearchCliente(value){
        this.searchSizePaginateCliente(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateCliente(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

render() {
    if (this.state.noSesion) {
        removeAllData();
        return (
            <Redirect to={routes.inicio}/>
        );
    }
    const btnNuevo = this.btnNuevo();
    return (
        <div className="rows">
            <Modal
                title="Datos de Cliente"
                visible={this.state.visibleDatoCliente}
                onOk={this.handleCerrar.bind(this)}
                onCancel={this.handleCerrar.bind(this)}
                okText="Aceptar"
                cancelText='Cancelar'
                width={900}
                style={{'top': '20px'}}
                bodyStyle={{
                    height : window.innerHeight * 0.8
                }}
            >
                <ShowCliente
                    contactoCliente={this.state.clienteContactarloSeleccionado}
                    cliente={this.state.clienteSeleccionado}
                />
            </Modal>
            <div className="cards">
                <div className="pulls-left">
                    <h1 className="lbls-title">Gestionar Clientes</h1>
                </div>
                { btnNuevo }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <C_Select
                            value = {this.state.nroPaginacion}
                            onChange = {this.onChangeSizePagination.bind(this)}
                            title = 'Mostrar'
                            className = ''
                            style = {{ width: 65 }}
                            component = {[
                                <Option key = {0} value = {10}>10</Option>,
                                <Option key = {1} value = {25}>25</Option>,
                                <Option key = {2} value = {50}>50</Option>,
                                <Option key = {3} value = {100}>100</Option>,
                            ]}
                        />
                    </div>
                    <div className="pulls-right">
                        <C_Input
                            value={this.state.buscar}
                            onChange={this.handleSearchCliente.bind(this)}
                            title='Buscar'
                            className=''
                        />
                    </div>
                </div>
                <div className="forms-groups">
                    <div className="tabless">
                        <Table
                            columns={this.columns}
                            dataSource={this.state.clientes}
                            bordered = {true}
                            pagination = {false}
                            className = "tables-respons"
                            rowKey = "id"
                        />
                    </div>
                </div>
                <div className="pull-right py-3">
                    <Pagination
                        defaultCurrent = {this.state.pagina}
                        pageSize = {this.state.nroPaginacion}
                        onChange = {this.changePaginationClientes}
                        total = {this.state.pagination.total}
                        showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                    />
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter(IndexCliente);
