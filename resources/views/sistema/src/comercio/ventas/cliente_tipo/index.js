
import React, { Component, Fragment }  from 'react';
import { Link, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Select } from 'antd';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes'
import keys from '../../../utils/keys';
import { readPermisions } from '../../../utils/toolsPermisions';

import Confirmation from '../../../componentes/confirmation';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';
import C_Button from '../../../componentes/data/button';
import strings from '../../../utils/strings';
import Crear_Cliente_Tipo from './crear';
const { Option } = Select;

export default class IndexTipoCliente extends Component {
    constructor(props){
        super(props)
        this.state = {
            timeoutSearch: undefined,

            visible: false,
            loading: false,
            bandera: 0,

            array_clientetipo: [],
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

            first_data: {
                descripcion: '',
                id: null,
            },

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
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombre.localeCompare(b.nombre)}
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
            btn_nuevo: readPermisions(keys.tipocliente_btn_nuevo),
            btn_editar: readPermisions(keys.tipocliente_btn_editar),
            btn_eliminar: readPermisions(keys.tipocliente_btn_eliminar),
            descripcion: readPermisions(keys.tipocliente_input_descripcion)
        }
    }
    componentDidMount(){
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination){
        httpRequest('get', ws.wsTipoClientes+ '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        })
        .then((result) => {
            if(result.response == 1){
                var array = this.array_data(result.data);
                this.setState({
                    array_clientetipo: array,
                    pagination: result.pagination,
                    pagina: page,
                });
            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                message.error('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    array_data(data) {
        let array = [];
        for (let i = 0; i < data.length; i++) {
            array.push({
                id: data[i].idclientetipo,
                nro: i + 1,
                nombre: data[i].descripcion,
            });
        }
        return array;
    }
    onChangePaginate(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }
    onCreateData() {
        this.setState({
            visible: true,
            bandera: 1,
        });
    }
    getTipoCliente(id){
        this.setState({
            idTipoCliente: id,
        });
        httpRequest('get', ws.wsTipoClientes + '/' + id + '/edit')
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    visible: true,
                    bandera: 2,
                    first_data: {
                        descripcion: result.data.descripcion,
                        id: id,
                    },
                });
            }else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
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
    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a onClick={() => this.getTipoCliente(id)}
                    className="btns btns-sm btns-outline-primary"
                >
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }
    btnEliminar(id){
        if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a onClick={() => 
                    this.setState({ visible: true, bandera: 3, first_data: {descripcion: '', id: id}, }) 
                }
                    className="btns btns-sm btns-outline-danger"
                >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        }
        return null;
    }
    onSubmit(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsTipoClientes, data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }
            if (result.response == 1) {

                this.onClose();
                var array = this.array_data(result.data);
                this.setState({
                    array_clientetipo: array,
                    pagination: result.pagination,
                    pagina: 1,
                    buscar: '',
                    nroPaginacion: 10,
                });

                message.success('Exito en crear tipo de cliente!!!');
                return;
            }

            this.onClose();
            message.error(result.message);

        })
        .catch((error) => {
            console.log(error);
            message.error(error.message_error);
        });
    }
    onUpdate(data){
        this.setState({
            loading: true,
        });
        httpRequest('put', ws.wsTipoClientes + '/' + data.id, data)
        .then((result) => {
            if (result.response == 1) {

                message.success('Se actualizo correctamente el tipo de cliente');
                var array = this.array_data(result.data);
                this.setState({
                    array_clientetipo: array,
                    pagination: result.pagination,
                    pagina: 1,
                    buscar: '',
                    nroPaginacion: 10,
                });

            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
            this.onClose();
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onDelete() {
        this.setState({
            loading: true,
        });
        httpRequest('delete', ws.wsTipoClientes + '/' + this.state.first_data.id)
        .then((result) => {
            if (result.response == 1) {

                message.success('Se elimino correctamente el tipo de cliente');
                var array = this.array_data(result.data);
                this.setState({
                    array_clientetipo: array,
                    pagination: result.pagination,
                    pagina: 1,
                    buscar: '',
                    nroPaginacion: 10,
                });
                
            } else if (result.response == -2) {
                this.setState({ noSesion: true, })
            } else {
                message.warning('No se puede eliminar porque ya esta en uso');
            }
            this.onClose();
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            first_data: {
                descripcion: '',
                id: null,
            },
        });
    }
    componentModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Nuevo Tipo de Cliente"
                    footer={null}
                    width={400}
                    content={
                        <Crear_Cliente_Tipo 
                            onCancel={this.onClose.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
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
                    title="Editar Tipo de Cliente"
                    footer={null}
                    width={400}
                    content={
                        <Crear_Cliente_Tipo 
                            onCancel={this.onClose.bind(this)}
                            onSubmit={this.onUpdate.bind(this)}
                            first_data={this.state.first_data}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    loading={this.state.loading}
                    title="Eliminar Tipo de Cliente"
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onDelete.bind(this)}
                    width={400}
                    content={<label>¿Esta seguro de eliminar el tipo de cliente?</label>}
                />
            );
        }
    }
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
        });
        this.get_data(1, this.state.buscar, value);
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
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />);
        }
        return (
            <div className="rows">
                {this.componentModalShow()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Tipo de Clientes</h1>
                    </div>
                    <div className="pulls-right">
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
                                dataSource={this.state.array_clientetipo}
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
                            onChange={this.onChangePaginate.bind(this)}
                            total={this.state.pagination.total}
                            showTotal={(total, range) => 
                                <label>
                                    Mostrando {range[0]} - {range[1]} de un total de {total} registros
                                </label> 
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}
