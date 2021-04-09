import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { render} from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import { TreeSelect,message,notification ,Icon,Modal,Button,Card,Divider, Pagination} from 'antd';
import "antd/dist/antd.css";     // for css
import ShowCliente from './ShowCliente';
import Input from '../../../components/input';
import { readPermisions } from '../../../tools/toolsPermisions';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import ws from '../../../tools/webservices';

const TreeNode = TreeSelect.TreeNode;
const confirm = Modal.confirm;
export default class IndexCliente extends Component{
    constructor(props){
        super(props);
        this.state={
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
            sizePagination: 10,
            buscar: '',
            noSesion: false,
            configCodigo: false,
            timeoutSearch: undefined,
            pagina: 1,
            clientesDefaults: [],
            paginacionDefaults: {},
            nroPaginacion: 10,
            config: {
                length_menu: [10, 25, 50, 100],
                show_filter: false,
                show_pagination: false,
                show_info: false,
                show_length_menu: false,
                page_size: 100,
            }
        },

        this.columns = [
            {
                key: "nro",
                text: "Numero",
                align: "left",
                sortable: true,
            },
            {
                key: "codigo",
                text: "Codigo",
                align: "left",
                sortable: true,
            },
            {
                key: "nombre",
                text: "Nombre",
                align: "left",
                sortable: true
            },
            {
                key: "tipo",
                text: "Tipo",
                sortable: true
            },
            {
                key: "accion",
                text: "Opciones",
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            }
        ];

        this.permisions = {
            btn_ver: readPermisions(keys.cliente_btn_ver),
            btn_nuevo: readPermisions(keys.cliente_btn_nuevo),
            btn_editar: readPermisions(keys.cliente_btn_editar),
            btn_eliminar: readPermisions(keys.cliente_btn_eliminar)
        }
        this.onChangePage = this.onChangePage.bind(this);
    }

    editRecord(record) {
        console.log("Edit Record", record);
    }
 
    deleteRecord(record) {
        console.log("Delete Record", record);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.verDatosCliente.bind(this, data)}
                    className="btns btns-sm btns-outline-success hint--bottom hint--success" 
                    aria-label="detalles">
                    <i className="fa fa-eye"> </i>
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
                    <i className="fa fa-trash" > </i>
                </a>
            );
        }
        return null;
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to="/commerce/admin/cliente/create" className="btns btns-primary"><i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getConfigsClient();
        this.getClientes();
    }

    getClientes() {
        httpRequest('get', '/commerce/api/cliente')
        .then(result => {
            if (result.response == 1) {
                let data = result.data;
                let vec = [];
                for (let i = 0; i < data.length; i++){
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
                this.setState({
                    clientes: vec,
                    clientesDefaults: vec,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                })

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    getConfigsClient() {
        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
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
            title: 'Esta Seguro De Eliminar Esta Fila?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                this2.eliminarFila(this2,datosCliente)
            },
            onCancel() {
                console.log('Cancel');
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

    onChangeBuscarDato(event) {
        this.setState({
            buscar: event.target.value,
        });
    }

    onChangePage(page, pageSize){
        httpRequest('get', '/commerce/api/cliente' + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
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
                        nro: 10 * (page - 1) + i + 1,
                        codigo: codigo,
                        nombre: apellido,
                        nit: data[i].nit,
                        tipo: tipoPersoneria,
                    })
                }
                this.setState({
                    clientes: vec,
                    clientesDefaults: vec,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    pagina: page,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    searchCliente(value) {
        if (value.length > 0) {
            httpRequest('get', ws.wsBusquedaCliente + '/' + value)
            .then((result) => {
                if(result.response == 1){
                    let data = result.cliente;
                    let vec = [];
                    for(let i = 0; i < data.length; i++){
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
                    this.setState({
                        clientes: vec,
                        pagination: result.pagination,
                    });
                }
            });
        }else{
            this.setState({
                clientes:this.state.clientesDefaults,
                pagination: this.state.paginacionDefaults
            })
        }
    }

    handleSearchCliente(event) {
        let value = event.target.value;
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(this.searchCliente(value), 300);
        this.setState({ 
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    sizePagination(cantPaginacion){
        httpRequest('get', ws.wsCambiarPaginacion + '/' + cantPaginacion)
        .then((result) => {
            if(result.response == 1){
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
                        nro: i + 1,
                        codigo: codigo,
                        nombre: apellido,
                        nit: data[i].nit,
                        tipo: tipoPersoneria,
                    })
                }
                this.setState({
                    nroPaginacion: cantPaginacion,
                    clientes: vec,
                    clientesDefaults: vec,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                    config: this.state.config,
                });
            }
        });
    }

    onChangeSizePagination(event){
        let value = parseInt(event.target.value);
        this.sizePagination(value);
    }

    itemRender(current, type, originalElement) {
        if (type === 'prev') {
            return <a>Anterior</a>;
        }
        if (type === 'next') {
            return <a>Siguiente</a>;
        }
        return originalElement;
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
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar cliente</h1>
                        </div>
                        <div className="pulls-right">
                            {/*<Link to="/commerce/admin/cliente/reporte" className="btns btns-primary"><i className="fa fa-file-text"></i>
                            &nbsp;Reporte
                            </Link>
                            */}
                            { btnNuevo }
                        </div>
                    </div>
                    <div className="pulls-left">
                        <div className="inputs-groups">
                            <select className="forms-control"
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePagination.bind(this)}
                            >
                                <option value="10"> 10 </option>
                                <option value="25"> 25 </option>
                                <option value="50"> 50 </option>
                                <option value="100"> 100 </option>
                            </select>
                            <h3 className="lbls-input active"> Mostrar </h3>
                        </div>
                    </div>
                    <div className="pulls-right">
                        <input
                            type="text"
                            value={this.state.buscar}
                            onChange={this.handleSearchCliente.bind(this)}
                            className="forms-control w-75-content"
                            placeholder=" buscar ..."/>
                            <h3 className="lbls-input active"> Buscar </h3>
                        <i className="fa fa-search fa-content" style={{'top': '3px'}}> </i>
                    </div>
                    <ReactDatatable
                        config={this.state.config}
                        records={this.state.clientes}
                        columns={this.columns}
                    />
                    <div className="pull-right">
                        <Pagination
                            defaultCurrent={1}
                            defaultPageSize={this.state.nroPaginacion}
                            pageSize={this.state.nroPaginacion}
                            onChange={this.onChangePage}
                            total={this.state.pagination.total}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


