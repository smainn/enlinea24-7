
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';

import { Select } from 'antd';
import 'antd/dist/antd.css';
import { readData } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';
const {Option} = Select;

export default class  C_Caracteristica extends Component {
    constructor(props) {
        super(props);
        this.state = {   
        }
    }
    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
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
    onChangeInput(pos, event) {
        if (this.validar(this.props.onChangeInput)) {
            var objeto = {
                id: pos,
                value: event.target.value,
            }
            this.props.onChangeInput(objeto);
        }
    }
    deleteRow(index){
        if (this.validar(this.props.onDeleteRow)) {
            if (this.props.permisions.editable == 'A') {
                this.props.onDeleteRow(index);
            }
        }
    }
    disabled() {
        if (this.props.permisions.editable == 'A') {
            return false;
        }
        return true;
    }
    readOnly() {
        if (this.props.permisions.editable == 'A') {
            return false;
        }
        return true;
    }
    llenar() {
        
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        var array = []
        for (let i = 0; i < this.props.valuesSelect.length; i++) {
            array.push(
                <div key={i} className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12"
                    style={{'paddingRight': 0, 'paddingLeft': 0, 'display': 'flex'}}>
                    <div className="cols-lg-5 cols-md-5 cols-sm-5 cols-xs-12">
                        <Select value={this.props.valuesSelect[i]}
                            onChange={this.onChangeSelect.bind(this, i)}
                            disabled={this.disabled()}
                            style={{'width': '100%', 'minWidth': '100%'}}
                        >

                            <Option key={0} value={''}>{'Seleccionar'}</Option>

                            {this.props.data.map(
                                (item, key) => (
                                    <Option key={key} value={item.id}>{item.title}</Option>
                                )
                            )}
                        </Select>
                    </div>
                    <div className="cols-lg-6 cols-md-6 cols-sm-6 cols-xs-12">
                        <input value={this.props.valuesInput[i]} 
                            className={(this.props.permisions.editable == 'A')?
                                `forms-control ${colors}`:'forms-control cursor-not-allowed'
                            }
                            placeholder={(this.props.permisions.editable == 'A')?
                                '':'No habilitado'
                            }
                            onChange={this.onChangeInput.bind(this, i)}
                            readOnly={this.readOnly()}
                        />
                    </div>
                    <div className="cols-lg-1 cols-md-1 cols-sm-1 cols-xs-12" style={{paddingLeft: 0}}>
                        <button 
                            type="button"
                            style={{ padding: 3 }}
                            className={`btns btns-sm btns-danger ${colors}`} 
                            onClick={this.deleteRow.bind(this, i)}>
                                <i className="fa fa-times"></i>
                        </button>
                    </div>
                </div>
            );
        }
        return array;
    }
    onAddRow(event) {
        if (this.props.permisions.editable == 'A') {
            this.props.onAddRow(event);
        }
    }
    addRow() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        
        if (this.validar(this.props.onAddRow)) {
            return (
                <button type="button"
                    style={{'padding': '4px', 'marginRight': '0'}}
                    className={`btns btns-sm btns-primary ${colors} float-right`} 
                    onClick={this.onAddRow.bind(this)}>
                    <i className="fa fa-plus"></i>
                </button>
            );
        }
    }
    verificarPermisos() {
        if (this.props.permisions.visible == 'A') {
            const llenar = this.llenar();
            return (
                <div className={this.props.className}>
                    <div className="card" style={{ 'height':'265px' }}>
                        <div className="card-header">
                            <label style={{'padding': '2px', 'position': 'relative',
                                'color': '#5D6160', 'font': '500 17px Roboto', 'marginTop': '4px'}}>
                                { this.props.title }
                            </label>
                            {this.addRow()}
                        </div>
                        <div className="card-body" 
                            style={{ 
                                maxHeight: '265px', 
                                overflowY: 'auto',
                                padding: 8,
                            }}>
                            { llenar }
                        </div>
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
C_Caracteristica.propTypes = {
    title: PropTypes.string,
    optionDefault: PropTypes.string,
    valuesSelect: PropTypes.array,
    valuesInput: PropTypes.array,

    onAddRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onChangeSelect: PropTypes.func,
    onChangeInput: PropTypes.func,

    placeholderInput: PropTypes.string,
    data: PropTypes.array,
    permisions: PropTypes.object,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
}

C_Caracteristica.defaultProps = {
    onAddRow: undefined,
    onDeleteRow: undefined,
    onChangeInput: undefined,
    onChangeSelect: undefined,
    readOnly: false,
    data: [],
    valuesSelect:[],
    valuesInput: [],
    title: 'Caracteristicas',
    optionDefault: 'Seleccionar',
    placeholderinput: 'Escribir detalles . . .',
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    className: 'cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom',
}