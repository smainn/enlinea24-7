
import React, { Component } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../utils/toolsStorage';
import keysStorage from '../utils/keysStorage';

const {Option} = Select;

export default class CSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            className: ''
        }

        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    onDisable() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }

    title() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.props.title != '') {
            return (
                <label className={`lbls-input active ${colors}`}>
                    {this.props.title}
                </label>
            );
        }
        return null;
    }

    iconDelete() {
        if (this.props.allowDelete && this.props.value != undefined) {
            return (
                <i className="fa fa-times fa-times-content-2" onClick={this.props.onDelete} > </i>
            );
        }
        return null;
    }

    onFocus() {
        this.setState({
            className: this.props.className + ' select-all forms-control'
        })
    }

    onBlur() {
        this.setState({
            className: this.props.className + ' select-all'
        })
    }

    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            const disabled = this.onDisable();
            const title = this.title();
            const iconDelete = this.iconDelete();
            return (
                <div className="inputs-groups">
                    <Select
                        filterOption={this.props.filterOption}
                        defaultActiveFirstOption={this.props.defaultActiveFirstOption}
                        showArrow={this.props.showArrow}
                        showSearch={this.props.showSearch}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        style={this.props.style}
                        placeholder={this.props.placeholder}
                        onSearch={this.props.onSearch}
                        onChange={this.props.onChange}
                        notFoundContent={this.props.notFoundContent}
                        disabled={disabled}
                        //onFocus={this.onFocus}
                        //onBlur={this.onBlur}
                        //className='select-all'
                        //size="large"
                    >
                        {this.props.component}
                    </Select>

                    { iconDelete }

                    { title }
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

CSelect.propTypes = {
   title: PropTypes.string,
   //value: PropTypes.number,
   component: PropTypes.array,
   placeholder : PropTypes.string,
   showSearch: PropTypes.bool,
   defaultActiveFirstOption: PropTypes.bool,
   showArrow: PropTypes.bool,
   filterOption: PropTypes.bool,
   notFoundContent: PropTypes.string,
   readOnly: PropTypes.bool,
   allowDelete: PropTypes.bool,
   onDelete: PropTypes.func,
   configAllowed: PropTypes.bool,
}

CSelect.defaultProps = {
    title: '',
    value: undefined,
    placeholder: 'Seleccionar',
    component: null,
    notFoundContent: 'No hay resultados',
    readOnly: false,
    style:{
        width: '100%',
    },
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    allowDelete: false,
    configAllowed: true
}