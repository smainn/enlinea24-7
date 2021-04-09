
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';

import { message } from 'antd';
import "antd/dist/antd.css"; 

export default class Crear_Banco extends Component{

    constructor(props) {
        super(props);
        this.state = {
            nombre: '' + this.props.first_banco.nombre,
            cuenta: '' + this.props.first_banco.cuenta,

            validar_nombre: 1,
            validar_cuenta: 1,
        }
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event,
            validar_nombre: 1,
        });
    }
    onChangeCuenta(event) {
        this.setState({
            cuenta: event,
            validar_cuenta: 1,
        });
    }
    onCancel(event) {

        this.setState({
            nombre: '',
            cuenta: '',

            validar_cuenta: 1,
            validar_nombre: 1,
        });

        if (typeof this.props.onCancel != 'undefined') {
            this.props.onCancel(event);
        }
    }
    onSubmit(event) {
        event.preventDefault();
        if ((this.state.nombre.toString().trim().length > 0)
        ) {
            let body = {
                nombre: this.state.nombre,
                cuenta: this.state.cuenta,
                idbanco: this.props.idbanco,
                id: this.props.first_banco.id,
            };
            if (typeof this.props.onSubmit != 'undefined') {
                
                this.setState({
                    nombre: '',
                    cuenta: '',
        
                    validar_cuenta: 1,
                    validar_nombre: 1,
                });

                this.props.onSubmit(body);

            }
        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    nombre: '',
                    validar_nombre: 0,
                });
            }
            message.error('Favor de llenar campo!!!');
        }
    }
    render(){

        return (
            <div className="rows">
                <div className="forms-groups">
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.nombre}
                        onChange={this.onChangeNombre.bind(this)}
                        validar={this.state.validar_nombre}
                        readOnly={this.props.readOnly}
                    />
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Cuenta'
                        value={this.state.cuenta}
                        onChange={this.onChangeCuenta.bind(this)}
                        validar={this.state.validar_cuenta}
                        readOnly={this.props.readOnly}
                    />
                </div>
                <div className="forms-groups" style={{textAlign: 'right',}}>
                    {(typeof this.props.onSubmit == 'undefined')?
                        null:
                        <C_Button
                            title={'Aceptar'}
                            type='danger'
                            onClick={this.onSubmit.bind(this)}
                        />
                    }
                    {(typeof this.props.onCancel == 'undefined')?
                        null:
                        <C_Button
                            title={'Cancelar'}
                            type='primary'
                            onClick={this.onCancel.bind(this)}
                        />
                    }
                </div>
            </div>
        );
    }
}

Crear_Banco.propTypes = {
    style: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    first_banco: PropTypes.object,
    idbanco: PropTypes.number,
    readOnly: PropTypes.bool,
}

Crear_Banco.defaultProps = {
    style: {},
    onCancel: undefined,
    onSubmit: undefined,
    idbanco: null,
    first_banco: {
        nombre: '',
        cuenta: '',
        id: null,
    },
    readOnly: false,
}

