
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import C_Input from '../../componentes/data/input';
import C_Button from '../../componentes/data/button';

import { message } from 'antd';
import "antd/dist/antd.css"; 
import C_TreeSelect from '../../componentes/data/treeselect';

export default class Editar_CuentaAsienAutom extends Component{

    constructor(props) {
        super(props);
        this.state = {
            idcuentaplan: this.props.first_data.idcuentaplan, 
            codcuenta: this.props.first_data.codcuenta,
            nombrecuenta: this.props.first_data.nombrecuenta, 
            valor: this.props.first_data.valor,
        }
    }
    onchangeValor(value) {
        if (value == '') {
            this.setState({valor: 0,});
            return;
        }
        if (isNaN(value)) return;
        if (value * 1 >= 0) {
            var data = value.split('.');
            if (data.length > 1) {
                if (data[1].length > 2) return;
            }
            this.setState({valor: value, });
        }
    }
    onChangeIDcuenta(value, label, extra) {
        if (typeof value == 'undefined') {
            this.setState({
                idcuentaplan: null,
                codcuenta: null,
                nombrecuenta: null,
            });
            return;
        }
        if (this.props.numniveles == extra.triggerNode.props.nivel) {
            this.setState({
                idcuentaplan: extra.triggerNode.props.idcuentaplan,
                codcuenta: extra.triggerNode.props.codcuenta,
                nombrecuenta: extra.triggerNode.props.nombrecuenta,
            });
        }else {
            message.warning(`Debe seleccionar una cuenta del nivel ${this.props.numniveles}`);
        }
        
    }
    onSubmit() {
        var data = {
            idcuentaplan: this.state.idcuentaplan, valor: this.state.valor,
            codcuenta: this.state.codcuenta, nombrecuenta: this.state.nombrecuenta,
        };
        this.props.onSubmit(data);
    }
    render(){

        return (
            <div className="rows" style={{position: 'relative', marginTop: -20,}}>
                <div className="forms-groups">
                    <C_TreeSelect
                        showSearch={true}
                        allowClear={true}
                        title='Codigo Cuenta'
                        value={this.state.codcuenta}
                        treeData={this.props.tree_cuenta}
                        onChange={this.onChangeIDcuenta.bind(this)}
                        placeholder='Seleccione una opcion'
                        className='cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom'
                    />
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Nombre Cuenta'
                        value={this.state.nombrecuenta}
                        readOnly={true}
                    />
                    <C_Input 
                        className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 pt-bottom"
                        title='Valor'
                        value={this.state.valor}
                        onChange={this.onchangeValor.bind(this)}
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
                            onClick={this.props.onCancel}
                        />
                    }
                </div>
            </div>
        );
    }
}

Editar_CuentaAsienAutom.propTypes = {
    first_data: PropTypes.object,
    tree_cuenta: PropTypes.array,
    numniveles: PropTypes.number,
}

Editar_CuentaAsienAutom.defaultProps = {
    first_data: {
        idcuentaplan: null, codcuenta: null,
        nombrecuenta: null, valor: null,
    },
    tree_cuenta: [],
    numniveles: -1,
}

