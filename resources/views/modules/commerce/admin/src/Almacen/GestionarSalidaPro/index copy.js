import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';
import { Pagination, Modal,Card, message, Table } from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import { timingSafeEqual } from 'crypto';
import TextArea from '../../../components/textarea';
import Input from '../../../components/input';
import { columns } from '../../../tools/columnsTable';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexSalidaPro extends Component {

    constructor(){
        super();
        this.state = {
            salidaproductos: [],
            listaproductos: [],
            salidaproducto: {},
            pagination: {},
            visibleModalVer: false,
            noSesion: false,
            configCodigo: false
        }
        
        this.permisions = {
            btn_nuevo: readPermisions(keys.salida_producto_btn_nuevo),
            btn_show: readPermisions(keys.salida_producto_btn_ver),
            btn_edit: readPermisions(keys.salida_producto_btn_editar),
            btn_delete: readPermisions(keys.salida_producto_btn_eliminar),
            codigo: readPermisions(keys.salida_producto_input_codigo),
            tipo: readPermisions(keys.salida_producto_select_tipo),
            almacen: readPermisions(keys.salida_producto_select_almacen),
            fecha: readPermisions(keys.salida_producto_fechaHora),
            searchprod: readPermisions(keys.salida_producto_input_search_producto),
            t_almacen: readPermisions(keys.salida_producto_tabla_columna_almacen),
            t_cantidad: readPermisions(keys.salida_producto_tabla_columna_cantidad),
            notas: readPermisions(keys.salida_producto_textarea_nota)
        }

        this.onChangePage = this.onChangePage.bind(this);
    }


    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to="/commerce/admin/salida-producto/create" className="btns btns-primary">
                    <i className="fa fa-plus-circle"></i>
                    &nbsp;Nuevo
                </Link>
            );
        }
        return null;
    }

    btnShow(id) {
        if (this.permisions.btn_show.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    onClick={() => this.showSalidaProd(id) }
                    >
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_edit.visible == 'A') {
            return (
                <Link  
                    to={"/commerce/admin/salida-producto/edit/" + id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }
    
    btnEliminar(id) {
        if (this.permisions.btn_delete.visible == 'A') {
            return (
                <a 
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(this, id)}
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
        this.getSalidasProductos();
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

    getSalidasProductos() {
        httpRequest('get', ws.wssalidaproducto)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    salidaproductos: result.data,
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


    deleteSalidaProducto(id) {
        httpRequest('delete', ws.wssalidaproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                console.log('Se elimino correctamente');
                //this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
                this.setState({
                    salidaproductos: result.data,
                    pagination: result.pagination
                })
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
        
        httpRequest('get', ws.wssalidaproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    salidaproducto: result.salidaprod,
                    visibleModalVer: true,
                    listaproductos: result.data
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

    fechaCreacion(date) {
        if (typeof date != 'undefined') {

            var array = date.split(' ');
            return array[0];
        }
    }

    listaproductos() {
        var array = [];
        this.state.listaproductos.map(
            (item, key) => {
                array.push({
                    key: key,
                    Nro: key + 1,
                    Id: item.idproducto,
                    Descripcion: item.descripcion,
                    Almacen: item.almacen,
                    Cantidad: item.cantidad,
                });
            }
        );
        return array;
    }

    componentBodyModalVer() {
        let tipo = this.state.salidaproducto.tipo == undefined ? '' : this.state.salidaproducto.tipo.descripcion;
        let notas = this.state.salidaproducto.notas == undefined ? '' : this.state.salidaproducto.notas;
        let codigoSalida = this.state.salidaproducto.idsalidaproducto;
        if (this.state.configCodigo) {
            codigoSalida = this.state.salidaproducto.codsalidaprod == null ? codigoSalida : this.state.salidaproducto.codsalidaprod;
        }
        return (
            <div className="col-lg-12-content">
                <div className="forms-groups cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <Input
                                title="Codigo"
                                value={codigoSalida}
                                readOnly={true}
                                permisions={this.permisions.codigo}
                                //configAllowed={this.state.configCodigo}
                            />
                        </div>

                        <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                            <Input
                                title="tipo"
                                value={tipo}
                                readOnly={true}
                                permisions={this.permisions.tipo}
                            />
                        </div>

                        <div className="cols-lg-4 cols-md4 cols-sm-12 cols-xs-12">
                            <Input
                                title="Fecha-Hora"
                                value={this.state.salidaproducto.fechahora}
                                readOnly={true}
                                permisions={this.permisions.fecha}
                            />
                        </div>
                    </div>

                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                        <div className="cols-lg-12 cols-md-12 col-sm-12 cols-xs-12">
                            <TextArea
                                title="Notas"
                                value={notas}
                                permisions={this.permisions.notas}
                            />
                        </div>
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                    <div className="cols-lg-2 cols-md-2"></div>
                    <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">

                        <Table
                            bordered
                            dataSource={this.listaproductos()}
                            columns={columns.salidaProducto}
                            pagination={false}
                            style={{
                                width: '100%',
                            }}
                        />
                    </div>
                </div>
        
            </div>
        );
    }

    onChangePage(page, pageSize) {
        
        httpRequest('get', ws.wssalidaproducto + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    salidaproductos: result.data,
                    pagination: result.pagination
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message)
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
                    title="Detalle Salida Producto"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    width={WIDTH_WINDOW * 0.7}
                    style={{'top': '10px'}}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,  
                    }}
                >
                    { componentBodyModalVer }
                </Modal>

                <div className="cards">

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Producto Salidas</h1>
                        </div>

                        <div className="pulls-right">
                            { btnNuevo }
                        </div>
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
                                        <th>Codigo</th>
                                        <th>Fecha-Hora</th>
                                        <th>Tipo</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.salidaproductos.map(
                                        (item, key) => {
                                            let codigo = item.idsalidaproducto;
                                            if (this.state.configCodigo) {
                                                codigo = item.codsalidaprod;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo}</td>
                                                    <td>{item.fechahora}</td>
                                                    <td>{(item.tipo == undefined) ? '' : item.tipo.descripcion}</td>
                                                    <td>
                                                        { this.btnShow(item.idsalidaproducto) }
                                                        
                                                        { this.btnEditar(item.idsalidaproducto) }
                                                        
                                                        { this.btnEliminar(item.idsalidaproducto) }
                                                        
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
