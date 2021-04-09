

import React, { Component } from 'react';

import { Link, Redirect,withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, Table, Pagination, Select, notification } from 'antd';
import { removeAllData, httpRequest } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import ws from '../../utils/webservices';
import C_Button from '../../componentes/data/button';
import Confirmation from '../../componentes/confirmation';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_TreeSelect from '../../componentes/data/treeselect';
import { readPermisions } from '../../utils/toolsPermisions';
import keys from '../../utils/keys';

const { Option } = Select;

class CreateCongifEERR extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible_cancelar: false,
            visible_submit: false,
            loading: false,

            numaccion: '',
            operacion: '',
            descripcion: '',
            formula: '',
            valorporcentual: '',
            idcuentaplan: '',

            array_cuentaplan: [],
            tree_cuentaplan: [],

            noSesion: false
        }

        this.permisions = {
            codigoaccion: readPermisions(keys.config_eerr_input_codigoaccion),
            operacion: readPermisions(keys.config_eerr_input_operacion),
            formula: readPermisions(keys.config_eerr_input_formula),
            valorporcentual: readPermisions(keys.config_eerr_input_valorporcentual),
            descripcion: readPermisions(keys.config_eerr_input_descripcion),
            plandecuenta: readPermisions(keys.config_eerr_input_plandecuenta),
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wsconfigeerr + '/create').then(
            response => {
                if (response.response == 1) {
                    console.log(response)
                    this.setState({
                        array_cuentaplan: response.cuentaplan,
                    });
                    this.cargarTree(response.cuentapadre);
                }
                if (response.response == -2) {
                    this.setState({ noSesion: true });
                }
            }
        ).catch(
            error => console.log(error)
        );
    }
    cargarTree(data) {
        var array_aux = [];
        for (var i = 0; i < data.length; i++) {
            var objeto = {
                title: data[i].nombre,
                value: data[i].idcuentaplan,
            };
            array_aux.push(objeto);
        }
        this.TreeFamily(array_aux);
        this.setState({
            tree_cuentaplan: array_aux,
        });
    }
    TreeFamily(data) {
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.childrenFamily(data[i].value);
            data[i].children = hijos;
            this.TreeFamily(hijos);
        }
    }
    childrenFamily(idpadre) {
        var array =  this.state.array_cuentaplan;
        var children = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].fkidcuentaplanpadre == idpadre){
                var elemento = {
                    title: array[i].nombre,
                    value: array[i].idcuentaplan,
                };
                children.push(elemento);
            }
        }
        return children;
    }
       
    onChangeNumAccion(value) {
        if (value == '') {
            this.setState({
                numaccion: '',
            });
        }
        if (value.toString().length < 2 && isNaN(value)) {
            this.setState({
                numaccion: value.toString().toUpperCase(),
            });
        }
    }
    onChangeFormula(value) {
        this.setState({
            formula: value,
        });
    }
    onChangeValorPorcentual(value) {
        if (value == '') {
            this.setState({
                valorporcentual: '',
            });
        }
        if (!isNaN(value)) {
            if (parseInt(value) > 0) {
                this.setState({
                    valorporcentual: value,
                });
            }
        }
    }
    onChangeIDCuenta(value) {
        if (typeof value == 'undefined') {
            this.setState({
                idcuentaplan: '',
            });
            return;
        }
        this.setState({
            idcuentaplan: value,
        });
    }
    onValidar_data() {
        if (this.state.numaccion.toString().trim().length == 0) {
            message.error('NO SE PERMITE CODIGO DE ACCION VACIO...');
            return;
        }
        if (this.state.operacion.toString().trim().length == 0) {
            message.error('NO SE PERMITE OPERACION VACIO...');
            return;
        }
        this.setState({
            visible_submit: true,
        });
    }
    onBack() {
        this.setState({
            visible_cancelar: true,
        });
    }
    onSalir() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 500);
    }
    componentOperacion() {
        let arr = [
            <Option key={-1} value={''}>
                {'Seleccionar ... '}
            </Option>,
            <Option key={1} value={'+'}>
                {' Suma '}
            </Option>,
            <Option key={2} value={'-'}>
                {' Resta '}
            </Option>,
            <Option key={3} value={'*'}>
                {' Multiplicacion '}
            </Option>,
            <Option key={4} value={'/'}>
                {' Division '}
            </Option>,
        ];
        return arr;
    }
    componentBack() {
        return (
            <Confirmation
                visible={this.state.visible_cancelar}
                loading={this.state.loading}
                title="Cancelar Registro"
                onCancel={() => this.setState({visible_cancelar: false,})}
                onClick={this.onSalir.bind(this)}
                width={400}
                content={'¿Esta seguro de cancelar los registro? Los datos ingresados se perderan.'}
            />
        );
    }
    componentSubmit() {
        return (
            <Confirmation
                visible={this.state.visible_submit}
                loading={this.state.loading}
                title="REGISTRAR INFORMACION"
                onCancel={() => this.setState({visible_submit: false,})}
                onClick={this.storeData.bind(this)}
                width={350}
                content={'Estas seguro de registrar informacion...?'}
            />
        );
    }
    storeData() {
        this.setState({
            loading: true,
        });
        let body = {
            numaccion: this.state.numaccion,
            operacion: this.state.operacion,
            formula: this.state.formula,
            valorporcentual: this.state.valorporcentual,
            descripcion: this.state.descripcion,
            idcuentaplan: this.state.idcuentaplan,
        };
        httpRequest('post', ws.wsconfigeerr + '/store', body)
        .then((result) => {
            console.log(result)
            if (result.response == 0) {
                notification.warning({
                    message: 'ALERTA',
                    description:
                        'EL CAMPO CODIGO DE ACCION YA EXISTE...',
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
                        'DATO REGISTRADO EXITOSAMENTE...',
                });

                this.props.history.goBack();
                this.setState({
                    loading: false,
                });
            } else if (result.response == -2) {
                notification.error({
                    message: 'Sesion',
                    description:
                        'Tiempo de sesion terminado. Favor de ingresar nuevamente',
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
                {this.componentBack()}
                {this.componentSubmit()}
                <div className="cards">
                    <div className="forms-groups">
                        <div className="pulls-left">
                            <h1 className="lbls-title">
                                NUEVO DEFINICION PARA ESTADO DE RESULTADO
                            </h1>
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <C_Input
                                title="Codigo Accion"
                                value={this.state.numaccion}
                                onChange={this.onChangeNumAccion.bind(this)}
                                permisions={this.permisions.codigoaccion}
                            />
                            <C_Select
                                value={this.state.operacion}
                                title={"Operacion"}
                                onChange={(value) => this.setState({operacion: value,}) }
                                component={this.componentOperacion()}
                                permisions={this.permisions.operacion}
                            />
                            <C_Input
                                title="Formula"
                                value={this.state.formula}
                                onChange={this.onChangeFormula.bind(this)}
                                permisions={this.permisions.formula}
                            />
                            <C_Input
                                title="Valor Porcentual"
                                value={this.state.valorporcentual}
                                onChange={this.onChangeValorPorcentual.bind(this)}
                                permisions={this.permisions.valorporcentual}
                            />
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='cols-lg-3 cols-md-3'></div>
                            <C_Input
                                title="Descripcion"
                                value={this.state.descripcion}
                                onChange={(value) => this.setState({descripcion: value,})}
                                permisions={this.permisions.descripcion}
                            />
                            <C_TreeSelect
                                allowClear={true}
                                title="Plan de Cuenta"
                                value={this.state.idcuentaplan}
                                treeData={this.state.tree_cuentaplan}
                                placeholder="Seleccione una opcion"
                                onChange={this.onChangeIDCuenta.bind(this)}
                                permisions={this.permisions.plandecuenta}
                            />
                        </div>
                        <div className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12'>
                            <div className='txts-center'>
                                <C_Button title='Cancelar'
                                    type='danger'
                                    onClick={this.onBack.bind(this)}
                                />
                                <C_Button title='Aceptar'
                                    type='primary'
                                    onClick={this.onValidar_data.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateCongifEERR);
