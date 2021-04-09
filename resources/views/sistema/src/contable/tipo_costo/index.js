
import React, { Component, Fragment } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect, Link} from 'react-router-dom';
import routes from '../../utils/routes';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { message, Tree, Table, Pagination } from 'antd';
const { TreeNode } = Tree;
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import C_Input from '../../componentes/data/input';
import C_CheckBox from '../../componentes/data/checkbox';
import Crear_Tipo_Centro_Costo from './crear';


export default class IndexTipoCentroCosto extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],

            visible: false,
            loading: false,
            bandera: 0,

            first_data: {
                descripcion: '',
                nombreinterno: '',
                id: null,
            },
            pagination: {
                'total': 0,
                'current_page': 0,
                'per_page': 0,
                'last_page': 0,
                'from': 0,
                'to': 0,
            },

            pagina: 1,
            nroPaginacion: 10,

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
                title: 'Nombre Interno',
                dataIndex: 'nombreinterno',
                key: 'nombreinterno',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nombreinterno.localeCompare(b.nombreinterno)}
            },
            {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
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
    }
    componentDidMount(){
        this.get_data(1);
    }
    get_data(page) {
        httpRequest('get', ws.wstipocentrocosto + '/index?page=' + page).then(
            response => {
                if (response.response == 1) {

                    let array_data = [];
                    for (let i = 0; i < response.data.data.length; i++) {
                        array_data.push({
                            id: response.data.data[i].idcentrocostotipo,
                            nro: 10 * (this.state.pagina - 1) + i + 1,
                            descripcion: response.data.data[i].descripcion,
                            nombreinterno: response.data.data[i].nombreinterno,
                        });
                    }

                    this.setState({
                        data: array_data,
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
    btnNuevo() {
        return (
            <C_Button title='Nuevo'
                type='primary'
                onClick={() => {
                    this.setState({
                        visible: true,
                        bandera: 1,
                    });
                }}
            />
        );
    }
    btnVer(id) {
        return (
            <a className="btns btns-sm btns-outline-success"
                onClick={() => {
                    httpRequest('get', ws.wstipocentrocosto + '/edit/' + id).then(
                        response => {
                            if (response.response == 1) {
            
                                this.setState({
                                    first_data: {
                                        descripcion: (response.data.descripcion == null)?'':response.data.descripcion,
                                        nombreinterno: (response.data.nombreinterno == null)?'':response.data.nombreinterno,
                                        id: response.data.idcentrocostotipo,
                                    },
                                    visible: true,
                                    bandera: 3,
                                });
                                
                            }
                            if (response.response == -2) {
                                this.setState({ noSesion: true })
                            }
                        }
                    ).catch(
                        error => console.log(error)
                    );
                }}
            >
                <i className="fa fa-eye"> </i>
            </a>
        );
    }
    btnEditar(id) {
        return (
            <a className="btns btns-sm btns-outline-primary"
                onClick={() => {
                    httpRequest('get', ws.wstipocentrocosto + '/edit/' + id).then(
                        response => {
                            if (response.response == 1) {
            
                                this.setState({
                                    first_data: {
                                        descripcion: (response.data.descripcion == null)?'':response.data.descripcion,
                                        nombreinterno: (response.data.nombreinterno == null)?'':response.data.nombreinterno,
                                        id: response.data.idcentrocostotipo,
                                    },
                                    visible: true,
                                    bandera: 2,
                                });
                                
                            }
                            if (response.response == -2) {
                                this.setState({ noSesion: true })
                            }
                        }
                    ).catch(
                        error => console.log(error)
                    );
                }}
            >
                <i className="fa fa-edit"> </i>
            </a>
        );
    }
    btnEliminar(id) {
        return (
            <a className="btns btns-sm btns-outline-danger"
                onClick={() => 
                    this.setState({
                        visible: true,
                        bandera: 4,
                        first_data: {
                            descripcion: '',
                            nombreinterno: '',
                            id: id,
                        },
                    })
                }
            >
                <i className="fa fa-trash"> </i>
            </a>
        );
    }
    onCancel() {
        this.setState({

            visible: false,
            loading: false,
            bandera: 0,

            first_data: {
                descripcion: '',
                nombreinterno: '',
                id: null,
            },
        });
    }
    onSubmit(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wstipocentrocosto + '/store', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.onCancel();
                this.get_data(this.state.pagina);
                message.success(result.message);
                return;
            }

            this.onCancel();
            message.error(result.message);

        })
        .catch((error) => {
            console.log(error);
            message.error(error.message_error);
        });
    }
    onDelete(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        var data = {
            id: this.state.first_data.id,
        }
        httpRequest('post', ws.wstipocentrocosto + '/delete', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.onCancel();
                this.get_data(1);
                message.success(result.message);
                return;
            }

            this.onCancel();
            message.error(result.message);

        })
        .catch((error) => {
            console.log(error);
            message.error(error.message_error);
        });
    }
    modalComponentTipoCosto() {
        if (this.state.bandera == 1) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Nuevo Tipo Costo"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Tipo_Centro_Costo 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                        />
                    }
                    footer={false}
                />
            );
        }
        if (this.state.bandera == 2) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Editar Tipo Costo"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Tipo_Centro_Costo 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            first_data={this.state.first_data}
                        />
                    }
                    footer={false}
                />
            );
        }
        if (this.state.bandera == 3) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Ver Tipo Costo"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Tipo_Centro_Costo 
                            onCancel={this.onCancel.bind(this)}
                            first_data={this.state.first_data}
                            readOnly={true}
                            onTextCancel='Aceptar'
                        />
                    }
                    footer={false}
                />
            );
        }
        if (this.state.bandera == 4) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Eliminar Tipo Costo"
                    loading={this.state.loading}
                    width={350}
                    onCancel={this.onCancel.bind(this)}
                    onClick={this.onDelete.bind(this)}
                    content="Estas seguro de eliminar el tipo de costo"
                />
            );
        }
    }
    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const modalComponentTipoCosto = this.modalComponentTipoCosto();
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        { modalComponentTipoCosto }
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title"> Gestionar Tipo Centro Costo </h1>
                            </div>
                            <div className="pulls-right">
                                {this.btnNuevo()}
                            </div>
                        </div>
                        <div className="forms-groups">
                            <div className="tabless">
                                <Table
                                    columns={this.columns}
                                    dataSource={this.state.data}
                                    bordered = {true}
                                    pagination = {false}
                                    className = "tables-respons"
                                    rowKey = "id"
                                />
                            </div>
                        </div>
                        <div className="forms-groups">
                            <div className="pull-right py-3">
                                <Pagination
                                    defaultCurrent={1}
                                    current={this.state.pagina}
                                    defaultPageSize={this.state.nroPaginacion}
                                    pageSize={this.state.nroPaginacion}
                                    onChange={
                                        (page) => this.get_data(page)
                                    }
                                    total={this.state.pagination.total}
                                    showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                                />
                            </div>
                        </div>
                        <div className="forms-groups">
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <C_Button title=''
                                    type='primary'
                                    style={{width: '100%', padding: 10}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

