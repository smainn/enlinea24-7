import React, { Component } from 'react';
import { message } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css'
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import routes from '../../../utils/routes';
import ws from '../../../utils/webservices';
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import C_Button from '../../../componentes/data/button';
import Confirmation from '../../../componentes/confirmation';
import strings from '../../../utils/strings';
import C_Tree from '../../../componentes/data/tree';
import Crear_Ciudad from './crear';

export default class IndexFamiliaCiudad extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            first_data: {
                descripcion: '',
                id: null,
                id_padre: null,
            },

            array_ciudad: [],
            tree_ciudad: [],
            noSesion: false,
        }
        this.permisions = {
            btn_nuevo: readPermisions(keys.famciudad_btn_nuevo)
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsfamiliaciudad + '/index')
        .then((resp) => {
            if (resp.response == -2) {
                this.setState({ noSesion: true })
            }
            if (resp.response == 1) {
                this.cargarTree(resp.data);
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }
    cargarTree(data) {
        this.setState({
            array_ciudad: data,
        });
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].idpadreciudad == null) {
                var objeto = {
                    title: (array[i].descripcion == null)?'':array[i].descripcion,
                    id: array[i].idciudad,
                    nivel: 1,
                    visible: false,
                };
                array_aux.push(objeto);
            }
        }
        this.treeFamilia(array_aux, 2);
        this.setState({
            tree_ciudad: array_aux,
        });
    }
    treeFamilia(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenFamilia(data[i].id, contador);
            data[i].children = hijos;
            this.treeFamilia(hijos, contador + 1);
        }
    }
    childrenFamilia(idpadre, contador) {
        var array =  this.state.array_ciudad;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].idpadreciudad == idpadre) {
                var objeto = {
                    title: (array[i].descripcion == null)?'':array[i].descripcion,
                    id: array[i].idciudad,
                    nivel: contador,
                    visible: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    onCreate(data) {
        this.setState({
            first_data: {
                descripcion: '',
                id: null,
                id_padre: data.id,
            },
            tree_ciudad: this.state.tree_ciudad,
            visible: true,
            bandera: 2,
        });
    }
    onEdit(data) {
        this.setState({
            first_data: {
                descripcion: data.title,
                id: data.id,
                id_padre: null,
            },
            tree_ciudad: this.state.tree_ciudad,
            visible: true,
            bandera: 3,
        });
    }
    onDelete(data) {
        this.setState({
            first_data: {
                descripcion: data.title,
                id: data.id,
                id_padre: null,
            },
            tree_ciudad: this.state.tree_ciudad,
            visible: true,
            bandera: 4,
        });
    }
    onSubmit(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsfamiliaciudad + '/store', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }
            if (result.response == 1) {

                message.success('Exito en crear ciudad!!!');
                this.onClose();
                this.cargarTree(result.data);

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
        httpRequest('post', ws.wsfamiliaciudad + '/update', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }
            if (result.response == 1) {

                message.success('Exito en editar ciudad!!!');
                this.onClose();
                this.cargarTree(result.data);

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
    onDeleteData() {
        this.setState({
            loading: true,
        });
        let body = {
            id: this.state.first_data.id,
        };
        httpRequest('post', ws.wsfamiliaciudad + '/delete', body)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onClose();
                return;
            }

            if (result.response == 0) {
                message.warning(result.message);
                this.onClose();
                return;
            }

            if (result.response == 1) {
                this.cargarTree(result.data);
                message.success('Exito en eliminar ciudad!!!');
                this.onClose();
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
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            first_data: {
                descripcion: '',
                id: null,
                id_padre: null,
            },
        });
    }
    onChangeModalShow() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation 
                    title={'Nueva Ciudad'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    footer={null}
                    width={400}
                    content={
                        <Crear_Ciudad 
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
                    title={'Nueva Sub Ciudad'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    footer={null}
                    width={400}
                    content={
                        <Crear_Ciudad 
                            onCancel={this.onClose.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            first_data={this.state.first_data}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 3) {
            return (
                <Confirmation 
                    title={'Editar Ciudad'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    footer={null}
                    width={400}
                    content={
                        <Crear_Ciudad 
                            onCancel={this.onClose.bind(this)}
                            onSubmit={this.onUpdate.bind(this)}
                            first_data={this.state.first_data}
                        />
                    }
                />
            );
        }
        if (this.state.bandera == 4) {
            return (
                <Confirmation 
                    title={'Eliminar Ciudad'}
                    visible={this.state.visible}
                    loading={this.state.loading}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onDeleteData.bind(this)}
                    width={400}
                    content={'Estas seguro de eliminar registro ...?'}
                />
            );
        }
    }
    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button 
                    title='Nuevo' type='primary'
                    onClick={ () => this.setState({ visible: true, bandera: 1 }) }
                />
            );
        }
        return null;
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
                {this.onChangeModalShow()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">Gestionar Ciudad</h1>
                        </div>
                        <div className='pulls-right'>
                            { this.btnNuevo() }
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" >   
                        </div>
                    </div>
                    <C_Tree 
                        showLine={true}
                        data={this.state.tree_ciudad}
                        onDropDown={() => this.setState({ 
                                tree_ciudad: this.state.tree_ciudad, 
                            })
                        }
                        onCreate={this.onCreate.bind(this)}
                        onEdit={this.onEdit.bind(this)}
                        onDelete={this.onDelete.bind(this)}
                    />
                </div>
            </div>
        );
    }
}