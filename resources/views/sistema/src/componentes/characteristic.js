import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';

import { Select } from 'antd';
import 'antd/dist/antd.css';
import { readData } from '../utils/toolsStorage';
import keysStorage from '../utils/keysStorage';
const {Option} = Select;

export default class  CCharacteristic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
    }

    onChangeInput(pos, event) {
        
        if (this.validar(this.props.onChangeInput)) {
            var objeto = {
                id: pos,
                value: event.target.value,
            }
            this.props.onChangeInput(objeto);
        }
    }

    onChangeSelect(pos, event) {
        if (this.validar(this.props.onChangeSelect)) {
            var objeto = {
                id: pos,
                value: event,
            }
            this.props.onChangeSelect(objeto);
        }
    }
   
    llenar() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        var array = []
        for (let i = 0; i < this.props.valuesSelect.length; i++) {
            array.push(
                <div key={i} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                    <div className="cols-lg-5 cols-md-5 cols-sm-5">
                        <Select 
                            value={this.props.valuesSelect[i]}
                            onChange={this.onChangeSelect.bind(this, i)}
                            className="forms-control">
                            <Option key={0} value={''}>{this.props.optionDefault}</Option>
                            {this.props.data.map(
                                (item, key) => (
                                    <Option key={key} value={item.id}>{item.title}</Option>
                                )
                            )}
                        </Select>
                    </div>
                    <div className="cols-lg-6 cols-md-6 cols-sm-6">
                        <input
                            style={{marginLeft: -5}}
                            value={this.props.valuesInput[i]} 
                            className={`forms-control ${colors}`} 
                            placeholder={this.props.placeholderInput}
                            onChange={this.onChangeInput.bind(this, i)}
                        />
                    </div>
                    <div className="cols-lg-1 cols-md-1 cols-sm-1">
                        <button 
                            type="button"
                            style={{ padding: 4 }}
                            className="btns btns-sm btns-danger float-right" 
                            onClick={this.deleteRow.bind(this, i)}>
                                <i className="fa fa-times"></i>
                        </button>
                    </div>
                </div>
            );
        }
        return array;
    }
    
    deleteRow(index){
        this.props.onDeleteRow(index);
    }

    arrayDetalle(e){
        this.props.onArrayCaracteristica
    }

    verificarPermisos() {
        if (this.props.permisions.visible == 'A') {
            const llenar = this.llenar();
            return (
                <div className="card" style={{ 'height':'265px' }}>
                    <div className="card-header">
                        <label style={{'padding': '2px', 'position': 'relative',
                            'color': '#5D6160', 'font': '500 18px Roboto', 'marginTop': '4px'}}>
                            { this.props.title }
                        </label>
                        <button 
                            type="button"
                            style={{'padding': '4px', 'marginRight': '12px'}}
                            className="btns btns-sm btns-primary float-right" 
                            onClick={this.props.onAddRow}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                    <div 
                        className="card-body" 
                        style={{ 
                            maxHeight: '265px', 
                            overflowY: 'auto',
                            padding: 10
                        }}>
                        { llenar }
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const verificarPermisos = this.verificarPermisos();
        return (
            <>
                { verificarPermisos }
            </>
        );
    }
}

CCharacteristic.propTypes = {
    title: PropTypes.string,
    optionDefault: PropTypes.string,
    valuesSelect: PropTypes.array,
    valuesInput: PropTypes.array,
    onChangeSelect: PropTypes.func,
    onChangeInput: PropTypes.func,
    placeholderInput: PropTypes.string,
    data: PropTypes.array,
    permisions: PropTypes.object
}

CCharacteristic.defaultProps = {
    data: [],
    valuesSelect:[],
    valuesInput: [],
    title: 'Caracteristicas',
    optionDefault: 'Seleccionar',
    placeholderinput: 'Escribir detalles . . .',
    permisions: {
        visible: 'A',
        editable: 'A'
    }
}