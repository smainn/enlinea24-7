
import React, { Component } from 'react';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import { readData } from '../../tools/toolsStorage';
import keysStorage from '../../tools/keysStorage';

export default class C_DatePicker extends Component {
   
    constructor(props) {
        super(props);
    }
    onChange(date, dateString) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(dateString);
        }
    }
    onDisable() {
        return (this.props.permisions.editable != 'A' || this.props.readOnly) ? true : false;
    }
    verifiPrivilegios() {
        if (this.props.permisions.visible == 'A') {
            var value = this.props.value;
            value = ((typeof value == 'undefined') || (value == '') || (value == null)) ? 
                null : moment(value, this.props.format);

            var defaultValue = this.props.defaultValue;
            defaultValue = ((defaultValue == null) || (defaultValue == '') || (typeof defaultValue == 'undefined')) ? 
                null : moment(defaultValue, this.props.format);

            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

            return (
                <div className={this.props.className}>
                    <div className="inputs-groups">
                        <DatePicker
                            showToday={this.props.showToday}
                            format={this.props.format}
                            placeholder={this.props.placeholder}
                            mode={this.props.mode}
                            defaultValue={defaultValue}
                            value={value}
                            //size={this.props.size}
                            allowClear={this.props.allowClear}
                            style={this.props.style}
                            showTime={this.props.showTime}
                            onChange={this.onChange.bind(this)}
                            disabled={this.onDisable()}
                        />
                        <label className={`lbls-input active ${colors}`}>
                            {this.props.title}
                        </label>
                    </div>
                </div>
            )
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
C_DatePicker.propTypes = {
    allowClear: PropTypes.bool,
    onChange: PropTypes.func,
    size: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    showTime: PropTypes.bool,
    mode: PropTypes.string,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    showToday: PropTypes.bool,
    readOnly: PropTypes.bool,
    permisions: PropTypes.object,
    value: PropTypes.any,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
}

C_DatePicker.defaultProps = {
    allowClear: true,
    style: {'width': '100%', 'minWidth': '100%'},
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
    },
    value: '',
    defaultValue: '',
    onChange: undefined,
    className: 'cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom',
}