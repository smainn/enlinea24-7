
import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Pagination, Modal, Table, message,Select } from 'antd';
import ws from '../../../utils/webservices';
import Input from '../../../componentes/input';
import TextArea from '../../../componentes/textarea';
import { httpRequest, removeAllData, readData, saveData, getConfigColor } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import CImage from '../../../componentes/image';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

const {Option} = Select;
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import keysStorage from '../../../utils/keysStorage';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';

class IndexProducto extends Component {

    constructor(props){
        super(props);
        this.state = {
            array_producto: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },

            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,

            noSession: false,
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
                title: 'Codigo',
                dataIndex: 'codigo',
                key: 'codigo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codigo.localeCompare(b.codigo)}
            },
            {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Precio',
                dataIndex: 'precio',
                key: 'precio',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.precio - b.precio,
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.precio.localeCompare(b.precio)}
            },
            {
                title: 'Familia',
                dataIndex: 'familia',
                key: 'familia',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.familia.localeCompare(b.familia)}
            },
            {
                title: 'Stock Total',
                dataIndex: 'stock',
                key: 'stock',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.stock.localeCompare(b.stock)}
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
            btn_ver : readPermisions(keys.producto_btn_ver),
            btn_nuevo: readPermisions(keys.producto_btn_nuevo),
            btn_editar: readPermisions(keys.producto_btn_editar),
            btn_eliminar: readPermisions(keys.producto_btn_eliminar),
            btn_reporte: readPermisions(keys.producto_btn_reporte),
            codigo: readPermisions(keys.producto_input_codigo),
            add_cod: readPermisions(keys.producto_btn_agregarCodigos),
            tipo: readPermisions(keys.producto_select_tipo),
            moneda: readPermisions(keys.producto_select_moneda),
            unidad:readPermisions(keys.producto_select_unidadMedida),
            descripcion: readPermisions(keys.producto_input_descripcion),
            familia: readPermisions(keys.producto_select_familia),
            precio: readPermisions(keys.producto_input_precio),
            costo: readPermisions(keys.producto_input_costo),
            caract: readPermisions(keys.producto_caracteristicas),
            foto: readPermisions(keys.producto_imagenes),
            add_costo: readPermisions(keys.producto_btn_agregarCosto),
            add_lista: readPermisions(keys.producto_btn_agregarListaPrecio),
            stock_alm: readPermisions(keys.producto_stockAlmacen),
            stock_tot: readPermisions(keys.producto_totalStock),
            pal_clave: readPermisions(keys.producto_textarea_palabrasClaves),
            notas: readPermisions(keys.producto_textarea_nota),
        }
    }
    componentDidMount(){
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wsproducto + '?page=' + page, {
                vakue: value,
                paginate: sizePagination,
            }).then(
            result => {
                if (result.response == 1) {

                    let data = result.data;
                    let array_data = [];
                    for (let i = 0; i < data.length; i++) {
                        array_data.push({
                            id: data[i].idproducto,
                            nro: (i + 1),
                            codigo: (result.config.codigospropios == false) ? data[i].idproducto.toString() : data[i].codproducto,
                            descripcion: data[i].descripcion,
                            precio: data[i].precio,
                            tipo: data[i].tipo == 'P' ? 'Producto' : 'Servicio',
                            familia: data[i].familia,
                            stock: data[i].stock,
                        });
                    }

                    this.setState({
                        array_producto: array_data,
                        pagination: result.pagination,
                        pagina: page,
                    });
                    
                }
                if (result.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    btnVer(id) {
        console.log(id)
        // if (this.permisions.btn_ver.visible == 'A') {
        //     return (
        //         <a
        //             className="btns btns-sm btns-outline-success"
        //             onClick={() => this.showProducto(data)}>
        //             <i className="fa fa-eye"> </i>
        //         </a>
        //     );
        // }
        // return null;
    }

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={routes.producto_edit + '/' + id}
                    className="btns btns-sm btns-outline-primary">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        // if (this.permisions.btn_eliminar.visible == 'A') {
        //     return (
        //         <a
        //             className="btns btns-sm btns-outline-danger"
        //             onClick={() => this.setState({ modalCancel: true, idDelete: id }) }//this.showDeleteConfirm(this, id)}
        //             >
        //             <i className="fa fa-trash"> 
        //             </i>
        //         </a>
        //     );
        // }
        // return null;
    }
    render() {
        if (this.state.noSession) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Producto</h1>
                        </div>
                        <div className="pulls-right">
                        </div>
                    </div>

                    <div className="forms-groups">
                        <div className="pulls-left">
                           
                        </div>

                        <div className="pulls-right">
                            
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_producto}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(IndexProducto);

