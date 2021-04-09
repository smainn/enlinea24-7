
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { message } from 'antd';
import "antd/dist/antd.css"; 
import C_Input from '../../../componentes/data/input';
import C_Button from '../../../componentes/data/button';

export default class Crear_Cliente_Tipo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            descripcion: '' + this.props.first_data.descripcion,
            validar_descripcion: 1,
        }
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
            validar_descripcion: 1,
        });
    }
    onCancel(event) {
        if (typeof this.props.onCancel != 'undefined') {
            this.props.onCancel(event);
        }
    }
    onSubmit(event) {
        event.preventDefault();
        if (this.state.descripcion.toString().trim().length > 0) {
            let body = {
                descripcion: this.state.descripcion,
                id: this.props.first_data.id,
            };
            if (typeof this.props.onSubmit != 'undefined') {
                this.props.onSubmit(body);
            }

        }else {
            if (this.state.descripcion.toString().trim().length == 0) {
                this.setState({
                    descripcion: '',
                    validar_descripcion: 0,
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
                        title='Descripcion'
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion.bind(this)}
                        validar={this.state.validar_descripcion}
                        readOnly={this.props.readOnly}
                    />
                </div>
                <div className="forms-groups" style={{textAlign: 'right',}}>
                    {(typeof this.props.onSubmit == 'undefined')?
                        null:
                        <C_Button
                            title={this.props.onTextSubmit}
                            type='danger'
                            onClick={this.onSubmit.bind(this)}
                        />
                    }
                    {(typeof this.props.onCancel == 'undefined')?
                        null:
                        <C_Button
                            title={this.props.onTextCancel}
                            type='primary'
                            onClick={this.onCancel.bind(this)}
                        />
                    }
                </div>
            </div>
        );
    }
}

Crear_Cliente_Tipo.propTypes = {
    style: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    first_data: PropTypes.object,
    readOnly: PropTypes.bool,
    onTextCancel: PropTypes.string,
    onTextSubmit: PropTypes.string,
}

Crear_Cliente_Tipo.defaultProps = {
    style: {},
    onCancel: undefined,
    onSubmit: undefined,
    first_data: {
        id: null,
        descripcion: '',
    },
    readOnly: false,
    onTextCancel: 'Cancelar',
    onTextSubmit: 'Aceptar'
}

