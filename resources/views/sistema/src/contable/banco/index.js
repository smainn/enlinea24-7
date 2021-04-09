
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
import Crear_Banco from './crear';
import C_Input from '../../componentes/data/input';
import C_CheckBox from '../../componentes/data/checkbox';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';


export default class IndexBanco extends Component {
    constructor(props){
        super(props)
        this.state = {

            visible: false,
            loading: false,

            tree_banco: [],
            bancos: [],

            idbanco: null,
            first_banco: {
                nombre: '',
                cuenta: '',
                id: null,
            },

            expandedKeys_banco: [],
            autoExpandParent_banco: true,

            checked_banco: false,

            bandera: 0,

            noSesion: false,
        }

        this.permisions = {
            btn_nuevo: readPermisions(keys.banco_btn_nuevo)
        }
    }
    componentDidMount(){
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsbanco + '/index').then(
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
            bancos: data,
        });
        var array = data;
        var array_aux = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].fkidbancopadre == null) {
                var objeto = {
                    cuenta: (array[i].cuenta == null)?'':array[i].cuenta,
                    nombre: array[i].nombre,
                    idbanco: array[i].idbanco,
                    nivel: 1,
                    visible: false,
                };
                array_aux.push(objeto);
            }
        }
        this.arbolFamilia(array_aux, 2);
        this.setState({
            tree_banco: array_aux,
        });
    }
    arbolFamilia(data, contador) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosFamilia(data[i].idbanco, contador);
            data[i].children = hijos;
            this.arbolFamilia(hijos, contador + 1);
        }
    }
    hijosFamilia(idpadre, contador) {
        var array =  this.state.bancos;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if (array[i].fkidbancopadre == idpadre) {
                var objeto = {
                    cuenta: (array[i].cuenta == null)?'':array[i].cuenta,
                    nombre: array[i].nombre,
                    idbanco: array[i].idbanco,
                    nivel: contador,
                    visible: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }
    btnNuevo() {
        if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <C_Button title='Nuevo'
                    type='primary'
                    onClick={
                        () => this.setState({
                            visible: true,
                            bandera: 1,
                        })
                    }
                />
            );
        }
        return null;
        
    }
    onCancel() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,
            idbanco: null,
            first_banco: {
                nombre: '',
                cuenta: '',
                id: null,
            },
        });
    }
    onLoad() {
        this.setState({
            loading: true,
        });
    }
    onSubmit(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsbanco + '/store', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.cargarTree(result.data);
                this.onCancel();
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
    onSubmitUpdate(data) {
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wsbanco + '/update', data)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                this.onCancel();
                return;
            }
            if (result.response == 1) {
                this.cargarTree(result.data);
                this.onCancel();
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
    onSubmitDelete(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        let body = {
            idbanco: this.state.idbanco,
        };
        httpRequest('post', ws.wsbanco + '/delete', body)
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
    modalBancoConfirmation(){
        if (this.state.bandera == 1) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Nuevo Banco"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Banco 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            onLoad={this.onLoad.bind(this)}
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
                    title="Nuevo Sub Banco"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Banco 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            onLoad={this.onLoad.bind(this)}
                            idbanco={this.state.idbanco}
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
                    title="Editar Banco"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Banco 
                            onCancel={this.onCancel.bind(this)}
                            onSubmit={this.onSubmitUpdate.bind(this)}
                            first_banco={this.state.first_banco}
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
                    title="Eliminar Banco"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'
                            style={{marginTop: -10}}
                        >
                            <label>¿Estas seguro de eliminar...?</label>
                        </div>
                    }
                    onCancel={this.onCancel.bind(this)}
                    onClick={this.onSubmitDelete.bind(this)}
                />
            );
        }
        if (this.state.bandera == 5) {
            return(
                <Confirmation
                    visible={this.state.visible}
                    title="Ver Banco"
                    loading={this.state.loading}
                    width={400}
                    content={
                        <Crear_Banco 
                            onCancel={this.onCancel.bind(this)}
                            first_banco={this.state.first_banco}
                            readOnly={true}
                        />
                    }
                    footer={false}
                />
            );
        }
    }
    onEdit(data) {
        data.visible = !data.visible;
        this.setState({  
            tree_banco: this.state.tree_banco,
        });
        httpRequest('get', ws.wsbanco + '/edit/' + data.idbanco)
        .then((result) => {

            if (result.response == -2) {
                this.setState({ noSesion: true });
                return;
            }

            if (result.response == 0) {
                message.warning(result.message);
                return;
            }

            if (result.response == 1) {
                this.setState({
                    first_banco: {
                        nombre: result.data.nombre,
                        cuenta: (result.data.cuenta == null)?'':result.data.cuenta,
                        id: result.data.idbanco,
                    },
                    visible: true, bandera: 3,
                });
                return;
            }
            message.error(result.message);
        })
        .catch((error) => {
            console.log(error);
            message.error(error.message_error);
        });
    }
    onDropDownBanco(data) {
        data.visible = !data.visible;
        this.setState({
            tree_banco: this.state.tree_banco,
        });
    }
    renderTreeNodeBanco(data) {
        var array = [];
        data.map(item => {
            if (item.children) {
                const menu_banco = (
                    <Menu style={{padding: 3}}>
                        <Menu.Item key="0"
                            onClick={() => {
                                item.visible = !item.visible;
                                this.setState({  
                                    tree_banco: this.state.tree_banco,
                                    visible: true, bandera: 2,
                                    idbanco: item.idbanco,
                                });
                            }}
                        >
                            Adicionar Banco
                        </Menu.Item>
                        <Menu.Item key="3"
                            onClick={() => {
                                item.visible = !item.visible;
                                this.setState({  
                                    tree_banco: this.state.tree_banco,
                                    visible: true, bandera: 5,
                                    first_banco: {
                                        nombre: item.nombre,
                                        cuenta: item.cuenta,
                                        id: null,
                                    },
                                });
                            }}
                        >
                            Ver Banco
                        </Menu.Item>
                        <Menu.Item key="1"
                            onClick={this.onEdit.bind(this, item)}
                        >
                            Editar Banco
                        </Menu.Item>
                        <Menu.Item key="2"
                            onClick={() => {
                                item.visible = !item.visible;
                                this.setState({  
                                    tree_banco: this.state.tree_banco,
                                    visible: true, bandera: 4,
                                    idbanco: item.idbanco,
                                });
                            }}
                        >
                            Eliminar Banco
                        </Menu.Item>
                    </Menu>
                );
                array.push(
                <TreeNode title={
                    <label style={{paddingRight: 5}}>{item.nombre} 
                        <Dropdown overlay={menu_banco} trigger={['click']} 
                            visible={item.visible}
                            onVisibleChange={this.onDropDownBanco.bind(this, item)}
                        >
                            <Icon type="more" 
                                style={{position: 'absolute', padding: 2, 
                                    paddingTop: 5, paddingBottom: 5,
                                    cursor: 'pointer', marginLeft: 8, border: '1px solid #e8e8e8',
                                }} 
                            />
                        </Dropdown>
                    </label>
                } 
                    key={item.idbanco} dataRef={item}
                >
                        {this.renderTreeNodeBanco(item.children)}
                    </TreeNode>
                );
            }
        });
        return array;
    }
    onExpand(expandedKeys_banco) {
        console.log(expandedKeys_banco)
        this.setState({
            expandedKeys_banco,
            autoExpandParent_banco: false,
        });
    }
    onChangeCheckedBanco(event) {
        this.setState({
            checked_banco: !this.state.checked_banco,
        });
        if (this.state.checked_banco) {
            this.setState({
                expandedKeys_banco: [],
                autoExpandParent_banco: false,
            });
        }else {
            var array = [];
            this.activarTodos(this.state.tree_banco, array);
            this.setState({
                expandedKeys_banco: array,
                autoExpandParent_banco: false,
            });
        }
    }
    activarTodos(data, array) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].children.length > 0) {
                array.push(data[i].idbanco.toString());
            }
            this.activarTodos(data[i].children, array);
        }
    }
    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            );
        }
        const modalBancoConfirmation = this.modalBancoConfirmation();
        return (
            <div className="rows">
                <div className="cards">
                    <div className="forms-groups">
                        { modalBancoConfirmation }
                        <div className="forms-groups">
                            <div className="pulls-left">
                                <h1 className="lbls-title"> Gestionar Banco </h1>
                            </div>
                            <div className="pulls-right">
                                {this.btnNuevo()}
                            </div>
                        </div>
                        <div className="forms-groups">
                            <C_Input 
                                value={(this.state.checked_banco)?'Contraer':'Expandir'}
                                readOnly={true}
                                className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 padding-0'
                                style={{cursor: 'pointer', 
                                    background: 'white',
                                }}
                                onClick={this.onChangeCheckedBanco.bind(this)}
                                suffix={
                                    <C_CheckBox
                                        style={{marginTop: -3,}}
                                        onChange={this.onChangeCheckedBanco.bind(this)}
                                        checked={this.state.checked_banco}
                                    />
                                }
                            />
                        </div>
                        <div className="forms-groups">
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 scrollbars' 
                                id={`styles-scrollbar`} style={{borderTop: '1px solid #e8e8e8', paddingTop: 0}}
                            >
                                <div className='forms-groups'>
                                    <Tree
                                        showLine
                                        //switcherIcon={<Icon type="down" />}
                                        expandedKeys={this.state.expandedKeys_banco}
                                        autoExpandParent={this.state.autoExpandParent_banco}
                                        onExpand={this.onExpand.bind(this)}
                                    >
                                        {this.renderTreeNodeBanco(this.state.tree_banco)}
                                    </Tree>
                                </div>
                            </div>
                            <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                                <div className='txts-center'>
                                    <C_Button title=''
                                        type='primary'
                                        style={{width: '100%', padding: 10}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//export default withRouter(IndexEstadoResultado);

