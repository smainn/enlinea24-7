
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { readData } from '../../tools/toolsStorage';
import keysStorage from '../../tools/keysStorage';
import { Tooltip } from 'antd';
import 'antd/dist/antd.css';

export default class C_CheckBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    validar(data) {
        return ((typeof data != 'undefined') && (data != null));
    }

    title() {
        var title = this.props.tooltip;
        if ((title == null) || (typeof title == 'undefined') || (title == '')) {
            return null
        }
        return (
            <span>{this.props.tooltip}</span>
        );
    }

    verificarPermisos() {
        if (this.props.permisions.visible == 'A') {
            var colors = readData(keysStorage.colors);
            colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
            return(
                <Tooltip placement={this.props.placement} 
                    title={this.title()}
                >
                    <label className="checkboxContainer" style={this.props.style}>
                        <input type="checkbox"
                            onChange={this.props.onChange}
                            checked={this.props.checked}
                            disabled={this.props.disabled}
                        />
                        <span className={`checkmark danger ${colors}`}>
                            {
                                (this.props.title == '')?null:
                                    <label style={{marginLeft: 30}}>
                                        {this.props.title}
                                    </label>   
                            }  
                        </span>
                    </label>
                </Tooltip>
            )
        }
        return null;
    }

    render() {
        const verificarPermisos = this.verificarPermisos();
        return (
            <>
                { verificarPermisos }
            </>
        )
    }
}

C_CheckBox.propTypes = {
    style: PropTypes.object,
    permisions: PropTypes.object,
    tooltip: PropTypes.string,
    placement: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.any,
    disabled: PropTypes.bool,
    title: PropTypes.string,
}

C_CheckBox.defaultProps = {
    style: {},
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    tooltip: '',
    placement: 'bottom',
    onChange: undefined,
    checked: null,
    disabled: false,
    title: '',
}