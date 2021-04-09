import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect, withRouter } from 'react-router-dom';
import { Table, Select, Pagination, message } from 'antd';

import "antd/dist/antd.css"; 
import Confirmacion from './delete';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import ws from '../../../tools/webservices';
import C_Input from '../../../components/data/input';
import C_Select from '../../../components/data/select';
import C_Button from '../../../components/data/button';
const { Option } = Select;

class IndexComision extends Component{
    constructor(props) {
        super(props);
        this.state = {
            comision: [],
            offset : 3,
            visibleDelete: false,
            loading: false,
            id: 0,
            noSesion: false,
            pagination: {},
            pagina: 1,
            nroPaginacion: 10,
            comisionDefaults: [],
            paginacionDefaults: {},
            buscar: '',
            timeoutSearch: undefined,
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
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Valor',
                dataIndex: 'valor',
                key: 'valor',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.valor.localeCompare(b.valor)}
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
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];
        this.permisions = {
            btn_nuevo: readPermisions(keys.comision_btn_nuevo),
            btn_editar: readPermisions(keys.comision_btn_editar),
            btn_eliminar: readPermisions(keys.comision_btn_eliminar),
        }
        this.changePaginationComisiones = this.changePaginationComisiones.bind(this);
    }

    onCreateData() {
        var url = "/commerce/admin/comision/create";
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

    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={'/commerce/admin/comision/edit/' + id} 
                    className="btns btns-sm btns-outline-primary tooltips"
                    aria-label="actualizar">
                    <i className="fa fa-edit"></i>
                </Link>
            )
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a 
                    onClick={this.onClickDelete.bind(this, id)} 
                    className="btns btns-sm btns-outline-danger tooltips"
                    aria-label="eliminar">
                    <i className="fa fa-trash"></i>
                </a>
            );
        }
        return null;
    }

    componentDidMount() {
        // this.getComision(1, '', 10);
        this.getComisiones();
    }

    // getComision(page, buscar, nroPagination) {

    //     var url = '/commerce/api/indexComision?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPagination;
    //     httpRequest('get', url)
    //     .then( result => {
    //         console.log(result)
    //         if (result.response == 1) {
    //             this.setState({
    //                 comision: result.data.data,
    //                 pagination: result.pagination
    //             });
    //         } else if (result.response == -2) {
    //             this.setState({ noSesion: true })
    //         } else {
    //             console.log(result);
    //         }

    //     }).catch( error => {
    //         console.log(error)
    //     });
    // }

    getComisiones(){
        httpRequest('get', ws.wscomisionventa)
        .then((result) => {
            console.log('Nuevo',result)
            if(result.response == 1){
                let data = result.data;
                let datosComisiones = [];
                let tipo;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].tipo === 'N') {
                        tipo = 'Ninguno';
                    }
                    if (data[i].tipo === 'V') {
                        tipo = 'Venta';
                    }
                    if (data[i].tipo === 'G') {
                        tipo = 'Gananacia';
                    }
                    if (data[i].tipo === 'F') {
                        tipo = 'Fijo';
                    }
                    if (data[i].tipo === 'O') {
                        tipo = 'Otros'
                    }
                    datosComisiones.push({
                        id: data[i].idcomisionventa,
                        nro: 10 * (this.state.pagina - 1) + i + 1,
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        tipo: tipo,
                    });
                }
                this.setState({
                    comision: datosComisiones,
                    comisionDefaults: datosComisiones,
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

    changePaginationComisiones(page){
        httpRequest('get', ws.wscomisionventa + '?page=' + page)
        .then((result) => {
            if (result.response > 0) {
                let data = result.data;
                let length = data.length;
                let datosComisiones = [];
                let tipo;
                for (let i = 0; i < length; i++) {
                    if (data[i].tipo === 'N') {
                        tipo = 'Ninguno';
                    }
                    if (data[i].tipo === 'V') {
                        tipo = 'Venta';
                    }
                    if (data[i].tipo === 'G') {
                        tipo = 'Gananacia';
                    }
                    if (data[i].tipo === 'F') {
                        tipo = 'Fijo';
                    }
                    if (data[i].tipo === 'O') {
                        tipo = 'Otros'
                    }
                    datosComisiones.push({
                        id: data[i].idcomisionventa,
                        nro: 10 * (page - 1) + i + 1,
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        tipo: tipo,
                    });
                }
                this.setState({
                    comision: datosComisiones,
                    comisionDefaults: datosComisiones,
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

    searchSizePaginateComisiones(value, sizePagination){
        httpRequest('get', ws.wscomisionventa, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let datosComisiones = [];
                let tipo;
                for (let i = 0; i < length; i++) {
                    if (data[i].tipo === 'N') {
                        tipo = 'Ninguno';
                    }
                    if (data[i].tipo === 'V') {
                        tipo = 'Venta';
                    }
                    if (data[i].tipo === 'G') {
                        tipo = 'Gananacia';
                    }
                    if (data[i].tipo === 'F') {
                        tipo = 'Fijo';
                    }
                    if (data[i].tipo === 'O') {
                        tipo = 'Otros'
                    }
                    datosComisiones.push({
                        id: data[i].idcomisionventa,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        valor: data[i].valor,
                        tipo: tipo,
                    });
                }
                this.setState({
                    comision: datosComisiones,
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

    handleSearchComision(value){
        this.searchSizePaginateComisiones(value);
        this.setState({
            buscar: value
        })
    }

    onChangeSizePagination(value){
        this.searchSizePaginateComisiones(null, value);
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        })
    }

    onChangeBuscar(event) {
        this.setState({
            buscar: event,
        });
    }

    onChangeNroPagina(event) {
        this.setState({
            nroPagination: event,
        });
    }

    onClickDelete(id) {
        this.setState({
            id: id,
            visibleDelete: true,
        });
    }

    onCancel() {
        this.setState({
            id: 0,
            visibleDelete: false,
            loading: false,
        });
    }

    onSubmitDelete() {
        this.setState({
            loading: true,
        });

        httpRequest('post', '/commerce/api/comision/delete', {
            id: this.state.id
        })
        .then(result => {
                if (result.response == 0) {
                    console.log('error de conexion');
                } else if (result.response == 1) {
                    // this.getComision(1, '', 10);
                    this.getComisiones();
                    this.onCancel();
                    message.success('exito en eliminar');
                } else if (result.response == 2) {
                    this.onCancel();
                    message.warning('No se puede eliminar');
                } else if (result.response == -2) {
                    this.setState({ noSesion: true })
                } else {
                    console.log(result);
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    // tipoComision(tipo) {
    //     var data = '';
    //     if (tipo == 'N') {
    //         data = 'Ninguno';
    //     }
    //     if (tipo == 'V') {
    //         data = 'Venta';
    //     }
    //     if (tipo == 'G') {
    //         data = 'Ganancia';
    //     }
    //     if (tipo == 'F') {
    //         data = 'Fijo';
    //     }
    //     if (tipo == 'O') {
    //         data = 'Otros';
    //     }
    //     return data;
    // }

    render(){
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        const btnNuevo = this.btnNuevo();
        return (

            
            //     <div className="cards">

            //         <div className="pulls-left">
            //             <h1 className="lbls-title">Gestionar comision de ventas</h1>
            //         </div>
            //         { btnNuevo }
            //         <div className="forms-groups">

            //             <div className="pulls-left">
            //                 <Select 
            //                     value={this.state.nroPagination}
            //                     title='Nro*'
            //                     onChange={this.onChangeNroPagina.bind(this)}
            //                     data={[
            //                         {value: 10, title: '10'},
            //                         {value: 25, title: '25'},
            //                         {value: 50, title: '50'},
            //                         {value: 100, title: '100'},
            //                     ]}
            //                 />
            //             </div>

            //             <div className="pulls-right">
            //                 <Input
            //                     value={this.state.buscar}
            //                     onChange={this.onChangeBuscar.bind(this)}
            //                     title='buscar...'
            //                 />
            //             </div>
            //         </div>
                    
            //         <div className="forms-groups">

            //             <div className="tabless">

            //                 <table className="tables-respons">

            //                     <thead>
            //                         <tr>
            //                             <th>Nro</th>
            //                             <th>Descripcion</th>
            //                             <th>Valor</th>
            //                             <th>Tipo</th>
            //                             <th>Accion</th>
            //                         </tr>
            //                     </thead>

            //                     <tbody>

            //                         {this.state.comision.map(
            //                             (resultado, key) => (
            //                                 <tr key={key}>
            //                                     <td>{key + 1}</td>
            //                                     <td>{resultado.descripcion}</td>
            //                                     <td>{resultado.valor + '%'}</td>
            //                                     <td>{this.tipoComision(resultado.tipo)}</td>
            //                                     <td>
                                                    
            //                                         { this.btnEditar(resultado.idcomisionventa) }
                                                    
            //                                         { this.btnEliminar(resultado.idcomisionventa) }
                                                    
            //                                     </td>
            //                                 </tr>
            //                             )
            //                         )}
            //                     </tbody>
            //                 </table>
            //             </div>
            //         </div>
            //     </div>
            // </div>

            <div className="rows">
                    <Confirmacion
                        visible={this.state.visibleDelete}
                        onCancel={this.onCancel.bind(this)}
                        width={320}
                        title='Eliminar Comision Venta'
                        content='Estas seguro de eliminar?'
                        onClick={this.onSubmitDelete.bind(this)}
                        loading={this.state.loading}
                    />
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Comisiones de Ventas</h1>
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
                                onChange={this.handleSearchComision.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.comision}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "nro"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {this.state.pagina}
                            pageSize = {this.state.nroPaginacion}
                            onChange = {this.changePaginationComisiones}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(IndexComision);

