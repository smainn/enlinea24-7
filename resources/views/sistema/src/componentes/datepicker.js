
import React, { Component } from 'react';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import { readData } from '../utils/toolsStorage';
import keysStorage from '../utils/keysStorage';

export default class CDatePicker extends Component {
   
    constructor(props) {
        super(props);
    }

    onDisable() {
        return (this.props.permisions.editable != 'A' || this.props.readOnly) ? true : false;
    }

    verifiPrivilegios() {
        if (this.props.permisions.visible == 'A') {
            const value = (this.props.value == null || this.props.value == '') ? null : moment(this.props.value, this.props.format);
            const defaultValue = (this.props.defaultValue == null || this.props.defaultValue == '') ? null : moment(this.props.defaultValue, this.props.format);

            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            return (
                <div className="input-group-content">
                    <DatePicker
                        showToday={this.props.showToday}
                        format={this.props.format}
                        placeholder={this.props.placeholder}
                        mode={this.props.mode}
                        defaultValue={defaultValue}
                        value={value}
                        size={this.props.size}
                        allowClear={this.props.allowClear}
                        style={this.props.style}
                        showTime={this.props.showTime}
                        onChange={this.props.onChange}
                        disabled={this.onDisable()}     
                    />
                    <label className={`lbls-input active ${colors}`}>
                        {this.props.title}
                    </label>
                </div> 
            )
        } else {
            return null;
        }
    }

    render() {
        const CDatePicker = this.verifiPrivilegios();
        return (
            <>
            { CDatePicker }
            </>
        );
    }
    
}
 
CDatePicker.propTypes = {
    allowClear: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    showTime: PropTypes.bool,
    mode: PropTypes.string,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    showToday: PropTypes.bool,
    readOnly: PropTypes.bool,
    permisions: PropTypes.object
}

CDatePicker.defaultProps = {
    allowClear: true,
    style: {'width': '100%'},
    title: 'Fecha',
    showTime: false,
    mode: 'date',
    format: 'YYYY-MM-DD',
    showToday: true,
    readOnly: false,
    placeholder: 'Seleccionar Fecha',
    permisions: {
        visible: 'A',
        editable: 'A'
    }
}