
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from 'react-router-dom';
import {message, Modal, Icon, Spin} from 'antd';
import Input from '../../../components/input';
import Select from '../../../components/select';

import "antd/dist/antd.css";
import { httpRequest, removeAllData } from '../../../tools/toolsStorage';
import routes from '../../../tools/routes';
import { readPermisions } from '../../../tools/toolsPermisions';
import keys from '../../../tools/keys';
import C_Button from '../../../components/data/button';
import Confirmation from '../../../components/confirmation';

export default class CrearComisionVenta extends Component{

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            loading: false,

            validacionDescripcion: 1,
            validacionValor: 1,

            nro: 0,

            descripcion: '',
            valor: 0,
            tipo: 'N',
            noSesion: false
        }

        this.permisions = {
            descripcion: readPermisions(keys.comision_input_descripcion),
            porcentaje: readPermisions(keys.comision_input_porcentaje)
        }
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
      
    }

    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
            validacionDescripcion: 1,
        });
    }

    onChangeValor(event) {
        if (!isNaN(event)) {
            if (event.toString().length > 0) {
                
                if (event[0] == 0) {
                    var nro = event.substring(1, event.length);
                    if ((nro > 0) && (nro <= 100)){
                        this.setState({
                            valor: nro,
                            validacionValor: 1,
                        });
                    }
                }else {
                    if ((event > 0) && (event <= 100)) {
                        this.setState({
                            valor: event,
                            validacionValor: 1,
                        });
                    }
                }
                
            }else {
                this.setState({
                    valor: 0,
                });
            }
        }
    }

    onChangeTipo(event) {
        this.setState({
            tipo: event,
        });
    }

    onClickCancelar() {
        this.setState({
            redirect: true,
            loading: false,
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.validar()) {
            this.setState({
                visible: true,
            });
        }
    }

    redirect() {
        this.setState({redirect: true});
    }

    showCancelConfirm() {
        const redirect = this.redirect;
        Modal.confirm({
            title: '¿Esta seguro de cancelar el registro de la nueva comision?',
            content: 'Nota: Todo dato ingresado se perdera! ¿Desea continuar?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() { 
                console.log('OK');
                redirect();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onSubmitGuardarDatos() {
        
        let body = {
            descripcion: this.state.descripcion,
            valor: this.state.valor,
            tipo: this.state.tipo
        };
        this.setState({
            loading: true,
        });

        httpRequest('post', '/commerce/api/comision/post', body)
        .then(
            result => {
                if (result.response == 1) {
                    this.onClickCancelar();
                } else if (result.response == -2) {
                    this.setState({ noSesion: true})
                } else {
                    console.log(result);
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    validar() {
        if (this.state.descripcion.toString().length > 0 && this.state.valor > 0) {
            return true;
        }
        if (this.state.descripcion.toString().length <= 0) {
            this.setState({
                validacionDescripcion: 0,
            });
        }
        if (this.state.valor <= 0) {
            this.setState({
                validacionValor: 0,
            });
        }
        message.error('No se permite campo vacio');
        

        return false;
    }
    onClickCerrarModal() {
        this.setState({
            visible: false,
            loading: false,
        });
    }

    showConfirmation() {
        return (
            <Confirmation
                title='Guardar Comision'
                visible={this.state.visible}
                width={350}
                loading={this.state.loading}
                content={<div className="txts-center">
                            Estas seguro de guardar los cambio?
                        </div>
                    }
                onCancel={this.onClickCerrarModal.bind(this)}
                onClick={this.onSubmitGuardarDatos.bind(this)}
            />
        );
    }

    render(){

        if (this.state.noSesion) {
            removeAllData();
            return (<Redirect to={routes.inicio} />);
        }
        if (this.state.redirect) {
            return (<Redirect to="/commerce/admin/comision/index" />);
        }
        const showConfirmation = this.showConfirmation();
        return (
            <div className="rows">
                
                {showConfirmation}
                <div className="cards">

                    <div className="pulls-left">
                        <h1 className="lbls-title">Nueva comision de Ventas</h1>
                    </div>


                    <div className="forms-groups">

                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                            <div className="cols-lg-1 cols-md-1 cols-sm-1"></div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">

                                <Input 
                                    value={this.state.descripcion}
                                    title='Descripcion*'
                                    onChange={this.onChangeDescripcion.bind(this)}
                                    validar={this.state.validacionDescripcion}
                                    permisions={this.permisions.descripcion}
                                />
                            </div>
                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                                <Input 
                                    value={this.state.valor}
                                    title='Porcentaje*'
                                    onChange={this.onChangeValor.bind(this)}
                                    validar={this.state.validacionValor}
                                    permisions={this.permisions.porcentaje}
                                />
                            </div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3">
                                <Select 
                                    value={this.state.tipo}
                                    title='Tipo*'
                                    onChange={this.onChangeTipo.bind(this)}
                                    data={[
                                        {value: 'N', title: 'Ninguno'},
                                        {value: 'V', title: 'Venta'},
                                        {value: 'G', title: 'Ganancia'},
                                        {value: 'F', title: 'Fijo'},
                                        {value: 'O', title: 'Otros'}
                                    ]}
                                />
                            </div>
                        
                        </div>
                    </div>

                    <div className="forms-groups">

                        <div className="txts-center">
                            
                            <C_Button
                                title='Guardar'
                                type='primary'
                                onClick={this.onSubmit.bind(this)}
                            />
                            <C_Button
                                title='Cancelar'
                                type='danger'
                                onClick={this.showCancelConfirm.bind(this)}
                            />
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



