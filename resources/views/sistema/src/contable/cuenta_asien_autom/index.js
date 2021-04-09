

import React, { Component, Fragment } from 'react';

import { Link, Redirect,withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Table, Pagination, Select, notification, Icon } from 'antd';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import ws from '../../utils/webservices';
import C_Button from '../../componentes/data/button';
import C_Select from '../../componentes/data/select';
import C_Input from '../../componentes/data/input';
import Confirmation from '../../componentes/confirmation';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import Editar_CuentaAsienAutom from './edit';

const { Option } = Select;

class CuentaAsienAutom extends Component{

    constructor(props) {
        super(props);

        this.state = {
            visible_edit: false,
            loading: false,

            array_data: [],

            pagina: 1,
            nroPaginacion: 20,
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },

            id_data: null,

            tree_cuenta: [],
            first_data: {
                idcuentaplan: null,
                codcuenta: null,
                nombrecuenta: null,
                valor: null,
            },

            numniveles: -1,

            noSesion: false,
        };

        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Clave',
                dataIndex: 'clave',
                key: 'clave',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.clave.localeCompare(b.clave)}
            },
            {
                title: 'Descripcion Cuenta',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Cod Cuenta',
                dataIndex: 'codcuenta',
                key: 'codcuenta',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.codcuenta.localeCompare(b.codcuenta)}
            },
            {
                title: 'Nombre cuenta',
                dataIndex: 'nombrecuenta',
                key: 'nombrecuenta',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombrecuenta.localeCompare(b.nombrecuenta)}
            },
            {
                title: 'Valor %',
                dataIndex: 'valor',
                key: 'valor',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.valor.localeCompare(b.valor)}
            },
            {
                title: 'Opcion',
                key: 'opciones',
                render: record => {
                    return (
                        <Fragment>
                            {this.btnEditar(record.id)}
                        </Fragment>
                    );
                }
            },
        ];

        this.permisions = {
            // btn_editar: readPermisions(keys.config_eerr_btn_editar),
        };

    }
    componentDidMount() {
        this.get_data(1, '', 20);
    }
    get_data(page, search, nropaginacion) {
        httpRequest('get', ws.wscuenta_asien_autom + '/index?page=' + page + '&search=' + search + '&nropaginacion=' + nropaginacion)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                console.log(result);
                var data = result.data.data;
                var array = [];
                    for (let i = 0; i < data.length; i++) {
                        array.push({
                            id: data[i].idctbdefictasasientautom,
                            nro: 20 * (page - 1) + i + 1,
                            clave: data[i].clave,
                            descripcion: data[i].descripcion,
                            codcuenta: data[i].codcuenta == null ? '' : data[i].codcuenta,
                            nombrecuenta: data[i].nombrecuenta == null ? '' : data[i].nombrecuenta,
                            valor: parseFloat(data[i].valor).toFixed(2),
                        });
                    }
                this.setState({
                    array_data: array,
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
    onEditData(id) {
        httpRequest('post', ws.wscuenta_asien_autom + '/edit', {id: id,})
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                this.setState({
                    id_data: id, visible_edit: true,
                    first_data: { idcuentaplan: result.data.fkidcuentaplan, codcuenta: result.data.codcuenta,
                        nombrecuenta: result.data.nombrecuenta, valor: result.data.valor,
                    },
                    numniveles: result.cuentaconfig == null ? -1 : parseInt(result.cuentaconfig.numniveles),
                });
                this.cargarTreeCuenta(result.cuenta, result.cuentapadre);
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
    cargarTreeCuenta(array_cuenta, cuentapadre) {
        var array = cuentapadre;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            var objeto = {
                title: array[i].codcuenta + ' ' + array[i].nombre,
                value: array[i].codcuenta + ' ' + array[i].nombre,
                idcuentaplan: array[i].idcuentaplan,
                nombrecuenta: array[i].nombre,
                codcuenta: array[i].codcuenta,
                nivel: 1,
            };
            array_aux.push(objeto);
        }
        this.treeCuenta(array_aux, array_cuenta, 2);
        this.setState({
            tree_cuenta: array_aux,
        });
    }
    treeCuenta(data, array_cuenta, nivel) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenCuenta(data[i].idcuentaplan, array_cuenta, nivel);
            data[i].children = hijos;
            this.treeCuenta(hijos, array_cuenta, nivel + 1);
        }
    }
    childrenCuenta(idpadre, array_cuenta, nivel) {
        var array = array_cuenta;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcuentaplanpadre == idpadre) {
                var objeto = {
                    title: array[i].codcuenta + ' ' + array[i].nombre,
                    value: array[i].codcuenta + ' ' + array[i].nombre,
                    idcuentaplan: array[i].idcuentaplan,
                    nombrecuenta: array[i].nombre,
                    codcuenta: array[i].codcuenta,
                    nivel: nivel,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    btnEditar(id) {
        //if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-primary"
                    onClick={this.onEditData.bind(this, id)}
                >
                    <Icon type='edit' />
                </a>
            );
        //}
        //return null;
    }
    onCancel() {
        this.setState({
            visible_edit: false,
            loading: false,
            id_data: null,
            first_data: {
                idcuentaplan: null, codcuenta: null,
                nombrecuenta: null, valor: null,
            },
        });
    }
    onSubmit(data) {
        this.setState({loading: true, });
        data.id = this.state.id_data;
        httpRequest('post', ws.wscuenta_asien_autom + '/update', data)
        .then(result => {
            if (result.response == 0) {
                console.log('error en la conexion');
            } else if (result.response == 1) {
                notification.success({
                    message: 'SUCCESS',
                    description: 'EXITO EN EDITAR INFORMACION.',
                });
                this.onCancel();
                this.get_data(1, '', 20);
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
    componentEdit() {
        if (this.state.id_data == null) {
            return null;
        }
        return (
            <Confirmation
                visible={this.state.visible_edit}
                loading={this.state.loading}
                title="EDITAR INFORMACION"
                //onClick={this.onSalir.bind(this)}
                width={550}
                content={
                    <Editar_CuentaAsienAutom 
                        onCancel={this.onCancel.bind(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        first_data={this.state.first_data}
                        tree_cuenta={this.state.tree_cuenta}
                        numniveles={this.state.numniveles}
                    />
                }
            />
        );
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
                {this.componentEdit()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title" style={{fontSize: 18,}}>
                                DEFINICION DE CUENTAS QUE PARTICIPAN EN LOS ASIENTOS AUTOMATICOS PARA INTEGRAR EL SISTEMA COMERCIAL
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_data}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent={this.state.pagina}
                            pageSize={this.state.nroPaginacion}
                            //onChange = {this.onChangePaginate.bind(this)}
                            total={this.state.pagination.total}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CuentaAsienAutom);
