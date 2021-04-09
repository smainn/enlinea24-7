
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';

import { message } from 'antd';
import "antd/dist/antd.css"; 

export default class Crear_Tipo_Centro_Costo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            descripcion: '' + this.props.first_data.descripcion,
            nombreinterno: '' + this.props.first_data.nombreinterno,

            validar_descripcion: 1,
            validar_nombreinterno: 1,
        }
    }
    onChangeDescripcion(event) {
        this.setState({
            descripcion: event,
            validar_descripcion: 1,
        });
    }
    onChangeNombreInterno(event) {
        this.setState({
            nombreinterno: event,
            validar_nombreinterno: 1,
        });
    }
    onCancel(event) {
        this.setState({
            nombreinterno: '',
            descripcion: '',

            validar_descripcion: 1,
            validar_nombreinterno: 1,
        });

        if (typeof this.props.onCancel != 'undefined') {
            this.props.onCancel(event);
        }
    }
    onSubmit(event) {
        event.preventDefault();
        if ((this.state.nombreinterno.toString().trim().length > 0) &&
            (this.state.descripcion.toString().trim().length > 0)
        ) {
            let body = {
                nombreinterno: this.state.nombreinterno,
                descripcion: this.state.descripcion,
                id: this.props.first_data.id,
            };
            if (typeof this.props.onSubmit != 'undefined') {
                this.props.onSubmit(body);
            }

        }else {
            if (this.state.nombreinterno.toString().trim().length == 0) {
                this.setState({
                    nombreinterno: '',
                    validar_nombreinterno: 0,
                });
            }
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
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre Interno'
                        value={this.state.nombreinterno}
                        onChange={this.onChangeNombreInterno.bind(this)}
                        validar={this.state.validar_nombreinterno}
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

Crear_Tipo_Centro_Costo.propTypes = {
    style: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    first_data: PropTypes.object,
    readOnly: PropTypes.bool,
    onTextCancel: PropTypes.string,
    onTextSubmit: PropTypes.string,
}

Crear_Tipo_Centro_Costo.defaultProps = {
    style: {},
    onCancel: undefined,
    onSubmit: undefined,
    first_data: {
        id: null,
        descripcion: '',
        nombreinterno: '',
    },
    readOnly: false,
    onTextCancel: 'Cancelar',
    onTextSubmit: 'Aceptar'
}

