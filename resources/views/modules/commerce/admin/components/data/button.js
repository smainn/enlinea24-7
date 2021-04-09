
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../../tools/toolsStorage';
import keysStorage from '../../tools/keysStorage';

export default class C_Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.onClick = this.onClick.bind(this);
    }

    validar(data) {
        return ((typeof data != 'undefined') && (data != null));
    }

    onClick(event) {
        if (this.props.permisions.editable == 'A') {
            if (this.validar(this.props.onClick)) {
                this.props.onClick(event);
            }
        }
    } 
    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        var type = this.props.type;
        var size = this.props.size;
        if ((type == 'primary') || (type == 'danger')) {
            if (size == 'small') {
                return `btns btns-sm btns-${type} ${colors}`;
            }
            return `btns btns-${type} ${colors}`;
        }
        if (size == 'small') {
            return `btns btns-sm btns-primary ${colors}`;
        }
        return `btns btns-primary ${colors}`;
    }

    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            return(
                //<div className={this.props.className}>
                    <button
                        type={(this.props.submit)?'submit':'button'}
                        className={this.className()}
                        onClick={this.onClick}
                        disabled={this.props.disabled}
                        style={this.props.style}
                    >
                        {this.props.title}
                    </button>
                //</div>
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

C_Button.propTypes = {
    style: PropTypes.object,
    permisions: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.any,
    onClick: PropTypes.func,
    configAllowed: PropTypes.bool,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    submit: PropTypes.bool,
}

C_Button.defaultProps = {
    
    style: {},
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    className: '',
    type: 'primary',
    title: '',
    onClick: undefined,
    configAllowed: true,
    size: 'normal',
    disabled: false,
    submit: false,
}