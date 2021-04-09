
import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../tools/toolsStorage';
import keysStorage from '../tools/keysStorage';

export default class CTreeSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onDisable() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }

    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            const disabled = this.onDisable();
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
            return (
                <div className="inputs-groups">
                    <TreeSelect
                        allowClear={this.props.allowClear}
                        showSearch={this.props.showSearch}
                        style={this.props.style}
                        value={this.props.value}
                        dropdownStyle={this.props.dropdownStyle}
                        treeData={this.props.treeData}
                        placeholder={this.props.placeholder}
                        treeDefaultExpandAll={this.props.treeDefaultExpandAll}
                        onChange={this.props.onChange}
                        disabled={disabled}
                    >
                        {this.props.listTreeNodes}
                    </TreeSelect>
                
                    <label className={`lbls-input active ${colors}`}>
                        {this.props.title}
                    </label>
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

CTreeSelect.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    dropdownStyle: PropTypes.object,
    treeData: PropTypes.array,
    readOnly: PropTypes.bool,
    showSearch: PropTypes.bool,
    allowClear: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    listTreeNodes: PropTypes.array,
    onChange: PropTypes.func,
    configAllowed: PropTypes.bool
}

CTreeSelect.defaultProps = {
    title: '',
    value: undefined,
    placeholder: 'Seleccionar',
    readOnly: false,
    showSearch: false,
    allowClear: false,
    treeDefaultExpandAll: false,
    listTreeNodes: null,
    style:{
        width: '100%'
    },
    dropdownStyle: {
        maxHeight: 400, 
        overflow: 'auto'
    },
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true

}