import React, { Component, Fragment } from 'react';
import { message, Select, Spin, Icon, Table, Pagination } from 'antd';
import { Redirect, withRouter, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import Confirmation from '../../../componentes/confirmation';
import C_Button from '../../../componentes/data/button';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';

const {Option} = Select;

class IndexTraspasos extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            configCodigo: false,
            objecto: {},
            arrayData: [],
            timeoutSearch: undefined,

            pagination: {
                total: 0,
                current_page: 0,
                per_page: 0,
                last_page: 0,
                from: 0,
                to:   0
            },

            offset : 3,
            nroPagination: 10,
            pagina: 1,
            buscar: '',
            noSesion: false
        }
        this.permisions = {
            btn_nuevo: readPermisions(keys.traspaso_btn_nuevo),
            btn_editar: readPermisions(keys.traspaso_btn_editar),
            btn_eliminar: readPermisions(keys.traspaso_btn_eliminar)
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
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.tipo.localeCompare(b.tipo)}
            },
            {
                title: 'Almacen Salida',
                dataIndex: 'almacensalida',
                key: 'almacensalida',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.almacensalida.localeCompare(b.almacensalida)}
            },
            {
                title: 'Almacen Entrante',
                dataIndex: 'almacenentrante',
                key: 'almacenentrante',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.almacenentrante.localeCompare(b.almacenentrante)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record.id)}
                            {this.btnEliminar(record)}
                        </Fragment>
                    );
                }
            },
        ];
        this.btnNuevo = this.btnNuevo.bind(this);
    }

    onNuevoTraspaso() {
        var url = routes.traspaso_producto_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button onClick={this.onNuevoTraspaso.bind(this)}
                        type='primary' title='Nuevo'
                    />
                </div>
            );
        }
        return null;
    }

    componentDidMount() {
        this.getData(1, '', 10);
    }

    getData(page, buscar, nroPaginacion) {
        var url = ws.wstraspasoproducto + '?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion;
        httpRequest('get', url)
        .then( result => {
            console.log( result )
            if (result.response == -2) {
                this.setState({ noSesion: true})
            } else {
                let array_data = [];
                var data = result.data.data;
                for (let i = 0; i < data.length; i++) {
                    array_data.push({
                        id: data[i].idtraspasoproducto,
                        nro: (i + 1),
                        codigo: result.config.codigospropios ? data[i].codtraspaso == null ? data[i].idtraspasoproducto : data[i].codtraspaso  : data[i].idtraspasoproducto,
                        tipo: data[i].tipo,
                        almacensalida: data[i].almacen_salida,
                        almacenentrante: data[i].almacen_entra,

                        fkidalmacen_entra: data[i].fkidalmacen_entra,
                        fkidalmacen_sale: data[i].fkidalmacen_sale,
                        idtraspasoproducto: data[i].idtraspasoproducto,
                    });
                }

                this.setState({
                    arrayData: array_data,
                    pagination: result.pagination,
                    pagina: page,
                });
            }
        }).catch( error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }

    onChangeIsActivedPaginate() {
        return this.state.pagination.current_page;
    }

    onChangePagesNumber() {
        if (!this.state.pagination.to){
            return [];
        }
        var from = this.state.pagination.current_page - this.state.offset;
        if (from < 1){
            from = 1;
        }
        var to = from + (this.state.offset * 2);
        if (to >=this.state.pagination.last_page){
            to = this.state.pagination.last_page;
        }
        var pageArray = [];
        while (from <= to){
            pageArray.push(from);
            from++;
        }
        return pageArray;
    }

    cambiarPagina(page, buscar, nroPaginacion) {
        this.state.pagination.current_page = page;
        this.setState({
            pagination: this.state.pagination
        });
        this.getData(page,  buscar, nroPaginacion);
    }

    onChangeBuscarDato(value) {
        this.setState({
            buscar: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.getData(1, value, this.state.nroPagination), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }

    onChangeEnter(e){
        if (e.key === 'Enter') {
            this.getData(1, this.state.buscar, this.state.nroPagination);
        }
    }

    onChangeBuscar() {
        this.getData(1, this.state.buscar, this.state.nroPagination);
    }

    onChangeNroPagination(e) {
        this.setState({
            nroPagination: e
        });
        this.getData(1, this.state.buscar, e);
    }

    btnEliminar(objecto) {
        return (
            <a className="btns btns-sm btns-outline-danger"
                onClick={this.onDeleteTraspaso.bind(this, objecto)}
                >
                <i className="fa fa-trash"> 
                </i>
            </a>
        );
    }
    onDeleteTraspaso(objecto) {
        console.log( objecto )
        this.setState({
            visible: true,
            objecto: objecto,
        });
    }
    handleCerrarModal() {
        this.setState({
            visible: false,
            loading: false,
            objecto: {},
        });
    }

    componentConfirmacion() {
        return (
            <Confirmation
                visible={this.state.visible}
                title='Eliminar Traspaso'
                loading={this.state.loading}
                onCancel={this.handleCerrarModal.bind(this)}
                onClick={this.onSubmitDelete.bind(this)}
                content={
                    <label style={{paddingBottom: 5}}>
                        ¿Desea eliminar los registros...?
                    </label>
                }
            />
        );
    }

    onSubmitDelete() {
        var body = {
            id: this.state.objecto.idtraspasoproducto,
            fkidalmacen_entra: this.state.objecto.fkidalmacen_entra,
            fkidalmacen_sale: this.state.objecto.fkidalmacen_sale,
        };
        this.setState({ loading: true, });
        console.log( body )
        httpRequest('post', ws.wstraspasodestroy, body)
        .then((result) => {
            console.log( result )
            if (result.response == 1) {
                message.success('Exito en eliminar traspaso');
                this.getData(1, '', 10);
            }
            if (result.response == -2) {
                this.setState({ noSesion: true })
            }
            this.handleCerrarModal();
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
            this.handleCerrarModal();
        });
    }
    btnVer(id) {
        return (
            <Link to={routes.traspaso_producto_show + '/' + id}
                className="btns btns-sm btns-outline-success"
                >
                <i className="fa fa-eye"> </i>
            </Link>
        );
    }

    onChangePaginate(page) {
        this.getData(page, this.state.buscar, this.state.nroPagination);
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
            <div className="rows">
                {this.componentConfirmacion()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Traspaso Producto </h1>
                        </div>
                        { btnNuevo }
                    </div>

                    <div className="forms-groups">

                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPagination}
                                onChange = {this.onChangeNroPagination.bind(this)}
                                title = 'Mostrar'
                                className = ''
                                style = {{ width: 70 }}
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
                                onChange={this.onChangeBuscarDato.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.arrayData}
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
                            pageSize = {this.state.nroPagination}
                            onChange = {this.onChangePaginate.bind(this)}
                            total = {this.state.pagination.total}
                            showTotal = {(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(IndexTraspasos);