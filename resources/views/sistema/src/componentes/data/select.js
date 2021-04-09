
import React, { Component } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';

const {Option} = Select;

export default class C_Select extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    iconDelete() {
        if (this.props.allowDelete && this.props.value != undefined) {
            return (
                <i className="fa fa-times fa-times-content-2" onClick={this.props.onDelete}> </i>
            );
        }
        return null;
    }
    onDisable() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }
    title() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.props.title.toString().trim().length > 0) {
            return (
                <label className={`lbls-input active ${colors}`}>
                    {this.props.title}
                </label>
            );
        }
        return null;
    }
    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            const disabled = this.onDisable();
            const title = this.title();
            const iconDelete = this.iconDelete();
            return (
                <div className={this.props.className}>
                    <div className="inputs-groups">
                        <Select
                            filterOption={this.props.filterOption}
                            defaultActiveFirstOption={this.props.defaultActiveFirstOption}
                            showArrow={this.props.showArrow}
                            showSearch={this.props.showSearch}
                            value={((this.props.value == '') || (this.props.value == null) || (typeof this.props.value == 'undefined'))?undefined:this.props.value}
                            onChange={this.props.onChange}
                            style={this.props.style}
                            placeholder={this.props.placeholder}
                            onSearch={this.props.onSearch}
                            onChange={this.props.onChange}
                            notFoundContent={this.props.notFoundContent}
                            disabled={disabled}
                            allowDelete={this.props.allowDelete}
                        >
                            {this.props.component}
                        </Select>
                        { iconDelete }
                        { title }
                    </div>
                </div>
            );
        }
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
C_Select.propTypes = {
    title: PropTypes.string,
    value: PropTypes.any,
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
    className: PropTypes.string,
 }
 
 C_Select.defaultProps = {
    allowDelete: false,
    title: '',
    value: undefined,
    placeholder: 'Seleccionar',
    component: null,
    notFoundContent: 'No hay resultados',
    readOnly: false,
    style:{
        width: '100%', minWidth: '100%',
    },
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    allowDelete: false,
    configAllowed: true,
    className: 'cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom',
    showSearch: false,
 }