import React, { Component, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { render} from 'react-dom';
import { message, Pagination, Select, Table } from 'antd';
import "antd/dist/antd.css";     // for css
import ShowCliente from './show';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keys from '../../../utils/keys';
import ws from '../../../utils/webservices';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

import PropTypes from 'prop-types';

class IndexCliente extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            array_cliente: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            
            cliente: null,
            cliente_contacto: [],

            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,
            idcliente: '',
            noSesion: false,
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
    }
    componentDidMount(){
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wscliente + '?page=' + page, {
                buscar: value,
                paginate: sizePagination,
            }).then(
            response => {
                if (response.response == 1) {

                    let array_data = [];
                    var data = response.data;
                    for (let i = 0; i < data.length; i++) {
                        let apellido;
                        if(data[i].apellido == null) {
                            apellido = data[i].nombre;
                        } else {
                            apellido = data[i].nombre + ' ' + data[i].apellido;
                        }
                        array_data.push({
                            id: data[i].idcliente,
                            nro: (i + 1),
                            codigo: (response.config.codigospropios == false) ? data[i].idcliente.toString() : data[i].codcliente,
                            nombre: apellido,
                            tipo: (data[i].tipopersoneria == 'J') ? 'Juridico' : 'Natural',
                        });
                    }
                    this.setState({
                        array_cliente: array_data,
                        pagination: response.pagination,
                        pagina: page,
                    });
                    
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    onCreateData() {
        var url = routes.cliente_create;
        this.props.history.push(url);
    }
    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button onClick={this.onCreateData.bind(this)}
                    type='primary' title='Nuevo'
                />
            );
        }
        return null;
    }
    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a onClick={this.verDatosCliente.bind(this, data)}
                    className="btns btns-sm btns-outline-success">
                    <i className="fa fa-eye"></i>
                </a>
            );
        }
        return null;
    }
    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link to={routes.cliente_edit + '/' + data}
                    className="btns btns-sm btns-outline-primary">
                    <i className="fa fa-edit"></i>
                </Link>
            );
        }
        return null;
    }
    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-danger"
                    onClick={() => this.setState({ visible: true, idcliente: data, bandera: 2, })}
                >
                    <i className="fa fa-trash"></i>
                </a>
            );
        }
        return null;
    }
    verDatosCliente(id) {
        httpRequest('post', ws.wsshowcliente, {idCliente: id})
        .then(result =>{
                if (result.response == -2) {
                    this.setState({ noSesion: true });
                }
                if (result.response == 1) {
                    this.setState({
                        cliente: result.cliente,
                        cliente_contacto: result.clientecontacto,
                        visible: true,
                        bandera: 1,
                    });
                }
            }
        )
        .catch((error) => {
            message.error(strings.message_error);
        })
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }
    handleSearchCliente(value){
        this.setState({
            buscar: value,
        });
        if (this.state.timeoutSearch) {
            clearTimeout(this.state.timeoutSearch);
            this.setState({ timeoutSearch: undefined});
        }
        this.state.timeoutSearch = setTimeout(() => this.get_data(1, value, this.state.nroPaginacion), 300);
        this.setState({ timeoutSearch: this.state.timeoutSearch});
    }
    onChangePaginate(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            idcliente: '',
            cliente: null,
            cliente_contacto: [],
        });
    }
    onDelete() {
        this.setState({
            loading: true,
        });
        httpRequest('delete', ws.wscliente + '/' + this.state.idcliente)
        .then( result => {
            if (result.response == 1){
                this.setState({
                    buscar: '',
                    nroPaginacion: 10,
                });
                message.success('Exito en eliminar cliente!!!');
                this.get_data(1, '', 10);
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            } 
            if (result.response == 0) {
                message.warning("No se pudo eliminar por que se encuentra registrado en una transaccion");
            }
            this.onClose();
        }).catch (error => {
            message.error(strings.message_error);
            this.onClose();
        })
    }
    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Datos de Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClose={this.onClose.bind(this)}
                    width={850}
                    cancelText={'Aceptar'}
                    content={
                        <ShowCliente
                            contactoCliente={this.state.cliente_contacto}
                            cliente={this.state.cliente}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Eliminar Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onDelete.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de eliminar el cliente?
                            </label>
                        </div>
                    ]}
                />
            );
        }
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
                {this.componentModalShow()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Clientes</h1>
                    </div>
                    <div className="pulls-right">
                        { this.btnNuevo() }
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value = {this.state.nroPaginacion}
                                onChange = {this.onChangeSizePagination.bind(this)}
                                title='Mostrar'
                                className=''
                                style={{ width: 65 }}
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
                                dataSource={this.state.array_cliente}
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

export default withRouter(IndexCliente);

IndexCliente.propTypes = {
    array_cliente: PropTypes.array,
    get_cliente: PropTypes.func,
 }
  
 IndexCliente.defaultProps = {
    array_cliente: [],
    get_cliente: undefined,
 }

