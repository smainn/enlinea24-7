
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';

import PropTypes from 'prop-types';
import { readData } from '../../../../tools/toolsStorage';
import keysStorage from '../../../../tools/keysStorage';

export default class MenuItem extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    validar(data) {
        return (typeof data == 'undefined' || data == null) ? false : true;
    }

    onClick(event) {
        event.preventDefault();
        
        if (this.props.permisions.editable == 'A') {
            this.props.onLink(event);
        }
        
    }

    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            if (this.props.data[index].value) {
                return `${colors} active`
            }
        }
        return `${colors}`;
    }

    onFocusLink(event) {
        event.preventDefault();

        if (this.validar(this.props.onClick)) {

            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            this.props.data.map(value =>{
                if (value.key != this.props.keys) {
                    value.value = false;
                }
            });
            this.props.data[index].value = true;
            this.props.onClick(this.props.data);
        }
        
    }

    validarPermisos() {
        const className = this.className();

        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            return (
                <li onClick={this.onFocusLink.bind(this)}>
                    <a className={className} href="#" style={{'fontSize': 13,}}
                        onClick={this.onClick.bind(this)}>
                        <span>{this.props.title}</span>
                    </a>
                </li>
            );
        }
        return null;
    
    }

    render() {
        const validarPermisos = this.validarPermisos();
        return (
               <>
                    { validarPermisos }
               </>
        );
    }
}

MenuItem.propTypes = {
    title: PropTypes.string,
    onLink: PropTypes.func.isRequired,
    permisions: PropTypes.object,
    configAllowed: PropTypes.bool,
    keys: PropTypes.string,
    data: PropTypes.array,
}

MenuItem.defaultProps = {
    title: 'Caso Uso',
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true,
    keys: '',
    data: []
}


