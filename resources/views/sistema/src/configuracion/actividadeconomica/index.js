
import React, { Component, Fragment } from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, Table, message, Result, Checkbox, Select } from 'antd';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import strings from '../../utils/strings';
import ws from '../../utils/webservices';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import Confirmation from '../../componentes/confirmation';
import Crear_ActividadEconomica from './crear';
const { Option } = Select;

class IndexActividadEconomica extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            loading: false,

            bandera: 0,
            iddelete: null,

            array_actividadeconomica: [],
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
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
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
            btn_nuevo: readPermisions(keys.facturacion_actividad_economica_btn_nuevo),
            btn_editar: readPermisions(keys.facturacion_actividad_economica_btn_editar),
            btn_eliminar: readPermisions(keys.facturacion_actividad_economica_btn_eliminar),
            //nombre: readPermisions(keys.sucursales_input_nombre),
            //direccion: readPermisions(keys.sucursales_input_direccion)
        }
    }
    componentDidMount() {
        this.get_data(1, '', 10);
    }
    get_data(page, value, sizePagination) {
        httpRequest('get', ws.wsactividadeconomica + '/index' + '?page=' + page, {
            buscar: value,
            paginate: sizePagination,
        }).then((result) => {
            if(result.response == 1){
                
                let array_data = [];
                var data = result.data.data;
                for (let i = 0; i < data.length; i++) {
                    array_data.push({
                        id: data[i].idfacactividadeconomica,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                    });
                }

                this.setState({
                    array_actividadeconomica: array_data,
                    pagination: result.pagination,
                    pagina: page,
                });

            }else if(result.response == -2){
                this.setState({noSesion: true});
            }else{
                console.log('Ocurrio un error al consultar la base de datos');
            }
        }).catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangePaginate(page) {
        this.get_data(page, this.state.buscar, this.state.nroPaginacion);
    }
    onChangeBuscar(value) {
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
    onChangeSizePagination(value){
        this.setState({
            nroPaginacion: value,
            pagina: 1,
        });
        this.get_data(1, this.state.buscar, value);
    }
    onCreateData() {
        this.setState({
            visible: true,
            bandera: 1,
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
    editActividadEconomica(id) {
        httpRequest('get', ws.wsactividadeconomica + '/edit/' + id)
        .then((result) => {
            if(result.response == 1){
                this.setState({
                    first_data: {
                        descripcion: result.data.descripcion,
                        id: result.data.idfacactividadeconomica,
                    },
                    visible: true,
                    bandera: 2,
                });
            }
            if (result.response == -2) {
                this.setState({ noSesion: true });
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    btnEditar(id) {
        if (this.permisions.btn_editar.visible == 'A') {
            return (
                <a onClick={() => this.editActividadEconomica(id)}
                    className="btns btns-sm btns-outline-primary"
                >
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }
    btnEliminar(id) {
        //if (this.permisions.btn_eliminar.visible == 'A') {
            return (
                <a onClick={() => 
                    this.setState({ visible: true, bandera: 3, iddelete: id, }) 
                }
                    className="btns btns-sm btns-outline-danger"
                >
                    <i className="fa fa-trash"> </i>
                </a>
            );
        //}
        //return null;
    }
    onClose() {
        setTimeout(() => {
            this.setState({
                loading: false,
                visible: false,
                first_data: {
                    id: null,
                    descripcion: '',
                },
                bandera: 0,
                iddelete: null,
            });
        }, 300);
    }
    onSubmit(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsactividadeconomica + '/store', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }
            if (result.response == 1) {

                message.success('Exito en crear actividad economica!!!');

                let array_data = [];
                var data = result.data.data;
                for (let i = 0; i < data.length; i++) {
                    array_data.push({
                        id: data[i].idfacactividadeconomica,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                    });
                }

                this.onClose();
                this.setState({
                    array_actividadeconomica: array_data,
                    pagination: result.pagination,
                    pagina: 1,
                    nroPaginacion: 10,
                    buscar: '',
                });

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
    onUpdate(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsactividadeconomica + '/update', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }
            if (result.response == 1) {

                message.success('Exito en crear actividad economica!!!');

                let array_data = [];
                var data = result.data.data;
                for (let i = 0; i < data.length; i++) {
                    array_data.push({
                        id: data[i].idfacactividadeconomica,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                    });
                }

                this.onClose();
                this.setState({
                    array_actividadeconomica: array_data,
                    pagination: result.pagination,
                    pagina: 1,
                    nroPaginacion: 10,
                    buscar: '',
                });

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
    onDelete() {
        this.setState({
            loading: true,
        });
        var body = {
            id: this.state.iddelete,
        };
        httpRequest('post', ws.wsactividadeconomica + '/destroy', body)
        .then(result => {
            if(result.response == 1){
                
                message.success('Se elimino Correctamente');
                this.get_data(1, '', 10);
                
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.response == 0) {
                message.error('No se pudo eliminar por que se encuentra en una dosificacion asignada...');
            } else {
                console.log('Hubo un error al eliminar');
            }
            this.onClose();
        }).catch(error => {
            console.log(error);
            message.error(strings.message_error);

        });
    }
    onComponentCreate() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    title={'Nueva Actividad Economica'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    footer={null}
                    width={400}
                    content={
                        <Crear_ActividadEconomica
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
                    title={'Editar Actividad Economica'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    footer={null}
                    width={400}
                    content={
                        <Crear_ActividadEconomica
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
                    title={'Eliminar Actividad Economica'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    width={380}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onDelete.bind(this)}
                    content={'Estas seguro de eliminar registro...?'}
                />
            );
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />)
        }
        return (
            <div className="rows">
                {this.onComponentCreate()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Gestionar Actividad Economica</h1>
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
                                onChange={this.onChangeBuscar.bind(this)}
                                title='Buscar'
                                className=''
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="tabless">
                            <Table
                                columns={this.columns}
                                dataSource={this.state.array_actividadeconomica}
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

export default withRouter(IndexActividadEconomica);
