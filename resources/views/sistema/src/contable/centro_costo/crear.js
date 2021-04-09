
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';

import { message, Select } from 'antd';
import "antd/dist/antd.css"; 
import { timeout } from 'q';
import ws from '../../utils/webservices';
import { httpRequest } from '../../utils/toolsStorage';
import C_Select from '../../componentes/data/select';

const { Option } = Select;

export default class Crear_Centro_Costo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            codigo: '' + this.props.first_data.codigo,
            nombre: '' + this.props.first_data.nombre,
            idcentrocostotipo: '',

            array_tipocosto: [],

            validar_codigo: 1,
            validar_nombre: 1,
            validar_idtipocosto: 1,
        }
    }
    componentDidMount() {
        this.get_data();
    }
    get_data() {
        httpRequest('get', ws.wscentrocosto + '/get_tipo_costo').then(
            response => {
                if (response.response == 1) {
                    this.setState({
                        array_tipocosto: response.data,
                        idcentrocostotipo: (this.props.first_data.idcentrocostotipo == null)?
                                '':this.props.first_data.idcentrocostotipo,
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
    onChangeCodigo(event) {
        this.setState({
            codigo: event,
            validar_codigo: 1,
        });
    }
    onChangeNombre(event) {
        this.setState({
            nombre: event,
            validar_nombre: 1,
        });
    }
    onChangeIDCentroCostotTipo(event) {
        this.setState({
            idcentrocostotipo: event,
            validar_idtipocosto: 1,
        });
    }
    onCancel(event) {
        setTimeout(() => {
            if (typeof this.props.onCancel != 'undefined') {
                this.props.onCancel(event);
            }
        }, 300);
    }
    onSubmit(event) {
        event.preventDefault();
        if ((this.state.nombre.toString().trim().length > 0) &&
            (this.state.codigo.toString().trim().length > 0) &&
            (this.state.idcentrocostotipo.toString().trim().length > 0)
        ) {
            let body = {
                nombre: this.state.nombre,
                codigo: this.state.codigo,
                id: this.props.first_data.id,
                id_padre: this.props.first_data.id_padre,
                idcentrocostotipo: this.state.idcentrocostotipo,
            };
            if (typeof this.props.onSubmit != 'undefined') {
                this.props.onSubmit(body);
            }

        }else {
            if (this.state.nombre.toString().trim().length == 0) {
                this.setState({
                    nombre: '',
                    validar_nombre: 0,
                });
            }
            if (this.state.codigo.toString().trim().length == 0) {
                this.setState({
                    codigo: '',
                    validar_codigo: 0,
                });
            }
            if (this.state.idcentrocostotipo.toString().trim().length == 0) {
                this.setState({
                    idcentrocostotipo: '',
                    validar_idtipocosto: 0,
                });
            }
            message.error('Favor de llenar campo!!!');
        }
    }
    componentTipoCosto() {
        var array = [];
        this.state.array_tipocosto.map(
            (data, key) => {
                array.push(
                    <Option key={key} value={data.idcentrocostotipo}>
                        {data.descripcion}
                    </Option>
                );
            }
        );
        return array;
    }
    render(){

        return (
            <div className="rows">
                <div className="forms-groups">
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Codigo'
                        value={this.state.codigo}
                        onChange={this.onChangeCodigo.bind(this)}
                        validar={this.state.validar_codigo}
                        readOnly={this.props.readOnly.codigo}
                    />
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre'
                        value={this.state.nombre}
                        onChange={this.onChangeNombre.bind(this)}
                        validar={this.state.validar_nombre}
                        readOnly={this.props.readOnly.nombre}
                    />
                    <C_Select
                        title='Tipo Centro Costo'
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        value={(this.state.idcentrocostotipo == '')?
                                undefined:this.state.idcentrocostotipo
                        }
                        onChange={this.onChangeIDCentroCostotTipo.bind(this)}
                        component={this.componentTipoCosto()}
                        readOnly={this.props.readOnly.tipo}
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

Crear_Centro_Costo.propTypes = {
    style: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    first_data: PropTypes.object,
    readOnly: PropTypes.bool,
    onTextCancel: PropTypes.string,
    onTextSubmit: PropTypes.string,
    readOnly: PropTypes.object,
}

Crear_Centro_Costo.defaultProps = {
    readOnly: {
        nombre: false,
        codigo: false,
        tipo: false,
    },
    style: {},
    onCancel: undefined,
    onSubmit: undefined,
    first_data: {
        id: null,
        id_padre: null,
        idcentrocostotipo: null,
        codigo: '',
        nombre: '',
    },
    readOnly: false,
    onTextCancel: 'Cancelar',
    onTextSubmit: 'Aceptar'
}

