

import React, { Component, Fragment } from 'react';

import { Link, Redirect,withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Table, Pagination, Select, notification } from 'antd';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import ws from '../../utils/webservices';
import C_Button from '../../componentes/data/button';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import Confirmation from '../../componentes/confirmation';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';

const { Option } = Select;

class IndexCongifEERR extends Component{

    constructor(props) {
        super(props);

        this.state = {
            visible_delete: false,
            loading: false,

            id_data: null,

            array_configeerr: [],
            pagina: 1,
            nroPaginacion: 25,
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            search: '',
            timeoutSearch: undefined,
            noSesion: false
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
                title: 'Cod Accion',
                dataIndex: 'numaccion',
                key: 'numaccion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.numaccion.localeCompare(b.numaccion)}
            },
            {
                title: 'Operacion',
                dataIndex: 'operacion',
                key: 'operacion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.operacion.localeCompare(b.operacion)}
            },
            {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Cuenta',
                dataIndex: 'cuenta',
                key: 'cuenta',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.cuenta.localeCompare(b.cuenta)}
            },
            {
                title: 'Formula',
                dataIndex: 'formula',
                key: 'formula',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.formula.localeCompare(b.formula)}
            },
            {
                title: 'Valor %',
                dataIndex: 'valorporcentaje',
                key: 'valorporcentaje',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.valorporcentaje.localeCompare(b.valorporcentaje)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {/* {this.btnVer(record.id)} */}
                            {this.btnEditar(record.id)}
                            {this.btnEliminar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];

        this.permisions = {
            btn_editar: readPermisions(keys.config_eerr_btn_editar),
            btn_eliminar: readPermisions(keys.config_eerr_btn_eliminar),
            btn_nuevo: readPermisions(keys.config_eerr_btn_nuevo),
        }

    }
    componentDidMount() {
        this.get_data(1, '', 25);
    }
    get_data(page, search, nropaginacion) {
        httpRequest('get', ws.wsconfigeerr + '/index?page=' + page + '&search=' + search + '&nropaginacion=' + nropaginacion)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                console.log(result);
                var data = result.data.data;
                var array = [];
                    for (let i = 0; i < data.length; i++) {
                        array.push({
                            id: data[i].idconfigeerr,
                            nro: 10 * (page - 1) + i + 1,
                            numaccion: data[i].numaccion,
                            operacion: data[i].operacion,
                            descripcion: data[i].descripcion == null ? '' : data[i].descripcion,
                            cuenta: data[i].cuenta == null ? '' : data[i].codcuenta + ' ' + data[i].cuenta,
                            formula: data[i].formula == null ? '' : data[i].formula,
                            valorporcentaje: data[i].valorporcentaje == null ? '' : data[i].valorporcentaje,
                        });
                    }
                this.setState({
                    array_configeerr: array,
                    pagination: result.pagination,
                });
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                console.log(result);
            }
        })
        .catch(
            error => console.log(error)
        );
    }
    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={routes.configeerr_edit + '/' + id}
                    className="btns btns-sm btns-outline-primary" 
                    aria-label="editar"
                >
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(id) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger"
                    onClick={this.onDeleteData.bind(this, id)}
                >
                    <i className="fa fa-trash"> 
                    </i>
                </a>
            );
        }
        return null;
    }
    onCreateData() {
        var url = routes.configeerr_create;
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
    onDeleteData(id) {
        this.setState({
            id_data: id,
        });
        setTimeout(() => {
            this.setState({
                visible_delete: true,
            });
        }, 500);
    }
    onChangePaginate(page) {
        this.get_data(page, this.state.search, this.state.nroPaginacion);
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
        });
        this.get_data(1, this.state.search, value);
    }
    onchangeSearch(value) {
        var search = value;
        this.setState({
            search: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(
            () => this.get_data(1, search, this.state.nroPaginacion), 500
        );
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    componentDelete() {
        return (
            <Confirmation
                visible={this.state.visible_delete}
                loading={this.state.loading}
                onCancel={() => this.setState({ id_data: null, visible_delete: false, })}
                title='ELIMINAR INFORMACION'
                onClick={this.onStore.bind(this)}
                content='¿Estas seguro de eliminar...?'
            />
        );
    }
    onStore() {
        this.setState({
            loading: true,
        });
        let body = {
            id: this.state.id_data,
        };
        httpRequest('post', ws.wsconfigeerr + '/delete', body)
        .then((result) => {
            console.log(result)
            if (result.response == 0) {
                notification.warning({
                    message: 'ALERTA',
                    description:
                        'NO SE PUEDE ELIMINAR YA QUE TIENE UN PROCESO REGISTRADO...',
                });
                this.setState({
                    loading: false,
                });
                return;
            }
            if (result.response > 0) {
                
                notification.success({
                    message: 'SUCCESS',
                    description:
                        'EXITO EN ELIMINAR INFORMACION...',
                });
                this.setState({
                    loading: false,
                    visible_delete: false,
                    id_data: null,
                });
                this.get_data(1, this.state.search, this.state.nroPaginacion);
                
            } else if (result.response == -2) {
                notification.error({
                    message: 'Sesion',
                    description:
                        'TIEMPO DE SESION TERMINADO. FAVOR DE INGRESAR NUEVAMENTE',
                });
                setTimeout(() => {
                    this.setState({ noSesion: true, });
                }, 300);
            } else {
                message.error('Ocurrio un problema al guardar, intentelo nuevmente');
                this.setState({
                    loading: false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
            });
            message.error('Ocurrio un problema con la conexion, revise su conexion e intentlo nuevamente');
        });
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            );
        }
        return (
            <div className="rows">
                {this.componentDelete()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">
                                GESTION DE DEFINICION PARA ESTADO DE RESULTADO
                            </h1>
                        </div>
                        { this.btnNuevo() }
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePagination.bind(this)}
                                title = 'Mostrar'
                                className = ''
                                style = {{ width: 65 }}
                                component = {[
                                    <Option key = {0} value = {25}>25</Option>,
                                    <Option key = {2} value = {50}>50</Option>,
                                    <Option key = {3} value = {100}>100</Option>,
                                ]}
                            />
                        </div>
                        <div className="pulls-right">
                            <C_Input
                                value={this.state.search}
                                onChange={this.onchangeSearch.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_configeerr}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent = {this.state.pagina}
                            pageSize = {this.state.nroPaginacion}
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

export default withRouter(IndexCongifEERR);
