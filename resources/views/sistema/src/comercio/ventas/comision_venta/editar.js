
import React, { Component } from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import {message, Select} from 'antd';

import "antd/dist/antd.css";
import { httpRequest, removeAllData } from '../../../utils/toolsStorage';
import routes from '../../../utils/routes';
import { readPermisions } from '../../../utils/toolsPermisions';
import keys from '../../../utils/keys';
import C_Button from '../../../componentes/data/button';
import Confirmation from '../../../componentes/confirmation';
import ws from '../../../utils/webservices';
import strings from '../../../utils/strings';
import C_Input from '../../../componentes/data/input';
import C_Select from '../../../componentes/data/select';

const {Option} = Select;

class EditarComisionVenta extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            bandera: 0,

            descripcion: '',
            valor: 0,
            tipo: 'V',

            validar_descripcion: 1,
            validar_valor: 1,

            noSesion: false
        }
        this.permisions = {
            descripcion: readPermisions(keys.comision_input_descripcion),
            porcentaje: readPermisions(keys.comision_input_porcentaje)
        }
    }
    componentDidMount() {
        httpRequest('get', ws.wscomisionactualizar + '/' + this.props.match.params.id)
        .then(
            result => {
                if (result.response == 1) {
                    this.setState({
                        descripcion: result.data.descripcion,
                        valor: result.data.valor,
                        tipo: result.data.tipo,
                    });
                } else if (result.response == -2) {
                    this.setState({ noSesion: true });
                } else {
                    message.error('Ocurrio un problema en el servidor');
                }
            }
        ).catch(error => {
            console.log(error);
            message.error(strings.message_error);
        });
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
            validar_descripcion: 1,
        });
    }
    onChangeValor(event) {
        if (!isNaN(event)) {
            if (event.toString().length > 0) {
                if ((event > 0) && (event <= 100)) {
                    this.setState({
                        valor: parseInt(event),
                        validar_valor: 1,
                    });
                }
            }else {
                this.setState({
                    valor: 0,
                    validar_valor: 1,
                });
            }
        }
    }
    onChangeTipo(event) {
        this.setState({
            tipo: event,
        });
    }
    onSubmit(event) {
        event.preventDefault();
        if (this.state.descripcion.toString().trim().length > 0 && this.state.valor > 0) {
            this.setState({
                visible: true,
                bandera: 1,
            });
        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.state.validar_descripcion = 0;
            }
            if (this.state.valor < 1) {
                this.state.validar_valor = 0;
            }
            this.setState({
                validar_descripcion: this.state.validar_descripcion,
                validar_valor: this.state.validar_valor,
            });
            message.error('Favor de llenar campos!!!');
        }
    }
    onClose() {
        this.setState({
            visible: false,
            loading: false,
            bandera: 0,            
        })
    }
    onSalir() {
       this.setState({
           loading: true,
       });
       setTimeout(() => {
            this.props.history.goBack();
       }, 400);
    }
    onSubmitData() {
        let body = {
            descripcion: this.state.descripcion,
            valor: this.state.valor,
            tipo: this.state.tipo,
            id: this.props.match.params.id,
        };
        this.setState({
            loading: true,
        });
        httpRequest('post', ws.wscomisionupdate, body)
        .then(
            result => {
                if (result.response == 1) {
                    this.props.history.goBack();
                } else if (result.response == -2) {
                    this.setState({ noSesion: true});
                } else {
                    message.error('Ocurrio un problema en el servidor');
                }
            }
        ).catch(error => {
            console.log(error);            
            message.error(strings.message_error);
        });
    }
    componenetOption() {
        if (this.state.bandera == 1) {
            return (
                <Confirmation
                    title='Guardar Comision'
                    visible={this.state.visible}
                    width={350}
                    loading={this.state.loading}
                    content={
                        <div className="txts-center">
                            Estas seguro de guardar los cambio?
                        </div>
                    }
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSubmitData.bind(this)}
                />
            );
        }
        if (this.state.bandera == 2) {
            return (
                <Confirmation
                    visible={this.state.visible}
                    title="Cancelar Crear Comision"
                    loading={this.state.loading}
                    onCancel={this.onClose.bind(this)}
                    onClick={this.onSalir.bind(this)}
                    width={400}
                    content = {[
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12" key={0}>
                            <label>
                                ¿Esta seguro de cancelar el registro de la comision?
                                Los datos introducidos se perderan.
                            </label>
                        </div>
                    ]}
                />
            );
        } 
    }
    render(){
        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />);
        }
        return (
            <div className="rows">
                {this.componenetOption()}
                <div className="cards">
                    <div className="pulls-left">
                        <h1 className="lbls-title">Editar comision de Ventas</h1>
                    </div>
                    <div className="forms-groups">
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1 cols-sm-1"></div>
                            <C_Input 
                                value={this.state.descripcion}
                                title='Descripcion*'
                                onChange={this.onChangeDescripcion.bind(this)}
                                validar={this.state.validar_descripcion}
                                permisions={this.permisions.descripcion}
                            />
                            <C_Input 
                                value={this.state.valor}
                                title='Porcentaje*'
                                onChange={this.onChangeValor.bind(this)}
                                validar={this.state.validar_valor}
                                permisions={this.permisions.porcentaje}
                                style={{ textAlign: 'right', paddingRight: 18 }}
                            />
                            <C_Select 
                                value={this.state.tipo}
                                title='Tipo*'
                                onChange={this.onChangeTipo.bind(this)}
                                component={[
                                    <Option key={1} value="V">Venta</Option>,
                                    <Option key={2} value="G">Ganancia</Option>,
                                    <Option key={3} value="F">Fijo</Option>,
                                    <Option key={4} value="O">Otros</Option>,
                                ]}
                            />
                        </div>
                    </div>
                    <div className="forms-groups">
                        <div className="txts-center">
                            <C_Button title='Guardar' type='primary'
                                onClick={this.onSubmit.bind(this)}
                            />
                            <C_Button title='Cancelar' type='danger'
                                onClick={() => this.setState({ visible: true, bandera: 2, })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditarComisionVenta);
