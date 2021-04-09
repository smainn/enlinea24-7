import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom';
import { Pagination, Modal,Card, message, Table } from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';

import Input from '../../../components/input';
import TextArea from '../../../components/textarea';
import { columns } from '../../../tools/columnsTable';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';

const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight; 

export default class IndexIngresoPro extends Component {

    constructor(){
        super();
        this.state = {
            ingresoproductos: [],
            listaproductos: [],
            ingresoproducto: {},
            pagination: {},
            visibleModalVer: false,
            noSesion: false,
            configCodigo: false
        }
        
        this.permisions = {
            btn_nuevo: readPermisions(keys.ingreso_producto_btn_nuevo),
            btn_show: readPermisions(keys.ingreso_producto_btn_ver),
            btn_edit: readPermisions(keys.ingreso_producto_btn_editar),
            btn_delete: readPermisions(keys.ingreso_producto_btn_eliminar),
            codigo: readPermisions(keys.ingreso_producto_input_codigo),
            tipo: readPermisions(keys.ingreso_producto_select_tipo),
            almacen: readPermisions(keys.ingreso_producto_select_almacen),
            fecha: readPermisions(keys.ingreso_producto_fechaHora),
            searchprod: readPermisions(keys.ingreso_producto_input_search_producto),
            t_almacen: readPermisions(keys.ingreso_producto_tabla_columna_almacen),
            t_cantidad: readPermisions(keys.ingreso_producto_tabla_columna_cantidad),
            notas: readPermisions(keys.ingreso_producto_textarea_nota)
        }

        this.onChangePage = this.onChangePage.bind(this);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <Link to="/commerce/admin/ingreso-producto/create" className="btns btns-primary">
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
                    onClick={() => this.showIngresoProd(id) }
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
                    to={"/commerce/admin/ingreso-producto/edit/" + id}
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
        this.getIngresosProducto();
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
    
    getIngresosProducto() {
        
        httpRequest('get', ws.wsingresoproducto)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    ingresoproductos: result.data,
                    pagination: result.pagination
                });
            } else if(result.response == -2) {
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

    deleteIngresoProducto(id) {
        
        httpRequest('delete', ws.wsingresoproducto + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                //console.log('Se elimino correctamente');
                //this.deleteLista(listaprecio.idlistaprecio);
                message.success(result.message);
                this.setState({
                    ingresoproductos: result.data,
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
        })
    }

    showDeleteConfirm(thisContex, item) {
        console.log(item);
        Modal.confirm({
            title: 'Elimiar Ingreso Producto',
            content: '¿Estas seguro de eliminar el ingreso de productos?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                thisContex.deleteIngresoProducto(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    showIngresoProd(id) {
        
        httpRequest('get', ws.wsingresoproducto + '/' + id)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    ingresoproducto: result.ingresoprod,
                    visibleModalVer: true,
                    listaproductos: result.data
                });
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
            }
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
        let tipo = this.state.ingresoproducto.tipo == undefined ? '' : this.state.ingresoproducto.tipo.descripcion;
        let codigoIngreso = this.state.ingresoproducto.idingresoproducto;
        if (this.state.configCodigo) {
            codigoIngreso = this.state.ingresoproducto.codingresoprod;
        }
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                        <Input
                            title="Codigo"
                            value={codigoIngreso}
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

                    <div className="cols-lg-4 cols-md-4 cols-sm-12 cols-xs-12">
                        <Input
                            title="Fecha-Hora:"
                            value={this.state.ingresoproducto.fechahora}
                            readOnly={true}
                            permisions={this.permisions.fecha}
                        />
                    </div>

                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <TextArea
                            title="Notas"
                            value={this.state.ingresoproducto.notas}
                            readOnly={true}
                            permisions={this.permisions.notas}
                        />
                    </div>
                </div>

                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">

                    <div className="cols-lg-2 cols-md-2"></div>
                    <div className="cols-lg-9 cols-md-9 cols-sm-12 cols-xs-12">

                        <Table 
                            bordered
                            dataSource={this.listaproductos()}
                            columns={columns.ingresoProducto}
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
        
        httpRequest('get', ws.wsingresoproducto + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                this.setState({
                    ingresoproductos: result.data,
                    pagination: result.pagination
                });
            } else if(result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
    }

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }
        const componentBodyModalVer = this.componentBodyModalVer();
        const btnNuevo = this.btnNuevo();
        return (
            <div className="rows">

                <Modal
                    title="Detalle Ingreso Producto"
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    style={{'top': '10px'}}
                    width={WIDTH_WINDOW * 0.7}
                    bodyStyle={{
                        height: HEIGHT_WINDOW * 0.7,  
                    }}
                >
                    { componentBodyModalVer }
                </Modal>

                <div className="cards">

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Producto Ingresados</h1>
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
                                        <th>Cod Ingreso</th>
                                        <th>Fecha-Hora</th>
                                        <th>Tipo</th>
                                        <th>Opcion</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {this.state.ingresoproductos.map(
                                        (item, key) => {
                                            let codigo = item.idingresoproducto;
                                            if (this.state.configCodigo) {
                                                codigo = item.codingresoprod;
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{codigo}</td>
                                                    <td>{item.fechahora}</td>
                                                    <td>{(item.tipo == undefined) ? '' : item.tipo.descripcion}</td>
                                                    <td>
                                                        { this.btnShow(item.idingresoproducto) }
                                                        
                                                        { this.btnEditar(item.idingresoproducto) }
                                                        
                                                        { this.btnEliminar(item.idingresoproducto) }
                                                        
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
                                total={this.state.pagination.total} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
