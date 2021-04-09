import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Redirect, withRouter} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../tools/webservices';
import routes from '../../../tools/routes';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import { readPermisions } from '../../../tools/toolsPermisions';
import C_Button from '../../../components/data/button';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
const WIDTH_WINDOW = window.innerWidth; // ancho
const HEIGHT_WINDOW = window.innerHeight;
const {Option} = Select;

class IndexCompra extends Component {

    constructor(props){
        super(props);
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
            configCodigo: false,
            pagination: {},
            buscar: '',
            timeoutSearch: undefined,
            pagina: 1,
            comprasDefaults: [],
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
                title: 'Tipo de Pago',
                dataIndex: 'tipopago',
                key: 'tipopago',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipopago.localeCompare(b.tipopago)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {/* {this.btnEditar(record.id)} */}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_ver: readPermisions(keys.compra_btn_ver),
            btn_nuevo: readPermisions(keys.compra_btn_nuevo),
            btn_eliminar: readPermisions(keys.compra_btn_eliminar)
        }
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.closeModalVer = this.closeModalVer.bind(this);
        this.deleteCompra = this.deleteCompra.bind(this);
        this.changePaginationCompras = this.changePaginationCompras.bind(this);
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

    onCreateData() {
        var url = "/commerce/admin/compra/create";
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={this.onCreateData.bind(this)}
                    />
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
        // this.getCompras();

    }

    getConfigsClient() {

        httpRequest('get', ws.wsconfigcliente)
        .then((result) => {
            if (result.response == 1) {
                this.getCompras2();
                this.setState({
                    configCodigo: result.data.codigospropios
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getCompras2(){
        httpRequest('get', ws.wscompra)
        .then((result) => {
            console.log(result)
            if(result.response == 1){
                let data = result.data;
                let datosCompras = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipo === 'R') {
                        tipo = 'Credito';
                    }else{
                        tipo = 'Contado';
                    }
                    datosCompras.push({
                        id: data[i].idcompra,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idcompra.toString() : data[i].codcompra,
                        nombre: data[i].proveedor.nombre + ' ' + data[i].proveedor.apellido,
                        tipopago: tipo,
                        sucursal: data[i].sucursal == undefined ? '' : data[i].sucursal.nombre,
                    });
                }
                console.log(datosCompras)
                this.setState({
                    compras: datosCompras,
                    comprasDefaults: datosCompras,
                    pagination: result.pagination,
                    paginacionDefaults: result.pagination,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    changePaginationCompras(page){
        httpRequest('get', ws.wscompra + '?page=' + page)
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let tipo;
                let datosCompras = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipo === 'R') {
                        tipo = 'Credito';
                    }else{
                        tipo = 'Contado';
                    }
                    datosCompras.push({
                        id: data[i].idcompra,
                        nro: 10 * (page - 1) + i + 1,
                        codigo: this.state.configCodigo === false ? data[i].idcompra.toString() : data[i].codcompra,
                        nombre: data[i].proveedor.nombre + ' ' + data[i].proveedor.apellido,
                        tipopago: tipo,
                        sucursal: data[i].sucursal == undefined ? '' : data[i].sucursal.nombre,
                    });
                }
                this.setState({
                    compras: datosCompras,
                    comprasDefaults: datosCompras,
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

    getCompras() {

        httpRequest('get', ws.wscompra)
        .then((result) => {
            console.log(result)
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

    handleSearchCompra(value) {

        this.setState({
            timeoutSearch: this.state.timeoutSearch,
            buscar: value,
        });
    }

    onChangeSizePagination(value) {
        this.setState({
            nroPaginacion: value,
        });
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const btnNuevo = this.btnNuevo();
        return (
            // <div className="rows">
            //     <div className="cards">

            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <h1 className="lbls-title">Gestionar Compra</h1>
            //             </div>
            //             { btnNuevo }
            //         </div>

            //         <div className="forms-groups">
            //             <div className="pulls-left">
            //                 <div className="inputs-groups">
            //                     <select className="forms-control">

            //                         <option value="10"> 10 </option>
            //                         <option value="25"> 25 </option>
            //                         <option value="50"> 50 </option>
            //                         <option value="100"> 100 </option>
            //                     </select>
            //                     <h3 className="lbl-input-form-content active"> Mostrar </h3>
            //                 </div>
            //             </div>

            //             <div className="pulls-right">
            //                 <div className="inputs-groups">
            //                     <input type="text"
            //                             className="forms-control w-75-content"
            //                             placeholder=" buscar ..."/>
            //                             <h3 className="lbls-input active"> Buscar </h3>
            //                     <i className="fa fa-search fa-content" style={{'top': '3px'}}>
            //                     </i>
            //                 </div>
            //             </div>
            //         </div>

            //         <div className="forms-groups">
            //             <div className="tabless">
            //                 <table className="tables-respons">
            //                     <thead>
            //                         <tr>
            //                             <th>Nro</th>
            //                             <th>Codigo</th>
            //                             <th>Nombre</th>
            //                             <th>Tipo Pago</th>
            //                             <th>Sucursal</th>
            //                             <th>Opcion</th>
            //                         </tr>
            //                     </thead>
            //                     <tbody>
            //                         {this.state.compras.map(
            //                             (item, key) => {
            //                                 let apellido = item.proveedor.apellido == null ? '' : item.proveedor.apellido;
            //                                 let codigo = item.idcompra;
            //                                 if (this.state.configCodigo) {
            //                                     codigo = item.codcompra == null ? '' : item.codcompra;
            //                                 }
            //                                 return (
            //                                     <tr key={key}>
            //                                         <td>{key + 1}</td>
            //                                         <td>{codigo}</td>
            //                                         <td>{item.proveedor.nombre + ' ' + apellido}</td>
            //                                         <td>{(item.tipo == 'R') ? 'Credito' : 'Contado'}</td>
            //                                         <td>{(item.sucursal == undefined) ? '' : item.sucursal.nombre}</td>
            //                                         <td>
            //                                             { this.btnVer(item.idcompra) }

            //                                             {
            //                                             /**
            //                                              <Link  to={"/commerce/admin/compra/edit/" + item.idcompra}
            //                                                 className="btn-content btn-primary-content"
            //                                                 aria-label="editar">
            //                                                 <i className="fa fa-edit"> </i>
            //                                             </Link>
            //                                                 */
            //                                             }
            //                                             { this.btnEliminar(item.idcompra) }

            //                                         </td>
            //                                     </tr>
            //                                 )
            //                             }
            //                         )}
            //                     </tbody>
            //                 </table>
            //             </div>
            //         </div>

            //         <div className="forms-groups">
            //             <div className="text-center-content">
            //                 <Pagination
            //                     defaultCurrent={1}
            //                     onChange={this.onChangePage}
            //                     total={this.state.pagination.total} />
            //             </div>
            //         </div>
            //     </div>
            // </div>

            <div className="rows">


            <div className="cards">
                <div className="pulls-left">
                    <h1 className="lbls-title">Gestionar Compras</h1>
                </div>
                { btnNuevo }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <C_Select
                            // value = {this.state.nroPaginacion}
                            // onChange = {this.onChangeSizePagination.bind(this)}
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
                            // value={this.state.buscar}
                            // onChange={this.handleSearchCliente.bind(this)}
                            title='Buscar'
                            className=''
                        />


                </div>
                <div className="forms-groups">
                    <div className="tabless">
                        <Table
                            columns={this.columns}
                            dataSource={this.state.compras}
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
                        onChange = {this.changePaginationCompras}
                        total = {this.state.pagination.total}
                        showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                    />
                </div>
            </div>
        </div>
        </div>
        );
    }
}

export default withRouter(IndexCompra);
