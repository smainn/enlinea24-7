
import React, { Component } from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

export default class CButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }

        this.onClick = this.onClick.bind(this);
    }

    validar(data) {
        return typeof data != undefined && typeof data != null;
    }

    value() {
        if (this.validar(this.props.value)) {
            
            if (this.props.value.toString().length > 0){
                this.state.focusInput = false;
            }
            return this.props.value;
        }
        return '';
    }
    onClick() {
        if (this.props.permisions.editable == 'A') {
            this.props.onClick();
        }
    }    

    verificarPermisos() {
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            return(
                <button
                    type="button"
                    className={this.props.className}
                    onClick={this.onClick}
                >
                    {this.props.title}
                </button>
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

CButton.propTypes = {
    style: PropTypes.object,
    permisions: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    configAllowed: PropTypes.bool
}

CButton.defaultProps = {
    
    style: {},
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    className: '',
    title: '',
    configAllowed: true
}