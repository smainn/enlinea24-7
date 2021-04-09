
import React, { Component } from 'react';
import C_Button from '../../componentes/data/button';
import {withRouter, Redirect} from 'react-router-dom';
import routes from '../../utils/routes';
import { httpRequest, removeAllData } from '../../utils/toolsStorage';
import ws from '../../utils/webservices';
import { message, Tree, Icon, Dropdown, Menu } from 'antd';
const { TreeNode } = Tree;
import "antd/dist/antd.css";
import Confirmation from '../../componentes/confirmation';
import C_Input from '../../componentes/data/input';
import C_CheckBox from '../../componentes/data/checkbox';
import Crear_Centro_Costo from './crear';
import C_Tree from '../../componentes/data/tree';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';


export default class Index_centro_Costo extends Component {
    constructor(props){
        super(props)
        this.state = {

            visible: false,
            loading: false,

            estado_event : 0,

            tree_centro_costo: [],
            centro_costo: [],

            first_data: {
                nombre: '',
                codigo: '',
                id: null,
                id_padre: null,
                idcentrocostotipo: null,
            },
            readOnly: {
                nombre: false,
                codigo: false,
                tipo: false,
            },
            title: '',

            checked_banco: false,

            bandera: 0,

            noSesion: false,
        }

        this.permisions = {
            btn_nuevo: readPermisions(keys.centro_costo_btn_nuevo)
        }
    }

    componentDidMount(){
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wscentrocosto + '/index').then(
            response => {
                if (response.response == 1) {
                    this.cargarTree(response.data);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true })
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    cargarTree(data) {
        this.setState({
            centro_costo: data,
        });
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidcentrodecostopadre == null) {
                var objeto = {
                    codigo: (array[i].codcentrocosto == null)?'':array[i].codcentrocosto,
                    title: (array[i].nombre == null)?'':array[i].nombre,
                    id: array[i].idcentrodecosto,
                    fkidcentrocostotipo: array[i].fkidcentrocostotipo,
                    nivel: 1,
                    visible: false,
                };
                array_aux.push(objeto);
            }
        }
        this.arbolFamilia(array_aux, 2);
        this.setState({
            tree_centro_costo: array_aux,
        });
    }
    arbolFamilia(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].id, contador);
            data[i].children = hijos;
            this.arbolFamilia(hijos, contador + 1);
        }
    }
    hijosFamilia(idpadre, contador) {
        var array =  this.state.centro_costo;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidcentrodecostopadre == idpadre) {
                var objeto = {
                    codigo: (array[i].codcentrocosto == null)?'':array[i].codcentrocosto,
                    title: (array[i].nombre == null)?'':array[i].nombre,
                    id: array[i].idcentrodecosto,
                    fkidcentrocostotipo: array[i].fkidcentrocostotipo,
                    nivel: contador,
                    visible: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }

    btnNuevo() {
        //if (this.permisions.btn_nuevo == 'A') {
            return (
                <C_Button title='Nuevo'
                    type='primary'
                    onClick={() => {
                        this.setState({
                            visible: true,
                            bandera: 1,
                            estado_event: 1,
                            title: 'Nuevo Centro Costo',
                        });
                    }}
                />
            );
        //}
        //return null;
    }
    
    onCancel() {
        this.setState({

            visible: false,
            loading: false,
            bandera: 0,
            estado_event: 0,

            first_data: {
                codigo: '',
                nombre: '',
                id: null,
                id_padre: null,
                idcentrocostotipo: null,
            },

            readOnly: {
                nombre: false,
                codigo: false,
                tipo: false,
            },

        });
    }
    onSubmit(data) {
        if (this.state.estado_event == 1) {
            this.onSubmitData(data);
        }
        if (this.state.estado_event == 2) {
            this.onUpdateData(data);
        }
        if (this.state.estado_event == 3) {
            this.onDeleteData();
        }
    }
    onSubmitData(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscentrocosto + '/store', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.onCancel();
                this.cargarTree(result.data);
                message.success(result.message);
                return;
            }

            this.onCancel();
            message.error(result.message);

        })
        .catch((error) => {
            message.error(error.message_error);
        });
    }
    onUpdateData(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscentrocosto + '/update', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.onCancel();
                this.cargarTree(result.data);
                message.success(result.message);
                return;
            }

            this.onCancel();
            message.error(result.message);

        })
        .catch((error) => {
            message.error(error.message_error);
        });
    }
    onDeleteData() {
        this.setState({
            loading: true,
        });
        let body = {
            id: this.state.first_data.id,
        };
        httpRequest('post', ws.wscentrocosto + '/delete', body)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }

            if (result.response == 0) {
                message.warning(result.message);
                this.onCancel();
                return;
            }

            if (result.response == 1) {
                this.cargarTree(result.data);
                message.success(result.message);
                this.onCancel();
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
    modalConfirmation() {
        if (this.state.bandera == 1) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title={this.state.title}
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Centro_Costo 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            first_data={this.state.first_data}
                            readOnly={this.state.readOnly}
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
                    title={this.state.title}
                    loading={this.state.loading}
                    width={400}
                    content={'Estas seguro de eliminar registro ...?'}
                    onCancel={this.onCancel.bind(this)}
                    onClick={this.onSubmit.bind(this)}
                />
            );
        }
        if (this.state.bandera == 3) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title={this.state.title}
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Centro_Costo 
                            onCancel={this.onCancel.bind(this)}
                            first_data={this.state.first_data}
                            readOnly={this.state.readOnly}
                        />
                    }
                    footer={false}
                />
            );
        }
    }
    onCreate(data) {
        this.setState({

            first_data: {
                codigo: '',
                nombre: '',
                id: null,
                id_padre: data.id,
                idcentrocostotipo: data.fkidcentrocostotipo,
            },

            title: 'Nuevo Centro Costo',

            readOnly: {
                nombre: false,
                codigo: false,
                tipo: true,
            },

            tree_centro_costo: this.state.tree_centro_costo,
            visible: true,
            bandera: 1,
            estado_event: 1,
        });
    }
    onEdit(data) {
        this.setState({

            first_data: {
                codigo: data.codigo,
                nombre: data.title,
                id: data.id,
                id_padre: null,
                idcentrocostotipo: data.fkidcentrocostotipo,
            },

            title: 'Editar Centro Costo',

            readOnly: {
                nombre: false,
                codigo: false,
                tipo: true,
            },

            tree_centro_costo: this.state.tree_centro_costo,
            visible: true,
            bandera: 1,
            estado_event: 2,
        });
    }
    onDelete(data) {
        this.setState({

            first_data: {
                codigo: data.codigo,
                nombre: data.title,
                id: data.id,
                id_padre: null,
                idcentrocostotipo: data.fkidcentrocostotipo,
            },

            title: 'Eliminar Centro Costo',

            tree_centro_costo: this.state.tree_centro_costo,
            visible: true,
            bandera: 2,
            estado_event: 3,
        });
    }
    onShow(data) {
        this.setState({

            first_data: {
                codigo: data.codigo,
                nombre: data.title,
                id: data.id,
                id_padre: null,
                idcentrocostotipo: data.fkidcentrocostotipo,
            },

            title: 'Detalle Centro Costo',

            readOnly: {
                nombre: true,
                codigo: true,
                tipo: true,
            },

            tree_centro_costo: this.state.tree_centro_costo,
            visible: true,
            bandera: 3,
            estado_event: 2,
        });
    }
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const modalBancoConfirmation = this.modalConfirmation();
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        { modalBancoConfirmation }
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title"> Gestionar Centro Costo </h1>
                            </div>
                            <div className="pulls-right">
                                {this.btnNuevo()}
                            </div>
                        </div>
                        <C_Tree 
                            showLine={true}
                            data={this.state.tree_centro_costo}
                            onDropDown={() => this.setState({ 
                                    tree_centro_costo: this.state.tree_centro_costo 
                                })
                            }
                            onCreate={this.onCreate.bind(this)}
                            onEdit={this.onEdit.bind(this)}
                            onDelete={this.onDelete.bind(this)}
                            onShow={this.onShow.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

//export default withRouter(IndexEstadoResultado);

