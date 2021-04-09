import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, Card, message, Divider, Table, Select } from 'antd';
import ws from '../../../utils/webservices';
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';
import { httpRequest, removeAllData, readData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import keysStorage from '../../../utils/keysStorage';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import ShowVendedor from './show';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Confirmation from '../../../componentes/confirmation';
const { Option } = Select;

class IndexVendedor extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            array_vendedor: [],
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },
            cliente_es_abogado: '',

            vendedor: {},
            vendedor_contacto: [],
            idvendedor: '',

            pagina: 1,
            buscar: '',
            nroPaginacion: 10,
            timeoutSearch: undefined,

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
                title: 'Ci/Nit',
                dataIndex: 'nit',
                key: 'nit',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nit.localeCompare(b.nit)}
            },
            {
                title: 'Comision',
                dataIndex: 'comision',
                key: 'comision',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.comision.localeCompare(b.comision)}
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
            btn_ver: readPermisions(keys.vendedor_btn_ver),
            btn_nuevo: readPermisions(keys.vendedor_btn_nuevo),
            btn_editar: readPermisions(keys.vendedor_btn_editar),
            btn_eliminar: readPermisions(keys.vendedor_btn_eliminar),
            codigo: readPermisions(keys.vendedor_input_codigo),
            comision: readPermisions(keys.vendedor_select_comision),
            nit: readPermisions(keys.vendedor_input_nit),
            fecha_nac: readPermisions(keys.vendedor_fechaNacimiento),
            nombre: readPermisions(keys.vendedor_input_nombre),
            apellido: readPermisions(keys.vendedor_input_apellido),
            genero: readPermisions(keys.vendedor_select_genero),
            caracteristicas: readPermisions(keys.vendedor_caracteristicas),
            imagen: readPermisions(keys.vendedor_imagenes),
            notas: readPermisions(keys.vendedor_textarea_nota)
        }
    }
    componentDidMount() {
        this.get_data(1, '', 10);
    }
    get_data(page, buscar, sizepaginacion) {

        httpRequest('get', ws.wsvendedor + '?page=' + page, {
            buscar: buscar,
            paginate: sizepaginacion,
        })
        .then((resp) => {
            if (resp.response == 1) {
                let data = resp.data;
                let array = [];
                for (let i = 0; i < data.length; i++) {
                    array.push({
                        id: data[i].idvendedor,
                        nro: (i + 1),
                        codigo: (resp.config.codigospropios) ? data[i].codvendedor : data[i].idvendedor.toString(),
                        nombre: data[i].nombre + ' ' + data[i].apellido,
                        nit: data[i].nit,
                        comision: data[i].comision,
                    });
                }
                this.setState({
                    array_vendedor: array,
                    pagination: resp.pagination,
                    cliente_es_abogado: (resp.config.clienteesabogado)?'Abogado':'Vendedor',
                })
            } else if(resp.response == -2) {
                this.setState({ noSesion: true });
            } else {
                console.log("OCURRIO UN ERROR AL CONSULTAR A LA BASE DE DATOS");
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onCreateData() {
        var url = routes.vendedor_create;
        this.props.history.push(url);
    }
    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button title='Nuevo' type='primary'
                    onClick={this.onCreateData.bind(this)}
                />
            );
        }
        return null;
    }
    btnVer(id) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a className="btns btns-sm btns-outline-success"
                    onClick={() => this.show_data(id)}
                >
                    <i className="fa fa-eye"> </i>
                </a>
            );
        }
        return null;
    }
    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <Link  to={routes.vendedor_edit + '/' + id}
                    className="btns btns-sm btns-outline-primary"
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
                    onClick={() => this.setState({ visible: true, bandera: 2, idvendedor: id, }) }
                >
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }
    show_data(id) {
        httpRequest('get', ws.wsvendedor + '/' + id)
        .then((result) => {
            if (result.response == 1) {
                this.setState({
                    vendedor: result.vendedor,
                    vendedor_contacto: result.referencias,
                    visible: true,
                    bandera: 1,
                });
                console.log(result)
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    onChangePaginate(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }
    onDelete() {
        this.setState({
            loading: true,
        });
        httpRequest('delete', ws.wsvendedor + '/' + this.state.idvendedor)
        .then( result => {
            if (result.response == 1){
                this.setState({
                    buscar: '',
                    nroPaginacion: 10,
                });
                message.success(result.message);
                this.get_data(1, '', 10);
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            } 
            if (result.response == 0) {
                message.warning(result.message);
            }
            this.onClose();
        }).catch (error => {
            message.error(strings.message_error);
            this.onClose();
        })
    }
    handleSearchData(value){
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
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            vendedor: null,
            vendedor_contacto: [],
            idvendedor: '',
        });
    }
    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title={"Datos del " + this.state.cliente_es_abogado}
                    onCancel={this.onClose.bind(this)}
                    width={850}
                    cancelText={'Aceptar'}
                    content={
                        <ShowVendedor
                            vendedor={this.state.vendedor}
                            referencia={this.state.vendedor_contacto}
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
                    title={"Eliminar " + this.state.cliente_es_abogado}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onDelete.bind(this)}
                    width={400}
                    content = {
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <label>
                                ¿Esta seguro de eliminar el cliente?
                            </label>
                        </div>
                    }
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
                        <h1 className="lbls-title">{'Gestionar ' + this.state.cliente_es_abogado}</h1>
                    </div>
                    <div className='pulls-right'>
                        {this.btnNuevo()}
                    </div>
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <C_Select
                                value={this.state.nroPaginacion}
                                onChange={this.onChangeSizePagination.bind(this)}
                                title='Mostrar'
                                className=''
                                style={{ width: 65 }}
                                component = {[
                                    <Option key={0} value={10}>10</Option>,
                                    <Option key={1} value={25}>25</Option>,
                                    <Option key={2} value={50}>50</Option>,
                                    <Option key={3} value={100}>100</Option>,
                                ]}
                            />
                        </div>
                        <div className="pulls-right">
                            <C_Input
                                value={this.state.buscar}
                                onChange={this.handleSearchData.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_vendedor}
                                bordered = {true}
                                pagination = {false}
                                className = "tables-respons"
                                rowKey = "id"
                            />
                        </div>
                    </div>
                    <div className="pull-right py-3">
                        <Pagination
                            defaultCurrent={this.state.pagina}
                            pageSize={this.state.nroPaginacion}
                            onChange={this.onChangePaginate.bind(this)}
                            total={this.state.pagination.total}
                            showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(IndexVendedor);
