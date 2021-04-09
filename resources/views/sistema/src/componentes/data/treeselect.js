
import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';

export default class C_TreeSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onDisable() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }
    showCheckedStrategy() {
        if (this.props.checked) {
            TreeSelect.SHOW_CHILD
        }else {
            TreeSelect.SHOW_PARENT
        }
    }
    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            const disabled = this.onDisable();
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
            return (
                <div className={this.props.className}>
                    <div className="inputs-groups">
                        <TreeSelect
                            allowClear={this.props.allowClear}
                            showSearch={this.props.showSearch}
                            style={this.props.style}
                            value={((this.props.value == '') || (this.props.value == null) || (typeof this.props.value == 'undefined'))?undefined:this.props.value}
                            dropdownStyle={this.props.dropdownStyle}
                            treeData={this.props.treeData}
                            placeholder={this.props.placeholder}
                            treeDefaultExpandAll={this.props.treeDefaultExpandAll}
                            onChange={this.props.onChange}
                            disabled={disabled}
                            showCheckedStrategy={this.showCheckedStrategy()}
                            treeCheckable={this.props.checked}
                        >
                            {this.props.listTreeNodes}
                        </TreeSelect>
                        {(this.props.title.toString().trim().length > 0)?
                            <label className={`lbls-input active ${colors}`}>
                                {this.props.title}
                            </label>:''
                        }
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

C_TreeSelect.propTypes = {
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
    configAllowed: PropTypes.bool,
    className: PropTypes.string,
    checked: PropTypes.bool,
}

C_TreeSelect.defaultProps = {
    title: '',
    value: undefined,
    placeholder: 'Seleccionar',
    readOnly: false,
    showSearch: false,
    allowClear: false,
    treeDefaultExpandAll: false,
    treeData: [],
    listTreeNodes: null,
    style:{
        width: '100%', minWidth: '100%'
    },
    dropdownStyle: {
        maxHeight: 400, 
        overflow: 'auto'
    },
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true,
    className: 'cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom',
    checked: false,
}